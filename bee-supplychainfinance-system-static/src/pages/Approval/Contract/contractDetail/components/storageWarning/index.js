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
    for (let item in values) {
      if (values[item] === undefined) {
        values[item] = "";
      }
    }
    for (var item in values) {
      if (item === "aDay" && values[item][0] !== "A") {
        values["loanCompanyInvoiceDate"] = "";
      }
      if (item === "bDay" && values[item][0] !== "A") {
        values["goodsPrice"] = "";
      }
      if (item === "cDay" && values[item][0] !== "A") {
        values["assetsInvoiceDate"] = "";
      }
      if (item === "dDay" && values[item][0] !== "A") {
        values["assetsPayDate"] = "";
      }
    }
    const { dispatch, orderId, onErr, unitData } = props;
    let err = true;
    let newData = {
      assetsInvoiceDate: "",
      assetsPayDate: "",
      // entrustLatestDeliveryDate: "",
      goodsPrice: "",
      loanCompanyInvoiceDate: "",
      unitPrice: "",
      grade: ""
    };
    for (var item in newData) {
      newData[item] = values[item];
    }
    if (newData["unitPrice"] === "") {
      err = false;
    }
    if (unitData.grade && newData["grade"] === "") {
      err = false;
    }
    if (values.aDay[0] === "A" && values.loanCompanyInvoiceDate === "") {
      err = false;
    }
    if (values.bDay[0] === "A" && values.goodsPrice === "") {
      err = false;
    }
    if (values.cDay[0] === "A" && values.assetsInvoiceDate === "") {
      err = false;
    }
    if (values.dDay[0] === "A" && values.assetsPayDate === "") {
      err = false;
    }
    onErr(err);
    dispatch({
      type: "appContract/setWarningData",
      payload: { ...newData, orderId: orderId }
    });
  }
})
class StorageWarning extends Component {
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
            onErr(true);
            return;
          } else {
            let oldData = data;
            let newData = {
              assetsInvoiceDate: "",
              assetsPayDate: "",
              // entrustLatestDeliveryDate: "",
              goodsPrice: "",
              loanCompanyInvoiceDate: "",
              aDay: [],
              bDay: [],
              cDay: [],
              dDay: []
            };
            // for (item in oldData) {
            //   if (data.id) {
            //     if (item === "entrustLatestDeliveryDate" && oldData[item] === 1) {
            //       oldData[item] = ["A"];
            //     } else if (item === "entrustLatestDeliveryDate" && oldData[item] === 0) {
            //       oldData[item] = [];
            //     }
            //   }
            // }
            for (var item in newData) {
              newData[item] = oldData[item];
            }
            for (var item in newData) {
              if (newData.loanCompanyInvoiceDate !== undefined) {
                newData.aDay = ["A"];
              }
              if (newData.goodsPrice !== undefined) {
                newData.bDay = ["A"];
              }
              if (newData.assetsInvoiceDate !== undefined) {
                newData.cDay = ["A"];
              }
              if (newData.assetsPayDate !== undefined) {
                newData.dDay = ["A"];
              }
            }
            let err = true;
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
              unitPrice: unitData.unitPrice ? unitData.unitPrice : null
            });
          }
        } else {
          this.props.form.setFieldsValue({
            unit: unitData.unit ? unitData.unit : null,
            grade: unitData.grade ? unitData.grade : null,
            unitPrice: unitData.unitPrice ? unitData.unitPrice : null
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
                  <Form.Item label="单价">
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
                    <h3>时间预警</h3>
                    <h4>开票时间</h4>
                    <Row>
                      <Col span={8}>
                        <div className="warningCheckItem">
                          <Form.Item>
                            {getFieldDecorator("aDay", {
                              require: "true",
                              initialValue: ["A"]
                            })(
                              <Checkbox.Group style={{ width: "100%" }}>
                                <Checkbox value="A">货代公司开票日期</Checkbox>
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
                            资方放货后
                          </span>
                          <Form.Item>
                            {getFieldDecorator("loanCompanyInvoiceDate", {
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
                    <Form.Item label="货值预警">
                      {getFieldDecorator("bDay", {
                        require: "true",
                        initialValue: ["A"]
                      })(
                        <Checkbox.Group style={{ width: "100%" }}>
                          <Row>
                            <Col span={6}>
                              <Checkbox value="A">标的物当日价格</Checkbox>
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
                            {getFieldDecorator("goodsPrice", {
                              initialValue: "",
                              rules: [
                                {
                                  required: true,
                                  message:
                                    "超过限定长度，限定长度为12或未输入！",
                                  max: 12
                                }
                              ]
                            })(
                              <Input
                                style={{ width: "150px", textAlign: "center" }}
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
                  </div>
                </div>
                <div className={style.storageWarning}>
                  <h2 className={style.warningHeader}>金融仓储提示配置</h2>
                  <h4>开票时间</h4>
                  <Row>
                    <Col span={8}>
                      <div className="warningCheckItem">
                        <Form.Item>
                          {getFieldDecorator("cDay", {
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
                    <Col span={1} />
                    <Col span={14}>
                      <div className="warningItem">
                        <span
                          style={{ paddingLeft: "28px", paddingRight: "10px" }}
                        >
                          结算完成后
                        </span>
                        <Form.Item>
                          {getFieldDecorator("assetsInvoiceDate", {
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
                          {getFieldDecorator("dDay", {
                            require: "true",
                            initialValue: ["A"]
                          })(
                            <Checkbox.Group style={{ width: "100%" }}>
                              <Checkbox value="A">资方付款日期</Checkbox>
                            </Checkbox.Group>
                          )}
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={1} />
                    <Col span={14}>
                      <div className="warningItem">
                        <span
                          style={{ paddingLeft: "28px", paddingRight: "10px" }}
                        >
                          提交仓单后
                        </span>
                        <Form.Item>
                          {getFieldDecorator("assetsPayDate", {
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
                </div>
              </div>
            </div>
          </Form>
        </div>
      </Fragment>
    );
  }
}
export default StorageWarning;
