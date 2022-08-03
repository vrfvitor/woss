import { Component, Input, OnInit } from '@angular/core';
import { delayWhen, interval, Observable, of } from "rxjs";
import { IoQueueState } from "../../../state/io-queue/io-queue.reducer";
import Process from "../../../core/process/process";
import { ProcessManagementState } from "../../../state/processes/process-management.reducer";
import { Store } from "@ngrx/store";
import { selectIoQueue, selectProcessManagement } from "../../../state/processes.selectors";

@Component({
  selector: 'app-cpu-section',
  templateUrl: './cpu-section.component.html',
  styleUrls: ['./cpu-section.component.scss']
})
export class CpuSectionComponent implements OnInit {

  ioProgress = 0
  ioQueue: Process[] = [];
  ioExecuting!: Process | null;

  processes: Process[] = [];
  executing!: Process | null;

  @Input() ioQueue$!: Observable<IoQueueState>;
  @Input() readyProcesses$!: Observable<ProcessManagementState>;
  @Input() executing$!: Observable<Process>;
  @Input() store!: Store;

  constructor() {
  }

  ngOnInit(): void {
    this.store.select(selectIoQueue)
    .pipe(
      delayWhen(val => val.progress == 0 && this.ioProgress == 100 ? interval(200) : of(undefined))
    )
    .subscribe(a => {
        this.ioProgress = 100 * a.progress
        this.ioQueue = a.processes.filter(p => p.pid != a.executing?.pid)
        this.ioExecuting = a.executing
      }
    )

    this.store.select(selectProcessManagement).subscribe(c => {
      this.processes = c.processes.filter(p => p.pid != c.scheduled?.pid && p.state == 'READY')
      this.executing = c.processes.filter(p => p.state == 'EXECUTING')[0]
    })
  }

  groupByPriority(n: number) {
    return this.processes.filter(p => p.priority == n)
  }
}
