import { Component } from 'react';
import { Card, Button, Form, Row, Col, Divider, Select, Input, Table, Modal, message } from 'antd';
import router from 'umi/router'
import styles from './index.less';
import {
  getDataByType,
  getDataByName,
  deleteData
} from './services';

const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
export default class Index extends Component {
  state = {
    type: 0,
    data: [],
    page: {
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      totalRecords: 0,
    }
  }

  componentDidMount() {
    const { type } = this.state;
    this.getData(1, type)
  }

  getData = (current, type) => {
    const { validateFields, resetFields } = this.props.form;
    validateFields((err, values) => {
      if (!err) {
        let params = {
          current
        }

        if (type === 0) {
          params['companyType'] = values.companyType
          getDataByType(params).then(res => {
            if (res.code === 0) {
              resetFields(['companyName']);
              this.setState({
                data: res.data,
                page: res.page,
                type
              })
            } else {
              message.error('获取国企/央企列表失败：' + res.msg);
            }
          })
        } else if (type === 1) {
          params['companyName'] = values.companyName
          getDataByName(params).then(res => {
            if (res.code === 0) {
              resetFields(['companyType']);
              this.setState({
                data: res.data,
                page: res.page,
                type
              })
            } else {
              message.error('获取国企/央企列表失败：' + res.msg);
            }
          })
        }
      }
    })
  }

  currentChange = (current) => {
    const { type } = this.state;
    this.getData(current, type)
  }

  handleSearch = (type) => {
    this.getData(1, type)
  }

  handleDelete = (row) => {
    const { type } = this.state;
    let _self = this;
    Modal.confirm({
      title: '删除国企/央企',
      content: `删除企业“${row.companyName}”吗？`,
      onOk() {
        deleteData({ id: row.id }).then(res => {
          if (res.code === 0) {
            message.success('删除国企/央企成功！');
            _self.getData(1, type)
          } else {
            message.error('删除国企/央企失败：' + res.msg);
          }
        })
      },
      onCancel() { },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { data, page } = this.state;
    const columns = [
      {
        title: '类型',
        dataIndex: 'companyType',
        key: 'companyType',
        width: '25%'
      }, {
        title: '企业名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width: '25%'
      }, {
        title: '更新时间',
        dataIndex: 'modifyTime',
        key: 'modifyTime',
        width: '25%'
      }, {
        title: '操作',
        key: 'action',
        render: (text, row, record) => <div>
          <span onClick={() => router.push(`/ods/baseImportCompany/edit?id=${row.id}`)} style={{ fontSize: 14, color: '#1890FF', cursor: 'pointer', marginRight: 12 }}>编辑</span>
          <span onClick={() => this.handleDelete(row)} style={{ fontSize: 14, color: '#1890FF', cursor: 'pointer', marginRight: 12 }}>删除</span>
        </div>,
        width: '25%'
      },
    ];
    return (
      <div className={styles.container}>
        <Card
          bordered={false}
          title="数据仓库：国企/央企名单"
          extra={<Button onClick={() => router.push('/ods/baseImportCompany/edit')} type="primary" icon="plus">添加新企业</Button>}
        >
          <Form layout="inline">
            <Row gutter={8}>
              <Col className={styles.colBox} xs={24} sm={24} md={24} lg={24} xl={9}>
                <FormItem label="国企/央企">
                  {
                    getFieldDecorator('companyType', {
                      initialValue: 0
                    })(
                      <Select allowClear={false} style={{ width: 150 }} placeholder="请选择">
                        <Option value={0}>全部</Option>
                        <Option value={1}>仅央企</Option>
                        <Option value={2}>仅国企</Option>
                      </Select>
                    )
                  }
                </FormItem>
                <Button onClick={this.handleSearch.bind(this, 0)} type="primary">筛选</Button>
              </Col>
              <Col xs={0} sm={0} md={0} lg={0} xl={1}>
                <Divider type="vertical" style={{ height: 40 }} />
              </Col>
              <Col className={styles.colBox} xs={24} sm={24} md={24} lg={24} xl={14}>
                <FormItem>
                  {
                    getFieldDecorator('companyName')(
                      <Input allowClear={false} style={{ width: 300 }} placeholder="请输入企业名称" />
                    )
                  }
                </FormItem>
                <Button onClick={this.handleSearch.bind(this, 1)} type="primary" icon="search"> </Button>
              </Col>
            </Row>
          </Form>

          <Table
            rowKey='id'
            style={{ marginTop: 24 }}
            dataSource={data}
            columns={columns}
            pagination={{
              showQuickJumper: true,
              current: page.currentPage,
              pageSize: page.pageSize,
              total: page.totalRecords,
              onChange: this.currentChange,
              showTotal: (total, range) => `共 ${page.totalRecords} 条记录 第 ${page.currentPage} / ${page.totalPage} 页`,
            }}
          />
        </Card>
      </div>
    )
  }
}
