import { Injectable } from "@nestjs/common";
import { ConfigurationService } from "src/configuration/configuration.service";
import WooCommerceClientApiWrapper from "woocommerce-api";
import { Resource, WooCommerceClient } from "./types";

@Injectable()
export class WooCommerceUserService {
  wooClient: WooCommerceClient;

  constructor(private readonly configurationService: ConfigurationService) {
    this.initWooCommerceClient();
  }

  private initWooCommerceClient() {
    const { key, secret, url, version, wpAPI } =
      this.configurationService.getWooCommerceConfig();
    this.wooClient = new WooCommerceClientApiWrapper({
      url,
      consumerKey: key,
      consumerSecret: secret,
      wpAPI,
      version,
    });
  }

  public async getUserBy(email: string) {
    const users = await this.wooClient.getAsync(Resource.USER);
    console.log("users==>", users.toJSON().body);
    return users;
  }
}
