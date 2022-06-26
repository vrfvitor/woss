import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import Process from "../../core/process/process";
import { ProcessesService } from "../../core/process/processes.service";
import { IoProcessesService } from "../../core/process/io-processes.service";
import System from "../../core/system/system";

@Component({
  selector: 'app-simulation-page',
  templateUrl: './simulation-page.component.html',
  styleUrls: ['./simulation-page.component.scss']
})
export class SimulationPageComponent implements OnInit {

  processes$!: Observable<Process[]>
  ioProgress$!: Observable<number>

  constructor(
    private processesService: ProcessesService,
    private ioProcessesService: IoProcessesService
  ) {
  }

  ngOnInit(): void {
    this.processes$ = this.processesService.getProcesses()
    this.ioProgress$ = this.ioProcessesService.getProgress()
  }

  onStart() {
    new System(this.processesService, this.ioProcessesService)
  }
}
