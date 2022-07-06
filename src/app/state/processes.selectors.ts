import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IoQueueState } from "./io-queue/io-queue.reducer";
import { ProcessManagementState } from "./processes/process-management.reducer";
import { TimeBasedScheduler } from "../core/cpu/scheduler/scheduling-algorithm";

export const selectIoQueue = createFeatureSelector<IoQueueState>('ioQueue');

export const selectProcessManagement = createFeatureSelector<ProcessManagementState>('processManagement');

export const selectProcesses = createSelector(
  selectProcessManagement,
  (state) => state.processes
);

export const selectReadyProcesses = createSelector(
  selectProcesses,
  (processes) => processes.filter(p => p.state === 'READY')
);

export const selectHasReadyProcesses = createSelector(
  selectProcesses,
  (processes) => processes.some(p => p.state === 'READY')
);

export const selectScheduledProcess = createSelector(
  selectProcessManagement,
  (state) => state.scheduled
);

export const selectShallExecute = createSelector(
  selectProcessManagement,
  (state) => !state.preempt
);

export const selectIsPreemptive = createSelector(
  selectProcessManagement,
  (state) => {
    return state.scheduler instanceof TimeBasedScheduler ? state.scheduler.timeSlice : null
  }
);

export const allProcessesFinished = createSelector(
  selectProcessManagement,
  (state) => state.processes.every(p => p.state === 'DONE')
);

export const finishedIoRequest = createSelector(
  selectIoQueue,
  (state) => state.progress >= 1
);

export const shallHandleIoRequest = createSelector(
  selectIoQueue,
  (state) => state.executing == null && state.processes.length > 0
);

export const selectIoQueueProgress = createSelector(
  selectIoQueue,
  (state) => state.progress
);

export const selectIoCurrent = createSelector(
  selectIoQueue,
  (state) => state.executing
);
