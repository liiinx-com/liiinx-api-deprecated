import { Injectable } from "@nestjs/common";

@Injectable()
export class IntentManager {
  fallBackIntentKey = "hi";
  intents = [];
  messageIntentMap = {};
  lastStepKey = null;

  loadAssets({ intents, messageIntentMap }) {
    this.intents = intents;
    this.messageIntentMap = messageIntentMap;
  }

  getIntentKeyFromStepKey(stepKey) {
    const [intentKey] = stepKey.split("*");
    return intentKey;
  }

  getStep(flow, stepId) {
    if (!flow) throw new Error("E1_flow-not-found");
    return flow.steps.find(({ id }) => id === stepId);
  }

  getIntent(intentKey) {
    return this.intents[intentKey] ? this.intents[intentKey] : null;
  }

  getOptionsForStep(step) {
    return step.options
      .map(({ numericValue, label }) => `${numericValue} ${label}`)
      .join("\n");
  }

  validateResponseForStepId(stepId, value) {
    const step = this.getStepByKey(stepId);
    if (!value || typeof value !== "string")
      return { ok: false, errorCode: "INVALID-INPUT" };
    console.log(`user replied ${value}`);

    // Validation
    const validValues = step.options.map(({ numericValue }) => numericValue);
    if (!validValues.includes(value.toString()))
      return { ok: false, errorCode: "INVALID-INPUT" };
    const selectedOption = step.options.find(
      ({ numericValue }) => numericValue === value.toString(),
    );

    return {
      ok: true,
      nextStepId: step.nextStepId,
      response: {
        [step.key]: selectedOption.value,
      },
      errorCode: undefined,
    };
  }

  getStepByKey(stepKey) {
    const intentKey = this.getIntentKeyFromStepKey(stepKey);
    const intent = this.getIntent(intentKey);
    return intent.steps[stepKey];
  }

  run(intent, stepKey) {
    // const step = this.getStepById(stepId);
    console.log("xxxx", intent, stepKey);
    const step = intent.steps[stepKey];
    this.currentStepKey = stepKey;
    return [step.question, this.getOptionsForStep(step)];
  }

  getIntentByMessage(msg) {
    const intentKey = this.messageIntentMap[msg]
      ? this.messageIntentMap[msg]
      : this.fallBackIntentKey;
    return this.intents[intentKey];
  }
}
