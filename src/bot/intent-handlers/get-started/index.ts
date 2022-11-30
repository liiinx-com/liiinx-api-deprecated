import emoji from "node-emoji";

const getStartedStep1 = ({ name }) => ({
  previousStepId: null,
  id: "getStarted.1",
  nextStepId: "getStarted.2",
  text:
    `Hi ${name} ` +
    emoji.get("wave") +
    "\n\n" +
    "Welcome to Liiinx's WhatsApp self-service experience." +
    "\n\n" +
    "If you have received an invitation, please provide the code now." +
    "\n" +
    "Or you can request one through our website.",
  key: "invitationCode",
  options: [],
});

const getStartedStep2 = ({ name }) => ({
  previousStepId: "getStarted.1",
  id: "getStarted.2",
  nextStepId: null,
  text: `How can I help you today, ${name}?`,
  key: "selectedOption",
  options: [
    {
      id: "getStarted*2*1",
      order: 1,
      label: "How it works",
      value: "how_it_works",
      numericValue: "1",
    },
    {
      id: "getStarted*2*2",
      order: 1,
      label: "New Amazon/Walmart Return Pickup",
      value: "new_return_order",
      numericValue: "2",
    },
    {
      id: "getStarted*2*3",
      order: 3,
      label: "My incoming pickups",
      value: "my_pickups",
      numericValue: "3",
    },
    {
      id: "getStarted*2*4",
      order: 4,
      label: "Pricing",
      value: "pricing",
      numericValue: "4",
    },
  ],
});

const stepsObject = {
  "getStarted.1": getStartedStep1,
  "getStarted.2": getStartedStep2,
};

const getStep = async (stepId: string) => {
  return stepsObject[stepId];
};

const getOptionsForStep = async (stepId: string, options) => {
  const targetStep = stepsObject[stepId](options);
  if (targetStep) {
    return targetStep.options;
  }
  return [];
};

const getNextStepFor = async (stepId: string, options: any | undefined) => {
  const result = { isIntentComplete: false, nextStep: null };
  const stepFn = await getStep(stepId);
  const step = stepFn(options);
  if (step.nextStepId) {
    const nextStepFn = await getStep(step.nextStepId);
    const nextStep = nextStepFn(options);
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

  const params = { name };

  const stepFn = await getStep(stepId);
  const step = stepFn(params);
  const stepOptions = await getOptionsForStep(stepId, params);
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
