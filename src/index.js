const fs = require('fs');
const path = require('path');

const {
  saveScreenShot,
} = require('./saveFile');
const openPage = require('./openPage');
const insertSkeleton = require('./insertSkeleton');

const getSkeleton = async function(options) {
  // 检查目标页面参数是否存在
  if (!options.pageUrl) {
    console.warn('页面地址不能为空！');
    return false;
  }

  // 设置默认参数
  options.pageName = options.pageName ? options.pageName : 'output';
  options.outputPath = options.outputPath ? options.outputPath : path.join('skeleton-output');

  // 创建一个目录
  if (!fs.existsSync(options.outputPath)) {
    fs.mkdirSync(options.outputPath);
  }

  // 打开页面
  const { page, browser } = await openPage(options);

  // 把目标页面处理为骨架屏页面
  await page.evaluate(async options => {
    await window.Skeleton.genSkeleton(options);
  }, options);

  // 把骨架屏保存为一张base64格式的图片
  const skeletonImageBase64 = await saveScreenShot(page, options);

  // 把生成的骨架屏页面注入到目标html页面
  const result = insertSkeleton(skeletonImageBase64, options);

  // 关闭无头浏览器
  await browser.close();

  return result;
};

module.exports = getSkeleton;
