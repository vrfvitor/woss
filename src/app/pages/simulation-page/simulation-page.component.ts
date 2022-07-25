import { Component, OnInit, TemplateRef } from '@angular/core';
import { map, Observable } from "rxjs";
import Process from "../../core/process/process";
import System from "../../core/system/system";
import { Store } from "@ngrx/store";
import { selectIoQueueProgress, selectProcesses } from "../../state/processes.selectors";
import BoundType from "../../core/process/bound-type";
import { addProcess, setupSchedulingAlgo } from "../../state/processes/process-management.actions";
import { PreemptivePriority } from "../../core/cpu/scheduler/preemptive-priority";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FIFO } from "../../core/cpu/scheduler/fifo";
import { RoundRobin } from "../../core/cpu/scheduler/round-robin";

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
    colorHex: '#f44336',
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
  modalRef!: BsModalRef
  settingsForm!: FormGroup

  constructor(
    private store: Store,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.processes$ = this.store.select(selectProcesses)
      .pipe(map(pcs => [...pcs].sort(byDate)))
    this.ioProgress$ = this.store.select(selectIoQueueProgress)
    this.settingsForm = this.formBuilder.group({
      schedulingAlgo: ['fifo', Validators.required]
    })
  }

  onStart() {
    PROCESSES.forEach(p => this.store.dispatch(addProcess({process: p})))
    new System(this.store)
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.modalRef.onHide?.subscribe(() => {
      const algo = this.settingsForm.value.schedulingAlgo

      const map = new Map()
      map.set('fifo', new FIFO());
      map.set('roundRobin', new RoundRobin(2000));
      map.set('preemptivePriority', new PreemptivePriority(2000));

      this.store.dispatch(setupSchedulingAlgo({scheduler: map.get(algo)}))
    })
  }
}
