import React, { Component } from 'react'
import { Row, Col, message } from 'antd';
import withRouter from 'umi/withRouter';
import Header from './components/HeaderOne'
import style from './index.less'
import { connect } from 'dva'
import { getTodo } from '../../services'
import * as Comps from './components'
import * as configs from '@/utils/configs'

@withRouter
@connect(({ board, global }) => {
  return { board, global }
})
export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      headerUserData: {
        img: props.global.user.userPhoto,
        name: props.global.user.fullName
      },
      headerOtherData: [],
      orderList: [],
      orderDynamics: [],
      riskCount: [],
      riskRatio: [],
      countTodoList: 0,
      roleId: props.location && props.location.query && props.location.query.companyName ? '-1' : props.global && props.global.role && props.global.role.roleId || '1'
    }
    this.allMoney = ''
  }

  componentDidMount() {
    this.dataInit()
    // setTimeout(()=>router.push('/home?companyName=嘻嘻哈哈'),4000)
  }

  //todo delete later
  dataInit() {
    const { dispatch } = this.props
    const self = this
    getTodo().then(resp => {
      const id = this.props.global.role.roleId
      if (resp.code === 0) {
        let countTodoList = resp.data.reduce((result, item) => {
          if (id === 13) {
            if (item.menuId === 17) {
              result = item.number
            }
          } else {
            if (item.menuId === 8 || item.menuId === 51 || item.menuId === 58) {
              result += item.number
            }
          }
          return result
        }, 0)
        self.setState({
          countTodoList: countTodoList
        }, () => {
          const arr = [1, 2];
          const id = this.props.global.role.roleId;
          if (arr.includes(id)) {
            dispatch({
              type: 'board/getBoard',
              payload: {
                id,
                type: 0
              },
              callback(res) {
                const { code, data } = res;
                if (code === 0) {
                  self.setState({
                    headerOtherData: data
                  })
                } else {
                  res.msg && message.error(res.msg)
                }
              }
            })
          }
        })
      } else {
        message.error('获取待办事项数失败')
      }
    })
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.location !== this.props.location) {
      if (nextProps.location && nextProps.location.query && nextProps.location.query.companyName) {
        this.setState({
          roleId: '-1'
        })
      } else {
        this.setState({
          roleId: nextProps.global && nextProps.global.role && nextProps.global.role.roleId || '1'
        })
      }
    }
  }

  render() {
    const user = this.props.global.role || {}
    const user1 = [1, 2, 3, 9, 13].includes(user.roleId) || user.roleId > 16;
    const { headerUserData, headerOtherData, roleId } = this.state;
    let charts = [];
    if (roleId !== undefined) {
      let _roleId = roleId > 16 ? -2 : roleId;
      charts = configs.roles[_roleId].dashboard.map(item => {
        return { ...item, comp: Comps[item.name] };
      })
    }

    // const isMobile = document.documentElement.clientWidth < 700
    return (
      <div className={style.container}>
        <div className={style.header}>
          {user1 ? <Header userData={headerUserData} otherData={headerOtherData} /> : null}
        </div>
        <div className={style.content}>
          <Row gutter={24}>
            {
              charts.map((item, index) => {
                const Comp = item.comp
                return <Col style={{ marginBottom: 24 }} key={item.name} span={item.span || 24}><Comp {...item} comp={null} /></Col>
              })
            }
          </Row>
        </div>
      </div>
    )
  }
}
