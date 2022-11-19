import { useTranslation } from "react-i18next";
import React, { useCallback, useEffect, useState } from "react";
import { useInject } from "../../../ioc/container";
import { RoutingService } from "../../../router/RoutingService";
import useConfirm from "../../../hooks/useConfirm";
import { AccountDto } from "../../../api/resources/account/Account.dto";
import { useNavigate } from "react-router-dom";
import useRequest from "../../../hooks/useRequest";
import { UpdateAccountDto } from "../../../api/resources/account/UpdateAccount.dto";
import { useFormik } from "formik";
import * as Yup from "yup";
import AccountNameValidation from "../validations/account.name.validation";
import AccountDescriptionValidation from "../validations/account.description.validation";
import AccountBalanceValidation from "../validations/account.balance.validation";
import AccountCurrencyValidation from "../validations/account.currency.validation";
import AccountDeleteDialog from "./AccountDeleteDialog";
import { Alert, Box, Button, Grid, MenuItem, TextField } from "@mui/material";
import UserFriendlyError from "../../../components/UserFriendlyError/UserFriendlyError";
import { getValidationFieldProps } from "../../../common/validation-utils";
import MoneyTextField from "../../../components/MoneyTextField/MoneyTextField";
import { LoadingButton } from "@mui/lab";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CurrencyDto } from "../../../api/resources/currency/Currency.dto";
import { AccountsService } from "../services/AccountsService";

interface Props {
  account: AccountDto;
  currencies: CurrencyDto[];
}

export default function AccountEditControl({
  account: accountServerData,
  currencies,
}: Props) {
  const { t } = useTranslation("app");

  const [isEdited, setEdited] = useState(false);

  const accountsService = useInject<AccountsService>(AccountsService);

  const routingService = useInject<RoutingService>(RoutingService);

  const confirmState = useConfirm<AccountDto>();

  const navigate = useNavigate();

  const afterDelete = useCallback(() => {
    navigate(routingService.generatePath("accounts"));
  }, [routingService, navigate]);

  const { request, isFetching, error, data } = useRequest(
    async (data: UpdateAccountDto) => {
      setEdited(false);
      const account = await accountsService.edit(accountServerData.id, data);
      setEdited(true);
      return account;
    }
  );

  const formik = useFormik({
    initialValues: {
      name: accountServerData.name,
      description: accountServerData.description,
      balance: accountServerData.balance,
      currencyId: accountServerData.currency.id,
    },
    onSubmit(values) {
      return request(values);
    },
    validationSchema: Yup.object({
      name: AccountNameValidation,
      description: AccountDescriptionValidation.validation,
      balance: AccountBalanceValidation,
      currencyId: AccountCurrencyValidation,
    }),
  });

  useEffect(() => {
    if (data) {
      formik.setValues({
        name: data.data.name,
        description: data.data.description,
        balance: data.data.balance,
        currencyId: data.data.currency.id,
      });
    }
  }, [data, formik]);

  const isDisabled = isFetching || confirmState.isDone;

  return (
    <>
      <AccountDeleteDialog confirmState={confirmState} after={afterDelete} />
      {isEdited && (
        <Alert severity={"success"} sx={{ mb: 3 }}>
          {t("accounts.update.success")}
        </Alert>
      )}
      <UserFriendlyError
        serverData={error}
        unknownMessage={t("accounts.update.error")}
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
                  {currencies.map((item) => (
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
                  {...getValidationFieldProps(formik, "balance", {
                    touched: false,
                  })}
                  {...formik.getFieldProps("balance")}
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
            {...getValidationFieldProps(formik, "description")}
            {...formik.getFieldProps("description")}
          />
        </Box>
        <LoadingButton
          type={"submit"}
          variant={"contained"}
          fullWidth
          size={"large"}
          startIcon={<EditIcon />}
          disabled={isDisabled}
          loading={isDisabled && !confirmState.isDone}
        >
          {t("accounts.update.button")}
        </LoadingButton>
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant={"text"}
            color={"error"}
            startIcon={<DeleteIcon />}
            disabled={isDisabled}
            onClick={() => confirmState.setTarget(accountServerData)}
          >
            {t("accounts.update.delete")}
          </Button>
        </Box>
      </form>
    </>
  );
}
