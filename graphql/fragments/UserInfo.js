import { gql } from 'graphql.macro';

export default gql`
  fragment UserInfo on User {
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
    invitations {
      accountId
      name
      projectId
    }
  }
`;
