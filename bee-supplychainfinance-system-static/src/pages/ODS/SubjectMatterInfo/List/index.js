import { Component } from 'react';
import { Button, Breadcrumb, Card, Table, Divider, Row, Col, message } from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import withRouter from 'umi/withRouter';
import styles from './index.less';
import {
  getTypes,
  getList
} from '../service';

@withRouter
export default class Index extends Component {
  state = {
    key: null,
    tabs: [],
    current: 1,
    data: [],
    page: {
      totalPage: 0,
      totalRecords: 0,
    }
  }

  componentDidMount() {
    getTypes().then(res => {
      if (res.code === 0) {
        let tabs = [];
        res.data.forEach(i => {
          tabs.push({
            key: i.typeName,
            tab: `${i.typeName}（${i.subjectMatterCount}）`
          })
        })
        this.setState({
          key: tabs[0].key,
          tabs
        }, () => this.getData(tabs[0].key))
      } else {
        message.error('获取标的物大类失败：' + res.msg);
      }
    })
  }

  getData = (typeName) => {
    getList(typeName).then(res => {
      if (res.code === 0) {
        this.setState({
          data: res.data,
          page: {
            totalPage: Math.ceil(res.data.length / 10),
            totalRecords: res.data.length
          }
        })
      } else {
        message.error('获取标的物列表失败：' + res.msg);
      }
    })
  }

  onTabChange = (key, type) => {
    this.setState({
      [type]: key,
      current: 1
    }, () => this.getData(key));
  };

  currentChange = (current) => {
    this.setState({
      current
    })
  }

  render() {
    const { key, tabs, current, data, page } = this.state;
    const columns = [
      {
        title: '标的物名称',
        dataIndex: 'name',
        key: 'name',
        width: '20%'
      }, {
        title: '含有规格数',
        dataIndex: 'specificationCount',
        key: 'specificationCount',
        width: '20%'
      }, {
        title: '含有来源数',
        dataIndex: 'sourceCount',
        key: 'sourceCount',
        width: '20%'
      }, {
        title: '操作',
        key: 'action',
        render: (text, row, record) => (
          <div>
            <span onClick={() => router.push(`/ods/subjectMatterInfo/editPrice?key=${key}&name=${row.name}`)} style={{ color: '#1890ff', cursor: 'pointer' }}>编辑价格</span>
            <Divider type="vertical" />
            <span onClick={() => router.push(`/ods/subjectMatterInfo/list/attributes?name=${row.name}`)} style={{ color: '#1890ff', cursor: 'pointer' }}>编辑属性</span>
            <Divider type="vertical" />
            <span onClick={() => router.push(`/ods/subjectMatterInfo/list/standard?key=${key}&name=${row.name}`)} style={{ color: '#1890ff', cursor: 'pointer' }}>编辑规格</span>
            <Divider type="vertical" />
            <span onClick={() => router.push(`/ods/subjectMatterInfo/list/source?key=${key}&name=${row.name}`)} style={{ color: '#1890ff', cursor: 'pointer' }}>编辑来源</span>
          </div>
        ),
        width: '40%'
      }
    ];

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Breadcrumb>
            <Breadcrumb.Item><Link to="/home">首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/ods/macrofinance/MacroIndex">数据仓库</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/ods/subjectMatterInfo">标的物信息</Link></Breadcrumb.Item>
            <Breadcrumb.Item>标的物列表</Breadcrumb.Item>
          </Breadcrumb>

          <h2>标的物数据</h2>

          <Row type="flex" justify="space-between" align="middle">
            <Col>
              <span>操作：可编辑和添加，不可删除。</span>
            </Col>
            <Col>
              <Button onClick={() => router.push('/ods/subjectMatterInfo/list/attributes')} style={{ marginRight: 16 }} icon="plus" type='primary'>添加新标的物</Button>
              <Button onClick={() => router.goBack()} icon="rollback" type='primary'>返回</Button>
            </Col>
          </Row>
        </div>

        <div className={styles.body}>
          <Card
            style={{ width: '100%' }}
            bordered={false}
            tabList={tabs}
            activeTabKey={key}
            onTabChange={key => {
              this.onTabChange(key, 'key');
            }}
          >
            <Table
              rowKey={(row, i) => i}
              columns={columns}
              dataSource={data}
              pagination={{
                showQuickJumper: true,
                current: current,
                pageSize: 10,
                total: page.totalRecords,
                onChange: this.currentChange,
                showTotal: (total, range) => `共 ${page.totalRecords} 条记录 第 ${current} / ${page.totalPage} 页`,
              }}
            />
          </Card>
        </div>
      </div >
    )
  }
}
