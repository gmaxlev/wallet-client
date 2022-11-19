import * as Yup from "yup";

export default Yup.number()
  .required("app:accounts.fields.currency.errors.required")
  .nullable();
