import gql from 'graphql-tag';

// If you add/remove a feature, remember to do so in both places

export const query = gql`
  {
    features @client {
      bigWorkspaceCards
    }
  }
`;

export default {
  bigWorkspaceCards: {
    name: 'Big Workspace Cards',
    value: false,
    description: 'Use larger non-scrolling cards for workspace',
  },
};
