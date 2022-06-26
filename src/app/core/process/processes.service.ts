import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from "rxjs";
import Process from "./process";

const PROCS: Process[] = [
  {
    pid: 2134,
    pc: 0,
    name: 'web-app',
    amountInstrucs: 5,
    bound: 'IO',
    colorHex: '#A00',
    dateCreation: new Date(),
    state: "READY",
  },
  {
    pid: 2135,
    name: 'browser',
    amountInstrucs: 5,
    bound: 'CPU',
    colorHex: '#0A0',
    dateCreation: new Date(),
    state: "READY",
    pc: 0
  },
  {
    pid: 2136,
    name: 'tx-editor',
    amountInstrucs: 5,
    bound: 'IO',
    colorHex: '#00A',
    dateCreation: new Date(),
    state: "READY",
    pc: 0
  }
]

@Injectable({
  providedIn: 'root'
})
export class ProcessesService {

  private processes$ = new BehaviorSubject(PROCS)

  getProcesses(): Observable<Process[]> {
    return this.processes$;
  }

  getReadyProcesses(): Observable<Process[]> {
    return this.processes$
    .pipe(
      map((processes) => processes.filter(p => p.state === 'READY')));
  }

  thereAreReadyProcesses() {
    return this.processes$.value.find((p) => p.state === 'READY')
  }

  toState(process: Process, state: string): void { // @ts-ignore
    process.state = state
    this.updateProcess(process)
  }

  incrementCounter(process: Process) {
    process!.pc += 1
    this.updateProcess(process)
  }

  updateProcess = (process: Process) => {
    const ps = this.processes$.value
    ps[ps.findIndex(p => p.pid === process.pid)] = process
    this.processes$.next(ps)
  }

  isFinished() {
    return this.processes$.value.every(p => p.state === 'DONE')
  }

}
