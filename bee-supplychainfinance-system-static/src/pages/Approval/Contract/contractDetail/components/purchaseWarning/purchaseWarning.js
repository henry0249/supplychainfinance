import React, { Component, Fragment } from "react";
import style from "../index.less";
import { Form, Checkbox, Input, Row, Col } from "antd";
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
    if (props.type === "4") {
      for (var item in values) {
        if (item === "giveClearDay" && values[item][0] !== "A") {
          values["assetsNvoiceDeadline"] = "";
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
        assetsNvoiceDeadline: "",
        assetsPayDate: "",
        blacklist: "",
        businessRisk: "",
        goodsWarningLine: "",
        legalRisk: "",
        litigationRisk: "",
        unitPrice: "",
        price: "",
        grade: "",
        contractExecution: ""
      };
      for (var item in newData) {
        newData[item] = values[item];
      }
      if (
        newData["assetsPayDate"] === "" ||
        newData["unitPrice"] === "" ||
        newData["price"] === "" ||
        newData["contractExecution"] === ""
      ) {
        err = false;
      }
      if (unitData.grade && newData["grade"] === "") {
        err = false;
      }
      if (
        values.giveClearDay[0] === "A" &&
        values.assetsNvoiceDeadline === ""
      ) {
        err = false;
      }
      if (values.priceWarning[0] === "A" && values.goodsWarningLine === "") {
        err = false;
      }
      onErr(err);
      dispatch({
        type: "appContract/setWarningData",
        payload: { ...newData, orderId: orderId }
      });
    } else {
      for (var item in values) {
        if (item === "clearDay" && values[item][0] !== "A") {
          values["supplierNvoiceDeadline"] = "";
        }
        if (item === "giveClearDay" && values[item][0] !== "A") {
          values["assetsNvoiceDeadline"] = "";
        }
        if (item === "getDay" && values[item][0] !== "A") {
          values["countdownTake"] = "";
          values["delayCountdownTake"] = "";
        }
        if (item === "priceWarning" && values[item][0] !== "A") {
          values["goodsWarningLine"] = "";
        }
        if (item === "deliveryDate" && values[item][0] === "A") {
          values["deliveryDate"] = 1;
        } else if (item === "deliveryDate" && values[item][0] !== "A") {
          values["deliveryDate"] = 0;
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
        assetsNvoiceDeadline: "",
        assetsPayDate: "",
        blacklist: "",
        businessRisk: "",
        buySettlementDate: "",
        countdownTake: "",
        delayCountdownTake: "",
        deliveryDate: "",
        goodsWarningLine: "",
        legalRisk: "",
        litigationRisk: "",
        saleSettlementDate: "",
        supplierNvoiceDeadline: "",
        unitPrice: "",
        price: "",
        grade: ""
      };
      for (var item in newData) {
        newData[item] = values[item];
      }
      if (
        newData["assetsPayDate"] === "" ||
        newData["buySettlementDate"] === "" ||
        newData["saleSettlementDate"] === "" ||
        newData["unitPrice"] === "" ||
        newData["price"] === ""
      ) {
        err = false;
      }
      if (unitData.grade && newData["grade"] === "") {
        err = false;
      }
      if (values.clearDay[0] === "A" && values.supplierNvoiceDeadline === "") {
        err = false;
      }
      if (
        values.giveClearDay[0] === "A" &&
        values.assetsNvoiceDeadline === ""
      ) {
        err = false;
      }
      if (
        values.getDay[0] === "A" &&
        (values.countdownTake === "" || values.delayCountdownTake === "")
      ) {
        err = false;
      }
      if (values.priceWarning[0] === "A" && values.goodsWarningLine === "") {
        err = false;
      }
      onErr(err);
      dispatch({
        type: "appContract/setWarningData",
        payload: { ...newData, orderId: orderId }
      });
    }
  }
})
class PurchaseWarning extends Component {
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
      unitData,
      type
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
              assetsNvoiceDeadline: "",
              assetsPayDate: "",
              blacklist: "",
              businessRisk: "",
              buySettlementDate: "",
              countdownTake: "",
              delayCountdownTake: "",
              deliveryDate: "",
              goodsWarningLine: "",
              legalRisk: "",
              litigationRisk: "",
              otherWarning: "",
              saleSettlementDate: "",
              supplierNvoiceDeadline: "",
              clearDay: [],
              giveClearDay: [],
              getDay: [],
              priceWarning: []
            };
            if (type === "4") {
              newData = {
                assetsNvoiceDeadline: "",
                assetsPayDate: "",
                blacklist: "",
                businessRisk: "",
                goodsWarningLine: "",
                legalRisk: "",
                litigationRisk: "",
                unitPrice: "",
                price: "",
                grade: "",
                giveClearDay: [],
                otherWarning: ""
              };
            }
            for (item in oldData) {
              if (data.id) {
                if (item === "deliveryDate" && oldData[item] === 1) {
                  oldData[item] = ["A"];
                } else if (item === "deliveryDate" && oldData[item] === 0) {
                  oldData[item] = [];
                }
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
                oldData["deliveryDate"] = ["A"];
              }
            }

            for (var item in newData) {
              newData[item] = oldData[item];
            }
            for (var item in newData) {
              if (newData.supplierNvoiceDeadline !== undefined) {
                newData.clearDay = ["A"];
              }
              if (newData.assetsNvoiceDeadline !== undefined) {
                newData.giveClearDay = ["A"];
              }
              if (
                newData.countdownTake !== undefined ||
                newData.delayCountdownTake !== undefined
              ) {
                newData.getDay = ["A"];
              }
              if (newData.goodsWarningLine !== undefined) {
                newData.priceWarning = ["A"];
              }
            }
            let err = true;
            if (type === "4") {
              if (
                newData["assetsPayDate"] === "" ||
                newData["unitPrice"] === "" ||
                newData["price"] === "" ||
                newData["contractExecution"] === ""
              ) {
                err = false;
              }
            } else {
              if (
                newData["assetsPayDate"] === "" ||
                newData["buySettlementDate"] === "" ||
                newData["saleSettlementDate"] === ""
              ) {
                err = false;
              }
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
              unit: unitData.unit ? unitData.unit : null,
              grade: unitData.grade ? unitData.grade : null,
              unitPrice: unitData.unitPrice ? unitData.unitPrice : null,
              price: unitData.price ? unitData.price : null,
              contractExecution: unitData.contractExecution
                ? unitData.contractExecution
                : null
            });
          }
        } else {
          this.props.form.setFieldsValue({
            unit: unitData.unit ? unitData.unit : null,
            grade: unitData.grade ? unitData.grade : null,
            unitPrice: unitData.unitPrice ? unitData.unitPrice : null,
            price: unitData.price ? unitData.price : null,
            contractExecution: unitData.contractExecution
              ? unitData.contractExecution
              : null
          });
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { unitData, type } = this.props;
    return (
      <Fragment>
        <div className={style.warningWrap}>
          <Form>
            <div className={style.priceWrap}>
              <h2>合同实际约定价格</h2>
              <Row>
                <Col>
                  <Form.Item label='委托采购价格'>
                    {getFieldDecorator("unitPrice", {
                      initialValue: unitData.unitPrice,
                      rules: [
                        {
                          required: true,
                          max: 20,
                          message: "超过限定长度，限定长度为20或未输入！"
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
                  <Form.Item label='销售价格'>
                    {getFieldDecorator("price", {
                      initialValue: unitData.price,
                      rules: [
                        {
                          required: true,
                          max: 20,
                          message: "超过限定长度，限定长度为20或未输入！"
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
              {type === "4" ? (
                <div className="warningBox">
                  <div className={style.timeWarning}>
                    <div className="timeWarning">
                      <h3>时间预警</h3>
                      <h4>开票时间</h4>
                      <Row>
                        <Col span={7}>
                          <div className="warningCheckItem">
                            <Form.Item>
                              {getFieldDecorator("giveClearDay", {
                                require: "true",
                                initialValue: ["A"]
                              })(
                                <Checkbox.Group style={{ width: "100%" }}>
                                  <Checkbox value="A">资方开票时限：</Checkbox>
                                </Checkbox.Group>
                              )}
                            </Form.Item>
                          </div>
                        </Col>
                        <Col span={2} />
                        <Col span={15}>
                          <div className="warningItem">
                            <span style={{ paddingRight: "10px" }}>
                              结算后
                            </span>
                            <Form.Item>
                              {getFieldDecorator("assetsNvoiceDeadline", {
                                initialValue: "",
                                rules: [
                                  {
                                    required: true,
                                    message:
                                      "请输入不超过十位的正整数或未输入！",
                                    pattern: new RegExp(
                                      /^[1-9][0-9]{0,9}$/,
                                      "g"
                                    )
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
                      <Form.Item label="货值预警">
                        {getFieldDecorator("priceWarning", {
                          require: "true",
                          initialValue: ["A"]
                        })(
                          <Checkbox.Group style={{ width: "100%" }}>
                            <Row>
                              {/* <Col span={6}>
                            <Checkbox value="A">初始货值</Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox value="B">初始保证金</Checkbox>
                          </Col> */}
                              <Col span={6}>
                                <Checkbox value="A">当日货值价格</Checkbox>
                              </Col>
                              <Col span={6} />
                            </Row>
                          </Checkbox.Group>
                        )}
                      </Form.Item>
                      <Row>
                        <Col span={11}>
                          <div className="warningItem specialWarningItem">
                            <span
                              style={{
                                paddingTop: "5px",
                                display: "inline-block"
                              }}
                            >
                              警戒线：
                            </span>
                            <Form.Item layout="inline">
                              {getFieldDecorator("goodsWarningLine", {
                                initialValue: "",
                                rules: [
                                  {
                                    required: true,
                                    message:
                                      "超过限定长度，限定长度为12或未输入！",
                                    max: 12
                                    // pattern: new RegExp(
                                    //   /^(?:0\.\d{0,3}|[1-9][0-9]{0,9}|[1-9][0-9]{1,7}\.\d{1,2})$/,
                                    //   "g"
                                    // )
                                  }
                                ]
                              })(
                                <Input
                                  style={{
                                    width: "150px",
                                    textAlign: "center"
                                  }}
                                />
                              )}
                            </Form.Item>
                            <span
                              style={{
                                marginLeft: "90px",
                                paddingTop: "5px",
                                display: "inline-block"
                              }}
                            >
                              元
                            </span>
                          </div>
                        </Col>
                        <Col span={13}>
                          <p
                            style={{
                              paddingLeft: "10px",
                              color: "rgb(153, 153, 153)"
                            }}
                          >{`针对保证金进行预警，触发规则：当日货值-初始货值<0，且绝对值大于等于警戒线触发预警`}</p>
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
                              {/* <Col span={6}>
                            <Checkbox value="B">关联风险</Checkbox>
                          </Col> */}
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
                  <div className={style.purchaseWarning}>
                    <h2 className={style.warningHeader}>委托采购提示配置</h2>
                    <h4>付款时间</h4>
                    <Row>
                      <Col span={7}>
                        <span
                          style={{ paddingTop: "5px", display: "inline-block" }}
                        >
                          资方付款日期：
                        </span>
                      </Col>
                      <Col span={15}>
                        <div className="warningItem">
                          <span
                            style={{
                              paddingRight: "10px",
                              paddingLeft: "56px"
                            }}
                          >
                            付款前置条件满足后
                          </span>
                          <Form.Item>
                            {getFieldDecorator("assetsPayDate", {
                              initialValue: "",
                              rules: [
                                {
                                  required: true,
                                  message: "请输入不超过十位的正整数或未输入！",
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
                              paddingLeft: '16px',
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
                </div>
              ) : (
                  <div className="warningBox">
                    <div className={style.timeWarning}>
                      <div className="timeWarning">
                        <h3>时间预警</h3>
                        <h4>开票时间</h4>
                        <Row>
                          <Col span={8}>
                            <div className="warningCheckItem">
                              <Form.Item>
                                {getFieldDecorator("clearDay", {
                                  require: "true",
                                  initialValue: ["A"]
                                })(
                                  <Checkbox.Group style={{ width: "100%" }}>
                                    <Checkbox value="A">
                                      供货商首次开票时限：
                                  </Checkbox>
                                  </Checkbox.Group>
                                )}
                              </Form.Item>
                            </div>
                          </Col>
                          <Col span={1} />
                          <Col span={14}>
                            <div className="warningItem">
                              <span
                                style={{
                                  paddingLeft: "28px",
                                  paddingRight: "10px"
                                }}
                              >
                                支付货款后
                            </span>
                              <Form.Item>
                                {getFieldDecorator("supplierNvoiceDeadline", {
                                  initialValue: "",
                                  rules: [
                                    {
                                      required: true,
                                      message:
                                        "请输入不超过十位的正整数或未输入！",
                                      max: 10,
                                      pattern: new RegExp(
                                        /^[1-9][0-9]{0,9}$/,
                                        "g"
                                      )
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
                          <Col span={7}>
                            <div className="warningCheckItem">
                              <Form.Item>
                                {getFieldDecorator("giveClearDay", {
                                  require: "true",
                                  initialValue: ["A"]
                                })(
                                  <Checkbox.Group style={{ width: "100%" }}>
                                    <Checkbox value="A">资方开票时限：</Checkbox>
                                  </Checkbox.Group>
                                )}
                              </Form.Item>
                            </div>
                          </Col>
                          <Col span={2} />
                          <Col span={15}>
                            <div className="warningItem">
                              <span style={{ paddingRight: "10px" }}>
                                供货商开完票后
                            </span>
                              <Form.Item>
                                {getFieldDecorator("assetsNvoiceDeadline", {
                                  initialValue: "",
                                  rules: [
                                    {
                                      required: true,
                                      message:
                                        "请输入不超过十位的正整数或未输入！",
                                      pattern: new RegExp(
                                        /^[1-9][0-9]{0,9}$/,
                                        "g"
                                      )
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
                        <h4>物流时间</h4>
                        <Row>
                          <Col span={7}>
                            <div className="warningCheckItem">
                              <Form.Item>
                                {getFieldDecorator("getDay", {
                                  require: "true",
                                  initialValue: ["A"]
                                })(
                                  <Checkbox.Group style={{ width: "100%" }}>
                                    <Checkbox value="A">
                                      约定最晚提货日期
                                  </Checkbox>
                                  </Checkbox.Group>
                                )}
                              </Form.Item>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={7}>
                            <span
                              style={{
                                paddingTop: "5px",
                                display: "inline-block"
                              }}
                            >
                              提货倒计时天数：
                          </span>
                          </Col>
                          <Col span={15}>
                            <div className="warningItem">
                              <span
                                style={{
                                  paddingRight: "10px",
                                  paddingLeft: "5px"
                                }}
                              >
                                距约定最晚提货日期前
                            </span>
                              <Form.Item>
                                {getFieldDecorator("countdownTake", {
                                  require: "true",
                                  initialValue: ""
                                })(
                                  <Input
                                    style={{ textAlign: "center" }}
                                    disabled
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
                        <Form.Item label="货值预警">
                          {getFieldDecorator("priceWarning", {
                            require: "true",
                            initialValue: ["A"]
                          })(
                            <Checkbox.Group style={{ width: "100%" }}>
                              <Row>
                                {/* <Col span={6}>
                            <Checkbox value="A">初始货值</Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox value="B">初始保证金</Checkbox>
                          </Col> */}
                                <Col span={6}>
                                  <Checkbox value="A">当日货值价格</Checkbox>
                                </Col>
                                <Col span={6} />
                              </Row>
                            </Checkbox.Group>
                          )}
                        </Form.Item>
                        <Row>
                          <Col span={11}>
                            <div className="warningItem specialWarningItem">
                              <span
                                style={{
                                  paddingTop: "5px",
                                  display: "inline-block"
                                }}
                              >
                                警戒线：
                            </span>
                              <Form.Item layout="inline">
                                {getFieldDecorator("goodsWarningLine", {
                                  initialValue: "",
                                  rules: [
                                    {
                                      required: true,
                                      message:
                                        "超过限定长度，限定长度为12或未输入！",
                                      max: 12
                                      // pattern: new RegExp(
                                      //   /^(?:0\.\d{0,3}|[1-9][0-9]{0,9}|[1-9][0-9]{1,7}\.\d{1,2})$/,
                                      //   "g"
                                      // )
                                    }
                                  ]
                                })(
                                  <Input
                                    style={{
                                      width: "150px",
                                      textAlign: "center"
                                    }}
                                  />
                                )}
                              </Form.Item>
                              <span
                                style={{
                                  marginLeft: "90px",
                                  paddingTop: "5px",
                                  display: "inline-block"
                                }}
                              >
                                元
                            </span>
                            </div>
                          </Col>
                          <Col span={13}>
                            <p
                              style={{
                                paddingLeft: "10px",
                                color: "rgb(153, 153, 153)"
                              }}
                            >{`针对保证金进行预警，触发规则：当日货值-初始货值<0，且绝对值大于等于警戒线触发预警`}</p>
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
                                {/* <Col span={6}>
                            <Checkbox value="B">关联风险</Checkbox>
                          </Col> */}
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
                    <div className={style.purchaseWarning}>
                      <h2 className={style.warningHeader}>委托采购提示配置</h2>
                      {/* <h3>时间提示</h3>
                <h4>开票时间</h4>
                <Row>
                  <Col span={8}>
                    <div className="warningCheckItem">
                      <Form.Item>
                        {getFieldDecorator("clearDay", {
                          require: "true",
                          initialValue: ["A"]
                        })(
                          <Checkbox.Group style={{ width: "100%" }}>
                            <Checkbox value="A">供货商首次开票日期</Checkbox>
                          </Checkbox.Group>
                        )}
                      </Form.Item>
                    </div>
                  </Col>
                </Row> */}
                      <h4>付款时间</h4>
                      <Row>
                        <Col span={7}>
                          <span
                            style={{ paddingTop: "5px", display: "inline-block" }}
                          >
                            资方付款日期：
                        </span>
                        </Col>
                        <Col span={15}>
                          <div className="warningItem">
                            <span
                              style={{
                                paddingRight: "10px",
                                paddingLeft: "56px"
                              }}
                            >
                              付款前置条件满足后
                          </span>
                            <Form.Item>
                              {getFieldDecorator("assetsPayDate", {
                                initialValue: "",
                                rules: [
                                  {
                                    required: true,
                                    message: "请输入不超过十位的正整数或未输入！",
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
                            销售结算日期：
                        </span>
                        </Col>
                        <Col span={15}>
                          <div className="warningItem">
                            <span
                              style={{
                                paddingRight: "10px",
                                paddingLeft: "28px"
                              }}
                            >
                              委托企业最后一次提货后
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
                              天
                          </span>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={7}>
                          <span
                            style={{ paddingTop: "5px", display: "inline-block" }}
                          >
                            采购结算日期：
                        </span>
                        </Col>
                        <Col span={15}>
                          <div className="warningItem">
                            <span
                              style={{
                                paddingRight: "10px",
                                paddingLeft: "28px"
                              }}
                            >
                              委托企业最后一次提货后
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
                              天
                          </span>
                          </div>
                        </Col>
                      </Row>
                      {/* <h4>物流时间</h4>
                    <Row>
                      <Col span={8}>
                        <div className="warningCheckItem">
                          <Form.Item>
                            {getFieldDecorator("deliveryDate", {
                              require: "true",
                              initialValue: ["A"]
                            })(
                              <Checkbox.Group style={{ width: "100%" }}>
                                <Checkbox value="A">发货日期</Checkbox>
                              </Checkbox.Group>
                            )}
                          </Form.Item>
                        </div>
                      </Col>
                    </Row> */}
                    </div>
                  </div>
                )}
            </div>
          </Form>
        </div>
      </Fragment>
    );
  }
}
export default PurchaseWarning;
