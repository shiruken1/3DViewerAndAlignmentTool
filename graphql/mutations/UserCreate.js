import { gql } from 'graphql.macro';

export default gql`
  mutation userCreate($input: UserCreateInput!) {
    userCreate(input: $input) {
      user {
        id
        firstName
        lastName
        email
        phone
        country
        role
        emailVerified
        createdOn
        company
        type
      }
    }
  }
`;
