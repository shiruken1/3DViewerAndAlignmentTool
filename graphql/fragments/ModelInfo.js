import { gql } from 'graphql.macro';

export default gql`
  fragment ModelInfo on Model {
    id
    name
    description
    status
    createdBy {
      id
      firstName
      lastName
    }
    createdOn
    sourceFile
    units
    deleted
    files {
      sourceFile
      sourceFile2
    }
    stats {
      numObjects
    }
    uploadProgress @client
  }
`;
