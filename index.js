import { getSignature, getPolicy, getHost } from "./utils/helper";

let ossConfig = {
  AccessKeyId: "",
  AccessKeySecret: "",
  bucket: "",
  region: "",
  useBucketPath: "",
};

class OssUpload {
  setConfig(config) {
    ossConfig = Object.assign(ossConfig, config);
  }

  static instance = null;

  static getInstance(config = {}) {
    if (!OssUpload.instance) {
      OssUpload.instance = new OssUpload(config);
    } else {
      this.setConfig(config);
    }

    return OssUpload.instance;
  }

  async upload(file) {
    const { AccessKeyId, useBucketPath } = ossConfig;
    const host = getHost(ossConfig);
    const policy = getPolicy(ossConfig);
    const signature = getSignature(ossConfig, policy);

    const data = {
      key: `${useBucketPath}/${file.name}`,
      policy: policy,
      OSSAccessKeyId: AccessKeyId,
      success_action_status: "200", //让服务端返回200,不然，默认会返回204
      signature: signature,
    };
    console.log(data);

    const formData = new FormData();

    for (let name in data) {
      formData.append(name, data[name]);
    }

    formData.append("file", file);

    return fetch(host, {
      mode: "no-cors",
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((e) => e);
  }
}

export default OssUpload.getInstance();
