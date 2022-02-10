import { gql } from 'graphql.macro';

export default gql`
  mutation scanCompleteUpload($input: ScanCompleteUploadInput!) {
    scanCompleteUpload(input: $input) {
      scan {
        id
        name
        description
        accountId
        projectId
        units
        status
        files {
          extractedPlanes
          pointsWithFeatures
        }
        stats {
          numPoints
          numPlanes
          boundingBox {
            min {
              x
              y
              z
            }
            max {
              x
              y
              z
            }
          }
          bestDiffResolution
          averageDiffResolution
        }
      }
    }
  }
`;
