import type { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/user.model.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { AuthService } from "../services/auth.service.js";

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
        res.status(401).json({ message: "Sessão inválida." });
        return;
      }

      const { password_hash: _passwordHash, ...publicUser } = user;

      res.status(200).json({ user: publicUser });
    } catch (error) {
      next(error);
    }
  },
};
