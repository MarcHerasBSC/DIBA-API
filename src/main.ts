import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('DIBA-Recommendations')
    .setDescription('The available endpoints to test out the DIBA-BSC API.')
    .setVersion('1.0')
    .addTag('RECOMMENDATIONS')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  try {
    await app.listen(3000);
  } catch (error) {
    console.error(`Failed to start the server: ${error}`);
  }
  
}
bootstrap();
