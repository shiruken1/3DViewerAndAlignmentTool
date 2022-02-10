/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

import { Button, Checkbox, Header, Icon, Modal } from 'semantic-ui-react';

/* App */
import featureDefs from 'lib/featureDefs';

export default class Features extends React.PureComponent {
  static propTypes = {
    features: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    writeFeatures: PropTypes.func.isRequired,
  };

  toggle = k => () =>
    this.props.writeFeatures({ [k]: !this.props.features[k] });

  render() {
    const { features, onClose } = this.props;
    return (
      <Modal open>
        <Header content="Experimental Features" />
        <Modal.Content>
          <div>
            {Object.keys(features)
              .filter(k => k !== '__typename')
              .map(k => (
                <div key={k} style={{ display: 'flex' }}>
                  <Checkbox checked={features[k]} onChange={this.toggle(k)} />
                  <div style={{ marginLeft: '1.5em' }}>
                    <h4>{featureDefs[k].name}</h4>
                    <p>{featureDefs[k].description}</p>
                  </div>
                </div>
              ))}
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={onClose}>
            <Icon name="close" /> Close
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
