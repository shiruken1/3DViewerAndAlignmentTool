import { gql } from 'graphql.macro';

export default gql`
  mutation scanAssociate($input: ScanAssociateInput!) {
    scanAssociate(input: $input) {
      scan {
        id
      }
      diff {
        id
        name
        description
        modelId
        scanId
        aligned
        alignment {
          method
          scanTransform
          scanTranslation
          scanRotation
        }
      }
    }
  }
`;
