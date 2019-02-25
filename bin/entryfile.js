const fs = require('fs');
const path = require('path');
const config = require('../server/config/index');

module.exports = (() => {
  const entryFile = {};
  const configDir = path.join(process.cwd(), config.CLIENT_ROUTER.routerDir);
  fs.readdirSync(configDir).forEach((item) => {
    const routerPathDir = require(path.join(configDir, item));
    if (routerPathDir.routers && routerPathDir.routers.length > 0) {
      routerPathDir.routers.forEach((routerItem) => {
        if (Array.isArray(routerItem.clientPath)) {
          routerItem.clientPath.forEach((clientItem) => {
            if (clientItem.pageJs) {
              entryFile[clientItem.pageJs.split('.js')[0]] = path.join(config.STATIC_DIR, clientItem.pageJs);
            }
          });
        } else if (typeof routerItem.clientPath === 'object' && routerItem.clientPath.pageJs) {
          entryFile[routerItem.clientItem.pageJs.split('.js')[0]] = path.join(config.STATIC_DIR, routerItem.clientItem.pageJs);
        } else {
          console.error('找不到 router clientPath');
        }
      });
    }
  });

  return entryFile;
})();
