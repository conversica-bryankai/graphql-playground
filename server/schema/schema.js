const graphql = require("graphql");
const _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = graphql;

// dummy data
const booksData = [
  {
    name: "The Fellowship of the Ring",
    genre: "Fantasy",
    id: "1",
    authorid: "1"
  },
  { name: "The Two Towers", genre: "Fantasy", id: "2", authorid: "1" },
  { name: "The Return of the King", genre: "Fantasy", id: "3", authorid: "1" },
  { name: "Sorcerer's Stone", genre: "Fantasy", id: "4", authorid: "2" },
  { name: "Chamber of Secrets", genre: "Fantasy", id: "5", authorid: "2" },
  { name: "Prisoner of Azkaban", genre: "Fantasy", id: "6", authorid: "2" },
  { name: "Ender's Game", genre: "Sci-Fi", id: "7", authorid: "3" }
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
        return _.find(authorsData, { id: parent.authorid });
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
        return _.filter(booksData, { authorid: parent.id });
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
        return _.find(booksData, { id: args.id });
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(authorsData, { id: args.id });
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return booksData;
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return authorsData;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
