import * as Yup from "yup";

export default {
  validation: Yup.string()
    .max(300, "app:accounts.fields.description.errors.max")
    .trim(),
  max: 300,
};
