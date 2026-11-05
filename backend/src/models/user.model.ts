import { db } from "../config/database.js";
import type { CreateUserDTO, PublicUser, User } from "../types/user.types.js";

export const UserModel = {
  async findByEmail(email: string): Promise<User | undefined> {
    return db<User>("users")
      .where({ email: email.trim().toLowerCase() })
      .first();
  },

  async findById(id: string): Promise<PublicUser | undefined> {
    return db<User>("users")
      .select("id", "email", "created_at", "updated_at")
      .where({ id })
      .first();
  },

  async create(data: CreateUserDTO): Promise<PublicUser> {
    const [user] = await db<User>("users")
      .insert({
        email: data.email.trim().toLowerCase(),
        password_hash: data.passwordHash,
      })
      .returning(["id", "email", "created_at", "updated_at"]);

    if (!user) {
      throw new Error("Não foi possível criar o usuário.");
    }

    return user;
  },
};
