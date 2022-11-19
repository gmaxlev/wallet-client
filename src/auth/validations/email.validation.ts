import * as Yup from "yup";

export default Yup.string()
  .email("auth:fields.email.errors.email")
  .required("auth:fields.email.errors.required")
  .trim();
