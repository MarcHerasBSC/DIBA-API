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

      /*const relatedBooks = [
        {bookId: "b19778971", confidence: null}, 
        {bookId: "b19207554", confidence: null},
        {bookId: "b11017429", confidence: null},
        {bookId: "b1129145x", confidence: null},
        {bookId: "b19602406", confidence: null}
      ];*/
      
      let relatedBooks = await this.booksRepository.query(
        `SELECT * FROM bibliografic_recommendation(${modifiedID}, 5);`,
      );

      if(relatedBooks.length < 5) relatedBooks = await this.fillRecommendations(relatedBooks);

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
      let formatedRecommendations = recommendations.map((elem) => 
        ({bookId: this.formatBookId(elem.recommended), confidence: Number(elem.confidence.toFixed(2))})
      );
      
      //formatedRecommendations = [];
      if(formatedRecommendations.length < 5) formatedRecommendations = await this.fillRecommendations(formatedRecommendations);
      
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
  
  async fillRecommendations(relatedBooks: any): Promise<any> {
    const missingRecomendations = 5 - relatedBooks.length;
    const topBooksList = await this.booksRepository.query(
      "SELECT bib_id FROM top_bibs ORDER BY tot_chkout DESC"
    );
    let response = relatedBooks;

    for (let i = 0; i < missingRecomendations; i++) {
      const possibleRec = this.findYValues(Math.random()*topBooksList.length-1);
      if(response.findIndex((elem) => elem.recommended === this.formatBookId(topBooksList[possibleRec].bib_id)) === -1) {
        response.push({recommended: this.formatBookId(topBooksList[possibleRec].bib_id), confidence: null});
      }
      else {
        let j = 1;
        while(response.findIndex((elem) => elem.recommended === this.formatBookId(topBooksList[possibleRec+j].bib_id)) !== -1) {
          j++;
          if(possibleRec + j >= topBooksList.length) {
            j = -possibleRec;
          }
        }
        response.push({recommended: this.formatBookId(topBooksList[possibleRec+j].bib_id), confidence: null});
      }
    }
    return response;
  }
  // bibliografic: llibres
  // usuari
  // exemplar: copia
  // circulacio: trasaccions

  findYValues(x) {
    const radius = 49;
    const centerX = 0;
    const centerY = 49;

    if (x > centerX + radius || x < centerX - radius) {
      console.log("No solutions for the given x value.");
    }

    let y1 = (98 + Math.sqrt(98 * 98 - 4 * x * x)) / 2;
    let y2 = (98 - Math.sqrt(98 * 98 - 4 * x * x)) / 2;

    if (y1 <= 49) {
      return Math.round(y1);
    }
    else if (y2 <= 49) {
      return Math.round(y2);
    }
    else {
      console.log("No valid y values for x = " + x + " with y >= 1.");
      return null;
    }
  }

  formatBookId(rawId) {
    // 10000000 has 8 digits. we need to add an x to ids with 7.
    return rawId >= 10000000 ? `b${rawId}` : `b${rawId}x`;
  };
}
