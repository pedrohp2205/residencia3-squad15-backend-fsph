export class CpfNotValidError extends Error {
  constructor() {
    super("CPF não é válido.");
  }
}
