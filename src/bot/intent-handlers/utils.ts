export const getStepFn = async (stepsObject: any) => {
  return async function (stepId: string) {
    return stepsObject[stepId];
  };
};

export const getOptionsForStepFn = async (stepsObject: any) => {
  return async function (stepId: string) {
    const targetStep = stepsObject[stepId];
    if (targetStep) {
      return targetStep.options;
    }
    return [];
  };
};

export const getPleaseUseTheProvidedOptions = () =>
  "Please use one of the provided options";
