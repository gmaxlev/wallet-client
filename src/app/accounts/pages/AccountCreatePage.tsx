import { Box, Container, Grid, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import { getValidationFieldProps } from "../../../common/validation-utils";
import AddIcon from "@mui/icons-material/Add";
import { LoadingButton } from "@mui/lab";
import { useLoaderData, useNavigate } from "react-router-dom";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useMemo, useState } from "react";
import React from "react";
import { injectFn, useInject } from "../../../ioc/container";
import useTitle from "../../../meta/useTitle";
import { CreateAccountDto } from "../../../api/resources/account/CreateAccount.dto";
import useRequest from "../../../hooks/useRequest";
import CustomBreadcrumbs from "../../../components/CustomBreadcrumbs/CustomBreadcrumbs";
import UserFriendlyError from "../../../components/UserFriendlyError/UserFriendlyError";
import MoneyTextField from "../../../components/MoneyTextField/MoneyTextField";
import { RoutingService } from "../../../router/RoutingService";
import * as Yup from "yup";
import AccountNameValidation from "../validations/account.name.validation";
import { useTranslation } from "react-i18next";
import AccountCurrencyValidation from "../validations/account.currency.validation";
import AccountBalanceValidation from "../validations/account.balance.validation";
import AccountDescriptionValidation from "../validations/account.description.validation";
import { CurrenciesService } from "../../currencies/CurrenciesService";
import { AccountsService } from "../services/AccountsService";

export const loader = injectFn(
  [CurrenciesService],
  (currenciesService: CurrenciesService) => () => {
    return currenciesService.getAll();
  }
);

export default function AccountCreatePage() {
  const [isCreated, setCreated] = useState(false);

  const { t } = useTranslation("app");

  useTitle(t("accounts.create.title"));

  const navigate = useNavigate();

  const currencies = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const accountsService = useInject<AccountsService>(AccountsService);

  const routingService = useInject<RoutingService>(RoutingService);

  const { request, isFetching, error } = useRequest(
    async (data: CreateAccountDto) => {
      const answer = await accountsService.create(data);
      setCreated(true);
      navigate(routingService.generatePath("accounts"), {
        state: { created: { id: answer.data.id } },
      });
    }
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      initialValue: "" as unknown as number,
      currencyId: "" as unknown as number,
    },
    onSubmit(values) {
      return request(values);
    },
    validationSchema: Yup.object({
      name: AccountNameValidation,
      description: AccountDescriptionValidation.validation,
      initialValue: AccountBalanceValidation,
      currencyId: AccountCurrencyValidation,
    }),
  });

  const breadcrumbs = useMemo(
    () => [
      {
        to: routingService.generatePath("accounts"),
        text: t("sections.accounts"),
        Icon: AccountBalanceWalletIcon,
      },
    ],
    []
  );

  const isDisabled = isFetching || isCreated;

  return (
    <Container>
      <Grid container justifyContent={"center"}>
        <Grid xs={12} md={10} xl={8} item>
          <CustomBreadcrumbs
            chain={breadcrumbs}
            current={t("accounts.create.title")}
          />
          <UserFriendlyError
            serverData={error}
            unknownMessage={t("accounts.create.error")}
            sx={{ mt: 0 }}
          />
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t("accounts.fields.name.label")}
                  variant={"outlined"}
                  disabled={isDisabled}
                  {...getValidationFieldProps(formik, "name")}
                  {...formik.getFieldProps("name")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={0.5}>
                  <Grid xs={4} item>
                    <TextField
                      fullWidth
                      select
                      label={t("accounts.fields.currency.label")}
                      disabled={isDisabled}
                      {...getValidationFieldProps(formik, "currencyId")}
                      {...formik.getFieldProps("currencyId")}
                    >
                      {currencies.data.map((item) => (
                        <MenuItem value={item.id} key={item.id}>
                          {item.code}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid xs={8} item>
                    <MoneyTextField
                      fullWidth
                      label={t("accounts.fields.balance.label")}
                      disabled={isDisabled}
                      {...getValidationFieldProps(formik, "initialValue")}
                      {...formik.getFieldProps("initialValue")}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Box mb={2}>
              <TextField
                fullWidth
                multiline
                label={`${t("accounts.fields.description.label")} (${
                  formik.values.description.trim().length
                }/${AccountDescriptionValidation.max})`}
                variant={"outlined"}
                disabled={isDisabled}
                placeholder={t("accounts.fields.description.placeholder")}
                {...getValidationFieldProps(formik, "description", {
                  touched: false,
                })}
                {...formik.getFieldProps("description")}
              />
            </Box>
            <LoadingButton
              type={"submit"}
              variant={"contained"}
              fullWidth
              size={"large"}
              startIcon={<AddIcon />}
              disabled={isDisabled}
              loading={isDisabled}
            >
              {t("accounts.create.button")}
            </LoadingButton>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
}
