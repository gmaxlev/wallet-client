import { observer } from "mobx-react-lite";
import { FormGroup, Grid, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { emailRule, passwordRule } from "../../common/validation-rules";
import { getValidationFieldProps } from "../../common/validation-utils";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { useRequest } from "../../hooks";
import { signIn } from "../api/AuthApi";

export default observer(function SignInPage() {
  const { t } = useTranslation("auth");

  const { request, isFetching } = useRequest(
    (email: string, password: string) => {
      return signIn({ email, password });
    }
  );

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit(values) {
      return request(values.email, values.password);
    },
    validationSchema: Yup.object({
      email: emailRule,
      password: passwordRule,
    }),
  });

  return (
    <Grid
      container
      padding={3}
      alignItems={"center"}
      justifyContent={"center"}
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs sm={7} md={5}>
        <Typography variant={"h3"} component={"h1"} marginBottom={3}>
          <PersonAddAltIcon sx={{ fontSize: 40, marginRight: 2 }} />
          {t("signUp")}
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup
            sx={{
              marginBottom: 1,
            }}
          >
            <TextField
              fullWidth
              label={t("common:fields.email.label")}
              variant={"outlined"}
              disabled={isFetching}
              error={!!formik.touched.email && !!formik.errors.email}
              {...getValidationFieldProps(formik, "email")}
              {...formik.getFieldProps("email")}
            />
          </FormGroup>
          <FormGroup
            sx={{
              marginBottom: 1,
            }}
          >
            <TextField
              type={"password"}
              fullWidth
              label={t("common:fields.password.label")}
              variant={"outlined"}
              disabled={isFetching}
              {...getValidationFieldProps(formik, "password")}
              {...formik.getFieldProps("password")}
            />
          </FormGroup>
          <LoadingButton
            type={"submit"}
            variant={"contained"}
            disabled={isFetching}
            loading={isFetching}
            size={"large"}
            fullWidth
          >
            {t("signUpSubmit")}
          </LoadingButton>
        </form>
      </Grid>
    </Grid>
  );
});
