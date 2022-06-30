import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import Process from "../../core/process/process";
import System from "../../core/system/system";
import { Store } from "@ngrx/store";
import { selectIoQueueProgress, selectProcesses } from "../../state/processes.selectors";

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
    this.ioProgress$ = this.store.select(selectIoQueueProgress)
  }

  onStart() {
    console.log("System Started")
    new System(this.store)
  }
}
