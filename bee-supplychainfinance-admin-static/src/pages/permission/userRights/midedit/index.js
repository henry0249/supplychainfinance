import React, { Component } from 'react'
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
  Divider,
  Checkbox
} from 'antd'
import router from 'umi/router'
import withRouter from 'umi/withRouter'
import styles from './index.less'
import Link from 'umi/link'
import {
  middleforbit,
  getMiddleDetail,
  getRegion,
  editMiddleUser,
  getAllQuanxian,
  getUserQuanxian
} from '../services'
const FormItem = Form.Item
const { TreeNode } = Tree
const treeData = [
  {
    title: '0-0',
    key: '1',
    number: '0_1',
    level: 1,
    id: 1,
    pid: 1,
    roleId: 1,
    roleType: 1,
    children: [
      {
        title: '0-0-0',
        key: '2',
        id: 2,
        level: 2,
        number: 2,
        pid: 2,
        roleId: 2,
        roleType: 2,
        children: [
          {
            title: '0-0-0-0',
            key: '3',
            level: 3,
            pid: 3,
            number: 3,
            id: 3,
            roleId: 3,
            roleType: 3
          },
          {
            title: '0-0-0-1',
            key: '4',
            level: 4,
            pid: 4,
            id: 4,
            number: 4,
            roleId: 4,
            roleType: 4
          },
          {
            title: '0-0-0-2',
            key: '5',
            level: 5,
            id: 5,
            pid: 5,
            number: 5,
            roleId: 5,
            roleType: 5
          }
        ]
      },
      {
        title: '0-0-1',
        key: '6',
        level: 6,
        id: 6,
        pid: 6,
        number: 6,
        roleId: 6,
        roleType: 6,
        children: [
          {
            title: '0-0-1-0',
            key: 7,
            level: 7,
            id: 7,
            number: 7,
            pid: 7,
            roleId: 7,
            roleType: 7
          },
          {
            title: '0-0-1-1',
            key: 4,
            level: 4,
            pid: 4,
            number: 4,
            id: 4,
            roleId: 4,
            roleType: 4
          },
          {
            title: '0-0-1-2',
            key: 9,
            level: 9,
            id: 9,
            number: 9,
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
        number: 10,
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
    number: 11,
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
        number: 12,
        roleId: 12,
        roleType: 12
      },
      {
        title: '0-1-0-1',
        key: 13,
        level: 13,
        pid: 13,
        roleId: 13,
        number: 13,
        id: 13,
        roleType: 13
      },
      {
        title: '0-1-0-2',
        key: 14,
        level: 14,
        id: 14,
        pid: 14,
        number: 14,
        roleId: 14,
        roleType: 14
      }
    ]
  },
  {
    title: '0-2',
    key: 15,
    id: 15,
    level: 15,
    number: 15,
    pid: 15,
    roleId: 15,
    roleType: 15
  }
]

@withRouter
@Form.create()
export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // expandedKeys: ['0-0-0', '0-0-1'],
      autoExpandParent: true,
      selectedKeys: [],
      checkedKeys: [],
      checkKeys: [],
      oldCheckKeys: [],
      unCheckKeys: [],
      addList: [],
      deleteList: [],
      checkedTree: [],
      detail: null,
      tree: null,
      companyList: [],
      renderList: [],
      newParams: []
    }
    this.id = props.location.query.id || null
    this.enterType = props.location.query.enterType || null
    this.orgId = props.location.query.orgId || null
  }

  componentDidMount() {
    getMiddleDetail(this.id).then(resp => {
      console.log(resp)
      if (resp && resp.code === 0) {
        this.setState(
          {
            detail: resp.data
          },
          () => {
            // const { detail, renderList, companyList } = this.state
            // obj = {}
            // if (detail.enterpriseIds && detail.enterpriseIds.length !== 0) {
            //   detail.enterpriseIds.forEach(item => {
            //     getDepartmentList()
            //     setState({

            //     }, () => {
            //       DepartmentList.forEach(vr => {
            //         if (vr.id === item.departmentsId) {
            //           obj.departmentTitle = vr.name
            //         }
            //       })
            //     })
            //     getuserList()
            //     setState({

            //     }, () => {
            //       DepartmentList.forEach(vr => {
            //         if (vr.id === item.departmentsId) {
            //           obj.usertitle = vr.name
            //         }
            //       })
            //     })
            //     companyList.forEach(curr => {
            //       if (curr.id === item.enterpriseId) {
            //         obj.companyTitle = curr.name
            //       }
            //     })
            //   })
            // }

            if (this.state.detail.regionId) {
              getRegion(this.state.detail.regionId).then(resp => {
                if (
                  resp &&
                  resp.code === 0 &&
                  Object.keys(resp.data).length > 0
                ) {
                  this.setState({
                    region: handleRegion(resp.data)
                  })
                }
              })
            }
          }
        )
      }
    })

    getAllQuanxian(this.orgId).then(resp => {
      console.log(resp)
      if (resp && resp.code === 0 && resp.data.length > 0) {
        this.setState(
          {
            tree: catList(resp.data)
          },
          () => {
            if (this.enterType === '0') {
              getUserQuanxian(this.id).then(resp => {
                console.log(resp)
                if (resp && resp.code === 0 && resp.data.length > 0) {
                  // const arr = []
                  // const handleData = (data, index) => {
                  //   data.forEach(curr => {
                  //     arr.push(curr.id + '-' + index)
                  //     if (curr.children) {
                  //       handleData(curr.children, index)
                  //     }
                  //   })
                  // }
                  // treeData && treeData.map((item, index) => {
                  //   arr.push(item.id + '-' + index)
                  //   if (item.children) {
                  //     handleData(item.children, index)
                  //   }
                  // })

                  this.setState(
                    {
                      checkedKeys: catListKeys(resp.data)
                      // oldCheckKeys: arr,
                      // checkedTree: resp.data
                    },
                    () => {
                      console.log(this.state.checkedKeys)
                    }
                  )
                }
              })
            }
          }
        )
      }
    })
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

  // onCheck = (keys, e) => {
  //   // debugger
  //   console.log(e)
  //   let id = e.node.props.eventKey;
  //   let params = {
  //     enterpriseId: this.id,
  //     level: e.node.props.dataRef.level,
  //     pid: e.node.props.dataRef.pid,
  //     roleId: id.split('-')[0],
  //     roleType: e.node.props.dataRef.roleType
  //   }
  //   // if (e.node.props.dataRef) {
  //   //   id = e.node.props.dataRef.id

  //   //     ;
  //   //   params = {
  //   //     enterpriseId: this.id,
  //   //     level: e.node.props.dataRef.level,
  //   //     pid: e.node.props.dataRef.pid,
  //   //     roleId: id,
  //   //     roleType: e.node.props.dataRef.roleType
  //   //   }
  //   // }
  //   let checked = e.checked;
  //   let newCheck = this.state.oldCheckKeys;
  //   // let newUnCheckKeys =  this.state.checkKeys
  //   let newChecked = this.state.checkKeys;
  //   let newUnCheckKeys = this.state.unCheckKeys;
  //   let addList = this.state.addList
  //   let deleteList = this.state.deleteList
  //   if (this.enterType === '0') {
  //     // debugger
  //     if (checked) {
  //       let key;
  //       newUnCheckKeys.map((newItem, index) => {
  //         if (id === newItem) {
  //           key = index;
  //         }
  //       });
  //       if (key >= 0) {
  //         newUnCheckKeys.splice(key, 1);
  //         deleteList.splice(key, 1);
  //       }
  //       let isNew = true;
  //       newCheck.map(item => {
  //         if (item === id) {
  //           isNew = false;
  //         }
  //       });
  //       if (isNew) {
  //         newChecked.push(id);
  //         addList.push(params)
  //       }
  //     } else {
  //       let newKey;
  //       newChecked.map((newItem, index) => {
  //         if (id === newItem) {
  //           newKey = index;
  //         }
  //       });
  //       if (newKey >= 0) {
  //         newChecked.splice(newKey, 1);
  //         addList.splice(newKey, 1);
  //       }
  //       let isThatNew = false;
  //       newCheck.map(item => {
  //         if (item === id) {
  //           isThatNew = true;
  //         }
  //       });
  //       if (isThatNew) {
  //         newUnCheckKeys.push(id);
  //         deleteList.push(params);
  //       }
  //     }
  //   } else {//添加逻辑
  //     if (checked) {
  //       addList.push(params)

  //     } else {
  //       addList.map((item, index) => {
  //         if (id === item.roleId) {
  //           addList.splice(index, 1)
  //         }
  //       })
  //     }
  //   }

  //   this.setState({
  //     checkedKeys: keys,
  //     checkKeys: newChecked,
  //     unCheckKeys: newUnCheckKeys,
  //     addList: addList,
  //     deleteList: deleteList
  //   }, () => {
  //     console.log('checkKeys', this.state.checkKeys)
  //     console.log('unCheckKeys', this.state.unCheckKeys)
  //     console.log('addList', this.state.addList)
  //     console.log('deleteList', this.state.deleteList)
  //   });
  // };

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

  //禁用账户处理
  bannedUser = detail => {
    if (!detail) {
      return
    }
    let status = detail.status
    if (status === 1) {
      status = 0
    } else {
      status = 1
    }
    const params = {
      id: this.id,
      enterpriseId: detail.enterpriseId,
      status: status
    }
    middleforbit(params).then(res => {
      if (res && res.code === 0) {
        message.success(res.message)
        router.goBack()
      } else {
        message.error(res.message)
      }
    })
  }

  //提交表单处理
  submit = () => {
    // const { validateFields } = this.props.form
    const { headImg, newParams } = this.state

    const params = {}
    params['id'] = this.id
    // params['authUserRoleRQ'] = newParams
    params['enterpriseId'] = this.orgId
    console.log(params)
    editMiddleUser(params).then(resp => {
      console.log(resp)
      if (resp && resp.code === 0) {
        message.success('提交成功')
        router.goBack()
      } else {
        message.warning('提交失败，请稍后再试')
      }
    })
  }

  render() {
    const { detail, region, tree } = this.state
    console.log(tree)
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
                <Breadcrumb.Item>编辑中台用户</Breadcrumb.Item>
              </Breadcrumb>

              <h2 style={{ marginTop: 10, fontWeight: 'bold' }}>
                {'账户详情'}
              </h2>
              {/* <p>操作：用户基本信息和公司信息不可编辑，可编辑权限和角色</p> */}
            </Col>
            <Col span={5}>
              <div>最后修改: {detail && detail.updateTime}</div>
              <div style={{ margin: '10px 0' }}>
                {detail && detail.updateName
                  ? '修改人：' + detail.updateName
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
                {this.enterType === '0' && (
                  <Popconfirm
                    placement="top"
                    title={
                      detail && detail.status === 0 ? (
                        <div>
                          <p>启用本账号</p>
                          <p>{`确定启用账户“账户名称${detail &&
                            detail.nickname}”吗？`}</p>
                        </div>
                      ) : (
                        <div>
                          <p>禁用本账号</p>
                          <p>{`确定禁用账户“账户名称${detail &&
                            detail.nickname}”吗？`}</p>
                        </div>
                      )
                    }
                    onConfirm={this.bannedUser.bind(this, detail)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button
                      type="primary"
                      style={{ marginLeft: 30 }}
                      icon="stop"
                    >
                      {detail && detail.status === 0
                        ? '启用本账户'
                        : '禁用本账户'}
                    </Button>
                  </Popconfirm>
                )}
              </div>
            </Col>
          </Row>
        </div>
        {/* <div className={styles.empty} /> */}
        <div className={styles.content}>
          <div className={styles.baseInfo}>
            <h4 style={{ fontWeight: 700 }}>基本信息</h4>
            <Row gutter={48} style={{ marginTop: 20 }}>
              <Col>
                头像：
                <Avatar src={''} size={100} />
              </Col>
            </Row>
            <Row gutter={48} style={{ padding: '30px 30px 30px 0' }}>
              <Col span={8}>
                <span>注册手机号：</span>
                <span>{detail && detail.phone}</span>
              </Col>
              <Col span={8}>
                <span>成员姓名：</span>
                <span>{detail && detail.nickname}</span>
              </Col>
              <Col span={8}>
                <span>邮箱：</span>
                <span>{detail && detail.email}</span>
              </Col>
            </Row>
            <Row gutter={48} style={{ padding: '30px 30px 30px 0' }}>
              <Col span={8}>
                <span>固话：</span>
                <span>{detail && detail.fixtel}</span>
              </Col>
              <Col span={8}>
                <span>所在地：</span>
                <span>{region && region}</span>
              </Col>
              <Col span={8}>
                <span>详细地址：</span>
                <span>{detail && detail.address}</span>
              </Col>
            </Row>
            <Divider />
          </div>
          <div className={styles.baseInfo}>
            <h4 style={{ fontWeight: 700 }}>公司信息</h4>
            {detail &&
              detail.edpNameDTOS.length > 0 &&
              detail.edpNameDTOS.map((item, index) => {
                return (
                  <Row gutter={48} style={{ padding: '30px 30px 30px 0' }}>
                    <Col span={8}>
                      <span>关联公司{index + 1} : </span>
                      <span>{item.enterpriseSimpleName}</span>
                    </Col>
                    <Col span={8}>
                      <span>所属部门 : </span>
                      <span>{item.departmentName}</span>
                    </Col>
                    <Col span={8}>
                      <span>设置职位 : </span>
                      <span>{item.postName}</span>
                    </Col>
                  </Row>
                )
              })}
            <Divider />
          </div>
          <div className={styles.TreeNode}>
            {/* <h4 style={{ fontWeight: 700 }}>权限配置</h4> */}
            <Form gutter={48}>
              <FormItem label="">
                {/* {
                  treeData && treeData.map((item, index) => {
                    return <Tree
                      key={index}
                      checkable
                      // checkStrictly={true}
                      onExpand={this.onExpand}
                      expandedKeys={this.state.expandedKeys}
                      // autoExpandParent={this.state.autoExpandParent}
                      onCheck={this.onCheck.bind(this, index)}
                      checkedKeys={this.state.checkedKeys}
                      onSelect={this.onSelect}
                      selectedKeys={this.state.selectedKeys}
                    >
                      {this.renderTreeNodes([item])}
                    </Tree>
                  })
                } */}
                {/* {tree && (
                  <Tree
                    checkable
                    // checkStrictly={true}
                    onExpand={this.onExpand}
                    expandedKeys={this.state.expandedKeys}
                    // autoExpandParent={this.state.autoExpandParent}
                    onCheck={this.onCheck}
                    checkedKeys={this.state.checkedKeys}
                    onSelect={this.onSelect}
                    selectedKeys={this.state.selectedKeys}
                  >
                    {this.renderTreeNodes(tree)}
                  </Tree>
                )} */}
              </FormItem>
            </Form>
            <Divider />
          </div>
          <div className={styles.TreeNode}>
            {/* <h4 style={{ fontWeight: 700 }}>角色配置</h4>
            <Form layout="v">
              <FormItem label="关联公司">
                <Checkbox.Group>
                  {a.map(item => {
                    return (
                      <Checkbox key={item} style={{ width: 60 }}>
                        {item}
                      </Checkbox>
                    )
                  })}
                </Checkbox.Group>
              </FormItem>
            </Form> */}
            {/* <Divider /> */}
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.buttons} style={{ position: 'relative' }}>
            <Button onClick={() => router.goBack()}>取消</Button>
            <Button onClick={this.submit} type="primary">
              提交
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

const handleRegion = data => {
  let str = ''
  if (data) {
    str += data.province.district
    str += data.city.district
    str += data.county.district
    return str
  }
  return str
}

const getObjById = (id, tree) => {
  // debugger
  let obj = {}
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].number === Number(id)) {
      obj = tree[i]
      // if (obj.children) {
      //   delete obj.children
      // }
      return obj
    } else if (tree[i].children) {
      return getObjById(id, tree[i].children)
    }
  }
  return obj
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
    if (item.children) {
      catList(item.children)
    }
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
