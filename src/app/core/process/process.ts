import BoundType from "./bound-type";

export default class Process {

  static NEXT_PID = 100;
  static genPID = () => {
    Process.NEXT_PID += 1 + (Math.floor(Math.random() * 6))
    return Process.NEXT_PID
  }

  pid: number;
  name: string;
  colorHex: string;
  amountInstructs: number;
  pc: number;
  bound: BoundType;
  dateCreation: Date;
  state: 'READY' | 'IO' | 'EXECUTING' | 'DONE';
  priority: number;

  constructor(pid: number | null, name: string, colorHex: string, bound: BoundType, dateCreation: any, state: 'READY' | 'IO' | 'EXECUTING' | 'DONE' | null, priority: number, amountInstructs: number = -1, pc: number = 0) {
    this.pid = pid ?? Process.genPID();
    this.dateCreation = dateCreation ?? new Date();
    this.state = state ?? 'READY';

    this.name = name;
    this.colorHex = colorHex;
    this.bound = bound;
    this.priority = priority;
    this.amountInstructs = amountInstructs;
    this.pc = pc;
  }

}
