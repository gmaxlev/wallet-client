import * as Yup from "yup";

export const emailRule = Yup.string()
  .email("fields.email.errors.email")
  .required("fields.email.errors.required")
  .trim();

export const passwordRule = Yup.string()
  .required("fields.password.errors.required")
  .trim();

export const nameRule = Yup.string()
  .required("fields.password.errors.required")
  .trim();
