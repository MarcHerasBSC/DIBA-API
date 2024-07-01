import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { BooksService } from './app.service';

@Controller('v1')
export class AppController {
  constructor(private readonly appService: BooksService) {}

  @Get('/books/:bookID')
  async getBookByID(@Param('bookID') bookID): Promise<string> {
    try {
      const response = await this.appService.getRelatedBooks(bookID);
      return response;
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to get book recommendations by ID', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/users/:userID')
  async getBookByUserID(@Param('userID') userID): Promise<string> {
    try {
      const response = await this.appService.getRecommendedBooks(userID);
      return response;
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to get book recommendations by User ID', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

