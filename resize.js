const sharp = require("sharp");
const dirTree = require("directory-tree");
const fs = require("fs");
const { info } = require("console");
const trash = require("trash");

const tree = dirTree(".", {
  extensions: /\.(jpg|png|webp)$/,
});

const images = tree.children
  .filter((obj) => obj.type === "file")
  .map((obj) => obj.name);
console.log(images);

const folderName = "resized";

try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (err) {
  console.error(err);
}

(async () => {
  await trash([`${folderName}/*.*`]);
})();

const percentage = 50;
for (const img of images) {
  sharp(img)
    .metadata()
    .then((info) => {
      const width = Math.round((info.width * percentage) / 100);
      return sharp(img).resize(width).toFile(`${folderName}/${img}`);
    })
    .catch((err) => {});
}
