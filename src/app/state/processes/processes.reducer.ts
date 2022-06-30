import { createReducer, on } from "@ngrx/store";
import Process from "../../core/process/process";
import {
  addProcess,
  incrementCounter,
  toDoneState,
  toExecutingState,
  toReadyState,
  toWaitingState
} from "./processes.actions";
import BoundType from "../../core/process/bound-type";

export const initialState: Process[] = [
  {
    pid: 2134,
    pc: 0,
    name: 'web-app',
    amountInstructs: 5,
    bound: BoundType.IO_DISC,
    colorHex: '#A00',
    dateCreation: new Date(),
    state: "READY",
  },
  {
    pid: 2135,
    name: 'browser',
    amountInstructs: 5,
    bound: BoundType.IO_TAPE,
    colorHex: '#0A0',
    dateCreation: new Date(),
    state: "READY",
    pc: 0
  },
  {
    pid: 2136,
    name: 'tx-editor',
    amountInstructs: 5,
    bound: BoundType.IO_TERMINAL,
    colorHex: '#00A',
    dateCreation: new Date(),
    state: "READY",
    pc: 0
  }
];

export const processesReducer = createReducer(
  initialState,

  on(addProcess, (state, { process }) => [...state, process]),

  on(incrementCounter, (state, { pid }) => state.map(p => p.pid === pid ? {...p, pc: p.pc + 1} : p)),

  on(toExecutingState, (state, { pid }) => toProcessState(state, pid, 'EXECUTING')),

  on(toReadyState, (state, { pid }) => toProcessState(state, pid, 'READY')),

  on(toWaitingState, (state, { pid }) => toProcessState(state, pid,  'IO')),

  on(toDoneState, (state, { pid }) => toProcessState(state, pid,  'DONE')),
);

const toProcessState = (processes: Process[], pid: number, pState: 'READY' | 'IO' | 'EXECUTING' | 'DONE') => {
  return processes.map(p => p.pid === pid ? {...p, state: pState} : p)
}
