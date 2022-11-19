import * as Yup from "yup";

export default Yup.string()
  .required("app:accounts.fields.name.errors.required")
  .trim();
