const NEW_LINE = "\n";

const randomIntBetween = ({ inclusiveMin = 0, exclusiveMax = 0 }) => {
  const minValue = Math.ceil(inclusiveMin);
  const maxValue = Math.floor(exclusiveMax);
  return Math.floor(Math.random() * (maxValue - minValue) + minValue); // The maximum is exclusive and the minimum is inclusive
};

const bold = (text: string) => `**${text}**`;
const italic = (text: string) => `*${text}*`;

const greetingMessage = ({ name }, { randomFn = undefined }) => {
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

const params = { name: "Amir" };
console.log(mainMenu(params));
