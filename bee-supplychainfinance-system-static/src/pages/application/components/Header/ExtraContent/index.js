import React, { Component, Fragment } from 'react'
import {
  Card,
  Button,
  Icon,
  List,
  Modal,
  Select,
  Input,
  Popconfirm,
  message
} from 'antd'
import styles from './index.less'
import { connect } from 'dva'
import { withRouter } from 'react-router'
//'其他补充信息'组件
@withRouter
@connect(({ global, application }) => ({
  application,
  global
}))
export default class ExtraContent extends Component {
  constructor() {
    super()
    this.state = {
      visible: false,
      loading: false,
      select: null,
      input: null,
      able: false
    }
    this.status = {
      '0': '待审批',
      '2': '初审中',
      '3': '风控审核中',
      '4': '终审中',
      '5': '决策复核中',
      '6': '完成'
    }
    this.disable = true
    this.backDisable = true
  }

  handleClick = () => {}

  handleOk = () => {
    const { submit } = this.props
    submit && this.props.submit()
  }

  componentDidMount() {
    const {
      application: { process },
      dispatch
    } = this.props
    const self = this
  }

  handleCancel = () => {}

  selectChange = e => {
    this.setState({
      select: e
    })
  }

  inputChange = e => {
    this.setState({
      input: e.target.value
    })
  }

  render() {
    const { Option } = Select
    const { TextArea } = Input
    const {
      global: { role },
      application: { data, people, process, able, scoreRisk }
    } = this.props
    return (
      <div className={styles.extraContent} style={{ background: 'white' }}>
        <div>
          <table style={{ minWidth: 250, textAlign: 'center' }}>
            <thead>
              <tr className={styles.statusContain}>
                <th className={styles.status}>状态</th>
                <th className={styles.huibao}>申请额度</th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.huibaoContain}>
                <td className={styles.status}>
                  {this.status[data.reviewStatus]
                    ? this.status[data.reviewStatus]
                    : ' 待审批'}
                </td>
                <td className={styles.huibao}>
                  {data.quota ? data.quota + '元' : ''}
                </td>
              </tr>
            </tbody>
          </table>
          {/* <div className={styles.statusContain}>
            <span className={styles.status}>状态</span>
            <span
              className={styles.huibao}
              style={process.state === 5 ? { marginLeft: '50px' } : {}}
            >
              申请额度
            </span>
          </div>
          <div className={styles.huibaoContain}>
            <span className={styles.status}>
              {this.status[data.reviewStatus]
                ? this.status[data.reviewStatus]
                : ' 待审批'}
            </span>
            <span className={styles.huibao}>{data.quota}</span>
          </div> */}
        </div>
      </div>
    )
  }
}
