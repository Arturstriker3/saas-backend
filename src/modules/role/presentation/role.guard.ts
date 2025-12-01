import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./role.decorator";
import { Role } from "../domain/role.types";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required: Role[] | undefined = this.reflector.get<Role[]>(
      ROLES_KEY,
      context.getHandler()
    );
    if (!required || required.length === 0) return true;
    let req = context.switchToHttp().getRequest();
    if (!req || !req.user) {
      const gqlCtx = GqlExecutionContext.create(context);
      req = gqlCtx.getContext().req;
    }
    const user = req.user as { userId: string; role?: Role } | undefined;
    if (!user || !user.role) return false;
    return required.includes(user.role);
  }
}
