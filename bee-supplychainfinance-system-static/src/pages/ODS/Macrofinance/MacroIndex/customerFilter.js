import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import styles from './index.less'
const { Option } = Select;

export default class CustomerFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dateType: null,
      begin: undefined,
      end: undefined,
    }
  }

  componentDidMount() {
    if (this.props.dateTypes && this.props.dateTypes.length > 0) {
      this.setInitType(this.props.dateTypes)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dateTypes && this.props.dateTypes !== nextProps.dateTypes && nextProps.dateTypes.length) {
      this.setInitType(nextProps.dateTypes)
    }
  }

  setInitType(dateTypes) {
    if (dateTypes && dateTypes.length > 0) {
      this.dataChange('dateType', dateTypes[dateTypes.length - 1].key)
    }
  }
  monthRangeChange(key) {
    this.setState({
      monthRangeKey: key,
      value: [moment().subtract(key, 'months'), moment()]
    })
    this.props.onChange && this.props.onChange([moment().subtract(key, 'months'), moment()])
  }

  dataChange(name, value) {
    const { onChange, indexTypekey } = this.props

    switch (name) {
      case 'dateType':
        this.setState({
          [name]: value,
          begin: undefined,
          end: undefined
        })
        onChange && onChange(indexTypekey, value, undefined)
        break;
      case 'begin':
        if (this.state.end && value) {
          onChange && onChange(indexTypekey, undefined, [value, this.state.end])
        }
        this.setState({
          [name]: value,
          dateType: undefined
        })
        break;
      case 'end':
        if (this.state.begin && value) {
          onChange && onChange(indexTypekey, undefined, [this.state.begin, value])
        }
        this.setState({
          [name]: value,
          dateType: undefined
        })
        break;
      default:
        break;
    }
  }

  render() {
    const { dateTypes = [], beginEndDate = [] } = this.props;
    const { begin, end, dateType } = this.state
    return <Fragment>
      <div className={styles.range}>
        {dateTypes && dateTypes.length ? dateTypes.map(item => (
          <span key={item.key} onClick={this.dataChange.bind(this, 'dateType', item.key)}
            className={`${dateType === item.key ? styles.active : ''}`}>{item.name}</span>)) : null}
      </div>
      <Select style={{ width: 140 }} placeholder='开始季度' onSelect={this.dataChange.bind(this, 'begin')} value={begin}>
        {beginEndDate && beginEndDate.map(item => (
          <Option value={`${item.year}-${item.quarter}`}>{`${item.year}第${item.quarter}季度`}</Option>
        ))}
      </Select>
      &nbsp;~&nbsp;
      <Select style={{ width: 140 }} placeholder='结束季度' onSelect={this.dataChange.bind(this, 'end')} value={end}>
        {beginEndDate && beginEndDate.map(item => (
          <Option value={`${item.year}-${item.quarter}`}>{`${item.year}第${item.quarter}季度`}</Option>
        ))}
      </Select>

    </Fragment>
  }
}
