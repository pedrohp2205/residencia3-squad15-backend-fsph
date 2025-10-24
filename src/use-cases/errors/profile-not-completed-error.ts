export class ProfileNotCompletedError extends Error {
  constructor() {
    super("User profile is incomplete.");
  }
}