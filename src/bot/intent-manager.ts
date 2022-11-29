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

  private async getUserActiveStepInfo(userId: number) {
    // TODO: get from db and if not existed in db then return fallback";
    const user = await this.getUserById(userId);
    return user?.activeStepId
      ? { activeStepId: user.activeStepId, isNewUser: false }
      : {
          activeStepId: await this.getFallbackIntentForUser(userId),
          isNewUser: true,
        };
  }

  private async getUserCurrentOutput(userId: number) {
    // TODO: get from db and if not existed in db then return fallback";
    const user = await this.getUserById(userId);
    return user.output;
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

  async processTextMessageForUser(
    userId: number,
    message: IncomingMessage,
  ): Promise<any> {
    const result = { response: "sample text" };
    const { text: userInput } = message;
    const userActiveStepInfo = await this.getUserActiveStepInfo(userId);
    const { activeStepId: userActiveStepId } = userActiveStepInfo;

    console.log("xxxis New User", userActiveStepInfo.isNewUser);

    // 1. Get Handler Module
    const [, handlerModule] = await this.getIntentAndHandlerByStepId(
      userActiveStepId,
    );
    const {
      getStepTextAndOptionsByStepId,
      getNextStepFor,
      handleIntentComplete,
    } = handlerModule;

    const [currentStepText, currentStepOptions, stepKey] =
      await getStepTextAndOptionsByStepId(userActiveStepId, {
        message,
        isNewUser: userActiveStepInfo.isNewUser,
      });

    // 2. Input Validation
    const { response: validatedResponse, ok: validationOk } =
      await this.validateInputForStep(currentStepOptions, stepKey, userInput);

    if (!validationOk) {
      return {
        ...result,
        response:
          currentStepText +
          this.NEW_LINE +
          this.NEW_LINE +
          this.getOptionsTextFromOptions(currentStepOptions),
      };
    }

    // 3. Update user current active step
    await this.updateUserActiveStepId(userId, {
      changes: validatedResponse,
    });

    // 4. Check if intent is complete
    const { isIntentComplete, nextStep } = await getNextStepFor(
      userActiveStepId,
      { message },
    );

    // 5. Get nextStep
    let gotoNextStepId: string;
    if (isIntentComplete) {
      const userCurrentOutput = await this.getUserCurrentOutput(userId);
      const { gotoStepId } = await handleIntentComplete(
        userId,
        {
          ...userCurrentOutput,
          ...validatedResponse,
        },
        { message },
      );

      gotoNextStepId = gotoStepId
        ? gotoStepId
        : await this.getFallbackIntentForUser(userId);

      // 6. Reset User output
      await this.resetUserOutput(userId);
    } else gotoNextStepId = nextStep.id;

    // 7. Update User Active StepId
    await this.updateUserActiveStepId(userId, {
      stepId: gotoNextStepId,
    });

    // 8. get next Module Handler
    const [, nextHandlerModule] = await this.getIntentAndHandlerByStepId(
      gotoNextStepId,
    );
    const {
      getStepTextAndOptionsByStepId: getStepTextAndOptionsByStepIdForNextModule,
    } = nextHandlerModule;

    const [nextStepText, nextStepOptions] =
      await getStepTextAndOptionsByStepIdForNextModule(gotoNextStepId, {
        message,
      });
    return {
      ...result,
      response:
        nextStepText +
        this.NEW_LINE +
        this.NEW_LINE +
        this.getOptionsTextFromOptions(nextStepOptions),
    };
  }

  private getOptionsTextFromOptions(options: any) {
    return options
      .map(({ numericValue, label }) => `${numericValue}. *${label}*`)
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
