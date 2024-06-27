import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';

@Injectable()
export class AppService {
  getHello(string: string): string {
    return 'Hello, ' + string + '!';
  }
}

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async getRelatedBooks(id: string): Promise<any> {
    let modifiedID = id;

    if(id.startsWith("b") || id.startsWith("B")) {
      modifiedID = id.substring(1);
    }

    if(id.endsWith("X") || id.endsWith("x")) {
      modifiedID = modifiedID.substring(0, modifiedID.length-1);
    }

    console.log(modifiedID);
    const relatedBooks = await this.booksRepository.query(`SELECT title FROM books b WHERE record_n=${modifiedID}`);
    return relatedBooks;
  }

  async getRecommendedBooks(userId: string): Promise<any> { 
    let modifiedID = userId;

    if(userId.startsWith(".p") || userId.startsWith(".P")) {
      modifiedID = userId.substring(2);
    }

    if(userId.endsWith("X") || userId.endsWith("x")) {
      modifiedID = modifiedID.substring(0, modifiedID.length-1);
    }

    console.log(modifiedID);
    const recommendedBooks = await this.booksRepository.query(`SELECT title FROM books WHERE record_n=${modifiedID}`);
    return recommendedBooks;
  }
}
