import react, { Component, Fragment } from 'react'
import styles from './index.less'
import BusinessInfo from './compoents/BusinessInfo/Index'
import FinanceInfo from './compoents/FinanceInfo/Index'
import OtherBusinessInfo from './compoents/OtherBusinessInfo/Index'
import CreditInfo from './compoents/CreditInfo/Index'
import ReportHeader from '../../components/ReportHeader'
import { ReportBottom } from '../../components'
import { withRouter } from 'react-router'
import router from 'umi/router'
import { connect } from 'dva'
import { Form, message } from 'antd'
import moment from 'moment'

@withRouter
@Form.create()
@connect(({ incomingstep, loading }) => ({
  incomingstep
}))
export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      err: null,
      passData: [],
      getData: {},
      isShow: false,
      onf: null,
      onBus: null,
      onOt: null,
      required: false,
      required2: false
    }
    this.newDataOne = null
  }

  getDom = (type, domLen, dom2Len) => {
    const self = this
    let dom = null
    let dom2 = null
    let arr = []
    let arr1 = []
    let result = true
    const { getData } = this.state
    switch (type) {
      case 'p':
      case 'L':
        for (let i = 0; i < domLen; i++) {
          dom = document
            .getElementById('supply' + i)
            .getElementsByTagName('input')
          arr.push('fiscalYear-2' + i)
        }
        if (
          type === 'p'
            ? getData.entrustBuyDetailDTO
            : getData.largeEntrustBuyDetailDTO
        ) {
          if (
            (type === 'p'
              ? getData.entrustBuyDetailDTO.hasGuarantor
              : getData.largeEntrustBuyDetailDTO.hasGuarantor) === 1
          ) {
            for (let j = 0; j < dom2Len; j++) {
              dom2 = document
                .getElementById('purchase' + j)
                .getElementsByTagName('input')
              arr1.push('fiscalYear-1' + j)
            }
          }
        }

        if (dom2) {
          Array.prototype.every.call(dom2, (item, index) => {
            if (item.value !== '') {
              const value = this.props.form.getFieldsValue(arr1)
              for (let i = 0; i < dom2Len; i++) {
                if (!value['fiscalYear-1' + i]) {
                  message.error('请填入财务年份，否则无法存入财务信息')
                  result = false
                  return false
                }
              }
            } else {
              return true
            }
          })
        }
        Array.prototype.every.call(dom, (item, index) => {
          if (item.value !== '') {
            const value = this.props.form.getFieldsValue(arr)
            for (let i = 0; i < domLen; i++) {
              if (!value['fiscalYear-2' + i]) {
                message.error('请填入财务年份，否则无法存入财务信息')
                result = false
                return false
              }
            }
          } else {
            return true
          }
        })
        return result
      case 's':
        for (let i = 0; i < domLen; i++) {
          dom = document.getElementById('s' + i).getElementsByTagName('input')
          arr.push('fiscalYear' + i)
        }
        Array.prototype.every.call(dom, (item, index) => {
          if (item.value !== '') {
            const value = this.props.form.getFieldsValue(arr)
            for (let i = 0; i < domLen; i++) {
              if (!value['fiscalYear' + i]) {
                message.error('请填入财务年份，否则无法存入财务信息')
                result = false
                return false
              }
            }
          } else {
            return true
          }
        })
        return result
      case 'w':
        if (getData.financeStorageDetailDTO.hasGuarantor !== 1) {
          return true
        }
        for (let i = 0; i < domLen; i++) {
          dom = document.getElementById('w' + i).getElementsByTagName('input')
          arr.push('fiscalYear' + i)
        }
        Array.prototype.every.call(dom, (item, index) => {
          if (item.value !== '') {
            const value = this.props.form.getFieldsValue(arr)
            for (let i = 0; i < domLen; i++) {
              if (!value['fiscalYear' + i]) {
                message.error('请填入财务年份，否则无法存入财务信息')
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

  componentDidMount() {
    const { type, applyId } = this.props.location.query
    switch (type) {
      case 'p':
        this.props.dispatch({
          type: 'incomingstep/setBuyDetailData',
          payload: applyId,
          callback: (code, msg, data) => {
            if (code === 0) {
              this.setState(
                {
                  getData: data,
                  isShow: true
                },
                () => {
                  const { getData } = this.state
                  if (getData.entrustBuyDetailDTO) {
                    this.newDataOne = getData.entrustBuyDetailDTO
                  }
                }
              )
            } else {
              this.setState({
                isShow: true
              })
            }
          }
        })
        break
      case 'L':
        this.props.dispatch({
          type: 'incomingstep/setLargeBuyDetailData',
          payload: applyId,
          callback: (code, msg, data) => {
            if (code === 0) {
              this.setState(
                {
                  getData: data,
                  isShow: true
                },
                () => {
                  const { getData } = this.state
                  if (getData.largeEntrustBuyDetailDTO) {
                    this.newDataOne = getData.largeEntrustBuyDetailDTO
                  }
                }
              )
            } else {
              this.setState({
                isShow: true
              })
            }
          }
        })
        break
      case 's':
        this.props.dispatch({
          type: 'incomingstep/setSaleDetailData',
          payload: applyId,
          callback: (code, msg, data) => {
            if (code === 0) {
              this.setState(
                {
                  getData: data,
                  isShow: true
                },
                () => {
                  const { getData } = this.state
                  if (getData.entrustSaleDetailDTO) {
                    this.newDataOne = getData.entrustSaleDetailDTO
                  }
                }
              )
            } else {
              this.setState({
                isShow: true
              })
            }
          }
        })
        break
      case 'w':
        this.props.dispatch({
          type: 'incomingstep/setStorageDetailData',
          payload: applyId,
          callback: (code, msg, data) => {
            if (code === 0) {
              this.setState(
                {
                  getData: data,
                  isShow: true
                },
                () => {
                  const { getData } = this.state
                  if (getData.financeStorageDetailDTO) {
                    this.newDataOne = getData.financeStorageDetailDTO
                  }
                }
              )
            } else {
              this.setState({
                isShow: true
              })
            }
          }
        })
        break
      default:
        break
    }
  }

  writeBackByType = (type, values) => {
    const self = this
    const dataHandle = values => {
      for (let item in values) {
        if (values[item] === undefined) {
          values[item] = ''
        }
      }
      const { passData, onf, onf1, dispatch, onChange, supplyType } = self.props
      const { type, applyId, id } = this.props.location.query
      let newData = [].concat(passData)
      let newData2 = [].concat(passData)
      let newData3 = {}
      let index = 0
      let index2 = 0
      let obj = {}
      let arr = null
      let exampleItem = {
        fiscalYear: '',
        assetLiabilityRatio: '',
        cashFlow: '',
        cashGrowthRate: '',
        creditVelocity: '',
        interestProtection: '',
        liquidityRatio: '',
        netProfit: '',
        pbRatio: '',
        peRatio: '',
        profitGrowthRate: '',
        quickRatio: '',
        stockVelocity: '',
        detailId: id
      }
      let newItem = {}
      let newItem2 = {}
      values['detailId'] = id
      switch (type) {
        case 'p':
        case 'L':
          for (var item in exampleItem) {
            for (var valueItem in values) {
              let keyItem = valueItem.indexOf(item)
              if (keyItem !== -1) {
                if (valueItem.indexOf('-1') !== -1) {
                  index = Number((arr = valueItem.replace(item + -1, '')))
                  newItem[item] = values[valueItem]
                  delete values[valueItem]
                } else if (valueItem.indexOf('-2') !== -1) {
                  index2 = Number((arr = valueItem.replace(item + -2, '')))
                  newItem2[item] = values[valueItem]
                  delete values[valueItem]
                } else {
                  newItem[item] = values[valueItem]
                  newItem2[item] = values[valueItem]
                }
                newData[index] = { ...newData[index], ...newItem }
                newData2[index2] = { ...newData2[index2], ...newItem2 }
                newItem = {}
                newItem2 = {}
              }
            }
          }
          for (let key in values) {
            if (key === 'agreeDeliveryTime' || key === 'expectDeliveryTime') {
              values[key] = values[key]
                ? moment(values[key]).format('YYYY-MM-DD')
                : ''
              newData3[key] = values[key]
              delete values[key]
            } else {
              newData3[key] = values[key]
              delete values[key]
            }
          }
          obj = {
            dom: newData2.length,
            dom2: newData.length
          }
          break
        case 's':
          let exampleItem2 = {
            cooperativeInstitution: '1',
            creditAmount: '1',
            creditStartingDate: '1',
            overdue: '1',
            repaymentTerm: '1',
            unclearedCreditAmount: '1',
            detailId: id
          }
          exampleItem.grossProfitRate = ''
          for (var item in exampleItem2) {
            for (var valueItem in values) {
              let keyItem = valueItem.indexOf(item)
              if (keyItem >= 0) {
                index = Number((arr = valueItem.replace(item, '')))
                if (
                  valueItem.indexOf('creditStartingDate') !== -1 ||
                  valueItem.indexOf('repaymentTerm') !== -1
                ) {
                  if (values[valueItem]) {
                    newItem[item] = values[valueItem].format('YYYY-MM-DD')
                    delete values[valueItem]
                  } else {
                    newItem[item] = ''
                    delete values[valueItem]
                  }
                  newData[index] = { ...newData[index], ...newItem }
                } else {
                  newItem[item] = values[valueItem]
                  delete values[valueItem]
                  newData[index] = { ...newData[index], ...newItem }
                }
              }
              newItem = {}
            }
          }
          for (var item in exampleItem) {
            for (var valueItem in values) {
              let keyItem = valueItem.indexOf(item)
              if (keyItem !== -1) {
                index2 = Number((arr = valueItem.replace(item, '')))
                newItem2[item] = values[valueItem]
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
          newData3['detailId'] = id
          obj = {
            dom: newData2.length
          }
          break
        case 'w':
          for (var item in exampleItem) {
            for (var valueItem in values) {
              let keyItem = valueItem.indexOf(item)
              if (keyItem !== -1) {
                index2 = Number((arr = valueItem.replace(item, '')))
                newItem2[item] = values[valueItem]
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
          newData3['detailId'] = id
          obj = {
            dom: newData2.length
          }
          break
      }

      // onf && onf(toNext)
      // onf1 && onf1(toNext)
      switch (type) {
        case 'p':
          values.supplierFinanceList = newData2
          values.assureFinanceList = newData
          values.companyInfoBuyDTO = newData3
          break
        case 'L':
          values.supplierFinanceList = newData2
          values.assureFinanceList = newData
          values.companyInfoLargeDTO = newData3
          break
        case 's':
          values.purchaserFinanceList = newData2
          values.purchaserCreditList = newData
          values.companyInfoSaleDTO = newData3
          break
        case 'w':
          values.assureFinanceList = newData2
          values.companyInfoStorageDTO = newData3
          break
        default:
          break
      }
      return obj
    }
    return dataHandle(values)
  }
  onValidateForm = (saveType, callback) => {
    const {
      isProved,
      pushData,
      deliveryAddress,
      takeGoodsAddress,
      getData,
      err,
      isShow
    } = this.state
    const { type, applyId, id, entrustBuyId } = this.props.location.query
    const { getFieldDecorator, validateFields, getFieldValue } = this.props.form
    const { dispatch } = this.props
    const self = this
    validateFields((err, values) => {
      if (saveType === 'save') {
        err = false
        values = this.props.form.getFieldsValue()
      }
      if (!err) {
        let obj1 = {}
        let obj2 = {}
        let stepThree = {}
        let str = ''
        let arr = []
        let result = true
        // dispatch({
        //   type: 'form/submitStepForm',
        //   payload: {
        //     ...data,
        //     ...values,
        //   },
        // });
        const len = this.writeBackByType(type, values)
        type === 'p'
          ? (result = this.getDom('p', len.dom, len.dom2))
          : type === 's'
            ? (result = this.getDom('s', len.dom, len.dom2))
            : type === 'w'
              ? (result = this.getDom('w', len.dom, len.dom2))
              : type === 'L'
                ? (result = this.getDom('L', len.dom, len.dom2))
                : ''
        if (!result) {
          callback && callback()
          return
        }
        stepThree = {
          ...self.props.incomingstep.buyFirstPartThree,
          applyId: applyId,
          id: id,
          ...values,
          type: saveType === 'save' ? 0 : 1
        }
        switch (type) {
          case 'p':
            dispatch({
              type: 'incomingstep/dataThird',
              payload: { ...stepThree },
              callback: (code, msg, data) => {
                // callback && callback(code, msg, data)
                if (code === 0) {
                  callback && callback()
                  saveType !== 'save'
                    ? router.push(
                      `/incoming/purchase/step4?type=${type}&applyId=${applyId}&id=${
                      data.id
                      }&entrustBuyId=${entrustBuyId}`
                    )
                    : message.success(msg)
                } else {
                  callback && callback()
                  router.push(
                    `/incoming/purchase/step3?type=${type}&applyId=${applyId}&id=${id}&entrustBuyId=${entrustBuyId}`
                  )
                  message.error(msg)
                }
              }
            })
            break
          case 'L':
            dispatch({
              type: 'incomingstep/dataThird',
              payload: { ...stepThree },
              callback: (code, msg, data) => {
                // callback && callback(code, msg, data)
                if (code === 0) {
                  callback && callback()
                  saveType !== 'save'
                    ? router.push(
                      `/incoming/purchase/step4?type=${type}&applyId=${applyId}&id=${
                      data.id
                      }&entrustBuyId=${entrustBuyId}`
                    )
                    : message.success(msg)
                } else {
                  callback && callback()
                  router.push(
                    `/incoming/purchase/step3?type=${type}&applyId=${applyId}&id=${id}&entrustBuyId=${entrustBuyId}`
                  )
                  message.error(msg)
                }
              }
            })
            break
          case 's':
            dispatch({
              type: 'incomingstep/dataThird',
              payload: { ...stepThree },
              callback: (code, msg, data) => {
                if (code === 0) {
                  callback && callback()
                  saveType !== 'save'
                    ? router.push(
                      `/incoming/purchase/step4?type=${type}&applyId=${applyId}&id=${
                      data.id
                      }&entrustBuyId=${entrustBuyId}`
                    )
                    : message.success(msg)
                } else {
                  callback && callback()
                  router.push(
                    `/incoming/purchase/step3?type=${type}&applyId=${applyId}&id=${id}&entrustBuyId=${entrustBuyId}`
                  )
                  message.error(msg)
                }
              }
            })
            break
          case 'w':
            dispatch({
              type: 'incomingstep/dataThird',
              payload: { ...stepThree },
              callback: (code, msg, data) => {
                if (code === 0) {
                  callback && callback()
                  saveType !== 'save'
                    ? router.push(
                      `/incoming/purchase/step4?type=${type}&applyId=${applyId}&id=${
                      data.id
                      }&entrustBuyId=${entrustBuyId}`
                    )
                    : message.success(msg)
                } else {
                  callback && callback()
                  router.push(
                    `/incoming/purchase/step3?type=${type}&applyId=${applyId}&id=${id}&entrustBuyId=${entrustBuyId}`
                  )
                  message.error(msg)
                }
              }
            })
            break
          default:
            break
        }
      } else {
        callback && callback()
        let str = ''
        Object.values(err)[0]
        str = Object.values(err)[0].errors[0].message
        message.error(str)
      }
    })
  }

  render() {
    const { err, isShow, getData } = this.state
    const { type, applyId, id, entrustBuyId } = this.props.location.query
    let title = ''
    if (getData.entrustBuyDTO) {
      title = getData.entrustBuyDTO.applyCompanyName
    }
    const list = ['进件管理', title]
    return (
      <div>
        <ReportHeader
          list={list}
          title={title}
          showInput={false}
          prev={true}
          rcForm={this.props.form}
          prevFun={() =>
            router.push(
              `/incoming/purchase/step2?type=${type}&applyId=${applyId}&id=${id}&entrustBuyId=${entrustBuyId}`
            )
          }
          step={3}
          type={type}
          id={id}
          onValidateFormThree={this.onValidateForm}
          applyId={applyId}
        />
        {isShow ? (
          <Fragment>
            {(type === 'p' || type === 'L') && (
              <div className={styles.content}>
                {/* <BusinessInfo
                  title="委托企业经营信息"
                  extend={true}
                  type={type}
                  rcForm={this.props.form}
                  id={id}
                  applyId={applyId}
                  getData={getData}
                /> */}
                {(type === 'p'
                  ? getData.entrustBuyDetailDTO &&
                  getData.entrustBuyDetailDTO.hasGuarantor
                  : getData.largeEntrustBuyDetailDTO &&
                  getData.largeEntrustBuyDetailDTO.hasGuarantor) === 1 ? (
                    <FinanceInfo
                      title="担保公司财务信息"
                      supplyType="purchase"
                      part="-1"
                      formId={'purchase'}
                      required={this.state.required2}
                      getDom={this.getDom}
                      type={type}
                      id={id}
                      rcForm={this.props.form}
                      applyId={applyId}
                      getData={getData}
                    />
                  ) : (
                    ''
                  )}
                <FinanceInfo
                  title="供货商财务信息"
                  supplyType="supply"
                  getDom={this.getDom}
                  type={type}
                  formId={'supply'}
                  required={this.state.required}
                  part="-2"
                  id={id}
                  rcForm={this.props.form}
                  applyId={applyId}
                  getData={getData}
                />
                <OtherBusinessInfo
                  title="供货商经营信息"
                  type={type}
                  id={id}
                  rcForm={this.props.form}
                  applyId={applyId}
                  getData={getData}
                />
              </div>
            )}

            {type === 's' && (
              <div className={styles.content}>
                <BusinessInfo
                  title="购货商经营信息"
                  extend={false}
                  type={type}
                  id={id}
                  rcForm={this.props.form}
                  applyId={applyId}
                  getData={getData}
                />
                <FinanceInfo
                  title="购货商财务信息"
                  type={type}
                  id={id}
                  formId={'s'}
                  required={this.state.required}
                  rcForm={this.props.form}
                  applyId={applyId}
                  getData={getData}
                />
                <CreditInfo
                  title="购货商征信信息"
                  itemTitle="购货商征信"
                  rcForm={this.props.form}
                  type={type}
                  id={id}
                  applyId={applyId}
                  getData={getData}
                />
              </div>
            )}

            {type === 'w' && (
              <div className={styles.content}>
                {getData.financeStorageDetailDTO &&
                  getData.financeStorageDetailDTO.hasGuarantor === 1 ? (
                    <FinanceInfo
                      title="担保公司财务信息"
                      type={type}
                      formId={'w'}
                      rcForm={this.props.form}
                      required={this.state.required}
                      id={id}
                      applyId={applyId}
                      getData={getData}
                    />
                  ) : (
                    ''
                  )}
                <BusinessInfo
                  title="委托企业经营信息"
                  extend={true}
                  type={type}
                  rcForm={this.props.form}
                  id={id}
                  applyId={applyId}
                  getData={getData}
                />
              </div>
            )}
          </Fragment>
        ) : null}

        <ReportBottom
          step={3}
          broad={5}
          id={id}
          type={type}
          err={err}
          onValidateFormThree={this.onValidateForm}
          applyId={applyId}
          entrustBuyId={entrustBuyId}
        />
      </div>
    )
  }
}
