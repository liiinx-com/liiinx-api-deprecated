import { NEW_LINE, randomIntBetween } from "./utils";

export default async ({ name }) => {
  return `${name}! this is from heaven`;
};

export const greetingMessage = ({ name }, { randomFn = undefined }) => {
  const repo = [`Hi ${name}!`];
  const messageIndex = randomFn ? randomFn({ exclusiveMax: repo.length }) : 0;
  return repo[messageIndex];
};

const mainMenu = async ({ name }) => {
  const result = [];
  result.push(greetingMessage({ name }, { randomFn: randomIntBetween }));
  result.push(NEW_LINE);
  return result;
};
