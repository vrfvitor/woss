export default class Process {
  pid: number;
  name: string;
  colorHex: string;
  amountInstrucs: number;
  pc: number;
  bound: 'CPU' | 'IO';
  dateCreation: Date;
  state: 'READY' | 'IO' | 'EXECUTING' | 'DONE';

  constructor(pid: number, name: string, colorHex: string, bound: "CPU" | "IO", dateCreation: Date, state: "READY" | "IO" | "EXECUTING" | "DONE", amountInstrucs: number = -1, pc: number = 0) {
    this.pid = pid;
    this.name = name;
    this.colorHex = colorHex;
    this.bound = bound;
    this.dateCreation = dateCreation;
    this.state = state;

    this.amountInstrucs = amountInstrucs;
    this.pc = pc;
  }

}
