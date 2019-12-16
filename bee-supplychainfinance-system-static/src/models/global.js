import router from 'umi/router'
import {
  login,
  logout,
  getMenus,
  getRoleList,
  getUserInfo,
  pickRole,
  getWarningList
} from '../services/index'
import { baseUrls } from '@/utils'
import { message } from 'antd'
import allRoutes from '../../config/allRoutes'

export default {
  namespace: 'global',
  state: {
    login: false,
    user: {}, //用户的基础信息
    menus: [], //当前账户所选权限的菜单
    permission: {
      //当前选中的权限
      permissionId: '',
      permissionName: ''
    },
    role: {}, //当前选中的角色
    roleList: [], //当前账户的所有权限
    warningList: [], //预警列表
    todo: []
  },
  effects: {
    *login({ payload, callback }, { call, put }) {
      const response = yield call(login, payload)
      if (response.code === 0 && response.data) {
        localStorage.setItem('sysToken', payload.sysToken)
        localStorage.setItem('financeToken', response.data.financeToken)
        yield put({
          type: 'setLoginInfo',
          payload: response.data
        })
        callback &&
          callback(response.data && !response.data.currentPermissionsId)
      } else {
        sessionStorage.clear()
        localStorage.clear()
        message.info('登录信息验证失败，请先登录！')
        setTimeout(() => {
          window.location.href = `${baseUrls.beesrvUrls}/perLogin`
        }, 2000)
        return
      }
    },
    *getUserInfo({ payload, callback }, { call, put }) {
      const response = yield call(getUserInfo, payload)
      if (response.code === 0) {
        yield put({
          type: 'setLoginInfo',
          payload: response.data
        })
      } else {
        sessionStorage.clear()
        localStorage.clear()
        message.info('登录信息验证失败，请先登录！')
        setTimeout(() => {
          window.location.href = `${baseUrls.beesrvUrls}/perLogin`
        }, 2000)
        return
      }
      callback && callback(response.data && !response.data.currentPermissionsId)
    },
    *logout({ payload, callback }, { call, put }) {
      const response = yield call(logout, payload)
      if (response.code === 0) {
        sessionStorage.clear()
        localStorage.clear()
        window.location.href = `${baseUrls.beesrvUrls}/perLogin`
        yield put({
          type: 'signout'
        })
      } else {
        callback && callback(response.msg || '退出失败')
      }
    },
    *getRoleList({ payload, callback }, { call, put }) {
      const response = yield call(getRoleList, payload)
      if (
        response.code === 0 &&
        response.data &&
        response.data.length !== undefined
      ) {
        yield put({
          type: 'setRoleList',
          payload: response.data
        })
        if (response.data.length === 1 && callback) {
          callback(true, response.data[0])
        }
      } else {
        message.info('没有角色，请联系管理员')
      }
    },
    *pickRole({ payload, callback }, { call, put }) {
      const response = yield call(pickRole, payload.permissionId)
      if (response.code === 0 && response.data) {
        yield put({
          type: 'setLoginInfo',
          payload: response.data
        })
        callback && callback()
      } else {
        message.error(response.msg)
      }
    },
    *getMenus({ payload, callback }, { call, put }) {
      const response = yield call(getMenus, payload)
      if (
        response.code === 0 &&
        response.data &&
        response.data.length !== undefined
      ) {
        yield put({
          type: 'setMenus',
          payload: response.data
        })
      }
      callback && callback(response.data)
    },
    *throwError() {
      throw new Error('hi error')
    },
    //获取预警信息列表
    *getWarningList({ payload, success }, { call, put }) {
      const res = yield call(getWarningList, payload)
      if (res && res.code === 0) {
        yield put({
          type: 'setWarningList',
          payload: res.data
        })
        success && success(res)
      } else {
        yield put({
          type: 'resetWarningList',
          payload: null
        })
        success && success(res)
      }
    }
  },
  reducers: {
    setLoginInfo(state, action) {
      //设置用户当前选中的权限与角色
      let login = false,
        role = {},
        permission = {}
      if (action.payload.permissionInfo && action.payload.permissionInfo.permissionId) {
        //如果当前用户已有权限
        role = action.payload.roles;
        permission = action.payload.permissionInfo
        login = true
        delete action.payload.permissionInfo
        delete action.payload.roles
        return {
          ...state,
          role,
          permission,
          login: true,
          user: action.payload
        }
      } else {
        return {
          ...state,
          user: action.payload
        }
      }
    },

    setRoleList(state, action) {
      return {
        ...state,
        roleList: action.payload
      }
    },
    setMenus(state, action) {
      let menu = []
      return {
        ...state,
        menus: action.payload.concat(menu)
      }
    },
    setTodo(state, action) {
      const todo = []
      return {
        ...state,
        todo: action.payload.concat(todo)
      }
    },
    signout(state) {
      return {
        login: false,
        user: {}, //用户的基础信息
        menus: [], //当前账户所选权限的菜单
        permission: {
          //当前选中的权限
          permissionId: '',
          permissionName: ''
        },
        role: {} //当前选中的角色
      }
    },
    setWarningList(state, action) {
      return {
        ...state,
        warningList: action.payload
      }
    },
    resetWarningList(state, action) {
      return {
        ...state,
        warningList: []
      }
    }
  }
}

/*role*/
// 1	委托方
// 2	核心企业
// 3	货代公司
// 4	业务员
// 5	部门经理
// 6	风控专员
// 7	业务风控
// 8	风控负责人
// 9	数据专员
// 10	结算专员
// 11	结算复核人
// 12	结算负责人
// 13	法务
// 14	决策委员会成员
// 15	资方
// 16	超级管理员
