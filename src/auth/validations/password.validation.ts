import * as Yup from "yup";

export default Yup.string()
  .required("auth:fields.password.errors.required")
  .trim();
