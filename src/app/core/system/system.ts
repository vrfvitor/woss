import { FIFO } from "../cpu/scheduler/fifo";
import { CPU } from "../cpu/cpu";
import Process from "../process/process";
import { ProcessesService } from "../process/processes.service";
import { IoProcessesService } from "../process/io-processes.service";
import { SchedulingAlgorithm } from "../cpu/scheduler/scheduling-algorithm";

export default class System {

  processes!: Process[];
  isExecuting = true;

  schedulingAlgo!: SchedulingAlgorithm;
  cpu!: CPU;

  constructor(
    private processesService: ProcessesService,
    private ioProcessesService: IoProcessesService,
  ) {
    this.schedulingAlgo = new FIFO()
    this.cpu = new CPU(this.processesService, 200)
    this.init()
  }

  async init() {
    while (this.isExecuting) {
      const nextProcess = await this.scheduleNextProcess();
      await this.cpu.execute(nextProcess, this.ioProcessesService);
    }
  }

  async scheduleNextProcess() {
    do {
      this.processesService.getReadyProcesses()
      .subscribe(processes => this.processes = processes)
      .unsubscribe()

      if (!this.processes.length) {
        await this.watchForReadyProcess()
      }
    } while (!this.processes.length)

    return this.schedulingAlgo.next(this.processes)
  }

  watchForReadyProcess = async () => await new Promise(r => setTimeout(r, this.cpu.clock));

}
