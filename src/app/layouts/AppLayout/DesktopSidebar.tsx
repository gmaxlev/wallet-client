import { Box, CSSObject, Divider, styled, Theme } from "@mui/material";
import { NavLinks } from "./NavLinks";
import { DrawerHeader } from "./AppLayout";
import MuiDrawer from "@mui/material/Drawer";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import { useMemo } from "react";
import { NavLinkType } from "./NavLink";
import { useTranslation } from "react-i18next";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import React from "react";
import { useInject } from "../../../ioc/container";
import { RoutingService } from "../../../router/RoutingService";
interface Props {
  open: boolean;
}

const WIDTH = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  minHeight: "100vh",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => {
    return prop !== "open";
  },
})(({ theme, open }) => ({
  width: WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function DesktopSidebar({ open }: Props) {
  const { t } = useTranslation("app");

  const routingService = useInject<RoutingService>(RoutingService);

  const items = useMemo<{ [key: string]: NavLinkType[] }>(() => {
    return {
      top: [
        {
          text: t("sections.overview"),
          link: routingService.generatePath("app"),
          Icon: DashboardIcon,
          end: true,
        },
      ],
      middle: [
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
  }, []);

  return (
    <Drawer open={open} variant="permanent">
      <DrawerHeader />
      <Box
        component="nav"
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "space-between",
        }}
      >
        <Box>
          <NavLinks items={items.top} />
          <Divider />
          <NavLinks items={items.middle} />
        </Box>
        <Box>
          <Divider />
          <NavLinks items={items.bottom} />
        </Box>
      </Box>
    </Drawer>
  );
}
