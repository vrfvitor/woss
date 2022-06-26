import { SchedulingAlgorithm } from "./scheduling-algorithm";
import Process from "../../process/process";

const byDate = (a: Process, b: Process) => (a.dateCreation.getTime() - b.dateCreation.getTime())

export class FIFO implements SchedulingAlgorithm {

  next(processes: Process[]): Process {
    return processes.sort(byDate)[0]
  }

}
