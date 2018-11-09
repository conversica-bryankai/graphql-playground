This is a project to create a React/Node web app that uses GraphQL API requests.

Sample Requests:

For one book, get the name, id, and author information

```{
book (id: 2) {
name
author {
name
age
id
}
id
}
}```

Get all the books for one author

```{
  author (id: 3) {
    name
    age
    books{
      name
    }
  }
}```

Get all books with authors
```{
  books {
    name
    author {
      name
    }
  }
}
```
