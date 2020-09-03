(function () {
  'use strict';

  function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function traverse(node, options) {
      const { traverseExcludes = [] } = options;
      const excludesMap = traverseExcludes.reduce((buffer, item) => {
          const name = item.replace(/^[.#]/, '');
          buffer[name] = true;
          return buffer;
      }, {});

      loop(node);

      function loop(node) {
          const $node = $(node);
          const nodeId = $node.attr('id');
          const nodeClasses = $node.attr('class');
          const childrens = $(node).children();

          const background = $node.css('background');
          if (/url/.test(background)) {
              $node.css('background', 'rgb(255,255,255)');
          }

          if (
              childrens.length &&
              !excludesMap[nodeId] &&
              !hasClass(nodeClasses)
          ) {
              childrens.each((i, element) => {
                  loop(element);
              });
          } else {
              const width = $node.width();
              const height = $node.height();
              const padding = $node.css('padding');
              const margin = $node.css('margin');
              const tagName = $node[0].tagName.toLowerCase();

              let newNode = tagName;
              let cssText = `width:${width}px;height:${height}px;background:#eee;`;

              if (tagName === 'img') {
                  newNode = 'div';
                  cssText = `${cssText}margin:${padding}`;
              } else {
                  cssText = `${cssText}${padding}:${padding};margin:${margin};`;
              }

              newNode = document.createElement(newNode);
              newNode.style.cssText = cssText;

              $node.replaceWith(newNode);
          }
      }

      function hasClass(classes) {
          if (!classes) {
              return false;
          }
          const classesArray = classes.replace(/(^\s*|\s*$)/g, '').split(' ');
          for (let i = 0, length = classesArray.length; i < length; i++) {
              if (excludesMap[classesArray[i]]) {
                  return true;
              }
          }
          return false;
      }
  }

  window.AwesomeSkeleton = {
      // Entry function
      async genSkeleton(options) {
          this.options = options;
          if (options.debug) {
              await this.debugGenSkeleton(options);
          } else {
              await this.startGenSkeleton();
          }
      },

      async startGenSkeleton() {
          traverse(document.body, this.options);
      },

      async debugGenSkeleton(options) {
          const switchElement = document.createElement('button');
          switchElement.innerHTML = '开始生成骨架图';
          Object.assign(switchElement.style, {
              width: '100%',
              zIndex: 9999,
              color: '#FFFFFF',
              background: 'red',
              fontSize: '30px',
              height: '100px',
          });
          document.body.prepend(switchElement);

          // Need to wait for event processing, so use Promise for packaging
          return new Promise((resolve, reject) => {
              try {
                  switchElement.onclick = async () => {
                      $(switchElement).remove();
                      await this.startGenSkeleton();
                      await sleep(options.debugTime || 0);
                      resolve();
                  };
              } catch (e) {
                  console.error('==startGenSkeleton Error==', e);
                  reject(e);
              }
          });
      },
  };
})();
