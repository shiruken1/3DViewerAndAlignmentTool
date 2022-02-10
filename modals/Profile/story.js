/* NPM */
import React from 'react';

import { Button } from 'semantic-ui-react';

/* App */

import Profile from './component';

class ProfileTest extends React.PureComponent {
  state = {
    modalOpen: false,
    result: '',
  };
  handleOpen = () => this.setState({ modalOpen: true });
  handleClose = () =>
    this.setState({
      modalOpen: false,
      result: 'Canceled',
    });
  handleSave = user =>
    this.setState({
      modalOpen: false,
      result: { Saved: user },
    });

  render() {
    return (
      <div>
        <Button onClick={this.handleOpen}>Show Modal</Button>
        <Profile
          open={this.state.modalOpen}
          onCancel={this.handleClose}
          onSave={this.handleSave}
          {...this.props}
        />
        <pre>{JSON.stringify(this.state.result, null, 2)}</pre>
      </div>
    );
  }
}

export default {
  component: 'Profile',
  stories: {
    'show profile': () => (
      <ProfileTest
        user={{
          firstName: 'Leroy',
          lastName: 'Thompson',
          email: 'leroy@bar.com',
        }}
      />
    ),
  },
};
