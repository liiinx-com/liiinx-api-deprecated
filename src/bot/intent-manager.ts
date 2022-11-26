import intentHandlers from "./intent-handlers/index";

const db = [
  {
    id: 11557,
    activeStepId: null,
    output: {},
    phone: "14375333235",
  },
];

//TYPES

interface User {
  id: number;
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

export class IntentManager {
  private STEP_ID_DELIMITER = ".";
  private NEW_LINE = "\n";
  private intentsMap = new Map();

  private async getUserActiveStepId(userId: number) {
    // TODO: get from db and if not existed in db then return fallback";
    return await this.getFallbackIntentForUser(userId);
  }

  async getUserById(userId: number) {
    return db.find((user) => user.id === userId);
  }

  async resetUserOutput(userId: number) {
    const user = await this.getUserById(userId);
    user.output = {};
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

  async updateUserActiveStepId(
    userId: number,
    { stepId = undefined, changes = undefined },
  ) {
    const user = await this.getUserById(userId);
    if (stepId) user.activeStepId = stepId;
    if (changes) user.output = { ...user.output, ...changes };
    return user;
  }

  private async getFallbackIntentForUser(userId: number) {
    return "getStarted.1";
  }

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

  async processTextMessageForUser(userId: number, message: IncomingMessage) {
    const result = { response: "sample text" };
    const { text: userInput } = message;
    const userActiveStepId = await this.getUserActiveStepId(userId);

    // 1. Get Handler Module
    const [, handlerModule] = await this.getIntentAndHandlerByStepId(
      userActiveStepId,
    );
    const { getStepTextAndOptionsByStepId, getNextStepFor } = handlerModule;

    const [stepText, stepOptions, stepKey] =
      await getStepTextAndOptionsByStepId(userActiveStepId, { message });

    // 2. Input Validation
    const { response: validatedResponse, ok: validationOk } =
      await this.validateInputForStep(stepOptions, stepKey, userInput);
    console.log(validationOk, stepText);
    if (!validationOk) {
      return {
        ...result,
        response:
          stepText +
          this.NEW_LINE +
          this.NEW_LINE +
          this.getOptionsTextFromOptions(stepOptions),
      };
    }

    // 3. Update user active step
    await this.updateUserActiveStepId(userId, {
      changes: validatedResponse,
    });

    const { isIntentComplete, nextStep } = await getNextStepFor(
      userActiveStepId,
    );
    console.log("=..", isIntentComplete, nextStep);

    // if (!text || typeof text !== "string")
    //   return {
    //     ok: false,
    //     errorCode: ERRORS.INVALID_INPUT,
    //     response: null,
    //     intent,
    //   };

    return result;
  }

  private getOptionsTextFromOptions(options: any) {
    return options
      .map(({ numericValue, label }) => `${numericValue} ${label}`)
      .join(this.NEW_LINE);
  }

  async validateInputForStep(stepOptions: any, stepKey: string, value: string) {
    const validValues = stepOptions.map(({ numericValue }) => numericValue);
    if (!validValues.includes(value.toString()))
      return {
        ok: false,
        errorCode: ERRORS.INVALID_INPUT,
        response: null,
      };

    const selectedOption = stepOptions.find(
      ({ numericValue }) => numericValue === value.toString(),
    );

    return {
      ok: true,
      response: {
        [stepKey]: selectedOption.value,
      },
      errorCode: undefined,
    };
  }
}

// const getUserByPhone = async (phone: string): Promise<User> => {
//   return { id: "11557", name: "Amir Zad" };
// };

// const manager = new IntentManager();
