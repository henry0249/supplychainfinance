export default [
  // user
  {
    path: '/login',
    component: './login'
  },

  // app
  {
    path: '/',
    component: '../layouts/index',
    Routes: ['src/pages/Authorized'],
    routes: [
      {
        path: '/',
        redirect: '/enterpriseConfig'
      },
      {
        name: '企业列表',
        path: '/enterpriseConfig',
        routes: [
          {
            path: '/enterpriseConfig',
            component: './enterpriseConfig/index'
          },
          {
            path: '/enterpriseConfig/configure',
            component: './enterpriseConfig/configure/index'
          }
        ]
      },
      {
        name: '企业角色管理',
        path: '/roleConfig',
        routes: [
          {
            path: '/roleConfig',
            component: './roleConfig/index'
          },
          {
            path: '/roleConfig/configure',
            component: './roleConfig/configure/index'
          }
        ]
      }, {
        name: '规则配置',
        path: '/lowGradeConfig',
        routes: [
          {
            path: '/lowGradeConfig',
            component: './lowGradeConfig/index'
          },
          {
            path: '/lowGradeConfig/configure',
            component: './lowGradeConfig/configure/index'
          }
        ]
      },
      {
        name: '风控配置',
        path: '/lowRiskConfig',
        component: './lowRiskConfig/index'
      },
      {
        name: '权限管理',
        path: '/userManage',
        routes: [
          {
            path: '/userManage',
            component: './userManage/index'
          },
          {
            path: '/userManage/team',
            component: './userManage/team/index'
          }
        ]
      },
      {
        name: '企业管理',
        path: '/companyManage',
        // hideChildrenInMenu:true,
        routes: [
          {
            name: '企业审核',
            path: '/companyManage',
            component: './companyManage/index'
          },
          // {
          //   path: '/companyManage/companyList/setRight',
          //   component: './companyManage/companyList/setRight/index'
          // },
          // {
          //   path: '/companyManage/companyList/oldSet',
          //   component: './companyManage/companyList/oldSet/index'
          // },
          // {
          //   path: '/companyManage/companyList/childCompany',
          //   component: './companyManage/companyList/childCompany/index'
          // },

          {
            // name: '企业管理-查看详细',
            path: '/companyManage/detail',
            component: './companyManage/detail/index'
          },
          {
            // name: '企业管理-查看详细',
            path: '/companyManage/edit',
            component: './companyManage/edit/index'
          }
        ]
      },
      {
        name: '用户管理',
        path: '/user',
        hideChildrenInMenu: true,
        routes: [
          {
            name: '用户列表',
            path: '/user',
            component: './user/index',
          },
          {//后台用户编辑
            path: '/user/backstage',
            component: './user/backstage/index'
          },
          {//后台用户编辑
            path: '/user/middle',
            component: './user/middle/index'
          }
        ]
      },
    ]
  }
]