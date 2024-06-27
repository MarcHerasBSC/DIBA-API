import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BooksService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '84.88.187.146',
      port: 5432,
      username: 'david',
      password: 'davidbsc',
      database: 'DIBA-BSC',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Book])
  ],
  controllers: [AppController],
  providers: [BooksService],
})
export class AppModule {}
