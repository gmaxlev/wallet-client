import { Outlet } from "react-router-dom";
import HeaderLayout from "./HeaderLayout";
import {
  Box,
  styled,
  useTheme,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import DesktopSidebar from "./DesktopSidebar";
import MobileMenu from "./MobileMenu";
import React from "react";

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function AppLayout() {
  const [isOpenSidebar, setSidebar] = useState(true);
  const [isOpenMobileMenu, setMobileMenu] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const toggleMenu = useCallback(() => {
    if (isDesktop) {
      setSidebar((prevState) => !prevState);
    } else {
      setMobileMenu(true);
    }
  }, [isDesktop]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenu(false);
  }, []);

  return (
    <>
      <HeaderLayout onToggle={toggleMenu} />
      <Box sx={{ display: "flex" }}>
        {isDesktop ? (
          <DesktopSidebar open={isOpenSidebar} />
        ) : (
          <MobileMenu open={isOpenMobileMenu} onClose={closeMobileMenu} />
        )}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: 2,
            pb: 3,
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <DrawerHeader />
          <Box sx={{ flexGrow: 1 }}>
            <Outlet />
          </Box>
          <Typography
            variant={"overline"}
            component={"footer"}
            sx={{ textAlign: "center", mt: 3 }}
          >
            © Wallet 2022
          </Typography>
        </Box>
      </Box>
    </>
  );
}
