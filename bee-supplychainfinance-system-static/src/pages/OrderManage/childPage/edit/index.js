import React, { Component } from 'react';
import styles from './index.less';
import { Button, Icon, Input, InputNumber, message, Modal, Breadcrumb } from 'antd';
import Excel from '../../components/excel';
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import withRouter from "umi/withRouter";
import { guid } from '@/utils/utils';

@withRouter
@connect(({ global, settlement, loading }) => ({
  global,
  settlement,
  loading: loading.effects
}))
export default class Index extends Component {
  state = {
    collectionInvoicesAlready: [],
    collectionInvoicesNot: [],
    productAccounts: [],
    qualityRequirements: [],
    modelData: [],
    shouldUpate: true,
    loading: false,
    visibleImport: false,
    max: false
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { accountType, orderId, accountsId } = this.props.location.query;
    // 获取结算单
    dispatch({
      type: 'settlement/getInfo',
      payload: orderId,
      success: (data) => {
        let cArr1 = [], cArr2 = [], pArr = [], qArr = [];
        if (Object.keys(data).length !== 0) {
          const { collectionInvoicesAlready = [], collectionInvoicesNot = [], productAccounts = [], qualityRequirements = [] } = accountType === '0' && data.sale ? data.sale : data.buy ? data.buy : [];
          collectionInvoicesAlready.forEach(i => {
            cArr1.push({
              collectionTime: i.collectionTime,
              explaining: i.explaining,
              collectionAmount: i.collectionAmount,
              invoiceTime: i.invoiceTime,
              invoiceQuality: i.invoiceQuality,
              acountUnitPrice: i.acountUnitPrice,
              issuedInvoiceAmount: i.issuedInvoiceAmount,
              taxExclusiveAmount: i.taxExclusiveAmount,
              collectionMethod: i.collectionMethod,
              collectionType: 0,
              uuid: guid()
            })
          })
          collectionInvoicesNot.forEach(i => {
            cArr2.push({
              collectionTime: i.collectionTime,
              explaining: i.explaining,
              collectionAmount: i.collectionAmount,
              invoiceTime: i.invoiceTime,
              invoiceQuality: i.invoiceQuality,
              acountUnitPrice: i.acountUnitPrice,
              issuedInvoiceAmount: i.issuedInvoiceAmount,
              taxExclusiveAmount: i.taxExclusiveAmount,
              collectionMethod: i.collectionMethod,
              collectionType: 0,
              uuid: guid()
            })
          })
          productAccounts.forEach(i => {
            pArr.push({
              deliveryTime: i.deliveryTime,
              deliveryQuantity: i.deliveryQuantity,
              receivingQuality: i.receivingQuality,
              deductSlag: i.deductSlag,
              deductWater: i.deductWater,
              remark: i.remark,
              accountQuantity: i.accountQuantity,
              quantityDifference: i.quantityDifference,
              transportMethod: i.transportMethod,
              uuid: guid()
            })
          })
          qualityRequirements.forEach(i => {
            qArr.push({
              qualityTestProject: i.qualityTestProject,
              qualityTestStandard: i.qualityTestStandard,
              deliveryQuality: i.deliveryQuality,
              checkoutQuality: i.checkoutQuality,
              actualAccountQuality: i.actualAccountQuality,
              qualityError: i.qualityError,
              isconform: i.isconform,
              specificExplain: i.specificExplain,
              remark: i.remark,
              uuid: guid()
            })
          })
          this.setState({
            collectionInvoicesAlready: cArr1,
            collectionInvoicesNot: cArr2,
            productAccounts: pArr,
            qualityRequirements: qArr
          })
        }
      },
      error: (msg) => {
        message.error('获取结算单失败:' + msg)
      }
    })
  }

  addRow = (type, e) => {
    let { collectionInvoicesAlready, collectionInvoicesNot, productAccounts, qualityRequirements } = this.state;

    if (type === 'i1') {
      collectionInvoicesAlready.push({
        collectionTime: null,
        explaining: null,
        collectionAmount: null,
        invoiceTime: null,
        invoiceQuality: null,
        acountUnitPrice: null,
        issuedInvoiceAmount: null,
        taxExclusiveAmount: null,
        collectionMethod: null,
        collectionType: 0,
        uuid: guid()
      })
    } else if (type === 'i2') {
      collectionInvoicesNot.push({
        collectionTime: null,
        explaining: null,
        collectionAmount: null,
        invoiceTime: null,
        invoiceQuality: null,
        acountUnitPrice: null,
        issuedInvoiceAmount: null,
        taxExclusiveAmount: null,
        collectionMethod: null,
        collectionType: 0,
        uuid: guid()
      })
    } else if (type === 'b') {
      productAccounts.push({
        deliveryTime: null,
        deliveryQuantity: null,
        receivingQuality: null,
        deductSlag: null,
        deductWater: null,
        remark: null,
        accountQuantity: null,
        quantityDifference: null,
        transportMethod: null,
        uuid: guid()
      })
    } else if (type === 'q') {
      qualityRequirements.push({
        qualityTestProject: null,
        qualityTestStandard: null,
        deliveryQuality: null,
        checkoutQuality: null,
        actualAccountQuality: null,
        qualityError: null,
        isconform: null,
        specificExplain: null,
        remark: null,
        uuid: guid()
      })
    }

    this.setState({
      collectionInvoicesAlready,
      collectionInvoicesNot,
      productAccounts,
      qualityRequirements
    })
  }

  deleteRow = (type, index, e) => {
    let { collectionInvoicesAlready, collectionInvoicesNot, productAccounts, qualityRequirements } = this.state;

    if (type === 'i1') {
      collectionInvoicesAlready.splice(index, 1)
    } else if (type === 'i2') {
      collectionInvoicesNot.splice(index, 1)
    } else if (type === 'b') {
      productAccounts.splice(index, 1)
    } else if (type === 'q') {
      qualityRequirements.splice(index, 1)
    }

    this.setState({
      collectionInvoicesAlready,
      collectionInvoicesNot,
      productAccounts,
      qualityRequirements
    })
  }

  excelImport(arr) {
    let { collectionInvoicesAlready, collectionInvoicesNot, productAccounts, qualityRequirements } = this.state;
    outerLoop: for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      let iObj1 = {
        collectionTime: null,
        explaining: null,
        collectionAmount: null,
        invoiceTime: null,
        invoiceQuality: null,
        acountUnitPrice: null,
        issuedInvoiceAmount: null,
        taxExclusiveAmount: null,
        collectionMethod: null,
        collectionType: 0,
        uuid: guid()
      }, iObj2 = {
        collectionTime: null,
        explaining: null,
        collectionAmount: null,
        invoiceTime: null,
        invoiceQuality: null,
        acountUnitPrice: null,
        issuedInvoiceAmount: null,
        taxExclusiveAmount: null,
        collectionMethod: null,
        collectionType: 0,
        uuid: guid()
      }, bObj = {
        deliveryTime: null,
        deliveryQuantity: null,
        receivingQuality: null,
        deductSlag: null,
        deductWater: null,
        remark: null,
        accountQuantity: null,
        quantityDifference: null,
        transportMethod: null,
        uuid: guid()
      }, qObj = {
        qualityTestProject: null,
        qualityTestStandard: null,
        deliveryQuality: null,
        checkoutQuality: null,
        actualAccountQuality: null,
        qualityError: null,
        isconform: null,
        specificExplain: null,
        remark: null,
        uuid: guid()
      }
      middleLoop: for (let key in item) {
        if (key.indexOf('日期') > -1) {
          key.indexOf('开票日期') > -1 ? iObj1.invoiceTime = item[key] : iObj1.collectionTime = item[key]
        } else if (key.indexOf('说明') > -1) {
          key.indexOf('具体说明') > -1 ? qObj.specificExplain = item[key] :
            key.indexOf('说明2') > -1 ? iObj2.explaining = item[key] : iObj1.explaining = item[key]
        } else if (key.indexOf('收款') > -1 || key.indexOf('付款') > -1) {
          key.indexOf('方式') > -1 ? (
            key.indexOf('2') > -1 ? iObj2.collectionMethod = item[key] : iObj1.collectionMethod = item[key]
          ) :
            key.indexOf('已') > -1 ? iObj1.collectionAmount = item[key] : iObj2.collectionAmount = item[key]
        } else if (key.indexOf('开票数量') > -1) {
          key.indexOf('2') > -1 ? iObj2.invoiceQuality = item[key] : iObj1.invoiceQuality = item[key]
        } else if (key.indexOf('结算单价') > -1) {
          key.indexOf('2') > -1 ? iObj2.acountUnitPrice = item[key] : iObj1.acountUnitPrice = item[key]
        } else if (key.indexOf('开具发票金额') > -1 || key.indexOf('收取进项发票') > -1) {
          key.indexOf('已') > -1 ? iObj1.issuedInvoiceAmount = item[key] : iObj2.issuedInvoiceAmount = item[key]
        } else if (key.indexOf('不含税金额') > -1) {
          key.indexOf('2') > -1 ? iObj2.taxExclusiveAmount = item[key] : iObj1.taxExclusiveAmount = item[key]
        } else if (key.indexOf('发货时间') > -1 || key.indexOf('收货时间') > -1) {
          bObj.deliveryTime = item[key]
        } else if (key.indexOf('发货数量') > -1) {
          bObj.deliveryQuantity = item[key]
        } else if (key.indexOf('收货数量') > -1) {
          bObj.receivingQuality = item[key]
        } else if (key.indexOf('扣渣') > -1) {
          bObj.deductSlag = item[key]
        } else if (key.indexOf('扣水') > -1) {
          bObj.deductWater = item[key]
        } else if (key.indexOf('其他') > -1) {
          bObj.remark = item[key]
        } else if (key.indexOf('结算数量') > -1) {
          bObj.accountQuantity = item[key]
        } else if (key.indexOf('数量差异') > -1) {
          bObj.quantityDifference = item[key]
        } else if (key.indexOf('运输方式') > -1) {
          bObj.transportMethod = item[key]
        } else if (key.indexOf('质检项目') > -1) {
          qObj.qualityTestProject = item[key]
        } else if (key.indexOf('质检标准') > -1 || key.indexOf('合同标准') > -1) {
          qObj.qualityTestStandard = item[key]
        } else if (key.indexOf('发货品质') > -1) {
          qObj.deliveryQuality = item[key]
        } else if (key.indexOf('检验品质') > -1) {
          qObj.checkoutQuality = item[key]
        } else if (key.indexOf('实际结算品质') > -1) {
          qObj.actualAccountQuality = item[key]
        } else if (key.indexOf('品质误差') > -1) {
          qObj.qualityError = item[key]
        } else if (key.indexOf('是否符合同要求') > -1) {
          qObj.isconform = item[key]
        } else if (key.indexOf('备注') > -1) {
          qObj.remark = item[key]
        } else {
          message.error('请使用下载的模板，（勿改变表格标题)')
          break outerLoop
        }
      }
      collectionInvoicesAlready.push(iObj1);
      collectionInvoicesNot.push(iObj2);
      productAccounts.push(bObj);
      qualityRequirements.push(qObj);
    }
    this.setState({
      collectionInvoicesAlready,
      collectionInvoicesNot,
      productAccounts,
      qualityRequirements,
      visibleImport: false
    })
  }

  onChange = (type, index, key, e) => {
    let { collectionInvoicesAlready, collectionInvoicesNot, productAccounts, qualityRequirements } = this.state;
    let value;

    // console.log(typeof e)
    if (e === '' || e === null || e === undefined) {
      // console.log('重置为null')
      value = null;
    } else if (typeof e === 'object') {
      // console.log("target:" + e.target.value)
      value = e.target.value || null;
    } else {
      // console.log("e:" + e)
      value = e;
    }

    if (value && value.length > 50) {
      this.setState({
        max: true
      })
      return message.error("您输入的内容超过最大限制");
    }

    if (type === 'i1') {
      collectionInvoicesAlready[index][key] = value;
    } else if (type === 'i2') {
      collectionInvoicesNot[index][key] = value;
    } else if (type === 'b') {
      productAccounts[index][key] = value;
      if (key === 'accountQuantity' && productAccounts[index]['deliveryQuantity']) {
        productAccounts[index]['quantityDifference'] = (value - productAccounts[index]['deliveryQuantity']).toFixed(3)
      } else if (key === 'deliveryQuantity' && productAccounts[index]['accountQuantity']) {
        productAccounts[index]['quantityDifference'] = (productAccounts[index]['accountQuantity'] - value).toFixed(3)
      }
    } else if (type === 'q') {
      qualityRequirements[index][key] = value;
    }

    this.setState({
      collectionInvoicesAlready,
      collectionInvoicesNot,
      productAccounts,
      qualityRequirements,
      shouldUpate: !this.state.shouldUpate,
      max: false
    })
  }

  saveBill = () => {
    this.setState({
      loading: true
    }, () => {
      const { dispatch } = this.props;
      const { accountType, orderId, accountsId } = this.props.location.query;
      let { collectionInvoicesAlready, collectionInvoicesNot, productAccounts, qualityRequirements, max } = this.state;
      let params = {
        accountType,
        orderId,
        collectionInvoicesAlready,
        collectionInvoicesNot,
        productAccounts,
        qualityRequirements
      }

      if (max) {
        return message.error('您输入的内容超过长度限制，不能保存结算单');
      }

      if (accountsId) {
        sessionStorage.businessMode === '0' ? params['buyAccountsId'] = accountsId :
          sessionStorage.businessMode === '1' ? params['saleAccountsId'] = accountsId :
            sessionStorage.businessMode === '2' ? params['storageAccountsId'] = accountsId :
              params['largeBuyAccountsId'] = accountsId
      }

      dispatch({
        type: 'settlement/sava',
        payload: params,
        success: () => {
          this.setState({
            loading: false
          }, () => {
            message.success('结算单保存成功');
            this.goBack();
          })
        },
        error: (msg) => {
          this.setState({
            loading: false
          }, () => message.error('结算单保存失败：' + msg))
        }
      })
    })
  }

  //返回结算单页面
  goBack() {
    if (sessionStorage.orderDetailUrl) {
      try {
        const orderDetailUrl = sessionStorage.orderDetailUrl;
        const query = orderDetailUrl.split('?')[1] || ''
        const queryArr = query.split('&').filter(item => item.indexOf('key=') === -1);
        queryArr.push('key=settlement');
        router.push(`${orderDetailUrl.split('?')[0]}?${queryArr.join('&')}`);
      } catch (error) {
        router.goBack();
      }
    } else {
      router.goBack();
    }
  }

  print = () => {
    const { role } = this.props.global;
    const { accountType } = this.props.location.query;
    let { collectionInvoicesAlready, collectionInvoicesNot, productAccounts, qualityRequirements } = this.state;
    let receipt = 0, bNum = 0, inPrice = 0, noTax = 0;
    let shipNum = 0, receiptNum = 0, deduct1 = 0, deduct2 = 0, settleNum = 0, diff = 0;
    let iHmtl1 = '', iHmtl2 = '', bHtml = '', qHtml = '';
    collectionInvoicesAlready.forEach(item => {
      if (!isNaN(item.collectionAmount)) receipt += parseFloat(item.collectionAmount);
      if (!isNaN(item.invoiceQuality)) bNum += parseFloat(item.invoiceQuality);
      if (!isNaN(item.issuedInvoiceAmount)) inPrice += parseFloat(item.issuedInvoiceAmount);
      if (!isNaN(item.taxExclusiveAmount)) noTax += parseFloat(item.taxExclusiveAmount);
    })
    collectionInvoicesNot.forEach(item => {
      if (!isNaN(item.collectionAmount)) receipt += parseFloat(item.collectionAmount);
      if (!isNaN(item.invoiceQuality)) bNum += parseFloat(item.invoiceQuality);
      if (!isNaN(item.issuedInvoiceAmount)) inPrice += parseFloat(item.issuedInvoiceAmount);
      if (!isNaN(item.taxExclusiveAmount)) noTax += parseFloat(item.taxExclusiveAmount);
    })
    productAccounts.forEach(item => {
      if (!isNaN(item.deliveryQuantity)) shipNum += parseFloat(item.deliveryQuantity);
      if (!isNaN(item.receivingQuality)) receiptNum += parseFloat(item.receivingQuality);
      if (!isNaN(item.deductSlag)) deduct1 += parseFloat(item.deductSlag);
      if (!isNaN(item.deductWater)) deduct2 += parseFloat(item.deductWater);
      if (!isNaN(item.accountQuantity)) settleNum += parseFloat(item.accountQuantity);
      if (!isNaN(item.quantityDifference)) diff += parseFloat(item.quantityDifference);
    })
    collectionInvoicesAlready.map(item => iHmtl1 += `<div style="margin-top: -1px; display: flex; justify-content: space-between; align-items: center;">
              <span style="flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.collectionTime ? item.collectionTime : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.explaining ? item.explaining : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.collectionAmount ? item.collectionAmount : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.invoiceTime ? item.invoiceTime : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.invoiceQuality ? item.invoiceQuality : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.acountUnitPrice ? item.acountUnitPrice : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.issuedInvoiceAmount ? item.issuedInvoiceAmount : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.taxExclusiveAmount ? item.taxExclusiveAmount : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.collectionMethod ? item.collectionMethod : ''}</span>
            </div>`
    )
    collectionInvoicesNot.map(item => iHmtl2 += `<div style="margin-top: -1px; display: flex; justify-content: space-between; align-items: center;">
              <span style="flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;"></span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.explaining ? item.explaining : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.collectionAmount ? item.collectionAmount : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;"></span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.invoiceQuality ? item.invoiceQuality : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.acountUnitPrice ? item.acountUnitPrice : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.issuedInvoiceAmount ? item.issuedInvoiceAmount : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.taxExclusiveAmount ? item.taxExclusiveAmount : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.collectionMethod ? item.collectionMethod : ''}</span>
            </div>`
    )
    productAccounts.map(item => bHtml += `<div style="margin-top: -1px; display: flex; justify-content: space-between; align-items: center;">
              <span style="flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.deliveryTime ? item.deliveryTime : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.deliveryQuantity ? item.deliveryQuantity : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.receivingQuality ? item.receivingQuality : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.deductSlag ? item.deductSlag : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.deductWater ? item.deductWater : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.remark ? item.remark : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.accountQuantity ? item.accountQuantity : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.quantityDifference ? item.quantityDifference : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.transportMethod ? item.transportMethod : ''}</span>
            </div>`
    )
    qualityRequirements.map(item => qHtml += `<div style="margin-top: -1px; display: flex; justify-content: space-between; align-items: center;">
              <span style="flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.qualityTestProject ? item.qualityTestProject : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.qualityTestStandard ? item.qualityTestStandard : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.deliveryQuality ? item.deliveryQuality : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.checkoutQuality ? item.checkoutQuality : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.actualAccountQuality ? item.actualAccountQuality : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.qualityError ? item.qualityError : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.isconform ? item.isconform : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.specificExplain ? item.specificExplain : ''}</span>
              <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${item.remark ? item.remark : ''}</span>
            </div>`
    )
    let printHtml = `<div style="padding: 20px 50px 20px 20px;">
      <div style="width: 100%;">
        <span style="display: block; padding: 32px 10px 12px; font: bold 14px normal;">${
      accountType === '0' ? (
        role.roleId === 1 || role.roleId === 2 ? '付款时间及发票收取情况' : '收款时间及发票开具情况'
      ) : (
          role.roleId === 1 || role.roleId === 2 ? '收款时间及发票开具情况' : '付款时间及发票收取情况'
        )
      }</span>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">日期</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">说明</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${
      accountType === '0' ? (
        role.roleId === 1 || role.roleId === 2 ? '已付款' : '已收款'
      ) : (
          role.roleId === 1 || role.roleId === 2 ? '已收款' : '已付款'
        )
      }</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">开票日期</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">开票数量</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">结算单价</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${
      accountType === '0' ? (
        role.roleId === 1 || role.roleId === 2 ? '已收取进项发票' : '已开具发票金额'
      ) : (
          role.roleId === 1 || role.roleId === 2 ? '已开具发票金额' : '已收取进项发票'
        )
      }</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">不含税金额</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${
      accountType === '0' ? (
        role.roleId === 1 || role.roleId === 2 ? '付款方式' : '收款方式'
      ) : (
          role.roleId === 1 || role.roleId === 2 ? '收款方式' : '付款方式'
        )
      }</span>
          </div>
          ${iHmtl1}
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <span style="flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;"></span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">说明</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${
      accountType === '0' ? (
        role.roleId === 1 || role.roleId === 2 ? '应付款' : '应收款'
      ) : (
          role.roleId === 1 || role.roleId === 2 ? '应收款' : '应付款'
        )
      }</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;"></span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">开票数量</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">结算单价</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${
      accountType === '0' ? (
        role.roleId === 1 || role.roleId === 2 ? '应收取进项发票' : '应开具发票金额'
      ) : (
          role.roleId === 1 || role.roleId === 2 ? '应开具发票金额' : '应收取进项发票'
        )
      }</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">不含税金额</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${
      accountType === '0' ? (
        role.roleId === 1 || role.roleId === 2 ? '付款方式' : '收款方式'
      ) : (
          role.roleId === 1 || role.roleId === 2 ? '收款方式' : '付款方式'
        )
      }</span>
          </div>
          ${iHmtl2}
          <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span style="flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">合计</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;"></span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${(receipt).toFixed(3)}</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;"></span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${(bNum).toFixed(3)}</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${bNum !== 0 ? (inPrice / bNum).toFixed(3) : 0}</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${(inPrice).toFixed(3)}</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${(noTax).toFixed(3)}</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;"></span>
          </div>
        </div>
      </div>

      <div style="width: 100%;">
        <span style="display: block; padding: 32px 10px 12px; font: bold 14px normal;">产品结算情况</span>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${
      accountType === '0' ? (
        role.roleId === 1 || role.roleId === 2 ? '收货时间' : '发货时间'
      ) : (
          role.roleId === 1 || role.roleId === 2 ? '发货时间' : '收货时间'
        )
      }</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">发货数量</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">收货数量</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">扣渣</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">扣水</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">其他</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">结算数量</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">数量差异</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">运输方式</span>
          </div>
          ${bHtml}
          <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span style="flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">合计</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${(shipNum).toFixed(3)}</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${(receiptNum).toFixed(3)}</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${(deduct1).toFixed(3)}</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${(deduct2).toFixed(3)}</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;"></span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${(settleNum).toFixed(3)}</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">${(diff).toFixed(3)}</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;"></span>
          </div>
        </div>
      </div>

      <div style="width: 100%;">
        <span style="display: block; padding: 32px 10px 12px; font: bold 14px normal;">质检要求</span>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">质检项目</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">质检标准</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">发货品质</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">检验品质</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">实际结算品质</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">品质误差</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">是否符合同要求</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">具体说明</span>
            <span style="margin-left: -1px; flex: 1; height: 34px; display: flex; justify-content: center; align-items: center; font: 12px normal; border: 1px #333333 solid;">备注</span>
          </div>
          ${qHtml}
        </div>
      </div>
    </div>`
    let wind = window.open("", 'newwindow', 'toolbar=no, menubar=no, scrollbars=no, resizable=no, location=n o, status=no');
    wind.document.body.innerHTML = printHtml;
    wind.print();
    return false;
  }

  showModalImport = (e) => {
    this.setState({
      visibleImport: true,
    });
  }

  handleCancelImport = () => {
    this.setState({
      visibleImport: false,
    });
  }

  render() {
    const { role } = this.props.global;
    const { collectionInvoicesAlready, collectionInvoicesNot, productAccounts, qualityRequirements, loading, visibleImport } = this.state;
    const { accountType } = this.props.location.query;
    let receipt = 0, bNum = 0, inPrice = 0, noTax = 0;
    let shipNum = 0, receiptNum = 0, deduct1 = 0, deduct2 = 0, settleNum = 0, diff = 0;
    collectionInvoicesAlready.length !== 0 && collectionInvoicesAlready.forEach(item => {
      if (!isNaN(item.collectionAmount)) receipt += parseFloat(item.collectionAmount || 0);
      if (!isNaN(item.invoiceQuality)) bNum += parseFloat(item.invoiceQuality || 0);
      if (!isNaN(item.issuedInvoiceAmount)) inPrice += parseFloat(item.issuedInvoiceAmount || 0);
      if (!isNaN(item.taxExclusiveAmount)) noTax += parseFloat(item.taxExclusiveAmount || 0);
    })
    collectionInvoicesNot.length !== 0 && collectionInvoicesNot.forEach(item => {
      if (!isNaN(item.collectionAmount)) receipt += parseFloat(item.collectionAmount || 0);
      if (!isNaN(item.invoiceQuality)) bNum += parseFloat(item.invoiceQuality || 0);
      if (!isNaN(item.issuedInvoiceAmount)) inPrice += parseFloat(item.issuedInvoiceAmount || 0);
      if (!isNaN(item.taxExclusiveAmount)) noTax += parseFloat(item.taxExclusiveAmount || 0);
    })
    return (
      <div className={styles.container}>
        <Breadcrumb className={styles.breadcrumb}>
          <Breadcrumb.Item><Link to={`${sessionStorage.orderDetailUrl || ''}`}>订单详情</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{
            accountType === '0' ? (
              role.roleId === 1 || role.roleId === 2 ? '采购结算单' : '销售结算单'
            ) : (
                role.roleId === 1 || role.roleId === 2 ? '销售结算单' : '采购结算单'
              )}
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles.content}>
          <div className={styles.itemBox}>
            <span className={styles.header}>{
              accountType === '0' ? (
                role.roleId === 1 || role.roleId === 2 ? '付款时间及发票收取情况' : '收款时间及发票开具情况'
              ) : (
                  role.roleId === 1 || role.roleId === 2 ? '收款时间及发票开具情况' : '付款时间及发票收取情况'
                )
            }</span>
            <div className={styles.table}>
              <div className={styles.row}>
                <span>日期</span>
                <span>说明</span>
                <span>{
                  accountType === '0' ? (
                    role.roleId === 1 || role.roleId === 2 ? '已付款' : '已收款'
                  ) : (
                      role.roleId === 1 || role.roleId === 2 ? '已收款' : '已付款'
                    )
                }</span>
                <span>开票日期</span>
                <span>开票数量</span>
                <span>结算单价</span>
                <span>{
                  accountType === '0' ? (
                    role.roleId === 1 || role.roleId === 2 ? '已收取进项发票' : '已开具发票金额'
                  ) : (
                      role.roleId === 1 || role.roleId === 2 ? '已开具发票金额' : '已收取进项发票'
                    )
                }</span>
                <span>不含税金额</span>
                <span>{
                  accountType === '0' ? (
                    role.roleId === 1 || role.roleId === 2 ? '付款方式' : '收款方式'
                  ) : (
                      role.roleId === 1 || role.roleId === 2 ? '收款方式' : '付款方式'
                    )
                }</span>
              </div>
              {
                collectionInvoicesAlready.length !== 0 && collectionInvoicesAlready.map((item, index) =>
                  <div className={styles.row} key={item.uuid}>
                    <span><Input defaultValue={item.collectionTime} onChange={this.onChange.bind(this, "i1", index, 'collectionTime')} /></span>
                    <span><Input defaultValue={item.explaining} onChange={this.onChange.bind(this, "i1", index, 'explaining')} /></span>
                    <span><InputNumber precision={3} defaultValue={item.collectionAmount} onChange={this.onChange.bind(this, "i1", index, 'collectionAmount')} /></span>
                    <span><Input defaultValue={item.invoiceTime} onChange={this.onChange.bind(this, "i1", index, 'invoiceTime')} /></span>
                    <span><InputNumber precision={3} defaultValue={item.invoiceQuality} onChange={this.onChange.bind(this, "i1", index, 'invoiceQuality')} /></span>
                    <span>{item.acountUnitPrice}</span>
                    {/* <span><Input defaultValue={item.acountUnitPrice} onChange={this.onChange.bind(this, "i1", index, 'acountUnitPrice')} /></span> */}
                    <span><InputNumber precision={3} defaultValue={item.issuedInvoiceAmount} onChange={this.onChange.bind(this, "i1", index, 'issuedInvoiceAmount')} /></span>
                    <span><InputNumber precision={3} defaultValue={item.taxExclusiveAmount} onChange={this.onChange.bind(this, "i1", index, 'taxExclusiveAmount')} /></span>
                    <span><Input defaultValue={item.collectionMethod} onChange={this.onChange.bind(this, "i1", index, 'collectionMethod')} /></span>
                    <Icon className={styles.delete} type="minus-circle" theme="filled" onClick={this.deleteRow.bind(this, 'i1', index)} />
                  </div>
                )
              }
              <Button
                style={{ marginTop: 10 }}
                icon="plus"
                type="dashed"
                block
                onClick={this.addRow.bind(this, "i1")}
              >
                添加一行
              </Button>
              <div className={styles.row} style={{ marginTop: 10 }}>
                <span></span>
                <span>说明</span>
                <span>{
                  accountType === '0' ? (
                    role.roleId === 1 || role.roleId === 2 ? '应付款' : '应收款'
                  ) : (
                      role.roleId === 1 || role.roleId === 2 ? '应收款' : '应付款'
                    )
                }</span>
                <span></span>
                <span>开票数量</span>
                <span>结算单价</span>
                <span>{
                  accountType === '0' ? (
                    role.roleId === 1 || role.roleId === 2 ? '应收取进项发票' : '应开具发票金额'
                  ) : (
                      role.roleId === 1 || role.roleId === 2 ? '应开具发票金额' : '应收取进项发票'
                    )
                }</span>
                <span>不含税金额</span>
                <span>{
                  accountType === '0' ? (
                    role.roleId === 1 || role.roleId === 2 ? '付款方式' : '收款方式'
                  ) : (
                      role.roleId === 1 || role.roleId === 2 ? '收款方式' : '付款方式'
                    )
                }</span>
              </div>
              {
                collectionInvoicesNot.length !== 0 && collectionInvoicesNot.map((item, index) =>
                  <div className={styles.row} key={item.uuid}>
                    <span></span>
                    <span><Input defaultValue={item.explaining} onChange={this.onChange.bind(this, "i2", index, 'explaining')} /></span>
                    <span><InputNumber precision={3} defaultValue={item.collectionAmount} onChange={this.onChange.bind(this, "i2", index, 'collectionAmount')} /></span>
                    <span></span>
                    <span><InputNumber precision={3} defaultValue={item.invoiceQuality} onChange={this.onChange.bind(this, "i2", index, 'invoiceQuality')} /></span>
                    <span>{item.acountUnitPrice}</span>
                    {/* <span><Input defaultValue={item.acountUnitPrice} onChange={this.onChange.bind(this, "i2", index, 'acountUnitPrice')} /></span> */}
                    <span><InputNumber precision={3} defaultValue={item.issuedInvoiceAmount} onChange={this.onChange.bind(this, "i2", index, 'issuedInvoiceAmount')} /></span>
                    <span><InputNumber precision={3} defaultValue={item.taxExclusiveAmount} onChange={this.onChange.bind(this, "i2", index, 'taxExclusiveAmount')} /></span>
                    <span><Input defaultValue={item.collectionMethod} onChange={this.onChange.bind(this, "i2", index, 'collectionMethod')} /></span>
                    <Icon className={styles.delete} type="minus-circle" theme="filled" onClick={this.deleteRow.bind(this, 'i2', index)} />
                  </div>
                )
              }
              <Button
                style={{ marginTop: 10 }}
                icon="plus"
                type="dashed"
                block
                onClick={this.addRow.bind(this, "i2")}
              >
                添加一行
              </Button>
              <div className={styles.totle}>
                <span>合计</span>
                <span></span>
                <span>{(receipt).toFixed(3)}</span>
                <span></span>
                <span>{(bNum).toFixed(3)}</span>
                {/* 迭代5单价修改为 发票总数/开票数量 */}
                <span>{bNum !== 0 ? (inPrice / bNum).toFixed(3) : 0}</span>
                <span>{(inPrice).toFixed(3)}</span>
                <span>{(noTax).toFixed(3)}</span>
                <span></span>
              </div>
            </div>
          </div>

          <div className={styles.itemBox}>
            <span className={styles.header}>产品结算情况</span>
            <div className={styles.table}>
              <div className={styles.row}>
                <span>{
                  accountType === '0' ? (
                    role.roleId === 1 || role.roleId === 2 ? '收货时间' : '发货时间'
                  ) : (
                      role.roleId === 1 || role.roleId === 2 ? '发货时间' : '收货时间'
                    )
                }</span>
                <span>发货数量</span>
                <span>收货数量</span>
                <span>扣渣</span>
                <span>扣水</span>
                <span>其他</span>
                <span>结算数量</span>
                <span>数量差异</span>
                <span>运输方式</span>
              </div>
              {
                productAccounts.length !== 0 && productAccounts.map((item, index) =>
                  <div className={styles.row} key={item.uuid}>
                    <span><Input defaultValue={item.deliveryTime} onChange={this.onChange.bind(this, "b", index, 'deliveryTime')} /></span>
                    <span><InputNumber precision={3} defaultValue={item.deliveryQuantity} onChange={this.onChange.bind(this, "b", index, 'deliveryQuantity')} /></span>
                    <span><InputNumber precision={3} defaultValue={item.receivingQuality} onChange={this.onChange.bind(this, "b", index, 'receivingQuality')} /></span>
                    <span><InputNumber precision={3} defaultValue={item.deductSlag} onChange={this.onChange.bind(this, "b", index, 'deductSlag')} /></span>
                    <span><InputNumber precision={3} defaultValue={item.deductWater} onChange={this.onChange.bind(this, "b", index, 'deductWater')} /></span>
                    <span><Input defaultValue={item.remark} onChange={this.onChange.bind(this, "b", index, 'remark')} /></span>
                    <span><InputNumber precision={3} defaultValue={item.accountQuantity} onChange={this.onChange.bind(this, "b", index, 'accountQuantity')} /></span>
                    <span>{item.quantityDifference}</span>
                    <span><Input defaultValue={item.transportMethod} onChange={this.onChange.bind(this, "b", index, 'transportMethod')} /></span>
                    <Icon className={styles.delete} type="minus-circle" theme="filled" onClick={this.deleteRow.bind(this, 'b', index)} />
                  </div>
                )
              }
              <Button
                style={{ marginTop: 10 }}
                icon="plus"
                type="dashed"
                block
                onClick={this.addRow.bind(this, "b")}
              >
                添加一行
              </Button>
              {
                productAccounts.length !== 0 && productAccounts.map((item, index) => {
                  if (!isNaN(item.deliveryQuantity)) shipNum += parseFloat(item.deliveryQuantity || 0);
                  if (!isNaN(item.receivingQuality)) receiptNum += parseFloat(item.receivingQuality || 0);
                  if (!isNaN(item.deductSlag)) deduct1 += parseFloat(item.deductSlag || 0);
                  if (!isNaN(item.deductWater)) deduct2 += parseFloat(item.deductWater || 0);
                  if (!isNaN(item.accountQuantity)) settleNum += parseFloat(item.accountQuantity || 0);
                  if (!isNaN(item.quantityDifference)) diff += parseFloat(item.quantityDifference || 0);
                  if (index === productAccounts.length - 1) {
                    return (
                      <div className={styles.totle} key={item.uuid}>
                        <span>合计</span>
                        <span>{(shipNum).toFixed(3)}</span>
                        <span>{(receiptNum).toFixed(3)}</span>
                        <span>{(deduct1).toFixed(3)}</span>
                        <span>{(deduct2).toFixed(3)}</span>
                        <span></span>
                        <span>{(settleNum).toFixed(3)}</span>
                        <span>{(diff).toFixed(3)}</span>
                        <span></span>
                      </div>
                    )
                  }
                })
              }
            </div>
          </div>

          <div className={styles.itemBox}>
            <span className={styles.header}>质检要求</span>
            <div className={styles.table}>
              <div className={styles.row}>
                <span>质检项目</span>
                <span>{
                  accountType === '0' ? (
                    role.roleId === 1 || role.roleId === 2 ? '合同标准' : '质检标准'
                  ) : (
                      role.roleId === 1 || role.roleId === 2 ? '质检标准' : '合同标准'
                    )
                }</span>
                <span>发货品质</span>
                <span>检验品质</span>
                <span>实际结算品质</span>
                <span>品质误差</span>
                <span>是否符合同要求</span>
                <span>具体说明</span>
                <span>备注</span>
              </div>
              {
                qualityRequirements.length !== 0 && qualityRequirements.map((item, index) =>
                  <div className={styles.row} key={item.uuid}>
                    <span><Input defaultValue={item.qualityTestProject} onChange={this.onChange.bind(this, "q", index, 'qualityTestProject')} /></span>
                    <span><Input defaultValue={item.qualityTestStandard} onChange={this.onChange.bind(this, "q", index, 'qualityTestStandard')} /></span>
                    <span><Input defaultValue={item.deliveryQuality} onChange={this.onChange.bind(this, "q", index, 'deliveryQuality')} /></span>
                    <span><Input defaultValue={item.checkoutQuality} onChange={this.onChange.bind(this, "q", index, 'checkoutQuality')} /></span>
                    <span><Input defaultValue={item.actualAccountQuality} onChange={this.onChange.bind(this, "q", index, 'actualAccountQuality')} /></span>
                    <span><Input defaultValue={item.qualityError} onChange={this.onChange.bind(this, "q", index, 'qualityError')} /></span>
                    <span><Input defaultValue={item.isconform} onChange={this.onChange.bind(this, "q", index, 'isconform')} /></span>
                    <span><Input defaultValue={item.specificExplain} onChange={this.onChange.bind(this, "q", index, 'specificExplain')} /></span>
                    <span><Input defaultValue={item.remark} onChange={this.onChange.bind(this, "q", index, 'remark')} /></span>
                    <Icon className={styles.delete} type="minus-circle" theme="filled" onClick={this.deleteRow.bind(this, 'q', index)} />
                  </div>
                )
              }
              <Button
                style={{ marginTop: 10 }}
                icon="plus"
                type="dashed"
                block
                onClick={this.addRow.bind(this, "q")}
              >
                添加一行
              </Button>
            </div>
          </div>

          <Button className={styles.save} loading={loading} type="primary" onClick={this.saveBill.bind(this)}>保 存</Button>
        </div>

        <div className={styles.bottom}>
          <Button onClick={this.print} type="primary" style={{ backgroundColor: '#E3AE55', border: 'none', marginLeft: 15 }}>打印</Button>
          <Button disabled={true} type="primary" style={{ backgroundColor: '#E3AE55', border: 'none', marginLeft: 15 }}>合同已确认</Button>
          <Button onClick={this.showModalImport} type="primary" style={{ backgroundColor: '#E3AE55', border: 'none', marginLeft: 15, cursor: 'pointer' }}>批量导入</Button>
          <Button onClick={() => router.goBack()} type="primary" style={{ backgroundColor: '#E3AE55', border: 'none', marginLeft: 15 }}>返回</Button>
        </div>

        <Modal
          centered
          title="从本机导入"
          visible={visibleImport}
          onCancel={this.handleCancelImport}
          footer={
            <div style={{ width: '100%', textAlign: 'center' }}>
              <Button style={{ width: '90px' }} onClick={this.handleCancelImport}>
                取消
              </Button>
            </div>
          }
        >
          <p>
            第一步：
            {
              accountType === '0' ?
                <a href="https://obs-fe91.obs.cn-south-1.myhuaweicloud.com/a51a071675ba4a32994e2677dce7a065.xlsx" download="销售结算模板.xlsx">下载销售Excel模板</a>
                :
                <a href="https://obs-fe91.obs.cn-south-1.myhuaweicloud.com/d2d18cb5a8ba4e51b274acb06f0da6ca.xlsx" download="采购结算模板.xlsx">下载采购Excel模板</a>
            }
          </p>
          <p style={{ marginTop: '30px' }}>
            第二步：
            <Excel
              onChange={arr => this.excelImport(arr)}
              text={
                <Button type="primary">
                  <Icon type="upload" />
                  选择文件
                </Button>
              }
            />
          </p>
        </Modal>
      </div>
    )
  }
}
