import React, { Component } from 'react'
import { Card, Button, Tabs } from 'antd'
import styles from './index.less'
import AreaChart from '../../components/AreaChart'
import moment from 'moment'
import { getEconomicChart } from './services/index'
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
    getEconomicChart({ key: key, startTime: range[0].format('YYYY-MM'), endTime: range[1].format('YYYY-MM') }).then(res => {
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
    router.push('/ods/macrofinance/macroEconomicGrowth/edit')
  }

  render() {
    const { dataSource = {} } = this.state;
    console.log(dataSource)
    return (
      <section className={styles.app}>
        <div className={styles.card}>
          <div className={styles.header}>
            <span className={styles.title}>数据仓库：经济增长</span>

            <Button type='primary' className={styles.button} onClick={this.toEdit.bind(this)}> 编辑数据</Button>
          </div>
          <Tabs className={styles.tab} type="card">
            {tabs.map(item => <TabPane className={styles.item} tab={item.name} key={item.key}>
              <div className={styles.card}>
                {item.children && item.children.length ?
                  item.children.map(item1 => <div className={styles.content}>
                    <div className={styles.contentTitle}>{item1.name}</div>
                    {item1.children && item1.children.length ?
                      item1.children.map(item2 => (
                        <AreaChart onChange={(range) => this.getChart(item2.key, range)} {...item2} data={dataSource[item2.key] || {}} key={item2.key} />)) : null}
                  </div>) : null}
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
  name: '资本形成', key: 1, children: [{
    key: 1, name: '现状',
    children: [{
      title: '社会固定资产投资完成额累计同比', key: 1, showTooltip: false, singleLine: true, chartUnit: '%',
      monthRanges: [24, 18, 12, 6], rightStatistics: [{ key: 'yearRatio', name: '同比' }, { key: 'chainRatio', name: '环比' }]
    }, {
      title: '社会固定资产投资完成额累计同比：分位数', key: 2, showTooltip: true, singleLine: false,
      monthRanges: [24, 18, 12, 6]
    }, {
      title: '房地产开发投资完成额实际累计同比', key: 3, showTooltip: false, singleLine: true, monthRanges: [30, 24, 18, 12]
      , rightStatistics: [{ key: 'yearRatio', name: '同比' }, { key: 'chainRatio', name: '环比' }], chartUnit: '%',
    }, {
      title: '房地产开发投资完成额实际累计同比：分位数', key: 4, showTooltip: true, singleLine: false, monthRanges: [30, 24, 18, 12]
    }
    ]
  }, {
    key: 2, name: '核心驱动因素',
    children: [{
      title: '债务余额/GDP', key: 5, showTooltip: false, singleLine: true, chartUnit: '%',
      monthRanges: [60, 48, 36, 24], rightStatistics: [{ key: 'yearRatio', name: '同比' }, { key: 'chainRatio', name: '环比' }]
    }, {
      title: '投资回报率', key: 6, showTooltip: false, singleLine: true,
      monthRanges: [30, 24, 18, 12]
    }, {
      title: '贷款利率', key: 7, showTooltip: false, singleLine: true, monthRanges: [6, 3, 2, 1], pickerMode: 'day'
      , rightStatistics: [{ key: 'yearRatio', name: '同比' }, { key: 'chainRatio', name: '环比' }], chartUnit: '%',
    }, {
      title: '企业家信心指数同比', key: 8, showTooltip: false, singleLine: true, monthRanges: [30, 24, 18, 12]
    }, {
      title: '采购经理人指数同比', key: 9, showTooltip: false, singleLine: true, monthRanges: [24, 18, 12, 6]
    }, {
      title: '股票指数同比增长', key: 10, showTooltip: false, singleLine: true, monthRanges: [24, 18, 12, 6]
    }
    ]
  }]
}, {
  name: '消费', key: 2, children: [{
    key: 1, name: '现状',
    children: [{
      title: '社会消费品零售总额累计同比', key: 11, showTooltip: false, singleLine: true, chartUnit: '%',
      monthRanges: [24, 18, 12, 6], rightStatistics: [{ key: 'yearRatio', name: '同比' }, { key: 'chainRatio', name: '环比' }]
    }, {
      title: '社会消费品零售总额累计同比：分位数', key: 12, showTooltip: true, singleLine: false,
      monthRanges: [24, 18, 12, 6]
    }]
  }, {
    key: 2, name: '核心驱动因素',
    children: [{
      title: '家庭债务余额/可支配收入', key: 13, showTooltip: false, singleLine: true, chartUnit: '%',
      monthRanges: [60, 48, 36, 24], rightStatistics: [{ key: 'yearRatio', name: '同比' }, { key: 'chainRatio', name: '环比' }]
    }, {
      title: '消费者信心指数同比', key: 14, showTooltip: false, singleLine: true,
      monthRanges: [24, 18, 12, 6]
    }, {
      title: '失业率', key: 15, showTooltip: false, singleLine: true, monthRanges: [30, 24, 18, 12]
      , rightStatistics: [{ key: 'yearRatio', name: '同比' }, { key: 'chainRatio', name: '环比' }], chartUnit: '%',
    }
    ]
  }]
}, {
  name: '出口', key: 3, children: [{
    key: 1, name: '现状',
    children: [{
      title: '出口累计同比增长率', key: 16, showTooltip: false, singleLine: true, chartUnit: '%',
      monthRanges: [24, 18, 12, 6], rightStatistics: [{ key: 'yearRatio', name: '同比' }, { key: 'chainRatio', name: '环比' }]
    }
      //   , {
      //   title: '贸易环境（人工判定）', key: 17, showTooltip: true, singleLine: false,
      //   monthRanges: [24, 18, 12, 6],chartType:'interval'
      // }
    ]
  }]
}]