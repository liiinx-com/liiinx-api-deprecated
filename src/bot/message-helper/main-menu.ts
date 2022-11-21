import { NEW_LINE, randomIntBetween } from "./utils";

const greetingMessage = ({ name }, { randomFn = undefined }) => {
  const repo = [`Hi ${name}!`];
  const messageIndex = randomFn ? randomFn({ exclusiveMax: repo.length }) : 0;
  return repo[messageIndex];
};

export default async function ({ name }) {
  const result = [];
  result.push(greetingMessage({ name }, { randomFn: randomIntBetween }));
  result.push(NEW_LINE);
  return result;
}
