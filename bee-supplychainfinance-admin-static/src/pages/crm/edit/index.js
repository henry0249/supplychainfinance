import React, { Component } from 'react'
import styles from './index.less'
import {
  Icon,
  Form,
  Input,
  Select,
  Button,
  Modal,
  message,
  Upload,
  Row,
  Col,
  Avatar,
  Breadcrumb,
  Popconfirm,
  Tree,
  Divider
} from 'antd'
import Link from 'umi/link'
import {
  getPerGroup,
  getBackDetail,
  backForbit
} from '../../permission/services'
import {
  getUserDetail,
  editUser,
  editAccountStatus,
  resetMemberPassword,
  addUser,
  getAllQuanxian,
  getUserQuanxian
} from '../services'
import { queryString } from '@/common/utils'
import moment from 'moment'
import FileUpload from '@/components/fileUpload'
import router from 'umi/router'
import withRouter from 'umi/withRouter'
import {
  getUserEnterprises,
  getAllEnterprises
} from '../../permission/userRights/services'
import { connect } from 'dva'

const FormItem = Form.Item
const Option = Select.Option
const { TreeNode } = Tree
const treeData = [
  {
    title: '0-0',
    key: 1,
    level: 1,
    id: 1,
    pid: 1,
    roleId: 1,
    roleType: 1,
    children: [
      {
        title: '0-0-0',
        key: 2,
        id: 1,
        level: 2,
        pid: 2,
        roleId: 2,
        roleType: 2,
        children: [
          {
            title: '0-0-0-0',
            key: 3,
            level: 3,
            pid: 3,
            id: 3,
            roleId: 3,
            roleType: 3
          },
          {
            title: '0-0-0-1',
            key: 4,
            level: 4,
            pid: 4,
            id: 4,
            roleId: 4,
            roleType: 4
          },
          {
            title: '0-0-0-2',
            key: 5,
            level: 5,
            id: 5,
            pid: 5,
            roleId: 5,
            roleType: 5
          }
        ]
      },
      {
        title: '0-0-1',
        key: 6,
        level: 6,
        id: 6,
        pid: 6,
        roleId: 6,
        roleType: 6,
        children: [
          {
            title: '0-0-1-0',
            key: 7,
            level: 7,
            id: 1,
            pid: 7,
            roleId: 7,
            roleType: 7
          },
          {
            title: '0-0-1-1',
            key: 8,
            level: 8,
            pid: 8,
            id: 8,
            roleId: 8,
            roleType: 8
          },
          {
            title: '0-0-1-2',
            key: 9,
            level: 9,
            id: 9,
            pid: 9,
            roleId: 9,
            roleType: 9
          }
        ]
      },
      {
        title: '0-0-2',
        key: 10,
        level: 10,
        id: 10,
        pid: 10,
        roleId: 10,
        roleType: 10
      }
    ]
  },
  {
    title: '0-1',
    key: 11,
    level: 11,
    pid: 11,
    id: 11,
    roleId: 11,
    roleType: 11,
    children: [
      {
        title: '0-1-0-0',
        key: 12,
        level: 12,
        pid: 12,
        id: 12,
        roleId: 12,
        roleType: 12
      },
      {
        title: '0-1-0-1',
        key: 13,
        level: 13,
        pid: 13,
        roleId: 13,
        id: 13,
        roleType: 13
      },
      {
        title: '0-1-0-2',
        key: 14,
        level: 14,
        id: 14,
        pid: 14,
        roleId: 14,
        roleType: 14
      }
    ]
  },
  {
    title: '0-2',
    key: 1,
    id: 15,
    level: 15,
    pid: 15,
    roleId: 15,
    roleType: 15
  }
]
@withRouter
@Form.create()
@connect(({ global, loading }) => ({
  global
}))
export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      refresh: false,
      ButtonLoading: false,
      headImg: '',
      userDetail: {},
      groupList: [],
      userNameTrue: null,
      expandedKeys: [],
      autoExpandParent: true,
      selectedKeys: [],
      forbit: 1,
      detail: null,
      role: null,
      com: null,
      tree: null,
      checkedKeys: [],
      checkKeys: [],
      oldCheckKeys: [],
      unCheckKeys: [],
      addList: [],
      deleteList: [],
      newParams: []
    }
    this.id = props.location.query.id || null
    this.enterType = props.location.query.enterType || null
    this.orgId = props.location.query.orgId || null
  }

  onExpand = expandedKeys => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false
    })
  }

  onCheck = (keys, e) => {
    // debugger
    console.log(keys)
    console.log(e)
    let newParams = []
    keys.map(item => {
      let newItem = item.split('-')
      newParams.push({
        roleId: newItem[0],
        roleType: newItem[1],
        level: newItem[2],
        pid: newItem[3],
        subSys: newItem[4],
        roleName: newItem[5],
        title: newItem[6]
      })
    })

    console.log(newParams)
    this.setState({
      newParams
    })

    // let sub = []
    // if(keys.length > 0){
    //   sub = e.checkedNodes.map((item,index)=>{
    //     return {
    //       id:item.props.id,
    //       pid:item.props.pid,
    //       number:item.props.number,
    //       level:item.props.level,
    //       roleId:item.props.roleId,
    //       roleType:item.props.roleType,
    //       title:item.props.title,
    //     }
    //   })
    // }

    // if(e.halfCheckedKeys.length > 0){
    //   for(let i =0;i<e.halfCheckedKeys.length;i++){
    //     let obje = getObjById(e.halfCheckedKeys[i],treeData)
    //     if(obje.children){
    //       delete obje.children
    //     }
    //     sub.push(obje)
    //   }
    // }

    this.setState({
      checkedKeys: keys
    })
  }

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info)
    this.setState({ selectedKeys })
  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode {...item} />
    })

  componentDidMount() {
    console.log(treeData, '')
    const a = loop(treeData, '')
    console.log(a)
    this.id
      ? getUserEnterprises(this.id).then(resp => {
          if (resp && resp.code === 0) {
            this.setState(
              {
                com: resp.data
              },
              () => {
                if (this.id) {
                  const { setFieldsValue } = this.props.form
                  getUserDetail(this.id).then(res => {
                    if (res && res.code === 0) {
                      console.log(res)
                      setFieldsValue({ ...res.data })
                      this.setState(
                        {
                          userDetail: res.data,
                          userNameTrue: true
                        },
                        () => {
                          // const { userDetail } = this.state
                          // if (userDetail.regionId) {
                          //   setFieldsValue({
                          //     com: userDetail.regionId
                          //   })
                          // }
                        }
                      )
                    }
                  })
                  //回写
                }
              }
            )
          }
        })
      : getAllEnterprises().then(res => {
          if (res && res.code === 0) {
            this.setState({
              com: res.data
            })
          }
        })

    // getAllQuanxian(this.orgId).then(resp => {
    //   if (resp && resp.code === 0 && resp.data.length > 0) {
    //     this.setState(
    //       {
    //         tree: catList(resp.data)
    //       },
    //       () => {
    //         console.log(this.state.tree)
    //         if (this.enterType === '0') {
    //           getUserQuanxian(this.id).then(resp => {
    //             if (resp && resp.data.length > 0 && resp.code === 0) {
    //               // const arr = []
    //               // const handleData = (data, index) => {
    //               //   data.forEach(curr => {
    //               //     arr.push(curr.id + '-' + index)
    //               //     if (curr.children) {
    //               //       handleData(curr.children, index)
    //               //     }
    //               //   })
    //               // }
    //               // resp.data && resp.data.map((item, index) => {
    //               //   arr.push(item.id + '-' + index)
    //               //   if (item.children) {
    //               //     handleData(item.children, index)
    //               //   }

    //               // })
    //               this.setState({
    //                 checkedKeys: catListKeys(resp.data)
    //               })
    //             }
    //           })
    //         }
    //       }
    //     )
    //   }
    // })
  }

  handleCancel = () => {
    Modal.confirm({
      title: '取消后未保存内容将会丢失',
      content: '你还要继续吗？',
      onOk() {
        router.goBack()
      },
      onCancel() {}
    })
  }

  //上传头像处理
  handleChange = (e, type) => {
    console.log(e)
    if (e) {
      this.setState({
        headImg: e
      })
    }
  }

  //禁用账户处理
  bannedUser = status => {
    console.log(status)
    let s = null
    if (status === 1) {
      s = 0
    } else if (status === 0) {
      s = 1
    }
    const url = `id=${this.id}&status=${s}`
    editAccountStatus(url).then(res => {
      if (res && res.code === 0) {
        message.success(res.message)
        router.goBack()
      } else {
        message.error(res.message)
      }
    })
  }

  //提交表单处理
  handleSubmit = () => {
    const { validateFields } = this.props.form
    const { headImg, newParams } = this.state
    validateFields((err, value) => {
      if (!err) {
        let params = {}
        if (headImg) {
          params['head'] = headImg
        }
        if (this.id) {
          params['id'] = this.id
        }
        // if (value.role) {
        //   params['role'] = value.role
        // }
        if (value.com) {
          params['enterpriseId'] = value.com
        }
        if (value.phone) {
          params['phone'] = value.phone
        }
        if (value.email) {
          params['email'] = value.email
        }
        if (value.name) {
          params['name'] = value.name
        }
        // if (value.userType) {
        //   params['userType'] = value.userType
        // }
        if (value.accountDescription) {
          params['accountDescription'] = value.accountDescription
        }
        // params['authUserRoleRQ'] = newParams
        console.log(params)
        if (this.enterType === '0') {
          //编辑

          editUser(params).then(res => {
            if (res && res.code === 0) {
              message.success(res.message)
              router.goBack()
            } else {
              message.error(res.message)
            }
          })
        } else {
          //添加
          addUser(params).then(res => {
            if (res && res.code === 0) {
              message.success(res.message)
              router.goBack()
            } else {
              message.error(res.message)
            }
          })
        }
      } else {
      }
    })
  }

  confirm = text => {
    Modal.confirm({
      title: '删除权限组',
      content: `删除权限组${text}吗`,
      okText: '确认',
      cancelText: '取消'
    })
  }

  getCheckCode = () => {}

  userNameChange = () => {
    const { validateFields } = this.props.form
    validateFields(['username'], (err, value) => {
      if (!err) {
        this.setState({
          userNameTrue: false
        })
      } else {
        this.setState({
          userNameTrue: true
        })
      }
    })
  }

  //发送短信处理
  getSMS = () => {
    const { validateFields } = this.props.form
    const { user } = this.props.global
    console.log(this.props.global)
    validateFields(['type'], (err, value) => {
      if (!value.type) {
        return
      }
      value.userId = this.id
      value.enterpriseId = user.orgId
      const str = queryString(value)
      //  /authPlatformUserEnterprise/resetMemberPassword?type=0&userId=1&enterpriseId=1
      resetMemberPassword(str).then(res => {
        if (res && res.code === 0) {
          message.success(res.message)
        } else {
          message.error(res.message)
        }
      })
    })
  }

  // forbit = (id,type) => {//禁用
  // const url =`id=${id}&status=${type}`
  //   backForbit(url).then(resp => {
  //     console.log(resp)
  //     if (resp && resp.code === 0) {
  //       message.success('禁用成功')
  //       this.setState({
  //         forbit: type
  //       })
  //     } else {
  //       message.warning('禁用失败，请稍后再试')
  //     }
  //   })
  // }

  render() {
    const { getFieldDecorator } = this.props.form
    const type = this.props.location.query.type
    const {
      content,
      data,
      ButtonLoading,
      groupList,
      userDetail,
      userNameTrue,
      role,
      com,
      tree
    } = this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      }
    }
    const time = moment(new Date()).format('YYYY-MM-DD')
    return (
      <div className={styles.container}>
        <div className={styles.crumb}>
          <Row gutter={24}>
            <Col span={19}>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <Link to="/">首页</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to="/manage/notice">权限配置</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  {this.enterType === '0' ? '编辑用户' : '添加用户'}
                </Breadcrumb.Item>
              </Breadcrumb>

              <h2 style={{ marginTop: 10, fontWeight: 'bold' }}>
                {'账户详情'}
              </h2>
              <p>操作：可编辑、添加和删除用户权限组。</p>
            </Col>
            <Col span={5}>
              <div>最后修改: {time}</div>
              <div style={{ margin: '10px 0' }}>
                {userDetail.updateName
                  ? '修改人：' + userDetail.updateName
                  : ''}
              </div>
              <div>
                <Button
                  type="primary"
                  onClick={() => {
                    router.goBack()
                  }}
                >
                  <Icon type="rollback" />
                  返回
                </Button>
                {/* {
                  this.enterType === '0' ?
                  1
                  :
                  null
                } */}
                {this.enterType === '0' && (
                  <Popconfirm
                    placement="top"
                    title={
                      userDetail.status === 0 ? (
                        <div>
                          <p>启用本账号</p>
                          <p>{`确定启用账户“账户名称${
                            userDetail.nickname
                          }”吗？`}</p>
                        </div>
                      ) : (
                        <div>
                          <p>禁用本账号</p>
                          <p>{`确定禁用账户“账户名称${
                            userDetail.nickname
                          }”吗？`}</p>
                        </div>
                      )
                    }
                    onConfirm={this.bannedUser.bind(this, userDetail.status)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button
                      type="primary"
                      style={{ marginLeft: 30 }}
                      // onClick={this.bannedUser.bind(this, userDetail.status)}
                      icon="stop"
                    >
                      {userDetail.status === 0 ? '启用本账户' : '禁用本账户'}
                    </Button>
                  </Popconfirm>
                )}
              </div>
            </Col>
          </Row>
        </div>
        {/* <div className={styles.empty} /> */}
        <div className={styles.content}>
          <Form {...formItemLayout} style={{ width: '80%' }}>
            <FormItem label="手机">
              {getFieldDecorator('phone', {
                // initialValue: userDetail.username ? userDetail.username : '',
                rules: [
                  {
                    required: true,
                    message: '请输入手机号'
                  },
                  {
                    pattern: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/,
                    message: '手机号不符合规范'
                  }
                ]
              })(
                <Input
                  placeholder="请输入手机号"
                  // onChange={this.userNameChange}
                />
              )}
              {/* {userNameTrue && (
                <Button type="primary" onClick={this.getCheckCode}>
                  发送验证码
                </Button>
              )} */}
            </FormItem>
            <FormItem label="邮箱">
              {getFieldDecorator('email', {
                initialValue: userDetail.email ? userDetail.email : '',
                rules: [
                  // {
                  //   required: true,
                  //   message: '请输入邮箱地址'
                  // },
                  {
                    pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
                    message: '请输入正确的邮箱'
                  }
                ]
              })(<Input placeholder="请输入邮箱" />)}
            </FormItem>
            <FormItem label="用户姓名">
              {getFieldDecorator('name', {
                initialValue: userDetail.name ? userDetail.name : '',
                rules: [
                  {
                    required: true,
                    message: '请输入用户姓名'
                  }
                ]
              })(<Input placeholder="请输入用户姓名" />)}
            </FormItem>
            {/* <FormItem label="选择角色">
              {getFieldDecorator('role', {
                initialValue: userDetail.roleId ? userDetail.roleId : '',
                rules: [
                  {
                    required: true,
                    message: '请选择角色'
                  }
                ]
              })(
                <Select>
                  {role && role.map(item => {
                    return (
                      <Option value={item.roleId} key={item.roleId}>
                        {item.roleName}
                      </Option>
                    )
                  })}
                </Select>
              )}
            </FormItem> */}
            {/* <FormItem label="选择企业">
              {getFieldDecorator('com', {
                initialValue: userDetail.enterpriseId
                  ? userDetail.enterpriseId
                  : '',
                rules: [
                  {
                    required: true,
                    message: '请选择企业'
                  }
                ]
              })(
                <Select>
                  {com &&
                    com.map(item => {
                      return (
                        <Option value={item.id} key={item.id}>
                          {item.name}
                        </Option>
                      )
                    })}
                </Select>
              )}
            </FormItem> */}
            {/* <FormItem label="角色">
              {getFieldDecorator('userType', {
                initialValue: userDetail && userDetail.userType
              })(
                <Select>
                  <Option value="1">企业成员</Option>
                  <Option value="2">企业管理员</Option>
                </Select>
              )}
            </FormItem> */}
            <FormItem label="账户说明">
              {getFieldDecorator('accountDescription', {
                // initialValue: userDetail.accountDescription
                //   ? userDetail.accountDescription
                //   : ''
              })(
                <Input.TextArea
                  placeholder="请填写账户说明"
                  style={{ minHeight: 100 }}
                />
              )}
            </FormItem>
            {this.enterType === '0' && (
              <FormItem label="重置密码" wrapperCol={{ span: 20 }}>
                {getFieldDecorator('type', {})(
                  <Select style={{ width: '41.66666667%', marginRight: 20 }}>
                    <Option value="0">手机号重置</Option>
                    <Option value="1">邮箱重置</Option>
                  </Select>
                )}

                <Button type="primary" onClick={this.getSMS}>
                  发送重置短信
                </Button>
              </FormItem>
            )}
          </Form>
          <div className={styles.upload}>
            <div style={{ margin: 10 }}>账户头像</div>
            <Avatar
              src={
                this.state.headImg
                  ? this.state.headImg
                  : userDetail.head
                  ? userDetail.head
                  : ''
              }
              size={100}
            />
            {/* <img src={this.state.headImg ? this.state.headImg : user.head ? user.head : ""} /> */}
            <FileUpload
              Button={
                <Button style={{ marginTop: 20 }}>
                  <Icon type="upload" />
                  修改头像
                </Button>
              }
              onChange={info => this.handleChange(info)}
              showUploadList={false}
            />
          </div>
        </div>
        {/* <div className={styles.contentTwo}>
          <Divider />
          <div>
            <Form {...formItemLayout} style={{ width: '80%' }}>
              <FormItem label="权限配置">
                {tree && (
                  <Tree
                    checkable
                    // checkStrictly={true}
                    onExpand={this.onExpand}
                    expandedKeys={this.state.expandedKeys}
                    autoExpandParent={this.state.autoExpandParent}
                    onCheck={this.onCheck}
                    checkedKeys={this.state.checkedKeys}
                    onSelect={this.onSelect}
                    selectedKeys={this.state.selectedKeys}
                  >
                    {this.renderTreeNodes(tree)}
                  </Tree>
                )}
              </FormItem>
            </Form>
          </div>
        </div> */}
        <div className={styles.bottom}>
          <div className={styles.buttons} style={{ position: 'relative' }}>
            <Button onClick={this.handleCancel.bind(this)}>取消</Button>
            <Button
              type="primary"
              loading={ButtonLoading}
              onClick={this.handleSubmit}
            >
              提交
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

const loop = (data, parent = '') => {
  return data.map(item => {
    if (item.children) {
      return loop(item.children, parent + item.id + '-')
    }
    return { ...item, _id: parent + item.id }
  })
}

const catList = data => {
  data.map(item => {
    item.key =
      item.id +
      '-' +
      item.roleType +
      '-' +
      item.level +
      '-' +
      item.pid +
      '-' +
      item.subSys +
      '-' +
      item.roleName +
      '-' +
      item.title
    item.title = item.roleName
    if (item.children) {
      catList(item.children)
    }
    return item
  })
  return data
}

const catListKeys = data => {
  let arr = []
  data.map(item => {
    item.key =
      item.id +
      '-' +
      item.roleType +
      '-' +
      item.level +
      '-' +
      item.pid +
      '-' +
      item.subSys +
      '-' +
      item.roleName +
      '-' +
      item.title
    arr.push(item.key)
    if (item.children) {
      catList(item.children)
    }
  })
  return arr
}
