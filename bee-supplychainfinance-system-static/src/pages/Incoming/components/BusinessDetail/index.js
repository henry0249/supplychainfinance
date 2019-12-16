import React, { Fragment, Component } from 'react'
import { connect } from 'dva'
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Icon,
  Select,
  InputNumber,
  Tooltip,
  DatePicker,
  message,
  Alert
} from 'antd'
import styles from './index.less'
import { DistrictSelect } from '@/components'
import { getSubjectMatterPriceUnitList } from '../../services/incomingstep'
import moment from 'moment'
moment.locale('zh-cn')
import { moneyExp, chineseMon, format } from '@/utils/utils'

const InputGroup = Input.Group
const Option = Select.Option

@connect(({ incomingstep, loading }) => ({
  incomingstep
}))
class BusinessDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isProved: 2,
      guarChange: true,
      logisticsMode: false,
      isCompanyProved: 2,
      companyNameChange: true,
      isShow: 0,
      have: false,
      freight: true,
      checkForwardingCompany: {},
      haveFreight: false,
      isDisplay: false,
      pushData: {},
      YW: [],
      KPMS: [],
      FKTK: [],
      WLFS: [],
      ZFFS: [],
      FKYSTK: [],
      HWJGLX: [],
      HP: [],
      GG: [],
      LYDQ: [],
      SBLX: [],
      DW: [],
      deliveryAddress: null,
      takeGoodsAddress: null,
      sellPirce: null,
      newData: {},
      firstInvoiceRati: false,
      freightForwardCreditId: null,
      guarantorCreditId: null,
      freightForwardScore: false,
      freightForwardScoreTwo: false,
      loading: false
    }
    this.type = this.props.type ? this.props.type : ''
  }

  componentDidUpdate() { }

  componentDidMount() {
    const { dispatch, type, getData, applyId, id, rcForm, editPrice, changeEditPrice } = this.props
    const self = this
    dispatch({
      type: 'incomingstep/setSecondData',
      payload: {}
    })
    getSubjectMatterPriceUnitList().then(res => {
      if (res && res.code === 0) {
        self.setState({
          DW: res.data
        })
      }
    })
    dispatch({
      type: 'incomingstep/getSelect',
      payload: 'YW',
      callback: (code, msg, data) => {
        if (code === 0) {
          this.setState(
            {
              YW: data
            },
            () => {
              const { newData } = this.state
              if (Object.keys(newData).length !== 0) {
                if (newData.hasGuarantor === 1) {
                  self.setState({
                    have: true
                  })
                  if (newData.guarantorName && newData.guarantorCreditId) {
                    self.setState(
                      {
                        isProved: 1
                        // guarChange: false
                      },
                      () => {
                        this.props.getIsProved(
                          this.state.isProved,
                          this.state.isCompanyProved
                        )
                      }
                    )
                  }
                }
                if (type !== 'w') {
                  if (newData.freightForwardName) {
                    self.setState({
                      haveFreight: true
                    })
                  }
                }
                // if (newData.freightForwardName) {
                // self.setState({
                //   haveFreight: true
                // })
                if (
                  newData.freightForwardCreditId &&
                  newData.freightForwardName
                ) {
                  self.setState(
                    {
                      isCompanyProved: 1
                      // companyNameChange: false
                    },
                    () => {
                      this.props.getIsProved(
                        this.state.isProved,
                        this.state.isCompanyProved
                      )
                    }
                  )
                }
                // } else {
                //   self.setState({
                //     haveFreight: false
                //   })
                // }
                rcForm.setFieldsValue({
                  hasGuarantor: newData.hasGuarantor
                    ? String(newData.hasGuarantor)
                    : '2',
                  hasFreight: newData.freightForwardName ? '1' : '2'
                })
              }
            }
          )
        }
      }
    })
    dispatch({
      type: 'incomingstep/getSelect',
      payload: 'KPMS',
      callback: (code, msg, data) => {
        if (code === 0) {
          this.setState(
            {
              KPMS: data
            },
            () => {
              const { newData } = this.state
              if (newData) {
                switch (type) {
                  case 'p':
                    if (newData.invoiceMode === 2) {
                      rcForm.setFieldsValue({
                        firstInvoiceRatio: 0
                      })
                      self.setState({
                        firstInvoiceRatio: true
                      })
                    }
                    rcForm.setFieldsValue({
                      invoiceMode: newData.invoiceMode
                        ? String(newData.invoiceMode)
                        : null
                    })
                    break
                  case 's':
                    rcForm.setFieldsValue({
                      logisticsMode: newData.logisticsMode
                        ? String(newData.logisticsMode)
                        : null
                    })
                    break
                  case 'w':
                    rcForm.setFieldsValue({
                      paymentMode: newData.paymentMode
                        ? String(newData.paymentMode)
                        : null
                    })
                    break
                  default:
                    break
                }
              }
            }
          )
        }
      }
    })
    dispatch({
      type: 'incomingstep/getSelect',
      payload: 'FKTK',
      callback: (code, msg, data) => {
        if (code === 0) {
          this.setState(
            {
              FKTK: data
            },
            () => {
              const { newData } = this.state
              if (newData) {
                switch (type) {
                  case 'p':
                    rcForm.setFieldsValue({
                      paymentProvision: newData.paymentProvision
                        ? String(newData.paymentProvision)
                        : null
                    })
                    break
                  case 'L':
                    rcForm.setFieldsValue({
                      paymentProvision: newData.paymentProvision
                        ? String(newData.paymentProvision)
                        : null
                    })
                    break
                  case 's':
                    self.paymentProvisionChange(
                      String(newData.paymentProvision)
                    )
                    rcForm.setFieldsValue({
                      paymentProvision: newData.paymentProvision
                        ? String(newData.paymentProvision)
                        : null
                    })
                    break
                  case 'w':
                    break
                }
              }
            }
          )
        }
      }
    })
    dispatch({
      type: 'incomingstep/getSelect',
      payload: 'FKYSTK',
      callback: (code, msg, data) => {
        if (code === 0) {
          this.setState(
            {
              FKYSTK: data
            },
            () => {
              const { newData } = this.state
            }
          )
        }
      }
    })
    dispatch({
      type: 'incomingstep/getSelect',
      payload: 'WLFS',
      callback: (code, msg, data) => {
        if (code === 0) {
          this.setState({
            WLFS: data
          })
        }
      }
    })
    dispatch({
      type: 'incomingstep/getSubjectMatterList',
      callback: (code, msg, data) => {
        if (code === 0) {
          this.setState(
            {
              HP: data
            },
            () => {
              const { newData } = this.state
              if (newData) {
                if (newData.tradeGoods) {
                  this.tradeGoodsSelect(newData.tradeGoods)
                } else {
                  this.tradeGoodsSelect(
                    self.data.entrustBuyDTO.tradeGoodsDetail
                  )
                }
              }
            }
          )
        }
      }
    })
    dispatch({
      type: 'incomingstep/getSelect',
      payload: 'ZFFS',
      callback: (code, msg, data) => {
        if (code === 0) {
          this.setState(
            {
              ZFFS: data
            },
            () => {
              const { newData } = this.state
              if (newData) {
                switch (type) {
                  case 'p':
                    break
                  case 's':
                    rcForm.setFieldsValue({
                      paymentMode: newData.paymentMode
                        ? String(newData.paymentMode)
                        : null
                    })
                    break
                  case 'w':
                    break
                }
              }
            }
          )
        }
      }
    })
    dispatch({
      type: 'incomingstep/getSelect',
      payload: 'HWJGLX',
      callback: (code, msg, data) => {
        if (code === 0) {
          this.setState(
            {
              HWJGLX: data
            },
            () => {
              const { newData } = this.state
              if (newData) {
                rcForm.setFieldsValue({
                  deliveryType: newData.deliveryType
                })
              }
            }
          )
        }
      }
    })
    dispatch({
      type: 'incomingstep/getSelect',
      payload: 'SBLX',
      callback: (code, msg, data) => {
        if (code === 0) {
          this.setState({
            SBLX: data
          })
        }
      }
    })
    switch (type) {
      case 'p':
        if (getData.entrustBuyDetailDTO) {
          if (getData.entrustBuyDetailDTO.sellingPriceElse) {
            changeEditPrice(true)
          }
          this.setState({
            newData: getData.entrustBuyDetailDTO
          }, () => {
            this.setState({
              freightForwardCreditId: getData.entrustBuyDetailDTO
                .freightForwardCreditId
                ? getData.entrustBuyDetailDTO.freightForwardCreditId
                : null,
              guarantorCreditId: getData.entrustBuyDetailDTO
                .guarantorCreditId
                ? getData.entrustBuyDetailDTO.guarantorCreditId
                : null
            }, () => {
              const {
                newData,
                freightForwardCreditId,
                guarantorCreditId
              } = self.state
              if (newData.sellingPrice || newData.sellingPriceElse || newData.purchasingPrice) {
                this.props.rcForm.setFieldsValue({
                  purchasingPrice: newData.purchasingPrice,
                  sellingPrice: newData.sellingPriceElse ? newData.sellingPriceElse : newData.sellingPrice
                })
              }
              if (newData.takeGoodsAddress || newData.deliveryAddresss) {
                rcForm.setFieldsValue({
                  deliveryAddress: newData.deliveryAddress,
                  takeGoodsAddress: newData.takeGoodsAddress
                })
              }
              this.props.dispatch({
                type: 'incomingstep/setSecondData',
                payload: {
                  ...this.props.incomingstep.buyFirstPartTwo,
                  freightForwardCreditId: freightForwardCreditId,
                  guarantorCreditId: guarantorCreditId
                }
              })
            })
          })
        }
        break
      case 'L':
        if (getData.largeEntrustBuyDetailDTO) {
          if (getData.largeEntrustBuyDetailDTO.sellingPriceElse) {
            changeEditPrice(true);
          }
          this.setState({
            newData: getData.largeEntrustBuyDetailDTO
          }, () => {
            this.setState({
              freightForwardCreditId: getData.largeEntrustBuyDetailDTO
                .freightForwardCreditId
                ? getData.largeEntrustBuyDetailDTO.freightForwardCreditId
                : null,
              guarantorCreditId: getData.largeEntrustBuyDetailDTO
                .guarantorCreditId
                ? getData.largeEntrustBuyDetailDTO.guarantorCreditId
                : null
            }, () => {
              const {
                newData,
                freightForwardCreditId,
                guarantorCreditId
              } = self.state
              if (newData.sellingPrice || newData.sellingPriceElse || newData.purchasingPrice) {
                this.props.rcForm.setFieldsValue({
                  purchasingPrice: newData.purchasingPrice,
                  sellingPrice: newData.sellingPriceElse ? newData.sellingPriceElse : newData.sellingPrice
                })
              }
              if (newData.takeGoodsAddress || newData.deliveryAddresss) {
                rcForm.setFieldsValue({
                  deliveryAddress: newData.deliveryAddress,
                  takeGoodsAddress: newData.takeGoodsAddress
                })
              }
              this.props.dispatch({
                type: 'incomingstep/setSecondData',
                payload: {
                  ...this.props.incomingstep.buyFirstPartTwo,
                  freightForwardCreditId: freightForwardCreditId,
                  guarantorCreditId: guarantorCreditId
                }
              })
            })
          })
        }
        break
      case 's':
        if (getData.entrustSaleDetailDTO) {
          if (getData.entrustSaleDetailDTO.purchasePriceElse) {
            changeEditPrice(true)
          }
          this.setState({
            newData: getData.entrustSaleDetailDTO
          }, () => {
            const { newData } = self.state
            if (newData.purchasePrice || newData.purchasePriceElse || newData.purchasingPrice) {
              this.props.rcForm.setFieldsValue({
                purchasingPrice: newData.purchasingPrice,
                purchasePrice: newData.purchasePriceElse ? newData.purchasePriceElse : newData.purchasePrice
              })
            } else {
              const {
                taxRate,
                unitPrice,
                paymentRatio,
                capitalOccupationDays,
                annualRate
              } = newData
              let deputePrice,
                basePrice,
                unBasePrice,
                unDeputePrice,
                inDeputePrice,
                factor = ''
              //单价*品位 (销售价格，采购价格)
              deputePrice = unitPrice ? Number(unitPrice) : ''
              //年化利率/360*资金占用天数(委托采购)
              unBasePrice = deputePrice
                ? ((Number(annualRate) / 100) *
                  Number(capitalOccupationDays)) /
                360
                : ''
              //采购价格+采购价格*（年化利率/360）*资金占用天数
              basePrice = deputePrice ? deputePrice * unBasePrice : ''
              //委托采购的销售价格
              unDeputePrice = basePrice
                ? deputePrice +
                basePrice +
                (basePrice * taxRate) / 100 +
                ((basePrice * taxRate) / 100) * 0.1 +
                (deputePrice * 0.06) / 100
                : ''
              //委托销售公因式 (年化利率*资金占用天数/360+年化利率*资金占用天数/360*税率+年化利率*资金占用天数/360*税率*0.1)
              factor =
                unBasePrice +
                (unBasePrice * taxRate) / 100 +
                ((unBasePrice * taxRate) / 100) * 0.1 +
                0.06 / 100 +
                1
              //委托销售的采购价格
              inDeputePrice =
                factor || factor === 0
                  ? deputePrice -
                  ((((deputePrice / factor) * Number(paymentRatio)) / 100) *
                    factor -
                    ((deputePrice / factor) * Number(paymentRatio)) / 100)
                  : ''
              self.props.rcForm.setFieldsValue({
                purchasingPrice: deputePrice ? Math.round(deputePrice * 100) / 100 : '',
              })
              if (!editPrice) {
                self.props.rcForm.setFieldsValue({
                  sellingPrice: unDeputePrice ? Math.round(unDeputePrice * 100) / 100 : '',
                  purchasePrice: inDeputePrice ? Math.round(inDeputePrice * 100) / 100 : ''
                })
              }
            }
            if (newData.latestPaymentTime) {
              self.props.rcForm.setFieldsValue({
                latestPaymentTime: moment(newData.latestPaymentTime)
              })
            }

            this.setState({
              freightForwardCreditId: newData.freightForwardCreditId
                ? newData.freightForwardCreditId
                : null,
              guarantorCreditId: newData.guarantorCreditId
                ? newData.guarantorCreditId
                : null
            }, () => {
              const {
                freightForwardCreditId,
                guarantorCreditId
              } = self.state
              this.props.dispatch({
                type: 'incomingstep/setSecondData',
                payload: {
                  ...this.props.incomingstep.buyFirstPartTwo,
                  freightForwardCreditId: freightForwardCreditId,
                  guarantorCreditId: guarantorCreditId
                }
              })
            })
          })
        }
        break
      case 'w':
        if (getData.financeStorageDetailDTO) {
          this.setState({
            newData: getData.financeStorageDetailDTO
          }, () => {
            const { newData } = self.state
            if (newData.latestDeliveryDate) {
              self.props.rcForm.setFieldsValue({
                latestDeliveryDate: moment(newData.latestDeliveryDate)
              })
            }

            this.setState(
              {
                freightForwardCreditId: newData.freightForwardCreditId
                  ? newData.freightForwardCreditId
                  : null,
                guarantorCreditId: newData.guarantorCreditId
                  ? newData.guarantorCreditId
                  : null
              },
              () => {
                const {
                  freightForwardCreditId,
                  guarantorCreditId
                } = self.state
                this.props.dispatch({
                  type: 'incomingstep/setSecondData',
                  payload: {
                    ...this.props.incomingstep.buyFirstPartTwo,
                    freightForwardCreditId: freightForwardCreditId,
                    guarantorCreditId: guarantorCreditId
                  }
                })
              }
            )
          })
        }
        break
      default:
        break
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { pushData } = nextProps
    // 当传入的type发生变化的时候，更新state
    if (pushData !== prevState.pushData) {
      return {
        pushData
      }
    }
    // 否则，对于state不进行任何操作
    return null
  }

  tradeGoodsSelect = (e, type) => {
    const { dispatch } = this.props
    const self = this
    dispatch({
      type: 'incomingstep/getSubjectMatterInfo',
      payload: e,
      callback: (code, msg, data) => {
        if (code === 0) {
          const { newData } = this.state
          if (data.ifStandard !== undefined) {
            if (type !== 1) {
              if (newData.tradeGoods) {
                this.props.rcForm.setFieldsValue({
                  tradeGoods: newData.tradeGoods
                })
              } else {
                this.props.rcForm.setFieldsValue({
                  tradeGoods: self.data.entrustBuyDTO.tradeGoodsDetail
                })
              }
            }
            this.setState(
              {
                isDisplay: !data.ifStandard,
                GG: data.specificationsDTOS
              },
              () => {
                let arr = []
                if (newData) {
                  if (type !== 1) {
                    this.props.rcForm.setFieldsValue({
                      specifications: newData.specifications,
                      sourceArea: newData.sourceArea
                    })
                  } else {
                    this.props.rcForm.setFieldsValue({
                      specifications: '',
                      sourceArea: ''
                    })
                  }

                  this.state.GG &&
                    this.state.GG.forEach(item => {
                      if (item.specifications === newData.specifications) {
                        arr = item.sourceAddressDTOS
                      }
                    })
                  self.setState({
                    LYDQ: arr
                  })
                }
              }
            )
          }
        }
      }
    })
  }

  setValues = (e, type) => {
    // const data = this.props.incomingstep.buyDetail.code === 0 ? this.props.incomingstep.buyDetail.data : {};
    const { editPrice } = this.props
    const { getFieldValue } = this.props.rcForm
    let deputePrice,
      basePrice,
      unBasePrice,
      unDeputePrice,
      inDeputePrice,
      factor = ''
    if (type === 1) {
      //单价*品位 (销售价格，采购价格)
      deputePrice = e.target.value ? Number(e.target.value) : ''
      //年化利率/360*资金占用天数(委托采购)
      unBasePrice = deputePrice
        ? ((Number(getFieldValue('annualRate')) / 100) *
          Number(getFieldValue('capitalOccupationDays'))) /
        360
        : ''
      //采购价格+采购价格*（年化利率/360）*资金占用天数
      basePrice = deputePrice ? deputePrice * unBasePrice : ''
      //委托采购的销售价格
      unDeputePrice = basePrice
        ? deputePrice +
        basePrice +
        (basePrice * getFieldValue('taxRate')) / 100 +
        ((basePrice * getFieldValue('taxRate')) / 100) * 0.1 +
        (deputePrice * 0.06) / 100
        : ''
      //委托销售公因式 (年化利率*资金占用天数/360+年化利率*资金占用天数/360*税率+年化利率*资金占用天数/360*税率*0.1)
      factor =
        unBasePrice +
        (unBasePrice * getFieldValue('taxRate')) / 100 +
        ((unBasePrice * getFieldValue('taxRate')) / 100) * 0.1 +
        0.06 / 100 +
        1
      //委托销售的采购价格
      inDeputePrice =
        factor || factor === 0
          ? deputePrice -
          ((((deputePrice / factor) * Number(getFieldValue('paymentRatio'))) /
            100) *
            factor -
            ((deputePrice / factor) * Number(getFieldValue('paymentRatio'))) /
            100)
          : ''
    } else if (type === 2) {
      deputePrice = getFieldValue('unitPrice')
        ? Number(getFieldValue('unitPrice'))
        : ''
      //年化利率*资金占用天数/360
      unBasePrice = deputePrice
        ? ((Number(e) / 100) * Number(getFieldValue('capitalOccupationDays'))) /
        360
        : ''
      //采购价格+采购价格*（年化利率/360）*资金占用天数
      basePrice = deputePrice ? deputePrice * unBasePrice : ''
      //委托采购的销售价格
      unDeputePrice = basePrice
        ? deputePrice +
        basePrice +
        (basePrice * getFieldValue('taxRate')) / 100 +
        ((basePrice * getFieldValue('taxRate')) / 100) * 0.1 +
        (deputePrice * 0.06) / 100
        : ''

      //委托销售公因式 (年化利率*资金占用天数/360+年化利率*资金占用天数/360*税率+年化利率*资金占用天数/360*税率*0.1)
      factor =
        unBasePrice +
        (unBasePrice * getFieldValue('taxRate')) / 100 +
        ((unBasePrice * getFieldValue('taxRate')) / 100) * 0.1 +
        0.06 / 100 +
        1
      //委托销售的采购价格
      inDeputePrice =
        factor || factor === 0
          ? deputePrice -
          ((((deputePrice / factor) * Number(getFieldValue('paymentRatio'))) /
            100) *
            factor -
            ((deputePrice / factor) * Number(getFieldValue('paymentRatio'))) /
            100)
          : ''
    } else if (type === 3) {
      deputePrice = Number(getFieldValue('unitPrice'))
        ? Number(getFieldValue('unitPrice'))
        : ''
      //年化利率*资金占用天数/360
      unBasePrice = deputePrice
        ? ((Number(getFieldValue('annualRate')) / 100) * Number(e)) / 360
        : ''
      //采购价格+采购价格*（年化利率/360）*资金占用天数
      basePrice = deputePrice ? deputePrice * unBasePrice : ''
      //委托采购的销售价格
      unDeputePrice = basePrice
        ? deputePrice +
        basePrice +
        (basePrice * getFieldValue('taxRate')) / 100 +
        ((basePrice * getFieldValue('taxRate')) / 100) * 0.1 +
        (deputePrice * 0.06) / 100
        : ''
      //委托销售公因式 (年化利率*资金占用天数/360+年化利率*资金占用天数/360*税率+年化利率*资金占用天数/360*税率*0.1)
      factor =
        unBasePrice +
        (unBasePrice * getFieldValue('taxRate')) / 100 +
        ((unBasePrice * getFieldValue('taxRate')) / 100) * 0.1 +
        0.06 / 100 +
        1
      //委托销售的采购价格
      inDeputePrice =
        factor || factor === 0
          ? deputePrice -
          ((((deputePrice / factor) * Number(getFieldValue('paymentRatio'))) /
            100) *
            factor -
            ((deputePrice / factor) * Number(getFieldValue('paymentRatio'))) /
            100)
          : ''
    } else if (type === 4) {
      const taxRate = e ? Number(e) / 100 : ''
      //单价*品位 (销售价格，采购价格)
      deputePrice = Number(getFieldValue('unitPrice'))
        ? Number(getFieldValue('unitPrice'))
        : ''
      //年化利率*资金占用天数/360
      unBasePrice = deputePrice
        ? ((Number(getFieldValue('annualRate')) / 100) *
          Number(getFieldValue('capitalOccupationDays'))) /
        360
        : ''
      //采购价格*（年化利率/360）*资金占用天数
      basePrice = deputePrice ? deputePrice * unBasePrice : ''
      //委托采购的销售价格
      unDeputePrice = basePrice
        ? deputePrice +
        basePrice +
        basePrice * taxRate +
        basePrice * taxRate * 0.1 +
        (deputePrice * 0.06) / 100
        : ''

      //委托销售公因式 (年化利率*资金占用天数/360+年化利率*资金占用天数/360*税率+年化利率*资金占用天数/360*税率*0.1)
      factor =
        unBasePrice +
        unBasePrice * taxRate +
        unBasePrice * taxRate * 0.1 +
        0.06 / 100 +
        1
      //委托销售的采购价格
      inDeputePrice =
        factor || factor === 0
          ? deputePrice -
          ((((deputePrice / factor) * Number(getFieldValue('paymentRatio'))) /
            100) *
            factor -
            ((deputePrice / factor) * Number(getFieldValue('paymentRatio'))) /
            100)
          : ''
    } else if (type === 5) {
      const paymentRatio = e ? Number(e) / 100 : ''
      //单价*品位 (销售价格，采购价格)
      deputePrice = Number(getFieldValue('unitPrice'))
        ? Number(getFieldValue('unitPrice'))
        : ''
      //年化利率*资金占用天数/360
      unBasePrice = deputePrice
        ? ((Number(getFieldValue('annualRate')) / 100) *
          Number(getFieldValue('capitalOccupationDays'))) /
        360
        : ''
      //采购价格*（年化利率/360）*资金占用天数
      basePrice = deputePrice ? deputePrice * unBasePrice : ''
      //委托采购的销售价格
      unDeputePrice = basePrice
        ? deputePrice +
        basePrice +
        (basePrice * getFieldValue('taxRate')) / 100 +
        ((basePrice * getFieldValue('taxRate')) / 100) * 0.1 +
        (deputePrice * 0.06) / 100
        : ''

      //委托销售公因式 (年化利率*资金占用天数/360+年化利率*资金占用天数/360*税率+年化利率*资金占用天数/360*税率*0.1)
      factor =
        unBasePrice +
        (unBasePrice * getFieldValue('taxRate')) / 100 +
        ((unBasePrice * getFieldValue('taxRate')) / 100) * 0.1 +
        0.06 / 100 +
        1
      //委托销售的采购价格
      inDeputePrice =
        factor || factor === 0
          ? deputePrice -
          ((deputePrice / factor) * paymentRatio * factor -
            (deputePrice / factor) * paymentRatio)
          : ''
    }
    this.props.rcForm.setFieldsValue({
      purchasingPrice: deputePrice ? Math.round(deputePrice * 100) / 100 : '',
    })
    if (!editPrice) {
      this.props.rcForm.setFieldsValue({
        sellingPrice: unDeputePrice ? Math.round(unDeputePrice * 100) / 100 : '',
        purchasePrice: inDeputePrice ? Math.round(inDeputePrice * 100) / 100 : ''
      })
    }
  }

  prodChange = e => {
    let arr = []
    this.props.rcForm.setFieldsValue({
      sourceArea: ''
    })
    this.state.GG.forEach(item => {
      if (item.specifications === e) {
        arr = item.sourceAddressDTOS
      }
    })
    if (arr.length === 1) {
      this.props.rcForm.setFieldsValue({
        sourceArea: arr[0]
          ? arr[0].tradeGoodsCode + '_' + arr[0].sourceAddress
          : ''
      })
    }
    this.setState({
      LYDQ: arr
    })
  }

  haveGuarante = e => {
    const { type } = this.props
    const self = this
    if (e === '1') {
      this.setState(
        {
          have: true
        },
        () => {
          if (type === 'p' || type === 'L') {
            this.props.rcForm.setFieldsValue({
              marginRates: 0
            })
          }
        }
      )
    } else {
      this.props.rcForm.setFieldsValue({ guarantorName: '' })
      this.setState({
        have: false,
        isProved: 2
      })
    }
  }

  haveFreight = e => {
    const self = this
    if (e === '1') {
      this.setState(
        {
          haveFreight: true
        },
        () => { }
      )
    } else {
      this.props.rcForm.setFieldsValue({ freightForwardName: '' })
      this.setState({
        haveFreight: false,
        isCompanyProved: 2
      })
    }
  }

  invoiceModeChange(e) {
    if (e === '1') {
      this.setState({
        firstInvoiceRatio: false
      })
    } else {
      this.setState(
        {
          firstInvoiceRatio: true
        },
        () => {
          this.props.rcForm.setFieldsValue({ firstInvoiceRatio: 0 })
        }
      )
    }
  }

  selectAddress = e => {
    this.setState(
      {
        deliveryAddress: e
      },
      () => {
        const { deliveryAddress } = this.state
        // this.props.dispatch({
        //   type: "incomingstep/setSecondData",
        //   payload: {
        //     ...this.props.incomingstep.buyFirstPartTwo,
        //     deliveryAddress: deliveryAddress,
        //     applyId: this.props.applyId,
        //     id: this.props.id
        //   }
        // });
        this.props.rcForm.setFieldsValue({
          deliveryAddress: deliveryAddress
        })
      }
    )
  }

  selectTakeAddress = e => {
    this.setState(
      {
        takeGoodsAddress: e
      },
      () => {
        const { takeGoodsAddress } = this.state
        // this.props.dispatch({
        //   type: "incomingstep/setSecondData",
        //   payload: {
        //     ...this.props.incomingstep.buyFirstPartTwo,
        //     takeGoodsAddress: takeGoodsAddress,
        //     applyId: this.props.applyId,
        //     id: this.props.id
        //   }
        // });
        this.props.rcForm.setFieldsValue({
          takeGoodsAddress: takeGoodsAddress
        })
      }
    )
  }

  //付款运输条款处理函数
  paymentProvisionChange = e => {
    if (e === '2') {
      this.setState({
        logisticsMode: true,
        freight: false,
        haveFreight: false
      })
      this.props.rcForm.setFieldsValue({
        hasFreight: '2',
        logisticsMode: '',
        freightForwardName: ''
      })
    } else {
      this.setState({
        logisticsMode: false,
        freight: true,
        haveFreight: true
      })
    }
  }

  datepick = current => {
    return current && current < moment().endOf('day')
  }

  onProve = (type, companyType) => {
    let companyName = ''
    let companyBaseId = null
    let tast = ''
    let tastId = ''
    const self = this
    const {
      freightForwardCreditId,
      guarantorCreditId,
      isDisplay,
      haveFreight,
      newData
    } = self.state
    const { setFieldsValue } = this.props.rcForm
    switch (type) {
      case 'p':
        if (companyType === 'guar') {
          companyName = self.props.rcForm.getFieldValue('guarantorName')
          companyBaseId = guarantorCreditId
        } else {
          companyName = self.props.rcForm.getFieldValue('freightForwardName')
          companyBaseId = freightForwardCreditId
        }

        break
      case 'L':
        if (companyType === 'guar') {
          companyName = self.props.rcForm.getFieldValue('guarantorName')
          companyBaseId = guarantorCreditId
        } else {
          companyName = self.props.rcForm.getFieldValue('freightForwardName')
          companyBaseId = freightForwardCreditId
        }

        break
      case 's':
        let arr = [
          'tradeGoods',
          'specifications',
          'sourceArea',
          'quantity',
          'unitPrice',
          'paymentProvision',
          'freightForwardName'
        ]
        if (isDisplay) {
          arr.push('grade')
        }
        // if (haveFreight) {
        //   arr.push("freightForwardName")
        // }
        const value = self.props.rcForm.getFieldsValue(arr)
        const goNext = Object.values(value).every(item => {
          return Boolean(item) != false
        })
        if (companyType !== 'guar' && !goNext) {
          self.props.rcForm.validateFields(arr, (err, val) => {
            let str =
              '验证货代公司时必须填入货品、规格、来源地区、数量、单价、质量标准、付款运输条款、货代公司'
            message.error(str)
          })
          return
        }
        if (companyType === 'guar') {
          companyName = self.props.rcForm.getFieldValue('guarantorName')
          companyBaseId = guarantorCreditId
        } else {
          this.setState(
            {
              loading: true
            },
            () => {
              companyName = self.props.rcForm.getFieldValue(
                'freightForwardName'
              )
              companyBaseId = freightForwardCreditId
              const sourceArea = self.props.rcForm.getFieldValue('sourceArea')
              tastId = isNaN(sourceArea.split('_')[0])
                ? newData.tradeGoodsCode
                  ? newData.tradeGoodsCode
                  : ''
                : sourceArea.split('_')[0]
              if (!String(tastId)) {
                message.warning('未在数据库中找到该标的物信息')
                return
              }
              const { dispatch, applyId, entrustBuyId } = self.props
              self.props.dispatch({
                type: 'incomingstep/checkForwardingCompany',
                payload: {
                  applyId: entrustBuyId,
                  companyName: companyName,
                  companyBaseId: companyBaseId,
                  tast: String(tastId)
                },
                callback(code, msg, data) {
                  self.setState(
                    {
                      loading: false
                    },
                    () => {
                      if (code === 0) {
                        if (data.status !== 1) {
                          message.error('系统对该企业查询无结果')
                          self.setState({
                            loading: false,
                            freightForwardScore: false,
                            freightForwardScoreTwo: false
                          })
                          return
                        }
                        if (data.isInWhiteList === 1) {
                          self.setState({
                            freightForwardScore: true
                          })
                        } else {
                          self.setState({
                            freightForwardScore: false
                          })
                        }
                        if (data.operName) {
                          setFieldsValue({
                            freightForwardCorporation: data.operName
                          })
                        }
                        self.setState(
                          {
                            isCompanyProved: data.status,
                            companyNameChange: false,
                            checkForwardingCompany: data,
                            freightForwardScoreTwo: data.forwardingScores
                              ? true
                              : false,
                            loading: false
                          },
                          () => {
                            self.props.getIsProved(
                              self.state.isProved,
                              self.state.isCompanyProved
                            )
                            dispatch({
                              type: 'incomingstep/setSecondData',
                              payload: {
                                ...self.props.incomingstep.buyFirstPartTwo,
                                freightForwardCreditId: data.companyBaseId
                              }
                            })
                          }
                        )
                      } else {
                        message.error(msg)
                      }
                    }
                  )
                }
              })
            }
          )
          return
        }
        break
      default:
        if (companyType === 'guar') {
          companyName = self.props.rcForm.getFieldValue('guarantorName')
          companyBaseId = guarantorCreditId
        } else {
          companyName = self.props.rcForm.getFieldValue('freightForwardName')
          companyBaseId = freightForwardCreditId
        }
        break
    }
    const { dispatch, applyId, entrustBuyId } = self.props
    let getData = {}
    self.setState(
      {
        loading: true
      },
      () => {
        dispatch({
          type: 'incomingstep/getCompanyDetail',
          payload: {
            companyName: companyName,
            applyId: entrustBuyId,
            companyBaseId: companyBaseId
          },
          callback: (code, msg, data) => {
            if (code === 0) {
              if (companyType === 'guar') {
                self.setState(
                  {
                    isProved: data.status,
                    guarChange: false,
                    loading: false
                  },
                  () => {
                    this.props.getIsProved(
                      this.state.isProved,
                      this.state.isCompanyProved
                    )
                    if (data.operName) {
                      setFieldsValue({
                        guarantorCorporation: data.operName
                      })
                    }

                    dispatch({
                      type: 'incomingstep/setSecondData',
                      payload: {
                        ...self.props.incomingstep.buyFirstPartTwo,
                        guarantorCreditId: data.companyBaseId
                      }
                    })
                  }
                )
              } else {
                self.setState(
                  {
                    isCompanyProved: data.status,
                    companyNameChange: false,
                    loading: false
                  },
                  () => {
                    this.props.getIsProved(
                      this.state.isProved,
                      this.state.isCompanyProved
                    )
                    if (data.operName) {
                      setFieldsValue({
                        freightForwardCorporation: data.operName
                      })
                    }
                    dispatch({
                      type: 'incomingstep/setSecondData',
                      payload: {
                        ...self.props.incomingstep.buyFirstPartTwo,
                        freightForwardCreditId: data.companyBaseId
                      }
                    })
                  }
                )
              }
            } else {
              self.setState({
                loading: false
              })
              message.error(msg)
            }
          }
        })
      }
    )
  }

  freightChange = () => {
    this.props.dispatch({
      type: 'incomingstep/setSecondData',
      payload: {
        ...this.props.incomingstep.buyFirstPartTwo,
        freightForwardCreditId: null
      }
    })
    this.setState(
      {
        isCompanyProved: 2,
        companyNameChange: true
      },
      () => {
        this.props.getIsProved(this.state.isProved, this.state.isCompanyProved)
      }
    )
  }

  guarChange = () => {
    this.props.dispatch({
      type: 'incomingstep/setSecondData',
      payload: {
        ...this.props.incomingstep.buyFirstPartTwo,
        guarantorCreditId: null
      }
    })
    this.setState(
      {
        isProved: 2,
        guarChange: true
      },
      () => {
        this.props.getIsProved(this.state.isProved, this.state.isCompanyProved)
      }
    )
  }

  render() {
    const {
      isProved,
      isShow,
      pushData,
      isDisplay,
      have,
      YW,
      KPMS,
      FKTK,
      FKYSTK,
      WLFS,
      ZFFS,
      HWJGLX,
      HP,
      GG,
      LYDQ,
      SBLX,
      freight,
      newData,
      isCompanyProved,
      companyNameChange,
      guarChange,
      checkForwardingCompany,
      haveFreight,
      freightForwardScore,
      freightForwardScoreTwo,
      DW
    } = this.state
    if (this.props.incomingstep.buyDetail.code === 0) {
      this.data = this.props.incomingstep.buyDetail.data
    } else if (this.props.incomingstep.saleDetail.code === 0) {
      this.data = this.props.incomingstep.saleDetail.data
    } else if (this.props.incomingstep.storageDetail.code === 0) {
      this.data = this.props.incomingstep.storageDetail.data
    } else {
      this.data = this.props.incomingstep.largeBuyDetail.data
    }
    const type = this.props.type
    let data = ''
    let dataOne = ''
    if (Object.keys(newData).length !== 0) {
      switch (type) {
        case 's':
          data = this.data.entrustBuyDTO
          // dataOne = this.data.entrustSaleDetailDTO ? this.data.entrustSaleDetailDTO : "";
          break
        case 'p':
          data = this.data.entrustBuyDTO
          // dataOne = this.data.entrustBuyDetailDTO ? this.data.entrustBuyDetailDTO : "";
          break
        case 'L':
          data = this.data.entrustBuyDTO
          // dataOne = this.data.entrustBuyDetailDTO ? this.data.entrustBuyDetailDTO : "";
          break
        case 'w':
          data = this.data.entrustBuyDTO
          // dataOne = this.data.financeStorageDetailDTO ? this.data.financeStorageDetailDTO : "";
          break
        default:
          break
      }
      dataOne = newData
    }
    const { rcForm, dispatch, applyId, id, editPrice, changeEditPrice } = this.props
    const { getFieldDecorator, validateFields, getFieldValue } = rcForm
    return (
      <Fragment>
        <Card>
          <h3 className={styles.stepTwoHead}>业务详细信息</h3>
        </Card>
        <Form layout="vertical" className={styles.stepSecondForm}>
          <Card>
            <Row>
              <Col sm={8} xs={10}>
                <Form.Item layout="vertical" label="货品">
                  {getFieldDecorator('tradeGoods', {
                    // initialValue: data.tradeGoodsDetail
                    //   ? data.tradeGoodsDetail
                    //   : null,
                    rules: [{ required: true, message: '请选择货品' }]
                  })(
                    <Select
                      style={{ width: '79%' }}
                      onChange={e => this.tradeGoodsSelect(e, 1)}
                    >
                      {HP[0]
                        ? HP.map(item => {
                          return (
                            <Option
                              key={item.sysCodeVal}
                              value={item.sysCodeVal}
                            >
                              {item.sysCodeVal}
                            </Option>
                          )
                        })
                        : null}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col sm={8} xs={10}>
                <Form.Item layout="vertical" label="规格">
                  {getFieldDecorator('specifications', {
                    // initialValue: dataOne.specifications ? dataOne.specifications : "请选择",
                    rules: [{ required: true, message: '请选择规格' }]
                  })(
                    <Select style={{ width: '79%' }} onChange={this.prodChange}>
                      {GG
                        ? GG.map(item => {
                          return (
                            <Option
                              value={item.specifications}
                              key={item.specifications}
                            >
                              {item.specifications}
                            </Option>
                          )
                        })
                        : ''}
                      {/* <Option value="标准产品">标准产品</Option>
                      <Option value="非标准产品">非标准产品</Option> */}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col sm={8} xs={10}>
                <Form.Item layout="vertical" label="来源地区">
                  {getFieldDecorator('sourceArea', {
                    // initialValue: dataOne.sourceArea ? dataOne.sourceArea : "请选择",
                    rules: [{ required: true, message: '请选择来源地区' }]
                  })(
                    <Select style={{ width: '79%' }}>
                      {LYDQ
                        ? LYDQ.map(item => {
                          return (
                            <Option
                              key={item.tradeGoodsCode}
                              value={
                                item.tradeGoodsCode + '_' + item.sourceAddress
                              }
                            >
                              {item.sourceAddress}
                            </Option>
                          )
                        })
                        : null}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col sm={8} xs={10}>
                <Form.Item layout="vertical" label="数量：">
                  {getFieldDecorator('quantity', {
                    initialValue:
                      dataOne.quantity || dataOne.quantity === 0
                        ? dataOne.quantity
                        : null,
                    rules: [
                      {
                        required: true,
                        message: '请填入数量',
                        max: 10000000000,
                        type: 'number'
                      }
                    ]
                  })(<InputNumber placeholder="请输入" />)}
                  <span style={{ marginLeft: '10px' }}>吨</span>
                </Form.Item>
              </Col>
              <Col sm={8} xs={6}>
                <Form.Item layout="vertical" label="单价">
                  {getFieldDecorator('unitPrice', {
                    initialValue:
                      dataOne.unitPrice || dataOne.unitPrice === 0
                        ? dataOne.unitPrice
                        : null,
                    rules: [
                      {
                        required: true,
                        message: '13位数字/两位小数',
                        pattern: moneyExp
                        // pattern: new RegExp(/^.{1,}$/)
                      }
                    ]
                  })(
                    <Input
                      addonBefore="￥"
                      // style={{ width: "79%" }}
                      onChange={e => this.setValues(e, 1)}
                    />
                  )}
                </Form.Item>
                <span class="chineseMon">
                  {chineseMon(
                    Number(this.props.rcForm.getFieldValue('unitPrice'))
                  )}
                  <span style={{ marginLeft: 20 }}>
                    {format(
                      Number(this.props.rcForm.getFieldValue('unitPrice'))
                    )}
                  </span>
                </span>
              </Col>
              <Col
                sm={1}
                xs={1}
                style={{ height: 93, lineHeight: '90px', textAlign: 'center' }}
              >
                /
              </Col>
              <Col sm={4} xs={4}>
                <Form.Item layout="vertical" label="单位">
                  {getFieldDecorator('unit', {
                    initialValue: dataOne.unit ? dataOne.unit : '元/吨',
                    rules: [
                      {
                        required: true,
                        message: '请选择单位'
                      }
                    ]
                  })(
                    <Select style={{ width: '58.5%' }}>
                      {DW.map(item => {
                        return (
                          <Option key={item.sysCode} value={item.sysCodeVal}>
                            {item.sysCodeVal}
                          </Option>
                        )
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col sm={5} xs={4}>
                {isDisplay ? (
                  <Form.Item layout="vertical" label="质量标准">
                    {getFieldDecorator('grade', {
                      initialValue: dataOne.grade ? dataOne.grade : null,
                      rules: [
                        {
                          required: true,
                          message: '请填入质量标准',
                          max: 10000000000,
                          type: 'number'
                        }
                      ]
                    })(<InputNumber placeholder="请输入" />)}
                  </Form.Item>
                ) : null}
              </Col>
            </Row>
          </Card>
          {type === 'p' || type === 'L' ? (
            <Card>
              <Row>
                <Col sm={8} xs={10}>
                  <div className={styles.proveWrap}>
                    <div className={styles.proveBox}>
                      <span style={{ marginRight: '10px' }}>
                        <span
                          style={
                            isProved
                              ? { color: 'green', marginRight: '10px' }
                              : { color: '#f00', marginRight: '10px' }
                          }
                        >
                          {have ? (
                            isProved === 2 ? (
                              <Icon
                                type="info-circle"
                                theme="twoTone"
                                twoToneColor="orange"
                              />
                            ) : isProved === 1 ? (
                              <Icon
                                type="check-circle"
                                theme="twoTone"
                                twoToneColor="#52c41a"
                              />
                            ) : (
                                  <Icon
                                    type="close-circle"
                                    theme="twoTone"
                                    twoToneColor="#f00"
                                  />
                                )
                          ) : null}
                        </span>
                        {have ? (
                          isProved === 2 ? (
                            <span>请先验证</span>
                          ) : isProved === 1 ? (
                            <span>验证通过</span>
                          ) : (
                                <span>验证失败</span>
                              )
                        ) : null}
                      </span>
                      <Button
                        type="primary"
                        onClick={this.onProve.bind(this, type, 'guar')}
                        disabled={
                          !(
                            ((have &&
                              this.props.rcForm.getFieldValue(
                                'guarantorName'
                              )) ||
                              isProved === 1) &&
                            guarChange
                          )
                        }
                        loading={this.state.loading}
                      >
                        验证企业
                      </Button>
                    </div>

                    <Form.Item layout="" label="担保企业">
                      {getFieldDecorator('guarantorName', {
                        initialValue: dataOne.guarantorName
                          ? dataOne.guarantorName
                          : '',
                        rules: [
                          {
                            required: have,
                            message: '请填入担保企业，不超过20个字符',
                            max: 20,
                            type: 'string'
                          }
                        ]
                      })(
                        <Input
                          onChange={this.guarChange}
                          addonBefore={getFieldDecorator('hasGuarantor', {
                            rules: [{}]
                          })(
                            <Select
                              placeholder="请选择"
                              style={{ width: 100 }}
                              onChange={this.haveGuarante}
                            >
                              {YW[0]
                                ? YW.map(item => {
                                  return (
                                    <Option
                                      key={item.sysCode}
                                      value={item.sysCode}
                                    >
                                      {item.sysCodeVal}
                                    </Option>
                                  )
                                })
                                : null}
                            </Select>
                          )}
                          style={{ width: '80%' }}
                          disabled={!have}
                        />
                      )}
                    </Form.Item>
                  </div>
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="保证金比例">
                    {getFieldDecorator('marginRates', {
                      initialValue:
                        dataOne.marginRates || dataOne.marginRates === 0
                          ? dataOne.marginRates
                          : null,
                      rules: [
                        {
                          required: true,
                          message: '请填入保证金比例',
                          max: 10000000,
                          type: 'number'
                        }
                      ]
                    })(<InputNumber placeholder="请输入" />)}
                    <span style={{ marginLeft: '10px' }}>%</span>
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10}>
                  {have && (
                    <Form.Item layout="vertical" label="担保企业法人姓名">
                      {getFieldDecorator('guarantorCorporation', {
                        initialValue:
                          dataOne.guarantorCorporation ||
                          dataOne.guarantorCorporation,
                        rules: [
                          {
                            required: true,
                            message: '请验证担保企业'
                          }
                        ]
                      })(
                        <Input
                          placeholder="请验证"
                          style={{ width: '80%' }}
                          readOnly
                        />
                      )}
                    </Form.Item>
                  )}
                </Col>
              </Row>
              <Row>
                {have && (
                  <Col sm={8} xs={10}>
                    <Form.Item layout="vertical" label="担保企业法人身份证号">
                      {getFieldDecorator('guarantorCorporationIdcard', {
                        initialValue:
                          dataOne.guarantorCorporationIdcard ||
                          dataOne.guarantorCorporationIdcard,
                        rules: [
                          // {
                          //   required: true,
                          //   message: '请输入法人身份证号！'
                          // },
                          {
                            pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                            message: '身份证格式不正确，请重新输入'
                          }
                        ]
                      })(
                        <Input placeholder="请输入" style={{ width: '80%' }} />
                      )}
                    </Form.Item>
                  </Col>
                )}

                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="货物交割类型">
                    {getFieldDecorator('deliveryType', {
                      rules: [{ required: true, message: '请选择货物交割类型' }]
                    })(
                      <Select style={{ width: '79%' }}>
                        {HWJGLX[0]
                          ? HWJGLX.map(item => {
                            return (
                              <Option
                                key={item.sysCode}
                                value={Number(item.sysCode)}
                              >
                                {item.sysCodeVal}
                              </Option>
                            )
                          })
                          : null}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          ) : type === 's' ? (
            <Card>
              <Row>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="付款（运输）条款">
                    {getFieldDecorator('paymentProvision', {
                      // initialValue: "请选择",
                      rules: [
                        { required: true, message: '请选择付款（运输）条款' }
                      ]
                    })(
                      <Select
                        style={{ width: '79%' }}
                        onChange={this.paymentProvisionChange}
                      >
                        {FKYSTK[0]
                          ? FKYSTK.map(item => {
                            return (
                              <Option key={item.sysCode} value={item.sysCode}>
                                {item.sysCodeVal}
                              </Option>
                            )
                          })
                          : null}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10}>
                  <div className={styles.proveWrap}>
                    <div className={styles.proveBox}>
                      <span style={{ marginRight: '10px' }}>
                        <span
                          style={
                            isProved
                              ? { color: 'green', marginRight: '10px' }
                              : { color: '#f00', marginRight: '10px' }
                          }
                        >
                          {haveFreight ? (
                            isCompanyProved === 2 ? (
                              <Icon
                                type="info-circle"
                                theme="twoTone"
                                twoToneColor="orange"
                              />
                            ) : isCompanyProved === 1 ? (
                              <Icon
                                type="check-circle"
                                theme="twoTone"
                                twoToneColor="#52c41a"
                              />
                            ) : (
                                  <Icon
                                    type="close-circle"
                                    theme="twoTone"
                                    twoToneColor="#f00"
                                  />
                                )
                          ) : null}
                        </span>
                        {haveFreight ? (
                          isCompanyProved === 2 ? (
                            <span>请先验证</span>
                          ) : isCompanyProved === 1 ? (
                            <span>验证通过</span>
                          ) : (
                                <span>验证失败</span>
                              )
                        ) : null}
                      </span>
                      <Button
                        type="primary"
                        onClick={this.onProve.bind(this, type, 'freight')}
                        disabled={
                          !(
                            ((haveFreight &&
                              this.props.rcForm.getFieldValue(
                                'freightForwardName'
                              )) ||
                              isCompanyProved === 1) &&
                            companyNameChange
                          )
                        }
                        loading={this.state.loading}
                      >
                        验证企业
                      </Button>
                    </div>
                    <Form.Item layout="" label="货代公司">
                      {getFieldDecorator('freightForwardName', {
                        initialValue: dataOne.freightForwardName
                          ? dataOne.freightForwardName
                          : '',
                        rules: [
                          {
                            required: haveFreight,
                            message: '请填入货代公司，不超过20个字符',
                            max: 20,
                            type: 'string'
                          }
                        ]
                      })(
                        <Input
                          onChange={this.freightChange}
                          // addonBefore={getFieldDecorator("hasFreight", {
                          //   rules: [{}]
                          // })(
                          //   <Select
                          //     placeholder="请选择"
                          //     style={{ width: 100 }}
                          //     onChange={this.haveFreight}
                          //     disabled={!freight}
                          //   >
                          //     {YW[0]
                          //       ? YW.map(item => {
                          //           return (
                          //             <Option
                          //               key={item.sysCode}
                          //               value={item.sysCode}
                          //             >
                          //               {item.sysCodeVal}
                          //             </Option>
                          //           );
                          //         })
                          //       : null}
                          //   </Select>
                          // )}
                          style={{ width: '80%' }}
                          disabled={!haveFreight}
                        />
                      )}
                    </Form.Item>
                  </div>
                </Col>
                <Col sm={8} xs={10}>
                  {freightForwardScore ? (
                    <Alert
                      message={'平台合作货代企业'}
                      type="info"
                      style={{ marginTop: 21 }}
                    />
                  ) : (
                      ''
                    )}
                </Col>
              </Row>
              <Row>
                {haveFreight && (
                  <Col sm={8} xs={10}>
                    <Form.Item layout="vertical" label="货代公司法人姓名">
                      {getFieldDecorator('freightForwardCorporation', {
                        initialValue:
                          dataOne.freightForwardCorporation ||
                          dataOne.freightForwardCorporation,
                        rules: [
                          {
                            required: true,
                            message: '请验证货代公司'
                          }
                        ]
                      })(
                        <Input
                          placeholder="请验证"
                          style={{ width: '80%' }}
                          readOnly
                        />
                      )}
                    </Form.Item>
                  </Col>
                )}
                {haveFreight && (
                  <Col sm={8} xs={10}>
                    <Form.Item layout="vertical" label="货代公司法人身份证号">
                      {getFieldDecorator('freightForwardCorporationIdcard', {
                        initialValue:
                          dataOne.freightForwardCorporationIdcard ||
                          dataOne.freightForwardCorporationIdcard,
                        rules: [
                          // {
                          //   required: true,
                          //   message: '请输入法人身份证号！'
                          // },
                          {
                            pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                            message: '身份证格式不正确，请重新输入'
                          }
                        ]
                      })(
                        <Input placeholder="请输入" style={{ width: '80%' }} />
                      )}
                    </Form.Item>
                  </Col>
                )}
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="物流方式">
                    {getFieldDecorator('logisticsMode', {
                      initialValue: '请选择',
                      rules: [
                        {
                          required: !this.state.logisticsMode,
                          message: '请填入物流方式，不超过20个字符'
                        }
                      ]
                    })(
                      <Select
                        style={{ width: '79%' }}
                        disabled={this.state.logisticsMode}
                      >
                        {WLFS[0]
                          ? WLFS.map(item => {
                            return (
                              <Option key={item.sysCode} value={item.sysCode}>
                                {item.sysCodeVal}
                              </Option>
                            )
                          })
                          : null}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="验货条件">
                    {getFieldDecorator('inspectionConditions', {
                      initialValue: '过磅单及化验单',
                      rules: [
                        {
                          required: true,
                          message: '请选择验货条件，不超过20个字符',
                          type: 'string',
                          max: 20
                        }
                      ]
                    })(<Input style={{ width: '79%' }} readOnly />)}
                  </Form.Item>
                </Col>
                {/* <Col sm={8} xs={10}>
                  {freightForwardScoreTwo ? (
                    <Alert
                      message={
                        checkForwardingCompany.forwardingScores
                          ? '货代企业基本信息评分: ' +
                            checkForwardingCompany.forwardingScores
                              .goodsBaseInfoIndex
                          : ''
                      }
                      description={
                        checkForwardingCompany.forwardingScores
                          ? '货代企业标的物评分: ' +
                            checkForwardingCompany.forwardingScores
                              .goodsSubjectInfoIndex
                          : ''
                      }
                      type="info"
                      style={{
                        marginTop: -44,
                        marginLeft: '-14%',
                        paddingTop: 36
                      }}
                    />
                  ) : (
                    ''
                  )}
                </Col> */}
              </Row>
            </Card>
          ) : type === 'w' ? (
            <Card>
              <Row>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="委托企业支付方式">
                    {getFieldDecorator('paymentMode', {
                      // initialValue: "",
                      rules: [
                        { required: true, message: '请选择委托企业支付方式' }
                      ]
                    })(
                      <Select placeholder="请选择" style={{ width: '80%' }}>
                        {ZFFS[0]
                          ? ZFFS.map(item => {
                            return (
                              <Option key={item.sysCode} value={item.sysCode}>
                                {item.sysCodeVal}
                              </Option>
                            )
                          })
                          : null}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10}>
                  <div className={styles.proveWrap}>
                    <div className={styles.proveBox}>
                      <span style={{ marginRight: '10px' }}>
                        <span
                          style={
                            isProved
                              ? { color: 'green', marginRight: '10px' }
                              : { color: '#f00', marginRight: '10px' }
                          }
                        >
                          {true ? (
                            isCompanyProved === 2 ? (
                              <Icon
                                type="info-circle"
                                theme="twoTone"
                                twoToneColor="orange"
                              />
                            ) : isCompanyProved === 1 ? (
                              <Icon
                                type="check-circle"
                                theme="twoTone"
                                twoToneColor="#52c41a"
                              />
                            ) : (
                                  <Icon
                                    type="close-circle"
                                    theme="twoTone"
                                    twoToneColor="#f00"
                                  />
                                )
                          ) : null}
                        </span>
                        {true ? (
                          isCompanyProved === 2 ? (
                            <span>请先验证</span>
                          ) : isCompanyProved === 1 ? (
                            <span>验证通过</span>
                          ) : (
                                <span>验证失败</span>
                              )
                        ) : null}
                      </span>
                      <Button
                        type="primary"
                        onClick={this.onProve.bind(this, type, 'freight')}
                        disabled={
                          !(
                            (this.props.rcForm.getFieldValue(
                              'freightForwardName'
                            ) ||
                              isCompanyProved === 1) &&
                            companyNameChange
                          )
                        }
                        loading={this.state.loading}
                      >
                        验证企业
                      </Button>
                    </div>
                    <Form.Item layout="" label="货代公司">
                      {getFieldDecorator('freightForwardName', {
                        initialValue: dataOne.freightForwardName
                          ? dataOne.freightForwardName
                          : '',
                        rules: [
                          {
                            required: true,
                            message: '请填入货代公司，不超过20个字符',
                            max: 20,
                            type: 'string'
                          }
                        ]
                      })(
                        <Input
                          onChange={this.freightChange}
                          // addonBefore={getFieldDecorator("hasFreight", {
                          //   rules: [{}]
                          // })(
                          //   <Select
                          //     placeholder="请选择"
                          //     style={{ width: 100 }}
                          // onChange={this.haveFreight}
                          //   >
                          //     {YW[0]
                          //       ? YW.map(item => {
                          //           return (
                          //             <Option
                          //               key={item.sysCode}
                          //               value={item.sysCode}
                          //             >
                          //               {item.sysCodeVal}
                          //             </Option>
                          //           );
                          //         })
                          //       : null}
                          //   </Select>
                          // )}
                          style={{ width: '80%' }}
                        // disabled={!haveFreight}
                        />
                      )}
                    </Form.Item>
                  </div>
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="货代公司法人姓名">
                    {getFieldDecorator('freightForwardCorporation', {
                      initialValue:
                        dataOne.freightForwardCorporation ||
                        dataOne.freightForwardCorporation,
                      rules: [
                        {
                          required: true,
                          message: '请验证货代公司'
                        }
                      ]
                    })(
                      <Input
                        placeholder="请验证"
                        style={{ width: '80%' }}
                        readOnly
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="货代公司法人身份证号">
                    {getFieldDecorator('freightForwardCorporationIdcard', {
                      initialValue:
                        dataOne.freightForwardCorporationIdcard ||
                        dataOne.freightForwardCorporationIdcard,
                      rules: [
                        // {
                        //   required: true,
                        //   message: '请输入法人身份证号！'
                        // },
                        {
                          pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                          message: '身份证格式不正确，请重新输入'
                        }
                      ]
                    })(<Input placeholder="请输入" style={{ width: '80%' }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col sm={8} xs={10}>
                  <div className={styles.proveWrap}>
                    <div className={styles.proveBox}>
                      <span style={{ marginRight: '10px' }}>
                        <span
                          style={
                            isProved
                              ? { color: 'green', marginRight: '10px' }
                              : { color: '#f00', marginRight: '10px' }
                          }
                        >
                          {have ? (
                            isProved === 2 ? (
                              <Icon
                                type="info-circle"
                                theme="twoTone"
                                twoToneColor="orange"
                              />
                            ) : isProved === 1 ? (
                              <Icon
                                type="check-circle"
                                theme="twoTone"
                                twoToneColor="#52c41a"
                              />
                            ) : (
                                  <Icon
                                    type="close-circle"
                                    theme="twoTone"
                                    twoToneColor="#f00"
                                  />
                                )
                          ) : null}
                        </span>
                        {have ? (
                          isProved === 2 ? (
                            <span>请先验证</span>
                          ) : isProved === 1 ? (
                            <span>验证通过</span>
                          ) : (
                                <span>验证失败</span>
                              )
                        ) : null}
                      </span>
                      <Button
                        type="primary"
                        onClick={this.onProve.bind(this, type, 'guar')}
                        disabled={
                          !(
                            ((have &&
                              this.props.rcForm.getFieldValue(
                                'guarantorName'
                              )) ||
                              isProved === 1) &&
                            guarChange
                          )
                        }
                        loading={this.state.loading}
                      >
                        验证企业
                      </Button>
                    </div>

                    <Form.Item layout="" label="担保企业">
                      {getFieldDecorator('guarantorName', {
                        initialValue: dataOne.guarantorName
                          ? dataOne.guarantorName
                          : '',
                        rules: [
                          {
                            required: have,
                            message: '请填入担保企业，不超过20个字符',
                            type: 'string',
                            max: 20
                          }
                        ]
                      })(
                        <Input
                          onChange={this.guarChange}
                          addonBefore={getFieldDecorator('hasGuarantor', {
                            rules: [{}]
                          })(
                            <Select
                              placeholder="请选择"
                              style={{ width: 100 }}
                              onChange={this.haveGuarante}
                            >
                              {YW[0]
                                ? YW.map(item => {
                                  return (
                                    <Option
                                      key={item.sysCode}
                                      value={item.sysCode}
                                    >
                                      {item.sysCodeVal}
                                    </Option>
                                  )
                                })
                                : null}
                            </Select>
                          )}
                          style={{ width: '80%' }}
                          disabled={!have}
                        />
                      )}
                    </Form.Item>
                  </div>
                </Col>
                <Col sm={8} xs={10}>
                  {have && (
                    <Form.Item layout="vertical" label="担保企业法人姓名">
                      {getFieldDecorator('guarantorCorporation', {
                        initialValue:
                          dataOne.guarantorCorporation ||
                          dataOne.guarantorCorporation,
                        rules: [
                          {
                            required: true,
                            message: '请验证担保企业'
                          }
                        ]
                      })(
                        <Input
                          placeholder="请验证"
                          style={{ width: '80%' }}
                          readOnly
                        />
                      )}
                    </Form.Item>
                  )}
                </Col>

                {have && (
                  <Col sm={8} xs={10}>
                    <Form.Item layout="vertical" label="担保企业法人身份证号">
                      {getFieldDecorator('guarantorCorporationIdcard', {
                        initialValue:
                          dataOne.guarantorCorporationIdcard ||
                          dataOne.guarantorCorporationIdcard,
                        rules: [
                          // {
                          //   required: true,
                          //   message: '请输入法人身份证号！'
                          // },
                          {
                            pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                            message: '身份证格式不正确，请重新输入'
                          }
                        ]
                      })(
                        <Input placeholder="请输入" style={{ width: '80%' }} />
                      )}
                    </Form.Item>
                  </Col>
                )}
              </Row>
            </Card>
          ) : null}
          {type === 'p' || type === 'L' ? (
            <Card>
              <Row>
                <Col sm={8} xs={10}>
                  <div className={styles.tipsBox}>
                    <div className={styles.tips}>
                      <Tooltip placement="top" title="资方付款后货权转移期限">
                        <Icon type="info-circle" />
                      </Tooltip>
                    </div>
                    <Form.Item layout="vertical" label="货权转移期限">
                      {getFieldDecorator('goodsTransferDeadline', {
                        initialValue: dataOne.goodsTransferDeadline
                          ? dataOne.goodsTransferDeadline
                          : null,
                        rules: [
                          {
                            required: true,
                            message: '请填入货权转移期限',
                            max: 10000000000,
                            type: 'number'
                          }
                        ]
                      })(<InputNumber placeholder="请输入" />)}
                      <span style={{ marginLeft: '10px' }}>天</span>
                    </Form.Item>
                  </div>
                </Col>
                {type === 'L' ? (
                  ''
                ) : (
                    <Fragment>
                      <Col sm={8} xs={10}>
                        <Form.Item layout="vertical" label="供货商开票模式">
                          {getFieldDecorator('invoiceMode', {
                            // initialValue: "请选择",
                            rules: [
                              { required: true, message: '请选择供货商开票模式' }
                            ]
                          })(
                            <Select
                              style={{ width: '79%' }}
                              onChange={this.invoiceModeChange.bind(this)}
                            >
                              {KPMS[0]
                                ? KPMS.map(item => {
                                  return (
                                    <Option
                                      key={item.sysCode}
                                      value={item.sysCode}
                                    >
                                      {item.sysCodeVal}
                                    </Option>
                                  )
                                })
                                : null}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col sm={8} xs={10}>
                        <Form.Item layout="vertical" label="首次开票比例">
                          {getFieldDecorator('firstInvoiceRatio', {
                            initialValue:
                              dataOne.firstInvoiceRatio ||
                                dataOne.firstInvoiceRatio === 0
                                ? dataOne.firstInvoiceRatio
                                : null,
                            rules: [
                              {
                                required: true,
                                message: '请填入首次开票比例',
                                max: 10000000,
                                type: 'number'
                              }
                            ]
                          })(
                            <InputNumber
                              placeholder="请输入"
                              disabled={this.state.firstInvoiceRatio}
                            />
                          )}
                          <span style={{ marginLeft: '10px' }}>%</span>
                        </Form.Item>
                      </Col>
                    </Fragment>
                  )}
              </Row>
              <Row>
                <Col sm={8} xs={10}>
                  <div className={styles.tipsBox}>
                    <Tooltip placement="top" title="结算后开票时限">
                      <div className={styles.tips}>
                        <Icon type="info-circle" />
                      </div>
                    </Tooltip>
                    <Form.Item layout="vertical" label="开票时限">
                      {getFieldDecorator('invoiceDeadline', {
                        initialValue: dataOne.invoiceDeadline
                          ? dataOne.invoiceDeadline
                          : null,
                        rules: [
                          {
                            required: true,
                            message: '请填入开票时限',
                            max: 10000000000,
                            type: 'number'
                          }
                        ]
                      })(<InputNumber placeholder="请输入" />)}
                      <span style={{ marginLeft: '10px' }}>天</span>
                    </Form.Item>
                  </div>
                </Col>
                <Col sm={8} xs={10}>
                  <div className={styles.tipsBox}>
                    <Tooltip
                      placement="top"
                      title="我方在合同签订定后的付款比例"
                    >
                      <div className={styles.tips}>
                        <Icon type="info-circle" />
                      </div>
                    </Tooltip>
                    <Form.Item layout="vertical" label="付款比例">
                      {getFieldDecorator('paymentRatio', {
                        initialValue: dataOne.paymentRatio
                          ? dataOne.paymentRatio
                          : null,
                        rules: [
                          {
                            required: true,
                            message: '请填入付款比例',
                            type: 'number'
                          }
                        ]
                      })(<InputNumber placeholder="请输入" />)}
                      <span style={{ marginLeft: '10px' }}>%</span>
                    </Form.Item>
                  </div>
                </Col>
                {type === 'p' ? (
                  <Col sm={8} xs={10}>
                    <Form.Item layout="vertical" label="提货期限">
                      {getFieldDecorator('takeGoodsDeadline', {
                        initialValue: dataOne.takeGoodsDeadline
                          ? dataOne.takeGoodsDeadline
                          : null,
                        rules: [
                          {
                            required: true,
                            message: '请填入提货期限',
                            max: 10000000000,
                            type: 'number'
                          }
                        ]
                      })(<InputNumber placeholder="请输入" />)}
                      <span style={{ marginLeft: '10px' }}>天</span>
                    </Form.Item>
                  </Col>
                ) : (
                    <Col sm={8} xs={10}>
                      <Form.Item layout="vertical" label="委托企业回款期限">
                        {getFieldDecorator('clientCollectionDeadline', {
                          initialValue: dataOne.clientCollectionDeadline
                            ? dataOne.clientCollectionDeadline
                            : null,
                          rules: [
                            {
                              required: true,
                              message: '请填入委托企业回款期限',
                              max: 10000000000,
                              type: 'number'
                            }
                          ]
                        })(<InputNumber placeholder="请输入" />)}
                        <span style={{ marginLeft: '10px' }}>天</span>
                      </Form.Item>
                    </Col>
                  )}
              </Row>
            </Card>
          ) : type === 's' ? (
            <Card>
              <Row>
                <Col sm={8} xs={10}>
                  <div className={styles.proveWrap}>
                    <div className={styles.proveBox}>
                      <span style={{ marginRight: '10px' }}>
                        <span
                          style={
                            isProved
                              ? { color: 'green', marginRight: '10px' }
                              : { color: '#f00', marginRight: '10px' }
                          }
                        >
                          {have ? (
                            isProved === 2 ? (
                              <Icon
                                type="info-circle"
                                theme="twoTone"
                                twoToneColor="orange"
                              />
                            ) : isProved === 1 ? (
                              <Icon
                                type="check-circle"
                                theme="twoTone"
                                twoToneColor="#52c41a"
                              />
                            ) : (
                                  <Icon
                                    type="close-circle"
                                    theme="twoTone"
                                    twoToneColor="#f00"
                                  />
                                )
                          ) : null}
                        </span>
                        {have ? (
                          isProved === 2 ? (
                            <span>请先验证</span>
                          ) : isProved === 1 ? (
                            <span>验证通过</span>
                          ) : (
                                <span>验证失败</span>
                              )
                        ) : null}
                      </span>
                      <Button
                        type="primary"
                        onClick={this.onProve.bind(this, type, 'guar')}
                        disabled={
                          !(
                            ((have &&
                              this.props.rcForm.getFieldValue(
                                'guarantorName'
                              )) ||
                              isProved === 1) &&
                            guarChange
                          )
                        }
                        loading={this.state.loading}
                      >
                        验证企业
                      </Button>
                    </div>
                    <Form.Item layout="" label="担保企业">
                      {getFieldDecorator('guarantorName', {
                        initialValue: dataOne.guarantorName
                          ? dataOne.guarantorName
                          : '',
                        rules: [
                          {
                            required: have,
                            message: '请填入担保企业，不超过20个字符',
                            max: 20,
                            type: 'string'
                          }
                        ]
                      })(
                        <Input
                          onChange={this.guarChange}
                          addonBefore={getFieldDecorator('hasGuarantor', {
                            rules: [{}]
                          })(
                            <Select
                              placeholder="请选择"
                              style={{ width: 100 }}
                              onChange={this.haveGuarante}
                            >
                              {YW[0]
                                ? YW.map(item => {
                                  return (
                                    <Option
                                      key={item.sysCode}
                                      value={item.sysCode}
                                    >
                                      {item.sysCodeVal}
                                    </Option>
                                  )
                                })
                                : null}
                            </Select>
                          )}
                          style={{ width: '80%' }}
                          disabled={!have}
                        />
                      )}
                    </Form.Item>
                  </div>
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="保证金金额">
                    {getFieldDecorator('marginAmount', {
                      initialValue: dataOne.marginAmount
                        ? dataOne.marginAmount
                        : null,
                      rules: [
                        {
                          required: true,
                          message: '13位数字/两位小数',
                          pattern: moneyExp
                        }
                      ]
                    })(<Input addonBefore="￥" style={{ width: '79%' }} />)}
                  </Form.Item>
                  <span class="chineseMon">
                    {chineseMon(
                      Number(this.props.rcForm.getFieldValue('marginAmount'))
                    )}
                    <span style={{ marginLeft: 20 }}>
                      {format(
                        Number(this.props.rcForm.getFieldValue('marginAmount'))
                      )}
                    </span>
                  </span>
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="验货条件">
                    {getFieldDecorator('inspectionConditions', {
                      initialValue: '过磅单及化验单',
                      rules: [
                        {
                          required: true,
                          message: '请选择验货条件，不超过20个字符',
                          type: 'string',
                          max: 20
                        }
                      ]
                    })(<Input style={{ width: '79%' }} readOnly />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="委托企业开票模式">
                    {getFieldDecorator('invoiceMode', {
                      initialValue: '先票后款',
                      rules: [
                        {
                          required: true,
                          message: '请填入委托企业开票模式，不超过20个字符',
                          max: 20
                        }
                      ]
                    })(<Input style={{ width: '79%' }} readOnly />)}
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10}>
                  <div className={styles.tipsBox}>
                    <Tooltip placement="top" title="提交磅单及化验单后开票时限">
                      <div className={styles.tips}>
                        <Icon type="info-circle" />
                      </div>
                    </Tooltip>
                    <Form.Item layout="vertical" label="开票时限">
                      {getFieldDecorator('invoiceDeadline', {
                        initialValue: dataOne.invoiceDeadline
                          ? dataOne.invoiceDeadline
                          : null,
                        rules: [
                          {
                            required: true,
                            message: '请填入开票时限',
                            max: 10000000000,
                            type: 'number'
                          }
                        ]
                      })(<InputNumber placeholder="请输入" />)}
                      <span style={{ marginLeft: '10px' }}>天</span>
                    </Form.Item>
                  </div>
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="首次开票比例">
                    {getFieldDecorator('firstInvoiceRatio', {
                      initialValue:
                        dataOne.firstInvoiceRatio ||
                          dataOne.firstInvoiceRatio === 0
                          ? dataOne.firstInvoiceRatio
                          : null,
                      rules: [
                        {
                          required: true,
                          message: '请填入首次开票比例',
                          max: 10000000,
                          type: 'number'
                        }
                      ]
                    })(<InputNumber placeholder="请输入" />)}
                    <span style={{ marginLeft: '10px' }}>%</span>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          ) : null}
          {type === 'p' || type === 'L' ? (
            <Card>
              <Row>
                <Col sm={8} xs={10}>
                  <div className={styles.proveWrap}>
                    <div className={styles.proveBox}>
                      <span style={{ marginRight: '10px' }}>
                        <span
                          style={
                            isProved
                              ? { color: 'green', marginRight: '10px' }
                              : { color: '#f00', marginRight: '10px' }
                          }
                        >
                          {haveFreight ? (
                            isCompanyProved === 2 ? (
                              <Icon
                                type="info-circle"
                                theme="twoTone"
                                twoToneColor="orange"
                              />
                            ) : isCompanyProved === 1 ? (
                              <Icon
                                type="check-circle"
                                theme="twoTone"
                                twoToneColor="#52c41a"
                              />
                            ) : (
                                  <Icon
                                    type="close-circle"
                                    theme="twoTone"
                                    twoToneColor="#f00"
                                  />
                                )
                          ) : null}
                        </span>
                        {haveFreight ? (
                          isCompanyProved === 2 ? (
                            <span>请先验证</span>
                          ) : isCompanyProved === 1 ? (
                            <span>验证通过</span>
                          ) : (
                                <span>验证失败</span>
                              )
                        ) : null}
                      </span>
                      <Button
                        type="primary"
                        onClick={this.onProve.bind(this, type, 'freight')}
                        disabled={
                          !(
                            ((haveFreight &&
                              this.props.rcForm.getFieldValue(
                                'freightForwardName'
                              )) ||
                              isCompanyProved === 1) &&
                            companyNameChange
                          )
                        }
                        loading={this.state.loading}
                      >
                        验证企业
                      </Button>
                    </div>
                    <Form.Item layout="" label="货代公司">
                      {getFieldDecorator('freightForwardName', {
                        initialValue: dataOne.freightForwardName
                          ? dataOne.freightForwardName
                          : '',
                        rules: [
                          {
                            required: haveFreight,
                            message: '请填入货代公司，不超过20个字符',
                            max: 20,
                            type: 'string'
                          }
                        ]
                      })(
                        <Input
                          onChange={this.freightChange}
                          addonBefore={getFieldDecorator('hasFreight', {
                            rules: [{}]
                          })(
                            <Select
                              placeholder="请选择"
                              style={{ width: 100 }}
                              onChange={this.haveFreight}
                            >
                              {YW[0]
                                ? YW.map(item => {
                                  return (
                                    <Option
                                      key={item.sysCode}
                                      value={item.sysCode}
                                    >
                                      {item.sysCodeVal}
                                    </Option>
                                  )
                                })
                                : null}
                            </Select>
                          )}
                          style={{ width: '80%' }}
                          disabled={!haveFreight}
                        />
                      )}
                    </Form.Item>
                  </div>
                </Col>
                <Col sm={8} xs={10}>
                  {haveFreight && (
                    <Form.Item layout="vertical" label="货代公司法人姓名">
                      {getFieldDecorator('freightForwardCorporation', {
                        initialValue:
                          dataOne.freightForwardCorporation ||
                          dataOne.freightForwardCorporation,
                        rules: [
                          {
                            required: true,
                            message: '请验证货代公司'
                          }
                        ]
                      })(
                        <Input
                          placeholder="请验证"
                          style={{ width: '80%' }}
                          readOnly
                        />
                      )}
                    </Form.Item>
                  )}
                </Col>
                <Col sm={8} xs={10}>
                  {haveFreight && (
                    <Form.Item layout="vertical" label="货代公司法人身份证号">
                      {getFieldDecorator('freightForwardCorporationIdcard', {
                        initialValue:
                          dataOne.freightForwardCorporationIdcard ||
                          dataOne.freightForwardCorporationIdcard,
                        rules: [
                          // {
                          //   required: true,
                          //   message: '请输入法人身份证号！'
                          // },
                          {
                            pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                            message: '身份证格式不正确，请重新输入'
                          }
                        ]
                      })(
                        <Input placeholder="请输入" style={{ width: '80%' }} />
                      )}
                    </Form.Item>
                  )}
                </Col>
              </Row>
              <Row>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="发货地">
                    {getFieldDecorator('deliveryAddress', {
                      // initialValue:0,
                      rules: [
                        {
                          required: true,
                          message: '请选择发货地'
                        }
                      ]
                    })(
                      // <Input
                      //   style={{ width: "79%" }}
                      //   placeholder="请填写"

                      // />
                      <DistrictSelect
                        onSelect={this.selectAddress.bind(this)}
                        level={3}
                        writeBack={
                          this.props.writeBack.deliveryAddress &&
                          this.props.writeBack.deliveryAddress
                        }
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="发货库位/港口">
                    {getFieldDecorator('deliveryPlace', {
                      initialValue: dataOne.deliveryPlace
                        ? dataOne.deliveryPlace
                        : '',
                      rules: [
                        {
                          required: true,
                          message: '请填入发货库位/港口，不超过20个字符',
                          type: 'string',
                          max: 20
                        }
                      ]
                    })(<Input style={{ width: '79%' }} placeholder="请填写" />)}
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10} />
              </Row>
              <Row>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="收货地">
                    {getFieldDecorator('takeGoodsAddress', {
                      rules: [
                        {
                          required: true,
                          message: '请选择收货地'
                        }
                      ]
                    })(
                      <DistrictSelect
                        onSelect={this.selectTakeAddress.bind(this)}
                        level={3}
                        writeBack={
                          this.props.writeBack.takeGoodsAddress &&
                          this.props.writeBack.takeGoodsAddress
                        }
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="收货库位/港口">
                    {getFieldDecorator('takeGoodsPlace', {
                      initialValue: dataOne.takeGoodsPlace
                        ? dataOne.takeGoodsPlace
                        : '',
                      rules: [
                        {
                          required: true,
                          message: '请填写收货库位/港口，不超过20个字符',
                          type: 'string',
                          max: 20
                        }
                      ]
                    })(<Input style={{ width: '79%' }} placeholder="请填写" />)}
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="交割提货地">
                    {getFieldDecorator('transactionPlace', {
                      initialValue: dataOne.transactionPlace
                        ? dataOne.transactionPlace
                        : '',
                      rules: [
                        {
                          required: true,
                          message: '请填写交割收货地，不超过20个字符',
                          type: 'string',
                          max: 20
                        }
                      ]
                    })(<Input style={{ width: '79%' }} placeholder="请填写" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          ) : type === 's' ? (
            <Card>
              <Row>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="购货方支付方式">
                    {getFieldDecorator('paymentMode', {
                      // initialValue: "请选择",
                      rules: [
                        { required: true, message: '请选择购货方支付方式' }
                      ]
                    })(
                      <Select style={{ width: '79%' }}>
                        {ZFFS[0]
                          ? ZFFS.map(item => {
                            return (
                              <Option key={item.sysCode} value={item.sysCode}>
                                {item.sysCodeVal}
                              </Option>
                            )
                          })
                          : null}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10}>
                  <div className={styles.tipsBox}>
                    <Tooltip
                      placement="top"
                      title="我方在合同签订定后的付款比例"
                    >
                      <div className={styles.tips}>
                        <Icon type="info-circle" />
                      </div>
                    </Tooltip>
                    <Form.Item layout="vertical" label="付款比例">
                      {getFieldDecorator('paymentRatio', {
                        initialValue: dataOne.paymentRatio
                          ? dataOne.paymentRatio
                          : null,
                        rules: [
                          {
                            required: true,
                            message: '请填入付款比例',
                            max: 10000000,
                            type: 'number'
                          }
                        ]
                      })(
                        <InputNumber
                          placeholder="请输入"
                          onChange={e => this.setValues(e, 5)}
                        />
                      )}
                      <span style={{ marginLeft: '10px' }}>%</span>
                    </Form.Item>
                  </div>
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="最迟回款日期">
                    {getFieldDecorator('latestPaymentTime', {
                      // initialValue: '请选择',
                      rules: [{ required: true, message: '请选择最迟回款日期' }]
                    })(
                      <DatePicker
                        allowClear={false}
                        format="YYYY-MM-DD"
                        disabledDate={this.datepick}
                        placeholder="请选择"
                        style={{ width: '79%' }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                {/* <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="结算比例">
                    {getFieldDecorator("settlementRatio", {
                      initialValue:
                        dataOne.settlementRatio || dataOne.settlementRatio === 0
                          ? dataOne.settlementRatio
                          : null,
                      rules: [
                        {
                          required: true,
                          message: "请填入结算比例",
                          max: 10000000,
                          type: "number"
                        }
                      ]
                    })(<InputNumber placeholder="请输入" />)}
                    <span style={{ marginLeft: "10px" }}>%</span>
                  </Form.Item>
                </Col> */}
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="购货商一票结算时限">
                    {getFieldDecorator('settlementDeadline', {
                      initialValue:
                        dataOne.settlementDeadline ||
                          dataOne.settlementDeadline === 0
                          ? dataOne.settlementDeadline
                          : null,
                      rules: [
                        {
                          required: true,
                          message: '请填入购货商一票结算时限',
                          max: 10000000000,
                          type: 'number'
                        }
                      ]
                    })(<InputNumber placeholder="请输入" min={0} />)}
                    <span style={{ marginLeft: '10px' }}>天</span>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          ) : null}
          {type === 'p' || type === 'L' ? (
            <Card>
              {type === 'L' ? (
                ''
              ) : (
                  <Row>
                    <Col sm={8} xs={10}>
                      <Form.Item layout="vertical" label="付款(运输)条款">
                        {getFieldDecorator('paymentProvision', {
                          initialValue: '请选择',
                          rules: [
                            { required: true, message: '请选择付款(运输)条款' }
                          ]
                        })(
                          <Select style={{ width: '79%' }}>
                            {FKTK[0]
                              ? FKTK.map(item => {
                                return (
                                  <Option
                                    key={item.sysCode}
                                    value={item.sysCode}
                                  >
                                    {item.sysCodeVal}
                                  </Option>
                                )
                              })
                              : null}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col sm={8} xs={10} />
                    <Col sm={8} xs={10} />
                  </Row>
                )}

              <Row>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="年化利率">
                    {getFieldDecorator('annualRate', {
                      initialValue: dataOne.annualRate
                        ? dataOne.annualRate
                        : null,
                      rules: [
                        {
                          required: true,
                          message: '请填入年化利率',
                          max: 10000000,
                          type: 'number'
                        }
                      ]
                    })(
                      <InputNumber
                        placeholder="请输入"
                        onChange={e => this.setValues(e, 2)}
                      />
                    )}
                    <span style={{ marginLeft: '10px' }}>%</span>
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="资金占用天数">
                    {getFieldDecorator('capitalOccupationDays', {
                      initialValue: dataOne.capitalOccupationDays
                        ? dataOne.capitalOccupationDays
                        : null,
                      rules: [
                        {
                          required: true,
                          message: '请填入资金占用天数',
                          max: 10000000000,
                          type: 'number'
                        }
                      ]
                    })(
                      <InputNumber
                        placeholder="请输入"
                        min={0}
                        onChange={e => this.setValues(e, 3)}
                      />
                    )}
                    <span style={{ marginLeft: '10px' }}>天</span>
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="货物数量正负比例">
                    {getFieldDecorator('goodsPlusMinusRatio', {
                      initialValue: dataOne.goodsPlusMinusRatio
                        ? dataOne.goodsPlusMinusRatio
                        : null,
                      rules: [
                        {
                          required: true,
                          message: '请填入货物数量正负比例',
                          max: 10000000,
                          type: 'number'
                        }
                      ]
                    })(<InputNumber placeholder="请输入" />)}
                    <span style={{ marginLeft: '10px' }}>%</span>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          ) : null}
          {type === 'p' || type === 'L' ? (
            <Card>
              <Row>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="税率">
                    {getFieldDecorator('taxRate', {
                      initialValue: dataOne.taxRate ? dataOne.taxRate : '',
                      rules: [
                        {
                          type: 'integer',
                          required: true,
                          message: '请填入税率，且只能为整数'
                        }
                      ]
                    })(
                      <InputNumber
                        placeholder="请输入"
                        onChange={e => this.setValues(e, 4)}
                      />
                    )}
                    <span style={{ marginLeft: '10px' }}>%</span>
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="销售价格">
                    {getFieldDecorator('sellingPrice', {
                      initialValue: dataOne.sellingPriceElse ? dataOne.sellingPriceElse.toFixed(2) :
                        dataOne.sellingPrice ? dataOne.sellingPrice.toFixed(2) : '',
                      rules: [
                        {
                          required: true,
                          message: '销售价格自动生成，请填入必填项参数'
                        }
                      ]
                    })(
                      <Input
                        addonBefore="￥"
                        placeholder="自动生成"
                        readOnly={!editPrice}
                        style={{ width: '79%' }}
                      />
                    )}
                  </Form.Item>
                  <span class="chineseMon">
                    {chineseMon(
                      Number(this.props.rcForm.getFieldValue('sellingPrice'))
                    )}
                    <span style={{ marginLeft: 20 }}>
                      {format(
                        Number(this.props.rcForm.getFieldValue('sellingPrice'))
                      )}
                    </span>
                  </span>
                  {
                    editPrice ?
                      <div style={{ color: '#52c41a', padding: '10px 0' }}>
                        金额可手动修改
                      </div> :
                      <div onClick={() => changeEditPrice(true)} style={{ color: '#1890FF', cursor: 'pointer', padding: '10px 0' }}>
                        金额不正确？点击修改
                      </div>
                  }
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="委托采购价格">
                    {getFieldDecorator('purchasingPrice', {
                      initialValue: dataOne.purchasingPrice
                        ? dataOne.purchasingPrice.toFixed(2)
                        : '',
                      rules: [
                        {
                          required: true,
                          message: '委托采购价格自动生成，请填入必填项参数'
                        }
                      ]
                    })(
                      <Input
                        addonBefore="￥"
                        placeholder="自动生成"
                        readOnly
                        style={{ width: '79%' }}
                      />
                    )}
                  </Form.Item>
                  <span class="chineseMon">
                    {chineseMon(
                      Number(this.props.rcForm.getFieldValue('purchasingPrice'))
                    )}
                    <span style={{ marginLeft: 20 }}>
                      {format(
                        Number(
                          this.props.rcForm.getFieldValue('purchasingPrice')
                        )
                      )}
                    </span>
                  </span>
                </Col>
              </Row>
            </Card>
          ) : type === 's' ? (
            <Card>
              <Row>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="资金占用天数">
                    {getFieldDecorator('capitalOccupationDays', {
                      initialValue: dataOne.capitalOccupationDays
                        ? dataOne.capitalOccupationDays
                        : null,
                      rules: [
                        {
                          required: true,
                          message: '请填入资金占用天数',
                          max: 10000000000,
                          type: 'number'
                        }
                      ]
                    })(
                      <InputNumber
                        placeholder="请输入"
                        min={0}
                        onChange={e => this.setValues(e, 3)}
                      />
                    )}
                    <span style={{ marginLeft: '10px' }}>天</span>
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="年化利率">
                    {getFieldDecorator('annualRate', {
                      initialValue: dataOne.annualRate
                        ? dataOne.annualRate
                        : null,
                      rules: [
                        {
                          required: true,
                          message: '请填入年化利率',
                          max: 10000000,
                          type: 'number'
                        }
                      ]
                    })(
                      <InputNumber
                        placeholder="请输入"
                        onChange={e => this.setValues(e, 2)}
                      />
                    )}
                    <span style={{ marginLeft: '10px' }}>%</span>
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10} />
              </Row>
              <Row>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="税率">
                    {getFieldDecorator('taxRate', {
                      initialValue: dataOne.taxRate ? dataOne.taxRate : '',
                      rules: [
                        {
                          type: 'integer',
                          required: true,
                          message: '请填入税率，且只能为整数'
                        }
                      ]
                    })(
                      <InputNumber
                        placeholder="请输入"
                        onChange={e => this.setValues(e, 4)}
                      />
                    )}
                    <span style={{ marginLeft: '10px' }}>%</span>
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="采购价格">
                    {getFieldDecorator('purchasePrice', {
                      initialValue: dataOne.purchasePriceElse ? dataOne.purchasePriceElse.toFixed(2) :
                        dataOne.purchasePrice ? dataOne.purchasePrice.toFixed(2) : '',
                      rules: [
                        {
                          required: true,
                          message: '采购价格自动生成，请填入必填项参数'
                        }
                      ]
                    })(
                      <Input
                        addonBefore="￥"
                        placeholder="自动生成"
                        readOnly={!editPrice}
                        style={{ width: '79%' }}
                      />
                    )}
                  </Form.Item>
                  <span class="chineseMon">
                    {chineseMon(
                      Number(this.props.rcForm.getFieldValue('purchasePrice'))
                    )}
                    <span style={{ marginLeft: 20 }}>
                      {format(
                        Number(this.props.rcForm.getFieldValue('purchasePrice'))
                      )}
                    </span>
                  </span>
                  {
                    editPrice ?
                      <div style={{ color: '#52c41a', padding: '10px 0' }}>
                        金额可手动修改
                      </div> :
                      <div onClick={() => changeEditPrice(true)} style={{ color: '#1890FF', cursor: 'pointer', padding: '10px 0' }}>
                        金额不正确？点击修改
                      </div>
                  }
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="委托销售价格">
                    {getFieldDecorator('purchasingPrice', {
                      initialValue: dataOne.purchasingPrice
                        ? dataOne.purchasingPrice.toFixed(2)
                        : '',
                      rules: [
                        {
                          required: true,
                          message: '委托销售价格价格自动生成，请填入必填项参数'
                        }
                      ]
                    })(
                      <Input
                        addonBefore="￥"
                        placeholder="自动生成"
                        readOnly
                        style={{ width: '79%' }}
                      />
                    )}
                  </Form.Item>
                  <span class="chineseMon">
                    {chineseMon(
                      Number(this.props.rcForm.getFieldValue('purchasingPrice'))
                    )}
                    <span style={{ marginLeft: 20 }}>
                      {format(
                        Number(
                          this.props.rcForm.getFieldValue('purchasingPrice')
                        )
                      )}
                    </span>
                  </span>
                </Col>
              </Row>
            </Card>
          ) : type === 'w' ? (
            <Card>
              <Row>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="最晚提货日期">
                    {getFieldDecorator('latestDeliveryDate', {
                      // initialValue: '请选择',
                      rules: [{ required: true, message: '请选择最晚提货日期' }]
                    })(
                      <DatePicker
                        allowClear={false}
                        format="YYYY-MM-DD"
                        disabledDate={this.datepick}
                        placeholder="请选择"
                        style={{ width: '79%' }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="质押比例">
                    {getFieldDecorator('pledgeRatio', {
                      initialValue:
                        dataOne.pledgeRatio || dataOne.pledgeRatio === 0
                          ? dataOne.pledgeRatio
                          : null,
                      rules: [
                        {
                          required: true,
                          message: '请填入质押比例',
                          max: 10000000,
                          type: 'number'
                        }
                      ]
                    })(<InputNumber placeholder="请输入" />)}
                    <span style={{ marginLeft: '10px' }}>%</span>
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10} />
              </Row>
              <Row>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="资金占用天数">
                    {getFieldDecorator('capitalOccupationDays', {
                      initialValue: dataOne.capitalOccupationDays
                        ? dataOne.capitalOccupationDays
                        : null,
                      rules: [
                        {
                          required: true,
                          message: '请填入资金占用天数',
                          max: 10000000000,
                          type: 'number'
                        }
                      ]
                    })(
                      <InputNumber
                        placeholder="请输入"
                        min={0}
                      // onChange={e => this.setValues(e, 3)}
                      />
                    )}
                    <span style={{ marginLeft: '10px' }}>天</span>
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="年化利率">
                    {getFieldDecorator('annualRate', {
                      initialValue: dataOne.annualRate
                        ? dataOne.annualRate
                        : null,
                      rules: [
                        {
                          required: true,
                          message: '请填入年化利率',
                          max: 10000000,
                          type: 'number'
                        }
                      ]
                    })(
                      <InputNumber
                        placeholder="请输入"
                      // onChange={e => this.setValues(e, 2)}
                      />
                    )}
                    <span style={{ marginLeft: '10px' }}>%</span>
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="税率">
                    {getFieldDecorator('taxRate', {
                      initialValue: dataOne.taxRate ? dataOne.taxRate : '',
                      rules: [
                        {
                          type: 'integer',
                          required: true,
                          message: '请填入税率，且只能为整数'
                        }
                      ]
                    })(
                      <InputNumber
                        placeholder="请输入"
                      // onChange={e => this.setValues(e, 4)}
                      />
                    )}
                    <span style={{ marginLeft: '10px' }}>%</span>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          ) : null}
        </Form>
      </Fragment>
    )
  }
}

export default BusinessDetail
