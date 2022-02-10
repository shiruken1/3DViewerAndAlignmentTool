/* NPM */
import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
/* App */
import WithNav from 'graphql/withNav';

import Align from 'views/Align';
import Diff from 'views/Diff';
import Home from 'views/Home';
import Project from 'views/Project';

import Modals from 'modals';
import View from 'components/View';

const makeView = Component => ({
  content: <Component />,
  menu: Component.Menu && <Component.Menu />,
  linkFields: Component.LinkFields,
});

const viewDefs = {
  align: makeView(Align),
  diff: makeView(Diff),
  home: makeView(Home),
  project: makeView(Project),
};

const Main = () => (
  <React.Fragment>
    <WithNav>
      {({ view }) => {
        const viewDef = viewDefs[view];
        return <View {...viewDef} />;
      }}
    </WithNav>
    <Modals />
  </React.Fragment>
);

export default DragDropContext(HTML5Backend)(Main);
