const MEM_SIZE = 0xffff + 1;
let MEM_BLOCK = new Array(MEM_SIZE).fill(null);
let readMemAddr = (addr) => {
  return MEM_BLOCK[addr];
};
let writeMemAddr = (addr, val) => {
  if (addr >= 0 && addr < MEM_SIZE) {
    MEM_BLOCK[addr] = val;
  } else {
    throw new Error("Invalid memory address");
  }
};

let REGISTERS = {
  A: null,
  B: null,
  C: null,
  D: null,
  SI: null,
  DI: null,
  ZF: null,
};
let setRegister = (reg, val) => {
  if (REGISTERS.hasOwnProperty(reg)) {
    REGISTERS[reg] = val;
  } else {
    throw new Error("Invalid register: " + reg);
  }
};

function executeInstruction(op, args) {
  switch (op) {
    case "MOV":
      setRegister(args[0], parseInt(args[1]));
      break;
    case "ADD":
      REGISTERS[args[0]] += parseInt(args[1]);
      break;
    case "SUB":
      REGISTERS[args[0]] -= parseInt(args[1]);
      break;
    case "LOAD":
      REGISTERS[args[0]] = readMemAddr(parseInt(args[1]));
      break;
    case "STORE":
      writeMemAddr(parseInt(args[1]), REGISTERS[args[0]]);
      break;
    /************************************************************************************** */
    //complete rest just like XOR ie check for reg to reg operations except when not needed
    case "XOR": {
      let destReg = args[0];
      let src = args[1];

      let destVal = REGISTERS[destReg] ?? 0;
      let srcVal;

      if (REGISTERS.hasOwnProperty(src)) {
        // src is a register
        srcVal = REGISTERS[src] ?? 0;
      } else {
        // src is an imidiate value
        srcVal = parseInt(src);
      }

      setRegister(destReg, destVal ^ srcVal);
      break;
    }

    case "CMP":
      REGISTERS.ZF = REGISTERS[args[0]] === parseInt(args[1]) ? 1 : 0;
      break;
    default:
      throw new Error(`Unknown instruction: ${op}`);
  }
}
