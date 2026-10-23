import type { NextFunction, Request, Response } from "express";
import { verifyAuthToken } from "../utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        email: string;
      };
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token não informado." });
    return;
  }

  try {
    const payload = verifyAuthToken(authorization.slice(7));

    req.auth = {
      userId: payload.sub,
      email: payload.email,
    };

    next();
  } catch {
    res.status(401).json({ message: "Token inválido ou expirado." });
  }
}
