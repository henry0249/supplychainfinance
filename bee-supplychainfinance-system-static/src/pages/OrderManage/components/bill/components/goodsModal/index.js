import React, { Component } from 'react';
import styles from '../../index.less';
import { Button, Upload, Icon, Form, Input, DatePicker, InputNumber, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { baseUrls } from '@/utils';
import withRouter from "umi/withRouter";

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const uploadApi = `${baseUrls.domain}/supplychainfinance-common/file/upload?type=2`;

@withRouter
@Form.create()
@connect(({ global, detail, bill, loading }) => ({
  global,
  detail,
  bill,
  loading: loading.effects
}))
export default class GoodsModal extends Component {
  state = {
    fileList: [],
    files: [],
    paymentMoney: 0,
    edit: false
  }

  componentDidMount() {
    const { id } = this.props;
    const { data } = this.props.bill;
    const { setFieldsValue } = this.props.form;
    const _self = this;
    if (id && data) {
      Object.keys(data).forEach(key => {
        if (key === 'pickUpApplyDTO') {
          data[key].forEach(ele => {
            if (id === ele.pickUpBusinessId) {
              let filesArr = [];
              ele.files.forEach((item, index) => {
                let obj = {};
                obj = {
                  uid: index,
                  name: item.fileName,
                  status: 'done',
                  url: item.url,
                }
                filesArr.push(obj);
              })
              if ((sessionStorage.businessMode === '0' || sessionStorage.businessMode === '2') && ele.systemMoney) {
                _self.setState({
                  files: filesArr,
                  fileList: filesArr,
                  paymentMoney: ele.systemMoney,
                  edit: true
                }, () => {
                  setFieldsValue({
                    pickUpAmount: ele.pickUpAmount,
                    pickUpTime: moment(ele.pickUpTime),
                    paymentMoney: ele.paymentMoney,
                    remark: ele.remark || null,
                  })
                })
              } else {
                _self.setState({
                  paymentMoney: ele.paymentMoney,
                  files: filesArr,
                  fileList: filesArr,
                }, () => {
                  setFieldsValue({
                    pickUpAmount: ele.pickUpAmount,
                    pickUpTime: moment(ele.pickUpTime),
                    remark: ele.remark || null,
                  })
                })
              }
            }
          })
        }
      })
    }
  }

  upload = ({ file, fileList }) => {
    let { files } = this.state;
    if (file.status === 'done') {
      files.push({
        uid: files.length,
        name: file.name,
        status: 'done',
        url: file.response ? file.response.data.access_url : ''
      })
      this.setState({
        files
      }, () => message.success('文件上传成功'))
    } else if (file.status === 'error') {
      return message.error(`文件上传失败`);
    }
    this.setState({
      fileList
    })
  }

  submit = () => {
    const { id, orderBusinessId, refreshData, callback, dispatch } = this.props;
    const { validateFields } = this.props.form;
    const { files, paymentMoney, edit } = this.state;
    let fileList = [];
    validateFields((err, data) => {
      if (err) {
        return false;
      }

      if (files.length === 0) {
        return message.error('请上传至少一张保证金证明');
      } else {
        files.forEach(item => {
          fileList.push({
            fileName: item.name,
            url: item.url
          })
        })
      }

      let params = {
        pickUpAmount: data.pickUpAmount, // 提货数量
        pickUpTime: moment(data.pickUpTime).format('YYYY-MM-DD HH:mm:ss'), // 提货日期
        paymentMoney: paymentMoney,
        orderBusinessId, // 订单业务id
        remark: data.remark, // 备注
        proofs: fileList, // 图片实例
      }

      if (id) {
        // 提货申请证明业务id 可传可不传
        params['pickUpBusinessId'] = id;
      }

      if (edit && data.paymentMoney) {
        params.paymentMoney = Number(data.paymentMoney).toFixed(2);
        params['systemMoney'] = Number(paymentMoney);
      }

      dispatch({
        type: 'bill/submitGoods',
        payload: params,
        success: () => {
          message.success('提交提货证明成功');
          refreshData && refreshData();
          this.setState({
            fileList: [],
            files: [],
            edit: false
          }, () => callback && callback("visibleGoods"))
        },
        error: (msg) => {
          message.error("提交提货证明失败：" + msg);
        }
      })
    })
  }

  handleDelete = (file) => {
    const { files } = this.state;
    for (let i = 0; i < files.length; i++) {
      let url = file.response ? file.response.data.access_url : file.url;
      if (files[i].name === file.name && files[i].url === url) {
        files.splice(i, 1);
        break;
      }
    }
    this.setState({
      files
    })
  }

  handlePreview = (file) => {
    const { preview, dispatch } = this.props;
    preview && preview(file);
  }

  changePrice = (value) => {
    const { params } = this.props;
    const { orderInfo } = this.props.detail;
    const { paymentMoney } = this.state;
    let money = 0;
    if (sessionStorage.businessMode === '0') {
      if (params.grade) {
        money = value * params.sellingPrice * params.grade;
      } else {
        money = value * params.sellingPrice;
      }
      if (orderInfo.goodsPaymentRemain < paymentMoney) {
        money = orderInfo.goodsPaymentRemain
      }
    } else {
      // 【 
      // {单价 * 质押比例 + 单价 * 质押比例 *（年化利率/360）* 资金占用天数} +
      // {单价 * 质押比例 *（年化利率/360）* 资金占用天数} * 税率 +
      // {单价 * 质押比例 *（年化利率/360）* 资金占用天数} * 税率 * 0.1 +
      // {单价 * 质押比例 * 0.06/100}
      // 】 * 提货数量 * 品位

      // unitPrice:单价，pledgeRatio:质押比例，annualRate:年化利率，capitalOccupationDays:资金占用天数，taxRate: 税率，grade:品位
      let unit = params.unitPrice * (params.pledgeRatio / 100) * (params.annualRate / 36000) * params.capitalOccupationDays;
      if (params.grade) {
        money = (((params.unitPrice * (params.pledgeRatio / 100)) + unit) + (unit * (params.taxRate / 100)) + (unit * (params.taxRate / 1000)) + (params.unitPrice * (params.pledgeRatio / 100) * 0.0006)) * value * params.grade;
      } else {
        money = (((params.unitPrice * (params.pledgeRatio / 100)) + unit) + (unit * (params.taxRate / 100)) + (unit * (params.taxRate / 1000)) + (params.unitPrice * (params.pledgeRatio / 100) * 0.0006)) * value;
      }
    }
    this.setState({
      paymentMoney: money.toFixed(2)
    })
  }

  render() {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { fileList, files, paymentMoney, edit } = this.state;
    return (
      <div className={styles.modal}>
        <div className={styles.modalTitle}>
          <span>提交提货申请</span>
          <div>
            <Button onClick={() => resetFields()}>重置</Button>
            <Button type="primary" onClick={this.submit}>提交</Button>
          </div>
        </div>
        <Form className={"bill-modal-form " + styles.formBox}>
          <FormItem label='提货数量' className={styles.formItem}>
            {getFieldDecorator('pickUpAmount', {
              rules: [{ required: true, message: '请输入提货数量' }]
            })(
              <InputNumber style={{ width: 200, marginRight: 10 }} precision={3} placeholder="请输入" onChange={this.changePrice} />
            )}
            <span>吨</span>
          </FormItem>
          <FormItem label='提货日期' className={styles.formItem}>
            {getFieldDecorator('pickUpTime', {
              rules: [{ required: true, message: '请输入提货日期' }]
            })(
              <DatePicker style={{ width: 300 }} placeholder="请输入" format='YYYY-MM-DD HH:mm:ss' allowClear={false} />
            )}
          </FormItem>
          <FormItem label='需付款金额' className={styles.formItem}>
            {
              sessionStorage.businessMode === '0' || sessionStorage.businessMode === '2' ?
                (
                  edit ?
                    <span>{paymentMoney} 元</span>
                    :
                    <span>{paymentMoney} 元<span onClick={() => this.setState({ edit: true })} style={{ marginLeft: 10, color: '#1890FF', cursor: 'pointer' }}>金额不正确？点击修改</span></span>
                )
                :
                <span>{paymentMoney} 元</span>
            }
          </FormItem>
          {
            edit && <FormItem label='需付款金额' className={styles.formItem}>
              {getFieldDecorator('paymentMoney', {
                initialValue: paymentMoney,
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      if (!value) {
                        callback('请输入需提款金额');
                      } else if (isNaN(Number(value))) {
                        callback('请输入数字');
                      } else {
                        callback();
                      }
                    }
                  }
                ]
              })(
                <Input style={{ width: 300 }} addonBefore='￥' />
              )}
            </FormItem>
          }
          <FormItem label='备注' className={styles.formItem}>
            {getFieldDecorator('remark', {
              rules: [{ max: 255, message: '超出最大长度限制' }]
            })(
              <TextArea style={{ width: '100%' }} autosize={{ minRows: 4, maxRows: 4 }} placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label='附件上传' className={styles.formItem}>
            {getFieldDecorator('draggerInvoice', {
              rules: [
                {
                  validator: (rule, value, callback) => {
                    if (files.length === 0) {
                      callback('请上传至少一张提货申请证明');
                    } else {
                      callback();
                    }
                  }
                }
              ]
            })(
              <Upload
                name="file"
                listType="picture-card"
                fileList={fileList}
                className="avatar-uploader"
                action={uploadApi}
                accept='image/jpg, image/jpeg, image/png, .pdf, application/pdf, .rar, .zip'
                onPreview={this.handlePreview}
                onChange={this.upload}
                onRemove={this.handleDelete}
              >
                {
                  files && files.length < 3 && <div>
                    <Icon type='plus' />
                    <div className="ant-upload-text">上传</div>
                  </div>
                }
              </Upload>
            )}
          </FormItem>
          <span className={styles.formWaring}>(请上传付款证明)</span>
          <span className={styles.warning}>支持扩展名：jpg、jpeg、png、pdf、rar、zip;最多上传三张</span>
        </Form>
      </div>
    )
  }
}