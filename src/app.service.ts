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
    try {
      let modifiedID = id;

      if (id.startsWith('b') || id.startsWith('B')) {
        modifiedID = id.substring(1);
      }

      if (id.endsWith('X') || id.endsWith('x')) {
        modifiedID = modifiedID.substring(0, modifiedID.length - 1);
      }

      const relatedBooks = await this.booksRepository.query(
        `SELECT title FROM bibliografic b WHERE record_n=${modifiedID}`,
      );

      const date = new Date();

      /* TODO: FINISH THIS */
      const stubRelatedBooks = {
        id: id, 
        type: 'books' /*| 'user'*/, 
        recommendations: ["b19778971", "b19207554", "b11017429", "b1129145X", "b19602406"], 
        confidence: [0.88, 0.75, 0.62, 0.45, 0.12], 
        timestamp: date.toISOString()
      }

      return stubRelatedBooks;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get related books');
    }
  }

  async getRecommendedBooks(userId: string): Promise<any> {
    try {
      let modifiedID = userId;

      if (userId.startsWith('.p') || userId.startsWith('.P')) {
        modifiedID = userId.substring(2);
      }

      if (userId.endsWith('X') || userId.endsWith('x')) {
        modifiedID = modifiedID.substring(0, modifiedID.length - 1);
      }

      const recommendedBooks = await this.booksRepository.query(
        `SELECT * FROM usuari WHERE record_n=${modifiedID}`,
      );

      const date = new Date();

      /* TODO: FINISH THIS */
      const stubRecommendedBooks = {
        id: userId, 
        type: /*'books' |*/ 'user', 
        recommendations: ["b19778971", "b19207554", "b11017429", "b1129145X", "b19602406"], 
        confidence: [0.88, 0.75, 0.62, 0.45, 0.12], 
        timestamp: date.toISOString()
      }
      
      return stubRecommendedBooks;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get recommended books');
    }
  }
}

// bibliografic: llibres
// usuari
// exemplar: copia
// circulacio: trasaccions
