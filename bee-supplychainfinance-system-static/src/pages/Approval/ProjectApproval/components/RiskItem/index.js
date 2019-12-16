import { Component } from 'react';
import styles from './index.less';
import { Divider, Table } from 'antd';
import { connect } from 'dva';

@connect(({ global, projectApproval }) => ({
  projectApproval,
  global
}))
export default class Index extends Component {
  render() {
    const data = this.props.projectApproval.scoreRisk.tempRiskItemList || [];
    const columns = [{
      title: '风险项',
      dataIndex: 'ruleType',
      key: 'ruleType',
      render: (text, row) => text === 0 ? <span style={{color: '#FF5959'}}>风险事件</span> : <span style={{color: '#59dd59'}}>关注事件</span>
    }, {
      title: '风险维度',
      dataIndex: 'riskDimension',
      key: 'riskDimension',
    }, {
      title: '规则对象',
      dataIndex: 'ruleObject',
      key: 'ruleObject',
    }, {
      title: '具体风险',
      dataIndex: 'riskContent',
      key: 'riskContent',
    }];
    return (
      <div className={styles.container}>
        <span className={styles.title}>风险项</span>
        <Divider />
        <div className={styles.content}>
          <Table rowKey={(i, index) => i.id} dataSource={data} columns={columns} pagination={false}/>
        </div>
      </div>
    )
  }
}
