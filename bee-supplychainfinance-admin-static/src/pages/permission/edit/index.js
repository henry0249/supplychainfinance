import React, { Component } from 'react'
import styles from './index.less'
import {
  Icon,
  Form,
  Input,
  Select,
  Button,
  Modal,
  Row,
  Col,
  Breadcrumb,
  Radio,
  message,
  Checkbox
} from 'antd'
import Link from 'umi/link'
import moment from 'moment'
import { getRoleDetail, editRole, deleteRole } from '../services/index'
import router from 'umi/router'
import withRouter from 'umi/withRouter'

const FormItem = Form.Item
const Option = Select.Option

@withRouter
@Form.create()
export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      refresh: false,
      ButtonLoading: false
    }
    this.id = props.location.query.id || null
    this.modifier = props.location.query.er || null
    this.time = props.location.query.time || null
  }

  componentDidMount() {
    //回写
    const { form } = this.props
    getRoleDetail(this.id ? this.id : '').then(res => {
      if (res && res.code === 0 && res.data) {
        this.setState({
          data: res.data
        })
      }
    })
  }

  handleCancel = () => {
    router.goBack()
  }

  //保存
  handleSave = () => {
    const {
      form: { validateFields }
    } = this.props
    validateFields((err, data) => {
      if (err) return
      const roleName = data.roleName
      delete data.roleName
      const datas = Object.values(data)
      const a = datas.reduce((result, item) => {
        return result.concat(item)
      }, [])
      const obj = {}
      if (this.id) {
        obj.roleId = this.id
      }
      obj.roleIds = a
      obj.roleName = roleName
      editRole(obj).then(res => {
        if (res.code === 0) {
          message.success(res.message)
          router.goBack()
        } else {
          message.error(res.message)
        }
      })
    })
  }

  confirm = (text, id) => {
    Modal.confirm({
      title: '删除权限组',
      content: `删除权限组“${text}”吗`,
      okText: '确认',
      cancelText: '取消',
      centered: true,
      onOk: () => {
        deleteRole(id).then(res => {
          if (res && res.code === 0) {
            message.success(res.message)
            router.goBack()
          } else {
            message.error(res.message)
          }
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const name = this.props.location.query.name
    const { content, data, ButtonLoading } = this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
    const time = moment(new Date()).format('YYYY-MM-DD')
    return (
      <div className={styles.container}>
        <div className={styles.crumb}>
          <Row gutter={24}>
            <Col span={20}>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <Link to="/">首页</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to="/permission">权限配置</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  {this.id ? '编辑权限组' : '添加权限组'}
                </Breadcrumb.Item>
              </Breadcrumb>

              <h2 style={{ marginTop: 10, fontWeight: 'bold' }}>
                {'权限组数据'}
              </h2>
              <p>操作：可编辑、添加和删除用户权限组。</p>
            </Col>
            <Col span={4}>
              <div>{this.time ? '最后修改: ' + this.time : ''}</div>
              <div style={{ margin: '10px 0' }}>
                {this.modifier ? '修改人：' + this.modifier : ''}
              </div>
              <div>
                <Button type="primary" onClick={() => router.goBack()}>
                  返回
                </Button>
              </div>
            </Col>
          </Row>
        </div>
        {/* <div className={styles.empty} /> */}
        <div className={styles.content}>
          <Form {...formItemLayout}>
            <FormItem label="权限组名称">
              {getFieldDecorator('roleName', {
                initialValue: name ? name : '',
                rules: [
                  {
                    required: true,
                    message: '请输入标题'
                  }
                ]
              })(
                <Input
                  maxLength={50}
                  placeholder="最多50字"
                  className={styles.input}
                />
              )}
            </FormItem>
            {data.map((item, index) => {
              let arr = []
              item.roles.forEach(item => {
                if (item.checked) {
                  arr.push(item.roleId)
                }
              })
              return (
                <FormItem label={item.groupName} key={index}>
                  {getFieldDecorator(`${item.groupId}`, {
                    initialValue: arr
                  })(
                    <Checkbox.Group>
                      {item.roles.map(i => {
                        return (
                          <Checkbox value={i.roleId} key={i.roleId}>
                            {i.roleName}
                          </Checkbox>
                        )
                      })}
                    </Checkbox.Group>
                  )}
                </FormItem>
              )
            })}
          </Form>
        </div>

        <div className={styles.bottom}>
          <div className={styles.buttons} style={{ position: 'relative' }}>
            {this.id ? (
              <Button
                style={{ position: 'absolute', left: 30 }}
                onClick={() => this.confirm(name, this.id)}
              >
                删除
              </Button>
            ) : (
              ''
            )}

            <Button onClick={this.handleCancel.bind(this)}>取消</Button>
            <Button
              type="primary"
              loading={ButtonLoading}
              onClick={this.handleSave.bind(this)}
            >
              提交
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
