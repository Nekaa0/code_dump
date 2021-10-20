class CloudUpload {
  constructor() {
    this.url = 'https://api.cloudinary.com/v1_1/tix-africa/upload';
    this.progress = 0;
  }

  send(file, preset) {
    const formdata = new FormData();
    if (preset) formdata.append('upload_preset', preset);
    formdata.append('file', file);

    if (process.env.NODE_ENV !== 'production') {
      formdata.append('folder', 'development');
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', this.url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    this.progress = 0;
    xhr.upload.addEventListener('progress', (e) => {
      this.progress = Math.round((e.loaded * 100.0) / e.total);
    });

    this.cancel = () => {
      xhr.abort();
    };

    return new Promise((resolve, reject) => {
      xhr.send(formdata);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } else {
            reject();
          }
        }
      };
    });
  }
}

export default CloudUpload;
