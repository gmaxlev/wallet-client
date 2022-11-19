import useTitle from "../../meta/useTitle";
import { useTranslation } from "react-i18next";
import {
  Grid,
  TextField,
  Typography,
  FormGroup,
  Button,
  Box,
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
import nameValidation from "../validations/name.validation";
import { useNavigate } from "react-router-dom";
import { RoutingService } from "../../router/RoutingService";
import MuiRouterLink from "../../router/components/MuiRouterLink";

export default function SignInPage() {
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation("auth");
  useTitle(t("sign-up"));

  const navigate = useNavigate();

  const authService = useInject<AuthService>(AuthService);
  const routingService = useInject<RoutingService>(RoutingService);

  const { request, isFetching, error } = useRequest(
    async (email: string, password: string, name: string) => {
      await authService.signUp({ email, password, name });
      setSuccess(true);
      navigate(routingService.generatePath("sign-in"), {
        state: {
          signUp: {
            email,
          },
        },
      });
    }
  );

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
      remember: true,
    },
    onSubmit: (values) => request(values.email, values.password, values.name),
    validationSchema: Yup.object({
      email: emailValidation,
      password: passwordValidation,
      name: nameValidation,
    }),
  });

  const isDisabled = useMemo(
    () => isFetching || success,
    [isFetching, success]
  );

  const signInLink = useMemo(
    () => routingService.generatePath("sign-in"),
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
      <Grid item xs sm={7} md={5}>
        <Typography variant={"h3"} component={"h1"} marginBottom={3}>
          <VpnKeyIcon sx={{ fontSize: 40, marginRight: 2 }} />
          {t("sign-up")}
        </Typography>
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
              {...getValidationFieldProps(formik, "password")}
              {...formik.getFieldProps("password")}
            />
          </FormGroup>
          <FormGroup
            sx={{
              marginBottom: 1,
            }}
          >
            <TextField
              fullWidth
              label={t("fields.name.label")}
              variant={"outlined"}
              disabled={isDisabled}
              {...getValidationFieldProps(formik, "name")}
              {...formik.getFieldProps("name")}
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
            {t("fields.signUpSubmit.label")}
          </LoadingButton>
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              variant={"text"}
              disabled={isDisabled}
              href={signInLink}
              component={MuiRouterLink}
            >
              {t("sign-in")}
            </Button>
          </Box>
        </form>
      </Grid>
    </Grid>
  );
}
