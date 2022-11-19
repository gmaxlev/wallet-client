import * as Yup from "yup";

export default Yup.string().required("auth:fields.name.errors.required").trim();
