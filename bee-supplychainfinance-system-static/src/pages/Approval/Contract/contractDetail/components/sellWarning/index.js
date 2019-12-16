import React, { Component, Fragment } from "react";
import style from "../index.less";
import { Form, Checkbox, Input, Row, Col, message } from "antd";
import { connect } from "dva";

@connect(({ appContract }) => ({
  appContract
}))
@Form.create({
  //获取填写的数据
  onValuesChange: (props, changedValues, values) => {
    values["legalRisk"] = 0;
    values["blacklist"] = 0;
    values["businessRisk"] = 0;
    values["litigationRisk"] = 0;

    for (let item in values) {
      if (values[item] === undefined) {
        values[item] = "";
      }
    }
    for (var item in values) {
      if (item === "aDay" && values[item][0] !== "A") {
        values["assetsInvoicesDate"] = "";
      }
      if (item === "bDay" && values[item][0] !== "A") {
        values["assetsFirstPayDate"] = "";
      }
      if (item === "cDay" && values[item][0] !== "A") {
        values["assetsLastPayDate"] = "";
      }
      if (item === "otherWarning") {
        values["otherWarning"] &&
          values["otherWarning"].map(newItem => {
            if (newItem === "A") {
              values["legalRisk"] = 1;
            }
            if (newItem === "B") {
              values["blacklist"] = 1;
            }
            if (newItem === "C") {
              values["businessRisk"] = 1;
            }
            if (newItem === "D") {
              values["litigationRisk"] = 1;
            }
          });
      }
    }
    const { dispatch, orderId, onErr, unitData } = props;
    let err = true;
    let newData = {
      assetsFirstPayDate: "",
      assetsInvoicesDate: "",
      assetsLastPayDate: "",
      blacklist: "",
      businessRisk: "",
      buySettlementDate: "",
      buyerFirstPayDate: "",
      buyerLastPayDate: "",
      entrustFinalInvoicesDate: "",
      // latestDeliveryDate: '',
      legalRisk: "",
      litigationRisk: "",
      saleSettlementDate: "",
      unitPrice: "",
      price: "",
      grade: "",
      contractExecution: ""
    };
    for (var item in newData) {
      newData[item] = values[item];
    }
    if (
      newData["buyerFirstPayDate"] === "" ||
      newData["buyerLastPayDate"] === "" ||
      newData["entrustFinalInvoicesDate"] === "" ||
      newData["saleSettlementDate"] === "" ||
      newData["buySettlementDate"] === "" ||
      newData["unitPrice"] === "" ||
      newData["price"] === "" ||
      newData["contractExecution"] === ""
    ) {
      err = false;
    }
    if (unitData.grade && newData["grade"] === "") {
      err = false;
    }
    if (values.aDay[0] === "A" && values.assetsInvoicesDate === "") {
      err = false;
    }
    if (values.bDay[0] === "A" && values.assetsFirstPayDate === "") {
      err = false;
    }
    if (values.cDay[0] === "A" && values.assetsLastPayDate === "") {
      err = false;
    }
    onErr(err);
    dispatch({
      type: "appContract/setWarningData",
      payload: { ...newData, orderId: orderId }
    });
  }
})
class SellWarning extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const values = this.props.form.getFieldsValue();
    this.getDefaultData();
  }
  //获取预警配置默认数据
  getDefaultData = () => {
    const {
      dispatch,
      orderId,
      contractBasicId,
      onErr,
      onId,
      unitData
    } = this.props;
    dispatch({
      type: "appContract/getWarning",
      payload: {
        orderId: orderId
      },
      callback: (code, msg, data) => {
        if (code === 0) {
          if (data.id === undefined) {
            this.props.form.setFieldsValue({
              ...data
            });
            onErr(false);
            return;
          } else {
            let oldData = data;
            let otherWarning = [];
            let newData = {
              assetsFirstPayDate: "",
              assetsInvoicesDate: "",
              assetsLastPayDate: "",
              buySettlementDate: "",
              buyerFirstPayDate: "",
              buyerLastPayDate: "",
              entrustFinalInvoicesDate: "",
              // latestDeliveryDate: '',
              saleSettlementDate: "",
              otherWarning: [],
              aDay: [],
              bDay: [],
              cDay: []
            };
            for (item in oldData) {
              if (data.id) {
                if (item === "legalRisk" && oldData[item] === 1) {
                  otherWarning.push("A");
                  oldData["otherWarning"] = otherWarning;
                }
                if (item === "blacklist" && oldData[item] === 1) {
                  otherWarning.push("B");
                  oldData["otherWarning"] = otherWarning;
                }
                if (item === "businessRisk" && oldData[item] === 1) {
                  otherWarning.push("C");
                  oldData["otherWarning"] = otherWarning;
                }
                if (item === "litigationRisk" && oldData[item] === 1) {
                  otherWarning.push("D");
                  oldData["otherWarning"] = otherWarning;
                }
              } else {
                oldData["otherWarning"] = ["A", "B", "C", "D"];
              }
            }

            for (var item in newData) {
              newData[item] = oldData[item];
            }
            for (var item in newData) {
              if (newData.assetsInvoicesDate !== undefined) {
                newData.aDay = ["A"];
              }
              if (newData.assetsFirstPayDate !== undefined) {
                newData.bDay = ["A"];
              }
              if (newData.assetsLastPayDate !== undefined) {
                newData.cDay = ["A"];
              }
            }
            let err = true;
            if (
              newData["buyerFirstPayDate"] === "" ||
              newData["buyerLastPayDate"] === "" ||
              newData["entrustFinalInvoicesDate"] === "" ||
              newData["saleSettlementDate"] === "" ||
              newData["buySettlementDate"] === "" ||
              newData["unitPrice"] === "" ||
              newData["price"] === "" ||
              newData["contractExecution"] === ""
            ) {
              err = false;
            }
            onErr(err);
            if (data.id) {
              let haveId = data.id;
              onId(haveId);
            }
            dispatch({
              type: "appContract/setWarningData",
              payload: data
            });
            this.props.form.setFieldsValue({
              ...newData,
              contractExecution: unitData.contractExecution
                ? unitData.contractExecution
                : null,
              grade: unitData.grade ? unitData.grade : null,
              unitPrice: unitData.unitPrice ? unitData.unitPrice : null,
              price: unitData.price ? unitData.price : null
            });
          }
        } else {
          this.props.form.setFieldsValue({
            contractExecution: unitData.contractExecution
              ? unitData.contractExecution
              : null,
            grade: unitData.grade ? unitData.grade : null,
            unitPrice: unitData.unitPrice ? unitData.unitPrice : null,
            price: unitData.price ? unitData.price : null
          });
        }
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { unitData } = this.props;
    return (
      <Fragment>
        <div className={style.warningWrap}>
          <Form>
            <div className={style.priceWrap}>
              <h2>合同实际约定价格</h2>
              <Row>
                <Col>
                  <Form.Item label="委托销售价格">
                    {getFieldDecorator("unitPrice", {
                      initialValue: unitData.unitPrice,
                      rules: [
                        {
                          required: true,
                          message: "超过限定长度，限定长度为20或未输入！",
                          max: 20
                        }
                      ]
                    })(
                      <Input
                        addonBefore="￥"
                        style={{ width: "300px", textAlign: "center" }}
                      />
                    )}
                    <span> / {unitData.unit ? unitData.unit : "元"}</span>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Item label="采购价格">
                    {getFieldDecorator("price", {
                      initialValue: unitData.price,
                      rules: [
                        {
                          required: true,
                          message: "超过限定长度，限定长度为20或未输入！",
                          max: 20
                        }
                      ]
                    })(
                      <Input
                        addonBefore="￥"
                        style={{ width: "300px", textAlign: "center" }}
                      />
                    )}
                    <span> / {unitData.unit ? unitData.unit : "元"}</span>
                  </Form.Item>
                </Col>
              </Row>
              {unitData.grade ? (
                <Row>
                  <Col>
                    <Form.Item label="质量标准">
                      {getFieldDecorator("grade", {
                        initialValue: unitData.grade,
                        rules: [
                          {
                            required: true,
                            message: "超过限定长度，限定长度为10或未输入！",
                            max: 10
                          }
                        ]
                      })(
                        <Input
                          style={{ width: "300px", textAlign: "center" }}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              ) : null}
            </div>
          </Form>
          <Form hideRequiredMark={true} layout="vertical">
            <div className={style.detailWrap}>
              <h2>风控预警/预警/提示配置</h2>
              <div className="warningBox">
                <div className={style.timeWarning}>
                  <div className="timeWarning">
                    <h3>时间状况预警</h3>
                    <h4>付款时间</h4>
                    <Row>
                      <Col span={7}>
                        <span
                          style={{ paddingTop: "5px", display: "inline-block" }}
                        >
                          购货商首次付款时间：
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <div className="warningItem">
                          <span style={{ paddingRight: "45px" }}>
                            资方首次开票之后至约定最晚付款日期前
                          </span>
                          <Form.Item>
                            {getFieldDecorator("buyerFirstPayDate", {
                              require: "true",
                              initialValue: ""
                            })(
                              <Input disabled style={{ textAlign: "center" }} />
                            )}
                          </Form.Item>
                          <span
                            style={{
                              marginLeft: "10px",
                              paddingTop: "5px",
                              display: "inline-block"
                            }}
                          >
                            天
                          </span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <span
                          style={{ paddingTop: "5px", display: "inline-block" }}
                        >
                          购货商后续约定付款时间：
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <div className="warningItem">
                          <span style={{ paddingRight: "17px" }}>
                            资方后续开票之后至后续约定最晚付款日期前
                          </span>
                          <Form.Item>
                            {getFieldDecorator("buyerLastPayDate", {
                              require: "true",
                              initialValue: ""
                            })(
                              <Input disabled style={{ textAlign: "center" }} />
                            )}
                          </Form.Item>
                          <span
                            style={{
                              marginLeft: "10px",
                              paddingTop: "5px",
                              display: "inline-block"
                            }}
                          >
                            天
                          </span>
                        </div>
                      </Col>
                    </Row>
                    <Form.Item label="其他预警">
                      {getFieldDecorator("otherWarning", {
                        require: "true",
                        initialValue: ["A", "B", "C", "D"]
                      })(
                        <Checkbox.Group style={{ width: "100%" }}>
                          <Row>
                            <Col span={6}>
                              <Checkbox value="A">法律风险</Checkbox>
                            </Col>
                            <Col span={6}>
                              <Checkbox value="B">黑名单</Checkbox>
                            </Col>
                            <Col span={6}>
                              <Checkbox value="C">经营风险</Checkbox>
                            </Col>
                            <Col span={6}>
                              <Checkbox value="D">涉诉风险</Checkbox>
                            </Col>
                          </Row>
                        </Checkbox.Group>
                      )}
                    </Form.Item>
                  </div>
                </div>
                <div className={style.sellWarning}>
                  <h2 className={style.warningHeader}>委托销售提示配置</h2>
                  <h3>时间提示</h3>
                  <h4>开票时间</h4>
                  <Row>
                    <Col span={10}>
                      <span
                        style={{ paddingTop: "5px", display: "inline-block" }}
                      >
                        委托企业开尾票时限：
                      </span>
                    </Col>
                    <Col span={14}>
                      <div className="warningItem">
                        <span
                          style={{ paddingRight: "10px", paddingLeft: "28px" }}
                        >
                          结算完成后
                        </span>
                        <Form.Item>
                          {getFieldDecorator("entrustFinalInvoicesDate", {
                            initialValue: "",
                            rules: [
                              {
                                required: true,
                                message: "请输入正整数或未输入！",
                                pattern: new RegExp(/^[1-9][0-9]{0,9}$/, "g")
                              }
                            ]
                          })(<Input style={{ textAlign: "center" }} />)}
                        </Form.Item>
                        <span
                          style={{
                            marginLeft: "10px",
                            paddingTop: "5px",
                            display: "inline-block"
                          }}
                        >
                          天
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={10}>
                      <div className="warningCheckItem">
                        <Form.Item>
                          {getFieldDecorator("aDay", {
                            require: "true",
                            initialValue: ["A"]
                          })(
                            <Checkbox.Group style={{ width: "100%" }}>
                              <Checkbox value="A">资方开票日期</Checkbox>
                            </Checkbox.Group>
                          )}
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={14}>
                      <div className="warningItem">
                        <span
                          style={{ paddingLeft: "28px", paddingRight: "10px" }}
                        >
                          结算完成后
                        </span>
                        <Form.Item>
                          {getFieldDecorator("assetsInvoicesDate", {
                            initialValue: "",
                            rules: [
                              {
                                required: true,
                                message: "请输入正整数或未输入！",
                                pattern: new RegExp(/^[1-9][0-9]{0,9}$/, "g")
                              }
                            ]
                          })(<Input style={{ textAlign: "center" }} />)}
                        </Form.Item>
                        <span
                          style={{
                            marginLeft: "10px",
                            paddingTop: "5px",
                            display: "inline-block"
                          }}
                        >
                          天
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <h4>付款时间</h4>
                  <Row>
                    <Col span={8}>
                      <div className="warningCheckItem">
                        <Form.Item>
                          {getFieldDecorator("bDay", {
                            require: "true",
                            initialValue: ["A"]
                          })(
                            <Checkbox.Group style={{ width: "100%" }}>
                              <Checkbox value="A">资方首次付款日期</Checkbox>
                            </Checkbox.Group>
                          )}
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={1} />
                    <Col span={14}>
                      <div className="warningItem">
                        <span
                          style={{ paddingLeft: "25px", paddingRight: "10px" }}
                        >
                          委托企业开票后
                        </span>
                        <Form.Item>
                          {getFieldDecorator("assetsFirstPayDate", {
                            initialValue: "",
                            rules: [
                              {
                                required: true,
                                message: "请输入正整数或未输入！",
                                pattern: new RegExp(/^[1-9][0-9]{0,9}$/, "g")
                              }
                            ]
                          })(<Input style={{ textAlign: "center" }} />)}
                        </Form.Item>
                        <span
                          style={{
                            marginLeft: "10px",
                            paddingTop: "5px",
                            display: "inline-block"
                          }}
                        >
                          天
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <div className="warningCheckItem">
                        <Form.Item>
                          {getFieldDecorator("cDay", {
                            require: "true",
                            initialValue: ["A"]
                          })(
                            <Checkbox.Group style={{ width: "100%" }}>
                              <Checkbox value="A">资方尾款付款日期</Checkbox>
                            </Checkbox.Group>
                          )}
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={1} />
                    <Col span={14}>
                      <div className="warningItem">
                        <span
                          style={{ paddingLeft: "25px", paddingRight: "10px" }}
                        >
                          委托企业开票后
                        </span>
                        <Form.Item>
                          {getFieldDecorator("assetsLastPayDate", {
                            initialValue: "",
                            rules: [
                              {
                                required: true,
                                message: "请输入正整数或未输入！",
                                pattern: new RegExp(/^[1-9][0-9]{0,9}$/, "g")
                              }
                            ]
                          })(<Input style={{ textAlign: "center" }} />)}
                        </Form.Item>
                        <span
                          style={{
                            marginLeft: "10px",
                            paddingTop: "5px",
                            display: "inline-block"
                          }}
                        >
                          天
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <h4>结算时间</h4>
                  <Row>
                    <Col span={7}>
                      <span
                        style={{ paddingTop: "5px", display: "inline-block" }}
                      >
                        汇总销售结算日期：
                      </span>
                    </Col>
                    <Col span={15}>
                      <div className="warningItem">
                        <span
                          style={{ paddingRight: "10px", paddingLeft: "17px" }}
                        >
                          委托企业完成全部发货后
                        </span>
                        <Form.Item>
                          {getFieldDecorator("saleSettlementDate", {
                            require: "true",
                            initialValue: ""
                          })(
                            <Input disabled style={{ textAlign: "center" }} />
                          )}
                        </Form.Item>
                        <span
                          style={{
                            marginLeft: "10px",
                            paddingTop: "5px",
                            display: "inline-block"
                          }}
                        >
                          个工作日
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={10}>
                      <span
                        style={{ paddingTop: "5px", display: "inline-block" }}
                      >
                        采购结算日期：
                      </span>
                    </Col>
                    <Col span={14}>
                      <div className="warningItem">
                        <span
                          style={{ paddingRight: "10px", paddingLeft: "2px" }}
                        >
                          购货商付尾款后
                        </span>
                        <Form.Item>
                          {getFieldDecorator("buySettlementDate", {
                            require: "true",
                            initialValue: ""
                          })(
                            <Input disabled style={{ textAlign: "center" }} />
                          )}
                        </Form.Item>
                        <span
                          style={{
                            marginLeft: "10px",
                            paddingTop: "5px",
                            display: "inline-block"
                          }}
                        >
                          个工作日
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <h4>截止时间</h4>
                  <Row>
                    <Col span={11}>
                      <span
                        style={{ paddingTop: "5px", display: "inline-block" }}
                      >
                        合同截止时间：
                        </span>
                    </Col>
                    <Col span={13}>
                      <div className="warningItem specialWarningItem">
                        <span
                          style={{
                            paddingTop: "5px",
                            paddingRight: "10px",
                            paddingLeft: '7px',
                            display: "inline-block"
                          }}
                        >
                          合同签订后
                        </span>
                        <Form.Item layout="inline">
                          {getFieldDecorator("contractExecution", {
                            initialValue: unitData.contractExecution,
                            rules: [
                              {
                                required: true,
                                message: "请输入正整数或未输入！",
                                pattern: new RegExp(/^[1-9][0-9]{0,9}$/, "g")
                              }
                            ]
                          })(
                            <Input
                              style={{ textAlign: "center" }}
                            />
                          )}
                        </Form.Item>
                        <span
                          style={{
                            marginLeft: "10px",
                            paddingTop: "5px",
                            display: "inline-block"
                          }}
                        >
                          天
                        </span>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className={style.storageWarning} />
              </div>
            </div>
          </Form>
        </div>
      </Fragment>
    );
  }
}
export default SellWarning;
