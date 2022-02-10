/* NPM */

/* App */
import loadExtractedPlanes from './loadExtractedPlanes';
import loadModel from './loadModel';
import loadObjDiff from './loadObjDiff';
import loadScan from './loadScan';

class Cache {
  // don't use the whole url as the cache key
  // it includes an access token which will change periodically
  static parse(url) {
    const parts = url.split('?')[0].split('/');
    const id = parts[3];
    const type = parts[4];
    return { id, type };
  }

  get(url) {
    const { type, id } = Cache.parse(url);
    return (this[type] && this[type][id]) || { url, data: null, progress: 0 };
  }

  getOrLoad(url, onHave, onLoad) {
    const { type, id } = Cache.parse(url);
    if (this[type] && this[type][id]) {
      onHave(this[type][id]);
      return;
    }
    this[type] = {
      [id]: {
        url,
        data: null,
        progress: 0,
      },
    };
    onLoad();
  }

  put(update) {
    const { type, id } = Cache.parse(update.url);
    Object.assign(this[type][id], update);
  }
}
const cache = new Cache();

export default {
  loadModel: loadModel(cache),
  loadScan: loadScan(cache),
  loadObjDiff: loadObjDiff(cache),
  loadExtractedPlanes: loadExtractedPlanes(cache),
};
