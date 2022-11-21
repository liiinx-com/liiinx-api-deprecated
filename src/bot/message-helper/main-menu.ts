import { NEW_LINE, randomIntBetween } from "./utils";

const greetingMessage = ({ name }, { randomFn = undefined }) => {
  const repo = [`Hi ${name}!`, `Hello ${name}!`, `Greetings ${name},`];
  const messageIndex = randomFn ? randomFn({ exclusiveMax: repo.length }) : 0;
  return repo[messageIndex];
};

export default async function ({ name, userId }) {
  const result = [];

  result.push(greetingMessage({ name }, { randomFn: randomIntBetween }));

  return result.join(NEW_LINE);
}
