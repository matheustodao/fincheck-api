import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

type TApp<T = any> = INestApplication<T>;

export class FincheckSwagger {
  constructor(private readonly swagger_module: typeof SwaggerModule) {}
  private swagger_settings(): Omit<OpenAPIObject, 'paths'> {
    const config = new DocumentBuilder()
      .setTitle('Fincheck API')
      .setDescription('Fincheck is financial management')
      .setVersion('1.0')
      .build();

    return config;
  }

  private document_factory(app: TApp) {
    const config = this.swagger_settings();

    const document = this.swagger_module.createDocument(app, config);

    return document;
  }

  setup(app: TApp, custom_path?: string) {
    const document = this.document_factory(app);

    this.swagger_module.setup(custom_path || 'swagger', app, document);
  }
}
