import { Component, OnInit } from '@angular/core';
import { map, Observable } from "rxjs";
import Process from "../../core/process/process";
import System from "../../core/system/system";
import { Store } from "@ngrx/store";
import { selectIoQueueProgress, selectProcesses } from "../../state/processes.selectors";
import BoundType from "../../core/process/bound-type";
import { addProcess, setupSchedulingAlgo } from "../../state/processes/process-management.actions";
import { PreemptivePriority } from "../../core/cpu/scheduler/preemptive-priority";

const byDate = (a: Process, b: Process) => (a.pid - b.pid)

export const PROCESSES: Process[] = [
  {
    pid: 2134,
    pc: 0,
    name: 'web-app',
    amountInstructs: 5,
    bound: BoundType.IO_TAPE,
    colorHex: '#A00',
    dateCreation: new Date(),
    state: "READY",
    priority: 3
  },
  {
    pid: 2135,
    name: 'browser',
    amountInstructs: 5,
    bound: BoundType.CPU,
    colorHex: '#0A0',
    dateCreation: new Date(),
    state: "READY",
    pc: 0,
    priority: 1
  },
  {
    pid: 2136,
    name: 'tx-editor',
    amountInstructs: 5,
    bound: BoundType.CPU,
    colorHex: '#00A',
    dateCreation: new Date(),
    state: "READY",
    pc: 0,
    priority: 2
  },
  {
    pid: 2137,
    name: 'IDE',
    amountInstructs: 5,
    bound: BoundType.CPU,
    colorHex: '#5AA',
    dateCreation: new Date(),
    state: "READY",
    pc: 0,
    priority: 2
  }
];

@Component({
  selector: 'app-simulation-page',
  templateUrl: './simulation-page.component.html',
  styleUrls: ['./simulation-page.component.scss']
})
export class SimulationPageComponent implements OnInit {

  processes$!: Observable<Process[]>
  ioProgress$!: Observable<number>

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.processes$ = this.store.select(selectProcesses)
      .pipe(map(pcs => [...pcs].sort(byDate)))
    this.ioProgress$ = this.store.select(selectIoQueueProgress)
    this.store.dispatch(setupSchedulingAlgo({scheduler: new PreemptivePriority(2000)}))
    PROCESSES.forEach(p => this.store.dispatch(addProcess({process: p})))
  }

  onStart() {
    new System(this.store)
  }
}
