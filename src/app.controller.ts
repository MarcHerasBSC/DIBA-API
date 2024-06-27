import { Controller, Get, Param } from '@nestjs/common';
import { BooksService } from './app.service';

@Controller('recommendations')
export class AppController {
  constructor(private readonly appService: BooksService) {}

  @Get('/books/:bookID')
  async getBookByID(@Param('bookID') bookID): Promise<string> {
    const response = await this.appService.getRelatedBooks(bookID);
    return response;
  }

  @Get('/users/:userID')
  async getBookByUserID(@Param('userID') userID): Promise<string> {
    const response = await this.appService.getRecommendedBooks(userID);
    return response;
  }
}
