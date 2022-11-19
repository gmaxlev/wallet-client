import ServiceSingletonSelfBind from "../../ioc/decorators/ServiceSingletonSelfBind.decorator";
import { RouteContext, RouteGuard } from "../../router/types";
import { inject } from "inversify";
import { AuthService } from "../services/AuthService";
import { RoutingService } from "../../router/RoutingService";
import { redirect } from "react-router-dom";

@ServiceSingletonSelfBind
export class AuthGuardService implements RouteGuard {
  constructor(
    @inject(AuthService) private readonly authService: AuthService,
    @inject(RoutingService) private readonly routingService: RoutingService
  ) {}

  async touch(context: RouteContext) {
    const user = await this.authService.authorize();
    if (!user) {
      const url = this.routingService.generatePath("sign-in");
      const query = encodeURI(new URL(context.args.request.url).pathname);
      throw redirect(`${url}?redirect=${query}`);
    }
  }
}
