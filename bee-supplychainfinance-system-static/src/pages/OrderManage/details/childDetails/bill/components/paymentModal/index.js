import React, { Component } from 'react';
import styles from '../../index.less';
import { Button, Upload, Icon, Form, Input, Select, message } from 'antd';
import { connect } from 'dva';
import { baseUrls } from '@/utils';
import { chineseMon, format } from '@/utils/utils';
import withRouter from "umi/withRouter";

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
const uploadApi = `${baseUrls.domain}/supplychainfinance-common/file/upload?type=2`;

@withRouter
@Form.create()
@connect(({ global, bill, loading }) => ({
  global,
  bill,
  loading: loading.effects
}))
export default class PaymentModal extends Component {
  state = {
    fileList: [],
    files: [],
    caps: null,
    specNum: null
  }

  componentDidMount() {
    const { dispatch, id, orderBusinessId } = this.props;
    const { data } = this.props.bill;
    const { setFieldsValue } = this.props.form;
    const _self = this;
    if (id && data) {
      Object.keys(data).forEach(key => {
        if (key === 'paymentProofDTO') {
          data[key].forEach(ele => {
            if (id === ele.paymentBusinessId) {
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
              setFieldsValue({
                paymentMoney: ele.paymentMoney,
                receiveCompanyName: ele.receiveCompanyName,
                remark: ele.remark || null,
              })
              _self.setState({
                files: filesArr,
                fileList: filesArr,
              })
            }
          })
        }
      })
    }
    dispatch({
      type: 'bill/getPaymentCom',
      payload: orderBusinessId,
      error: (msg) => {
        message.error("获取付款证明中企业列表失败：" + msg);
      }
    })
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
    const { orderBusinessId, retreatFillType, refreshData, callback, dispatch } = this.props;
    const { validateFields } = this.props.form;
    const query = this.props.location.query;
    const { files } = this.state;
    let fileList = [];
    validateFields((err, data) => {
      if (err) {
        return false;
      }

      if (files.length === 0) {
        return message.error('请上传至少一张付款证明');
      } else {
        files.forEach(item => {
          fileList.push({
            fileName: item.name,
            url: item.url
          })
        })
      }

      let params = {
        orderBusinessId, // 订单业务id
        paymentMoney: data.paymentMoney, // 放款金额
        // receiveCompanyId: (data.receiveCompany.split("_"))[0], //收款企业Id,改变不需要
        receiveCompanyName: data.receiveCompanyName, // 收款企业名字
        remark: data.remark, // 备注
        proofs: fileList, // 图片实例
      }

      // console.log(retreatFillType)
      // console.log(query)

      if (retreatFillType) {
        params['retreatFillType'] = retreatFillType
      } else if (query.retreatFillType) {
        params['retreatFillType'] = query.retreatFillType;
      }

      // console.log(params)

      dispatch({
        type: 'bill/submitPayment',
        payload: params,
        success: () => {
          message.success('提交付款证明成功');
          refreshData && refreshData();
          this.setState({
            fileList: [],
            files: []
          }, () => callback && callback("visiblePayment"))
        },
        error: (msg) => {
          message.error("提交付款证明失败：" + msg);
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
    const { preview } = this.props;
    preview && preview(file);
  }

  convertCurrency(e) {
    let caps = chineseMon(e.target.value)
    let specNum = format(e.target.value)
    this.setState({
      caps,
      specNum
    })
  }

  render() {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { comList } = this.props.bill;
    const { fileList, files, caps, specNum } = this.state;
    return (
      <div className={styles.modal}>
        <div className={styles.modalTitle}>
          <span>提交付款证明</span>
          <div>
            <Button onClick={() => resetFields()}>重置</Button>
            <Button type="primary" onClick={this.submit}>提交</Button>
          </div>
        </div>
        <Form className={"bill-modal-form " + styles.formBox}>
          <FormItem label='放款金额' className={styles.formItem}>
            {getFieldDecorator('paymentMoney', {
              rules: [
                {
                  validator: (rule, value, callback) => {
                    if (!value) {
                      callback('请输入放款金额');
                    } else if (isNaN(value)) {
                      callback('请输入正确的放款金额');
                    } else {
                      callback();
                    }
                  }
                }
              ]
            })(
              <Input style={{ width: 240, marginRight: 10 }} onChange={this.convertCurrency.bind(this)} addonBefore="￥" placeholder="请输入" />
            )}
            <span>{caps ? caps : ''}</span>
            <span style={{ marginLeft: 12 }}>{specNum ? specNum + '元' : ''}</span>
          </FormItem>
          <FormItem label='收款企业' className={styles.formItem}>
            {getFieldDecorator('receiveCompanyName', {
              rules: [{ required: true, message: '请选择收款企业' }]
            })(
              <Select style={{ width: 300 }} placeholder="请选择">
                {
                  comList && comList.companyDTOS && comList.companyDTOS.map((item, index) =>
                    <Option value={item.companyName} key={index}>{item.companyName}</Option>
                  )
                }
              </Select>
            )}
          </FormItem>
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
                      callback('请上传至少一张付款证明');
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
          <span className={styles.warning}>支持扩展名：jpg、jpeg、png、pdf、rar、zip;最多上传三张</span>
        </Form>
      </div>
    )
  }
}