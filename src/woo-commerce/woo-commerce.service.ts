import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigurationService } from "src/configuration/configuration.service";
import WooCommerceApi from "@woocommerce/woocommerce-rest-api";
import {
  Customer,
  NewOrder,
  Order,
  OrderStatus,
  UserRole,
  UserStatus,
  WooCustomer,
  WooOrder,
  WooOrderLineItem,
} from "./types";
import { WooUtils } from "./woo-utils";
import { plainToClass } from "class-transformer";

@Injectable()
export class WooCommerceService {
  wooClient: WooCommerceApi;

  constructor(private readonly configurationService: ConfigurationService) {
    this.initWooCommerceClient();
  }

  private initWooCommerceClient() {
    const { key, secret, url } =
      this.configurationService.getWooCommerceConfig();
    this.wooClient = new WooCommerceApi({
      url,
      consumerKey: key,
      consumerSecret: secret,
      version: "wc/v3",
    });
  }

  // CUSTOMER-SERVICES
  async getCustomerByEmail(email: string) {
    const response = await this.wooClient
      .get("customers", {
        email,
        role: UserRole.CUSTOMER,
      })
      .catch(({ response: { status, statusText } }) => {
        throw new HttpException(statusText, status);
      });
    return WooUtils.handleFindOneResponse(response.data);
  }

  async getCustomerById(id: number): Promise<Customer> {
    const response = await this.wooClient
      .get(`customers/${id}`)
      .catch(({ response: { status, statusText } }) => {
        throw new HttpException(statusText, status);
      });

    const customer = response.data as Customer;
    if (customer.role !== "customer") throw new NotFoundException();

    return customer;
  }

  async newCustomer(customer: Customer) {
    const { shipping, email, firstName, lastName } = customer;

    let existingCustomer;
    try {
      existingCustomer = await this.getCustomerByEmail(email);
    } catch (e) {
      if (e.status !== 404) throw e;
    }
    if (existingCustomer) throw new ConflictException("already_exists");

    const wooCustomer: WooCustomer = {
      email,
      first_name: firstName,
      last_name: lastName,
      billing: shipping,
      shipping,
    };

    const res = await this.wooClient.post("customers", wooCustomer);
    return res.data;
  }

  // PRODUCT-SERVICES
  async getActiveProducts() {
    const response = await this.wooClient
      .get("products", {
        status: UserStatus.PUBLISH,
      })
      .catch(({ response: { status, statusText } }) => {
        throw new HttpException(statusText, status);
      });
    return response.data;
  }

  async getProductBySlug(slug: string) {
    const response = await this.wooClient
      .get("products", {
        status: UserStatus.PUBLISH,
        slug,
      })
      .catch(({ response: { status, statusText } }) => {
        throw new HttpException(statusText, status);
      });
    return WooUtils.handleFindOneResponse(response.data);
  }

  // ORDER-SERVICES
  async getOrdersByCustomerId(customerId: number): Promise<Order[]> {
    const response = await this.wooClient
      .get("orders", {
        status: WooUtils.getValidOrderStatusList(),
        customer: customerId,
      })
      .catch(({ response: { status, statusText } }) => {
        throw new HttpException(statusText, status);
      });
    return response.data.map(WooUtils.mapWooOrderToOrder);
  }

  async getOrderById(id: number): Promise<Order> {
    const response = await this.wooClient
      .get(`orders/${id}`)
      .catch(({ response: { status, statusText } }) => {
        throw new HttpException(statusText, status);
      });
    const order = response.data;
    if (!WooUtils.getValidOrderStatusList().includes(order.status))
      throw new NotFoundException();

    return WooUtils.mapWooOrderToOrder(order);
  }

  async getCouponByCode(code: string) {
    const response = await this.wooClient
      .get("coupons", {
        status: UserStatus.PUBLISH,
        code: code.toUpperCase(),
      })
      .catch(({ response: { status, statusText } }) => {
        throw new HttpException(statusText, status);
      });

    return WooUtils.handleFindOneResponse(response.data, {
      notFoundMsg: "coupon_not_found",
    });
  }

  async newOrder(order: NewOrder) {
    const {
      // setPaid,
      lineItems,
      // paymentMethod,
      // paymentMethodTitle,
      shippingInfo,
      userId: customerId,
      userNote: customerNote,
      couponCodes,
      metaData,
    } = order;
    const wooOrder: WooOrder = {
      shipping: shippingInfo,
      billing: shippingInfo,
      line_items: lineItems.map(
        (i) =>
          ({
            product_id: i.productId,
            quantity: i.quantity,
            meta_data: i.metaData,
            variation_id: i.variationId,
          } as WooOrderLineItem),
      ),
      ...(customerNote ? { customer_note: customerNote } : {}),
      ...(metaData ? { meta_data: metaData } : {}),
      // payment_method: paymentMethod,
      // payment_method_title: paymentMethodTitle,
      // set_paid: setPaid,
      customer_id: customerId,
      ...(couponCodes
        ? { coupon_lines: couponCodes.map((code) => ({ code })) }
        : {}),
    };

    const res = await this.wooClient.post("orders", wooOrder);
    return res.data;
  }

  async updateOrderStatus(orderId: number, status: OrderStatus) {
    const response = await this.wooClient
      .put(`orders/${orderId}`, { status })
      .catch(({ response: { status, statusText } }) => {
        throw new HttpException(statusText, status);
      });
    return response.data;
  }
}
