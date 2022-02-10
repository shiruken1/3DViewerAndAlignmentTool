import { gql } from 'graphql.macro';

export default gql`
  query scan($id: ID!) {
    scan(id: $id) {
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
      files {
        extractedPlanes
        pointsWithFeatures
      }
      sourceFile
      units
      stats {
        numPoints
        numPlanes
        bestDiffResolution
        averageDiffResolution
      }
    }
  }
`;
