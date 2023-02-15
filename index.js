import { getSignature, getPolicy, getHost } from "./utils/helper";

let ossConfig = {
  AccessKeyId: "",
  AccessKeySecret: "",
  bucket: "",
  region: "",
  useBucketPath: "",
};

const successCode = 200;

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
      name: file.name,
      key: `${useBucketPath}/${file.name}`,
      policy: policy,
      OSSAccessKeyId: AccessKeyId,
      success_action_status: "200", //让服务端返回200,不然，默认会返回204
      signature: signature,
    };

    const formData = new FormData();

    for (let name in data) {
      formData.append(name, data[name]);
    }

    formData.append("file", file);

    return fetch(host, {
      method: "POST",
      body: formData
    })
      .then(res => {
        if (res.status === successCode) {
          const url = getHost(ossConfig) + `/${useBucketPath}/${file.name}`
          return url;
        } else {
          throw new Error("上传失败");
        }
      })
  }
}

export default OssUpload.getInstance();
