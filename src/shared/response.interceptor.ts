import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

export class AddOkToResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((response) => {
        const request = context.switchToHttp().getRequest();
        const isGetRequest = request.method === "GET";
        const [requestUrl] = request.url.split("?");
        const excludeUrls = ["/bot/webhook"];
        const stylesUrl = "/styles.css";
        if (
          isGetRequest &&
          (excludeUrls.includes(requestUrl) || requestUrl.includes(stylesUrl))
        )
          return response;

        return { ok: true, result: response };
      }),
    );
  }
}
