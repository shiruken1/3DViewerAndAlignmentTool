import { gql } from 'graphql.macro';

export default gql`
  query model($id: ID!) {
    model(id: $id) {
      id
      projectId
      name
      description
      status
      units
      sourceFile
      files {
        glb
      }
      stats {
        numObjects
      }
      uploadPresignedPost {
        url
        fields {
          key
          value
        }
      }
    }
  }
`;
