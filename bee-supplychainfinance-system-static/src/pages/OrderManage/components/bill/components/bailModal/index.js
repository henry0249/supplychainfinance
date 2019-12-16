import React, { Component } from 'react';
import styles from '../../index.less';
import { Upload, Icon, Form, Input, InputNumber, message, Button } from 'antd';
import { connect } from 'dva';
import { chineseMon, format } from '@/utils/utils';
import withRouter from "umi/withRouter";
import { baseUrls } from '@/utils';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const uploadApi = `${baseUrls.domain}/supplychainfinance-common/file/upload?type=2`;

@withRouter
@Form.create()
@connect(({ global, bill, loading }) => ({
  global,
  bill,
  loading: loading.effects
}))
export default class BailModal extends Component {
  state = {
    fileList: [],
    files: [],
    caps: null, // 大写
    specNum: null
  }

  componentDidMount() {
    const { id } = this.props;
    const { data } = this.props.bill;
    const { setFieldsValue } = this.props.form;
    const _self = this;
    if (id && data) {
      Object.keys(data).forEach(key => {
        if (key === 'bondProofDTO') {
          data[key].forEach(ele => {
            if (id === ele.bondBusinessId) {
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
                bondMoney: ele.bondMoney,
                bondRatio: ele.bondRatio,
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
    const { files } = this.state;
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
        orderBusinessId, // 订单业务id
        bondMoney: data.bondMoney, // 保证金金额
        proofs: fileList, // 图片实例
        remark: data.remark, // 备注
      }

      if (sessionStorage.businessMode !== '1') {
        params['bondRatio'] = data.bondRatio // 保证金比例
      }

      if (id) {
        //保证金证明业务id 可传可不传
        params['bondBusinessId'] = id;
      }

      dispatch({
        type: 'bill/submitBail',
        payload: params,
        success: () => {
          message.success("提交保证金证明成功");
          refreshData && refreshData();
          this.setState({
            fileList: [],
            files: []
          }, () => callback && callback("visibleBail"))
        },
        error: (msg) => {
          message.error("提交保证金证明失败：" + msg);
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
    const { fileList, files, caps, specNum } = this.state;
    return (
      <div className={styles.modal}>
        <div className={styles.modalTitle}>
          <span>提交保证金证明</span>
          <div>
            <Button onClick={() => resetFields()}>重置</Button>
            <Button type="primary" onClick={this.submit}>提交</Button>
          </div>
        </div>
        <Form className={"bill-modal-form " + styles.formBox}>
          <FormItem label='保证金金额' className={styles.formItem}>
            {getFieldDecorator('bondMoney', {
              rules: [
                { required: true, message: ' ' },
                {
                  validator: (rule, value, callback) => {
                    if (!value) {
                      callback('请输入保证金金额');
                    } else if (isNaN(value)) {
                      callback('请输入正确的保证金金额');
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
          {
            sessionStorage.businessMode !== '1' && <FormItem label='保证金比例' className={styles.formItem}>
              {getFieldDecorator('bondRatio', {
                rules: [{ required: true, message: '请输入保证金比例' }]
              })(
                <InputNumber style={{ width: 200, marginRight: 10 }} min={1} max={100} placeholder="请输入" />
              )}
              <span>%</span>
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
            {getFieldDecorator('files', {
              rules: [
                {
                  validator: (rule, value, callback) => {
                    if (files.length === 0) {
                      callback('请上传至少一张保证金证明');
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