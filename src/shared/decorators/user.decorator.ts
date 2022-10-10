import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export type RequestUser = {
  id: string;
};

export const User = createParamDecorator(
  (data, context: ExecutionContext): RequestUser => {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as RequestUser;
    return user;
  },
);
