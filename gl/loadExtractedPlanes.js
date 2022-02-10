import preparePlanes from './preparePlanes';
import testFiles from './testFiles';

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
        const xhr = new XMLHttpRequest();
        xhr.open('GET', testFiles.planes || url);
        xhr.onerror = () => {
          postUpdate({ url, error: `Error receiving URL: ${url}` });
        };
        xhr.onload = () => {
          const response = JSON.parse(xhr.responseText);
          const data = preparePlanes(response);

          // eslint-disable-next-line no-console
          console.log(`Planes loaded - count: ${data.children.length}`);

          postUpdate({ url, data, progress: 100 });
        };
        xhr.onprogress = evt => {
          if (evt.lengthComputable) {
            postUpdate({
              url,
              progress: (evt.loaded / evt.total) * 100,
              cancel: () => xhr.currentTarget && xhr.currentTarget.abort(),
            });
          }
        };
        xhr.send();
      },
    );
  }
  return cache.get(url);
};
