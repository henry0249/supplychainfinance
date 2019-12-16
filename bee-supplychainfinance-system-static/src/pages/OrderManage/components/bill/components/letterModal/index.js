import React, { Component } from 'react';
import styles from '../../index.less';
import { Button, Upload, Icon, Form, Input, message } from 'antd';
import { connect } from 'dva';
import { baseUrls } from '@/utils';
import withRouter from "umi/withRouter";

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
export default class LetterModal extends Component {
  state = {
    fileList: [],
    proofs: []
  }

  upload = ({ file, fileList }) => {
    let { proofs } = this.state;
    if (file.status === 'done') {
      message.success('文件上传成功');
      proofs.push({
        fileName: file.name,
        url: file.response ? file.response.data.access_url : ''
      })
      this.setState({
        proofs
      })
    } else if (file.status === 'error') {
      return message.error(`文件上传失败`);
    }
    this.setState({
      fileList
    });
  }

  submit = () => {
    const { letterType, callback, orderBusinessId, refreshData, dispatch } = this.props;
    const { validateFields } = this.props.form;
    const { proofs } = this.state;
    validateFields((err, data) => {
      if (err) {
        return false;
      }

      if (data.draggerInvoice && data.draggerInvoice.fileList.length === 0) {
        return message.error(`请上传至少一张${letterType === 0 ? '委托采购函' : letterType === 1 ? '委托销售函' : '委托付款函'}`);
      }

      let params = {
        orderId: orderBusinessId, // 订单业务id
        letterType, // 函类型
        remark: data.remark, // 备注
        proofs, // 图片实例
      }

      dispatch({
        type: 'bill/submitLetter',
        payload: params,
        success: () => {
          message.success(`提交${letterType === 0 ? '委托采购函' : letterType === 1 ? '委托销售函' : '委托付款函'}成功`);
          refreshData && refreshData();
          this.setState({
            fileList: [],
            proofs: []
          }, () => callback && callback("visibleLetter"))
        },
        error: (msg) => {
          message.error(`提交${letterType === 0 ? '委托采购函' : letterType === 1 ? '委托销售函' : '委托付款函'}失败：` + msg);
        }
      })
    })
  }

  handleDelete = (file) => {
    const { proofs } = this.state;
    for (let i = 0; i < proofs.length; i++) {
      if (proofs[i].fileName === file.name && proofs[i].url === file.response.data.access_url) {
        proofs.splice(i, 1);
        break;
      }
    }
    this.setState({
      proofs
    })
  }

  handlePreview = (file) => {
    const { preview } = this.props;
    preview && preview(file);
  }

  render() {
    const { letterType } = this.props;
    const { getFieldDecorator, resetFields } = this.props.form;
    const { fileList, proofs } = this.state;
    return (
      <div className={styles.modal}>
        <div className={styles.modalTitle}>
          <span>提交{letterType === 0 ? '委托采购函' : letterType === 1 ? '委托销售函' : '委托付款函'}</span>
          <div>
            <Button onClick={() => resetFields()}>重置</Button>
            <Button type="primary" onClick={this.submit}>提交</Button>
          </div>
        </div>
        <Form className={"bill-modal-form " + styles.formBox}>
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
                    if (proofs.length === 0) {
                      callback(`请上传至少一张${letterType === 0 ? '委托采购函' : letterType === 1 ? '委托销售函' : '委托付款函'}`);
                    } else {
                      callback();
                    }
                  }
                }
              ],
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
                  fileList && fileList.length < 3 && <div>
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