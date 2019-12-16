import { Component } from 'react';
import { Breadcrumb, Form, Row, Upload, Select, Input, Cascader, Button, Icon, message } from 'antd';
import withRouter from 'umi/withRouter';
import styles from './index.less';
import { baseUrls } from '@/common';
import { districtDataHandle } from '@/common/utils';
import {
  getUserInfo,
  getRegion,
  saveUserInfo
} from '../services';

const FormItem = Form.Item;
const Option = Select.Option;

@withRouter
@Form.create()
export default class Details extends Component {
  state = {
    data: {},
    imageUrl: null,
    region: null
  }

  componentDidMount() {
    console.log(11)
    const { id } = this.props.location.query;
    getRegion()
      .then(res => {
        if (res && res.code === 0) {
          const region = districtDataHandle(res.data[0].children)
          this.setState({
            region
          })
        } else {
          this.setState({
            region: null
          })
        }
      })
    this.getData(id);
  }

  getData = (id) => {
    const { setFieldsValue } = this.props.form;
    getUserInfo(id)
      .then(res => {
        if (res.code === 0) {
          let place = [];
          // 判断是否返回省id
          if (res.data.provinceId) {
            place.push(parseInt(res.data.provinceId));
            // 省id存在的情况下保存市id
            if (res.data.cityId) {
              place.push(parseInt(res.data.cityId));
              // 市id存在的情况下保存区县id
              if (res.data.regionid) {
                place.push(parseInt(res.data.regionid));
              }
            }
          }
          setFieldsValue({
            username: res.data.username || '',
            phone: res.data.phone || '',
            fixtel: res.data.fixtel || '',
            email: res.data.email || '',
            address: res.data.address || '',
            place
          })
          this.setState({
            data: res.data
          })
        } else {
          this.setState({
            data: {}
          }, () => message.error('获取用户详情失败：' + res.message))
        }
      })
  }

  beforeUpload = (file) => {
    const isMax10M = file.size / 1024 / 1024 < 10; // 最大10M
    if (!isMax10M) {
      message.error("图片大小最大支持10M！");
    }
    return isMax10M;
  }

  handleChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({
        imageUrl: null
      })
      return;
    }
    if (file.status === 'done') {
      if (file.response.code === 1) {
        this.setState({
          imageUrl: file.response.object.access_url
        })
      } else {
        this.setState({
          imageUrl: null
        }, () => message.error("头像上传异常，请重试"))
      }
    }
    if (file.status === 'error') {
      this.setState({
        imageUrl: null
      }, () => message.error("头像上传异常，请重试"))
      return;
    }
  };

  onSubmit = () => {
    const { validateFields } = this.props.form;
    const { id } = this.props.location.query;
    const { imageUrl } = this.state;
    validateFields((err, values) => {
      if (!err) {
        let linkEnterprises = [];
        let params = {
          id: id,
          head: imageUrl,
          username: values.username,
          phone: values.phone,
          fixtel: values.fixtel,
          email: values.email,
          regionid: values.place[values.place.length - 1],
          address: values.address,
        }
        for (let key in values) {
          if (key.indexOf('isActive') > -1) {
            linkEnterprises.push({
              id: parseInt(key.split('_')[1]),
              isActive: values[key],
              isManager: parseInt(key.split('_')[2])
            })
          }
        }

        params['linkEnterprises'] = linkEnterprises;
        saveUserInfo(params)
          .then(
            res => {
              if (res.code === 0) {
                message.success('修改用户信息成功')
              } else {
                message.error('修改用户信息失败:' + res.message)
              }
            }
          )
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { data, imageUrl, region } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Breadcrumb>
            <Breadcrumb.Item>首页</Breadcrumb.Item>
            <Breadcrumb.Item>用户管理</Breadcrumb.Item>
            <Breadcrumb.Item>查看详情</Breadcrumb.Item>
          </Breadcrumb>
          <span className={styles.boxTitle}>用户资料详情</span>
          <span className={styles.action}>操作：可编辑</span>
          <Button type="primary" icon="rollback">返回</Button>
        </div>

        <div className={styles.baseForm}>
          <Form className={styles.form} layout="inline" hideRequiredMark={true}>
            <Row>
              <FormItem className={styles.avatar} label="头像">
                {getFieldDecorator('head', {
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        if (!imageUrl) {
                          callback('请上传您的用户头像');
                        } else {
                          callback();
                        }
                      }
                    }
                  ]
                })(
                  <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action={`${baseUrls.domain}/api/files/uploadFile`}
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange}
                  >
                    {
                      imageUrl ?
                        <img style={{ width: 100, height: 100 }} src={imageUrl} alt="avatar" />
                        :
                        <div className={styles.upload}>
                          <Icon style={{ fontSize: 20 }} type="plus" />
                          <div>上传</div>
                        </div>
                    }
                  </Upload>
                )}
              </FormItem>
            </Row>

            <Row>
              <FormItem label="用户姓名">
                {
                  getFieldDecorator('username', {
                    rules: [
                      { required: true, message: '请输入用户姓名' },
                      { whitespace: true, message: '请不要输入空格' }
                    ]
                  })(
                    <Input style={{ width: 240 }} placeholder="用户姓名" />
                  )
                }
              </FormItem>
            </Row>

            <Row>
              <FormItem label="注册手机号">
                {
                  getFieldDecorator('phone', {
                    rules: [
                      { required: true, message: '请输入注册手机号' },
                      { whitespace: true, message: '请不要输入空格' }
                    ]
                  })(
                    <Input style={{ width: 240 }} placeholder="注册手机号" />
                  )
                }
              </FormItem>
            </Row>

            <Row>
              <FormItem label="固话">
                {
                  getFieldDecorator('fixtel', {
                    rules: [
                      { required: true, message: '请输入固话' },
                      { whitespace: true, message: '请不要输入空格' }
                    ]
                  })(
                    <Input style={{ width: 240 }} placeholder="固话" />
                  )
                }
              </FormItem>
            </Row>

            <Row>
              <FormItem label="关联邮箱">
                {
                  getFieldDecorator('email', {
                    rules: [
                      { required: true, message: '请输入关联邮箱' },
                      { whitespace: true, message: '请不要输入空格' }
                    ]
                  })(
                    <Input style={{ width: 240 }} placeholder="关联邮箱" />
                  )
                }
              </FormItem>
            </Row>

            <Row>
              <FormItem label="地址">
                {
                  getFieldDecorator('place', {
                    rules: [
                      { required: true, message: '请选择' },
                    ]
                  })(
                    <Cascader
                      options={region}
                      placeholder="请选择公司地址"
                      style={{ width: 300 }}
                    />
                  )
                }
                {
                  getFieldDecorator('address', {
                    rules: [
                      { required: true, message: '请输入详细地址' },
                      { whitespace: true, message: '请不要输入空格' }
                    ]
                  })(
                    <Input style={{ marginLeft: 20, width: 480 }} placeholder="详细地址" />
                  )
                }
              </FormItem>
            </Row>
          </Form>
        </div>

        {
          data.linkEnterprises && data.linkEnterprises.map((item, index) =>
            <div className={styles.company} key={index}>
              <span className={styles.name}>{item.name}{item.isManager === 1 ? '（本账号是该企业的管理员）' : ''}</span>
              <Form className={styles.form} layout="inline" hideRequiredMark={true}>
                <Row>
                  <FormItem label="账号状态">
                    {
                      getFieldDecorator('isActive_' + item.id + '_' + item.isManager, {
                        initialValue: item.isActive,
                        rules: [
                          { required: true, message: '请选择账号状态' }
                        ]
                      })(
                        <Select style={{ width: 240 }} placeholder="请选择" disabled={item.isManager ? true : false}>
                          <Option value={1}>启用中</Option>
                          <Option value={0}>已禁用</Option>
                        </Select>
                      )
                    }
                  </FormItem>
                </Row>
                <Row>
                  <FormItem label="所属部门">
                    <Select style={{ width: 240 }} placeholder="请选择" disabled>
                      <Option value={item.department}>{item.department}</Option>
                    </Select>
                  </FormItem>
                </Row>
                <Row>
                  <FormItem label="职位">
                    <Select style={{ width: 240 }} placeholder="请选择" disabled>
                      <Option value={item.post}>{item.post}</Option>
                    </Select>
                  </FormItem>
                </Row>
              </Form>
            </div>
          )
        }

        <div className={styles.footer}>
          <Button onClick={() => resetFields()}>取消</Button>
          <Button onClick={this.onSubmit.bind(this)} type="primary">提交</Button>
        </div>
      </div>
    )
  }
}