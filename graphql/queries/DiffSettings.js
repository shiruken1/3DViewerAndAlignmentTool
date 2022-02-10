import { gql } from 'graphql.macro';

export default gql`
  query diffSettings {
    diffSettings @client {
      autoCamera
      focus {
        objectId
        objectMode
        viewDirection
        modelFilters {
          all
        }
        scanFilters {
          red
          yellow
          green
          cropped
          all
        }
        position {
          x
          y
          z
        }
        target {
          x
          y
          z
        }
      }
      overview {
        modelFilters {
          red
          yellow
          green
          insufficient
          missing
          all
        }
        scanFilters {
          red
          yellow
          green
          cropped
          all
        }
        position {
          x
          y
          z
        }
        target {
          x
          y
          z
        }
      }
      limits {
        crop
        red
        yellow
      }
      units
      sortby {
        column
        direction
      }
    }
  }
`;
