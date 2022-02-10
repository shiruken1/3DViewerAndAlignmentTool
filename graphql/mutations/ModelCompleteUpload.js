import { gql } from 'graphql.macro';

export default gql`
  mutation modelCompleteUpload($input: ModelCompleteUploadInput!) {
    modelCompleteUpload(input: $input) {
      model {
        id
        name
        description
        accountId
        projectId
        units
        status
      }
    }
  }
`;
