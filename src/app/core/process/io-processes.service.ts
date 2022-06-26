import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import Process from "./process";
import { ProcessesService } from "./processes.service";

@Injectable({
  providedIn: 'root'
})
export class IoProcessesService {

  private processes$ = new BehaviorSubject<Process[]>([])
  private executing$ = new BehaviorSubject<Process | null>(null)
  private progress$ = new BehaviorSubject<number>(0)

  constructor(private processesService: ProcessesService) {
    this.watchProcesses();
  }

  addProcess(process: Process) {
    this.processes$.next([...this.processes$.value, process])
  }

  async watchProcesses() {
    while (this.isExecuting) {
      await this.pause(200)
      if (this.processes$.value.length && !this.executing) await this.handleIoCall();
    }
  }

  async handleIoCall() {
    const process = this.processes$.value[0]
    this.executing$.next(process);
    while (this.progress$.value != 5) {
      await this.pause(500)
      this.progress$.next(this.progress$.value + 1)
    }
    this.takeProcessBackToReady();
  }

  takeProcessBackToReady() {
    this.processesService.toState(this.executing as Process, "READY")
    this.processes$.next(this.processes$.value.filter(p => p.pid !== this.executing?.pid))
    this.executing$.next(null)
    this.progress$.next(0)
  }

  get executing() {
    return this.executing$.value
  }

  getProgress(): Observable<number> {
    return this.progress$
  }

  get isExecuting() {
    return !this.processesService.isFinished()
  }

  pause = async (timeMs: number) => await new Promise(r => setTimeout(r, timeMs));

}
