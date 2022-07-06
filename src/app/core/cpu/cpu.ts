import Process from "../process/process";
import { Store } from "@ngrx/store";
import {
  incrementCounter, processLeftExecution,
  toDoneState,
  toExecutingState, toReadyState,
  toWaitingState
} from "../../state/processes/process-management.actions";
import { addToIoQueue } from "../../state/io-queue/io-queue.actions";
import BoundType from "../process/bound-type";
import { selectShallExecute } from "../../state/processes.selectors";

export class CPU {

  clock: number
  timeSlice?: number
  shallExecute = true

  constructor(private store: Store, clock: number = 250, timeSlice?: number) {
    this.clock = clock
    this.timeSlice = timeSlice
    this.store.select(selectShallExecute)
      .subscribe(r => this.shallExecute = r)
  }

  async execute(process: Process) {
    process = this.setToExecutingState(process);

    do {
      await this.executeGivenInstructionOf(process);

      if (this.isFinished(process)) {
        this.store.dispatch(toDoneState({pid: process.pid}))
        return
      }

      if (process.bound !== BoundType.CPU) {
        this.sendToIoQueue(process);
        return
      }

    } while (this.shallExecute)

    this.store.dispatch(toReadyState({pid: process.pid}))
    this.store.dispatch(processLeftExecution());
  }

  private sendToIoQueue(process: Process) {
    this.store.dispatch(toWaitingState({pid: process.pid}));
    this.store.dispatch(addToIoQueue({process}));
  }

  private setToExecutingState(process: Process) {
    process = {...process}
    this.store.dispatch(toExecutingState({pid: process.pid}))
    return process;
  }

  private async executeGivenInstructionOf(process: Process) {
    await new Promise(r => setTimeout(r, this.clock));
    this.store.dispatch(incrementCounter({pid: process.pid}))
    process.pc++;
  }

  isFinished(proc: Process) {
    return proc.pc === proc.amountInstructs
  }

}
