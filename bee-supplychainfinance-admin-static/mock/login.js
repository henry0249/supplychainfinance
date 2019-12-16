import menu from '../config/allRoutes'

const userDatas = {
  info: {
    id: 1,
    name: '普通用户',
    alias: '北京',
    role: 'user'
  },
  routers: ['/list/bookList'],
  menus: [
    {
      name: '产品(一般用户)',
      icon: 'table',
      path: 'list',
      authority: 'user',
      children: [
        {
          name: '书籍列表',
          path: 'bookList',
          authority: 'admin'
          // hideInBreadcrumb: true,
          // hideInMenu: true,
        }
      ]
    }
  ],
  code: 1,
  message: '登录成功!',
  uuid: '0123456789abcdef'
}

const adminDatas = {
  info: {
    id: 1,
    name: '管理员',
    alias: '北京',
    role: 'admin'
  },
  roleInfo: {
    roleId: '1',
    menus: menu
  },
  code: 0,
  message: '登录成功!',
  uuid: '9876543210abcdef'
}

export default {
  'post /supplychainfinance-user/user/info': function(req, res, next) {
    setTimeout(() => {
      res.send(adminDatas)
    }, 1500)
  },
  'post /api/checkLogin': function(req, res, next) {
    setTimeout(() => {
      res.json(
        req.body.uuid === '0123456789abcdef'
          ? userDatas
          : req.body.uuid === '9876543210abcdef'
          ? adminDatas
          : { status: 'error', message: '登陆已失效，请重新登陆!' }
      )
    }, 1500)
  },
  'post /api/logout': {
    status: 'ok',
    message: '退出成功!'
  }
}
