export const AuthApi = new (class AuthApi {
  signIn(params: { email: string; password: string }) {
    return new Promise<number>((resolve) => setTimeout(() => resolve(1), 1000));
  }
})();
