import { createAction, props } from '@ngrx/store';
import Process from "../../core/process/process";
import { SchedulingAlgorithm } from "../../core/cpu/scheduler/scheduling-algorithm";

export const addProcess = createAction(
  '[Process Component] Add Process',
  props<{ process: Process }>()
);

export const setupSchedulingAlgo = createAction(
  '[System Config - GUI] Setup Scheduling Algo',
  props<{ scheduler: SchedulingAlgorithm }>()
);

export const incrementCounter = createAction(
  '[CPU] Increment Counter',
  props<{ pid: number }>()
);

export const toExecutingState = createAction(
  '[CPU] Set To State Executing',
  props<{ pid: number }>()
);

export const toReadyState = createAction(
  '[System] Set State To Ready',
  props<{ pid: number }>()
);

export const scheduleNextProcess = createAction(
  '[System] Schedule Next Process'
);

export const stopExecution = createAction(
  '[Scheduling Algo] Stop Execution'
);

export const processLeftExecution = createAction(
  '[Scheduling Algo] Setup Execution To Continue'
);

export const toWaitingState = createAction(
  '[CPU] Set State To Waiting',
  props<{ pid: number }>()
);

export const toDoneState = createAction(
  '[CPU] Set State To Done',
  props<{ pid: number }>()
);
