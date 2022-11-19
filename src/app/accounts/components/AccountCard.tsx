import {
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
  alpha,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useMemo } from "react";
import { AccountDto } from "../../../api/resources/account/Account.dto";
import { useInject } from "../../../ioc/container";
import { RoutingService } from "../../../router/RoutingService";
import MuiRouterLink from "../../../router/components/MuiRouterLink";
import { useTranslation } from "react-i18next";

interface Props {
  account: AccountDto;
  isNew?: boolean;
  remove?: boolean;
  onDelete?: (account: AccountDto) => void;
}

export default function AccountCard({
  account,
  isNew,
  onDelete,
  remove = true,
}: Props) {
  const { name, balance, description, currency } = account;

  const routingService = useInject<RoutingService>(RoutingService);

  const { t } = useTranslation("app");

  const editPath = useMemo(
    () =>
      routingService.generatePath("accounts-edit", {
        id: account.id,
      }),
    [account.id]
  );

  return (
    <Box
      sx={(theme) => ({
        width: "100%",
        borderRadius: 1,
        ...(isNew && {
          boxShadow: `0 0 0 5px ${alpha(theme.palette.success.main, 0.2)}`,
        }),
      })}
    >
      <Card
        sx={(theme) => ({
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        })}
      >
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {currency.code} {balance}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Button
            size={"small"}
            startIcon={<EditIcon />}
            component={MuiRouterLink}
            href={editPath}
          >
            {t("accounts.update.short")}
          </Button>

          {remove && (
            <IconButton
              aria-label="delete"
              onClick={() => (onDelete ? onDelete(account) : null)}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </CardActions>
      </Card>
    </Box>
  );
}
