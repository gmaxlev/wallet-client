import {
  Avatar,
  Box,
  Divider,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { NavLinks } from "./NavLinks";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import LogoutIcon from "@mui/icons-material/Logout";
import auth from "../../../auth/services/auth";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import user from "../../../user/services/user";
import SettingsIcon from "@mui/icons-material/Settings";
import { NavLinkType } from "./NavLink";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => unknown;
}

export default observer(function MobileMenu({ open, onClose }: Props) {
  const navigate = useNavigate();

  const { t } = useTranslation("app");

  const items = useMemo<{ [key: string]: NavLinkType[] }>(() => {
    return {
      top: [
        {
          text: t("overview"),
          link: "/app",
          Icon: DashboardIcon,
        },
      ],
      bottom: [
        {
          text: t("settings"),
          link: "/app/settings",
          Icon: SettingsIcon,
        },
        {
          text: t("logout"),
          action: async () => {
            await auth.logout();
            navigate("/auth/sign-in");
          },
          Icon: LogoutIcon,
        },
      ],
    };
  }, []);

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
            <Avatar alt={user.email}>
              {user.name?.trim().slice(0, 1).toUpperCase()}
            </Avatar>
            <Typography variant={"h6"} mt={1}>
              {user.name}
            </Typography>
            <Typography component="p" variant="caption">
              {user.email}
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
