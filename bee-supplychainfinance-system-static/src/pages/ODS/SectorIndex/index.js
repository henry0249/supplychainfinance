import React, { Component } from 'react'
import { Card, Button, Tabs, Empty } from 'antd'
import styles from './index.less'
import AreaChart from '../components/AreaChart'
import moment from 'moment'
import { getChart, getTree } from './services/index'
import router from 'umi/router';

const { TabPane } = Tabs;
export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {
      },
      tabs: [{
        name: '电石', key: 1
      },
      { name: '铬系', key: 2 },
      { name: '金属硅', key: 3 },
      { name: '镍系', key: 4 },
      { name: '煤炭', key: 5 },
      { name: '焦炭', key: 6 },
      { name: '其他', key: 7 }]
    }
  }

  componentDidMount() {
    this.tabChange()
  }


  //此处key值比数组索引值 小1，所以简便处理
  tabChange(key = this.state.tabs[0].key) {
    let tabs = [...this.state.tabs]
    if (!tabs[key - 1].children) {//如果有配置数据就不再获取
      getTree(key).then(res => {
        if (res.code === 0) {
          let { tabs } = this.state;
          tabs[key - 1].children = this.tabHandle(res.data);
          this.setState({ tabs })
        }
      })
    }
  }

  //导航添加图标配置
  tabHandle(data = []) {
    return data.map(item => {
      if (item.children && item.children.length) {
        return {
          name: item.name, key: item.key, children: item.children.map(item1 => {
            return {
              title: `${item1.name} 单位(${item1.unit || '无'})`, key: item1.indexId, showTooltip: false, singleLine: true, chartUnit: '',
              monthRanges: [12, 6, 3, 1], pickerMode: 'day', rightStatistics: [{ key: 'dayRingRatio', name: '日环比' }, { key: 'weekRingRatio', name: '周环比' },
              { key: 'mouthRingRatio', name: '月环比' }, { key: 'yearRingRatio', name: '年同比' }], filterZero: true
            }
          })
        }
      } else {
        return item
      }
    })
  }

  //获得图表数据
  getChart(key, range = [moment(), moment().subtract(6, 'months')]) {
    getChart({ key: key, startTime: range[0].format('YYYY-MM-DD'), endTime: range[1].format('YYYY-MM-DD') }).then(res => {
      if (res.code === 0) {
        let { dataSource } = this.state;
        dataSource[key] = res.data
        this.setState({
          dataSource
        })
      }
    })
  }


  //图表数据处理
  chartHandle(data) {
    let newData = {}
    newData.chart = [...data.chart]
    delete data.chart
    newData.ratio = { ...data }
    return newData
  }

  toEdit(opt) {
    router.push('/ods/sectorIndex/' + opt)
  }

  render() {
    const { dataSource = {}, tabs } = this.state;
    console.log(tabs)
    return (
      <section className={styles.app}>
        <div className={styles.card}>
          <div className={styles.header}>
            <span className={styles.title}>数据仓库：各类行业指数</span>

            <Button type='primary' className={styles.button1} onClick={this.toEdit.bind(this, 'list')}> 指数列表</Button>
            <Button type='primary' className={styles.button} onClick={this.toEdit.bind(this, 'edit')}> 编辑数据</Button>
          </div>
          <Tabs className={styles.tab} type="card" onChange={this.tabChange.bind(this)}>
            {tabs.map(item => <TabPane className={styles.item} tab={item.name} key={item.key}>
              <div className={styles.card}>
                {item.children && item.children.length ?
                  item.children.map(item1 => <div className={styles.content}>
                    <div className={styles.contentTitle}>{item1.name}</div>
                    {item1.children && item1.children.length ?
                      item1.children.map(item2 => (
                        <AreaChart onChange={(range) => this.getChart(item2.key, range)} {...item2} data={dataSource[item2.key] || {}} key={item2.key} />)) : <Empty />}
                  </div>) : <Empty />}
              </div>

            </TabPane>)}
          </Tabs>
          {/* nav */}

        </div>

      </section>
    )
  }
}
