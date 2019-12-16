import React, { Component } from 'react'
import styles from './index.less'
import { Icon } from 'antd'
import { connect } from 'dva';

//'附件'组件
@connect(({ global, projectApproval }) => ({
  projectApproval, global
}))
export default class Enclosure extends Component {
  render() {
    const data=this.props.projectApproval.log.data || this.props.data
    return (
      <div className={styles.download}>
        {data.length > 0 ? data.map((item, index) =>
          <div key={index}>
            <a href={item.fileUrl}>
              <Icon type="link" />
              {item.fileName}
            </a>
          </div>) : null}
      </div>
    )
  }
}

Enclosure.defaultProps = {
  data: [{ name: '附件一', url: '#' }]
}