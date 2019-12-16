import React, { Component } from 'react'
import Step from '../Step'
import { Card, Divider, Collapse, message, Row, Col } from 'antd'
import { connect } from 'dva'
import withRouter from 'umi/withRouter'
import style from './index.less'

@withRouter
@connect(({ application }) => ({
  application
}))
export default class index extends Component {
  render() {
    return (
      <div>
        <Card
          title={<div style={{ fontWeight: 600 }}>流程进度</div>}
          bordered={false}
        >
          <Step />
        </Card>
        <Card
          title={<div style={{ fontWeight: 600 }}>业务详细信息</div>}
          style={{ margin: '20px 0' }}
        >
          <div className={style.wrap}>
            <img
              src="https://d2i72ju5buk5xz.cloudfront.net/gsc/N0BR7P/d7/8b/65/d78b652689814f0b8b67fd011a904b51/images/1_22申请详情__创建项目_/u10810.png?token=aee37503e8745b31799aec28994a4fd509d290d78a22028fdf89ae05a90f7d5a"
              alt=""
            />
            <h3 style={{ margin: '20px 0' }}>当前项目暂无数据</h3>
            <p>待平台相关工作人员对您的业务数据进行补充</p>
          </div>
        </Card>
      </div>
    )
  }
}
