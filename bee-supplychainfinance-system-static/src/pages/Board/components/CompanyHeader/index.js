import { Component } from 'react';
import { Breadcrumb } from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import withRouter from 'umi/withRouter';
import styles from './index.less';

@withRouter
export default class TotalProfit extends Component {
  state = {
  }

  render() {
    const { companyName } = this.props.location.query;
    return (
      <div className={styles.container}>
        <Breadcrumb>
          <Breadcrumb.Item><Link to='/home'>总览</Link> </Breadcrumb.Item>
          <Breadcrumb.Item>公司详情</Breadcrumb.Item>
        </Breadcrumb>
        <p className={styles.companyName}>{companyName}</p>
      </div>
    )
  }
}