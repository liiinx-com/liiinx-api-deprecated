import { NEW_LINE, randomIntBetween } from "../utils";

export default async function ({ name, userId }) {
  const message = [];
  message.push("mmmmmmmmmmmmmmmmeeeeeeeeesssssssssssssss");

  const options = "1. ab\n2. noon";

  const result = [message.join(NEW_LINE), options];
  return result;
}
