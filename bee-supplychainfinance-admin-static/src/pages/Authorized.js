import { Route } from 'react-router-dom'
import { connect } from 'dva'
import { Exception } from '../components'
import React from 'react'
import menuData from '../../config/allRoutes'
import { getRoutes } from '../common/utils.js'
import Layouts from '../layouts'

const defaultRoutes = ['/', '/result']

export default connect(({ global }) => ({ global }))(args => {
  const {
    render,
    global: { menus },
    ...rest
  } = args

  //更新上一次路由记录
  const referrer =
    args.location.pathname + args.location.search + args.location.hash
  localStorage.referrer = referrer

  //项目中所有路由
  let allRouters = getRoutes(menuData)
  const routers = getRoutes(menus)
  allRouters = new Array().concat(defaultRoutes, allRouters)
  let status = 200

  //所有有权限访问的路由
  const accessRoutes = new Array().concat(defaultRoutes, routers)
  if (accessRoutes.indexOf(args.location.pathname) == -1) {
    if (allRouters.indexOf(args.location.pathname) == -1) {
      status = 404
    } else {
      status = 403
    }
  }
  if (status === 200) {
    return <div>{args.children}</div>
  } else {
    return (
      <Layouts>
        {' '}
        <Exception code={status} />
      </Layouts>
    )
  }
})
