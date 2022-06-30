import * as Process from "process";
import { IoQueueState } from "./io-queue/io-queue.reducer";

export interface AppState {
  processes: typeof Process[];
  ioQueue: IoQueueState;
}
