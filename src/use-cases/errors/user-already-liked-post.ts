export class UserAlreadyLikedPostError extends Error {
  constructor() {
    super("User has already liked this post.");
  }
}
