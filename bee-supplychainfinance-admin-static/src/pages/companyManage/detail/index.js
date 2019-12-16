import React, { Component, Fragment } from 'react'
import style from './index.less'
import {
  Button,
  Input,
  Select,
  Form,
  Modal,
  Icon,
  message,
  Breadcrumb
} from 'antd'
import withRouter from 'umi/withRouter'
import router from 'umi/router'
import { connect } from 'dva'
import {
  getCompanyInfo,
  changeAdminUser,
  companyAudit
} from '../../../services/index'
import apis from '../api'
import request from '@/common/request'

const confirm = Modal.confirm
const FormItem = Form.Item
const { Option } = Select
const { TextArea } = Input

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
      data: {}
    }
    this.auditTypes = ['未通过', '已通过', '未审核']
  }
  componentDidMount() {
    const { id } = this.state
    const { button } = this.props.global
    const { setFieldsValue } = this.props.form
    const { pathname } = location
    this.getDefualtData(id)
  }
  getDefualtData = id => {
    const { setFieldsValue } = this.props.form
    getCompanyInfo(id).then(res => {
      if (res && res.code === 0) {
        let data = res.data;
        if (res.data.regionid) {
          request(apis.findAllRegionById.api(res.data.regionid)).then(res2 => {
            data.address = res2.data.province.district + res2.data.city.district + res2.data.county.district + data.street
            this.setState({ data })
          })
        }
      } else if (res) {
        message.error(res.msg)
      } else {
        message.error(res.msg)
      }
    })
  }
  passThisCompany = (auditStatus) => {
    let params = { platformEnterpriseId: this.state.id, auditStatus }
    const self = this
    confirm({
      title: '企业审核',
      content: '确认该企业通过审核？',
      onOk() {
        companyAudit(params).then(res => {
          if (res && res.code === 0) {
            self.turnTo('/companyManage')
            message.success(res.msg)
          } else if (res) {
            message.error(res.msg)
          } else {
            message.error(res.msg)
          }
        })
      }
    })
  }
  noPass = () => {
    this.setState({
      visible: true
    })
  }

  handleOk = () => {
    const self = this
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = { id: this.state.id, reason: values.reason, type: 0 }
        companyAudit(params).then(res => {
          if (res && res.code === 0) {
            this.setState({
              visible: false
            })
            self.turnTo('/companyManage')
            message.success(res.msg)
          } else if (res) {
            message.error(res.msg)
          } else {
            message.error(res.msg)
          }
        })
      }
    })
  }
  modify() {
    this.setState({
      isEdit: true
    })
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
    let userId = this.props.form.getFieldValue('userId')
    changeAdminUser({ userId: userId, checkId: this.state.id }).then(res => {
      if (res && res.code === 0) {
        message.success(res.msg)
      } else if (res) {
        message.error(res.msg)
      } else {
        message.error(res.msg)
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { data, showModal, isEdit } = this.state
    return (
      <div className={style.companyDetail}>
        <div className={style.companyDetailHead}>
          <div className={style.companyDetailHeadTitle}>
            <div className={style.companyDetailBigTitle}>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <a onClick={this.turnTo.bind(this, '/companyManage')}>
                    企业管理
                  </a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>企业审核详情</Breadcrumb.Item>
              </Breadcrumb>
              企业审核详情
            </div>
            {/* <div className={style.companyDetailSmallTitle}>
              <p>{data.updateAt ? `最后修改：${data.updateAt}` : ''}</p>
              <p>{data.modifier ? data.modifier : ''}</p>
            </div> */}
          </div>
          <div className={style.companyDetailBottomTitle}>

            {data.audit !== 1 ? <Fragment>
              <Button
                onClick={this.passThisCompany.bind(this, 1)}
                type="primary"
              >
                通过
            </Button>
              <Button
                onClick={this.turnTo.bind(this, '/companyManage')}
              >
                返回
            </Button>
            </Fragment> : <Fragment>
                <Button
                  onClick={this.turnTo.bind(this, '/companyManage/edit?id=' + this.state.id)}
                  type="primary"
                >
                  修改
            </Button>
                <Button
                  onClick={this.turnTo.bind(this, '/companyManage')}
                >
                  返回
            </Button>
              </Fragment>}

          </div>
        </div>
        <div className={style.companyDetailContent}>
          <div className={style.companyDetailMsg}>
            <h3>企业信息</h3>
            <p className={style.specialPar}>
              <span>企业名称：{isEdit ? <Input /> : <span>{data.enterpriseName}</span>}</span>
              <span>状态：{this.auditTypes[data.audit]}</span>
              <span className={style.specialSpan}>
                企业电话：{data.contact}
              </span>
            </p>
            <p>
              {/* <span>联系人：{data.linkman}</span> */}
              {/* <span>所属行业：{data.industry}</span> */}
              <span>企业地址：{data.address}</span>
            </p>
          </div>
          <div className={style.companyDetailImg}>
            <div className={style.companyDetailImgBox}>
              <h3>营业执照：</h3>
              {data.enclosuresList &&
                data.enclosuresList.map((item, index) => {
                  return (
                    <img
                      onClick={this.showModal.bind(this, item.url)}
                      key={item.enterprisesCheckId + 'imgOne' + index}
                      src={item.url}
                    />
                  )
                })}
            </div>
            <div className={style.companyDetailImgBox}>
              <h3>开户许可证：</h3>
              {data.permitsList &&
                data.permitsList.map((item, index) => {
                  return (
                    <img
                      onClick={this.showModal.bind(this, item.url)}
                      key={item.enterprisesCheckId + 'imgTwo' + index}
                      src={item.url}
                    />
                  )
                })}
            </div>
            {/* <div className={style.companyDetailImgBox}>
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
            </div> */}
          </div>
          {/* <div className={style.companyDetailInputBox}>
            <Form layout="inline">
              <FormItem style={{ float: 'left' }} label="企业管理员：">
                {getFieldDecorator('userId', {
                  // initialValue:
                  //   data.type && data.enterprisesAdmin
                  //     ? data.enterprisesAdmin.userid
                  //     : data.userDTOs.length > 0
                  //     ? data.userDTOs[0].userid
                  //     : ''
                })(
                  <Select
                    style={{ width: '250px', float: 'left' }}
                    disabled={data.type === 2}
                  >
                    {data.type && data.enterprisesAdmin ? (
                      <Option value={data.enterprisesAdmin.userid}>
                        {data.enterprisesAdmin.nickname}(
                        <span title={data.enterprisesAdmin.phone}>
                          {data.enterprisesAdmin.phone}
                        </span>
                        )
                      </Option>
                    ) : null}
                    {data.type &&
                      data.userDTOs.length > 0 &&
                      data.userDTOs.map(item => {
                        return (
                          <Option key={item.userid} value={item.userid}>
                            {item.nickname}(
                            <span title={item.phone}>{item.phone}</span>)
                          </Option>
                        )
                      })}
                  </Select>
                )}
              </FormItem>
              <Button
                disabled={data.type === 2}
                type="primary"
                onClick={this.changeAdmin}
              >
                提交变更
              </Button>
            </Form>
            <p>
              开通产品：
              {data.appsDTOs &&
                data.appsDTOs.map((item, index) => {
                  return (
                    <span key={index + item.appName}>
                      {item.appName} | {item.appRolesName}；
                    </span>
                  )
                })}
            </p>
          </div>*/}
        </div>
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
      </div>
    )
  }
}
