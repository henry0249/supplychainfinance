import React, { Component } from 'react'
import style from './index.less'
import { Icon, Tooltip } from 'antd'
import { connect } from 'dva'

@connect(({ global, projectApproval }) => ({
  projectApproval,
  global
}))
export default class AllScore extends Component {
  constructor() {
    super()
    this.state = {}
  }
  update() {
    this.props.handleUpdate()
  }

  render() {
    let able = false
    if (this.props.global.role) {
      if (
        this.props.global.role.roleId === 6 ||
        this.props.global.role.roleId === 7 ||
        this.props.global.role.roleId === 8
      ) {
        able = true
      }
    }
    const scoreRisk = this.props.projectApproval.scoreRisk
      ? Object.keys(this.props.projectApproval.scoreRisk).length !== 0
        ? true
        : false
      : false
    const score = scoreRisk
      ? this.props.projectApproval.scoreRisk.firstScore
      : ''
    return (
      <div className={style.AllScore}>
        <div className={style.header}>
          <p>业务总分</p>
          {able ? (
            <Tooltip placement="top" title="重新计算业务评分">
              <a
                style={{ position: 'absolute', right: '16px', top: '13px' }}
                onClick={this.update.bind(this)}
                className={style.action}
              >
                <Icon type="sync" />
              </a>
            </Tooltip>
          ) : (
            ''
          )}
        </div>
        <div className={style.content}>{score ? score + '  分' : ''} </div>
      </div>
    )
  }
}

AllScore.defaultProps = {
  score: '24',
  handleUpdate: () => {}
}
