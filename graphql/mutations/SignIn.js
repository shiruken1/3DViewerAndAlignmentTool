import { gql } from 'graphql.macro';

import UserInfo from '../fragments/UserInfo';

export default gql`
  mutation signIn($input: SignInInput!) {
    signIn(input: $input) {
      user {
        ...UserInfo
      }
    }
  }

  ${UserInfo}
`;
