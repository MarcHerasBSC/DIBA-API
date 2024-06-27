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

  async getRelatedBooks(id: string): Promise<any> { //Promise<Book[]> {
    // Here you would write your logic to fetch related books from the database
    // This is just a placeholder and should be replaced with actual implementation
    const relatedBooks = await this.booksRepository.query(`SELECT title FROM books b WHERE record_n=${id}`);
    //const relatedBooks = "[{ id: 01854432, title: 'The Hunger Games' }, { id: 44320985, title: 'Divergent' }, { id: 76002455, title: 'Harry Potter' }]";
    return relatedBooks;
  }

  async getRecommendedBooks(userId: string): Promise<string> { //Promise<Book[]> {
    // Here you would write your logic to fetch recommended books from the database
    // This is just a placeholder and should be replaced with actual implementation
    const recommendedBooks = await this.booksRepository.query(`SELECT title FROM books WHERE record_n=${userId}`);
    //const recommendedBooks = "[{ id: 00001792, title: 'The Song of Achilles' }, { id: 8541096, title: 'Percy Jackson' }, { id: 53318074, title: 'Mirall Trencat' }]";
    return recommendedBooks;
  }
}
