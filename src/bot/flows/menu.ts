const NEW_LINE = "\n";

const randomIntBetween = ({inclusiveMin= 0, exclusiveMax=0}) => {
    
     const minValue = Math.ceil(inclusiveMin);
  const maxValue = Math.floor(exclusiveMax);
  return Math.floor(Math.random() * (maxValue - minValue) + minValue); // The maximum is exclusive and the minimum is inclusive
}

const greetingMessage = ({name}, {randomizer}) => {
    const repo = [`Hi ${name}!`]
    const messageIndex = randomizer ? randomizer({exclusiveMax: repo.length}) : 0
    
}

const mainMenu = async () => {};
