import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authRepository } from "./auth.repository.js";
import type { LoginInput, RegisterInput } from "./auth.validation.js";
import { AppError } from "../../middleware/error-handler.js";
import { env } from "../../config/env.js";

const TOKEN_TTL = "7d";

export const authService = {
  async register(input: RegisterInput) {
    const [existingEmail, existingUsername] = await Promise.all([
      authRepository.findByEmail(input.email),
      authRepository.findByUsername(input.username),
    ]);
    if (existingEmail || existingUsername) {
      throw new AppError(409, "Email or username already in use");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await authRepository.createUser({
      email: input.email,
      username: input.username,
      name: input.name ?? input.username,
      password: passwordHash,
    });

    const token = jwt.sign({ sub: user.id, username: user.username }, env.JWT_SECRET, {
      expiresIn: TOKEN_TTL,
    });

    return { user, token };
  },

  async login(input: LoginInput) {
    const user = await authRepository.findByIdentifier(input.identifier);

    if (!user || !user.password || !(await bcrypt.compare(input.password, user.password))) {
      throw new AppError(401, "Invalid credentials");
    }

    const token = jwt.sign({ sub: user.id, username: user.username }, env.JWT_SECRET, {
      expiresIn: TOKEN_TTL,
    });

    return { user, token };
  },
};