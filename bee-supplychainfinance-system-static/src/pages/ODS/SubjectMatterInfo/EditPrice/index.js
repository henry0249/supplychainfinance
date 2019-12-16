import { Component } from 'react';
import { Form, Button, Breadcrumb, Card, Table, Row, Col, Input, InputNumber, Select, message, Modal } from 'antd';
import Search from './components/Search';
import SearchById from './components/SearchById';
import router from 'umi/router';
import Link from 'umi/link';
import withRouter from 'umi/withRouter';
import styles from './index.less';

@withRouter
export default class Index extends Component {
  state = {
    key: 'id',
    tabs: [{
      tab: '编号查找',
      key: 'id'
    }, {
      tab: '分类查找',
      key: 'type'
    }],
  }

  onTabChange = (key, type) => {
    this.setState({
      [type]: key,
    });
  };

  render() {
    const { key, tabs } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Breadcrumb>
            <Breadcrumb.Item><Link to="/home">首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/ods/macrofinance/MacroIndex">数据仓库</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/ods/subjectMatterInfo">标的物信息</Link></Breadcrumb.Item>
            <Breadcrumb.Item>编辑数据</Breadcrumb.Item>
          </Breadcrumb>

          <h2>标的物价格数据</h2>

          <Row type="flex" justify="space-between" align="middle">
            <Col>
              <span>操作：可编辑和添加，不可删除；更新频率：每天；更新方式：人工输入。</span>
            </Col>
            <Col>
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
            {
              key === 'id' ? <SearchById /> : <Search />
            }
          </Card>
        </div>
      </div>
    )
  }
}
