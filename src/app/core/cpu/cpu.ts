import Process from "../process/process";
import { ProcessesService } from "../process/processes.service";
import { IoProcessesService } from "../process/io-processes.service";

export class CPU {

  clock: number;
  timeSlice?: number;
  shallExecute = true;

  constructor(
    private processesService: ProcessesService,
    clock: number = 200,
    timeSlice?: number
  ) {
    this.clock = clock;
    this.timeSlice = timeSlice;
  }

  async execute(process: Process, ioProcessesService: IoProcessesService) {
    this.processesService.toState(process, "EXECUTING")
    do {
      await this.executeInstruction();
      this.processesService.incrementCounter(process)
      if (this.isFinished(process)) {
        this.processesService.toState(process, 'DONE')
        break
      }
      if (process.bound == "IO") {
        this.processesService.toState(process, "IO")
        ioProcessesService.addProcess(process);
        break
      }
    } while (this.shallExecute && !this.isFinished(process))
  }

  private async executeInstruction() {
    await new Promise(r => setTimeout(r, this.clock));
  }

  isFinished(proc: Process) {
    return proc.pc! === proc.amountInstrucs
  }

}
