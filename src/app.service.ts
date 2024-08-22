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

      const relatedBooks = [
        {bookId: "b19778971", confidence: null}, 
        {bookId: "b19207554", confidence: null},
        {bookId: "b11017429", confidence: null},
        {bookId: "b1129145x", confidence: null},
        {bookId: "b19602406", confidence: null}
      ];
      /*await this.booksRepository.query(
        `SELECT title FROM bibliografic b WHERE record_n=${modifiedID}`,
      );*/

      const date = new Date();

      const reply = {
        id: id,
        type: 'books',
        recommendations: relatedBooks,
        timestamp: date.toISOString()
      }

      return reply;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get related books');
    }
  }

  formatBookId(rawId) {
    // 10000000 has 8 digits. we need to add an x to ids with 7.
    return rawId >= 10000000 ? `b${rawId}` : `b${rawId}x`;
  };

  async getRecommendedBooks(userId: string): Promise<any> {
    try {
      let modifiedID = userId;

      if (userId.startsWith('.p') || userId.startsWith('.P')) {
        modifiedID = userId.substring(2);
      }

      if (userId.endsWith('X') || userId.endsWith('x')) {
        modifiedID = modifiedID.substring(0, modifiedID.length - 1);
      }

      const recommendations = await this.booksRepository.query(
        `SELECT * FROM usuari_recommendation(${modifiedID},5);`,
      );

      /** Add b || x to ids */
      const formatedRecommendations = recommendations.map((elem) => 
        ({bookId: this.formatBookId(elem.recommended), confidence: Number(elem.confidence.toFixed(2))})
      );

      const date = new Date();

      const recommendedBooks = {
        id: userId, 
        type: 'user',
        recommendation: formatedRecommendations,
        timestamp: date.toISOString()
      };
      
      return recommendedBooks;
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
