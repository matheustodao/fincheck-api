import { IsNotEmpty, IsString, NotEquals, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

class Env {
  @IsString()
  @IsNotEmpty()
  @NotEquals(process.env.NODE_ENV === 'production' ? 'unsuchsecuresecret' : '')
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;
}

export const env: Env = plainToInstance(Env, {
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.PRISMA_DATABASE_URL,
});

const errors = validateSync(env, { skipMissingProperties: false });

if (errors.length > 0) {
  throw new Error(JSON.stringify(errors, null, 2));
}
