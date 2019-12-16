import React, { Component } from 'react'
import style from './index.less'
import { Icon } from 'antd'
import { connect } from 'dva'

@connect(({ global, projectApproval }) => ({
  projectApproval,
  global
}))
export default class EconomicNum extends Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
    const data = this.props.data ? this.props.data : []
    let iColor, eColor, rColor, content
    switch (data[1]) {
      case '低':
        iColor = '#f04864'
        break
      case '中':
        iColor = '#facc14'
        break
      case '高':
        iColor = '#2fc25b'
        break
    }
    switch (data[2]) {
      case '低':
        eColor = '#f04864'
        break
      case '中':
        eColor = '#facc14'
        break
      case '高':
        eColor = '#2fc25b'
        break
    }
    if (data[3]) {
      if (data.riskExposureSuggest < 30) {
        rColor = '#f04864'
      } else if (data.riskExposureSuggest < 80) {
        rColor = '#facc14'
      } else {
        rColor = '#2fc25b'
      }
    }
    if (Object.keys(data).length === 0) {
      content = (
        <div
          className={style.EconomicNum}
          style={{ flex: '1', marginLeft: 20 }}
        >
          <div className={style.header}>
            <p>宏观经济指数</p>
          </div>
          <div className={style.EconomicNumNo}>
            <Icon type="frown" />
            没有搜到任何数据
          </div>
        </div>
      )
    } else {
      content = (
        <div
          className={style.EconomicNum}
          style={{ flex: '1', marginLeft: 20 }}
        >
          <div className={style.header}>
            <p>宏观经济指数</p>
          </div>
          <div className={style.content}>
            <table>
              <thead>
                <tr>
                  <th>周期阶段</th>
                  <th>通货膨胀</th>
                  <th>经济增长</th>
                  <th>风险敞口</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{data[0] && data[0]}</td>
                  <td style={{ color: iColor }}>{data[1] && data[1]}</td>
                  <td style={{ color: eColor }}>{data[2] && data[2]}</td>
                  <td style={{ color: rColor }}>{data[3] && data[3] + '%'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    }
    return content
  }
}
