import i18n from "../i18n";

export function getValidationFieldProps(formik: any, field: string) {
  if (!formik.touched[field] || !formik.errors[field]) {
    return null;
  }
  return {
    error: true,
    helperText: i18n.t(formik.errors[field]),
  };
}
