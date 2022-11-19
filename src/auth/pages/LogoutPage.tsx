import { CircularProgress, Grid } from "@mui/material";
import { AuthService } from "../services/AuthService";
import useTitle from "../../meta/useTitle";
import { useEffect, useState } from "react";
import UserFriendlyError from "../../components/UserFriendlyError/UserFriendlyError";
import { useInject } from "../../ioc/container";
import { useNavigate } from "react-router-dom";
import { RoutingService } from "../../router/RoutingService";

export default function LogoutPage() {
  useTitle("Вихід");
  const [error, setError] = useState<unknown>();
  const navigate = useNavigate();
  const authService = useInject<AuthService>(AuthService);
  const routingService = useInject<RoutingService>(RoutingService);

  useEffect(() => {
    authService
      .logout()
      .then(() => navigate(routingService.generatePath("sign-in")))
      .catch((e) => setError(e));
  }, []);

  return (
    <Grid
      container
      alignItems={"center"}
      justifyContent={"center"}
      style={{ minHeight: "100vh" }}
    >
      <Grid item>
        {error ? (
          <UserFriendlyError serverData={error} />
        ) : (
          <CircularProgress />
        )}
      </Grid>
    </Grid>
  );
}
