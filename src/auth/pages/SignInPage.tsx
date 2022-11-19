import useTitle from "../../meta/useTitle";
import { useTranslation } from "react-i18next";
import {
  Grid,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useFormik } from "formik";
import useRequest from "../../hooks/useRequest";
import { useInject } from "../../ioc/container";
import { AuthService } from "../services/AuthService";
import emailValidation from "../validations/email.validation";
import passwordValidation from "../validations/password.validation";
import * as Yup from "yup";
import React, { useMemo, useState } from "react";
import { getValidationFieldProps } from "../../common/validation-utils";
import UserFriendlyError from "../../components/UserFriendlyError/UserFriendlyError";
import { useNavigate } from "react-router-dom";
import { RoutingService } from "../../router/RoutingService";
import MuiRouterLink from "../../router/components/MuiRouterLink";
import { useLocation } from "react-router";
export default function SignInPage() {
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const link = params.get("redirect");
    if (!link) {
      return null;
    }
    return decodeURI(link);
  }, [location]);

  useTitle(t("sign-in"));

  const authService = useInject<AuthService>(AuthService);
  const routingService = useInject<RoutingService>(RoutingService);

  const { request, isFetching, error } = useRequest(
    async (email: string, password: string, remember: boolean) => {
      await authService.signIn({ email, password, remember });
      setSuccess(true);
      const to = redirectTo ? redirectTo : routingService.generatePath("app");
      navigate(to);
    }
  );

  const emailAfterSignUp = useMemo<string | undefined>(
    () => location.state?.signUp?.email,
    [location]
  );

  const formik = useFormik({
    initialValues: {
      email: emailAfterSignUp ? emailAfterSignUp : "",
      password: "",
      remember: true,
    },
    onSubmit: (values) =>
      request(values.email, values.password, values.remember),
    validationSchema: Yup.object({
      email: emailValidation,
      password: passwordValidation,
    }),
  });

  const isDisabled = useMemo(
    () => isFetching || success,
    [isFetching, success]
  );

  const signUpLink = useMemo(
    () => routingService.generatePath("sign-up"),
    [routingService]
  );

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
          {t("sign-in")}
        </Typography>
        {emailAfterSignUp && (
          <Alert severity={"success"} sx={{ mb: 2 }}>
            Вас успішно зареєстровано
          </Alert>
        )}
        <UserFriendlyError serverData={error} />
        <form onSubmit={formik.handleSubmit}>
          <FormGroup
            sx={{
              marginBottom: 1,
            }}
          >
            <TextField
              fullWidth
              label={t("fields.email.label")}
              variant={"outlined"}
              disabled={isDisabled}
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
              label={t("fields.password.label")}
              variant={"outlined"}
              disabled={isDisabled}
              autoFocus={!!emailAfterSignUp}
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
              label={t("fields.rememberMe.label")}
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
            {t("fields.signInSubmit.label")}
          </LoadingButton>
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              variant={"text"}
              disabled={isDisabled}
              href={signUpLink}
              component={MuiRouterLink}
            >
              {t("sign-up")}
            </Button>
          </Box>
        </form>
      </Grid>
    </Grid>
  );
}
