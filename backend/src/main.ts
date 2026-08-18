import { NestFactory, Reflector } from '@nestjs/core';
import { ZodSerializerInterceptor, createZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/exceptions/all-exceptions.filter';
import { TransformInterceptor } from './shared/response/transform.interceptor';

const StrictZodValidationPipe = createZodValidationPipe({
  strictSchemaDeclaration: true,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalPipes(new StrictZodValidationPipe());
  app.useGlobalInterceptors(
    new TransformInterceptor(reflector),
    new ZodSerializerInterceptor(reflector),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
