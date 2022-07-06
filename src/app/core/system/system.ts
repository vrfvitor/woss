import { CPU } from "../cpu/cpu";
import Process from "../process/process";
import { Store } from "@ngrx/store";
import {
  allProcessesFinished,
  finishedIoRequest,
  selectHasReadyProcesses,
  selectIoCurrent,
  selectScheduledProcess,
  shallHandleIoRequest
} from "../../state/processes.selectors";
import {
  completeIoRequest,
  handleIoRequestOfHeadProcess,
  reportIoProgress
} from "../../state/io-queue/io-queue.actions";
import { scheduleNextProcess, toReadyState } from "../../state/processes/process-management.actions";
import { filter, firstValueFrom } from "rxjs";

export default class System {

  processes!: Process[];
  isExecuting = true;

  cpu!: CPU;
  defaultIoTime: number = 500;

  constructor(private store: Store) {
    console.log("System Started")
    this.cpu = new CPU(this.store, 1000)
    this.store.select(allProcessesFinished).subscribe(allDone => this.isExecuting = !allDone)
    this.initIoSubsystem()
    this.init()
  }

  async init() {
    while (this.isExecuting) {
      await this.timerOf(200)
      const nextProcess = await this.scheduleNextProcess()
      await this.cpu.execute(nextProcess!)
    }
  }

  async scheduleNextProcess() {
    await firstValueFrom(this.store.select(selectHasReadyProcesses).pipe(filter(r => r)))
    this.store.dispatch(scheduleNextProcess());
    return await firstValueFrom(this.store.select(selectScheduledProcess).pipe(filter(p => !!p)))
  }

  initIoSubsystem() {
    this.store.select(shallHandleIoRequest)
      .subscribe(ifSo => ifSo && this.handleIoCall())
  }

  async handleIoCall() {
    const process = await this.beginDataTransferForDequeuedProcess();
    while (!await this.ioDataTransferComplete()) {
      await this.timerOf(this.defaultIoTime * process!.bound.delayFactor)
      this.store.dispatch(reportIoProgress())
    }
    this.completeIoRequest(process);
  }

  private async beginDataTransferForDequeuedProcess() {
    this.store.dispatch(handleIoRequestOfHeadProcess())
    return await firstValueFrom(this.store.select(selectIoCurrent).pipe(filter(p => !!p)))
  }

  private ioDataTransferComplete() {
    return firstValueFrom(this.store.select(finishedIoRequest));
  }

  private completeIoRequest(process: Process | null) {
    this.store.dispatch(toReadyState({pid: process!.pid}))
    this.store.dispatch(completeIoRequest())
  }

  watchForReadyProcess = () => this.timerOf(this.cpu.clock * 1.5);

  timerOf = async (timeMs: number) => await new Promise(r => setTimeout(r, timeMs));

}
