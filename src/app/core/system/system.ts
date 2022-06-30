import { FIFO } from "../cpu/scheduler/fifo";
import { CPU } from "../cpu/cpu";
import Process from "../process/process";
import { SchedulingAlgorithm } from "../cpu/scheduler/scheduling-algorithm";
import { Store } from "@ngrx/store";
import {
  allProcessesFinished,
  finishedIoRequest,
  selectReadyProcesses,
  shallHandleIoRequest
} from "../../state/processes.selectors";
import {
  completeIoRequest,
  handleIoRequestOfHeadProcess,
  reportIoProgress
} from "../../state/io-queue/io-queue.actions";
import { toReadyState } from "../../state/processes/processes.actions";

export default class System {

  processes!: Process[];
  isExecuting = true;

  schedulingAlgo!: SchedulingAlgorithm;
  cpu!: CPU;
  ioDelayTime: number = 500;

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
    this.store.dispatch(handleIoRequestOfHeadProcess())
    let finishedHandling = ''
    while (!finishedHandling) {
      this.store.select(finishedIoRequest).subscribe(s => finishedHandling = s).unsubscribe();
      this.store.dispatch(reportIoProgress())
      await this.timerOf(this.ioDelayTime)
    }
    this.store.dispatch(toReadyState({pid: parseInt(finishedHandling)}))
    this.store.dispatch(completeIoRequest())
  }

  watchForReadyProcess = () => this.timerOf(this.cpu.clock * 1.5);
  timerOf = async (timeMs: number) => await new Promise(r => setTimeout(r, timeMs));

}
