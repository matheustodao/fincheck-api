import { createParamDecorator, UnauthorizedException } from '@nestjs/common';
import { IJwtAccessToken } from 'src/types/jwt-access-token';

export const ActiveUser = createParamDecorator<undefined, IJwtAccessToken>(
  (_, context) => {
    const request: Request = context.switchToHttp().getRequest();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user: IJwtAccessToken = request?.['user'];

    if (!user) {
      throw new UnauthorizedException('Authentication token is missing');
    }

    return user;
  },
);

export const ActiveUserId = createParamDecorator<undefined, string>(
  (_, context) => {
    const request: Request = context.switchToHttp().getRequest();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user: IJwtAccessToken = request?.['user'];

    if (!user) {
      throw new UnauthorizedException('Authentication token is missing');
    }

    return user.sub;
  },
);
