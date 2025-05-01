const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'public', 'images');
const output = {};

function isImage(fileName) {
  return /\.(jpe?g|png|webp|gif)$/i.test(fileName);
}

function getFiles(dir) {
  return fs.readdirSync(dir).filter(file => {
    const filePath = path.join(dir, file);
    return fs.statSync(filePath).isFile() && isImage(file);
  });
}

fs.readdirSync(baseDir).forEach(model => {
  const modelPath = path.join(baseDir, model);
  if (fs.statSync(modelPath).isDirectory()) {
    const entries = fs.readdirSync(modelPath);
    const modelData = {};
    const groupImages = [];

    entries.forEach(entry => {
      const entryPath = path.join(modelPath, entry);
      if (fs.statSync(entryPath).isDirectory()) {
        modelData[entry] = getFiles(entryPath);
      } else if (isImage(entry)) {
        groupImages.push(entry); // dynamically named group images
      }
    });

    if (groupImages.length > 0) {
      modelData['_group'] = groupImages;
    }

    output[model] = modelData;
  }
});

fs.writeFileSync(
  path.join(__dirname, 'public', 'images-index.json'),
  JSON.stringify(output, null, 2)
);

console.log('✅ Dynamic group images indexed.');
