const fs = require('fs');
const path = require('path');
const minify = require('html-minifier').minify;

const insertSkeleton = (skeletonImageBase64, options) => {
  const skeletonHTMLPath = path.join(options.outputPath, `skeleton-${options.pageName}.html`);

  if (!skeletonImageBase64) {
    console.warn('The skeleton has not been generated yet');
    return false;
  }

  const skeletonStyleNodeId = 'skeleton-style-node';
  const skeletonClass = 'skeleton-remove-after-first-request';
  const delayTimeToClose = options.delayTimeToClose;

  const content = `
  <html>
    <head>
        <style id="${skeletonStyleNodeId}">
            body {
                overflow-x: hidden;
                overflow-y: auto;
            }
    
            @keyframes flush {
                0% {
                    left: -100%;
                }
    
                50% {
                    left: 0;
                }
    
                100% {
                    left: 100%;
                }
            }
        </style>
    </head>
    <body>
        <div class="${skeletonClass}" style="
                    animation: flush 2s linear infinite;
                    position: fixed;
                    top: 0;
                    bottom: 0;
                    width: 100%;
                    z-index: 9999;
                    background: linear-gradient(
                        to left,
                        rgba(255, 255, 255, 0) 0%,
                        rgba(255, 255, 255, 0.85) 50%,
                        rgba(255, 255, 255, 0) 100%
                    );
                "></div>
        <div class="${skeletonClass}" style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9998;
            background-repeat: no-repeat !important;
            background-size: ${options.device ? '100% auto' : '1920px 1080px'} !important;
            background-image: url(${skeletonImageBase64}) !important;
            background-color: #FFFFFF !important;
            background-position: center 0 !important;
        "></div>
        <script class="${skeletonClass}">
            // 定义全局调用的钩子
            window.SKELETON = {
                destroy: function () { // 手动销毁骨架屏
                    var removes = Array.from(document.body.querySelectorAll('.${skeletonClass}'));
                    removes && removes.map(function (item) {
                        document.body.removeChild(item);
                    });
                    document.head.removeChild(document.getElementById('${skeletonStyleNodeId}'));
                }
            };
    
            // 在页面文件加载完毕之后，销毁骨架屏
            window.addEventListener('load', function () {
                setTimeout(function () {
                    window.SKELETON && SKELETON.destroy()
                }, ${ delayTimeToClose });
            });
        </script>
    </body>
  </html>`;

  const minifyContent = minify(content, {
    minifyCSS: true,
    // minifyJS: true,
    removeComments: true,
  });

  fs.writeFileSync(skeletonHTMLPath, minifyContent, 'utf8', function(err) {
    if (err) return console.error(err);
  });

  return {
    minHtml: minifyContent,
    html: content,
    img: skeletonImageBase64,
  };
};

module.exports = insertSkeleton;
