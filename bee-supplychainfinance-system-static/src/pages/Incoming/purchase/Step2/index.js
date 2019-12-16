import React, { Fragment, Component } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Icon,
  Select,
  message,
} from 'antd';
import router from 'umi/router';
import { BusinessDetail, BusinessFooter, ReportBottom, ReportHeader } from '../../components';
import { withRouter } from 'react-router';
import styles from '../style.less';
import moment from 'moment';

let id = 0;
const InputGroup = Input.Group;
const Option = Select.Option;

@withRouter
@Form.create()
@connect(({ incomingstep, loading }) => ({
  incomingstep
}))
class SecondStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProved: 2,
      isCompanyProved: 2,
      // type:this.props.global.role,
      type: this.props.location.query.type,
      applyId: this.props.location.query.applyId,
      id: this.props.location.query.id,
      entrustBuyId: this.props.location.query.entrustBuyId,
      pushData: {},
      isShow: false,
      getData: {},
      deliveryAddress: 0,
      takeGoodsAddress: 0,
      err: true,
      editPrice: false
    };
  }
  componentDidMount() {
    const { type, applyId } = this.state
    const self = this
    switch (type) {
      case "p":
        this.props.dispatch({
          type: "incomingstep/setBuyDetailData",
          payload: applyId,
          callback: (code, msg, data) => {
            if (code === 0) {
              if (data.entrustBuyDetailDTO) {
                const newData = data.entrustBuyDetailDTO
                if (Object.keys(newData).length !== 0) {
                  self.deliveryAddress = {
                    province: newData.deliveryProvince ? newData.deliveryProvince.id : Number(String(newData.deliveryAddress)[0]),
                    city: newData.deliveryCity ? newData.deliveryCity.id : Number(String(newData.deliveryAddress)[1]),
                    country: newData.deliveryCounty ? newData.deliveryCounty.id : Number(String(newData.deliveryAddress)[2])
                  }
                  self.takeGoodsAddress = {
                    province: newData.takeGoodsProvince ? newData.takeGoodsProvince.id : Number(String(newData.takeGoodsAddress)[0]),
                    city: newData.takeGoodsCity ? newData.takeGoodsCity.id : Number(String(newData.takeGoodsAddress)[1]),
                    country: newData.takeGoodsCounty ? newData.takeGoodsCounty.id : Number(String(newData.takeGoodsAddress)[2])
                  }
                }
              }
              this.setState({
                getData: data,
                isShow: true
              })
            }
          }
        })
        break;
      case "L":
        this.props.dispatch({
          type: "incomingstep/setLargeBuyDetailData",
          payload: applyId,
          callback: (code, msg, data) => {
            if (code === 0) {
              if (data.largeEntrustBuyDetailDTO) {
                const newData = data.largeEntrustBuyDetailDTO
                if (Object.keys(newData).length !== 0) {
                  self.deliveryAddress = {
                    province: newData.deliveryProvince ? newData.deliveryProvince.id : Number(String(newData.deliveryAddress)[0]),
                    city: newData.deliveryCity ? newData.deliveryCity.id : Number(String(newData.deliveryAddress)[1]),
                    country: newData.deliveryCounty ? newData.deliveryCounty.id : Number(String(newData.deliveryAddress)[2])
                  }
                  self.takeGoodsAddress = {
                    province: newData.takeGoodsProvince ? newData.takeGoodsProvince.id : Number(String(newData.takeGoodsAddress)[0]),
                    city: newData.takeGoodsCity ? newData.takeGoodsCity.id : Number(String(newData.takeGoodsAddress)[1]),
                    country: newData.takeGoodsCounty ? newData.takeGoodsCounty.id : Number(String(newData.takeGoodsAddress)[2])
                  }
                }
              }
              this.setState({
                getData: data,
                isShow: true
              })
            }
          }
        })
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
              })
            }
          }
        })
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
              })
            }
          }
        })
        break;
      default:
        break;
    }
  }

  getIsProved = (Proved, CompanyProved, callback) => {
    this.setState({
      isProved: Proved,
      isCompanyProved: CompanyProved
    }, () => {
      callback && callback(this.state.isProved, this.state.isCompanyProved)
    })
  }

  addressChange = (value) => {
    this.setState({
      takeGoodsAddress: value
    })
  }

  onValidateForm = (saveType, callback) => {
    const { getData, editPrice } = this.state;
    const { getFieldDecorator, validateFields, getFieldValue } = this.props.form;
    const { type, applyId, id, entrustBuyId } = this.props.location.query;
    const { dispatch, incomingstep } = this.props
    const self = this
    const have = this.props.form.getFieldsValue(["hasGuarantor", "hasFreight"])
    validateFields((err, values) => {
      if (saveType === "save") {
        err = false
        values = this.props.form.getFieldsValue()
      } else {
        if (type === 'w') {
          if (!incomingstep.buyFirstPartTwo.freightForwardCreditId || self.state.isCompanyProved !== 1) {
            callback && callback()
            message.error("请验证货代公司")
            return
          }
        }
        if (type === 's') {
          const haveFreight = self.props.form.getFieldValue("paymentProvision")
          if (haveFreight === "1") {
            if (!incomingstep.buyFirstPartTwo.freightForwardCreditId || self.state.isCompanyProved !== 1) {
              callback && callback()
              message.error("请验证货代公司")
              return
            }
          }
        }
        if (have.hasFreight === "1") {
          if (!incomingstep.buyFirstPartTwo.freightForwardCreditId || self.state.isCompanyProved !== 1) {
            callback && callback()
            message.error("请验证货代公司")
            return
          }
        }
        if (have.hasGuarantor === "1") {
          if (!incomingstep.buyFirstPartTwo.guarantorCreditId || self.state.isProved !== 1) {
            callback && callback()
            message.error("请验证担保企业")
            return
          }
        }
        if (type === "p" || type === "L") {
          if (!this.props.form.getFieldValue("deliveryAddress")) {
            callback && callback()
            message.error("请选择发货地")
            return
          } else if (!this.props.form.getFieldValue("takeGoodsAddress")) {
            callback && callback()
            message.error("请选择收货地")
            return
          }
        }

      }
      if (!err) {
        let obj1 = {}
        let obj2 = {}
        let stepTwo = {}
        let str = ""
        let arr = []
        let firstInfo = self.props.incomingstep.buyFirstPartTwo
        for (let item in values) {
          if (item.indexOf("addts") !== -1) {
            obj1[item] = values[item]
            delete values[item]
          } else if (item.indexOf("names") !== -1) {
            obj2[item] = values[item]
            delete values[item]
          }
          if (item === "latestPaymentTime") {
            values[item] = moment(values[item]).format("YYYY-MM-DD")
          }
        }
        for (let key in obj1) {
          for (let key1 in obj2) {
            if (key[key.length - 1] === key1[key1.length - 1]) {
              if (!obj1[key]) {
                obj1[key] = ""
              }
              if (!obj2[key1]) {
                obj2[key1] = ""
              }
              arr.push(obj1[key] + "&b;" + obj2[key1])
            }
          }
        }
        str = arr.join("&d;")
        values["additionalInformation"] = str
        switch (type) {
          case "p":
            values.freightForwardCreditId =
              incomingstep.buyFirstPartTwo.freightForwardCreditId
                ? incomingstep.buyFirstPartTwo.freightForwardCreditId
                : null,
              values.guarantorCreditId =
              incomingstep.buyFirstPartTwo.guarantorCreditId
                ? incomingstep.buyFirstPartTwo.guarantorCreditId
                : null
            break;
          case "L":
            values.freightForwardCreditId =
              incomingstep.buyFirstPartTwo.freightForwardCreditId
                ? incomingstep.buyFirstPartTwo.freightForwardCreditId
                : null,
              values.guarantorCreditId =
              incomingstep.buyFirstPartTwo.guarantorCreditId
                ? incomingstep.buyFirstPartTwo.guarantorCreditId
                : null
            break;
          case "s":
            values.freightForwardCreditId =
              incomingstep.buyFirstPartTwo.freightForwardCreditId
                ? incomingstep.buyFirstPartTwo.freightForwardCreditId
                : null,
              values.guarantorCreditId =
              incomingstep.buyFirstPartTwo.guarantorCreditId
                ? incomingstep.buyFirstPartTwo.guarantorCreditId
                : null
            break;
          case "w":
            values.freightForwardCreditId =
              incomingstep.buyFirstPartTwo.freightForwardCreditId
                ? incomingstep.buyFirstPartTwo.freightForwardCreditId
                : null,
              values.guarantorCreditId =
              incomingstep.buyFirstPartTwo.guarantorCreditId
                ? incomingstep.buyFirstPartTwo.guarantorCreditId
                : null
            values.latestDeliveryDate = values.latestDeliveryDate ? moment(values.validateFields).format("YYYY-MM-DD") : ""
            delete firstInfo['deliveryAddress'];
            delete firstInfo["takeGoodsAddress"]
            break;
        }
        stepTwo = {
          ...values,
          ...firstInfo,
          applyId: applyId,
          id: id
        }

        if (editPrice) {
          if (type === 'p' || type === 'L') {
            stepTwo['sellingPriceElse'] = Number(values.sellingPrice)
            delete stepTwo.sellingPrice
          } else if (type === 's') {
            stepTwo['purchasePriceElse'] = Number(values.purchasePrice)
            delete stepTwo.purchasePrice
          }
        }

        switch (type) {
          case "p":
            dispatch({
              type: "incomingstep/dataSecond",
              payload: { ...stepTwo },
              callback: (code, msg, data) => {
                // callback && callback(code, msg, data)   
                if (code === 0) {
                  callback && callback()
                  saveType !== "save" ?
                    router.push(
                      `/incoming/purchase/step3?type=${type}&applyId=${applyId}&id=${
                      data.id
                      }&entrustBuyId=${entrustBuyId}`
                    )
                    :
                    message.success(msg);
                } else {
                  callback && callback()
                  router.push(
                    `/incoming/purchase/step2?type=${type}&applyId=${applyId}&id=${id}&entrustBuyId=${entrustBuyId}`
                  );
                  message.error(msg);
                }
              }
            });
            break;
          case "L":
            dispatch({
              type: "incomingstep/dataSecond",
              payload: { ...stepTwo },
              callback: (code, msg, data) => {
                // callback && callback(code, msg, data)   
                if (code === 0) {
                  callback && callback()
                  saveType !== "save" ?
                    router.push(
                      `/incoming/purchase/step3?type=${type}&applyId=${applyId}&id=${
                      data.id
                      }&entrustBuyId=${entrustBuyId}`
                    )
                    :
                    message.success(msg);
                } else {
                  callback && callback()
                  router.push(
                    `/incoming/purchase/step2?type=${type}&applyId=${applyId}&id=${id}&entrustBuyId=${entrustBuyId}`
                  );
                  message.error(msg);
                }
              }
            });
            break;
          case "s":
            dispatch({
              type: "incomingstep/dataSecond",
              payload: { ...stepTwo },
              callback: (code, msg, data) => {
                if (code === 0) {
                  callback && callback()
                  saveType !== "save"
                    ?
                    router.push(
                      `/incoming/purchase/step3?type=${type}&applyId=${applyId}&id=${
                      data.id
                      }&entrustBuyId=${entrustBuyId}`
                    )
                    :
                    message.success(msg);
                } else {
                  callback && callback()
                  router.push(
                    `/incoming/purchase/step2?type=${type}&applyId=${applyId}&id=${id}&entrustBuyId=${entrustBuyId}`
                  );
                  message.error(msg);
                }
              }
            });
            break;
          case "w":
            dispatch({
              type: "incomingstep/dataSecond",
              payload: { ...stepTwo },
              callback: (code, msg, data) => {
                if (code === 0) {
                  callback && callback()
                  saveType !== "save"
                    ?
                    router.push(
                      `/incoming/purchase/step3?type=${type}&applyId=${applyId}&id=${
                      data.id
                      }&entrustBuyId=${entrustBuyId}`
                    )
                    :
                    message.success(msg);
                } else {
                  callback && callback()
                  router.push(
                    `/incoming/purchase/step2?type=${type}&applyId=${applyId}&id=${id}&entrustBuyId=${entrustBuyId}`
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

  changeEditPrice = (value) => {
    this.setState({
      editPrice: value
    })
  }

  render() {
    const { isProved, type, pushData, applyId, id, deliveryAddress, takeGoodsAddress, getData, err, isShow, entrustBuyId, editPrice } = this.state;
    const { form } = this.props;
    let title = ""
    if (getData.entrustBuyDTO) {
      title = getData.entrustBuyDTO.applyCompanyName
    }

    return (
      <Fragment>
        <ReportHeader
          title={title}
          showInput={false}
          prev={true}
          prevFun={() => router.push(`/incoming/purchase/step1?type=${type}&applyId=${applyId}&entrustBuyId=${entrustBuyId}`)}
          nextFun={() => console.log("保存触发了")}
          onChange={this.onChange}
          step={2}
          type={type}
          id={id}
          rcForm={this.props.form}
          getData={getData}
          applyId={applyId}
          onValidateFormTwo={this.onValidateForm}
        />
        {
          isShow ?
            <BusinessDetail
              writeBack={{ deliveryAddress: this.deliveryAddress, takeGoodsAddress: this.takeGoodsAddress }}
              getData={getData}
              entrustBuyId={entrustBuyId}
              deliveryAddress={deliveryAddress}
              takeGoodsAddress={takeGoodsAddress}
              type={type} pushData={pushData}
              addressChange={this.addressChange}
              applyId={applyId}
              id={id}
              getIsProved={this.getIsProved}
              isProved={this.state.isProved}
              isCompanyProved={this.state.isCompanyProved}
              rcForm={this.props.form}
              editPrice={editPrice}
              changeEditPrice={this.changeEditPrice}
            />
            : null
        }
        {isShow ? <BusinessFooter getData={getData} type={type} id={id} entrustBuyId={entrustBuyId} applyId={applyId} rcForm={this.props.form} /> : ""}
        <ReportBottom step={2} broad={5} type={type} err={err} id={id} applyId={applyId} entrustBuyId={entrustBuyId} onValidateFormTwo={this.onValidateForm} incomProp={this.props.incomingstep.buyFirstPartTwo} />
      </Fragment>
    );
  }
}

export default SecondStep;
