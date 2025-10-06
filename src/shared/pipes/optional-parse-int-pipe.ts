import { ParseIntPipe } from '@nestjs/common';

export class OptionalParseIntPipe extends ParseIntPipe {
  constructor() {
    super({
      optional: true,
    });
  }
}
