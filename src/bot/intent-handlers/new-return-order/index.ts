const stepsObject = {
  "newReturnOrder.1": {
    previousStepId: null,
    id: "newReturnOrder.1",
    nextStepId: "newReturnOrder.2",
    text: "What retailer are you returning this package to?",
    key: "retailer",
    options: [
      {
        id: "newReturnOrder.1.1",
        order: 1,
        label: "Amazon",
        value: "AMAZON",
        numericValue: "1",
      },
      {
        id: "newReturnOrder.1.2",
        order: 2,
        label: "Walmart",
        value: "WALMART",
        numericValue: "2",
      },
    ],
  },
  "newReturnOrder.2": {
    previousStepId: "newReturnOrder.1",
    id: "newReturnOrder.2",
    nextStepId: "newReturnOrder.3",
    text: "What size is the package?",
    key: "size",
    options: [
      {
        id: "newReturnOrder.2.1",
        order: 1,
        label: "Small",
        value: "SMALL",
        numericValue: "1",
      },
      {
        id: "newReturnOrder.2.2",
        order: 2,
        label: "Medium",
        value: "MEDIUM",
        numericValue: "2",
      },
    ],
  },
  "newReturnOrder.3": {
    previousStepId: "newReturnOrder.2",
    id: "newReturnOrder.3",
    nextStepId: null,
    text: "Does it need a shipping box?",
    key: "shippingBox",
    options: [
      {
        id: "newReturnOrder.3.1",
        order: 1,
        label: "Yes",
        value: true,
        numericValue: "1",
      },
      {
        id: "newReturnOrder.3.2",
        order: 2,
        label: "No",
        value: false,
        numericValue: "2",
      },
    ],
  },
};

const getStep = async (stepId: string) => {
  return stepsObject[stepId];
};

const getOptionsForStep = async (stepId: string) => {
  const targetStep = stepsObject[stepId];
  if (targetStep) {
    return targetStep.options;
  }
  return [];
};

const getNextStepFor = async (stepId: string) => {
  const result = { isIntentComplete: false, nextStep: null };
  const step = await getStep(stepId);
  if (step.nextStepId) {
    const nextStep = await getStep(step.nextStepId);
    console.log("000000", nextStep);
    return { ...result, nextStep };
  }
  return { ...result, isIntentComplete: true };
};

const getStepTextAndOptionsByStepId = async (
  stepId: string,
  options: any | undefined,
) => {
  const {
    message: {
      user: { id, name },
      text,
    },
  } = options;
  const step = await getStep(stepId);
  const stepOptions = await getOptionsForStep(stepId);
  return [step.text, stepOptions, step.key];
};

const handleIntentComplete = async (userId: number, payload: any) => {
  const result = { gotoStepId: null };

  console.log(userId, "completed intent with", payload);

  return result;
};

export default {
  getStepTextAndOptionsByStepId,
  getNextStepFor,
  handleIntentComplete,
};
