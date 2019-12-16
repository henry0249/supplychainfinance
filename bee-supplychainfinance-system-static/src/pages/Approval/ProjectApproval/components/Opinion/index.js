import React, { Component } from 'react'
import { Icon } from 'antd'
import styles from './index.less'
import { connect } from 'dva'
import withRouter from 'umi/withRouter'

@withRouter
@connect(({ global, projectApproval }) => ({
  global,
  projectApproval
}))
export default class Index extends Component {
  constructor() {
    super()
  }

  componentDidMount() {
    const { dispatch } = this.props
    const { id } = this.props.location.query
    dispatch({
      type: 'projectApproval/getAuditMsg',
      payload: id
    })
  }

  render() {
    const risk = this.props.projectApproval.auditMsg
    return (
      <div className={styles.container}>
        {risk && risk.riskInformationDTOs ? (
          <div className={styles.content}>
            <span className={styles.title}>审批意见</span>
            <div className={styles.tableBox}>
              {risk.riskInformationDTOs.map((i, index) => (
                <div className={styles.item} key={index}>
                  <div className={styles.header}>
                    <Icon style={{ fontSize: 12 }} type="caret-down" />
                    <span>
                      {i.roleName === '业务风控'
                        ? '终审意见：'
                        : i.roleName + ': ' + i.adviser}
                    </span>
                  </div>
                  <div className={styles.box}>
                    {i.riskContentDTOs && i.riskContentDTOs.length !== 0 ? (
                      i.riskContentDTOs.map((item, _index) => (
                        <div
                          style={{ width: '30%', marginBottom: 30 }}
                          key={_index}
                        >
                          <p style={{ font: '14px normal', color: '#333333' }}>
                            {item.risk === '申请额度'
                              ? item.risk + ': ' + item.riskValue + ' 元'
                              : item.risk === '年化利率'
                                ? item.risk + ': ' + item.riskValue + ' %'
                                : item.risk + ': ' + item.riskValue}
                          </p>
                          <p style={{ font: '#838383' }}>
                            {item.suggestion ? item.suggestion : '无异议'}
                          </p>
                        </div>
                      ))
                    ) : (
                        <p className={styles.noRisk}>
                          <Icon
                            style={{ fontSize: 16, marginRight: 10 }}
                            type="frown"
                          />
                          无审批意见
                      </p>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
            <p className={styles.empty}>暂无审批意见</p>
          )}
      </div>
    )
  }
}
