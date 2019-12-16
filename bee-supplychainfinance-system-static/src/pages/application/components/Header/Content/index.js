import React, { PureComponent, Fragment } from 'react'
import styles from './index.less'
import { Breadcrumb } from 'antd'
import Link from 'umi/link'
import { connect } from 'dva'

@connect(({ application }) => ({
  application
}))
export default class Content extends PureComponent {
  constructor() {
    super()
    this.businessMode = [
      '委托采购',
      '委托销售',
      '金融仓储',
      '',
      '大企业委托采购'
    ]
  }

  render() {
    const {
      application: { data }
    } = this.props
    const state = this.props.application.process.state
      ? this.props.application.process.state
      : 2
    const scoreRisk = this.props.application.scoreRisk
      ? Object.keys(this.props.application.scoreRisk).length !== 0
        ? true
        : false
      : false
    const score = scoreRisk ? this.props.application.scoreRisk.firstScore : ''
    return (
      <Fragment>
        <Breadcrumb className={styles.breadcrumb}>
          <Breadcrumb.Item>
            <Link to={'/application/index'}>我的申请</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{data.applyCompanyName}</Breadcrumb.Item>
        </Breadcrumb>
        <h2 style={{ marginLeft: 50, width: '50%', position: 'relative' }}>
          {data.applyCompanyName} 立项审批
          {state >= 2 && scoreRisk ? (
            <div className={styles.scoreWrap}>
              风控评分: <span className={styles.score}>{score}</span>分
            </div>
          ) : null}
        </h2>

        <div
          className={styles.pageHeaderContent}
          style={{ marginLeft: 50, background: 'white' }}
        >
          <div className={styles.headListLeft}>
            <p>
              创建人：<span>{data.creator}</span>
            </p>
            <p>
              核心企业：<span>{data.coreCompanyName}</span>
            </p>
            <p>
              委托方：<span>{data.applyCompanyName}</span>
            </p>
          </div>
          <div className={styles.headListRight}>
            <p>
              业务类型：<span>{this.businessMode[data.businessMode]}</span>
            </p>
            <p>
              货品：<span className={styles.daipin}>{data.tradeGoods}</span>
            </p>
            <p>
              项目意义：<span>{data.projectSignificance}</span>
            </p>
          </div>
        </div>
      </Fragment>
    )
  }
}
