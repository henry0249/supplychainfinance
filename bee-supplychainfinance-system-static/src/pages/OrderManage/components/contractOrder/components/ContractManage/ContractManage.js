import React, { Component } from "react";
import {
  Card,
  Col,
  Row,
  Button,
  Popconfirm,
  Form,
  Input,
  DatePicker,
  message
} from "antd";
import style from "../index.less";
import router from "umi/router";
import moment from "moment";
import { connect } from "dva";

@connect(({ contract, global }) => ({
  contract,
  global
}))
@Form.create({
  //获取所填写的输入框的值并进行处理
  onValuesChange: (props, changedValues, values) => {
    for (let item in values) {
      if (values[item] === undefined) {
        values[item] = "";
      }
    }
    const { dispatch } = props;
    let newData = [];
    let index = 0;
    let arr = null;
    let exampleItem = {
      firstParty: "",
      number: "",
      secondParty: "",
      signAddress: "",
      signTime: "",
      thirdParty: ""
    };
    for (var item in exampleItem) {
      for (var valueItem in values) {
        let newItem = {};
        let keyItem = valueItem.indexOf(item);
        if (keyItem >= 0) {
          newItem[item] = values[valueItem];
          index = Number((arr = valueItem.replace(item, "")));
          newData[index] = { ...newData[index], ...newItem };
        }
      }
    }
    dispatch({
      type: "contract/setContractData",
      payload: newData
    });
  }
})
class ContractManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      right: false,
      allContracts: [],
      assetData: [],
      status: null,
      userCompanyName: null,
      confirmStatus: [],
      firstRight: false,
      secondRight: false,
      thirdRight: false,
      fourthRight: false,
      fifthRight: false,
      sixthRight: false,
      seventhRight: false,
      eighthRight: false
    };
  }

  componentDidMount() {
    this.getContracts();
  }
  //获取基本合同并进行相应权限设置
  getContracts = () => {
    const { dispatch, orderId, roleId, getReason } = this.props;
    dispatch({
      type: "contract/getAllContracts",
      payload: {
        buyOrdersId: orderId
      },
      callback: (code, msg, data) => {
        if (code === 0) {
          this.setState(
            {
              allContracts: data.contracts,
              status: data.status,
              userCompanyName: this.props.global.user.companyName
            },
            () => {
              const { allContracts, userCompanyName } = this.state;
              let newData = [].concat(allContracts);
              newData.map(item => {
                for (var newItem in item) {
                  if (newItem === "signTime") {
                    item[newItem] = item["signTime"].slice(0, 10);
                  }
                }
              });
              let contractId = null;
              let newStatus = [];
              const num = 0;
              allContracts.map((item, index) => {
                if (item.refuseReason) {
                  getReason(item.refuseReason);
                }
                if (item.type === 0 || item.type === 2 || item.type === 3) {
                  this.setState({
                    right: roleId !== 3
                  });
                } else if (item.type === 1 || item.type === 4) {
                  this.setState({
                    firstRight: roleId !== 3 && roleId !== 1
                  });
                } else if (item.type === 5) {
                  this.setState({
                    secondRight: roleId !== 3
                  });
                } else {
                  this.setState({
                    thirdRight: true
                  });
                }
                if (item.type === 0 || item.type === 3) {
                  this.setState({
                    fourthRight: roleId === 1 || roleId === 4
                  });
                } else if (item.type === 1 || item.type === 4) {
                  this.setState({
                    fifthRight: roleId === 2 || roleId === 4
                  });
                } else if (item.type === 2) {
                  this.setState({
                    sixthRight: roleId === 1 || roleId === 4 || roleId === 6
                  });
                } else if (item.type === 5) {
                  this.setState({
                    seventhRight: roleId === 1 || roleId === 4
                  });
                } else {
                  this.setState({
                    eighthRight: roleId === 1 || roleId === 4 || roleId === 3
                  });
                }
                if (
                  item.buyContractBasicId ||
                  item.saleContractBasicId ||
                  item.storageContractBasicId
                ) {
                  contractId =
                    item.buyContractBasicId ||
                    item.saleContractBasicId ||
                    item.storageContractBasicId;
                  dispatch({
                    type: "contract/getStatus",
                    payload: {
                      buyContractBasicId: contractId,
                      userCompanyName: userCompanyName,
                      roleId: Number(roleId)
                    },
                    callback: (code, msg, data) => {
                      if (code === 0) {
                        newStatus[index] = data.confirmStatus;
                        this.setState({
                          confirmStatus: newStatus
                        });
                      } else {
                        newStatus[index] = num;
                        this.setState({
                          confirmStatus: newStatus
                        });
                      }
                    }
                  });
                } else {
                  newStatus[index] = num;
                  this.setState({
                    confirmStatus: newStatus
                  });
                }
              });
              this.setState({
                allContracts: newData
              });
            }
          );
        } else {
          message.error(msg);
        }
      }
    });
  };
  //跳转到合同详情页
  turnTo = (id, status, type) => {
    router.push(
      `/orderManage/contract/detail?orderId=${
      this.props.orderId
      }&contractBasicId=${id}&status=${status}&contractType=${type}`
    );
  };
  //点击编辑触发编辑
  changeEdit = index => {
    let newItem = [].concat(this.state.assetData);
    if (newItem[index] === index + 1) {
      newItem[index] = index + 2;
    } else {
      newItem[index] = index + 1;
    }
    this.setState(
      {
        assetData: newItem
      },
      () => {
        const { dispatch } = this.props;
        let values = this.props.form.getFieldsValue();
        let newData = [];
        let index = 0;
        let arr = null;
        let exampleItem = {
          firstParty: "",
          number: "",
          secondParty: "",
          signAddress: "",
          signTime: "",
          thirdParty: ""
        };
        for (var item in exampleItem) {
          for (var valueItem in values) {
            let newItem = {};
            let keyItem = valueItem.indexOf(item);
            if (keyItem >= 0) {
              newItem[item] = values[valueItem];
              index = Number((arr = valueItem.replace(item, "")));
              newData[index] = { ...newData[index], ...newItem };
            }
          }
        }
        dispatch({
          type: "contract/setContractData",
          payload: newData
        });
      }
    );
  };
  //删除合同相关信息
  delete = id => {
    const { dispatch, type } = this.props;
    switch (type) {
      case "0":
        dispatch({
          type: "contract/deleteContract",
          payload: {
            buyContractBasicId: id
          },
          callback: (code, msg, data) => {
            if (code === 0) {
              this.getContracts();
              message.success(msg);
            } else {
              message.error(msg);
            }
          }
        });
        break;
      case "1":
        dispatch({
          type: "contract/deleteContract",
          payload: {
            saleContractBasicId: id
          },
          callback: (code, msg, data) => {
            if (code === 0) {
              this.getContracts();
              message.success(msg);
            } else {
              message.error(msg);
            }
          }
        });
        break;
      case "2":
        dispatch({
          type: "contract/deleteContract",
          payload: {
            storageContractBasicId: id
          },
          callback: (code, msg, data) => {
            if (code === 0) {
              this.getContracts();
              message.success(msg);
            } else {
              message.error(msg);
            }
          }
        });
      case "4":
        dispatch({
          type: "contract/deleteContract",
          payload: {
            largeBuyContractBasicId: id
          },
          callback: (code, msg, data) => {
            if (code === 0) {
              this.getContracts();
              message.success(msg);
            } else {
              message.error(msg);
            }
          }
        });
        break;
      default:
        break;
    }
  };
  //保存合同相关信息
  saveContract = (index, id, contractType, orderId) => {
    const { dispatch, type } = this.props;
    const values = this.props.contract.contractData[index];
    let err = true;
    for (var item in values) {
      if (
        values[item] === "" ||
        values[item] === null ||
        values["firstParty"] === values["secondParty"] ||
        values["firstParty"] === values["thirdParty"] ||
        values["secondParty"] === values["thirdParty"]
      ) {
        err = false;
      }
    }
    if (err) {
      switch (type) {
        case "0":
          dispatch({
            type: "contract/createNewContract",
            payload: {
              ...this.props.contract.contractData[index],
              buyContractBasicId: id,
              buyOrdersId: orderId,
              type: contractType
            },
            callback: (code, msg, data) => {
              if (code === 0) {
                this.getContracts();
                this.setState({
                  assetData: []
                });
                message.success(msg);
              } else {
                message.error(msg);
              }
            }
          });
          break;
        case "1":
          dispatch({
            type: "contract/createNewContract",
            payload: {
              ...this.props.contract.contractData[index],
              saleContractBasicId: id,
              saleOrdersId: orderId,
              type: contractType
            },
            callback: (code, msg, data) => {
              if (code === 0) {
                this.getContracts();
                this.setState({
                  assetData: []
                });
                message.success(msg);
              } else {
                message.error(msg);
              }
            }
          });
          break;
        case "2":
          dispatch({
            type: "contract/createNewContract",
            payload: {
              ...this.props.contract.contractData[index],
              storageContractBasicId: id,
              storageOrdersId: orderId,
              type: contractType
            },
            callback: (code, msg, data) => {
              if (code === 0) {
                this.getContracts();
                this.setState({
                  assetData: []
                });
                message.success(msg);
              } else {
                message.error(msg);
              }
            }
          });
          break;
        case "4":
          dispatch({
            type: "contract/createNewContract",
            payload: {
              ...this.props.contract.contractData[index],
              largeBuyContractBasicId: id,
              largeBuyOrdersId: orderId,
              type: contractType
            },
            callback: (code, msg, data) => {
              if (code === 0) {
                this.getContracts();
                this.setState({
                  assetData: []
                });
                message.success(msg);
              } else {
                message.error(msg);
              }
            }
          });
          break;
        default:
          break;
      }
      this.changeEdit(index);
    } else {
      message.error("请填写完整并且正确！");
    }
  };
  // datepick = current => {
  //   return current && current < moment().endOf("day");
  // };
  render() {
    const {
      assetData,
      right,
      allContracts,
      status,
      confirmStatus,
      firstRight,
      secondRight,
      thirdRight,
      fourthRight,
      fifthRight,
      sixthRight,
      seventhRight,
      eighthRight
    } = this.state;
    const { form, orderId, type, roleId } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={style.contentWrap}>
        <div className="contractContent">
          <Card title="合同管理" headStyle={{ fontWeight: "600" }}>
            {allContracts[0]
              ? allContracts.map((item, index) => {
                return (
                  <div
                    key={index + "buyContractBasicId"}
                    className={style.contractItem}
                  >
                    <div className={style.itemHeader}>
                      <div>
                        {type === "0" || type === "4"
                          ? item.type === 0
                            ? "定向委托采购合同"
                            : item.type === 1
                              ? "采购合同"
                              : "平台服务协议"
                          : type === "1"
                            ? item.type === 3
                              ? "委托定向销售合同"
                              : item.type === 4
                                ? "销售合同"
                                : "平台服务协议"
                            : item.type === 5
                              ? "借款质押协议"
                              : "质押货物仓储监管合作协议"}
                      </div>
                      {(((item.type === 0 || item.type === 3) &&
                        roleId === 4) ||
                        (item.type === 2 && roleId === 4) ||
                        ((item.type === 1 || item.type === 4) &&
                          roleId === 4) ||
                        (item.type === 5 && roleId === 4) ||
                        (item.type === 6 && roleId === 4)) &&
                        confirmStatus[index] === 0 ? (
                          assetData[index] && assetData[index] === index + 1 ? (
                            <div className={style.editTitle}>
                              <span
                                onClick={this.saveContract.bind(
                                  this,
                                  index,
                                  item
                                    ? type === "0"
                                      ? item.buyContractBasicId
                                      : type === "1"
                                        ? item.saleContractBasicId
                                        : type === "2"
                                          ? item.storageContractBasicId
                                          : item.largeBuyContractBasicId
                                    : null,
                                  item.type,
                                  orderId
                                )}
                              >
                                保存
                              </span>
                              <span onClick={this.changeEdit.bind(this, index)}>
                                取消
                              </span>
                            </div>
                          ) : (item.type === 1 || item.type === 4) &&
                            item.confirmStatus !== 9 ? (
                                status === 2 ? (
                                  <div className={style.editTitle}>
                                    <span
                                      onClick={this.changeEdit.bind(this, index)}
                                    >
                                      编辑
                                </span>
                                    <Popconfirm
                                      placement="top"
                                      title="确认删除该合同吗?"
                                      onConfirm={this.delete.bind(
                                        this,
                                        item
                                          ? type === "0"
                                            ? item.buyContractBasicId
                                            : type === "1"
                                              ? item.saleContractBasicId
                                              : type === "2"
                                                ? item.storageContractBasicId
                                                : item.largeBuyContractBasicId
                                          : null
                                      )}
                                      okText="确认"
                                      cancelText="取消"
                                    >
                                      <span>删除</span>
                                    </Popconfirm>
                                  </div>
                                ) : null
                              ) : (item.type !== 1 || item.type !== 4) &&
                                item.confirmStatus !== 9 ? (
                                  <div className={style.editTitle}>
                                    <span onClick={this.changeEdit.bind(this, index)}>
                                      编辑
                              </span>
                                    <Popconfirm
                                      placement="top"
                                      title="确认删除该合同吗?"
                                      onConfirm={this.delete.bind(
                                        this,
                                        item
                                          ? type === "0"
                                            ? item.buyContractBasicId
                                            : type === "1"
                                              ? item.saleContractBasicId
                                              : type === "2"
                                                ? item.storageContractBasicId
                                                : item.largeBuyContractBasicId
                                          : null
                                      )}
                                      okText="确认"
                                      cancelText="取消"
                                    >
                                      <span>删除</span>
                                    </Popconfirm>
                                  </div>
                                ) : null
                        ) : null}
                    </div>
                    <div className={style.content}>
                      <Form hideRequiredMark={true} layout="inline">
                        <Row className={style.contentPara}>
                          <Col sm={8} xs={10}>
                            {assetData[index] &&
                              assetData[index] === index + 1 ? (
                                <Form.Item label="合同编号">
                                  {getFieldDecorator(`number${index}`, {
                                    initialValue: item.number
                                      ? item.number
                                      : "",
                                    require: true,
                                    rules: [
                                      {
                                        required: true,
                                        message:
                                          "请输入正确的合同编号，最长不超过255字符或未输入！",
                                        max: 255
                                      }
                                    ]
                                  })(
                                    <Input
                                      style={{ width: "150%" }}
                                      placeholder="请输入"
                                    />
                                  )}
                                </Form.Item>
                              ) : (
                                <div className={style.contractCode}>
                                  合同编号：<span>{item.number}</span>
                                </div>
                              )}
                          </Col>
                          <Col sm={8} xs={10} />
                          <Col sm={8} xs={10} />
                        </Row>
                        <Row className={style.contentPara}>
                          <Col sm={8} xs={10}>
                            {assetData[index] &&
                              assetData[index] === index + 1 ? (
                                <Form.Item label="签订地点">
                                  {getFieldDecorator(`signAddress${index}`, {
                                    initialValue: item.signAddress
                                      ? item.signAddress
                                      : "",
                                    require: true,
                                    rules: [
                                      {
                                        required: true,
                                        message:
                                          "请输入正确的签订地点，最长不超过255字符或未输入！",
                                        max: 255
                                      }
                                    ]
                                  })(
                                    <Input
                                      style={{ width: "150%" }}
                                      placeholder="请输入"
                                    />
                                  )}
                                </Form.Item>
                              ) : (
                                <div className={style.contractDetail}>
                                  签订地点：<span>{item.signAddress}</span>
                                </div>
                              )}
                          </Col>
                          <Col sm={8} xs={10}>
                            {assetData[index] &&
                              assetData[index] === index + 1 ? (
                                <Form.Item label={item.type === 1 || item.type === 4 ? '甲方(需方)' : '甲方'}>
                                  {getFieldDecorator(`firstParty${index}`, {
                                    initialValue: item.firstParty
                                      ? item.firstParty
                                      : "",
                                    require: true,
                                    rules: [
                                      {
                                        required: true,
                                        message:
                                          "请输入正确的甲方，最长不超过255字符或未输入！",
                                        max: 255
                                      }
                                    ]
                                  })(
                                    <Input
                                      style={{ width: "150%" }}
                                      placeholder="请输入"
                                    />
                                  )}
                                </Form.Item>
                              ) : (
                                <div className={style.contractDetail}>
                                  {item.type === 1 || item.type === 4 ? '甲方(需方)：' : '甲方：'}<span>{item.firstParty}</span>
                                </div>
                              )}
                          </Col>
                          <Col sm={8} xs={10}>
                            {assetData[index] &&
                              assetData[index] === index + 1 ? (
                                <Form.Item label={item.type === 1 || item.type === 4 ? '乙方(供方)' : '乙方'}>
                                  {getFieldDecorator(`secondParty${index}`, {
                                    initialValue: item.secondParty
                                      ? item.secondParty
                                      : "",
                                    require: true,
                                    rules: [
                                      {
                                        required: true,
                                        message:
                                          "请输入正确的乙方，最长不超过255字符或未输入！",
                                        max: 255
                                      }
                                    ]
                                  })(
                                    <Input
                                      style={{ width: "150%" }}
                                      placeholder="请输入"
                                    />
                                  )}
                                </Form.Item>
                              ) : (
                                <div className={style.contractDetail}>
                                  {item.type === 1 || item.type === 4 ? '乙方(供方)：' : '乙方：'}<span>{item.secondParty}</span>
                                </div>
                              )}
                          </Col>
                        </Row>
                        <Row className={style.contentPara}>
                          <Col sm={8} xs={10}>
                            {assetData[index] &&
                              assetData[index] === index + 1 ? (
                                <Form.Item label="签订时间">
                                  {getFieldDecorator(`signTime${index}`, {
                                    initialValue: item.signTime
                                      ? moment(item.signTime)
                                      : null,
                                    require: true,
                                    rules: [
                                      {
                                        required: true,
                                        message:
                                          "请输入正确的签订时间，最长不超过255字符或未输入！"
                                      }
                                    ]
                                  })(
                                    <DatePicker
                                      allowClear={false}
                                      // format="YYYY-MM-DD"
                                      disabledDate={this.datepick}
                                      placeholder="请选择"
                                      style={{ width: "150%" }}
                                    />
                                  )}
                                </Form.Item>
                              ) : (
                                <div className={style.contractDetail}>
                                  签订时间：<span>{item.signTime}</span>
                                </div>
                              )}
                          </Col>
                          {item.type === 1 ||
                            item.type === 4 ||
                            item.type === 5 ? null : (
                              <Col sm={8} xs={10}>
                                {assetData[index] &&
                                  assetData[index] === index + 1 ? (
                                    <Form.Item label="丙方">
                                      {getFieldDecorator(`thirdParty${index}`, {
                                        initialValue: item.thirdParty
                                          ? item.thirdParty
                                          : "",
                                        require: true,
                                        rules: [
                                          {
                                            required: true,
                                            message:
                                              "请输入正确的丙方，最长不超过255字符或未输入！",
                                            max: 255
                                          }
                                        ]
                                      })(
                                        <Input
                                          style={{ width: "150%" }}
                                          placeholder="请输入"
                                        />
                                      )}
                                    </Form.Item>
                                  ) : (
                                    <div className={style.contractDetail}>
                                      丙方：<span>{item.thirdParty}</span>
                                    </div>
                                  )}
                              </Col>
                            )}

                          <Col sm={8} xs={10} />
                        </Row>
                        <Row className={style.contentPara}>
                          <Col sm={8} xs={10} />
                          <Col sm={14} xs={10} />
                          <Col sm={2} xs={10}>
                            <Button
                              type="primary"
                              style={{ float: "right", marginRight: "10px" }}
                              disabled={
                                (!(item
                                  ? type === "0"
                                    ? item.buyContractBasicId
                                    : type === "1"
                                      ? item.saleContractBasicId
                                      : type === "2"
                                        ? item.storageContractBasicId
                                        : item.largeBuyContractBasicId
                                  : null) ||
                                  !(
                                    ((item.type === 0 ||
                                      item.type === 2 ||
                                      item.type === 3) &&
                                      right) ||
                                    ((item.type === 1 || item.type === 4) &&
                                      firstRight) ||
                                    (item.type === 5 && secondRight) ||
                                    (item.type === 6 && thirdRight)
                                  ))
                              }
                              onClick={this.turnTo.bind(
                                this,
                                item
                                  ? type === "0"
                                    ? item.buyContractBasicId
                                    : type === "1"
                                      ? item.saleContractBasicId
                                      : type === "2"
                                        ? item.storageContractBasicId
                                        : item.largeBuyContractBasicId
                                  : null,
                                item.confirmStatus,
                                item.type
                              )}
                            >
                              查看详情
                              </Button>
                          </Col>
                        </Row>
                      </Form>
                    </div>
                  </div>
                );
              })
              : null}
          </Card>
        </div>
      </div>
    );
  }
}
export default ContractManage;
