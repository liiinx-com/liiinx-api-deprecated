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
        label: "New package return",
        value: "new_return_order",
        numericValue: "1",
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

  return { ...result, gotoStepId: "newReturnOrder.1" };
};

export default {
  getStepTextAndOptionsByStepId,
  getNextStepFor,
  handleIntentComplete,
};
