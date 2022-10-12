import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { decode } from "jsonwebtoken";

export class UserInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();
    const bearerToken = request?.headers?.authorization;
    if (!bearerToken) return next.handle();

    const [, token] = bearerToken.split(" ");
    const { userId } = decode(token) as {
      userId: string;
      iat: number;
      exp: number;
    };
    request.user = { id: userId };

    return next.handle();
  }
}
