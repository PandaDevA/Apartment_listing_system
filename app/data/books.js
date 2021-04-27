const mongoCollections = require('../config/mongoCollections');
const books = mongoCollections.books;
let { ObjectId } = require('mongodb');

const exportedMethods = {
  async getAllBooks() {
    const bookCollection = await books();
    const result = await bookCollection.find({}, {_id: 1, title: 1}).toArray();
    // console.log(result);
    const returnObj = [];
    result.map(book => {
       returnObj.push({
         _id : String(book._id),
        title : book.title
       });
    });
    return returnObj;
  },
  async getBookById(id) {
    if (!id) throw 'ReferenceError: You must provide an id to search for';
    if (typeof(id) != 'string' || id.trim() == '') throw TypeError;
    let parsedId;
    try {
      parsedId = ObjectId(id); 
    } catch (error) {
      throw SyntaxError;
    }

    const bookCollection = await books();
    // bookCollection.aggregate([
    //    {
    //       $project: {
    //          book_id: {
    //             $toString: "$_id"
    //          }
    //       }
    //    } ]);
    // const book = await bookCollection.findOne({ _id: id }, {_id: 0});
    const book =await bookCollection.findOne({_id: parsedId});

    if (!book) throw 'Book not found';
    let tmpId = book._id;
    book._id = String(tmpId);
    return book;
  },

  async addBook(title, author, genre, datePublished, summary) {
    if(title === undefined || author === undefined
     || datePublished === undefined || summary === undefined
     || genre === undefined) throw ReferenceError;
    if(typeof(title)!='string' || title.trim() == '') throw TypeError;
    
    if(typeof(summary)!='string' || summary.trim() == '') throw TypeError;
    
    if(!Array.isArray(genre) || genre.length == 0 || typeof(genre[0]) != 'string' || genre[0].trim()=='') throw TypeError;
    
    if(typeof(author) != 'object') throw TypeError;
    if(typeof(author.authorFirstName) != 'string' || author.authorFirstName.trim() == '') throw TypeError;
    if(typeof(author.authorLastName) != 'string' || author.authorLastName.trim() == '') throw TypeError;

    if(datePublished === undefined || typeof(datePublished) != 'string')  throw TypeError;
    const pubDate = new Date(datePublished);
    if(isNaN(Date.parse(pubDate))) throw TypeError;
    let curDate = new Date();
    if(pubDate < new Date('1/1/1930') || pubDate > curDate) throw RangeError;

    const bookCollection = await books();

    const newBook = {
      title: title,
      author: author,
      genre: genre,
      datePublished: datePublished,
      summary: summary,
      reviews: []
    };

    const newInsertInformation = await bookCollection.insertOne(newBook);
    if (newInsertInformation.insertedCount === 0) throw 'Could not add book';
    const newId = String(newInsertInformation.insertedId);
    return await this.getBookById(newId);
  },
  async removeBook(id) {
    if (!id) throw 'ReferenceError: You must provide an id to search for';
    if (typeof(id) != 'string' || id.trim() == '') throw TypeError;
    
    let parsedId;
    try {
      parsedId = ObjectId(id); 
    } catch (error) {
      throw SyntaxError;
    }

    const bookCollection = await books();
    let book = null;
    try {
      book = await this.getBookById(id);
    } catch (e) {
      console.log(e);
      return;
    }
    const deletionInfo = await bookCollection.removeOne({ _id: parsedId });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete book with id of ${id}`;
    }
    return {"bookId": id, "deleted": true};
  },

  async updateBook(id, updatedBook) {
    if (!id) throw 'ReferenceError: You must provide an id to search for';
    if (typeof(id) != 'string' || id.trim() == '') throw TypeError;
    let parsedId;
    try {
      parsedId = ObjectId(id); 
    } catch (error) {
      throw SyntaxError;
    }

    const bookCollection = await books();

    const updatedBookData = {};

    if(updatedBook.author === undefined) throw ReferenceError;
    if(typeof(updatedBook.author) != 'object') throw TypeError;
    if(typeof(updatedBook.author.authorFirstName) != 'string' || updatedBook.author.authorFirstName.trim() == '') throw TypeError;
    if(typeof(updatedBook.author.authorLastName) != 'string' || updatedBook.author.authorLastName.trim() == '') throw TypeError;
    updatedBookData.author = updatedBook.author;

    if(updatedBook.title === undefined) throw ReferenceError;
    if(typeof(updatedBook.title)!='string' || updatedBook.title.trim() == '') throw TypeError;
    updatedBookData.title = updatedBook.title;

    if (updatedBook.genre === undefined) throw ReferenceError;
    if(!Array.isArray(updatedBook.genre) || updatedBook.genre.length == 0 || typeof(updatedBook.genre[0]) != 'string' || updatedBook.genre[0].trim()=='') throw TypeError;
    updatedBookData.genre = updatedBook.genre;

    if(updatedBook.datePublished === undefined || typeof(updatedBook.datePublished) != 'string')  throw TypeError;
    const pubDate = new Date(updatedBook.datePublished);
    if(isNaN(Date.parse(pubDate))) throw TypeError;
    let curDate = new Date();
    if(pubDate < new Date('1/1/1930') || pubDate > curDate) throw RangeError;
    updatedBookData.datePublished = updatedBook.datePublished;

    if (updatedBook.summary === undefined) throw ReferenceError;
    if(typeof(updatedBook.summary)!='string' || updatedBook.summary.trim() == '') throw TypeError;
    updatedBookData.summary = updatedBook.summary;

    const updatedInfo = await bookCollection.updateOne({ _id: parsedId }, { $set: updatedBookData });

    if (updatedInfo.modifiedCount === 0) {
      throw 'could not update movie successfully';
    }

    return await this.getBookById(id);
  },
};

module.exports = exportedMethods;
