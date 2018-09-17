const { Router } = require('express')

const router = Router()

const navDatas = [
  {
    title: '系统管理',
    path: '/system',
    module: 'system',
  },
  {
    title: '招聘管理',
    path: '/jobs',
    module: 'jobs',
  },
  {
    title: '信息发布',
    path: '/cms',
    module: 'cms',
  },
  {
    title: '公文系统',
    path: '/docflow',
    module: 'docflow',
  },
  {
    title: '友情链接',
    module: 'links',
    children: [
      {
        title: '中心网站',
        url: 'http://www.jilinjobs.cn',
        target: '_blank',
        icon: 'lianjie',
      },
      {
        title: '吉林省教育厅',
        url: 'http://www.jledu.gov.cn/jyt/',
        target: '_blank',
        icon: 'lianjie',
      },
      {
        title: '学信网',
        url: 'http://www.chsi.com.cn/',
        target: '_blank',
        icon: 'lianjie',
      },
      {
        title: '全国大学生就业一站式服务系统',
        url: 'http://jilinbys.ncss.org.cn/',
        target: '_blank',
        icon: 'lianjie',
      },
      {
        title: '新职业',
        tooltip: '教育部大学生就业网',
        url: 'http://www.ncss.org.cn/',
        target: '_blank',
        icon: 'lianjie',
      },
    ],
  },
];

const datas = [
  {
    title: '系统管理',
    path: '/system',
    icon: 'system',
    module: 'system',
    children: [
      {
        title: '用户管理',
        path: '/system/user',
        icon: 'account',
      },
      {
        title: '部门管理',
        path: '/system/dept',
        icon: 'dept',
      },
      {
        title: '标签用户',
        path: '/system/tag',
        icon: 'tag',
      },
      {
        title: '操作日志',
        path: '/system/log',
        icon: 'log',
      },
    ],
  },
  {
    title: '企业管理',
    path: '/corp',
    icon: 'corp',
    module: 'jobs',
    children: [
      {
        title: '注册审核',
        path: '/jobs/corp/check',
        icon: 'shenhe',
      },
      {
        title: '信息认证',
        path: '/jobs/corp/info',
        icon: 'renzheng',
      },
      {
        title: '积分体系',
        path: '/jobs/corp/points',
        icon: 'jifen',
      },
      {
        title: '企业用户',
        path: '/jobs/corp/user',
        icon: 'corpuser',
      },
    ],
  },
  {
    title: '招聘管理',
    path: '/job',
    icon: 'job',
    module: 'jobs',
    children: [
      {
        title: '招聘信息',
        path: '/jobs/job-info',
        icon: 'info',
      },
      {
        title: '招聘会',
        path: '/jobs/job-fair',
        page: 'job.fair',
        icon: 'info',
      },
      {
        title: '校园宣讲会',
        path: '/jobs/campus-talk',
        icon: 'info',
      },
    ],
  },
  {
    title: '信息发布',
    path: '/cms',
    icon: 'news',
    module: 'cms',
    children: [
      {
        title: '通知公告',
        path: '/cms/notice',
        icon: 'column',
      },
      {
        title: '政策法规',
        path: '/cms/policy',
        icon: 'column',
      },
      {
        title: '新闻栏目',
        path: '/cms/news',
        icon: 'column',
      },
    ],
  },
  {
    title: '收文管理',
    path: '/docflow',
    icon: 'news',
    module: 'docflow',
    children: [
      {
        title: '待收公文',
        path: '/docflow/news',
        icon: 'caogao',
      },
      {
        title: '在办公文',
        path: '/docflow/inbox',
        icon: 'doc1',
      },
      {
        title: '归档公文',
        path: '/docflow/archive',
        icon: 'column',
      },
    ],
  },
  {
    title: '友情链接',
    icon: 'menu',
    module: 'links',
    children: [
      {
        title: '中心网站',
        url: 'http://www.jilinjobs.cn',
        target: '_blank',
        icon: 'lianjie',
      },
      {
        title: '吉林省教育厅',
        url: 'http://www.jledu.gov.cn/jyt/',
        target: '_blank',
        icon: 'lianjie',
      },
      {
        title: '学信网',
        url: 'http://www.chsi.com.cn/',
        target: '_blank',
        icon: 'lianjie',
      },
      {
        title: '全国大学生就业一站式服务系统',
        url: 'http://jilinbys.ncss.org.cn/',
        target: '_blank',
        icon: 'lianjie',
      },
      {
        title: '新职业',
        tooltip: '教育部大学生就业网',
        url: 'http://www.ncss.org.cn/',
        target: '_blank',
        icon: 'lianjie',
      },
    ],
  },
];

const MapMenu = (catalog = []) => item => ({
  title: item.title,
  options: {
    icon: item.icon,
    path: item.path,
    url: item.url,
    target: item.target,
    tooltip: item.tooltip,
    module: item.module,
    meta: { catalog: catalog.concat(item.title) },
  },
  children: (item.children || []).map(MapMenu(catalog.concat(item.title))),
});

const menus = datas.map(MapMenu());
const modules = navDatas.map(MapMenu());

/* GET menus define. */
router.get('/menu/load', function (req, res, next) {
  res.json({errcode: 0, errmsg: 'ok', data: {items: menus, modules}})
})
router.get('/menu/:module', function (req, res, next) {
  const module = req.params.module;
  const items = menus.filter(p=>p.options.module == module);
  res.json({errcode: 0, errmsg: 'ok', data: {items, modules}})
})

module.exports = router
