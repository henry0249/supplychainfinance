import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { utils, baseUrls } from '@/utils';
import { message } from 'antd';
import { ChangeAuthority } from '@/components';
import style from './index.less';
import router from 'umi/router';

@connect(({ global: { role, roleList } }) => ({
  global, role, roleList
}))
@withRouter
export default class Index extends Component {
  static propTypes = {
    // prop: PropTypes
  }
  componentDidMount() {
    const { dispatch, global } = this.props;
    //获取用户信息
    if (utils.getUrlParam('sysToken') && utils.getUrlParam('sysToken') !== 'null' && global && !global.login) {//平台跳转过来的
      const sysToken = utils.getUrlParam('sysToken');
      dispatch({
        type: 'global/login',
        payload: { sysToken },
        callback: (next) => {
          // if (next) {
          dispatch({
            type: 'global/getRoleList',
            payload: {},
            callback: (isSingle, role) => {//如果只有一种权限则默认选择并跳转
              if (isSingle) {
                this.pickRole(role, () => { this.go() })
              }
            }
          })
          // }
        }
      })
    }
    //  else if (global && global.login) {//已登录过，从其进入切换权限
    //   dispatch({
    //     type: 'global/getRoleList',
    //     payload: {},
    //   })
    // }
    else if (localStorage.financeToken) {//session登录
      dispatch({
        type: 'global/getUserInfo',
        payload: { financeToken: localStorage.financeToken },
        callback: (next) => {
          dispatch({
            type: 'global/getRoleList',
            payload: {},
          })
        }
      })
    }
    else {
      localStorage.clear();
      message.info('登录信息验证失败，请先登录！');
      //测试暂时关闭 todo
      setTimeout(() => {
        window.location.href = `${baseUrls.beesrvUrls}/perLogin`
      }, 2000)
    }
  }
  //选择角色
  pickRole(role, callback) {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/pickRole',
      payload: role,
      callback: () => {
        if (callback) {
          callback()
        }
      }
    })
  }

  go() {//跳转
    if (!this.props.roleList || !this.props.roleList.length) {
      window.location.href = `${baseUrls.beesrvUrls}/perLogin`
      return
    }

    if (this.props.role.permissionId) {
      this.props.dispatch({
        type: 'global/getMenus',
        payload: {},
        callback: (menus) => {
          if (menus && menus.length > 0) {
            // if (localStorage.referrer) {//跳转回到进来时的页面;referrer在权限Authorized.js里面设置
            //   // if (window.location.origin.indexOf(document.referrer) > -1 && (window.location.origin + '/login').indexOf(document.referrer) === -1) {
            //   router.replace(localStorage.referrer);
            // }
            // else {
            router.push(menus[0].path || '/home')
            // }
          }
          else {
            router.push('/home')
          }

        }
      })
    }
    else {
      message.info('请先选择角色!');
    }
  }
  render() {
    const { role = {}, roleList = [] } = this.props
    return (
      <div className={style.wrap}>
        <ChangeAuthority permissionId={role.permissionId} permissionList={roleList} pickRole={this.pickRole.bind(this)} go={this.go.bind(this)} />
      </div>
    )
  }
}
