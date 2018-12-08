import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { Button, Form } from "semantic-ui-react";
import {
  getBooksQuery,
  getAuthorsQuery,
  addBookMutation
} from "../queries/queries";

class AddBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      genre: "",
      authorId: ""
    };
  }

  displayAuthors() {
    const data = this.props.getAuthorsQuery;
    if (data.loading) {
      return [
        {
          text: "Loading Authors...",
          value: "Loading Authors...",
          disabled: true
        }
      ];
    } else {
      return data.authors.map(author => {
        return {
          key: author.id,
          text: author.name,
          value: author.id
        };
      });
    }
  }

  handleSubmitForm(e) {
    e.preventDefault();
    this.props.addBookMutation({
      variables: {
        name: this.state.name,
        genre: this.state.genre,
        authorId: this.state.authorId
      },
      refetchQueries: [{ query: getBooksQuery }]
    });
  }

  render() {
    return (
      <Form id="add-book" onSubmit={this.handleSubmitForm.bind(this)}>
        <Form.Field>
          <label>Book Name</label>
          <input
            placeholder="Book Name"
            onChange={e => this.setState({ name: e.target.value })}
          />
        </Form.Field>
        <Form.Field>
          <label>Genre</label>
          <input
            placeholder="Genre"
            onChange={e => this.setState({ genre: e.target.value })}
          />
        </Form.Field>
        <Form.Select
          fluid
          label="Author"
          placeholder="Author"
          options={this.displayAuthors()}
          onChange={(e, d) => {
            this.setState({ authorId: d.value });
          }}
        />
        <Button type="submit">Add Book</Button>
      </Form>
    );
  }
}

export default compose(
  graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
  graphql(addBookMutation, { name: "addBookMutation" })
)(AddBook);
