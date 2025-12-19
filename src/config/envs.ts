import 'dotenv/config'; // Usamos la sintaxis import si estás en un proyecto de TS moderno
import { z } from 'zod';

// Definición del esquema de variables de entorno
const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET es requerido'),
  
  DB_HOST: z.string().min(1, 'DB_HOST es requerido'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string().min(1, 'DB_USER es requerido'),
  DB_PASSWORD: z.string().min(1, 'DB_PASSWORD es requerido'),
  DB_NAME: z.string().min(1, 'DB_NAME es requerido'),
});

// Validación y parseo de las variables de entorno
export const envs = envSchema.parse(process.env);

console.log(`Entorno cargado: ${envs.NODE_ENV}`);