const graphql = require("graphql");
const _ = require("lodash");
const Book = require("../models/book");
const Author = require("../models/author");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

// dummy data
const booksData = [
  {
    name: "The Fellowship of the Ring",
    genre: "Fantasy",
    id: "1",
    authorId: "1"
  },
  { name: "The Two Towers", genre: "Fantasy", id: "2", authorId: "1" },
  { name: "The Return of the King", genre: "Fantasy", id: "3", authorId: "1" },
  { name: "Sorcerer's Stone", genre: "Fantasy", id: "4", authorId: "2" },
  { name: "Chamber of Secrets", genre: "Fantasy", id: "5", authorId: "2" },
  { name: "Prisoner of Azkaban", genre: "Fantasy", id: "6", authorId: "2" },
  { name: "Ender's Game", genre: "Sci-Fi", id: "7", authorId: "3" }
];

const authorsData = [
  { name: "JK Rowling", age: 53, id: "1" },
  { name: "JRR Tolkien", age: 81, id: "2" },
  { name: "Orson Scott Card", age: 67, id: "3" }
];

// Types
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    // link to author data
    author: {
      type: AuthorType,
      resolve(parent, args) {
        // In this case, parent is the initial book requested
        // return _.find(authorsData, { id: parent.authorId });
        return Author.findById(parent.authorId);
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: GraphQLList(BookType),
      resolve(parent, args) {
        // return _.filter(booksData, { authorId: parent.id });
        return Book.find({ authorId: parent.id });
      }
    }
  })
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      // ie. book(id: '123')
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from db or other source
        // return _.find(booksData, { id: args.id });
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return _.find(authorsData, { id: args.id });
        return Author.findById(args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return booksData;
        return Book.find({});
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        // return authorsData;
        return Author.find({});
      }
    }
  }
});

// define what mutations we can make
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        // 'save' is a mongoose db method
        return author.save();
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
