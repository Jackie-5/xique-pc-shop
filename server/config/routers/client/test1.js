const prefix = '/test1';
const routers = [
  {
    url: '',
    method: ['get'],
    action: ['/pages/index/index'],
    clientPath: [
      {
        name: 'test1',
        css: 'pages/test1/index.css',
        pageJs: 'pages/test1/index.js',
      },
    ],
  },
];

module.exports = {
  prefix,
  routers,
};
