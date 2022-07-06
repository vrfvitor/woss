import { TimeBasedScheduler } from "./scheduling-algorithm";
import { ProcessManagementState } from "../../../state/processes/process-management.reducer";
import Process from "../../process/process";

export class PreemptivePriority extends TimeBasedScheduler {

  constructor(maxExecTime: number) {
    super(maxExecTime);
  }

  override addProcess(state: ProcessManagementState, process: Process): ProcessManagementState {
    const updatedState = super.addProcess(state, process);
    const processes = updatedState.processes;

    return {...state, processes: processes.sort((a, b) => b.priority - a.priority)}
  }

}
