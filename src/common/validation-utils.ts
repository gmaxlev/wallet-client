import { injectFn } from "../ioc/container";
import { I18nService } from "../i18n/I18nService";

export const getValidationFieldProps = injectFn(
  [I18nService],
  (i18nService: I18nService) =>
    (formik: any, field: string, params?: { touched: boolean }) => {
      if (!formik.touched[field] && (!params || params.touched)) {
        return null;
      }

      if (!formik.errors[field]) {
        return null;
      }
      return {
        error: true,
        helperText: i18nService.i18n.t(formik.errors[field]),
      };
    }
);
