import React, { Component } from 'react'
import style from './index.less'
import {
  Button,
  Input,
  Select,
  Form,
  Modal,
  Icon,
  message,
  Breadcrumb,
  Tree
} from 'antd'
import withRouter from 'umi/withRouter'
import router from 'umi/router'
import { connect } from 'dva'
import { changeAdminUser, companyAudit } from '../../../../services/index'
import {
  getEnterpriseRoleTree,
  updateRoleData,
  getFuns,
  getCompanyInfo
} from '../services'

const confirm = Modal.confirm
const FormItem = Form.Item
const { Option } = Select
const { TextArea } = Input
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
      reason: '',
      id: Number(this.props.location.query.id),
      visible: false,
      showModal: false,
      showImg: '',
      data: {},
    treeData: [],
      refresh: false,
      ButtonLoading: false,
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData: [],
      checkKeys: [],
      oldCheckKeys: [1],
      halfCheckedKeys: [],
      strictly: false,
      newParams: []
    }
    this.id = props.location.query.id || null
  }
  componentDidMount() {
    const { id } = this.state
    const { button } = this.props.global
    const { pathname } = location
    this.getDefualtData(id)
  }
  getDefualtData = id => {
    getCompanyInfo(id).then(res => {
      if (res && res.code === 0) {
        this.setState({
          data: res.data
        })
      } else if (res) {
        message.error(res.message)
      } else {
        message.error(res.message)
      }
    })
    // getEnterpriseRoleTree(this.id).then(res => {
    //   if (res && res.code === 0) {
    //     let newData = catList(res.data)
    //     console.log(newData)
    //     this.setState({
    //       treeData: newData
    //     })
    //     getFuns(this.id).then(res => {
    //       console.log(res)
    //       if (res && res.code === 0) {
    //         let newData = res.data.length && this.keyList(res.data)
    //         let newKey = []
    //         newData &&
    //           newData.map(item => {
    //             newKey.push(item.key)
    //           })
    //         this.setState({
    //           checkedKeys: catListKeys(res.data),
    //           oldCheckKeys: newKey
    //         })
    //       } else if (res) {
    //         message.error(res.message)
    //       } else {
    //         message.error(res.message)
    //       }
    //     })
    //   } else if (res) {
    //     message.error(res.message)
    //   } else {
    //     message.error(res.message)
    //   }
    // })
  }
  passThisCompany = () => {
    const { turnTo } = this;
    const { checkedKeys, id, halfCheckedKeys, oldCheckKeys } = this.state;
    halfCheckedKeys.map(item => {
      checkedKeys.push(item + '-' + '0')
    })
    if (JSON.stringify(checkedKeys) === JSON.stringify(oldCheckKeys)) {
      message.warning('权限未发生任何改变！')
      return;
    }
    confirm({
      title: "企业权限配置",
      content: "确认为该企业变更这些信息吗？",
      onOk() {
        let newParams = [];
        // checkedKeys.map(item => {
        //   let newItem = item.split("-$+&1%");
        //   newParams.push({
        //     enterpriseId: id,
        //     roleId: newItem[0],
        //     roleType: newItem[1],
        //     level: newItem[2],
        //     pid: newItem[3],
        //     subSys: newItem[4],
        //     roleName: newItem[5]
        //   });
        // });
        checkedKeys && checkedKeys.length > 1 && checkedKeys.map(item => {
          let newItem = item.split('-');
          newParams.push({
            enterpriseId: id,
            // userId: userId,
            roleId: newItem[0],
            roleType: newItem[1],
            level: newItem[2],
            pid: newItem[3],
            // createUser
            subSys: newItem[4],
            roleName: newItem[5],
            // title: newItem[6],
            flag: newItem[6] === '0' ? 0 : 1,
          })
        });
        // updateRoleData({ enterpriseId: id, list: newParams }).then(res => {
        //   if (res.code === 0) {
        //     message.success(res.message);
        //     turnTo("/companyManage/companyList");
        //   } else {
        //     message.error(res.message);
        //   }
        // });
      }
    });
    // const { checkedKeys, newParams,id } = this.state
    // let list = []
    // let enterpriseId = this.id


    // checkedKeys && checkedKeys.length >1 && checkedKeys.map(item => {
    //   let newItem = item.split('-')
    //   list.push({
    //     enterpriseId: id,
    //     // userId: userId,
    //     roleId: newItem[0],
    //     roleType: newItem[1],
    //     level: newItem[2],
    //     pid: newItem[3],
    //     // createUser
    //     subSys: newItem[4],
    //     roleName: newItem[5]
    //     // title: newItem[6],
    //   })
    // })


    // updateRoleData({ list, enterpriseId }).then(resp => {
    //   if (resp && resp.code === 0) {
    //     message.success(resp.message)
    //     router.goBack()
    //   } else {
    //     message.warning(resp.message)
    //   }
    // })
  }
  noPass = () => {
    this.setState({
      visible: true
    })
  }
  catList = data => {
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
        item.roleName
      item.title = item.roleName
      if (item.children) {
        this.catList(item.children)
      }
    })
    return data
  }
  keyList = data => {
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
        item.roleName
      item.title = item.roleName
      if (item.children) {
        this.keyList(item.children)
      }
    })
    return data
  }
  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = { id: this.state.id, reason: values.reason, type: 0 }
        companyAudit(params).then(res => {
          if (res && res.code === 0) {
            this.setState({
              visible: false
            })
            this.turnTo('/companyManage/companyList')
          } else if (res) {
            message.error(res.message)
          } else {
            message.error(res.message)
          }
        })
      }
    })
  }
  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys)
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: true
    })
  }
  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys })
  }
  handleCancel = () => {
    this.setState({
      visible: false
    })
  }
  turnTo = turnPath => {
    router.push(turnPath)
  }
  showModal(showImg) {
    this.setState({
      showModal: true,
      showImg: showImg
    })
  }
  changeAdmin = () => {
    // let userId = this.props.form.getFieldValue('userId')
    // changeAdminUser({ userId: userId, checkId: this.state.id }).then(res => {
    //   if (res && res.code === 0) {
    //     message.success(res.message)
    //   } else if (res) {
    //     message.error(res.message)
    //   } else {
    //     message.error(res.message)
    //   }
    // })
  }
  onCheck = (keys, e) => {
    let newParams = []
    const { id, checkedKeys } = this.state
    keys.map(item => {
      let newItem = item.split('-')
      newParams.push({
        enterpriseId: id,
        // userId: userId,
        roleId: newItem[0],
        roleType: newItem[1],
        level: newItem[2],
        pid: newItem[3],
        // createUser
        subSys: newItem[4],
        roleName: newItem[5]
        // title: newItem[6],
      })
    })
    this.setState({
      checkedKeys: keys,
      newParams,
      halfCheckedKeys: e.halfCheckedKeys && e.halfCheckedKeys
      // checkKeys: newChecked,
      // unCheckKeys: newUnCheckKeys,
      // addList:addList,
      // deleteList:deleteList,
    })
  }
  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={item.title}
            key={item.key}
            dataRef={item}
            className={style.TreeNode}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode {...item} className={style.TreeNode} />
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { data, showModal, buttonRight, treeData, strictly } = this.state
    return (
      <div className={style.companyDetail}>
        <div className={style.companyDetailHead}>
          <div className={style.companyDetailHeadTitle}>
            <div className={style.companyDetailBigTitle}>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <a
                    onClick={this.turnTo.bind(
                      this,
                      '/companyManage/companyList'
                    )}
                  >
                    企业管理
                  </a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <a
                    onClick={this.turnTo.bind(
                      this,
                      '/companyManage/companyList'
                    )}
                  >
                    企业列表
                  </a>
                </Breadcrumb.Item>
              </Breadcrumb>
              企业权限配置
            </div>
            <div className={style.companyDetailSmallTitle}>
              <p>{data.updateTime ? `最后修改：${data.updateTime}` : ''}</p>
              <p>{data.modifier ? data.modifier : ''}</p>
            </div>
          </div>
          <div className={style.companyDetailBottomTitle}>
            <span />
            <Button
              onClick={this.turnTo.bind(this, '/companyManage/companyList')}
              type="primary"
            >
              返回
            </Button>
          </div>
        </div>
        <div className={style.companyDetailContent}>
          {/* <div className={style.companyDetailResult}>
            <div className={style.companyDetailResultHead}>
              审核结果：
              <span
                style={
                  data.type === 1 || data.type === 4
                    ? { color: "rgb(76, 211, 152)" }
                    : data.type === 5 || data.type === 2
                    ? { color: "rgb(72, 117, 236)" }
                    : { color: "#F45844" }
                }
              >
                {data.type === 0
                  ? "未通过|认证"
                  : data.type === 1
                  ? "通过|认证"
                  : data.type === 2
                  ? "未审核|认证"
                  : data.type === 3
                  ? "未通过|修改"
                  : data.type === 4
                  ? "通过|修改"
                  : "未审核|修改"}
              </span>
            </div>
            {data.type === 1 || data.type === 4 ? (
              <div className={style.companyDetailReason}>
                <div className={style.companyDetailReasonHead}>已通过</div>
              </div>
            ) : data.type === 2 || data.type === 5 ? null : (
              <div className={style.companyDetailReason}>
                <div className={style.companyDetailReasonHead}>
                  未通过理由：
                </div>
                <p>{data.failureReason}</p>
              </div>
            )}
          </div> */}
          <div className={style.companyDetailMsg}>
            <h3>企业信息</h3>
            <p className={style.specialPar}>
              <span>企业名称：{data.name}</span>
              <span>联系人：{data.linkman}</span>
              <span className={style.specialSpan}>
                企业联系方式：{data.contact}
              </span>
            </p>
            <p>
              <span>所属行业：{data.industry}</span>
              <span>企业地址：{data.address}</span>
            </p>
          </div>
          <div className={style.companyDetailMsg}>
            <p className={style.specialPar}>
              <span>
                <i
                  style={{
                    fontStyle: 'normal',
                    fontWeight: '600',
                    color: '#333'
                  }}
                >
                  部门信息:
                </i>
                {data.departments &&
                  data.departments.map((item, index) => {
                    if (index === data.departments.length - 1) {
                      return (
                        <i
                          style={{
                            fontStyle: 'normal',
                            marginLeft: '10px',
                            display: 'inline-block'
                          }}
                        >
                          {item.name}
                        </i>
                      )
                    } else {
                      return (
                        <i
                          style={{
                            fontStyle: 'normal',
                            marginLeft: '10px',
                            display: 'inline-block'
                          }}
                        >
                          {item.name},
                        </i>
                      )
                    }
                  })}
              </span>
            </p>
            <p className={style.specialPar}>
              <span>
                <i
                  style={{
                    fontStyle: 'normal',
                    fontWeight: '600',
                    color: '#333'
                  }}
                >
                  职位信息:
                </i>
                {data.posts &&
                  data.posts.map((item, index) => {
                    if (index === data.posts.length - 1) {
                      return (
                        <i
                          style={{
                            fontStyle: 'normal',
                            marginLeft: '10px',
                            display: 'inline-block'
                          }}
                        >
                          {item.name}
                        </i>
                      )
                    } else {
                      return (
                        <i
                          style={{
                            fontStyle: 'normal',
                            marginLeft: '10px',
                            display: 'inline-block'
                          }}
                        >
                          {item.name},
                        </i>
                      )
                    }
                  })}
              </span>
            </p>
            <p className={style.specialPar}>
              <span>
                <i
                  style={{
                    fontStyle: 'normal',
                    fontWeight: '600',
                    color: '#333'
                  }}
                >
                  企业成员:
                </i>
                {data.members &&
                  data.members.map((item, index) => {
                    if (index === data.members.length - 1) {
                      return (
                        <i
                          style={{
                            fontStyle: 'normal',
                            marginLeft: '10px',
                            display: 'inline-block'
                          }}
                        >
                          {item.name}({item.username})
                        </i>
                      )
                    } else {
                      return (
                        <i
                          style={{
                            fontStyle: 'normal',
                            marginLeft: '10px',
                            display: 'inline-block'
                          }}
                        >
                          {item.name}({item.username}),
                        </i>
                      )
                    }
                  })}
              </span>
            </p>
          </div>
          <div className={style.companyDetailImg}>
            <div className={style.companyDetailImgBox}>
              <h3>营业执照：</h3>
              {data.enclosuresList &&
                data.enclosuresList.map((item, index) => {
                  return (
                    <img
                      onClick={this.showModal.bind(this, item.fileUrl)}
                      key={item.enterprisesCheckId + 'imgOne' + index}
                      src={item.fileUrl}
                    />
                  )
                })}
            </div>
            <div className={style.companyDetailImgBox}>
              <h3>营业许可证：</h3>
              {data.permitsList &&
                data.permitsList.map((item, index) => {
                  return (
                    <img
                      onClick={this.showModal.bind(this, item.fileUrl)}
                      key={item.enterprisesCheckId + 'imgTwo' + index}
                      src={item.fileUrl}
                    />
                  )
                })}
            </div>
            <div className={style.companyDetailImgBox}>
              <h3>企业认证授权书：</h3>
              {data.certificatesList &&
                data.certificatesList.map((item, index) => {
                  return (
                    <img
                      onClick={this.showModal.bind(this, item.fileUrl)}
                      key={item.enterprisesCheckId + 'imgThree' + index}
                      src={item.fileUrl}
                    />
                  )
                })}
            </div>
          </div>
          <div className={style.companyDetailInputBox} />
        </div>
        {/* <div className={style.content}>
          <h3>企业权限</h3>
          {treeData.length ? (
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
          ) : null}
        </div> */}
        {/* {data.type === 5 || data.type === 2 ? ( */}
        <div className={style.companyDetailBtn}>
          <Button
            type="primary"
            onClick={this.turnTo.bind(this, '/companyManage/companyList')}
            className={style.noBtn}
          >
            返回
          </Button>
          <Button type="primary" onClick={this.passThisCompany}>
            提交
          </Button>
        </div>
        {/* ) : null} */}
        <Modal
          title={null}
          centered
          visible={showModal}
          footer={null}
          style={{ width: '100%' }}
          wrapClassName="iden-modal"
          className="iden-modal"
          width={'auto'}
          closable={true}
          maskClosable
          keyboard
          onCancel={() => this.setState({ showModal: false })}
        >
          <img src={this.state.showImg} />
        </Modal>
        <Modal
          title={
            <div>
              <Icon
                style={{
                  height: '22px',
                  width: '22px',
                  color: '#faad14',
                  marginRight: '10px'
                }}
                type="question-circle"
              />
              <span>请输入审核不通过理由</span>
            </div>
          }
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          closable={false}
          className="companyModal"
        >
          <Form layout="inline">
            <FormItem>
              {getFieldDecorator('reason', {
                rules: [
                  {
                    required: true,
                    message: '请输入审核不通过理由'
                  }
                ]
              })(
                <TextArea
                  placeholder="请输入审核不通过理由"
                  style={{ width: '300px', height: '90px', resize: 'none' }}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
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
      item.roleName
    //  + '-' + item.title
    item.title = item.roleName
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
      item.roleName
    //  + '-' + item.title
    item.title = item.roleName
    arr.push(item.key)
    if (item.children) {
      catList(item.children)
    }
  })
  return arr
}
