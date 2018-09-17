
const url_prefix = `/school`;

module.exports = {
  // mode: 'spa',
  srcDir: 'src',
  // server: {
  //   port: 3100,
  // },
  /*
  ** Headers of the page
  */
  head: {
    title: '智慧就业',
    // titleTemplate: '%s - 智慧就业',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: `${url_prefix}/naf-icons/iconfont.css` }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    { src: '~/style/index.less', lang: 'less' },
    { src: '~/style/common.less', lang: 'less' }
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/element-ui', '@/plugins/axios', '@/plugins/check-res', '@/plugins/naf-dict'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    ['@nuxtjs/proxy', { pathRewrite: { '.*/api/system/dict' : '/', '.*/api/system' : '/' } }],
    '@nuxtjs/axios',
    // '~/modules/router-meta'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    proxy: true,
    prefix: `${url_prefix}/api`,
    port: 3200,
  },
  proxy: [
    `http://localhost:7002${url_prefix}/api/system/dict`,
    `http://localhost:7001${url_prefix}/api/system`,
  ],
  loader: [
    {
      test: /\.less$/,
      loaders: 'style-loader!css-loader!less-loader'
    }
  ],
  /*
    ** Build configuration 
    */
  build: {
    publicPath: `${url_prefix}/_nuxt/`,
    vendor: ['axios', 'element-ui', 'babel-polyfill'],
    babel: {
      "plugins": [
        ['component', {
          "libraryName": "element-ui",
          "styleLibraryName": "theme-chalk"
        }]
      ]
    },    
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev }) {
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      // // 设置别名
      // config.resolve.alias = {
      //   ...(config.resolve.alias||{}),
      //   '@': resolve('src'),
      // }
    }
  },
  router: {
    base: `${url_prefix}/`,
    extendRoutes(routes) {
      // let ret= routes.map(p=>({...p, meta: RouteMeta(p.path)}));
      // console.log(ret);
      // return ret;

      // TODO: 重定向默认地址到'/system'
      let index = routes.findIndex(p => p.path === '/');
      if (index != -1)
        routes[index] = { path: '/', redirect: '/system' };
      else
        routes.push({ path: '/', redirect: '/system' });
    }
  },
}
