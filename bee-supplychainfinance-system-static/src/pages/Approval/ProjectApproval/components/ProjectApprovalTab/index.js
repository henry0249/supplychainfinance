import React, { Component } from 'react'
import ProjectReport from '../ProjectReport'
import OtherInfo from '../OtherInfo'
import { connect } from 'dva'
import { Card } from 'antd'
import ExtraContent from '../Header/ExtraContent'
import Enclosure from '../Enclosure'
import { Alert } from 'antd'
import style from './index.less'

@connect(({ projectApproval }) => ({
  projectApproval
}))
class ProjectApprovalTab extends Component {
  constructor() {
    super()
    this.state = {}
  }
  componentDidMount() {}
  render() {
    let arr = [],
      str = ''
    const lowRuleDetail = this.props.projectApproval.report.data
      ? this.props.projectApproval.report.data.lowRuleDetail
        ? this.props.projectApproval.report.data.lowRuleDetail
        : false
      : false
    if (lowRuleDetail) {
      arr = lowRuleDetail.split('&d;')
      str = arr.slice(0, arr.length - 1).join(`\n`)
    }
    return (
      <div className={style.wrap}>
        {lowRuleDetail ? (
          <Alert
            message="
          请注意，由于触发低分规则，下列条款被自动调整"
            description={<pre>{str}</pre>}
            type="warning"
            showIcon
            style={{
              marginBottom: '30px',
              marginLeft: '-30px',
              marginRight: '-30px',
              marginTop: '-24px'
            }}
          />
        ) : (
          ''
        )}

        <ProjectReport />
        <Card
          title="其他补充信息"
          bordered={false}
          style={{ marginTop: '30px' }}
        >
          <OtherInfo />
        </Card>
        <Card title="附件" style={{ marginTop: '30px' }}>
          <Enclosure />
        </Card>
      </div>
    )
  }
}

export default ProjectApprovalTab
