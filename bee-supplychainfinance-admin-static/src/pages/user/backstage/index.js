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
  Row,
  Col,
  Avatar,
  Breadcrumb,
  Popconfirm,
  Tree
} from 'antd'
import Link from 'umi/link'
import {
  getAdminUserById,
  editAdmin,
  forbit,
  resetMemberPassword
} from '../services'
import { queryString } from '@/common/utils'
import moment from 'moment'
import FileUpload from '@/components/fileUpload'
import router from 'umi/router'
import withRouter from 'umi/withRouter'
import { connect } from 'dva'

const FormItem = Form.Item
const Option = Select.Option
const { TreeNode } = Tree

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
      userPhoto: '',
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
    this.id = props.location.query.id || null//用户id
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
    // this.id
    //   ? getUserEnterprises(this.id).then(resp => {
    //     if (resp && resp.code === 0) {
    //       this.setState(
    //         {
    //           com: resp.data
    //         },
    //         () => {
    if (this.id) {
      const { setFieldsValue } = this.props.form
      getAdminUserById(this.id).then(res => {
        if (res && res.code === 0) {
          console.log(res)
          const { fullName, userName, email, accountDescription } = res.data
          setFieldsValue({ fullName, userName, email, accountDescription })
          this.setState(
            {
              userDetail: res.data,
              userNameTrue: true
            },
            () => {
            }
          )
        }
      })
      //回写
    }
    //       }
    //     )
    //   }
    // })
    // : getAllEnterprises().then(res => {
    //   if (res && res.code === 0) {
    //     this.setState({
    //       com: res.data
    //     })
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
      onCancel() { }
    })
  }

  //上传头像处理
  handleChange = (e, type) => {
    console.log(e)
    if (e) {
      this.setState({
        userPhoto: e
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
    const url = `userId=${this.id}&status=${s}`
    forbit(url).then(res => {
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
    const { userPhoto, newParams } = this.state
    validateFields((err, value) => {
      if (!err) {
        let params = {}
        if (userPhoto) {
          params['userPhoto'] = userPhoto
        }
        // if (value.role) {
        //   params['role'] = value.role
        // }
        // if (value.com) {
        //   params['enterpriseId'] = value.com
        // }
        if (value.userName) {
          params['userName'] = value.userName
        }
        if (value.email) {
          params['email'] = value.email
        }
        if (value.fullName) {
          params['fullName'] = value.fullName
        }
        // if (value.userType) {
        //   params['userType'] = value.userType
        // }
        if (value.accountDescription) {
          params['accountDescription'] = value.accountDescription
        }
        // params['authUserRoleRQ'] = newParams
        //编辑
        editAdmin(params).then(res => {
          if (res && res.code === 0) {
            message.success(res.msg)
            router.push('/user')
          } else {
            message.error(res.msg)
          }
        })
      } else {
      }
    })
  }

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
  // getSMS = () => {
  //   const { validateFields } = this.props.form
  //   const { user } = this.props.global
  //   console.log(this.props.global)
  //   validateFields(['type'], (err, value) => {
  //     if (!value.type) {
  //       return
  //     }
  //     value.userId = this.id
  //     value.enterpriseId = user.orgId
  //     const str = queryString(value)
  //     //  /authPlatformUserEnterprise/resetMemberPassword?type=0&userId=1&enterpriseId=1
  //     resetMemberPassword(str).then(res => {
  //       if (res && res.code === 0) {
  //         message.success(res.message)
  //       } else {
  //         message.error(res.message)
  //       }
  //     })
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
                  <Link to="/user">用户管理</Link>
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
                            userDetail.fullName
                            }”吗？`}</p>
                        </div>
                      ) : (
                          <div>
                            <p>禁用本账号</p>
                            <p>{`确定禁用账户“账户名称${
                              userDetail.fullName
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
              {getFieldDecorator('userName', {
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
                  disabled={this.id ? true : false}
                  placeholder="请输入手机号"
                // onChange={this.userNameChange}
                />
              )}

            </FormItem>
            <FormItem label="邮箱">
              {getFieldDecorator('email', {
                // initialValue: userDetail.email ? userDetail.email : '',
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
              {getFieldDecorator('fullName', {
                // initialValue: userDetail.fullName ? userDetail.fullName : '',
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
                          {item.fullName}
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
            {/* {this.enterType === '0' && (
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
            )} */}
          </Form>
          <div className={styles.upload}>
            <div style={{ margin: 10 }}>账户头像</div>
            <Avatar
              src={
                this.state.userPhoto
                  ? this.state.userPhoto
                  : userDetail.head
                    ? userDetail.head
                    : ''
              }
              size={100}
            />
            {/* <img src={this.state.userPhoto ? this.state.userPhoto : user.head ? user.head : ""} /> */}
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
