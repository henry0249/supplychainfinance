import React, { Component } from 'react'
import { Card, Button, Tabs } from 'antd'
import styles from './index.less'
import AreaChart from '../../components/AreaChart'
import moment from 'moment'
import { getMacroInflationChart } from './services/index'
import router from 'umi/router';

const { TabPane } = Tabs;
export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {}
    }
  }

  //获得图表数据
  getChart(key, range = [moment(), moment().subtract(6, 'months')]) {
    getMacroInflationChart({ key: key, startTime: range[0].format('YYYY-MM'), endTime: range[1].format('YYYY-MM') }).then(res => {
      if (res.code === 0) {
        let { dataSource } = this.state;
        dataSource[key] = res.data.chart ? res.data : { chart: this.chartHandle(res.data) }
        this.setState({
          dataSource
        })
      }
    })
  }

  //多条线时数据处理
  chartHandle(data) {
    let chart = []
    data.forEach(element => {
      if (element.data12) {
        chart.push({ type: '近12个月', data: element.data12, time: element.time })
      }
      if (element.data24) {
        chart.push({ type: '近24个月', data: element.data24, time: element.time })
      }
      if (element.data60) {
        chart.push({ type: '近60个月', data: element.data60, time: element.time })
      }
    })
    return chart
  }

  toEdit() {
    router.push('/ods/macrofinance/macroInflation/edit')
  }

  render() {
    const { dataSource = {} } = this.state;
    return (
      <section className={styles.app}>
        <div className={styles.card}>
          <div className={styles.header}>
            <span className={styles.title}>数据仓库：通货膨胀</span>

            <Button type='primary' className={styles.button} onClick={this.toEdit.bind(this)}> 编辑数据</Button>
          </div>
          <Tabs className={styles.tab} type="card">
            {tabs.map(item => <TabPane className={styles.item} tab={item.name} key={item.key}>
              <div className={styles.content}>
                {item.children && item.children.length ?
                  item.children.map(item1 => (
                    <AreaChart onChange={(range) => this.getChart(item1.key, range)} {...item1} data={dataSource[item1.key] || {}} key={item1.key} />)) : null}
              </div>
            </TabPane>)}
          </Tabs>
          {/* nav */}

        </div>

      </section>
    )
  }
}

//showTooltip 展示图片自带的图例，singleLine 是否是单线面积图
const tabs = [{
  name: '物价', key: 1, children: [{
    title: 'CPI（居民消费价格指数）当月同比', key: 1, showTooltip: false, singleLine: true, chartUnit: '%',
    monthRanges: [24, 18, 12, 6], rightStatistics: [{ key: 'yearRatio', name: '同比' }, { key: 'chainRatio', name: '环比' }]
  }, {
    title: 'CPI（居民消费价格指数）当月同比：分位数', key: 2, showTooltip: true, singleLine: false,
    monthRanges: [24, 18, 12, 6]
  }, {
    title: 'PPI（生产价格指数）当月同比', key: 3, showTooltip: false, singleLine: true, monthRanges: [24, 18, 12, 6]
    , rightStatistics: [{ key: 'yearRatio', name: '同比' }, { key: 'chainRatio', name: '环比' }], chartUnit: '%',
  }, {
    title: 'PPI（生产价格指数）当月同比：分位数', key: 4, showTooltip: true, singleLine: false, monthRanges: [24, 18, 12, 6]
  }
  ]
}, {
  name: '货币', key: 2, children: [{
    title: 'M1（狭义货币）同比增长率', key: 5, showTooltip: false, singleLine: true, monthRanges: [24, 18, 12, 6]
    , rightStatistics: [{ key: 'yearRatio', name: '同比' }, { key: 'chainRatio', name: '环比' }], chartUnit: '%',
  }, {
    title: 'M1（狭义货币）同比增长率：分位数', key: 6, showTooltip: true, singleLine: false, monthRanges: [24, 18, 12, 6]
  }, {
    title: 'M2（广义货币）同比增长率', key: 7, showTooltip: false, singleLine: true, monthRanges: [24, 18, 12, 6]
    , rightStatistics: [{ key: 'yearRatio', name: '同比' }, { key: 'chainRatio', name: '环比' }], chartUnit: '%',
  }, {
    title: 'M2（广义货币）同比增长率：分位数', key: 8, showTooltip: true, singleLine: false, monthRanges: [24, 18, 12, 6]
  }
  ]
}]