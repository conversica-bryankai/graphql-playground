import React, { Component } from "react";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";
import { Button, Form } from "semantic-ui-react";

const getAuthorsQuery = gql`
  {
    authors {
      name
      id
    }
  }
`;

class AddBook extends Component {
  displayAuthors() {
    const data = this.props.data;
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
          value: author.name
        };
      });
    }
  }

  render() {
    return (
      <Form id="add-book">
        <Form.Field>
          <label>Book Name</label>
          <input placeholder="Book Name" />
        </Form.Field>
        <Form.Field>
          <label>Genre</label>
          <input placeholder="Genre" />
        </Form.Field>
        <Form.Select
          fluid
          label="Author"
          placeholder="Author"
          options={this.displayAuthors()}
        />
        <Button type="submit">Submit</Button>
      </Form>
    );
  }
}

export default graphql(getAuthorsQuery)(AddBook);
