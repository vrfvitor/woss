import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IoQueueState } from "./io-queue/io-queue.reducer";
import Process from "../core/process/process";

export const selectIoQueue = createFeatureSelector<IoQueueState>('ioQueue');

export const selectProcesses = createFeatureSelector<Process[]>('processes');

export const selectReadyProcesses = createSelector(
  selectProcesses,
  (state) => state.filter(p => p.state === 'READY')
);

export const allProcessesFinished = createSelector(
  selectProcesses,
  (state) => state.every(p => p.state === 'DONE')
);

export const finishedIoRequest = createSelector(
  selectIoQueue,
  (state) => state.progress >= 1 ? state.executing!.pid.toString() : ''
);

export const shallHandleIoRequest = createSelector(
  selectIoQueue,
  (state) => state.executing == null && state.processes.length > 0
);

export const selectIoQueueProgress = createSelector(
  selectIoQueue,
  (state) => state.progress
);

