import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BooksService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    
  ],
  controllers: [AppController],
  providers: [BooksService],
})
export class AppModule {}
