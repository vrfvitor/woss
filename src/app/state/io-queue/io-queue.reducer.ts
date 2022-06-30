import { createReducer, on } from "@ngrx/store";
import { addToIoQueue, completeIoRequest, handleIoRequestOfHeadProcess, reportIoProgress } from "./io-queue.actions";
import Process from "../../core/process/process";

export interface IoQueueState {
  processes: Process[]
  executing: Process | null
  progress: number
}

export const initialState: IoQueueState = {
  processes: [],
  executing: null,
  progress: 0
}

export const ioQueueReducer = createReducer(
  initialState,

  on(addToIoQueue, (state, {process}) => ({...state, processes: [...state.processes, process]})),

  on(handleIoRequestOfHeadProcess, (state) => ({...state, executing: state.processes[0]})),

  on(reportIoProgress, (state) => {
    if (state.progress >= 1) return state
    return {...state, progress: state.progress + 0.2}
  }),

  on(completeIoRequest, (state) => (
    {...initialState, processes: state.processes.filter(a => a.pid != state.executing!.pid)}
  )),
);
