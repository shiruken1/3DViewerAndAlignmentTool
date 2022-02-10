import { gql } from 'graphql.macro';

export default gql`
  fragment ScanInfo on Scan {
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
    files {
      sourceFile
    }
    stats {
      numPoints
      numPlanes
      bestDiffResolution
      averageDiffResolution
    }
    deleted
    units
    uploadProgress @client
  }
`;
