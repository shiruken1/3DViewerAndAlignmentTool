/*
Load a file in chunks using range requests.

First, get the header so we can display progress.
Then get the body in chunks.
*/

function GetFile(uri, start, end, binary) {
  if (start < 0 || start > end) {
    throw new RangeError('Invalid range for GetFile');
  }
  const result = new Promise((resolve, reject) => {
    // eslint-disable-line compat/compat
    const xhr = new XMLHttpRequest();
    xhr.open('GET', uri, true);
    if (binary) xhr.responseType = 'arraybuffer';
    xhr.setRequestHeader('Range', `bytes=${start}-${end}`);
    xhr.onloadend = () => {
      if (xhr.status === 206 || xhr.status === 200) {
        const range = xhr.getResponseHeader('Content-Range');
        const length = parseInt(range.split('/')[1], 10);
        const data = binary ? xhr.response : xhr.responseText;
        resolve({
          start,
          end,
          length,
          data,
        });
      } else {
        reject(new Error(`Error receiving URL: ${uri}`));
      }
    };
    xhr.send(null);
  });
  result.start = start;
  return result;
}

export default async function LoadFileChunked({
  binary,
  chunkSize,
  headerSize,
  onStart,
  onChunk,
  onDone,
  onHeader,
  uri,
}) {
  let canceled = false;
  onStart({
    cancel: () => {
      canceled = true;
    },
  });

  const receiveBinary = !!binary;

  // get header first
  const { data: header, length } = await GetFile(
    uri,
    0,
    headerSize - 1,
    receiveBinary,
  );
  if (!canceled) onHeader(header);

  // then remainder in chunks
  const inFlight = [];
  const maxInFlight = 4;
  let start = headerSize;
  while (start < length || inFlight.length) {
    while (!canceled && start < length && inFlight.length < maxInFlight) {
      const end = Math.min(
        length,
        start + chunkSize + (start ? 0 : headerSize),
      );
      inFlight.push(GetFile(uri, start, end - 1, receiveBinary));
      start = end;
    }
    // if (canceled) return;
    const next = await Promise.race(inFlight); // eslint-disable-line no-await-in-loop
    if (!canceled) onChunk(next.data);
    inFlight.splice(inFlight.findIndex(p => p.start === next.start), 1);
  }
  onDone();
}
