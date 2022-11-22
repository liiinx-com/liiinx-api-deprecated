import { NEW_LINE, randomIntBetween } from "../utils";

const options = [
  {
    id: "hi*1*1",
    order: 1,
    label: "New package return",
    value: "new_return_order",
    numericValue: "1",
  },
  {
    id: "hi*1*2",
    order: 2,
    label: "Visit liiinx.com",
    value: "visit-liiinx.com",
    numericValue: "2",
  },
];

const greetingMessage = ({ name }, { randomFn = undefined }) => {
  const repo = [`Hi ${name}!`, `Hello ${name}!`, `Greetings ${name},`];
  const messageIndex = randomFn ? randomFn({ exclusiveMax: repo.length }) : 0;
  return repo[messageIndex];
};

export default async function (stepId, { name, userId }) {
  const message = [];
  message.push(greetingMessage({ name }, { randomFn: randomIntBetween }));

  const updatedOptions = options
    .sort((a: any, b: any) =>
      a.order > b.order ? 1 : b.order > a.order ? -1 : 0,
    )
    .map(({ numericValue, label }) => `${numericValue}. ${label}`)
    .join(NEW_LINE);

  const result = [message.join(NEW_LINE), updatedOptions];
  return result;
}
