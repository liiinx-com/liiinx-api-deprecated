const stepsObject = {
  "getStarted*1": {
    previousStepId: null,
    id: "hi*1",
    nextStepId: null,
    text: "Hello!\nThis is liiinx, How can I help you?",
    key: "selectedMenuItem",
    options: [
      {
        id: "hi*1*1",
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

const getStepTextAndOptionsByStepId = async (
  stepId: string,
  options: object | undefined,
) => {
  const step = await getStep(stepId);
  const stepOptions = await getOptionsForStep(stepId);
  return [step.text, stepOptions];
};

export default function () {
  return {
    getStepTextAndOptionsByStepId,
  };
}
