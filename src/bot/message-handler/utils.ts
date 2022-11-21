export const NEW_LINE = "\n";

export const randomIntBetween = ({ inclusiveMin = 0, exclusiveMax = 0 }) => {
  const minValue = Math.ceil(inclusiveMin);
  const maxValue = Math.floor(exclusiveMax);
  return Math.floor(Math.random() * (maxValue - minValue) + minValue); // The maximum is exclusive and the minimum is inclusive
};

export const bold = (text: string) => `**${text}**`;
export const italic = (text: string) => `*${text}*`;
