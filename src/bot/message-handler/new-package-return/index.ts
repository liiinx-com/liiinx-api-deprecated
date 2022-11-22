import { NEW_LINE, randomIntBetween } from "../utils";

const menu = {
  id: "new_return_order",
  sampleMessages: ["order", "return"],
  messageTemplateId: "new_return_order",
  firstStepId: "new_return_order*1",
  steps: {
    "new_return_order*1": {
      previousStepId: null,
      id: "new_return_order*1",
      nextStepId: "new_return_order*2",
      text: "What retailer are you returning this package to?",
      key: "retailer",
      options: [
        {
          id: "new_return_order*1*1",
          order: 1,
          label: "Amazon",
          value: "AMAZON",
          numericValue: "1",
        },
        {
          id: "new_return_order*1*2",
          order: 2,
          label: "Walmart",
          value: "WALMART",
          numericValue: "2",
        },
      ],
    },
    "new_return_order*2": {
      previousStepId: "new_return_order*1",
      id: "new_return_order*2",
      nextStepId: "new_return_order*3",
      text: "What size is the package?",
      key: "size",
      options: [
        {
          id: "new_return_order*2*1",
          order: 1,
          label: "Small",
          value: "SMALL",
          numericValue: "1",
        },
        {
          id: "new_return_order*2*2",
          order: 2,
          label: "Medium",
          value: "MEDIUM",
          numericValue: "2",
        },
      ],
    },
    "new_return_order*3": {
      previousStepId: "new_return_order*2",
      id: "new_return_order*3",
      nextStepId: null,
      text: "Does it need a shipping box?",
      key: "shippingBox",
      options: [
        {
          id: "new_return_order*3*1",
          order: 1,
          label: "Yes",
          value: true,
          numericValue: "1",
        },
        {
          id: "new_return_order*3*2",
          order: 2,
          label: "No",
          value: false,
          numericValue: "2",
        },
      ],
    },
  },
};

const getOptionsForStep = (step: any, messageParams: any) => {
  const options = step.options
    .sort((a: any, b: any) =>
      a.order > b.order ? 1 : b.order > a.order ? -1 : 0,
    )
    .map(({ numericValue, label }) => `${numericValue}. ${label}`);
  return options.join(NEW_LINE);
};

export default async function (stepId, messageParams) {
  const { name, userId } = messageParams;
  const message = [];
  message.push("mmmmmmmmmmmmmmmmeeeeeeeeesssssssssssssss");

  const options = getOptionsForStep(menu.steps[stepId], messageParams);

  const result = [message.join(NEW_LINE), options];
  return result;
}
