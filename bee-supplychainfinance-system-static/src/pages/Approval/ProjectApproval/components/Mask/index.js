import React, { Component } from 'react'
import style from './index.less'
import noData from '@/assets/u4854.png'
import propTypes from 'prop-types'
import { Button, Modal, Select, Form } from 'antd'
import { message } from 'antd'

const Option = Select.Option
@Form.create()
class Mask extends Component {
  constructor() {
    super()
    this.state = {
      visible: false,
      hidden: false,
      loading: false
    }
  }

  handleOk() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.opinion === '请选择') {
          message.error('请选择舆情指数')
          return
        }
        this.setState({
          loading: true
        })
        this.props.handleSubmit(values, (res, msg) => {
          if (typeof res !== 'object') {
            message.error(msg)
            this.setState({
              loading: false
            })
          } else {
            this.setState({
              visible: false,
              hidden: true,
              loading: false
            })
          }
        })
      }
    })
  }

  handleCancel() {
    this.setState({
      visible: false,
      loading: false
    })
  }

  maskClick(e) {
    if (e.target.getAttribute('class')) {
      if (e.target.getAttribute('class').indexOf('conWrap') !== -1) {
        this.setState({
          hidden: true
        })
      }
    }
  }

  handleClick(e) {
    if (this.props.maskClosable) {
      this.maskClick(e)
    } else {
      return
    }
  }
  render() {
    const { form } = this.props
    const { getFieldDecorator, validateFields, getFieldValue } = form
    const content = (
      <div className={style.Mask} style={{ position: 'relative' }}>
        <div className={style.wrap}>
          <div className={style.header}>
            <p>获取详情分数</p>
          </div>
          <div className={style.content}>
            <p style={{ textAlign: 'center' }}>请选择项申请的舆情指数</p>
            <Form onSubmit={() => {}} style={{ width: '65%', marginLeft: 116 }}>
              <Form.Item layout="vertical" label="舆情指数">
                {getFieldDecorator('emotionIndexType', {
                  initialValue: '请选择',
                  rules: [{ required: true, message: '请选择' }]
                })(
                  <Select style={{ width: '79%' }}>
                    <Option value={3}>低：舆情较好，没有负面舆情</Option>
                    <Option value={2}>中：有一定负面舆情，影响一般</Option>
                    <Option value={1}>高：有较高的负面舆情</Option>
                  </Select>
                )}
              </Form.Item>
            </Form>
          </div>
          <div className={style.footer}>
            <Button
              type="primary"
              onClick={this.handleOk.bind(this)}
              loading={this.state.loading}
              disabled={this.props.able}
            >
              提交
            </Button>
          </div>
        </div>
      </div>
    )
    return (
      <div style={{ position: 'relative' }} className={style.MaskWrap}>
        {this.state.hidden ? (
          ''
        ) : (
          <div className={style.conWrap} onClick={this.handleClick.bind(this)}>
            {content}
          </div>
        )}
        {this.props.children}
      </div>
    )
  }
}

Mask.propTypes = {
  handleSubmit: propTypes.func
}

//是否点击蒙层关闭
Mask.defaultProps = {
  maskClosable: false,
  handleSubmit: function(value) {}
}

export default Mask
