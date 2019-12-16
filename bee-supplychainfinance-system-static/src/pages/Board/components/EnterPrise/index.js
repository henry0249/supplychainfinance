import React, { Component } from 'react'
import { Card, Statistic, Modal, Divider, Row, Col } from 'antd'
import G2 from '@antv/g2';
import styles from './index.less'
import { titleToUpperCase } from '@/utils/utils'
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { getBillData, getReceivedBill, getBillList, getInvoice } from '../../services'

var dataA = [{
  金额: 38,
  name: '金蜜',
  id: 'qewq',
  business: 5,
  fund: 87989879,
  companyRole: '核心企业'
}, {
  金额: 38,
  name: '金蜜',
  id: 'qewq1',
  business: 5,
  fund: 87989879,
  companyRole: '核心企业'
}, {
  金额: 38,
  name: '金蜜金蜜暖和的撒谎的是垃圾袋里就是的呵呵呵第三',
  id: 'qewq2',
  business: 5,
  fund: 87989879,
  companyRole: '核心企业'
}, {
  金额: 38,
  name: '金蜜',
  id: 'qewq2',
  business: 5,
  fund: 87989879,
  companyRole: '核心企业'
}, {
  金额: 38,
  name: '金蜜',
  id: 'qewq3',
  business: 5,
  fund: 87989879,
  companyRole: '核心企业'
}]

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      data: dataA,
    }
  }


  //数据初始化
  init() {
    getBillData().then(res => {
      if (res.code === 0) {
        this.setState({
          statisticData: res.data
        })
      }
    });
  }
  //代办事项点击
  itemClick(item) {
  }


  render() {
    const { data } = this.state
    const listSpans = { xxl: 6, xl: 8, lg: 8, md: 12, sm: 24, xs: 24 }
    const statisticSpans = { xxl: 12, xl: 12, lg: 12, md: 12, sm: 24, xs: 24 }
    return (
      <div
        className={styles.app}
        style={{
          ...this.props.style,
        }}
      >
        <Divider>所有企业</Divider>
        <Row gutter={32}>
          {data && data.length ? data.map((item, index) => <Col
            {...listSpans} key={item.key} >
            <div className={styles.item} onClick={this.itemClick.bind(this, item)}>
              <div className={styles.role}>{item.companyRole}</div>
              <h3 className={styles.name}>
                <Ellipsis length={10}>{item.name}</Ellipsis></h3>
              <Row className={styles.statistic}>
                <Col {...statisticSpans}> <Statistic title={'进行中的业务'} value={item.business} /></Col>
                <Col {...statisticSpans}>  <Statistic title={'总占用的资金'} value={item.fund} /></Col>
              </Row>
            </div>
          </Col>) : null}
        </Row>
      </div>
    )
  }
}

App.defaultProps = {
  tabList: [{ tab: '利润额的是金卡是多少', key: 'profit' }, { tab: '销售额', key: 'shouldPayBill' }]
}

