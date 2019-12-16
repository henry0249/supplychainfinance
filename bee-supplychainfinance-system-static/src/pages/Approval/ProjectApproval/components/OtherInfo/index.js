import React, { Component, Fragment } from 'react'
import { Icon } from 'antd'
import styles from './index.less'
import { connect } from 'dva'

//'其他补充信息'组件
@connect(({ projectApproval }) => ({
  projectApproval
}))
export default class OtherInfo extends Component {
  constructor(props) {
    super()
  }

  componentDidMount() {}

  render() {
    const data = this.props.projectApproval
      ? this.props.projectApproval.otherInfo
        ? this.props.projectApproval.otherInfo.data.additionalInformation
        : ''
      : ''
    let arr = []
    let str = ''
    if (data) {
      arr = data.split('&d;')
      arr.forEach((item, index) => {
        str += item.split('&b;').join(': ') + '\r\n'
      })
    }
    return (
      <Fragment>
        {data && data.length > 0 ? (
          <pre style={{ whiteSpace: 'pre-wrap' }}>{str}</pre>
        ) : (
          <div className={styles.otherInfo}>
            <div>
              <Icon type="smile" />
              <span style={{ marginLeft: 10 }}>暂无数据</span>
            </div>
            <div />
          </div>
        )}
      </Fragment>
    )
  }
}
OtherInfo.defaultProps = {
  data: [{}]
}
