import { Injectable } from "@nestjs/common";

const NEW_LINE = "\n";
const STEP_ID_DELIMITER = "*";
const DEFAULT_STEP_ID = "hi*1";

const ERRORS = {
  INVALID_INPUT: "E00-INVALID_INPUT",
  STEP_NOT_FOUND: "E01-STEP_NOT_FOUND",
};

@Injectable()
export class IntentManager {
  intentsMap = new Map();
  activeStepId = DEFAULT_STEP_ID;
  fallbackStepId = DEFAULT_STEP_ID;

  getOptionsForStep(step) {
    return step.options
      .map(({ numericValue, label }) => `${numericValue} ${label}`)
      .join(NEW_LINE);
  }

  loadAssets({ intentsObject }) {
    Object.keys(intentsObject)
      .map((key) => ({
        key,
        value: intentsObject[key],
      }))
      .forEach(({ key, value }) => this.intentsMap.set(key, value));
    console.log(`[i] ${this.intentsMap.size} intents loaded successfully `);
  }

  getIntentAndStepByStepId(stepId) {
    if (!stepId) return null;
    const [intentId] = stepId.split(STEP_ID_DELIMITER);
    if (this.intentsMap.has(intentId)) {
      const intent = this.intentsMap.get(intentId);
      return [intent, intent.steps[stepId]];
    }
    throw new Error(ERRORS.STEP_NOT_FOUND);
  }

  getMenuItemFor(stepId) {
    console.log("running stepId", stepId);
    const [, step] = this.getIntentAndStepByStepId(stepId);
    this.activeStepId = stepId; //TODO: for single user
    return [step.question, this.getOptionsForStep(step)];
  }

  processResponseForStepId(stepId, value) {
    const [intent, step] = this.getIntentAndStepByStepId(stepId);
    if (!value || typeof value !== "string")
      return {
        ok: false,
        errorCode: ERRORS.INVALID_INPUT,
        intent,
        nextStepId: stepId,
      };

    // Validation
    const validValues = step.options.map(({ numericValue }) => numericValue);
    console.log(
      `user replied ${value} which is a ` +
        validValues.includes(value.toString()),
      " value",
    );
    if (!validValues.includes(value.toString()))
      return {
        ok: false,
        errorCode: ERRORS.INVALID_INPUT,
        intent,
        nextStepId: stepId,
      };
    const selectedOption = step.options.find(
      ({ numericValue }) => numericValue === value.toString(),
    );

    // Valid user input
    // Checking for step completion
    const stepsCompleted = step.next ? undefined : "COMPLETED";
    const nextStepId = stepsCompleted ? this.fallbackStepId : step.nextStepId;
    if (stepsCompleted !== "COMPLETED") this.activeStepId = nextStepId;

    return {
      ok: true,
      nextStepId,
      intent,
      stepsCompleted,
      response: {
        [step.key]: selectedOption.value,
      },
      errorCode: undefined,
    };
  }
}
