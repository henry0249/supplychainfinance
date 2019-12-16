import React, { Component } from 'react'
import styles from './index.less'
import {
  Divider,
  Form,
  Button,
  Modal,
  Input,
  Select,
  DatePicker,
  Table,
  message,
  Badge,
  Icon,
  Spin,
  Empty
} from 'antd'
import { connect } from 'dva'
import moment from 'moment'
import router from 'umi/router'
import TransferModal from './components/bill/components/transferModal/index'
import InvoiceModal from './components/bill/components/invoiceModal/index'
import BailModal from './components/bill/components/bailModal/index'
import DelayModal from './components/bill/components/delayModal/index'
import GoodsModal from './components/bill/components/goodsModal/index'
import WarehouseModal from './components/bill/components/warehouseModal/index'
import PaymentModal from './components/bill/components/paymentModal/index'
import DeliveryModal from './components/bill/components/deliveryModal/index'
import LetterModal from './components/bill/components/letterModal/index'
const FormItem = Form.Item
const { RangePicker } = DatePicker
const { Option } = Select

@Form.create()
@connect(({ orderManage, global, detail }) => ({
  orderManage,
  global,
  detail
}))
//订单管理首页
export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      totalRecords: 0,
      params: {},
      param: {},
      orderId: null,
      url: null,
      list: [], //订单列表
      type: '', // 退回证明类型
      id: '', // 退回证明业务ID
      businessMode: null,
      invoiceType: null,
      letterType: null, //采购函类型
      modalId: null,
      visible: false, // 退回modal
      visibleImg: false, // 查看图片modal
      visibleTransfer: false, // 提交转移证明modal
      visibleInvoice: false, // 提交开票证明modal
      visibleBail: false, // 提交保证金证明modal
      visibleDelay: false, // 提交延期提货证明modal
      visibleGoods: false, // 提交提货证明modal
      visibleWarehouse: false, // 提交仓单证明modal
      visiblePayment: false, // 提交付款证明modal
      visibleDelivery: false, // 提交放货证明modal
      visibleLetter: false, //采购函Modal
      editing: false,
      edit: false,
      num: null,
      inputValue: null
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    //  获取首页订单统计
    dispatch({
      type: 'orderManage/getCounts',
      payload: 1,
      error: response => {
        message.error(response && response.msg)
      }
    })

    //获取首页订单列表
    dispatch({
      type: 'orderManage/getList',
      payload: {
        url: `currentPage=1&pageSize=10`,
        params: {}
      },
      success: resp => {
        if (resp && resp.code === 0) {
          this.setState({
            ...resp.page
            // list: handleData(resp.data)
          })
        } else {
          this.setState({
            currentPage: 1,
            pageSize: 10,
            totalPage: 0,
            totalRecords: 0
            // list: []
          })
        }
      }
    })
  }

  onChange = current => {
    const { dispatch } = this.props
    const { pageSize, params } = this.state
    dispatch({
      type: 'orderManage/getList',
      payload: {
        url: `currentPage=${current}&pageSize=${pageSize}`,
        params: params
      },
      success: resp => {
        if (resp && resp.code === 0) {
          this.setState({
            ...resp.page
            // list: handleData(resp.data)
          })
        } else {
          this.setState({
            currentPage: 1,
            pageSize: 10,
            totalPage: 0,
            totalRecords: 0
            // list: []
          })
        }
      }
    })
  }

  onShowSizeChange = (current, size) => {
    const { dispatch } = this.props
    const { params } = this.state
    dispatch({
      type: 'orderManage/getList',
      payload: {
        url: `currentPage=1&pageSize=${size}`,
        params: params
      },
      success: resp => {
        if (resp && resp.code === 0) {
          this.setState({
            ...resp.page
            // list: handleData(resp.data)
          })
        } else {
          this.setState({
            currentPage: 1,
            pageSize: 10,
            totalPage: 0,
            totalRecords: 0
            // list: []
          })
        }
      }
    })
  }

  //查询
  handleSearch = () => {
    const { validateFields } = this.props.form
    const { dispatch } = this.props
    const { pageSize } = this.state
    validateFields((err, values) => {
      if (!err) {
        let params = {}
        if (values.entrustCompanyName) {
          params['entrustCompanyName'] = values.entrustCompanyName
        }
        if (values.rangePicker && values.rangePicker.length) {
          params['startTime'] = moment(values['rangePicker'][0]).format(
            'YYYY-MM-DD'
          )
          params['endTime'] = moment(values['rangePicker'][1]).format(
            'YYYY-MM-DD'
          )
        }
        if (values.orderId) {
          params['orderId'] = values.orderId
        }
        if (
          values.businessMode === 0 ||
          values.businessMode === 1 ||
          values.businessMode === 2 ||
          values.businessMode === 4
        ) {
          params['businessType'] = values.businessMode
        }
        dispatch({
          type: 'orderManage/getList',
          payload: {
            url: `currentPage=1&pageSize=${pageSize}`,
            params: params
          },
          success: resp => {
            if (resp && resp.code === 0) {
              this.setState({
                ...resp.page,
                params
                // list: handleData(resp.data)
              })
            } else {
              this.setState({
                currentPage: 1,
                pageSize: 10,
                totalPage: 0,
                totalRecords: 0
                // list: []
              })
            }
          }
        })
      }
    })
  }

  //重置
  handleReset = () => {
    const { resetFields } = this.props.form
    const { dispatch } = this.props
    const { pageSize } = this.state
    dispatch({
      type: 'orderManage/getList',
      payload: {
        url: `currentPage=1&pageSize=${pageSize}`,
        params: {}
      },
      success: resp => {
        if (resp && resp.code === 0) {
          resetFields()
          this.setState({
            ...resp.page,
            params: {}
            // list: handleData(resp.data)
          })
        } else {
          resetFields()
          this.setState({
            currentPage: 1,
            pageSize: 10,
            totalPage: 0,
            totalRecords: 0,
            params: {}
            // list: []
          })
        }
      }
    })
  }

  //订单首页委托采购操作按钮
  handleBuyClick = (orderInfo, type, obj) => {
    let orderId =
      orderInfo.ordersId || orderInfo.saleOrdersId || orderInfo.storageOrdersId
    sessionStorage.setItem('businessMode', orderInfo.type)
    this.setState({
      orderId: orderInfo.ordersId
    }, () => {
      if (type === 1) {
        //跳转到合同审批的详情页
        router.push(`/approval/contract/details?enterType=0&key=contract&id=${orderId}`)
      } else if (type === 2) {
        //跳转到保证金审批的详情页
        router.push(`/approval/bail/details?enterType=0&type=bail&key=bill&id=${orderId}`)
      } else if (type === 3) {
        //付款证明
        router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visiblePayment`)
      } else if (type === 4) {
        //放货证明
        this.onShowModal && this.onShowModal('visibleDelivery')
        router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visibleDelivery`)
      } else if (type === 5) {
        //切换到票据
        router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}`)
      } else if (type === 6) {
        //跳转到提货审批的详情页
        router.push(`/approval/goods/details?enterType=0&type=goods&key=bill&id=${orderId}`)
      } else if (type === 7) {
        //跳转到延期提货的详情页
        router.push(`/approval/deferred/details?enterType=0&type=deferred&key=bill&id=${orderId}`)
      } else if (type === 8) {
        //开票证明
        this.setState({
          invoiceType: obj.invoiceType
        }, () => {
          router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visibleInvoice&invoiceType=${obj.invoiceType}`)
        })
      } else if (type === 9) {
        //切换到合同
        router.push(`/orderManage/details?enterType=1&key=contract&id=${orderId}`)
      } else if (type === 10) {
        //切换到结算单
        router.push(`/orderManage/details?enterType=1&key=settlement&id=${orderId}`)
      } else if (type === 11) {
        //货权转移证明
        router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visibleTransfer`)
      } else if (type === 12) {
        //跳转到结算审批详情页
        router.push(`/approval/settlement/details?enterType=0&type=settlement&key=settlement&id=${orderId}`)
      } else if (type === 13) {
        //保证金证明
        router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visibleBail`)
      } else if (type === 14) {
        //提货申请
        let params = {}
        if (sessionStorage.businessMode === '0') {
          params = {
            pickUpTime: orderInfo.originalExtractTime, //最晚提货日期
            sellingPrice: orderInfo.sellingPrice, //销售价格
            grade: orderInfo.grade //品位
          }
        } else if (sessionStorage.businessMode === '2') {
          params = {
            pickUpTime: orderInfo.latestDeliveryDate, //最晚提货日期
            unitPrice: orderInfo.unitPrice, //单价
            pledgeRatio: orderInfo.pledgeRatio, //质押比例
            annualRate: orderInfo.annualRate, //年化利率
            capitalOccupationDays: orderInfo.capitalOccupationDays, //资金占用天数
            taxRate: orderInfo.taxRate, //提货税率
            grade: orderInfo.grade //品位
          }
        }
        this.setState({
          param: params
        }, () => {
          router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visibleGoods`)
        })
      } else if (type === 15) {
        //延期提货证明
        let params = {}
        if (sessionStorage.businessMode === '0') {
          params = {
            pickUpTime: orderInfo.originalExtractTime, //最晚提货日期
            sellingPrice: orderInfo.sellingPrice, //销售价格
            grade: orderInfo.grade //品位
          }
        } else if (sessionStorage.businessMode === '2') {
          params = {
            pickUpTime: orderInfo.latestDeliveryDate, //最晚提货日期
            unitPrice: orderInfo.unitPrice, //单价
            pledgeRatio: orderInfo.pledgeRatio, //质押比例
            annualRate: orderInfo.annualRate, //年化利率
            capitalOccupationDays: orderInfo.capitalOccupationDays //资金占用天数
          }
        }
        this.setState({
          param: params
        }, () => {
          router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visibleDelay`)
        })
      } else if (type === 16) {
        //函证明
        this.setState({
          letterType: obj.letterType
        }, () => {
          router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visibleLetter&letterType=${obj.letterType}`)
        })
      } else if (type === 21 || type === 22 || type === 23 || type === 24) {
        this.setState({
          retreatFillType: obj.retreatFillType
        }, () => {
          router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visiblePayment&retreatFillType=${obj.retreatFillType}`)
        })
      }
    })
  }

  //订单首页委托销售操作按钮
  handleSaleClick = (orderInfo, type, obj) => {
    let orderId =
      orderInfo.ordersId || orderInfo.saleOrdersId || orderInfo.storageOrdersId
    sessionStorage.setItem('businessMode', orderInfo.type)
    this.setState({
      orderId: orderInfo.ordersId
    }, () => {
      if (type === 1) {
        //跳转到合同审批的详情页
        router.push(`/approval/contract/details?enterType=0&key=contract&id=${orderId}`)
      } else if (type === 2) {
        //跳转到保证金审批的详情页
        router.push(`/approval/bail/details?enterType=0&type=bail&key=bill&id=${orderId}`)
      } else if (type === 3) {
        //切换到票据
        router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}`)
      } else if (type === 4) {
        //切换到合同
        router.push(`/orderManage/details?enterType=1&key=contract&id=${orderId}`)
      } else if (type === 5) {
        //货权转移证明
        router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visibleTransfer`)
      } else if (type === 6) {
        //保证金证明
        router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visibleBail`)
      } else if (type === 7) {
        //终止发货
        router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}`)
      } else if (type === 8) {
        // 提交函证明
        this.setState({
          letterType: obj.letterType
        }, () => {
          router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visibleLetter&letterType=${obj.letterType}`)
        })
      }
    })
  }

  //订单首页金融仓储操作按钮
  handleStorageClick = (orderInfo, type, obj) => {
    let orderId =
      orderInfo.ordersId || orderInfo.saleOrdersId || orderInfo.storageOrdersId
    sessionStorage.setItem('businessMode', orderInfo.type)
    this.setState({
      orderId: orderInfo.ordersId
    }, () => {
      if (type === 1) {
        //跳转到合同审批的详情页
        router.push(`/approval/contract/details?enterType=0&key=contract&id=${orderId}`)
      } else if (type === 2) {
        //跳转到保证金审批的详情页
        router.push(`/approval/bail/details?enterType=0&type=bail&key=bill&id=${orderId}`)
      } else if (type === 3) {
        //付款证明
        router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visiblePayment`)
      } else if (type === 4) {
        //放货证明
        router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visibleDelivery`)
      } else if (type === 5 || type === 6) {
        //切换到票据
        router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}`)
      } else if (type === 7) {
        //跳转到提货审批的详情页
        router.push(`/approval/goods/details?enterType=0&type=goods&key=bill&id=${orderId}`)
      } else if (type === 8) {
        //跳转到延期提货的详情页
        router.push(`/approval/deferred/details?enterType=0&type=deferred&key=bill&id=${orderId}`)
      } else if (type === 9 || type === 13) {
        //开票证明
        this.setState({
          invoiceType: obj.invoiceType
        }, () => {
          router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visibleInvoice&invoiceType=${obj.invoiceType}`)
        })
      } else if (type === 10) {
        //切换到合同
        router.push(`/orderManage/details?enterType=1&key=contract&id=${orderId}`)
      } else if (type === 11) {
        //切换到结算单
        router.push(`/orderManage/details?enterType=1&key=settlement&id=${orderId}`)
      } else if (type === 12 || type === 18) {
        //货权转移证明
        router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visibleTransfer`)
      } else if (type === 14) {
        //跳转到结算审批详情页
        router.push(`/approval/settlement/details?enterType=0&type=settlement&key=settlement&id=${orderId}`)
      } else if (type === 15) {
        //保证金证明
        router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visibleBail`)
      } else if (type === 16) {
        //提货申请
        let params = {}
        if (sessionStorage.businessMode === '0') {
          params = {
            pickUpTime: orderInfo.originalExtractTime, //最晚提货日期
            sellingPrice: orderInfo.sellingPrice, //销售价格
            grade: orderInfo.grade //品位
          }
        } else if (sessionStorage.businessMode === '2') {
          params = {
            pickUpTime: orderInfo.latestDeliveryDate, //最晚提货日期
            unitPrice: orderInfo.unitPrice, //单价
            pledgeRatio: orderInfo.pledgeRatio, //质押比例
            annualRate: orderInfo.annualRate, //年化利率
            capitalOccupationDays: orderInfo.capitalOccupationDays, //资金占用天数
            taxRate: orderInfo.taxRate, //提货税率
            grade: orderInfo.grade //品位
          }
        }
        this.setState({
          param: params
        }, () => {
          router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visibleGoods`)
        }
        )
      } else if (type === 17) {
        //延期提货证明
        let params = {}
        if (sessionStorage.businessMode === '0') {
          params = {
            pickUpTime: orderInfo.originalExtractTime, //最晚提货日期
            sellingPrice: orderInfo.sellingPrice, //销售价格
            grade: orderInfo.grade //品位
          }
        } else if (sessionStorage.businessMode === '2') {
          params = {
            pickUpTime: orderInfo.latestDeliveryDate, //最晚提货日期
            unitPrice: orderInfo.unitPrice, //单价
            pledgeRatio: orderInfo.pledgeRatio, //质押比例
            annualRate: orderInfo.annualRate, //年化利率
            capitalOccupationDays: orderInfo.capitalOccupationDays //资金占用天数
          }
        }
        this.setState({
          param: params
        }, () => {
          router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visibleDelay`)
        })
      } else if (type === 19) {
        //提交仓单
        router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visibleWarehouse`)
      } else if (type === 20) {
        //仓单审批
        router.push(`/approval/warehouse/details?enterType=0&type=warehouse&key=bill&id=${orderId}`)
      } else if (type === 21) {
        //确认提货
        router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}`)
      }
    })
  }

  //订单首页大企业委托采购操作按钮
  handleBigBuyClick = (orderInfo, type, obj) => {
    let orderId =
      orderInfo.ordersId || orderInfo.saleOrdersId || orderInfo.storageOrdersId
    sessionStorage.setItem('businessMode', orderInfo.type)
    this.setState({
      orderId: orderInfo.ordersId
    }, () => {
      if (type === 1) {
        //切换到合同
        router.push(`/orderManage/details?enterType=1&key=contract&id=${orderId}`)
      } else if (type === 2) {
        //委托采购函
        this.setState({
          letterType: obj.letterType
        }, () => {
          router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visibleLetter&letterType=${obj.letterType}`)
        })
      } else if (type === 3) {
        //审核合同
        router.push(`/approval/contract/details?enterType=0&key=contract&id=${orderId}`)
      } else if (type === 4) {
        //保证金证明
        router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visibleBail`)
      } else if (type === 5) {
        // 跳转到保证金审批的详情页
        router.push(`/approval/bail/details?enterType=0&type=bail&key=bill&id=${orderId}`)
      } else if (type === 6) {
        // 货权转移证明
        router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}&modalKey=visibleTransfer`)
      } else if (type === 7) {
        // 切换到票据
        router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}`)
      } else if (type === 8) {
        // 终止发货
        router.push(`/orderManage/details?enterType=1&key=bill&id=${orderId}`)
      }
    })
  }

  //委托销售子订单操作按钮
  handleSubSaleClick = (orderInfo, type, obj) => {
    let orderId =
      orderInfo.ordersId || orderInfo.saleOrdersId || orderInfo.storageOrdersId
    sessionStorage.setItem('businessMode', orderInfo.type)
    const num = orderInfo.num
    const subOrderId =
      orderInfo.subSaleOrdersId || orderInfo.largeBuySubOrdersId
    const ordersId = orderInfo.saleOrdersId || orderInfo.largeBuyOrdersId
    this.setState({
      orderId: orderInfo.ordersId
    }, () => {
      if (type === 3) {
        //付款证明
        router.push(`/orderManage/details/childDetails?enterType=1&num=${num}&id=${subOrderId}&orderId=${ordersId}&modalkey=visiblePayment`)
      } else if (type === 5 || type === 6) {
        //切换到票据
        router.push(`/orderManage/details/childDetails?enterType=1&num=${num}&id=${subOrderId}&orderId=${ordersId}`)
      } else if (type === 9 || type === 13) {
        //开票证明
        router.push(`/orderManage/details/childDetails?enterType=1&num=${num}&id=${subOrderId}&orderId=${ordersId}&modalkey=visiblePayment&invoiceType=${obj.invoiceType}`)
      } else if (type === 11) {
        //切换到结算单
        router.push(`/orderManage/details/childDetails?enterType=1&key=settlement&num=${num}&id=${subOrderId}&orderId=${ordersId}`)
      } else if (type === 14) {
        //跳转到结算审批详情页
        router.push(`/orderManage/details/childDetails?enterType=1&num=${num}&key=settlement&id=${subOrderId}&orderId=${ordersId}`)
      }
    })
  }

  //大企业委托采购子订单操作按钮
  handleSubBigBuyClick = (orderInfo, type, obj) => {
    let orderId =
      orderInfo.ordersId || orderInfo.saleOrdersId || orderInfo.storageOrdersId
    sessionStorage.setItem('businessMode', orderInfo.type)
    const num = orderInfo.num
    const subOrderId =
      orderInfo.subSaleOrdersId || orderInfo.largeBuySubOrdersId
    const ordersId = orderInfo.saleOrdersId || orderInfo.largeBuyOrdersId
    this.setState({
      orderId: orderInfo.ordersId
    }, () => {
      if (type === 0) {
        //提交委托付款函证明
        router.push(`/orderManage/details/childDetails?enterType=1&num=${num}&id=${subOrderId}&orderId=${ordersId}&modalkey=visibleLetter`)
      } else if (type === 1) {
        //提交付款证明
        router.push(`/orderManage/details/childDetails?enterType=1&num=${num}&id=${subOrderId}&orderId=${ordersId}&modalkey=visiblePayment`)
      } else if (type === 2) {
        //切换到结算单
        router.push(`/orderManage/details/childDetails?enterType=1&key=settlement&num=${num}&id=${subOrderId}&orderId=${ordersId}`)
      } else if (type === 3) {
        //跳转到结算审批详情页
        router.push(`/orderManage/details/childDetails?enterType=1&num=${num}&key=settlement&id=${subOrderId}&orderId=${ordersId}`)
      } else if (type === 4) {
        router.push(`/orderManage/details/childDetails?enterType=1&num=${num}&id=${subOrderId}&orderId=${ordersId}`)
      } else if (type === 5) {
        //开票证明
        router.push(`/orderManage/details/childDetails?enterType=1&num=${num}&id=${subOrderId}&orderId=${ordersId}&modalkey=visibleInvoice&invoiceType=${obj.invoiceType}`)
      } else if (type === 21 || type === 22 || type === 23 || type === 24) {
        router.push(`/orderManage/details/childDetails?enterType=1&num=${num}&id=${subOrderId}&orderId=${ordersId}&modalkey=visiblePayment&retreatFillType=${obj.retreatFillType}`)
      }
    })
  }

  //查看详情
  toHandle = (orderId, businessMode, orderStatus) => {
    sessionStorage.setItem('businessMode', JSON.stringify(businessMode))
    sessionStorage.setItem('orderStatus', JSON.stringify(orderStatus))
    const { dispatch } = this.props
    dispatch({
      type: 'orderManage/pickBusinessMode',
      payload: businessMode,
      callback: () => {
        router.push(
          `/orderManage/details?enterType=1&key=details&id=${orderId}`
        )
      }
    })
  }

  //查看子订单详情
  toSubHandle = (orderInfo, businessMode, orderStatus) => {
    sessionStorage.setItem('businessMode', JSON.stringify(businessMode))
    sessionStorage.setItem('orderStatus', JSON.stringify(orderStatus))
    const { dispatch } = this.props
    const subOrderId =
      orderInfo.subSaleOrdersId || orderInfo.largeBuySubOrdersId
    const ordersId = orderInfo.saleOrdersId || orderInfo.largeBuyOrdersId
    const num = orderInfo.num
    dispatch({
      type: 'orderManage/pickBusinessMode',
      payload: businessMode,
      callback: () => {
        router.push(`/orderManage/details/childDetails?enterType=1&num=${num}&id=${subOrderId}&orderId=${ordersId}`)
      }
    })
  }

  onShowModal = (key, id, e) => {
    this.setState({
      [key]: true,
      modalId: id
    })
  }

  handlePreview = file => {
    let fileType = file.type

    if (fileType === 'application/pdf') {
      return message.warning('PDF文件暂时不支持浏览')
    }

    this.setState({
      url: file.url || file.thumbUrl,
      visibleImg: true
    })
  }

  callback = (key, cancel) => {
    const { dispatch } = this.props
    const { currentPage, pageSize } = this.state
    if (cancel !== 1) {
      //  获取首页订单统计
      dispatch({
        type: 'orderManage/getCounts',
        payload: 1
      })

      //获取首页订单列表
      dispatch({
        type: 'orderManage/getList',
        payload: {
          url: `currentPage=${currentPage}&pageSize=${pageSize}`,
          params: {}
        },
        success: resp => {
          if (resp.code === 0) {
            this.setState({
              ...resp.page
            })
          } else {
            this.setState({
              currentPage: 1,
              pageSize: 10,
              totalPage: 0,
              totalRecords: 0
            })
          }
        }
      })
    }

    this.setState({
      [key]: false,
      modalId: null
    })
  }

  edit = index => {
    this.setState({
      edit: true,
      num: index
    })
  }

  handleSave = row => {
    if (row.flag === 0) {
      //子订单业务名称不能被修改
      message.warning('子订单业务名称不能修改')
      return false
    }
    sessionStorage.setItem('businessMode', row.type)
    const { dispatch } = this.props
    const { currentPage } = this.state
    let params = {
      modeName: row.modeName,
      orderBusinessId: row.ordersId
    }
    //保存业务名称
    dispatch({
      type: 'detail/saveModeName',
      payload: params,
      success: () => {
        //获取首页订单列表
        dispatch({
          type: 'orderManage/getList',
          payload: {
            url: `currentPage=${currentPage}&pageSize=10`,
            params: {}
          },
          success: resp => {
            if (resp && resp.code === 0) {
              this.setState({
                ...resp.page
                // list: handleData(resp.data)
              })
              message.success('保存成功')
            } else {
              this.setState({
                currentPage: 1,
                pageSize: 10,
                totalPage: 0,
                totalRecords: 0
                // list: []
              })
            }
          }
        })
      },
      error: msg => {
        message.error('修改失败')
      }
    })
  }

  save = row => {
    this.setState({
      edit: false
    })

    this.props.form.validateFields((error, values) => {
      if (!error) {
        const modeName = values.modeName
        sessionStorage.setItem('businessMode', row.type)
        const { dispatch } = this.props
        const { currentPage } = this.state
        let params = {
          modeName: modeName,
          orderBusinessId: row.ordersId
        }
        //保存业务名称
        dispatch({
          type: 'detail/saveModeName',
          payload: params,
          success: () => {
            //获取首页订单列表
            dispatch({
              type: 'orderManage/getList',
              payload: {
                url: `currentPage=${currentPage}&pageSize=10`,
                params: {}
              },
              success: resp => {
                if (resp && resp.code === 0) {
                  this.setState({
                    ...resp.page
                    // list: handleData(resp.data)
                  })
                  message.success('保存成功')
                } else {
                  this.setState({
                    currentPage: 1,
                    pageSize: 10,
                    totalPage: 0,
                    totalRecords: 0
                    // list: []
                  })
                }
              }
            })
          },
          error: msg => {
            message.error('修改失败')
          }
        })
      }
    })
  }

  inputChange = e => {
    this.setState({ inputValue: e.target.value })
  }

  render() {
    const { counts, list } = this.props.orderManage
    const { getFieldDecorator } = this.props.form
    const { currentPage, pageSize, totalPage, totalRecords } = this.state
    const {
      url,
      visibleImg,
      visibleTransfer,
      visibleInvoice,
      visibleBail,
      visibleDelay,
      visibleGoods,
      visibleWarehouse,
      visiblePayment,
      visibleDelivery,
      visibleLetter,
      orderId,
      invoiceType,
      param,
      letterType
    } = this.state
    let columns = [{
      title: '　　　　订单编号',
      dataIndex: 'ordersId',
      key: 'ordersId',
      width: document.documentElement.clientWidth < 1700 ? '20%' : '15%',
      align: 'left',
      render: (text, row) => {
        if (row.flag === 1) {
          return text
        } else if (row.flag === 0) {
          return text + row.num
        }
      }
    }, {
      title: '业务名称',
      dataIndex: 'modeName',
      key: 'modeName',
      editable: true,
      width: '20%',
      render: (text, row, index) => {
        const { role } = this.props.global
        const { edit, num } = this.state
        if (edit && row.key === num) {
          return (
            <FormItem style={{ margin: 0 }}>
              {this.props.form.getFieldDecorator('modeName', {
                rules: [
                  {
                    required: true,
                    message: `业务名称不能为空或超过20个字`,
                    whitespace: true,
                    max: 20
                  }
                ],
                initialValue: row.modeName
              })(
                <Input
                  onPressEnter={this.save.bind(this, row)}
                  onBlur={this.save.bind(this, row)}
                  autoFocus
                  style={{ width: '85%' }}
                />
              )}
              <Icon
                type="check-circle"
                theme="twoTone"
                twoToneColor="#52c41a"
                style={{ fontSize: 20, marginLeft: 10, cursor: 'pointer' }}
              />
            </FormItem>
          )
        } else {
          if (row.flag === 1 && row.todoType === 1) {
            if (role.roleId === 6 || role.roleId === 7 || role.roleId === 8) {
              return (
                <div>
                  <span style={{ marginRight: 5 }}><Badge status="error" offset={[4, 0]}><span>{text}</span></Badge></span>
                  <Icon type="edit" onClick={this.edit.bind(this, row.key)} style={{ cursor: 'pointer', marginLeft: 5, fontSize: 15 }} />
                </div>
              )
            } else {
              return (
                <div>
                  <span style={{ marginRight: 5 }}><Badge status="error" offset={[4, 0]}><span>{text}</span></Badge></span>
                </div>
              )
            }
          } else if (row.flag === 0 && row.todoType === 1) {
            return (
              <div style={{ marginLeft: 32 }}>
                <span style={{ marginRight: 5 }}><Badge status="error" offset={[4, 0]}><span>{text}</span></Badge></span>
              </div>
            )
          } else if (row.flag === 1 && row.todoType === 0) {
            if (role.roleId === 6 || role.roleId === 7 || role.roleId === 8) {
              return (
                <div>
                  <span>{text}</span>
                  <Icon type="edit" onClick={this.edit.bind(this, row.key)} style={{ cursor: 'pointer', marginLeft: 5, fontSize: 15 }} />
                </div>
              )
            } else {
              return (
                <div>
                  <span>{text}</span>
                </div>
              )
            }
          } else {
            return <div style={{ marginLeft: 32 }}>{text}</div>
          }
        }
      }
    }, {
      title: '贷物名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
      width: '10%'
    }, {
      title: '业务模式',
      dataIndex: 'type',
      key: 'type',
      width: '10%',
      render: (text, row) => {
        if (row.flag === 1) {
          if (text === 0) {
            return '委托采购'
          } else if (text === 1) {
            return '委托销售'
          } else if (text === 2) {
            return '金融仓储'
          } else if (text === 4) {
            return '大企业委托采购'
          }
        } else if (row.flag === 0) {
          return ''
        }
      }
    }, {
      title: '订单状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: '10%',
      render: (text, row) => {
        if (row.flag === 1) {
          if (row.type === 0) {
            //businessMode === 0
            if (row.frozenStatus === 0) {
              return '冻结中'
            } else if (text === 0) {
              return '签订委托合同'
            } else if (text === 1) {
              return '提交保证金'
            } else if (text === 2) {
              return '签订采购合同'
            } else if (text === 3) {
              return '转移货权'
            } else if (text === 4) {
              return '支付货款'
            } else if (text === 5) {
              return '供应商开票'
            } else if (text === 6) {
              return '回款提货'
            } else if (text === 7) {
              return '延期申请中'
            } else if (text === 8) {
              return '等待放货'
            } else if (text === 9) {
              return '结算确认'
            } else if (text === 10) {
              return '开票收票'
            } else if (text === 12) {
              return '已完成'
            } else if (text === 13) {
              return '多退少补'
            }
          } else if (row.type === 1) {
            //businessMode === 1
            if (row.frozenStatus === 0) {
              return '冻结中'
            } else if (text === 0) {
              return '签订委托合同'
            } else if (text === 1) {
              return '提交保证金'
            } else if (text === 2) {
              return '签订销售合同'
            } else if (text === 3) {
              return '转移货权'
            } else if (text === 4) {
              return '委托企业开票'
            } else if (text === 5) {
              return '支付货款'
            } else if (text === 6) {
              return '采购商结算'
            } else if (text === 7) {
              return '采购商回款'
            } else if (text === 8) {
              return '委托方结算'
            } else if (text === 9) {
              return '委托企业开尾票'
            } else if (text === 10) {
              return '支付尾款'
            } else if (text === 12) {
              return '已完成'
            } else if (text === 13) {
              return '终止发货'
            }
          } else if (row.type === 2) {
            //businessMode === 2
            if (row.frozenStatus === 0) {
              return '冻结中'
            } else if (text === 0) {
              return '签订合同'
            } else if (text === 1) {
              return '提交仓单'
            } else if (text === 2) {
              return '回款提货'
            } else if (text === 3) {
              return '延期申请中'
            } else if (text === 4) {
              return '等待放货'
            } else if (text === 5) {
              return '转移货权'
            } else if (text === 6) {
              return '结算确认'
            } else if (text === 7) {
              return '委托企业收票'
            } else if (text === 9) {
              return '已完成'
            }
          } else if (row.type === 4) {
            //businessMode === 4
            if (row.frozenStatus === 0) {
              return '冻结中'
            } else if (text === 0) {
              return '签订销售合同'
            } else if (text === 1) {
              return '提交保证金'
            } else if (text === 2) {
              return '签订采购合同'
            } else if (text === 3) {
              return '转移货权'
            } else if (text === 4) {
              return '终止发货'
            } else if (text === 6) {
              return '已完成'
            }
          }
        } else if (row.flag === 0) {
          if (row.type === 1) {
            if (row.frozenStatus === 0) {
              return '冻结中'
            } else if (text === 4) {
              return '委托企业开票'
            } else if (text === 5) {
              return '支付货款'
            } else if (text === 6) {
              return '采购商结算'
            } else if (text === 7) {
              return '采购商回款'
            } else if (text === 8) {
              return '委托方结算'
            } else if (text === 9) {
              return '委托企业开尾票'
            } else if (text === 10) {
              return '支付尾款'
            } else if (text === 12) {
              return '已完成'
            }
          } else if (row.type === 4) {
            if (row.frozenStatus === 0) {
              return '冻结中'
            } else if (text === 0) {
              return '支付货款'
            } else if (text === 1) {
              return '结算确认'
            } else if (text === 2) {
              return '委托企业回款'
            } else if (text === 3) {
              return '开票收票'
            } else if (text === 5) {
              return '已完成'
            } else if (text === 6) {
              return '多退少补'
            }
          }
        }
      }
    }, {
      title: '日期',
      dataIndex: 'createTime',
      key: 'createTime',
      width: '15%',
      sorter: (a, b) => moment(a.createTime) - moment(b.createTime)
    }, {
      title: '操作',
      key: 'action',
      width: '25%',
      render: (text, row, index) => {
        //订单首页操作按钮判断
        const { role } = this.props.global
        const orderInfo = row
        const businessType = row.type
        if (row.frozenStatus === 0) {
          return (
            <span>{' '}<a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a></span>
          )
        }
        if (row.flag === 1) {
          if (businessType === 0) {
            if (orderInfo.orderStatus === 0) {
              if (role.roleId === 4) {
                if (orderInfo.submitStatus === 1) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 9)}>编辑合同</a>
                      <Divider type="vertical" />
                      <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 16, { letterType: 0 })}>提交委托采购函</a>
                      <Divider type="vertical" />
                      <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 9)}>编辑合同</a>
                      <Divider type="vertical" />
                      <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                    </span>
                  )
                }
              } else if (role.roleId === 7 || role.roleId === 8) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 1)}>审核合同</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 6) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 1)}>审核合同</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 1) {
              if (role.roleId === 1 && orderInfo.submitStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 13)}>提交保证金证明</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              } else if ((role.roleId === 10 || role.roleId === 11 || role.roleId === 12) && orderInfo.submitStatus === 1 && orderInfo.auditStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 2)}>审核保证金</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 2) {
              if (role.roleId === 4) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 9)} >编辑合同</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 6 || role.roleId === 7 || role.roleId === 8) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 1)}>审核合同</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 3) {
              if (role.roleId === 2 && orderInfo.submitStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 11)}>提交货权转移证明</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 10 && orderInfo.submitStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 11)}>帮供应商提交货权转移证明</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 7 && orderInfo.submitStatus === 1) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 5)}>确认货权转移</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 4) {
              if (role.roleId === 10) {
                if (orderInfo.submitStatus === 0) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 16, { letterType: 2 })}>提交委托付款函</a>
                      <Divider type="vertical" />
                      <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 3)}>提交付款证明</a>
                      <Divider type="vertical" />
                      <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                    </span>
                  )
                }
              } else {
                return (
                  <span>
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 5) {
              if (role.roleId === 2 && orderInfo.submitStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 8, { invoiceType: 0 })}>提交开票证明</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 10) {
                if (orderInfo.submitStatus) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 5)}>确认发票</a>
                      <Divider type="vertical" />
                      <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 8, { invoiceType: 0 })}>帮供应商提交开票证明</a>
                      <Divider type="vertical" />
                      <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                    </span>
                  )
                }
              } else {
                return (
                  <span>
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 6) {
              if (role.roleId === 1) {
                if (orderInfo.submitStatus === 1) {
                  return (
                    <span>
                      <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 14)}>申请提货</a>
                      <Divider type="vertical" />
                      <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 15)}>申请延期提货</a>
                      <Divider type="vertical" />
                      <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                    </span>
                  )
                }
              } else if ((role.roleId === 10 || role.roleId === 11 || role.roleId === 12) && orderInfo.submitStatus === 1 && orderInfo.auditStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 6)}>审核提货申请</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 7) {
              if ((role.roleId === 4 || role.roleId === 5 || role.roleId === 6 || role.roleId === 7 || role.roleId === 8) && orderInfo.auditStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 7)}>审核延期提货申请</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 14) {
                if (orderInfo.quota && orderInfo.quota > 5000000 && orderInfo.auditStatus === 0) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 7)}>审核延期提货申请</a>
                      <Divider type="vertical" />
                      <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                    </span>
                  )
                }
              } else {
                return (
                  <span>
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 8) {
              if (role.roleId === 7) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 4)}>提交放货证明</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 9) {
              if (role.roleId === 1 || role.roleId === 2) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 10)}>编辑结算单</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 10) {
                if (orderInfo.auditStatus === 0) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 10)}>编辑结算单</a>
                      <Divider type="vertical" />
                      <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 12)}>审核结算单</a>
                      <Divider type="vertical" />
                      <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 10)}>编辑结算单</a>
                      <Divider type="vertical" />
                      <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                    </span>
                  )
                }
              } else if ((role.roleId === 11 || role.roleId === 12) && orderInfo.auditStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 12)}>审核结算单</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 10) {
              if (role.roleId === 2 && orderInfo.submitStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 8, { invoiceType: 0 })}>提交开票证明</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 10) {
                if (orderInfo.submitStatus) {
                  return (
                    <span>
                      {orderInfo.submitStatus === 1 && (
                        <span>
                          <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 5)}>确认发票</a>
                          <Divider type="vertical" />
                        </span>
                      )}
                      <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 8, { invoiceType: 1 })}>提交开票证明</a>
                      <Divider type="vertical" />
                      <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 8, { invoiceType: 0 })}>帮供应商提交开票证明</a>
                      <Divider type="vertical" />
                      <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 8, { invoiceType: 1 })}>提交开票证明</a>
                      <Divider type="vertical" />
                      <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                    </span>
                  )
                }
              } else {
                return (
                  <span>
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 13 && role.roleId === 10) {
              if (orderInfo.retreatFillType) {
                if (orderInfo.retreatFillType.indexOf(',') !== -1) {
                  //有多个按钮
                  const btn = orderInfo.retreatFillType.split(',').map((item, index) => {
                    if (item === '1') {
                      return (
                        <span key={index}>
                          <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 21, { retreatFillType: 1 })}>委托企业付款</a>
                          <Divider type="vertical" />
                        </span>
                      )
                    } else if (item === '2') {
                      return (
                        <span key={index}>
                          <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 22, { retreatFillType: 2 })}>委托企业收款</a>
                          <Divider type="vertical" />
                        </span>
                      )
                    } else if (item === '3') {
                      return (
                        <span key={index}>
                          <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 23, { retreatFillType: 3 })}>供应商收款</a>
                          <Divider type="vertical" />
                        </span>
                      )
                    } else if (item === '4') {
                      return (
                        <span key={index}>
                          <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 24, { retreatFillType: 4 })}>供应商付款</a>
                          <Divider type="vertical" />
                        </span>
                      )
                    }
                  })
                  return (
                    <span>
                      {btn}
                      <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                    </span>
                  )
                } else {
                  //一个按钮
                  if (orderInfo.retreatFillType === '1') {
                    return (
                      <span>
                        <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 21, { retreatFillType: 1 })}>委托企业付款</a>
                        <Divider type="vertical" />
                        <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                      </span>
                    )
                  } else if (orderInfo.retreatFillType === '2') {
                    return (
                      <span>
                        <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 22, { retreatFillType: 2 })}>委托企业收款</a>
                        <Divider type="vertical" />
                        <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                      </span>
                    )
                  } else if (orderInfo.retreatFillType === '3') {
                    return (
                      <span>
                        <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 23, { retreatFillType: 3 })}>供应商收款</a>
                        <Divider type="vertical" />
                        <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                      </span>
                    )
                  } else if (orderInfo.retreatFillType === '4') {
                    return (
                      <span>
                        <a href="javascript:;" onClick={this.handleBuyClick.bind(this, row, 24, { retreatFillType: 4 })}>供应商付款</a>
                        <Divider type="vertical" />
                        <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                      </span>
                    )
                  }
                }
              } else {
                return (
                  <span>
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              }
            } else {
              return (
                <span>
                  <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                </span>
              )
            }
          } else if (businessType === 1) {
            if (orderInfo.orderStatus === 0) {
              if (role.roleId === 4) {
                if (orderInfo.submitStatus === 1) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleSaleClick.bind(this, row, 4)}>编辑合同</a>
                      <Divider type="vertical" />
                      <a href="javascript:;" onClick={this.handleSaleClick.bind(this, row, 8, { letterType: 1 })}>提交委托销售函</a>
                      <Divider type="vertical" />
                      <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleSaleClick.bind(this, row, 4)}>编辑合同</a>
                      <Divider type="vertical" />
                      <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                    </span>
                  )
                }
              } else if (role.roleId === 7 || role.roleId === 8) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleSaleClick.bind(this, row, 1)}>审核合同</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 6) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleSaleClick.bind(this, row, 1)}>审核合同</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 1) {
              if (role.roleId === 1 && orderInfo.submitStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleSaleClick.bind(this, row, 6)}>提交保证金证明</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else if ((role.roleId === 10 || role.roleId === 11 || role.roleId === 12) && orderInfo.submitStatus === 1 && orderInfo.auditStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleSaleClick.bind(this, row, 2)}>审核保证金</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 2) {
              if (role.roleId === 4) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleSaleClick.bind(this, row, 4)}>编辑合同</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 6 || role.roleId === 7 || role.roleId === 8) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleSaleClick.bind(this, row, 1)}>审核合同</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => this.toHandle(row.ordersId, businessType, row.orderStatus)}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 3) {
              //1,"装车后付款"  2,"货到后付款"
              if (orderInfo.paymentProvision === 1) {
                if (role.roleId === 1 && orderInfo.submitStatus === 0) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleSaleClick.bind(this, row, 5)}>提交货权转移证明</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else if (role.roleId === 7 && orderInfo.submitStatus === 1) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleSaleClick.bind(this, row, 3)}>确认货权转移</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else if (role.roleId === 10) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleSaleClick.bind(this, row, 7)}>终止发货</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                }
              } else if (orderInfo.paymentProvision === 2) {
                if (role.roleId === 2 && orderInfo.submitStatus === 0) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleSaleClick.bind(this, row, 5)}>提交货权转移证明</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else if (role.roleId === 7 && orderInfo.submitStatus === 1) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleSaleClick.bind(this, row, 3)}>确认货权转移</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else if (role.roleId === 10) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleSaleClick.bind(this, row, 5)}>帮购货商提交货权转移证明</a>
                      <Divider type="vertical" />
                      <a href="javascript:;" onClick={this.handleSaleClick.bind(this, row, 7)}>终止发货</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                }
              }
            } else {
              return (
                <span>
                  <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                </span>
              )
            }
          } else if (businessType === 2) {
            if (orderInfo.orderStatus === 0) {
              if (role.roleId === 4) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 10)}>编辑合同</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 6 || role.roleId === 7 || role.roleId === 8) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 1)}>审核合同</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 1) {
              if (role.roleId === 3 && orderInfo.submitStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 19)}>提交仓单</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 10 && orderInfo.submitStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 19)}>帮货代公司提交仓单</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else if ((role.roleId === 6 || role.roleId === 7) && orderInfo.submitStatus === 1) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 20)}>仓单审批</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 2) {
              // 0：所有证明未提交
              // 1.已提交付款，但是未提货、未延期
              // 2.已提交提货申请，但是未付款、未延期
              // 3.已提货、已付款，但是未延期
              // 4.已提货并且已审批当前提货申请，但是未付款、未延期
              if (role.roleId === 1 && (orderInfo.submitStatus === 0 || orderInfo.submitStatus === 1)) {
                if (orderInfo.submitStatus === 2 || orderInfo.submitStatus === 3) {
                  return (
                    <span>
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 16)}>申请提货</a>
                      <Divider type="vertical" />
                      <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 17)}>申请延期提货</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                }
              } else if ((role.roleId === 6 || role.roleId === 7 || role.roleId === 8) && (orderInfo.submitStatus === 2 || orderInfo.submitStatus === 3) && orderInfo.auditStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 7)}>审核提货申请</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 10 && (orderInfo.submitStatus !== 1 && orderInfo.submitStatus !== 3)) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 3)}>提交付款证明</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 3) {
              if ((role.roleId === 4 || role.roleId === 5 || role.roleId === 6 || role.roleId === 7 || role.roleId === 8) && orderInfo.auditStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 8)}>审核延期提货申请</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 14) {
                if (orderInfo.quota && orderInfo.quota > 5000000 && orderInfo.auditStatus === 0) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 8)}>审核延期提货申请</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                }
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 4) {
              if (role.roleId === 7) {
                if (orderInfo.submitStatus === 0 || orderInfo.submitStatus === 1) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 4)}>提交放货证明</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                }
              } else if (role.roleId === 10) {
                if (orderInfo.submitStatus === 0 || orderInfo.submitStatus === 2) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 3)}>提交付款证明</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                }
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 5) {
              if (role.roleId === 1) {
                if (orderInfo.submitStatus === 1 || orderInfo.submitStatus === 3) {
                  return (
                    <span>
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 21)}>确认提货</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                }
              } else if (role.roleId === 3) {
                if (orderInfo.submitStatus === 0 || orderInfo.submitStatus === 1) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 9, { invoiceType: 0 })}>提交开票证明</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                }
              } else if (role.roleId === 10) {
                if (orderInfo.submitStatus === 0 || orderInfo.submitStatus === 1) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 13, { invoiceType: 0 })}>帮货代公司提交开票证明</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else if (orderInfo.submitStatus === 2 || orderInfo.submitStatus === 3) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 5)}>确认发票</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                }
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 6) {
              if (role.roleId === 1) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 11)}>编辑结算单</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 10) {
                if (orderInfo.auditStatus === 0) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 11)}>编辑结算单</a>
                      <Divider type="vertical" />
                      <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 14)}>审核结算单</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 11)}>编辑结算单</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                }
              } else if ((role.roleId === 11 || role.roleId === 12) && orderInfo.auditStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 14)}>审核结算单</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 7) {
              if (role.roleId === 10) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleStorageClick.bind(this, row, 9, { invoiceType: 1 })}>提交开票证明</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else {
              return (
                <span>
                  <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                </span>
              )
            }
          } else if (businessType === 4) {
            if (orderInfo.orderStatus === 0) {
              //签订委托合同
              if (role.roleId === 4) {
                if (orderInfo.letterStatus === 1) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleBigBuyClick.bind(this, row, 1)}>编辑合同</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else if (orderInfo.submitStatus === 1) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleBigBuyClick.bind(this, row, 1)}>编辑合同</a>
                      <Divider type="vertical" />
                      <a href="javascript:;" onClick={this.handleBigBuyClick.bind(this, row, 2, { letterType: 0 })}>提交委托采购函</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleBigBuyClick.bind(this, row, 1)}>编辑合同</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                }
              } else if (role.roleId === 7 || role.roleId === 8) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBigBuyClick.bind(this, row, 3)}>审核合同</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 6) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBigBuyClick.bind(this, row, 3)}>审核合同</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 1) {
              //提交保证金
              if (role.roleId === 1 && orderInfo.submitStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBigBuyClick.bind(this, row, 4)}>提交保证金证明</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else if ((role.roleId === 10 || role.roleId === 11 || role.roleId === 12) && orderInfo.submitStatus === 1 && orderInfo.auditStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBigBuyClick.bind(this, row, 5)}>审核保证金</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 2) {
              if (role.roleId === 4) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBigBuyClick.bind(this, row, 1)}>编辑合同</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 6 || role.roleId === 7 || role.roleId === 8) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBigBuyClick.bind(this, row, 3)}>审核合同</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 3) {
              if (role.roleId === 2 && orderInfo.submitStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBigBuyClick.bind(this, row, 6)}>提交货权转移证明</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 10) {
                if (orderInfo.submitStatus === 0) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleBigBuyClick.bind(this, row, 6)}>帮供应商提交货权转移证明</a>
                      <Divider type="vertical" />
                      <a href="javascript:;" onClick={this.handleBigBuyClick.bind(this, row, 8)}>终止发货</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleBigBuyClick.bind(this, row, 8)}>终止发货</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                }
              } else if (role.roleId === 7 && orderInfo.submitStatus === 1) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleBigBuyClick.bind(this, row, 7)}>确认货权转移</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else {
              return (
                <span>
                  <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                </span>
              )
            }
          } else {
            return (
              <span>
                <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
              </span>
            )
          }
        } else if (row.flag === 0) {
          if (businessType === 1) {
            if (orderInfo.orderStatus === 4) {
              if (role.roleId === 1 && orderInfo.submitStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleSubSaleClick.bind(this, row, 9, { invoiceType: 0 })}>提交开票证明</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 10 && orderInfo.submitStatus === 1) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleSubSaleClick.bind(this, row, 5)}>确认发票</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 5) {
              if (role.roleId === 10 && orderInfo.submitStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleSubSaleClick.bind(this, row, 3)}>提交付款证明</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 6) {
              if (role.roleId === 2) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleSubSaleClick.bind(this, row, 11)}>编辑结算单</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 10) {
                if (orderInfo.auditStatus === 1) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleSubSaleClick.bind(this, row, 11)}>编辑结算单</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else {
                  if (orderInfo.auditStatus === 0) {
                    return (
                      <span>
                        <a href="javascript:;" onClick={this.handleSubSaleClick.bind(this, row, 11)}>编辑结算单</a>
                        <Divider type="vertical" />
                        <a href="javascript:;" onClick={this.handleSubSaleClick.bind(this, row, 14)}>审核结算单</a>
                        <Divider type="vertical" />
                        <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                      </span>
                    )
                  } else {
                    return (
                      <span>
                        <a href="javascript:;" onClick={this.handleSubSaleClick.bind(this, row, 11)}>编辑结算单</a>
                        <Divider type="vertical" />
                        <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                      </span>
                    )
                  }
                }
              } else if ((role.roleId === 11 || role.roleId === 12) && orderInfo.auditStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleSubSaleClick.bind(this, row, 14)}>审核结算单</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 7) {
              if (role.roleId === 10) {
                if (orderInfo.submitStatus === 2 || orderInfo.submitStatus === 3) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleSubSaleClick.bind(this, row, 5)}>确认收款</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else if (orderInfo.submitStatus === 0 || orderInfo.submitStatus === 3) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleSubSaleClick.bind(this, row, 9, { invoiceType: 1 })}>提交开票证明</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                }
              } else if (role.roleId === 2 && (orderInfo.submitStatus === 0 || orderInfo.submitStatus === 1)) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleSubSaleClick.bind(this, row, 3)}>提交付款证明</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 8) {
              if (role.roleId === 1) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleSubSaleClick.bind(this, row, 11)}>编辑结算单</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 10) {
                if (orderInfo.auditStatus === 0) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleSubSaleClick.bind(this, row, 11)}>编辑结算单</a>
                      <Divider type="vertical" />
                      <a href="javascript:;" onClick={this.handleSubSaleClick.bind(this, row, 14)}>审核结算单</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleSubSaleClick.bind(this, row, 11)}>编辑结算单</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                }
              } else if ((role.roleId === 11 || role.roleId === 12) && orderInfo.auditStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleSubSaleClick.bind(this, row, 14)}>审核结算单</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 9) {
              if (role.roleId === 1 && orderInfo.submitStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleSubSaleClick.bind(this, row, 9, { invoiceType: 0 })}>提交开票证明</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 10 && orderInfo.submitStatus === 1) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleSubSaleClick.bind(this, row, 5)}>确认发票</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 10) {
              if (role.roleId === 10 && orderInfo.submitStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleSubSaleClick.bind(this, row, 3)}>提交付款证明</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else {
              return (
                <span>
                  <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                </span>
              )
            }
          } else if (businessType === 4) {
            if (orderInfo.orderStatus === 0) {
              if (role.roleId === 10) {
                if (orderInfo.submitStatus === 0) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleSubBigBuyClick.bind(this, row, 0)}>提交委托付款函</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleSubBigBuyClick.bind(this, row, 1)}>提交付款证明</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                }
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 1) {
              if (role.roleId === 1 || role.roleId === 2) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleSubBigBuyClick.bind(this, row, 2)}>编辑结算单</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 10) {
                if (orderInfo.auditStatus === 0) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleSubBigBuyClick.bind(this, row, 2)}>编辑结算单</a>
                      <Divider type="vertical" />
                      <a href="javascript:;" onClick={this.handleSubBigBuyClick.bind(this, row, 3)}>审核结算单</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleSubBigBuyClick.bind(this, row, 2)}>编辑结算单</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                }
              } else if ((role.roleId === 11 || role.roleId === 12) && orderInfo.auditStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleSubBigBuyClick.bind(this, row, 3)}>审核结算单</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 2) {
              if (role.roleId === 10 && orderInfo.submitStatus === 1) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleSubBigBuyClick.bind(this, row, 4)}>确认收款</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 1 && orderInfo.submitStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleSubBigBuyClick.bind(this, row, 1)}>提交付款证明</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 3) {
              if (role.roleId === 2 && orderInfo.submitStatus === 0) {
                return (
                  <span>
                    <a href="javascript:;" onClick={this.handleSubBigBuyClick.bind(this, row, 5, { invoiceType: 0 })}>提交开票证明</a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              } else if (role.roleId === 10) {
                if (orderInfo.submitStatus) {
                  return (
                    <span>
                      <a href="javascript:;" onClick={this.handleSubBigBuyClick.bind(this, row, 4)}>确认发票</a>
                      <Divider type="vertical" />
                      <a href="javascript:;" onClick={this.handleSubBigBuyClick.bind(this, row, 5, { invoiceType: 1 })}>提交开票证明</a>
                      <Divider type="vertical" />
                      <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else {
                  if (orderInfo.submitStatus === 0) {
                    return (
                      <span>
                        <a href="javascript:;" onClick={this.handleSubBigBuyClick.bind(this, row, 5, { invoiceType: 0 })}>帮供应商提交开票证明</a>
                        <Divider type="vertical" />
                        <a href="javascript:;" onClick={this.handleSubBigBuyClick.bind(this, row, 5, { invoiceType: 1 })}>提交开票证明</a>
                        <Divider type="vertical" />
                        <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                      </span>
                    )
                  } else {
                    return (
                      <span>
                        <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                      </span>
                    )
                  }
                }
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else if (orderInfo.orderStatus === 6) {
              if (orderInfo.retreatFillType && role.roleId === 10) {
                if (orderInfo.retreatFillType.indexOf(',') !== -1) {
                  //有多个按钮
                  const btn = orderInfo.retreatFillType.split(',').map((item, index) => {
                    if (item === '1') {
                      return (
                        <span key={index}>
                          <a href="javascript:;" onClick={this.handleSubBigBuyClick.bind(this, row, 21, { retreatFillType: 1 })}>委托企业付款</a>
                          <Divider type="vertical" />
                        </span>
                      )
                    } else if (item === '2') {
                      return (
                        <span key={index}>
                          <a href="javascript:;" onClick={this.handleSubBigBuyClick.bind(this, row, 22, { retreatFillType: 2 })}>委托企业收款</a>
                          <Divider type="vertical" />
                        </span>
                      )
                    } else if (item === '3') {
                      return (
                        <span key={index}>
                          <a href="javascript:;" onClick={this.handleSubBigBuyClick.bind(this, row, 23, { retreatFillType: 3 })}>供应商收款</a>
                          <Divider type="vertical" />
                        </span>
                      )
                    } else if (item === '4') {
                      return (
                        <span key={index}>
                          <a href="javascript:;" onClick={this.handleSubBigBuyClick.bind(this, row, 24, { retreatFillType: 4 })}>供应商付款</a>
                          <Divider type="vertical" />
                        </span>
                      )
                    }
                  })
                  return (
                    <span>
                      {btn}
                      <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                    </span>
                  )
                } else {
                  //一个按钮
                  if (orderInfo.retreatFillType === '1') {
                    return (
                      <span>
                        <a href="javascript:;" onClick={this.handleSubBigBuyClick.bind(this, row, 21, { retreatFillType: 1 })}>委托企业付款</a>
                        <Divider type="vertical" />
                        <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                      </span>
                    )
                  } else if (orderInfo.retreatFillType === '2') {
                    return (
                      <span>
                        <a href="javascript:;" onClick={this.handleSubBigBuyClick.bind(this, row, 22, { retreatFillType: 2 })}>委托企业收款</a>
                        <Divider type="vertical" />
                        <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                      </span>
                    )
                  } else if (orderInfo.retreatFillType === '3') {
                    return (
                      <span>
                        <a href="javascript:;" onClick={this.handleSubBigBuyClick.bind(this, row, 23, { retreatFillType: 3 })}>供应商收款</a>
                        <Divider type="vertical" />
                        <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                      </span>
                    )
                  } else if (orderInfo.retreatFillType === '4') {
                    return (
                      <span>
                        <a href="javascript:;" onClick={this.handleSubBigBuyClick.bind(this, row, 24, { retreatFillType: 4 })}>供应商付款</a>
                        <Divider type="vertical" />
                        <a onClick={() => { this.toHandle(row.ordersId, businessType, row.orderStatus) }}>查看详情</a>
                      </span>
                    )
                  }
                }
              } else {
                return (
                  <span>
                    <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                  </span>
                )
              }
            } else {
              return (
                <span>
                  <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
                </span>
              )
            }
          } else {
            return (
              <span>
                <a onClick={() => { this.toSubHandle(row, businessType, row.orderStatus) }}>查看详情</a>
              </span>
            )
          }
        }
      }
    }]

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.div}>
            <span>已完成的订单</span>
            <span>{counts && counts.orderFinish}</span>
          </div>
          <Divider type="vertical" style={{ height: '62px' }} />
          <div className={styles.div}>
            <span>进行中的订单</span>
            <span>{counts && counts.orderProcessing}</span>
          </div>
          <Divider type="vertical" style={{ height: '62px' }} />
          <div className={styles.div}>
            <span>异常的订单</span>
            <span>{counts && counts.orderUnusual}</span>
          </div>
        </div>

        <div className={styles.body}>
          <span className={styles.title}>订单列表</span>
          <Form className={styles.form} layout="inline">
            <FormItem label="委托企业">
              {getFieldDecorator('entrustCompanyName')(
                <Input style={{ width: 280 }} placeholder="请输入" />
              )}
            </FormItem>

            <FormItem label="选择日期">
              {getFieldDecorator('rangePicker')(
                <RangePicker style={{ width: 280 }} allowClear={false} />
              )}
            </FormItem>

            <FormItem label="业务单号">
              {getFieldDecorator('orderId')(
                <Input style={{ width: 280 }} placeholder="请输入" />
              )}
            </FormItem>

            <FormItem label="业务类型">
              {getFieldDecorator('businessMode')(
                <Select style={{ width: 280 }}>
                  <Option value={0}>委托采购</Option>
                  <Option value={1}>委托销售</Option>
                  <Option value={2}>金融仓储</Option>
                  <Option value={4}>大型企业委托采购</Option>
                </Select>
              )}
            </FormItem>

            <div className={styles.btnBox}>
              <Button type="primary" onClick={this.handleSearch.bind(this)}>查 询</Button>
              <Button style={{ marginLeft: 10 }} onClick={this.handleReset.bind(this)}>重 置</Button>
            </div>
          </Form>

          {
            list && list.length ? (
              <Table
                columns={columns}
                dataSource={list}
                defaultExpandAllRows={true}
                indentSize={30}
                rowKey={'key'}
                pagination={{
                  showQuickJumper: true,
                  showSizeChanger: true,
                  defaultCurrent: 1,
                  defaultPageSize: 10,
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalRecords,
                  onChange: this.onChange.bind(this),
                  pageSizeOptions: ['10', '20', '30'],
                  showTotal: (total, range) => `共 ${totalRecords} 条记录 第 ${currentPage} / ${totalPage} 页`,
                  onShowSizeChange: this.onShowSizeChange.bind(this)
                }}
              />
            ) : (
                <div className={styles.spin}>
                  <Empty />
                </div>
              )
          }
        </div>

        <Modal
          style={{ zIndex: '1000' }}
          visible={visibleImg}
          footer={null}
          onCancel={() => this.setState({ visibleImg: false })}
        >
          {
            url ? (
              typeof url === 'string' ? <img alt="图片" style={{ width: '100%' }} src={url} />
                :
                url.map((url, index) => (
                  <img
                    key={index}
                    alt="图片"
                    style={{ width: '100%', marginBottom: 20 }}
                    src={url.url}
                  />
                ))
            ) : ''}
        </Modal>

        {visibleTransfer && (
          <TransferModal
            orderBusinessId={orderId}
            visible={visibleTransfer}
            callback={(key, cancel) => this.callback(key, cancel)}
            preview={file => this.handlePreview(file)}
          />
        )}

        {visibleInvoice && (
          <InvoiceModal
            invoiceType={invoiceType}
            orderBusinessId={orderId}
            visible={visibleInvoice}
            callback={(key, cancel) => this.callback(key, cancel)}
            preview={file => this.handlePreview(file)}
          />
        )}

        {visibleBail && (
          <BailModal
            orderBusinessId={orderId}
            visible={visibleBail}
            callback={(key, cancel) => this.callback(key, cancel)}
            preview={file => this.handlePreview(file)}
          />
        )}

        {visibleDelay && (
          <DelayModal
            params={param}
            orderBusinessId={orderId}
            visible={visibleDelay}
            callback={(key, cancel) => this.callback(key, cancel)}
          />
        )}

        {visibleGoods && (
          <GoodsModal
            params={param}
            orderBusinessId={orderId}
            visible={visibleGoods}
            callback={(key, cancel) => this.callback(key, cancel)}
            preview={file => this.handlePreview(file)}
          />
        )}

        {visibleWarehouse && (
          <WarehouseModal
            orderBusinessId={orderId}
            visible={visibleWarehouse}
            callback={(key, cancel) => this.callback(key, cancel)}
            preview={file => this.handlePreview(file)}
          />
        )}

        {visiblePayment && (
          <PaymentModal
            orderBusinessId={orderId}
            // retreatFillType={retreatFillType}
            visible={visiblePayment}
            callback={(key, cancel) => this.callback(key, cancel)}
            preview={file => this.handlePreview(file)}
          />
        )}

        {visibleDelivery && (
          <DeliveryModal
            orderBusinessId={orderId}
            visible={visibleDelivery}
            callback={(key, cancel) => this.callback(key, cancel)}
            preview={file => this.handlePreview(file)}
          />
        )}

        {visibleLetter && (
          <LetterModal
            orderBusinessId={orderId}
            letterType={letterType}
            visible={visibleLetter}
            callback={(key, cancel) => this.callback(key, cancel)}
            preview={file => this.handlePreview(file)}
          />
        )}
      </div>
    )
  }
}
