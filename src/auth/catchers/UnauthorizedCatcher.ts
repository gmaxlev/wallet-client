import { Catcher } from "../../router/types";
import { isAxiosError } from "../../api/utils";
import { redirect } from "react-router-dom";
import { inject } from "inversify";
import { RoutingService } from "../../router/RoutingService";
import ServiceSingletonSelfBind from "../../ioc/decorators/ServiceSingletonSelfBind.decorator";
import { AuthService } from "../services/AuthService";

@ServiceSingletonSelfBind
export class UnauthorizedCatcher implements Catcher {
  constructor(
    @inject(AuthService) private readonly authService: AuthService,
    @inject(RoutingService) private readonly routingService: RoutingService
  ) {}

  catch(error: unknown): never {
    if (isAxiosError(401, error)) {
      throw redirect(this.routingService.generatePath("sign-in"));
    }
    throw error;
  }
}
