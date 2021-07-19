import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";
import fs from "fs";
import sharp from "sharp";
import path from "path";

async function opimize_imgs(imgsFolders) {
  for (const folder_name of imgsFolders) {
    const files = await imagemin([`start_imgs/${folder_name}/*.{jpg,png}`], {
      destination: `opt_imgs/${folder_name}`,
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });
  }
}

const startFolder = "start_imgs";
const optFolder = "opt_imgs";
const resizedFolder = "imgs";

const imgsStartFolders = fs.readdirSync(startFolder);

if (fs.existsSync(optFolder)) {
  fs.rmSync(optFolder, { recursive: true });
}
fs.mkdirSync(optFolder);

opimize_imgs(imgsStartFolders).then((x) => {
  const imgsOptFolders = fs.readdirSync(optFolder);
  console.log(imgsOptFolders);

  if (fs.existsSync(resizedFolder)) {
    fs.rmSync(resizedFolder, { recursive: true });
  }
  fs.mkdirSync(resizedFolder);

  for (const fold of imgsOptFolders) {
    fs.mkdirSync(path.join(resizedFolder, fold));
  }

  const percentage = 33;

  for (const folder_name of imgsOptFolders) {
    const images = fs.readdirSync(path.join(optFolder, folder_name));

    for (let img of images) {
      const image = sharp(path.join(optFolder, folder_name, img));
      image
        .metadata()
        .then((info) => {
          let width = Math.round((info.width * percentage) / 100);
          return image.resize(width).toBuffer();
        })
        .then((img_r) => {
          fs.writeFileSync(path.join(resizedFolder, folder_name, img), img_r);
        })
        .catch((err) => {});
    }
  }
});
