import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { BooksService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: '84.88.187.146',
        port: 5432,
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PWRD'),
        database: 'DIBA-BSC',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([Book])
  ],
  controllers: [AppController],
  providers: [BooksService],
})

export class AppModule {}
