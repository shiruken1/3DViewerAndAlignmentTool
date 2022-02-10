import { gql } from 'graphql.macro';

export default gql`
  fragment ActivityInfo on Activity {
    id
    verb
    type
    name
    description
    projectName
    creatorFirstName
    creatorLastName
    createdOn
  }
`;
