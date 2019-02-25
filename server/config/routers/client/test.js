const prefix = '/test';
const routers = [
  {
    url: '',
    method: ['get'],
    action: ['/pages/index/index'],
    clientPath: [
      {
        name: 'test',
        css: 'pages/test/index.css',
        pageJs: 'pages/test/index.js',
      },
    ],
  },
];

module.exports = {
  prefix,
  routers,
};
