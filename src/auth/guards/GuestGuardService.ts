import ServiceSingletonSelfBind from "../../ioc/decorators/ServiceSingletonSelfBind.decorator";
import { RouteContext, RouteGuard } from "../../router/types";
import { inject } from "inversify";
import { AuthService } from "../services/AuthService";
import { redirect } from "react-router-dom";
import { RoutingService } from "../../router/RoutingService";

@ServiceSingletonSelfBind
export class GuestGuardService implements RouteGuard {
  constructor(
    @inject(AuthService) private readonly authService: AuthService,
    @inject(RoutingService) private readonly routingService: RoutingService
  ) {}

  async touch(context: RouteContext) {
    const user = await this.authService.authorize();
    if (user) {
      throw redirect(this.routingService.generatePath("app"));
    }
  }
}
