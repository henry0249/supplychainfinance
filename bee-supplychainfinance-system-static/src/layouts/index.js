import { Component } from 'react'
import { Layout, Modal, message, Spin, LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import SiderMenu from '../components/SiderMenu/index'
import logo from '../assets/yay.jpg'
import GlobalHeader from '../components/GlobalHeader'
import withRouter from 'umi/withRouter'
import { formatter } from '../utils/utils'
import { utils, baseUrls } from '@/utils'
import { connect } from 'dva'
import { logout, getTodo, getWarningList } from '../services'
import Media from 'react-media'
import router from 'umi/router'
const { Content, Header, Footer } = Layout
const confirm = Modal.confirm

@connect(({ global, loading }) => ({
  global
}))
class BasicLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      logining: true,
      todo: []
    }
  }

  componentWillMount() {
    const { dispatch, global } = this.props
    //获取用户信息
    if (
      utils.getUrlParam('sysToken') &&
      utils.getUrlParam('sysToken') !== 'null' &&
      global &&
      !global.login
    ) {
      //平台跳转过来的
      router.push(`/role?sysToken=${utils.getUrlParam('sysToken')}`)
    } else if (global && global.login) {
      //已登录成功
      this.setState({
        logining: false
      })
    } else if (localStorage.financeToken) {
      //session登录
      dispatch({
        type: 'global/getUserInfo',
        payload: { financeToken: localStorage.financeToken },
        callback: noRole => {
          if (!noRole) {
            dispatch({
              type: 'global/getMenus',
              payload: {},
              callback: code => {
                this.setState({
                  logining: false
                })
              }
            })
          } else {
            router.push('/role')
          }
        }
      })
    } else {
      localStorage.clear()
      message.info('登录信息验证失败，请先登录！')
      setTimeout(() => {
        window.location.href = `${baseUrls.beesrvUrls}/perLogin`
      }, 2000)
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    this.getToDoThings()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.getToDoThings()
    }
  }

  getToDoThings = () => {
    const { dispatch } = this.props
    getTodo().then(resp => {
      if (resp.code === 0) {
        dispatch({
          type: 'global/setTodo',
          payload: resp.data
        })

        this.setState({
          todo: resp.data
        })
      } else {
        return
      }
    })
  }

  handleMenuCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  onMenuClick(e, a) {
    const { dispatch } = this.props
    switch (e.key) {
      case 'logout':
        confirm({
          title: '退出登录',
          content: '确定退出供应链工作台吗?',
          onOk() {
            dispatch({
              type: 'global/logout',
              payload: {
                uuid: localStorage.financeToken
              },
              callback: msg => message.error(msg)
            })
          }
        })
        break
      default:
        break
    }
  }

  render() {
    const {
      children,
      location,
      global: { user, menus, role }
    } = this.props
    const { collapsed, logining, todo } = this.state
    if (logining) {
      return (
        <LocaleProvider locale={zhCN}>
          <Layout style={{ paddingTop: '18rem' }}>
            <Spin tip="登录验证中..." />
          </Layout>
        </LocaleProvider>
      )
    } else
      return this.props.location.pathname === '/' ? (
        <LocaleProvider locale={zhCN}>
          <div>{this.props.children}</div>
        </LocaleProvider>
      ) : (
          <LocaleProvider locale={zhCN}>
            <Layout>
              <Media query="(max-width: 599px)">
                {isMobile => <SiderMenu
                  logo={logo}
                  isMobile={isMobile}
                  collapsed={collapsed}
                  menuData={formatter(menus)}
                  todo={todo}
                  location={location}
                  onCollapse={this.handleMenuCollapse}
                />
                }
              </Media>
              <Layout>
                <Header style={{ padding: 0 }}>
                  <GlobalHeader
                    logo={logo}
                    collapsed={collapsed}
                    currentUser={{
                      name: user.fullName,
                      avatar:
                        user.userPhoto ||
                        'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
                      userid: user.financeToken,
                      notifyCount: 12,
                      roleName: role.roleName
                    }}
                    onMenuClick={this.onMenuClick.bind(this)}
                    onCollapse={this.handleMenuCollapse}
                  />
                </Header>
                <Content
                  style={{
                    height: '100%',
                    marginTop: 1,
                    // width: document.documentElement.offsetWidth - (document.documentElement.offsetWidth < 599 ? 0 : collapsed ? 80 : 256),
                    overflowX: 'hidden',
                  }}
                >
                  {children}
                </Content>
              </Layout>
            </Layout>
          </LocaleProvider>
        )
  }
}

export default withRouter(BasicLayout)
