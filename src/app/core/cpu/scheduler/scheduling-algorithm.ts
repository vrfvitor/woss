import Process from "../../process/process";

export interface SchedulingAlgorithm {

  next(processes: Process[]): Process;

}
