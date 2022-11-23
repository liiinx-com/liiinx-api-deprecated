import { NEW_LINE, randomIntBetween } from "../utils";

const greetingMessage = ({ name }, { randomFn = undefined }) => {
  const repo = [`Hi ${name}!`, `Hello ${name}!`, `Greetings ${name},`];
  const messageIndex = randomFn ? randomFn({ exclusiveMax: repo.length }) : 0;
  return repo[messageIndex];
};

const intentSteps = {
  "getStarted*1": {
    previousStepId: null,
    id: "getStarted*1",
    nextStepId: null,
    text: "this is the text",
    key: "selectedMenuItem",
    optionsFn: "mainMenuOptions",
    options: [
      {
        id: "getStarted*1*1",
        order: 1,
        label: "New package return",
        value: "new_return_order",
        numericValue: "1",
      },
      {
        id: "getStarted*1*2",
        order: 2,
        label: "Visit liiinx.com",
        value: "visit-liiinx.com",
        numericValue: "2",
      },
    ],
  },
};

export default async function () {
  return {
    getMenuForStepId: (stepId: string) => {
      const step = intentSteps[stepId];
      return [step.text, step.options, step.key];
    },
    getNextStepForStepId: (stepId: string) => {},
  };
}

async function default_in_bid({ name, userId }) {
  const message = [];
  message.push(greetingMessage({ name }, { randomFn: randomIntBetween }));

  const options = "1. ab\n2. noon";

  const result = [message.join(NEW_LINE), options];
  return result;
}
