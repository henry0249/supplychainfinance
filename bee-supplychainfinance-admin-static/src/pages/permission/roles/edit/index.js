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
import {
  addRolesBack,
  deleteRole,
  listSubResourceBackNoPage,
  listRoleSystemCode,
  listRolesBackNoPage,
  getRoleDetail,
  listSubSystemCode,
  listInterfacesBySubSys,
  listResourcesBySubSys,
  listSubRolesBackNoPage
} from '../services/index'
import { queryString } from '@/common/utils'
import router from 'umi/router'
import withRouter from 'umi/withRouter'
import { guid } from '@/common/utils'
import TableComp from './Table'

const FormItem = Form.Item
const Option = Select.Option
const { TreeNode } = Tree

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
      checkedKeys: [],
      selectedKeys: [],
      listRole: [],
      per: [],
      listSub: [],
      perType: '',
      subType: '',
      roleDetail: {},
      checkbox: [],
      isBase: false,
      interfaceDetailRQS: [],
      resourceRQS: [],
      interfaceDetailRQSKeys: [], //选中的接口
      checkboxThree: [],
      hasSubType: false,
      treeData: [],
      newTreeData: [],
      newCheckedKeys: [],
      bCheckedKeys: []
    }
    this.id = props.location.query.id || null
    this.modifier = props.location.query.er || null
    this.time = props.location.query.time || null
    this.arr = []
  }

  componentDidMount() {
    //回写
    const { form } = this.props
    const self = this
    // getRoleDetail(this.id ? this.id : '').then(res => {
    //   if (res && res.code === 0 && res.data) {
    //     this.setState({
    //       data: res.data
    //     })
    //   }
    // })
    if (this.id) {
      getRoleDetail(this.id).then(res => {
        if (res && res.code === 0 && res.data) {
          this.setState(
            {
              roleDetail: res.data
            },
            () => {
              let aKeys = []
              let bKeys = []
              let cKeys = []
              const a =
                self.state.roleDetail.roleDetail &&
                self.state.roleDetail.roleDetail.reduce((result, item) => {
                  result.push({
                    key: item.id,
                    title: item.roleName
                  })
                  if (item.openStatu) {
                    aKeys.push(item.id)
                  }
                  return result
                }, [])
              const b =
                self.state.roleDetail.interfaceDetail &&
                self.state.roleDetail.interfaceDetail.reduce((result, item) => {
                  result.push({
                    key: item.id,
                    title: item.name
                  })
                  if (item.openStatu) {
                    bKeys.push(item.id)
                  }
                  return result
                }, [])
              const c =
                self.state.roleDetail.resourceDetail &&
                self.state.roleDetail.resourceDetail.reduce((result, item) => {
                  result.push({
                    key: item.id,
                    title: item.name
                  })
                  // if (item.openStatu) {
                  //   if (item.routes) {

                  //   }
                  //   // else {
                  //   //   cKeys = cKeys.concat([item.id + '_' + item.pid])
                  //   // }
                  // }
                  return result
                }, [])
              cKeys = self.state.roleDetail.resourceDetail
                ? this.catListKeys(self.state.roleDetail.resourceDetail)
                : []
              const d = self.state.roleDetail.resourceDetail
                ? this.keyList(self.state.roleDetail.resourceDetail)
                : []
              let newChecked = []
              if (cKeys.length !== 0) {
                cKeys.map(item => {
                  const arr = item.split('_')
                  newChecked.push({ id: Number(arr[0]), pid: Number(arr[1]) })
                })
              }
              self.handleRoleType(res.data.roleType)

              self.props.form.setFieldsValue(
                {
                  roleType: res.data.roleType,
                  subType: res.data.subSys
                },
                () => {
                  console.log(d)
                  self.setState({
                    checkbox: a,
                    interfaceDetailRQSKeys: b,
                    checkboxThree: c,
                    checkedKeys: aKeys,
                    bCheckedKeys: cKeys,
                    treeData: a || [],
                    newTreeData: d || [],
                    resourceRQS: d || [],
                    newCheckedKeys: newChecked
                    // per: res.data,
                  })
                }
              )
            }
          )
        }
      })
    }
    listRoleSystemCode().then(res => {
      if (res && res.code === 0) {
        this.setState({
          listRole: res.data
        })
      }
    })
    listSubSystemCode().then(res => {
      if (res && res.code === 0) {
        this.setState({
          listSub: res.data
        })
      }
    })
  }

  handleCancel = () => {
    router.goBack()
  }

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    })
  }

  handleTree = (id, tree, children) => {
    const mapdata = (data, id, children) => {
      data.forEach((item, index) => {
        if (item.key === id) {
          item.children = children
          return false
        } else if (item.children) {
          mapdata(item.children, id, children)
        }
      })
      return data
    }
    return mapdata(tree, id, children)
  }

  onCheck = (checkedKeys, e) => {
    const self = this
    if (e.checked) {
      const id = e.node.props.dataRef.key
      const arr = []
      listSubRolesBackNoPage(id).then(res => {
        console.log(res)
        if (res && res.code === 0) {
          const arr = []
          res.data.forEach(item => {
            arr.push({
              key: item.id,
              title: item.roleName
            })
          })
          const newTree = this.handleTree(id, this.state.treeData, arr)
          // const newTree = self.state.treeData.map(item => {
          //   if (item.key === id) {
          //     item.children = arr
          //   }
          //   return item
          // })
          self.setState({
            treeData: newTree
          })
        }
      })
    }

    this.setState({ checkedKeys })
  }
  onNewCheck = (checkedKeys, e) => {
    const self = this
    // if (e.checked) {
    //   const id = e.node.props.dataRef.key
    //   const arr = []
    //   listSubResourceBackNoPage(id).then(res => {
    //     console.log(res)
    //     if (res && res.code === 0) {
    //       const arr = []
    //       res.data.forEach(item => {
    //         arr.push({
    //           key: item.id,
    //           title: item.name
    //         })
    //       })
    //       const newTree = this.handleTree(id, self.state.newTreeData, arr)
    //       // const newTree = self.state.treeData.map(item => {
    //       //   if (item.key === id) {
    //       //     item.children = arr
    //       //   }
    //       //   return item
    //       // })
    //       self.setState({
    //         newTreeData: newTree
    //       })
    //     }
    //   })
    // }
    let newChecked = []
    checkedKeys.map(item => {
      const arr = item.split('_')
      newChecked.push({ id: Number(arr[0]), pid: Number(arr[1]) })
    })
    this.setState({
      checkedKeys,
      newCheckedKeys: newChecked,
      bCheckedKeys: checkedKeys
    })
  }
  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys })
  }

  //保存
  handleSave = () => {
    const {
      form: { validateFields }
    } = this.props
    const self = this
    const { interfaceDetailRQSKeys = [] } = this.state
    validateFields((err, data) => {
      if (err) return
      const type = this.props.form.getFieldValue('roleType')
      const isBase = type === 'base'
      const a = []
      let b = []
      if (isBase) {
        this.state.interfaceDetailRQS &&
          this.state.interfaceDetailRQS.forEach(item => {
            interfaceDetailRQSKeys.length &&
              interfaceDetailRQSKeys.forEach(i => {
                if (i === item.id) {
                  delete item.openStatu
                  delete item.subSys
                  a.push(item)
                }
              })
          })
        // this.state.resourceRQS.forEach(item => {
        //
        //   this.state.newCheckedKeys.forEach(i => {
        //     if (i === item.id) {
        //       delete item.openStatu;
        //       delete item.subSys;
        //       b.push(item);
        //     }
        //   });
        // });
        b = this.state.newCheckedKeys
      } else {
        self.state.per.forEach(item => {
          self.state.checkedKeys.checked
            ? self.state.checkedKeys.checked.map(i => {
                if (Number(i) === item.id) {
                  delete item.openStatu
                  delete item.subSys
                  a.push(item)
                }
              })
            : self.state.checkedKeys.map(i => {
                if (Number(i) === item.id) {
                  delete item.openStatu
                  delete item.subSys
                  a.push(item)
                }
              })
        })
      }
      self.state.listRole.forEach(curr => {
        if (curr.sysCode === data.roleType) {
          data.level = curr.level
          data.subSys = curr.subSys
        }
      })

      const value = {
        ...data,
        roleAddRQS: isBase ? [] : a,
        interfaceDetailRQS: isBase ? a : [],
        resourceRQS: isBase ? b : [],
        subSys: data.subType
      }
      if (self.id) {
        value.id = self.id
      }
      console.log(value)
      addRolesBack(value).then(res => {
        if (res.code === 0) {
          message.success(res.message)
          router.goBack()
        } else {
          message.error(res.message)
        }
      })
    })
  }

  handleRoleType = e => {
    if (e === 'base') {
      this.setState(
        {
          hasSubType: true
        },
        () => {
          const a = this.props.form.getFieldValue('subType')
          this.handleSubType(a, e)
        }
      )
      return
    }

    // this.handleSubType(a)
    // if (this.id) {
    //   return
    // }
    const value = {
      roleType: e
    }
    value.subType = this.state.subType || ''
    listRolesBackNoPage(value).then(res => {
      const arr = []
      res.data.forEach(item => {
        arr.push({
          key: item.id,
          title: item.roleName,
          children: []
        })
      })
      if (res && res.code === 0) {
        this.setState({
          // treeData: arr,
          per: res.data,
          perType: e,
          hasSubType: false
        })
      }
    })
  }

  keyList = data => {
    data.map(item => {
      item.key = item.id + '_' + item.pid + '_' + item.name
      item.title = item.name
      if (item.routes) {
        item.children = this.keyList(item.routes)
      }
    })
    return data
  }

  catListKeys = data => {
    data.map(item => {
      if (item.openStatu && !item.routes) {
        this.arr = this.arr.concat([item.id + '_' + item.pid + '_' + item.name])
      }

      if (item.routes) {
        this.catListKeys(item.routes)
      }
    })
    return this.arr
  }

  handleSubType = (e, type, beeRouter) => {
    const getFieldValue = this.props.form.getFieldValue
    e = e || getFieldValue('subType')
    type = getFieldValue('roleType')
    if (typeof beeRouter !== 'string') {
      beeRouter = null
    }
    if (type === 'base') {
      listInterfacesBySubSys(e, beeRouter).then(res => {
        if (res && res.code === 0) {
          this.setState({
            interfaceDetailRQS: res.data,
            subType: e
          })
        }
      })
      listResourcesBySubSys(e).then(res => {
        if (res && res.code === 0) {
          const arr = this.keyList(res.data)
          // const arr = []
          // res.data.forEach(item => {
          //   arr.push({
          //     key: item.id,
          //     title: item.name,
          //     children: []
          //   })
          // })
          this.setState({
            resourceRQS: res.data,
            newTreeData: arr,
            subType: e
          })
        }
      })
      return
    }
    const value = {
      subType: e
    }
    value.roleType = this.state.perType || ''
    listRolesBackNoPage(value).then(res => {
      if (res && res.code === 0) {
        const arr = []
        res.data.forEach(item => {
          arr.push({
            key: item.id,
            title: item.roleName,
            children: []
          })
        })
        this.setState({
          treeData: arr,
          per: res.data,
          subType: e
        })
      }
    })
    // listSubResourceBackNoPage(value).then(res => {
    //   if (res && res.code === 0) {
    //     const arr = []
    //     res.data.forEach(item => {
    //       arr.push({
    //         key: item.id,
    //         title: item.name,
    //         children: []
    //       })
    //     })
    //     this.setState({
    //       newTreeData: arr,
    //       per: res.data,
    //       subType: e
    //     })
    //   }
    // })
  }

  confirm = (text, id) => {
    Modal.confirm({
      title: '删除权限组',
      content: `删除权限组“${text}”吗`,
      okText: '确认',
      cancelText: '取消',
      centered: true,
      onOk: () => {
        // deleteRole(id).then(res => {
        //   if (res && res.code === 0) {
        //     message.success(res.message)
        //     router.goBack()
        //   } else {
        //     message.error(res.message)
        //   }
        // })
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
      return <TreeNode {...item} dataRef={item} className={styles.TreeNode} />
    })

  //接口选择
  interfaceOnchange(interfaceDetailRQSKeys) {
    this.setState({ interfaceDetailRQSKeys })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const {
      content,
      data,
      ButtonLoading,
      conCompanys,
      listRole,
      per,
      roleDetail,
      listSub,
      checkbox,
      resourceRQS,
      interfaceDetailRQS,
      checkboxThree,
      interfaceDetailRQSKeys,
      newTreeData
    } = this.state
    // const newConCompanys = []
    // for (var i = 0; i < conCompanys.length; i += 3) {
    //   newConCompanys.push(conCompanys.slice(i, i + 3))
    // }
    // newConCompanys[newConCompanys.length - 1].push('button')
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
                {this.id ? '编辑角色' : '添加角色'}
              </h2>
              <p>操作：可编辑、添加和删除用户权限组。</p>
            </Col>
            <Col span={4}>
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
                    initialValue: roleDetail.roleName
                      ? roleDetail.roleName
                      : '',
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
                <FormItem
                  label="角色类型"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  {getFieldDecorator('roleType', {
                    rules: [
                      {
                        required: true,
                        message: '角色类型'
                      }
                    ]
                  })(
                    <Select
                      style={{ width: 286 }}
                      placeholder="请选择"
                      onChange={this.handleRoleType}
                      disabled={Boolean(this.id)}
                    >
                      {listRole.map(item => {
                        return (
                          <Option key={item.level} value={item.sysCode}>
                            {item.sysCodeDesc}
                          </Option>
                        )
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                {/* {this.state.hasSubType && (
                  
                )} */}
                <FormItem
                  label="子系统标识"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  {getFieldDecorator('subType', {
                    rules: [
                      {
                        required: true,
                        message: '请选择子系统标识'
                      }
                    ]
                  })(
                    <Select
                      style={{ width: 286 }}
                      placeholder="请选择"
                      onChange={this.handleSubType}
                      disabled={Boolean(this.id)}
                    >
                      {listSub.map(item => {
                        return (
                          <Option key={item.sysCode} value={item.sysCode}>
                            {item.sysCodeDesc}
                          </Option>
                        )
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            {/* {newConCompanys.map(item => {
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
            })} */}
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
          <Form
            {...{
              labelCol: {
                xs: { span: 24 },
                sm: { span: 2 }
              },
              wrapperCol: {
                xs: { span: 24 },
                sm: { span: 22 }
              }
            }}
          >
            {!(this.props.form.getFieldValue('roleType') === 'base') ? (
              <Row gutter={48}>
                <Col span={24}>
                  {/* {per.length !== 0 && (
                    <FormItem label="权限配置">
                      {getFieldDecorator('roleAddRQS', {
                        initialValue: checkbox,
                        rules: [
                          {
                            required: true,
                            message: '请选择权限'
                          }
                        ]
                      })(
                        <Checkbox.Group>
                          {per.map(i => {
                            return (
                              <Checkbox value={i.id} key={i.id}>
                                {i.roleName}
                              </Checkbox>
                            )
                          })}
                        </Checkbox.Group>
                      )}
                    </FormItem>
                  )} */}
                  {this.state.treeData.length !== 0 && (
                    <FormItem label="权限配置">
                      <Tree
                        checkable
                        onExpand={this.onExpand}
                        expandedKeys={this.state.expandedKeys}
                        autoExpandParent={this.state.autoExpandParent}
                        onCheck={this.onCheck}
                        checkStrictly={true}
                        checkedKeys={this.state.checkedKeys}
                        onSelect={this.onSelect}
                        selectedKeys={this.state.selectedKeys}
                      >
                        {this.renderTreeNodes(this.state.treeData)}
                      </Tree>
                    </FormItem>
                  )}
                </Col>
              </Row>
            ) : (
              <React.Fragment>
                <Row gutter={48}>
                  <Col span={24}>
                    {resourceRQS.length !== 0 && (
                      <FormItem label="菜单配置">
                        {getFieldDecorator('resourceRQS', {
                          // initialValue: checkboxThree,
                          // rules: [
                          //   {
                          //     required: true,
                          //     message: "请选择资源"
                          //   }
                          // ]
                        })(
                          <Tree
                            checkable
                            onExpand={this.onExpand}
                            expandedKeys={this.state.expandedKeys}
                            autoExpandParent={this.state.autoExpandParent}
                            onCheck={this.onNewCheck}
                            // checkStrictly={true}
                            checkedKeys={this.state.bCheckedKeys}
                            onSelect={this.onSelect}
                            selectedKeys={this.state.selectedKeys}
                          >
                            {this.renderTreeNodes(newTreeData)}
                          </Tree>
                        )}
                        {/* {this.state.treeData.length !== 0 && (
                          <FormItem label="权限配置">
                            <Tree
                              checkable
                              onExpand={this.onExpand}
                              expandedKeys={this.state.expandedKeys}
                              autoExpandParent={this.state.autoExpandParent}
                              onCheck={this.onCheck.bind('menu')}
                              checkStrictly={true}
                              checkedKeys={this.state.checkedKeys}
                              onSelect={this.onSelect}
                              selectedKeys={this.state.selectedKeys}
                            >
                              {this.renderTreeNodes(this.state.treeData)}
                            </Tree>
                          </FormItem>
                        )} */}
                      </FormItem>
                    )}
                  </Col>
                </Row>
                <Row gutter={48}>
                  <Col span={24}>
                    {/* {interfaceDetailRQS.length !== 0 && (
                      <FormItem label="接口配置">
                        {getFieldDecorator("interfaceDetailRQS", {
                          initialValue: interfaceDetailRQSKeys,
                          rules: [
                            {
                              required: true,
                              message: "请选择接口"
                            }
                          ]
                        })(
                          <Checkbox.Group>
                            {interfaceDetailRQS.map(i => {
                              return (
                                <Checkbox value={i.id} key={i.id}>
                                  {i.name}
                                </Checkbox>
                              );
                            })}
                          </Checkbox.Group>
                        )}
                      </FormItem>
                    )} */}
                    {interfaceDetailRQS.length !== 0 && (
                      <TableComp
                        onSearch={value =>
                          this.handleSubType(null, null, value)
                        }
                        onChange={this.interfaceOnchange.bind(this)}
                        selectedRowKeys={interfaceDetailRQSKeys}
                        dataSource={interfaceDetailRQS}
                      />
                    )}
                  </Col>
                </Row>
              </React.Fragment>
            )}
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
