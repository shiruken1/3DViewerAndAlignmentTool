import { gql } from 'graphql.macro';

export default gql`
  fragment DiffViewInfo on DiffView {
    id
    name
    description
    modelId
    scanId
    createdBy {
      id
      firstName
      lastName
    }
    createdOn
    focus {
      objectId
      objectMode
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
    }
    overview {
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
      modelFilters {
        red
        yellow
        green
        insufficient
        all
      }
      scanFilters {
        red
        yellow
        green
        cropped
        all
      }
    }
    limits {
      crop
      red
      yellow
    }
    units
  }
`;
