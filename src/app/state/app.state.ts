import { IoQueueState } from "./io-queue/io-queue.reducer";
import { ProcessManagementState } from "./processes/process-management.reducer";

export interface AppState {
  processesManagement: ProcessManagementState;
  ioQueue: IoQueueState;
}
