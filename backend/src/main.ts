import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SeedService } from './product/seed/seed.service';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  try {
    const seedService = app.get(SeedService);
    await seedService.run();
    console.log('✅ Успешно засидились');
  } catch (error) {
    console.error('❌ Ошибка при выполнении сида', error);
  }

  const PORT = process.env.PORT || 3000;
  try {
    await app.listen(PORT);
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  } catch (error) {
    console.error(`❌ Ошибка запуска сервера на порту ${PORT}:`, error);
    process.exit(1);
  }
}

bootstrap();
