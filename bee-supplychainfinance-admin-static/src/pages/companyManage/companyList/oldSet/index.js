import React, { Component } from "react";
import style from "./index.less";
import { Button, Input, Select, Form, Modal, Icon, message,Breadcrumb } from "antd";
import withRouter from "umi/withRouter";
import router from "umi/router";
import { connect } from 'dva'
import {
  getCompanyInfo,
  changeAdminUser,
  companyAudit
} from "../../../service/company";


const confirm = Modal.confirm;
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@withRouter
@Form.create()
@connect(({ global, loading }) => ({
  global
}))

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reason: "",
      id: Number(this.props.location.query.id),
      visible: false,
      showModal: false,
      showImg: "",
      data: {},
      buttonRight:true,
    };
  }
  componentDidMount() {
    const { id } = this.state;
    const {pathname} = location
    this.getDefualtData(id);
  }
  getDefualtData = id => {
    getCompanyInfo(id).then(res => {
      if (res && res.code === 0) {
        this.setState({
          data: res.data
        });
      } else if (res) {
        message.error(res.message);
      } else {
        message.error(res.message);
      }
    });
  };
  passThisCompany = () => {
    let params = { id: this.state.id, type: 1 };
    const turnTo = this
    confirm({
      title: "企业审核",
      content: "确认该企业通过审核？",
      onOk() {
        companyAudit(params).then(res => {
          if (res && res.code === 0) {
            turnTo('/companyManage')
            message.success(res.message);
          } else if (res) {
            message.error(res.message);
          } else {
            message.error(res.message);
          }
        });
      }
    });
  };
  noPass = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = { id: this.state.id, reason: values.reason, type: 0 };
        companyAudit(params).then(res => {
          if (res && res.code === 0) {
            this.setState({
              visible:false
            })
            this.turnTo('/companyManage')
            message.success(res.message);
          } else if (res) {
            message.error(res.message);
          } else {
            message.error(res.message);
          }
        });
      }
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  turnTo = turnPath => {
    router.push(turnPath);
  };
  showModal(showImg) {
    this.setState({
      showModal: true,
      showImg: showImg
    });
  }
  changeAdmin = () => {
    let userId = this.props.form.getFieldValue("userId");
    changeAdminUser({ userId: userId, checkId: this.state.id }).then(res => {
      if (res && res.code === 0) {
        message.success(res.message);
      } else if (res) {
        message.error(res.message);
      } else {
        message.error(res.message);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { data, showModal,buttonRight } = this.state;
    return (
      <div className={style.companyDetail}>
        <div className={style.companyDetailHead}>
          <div className={style.companyDetailHeadTitle}>
          
            <div className={style.companyDetailBigTitle}><Breadcrumb >
          <Breadcrumb.Item>
            <a onClick={this.turnTo.bind(this,"/companyManage")}>企业管理</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>企业审核详情</Breadcrumb.Item>
        </Breadcrumb>企业审核详情</div>
            <div className={style.companyDetailSmallTitle}>
              <p>{data.updateAt ? `最后修改：${data.updateAt}` : ""}</p>
              <p>{data.modifier ? data.modifier : ""}</p>
            </div>
          </div>
          <div className={style.companyDetailBottomTitle}>
            <span>操作：可编辑</span>
            <Button
              onClick={this.turnTo.bind(this, "/companyManage")}
              type="primary"
            >
              返回
            </Button>
          </div>
        </div>
        <div className={style.companyDetailContent}>
          <div className={style.companyDetailResult}>
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
          </div>
          <div className={style.companyDetailMsg}>
            <h3>企业提交信息</h3>
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
          <div className={style.companyDetailImg}>
            <div className={style.companyDetailImgBox}>
              <h3>营业执照：</h3>
              {data.enclosuresList &&
                data.enclosuresList.map((item, index) => {
                  return (
                    <img
                      onClick={this.showModal.bind(this, item.fileUrl)}
                      key={item.enterprisesCheckId + "imgOne" + index}
                      src={item.fileUrl}
                    />
                  );
                })}
            </div>
            <div className={style.companyDetailImgBox}>
              <h3>营业许可证：</h3>
              {data.permitsList &&
                data.permitsList.map((item, index) => {
                  return (
                    <img
                      onClick={this.showModal.bind(this, item.fileUrl)}
                      key={item.enterprisesCheckId + "imgTwo" + index}
                      src={item.fileUrl}
                    />
                  );
                })}
            </div>
            <div className={style.companyDetailImgBox}>
              <h3>企业认证授权书：</h3>
              {data.certificatesList &&
                data.certificatesList.map((item, index) => {
                  return (
                    <img
                      onClick={this.showModal.bind(this, item.fileUrl)}
                      key={item.enterprisesCheckId + "imgThree" + index}
                      src={item.fileUrl}
                    />
                  );
                })}
            </div>
          </div>
          <div className={style.companyDetailInputBox}>
            <Form layout="inline">
              <FormItem style={{ float: "left" }} label="企业管理员：">
                {getFieldDecorator("userId", {
                  initialValue:
                    data.type && data.enterprisesAdmin
                      ? data.enterprisesAdmin.userid
                      : ""
                })(
                  <Select
                    style={{ width: "250px", float: "left" }}
                    disabled={data.type === 2}
                  >
                    {data.type && data.enterprisesAdmin ? (
                      <Option value={data.enterprisesAdmin.userid}>
                        {data.enterprisesAdmin.nickname}(<span title={data.enterprisesAdmin.phone}>{data.enterprisesAdmin.phone}</span>)
                      </Option>
                    ) : null}
                    {data.type &&
                      data.userDTOs.length > 0 &&
                      data.userDTOs.map(item => {
                        return (
                          <Option key={item.userid} value={item.userid}>
                            {item.nickname}(<span title={item.phone}>{item.phone}</span>)
                          </Option>
                        );
                      })}
                  </Select>
                )}
              </FormItem>
              <Button
                disabled={!buttonRight || data.type === 2}
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
                  );
                })}
            </p>
          </div>
        </div>
        {data.type === 5 || data.type === 2 ? (
          <div className={style.companyDetailBtn}>
            <Button
              type="primary"
              onClick={this.noPass}
              className={style.noBtn}
              disabled={!buttonRight}
            >
              审核不通过
            </Button>
            <Button disabled={!buttonRight} type="primary" onClick={this.passThisCompany}>
              审核通过
            </Button>
          </div>
        ) : null}
        <Modal
          title={null}
          centered
          visible={showModal}
          footer={null}
          style={{ width: "100%" }}
          wrapClassName="iden-modal"
          className="iden-modal"
          width={"auto"}
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
                  height: "22px",
                  width: "22px",
                  color: "#faad14",
                  marginRight: "10px"
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
              {getFieldDecorator("reason", {
                rules: [
                  {
                    required: true,
                    message: "请输入审核不通过理由"
                  }
                ]
              })(
                <TextArea
                  placeholder="请输入审核不通过理由"
                  style={{ width: "300px", height: "90px", resize: "none" }}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
