//TYPES

interface User {
  id: string;
  name: string;
}

export class IntentManager {
  async getActiveIntentByUserId(userId: string) {}
  async loadAssets() {}
}

const getUserByPhone = async (phone: string): Promise<User> => {
  return { id: "11557", name: "Amir Zad" };
};

const manager = new IntentManager();
