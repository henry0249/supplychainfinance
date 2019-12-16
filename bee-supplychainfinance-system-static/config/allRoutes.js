import incomingRouter from './incomingRouter'
import '@babel/polyfill'
export default [
  // user
  {
    path: '/role',
    component: './role'
  },

  // app
  {
    path: '/',
    component: '../layouts/index',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      {
        path: '/',
        redirect: '/home'
      },
      //result
      {
        path: '/result',
        component: './Result/index',
        hideChildrenInMenu: true
      },
      {
        path: '/application',
        icon: 'form',
        name: '我的申请',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/application',
            redirect: '/application/index'
          },
          {
            path: '/application/index',
            component: './application/index'
          },
          {
            path: '/application/handle',
            component: './application/handle/index'
          }
        ]
      },
      // forms
      {
        path: '/incoming',
        icon: 'form',
        name: '进件管理',
        component: './Incoming/index'
      },
      ...incomingRouter,
      // list
      {
        path: '/approval',
        icon: 'form',
        name: '审批管理',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/approval/projectapproval',
            name: '立项审批',
            // component: './Approval/ProjectApproval',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/approval/projectapproval',
                redirect: '/approval/projectapproval/index'
              },
              {
                path: '/approval/projectapproval/index',
                component: './Approval/ProjectApproval/index'
              },
              {
                path: '/approval/projectapproval/handle',
                name: 'info',
                component: './Approval/ProjectApproval/handle'
              }
            ]
          },
          {
            path: '/approval/deferred',
            name: '延期提货',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/approval/deferred',
                redirect: '/approval/deferred/index'
              },
              {
                path: '/approval/deferred/index',
                component: './Approval/Deferred/index'
              },
              {
                path: '/approval/deferred/details',
                component: './OrderManage/details/index'
              },
              {
                path: '/approval/deferred/contract/detail',
                component: './Approval/Contract/contractDetail/index'
              },
              {
                path: '/approval/deferred/settlement/edit',
                component: './OrderManage/childPage/edit/index'
              },
              {
                path: '/approval/deferred/warning/detail',
                component: './OrderManage/childPage/warningDetail/index'
              }
            ]
          },
          {
            path: '/approval/contract',
            name: '合同审批',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/approval/contract',
                redirect: '/approval/contract/index'
              },
              {
                path: '/approval/contract/index',
                component: './Approval/Contract/index'
              },
              {
                path: '/approval/contract/contractDetail',
                component: './Approval/Contract/contractDetail/index'
              },
              {
                path: '/approval/contract/details',
                component: './OrderManage/details/index'
              },
              {
                path: '/approval/contract/settlement/edit',
                component: './OrderManage/childPage/edit/index'
              },
              {
                path: '/approval/contract/warning/detail',
                component: './OrderManage/childPage/warningDetail/index'
              }
            ]
          },
          {
            path: '/approval/settlement',
            name: '结算审批',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/approval/settlement',
                redirect: '/approval/settlement/index'
              },
              {
                path: '/approval/settlement/index',
                component: './Approval/Settlement/index'
              },
              {
                path: '/approval/settlement/details',
                component: './OrderManage/details/index'
              },
              {
                path: '/approval/settlement/details/childDetails',
                component: './OrderManage/details/childDetails/index'
              },
              {
                path: '/approval/settlement/contract/detail',
                component: './Approval/Contract/contractDetail/index'
              },
              {
                path: '/approval/settlement/warning/detail',
                component: './OrderManage/childPage/warningDetail/index'
              }
            ]
          },
          {
            path: '/approval/goods',
            name: '提货申请',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/approval/goods',
                redirect: '/approval/goods/index'
              },
              {
                path: '/approval/goods/index',
                component: './Approval/Goods/index'
              },
              {
                path: '/approval/goods/details',
                component: './OrderManage/details/index'
              },
              {
                path: '/approval/goods/contract/detail',
                component: './Approval/Contract/contractDetail/index'
              },
              {
                path: '/approval/goods/settlement/edit',
                component: './OrderManage/childPage/edit/index'
              },
              {
                path: '/approval/goods/warning/detail',
                component: './OrderManage/childPage/warningDetail/index'
              }
            ]
          },
          {
            path: '/approval/warehouse',
            name: '仓单审批',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/approval/warehouse',
                redirect: '/approval/warehouse/index'
              },
              {
                path: '/approval/warehouse/index',
                component: './Approval/Warehouse/index'
              },
              {
                path: '/approval/warehouse/details',
                component: './OrderManage/details/index'
              },
              {
                path: '/approval/warehouse/contract/detail',
                component: './Approval/Contract/contractDetail/index'
              },
              {
                path: '/approval/warehouse/settlement/edit',
                component: './OrderManage/childPage/edit/index'
              },
              {
                path: '/approval/warehouse/warning/detail',
                component: './OrderManage/childPage/warningDetail/index'
              }
            ]
          },
          {
            path: '/approval/warning',
            name: '预警解除审批',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/approval/warning',
                redirect: '/approval/warning/index'
              },
              {
                path: '/approval/warning/index',
                component: './Approval/Warning/index'
              },
              {
                path: '/approval/warning/details',
                component: './Approval/Warning/handle/index'
              }
            ]
          },
          {
            path: '/approval/bail',
            name: '保证金审批',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/approval/bail',
                redirect: '/approval/bail/index'
              },
              {
                path: '/approval/bail/index',
                component: './Approval/Bail/index'
              },
              {
                path: '/approval/bail/details',
                component: './OrderManage/details/index'
              },
              {
                path: '/approval/bail/contract/detail',
                component: './Approval/Contract/contractDetail/index'
              },
              {
                path: '/approval/bail/settlement/edit',
                component: './OrderManage/childPage/edit/index'
              },
              {
                path: '/approval/bail/warning/detail',
                component: './OrderManage/childPage/warningDetail/index'
              }
            ]
          }
        ]
      },
      {
        path: '/orderManage',
        name: '订单管理',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/orderManage',
            redirect: '/orderManage/index'
          },
          {
            path: '/orderManage/index',
            component: './OrderManage/index'
          },
          {
            path: '/orderManage/details',
            component: './OrderManage/details/index'
          },
          {
            path: '/orderManage/details/childDetails',
            component: './OrderManage/details/childDetails/index'
          },
          {
            path: '/orderManage/contract/detail',
            component: './OrderManage/childPage/contractDetail/index'
          },
          {
            path: '/orderManage/settlement/edit',
            component: './OrderManage/childPage/edit/index'
          },
          {
            path: '/orderManage/warning/detail',
            component: './OrderManage/childPage/warningDetail/index'
          }
        ]
      },
      {
        path: '/riskManage',
        icon: 'warning',
        name: '风控管理',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/riskManage',
            redirect: '/riskManage/index'
          },
          {
            path: '/riskManage/index',
            component: './RiskManage/index'
          },
          {
            path: '/riskManage/details',
            component: './RiskManage/details/index'
          }
        ]
      },
      {
        path: '/home',
        icon: 'dashboard',
        name: '总览',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/home',
            component: './Board/index'
          }
        ]
      },
      {
        path: '/report',
        icon: 'profile',
        name: '报表管理',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/report',
            component: './ReportManage/index'
          }
        ]
      },
      {
        path: '/ods',
        icon: 'database',
        name: '数据仓库',
        routes: [
          {
            path: '/ods/macrofinance',
            name: '宏观经济',
            routes: [{
              path: '/ods/macrofinance/MacroIndex',
              name: '综合指标',
              hideChildrenInMenu: true,
              routes: [{
                path: '/ods/macrofinance/MacroIndex',
                name: '综合指标面板',
                component: './ODS/Macrofinance/MacroIndex/index'
              }]
            }, {
              path: '/ods/macrofinance/macroEconomicGrowth',
              name: '经济增长',
              hideChildrenInMenu: true,
              routes: [{
                path: '/ods/macrofinance/macroEconomicGrowth',
                name: '综经济增长面板',
                component: './ODS/Macrofinance/MacroEconomicGrowth/index'
              },
              {
                path: '/ods/macrofinance/macroEconomicGrowth/edit',
                name: '经济增长相关数据编辑',
                component: './ODS/Macrofinance/MacroEconomicGrowth/edit/index'
              }]
            }, {
              path: '/ods/macrofinance/macroInflation',
              name: '通货膨胀',
              hideChildrenInMenu: true,
              routes: [{
                path: '/ods/macrofinance/macroInflation',
                name: '通货膨胀面板',
                component: './ODS/Macrofinance/MacroInflation/index'
              },
              {
                path: '/ods/macrofinance/macroInflation/edit',
                name: '通货膨胀相关数据编辑',
                component: './ODS/Macrofinance/MacroInflation/edit/index'
              }]
            },]
          },
          {
            path: '/ods/sectorIndex',
            name: '行业指数',
            hideChildrenInMenu: true,
            routes: [{
              path: '/ods/sectorIndex',
              name: '行业指数总览',
              component: './ODS/SectorIndex/index'
            }, {
              path: '/ods/sectorIndex/list',
              name: '综经济增长面板',
              component: './ODS/SectorIndex/list/index'
            }, {
              path: '/ods/sectorIndex/edit',
              name: '综经济增长面板',
              component: './ODS/SectorIndex/edit/index'
            }]
          },
          {
            path: '/ods/subjectMatterInfo',
            name: '标的物信息',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/ods/subjectMatterInfo',
                name: '标的物信息',
                component: './ODS/SubjectMatterInfo/index',
              },
              {
                path: '/ods/subjectMatterInfo/list',
                name: '标的物列表',
                hideChildrenInMenu: true,
                routes: [{
                  path: '/ods/subjectMatterInfo/list',
                  component: './ODS/SubjectMatterInfo/List/index',
                }, {
                  path: '/ods/subjectMatterInfo/list/attributes',
                  component: './ODS/SubjectMatterInfo/List/Attributes/index',
                }, {
                  path: '/ods/subjectMatterInfo/list/standard',
                  component: './ODS/SubjectMatterInfo/List/Standard/index',
                }, {
                  path: '/ods/subjectMatterInfo/list/source',
                  component: './ODS/SubjectMatterInfo/List/Source/index',
                }]
              }, {
                path: '/ods/subjectMatterInfo/editPrice',
                name: '编辑价格',
                component: './ODS/SubjectMatterInfo/EditPrice/index',
              }]
          },
          {
            path: '/ods/baseTopCompany',
            name: '基础数据库-世界500强',
            hideChildrenInMenu: true,
            routes: [{
              path: '/ods/baseTopCompany',
              redirect: '/ods/baseTopCompany/index'
            }, {
              path: '/ods/baseTopCompany/index',
              component: './ODS/BaseTopCompany/index',
            }, {
              path: '/ods/baseTopCompany/edit',
              component: './ODS/BaseTopCompany/Edit/index',
            }]
          },
          {
            path: '/ods/baseImportCompany',
            name: '基础数据库-国企央企',
            hideChildrenInMenu: true,
            routes: [{
              path: '/ods/baseImportCompany',
              redirect: '/ods/baseImportCompany/index'
            }, {
              path: '/ods/baseImportCompany/index',
              component: './ODS/BaseImportCompany/index',
            }, {
              path: '/ods/baseImportCompany/edit',
              component: './ODS/BaseImportCompany/Edit/index',
            }]
          },
          {
            path: '/ods/basePublicCompany',
            name: '基础数据库-国内上市央企',
            hideChildrenInMenu: true,
            routes: [{
              path: '/ods/basePublicCompany',
              redirect: '/ods/basePublicCompany/index'
            }, {
              path: '/ods/basePublicCompany/index',
              component: './ODS/BasePublicCompany/index',
            }, {
              path: '/ods/basePublicCompany/edit',
              component: './ODS/BasePublicCompany/Edit/index',
            }]
          },
          {
            path: '/ods/baseLoseCreditList',
            name: '基础数据库-环保失信',
            hideChildrenInMenu: true,
            routes: [{
              path: '/ods/baseLoseCreditList',
              redirect: '/ods/baseLoseCreditList/index'
            }, {
              path: '/ods/baseLoseCreditList/index',
              component: './ODS/BaseLoseCreditList/index',
            }, {
              path: '/ods/baseLoseCreditList/edit',
              component: './ODS/BaseLoseCreditList/Edit/index',
            }]
          },
          {
            path: '/ods/baseCoreCompany',
            name: '基础数据库-核心企业白名单',
            hideChildrenInMenu: true,
            routes: [{
              path: '/ods/baseCoreCompany',
              redirect: '/ods/baseCoreCompany/index'
            }, {
              path: '/ods/baseCoreCompany/index',
              component: './ODS/BaseCoreCompany/index',
            }, {
              path: '/ods/baseCoreCompany/edit',
              component: './ODS/BaseCoreCompany/Edit/index',
            }]
          },
          {
            path: '/ods/baseGrossProfitRate',
            name: '基础数据库-原料加工销售毛利率',
            hideChildrenInMenu: true,
            routes: [{
              path: '/ods/baseGrossProfitRate',
              redirect: '/ods/baseGrossProfitRate/index'
            }, {
              path: '/ods/baseGrossProfitRate/index',
              component: './ODS/BaseGrossProfitRate/index',
            }, {
              path: '/ods/baseGrossProfitRate/edit',
              component: './ODS/BaseGrossProfitRate/Edit/index',
            }]
          }
        ]
      },
      {
        path: '/enterpriseDetails',
        icon: 'menu-unfold',
        name: '企业详情',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/enterpriseDetails',
            component: './EnterpriseDetails/index'
          }
        ]
      }
    ]
  }
]