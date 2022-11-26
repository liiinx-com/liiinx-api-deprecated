import intentHandlers from "./intent-handlers";
//TYPES

interface User {
  id: string;
  name: string;
}

interface IncomingMessage {
  text: string;
  user: User;
}

const ERRORS = {
  STEP_NOT_FOUND: "STEP_NOT_FOUND",
  INVALID_INPUT: "INVALID_INPUT",
};

export class IntentManager2 {
  private STEP_ID_DELIMITER: string = ".";
  private intentsMap = new Map();

  async getUserActiveIntent(userId: number) {
    const activeStepId = "if not existed in db then NULL";
    return activeStepId
      ? activeStepId
      : await this.getFallbackIntentForUser(userId);
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

  private async getFallbackIntentForUser(userId: number) {}

  // async getIntentAndStepByStepId(stepId: string) {
  //   if (!stepId) return null;
  //   const [intentKey] = stepId.split(this.STEP_ID_DELIMITER);
  //   if (this.intentsMap.has(intentKey)) {
  //     const intent = this.intentsMap.get(intentKey);
  //     const handler = intentHandlers[intentKey];
  //     const options = await handler();
  //     return [intent, intent.steps[stepId]];
  //   }
  //   throw new Error(ERRORS.STEP_NOT_FOUND);
  // }

  async getIntentAndHandlerByStepId(stepId: string) {
    if (!stepId) throw new Error(ERRORS.STEP_NOT_FOUND);

    const [intentKey] = stepId.split(this.STEP_ID_DELIMITER);
    if (this.intentsMap.has(intentKey)) {
      const intent = this.intentsMap.get(intentKey);
      const handler = intentHandlers[intentKey];
      return [intent, handler];
    }
    throw new Error(ERRORS.STEP_NOT_FOUND);
  }

  async processTextMessage(activeStepId: string, message: IncomingMessage) {
    const result = { response: "" };
    const { text } = message;

    const [intent, handlerModule] = await this.getIntentAndHandlerByStepId(
      activeStepId,
    );
    const { getStepTextAndOptionsByStepId } = handlerModule;

    const [stepText, stepOptions] = await getStepTextAndOptionsByStepId(
      activeStepId,
      { message },
    );

    if (!text || typeof text !== "string")
      return {
        ok: false,
        errorCode: ERRORS.INVALID_INPUT,
        response: null,
        intent,
      };

    return result;
  }

  async validateInputForStep(stepId: string, value: string) {
    const [intent, step] = this.getIntentAndStepByStepId(stepId);

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
}

// const getUserByPhone = async (phone: string): Promise<User> => {
//   return { id: "11557", name: "Amir Zad" };
// };

// const manager = new IntentManager();
