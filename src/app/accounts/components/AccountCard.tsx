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
import ResourceCard, {
  ResourceCardProps,
} from "../../../components/ResourceCard/ResourceCard";

type Props = {
  account: AccountDto;
} & Omit<ResourceCardProps, "editLinkOrAction" | "children">;

export default function AccountCard(props: Props) {
  const { name, balance, description, currency } = props.account;

  const routingService = useInject<RoutingService>(RoutingService);

  const editLink = useMemo(
    () =>
      routingService.generatePath("accounts-edit", {
        id: props.account.id,
      }),
    [props.account.id]
  );

  return (
    <ResourceCard {...props} editLinkOrAction={editLink}>
      <Typography gutterBottom variant="h5" component="div">
        {name}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {currency.code} {balance}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </ResourceCard>
  );
}
