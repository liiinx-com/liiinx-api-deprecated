export const getStepFn = async (stepsObject: any, stepId: string) => {
  return stepsObject[stepId];
};

export const getOptionsForStep = async (
  stepsObject: any,
  stepId: string,
  options: any,
) => {
  const targetStep = stepsObject[stepId](options);
  if (targetStep) {
    return targetStep.options;
  }
  return [];
};

export const getPleaseUseTheProvidedOptions = () =>
  "Please use one of the provided options";
