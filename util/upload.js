/* NPM */
import pako from 'pako';

/* App */
import modelCompleteUploadMutation from 'graphql/mutations/ModelCompleteUpload';
import scanCompleteUploadMutation from 'graphql/mutations/ScanCompleteUpload';
import modelQuery from 'graphql/queries/Model';
import scanQuery from 'graphql/queries/Scan';

// S3 minimum chunk size for multipart upload is 5MB
const chunkSize = 5 * 1024 * 1024;
// read smaller chunks into deflate
const readChunkSize = 1024 * 1024;

// limit number of concurrent chunks in flight at one time
const MaxConcurrentChunks = 4;

function queriesForType(type) {
  if (type === 'scan') {
    return {
      mutation: scanCompleteUploadMutation,
      query: scanQuery,
    };
  }
  return { mutation: modelCompleteUploadMutation, query: modelQuery };
}

class UploadFile {
  constructor({ upload, file, index }) {
    this.upload = upload;
    this.file = file;
    this.index = index;
    this.progress = 0;
    this.done = false;
    this.numParts = 0;
    this.def = new pako.Deflate({ chunkSize, gzip: true });
    this.readStart = 0;
    this.chunkStart = 0;
    this.currentChunkNum = 0;
    this.inFlight = 0;
    this.canceled = false;
    this.def.onData = chunk => {
      if (this.canceled) {
        return;
      }
      this.inFlight += 1;
      const cblob = new Blob([chunk], { type: 'application/octet-stream' });
      this.sendChunk(cblob);
    };
    this.def.onEnd = status => {
      // onEnd will be called before chunks are uploaded, so don't use this to
      // trigger s3complete mutation.  It should only be used for abnormal
      // termination.
      if (status && !this.canceled) {
        this.error = this.def.msg;
        this.upload.completeUpload(this);
      }
    };
  }
  cancel() {
    this.canceled = true;
  }

  doSlice() {
    // Read a slice of the file and push it into the deflator
    if (this.canceled) {
      return;
    }
    // don't read+compress more if sending is at capacity
    if (this.inFlight >= MaxConcurrentChunks) {
      setTimeout(() => {
        this.doSlice();
      }, 1000);
      return;
    }

    function readSlice(slice, cb) {
      const reader = new FileReader();
      reader.addEventListener('loadend', () => {
        cb(reader.result);
      });
      reader.readAsArrayBuffer(slice);
    }

    const readEnd = Math.min(this.file.size, this.readStart + readChunkSize);
    readSlice(this.file.slice(this.readStart, readEnd), data => {
      if (this.canceled) {
        return;
      }
      this.readStart = readEnd;
      this.def.push(data, readEnd >= this.file.size);
      if (readEnd < this.file.size) {
        setTimeout(() => {
          this.doSlice();
        }, 1);
      }
    });
  }

  start() {
    setTimeout(() => {
      this.doSlice();
    }, 1);
  }

  sendChunk(chunk) {
    // Send a deflated chunk to s3

    if (this.canceled) {
      return;
    }
    const chunkNum = this.currentChunkNum;
    this.currentChunkNum += 1;
    const currentChunkSize = this.readStart - this.chunkStart;
    this.chunkStart = this.readStart;
    this.numParts += 1;
    const { artifactId, psp } = this.upload;
    const fd = new FormData();
    this.upload.psp.fields.forEach(f => fd.append(f.key, f.value));
    fd.append('key', `${artifactId}/part-${this.index}-${chunkNum + 1}`);
    fd.append('file', chunk);

    const self = this;
    let retries = 0;
    let lastProgress = 0;
    function attempt() {
      if (self.canceled) {
        return;
      }
      self.request = new XMLHttpRequest();
      const r = self.request;
      r.onreadystatechange = () => {
        if (r.readyState === 4) {
          self.request = null;
          if (r.status !== 200 && r.status !== 204) {
            // this attempt failed, retries remaining?
            retries += 1;
            if (retries < 3) {
              // can still retrty, so do so
              self.progress -= lastProgress;
              self.upload.updateProgress();
              setTimeout(attempt);
            } else {
              // retries used up, cancel this upload
              self.canceled = true;
              self.upload.completeUpload(self);
            }
          } else {
            self.inFlight -= 1;
            if (!self.inFlight && self.chunkStart >= self.file.size) {
              self.done = true;
              self.upload.completeUpload(self);
            }
          }
        }
      };
      r.upload.onprogress = evt => {
        self.progress -= lastProgress;
        lastProgress = Math.floor((currentChunkSize * evt.loaded) / evt.total);
        self.progress += lastProgress;
        self.upload.updateProgress();
      };
      r.open('POST', psp.url);
      r.send(fd);
    }

    setTimeout(attempt, 1);
  }
}

class Upload {
  constructor({ client, artifact, files, kind }) {
    this.id = Upload.nextId();
    this.client = client;
    this.artifactId = artifact.id;
    this.artifactName = artifact.name;
    this.psp = artifact.uploadPresignedPost;
    this.files = files.map(
      (f, i) => new UploadFile({ upload: this, file: f, index: i }),
    );
    this.kind = kind;

    Upload.uploads.push(this);
    Upload.writeUploads(this.client);
  }

  static nextId() {
    Upload.lastId += 1;
    return String(Upload.lastId);
  }

  static start({ artifact, client, files, kind }) {
    const u = new Upload({ artifact, client, files, kind });
    u.files.forEach(f => f.start());
  }

  static remove({ client, id }) {
    const i = Upload.uploads.findIndex(u => id === u.id);
    Upload.uploads.splice(i, 1);
    Upload.writeUploads(client);
  }

  static writeUploads(client) {
    client.writeData({
      data: {
        uploads: Upload.uploads.map(u => ({
          __typename: 'UploadItem',
          id: u.id,
          artifactId: u.artifactId,
          kind: u.kind,
          name: u.artifactName,
          files: u.files.map(f => ({
            __typename: 'UploadFile',
            fileName: f.file.name,
            fileSize: f.file.size,
            progress: f.progress,
            done: f.done,
          })),
          done: u.files.every(f => f.done),
        })),
        uploading: Upload.uploads.some(u => u.files.some(f => !f.done)),
      },
    });
  }

  updateProgress() {
    Upload.writeUploads(this.client);
  }
  completeUpload(file) {
    Upload.writeUploads(this.client);
    const { artifactId: id, kind } = this;
    const {
      file: { name: fileName },
      index: fileNumber,
      numParts,
    } = file;
    const { mutation, query } = queriesForType(kind);
    this.client.mutate({
      mutation,
      variables: {
        input: {
          id,
          numParts,
          fileName,
          fileNumber,
          lastFile: this.files.every(ff => ff.done),
        },
      },
      refetchQueries: [
        {
          query,
          variables: {
            id,
          },
        },
      ],
    });
  }
}

Upload.lastId = -1;
Upload.uploads = [];

export default Upload;
