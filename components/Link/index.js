/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Icon, Menu, Popup } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import pako from 'pako';
import pick from 'lodash.pick';

/* App */
import WithNav from 'graphql/withNav';

export function makeLink({ nav, fields }) {
  const info = pick(nav, fields);
  const link = `${window.location.origin}/?q=${encodeURIComponent(
    btoa(pako.deflate(JSON.stringify(info), { to: 'string' })),
  )}`;
  return link;
}

export function navigate(params, writeNav) {
  try {
    const nav = JSON.parse(
      pako.inflate(atob(decodeURIComponent(params.q)), { to: 'string' }),
    );
    writeNav(nav);
  } catch (e) {} // eslint-disable-line no-empty
}

export const Navigate = ({ params }) => (
  <WithNav>
    {({ writeNav }) => {
      navigate(params, writeNav);
      return <Redirect to="/" />;
    }}
  </WithNav>
);

Navigate.propTypes = {
  params: PropTypes.object.isRequired,
};

const Link = ({ fields }) => (
  <WithNav>
    {nav => (
      <CopyToClipboard text={makeLink({ nav, fields })}>
        <Menu.Item>
          <Popup trigger={<Icon name="copy outline" size="large" />}>
            <Popup.Content>
              Copy link to clipboard.
              <br />
              Read permission required.
            </Popup.Content>
          </Popup>
        </Menu.Item>
      </CopyToClipboard>
    )}
  </WithNav>
);

Link.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

export default Link;
