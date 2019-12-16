const path = require('path');
import pageRoutes from './allRoutes';
const _env = process.env.BUILD_ENV || 'dev';
console.log('当前打包环境：' + _env)

export default {
  treeShaking: true,
  plugins: [
    ['umi-plugin-react', {
      dva: {
        immer: true,
      },
      antd: true,
      library: 'react',
      dynamicImport: true,
      fastClick: true,
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  targets: {
    ie: 7, chrome: 49, firefox: 45, safari: 10, edge: 13, ios: 10
  },
  hash: true,
  extraBabelPlugins: [
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
    // ['import', { libraryName: '@babel/polyfill' ,libraryDirectory: 'es',}]
  ],
  routes: pageRoutes
  ,
  proxy: {
    "/api": {
      "target": "http://jsonplaceholder.typicode.com/",
      "changeOrigin": true,
      "pathRewrite": { "^/api": "" }
    }
  },
  disableCSSModules: false,
  define: {
    "process.env.API": _env,
  }

};
