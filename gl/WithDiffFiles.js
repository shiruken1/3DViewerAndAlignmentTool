/* NPM */
import React from 'react';

/* App */
import loader from './loader';

function withFile(WrappedComponent, prefix, selectData) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = selectData(props);
    }
    componentDidMount() {
      selectData(this.props, this.onUpdate);
    }
    componentWillUnmount() {
      if (this.state.cancel) {
        this.state.cancel();
      }
    }
    onUpdate = update => {
      this.setState(() => update);
    };
    render() {
      const { ...rest } = this.props;
      const injected = {
        [`${prefix}Data`]: this.state.data,
        [`${prefix}Error`]: this.state.error,
        [`${prefix}Progress`]: this.state.progress,
      };
      return <WrappedComponent {...rest} {...injected} />;
    }
  };
}

const withHeatmapFile = wrapped =>
  withFile(wrapped, 'scan', (props, onUpdate) =>
    loader.loadScan({ url: props.files.heatmap, noHeatmap: false, onUpdate }),
  );
const withModelFile = wrapped =>
  withFile(wrapped, 'model', (props, onUpdate) =>
    loader.loadModel({ url: props.files.glb, onUpdate }),
  );
const withObjdiffFile = wrapped =>
  withFile(wrapped, 'objdiff', (props, onUpdate) =>
    loader.loadObjDiff({ url: props.files.objdiff, onUpdate }),
  );
const withFiles = wrapped =>
  withHeatmapFile(withModelFile(withObjdiffFile(wrapped)));

export default withFiles;
