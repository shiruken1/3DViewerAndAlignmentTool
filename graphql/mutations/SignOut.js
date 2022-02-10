import { gql } from 'graphql.macro';

export default gql`
  mutation signOut($input: SignOutInput) {
    signOut(input: $input) {
      dummy
    }
  }
`;
