import { getSignature, getPolicy, getHost } from "./utils/helper";

let ossConfig = {
  AccessKeyId: "",
  AccessKeySecret: "",
  bucket: "",
  region: "",
  useBucketPath: "", // Bucket 下的某个路径
  projectPath: "", // useBucketPath 下的某个路径
  CDNUrlPath: "",
};

const successCode = 200;

class OssUpload {
  setConfig(config) {
    ossConfig = Object.assign(ossConfig, config);
  }

  static instance = null;

  static getInstance(config = {}) {
    if (!OssUpload.instance) {
      OssUpload.instance = new OssUpload();
      OssUpload.instance.setConfig(config);
    } else {
      OssUpload.instance.setConfig(config);
    }

    return OssUpload.instance;
  }

  /**
   * 上传文件
   * @param file
   * @param resourceType
   * @returns {Promise<Response>}
   */
  async upload(file, resourceType = "") {
    if (!File.prototype.isPrototypeOf(file)) {
      throw new Error("请传入 File 类型的文件");
    }

    const { AccessKeyId, useBucketPath, projectPath, CDNUrlPath } = ossConfig;
    const host = getHost(ossConfig);
    const policy = getPolicy(ossConfig);
    const signature = getSignature(ossConfig, policy);

    const fileName = file.name;
    const ossPath = `${useBucketPath}/${projectPath}/${fileName}`;

    const data = {
      name: fileName,
      key: ossPath,
      policy: policy,
      OSSAccessKeyId: AccessKeyId,
      success_action_status: successCode, //让服务端返回200,不然，默认会返回204
      signature: signature,
    };

    const formData = new FormData();

    for (let name in data) {
      formData.append(name, data[name]);
    }

    formData.append("file", file);

    return fetch(host, {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (res.status === successCode) {
        let url;

        const cdnUrl = `${CDNUrlPath}/${projectPath}/${fileName}`;
        const originUrl = getHost(ossConfig) + `/${ossPath}`;

        if (resourceType === "") {
          if (CDNUrlPath) {
            url = cdnUrl;
          } else {
            url = originUrl;
          }
        } else if (resourceType === "oss") {
          url = originUrl;
        } else if (resourceType === "cdn") {
          url = cdnUrl;
        }

        return url;
      } else {
        throw new Error("上传失败");
      }
    });
  }
}

export default OssUpload.getInstance();
