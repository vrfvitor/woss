import { createAction, props } from '@ngrx/store';
import Process from "../../core/process/process";

export const addToIoQueue = createAction(
  '[CPU] Add Process',
  props<{ process: Process }>()
);

export const handleIoRequestOfHeadProcess = createAction(
  '[System - I/O Subsystem] Handle I/O Request',
);

export const reportIoProgress = createAction(
  '[System - I/O Subsystem] Report Process',
);

export const completeIoRequest = createAction(
  '[System - I/O Subsystem] Complete I/O Request'
);

