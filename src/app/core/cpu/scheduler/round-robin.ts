import { TimeBasedScheduler } from "./scheduling-algorithm";
import { ProcessManagementState } from "../../../state/processes/process-management.reducer";

export class RoundRobin extends TimeBasedScheduler {

  constructor(timeSlice: number) {
    super(timeSlice);
  }

  override toReadyState(state: ProcessManagementState, pid: number): ProcessManagementState {
    const processes = state.processes

    const arrived = processes.splice(processes.findIndex(p => p.pid == pid), 1)
    processes.push(...arrived)

    return {...state, processes}
  }

  override toExecutingState(state: ProcessManagementState, pid: number): ProcessManagementState {
    return super.toExecutingState(state, pid);
  }
}
