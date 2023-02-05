import { LayoutConfig } from "./types";
// import { theme1 } from "./themes/theme1";

export const salamatWebsite: LayoutConfig = {
  theme: {
    bodyClassName: "bg-gray-200", //bg-green-500
    mainContainerClassName: "",
    mainContainerBoxed: true,
  },
  navbar: {
    sectionType: "NAVBAR",
    sectionVariant: "NAVBAR1",
    sectionProps: { ok: true },
  },
  footer: {
    sectionType: "FOOTER",
    sectionVariant: "FOOTER1",
    sectionProps: { somePropForFooter: true },
  },

  // body: {
  //   backgroundColor: "#00040F",
  // },
  // footer: {
  //   displayLogo: true,
  //   footerText: "Salamat Trading, your trusted broker",
  //   logoPosition: "left",
  // },
  branding: {
    // langCode: "fa",
    // dir: "rtl",
    lang: "en",
    dir: "ltr",

    shortDescription:
      "من مهدی سلامت هستم، معامله گر بازار های مالی به خصوص ارزهای دیجیتال، علاقه مند به بلاکچین و سیستم های غیرمتمرکز واقعی و یکی از آرزوهام اینه که روزی سیستم مالی سنتی کاملا تغییر کنه و یک سیستم  غیرمتمرکز واقعی جای اون رو بگیره.    من تو این کانال، آخرین اخبار ارزهای دیجیتال به صورت روزانه، آموزش های مربوط به معامله ی این ارزها، بررسی شرایط بازار کریپتو، معرفی استراتژی های معاملاتی و اسکلپ، و کلا هر چیزی که بتونیم تو این بازار برای کسب سود ازش استفاده کنیم رو در اختیارتون قرار میدم.    تو این کانال هیچ سیگنالی برای خرید و فروش نمیدیم و توصیه میکنم شما هم به دنبال سیگنال نباشید.    ",
    socialLinks: [
      {
        url: "https://t.me/g9giGirCfg5hZjg8",
        platform: "TELEGRAM",
        order: 1,
      },
      {
        url: "https://www.youtube.com/@salamattrading",
        platform: "YOUTUBE",
        order: 2,
      },
    ],

    title: "Salamat Trading",
    logoUrl: "https://www.youtube.com/channel/UCfYnf9Lo9TAsdvpw1F9dCuQ",
  },
};
