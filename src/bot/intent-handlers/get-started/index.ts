const stepsObject = {
  "getStarted.1": {
    previousStepId: null,
    id: "getStarted.1",
    nextStepId: null,
    text: "Hello!\nThis is liiinx, How can I help you?",
    key: "selectedMenuItem",
    options: [
      {
        id: "getStarted*1*1",
        order: 1,
        label: "How it works",
        value: "how_it_works",
        numericValue: "1",
      },
      {
        id: "getStarted*1*2",
        order: 1,
        label: "Schedule a Package Return (Amazon or Walmart for now)",
        value: "new_return_order",
        numericValue: "2",
      },
      {
        id: "getStarted*1*3",
        order: 3,
        label: "My Schedules",
        value: "my_schedules",
        numericValue: "3",
      },
      {
        id: "getStarted*1*4",
        order: 4,
        label: "Pricing",
        value: "pricing",
        numericValue: "4",
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

const getNextStepFor = async (stepId: string, options: any | undefined) => {
  const result = { isIntentComplete: false, nextStep: null };
  const step = await getStep(stepId);
  if (step.nextStepId) {
    const nextStep = await getStep(step.nextStepId);
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

const handleIntentComplete = async (
  userId: number,
  payload: any | undefined,
) => {
  const result = { gotoStepId: null };

  console.log(userId, "completed intent with", payload);

  return { ...result, gotoStepId: "newReturnOrder.1" };
};

export default {
  getStepTextAndOptionsByStepId,
  getNextStepFor,
  handleIntentComplete,
};
