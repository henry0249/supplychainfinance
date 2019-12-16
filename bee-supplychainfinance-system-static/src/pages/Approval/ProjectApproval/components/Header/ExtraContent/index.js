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
@connect(({ global, projectApproval }) => ({
  projectApproval,
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
      projectApproval: { process },
      dispatch
    } = this.props
    const self = this
  }

  handleCancel = () => {}

  showModal = () => {
    //这里要改
    const { global, dispatch } = this.props

    const self = this

    dispatch({
      type: 'projectApproval/queryBackRole',
      payload: {
        applyId: parseInt(this.props.location.query.id),
        userId: global.user.id
      }
    })
    this.setState({
      visible: true
    })
  }

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

  submitBack = () => {
    const { global, dispatch } = this.props
    const {
      projectApproval: { data, people, process }
    } = this.props
    const { select, input } = this.state
    let operateId = 0,
      roleId = 0
    if (process.state !== 5) {
      if (!select) {
        message.error('请选择退回人员')
        return
      }
      operateId = select.split('_')[0]
      roleId = select.split('_')[1]
    }
    let newInput = ''
    if (input) {
      if (input.length < 5) {
        message.warning('请至少填入五个字符')
        return
      }
      if (input.indexOf('\\') !== -1) {
        const str = encodeURI('\\')
        newInput = input.replace(/\\/g, str)
      } else {
        newInput = input
      }
    } else {
      message.warning('请填入退回原因')
      return
    }
    const self = this
    if (process.state === 5) {
      dispatch({
        type: 'projectApproval/refuse',
        payload: {
          applyId: parseInt(this.props.location.query.id),
          reason: newInput
        },
        callback(res) {
          self.setState(
            {
              visible: false
            },
            () => {
              message.success('拒绝成功')
              const id = self.props.location.query.id
              self.props.history.push(
                `/result?id=${id}&status=1&type=projectApproval&isManage=1`
              )
            }
          )
        }
      })
    } else {
      dispatch({
        type: 'projectApproval/submitBack',
        payload: {
          applyId: parseInt(this.props.location.query.id),
          operateId: operateId,
          refuseReason: newInput,
          userId: global.user.id,
          roleId: roleId
        },
        success: () => {
          this.setState(
            {
              visible: false
            },
            () => {
              message.success('退回成功')
              const id = self.props.location.query.id
              self.props.history.push(
                `/result?id=${id}&status=1&type=projectApproval&isManage=1`
              )
            }
          )
        }
      })
    }
  }

  hideModal = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    const { Option } = Select
    const { TextArea } = Input
    const {
      global: { role },
      projectApproval: { data, people, process, able, scoreRisk }
    } = this.props
    const text = (
      <Fragment>
        <div>请确认所有审核意见</div>
        <p style={{ color: '#999999', marginTop: 10 }}>
          提交后将无法修改任何信息
        </p>
      </Fragment>
    )
    switch (process.state) {
      case 1:
        if (role) {
          if (role.roleId !== 5) {
            this.disable = true
            this.backDisable = true
          } else {
            this.disable = false
            this.backDisable = false
          }
        }
        break
      case 2:
        if (role) {
          if (role.roleId !== 6) {
            this.disable = true
            this.backDisable = true
          } else {
            this.disable = false
            this.backDisable = false
            if (Object.keys(scoreRisk).length === 0) {
              this.disable = true
            } else {
              this.disable = false
            }
          }
        }
        break
      case 3:
        if (role) {
          if (role.roleId !== 7) {
            this.disable = true
            this.backDisable = true
          } else {
            this.disable = false
            this.backDisable = false
          }
        }
        break
      case 4:
        if (role) {
          if (role.roleId !== 8) {
            this.disable = true
            this.backDisable = true
          } else {
            this.disable = false
            this.backDisable = false
          }
        }
        break
      case 5:
        if (role) {
          if (role.roleId !== 14) {
            this.disable = true
            this.backDisable = true
          } else {
            this.disable = able
            this.backDisable = able
          }
        }
        break
    }
    if (process.state === 6) {
      this.backDisable = true
      this.disable = true
    }
    return (
      <div className={styles.extraContent} style={{ background: 'white' }}>
        {/* <img
          alt="这是一个标题"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        /> */}
        <Button
          className={styles.return}
          onClick={this.showModal}
          disabled={this.backDisable}
        >
          {process.state !== 5 ? '退回' : '拒绝该项目'}
        </Button>
        {this.disable ? (
          <Button type="primary" disabled={this.disable}>
            {process.state !== 5 ? '提交' : '同意该项目'}
          </Button>
        ) : (
          <Popconfirm
            placement="bottomRight"
            title={text}
            onConfirm={this.handleOk}
            onCancel={this.handleCancel}
            okText="确定"
            cancelText="取消"
          >
            <Button type="primary" disabled={this.disable}>
              {process.state !== 5 ? '提交' : '同意该项目'}
            </Button>
          </Popconfirm>
        )}

        <Modal
          title="退回原因"
          visible={this.state.visible}
          onOk={this.submitBack}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
        >
          {process.state !== 5 ? (
            <div>
              退回至：
              <Select style={{ width: 200 }} onChange={this.selectChange}>
                {people &&
                  people.map(i => (
                    <Option
                      key={i.operateId}
                      value={i.operateId + '_' + i.roleId}
                    >
                      {i.operateName}
                    </Option>
                  ))}
              </Select>
            </div>
          ) : (
            ''
          )}
          <p />
          退回原因：
          <TextArea
            placeholder="请输入至少五个字符"
            autosize={false}
            onChange={this.inputChange}
          />
        </Modal>

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
                <td className={styles.huibao}>{data.quota} 元</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
