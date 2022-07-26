export default class BoundType {
  static readonly CPU  = new BoundType('CPU', 0);
  static readonly IO_DISC = new BoundType('IO_DISC', 1.2);
  static readonly IO_TAPE = new BoundType('IO_TAPE', 1.4);
  static readonly IO_TERMINAL = new BoundType('IO_TERMINAL', 1);

  private constructor(
    private readonly key: string,
    public readonly delayFactor: number
  ) { }

  static values() {
    return [BoundType.CPU, BoundType.IO_DISC, BoundType.IO_TAPE, BoundType.IO_TERMINAL]
  }

  toString() {
    return this.key;
  }
}
