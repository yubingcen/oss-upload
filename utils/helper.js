import { encode } from "js-base64";
import { HmacSHA1 } from "crypto-js";
import Base64 from "crypto-js/enc-base64";

export function getPolicy(config) {
  const { bucket } = config;
  const expirationHours = 1;

  const curTime = new Date();
  curTime.setHours(curTime.getHours() + expirationHours);
  const utcTime = curTime.toISOString();

  const policyText = {
    expiration: utcTime, // 为Policy指定合理的有效时长，格式为UTC时间。Policy失效后，则无法通过此Policy上传文件。
    conditions: [
      { bucket: bucket },
      ["content-length-range", 0, 1048576000], // 设置上传文件的大小限制
    ],
  };

  return encode(JSON.stringify(policyText));
}

export function getSignature(config, policy) {
  const { AccessKeySecret } = config;

  const bytes = HmacSHA1(policy, AccessKeySecret);

  return Base64.stringify(bytes);
}

export function getHost(config) {
  const { bucket, region } = config;
  const protocol = location.protocol;

  return `${protocol}//${bucket}.${region}.aliyuncs.com`;
}
