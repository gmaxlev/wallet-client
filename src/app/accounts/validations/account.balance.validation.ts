import * as Yup from "yup";

export default Yup.number().required(
  "app:accounts.fields.balance.errors.required"
);
