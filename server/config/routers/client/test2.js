const prefix = '/test2';
const routers = [
  {
    url: '',
    method: ['get'],
    action: ['/pages/index/index'],
    clientPath: [
      {
        name: 'test2',
        css: 'pages/test2/index.css',
        pageJs: 'pages/test2/index.js',
      },
    ],
  },
];

module.exports = {
  prefix,
  routers,
};
