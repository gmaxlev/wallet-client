import { AxiosError } from "axios";

export function isAxiosError(code: number | number[], error: unknown) {
  const codes = Array.isArray(code) ? code : [code];
  return (
    error instanceof AxiosError &&
    codes.includes(error.response?.status as number)
  );
}
