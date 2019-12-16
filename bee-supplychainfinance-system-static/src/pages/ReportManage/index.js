import React, { Component } from 'react';
import styles from './index.less';
import { Breadcrumb, Form, Select, DatePicker, Input, Button, Table, Icon, message, Spin, Collapse } from 'antd';
import withRouter from "umi/withRouter";
import request from '@/utils/request';
import moment from 'moment';
import { connect } from 'dva';
import { exportExcel } from './services'

const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

//整体业务表头字段
const list = ['orderId', 'creator', 'teamName', 'signTimeBuy', 'signTimeSale', 'businessMode', 'companyNameBuy', 'numberBuy', 'companyNameSale', 'numberSale', 'quantity', 'purchasingPrice', 'salePrice', 'saleAmountCumulative', 'receiptDateAppointment', 'receiptAmountAppointment', 'initialMargin', 'countDownDays', 'goodsWarningLine', 'goodsPrice', 'decline', 'goodsActualPlace', 'deliveredNumber', 'undeliveredNumber', 'receivedNumber', 'ticketsTime', 'ticketsReceivedTon', 'ticketsMoneyDay', 'ticketsTonCumulative', 'ticketsAmountCumulative', 'invoiceTime', 'invoiceAlreadyTon', 'invoiceMoneyDay',
  'invoiceTonCumulative', 'invoiceAmountCumulative', 'paymentTime', 'paymentAmountDay', 'paymentAmountCumulative', 'financialPayables', 'operationalPayables', 'moneyBackTime', 'moneyBackDay', 'moneyBackCumulative', 'financialReceivable', 'operationalReceivable', 'orderStatus', 'statusModifyTime', 'deliveryLatest']

//整体业务表头中文
const listMap = ['订单号', '创建人', '合同签订部门', '采购合同签订时间', '销售合同签订时间', '业务类型', '公司名（采购）', '合同号（采购）', '公司名（销售）', '合同号（销售）', '数量', '采购价格（元）', '销售价格（元）', '销售总金额', '约定收款日期（委托销售）', '约定累计收款金额（委托销售）', '初始保证金', '倒计时天数', '警戒线（跌幅）', '标的物当日价格', '跌幅', '货物当前所在地', '已发数量', '未发数量', '已到数量', '收票时间', '已收票吨位', '当日收票金额', '累计收票吨位', '累计收票金额', '开票时间', '已开票吨位', '当日开票金额',
  '累计开票吨位', '累计开票金额', '付款时间', '当日付款金额', '累计付款金额', '财务应付款', '业务应付款（欠对方）', '回款时间', '当日回款金额', '累计回款金额', '财务应收款', '业务应收款（对方欠款）', '当前订单状态', '状态更新时间', '最晚交货期']

let children = [];
@withRouter
@Form.create()
@connect(({ global }) => ({
  global,
}))
export default class Index extends Component {

  constructor() {
    super()
    this.state = {
      dataSource: [],
      params: {},
      currentPage: 1,
      pageSize: 21,
      totalPage: 0,
      totalRecords: 0,
      str: '',
      columns: [],
      searchField: [],
      downloading: false,//文件下载中
      collapseKey: '1',
      loading:false
    }
    this.searchPanel = React.createRef();
  }

  //设置表格表头
  columnsHandle = (data = [{ fields: '', fieldsName: '' }]) => {
    // console.log(typeof(data[0]),data.length)
    if (data[0] === null) {
      data = [{ fields: '', fieldsName: '' }]
    }
    return data.map((item, index) => {
      const result = {
        title: item.fieldsName,
        dataIndex: item.fields,
        key: item.fields,
        align: 'center',
        width: 150,
        render: (text) => (<div style={{ minWidth: 150, wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>)
      }

      if (item.fields === 'countDownDays') {
        result.render = (text, row) => {
          return <span style={text === 0 ? { color: 'red', minWidth: 150, wordWrap: 'break-word', wordBreak: 'break-all' } : { width: 150, wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</span >
        }
      }
      if (index > 0) {
        item.width = 150
      }
      return result
    })
  }

  componentDidMount() {
    const { pageSize } = this.state
    //请求上次选择的字段接口
    request(`/supplychainfinance-audit/reportForm/getFiledForUser`, {
      method: 'GET'
    }).then((resp) => {
      if (resp && resp.code === 0 && resp.data !== null) {
        this.setSearchField(resp.data)
        this.setState({
          columns: this.columnsHandle(resp.data),
        }, () => {

          //条件查询报表信息
          request(`/supplychainfinance-audit/reportForm/getReportsByCondition`, {
            method: 'POST',
            body: {}
          }).then((resp) => {
            if (resp && resp.code === 0) {
              this.setState({
                dataSource: handleData(resp.data),
                ...resp.page,
                // pageSize:pageSize+1,
              })
            } else {
              this.setState({
                dataSource: [],
                currentPage: 1,
                pageSize: 20,
                totalPage: 0,
                totalRecords: 0,
              })
            }
          })
        })
      } else {//报表模板接口查询失败时,

        //重置下拉选择框
        for (let i = 0; i < list.length; i++) {
          children.push(<Option key={list[i]}>{listMap[i]}</Option>);
        }

        //报表模板接口查询失败时,手动设置表单表头
        this.setState({
          columns: [{
            title: '订单号',
            dataIndex: 'orderId',
            key: 'orderId',
          }, {
            title: '创建人',
            dataIndex: 'creator',
            key: 'creator',
          }, {
            title: '合同签订部门',
            dataIndex: 'teamName',
            key: 'teamName',
          }, {
            title: '采购合同签订时间',
            dataIndex: 'signTimeBuy',
            key: 'signTimeBuy',
          }, {
            title: '销售合同签订时间',
            dataIndex: 'signTimeSale',
            key: 'signTimeSale',
          }, {
            title: '业务类型',
            dataIndex: 'businessMode',
            key: 'businessMode'
          }, {
            title: '公司名(采购)',
            dataIndex: 'companyNameBuy',
            key: 'companyNameBuy',
          }, {
            title: '合同号(采购)',
            dataIndex: 'numberBuy',
            key: 'numberBuy',
          }, {
            title: '公司名(销售)',
            dataIndex: 'companyNameSale',
            key: 'companyNameSale',
          }, {
            title: '合同号(销售)',
            dataIndex: 'numberSale',
            key: 'numberSale',
          }, {
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity',
          }, {
            title: '采购价格(元)',
            dataIndex: 'purchasingPrice',
            key: 'purchasingPrice',
          }, {
            title: '销售价格(元)',
            dataIndex: 'salePrice',
            key: 'salePrice',
          }, {
            title: '销售总金额',
            dataIndex: 'saleAmountCumulative',
            key: 'saleAmountCumulative',
          }, {
            title: '约定收款日期(委托销售)',
            dataIndex: 'receiptDateAppointment',
            key: 'receiptDateAppointment',
          }, {
            title: '约定累计收款金额(委托销售)',
            dataIndex: 'receiptAmountAppointment',
            key: 'receiptAmountAppointment',
          }, {
            title: '初始保证金',
            dataIndex: 'initialMargin',
            key: 'initialMargin',
          }, {
            title: '倒计时天数',
            dataIndex: 'countDownDays',
            key: 'countDownDays',
            render: (text, row) => {
              return <span style={text === 0 ? { color: 'red' } : {}}>{text}</span >
            }
          }, {
            title: '警戒线(跌幅)',
            dataIndex: 'goodsWarningLine',
            key: 'goodsWarningLine',
          }, {
            title: '标的物当日价格',
            dataIndex: 'goodsPrice',
            key: 'goodsPrice',
          }, {
            title: '跌幅',
            dataIndex: 'decline',
            key: 'decline',
          }, {
            title: '货物当前所在地',
            dataIndex: 'goodsActualPlace',
            key: 'goodsActualPlace',
          }, {
            title: '已发数量',
            dataIndex: 'deliveredNumber',
            key: 'deliveredNumber',
          }, {
            title: '未发数量',
            dataIndex: 'undeliveredNumber',
            key: 'undeliveredNumber',
          }, {
            title: '已到数量',
            dataIndex: 'receivedNumber',
            key: 'receivedNumber',
          }, {
            title: '收票时间',
            dataIndex: 'ticketsTime',
            key: 'ticketsTime',
          }, {
            title: '已收票吨位',
            dataIndex: 'ticketsReceivedTon',
            key: 'ticketsReceivedTon',
          }, {
            title: '当日收票金额',
            dataIndex: 'ticketsMoneyDay',
            key: 'ticketsMoneyDay',
          }, {
            title: '累计收票吨位',
            dataIndex: 'ticketsTonCumulative',
            key: 'ticketsTonCumulative',
          }, {
            title: '累计收票金额',
            dataIndex: 'ticketsAmountCumulative',
            key: 'ticketsAmountCumulative',
          }, {
            title: '开票时间',
            dataIndex: 'invoiceTime',
            key: 'invoiceTime',
          }, {
            title: '已开票吨位',
            dataIndex: 'invoiceAlreadyTon',
            key: 'invoiceAlreadyTon',
          }, {
            title: '当日开票金额',
            dataIndex: 'invoiceMoneyDay',
            key: 'invoiceMoneyDay',
          }, {
            title: '累计开票吨位',
            dataIndex: 'invoiceTonCumulative',
            key: 'invoiceTonCumulative',
          }, {
            title: '累计开票金额',
            dataIndex: 'invoiceAmountCumulative',
            key: 'invoiceAmountCumulative',
          }, {
            title: '付款时间',
            dataIndex: 'paymentTime',
            key: 'paymentTime',
          }, {
            title: '当日付款金额',
            dataIndex: 'paymentAmountDay',
            key: 'paymentAmountDay',
          }, {
            title: '累计付款金额',
            dataIndex: 'paymentAmountCumulative',
            key: 'paymentAmountCumulative',
          }, {
            title: '财务应付款',
            dataIndex: 'financialPayables',
            key: 'financialPayables',
          }, {
            title: '业务应付款(欠对方)',
            dataIndex: 'operationalPayables',
            key: 'operationalPayables',
          }, {
            title: '回款时间',
            dataIndex: 'moneyBackTime',
            key: 'moneyBackTime',
          }, {
            title: '当日回款金额',
            dataIndex: 'moneyBackDay',
            key: 'moneyBackDay',
          }, {
            title: '累计回款金额',
            dataIndex: 'moneyBackCumulative',
            key: 'moneyBackCumulative',
          }, {
            title: '财务应收款',
            dataIndex: 'financialReceivable',
            key: 'financialReceivable',
          }, {
            title: '业务应收款(对方欠款)',
            dataIndex: 'operationalReceivable',
            key: 'operationalReceivable',
          }, {
            title: '当前订单状态',
            dataIndex: 'orderStatus',
            key: 'orderStatus'
          }, {
            title: '状态更新时间',
            dataIndex: 'statusModifyTime',
            key: 'statusModifyTime',
          }, {
            title: '最晚交货期',
            dataIndex: 'deliveryLatest',
            key: 'deliveryLatest',
          }]
        }, () => {

          //条件查询报表信息
          request(`/supplychainfinance-audit/reportForm/getReportsByCondition`, {
            method: 'POST',
            body: {}
          }).then((resp) => {
            if (resp && resp.code === 0) {
              this.setState({
                dataSource: handleData(resp.data),
                ...resp.page
              })
            } else {
              this.setState({
                dataSource: [],
                currentPage: 1,
                pageSize: 20,
                totalPage: 0,
                totalRecords: 0,
              })
            }
          })
        })
      }
    })
  }

  //查询按钮
  handleOk = () => {
    const { validateFields } = this.props.form
    validateFields((error, values) => {
      // debugger
      if (!error) {
        let params = {}

        //业务类型
        if (values.type) {
          params['businessMode'] = values.type
        }

        //报表类型
        if (values.report) {
          params['reportType'] = values.report
        }

        //订单创建日期
        if (values.time && values.time.length) {
          params['startTime'] = moment(values['time'][0]).format('YYYY-MM-DD'),
            params['endTime'] = moment(values['time'][1]).format('YYYY-MM-DD')
        }

        //委托企业
        if (values.name) {
          params['entrustCompanyName'] = values.name
        }

        //处理显示字段
        if (values.keys) {
          let key = values.keys.map((item, index) => {
            return {
              'fields': item.key,
              'fieldsName': item.label
            }
          })
          params['searchField'] = key
        }

        if (params.searchField && params.searchField.length > 0) {//如果选中有显示字段
          this.setState({
            params,
            columns: this.columnsHandle(params.searchField)
          }, () => {

            //条件查询报表信息
            request(`/supplychainfinance-audit/reportForm/getReportsByCondition`, {
              method: 'POST',
              body: params
            }).then((resp) => {
              if (resp && resp.code === 0) {
                this.setState({
                  dataSource: handleData(resp.data),
                  ...resp.page
                })
              } else {
                this.setState({
                  dataSource: [],
                  currentPage: 1,
                  pageSize: 20,
                  totalPage: 0,
                  totalRecords: 0,
                })
              }
            })
          })
        } else {
          if (params.searchField && params.searchField.length === 0) {//用户手动取消选中字段至空

            //删除searchField：[]
            delete params.searchField

            request(`/supplychainfinance-audit/reportForm/getFieldsByTemplateType?reportType=${values.report || 2}`, {
              method: 'GET'
            }).then((resp) => {
              if (resp && resp.code === 0) {
                this.setState({
                  params,
                  columns: this.columnsHandle(resp.data)
                }, () => {

                  //条件查询报表信息
                  request(`/supplychainfinance-audit/reportForm/getReportsByCondition`, {
                    method: 'POST',
                    body: params
                  }).then((resp) => {
                    if (resp && resp.code === 0) {
                      this.setState({
                        dataSource: handleData(resp.data),
                        ...resp.page
                      })
                    } else {
                      this.setState({
                        dataSource: [],
                        currentPage: 1,
                        pageSize: 20,
                        totalPage: 0,
                        totalRecords: 0,
                      })
                    }
                  })
                })
              }
            })
          } else {
            this.setState({
              params,
            }, () => {

              //条件查询报表信息
              request(`/supplychainfinance-audit/reportForm/getReportsByCondition`, {
                method: 'POST',
                body: params
              }).then((resp) => {
                if (resp && resp.code === 0) {
                  this.setState({
                    dataSource: handleData(resp.data),
                    ...resp.page
                  })
                } else {
                  this.setState({
                    dataSource: [],
                    currentPage: 1,
                    pageSize: 20,
                    totalPage: 0,
                    totalRecords: 0,
                  })
                }
              })
            })
          }
        }
      }
    })
  }

  //重置按钮
  handleCancle = () => {
    const { resetFields } = this.props.form
    children = []

    for (let i = 0; i < list.length; i++) {
      children.push(<Option key={list[i]}>{listMap[i]}</Option>);
    }

    //报表模板接口
    request(`/supplychainfinance-audit/reportForm/getFieldsByTemplateType?reportType=2`, {
      method: 'GET'
    }).then((resp) => {
      if (resp && resp.code === 0) {
        this.setState({
          params: {},
          columns: this.columnsHandle(resp.data)
        }, () => {

          //条件查询报表信息
          request(`/supplychainfinance-audit/reportForm/getReportsByCondition`, {
            method: 'POST',
            body: {}
          }).then((resp) => {
            if (resp && resp.code === 0) {
              resetFields()
              this.setState({
                dataSource: handleData(resp.data),
                ...resp.page
              })
            } else {
              resetFields()
              this.setState({
                dataSource: [],
                currentPage: 1,
                pageSize: 20,
                totalPage: 0,
                totalRecords: 0,
              })
            }
          })
        })
      } else {//报表模板接口查询失败时，手动设置表单表头
        this.setState({
          params: {},
          columns: [{
            title: '订单号',
            dataIndex: 'orderId',
            key: 'orderId',
            width: 150
          }, {
            title: '创建人',
            dataIndex: 'creator',
            key: 'creator',
            width: 150
          }, {
            title: '合同签订部门',
            dataIndex: 'teamName',
            key: 'teamName',
            width: 150
          }, {
            title: '采购合同签订时间',
            dataIndex: 'signTimeBuy',
            key: 'signTimeBuy',
            width: 150
          }, {
            title: '销售合同签订时间',
            dataIndex: 'signTimeSale',
            key: 'signTimeSale',
            width: 150
          }, {
            title: '业务类型',
            dataIndex: 'businessMode',
            key: 'businessMode',
            width: 150
          }, {
            title: '公司名(采购)',
            dataIndex: 'companyNameBuy',
            key: 'companyNameBuy',
            width: 150
          }, {
            title: '合同号(采购)',
            dataIndex: 'numberBuy',
            key: 'numberBuy',
            width: 150
          }, {
            title: '公司名(销售)',
            dataIndex: 'companyNameSale',
            key: 'companyNameSale',
            width: 150
          }, {
            title: '合同号(销售)',
            dataIndex: 'numberSale',
            key: 'numberSale',
            width: 150
          }, {
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 150
          }, {
            title: '采购价格(元)',
            dataIndex: 'purchasingPrice',
            key: 'purchasingPrice',
            width: 150
          }, {
            title: '销售价格(元)',
            dataIndex: 'salePrice',
            key: 'salePrice',
            width: 150
          }, {
            title: '销售总金额',
            dataIndex: 'saleAmountCumulative',
            key: 'saleAmountCumulative',
            width: 150
          }, {
            title: '约定收款日期(委托销售)',
            dataIndex: 'receiptDateAppointment',
            key: 'receiptDateAppointment',
            width: 150
          }, {
            title: '约定累计收款金额(委托销售)',
            dataIndex: 'receiptAmountAppointment',
            key: 'receiptAmountAppointment',
            width: 150
          }, {
            title: '初始保证金',
            dataIndex: 'initialMargin',
            key: 'initialMargin',
            width: 150
          }, {
            title: '倒计时天数',
            dataIndex: 'countDownDays',
            key: 'countDownDays',
            width: 150,
            render: (text, row) => {
              return <span style={text === 0 ? { color: 'red' } : {}}>{text}</span >
            }
          }, {
            title: '警戒线(跌幅)',
            dataIndex: 'goodsWarningLine',
            key: 'goodsWarningLine',
            width: 150
          }, {
            title: '标的物当日价格',
            dataIndex: 'goodsPrice',
            key: 'goodsPrice',
            width: 150
          }, {
            title: '跌幅',
            dataIndex: 'decline',
            key: 'decline',
            width: 150
          }, {
            title: '货物当前所在地',
            dataIndex: 'goodsActualPlace',
            key: 'goodsActualPlace',
            width: 150
          }, {
            title: '已发数量',
            dataIndex: 'deliveredNumber',
            key: 'deliveredNumber',
            width: 150
          }, {
            title: '未发数量',
            dataIndex: 'undeliveredNumber',
            key: 'undeliveredNumber',
            width: 150
          }, {
            title: '已到数量',
            dataIndex: 'receivedNumber',
            key: 'receivedNumber',
            width: 150
          }, {
            title: '收票时间',
            dataIndex: 'ticketsTime',
            key: 'ticketsTime',
            width: 150
          }, {
            title: '已收票吨位',
            dataIndex: 'ticketsReceivedTon',
            key: 'ticketsReceivedTon',
            width: 150
          }, {
            title: '当日收票金额',
            dataIndex: 'ticketsMoneyDay',
            key: 'ticketsMoneyDay',
            width: 150
          }, {
            title: '累计收票吨位',
            dataIndex: 'ticketsTonCumulative',
            key: 'ticketsTonCumulative',
            width: 150
          }, {
            title: '累计收票金额',
            dataIndex: 'ticketsAmountCumulative',
            key: 'ticketsAmountCumulative',
            width: 150
          }, {
            title: '开票时间',
            dataIndex: 'invoiceTime',
            key: 'invoiceTime',
            width: 150
          }, {
            title: '已开票吨位',
            dataIndex: 'invoiceAlreadyTon',
            key: 'invoiceAlreadyTon',
            width: 150
          }, {
            title: '当日开票金额',
            dataIndex: 'invoiceMoneyDay',
            key: 'invoiceMoneyDay',
            width: 150
          }, {
            title: '累计开票吨位',
            dataIndex: 'invoiceTonCumulative',
            key: 'invoiceTonCumulative',
            width: 150
          }, {
            title: '累计开票金额',
            dataIndex: 'invoiceAmountCumulative',
            key: 'invoiceAmountCumulative',
            width: 150
          }, {
            title: '付款时间',
            dataIndex: 'paymentTime',
            key: 'paymentTime',
            width: 150
          }, {
            title: '当日付款金额',
            dataIndex: 'paymentAmountDay',
            key: 'paymentAmountDay',
            width: 150
          }, {
            title: '累计付款金额',
            dataIndex: 'paymentAmountCumulative',
            key: 'paymentAmountCumulative',
            width: 150
          }, {
            title: '财务应付款',
            dataIndex: 'financialPayables',
            key: 'financialPayables',
            width: 150
          }, {
            title: '业务应付款(欠对方)',
            dataIndex: 'operationalPayables',
            key: 'operationalPayables',
            width: 150
          }, {
            title: '回款时间',
            dataIndex: 'moneyBackTime',
            key: 'moneyBackTime',
            width: 150
          }, {
            title: '当日回款金额',
            dataIndex: 'moneyBackDay',
            key: 'moneyBackDay',
            width: 150
          }, {
            title: '累计回款金额',
            dataIndex: 'moneyBackCumulative',
            key: 'moneyBackCumulative',
            width: 150
          }, {
            title: '财务应收款',
            dataIndex: 'financialReceivable',
            key: 'financialReceivable',
            width: 150
          }, {
            title: '业务应收款(对方欠款)',
            dataIndex: 'operationalReceivable',
            key: 'operationalReceivable',
            width: 150
          }, {
            title: '当前订单状态',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            width: 150
          }, {
            title: '状态更新时间',
            dataIndex: 'statusModifyTime',
            key: 'statusModifyTime',
            width: 150
          }, {
            title: '最晚交货期',
            dataIndex: 'deliveryLatest',
            key: 'deliveryLatest',
          }]
        }, () => {

          //条件查询报表信息
          request(`/supplychainfinance-audit/reportForm/getReportsByCondition`, {
            method: 'POST',
            body: {}
          }).then((resp) => {
            if (resp && resp.code === 0) {
              resetFields()
              this.setState({
                dataSource: handleData(resp.data),
                ...resp.page
              })
            } else {
              resetFields()
              this.setState({
                dataSource: [],
                currentPage: 1,
                pageSize: 20,
                totalPage: 0,
                totalRecords: 0,
              })
            }
          })
        })
      }
    })
  }

  onChange = (currentPage) => {
    const { pageSize, params } = this.state;
    // debugger
    //条件查询报表接口
    request(`/supplychainfinance-audit/reportForm/getReportsByCondition?currentPage=${currentPage}&pageSize=${pageSize}`, {
      method: 'POST',
      body: params
    }).then((resp) => {
      if (resp && resp.code === 0) {
        this.setState({
          dataSource: handleData(resp.data),
          ...resp.page,
          // pageSize:resp.page.pageSize+1
        })
      } else {
        this.setState({
          dataSource: [],
          currentPage: 1,
          pageSize: 20,
          totalPage: 0,
          totalRecords: 0,
        })
      }
    })
  }

  onShowSizeChange = (currentPage, pageSize) => {
    const { params } = this.state

    //条件查询报表接口
    request(`/supplychainfinance-audit/reportForm/getReportsByCondition?currentPage=${1}&pageSize=${pageSize}`, {
      method: 'POST',
      body: params
    }).then((resp) => {
      if (resp && resp.code === 0) {
        this.setState({
          dataSource: handleData(resp.data),
          ...resp.page,
          // pageSize:pageSize + 1
        })
      } else {
        this.setState({
          dataSource: [],
          currentPage: 1,
          pageSize: 20,
          totalPage: 0,
          totalRecords: 0,
        })
      }
    })
  }

  //选择报表模板
  handleSelectChange = (value) => {
    let params = {}
    const { setFieldsValue, validateFields } = this.props.form
    setFieldsValue({
      keys: []
    })

    //重新获取选择字段
    validateFields((error, values) => {

      if (values.type) {
        params['businessMode'] = values.type
      }


      params['reportType'] = value


      if (values.time && values.time.length) {
        params['startTime'] = moment(values['time'][0]).format('YYYY-MM-DD'),
          params['endTime'] = moment(values['time'][1]).format('YYYY-MM-DD')
      }

      if (values.name) {
        params['entrustCompanyName'] = values.name
      }
    })

    //请求报表模板接口
    request(`/supplychainfinance-audit/reportForm/getFieldsByTemplateType?reportType=${value}`, {
      method: 'GET',
    }).then((resp) => {
      if (resp && resp.code === 0) {
        this.setSearchField(resp.data)
        this.setState({
          params,
          columns: this.columnsHandle(resp.data),
        }, () => {

          //条件查询报表接口
          request(`/supplychainfinance-audit/reportForm/getReportsByCondition`, {
            method: 'POST',
            body: params,
          }).then((resp) => {
            if (resp && resp.code === 0) {
              this.setState({
                dataSource: handleData(resp.data),
                ...resp.page,
              })
            } else {
              this.setState({
                dataSource: [],
                currentPage: 1,
                pageSize: 20,
                totalPage: 0,
                totalRecords: 0,
              })
            }
          })
        })
      } else {//请求报表模板接口失败时
        const arr = []
        this.setSearchField(arr)//清空下拉菜单
        this.setState({
          params,
          columns: null
        }, () => {

          //条件查询报表接口
          request(`/supplychainfinance-audit/reportForm/getReportsByCondition`, {
            method: 'POST',
            body: params,
          }).then((resp) => {
            if (resp && resp.code === 0) {
              -
                this.setState({
                  dataSource: handleData(resp.data),
                  ...resp.page,
                })
            } else {
              this.setState({
                dataSource: [],
                currentPage: 1,
                pageSize: 20,
                totalPage: 0,
                totalRecords: 0,
              })
            }
          })
        })
      }
    })
  }

  //设置下拉菜单
  setSearchField = (data) => {
    if (data[0] === null) {
      return
    }
    children = []
    for (let j = 0; j < data.length; j++) {
      children.push(<Option key={data[j].fields}>{data[j].fieldsName}</Option>);
    }
  }

  //导出报表
  exportExcel() {
    let { params } = this.state;
    if (!params.reportType) {
      params.reportType = "2"
    }
    this.setState({
      downloading: true
    })
    exportExcel(params).then(blob => {
      if (blob) {
        var filename = `报表.xls`
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, filename);  //兼容ie10
        } else {
          var a = document.createElement('a');
          document.body.appendChild(a) //兼容火狐，将a标签添加到body当中
          var url = window.URL.createObjectURL(blob);   // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
          a.href = url;
          a.download = filename;
          a.target = '_blank'  // a标签增加target属性
          a.click();
          a.remove()  //移除a标签
          window.URL.revokeObjectURL(url);
        }
      } else {
        message.error('导出失败')
      }
      //延时
      setTimeout(() => {
        this.setState({
          downloading: false
        })
      }, 1000)
    })
  }

  //伸缩面板变化
  collapseChange(collapseKey) {
    this.setState({
      collapseKey
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    let { dataSource, currentPage, pageSize, totalRecords, totalPage, columns, downloading, collapseKey } = this.state;
    // columns = columns.map(item => {
    //   item.render = (text) => (<div style={{ width: 150, textAlign: 'center', wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>)
    //   return { ...item, width: 150 }
    // })
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    }
    const panelHeigt = tableHeight(collapseKey === '1', 6)
    return (
      <div className={styles.container}>
        {/* <div className={styles.header}> */}
        <Collapse expandIconPosition='right' accordion onChange={this.collapseChange.bind(this)} activeKey={collapseKey}
          expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : -90} />}
        >
          <Panel ref={this.searchPanel} forceRender header="报表管理" key="1">
            <Form layout='inline'>
              <FormItem label='业务类型' {...formItemLayout}>
                {getFieldDecorator('type')(
                  <Select style={{}}>
                    <Option value="0">委托采购</Option>
                    <Option value="1">委托销售</Option>
                    <Option value="2">金融仓储</Option>
                    <Option value="4">大型企业委托采购</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label='报表模板' {...formItemLayout}>
                {getFieldDecorator('report')(
                  <Select style={{}} onChange={this.handleSelectChange}>
                    <Option value="0">采购报表</Option>
                    <Option value="1">销售报表</Option>
                    <Option value="2">整体业务</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label='订单创建日期' {...formItemLayout}>
                {getFieldDecorator('time')(
                  <RangePicker format='YYYY-MM-DD' allowClear={false} />
                )}
              </FormItem>
              {/* </Form> */}
              <FormItem label='委托企业' {...formItemLayout}>
                {getFieldDecorator('name')(
                  <Input style={{}} placeholder="请输入" />
                )}
              </FormItem>
              <FormItem label='显示字段' {...formItemLayout}>
                {getFieldDecorator('keys', {
                  // initialValue: values  //children

                })(
                  <Select
                    className='select'
                    mode="multiple"
                    labelInValue={true}
                    style={{ minHeight: 60, overflowX: 'hidden' }}
                    placeholder="请选择"
                  >
                    {children}
                  </Select>
                )}
              </FormItem>
              <FormItem className={styles.buttons} label='' wrapperCol={formItemLayout}>
                <Button type="primary" style={{ marginRight: 20 }} onClick={this.handleOk}>查询</Button>
                <Button onClick={this.handleCancle}>重置</Button>
              </FormItem>
            </Form>

          </Panel>
        </Collapse>

        <div className={styles.export}>
          {!downloading ? <a onClick={this.exportExcel.bind(this)}><Icon type="download" />导出为Excel</a>
            : <span className={styles.loading} ><Spin size='small' delay={100} style={{ marginLeft: 10 }} spinning={downloading} />下载中</span>}
        </div>

        <div className={styles.body}>
          <div className={styles.tableBox}>
            <Table dataSource={dataSource}
              size='small'
              columns={columns}
              pagination={{
                showQuickJumper: true,
                showSizeChanger: true,
                defaultCurrent: 1,
                defaultPageSize: 21,
                current: currentPage,
                pageSize: pageSize + 1,
                total: totalRecords,
                onChange: this.onChange.bind(this),
                pageSizeOptions: ["10", "20", "30"],
                showTotal: (total, range) => `共 ${totalRecords} 条记录 第 ${currentPage} / ${totalPage} 页`,
                onShowSizeChange: this.onShowSizeChange.bind(this)
              }}
              scroll={{ x: 1400, y: document.documentElement.clientHeight - 64 - 45 - panelHeigt - 20 - 20 * 2 - 64 - 16 * 2 - 24 }}
            />
          </div>
        </div>
      </div>
    )
  }
}

const handleData = (data) => {
  return data.list.concat([{
    orderId: '合计',
    quantity: data.dataAmount.quantityTotal,
    saleAmountCumulative: data.dataAmount.saleAmountCumulativeTotal,
    receiptAmountAppointment: data.dataAmount.receiptAmountAppointmentTotal,
    initialMargin: data.dataAmount.initialMarginTotal,
    deliveredNumber: data.dataAmount.deliveredNumberTotal,
    undeliveredNumber: data.dataAmount.undeliveredNumberTotal,
    receivedNumber: data.dataAmount.receivedNumberTotal,
    ticketsReceivedTon: data.dataAmount.ticketsReceivedTonTotal,
    ticketsMoneyDay: data.dataAmount.ticketsMoneyDayTotal,
    ticketsTonCumulative: data.dataAmount.ticketsTonCumulativeTotal,
    ticketsAmountCumulative: data.dataAmount.ticketsAmountCumulativeTotal,
    invoiceAlreadyTon: data.dataAmount.invoiceAlreadyTonTotal,
    invoiceMoneyDay: data.dataAmount.invoiceMoneyDayTotal,
    invoiceTonCumulative: data.dataAmount.invoiceTonCumulativeTotal,
    invoiceAmountCumulative: data.dataAmount.invoiceAmountCumulativeTotal,
    paymentAmountDay: data.dataAmount.paymentAmountDayTotal,
    paymentAmountCumulative: data.dataAmount.paymentAmountCumulativeTotal,
    financialPayables: data.dataAmount.financialPayablesTotal,
    operationalPayables: data.dataAmount.operationalPayablesTotal,
    moneyBackDay: data.dataAmount.moneyBackDayTotal,
    moneyBackCumulative: data.dataAmount.moneyBackCumulativeTotal,
    financialReceivable: data.dataAmount.financialReceivableTotal,
    operationalReceivable: data.dataAmount.operationalReceivableTotal,
  }])
}

const tableHeight = (collapse, count) => {
  const rowHeight = 40;
  const textAreaHeight = 65;
  const paddingHeight = 16 * 2 + 10;
  const clientWidth = document.documentElement.clientWidth;
  const rowCount = Math.floor((clientWidth - 256 - 50) / 400);//每行放置数
  const row = Math.ceil(count / (rowCount || 1));//列数
  return !collapse ? 0 : (row - 1) * rowHeight + textAreaHeight + paddingHeight
}