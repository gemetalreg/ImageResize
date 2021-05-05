const sharp = require("sharp");
const dirTree = require("directory-tree");
const fs = require("fs");

const tree = dirTree(".", {
  extensions: /\.jpg$/,
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

let i = 1;
for (const img of images) {
  sharp(img)
    .resize(2550)
    .toFile(`${folderName}/${img}`)
    .catch((err) => {});
  i++;
}
