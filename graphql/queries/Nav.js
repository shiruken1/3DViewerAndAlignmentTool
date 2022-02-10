import { gql } from 'graphql.macro';

export default gql`
  query nav {
    nav @client {
      activeAccountId
      activeDiffId
      activeDiffViewId
      activeModelId
      activeProjectId
      activeScanId
      adminMode
      associatedDiffIds
      associatedModelIds
      associatedScanIds
      debugMode
      diffIdInCart
      fullScreen
      modal
      view
    }
  }
`;
