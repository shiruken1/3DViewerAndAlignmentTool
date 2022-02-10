/* App */
import prepareModel from './prepareModel';
import testFiles from './testFiles';
import THREE from './three';

export default cache => ({ url, onUpdate }) => {
  if (onUpdate) {
    const postUpdate = update => {
      cache.put(update);
      onUpdate(update);
    };

    cache.getOrLoad(
      url,
      data => onUpdate(data),
      () => {
        const loader = new THREE.GLTFLoader();
        loader.load(
          testFiles.glb || url,
          gltf => {
            prepareModel(gltf);
            // eslint-disable-next-line no-console
            console.log(
              `Model loaded - objects: ${
                Object.keys(gltf.scene.objects).length
              }`,
            );
            postUpdate({
              url,
              data: gltf.scene,
              progress: 100,
            });
          },
          xhr => {
            const total =
              xhr.total ||
              parseInt(
                xhr.target.getResponseHeader('x-amz-meta-content-length'),
                10,
              );

            postUpdate({
              url,
              progress: (100 * xhr.loaded) / total,
              cancel:
                xhr.loaded !== xhr.total && (() => xhr.currentTarget.abort()),
            });
          },
          error => {
            postUpdate({ url, error });
          },
        );
      },
    );
  }
  return cache.get(url);
};
