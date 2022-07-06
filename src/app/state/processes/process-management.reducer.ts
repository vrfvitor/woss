import { createReducer, on } from "@ngrx/store";
import Process from "../../core/process/process";
import {
  addProcess,
  incrementCounter,
  processLeftExecution,
  scheduleNextProcess, setupSchedulingAlgo,
  stopExecution,
  toDoneState,
  toExecutingState,
  toReadyState,
  toWaitingState
} from "./process-management.actions";
import { SchedulingAlgorithm } from "../../core/cpu/scheduler/scheduling-algorithm";
import { FIFO } from "../../core/cpu/scheduler/fifo";


export interface ProcessManagementState {
  scheduler: SchedulingAlgorithm;
  scheduled: Process | null; // readyOnly
  processes: Process[];
  preempt: boolean;
}

export const initialState: ProcessManagementState = {
  scheduler: new FIFO(),
  scheduled: null,
  processes: [],
  preempt: false
};

export const processManagementReducer = createReducer(
  initialState,

  on(setupSchedulingAlgo, (state, {scheduler}) => ({...state, scheduler })),

  on(addProcess, (state, {process}) => state.scheduler.addProcess(state, process)),

  on(scheduleNextProcess, (state) => {
    const readyOnes = state.processes.filter(p => p.state === 'READY')
    return {...state, scheduled: readyOnes[0]}
  }),

  on(stopExecution, (state) => ({...state, preempt: true})),

  on(processLeftExecution, (state) => ({...state, preempt: false})),

  on(incrementCounter, (state, {pid}) =>
    ({...state, processes: state.processes.map(p => p.pid === pid ? {...p, pc: p.pc + 1} : p)})
  ),

  on(toExecutingState, (state, {pid}) => {
    const updatedState = toProcessState(state, pid, 'EXECUTING')
    return state.scheduler.toExecutingState(updatedState, pid)
  }),

  on(toReadyState, (state, {pid}) => {
    const updatedState = toProcessState(state, pid, 'READY')
    return state.scheduler.toReadyState(updatedState, pid)
  }),

  on(toWaitingState, (state, {pid}) => {
    const updatedState = toProcessState(state, pid, 'IO')
    return state.scheduler.toReadyState(updatedState, pid);
  }),

  on(toDoneState, (state, {pid}) => toProcessState(state, pid, 'DONE')),
);

const toProcessState = (state: ProcessManagementState, pid: number, pState: 'READY' | 'IO' | 'EXECUTING' | 'DONE') => {
  return ({...state, processes: state.processes.map(p => p.pid === pid ? {...p, state: pState} : p)})
}
