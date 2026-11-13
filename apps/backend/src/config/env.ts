import {z} from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    NODE_ENV : z
    .enum(["development", "test", "production"])
    .default("development"),

 PORT : z.coerce.number().int().min(1).max(65535).default(4000),

 HOST : z.string().default("0.0.0.0"),

 JWT_SECRET : z.string().min(10),
});

const parsed = envSchema.safeParse(process.env);

if(!parsed.success) {
    console.error("invalid enviroment configuration:", parsed.error.format());
    process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
