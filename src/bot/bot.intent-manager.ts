import { Injectable } from "@nestjs/common";
import messageHelper from "./message-helper";

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
  activeStepId = DEFAULT_STEP_ID; // TODO:  remove this
  fallbackStepId = DEFAULT_STEP_ID;

  async getOptionsForStep(step: any, messageParams: any) {
    const options = step.options.map(
      ({ numericValue, label }) => `${numericValue}. ${label}`,
    );
    return options.join(NEW_LINE);
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

  getIntentAndStepByStepId(stepId: string) {
    if (!stepId) return null;
    const [intentId] = stepId.split(STEP_ID_DELIMITER);
    if (this.intentsMap.has(intentId)) {
      const intent = this.intentsMap.get(intentId);
      return [intent, intent.steps[stepId]];
    }
    throw new Error(ERRORS.STEP_NOT_FOUND);
  }

  async getMenuItemFor(stepId: string, messageParams = {}) {
    console.log("running stepId", stepId);
    const [, step] = this.getIntentAndStepByStepId(stepId);
    this.activeStepId = stepId;

    let message: string;
    if (step.text) message = step.text;
    else if (step.textFn)
      message = await messageHelper[step.textFn](messageParams);

    return [message, await this.getOptionsForStep(step, messageParams)];
  }

  async validateInputForStep(stepId: string, value: string) {
    const [intent, step] = this.getIntentAndStepByStepId(stepId);
    if (!value || typeof value !== "string")
      return {
        ok: false,
        errorCode: ERRORS.INVALID_INPUT,
        response: null,
        intent,
      };

    const validValues = step.options.map(({ numericValue }) => numericValue);
    if (!validValues.includes(value.toString()))
      return {
        ok: false,
        errorCode: ERRORS.INVALID_INPUT,
        response: null,
        intent,
      };

    const selectedOption = step.options.find(
      ({ numericValue }) => numericValue === value.toString(),
    );

    return {
      ok: true,
      intent,
      response: {
        [step.key]: selectedOption.value,
      },
      errorCode: undefined,
    };
  }

  async processCompletedIntent(intent: any, output: any, params: any) {
    const result = { stepId: this.fallbackStepId };

    // TODO: Send message to queue

    if (intent.id === "hi") {
      console.log(
        `now ${intent.id} process is completed and output is `,
        JSON.stringify(output, null, 2),
      );
      return { ...result, stepId: "new_return_order*1" };
    }

    if (intent.id === "new_return_order") {
      console.log(
        `hala ${intent.id} process is completed and output is `,
        JSON.stringify(output, null, 2),
      );
      return { ...result };
    }

    return result;
  }

  async getNextStepFor(stepId: string) {
    const result = { isIntentComplete: false, intent: null, nextStep: null };

    const [intent, step] = this.getIntentAndStepByStepId(stepId);

    if (step.nextStepId) {
      const [, nextStep] = this.getIntentAndStepByStepId(step.nextStepId);
      return { ...result, intent, nextStep };
    }
    return { ...result, isIntentComplete: true };
  }

  processResponseForStepId(stepId: string, value: string) {
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
