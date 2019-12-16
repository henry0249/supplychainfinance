import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
import { Card, Modal, message, Alert } from 'antd'
import { withRouter } from 'react-router'
import PAWraper from '../components/Header'
import Step from '../components/Step'
import ProjectReport from '../components/ProjectReport'
import OtherInfo from '../components/OtherInfo'
import Enclosure from '../components/Enclosure'
import EconomicNum from '../components/EconomicNum'
import ThreeDimensionalIndex from '../components/ThreeDimensionalIndex' //宏三维指数
import BusinessScore from '../components/BusinessScore' //业务评分
import OperationLog from '../components/OperationLog'
import PriceTrend from '../components/PriceTrend'
import RiskItem from '../components/RiskItem'
import RiskFactor from '../components/RiskFactor'
import ProjectApprovalTab from '../components/ProjectApprovalTab'
import moment from 'moment'
import Mask from '../components/Mask'
import Opinion from '../components/Opinion'
import IncomingData from '../components/incomingData'
import style from './index'
import AllScore from '../components/AllScore'

@withRouter
@connect(({ global, projectApproval }) => ({
  projectApproval,
  global
}))
class App extends Component {
  constructor(props) {
    super()
    this.state = {
      noTitleKey: 'detailInfo',
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

  getCurrWeekDays() {
    let date = []
    // let weekOfday = parseInt(moment().format('e')) // 计算今天是这周第几天 周日为一周中的第一天
    // let start = moment().subtract(weekOfday, 'days').format('YYYY-MM-DD') // 周一日期
    // let end = moment().add(7 - weekOfday - 1, 'days').format('YYYY-MM-DD') // 周日日期
    let start = moment()
      .subtract(1, 'years')
      .format('YYYY-MM-DD') //当前时间的前1年时间
    let end = moment().format('YYYY-MM-DD') //当前时间
    date.push(start)
    date.push(end)
    return date
  }

  getData() {
    const {
      global: { role },
      dispatch
    } = this.props
    const self = this
    dispatch({
      //获取详情
      type: 'projectApproval/getDetail',
      payload: {
        applyId: this.props.location.query.id
      },
      callback(res) {
        if (res.data) {
          self.goodsId = res.data.tradeGoodsCode || 0
          if (!self.state.ChartData) {
            //获取价格走势
            const time = self.getCurrWeekDays()
            dispatch({
              type: 'projectApproval/getPriceTrend',
              payload: {
                sid: self.goodsId,
                period: time
              }
            })
          }
        }
      }
    })

    dispatch({
      //获取进度
      type: 'projectApproval/getFlowChart',
      payload: {
        applyId: this.props.location.query.id
      },
      callback() {
        if (self.props.projectApproval.process.state >= 2) {
          const id = self.props.location.query.id
          if (role) {
            self.getScoreRisk(id, 2) //获取三维指数等数据
          }
        }
        if (self.props.projectApproval.process.state === 5) {
          self.getIsAudit()
        }
      }
    })

    dispatch({
      //获取操作记录
      type: 'projectApproval/getLogs',
      payload: {
        applyId: this.props.location.query.id
      }
    })

    dispatch({
      //获取附件列表
      type: 'projectApproval/getEnclosure',
      payload: {
        applyId: this.props.location.query.id
      }
    })

    dispatch({
      //获取要素建议
      type: 'projectApproval/getRiskFactor',
      payload: this.props.location.query.id
    })

    dispatch({
      type: 'projectApproval/getOtherInfo',
      payload: {
        applyId: this.props.location.query.id
      }
    })
  }

  componentDidMount() {
    sessionStorage.removeItem('scoreRisk')
    this.getData()
  }

  getIsAudit() {
    const { dispatch } = this.props
    dispatch({
      type: 'projectApproval/getIsAudit',
      payload: parseInt(this.props.location.query.id)
    })
  }

  componentWillUnmount() {
    sessionStorage.removeItem('scoreRisk')
  }

  countDown(msg) {
    const self = this
    let secondsToGo = 5
    const modal = Modal.warning({
      title: msg,
      content: `将会在 ${secondsToGo} 秒后退回到审批列表.`,
      okButtonProps: { disabled: true }
    })
    const timer = setInterval(() => {
      secondsToGo -= 1
      modal.update({
        content: `将会在 ${secondsToGo} 秒后退回到审批列表.`
      })
    }, 1000)
    setTimeout(() => {
      clearInterval(timer)
      modal.destroy()
      self.props.history.push('/approval/projectapproval/index')
    }, secondsToGo * 1000)
  }

  updateScoreRisk() {
    const self = this
    const id = this.props.location.query.id
    const dispatch = this.props.dispatch
    dispatch({
      //获取三维指数等
      type: 'projectApproval/updateRiskScore',
      payload: {
        // applyId: this.props.location.query.id,
        applyId: id,
        callback(res, message) {
          const scoreRiskData = res ? res : null
          if (scoreRiskData && scoreRiskData !== -1) {
            //三维图表 宏观经济指数 业务评分数据处理
            scoreRiskData.tempRiskSecondList.forEach(item => {
              self.riskData.dimensionalIndex.data.push({
                name: item.riskRole,
                value: item.secondScore,
                label: item.riskRole
              })
              self.riskData.businessScore.data.push(
                item.tempRiskThirdList.map(item => {
                  return {
                    name: item.indexItem,
                    risk: item.thirdScore
                  }
                })
              )
            })
            for (var key in scoreRiskData.tempMacroeconomicIndexDTO) {
              self.riskData.scoreRisk.push(
                scoreRiskData.tempMacroeconomicIndexDTO[key]
              )
            }
          }
        }
      }
    })
  }

  getScoreRisk(val, type, callback, value) {
    const self = this
    const dispatch = this.props.dispatch
    dispatch({
      //获取三维指数等
      type:
        type === 1
          ? 'projectApproval/getScoreRisk'
          : 'projectApproval/getScoreRiskMacroeconomic',
      payload: {
        // applyId: this.props.location.query.id,
        applyId: val,
        ...value
      },
      callback(res, msg) {
        if (typeof res !== 'object') {
          if (res === -5) {
            self.countDown(msg)
            return
          } else if (res === -4) {
            self.countDown(msg)
            return
          }
          callback && callback(res, msg)
          return
        }
        callback && callback(res, msg)
        sessionStorage.setItem('scoreRisk', true)
        const scoreRiskData = res ? res : null
        if (scoreRiskData && scoreRiskData !== -1) {
          //三维图表 宏观经济指数 业务评分数据处理
          scoreRiskData.tempRiskSecondList.forEach(item => {
            self.riskData.dimensionalIndex.data.push({
              name: item.riskRole,
              value: item.secondScore,
              label: item.riskRole
            })
            self.riskData.businessScore.data.push(
              item.tempRiskThirdList.map(item => {
                return {
                  name: item.indexItem,
                  risk: item.thirdScore
                }
              })
            )
          })
          for (var key in scoreRiskData.tempMacroeconomicIndexDTO) {
            self.riskData.scoreRisk.push(
              scoreRiskData.tempMacroeconomicIndexDTO[key]
            )
          }
        }
      }
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.shouldUpate === nextState.shouldUpate
  }

  handleClick = () => {
    Modal.confirm({
      title: '请确认所有审核意见',
      content: '提交后将无法修改任何信息'
    })
    this.setState({
      loading: true
    })
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

  onChange = value => {
    let riskElements = []
    for (let key in value) {
      if (!isNaN(key) && value[key]) {
        if (key < 5) {
          riskElements.push({
            isDefined: 0,
            riskElementConfigId: key,
            riskElementSort: 0,
            riskElementSuggestionRQ: {
              content: value[key]
            }
          })
        } else {
          if (value['input' + key]) {
            riskElements.push({
              isDefined: 0,
              riskElementConfigId: key,
              riskElementSort: 0,
              riskElementSuggestionRQ: {
                content: value[key]
              },
              riskElementValue: value['input' + key]
            })
          } else {
            riskElements.push({
              isDefined: 0,
              riskElementConfigId: key,
              riskElementSort: 0,
              riskElementSuggestionRQ: {
                content: value[key]
              }
            })
          }
        }
      } else if (value[key]) {
        if (key.indexOf('title') > -1 && value[key] !== undefined) {
          riskElements.push({
            isDefined: 0,
            riskElementConfigId: value[key].split('-')[0],
            riskElementSort: 0,
            riskElementSuggestionRQ: {
              content: value['self' + key.split('title')[1]] || ''
            },
            riskElementValue: value[key].split('-')[1],
            index: key.split('title')[1]
          })
        } else if (key.indexOf('input') > -1 && value[key] !== undefined) {
          riskElements.push({
            isDefined: 0,
            riskElementConfigId: key.substr(5),
            riskElementSort: 0,
            riskElementSuggestionRQ: {
              content: value[key.substr(5)]
            },
            riskElementValue: value[key]
          })
        }
      }
    }
    this.setState({
      riskElements: riskElements,
      shouldUpate: !this.state.shouldUpate
    })
  }

  onSubmit = () => {
    const { dispatch, location, global } = this.props
    const { factor, process } = this.props.projectApproval
    const { riskElements, definedNum } = this.state
    const self = this
    if (process.state === 2 || process.state === 3) {
      let definedFactor = []
      let newFactor = []
      let fac = []
      let newItem = true
      // 获取服务器数据中默认显示的数据
      for (let m = 0; m < factor.length; m++) {
        if (factor[m].isDefined === 0) {
          definedFactor.push(factor[m])
        }
      }

      // 对比修改的数据
      for (let i = 0; i < riskElements.length; i++) {
        for (let j = 0; j < factor.length; j++) {
          if (
            parseInt(riskElements[i].riskElementConfigId) ==
            factor[j].riskElementConfigId
          ) {
            let ele = {
              isDefined: 0,
              riskElementKey: factor[j].riskElementKey,
              riskElementValue: factor[j].riskElementValue,
              riskElementConfigId: parseInt(
                riskElements[i].riskElementConfigId
              ),
              riskElementSort: factor[j].riskElementSort
            }
            if (riskElements[i].riskElementSuggestionRQ) {
              ele['riskElementSuggestionRQ'] =
                riskElements[i].riskElementSuggestionRQ
            }
            if (riskElements[i].riskElementValue) {
              ele['riskElementValue'] = riskElements[i].riskElementValue
            }
            newFactor.push(ele)
          }
        }
      }

      // 对比两个数组数据
      fac = [].concat(definedFactor)
      for (let b = 0; b < newFactor.length; b++) {
        if (newFactor.length === 0) {
          break
        }

        for (let a = 0; a < definedFactor.length; a++) {
          newItem = true
          if (
            definedFactor[a].riskElementConfigId ===
            newFactor[b].riskElementConfigId
          ) {
            fac[a] = newFactor[b]
            newItem = false
            break
          } else {
            if (newItem && a === definedFactor.length - 1) {
              fac.push(newFactor[b])
            }
          }
        }
      }

      dispatch({
        type: 'projectApproval/addRiskFactor',
        payload: {
          applyId: location.query.id,
          riskElements: fac
        },
        success: () => {
          dispatch({
            type: 'projectApproval/agreeApproval',
            payload: {
              applyId: parseInt(this.props.location.query.id),
              userId: global.user.id
            },
            callback(data) {
              message.success('提交' + data.msg)
              const id = self.props.location.query.id
              self.props.history.push(
                `/result?id=${id}&status=0&type=projectApproval&isManage=1`
              )
            }
          })
        }
      })
    } else if (process.state === 5) {
      dispatch({
        type: 'projectApproval/agree',
        payload: this.props.location.query.id,
        callback(data) {
          message.success('提交' + data.msg)
          const id = self.props.location.query.id
          self.props.history.push(
            `/result?id=${id}&status=0&type=projectApproval&isManage=1`
          )
        }
      })
    } else {
      dispatch({
        type: 'projectApproval/agreeApproval',
        payload: {
          applyId: parseInt(this.props.location.query.id),
          userId: global.user.id
        },
        callback(data) {
          message.success('提交' + data.msg)
          const id = self.props.location.query.id
          self.props.history.push(
            `/result?id=${id}&status=0&type=projectApproval&isManage=1`
          )
        }
      })
    }
  }

  onDelete = index => {
    let riskElements = this.state.riskElements
    for (let i = 0; i < riskElements.length; i++) {
      if (riskElements[i].index == index) {
        riskElements.splice(i, 1)
        break
      }
    }
    this.setState({
      riskElements
    })
  }

  handleSubmit(val, callback) {
    const id = this.props.location.query.id
    this.getScoreRisk(id, 1, callback, val)
  }

  render() {
    const { process, factor, businessMode, data } = this.props.projectApproval
    let able = false
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
        key: 'detailInfo',
        tab:
          process.state <= 1
            ? '详细信息'
            : process.state === 6
            ? '详细信息'
            : '风险管控'
      },
      {
        key: 'price',
        tab: '价格走势'
      },
      {
        key: 'incomingData',
        tab: '进件数据'
      }
    ]
    if (process.state !== undefined && process.state > 1) {
      tabListNoTitle.splice(1, 0, {
        key: 'report',
        tab: '立项报告'
      })
    }
    const detail = (
      <Fragment>
        {data.refuseReason ? (
          <div style={{ margin: '-25px -30px 9px -30px' }}>
            <Alert
              message="该立项审批被退回"
              description={<pre>{data.refuseReason}</pre>}
              type="warning"
              showIcon
            />
          </div>
        ) : (
          ''
        )}

        <Card title="流程进度" bordered={false}>
          <Step />
        </Card>

        {process.state <= 1 && (
          <div style={{ marginTop: 20 }}>
            <ProjectReport />
          </div>
        )}

        {process.state === 2 ? (
          !sessionStorage.scoreRisk ? (
            <Mask handleSubmit={this.handleSubmit.bind(this)} able={able}>
              <div
                style={{
                  marginTop: 5,
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <AllScore handleUpdate={this.updateScoreRisk.bind(this)} />
                <EconomicNum data={this.riskData.scoreRisk} />
              </div>

              <div
                style={{
                  marginTop: 5,
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <ThreeDimensionalIndex data={this.riskData.dimensionalIndex} />
                <BusinessScore
                  data={this.riskData.businessScore}
                  type={businessMode}
                />
              </div>
            </Mask>
          ) : (
            <Fragment>
              <div
                style={{
                  marginTop: 5,
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <AllScore handleUpdate={this.updateScoreRisk.bind(this)} />
                <EconomicNum data={this.riskData.scoreRisk} />
              </div>
              <div
                style={{
                  marginTop: 5,
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <ThreeDimensionalIndex data={this.riskData.dimensionalIndex} />
                <BusinessScore
                  data={this.riskData.businessScore}
                  type={businessMode}
                />
              </div>
            </Fragment>
          )
        ) : (
          ''
        )}

        {process.state > 1 && process.state !== 2 && (
          <div
            style={{
              marginTop: 5,
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <AllScore handleUpdate={this.updateScoreRisk.bind(this)} />
            <EconomicNum data={this.riskData.scoreRisk} />
          </div>
        )}

        {process.state > 1 && process.state !== 2 && (
          <div
            style={{
              marginTop: 5,
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <ThreeDimensionalIndex data={this.riskData.dimensionalIndex} />
            <BusinessScore
              data={this.riskData.businessScore}
              type={businessMode}
            />
          </div>
        )}

        {process.state > 1 && <RiskItem />}

        {process.state > 1 && process.state < 4 && (
          <RiskFactor
            data={factor}
            titleEdit={process.state === 2 ? true : false}
            contentEdit={
              process.state === 2 || process.state === 3 ? true : false
            }
            onChange={this.onChange}
            onDelete={this.onDelete}
          />
        )}

        {process.state >= 4 && <Opinion />}

        {process.state <= 1 && (
          <Card title="其他补充信息" bordered={false} style={{ marginTop: 20 }}>
            <OtherInfo />
          </Card>
        )}

        {process.state <= 1 && (
          <Card title="附件" style={{ marginTop: 20 }}>
            <Enclosure />
          </Card>
        )}

        <Card
          title="操作日志"
          headStyle={{ color: '#128DFF' }}
          style={{ marginTop: 20 }}
        >
          <OperationLog />
        </Card>
      </Fragment>
    )

    const priceTrendData = (time, callback) => {
      const dispatch = this.props.dispatch
      const self = this
      dispatch({
        type: 'projectApproval/getPriceTrend',
        payload: {
          sid: self.goodsId,
          period: time
        },
        callback(res) {
          callback && callback(res)
        }
      })
    }
    const price = () => (
      <div>
        {' '}
        <PriceTrend
          handleChange={(time, callback) => priceTrendData(time, callback)}
          name={data.tradeGoods}
        />
      </div>
    )

    const incoming = () => {
      return (
        <Fragment>
          <IncomingData />
        </Fragment>
      )
    }

    const report = () => {
      return <ProjectApprovalTab />
    }
    const contentListNoTitle = {
      detailInfo: detail,
      price: price(),
      report: report(),
      incomingData: incoming()
    }

    return (
      <PAWraper
        tabList={tabListNoTitle}
        tabKey={this.state.noTitleKey}
        onTabChange={key => {
          this.onTabChange(key, 'noTitleKey')
        }}
        onSubmit={this.onSubmit.bind(this)}
      >
        {contentListNoTitle[this.state.noTitleKey]}
      </PAWraper>
    )
  }
}

export default App
