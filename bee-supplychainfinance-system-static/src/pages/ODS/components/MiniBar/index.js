import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Icon } from 'antd'
import AntTooltip from 'antd/lib/tooltip'
import styles from './index.less'
import {
  Chart, Axis, Tooltip, Geom
} from "bizcharts";

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.level = { '高': '#52c41a', '#1890ff': 'blue', '低': 'grey' }
  }

  render() {
    const { data, name, tip, index, level } = this.props;
    const cols = {
      sales: {
        tickInterval: 20
      }
    };
    return (
      <Card className={styles.app}>
        <p><span className={styles.name}>{name}</span> <AntTooltip className={styles.tip} placement="top" title={tip}>
          <Icon type="exclamation-circle" />
        </AntTooltip></p>
        <div className={styles.index} style={{ color: `${this.level[level]||'green'}` }}>{level}({index})</div>
        {/* <Chart height={80} padding={[10, 0, 0, 0]} data={data} scale={cols} forceFit>
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom type='interval' position="year*sales" />
        </Chart> */}
      </Card>
    )
  }
}

Index.prototypes = {
  data: PropTypes.arrayz
}

Index.defaultProps = {
  data: [
    {
      year: "1951 年",
      sales: 38
    },
    {
      year: "1952 年",
      sales: 52
    },
    {
      year: "1956 年",
      sales: 61
    },
    {
      year: "1957 年",
      sales: 145
    },
    {
      year: "1958 年",
      sales: 48
    },
    {
      year: "1959 年",
      sales: 38
    },
    {
      year: "1960 年",
      sales: 38
    },
    {
      year: "1962 年",
      sales: 38
    }
  ],
  tip: '啦啦啦',
  name: '经济增长',
  index: '12.35',
  level: '高'
}