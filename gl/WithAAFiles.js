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

const withFeaturesFile = wrapped =>
  withFile(wrapped, 'scan', (props, onUpdate) =>
    loader.loadScan({
      url: props.scan.files.pointsWithFeatures,
      noHeatmap: true,
      onUpdate,
    }),
  );
const withModelFile = wrapped =>
  withFile(wrapped, 'model', (props, onUpdate) =>
    loader.loadModel({ url: props.model.files.glb, onUpdate }),
  );

export const withExtractedPlanesFile = wrapped =>
  withFile(wrapped, 'planes', (props, onUpdate) =>
    loader.loadExtractedPlanes({
      url: props.scan.files.extractedPlanes,
      onUpdate,
    }),
  );

const withFiles = wrapped =>
  withFeaturesFile(withModelFile(withExtractedPlanesFile(wrapped)));

export default withFiles;
