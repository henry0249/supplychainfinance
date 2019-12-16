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
  Checkbox,
  Tree,
  Divider
} from 'antd'
import Link from 'umi/link'
import moment from 'moment'
import { getRoleDetail, editRole, deleteRole } from '../services/index'
import router from 'umi/router'
import withRouter from 'umi/withRouter'
import { guid } from '@/common/utils'

const FormItem = Form.Item
const Option = Select.Option
const { TreeNode } = Tree
const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' }
        ]
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' }
        ]
      },
      {
        title: '0-0-2',
        key: '0-0-2'
      }
    ]
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' }
    ]
  },
  {
    title: '0-2',
    key: '0-2'
  }
]

@withRouter
@Form.create()
export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      conCompanys: [1],
      refresh: false,
      ButtonLoading: false,
      expandedKeys: ['0-0-0', '0-0-1'],
      autoExpandParent: true,
      checkedKeys: ['0-0-0'],
      selectedKeys: []
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

  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys)
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false
    })
  }

  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys)
    this.setState({ checkedKeys })
  }

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', selectedKeys, info)
    this.setState({ selectedKeys })
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

  addConCompanys = () => {
    const arr = this.state.conCompanys
    arr.push(arr[arr.length - 1] + 1)
    this.setState({
      conCompanys: arr
    })
  }

  reduceConCompanys = i => {
    const { conCompanys } = this.state
    const index = conCompanys.indexOf(i)
    conCompanys.splice(index, 1)
    this.setState({
      conCompanys: conCompanys
    })
  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={item.title}
            key={item.key}
            dataRef={item}
            className={styles.TreeNode}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode {...item} className={styles.TreeNode} />
    })

  render() {
    const { getFieldDecorator } = this.props.form
    const name = this.props.location.query.name
    const { content, data, ButtonLoading, conCompanys } = this.state

    const newConCompanys = []
    for (var i = 0; i < conCompanys.length; i += 3) {
      newConCompanys.push(conCompanys.slice(i, i + 3))
    }
    newConCompanys[newConCompanys.length - 1].push('button')
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }

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
              </Breadcrumb>

              <h2 style={{ marginTop: 10, fontWeight: 'bold' }}>
                {'编辑角色'}
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
            <Row gutter={48}>
              <Col span={8}>
                <FormItem label="角色名称">
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
                      // className={styles.input}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="角色名称">
                  {getFieldDecorator('roleName1', {
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
                      // className={styles.input}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="角色名称">
                  {getFieldDecorator('roleName2', {
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
                      // className={styles.input}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            {newConCompanys.map(item => {
              return (
                <Row gutter={48} key={item}>
                  {item.map(i => {
                    if (i === 'button') {
                      return (
                        <Col span={8} key={i}>
                          <FormItem>
                            <Button
                              type="dashed"
                              icon="plus"
                              style={{ width: '100%' }}
                              onClick={this.addConCompanys}
                            >
                              添加关联公司
                            </Button>
                          </FormItem>
                        </Col>
                      )
                    }
                    return (
                      <Col span={8} key={i}>
                        <FormItem label={'关联公司' + i}>
                          {getFieldDecorator('company' + i, {
                            initialValue: name ? name : '',
                            rules: [
                              {
                                required: true,
                                message: '请输入标题'
                              }
                            ]
                          })(<Input maxLength={50} placeholder="最多50字" />)}

                          {i !== 1 && (
                            <span
                              style={{ marginLeft: 10, cursor: 'pointer' }}
                              onClick={() => this.reduceConCompanys(i)}
                            >
                              <Icon type="minus-circle" />
                            </span>
                          )}
                        </FormItem>
                      </Col>
                    )
                  })}
                </Row>
              )
            })}
            {/* <Row gutter={48}>
              <Col span={8}>
                <FormItem label="关联公司">
                  {getFieldDecorator('company', {
                    initialValue: name ? name : '',
                    rules: [
                      {
                        required: true,
                        message: '请输入标题'
                      }
                    ]
                  })(<Input maxLength={50} placeholder="最多50字" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Button type="dashed" icon="plus" style={{ width: '100%' }}>
                    添加关联公司
                  </Button>
                </FormItem>
              </Col>
              <Col span={8} />
            </Row> */}
            {/* {data.map((item, index) => {
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
            })} */}
          </Form>
        </div>
        <div className={styles.contentTwo}>
          <Form {...formItemLayout}>
            <Row gutter={48}>
              <Col span={8}>
                <FormItem label="权限配置">
                  <Tree
                    checkable
                    onExpand={this.onExpand}
                    expandedKeys={this.state.expandedKeys}
                    autoExpandParent={this.state.autoExpandParent}
                    onCheck={this.onCheck}
                    checkedKeys={this.state.checkedKeys}
                    onSelect={this.onSelect}
                    selectedKeys={this.state.selectedKeys}
                  >
                    {this.renderTreeNodes(treeData)}
                  </Tree>
                </FormItem>
              </Col>
            </Row>
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
