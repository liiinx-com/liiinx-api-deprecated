import emoji from "node-emoji";

const getStep1 = ({ name }) => ({
  previousStepId: null,
  id: "welcome.1",
  nextStepId: null,
  text: `It is so nice to have you here ${name} ${emoji.get("sparkle")}`,
  key: "selectedOption",
  options: [],
});

const stepsObject = {
  "welcome.1": getStep1,
};

const getStepFn = async (stepId: string) => {
  return stepsObject[stepId];
};

const getOptionsForStep = async (stepId: string, options) => {
  const targetStep = stepsObject[stepId](options);
  if (targetStep) {
    return targetStep.options;
  }
  return [];
};

const validate = async (
  stepId: string,
  value: string,
  { stepKey, stepOptions },
) => {
  const result = { ok: false };

  if (value === "3302code") return { ...result, ok: true };

  return result;
};

const getNextStepFor = async (stepId: string, options: any | undefined) => {
  const result = { isIntentComplete: false, nextStep: null };
  const stepFn = await getStepFn(stepId);
  const step = stepFn(options);
  if (step.nextStepId) {
    const nextStepFn = await getStepFn(step.nextStepId);
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

  const stepFn = await getStepFn(stepId);
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

  return { ...result, gotoStepId: "mainMenu.1" };
};

export default {
  getStepTextAndOptionsByStepId,
  getNextStepFor,
  handleIntentComplete,
  validate,
};
