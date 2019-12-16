import React, { Component } from 'react'
import { Card, Statistic, Modal, Icon, Row, Col } from 'antd'
import G2 from '@antv/g2';
import styles from './index.less'
import { titleToUpperCase } from '@/utils/utils'
import { getBillData, getReceivedBill, getBillList, getInvoice } from '../../services'

var dataA = [{
  monthDate: '1951 年',
  金额: 38
}, {
  monthDate: '1952 年',
  金额: 52
}, {
  monthDate: '1956 年',
  金额: 61
}, {
  monthDate: '1957 年',
  金额: 145
}, {
  monthDate: '1958 年',
  金额: 48
}, {
  monthDate: '1959 年',
  金额: 38
}, {
  monthDate: '1960 年',
  金额: 38
}, {
  monthDate: '1962 年',
  金额: 38
}]

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      salesType: 'all',
      currentTabKey: 'profit',
      visible: false,
      statisticData: {},
      chartData: [],
      data: [{ name: '代开票', key: 'dkp', value: '22' }, { name: '代开票', key: 'dkp0', value: '22' }, { name: '代开票', key: 'dkp1', value: '22' }, { name: '代开票', key: 'dkp2', value: '22' }, { name: '代开票', key: 'dkp3', value: '22' }],


      type: 0
    }
    this._chart = null;
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
    // debugger
  }

  render() {
    const { data } = this.state
    const listSpans = { xxl: 8, xl: 8, lg: 8, md: 8, sm: 24, xs: 24 }
    return (
      <div
        className={styles.app}
        style={{
          ...this.props.style,
        }}
      >
        <Card
          className={styles.card}
          bordered={false}
          style={{ height: '100%' }}
          title={'待办管理'}
        >
          <Row gutter={32}>
            {data && data.length ? data.map((item, index) => <Col
              {...listSpans} key={item.key} >
              <div className={styles.item} onClick={this.itemClick.bind(this, item)}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.value}>{item.value}</span>
              </div>
            </Col>) : null}
          </Row>
        </Card>
      </div>
    )
  }
}

App.defaultProps = {
  tabList: [{ tab: '利润额', key: 'profit' }, { tab: '销售额', key: 'shouldPayBill' }]
}

