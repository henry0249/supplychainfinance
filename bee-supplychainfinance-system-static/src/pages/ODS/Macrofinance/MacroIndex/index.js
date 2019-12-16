import React, { Component, Fragment } from 'react'
import MiniBar from '../../components/MiniBar/index'
import MiniCard from '../../components/MiniCard/index'
import AreaChart from '../../components/AreaChart/index'
import { Row, Col } from 'antd'
import styles from './index.less'
import { getMacroResult, getBeginEndDate, getDateTypes, getResultByBeginEnd, getResultByDateType } from './services/index'
import CustomerFilter from './customerFilter'

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      macroResult: { multipleJudge: {}, riskExposureAdvice: {} },
      dateTypes: [],
      beginEndDate: [],
      dataSource: {}
    }
  }

  componentDidMount() {
    this.dataInit()
  }

  dataInit() {
    getMacroResult().then(res => {
      if (res.code === 0) {
        this.setState({
          macroResult: res.data
        })
      }
    })
    getDateTypes().then(res => {
      if (res.code === 0) {
        this.setState({
          dateTypes: res.data
        })
      }
    })
    getBeginEndDate().then(res => {
      if (res.code === 0) {
        this.setState({
          beginEndDate: res.data
        })
      }
    })
  }

  //获得图表数据
  getChart(indexType, dateType, beginEndDate) {
    if (dateType !== undefined) {
      getResultByDateType({ indexType, dateType }).then(res => {
        if (res.code === 0) {
          let { dataSource } = this.state;
          dataSource[indexType] = res.data
          this.setState({
            dataSource
          })
        }
      })
    } else {
      getResultByBeginEnd({
        indexType, begin: { year: (beginEndDate[0]).split('-')[0], quarter: (beginEndDate[0]).split('-')[1] },
        end: { year: (beginEndDate[1]).split('-')[0], quarter: (beginEndDate[1]).split('-')[1] }
      }, indexType).then(res => {
        if (res.code === 0) {
          let { dataSource } = this.state;
          dataSource[indexType] = res.data
          this.setState({
            dataSource
          })
        }
      })
    }
  }


  render() {
    const { macroResult, macroResult: { multipleJudge = {}, riskExposureAdvice = {} }, dateTypes, beginEndDate, dataSource } = this.state
    return (

      <div className={styles.app}>
        <Row gutter={24}>
          <Col span={6}>
            <MiniBar name={'经济增长'} tip='经济增长' level={macroResult.economicGrowthGrade} index={macroResult.economicGrowthScore} />
          </Col>
          <Col span={6}>
            <MiniBar name={'经济膨胀'} tip='经济膨胀' level={macroResult.inflationGrade} index={macroResult.inflationScore} />
          </Col>
          <Col span={6}>
            <MiniCard {...multipleJudge} name={multipleJudge.key} />
          </Col>
          <Col span={6}>
            <MiniCard {...riskExposureAdvice} name={riskExposureAdvice.key} />
          </Col>
        </Row>
        <div className={styles.charts}>
          <Row>
            <AreaChart data={dataSource[1] || {}} {...charts[0]}
              customerFilter={<CustomerFilter indexTypekey={1} onChange={this.getChart.bind(this)} dateTypes={dateTypes} beginEndDate={beginEndDate} />} />
          </Row>
          <Row>
            <AreaChart data={dataSource[2] || {}} {...charts[1]}
              customerFilter={<CustomerFilter indexTypekey={2} onChange={this.getChart.bind(this)} dateTypes={dateTypes} beginEndDate={beginEndDate} />} />
          </Row>
          <Row>
            <AreaChart data={dataSource[3] || {}} {...charts[2]}
              customerFilter={<CustomerFilter indexTypekey={3} onChange={this.getChart.bind(this)} dateTypes={dateTypes} beginEndDate={beginEndDate} />} />
          </Row>
        </div>
      </div>
    )
  }
}

const charts = [{
  title: '经济增长', key: 1, showTooltip: false, singleLine: true,
  monthRanges: [24, 18, 12, 6], rightStatistics: [{ key: 'yearRatio', name: '同比' }, { key: 'chainRatio', name: '环比' }]
}, {
  title: '通货膨胀', key: 2, showTooltip: false, singleLine: true,
  monthRanges: [24, 18, 12, 6]
}, {
  title: '风险敞口', key: 3, showTooltip: false, singleLine: true, monthRanges: [30, 24, 18, 12]
  , rightStatistics: [{ key: 'yearRatio', name: '同比' }, { key: 'chainRatio', name: '环比' }], chartUnit: '%'
}]


