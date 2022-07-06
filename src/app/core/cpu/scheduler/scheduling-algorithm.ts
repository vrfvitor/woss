import { ProcessManagementState } from "../../../state/processes/process-management.reducer";
import Process from "../../process/process";

export abstract class SchedulingAlgorithm {

  addProcess(state: ProcessManagementState, process: Process): ProcessManagementState {
    return {...state, processes: [...state.processes, process]}
  }

  toReadyState(state: ProcessManagementState, pid: number): ProcessManagementState {
    return state;
  }

  toExecutingState(state: ProcessManagementState, pid: number): ProcessManagementState {
    return state;
  }
}

export class TimeBasedScheduler extends SchedulingAlgorithm {
  constructor(public timeSlice: number) {
    super();
  }
}
