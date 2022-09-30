import { client } from "../../api/client";
import { SignInRequestDTO } from "../dto";

export function signIn({ email, password }: SignInRequestDTO) {
  return client.post("/auth/sign-in", {
    email,
    password,
  });
}
