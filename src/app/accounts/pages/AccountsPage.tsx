import useTitle from "../../../meta/useTitle";
import { injectFn, useInject } from "../../../ioc/container";
import ScrollPagination from "../../../components/ScrollPagination/ScrollPagination";
import { useLoaderData } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { Alert, Box, Button, Container, Grid } from "@mui/material";
import AccountCard from "../components/AccountCard";
import MuiRouterLink from "../../../router/components/MuiRouterLink";
import { RoutingService } from "../../../router/RoutingService";
import { useLocation } from "react-router";
import AccountDeleteDialog from "../components/AccountDeleteDialog";
import { AccountDto } from "../../../api/resources/account/Account.dto";
import useConfirm from "../../../hooks/useConfirm";
import { useTranslation } from "react-i18next";
import { AccountsService } from "../services/AccountsService";

export const loader = injectFn(
  [AccountsService],
  (accountsService: AccountsService) =>
    (page = 1) => {
      return accountsService.getAll({ page });
    }
);

type LoaderData = Awaited<ReturnType<typeof loader>>;

export default function AccountsPage() {
  const { t } = useTranslation("app");

  useTitle(t("sections.accounts"));

  const routerService = useInject<RoutingService>(RoutingService);

  const confirmState = useConfirm<AccountDto>();

  const loadedData = useLoaderData() as LoaderData;

  const [initialData, setInitialData] = useState<LoaderData>(loadedData);

  const update = useCallback(async (page: number) => {
    return (await loader(page)).data;
  }, []);

  const afterDelete = useCallback(async () => {
    const data = await loader();
    setInitialData(data);
  }, []);

  const location = useLocation();

  const isShowAdded = useMemo(() => {
    if (location.state?.created?.id === undefined) {
      return false;
    }
    return initialData.data.data.find(
      (account) => account.id === location.state?.created?.id
    );
  }, [location.state?.created?.id, initialData]);

  return (
    <Container>
      <AccountDeleteDialog confirmState={confirmState} after={afterDelete} />

      <Box sx={{ textAlign: "center", mb: 5, mt: 3 }}>
        <Button
          variant={"contained"}
          component={MuiRouterLink}
          href={routerService.generatePath("accounts-create")}
        >
          {t("accounts.create.title")}
        </Button>
      </Box>

      {isShowAdded && (
        <Alert severity={"success"} sx={{ mb: 3 }}>
          {t("accounts.create.success")}
        </Alert>
      )}

      {confirmState.isDone && (
        <Alert severity={"success"} sx={{ mb: 3 }}>
          {t("accounts.delete.success", { name: confirmState.target?.name })}
        </Alert>
      )}

      <Grid container spacing={2} alignItems={"stretch"}>
        <ScrollPagination
          initialData={initialData.data}
          update={update}
          key={confirmState.version}
        >
          {(items) =>
            items.map((item, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  display: "flex",
                  wordBreak: "break-word",
                }}
                key={index}
              >
                <AccountCard
                  account={item}
                  isNew={location.state?.created?.id === item.id}
                  onDelete={(account) => confirmState.setTarget(account)}
                  remove={items.length > 1}
                />
              </Grid>
            ))
          }
        </ScrollPagination>
      </Grid>
    </Container>
  );
}
