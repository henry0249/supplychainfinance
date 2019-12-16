import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
import { Card, Modal, message, Alert } from 'antd'
import { withRouter } from 'react-router'
import PAWraper from '../components/Header'
import IncomingData from '../components/incomingData'
import IncomingNoData from '../components/incomingNoData'

@withRouter
@connect(({ global, application }) => ({
  application,
  global
}))
class App extends Component {
  constructor(props) {
    super()
    this.state = {
      noTitleKey: 'incomingData',
      riskElements: [],
      shouldUpate: true,
      able: false,
      definedNum: 0
    }
    this.riskData = {
      scoreRisk: [],
      dimensionalIndex: {
        data: []
      },
      businessScore: {
        data: [],
        type: 'P'
      }
    }
    this.goodsId = null
  }

  getData() {
    const {
      global: { role },
      dispatch
    } = this.props
    const status = this.props.location.query.status
    const self = this
    dispatch({
      //获取详情
      type: 'application/getDetail',
      payload: {
        applyId: this.props.location.query.id
      }
    })
    if (status !== '0') {
      dispatch({
        //获取进度
        type: 'application/getFlowChart',
        payload: {
          applyId: this.props.location.query.id
        }
      })
    } else {
      dispatch({
        //获取进度
        type: 'application/setProcess',
        payload: { state: 0, list: [{ name: '', time: '' }] }
      })
      dispatch({
        //获取进度
        type: 'application/setData',
        payload: {}
      })
    }
  }

  componentDidMount() {
    sessionStorage.removeItem('scoreRisk')
    this.getData()
  }

  componentWillUnmount() {
    sessionStorage.removeItem('scoreRisk')
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.shouldUpate === nextState.shouldUpate
  }

  showModal = () => {
    this.setState({
      visible: true
    })
  }

  handleCancel = e => {
    this.setState({
      visible: false
    })
  }

  hideModal = () => {
    this.setState({
      visible: false
    })
  }

  onTabChange = (key, type) => {
    this.setState({ [type]: key })
  }

  render() {
    const { process, factor, businessMode, data } = this.props.application
    let able = false
    const status = this.props.location.query.status
    if (this.props.global.role) {
      if (
        this.props.global.role.roleId === 4 ||
        this.props.global.role.roleId === 5 ||
        this.props.global.role.roleId === 7 ||
        this.props.global.role.roleId === 8 ||
        this.props.global.role.roleId === 14
      ) {
        able = true
      }
    }
    const tabListNoTitle = [
      {
        key: 'incomingData',
        tab: '进件数据'
      }
    ]
    const incoming = () => {
      return (
        <Fragment>
          {status !== '0' ? <IncomingData /> : <IncomingNoData />}
        </Fragment>
      )
    }
    const contentListNoTitle = {
      incomingData: incoming()
    }

    return (
      <PAWraper
        tabList={tabListNoTitle}
        tabKey={this.state.noTitleKey}
        onTabChange={key => {
          this.onTabChange(key, 'noTitleKey')
        }}
      >
        {contentListNoTitle[this.state.noTitleKey]}
      </PAWraper>
    )
  }
}

export default App
