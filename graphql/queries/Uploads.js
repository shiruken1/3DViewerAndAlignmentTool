import { gql } from 'graphql.macro';

export default gql`
  query uploads {
    uploads @client {
      id
      artifactId
      done
      kind
      files {
        done
        fileName
        fileSize
        progress
      }
      name
    }
    uploading @client
  }
`;
