import { gql } from 'graphql.macro';

import UserInfo from '../fragments/UserInfo';

export default gql`
  query currentUser {
    currentUser {
      ...UserInfo
    }
  }

  ${UserInfo}
`;
