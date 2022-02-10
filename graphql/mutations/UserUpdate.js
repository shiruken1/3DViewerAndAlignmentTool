import { gql } from 'graphql.macro';

export default gql`
  mutation userUpdate($input: UserUpdateInput!) {
    userUpdate(input: $input) {
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
      }
    }
  }
`;
