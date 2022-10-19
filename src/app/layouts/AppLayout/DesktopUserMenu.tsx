import { Menu, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import auth from "../../../auth/services/auth";

interface Props {
  anchorEl: HTMLElement | null;
  onClose: () => unknown;
}

export default function DesktopUserMenu({ anchorEl, onClose }: Props) {
  const navigate = useNavigate();

  const { t } = useTranslation("app");

  const items = useMemo(() => {
    return [
      {
        text: t("profile"),
        link: "/app/",
      },
      {
        text: t("settings"),
        link: "/app/settings",
      },
      {
        text: t("logout"),
        async action() {
          await auth.logout();
          navigate("/auth/sign-in");
        },
      },
    ];
  }, []);

  function selectMenuItem(option: {
    text: string;
    link?: string;
    action?: () => void;
  }) {
    onClose();
    if (option.link) {
      navigate(option.link);
    } else if (option.action) {
      option.action();
    }
  }

  return (
    <Menu
      sx={{ mt: "45px" }}
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorEl)}
      onClose={() => onClose()}
    >
      {items.map((setting, index) => (
        <MenuItem key={index} onClick={() => selectMenuItem(setting)}>
          <Typography textAlign="center">{setting.text}</Typography>
        </MenuItem>
      ))}
    </Menu>
  );
}
