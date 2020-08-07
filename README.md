# fly-platform

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# package.json: 添加--host 10.0.1.157
"dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js --host 10.0.1.157"

# config>index.js
host: '10.0.1.157',
port: 4596, 

# 直播
npm install hls.js -S
npm install dplayer -S

let Hls = require('hls.js');
import DPlayer from 'dplayer';
