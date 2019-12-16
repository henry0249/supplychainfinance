import React, { Component, Fragment } from "react";
import { Breadcrumb, Button, Modal, Icon, message, Input } from "antd";
import {
  Contract,
  PurchaseWarning,
  SellWarning,
  StorageWarning
} from "./components";
import style from "./index.less";
import { connect } from "dva";
import router from "umi/router";
import { withRouter } from "react-router";
import { getChangeThings, updateLowGrade } from "../services/appContract";

const confirm = Modal.confirm;
const { TextArea } = Input;
@withRouter
@connect(({ global, appContract }) => ({
  global,
  appContract
}))
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      sureTitle: "",
      roleId: this.props.global.role.roleId,
      orderId: this.props.location.query.orderId,
      contractBasicId: this.props.location.query.contractBasicId,
      appType: this.props.location.query.appType,
      status: null,
      right: false,
      refuseReason: null,
      err: false,
      onId: null,
      type: sessionStorage.businessMode,
      path: null,
      unitData: {},
      applyId: null
    };
  }

  componentDidMount() {
    const { roleId, status, orderId, contractBasicId, unitData } = this.state;
    const url = location.pathname;
    let pathName = "";
    if (url === "/approval/contract/contractDetail") {
      pathName = url.substring(0, url.indexOf("/contractDetail"));
    } else {
      pathName = url.substring(0, url.indexOf("/contract/detail"));
    }
    this.setState({
      path: pathName
    });
    //获取合同详情
    this.props.dispatch({
      type: "appContract/getContractDetail",
      payload: {
        buyOrdersId: orderId,
        buyContractBasicId: contractBasicId
      },
      callback: (code, msg, data) => {
        if (code === 0) {
          this.setState(
            {
              status: data.examineStatus,
              right:
                (data.examineStatus === 0 && roleId === 6) ||
                (data.examineStatus === 1 && roleId === 7) ||
                (data.examineStatus === 2 && roleId === 13) ||
                (data.examineStatus === 3 && roleId === 8)
            },
            () => {
              getChangeThings(orderId).then(res => {
                if (res.code === 0) {
                  this.setState({
                    unitData: res.data,
                    applyId: res.data.applyId
                  });
                } else {
                  message.error(res.msg);
                }
              });
            }
          );
        } else {
          // message.error(msg);
        }
      }
    });
  }

  //保存预警配置，通过合同改变合同状态，更新单价与质量
  pass = () => {
    const {
      err,
      contractBasicId,
      roleId,
      orderId,
      onId,
      unitData,
      applyId
    } = this.state;
    const { dispatch, appContract } = this.props;
    const type = () => sessionStorage.businessMode;
    const businessMode = type();
    let newWarningData = {};
    let addData = {};
    for (var item in appContract.warningData) {
      if (
        item !== "unitPrice" &&
        item !== "price" &&
        item !== "grade" &&
        item !== "contractExecution"
      ) {
        newWarningData[item] = appContract.warningData[item];
      } else if (
        item === "unitPrice" ||
        item === "price" ||
        item === "grade" ||
        item === "contractExecution"
      ) {
        addData[item] = appContract.warningData[item];
      }
    }
    if (err) {
      confirm({
        title: "确认通过吗？",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          updateLowGrade({
            ...addData,
            unit: unitData.unit,
            businessMode: businessMode,
            applyId: applyId,
            orderId: orderId,
            contractBasicId: contractBasicId
          }).then(res => {
            if (res.code === 0) {
              if (onId) {
                dispatch({
                  type: "appContract/updateWarning",
                  payload: {
                    ...newWarningData,
                    orderId: orderId,
                    id: onId
                  },
                  callback: (code, msg, data) => {
                    if (code === 0) {
                      dispatch({
                        type: "appContract/submit",
                        payload: {
                          contractId: contractBasicId,
                          roleId: roleId
                        },
                        callback: (code, msg, data) => {
                          if (code === 0) {
                            router.push(
                              `/result?id=${contractBasicId}&status=0&type=contract&isManage=1`
                            );
                          } else {
                            message.error(msg);
                          }
                        }
                      });
                      message.success(msg);
                    } else {
                      message.error(msg);
                    }
                  }
                });
              } else {
                dispatch({
                  type: "appContract/saveWarnings",
                  payload: {
                    ...newWarningData
                  },
                  callback: (code, msg, data) => {
                    if (code === 0) {
                      dispatch({
                        type: "appContract/submit",
                        payload: {
                          contractId: contractBasicId,
                          roleId: roleId
                        },
                        callback: (code, msg, data) => {
                          if (code === 0) {
                            router.push(
                              `/result?id=${contractBasicId}&status=0&type=contract&isManage=1`
                            );
                          } else {
                            message.error(msg);
                          }
                        }
                      });
                      message.success(msg);
                    } else {
                      message.error(msg);
                    }
                  }
                });
              }
            } else {
              message.error(res.msg);
            }
          });
        },
        onCancel() {
          return;
        }
      });
    } else {
      Modal.error({
        title: "风险预警规则未配置!",
        content: "无法通过该订单，请进入合同详情配置",
        okText: "继续"
      });
    }
  };

  refuse = () => {
    this.setState({
      visible: true
    });
  };

  //退回原因填写
  inputChange = e => {
    this.setState({
      refuseReason: e.target.value
    });
  };

  //退回合同
  submitBack = () => {
    const {
      contractBasicId,
      roleId,
      orderId,
      refuseReason,
      path,
      unitData
    } = this.state;
    const { dispatch } = this.props;
    const type = sessionStorage.businessMode;
    if (refuseReason) {
      dispatch({
        type: "appContract/refuse",
        payload: {
          contractId: contractBasicId,
          roleId: roleId,
          refuseReason: refuseReason
        },
        callback: (code, msg, data) => {
          if (code === 0) {
            this.setState(
              {
                visible: false
              },
              () => {
                router.push(
                  `/result?id=${contractBasicId}&status=1&type=contract&isManage=1`
                );
                message.success(msg);
              }
            );
          } else {
            message.error(msg);
          }
        }
      });
    } else {
      message.error("请先填写退回原因！");
    }
  };

  hideModal = () => {
    this.setState({
      visible: false
    });
  };

  //验证判断是否填写
  errChange = err => {
    this.setState({
      err: err
    });
  };

  idChange = haveId => {
    this.setState({
      onId: haveId
    });
  };

  render() {
    const {
      appType,
      orderId,
      contractBasicId,
      right,
      type,
      err,
      unitData
    } = this.state;
    return (
      <Fragment>
        <div className={style.crumb}>
          <Breadcrumb>
            <Breadcrumb.Item>合同详情</Breadcrumb.Item>
          </Breadcrumb>
          <div className={style.btnBox}>
            <Button
              style={{ marginRight: "10px" }}
              disabled={!(appType === "edit" && right)}
              onClick={this.refuse}
            >
              拒绝
            </Button>
            <Button
              type="primary"
              disabled={!(appType === "edit" && right && err)}
              onClick={this.pass}
            >
              通过
            </Button>
          </div>
        </div>
        {
          unitData.unitPrice ? (
            <div className={style.wrap}>
              <Contract
                orderId={orderId}
                contractBasicId={contractBasicId}
                right={appType === "edit" && right}
              />
              {type === "0" || type === "4" ? (
                appType === "edit" && right ? (
                  <PurchaseWarning
                    orderId={orderId}
                    onErr={this.errChange.bind(this)}
                    onId={this.idChange.bind(this)}
                    contractBasicId={contractBasicId}
                    unitData={unitData}
                    type={type}
                  />
                ) : null
              ) : type === "1" ? (
                appType === "edit" && right ? (
                  <SellWarning
                    orderId={orderId}
                    onErr={this.errChange.bind(this)}
                    onId={this.idChange.bind(this)}
                    unitData={unitData}
                    contractBasicId={contractBasicId}
                  />
                ) : null
              ) : appType === "edit" && right ? (
                <StorageWarning
                  orderId={orderId}
                  onErr={this.errChange.bind(this)}
                  onId={this.idChange.bind(this)}
                  unitData={unitData}
                  contractBasicId={contractBasicId}
                />
              ) : null}
            </div>
          ) : null
        }
        <Modal
          title="拒绝原因"
          visible={this.state.visible}
          onOk={this.submitBack}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
        >
          <TextArea autosize={false} onChange={this.inputChange} />
        </Modal>
      </Fragment>
    );
  }
}
export default Index;
