import { ArgumentMetadata, ParseUUIDPipe } from '@nestjs/common';

export class OptionalParseUUIDPipe extends ParseUUIDPipe {
  override async transform(
    value: string,
    metadata: ArgumentMetadata,
  ): Promise<string> {
    if (typeof value === 'undefined' || !value) {
      return '';
    }

    return await super.transform(value, metadata);
  }
}
