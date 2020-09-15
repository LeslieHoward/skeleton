const fs = require('fs');
const path = require('path');
const images = require('images');
const base64Img = require('base64-img');

const saveScreenShot = async (page, options) => {
  const screenshotPath = path.join(options.outputPath, `skeleton-${options.pageName}.png`);

  await page.screenshot({
    path: screenshotPath,
  });

  const imgWidth = options.device ? 375 : 1920;
  await images(screenshotPath).size(imgWidth).save(screenshotPath);

  const skeletonImageBase64 = base64Img.base64Sync(screenshotPath);

  const skeletonBase64Path = options.outputPath ? path.join(options.outputPath, './base64-' + options.pageName + '.txt') : null;
  if (skeletonBase64Path) {
    fs.writeFileSync(skeletonBase64Path, skeletonImageBase64, err => {
      if (err) throw err;
      console.log(`The base64-${options.pageName}.txt file has been saved in path '${options.outputPath}' !`);
    });
  }
  return skeletonImageBase64;
};

module.exports = {
  saveScreenShot,
};
