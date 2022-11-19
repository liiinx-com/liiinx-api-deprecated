import { Injectable } from "@nestjs/common";

const db = [
  {
    id: 11557,
    activeStepId: null,
    output: {},
    phone: "14375333235",
  },
];

@Injectable()
export class IntentService {
  async getUserById(userId: number) {
    return db.find((user) => user.id === userId);
  }

  async getUserByPhone(phone: string) {
    return db.find((user) => user.phone === phone);
  }

  async updateActiveIntentFor(userId: number, { stepId, output }) {
    const user = await this.getUserById(userId);
    user.activeStepId = stepId;
    if (output) user.output = { ...user.output, ...output };
    console.log("updated user", user);
    return user;
  }

  async getUserActiveIntentInfo(userId: number) {
    const user = await this.getUserById(userId);
    return {
      stepId: user.activeStepId,
      output: user.output,
    };
  }
}
