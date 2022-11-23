import { NEW_LINE, randomIntBetween } from "../utils";

const greetingMessage = ({ name }, { randomFn = undefined }) => {
  const repo = [`Hi ${name}!`, `Hello ${name}!`, `Greetings ${name},`];
  const messageIndex = randomFn ? randomFn({ exclusiveMax: repo.length }) : 0;
  return repo[messageIndex];
};

export default async function ({ name, userId }) {
  return {
    getMenuForStepId: (stepId: string) => ["text", "stringifiedOptions"],
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
