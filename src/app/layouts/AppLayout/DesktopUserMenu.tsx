import { Menu, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import React from "react";
import { useInject } from "../../../ioc/container";
import { RoutingService } from "../../../router/RoutingService";
interface Props {
  anchorEl: HTMLElement | null;
  onClose: () => unknown;
}

export default function DesktopUserMenu({ anchorEl, onClose }: Props) {
  const navigate = useNavigate();

  const { t } = useTranslation("app");

  const routingService = useInject<RoutingService>(RoutingService);

  const items = useMemo(() => {
    return [
      {
        text: t("sections.logout"),
        async action() {
          navigate(routingService.generatePath("logout"));
        },
      },
    ];
  }, [navigate, routingService, t]);

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
