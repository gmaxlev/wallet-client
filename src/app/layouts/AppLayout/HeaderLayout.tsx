import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import DesktopUserMenu from "./DesktopUserMenu";
import { observer } from "mobx-react-lite";
import React from "react";
import { useInject } from "../../../ioc/container";
import { MetaService } from "../../../meta/MetaService";
import { AuthService } from "../../../auth/services/AuthService";
import { useNavigation } from "react-router-dom";
import { LinearProgress } from "@mui/material";

interface Props {
  onToggle: () => unknown;
}

export default observer(function HeaderLayout({ onToggle }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const metaService = useInject<MetaService>(MetaService);
  const authService = useInject<AuthService>(AuthService);

  const navigation = useNavigation();

  const theme = useTheme();

  return (
    <Box>
      <AppBar
        position={"fixed"}
        sx={{
          [theme.breakpoints.up("md")]: {
            zIndex: theme.zIndex.drawer + 1,
          },
        }}
      >
        <Toolbar>
          <IconButton
            size={"large"}
            edge={"start"}
            color={"inherit"}
            aria-label={"menu"}
            sx={{ mr: 2 }}
            onClick={onToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component={"h1"}
            variant={"h6"}
            color={"inherit"}
            noWrap
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            {metaService.title}
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={"Меню"}>
              <IconButton
                sx={{ p: 0 }}
                onClick={(event) => setAnchorEl(event.currentTarget)}
              >
                <Avatar alt={authService.user?.email}>
                  {authService.user?.name?.trim().slice(0, 1).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <DesktopUserMenu
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
            />
          </Box>
        </Toolbar>
        {navigation.state === "loading" && (
          <LinearProgress sx={{ height: "3px" }}></LinearProgress>
        )}
      </AppBar>
    </Box>
  );
});
