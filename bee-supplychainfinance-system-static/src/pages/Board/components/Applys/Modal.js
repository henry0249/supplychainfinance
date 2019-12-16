import React, { Component } from 'react'
import { Modal, Form, Input, Select, Button, message } from 'antd'
import style from './Modal.less'
import { connect } from 'dva'
import { utils, configs } from '@/utils'
import { postApplication } from '../../services'

const { Option } = Select

@Form.create()
@connect(({ supplyChain, global }) => ({
  supplyChain,
  global
}))
export default class ApplyModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      tradeGoods: [],
      type: '0'
    }
  }
  componentDidMount() {
    const { dispatch } = this.props
    this.setState({
      applyCompanyName: localStorage.companyName,
      userToken: localStorage.token,
      applyCompanyId: localStorage.companyId
    })
    // dispatch({
    //   type: "supplyChain/getSubjectMatterList",
    //   callback(res) {
    //     if (res.code === 0) {
    //       this.setState({
    //         tradeGoods: res.data
    //       });
    //     } else {
    //       message.error(res.msg);
    //     }
    //   }
    // })
  }


  selectChange = e => {
    this.setState({ type: e })
  }


  handleSubmit = e => {
    e.stopPropagation()
    const { validateFields } = this.props.form
    const { dispatch } = this.props
    const { type } = this.state
    validateFields((err, values) => {
      if (!err) {
        const { applyCompanyName, applyCompanyId } = this.state
        const params = {
          applyCompanyName: applyCompanyName,
          applyCompanyId: applyCompanyId,
          tradeGoodsTypeName: values.tradeGoodsTypeName,
          sysToken: sessionStorage.getItem('sysToken')
        }
        postApplication({ body: { ...params, ...values }, businessMode: type }).then(res => {
          if (res.code === 0) {
            message.success('申请已提交，请等待工作人员与你联系！')
            this.props.form.resetFields()
            this.visibleCtrl(false)
          } else {
            message.error(res.msg)
          }
        })
      }
    })
  }

  visibleCtrl(visible) {
    this.setState({ visible })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const {
      type,
      global: { user }
    } = this.props
    const { tradeGoods, visible } = this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
    const button = {
      background: 'url(../../assets/supply/9.png) no-repeat center center',
      backgroundColor: '#DA9859',
      boxShadow: '0px 1px 30px 0px rgba(60,59,136,0.1)',
      borderRadius: '2px',
      width: 150,
      height: 40,
      border: 'none'
    }
    return (
      <div className={style.modalWrap}>
        <div className={style.showModal} onClick={this.visibleCtrl.bind(this, true)}> 新的申请+</div>
        <Modal
          title="服务申请表"
          visible={visible}
          onCancel={this.visibleCtrl.bind(this, false)}
          style={{ width: 548, height: 531 }}
          className={style.modal}
          footer={null}
          closable={false}
        >
          <div className={style.closeBox} onClick={this.visibleCtrl.bind(this, false)}>
            X
          </div>
          <Form {...formItemLayout}>
            <Form.Item label="申请企业">
              <span>{user.companyName ? user.companyName : ''}</span>
            </Form.Item>
            <Form.Item label="业务模式">
              {getFieldDecorator('businessMode', {
                initialValue: type,
                rules: [
                  {
                    required: true,
                    message: 'Please input your E-mail!'
                  }
                ]
              })(
                <Select onChange={this.selectChange}>
                  {configs.businessModes.map(item => <Option key={item.key} value={item.key}>{item.name}</Option>)}
                </Select>
              )}
            </Form.Item>
            {this.state.type === '2' ? null : (
              <Form.Item label="上游/下游企业">
                {getFieldDecorator('upDownstreamName', {
                  rules: [
                    {
                      type: 'string',
                      message: '请填入上游/下游企业，不超过20个字符！',
                      required: true,
                      max: 20
                    }
                  ]
                })(<Input placeholder="请填入上游/下游企业" />)}
              </Form.Item>
            )}

            <Form.Item label="交易货品">
              {getFieldDecorator('tradeGoodsTypeName', {
                rules: [
                  {
                    required: true,
                    message: '请填写交易货品！'
                  }
                ]
              })(<Input placeholder="请填入货品" />)}
            </Form.Item>
            <Form.Item label="数量">
              {getFieldDecorator('quantity', {
                rules: [
                  {
                    required: true,
                    message: '货品数量填入不正确！',
                    pattern: new RegExp(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/g)
                  }
                ]
              })(<Input placeholder="请填入数量" />)}
            </Form.Item>
            <Form.Item label="预计金额">
              {getFieldDecorator('estimatedAmount', {
                rules: [
                  {
                    required: true,
                    message: '请填入预计金额！',
                    pattren: utils.moneyExp
                  }
                ]
              })(<Input addonBefore="￥" placeholder="请输入预计金额" />)}
            </Form.Item>
            <Form.Item
              label=""
              wrapperCol={{
                xs: { span: 24 },
                sm: { span: 24 }
              }}
              style={{}}
            >
              <Button
                type="primary"
                style={{ float: 'right', marginRight: '8%', ...button }}
                onClick={this.handleSubmit}
              >
                确定
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

ApplyModal.defaultProps = {
  visible: true,
}
