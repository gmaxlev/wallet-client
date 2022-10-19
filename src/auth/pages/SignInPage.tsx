import { observer } from "mobx-react-lite";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { emailRule, passwordRule } from "../../common/validation-rules";
import { getValidationFieldProps } from "../../common/validation-utils";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useRequest } from "../../hooks";
import auth from "../services/auth";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default observer(function SignInPage() {
  const { t } = useTranslation("auth");

  const [isRegistered, setRegistered] = useState(false);

  const navigate = useNavigate();

  const { request, isFetching } = useRequest(
    (email: string, password: string, remember: boolean) => {
      return auth.signIn({ email, password, remember });
    }
  );

  const isDisabled = useMemo<boolean>(() => {
    return isRegistered || isFetching;
  }, [isRegistered, isFetching]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: true,
    },
    async onSubmit(values) {
      try {
        await request(values.email, values.password, values.remember);
        setRegistered(true);
        navigate("/app/");
      } catch (e) {}
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
      <Grid item xs sm={5} md={3}>
        <Typography variant={"h3"} component={"h1"} marginBottom={3}>
          <VpnKeyIcon sx={{ fontSize: 40, marginRight: 2 }} />
          {t("signIn")}
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
              disabled={isDisabled}
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
              disabled={isDisabled}
              {...getValidationFieldProps(formik, "password")}
              {...formik.getFieldProps("password")}
            />
          </FormGroup>
          <FormGroup
            sx={{
              marginBottom: 1,
            }}
          >
            <FormControlLabel
              disabled={isDisabled}
              control={
                <Checkbox
                  name={"remember"}
                  checked={formik.values.remember}
                  onChange={formik.handleChange}
                />
              }
              label={t("rememberMe")}
            />
          </FormGroup>
          <LoadingButton
            type={"submit"}
            variant={"contained"}
            disabled={isDisabled}
            loading={isDisabled}
            size={"large"}
            fullWidth
          >
            {t("signInSubmit")}
          </LoadingButton>
        </form>
      </Grid>
    </Grid>
  );
});
