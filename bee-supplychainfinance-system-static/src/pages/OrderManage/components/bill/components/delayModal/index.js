import React, { Component } from 'react';
import styles from '../../index.less';
import { Button, DatePicker, Form, Input, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import withRouter from "umi/withRouter";

const FormItem = Form.Item;
const TextArea = Input.TextArea;

@withRouter
@Form.create()
@connect(({ global, bill, loading }) => ({
  global,
  bill,
  loading: loading.effects
}))
export default class BailModal extends Component {
  state = {
    delayDays: 0
  }

  componentDidMount() {
    const { id } = this.props;
    const { data } = this.props.bill;
    const { setFieldsValue } = this.props.form;
    if (id && data) {
      Object.keys(data).forEach(key => {
        if (key === 'delayApplyDTO') {
          data[key].forEach(ele => {
            if (id === ele.delayApplyBusinessId) {
              setFieldsValue({
                pickUpTime: moment(ele.pickUpTime),
                delayReason: ele.delayReason,
              })
              this.setState({
                delayDays: ele.delayDays
              })
            }
          })
        }
      })
    }
  }

  submit = () => {
    const { id, orderBusinessId, refreshData, callback, dispatch } = this.props;
    const { validateFields } = this.props.form;
    const { delayDays } = this.state;
    validateFields((err, data) => {
      if (err) {
        return false;
      }

      let parmas = {
        pickUpTime: moment(data.pickUpTime).format('YYYY-MM-DD HH:mm:ss'), // 延期提货日期
        delayDays: delayDays, // 延期天数
        orderBusinessId, // 订单业务id
        delayReason: data.delayReason, // 延期原因
      }

      if (id) {
        // 延期提货证明业务id 可传可不传
        parmas['delayApplyBusinessId'] = id;
      }

      dispatch({
        type: 'bill/submitDelay',
        payload: parmas,
        success: () => {
          message.success('提交延期提货证明成功');
          refreshData && refreshData();
          this.setState({
            fileList: [],
          }, () => callback && callback("visibleDelay"))
        },
        error: (msg) => {
          message.error("提交延期提货证明失败：" + msg);
        }
      })
    })
  }

  changeDelayDays = (date, dateString) => {
    const { params } = this.props;
    this.setState({
      delayDays: Math.floor((moment(date) - moment(params.pickUpTime)) / 86400000),
    })
  }

  disabledDate = (date) => {
    const { params } = this.props;
    if (!date) {
      return false;
    }
    if (date <= moment(params.pickUpTime)) {
      return true
    }
    return false
  }

  render() {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { delayDays } = this.state;
    return (
      <div className={styles.modal}>
        <div className={styles.modalTitle}>
          <span>提交延期提货申请</span>
          <div>
            <Button onClick={() => resetFields()}>重置</Button>
            <Button type="primary" onClick={this.submit}>提交</Button>
          </div>
        </div>
        <Form className={"bill-modal-form " + styles.formBox}>
          <FormItem label='申请提货日期' className={styles.formItem}>
            {getFieldDecorator('pickUpTime', {
              rules: [{ required: true, message: '请输入申请提货日期' }]
            })(
              <DatePicker
                allowClear={false}
                style={{ width: 300 }}
                placeholder="请输入"
                format='YYYY-MM-DD HH:mm:ss'
                onChange={this.changeDelayDays}
                disabledDate={this.disabledDate}
              />
            )}
          </FormItem>
          <FormItem label='延期天数' className={styles.formItem}>
            <span>{delayDays} 天</span>
          </FormItem>
          <FormItem label='延期原因' className={styles.formItem}>
            {getFieldDecorator('delayReason', {
              rules: [{ required: true, message: '请输入延期原因' }]
            })(
              <TextArea style={{ width: '100%' }} autosize={{ minRows: 4, maxRows: 4 }} placeholder="请输入" />
            )}
          </FormItem>
        </Form>
      </div>
    )
  }
}