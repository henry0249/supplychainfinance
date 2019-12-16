import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Icon, Avatar } from 'antd'
import AntTooltip from 'antd/lib/tooltip'
import styles from './index.less'
import header from './header.png'

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.level = { '高': '#52c41a', '#1890ff': 'blue', '低': 'grey' }
  }

  render() {
    const { name, tip, value, level, chainRatio, yearRatio } = this.props;
    const cols = {
      sales: {
        tickInterval: 20
      }
    };
    return (
      <Card className={styles.app}>
        <div className={styles.top}>
          <Avatar size={80} src={header} />
          <p>
            <div className={styles.title}><span className={styles.name}>{name}</span>
              <AntTooltip className={styles.tip} placement="top" title={tip || name}>
                <Icon type="exclamation-circle" />
              </AntTooltip>
            </div>
            <div className={styles.index}>{value}</div>
          </p>
        </div>
        <div className={styles.footer}>
          <div>同比</div>
          <div>{yearRatio}</div>
          <div>环比</div>
          <div>{chainRatio}</div>
        </div>
      </Card>
    )
  }
}

Index.prototypes = {
  data: PropTypes.arrayz
}

Index.defaultProps = {
  tip: null,
  name: '经济增长',
  chainRatio: '12.35',
  yearRatio: '',
  value: ''
}