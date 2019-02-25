const prefix = '/';
const routers = [
  {
    url: '',
    method: ['get'],
    action: ['/pages/index/index'],
    clientPath: [
      {
        name: 'index',
        css: 'pages/index/index.css',
        pageJs: 'pages/index/index.js',
      },
    ],
  },
];

module.exports = {
  prefix,
  routers,
};
