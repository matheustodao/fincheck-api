import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_CONSTANTS } from './constants';
import { IJwtAccessToken } from 'src/types/jwt-access-token';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/shared/decorators/is-public';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwt_service: JwtService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token is missing');
    }

    try {
      const payload: IJwtAccessToken = await this.jwt_service.verifyAsync(
        token,
        {
          secret: JWT_CONSTANTS.secret,
        },
      );

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const authorization: string = request.headers['authorization'] ?? '';

    const [type, token] = authorization?.split(' ') ?? [];

    return type?.toLowerCase() === 'bearer' ? token : undefined;
  }
}
