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
      useFactory: async (configService: ConfigService) => {
        try {
          return {
            type: 'postgres',
            host: configService.get('DATABASE_URL'),
            port: configService.get('DATABASE_PORT'),
            username: configService.get('DATABASE_USER'),
            password: configService.get('DATABASE_PWRD'),
            database: 'DIBA-BSC',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
          };
        } catch (error) {
          console.error(error);
          throw new Error('Failed to connect to the database');
        }
      },
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([Book])
  ],
  controllers: [AppController],
  providers: [BooksService],
})

export class AppModule {}
