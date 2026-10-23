import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { UserModel } from "../models/user.model.js";
import { AuthService } from "../services/auth.service.js";

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(72),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const AuthController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const input = registerSchema.parse(req.body);
      const result = await AuthService.register(input);

      res.status(201).json({
        user: result.user,
        accessToken: result.token,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const input = loginSchema.parse(req.body);
      const result = await AuthService.login(input);

      res.status(200).json({
        accessToken: result.token,
      });
    } catch (error) {
      next(error);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.auth) {
        res.status(401).json({ message: "Não autenticado." });
        return;
      }

      const user = await UserModel.findById(req.auth.userId);

      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      const { password_hash: _passwordHash, ...publicUser } = user;

      res.status(200).json({ user: publicUser });
    } catch (error) {
      next(error);
    }
  },
};
