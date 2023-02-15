import OssUpload from "./index";

import { ossConfig } from "./config.example";

import img from "./test.jpeg";

OssUpload.setConfig({
  ...ossConfig,
});

let isUpload = false;

window.onload = () => {
  const btn = document.getElementById("btn");
  btn.addEventListener("click", () => {
    if (isUpload) {
      return;
    }

    isUpload = true;
    upload();
  });
};

function downloadImg() {
  return fetch(img, {
    method: "get",
  }).then((res) => res.blob());
}

async function upload() {
  const imgBlob = await downloadImg(12);
  const fileName = `${randomString()}.jpeg`;

  const file = new File([imgBlob], fileName, { type: imgBlob.type });
  console.log(file);

  const res = await OssUpload.upload(file);

  isUpload = false;
}

function randomString(len = 32) {
  const chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  const maxPos = chars.length;
  let pwd = "";
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
