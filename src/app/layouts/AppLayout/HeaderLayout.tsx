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
import user from "../../../user/services/user";
import DesktopUserMenu from "./DesktopUserMenu";

interface Props {
  onToggle: () => unknown;
}

export default function HeaderLayout({ onToggle }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
            sx={{ flexGrow: 1 }}
          >
            Wallet
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={"Меню"}>
              <IconButton
                sx={{ p: 0 }}
                onClick={(event) => setAnchorEl(event.currentTarget)}
              >
                <Avatar alt={"immaxlev@gmail.com"}>
                  {user.name?.trim().slice(0, 1).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <DesktopUserMenu
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
            />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
