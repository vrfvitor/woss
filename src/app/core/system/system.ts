import { FIFO } from "../cpu/scheduler/fifo";
import { CPU } from "../cpu/cpu";
import Process from "../process/process";
import { SchedulingAlgorithm } from "../cpu/scheduler/scheduling-algorithm";
import { Store } from "@ngrx/store";
import {
  allProcessesFinished,
  finishedIoRequest,
  selectIoCurrent,
  selectReadyProcesses,
  shallHandleIoRequest
} from "../../state/processes.selectors";
import {
  completeIoRequest,
  handleIoRequestOfHeadProcess,
  reportIoProgress
} from "../../state/io-queue/io-queue.actions";
import { toReadyState } from "../../state/processes/processes.actions";
import { filter, firstValueFrom } from "rxjs";

export default class System {

  processes!: Process[];
  isExecuting = true;

  schedulingAlgo!: SchedulingAlgorithm;
  cpu!: CPU;
  defaultIoTime: number = 500;

  constructor(
    private store: Store
  ) {
    this.schedulingAlgo = new FIFO()
    this.cpu = new CPU(this.store, 1000)
    this.store.select(allProcessesFinished).subscribe(allDone => this.isExecuting = !allDone);
    this.initIoSubsystem()
    this.init()
  }

  async init() {
    while (this.isExecuting) {
      const nextProcess = await this.scheduleNextProcess()
      await this.cpu.execute(nextProcess)
    }
  }

  async scheduleNextProcess() {
    do {
      this.store.select(selectReadyProcesses)
      .subscribe(processes => this.processes = processes)
      .unsubscribe()
      if (!this.processes.length) await this.watchForReadyProcess()
    } while (!this.processes.length)

    return this.schedulingAlgo.next(this.processes)
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
