import bcrypt from "bcrypt";
import { UserModel } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import { signAuthToken } from "../utils/jwt.js";

const SALT_ROUNDS = 12;

export const AuthService = {
  async register(input: { email: string; password: string }) {
    const email = input.email.trim().toLowerCase();
    const existingUser = await UserModel.findByEmail(email);

    if (existingUser) {
      throw new AppError("Este e-mail já está cadastrado.", 409);
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await UserModel.create({
      email,
      passwordHash,
    });

    const { password_hash: _passwordHash, ...publicUser } = user;

    const token = signAuthToken({
      sub: user.id,
      email: user.email,
    });

    return { user: publicUser, token };
  },

  async login(input: { email: string; password: string }) {
    const email = input.email.trim().toLowerCase();
    const user = await UserModel.findByEmail(email);

    if (!user || !(await bcrypt.compare(input.password, user.password_hash))) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    const { password_hash: _passwordHash, ...publicUser } = user;

    const token = signAuthToken({
      sub: user.id,
      email: user.email,
    });

    return { user: publicUser, token };
  },
};
