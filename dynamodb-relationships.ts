import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// Types for our entities
interface Author {
  authorId: string;
  name: string;
  email: string;
}

interface Book {
  bookId: string;
  authorId: string;
  title: string;
  publishedYear: number;
  // GSI1 attributes
  GSI1PK: string;
  GSI1SK: string;
}

class AuthorBookService {
  private dynamoDB: DynamoDB.DocumentClient;
  private readonly tableName = 'AuthorBooks';

  constructor() {
    this.dynamoDB = new DynamoDB.DocumentClient();
  }

  // Create an author
  async createAuthor(name: string, email: string): Promise<Author> {
    const author: Author = {
      authorId: `AUTH#${uuidv4()}`,
      name,
      email
    };

    await this.dynamoDB.put({
      TableName: this.tableName,
      Item: {
        PK: author.authorId,
        SK: 'METADATA',
        ...author
      }
    }).promise();

    return author;
  }

  // Create a book for an author
  async createBook(authorId: string, title: string, publishedYear: number): Promise<Book> {
    const book: Book = {
      bookId: `BOOK#${uuidv4()}`,
      authorId,
      title,
      publishedYear,
      // GSI1 attributes for querying books by author
      GSI1PK: authorId,
      GSI1SK: `BOOK#${publishedYear}#${title}`
    };

    await this.dynamoDB.put({
      TableName: this.tableName,
      Item: {
        PK: book.bookId,
        SK: 'METADATA',
        ...book
      }
    }).promise();

    return book;
  }

  // Get an author by ID
  async getAuthor(authorId: string): Promise<Author | null> {
    const result = await this.dynamoDB.get({
      TableName: this.tableName,
      Key: {
        PK: authorId,
        SK: 'METADATA'
      }
    }).promise();

    return (result.Item as Author) || null;
  }

  // Get all books by an author
  async getBooksByAuthor(authorId: string): Promise<Book[]> {
    const result = await this.dynamoDB.query({
      TableName: this.tableName,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :authorId',
      ExpressionAttributeValues: {
        ':authorId': authorId
      }
    }).promise();

    return (result.Items as Book[]) || [];
  }

  // Get a book by ID
  async getBook(bookId: string): Promise<Book | null> {
    const result = await this.dynamoDB.get({
      TableName: this.tableName,
      Key: {
        PK: bookId,
        SK: 'METADATA'
      }
    }).promise();

    return (result.Item as Book) || null;
  }
}

// Example usage
async function example() {
  const service = new AuthorBookService();

  // Create an author
  const author = await service.createAuthor('J.K. Rowling', 'jk@example.com');

  // Create multiple books for the author
  await service.createBook(author.authorId, 'Harry Potter 1', 1997);
  await service.createBook(author.authorId, 'Harry Potter 2', 1998);

  // Get all books by the author
  const books = await service.getBooksByAuthor(author.authorId);
  console.log('Author\'s books:', books);
}
