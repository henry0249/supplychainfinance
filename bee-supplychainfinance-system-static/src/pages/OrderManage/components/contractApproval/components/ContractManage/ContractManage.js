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

@connect(({ contract }) => ({
  contract
}))
@Form.create({})
class ContractManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passStyle: {
        color: "green"
      },
      doingStyle: {
        color: "orange"
      },
      stopStyle: {
        color: "red"
      },
      right: false,
      allContracts: [],
      assetData: [],
      status: null,
      appType: "edit",
      path: null
    };
  }
  componentDidMount() {
    this.getContracts();
    const url = location.pathname;
    const pathName = url.substring(0, url.indexOf("/details"));
    this.setState({
      path: pathName
    });
  }
  //获取所有合同并设定相应的权限
  getContracts = () => {
    const { dispatch, orderId } = this.props;
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
              status: data.status
            },
            () => {
              const { status } = this.state;
              const { roleId } = this.props;
              this.setState({
                right:
                  ((status === 0 || status === 2) && roleId === 6) ||
                  ((status === 0 || status === 2) && roleId === 7) ||
                  ((status === 0 || status === 2) && roleId === 13) ||
                  ((status === 0 || status === 2) && roleId === 8)
              });
            }
          );
        } else {
          message.error(msg);
        }
      }
    });
  };
  //跳转到详情页面
  turnTo = (id, appType, status) => {
    const { path } = this.state;
    if (path === "/approval/contract") {
      router.push(
        `/approval/contract/contractDetail?orderId=${
          this.props.orderId
        }&contractBasicId=${id}&appType=${appType}`
      );
    } else {
      router.push(
        `${path}/contract/detail?orderId=${
          this.props.orderId
        }&contractBasicId=${id}&appType=${appType}`
      );
    }
  };
  //跳转到仅查看详情页面
  turnToCheck = (id, status) => {
    const { path } = this.state;
    if (path === "/approval/contract") {
      router.push(
        `/approval/contract/contractDetail?orderId=${
          this.props.orderId
        }&contractBasicId=${id}`
      );
    } else {
      router.push(
        `${path}/contract/detail?orderId=${
          this.props.orderId
        }&contractBasicId=${id}`
      );
    }
  };
  // datepick = current => {
  //   return current && current < moment().endOf("day");
  // };
  render() {
    const {
      right,
      status,
      allContracts,
      passStyle,
      doingStyle,
      stopStyle,
      appType
    } = this.state;
    const { form, orderId, roleId, type } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={style.contentWrap}>
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
                        <span style={{ marginLeft: "10px" }}>
                          (
                          {item.isExamine === 0 ? (
                            <span style={{ ...stopStyle }}>未审批</span>
                          ) : item.isExamine === 1 &&
                            ((item.examineStatus === 0 && roleId === 6) ||
                              (item.examineStatus === 1 && roleId === 7) ||
                              (item.examineStatus === 2 && roleId === 13) ||
                              (item.examineStatus === 3 && roleId === 8)) ? (
                            <span style={{ ...stopStyle }}>未审批</span>
                          ) : item.isExamine === 1 &&
                            ((item.examineStatus > 0 && roleId === 6) ||
                              (item.examineStatus > 1 && roleId === 7) ||
                              (item.examineStatus > 2 && roleId === 13)) ? (
                            <span style={{ ...passStyle }}>已审批</span>
                          ) : item.isExamine === undefined ||
                            (item.isExamine === 1 &&
                              (item.isExamine >= 0 && item.isExamine <= 3)) ? (
                            <span style={{ ...stopStyle }}>未审批</span>
                          ) : (
                            <span style={{ ...passStyle }}>已审批</span>
                          )}
                          )
                        </span>
                      </div>
                    </div>
                    <div className={style.content}>
                      <Row className={style.contentPara}>
                        <Col sm={8} xs={10}>
                          <div className={style.contractCode}>
                            合同编号：<span>{item.number}</span>
                          </div>
                        </Col>
                        <Col sm={8} xs={10} />
                        <Col sm={8} xs={10} />
                      </Row>
                      <Row className={style.contentPara}>
                        <Col sm={8} xs={10}>
                          <div className={style.contractDetail}>
                            签订地点：<span>{item.signAddress}</span>
                          </div>
                        </Col>
                        <Col sm={8} xs={10}>
                          <div className={style.contractDetail}>
                          {item.type === 1||item.type === 4?'甲方（需方）：':'甲方：'}<span>{item.firstParty}</span>
                          </div>
                        </Col>
                        <Col sm={8} xs={10}>
                          <div className={style.contractDetail}>
                          {item.type === 1||item.type === 4?'乙方（供方）：':'乙方：'}<span>{item.secondParty}</span>
                          </div>
                        </Col>
                      </Row>
                      <Row className={style.contentPara}>
                        <Col sm={8} xs={10}>
                          <div className={style.contractDetail}>
                            签订时间：<span>{item.signTime}</span>
                          </div>
                        </Col>
                        {item.type === 1 ||
                        item.type === 4 ||
                        item.type === 5 ? null : (
                          <Col sm={8} xs={10}>
                            <div className={style.contractDetail}>
                              丙方：<span>{item.thirdParty}</span>
                            </div>
                          </Col>
                        )}
                        <Col sm={8} xs={10} />
                      </Row>
                      <Row className={style.contentPara}>
                        <Col sm={8} xs={10} />
                        <Col sm={14} xs={10} />
                        <Col sm={2} xs={10}>
                          {(item.type === 1 || item.type === 4) &&
                          status !== 2 ? null : (item.examineStatus === 0 &&
                              roleId === 6) ||
                            (item.examineStatus === 1 && roleId === 7) ||
                            (item.examineStatus === 2 && roleId === 13) ||
                            (item.examineStatus === 3 && roleId === 8) ? (
                            item.isExamine === 1 ? (
                              <Button
                                type="primary"
                                style={{ float: "right", marginRight: "10px" }}
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
                                  appType,
                                  item.examineStatus
                                )}
                              >
                                进入审批
                              </Button>
                            ) : (
                              <Button
                                type="primary"
                                style={{ float: "right", marginRight: "10px" }}
                                onClick={this.turnToCheck.bind(
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
                                  item.examineStatus
                                )}
                              >
                                查看合同
                              </Button>
                            )
                          ) : (
                            <Button
                              type="primary"
                              style={{ float: "right", marginRight: "10px" }}
                              onClick={this.turnToCheck.bind(
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
                                item.examineStatus
                              )}
                              disabled={
                                !(
                                  item.type === 6 ||
                                  (item.type !== 5 && roleId !== 3)
                                ) ||
                                ((item.type === 1 ||
                                  item.type === 4) &&
                                  roleId === 1)
                              }
                            >
                              查看合同
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </div>
                  </div>
                );
              })
            : null}
        </Card>
      </div>
    );
  }
}
export default ContractManage;
