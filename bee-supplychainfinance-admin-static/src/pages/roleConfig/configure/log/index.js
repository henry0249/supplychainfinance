import { Component } from 'react';
import { Form, Row, Card, Table, Tooltip, message } from 'antd';
import withRouter from 'umi/withRouter';
import styles from './index.less';
import {
  getLogs
} from '../../services';


@withRouter
@Form.create()
export default class Index extends Component {
  state = {
    logs: [],
    logsPage: {
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      totalRecords: 0
    },
  }

  componentDidMount() {
    this.getBaseLogs(1)
  }

  getBaseLogs = (currentPage) => {
    getLogs(currentPage).then(res => {
      if (res.code === 0) {
        this.setState({
          logs: res.data,
          logsPage: res.page || {
            currentPage: 1,
            pageSize: 10,
            totalPage: 0,
            totalRecords: 0
          }
        })
      } else {
        this.setState({
          logs: [],
          logsPage: {
            currentPage: 1,
            pageSize: 10,
            totalPage: 0,
            totalRecords: 0
          }
        }, () => message.error('获取操作日志失败：' + res.msg))
      }
    })
  }



  render() {
    const {
      logs,
      logsPage
    } = this.state;
    const columns = [
      {
        title: '操作类型',
        dataIndex: 'operateModuleType',
        key: 'operateModuleType',
        width: '15%'
      }, {
        title: '操作人',
        dataIndex: 'operatorName',
        key: 'operatorName',
        width: '15%'
      }, {
        title: '权限组',
        dataIndex: 'roleName',
        key: 'roleName',
        width: '20%'
      }, {
        title: '执行结果',
        dataIndex: 'operateMsg',
        key: 'operateMsg',
        render: (text, row) => <Tooltip title={text}>
          <div className={styles.td}>{text}</div>
        </Tooltip>,
        width: '30%'
      }, {
        title: '操作时间',
        dataIndex: 'operateTime',
        key: 'operateTime',
        width: '20%'
      }
    ];
    return (
      <div className={styles.body}>
        <Card
          title="操作日志"
          bordered={false}
          style={{ marginBottom: 24, paddingBottom: 12 }}
        >
          <Row>
            <Table
              rowKey="id"
              dataSource={logs}
              columns={columns}
              pagination={{
                size: 'small',
                current: logsPage.currentPage,
                pageSize: logsPage.pageSize,
                total: logsPage.totalRecords,
                onChange: (current) => this.getBaseLogs(current),
                showTotal: (total, range) => `共 ${logsPage.totalRecords} 条记录 第 ${logsPage.currentPage} / ${logsPage.totalPage} 页`,
              }}
            />
          </Row>
        </Card></div>
    )
  }
}