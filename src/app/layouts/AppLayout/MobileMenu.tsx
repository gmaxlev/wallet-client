import {
  Avatar,
  Box,
  Divider,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { NavLinks } from "./NavLinks";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import { NavLinkType } from "./NavLink";
import { useTranslation } from "react-i18next";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import React from "react";
import { useInject } from "../../../ioc/container";
import { AuthService } from "../../../auth/services/AuthService";
import { RoutingService } from "../../../router/RoutingService";

interface Props {
  open: boolean;
  onClose: () => unknown;
}

export default observer(function MobileMenu({ open, onClose }: Props) {
  const { t } = useTranslation("app");

  const routingService = useInject<RoutingService>(RoutingService);

  const authService = useInject<AuthService>(AuthService);

  const items = useMemo<{ [key: string]: NavLinkType[] }>(() => {
    return {
      top: [
        {
          text: t("sections.overview"),
          link: routingService.generatePath("app"),
          Icon: DashboardIcon,
          end: true,
        },
        {
          text: t("sections.accounts"),
          link: routingService.generatePath("accounts"),
          Icon: AccountBalanceWalletIcon,
          end: false,
        },
      ],
      bottom: [
        {
          text: t("sections.logout"),
          link: routingService.generatePath("logout"),
          Icon: LogoutIcon,
          end: true,
        },
      ],
    };
  }, [routingService, t]);

  return (
    <SwipeableDrawer
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "300px",
          maxWidth: "80vw",
        },
      }}
      onOpen={() => {}}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: "1",
        }}
      >
        <Box>
          <Box sx={{ p: 2 }}>
            <Avatar alt={"user.email"}>
              {authService.user?.name?.trim().slice(0, 1).toUpperCase()}
            </Avatar>
            <Typography variant={"h6"} mt={1}>
              {authService.user?.name}
            </Typography>
            <Typography component="p" variant="caption">
              {authService.user?.email}
            </Typography>
          </Box>
          <Divider />
          <NavLinks items={items.top} onClick={onClose} />
        </Box>
        <Box>
          <Divider />
          <NavLinks items={items.bottom} onClick={onClose} />
        </Box>
      </Box>
    </SwipeableDrawer>
  );
});
