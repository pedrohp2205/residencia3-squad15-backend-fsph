export class ProfileAlreadyCompletedError extends Error {
  constructor() {
    super('Profile is already completed and cannot be modified.')
  }
}