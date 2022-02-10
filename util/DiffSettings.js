import _ from 'lodash';

const defaultValue = {
  __typename: 'DiffSettings',
  autoCamera: true,
  overview: {
    __typename: 'DiffSettingsOverview',
    position: {
      __typename: 'Vector3',
      x: 0,
      y: 0,
      z: 0,
    },
    target: {
      __typename: 'Vector3',
      x: 0,
      y: 0,
      z: 0,
    },
    modelFilters: {
      __typename: 'OverviewModelFilters',
      red: true,
      yellow: true,
      green: true,
      insufficient: true,
      missing: true,
      all: true,
    },
    scanFilters: {
      __typename: 'ScanFilters',
      red: true,
      yellow: true,
      green: true,
      cropped: true,
      all: true,
    },
  },
  focus: {
    __typename: 'DiffSettingsFocus',
    objectId: null,
    objectMode: 'Isolate',
    viewDirection: 'free',
    position: {
      __typename: 'Vector3',
      x: 0,
      y: 0,
      z: 0,
    },
    target: {
      __typename: 'Vector3',
      x: 0,
      y: 0,
      z: 0,
    },
    modelFilters: {
      __typename: 'FocusModelFilters',
      all: true,
    },
    scanFilters: {
      __typename: 'ScanFilters',
      red: true,
      yellow: true,
      green: true,
      cropped: true,
      all: true,
    },
  },
  limits: {
    __typename: 'DiffLimits',
    crop: 5,
    red: 2,
    yellow: 1,
  },
  units: 'inches',
  sortby: {
    __typename: 'DiffSettingsSortBy',
    column: 'name',
    direction: 'descending',
  },
};

function toDiffViewInput({ activeDiffId, diff, diffSettings, params }) {
  function formatCoord(coord) {
    return _.pick(coord, ['x', 'y', 'z']);
  }
  const input = {
    name: params.name,
    description: params.description,
    diffId: activeDiffId,
    overview: {
      position: formatCoord(diffSettings.overview.position),
      target: formatCoord(diffSettings.overview.target),
      modelFilters: _.pick(diffSettings.overview.modelFilters, [
        'red',
        'yellow',
        'green',
        'insufficient',
        'missing',
        'all',
      ]),
      scanFilters: _.pick(diffSettings.overview.scanFilters, [
        'red',
        'yellow',
        'green',
        'cropped',
        'all',
      ]),
    },
    limits: _.pick(diffSettings.limits, ['crop', 'red', 'yellow']),
    units: diffSettings.units || diff.model.units,
  };
  if (diffSettings.focus.objectId) {
    input.focus = {
      position: formatCoord(diffSettings.focus.position),
      target: formatCoord(diffSettings.focus.target),
      objectId: diffSettings.focus.objectId,
      objectMode: diffSettings.focus.objectMode,
      modelFilters: _.pick(diffSettings.focus.modelFilters, ['all']),
      scanFilters: _.pick(diffSettings.focus.scanFilters, [
        'red',
        'yellow',
        'green',
        'cropped',
        'all',
      ]),
    };
  }
  return input;
}

function fromDiffView(view) {
  function withType(obj, type) {
    return {
      __typename: type,
      ...obj,
    };
  }
  function formatCoord(coord) {
    return withType(
      {
        ..._.pick(coord, ['x', 'y', 'z']),
      },
      'Vector3',
    );
  }
  function formatFilters(filters, type) {
    return withType(
      {
        ..._.pick(filters, [
          'red',
          'yellow',
          'green',
          'insufficient',
          'missing',
          'cropped',
          'all',
        ]),
      },
      type,
    );
  }
  function formatLimits(limits) {
    return withType({
      ..._.pick(limits, ['crop', 'red', 'yellow']),
      __typename: 'DiffLimits',
    });
  }
  const diffSettings = {
    autoCamera: false,
    overview: {
      __typename: 'DiffSettingsOverview',
      position: formatCoord(view.overview.position),
      target: formatCoord(view.overview.target),
      modelFilters: formatFilters(
        view.overview.modelFilters,
        'OverviewModelFilters',
      ),
      scanFilters: formatFilters(view.overview.scanFilters, 'ScanFilters'),
    },
    limits: formatLimits(view.limits),
    units: view.units,
  };
  if (view.focus) {
    diffSettings.focus = {
      __typename: 'DiffSettingsFocus',
      objectId: view.focus.objectId,
      objectMode: view.focus.objectMode,
      viewDirection: 'free',
      position: formatCoord(view.focus.position),
      target: formatCoord(view.focus.target),
      modelFilters: formatFilters(view.focus.modelFilters, 'FocusModelFilters'),
      scanFilters: formatFilters(view.focus.scanFilters, 'ScanFilters'),
    };
  } else {
    diffSettings.focus = {
      __typename: 'DiffSettingsFocus',
      objectId: null,
      viewDirection: 'free',
    };
  }
  return diffSettings;
}

export default {
  defaultValue,
  toDiffViewInput,
  fromDiffView,
};
