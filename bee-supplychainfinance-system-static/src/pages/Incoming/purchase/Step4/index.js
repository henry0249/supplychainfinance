import { Component, Fragment } from "react";
import { Breadcrumb, Button, Icon, Form, message } from "antd";
import Link from "umi/link";
import styles from "./index.less";
import AdditionalInfo from "./compoents/AdditionalInfo/Index";
import FinanceInfo from "./compoents/FinanceInfo/Index";
import OtherBusinessInfo from "./compoents/OtherBusinessInfo/Index";
import CreditInfo from "./compoents/CreditInfo/Index";
import BusinessInfo from "./compoents/BusinessInfo/Index";
import { ReportBottom, ReportHeader } from "../../components";
import router from "umi/router";
import { withRouter } from "react-router";
import { connect } from "dva";
import moment from "moment"

@withRouter
@Form.create()
@connect(({ incomingstep, loading }) => ({
  incomingstep
}))
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passData: [],
      getData: {},
      isShow: false,
      onf: null,
      onBus: null,
      onAdd: null,
      err: true
    };
  }
  componentDidMount() {
    const { type, applyId } = this.props.location.query;
    // switch (type) {
    //   case "p":
    //     this.props.dispatch({
    //       type: "incomingstep/setBuyDetailData",
    //       payload: applyId,
    //       callback: (code, msg, data) => {
    //         if (code === 0) {
    //           this.setState({
    //             buyData: data
    //           });
    //         }
    //       }
    //     });
    //     break;
    //   case "L":
    //     this.props.dispatch({
    //       type: "incomingstep/setLargeBuyDetailData",
    //       payload: applyId,
    //       callback: (code, msg, data) => {
    //         if (code === 0) {
    //           this.setState({
    //             buyData: data
    //           });
    //         }
    //       }
    //     });
    //     break;
    //   case "s":
    //     this.props.dispatch({
    //       type: "incomingstep/setSaleDetailData",
    //       payload: applyId,
    //       callback: (code, msg, data) => {
    //         if (code === 0) {
    //           this.setState({
    //             saleData: data
    //           });
    //         }
    //       }
    //     });
    //     break;
    //   case "w":
    //     this.props.dispatch({
    //       type: "incomingstep/setStorageDetailData",
    //       payload: applyId,
    //       callback: (code, msg, data) => {
    //         if (code === 0) {
    //           this.setState({
    //             storageData: data
    //           });
    //         }
    //       }
    //     });
    //     break;
    //   default:
    //     break;
    // }
    switch (type) {
      case "p":
        this.props.dispatch({
          type: "incomingstep/setBuyDetailData",
          payload: applyId,
          callback: (code, msg, data) => {
            if (code === 0) {
              this.setState({
                getData: data,
                isShow: true
              });
            } else {
              this.setState({
                isShow: true
              });
            }
          }
        });
        break;
      case "L":
        this.props.dispatch({
          type: "incomingstep/setLargeBuyDetailData",
          payload: applyId,
          callback: (code, msg, data) => {
            if (code === 0) {
              this.setState({
                getData: data,
                isShow: true
              });
            } else {
              this.setState({
                isShow: true
              });
            }
          }
        });
        break;
      case "s":
        this.props.dispatch({
          type: "incomingstep/setSaleDetailData",
          payload: applyId,
          callback: (code, msg, data) => {
            if (code === 0) {
              this.setState({
                getData: data,
                isShow: true
              });
            } else {
              this.setState({
                isShow: true
              });
            }
          }
        });
        break;
      case "w":
        this.props.dispatch({
          type: "incomingstep/setStorageDetailData",
          payload: applyId,
          callback: (code, msg, data) => {
            if (code === 0) {
              this.setState({
                getData: data,
                isShow: true
              });
            } else {
              this.setState({
                isShow: true
              });
            }
          }
        });
        break;
      default:
        break;
    }
  }

  getDom = (type, domLen, dom2Len) => {
    // const { type } = this.props.location.query.type
    const self = this
    let dom = null
    let dom2 = null
    let arr = []
    let arr1 = []
    let result = true
    switch (type) {
      case "p":
      case "L":
        for (let i = 0; i < domLen; i++) {
          dom = document.getElementById("p" + i).getElementsByTagName("input")
          arr.push("fiscalYear" + i)
        }
        Array.prototype.every.call(dom, (item, index) => {
          if (item.value !== "") {
            const value = this.props.form.getFieldsValue(arr)
            for (let i = 0; i < domLen; i++) {
              if (!value["fiscalYear" + i]) {
                message.error("请填入财务年份，否则无法存入财务信息")
                result = false
                return false
              }
            }

          } else {
            return true
          }
        })
        return result
      case "s":
        for (let i = 0; i < domLen; i++) {
          dom = document.getElementById("s" + i).getElementsByTagName("input")
          arr.push("fiscalYear" + i)
        }
        Array.prototype.every.call(dom, (item, index) => {
          if (item.value !== "") {
            const value = this.props.form.getFieldsValue(arr)
            for (let i = 0; i < domLen; i++) {
              if (!value["fiscalYear" + i]) {
                message.error("请填入财务年份，否则无法存入财务信息")
                result = false
                return false
              }
            }
          } else {
            return true
          }
        })
        return result
      case "w":
        for (let i = 0; i < domLen; i++) {
          dom = document.getElementById("w" + i).getElementsByTagName("input")
          arr.push("fiscalYear" + i)
        }
        Array.prototype.every.call(dom, (item, index) => {
          if (item.value !== "") {
            const value = this.props.form.getFieldsValue(arr)
            for (let i = 0; i < domLen; i++) {
              if (!value["fiscalYear" + i]) {
                message.error("请填入财务年份，否则无法存入财务信息")
                result = false
                return false
              }
            }
          } else {
            return true
          }
        })
        return result
    }
  }

  handleValue = (type, values) => {
    const self = this
    for (let item in values) {
      if (values[item] === undefined) {
        values[item] = ''
      }
    }
    const { passData, onf, onf1, dispatch, onChange, supplyType } = self.props;
    const { applyId, id } = this.props.location.query;
    let newData = [].concat(passData);
    let newData2 = [].concat(passData);
    let newData3 = {}
    let index = 0;
    let index2 = 0
    let obj = {}
    let arr = null;
    let exampleItem = {
      assetLiabilityRatio: '',
      cashDemand: '',
      cashFlow: '',
      cashGrowthRate: '',
      creditVelocity: '',
      fiscalYear: '',
      grossProfitRate: '',
      interestProtection: '',
      liquidityRatio: '',
      netProfit: '',
      profitGrowthRate: '',
      quickRatio: '',
      stockVelocity: '',
      detailId: id
    };
    let newItem = {};
    let newItem2 = {}
    values["detailId"] = id;
    switch (type) {
      case "p":
      case "L":
        let exampleItemP = {
          cooperativeInstitution: "1",
          creditAmount: '1',
          creditStartingDate: "1",
          overdue: "1",
          repaymentTerm: "1",
          unclearedCreditAmount: "1",
          detailId: id
        };
        for (var item in exampleItemP) {
          for (var valueItem in values) {
            let keyItem = valueItem.indexOf(item);
            if (keyItem >= 0) {
              index = Number((arr = valueItem.replace(item, "")));
              if (valueItem.indexOf("creditStartingDate") !== -1 || valueItem.indexOf("repaymentTerm") !== -1) {
                if (values[valueItem]) {
                  newItem[item] = values[valueItem].format("YYYY-MM-DD");
                  delete values[valueItem]
                } else {
                  newItem[item] = ""
                  delete values[valueItem]
                }
                newData[index] = { ...newData[index], ...newItem }
              } else {
                newItem[item] = values[valueItem];
                delete values[valueItem]
                newData[index] = { ...newData[index], ...newItem }
              }
            }
            newItem = {};
          }
        }
        for (var item in exampleItem) {
          for (var valueItem in values) {
            let keyItem = valueItem.indexOf(item);
            if (keyItem !== -1) {
              index2 = Number((arr = valueItem.replace(item, "")));
              newItem2[item] = values[valueItem];
              delete values[valueItem]
            }
            newData2[index2] = { ...newData2[index2], ...newItem2 }
            newItem2 = {}
          }
        }
        for (let key in values) {
          newData3[key] = values[key]
          delete values[key]
        }
        newData3["detailId"] = id
        obj = {
          dom: newData2.length,
          dom2: newData.length
        }
        break;
      case "s":
        let exampleItem2 = {
          cooperativeInstitution: "1",
          creditAmount: '1',
          creditStartingDate: "1",
          overdue: "1",
          repaymentTerm: "1",
          unclearedCreditAmount: "1",
          detailId: id
        };
        for (var item in exampleItem2) {
          for (var valueItem in values) {
            let keyItem = valueItem.indexOf(item);
            if (keyItem >= 0) {
              if (valueItem.indexOf("creditStartingDate") !== -1 || valueItem.indexOf("repaymentTerm") !== -1) {
                if (values[valueItem]) {
                  newItem[item] = values[valueItem].format("YYYY-MM-DD");
                  delete values[valueItem]
                } else {
                  newItem[item] = ""
                  delete values[valueItem]
                }
                index = Number((arr = valueItem.replace(item, "")));
                newData[index] = { ...newData[index], ...newItem }
              } else {
                newItem[item] = values[valueItem];
                index = Number((arr = valueItem.replace(item, "")));
                delete values[valueItem]
                newData[index] = { ...newData[index], ...newItem }
              }
            }

            newItem = {};
          }
        }
        for (var item in exampleItem) {
          for (var valueItem in values) {
            let keyItem = valueItem.indexOf(item);
            if (keyItem !== -1) {
              index2 = Number((arr = valueItem.replace(item, "")));
              newItem2[item] = values[valueItem];
              delete values[valueItem]
            }
            newData2[index2] = { ...newData2[index2], ...newItem2 }
            newItem2 = {}
          }
        }
        for (let key in values) {
          if (!values[key]) {
            newData3[key] = ""
          } else if (key === "agreeDeliveryTime" || key === "expectDeliveryTime") {
            values[key] = moment(values[key]).format("YYYY-MM-DD")
            newData3[key] = values[key]
          } else {
            newData3[key] = values[key]
          }
          delete values[key]
        }
        newData3["detailId"] = id
        obj = {
          dom: newData2.length
        }
        break;
      case "w":
        let exampleItem3 = {
          cooperativeInstitution: "1",
          creditAmount: '1',
          creditStartingDate: "1",
          overdue: "1",
          repaymentTerm: "1",
          unclearedCreditAmount: "1",
          detailId: id
        };
        for (var item in exampleItem3) {
          for (var valueItem in values) {
            let keyItem = valueItem.indexOf(item);
            if (keyItem >= 0) {
              if (valueItem.indexOf("creditStartingDate") !== -1 || valueItem.indexOf("repaymentTerm") !== -1) {
                if (values[valueItem]) {
                  newItem[item] = values[valueItem].format("YYYY-MM-DD");
                  delete values[valueItem]
                } else {
                  newItem[item] = ""
                  delete values[valueItem]
                }
                index = Number((arr = valueItem.replace(item, "")));
                newData[index] = { ...newData[index], ...newItem }
              } else {
                newItem[item] = values[valueItem];
                index = Number((arr = valueItem.replace(item, "")));
                delete values[valueItem]
                newData[index] = { ...newData[index], ...newItem }
              }
            }

            newItem = {};
          }
        }
        for (var item in exampleItem) {
          for (var valueItem in values) {
            let keyItem = valueItem.indexOf(item);
            if (keyItem !== -1) {
              index2 = Number((arr = valueItem.replace(item, "")));
              newItem2[item] = values[valueItem];
              delete values[valueItem]
            }
            newData2[index2] = { ...newData2[index2], ...newItem2 }
            newItem2 = {}
          }
        }
        for (let key in values) {
          newData3[key] = values[key]
          delete values[key]
        }
        newData3["detailId"] = id
        obj = {
          dom: newData2.length
        }
        break;
    }
    switch (type) {
      case "p":
        values.clientFinanceList = newData2
        values.clientCreditList = newData
        values.companyInfoBuyDTO = newData3
        break;
      case "L":
        values.clientFinanceList = newData2
        values.clientCreditList = newData
        values.companyInfoLargeDTO = newData3
        break;
      case "s":
        values.clientFinanceList = newData2
        values.clientCreditList = newData
        values.companyInfoSaleDTO = newData3
        break;
      case "w":
        values.clientFinanceList = newData2
        values.clientCreditList = newData
        values.companyInfoStorageDTO = newData3
        break;
      default:
        break;
    }
    return obj
  }

  onValidateForm = (saveType, callback) => {
    const { isProved, pushData, deliveryAddress, takeGoodsAddress, getData, err, isShow } = this.state;
    const { type, applyId, id, entrustBuyId } = this.props.location.query;
    const { getFieldDecorator, validateFields, getFieldValue } = this.props.form;
    const { dispatch } = this.props
    const self = this
    validateFields((err, values) => {
      if (saveType === "save") {
        err = false
        values = this.props.form.getFieldsValue()
      }
      if (!err) {
        let obj1 = {}
        let obj2 = {}
        let stepFour = {}
        let str = ""
        let arr = []
        let result = true
        const len = this.handleValue(type, values)
        type === "p" ?
          result = this.getDom("p", len.dom, len.dom2)
          :
          type === "L" ?
            result = this.getDom("L", len.dom, len.dom2)
            :
            type === "s" ?
              result = this.getDom("s", len.dom, len.dom2)
              :
              type === "w" ?
                result = this.getDom("w", len.dom, len.dom2)
                :
                ""
        if (!result) {
          callback && callback()
          return
        }
        stepFour = {
          applyId: applyId,
          id: id,
          ...values,
          type: saveType === "save" ? 0 : 1
        }
        switch (type) {
          case "p":
            dispatch({
              type: "incomingstep/dataFourth",
              payload: { ...stepFour },
              callback: (code, msg, data) => {
                // callback && callback(code, msg, data)   
                if (code === 0) {
                  callback && callback()
                  const id = this.props.location.query.applyId
                  saveType !== "save" ?
                    router.push(`/result?id=${id}&status=0&type=incoming&isManage=1&busMode=0`)
                    :
                    message.success(msg);
                } else {
                  callback && callback()
                  router.push(
                    `/incoming/purchase/step4?type=${type}&applyId=${applyId}&id=${id}&entrustBuyId=${entrustBuyId}`
                  );
                  message.error(msg);
                }
              }
            });
            break;
          case "L":
            dispatch({
              type: "incomingstep/dataFourth",
              payload: { ...stepFour },
              callback: (code, msg, data) => {
                // callback && callback(code, msg, data)   
                if (code === 0) {
                  callback && callback()
                  const id = this.props.location.query.applyId
                  saveType !== "save" ?
                    router.push(`/result?id=${id}&status=0&type=incoming&isManage=1&busMode=4`)
                    :
                    message.success(msg);
                } else {
                  callback && callback()
                  router.push(
                    `/incoming/purchase/step4?type=${type}&applyId=${applyId}&id=${id}&entrustBuyId=${entrustBuyId}`
                  );
                  message.error(msg);
                }
              }
            });
            break;
          case "s":
            dispatch({
              type: "incomingstep/dataFourth",
              payload: { ...stepFour },
              callback: (code, msg, data) => {
                if (code === 0) {
                  callback && callback()
                  const id = this.props.location.query.applyId
                  saveType !== "save"
                    ?
                    router.push(`/result?id=${id}&status=0&type=incoming&isManage=1&busMode=1`)
                    :
                    message.success(msg);
                } else {
                  callback && callback()
                  router.push(
                    `/incoming/purchase/step4?type=${type}&applyId=${applyId}&id=${id}&entrustBuyId=${entrustBuyId}`
                  );
                  message.error(msg);
                }
              }
            });
            break;
          case "w":
            dispatch({
              type: "incomingstep/dataFourth",
              payload: { ...stepFour },
              callback: (code, msg, data) => {
                if (code === 0) {
                  callback && callback()
                  const id = this.props.location.query.applyId
                  saveType !== "save"
                    ?
                    router.push(`/result?id=${id}&status=0&type=incoming&isManage=1&busMode=2`)
                    :
                    message.success(msg);
                } else {
                  callback && callback()
                  router.push(
                    `/incoming/purchase/step4?type=${type}&applyId=${applyId}&id=${id}&entrustBuyId=${entrustBuyId}`
                  );
                  message.error(msg);
                }
              }
            });
            break;
          default:
            break;
        }
      } else {
        callback && callback()
        let str = ""
        Object.values(err)[0]
        str = Object.values(err)[0].errors[0].message
        message.error(str)
      }
    });
  };
  render() {
    const { passData, getData, isShow, err } = this.state;
    const { type, applyId, id, entrustBuyId } = this.props.location.query;
    let title = "";
    if (getData.entrustBuyDTO) {
      title = getData.entrustBuyDTO.applyCompanyName;
    }
    return (
      <div>
        <ReportHeader
          title={title}
          showInput={false}
          prev={true}
          prevFun={() =>
            router.push(
              `/incoming/purchase/step3?type=${type}&applyId=${applyId}&id=${id}&entrustBuyId=${entrustBuyId}`
            )
          }
          step={4}
          rcForm={this.props.form}
          type={type}
          id={id}
          applyId={applyId}
          getData={getData}
          onValidateFormFour={this.onValidateForm}
        />
        {isShow ? (
          <Fragment>
            {(type === "p" || type === "L") && (
              <div className={styles.content}>
                <BusinessInfo
                  title="委托企业经营信息"
                  extend={true}
                  type={type}
                  rcForm={this.props.form}
                  id={id}
                  applyId={applyId}
                  getData={getData}
                />
                <FinanceInfo
                  title="委托企业财务信息"
                  extend={true}
                  type={type}
                  formId={"p"}
                  passData={passData}
                  rcForm={this.props.form}
                  getData={getData}
                  id={id}
                />
                <AdditionalInfo
                  title="补充信息"
                  type={type}
                  id={id}
                  rcForm={this.props.form}
                  getData={getData}
                />
                <CreditInfo
                  title="委托企业征信信息"
                  itemTitle="委托企业征信"
                  type={type}
                  rcForm={this.props.form}
                  passData={passData}
                  id={id}
                  getData={getData}
                />
              </div>
            )}

            {type === "s" && (
              <div className={styles.content}>
                <OtherBusinessInfo
                  title="委托企业经营信息"
                  type="s"
                  id={id}
                  applyId={applyId}
                  getData={getData}
                  rcForm={this.props.form}
                />
                <FinanceInfo
                  title="委托企业财务信息"
                  extend={false}
                  type="s"
                  formId={"s"}
                  passData={passData}
                  rcForm={this.props.form}
                  applyId={applyId}
                  id={id}
                  getData={getData}
                />
                <AdditionalInfo
                  title="补充信息"
                  type="s"
                  rcForm={this.props.form}
                  id={id}
                  getData={getData}
                />
                <CreditInfo
                  title="委托企业征信信息"
                  itemTitle="委托企业征信"
                  type="s"
                  rcForm={this.props.form}
                  passData={passData}
                  id={id}
                  getData={getData}
                />
              </div>
            )}

            {type === "w" && (
              <div className={styles.content}>
                <FinanceInfo
                  title="委托企业财务信息"
                  extend={true}
                  type="w"
                  formId={"w"}
                  rcForm={this.props.form}
                  passData={passData}
                  id={id}
                  getData={getData}
                />
                <AdditionalInfo
                  title="补充信息"
                  type="w"
                  rcForm={this.props.form}
                  id={id}
                  getData={getData}
                />
                <CreditInfo
                  title="委托企业征信信息"
                  itemTitle="委托企业征信"
                  type="w"
                  passData={passData}
                  rcForm={this.props.form}
                  id={id}
                  getData={getData}
                />
              </div>
            )}
          </Fragment>
        ) : null}

        <ReportBottom
          step={4}
          broad={5}
          id={id}
          type={type}
          onValidateFormFour={this.onValidateForm}
          applyId={applyId}
          err={err}
          entrustBuyId={entrustBuyId}
        />
      </div>
    );
  }
}
