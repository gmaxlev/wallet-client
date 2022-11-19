import useTitle from "../../../meta/useTitle";
import { Container, Grid } from "@mui/material";
import { injectFn, useInject } from "../../../ioc/container";
import { RouteContext } from "../../../router/types";
import { useLoaderData } from "react-router-dom";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { RoutingService } from "../../../router/RoutingService";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CustomBreadcrumbs from "../../../components/CustomBreadcrumbs/CustomBreadcrumbs";
import { isAxiosError } from "../../../api/utils";
import { ResourceNotFoundException } from "../../../exeptions/ResourceNotFoundException";
import ResourceNotFound from "../../../components/ResourceNotFound/ResourceNotFound";
import AccountEditControl from "../components/AccountEditControl";
import { AccountsService } from "../services/AccountsService";
import { CurrenciesService } from "../../currencies/CurrenciesService";

export const loader = injectFn(
  [AccountsService, CurrenciesService],
  (accountsService: AccountsService, currenciesService: CurrenciesService) =>
    (context: RouteContext) => {
      return Promise.all([
        accountsService.get(Number(context.args.params?.id)).catch((error) => {
          if (isAxiosError([404, 403], error)) {
            return new ResourceNotFoundException();
          }
          return Promise.reject(error);
        }),
        currenciesService.getAll(),
      ]);
    }
);

export default function AccountEditPage() {
  const [account, currencies] = useLoaderData() as Awaited<
    ReturnType<typeof loader>
  >;
  const { t } = useTranslation("app");

  const isNotFound = account instanceof ResourceNotFoundException;

  useTitle(t(isNotFound ? "accounts.notFound.title" : "accounts.update.title"));

  const routingService = useInject<RoutingService>(RoutingService);

  const breadcrumbs = useMemo(
    () => [
      {
        to: routingService.generatePath("accounts"),
        text: t("sections.accounts"),
        Icon: AccountBalanceWalletIcon,
      },
    ],
    [routingService, t]
  );

  return (
    <Container>
      <Grid container justifyContent={"center"}>
        <Grid xs={12} md={10} xl={8} item>
          <CustomBreadcrumbs
            chain={breadcrumbs}
            current={t("accounts.update.title")}
          />
          {isNotFound ? (
            <ResourceNotFound>
              {t("accounts.notFound.details")}
            </ResourceNotFound>
          ) : (
            <AccountEditControl
              account={account.data}
              currencies={currencies.data}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
