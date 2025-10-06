import { ParseEnumPipe } from '@nestjs/common';

export class OptionalParseEnumPipe<T = any> extends ParseEnumPipe<T> {
  constructor(...args: ConstructorParameters<typeof ParseEnumPipe<T>>) {
    super(args[0], {
      ...args[1],
      optional: true,
    });
  }
}
