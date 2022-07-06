import BoundType from "./bound-type";

export default class Process {
  pid: number;
  name: string;
  colorHex: string;
  amountInstructs: number;
  pc: number;
  bound: BoundType;
  dateCreation: Date;
  state: 'READY' | 'IO' | 'EXECUTING' | 'DONE';
  priority: number;

  constructor(pid: number, name: string, colorHex: string, bound: BoundType, dateCreation: Date, state: "READY" | "IO" | "EXECUTING" | "DONE", priority: number, amountInstructs: number = -1, pc: number = 0) {
    this.pid = pid;
    this.name = name;
    this.colorHex = colorHex;
    this.bound = bound;
    this.dateCreation = dateCreation;
    this.state = state;
    this.priority = priority;

    this.amountInstructs = amountInstructs;
    this.pc = pc;
  }

}
