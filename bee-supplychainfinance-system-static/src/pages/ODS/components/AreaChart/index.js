import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Card, Icon, Form, DatePicker, Button } from 'antd'
import moment from 'moment'
import styles from './index.less'
import {
  Chart,
  Geom,
  Tooltip,
  Legend,
  Axis
} from "bizcharts";

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = { open: false, monthRangeKey: null }
  }

  componentDidMount() {
    this.monthRangeChange(this.props.monthRanges[this.props.monthRanges.length - 1])
  }

  handlePanelChange = (value) => {
    // debugger
    this.setState({
      value,
      open: false,
      monthRangeKey: null
    });
    this.props.onChange && this.props.onChange(value)
  };

  //是否打开Picker面板 每次点击会触发，用来解决rangePicker组件选中月份时不会自动关闭展开
  showRangePick = (open) => {
    this.setState({
      open
    })
  }

  //选中时间区间处理
  monthRangeChange(key) {
    this.setState({
      monthRangeKey: key,
      value: [moment().subtract(key, 'months'), moment()]
    })
    this.props.onChange && this.props.onChange([moment().subtract(key, 'months'), moment()])
  }

  render() {
    let { title, showTooltip, chartUnit, filterZero, chartType, singleLine, customerFilter, data: { chart = [], ratio = {} }, rightStatistics, leftStatistics, level, monthRanges, pickerMode } = this.props;
    const cols = {
      time: {
        range: [0, 1]
      }
    };

    const { value, open, monthRangeKey } = this.state;
    // 0轴线对齐
    const grid = {
      hightLightZero: true,
      type: 'polygon'
    }

    //过滤0
    if (filterZero)
      chart = chart.filter(item => item.data !== 0)

    return (
      <Card className={styles.app}>
        <div className={styles.form}>
          <div className={styles.title}>
            {title}
          </div>
          {customerFilter ? customerFilter : <Fragment>
            <div className={styles.monthRange}>
              {monthRanges && monthRanges.length && monthRanges.map(item => (<span key={item} onClick={this.monthRangeChange.bind(this, item)} className={`${monthRangeKey === item ? styles.active : ''}`}>过去{item}个月</span>))}
            </div>
            <div >
              <div>
                <DatePicker.RangePicker {...({ open })} value={value}
                  onOpenChange={(value) => this.showRangePick(value)} allowClear={false}
                  format={pickerMode === 'year' ? 'YY年' : pickerMode === 'month' ? 'YY年MM月' : 'YY年MM月DD日'} mode={[pickerMode, pickerMode]} showTime={false}
                  onChange={this.handlePanelChange} onPanelChange={this.handlePanelChange} />
              </div>
            </div>
          </Fragment>}
        </div>
        <Chart height={showTooltip ? 280 : 310} padding={showTooltip ? [10, 60, 70, 70] : [10, 60, 30, 70]} data={chart} scale={cols} forceFit>
          <Legend />
          <Axis name="time" grid={grid} />
          <Axis
            name="data"
            label={{
              formatter: val => {
                return val + chartUnit || '';
              }
            }}
          />
          <Tooltip
            crosshairs={{
              type: "line"
            }}
          />
          <Geom
            type={chartType}
            position="time*data"
            size={2}
            color={singleLine ? undefined : "type"}
            shape={"smooth"}
          />
          {singleLine ? <Geom type="area" position="time*data" shape={"smooth"} /> : null}
        </Chart>
        <div className={styles.footer}>
          <div className={styles.left}>
            {leftStatistics.map(item => (
              <div key={item.name}>{item.name}：<span className={styles.value}>{item.value}</span></div>
            ))}
          </div>
          <div className={styles.right}>
            {rightStatistics.map(item => (
              <div key={item.key}>{item.name}{ratio[item.key] && (ratio[item.key] + '').indexOf('-') === -1 ? <Icon type="caret-up" style={{ color: 'green' }} /> : <Icon type="caret-down" style={{ color: 'red' }} />}
                <span>{ratio[item.key] || '暂无'}</span></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }
}

// 添加注释
Index.prototypes = {
  data: PropTypes.object,//后台返回数据 包含图标数据与统计比例数据
  showTooltip: PropTypes.bool,//是否展示默认的图例
  singleLine: PropTypes.bool,//是否是单线图
  pickerMode: PropTypes.objectOf(['day', 'month', 'year']),//时间选择 模式
  title: PropTypes.string,//图表标题
  monthRanges: PropTypes.array,//月份区间按钮组
  onChange: PropTypes.func,//日期变化时的回调，组件渲染时会调用一次
  chartUnit: PropTypes.string,//图表Y轴单位
  filterZero: PropTypes.bool,//是否过滤值为0的数据
}

Index.defaultProps = {
  pickerMode: 'month',
  monthRanges: [6, 3, 2, 1],
  onChange: () => null,
  data: {},
  title: 'chart',
  level: '高',
  leftStatistics: [],
  rightStatistics: [],
  chartUnit: '',
  customerFilter: null,
  chartType: 'line',
  filterZero: false
}