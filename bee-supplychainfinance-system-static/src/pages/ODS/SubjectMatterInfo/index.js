import React, { Component } from 'react'
import { Pagination, Button, Tabs } from 'antd'
import styles from './index.less'
import AreaChart from '../components/AreaChart'
import moment from 'moment'
import { getChartInfo, getBigTypeInfo, getChartList } from './services/index'
import router from 'umi/router';

const { TabPane } = Tabs;
export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {
      },
      tabs: [],
      currentPages: {}
    }
    this.pageSize = 6//条数
  }

  componentDidMount() {
    this.getTabs()
    // this.tabChange()
  }

  getTabs() {
    getBigTypeInfo().then(res => {
      if (res.code === 0) {
        this.setState({ tabs: res.data }, () => this.tabChange())
      }
    })
  }

  currentPageChange(index, value) {
    let currentPages = { ...this.state.currentPages }
    currentPages[index] = value
    this.setState({ currentPages })
  }

  //此处key值比数组索引值 小1，所以简便处理
  tabChange(key = this.state.tabs[0].typeName) {
    let tabs = [...this.state.tabs]
    let _index = 0;
    tabs.forEach((item, index) => { if (item.typeName === key) { _index = index } })
    if (!tabs[_index].children) {//如果有配置数据就不再获取
      getChartList(key).then(res => {
        if (res.code === 0) {
          let { tabs } = this.state;
          tabs[_index].children = this.tabHandle(res.data);
          this.setState({ tabs })
        }
      })
    }
  }

  //导航添加图标配置
  tabHandle(data = []) {
    return data.map(_item => {
      const item = _item.subjectMatterInfoDTO
      return {
        title: `${item.tast}|${item.ifStanard}|${item.specification}|${item.sourceAddress} 单位(${item.priceUnitName || '无'})`,
        key: item.id, showTooltip: true, singleLine: false, chartUnit: '', monthRanges: [6, 3, 2, 1], pickerMode: 'day',
        rightStatistics: [{ key: 'dayChainRatio', name: '日环比' }, { key: 'weekChainRatio', name: '周环比' },
        { key: 'monthChainRatio', name: '月环比' }, { key: 'yearRatio', name: '年同比' }], filterZero: true,
        leftStatistics: [{ key: 'sourceToMoney', name: '变现能力', value: item.sourceToMoney }
          , { key: 'sourceStabilization', name: '稳定性', value: item.sourceStabilization }, { key: 'sourceConsumable', name: '易损性', value: item.sourceConsumable }]
      }
    })
  }

  //获得图表数据
  getChart(key, range = [moment(), moment().subtract(1, 'months')]) {
    getChartInfo({ key: key, startTime: range[0].format('YYYY-MM-DD'), endTime: range[1].format('YYYY-MM-DD') }).then(res => {
      if (res.code === 0) {
        let { dataSource } = this.state;
        dataSource[key] = this.chartHandle(res.data)
        this.setState({
          dataSource
        })
      }
    })
  }


  //图表数据处理
  chartHandle(data) {
    let newData = {}
    newData.chart = [...data.chartInfoDTOS]
    delete data.chartInfoDTOS
    newData.ratio = { ...data.ratio }
    return newData
  }

  toEdit(opt) {
    router.push('/ods/subjectMatterInfo/' + opt)
  }

  render() {
    const { dataSource = {}, tabs, currentPages } = this.state;
    return (
      <section className={styles.app}>
        <div className={styles.card}>
          <div className={styles.header}>
            <span className={styles.title}>数据仓库：标的物信息</span>
            <Button type='primary' className={styles.button1} onClick={this.toEdit.bind(this, 'list')}> 标的物列表</Button>
            <Button type='primary' className={styles.button} onClick={this.toEdit.bind(this, 'editPrice')}> 编辑价格</Button>
          </div>
          <Tabs className={styles.tab} type="card" onChange={this.tabChange.bind(this)}>
            {tabs.map((item, index) => {
              return <TabPane className={styles.item} tab={item.typeName + `(${item.subjectMatterCount})`} key={item.typeName}>
                <div className={styles.card}>
                  {item.children && item.children.length ?
                    item.children.slice(((currentPages[index] || 1) - 1) * this.pageSize, (currentPages[index] || 1) * this.pageSize).map(item1 => {
                      return <AreaChart onChange={(range) => this.getChart(item1.key, range)} {...item1} data={dataSource[item1.key] || {}} key={item1.key} />
                    }) : null}
                  {item.children ? <Pagination style={{margin:'30px 0 10px 0',textAlign:"center"}} pageSize={this.pageSize} onChange={this.currentPageChange.bind(this, index)}
                    current={currentPages[index] || 1} defaultCurrent={1}
                    total={item.children.length} showTotal={(total, range) => `第${range[0]}-${range[1]}条 ，共 ${total}条`} /> : null}
                </div>
              </TabPane>
            })}
          </Tabs>
          {/* nav */}

        </div>

      </section>
    )
  }
}
