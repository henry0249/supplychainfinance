import { Component } from 'react';
import { Card, Button, Form, Row, Col, Input, Table, Modal, message } from 'antd';
import router from 'umi/router';
import styles from './index.less';
import {
  getBaseGrossProfitRate,
  deleteBaseGrossProfitRate
} from './services';

const FormItem = Form.Item;

@Form.create()
export default class Index extends Component {
  state = {
    data: [],
    page: {
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      totalRecords: 0,
    }
  }

  componentDidMount() {
    this.getData(1)
  }

  getData = (current) => {
    const { validateFields } = this.props.form;
    validateFields((err, values) => {
      if (!err) {
        let params = {
          current
        }

        if (values.sourceName) {
          params['sourceName'] = values.sourceName
        }

        getBaseGrossProfitRate(params).then(res => {
          if (res.code === 0) {
            this.setState({
              data: res.data,
              page: res.page
            })
          } else {
            message.error('获取原料加工销售毛利率列表失败：' + res.msg);
          }
        })
      }
    })
  }

  currentChange = (current) => {
    this.getData(current)
  }

  handleSearch = () => {
    this.getData(1)
  }

  handleDelete = (row) => {
    let _self = this;
    Modal.confirm({
      title: '删除毛利率项',
      content: `删除标的物“${row.sourceName}”毛利率项吗？`,
      onOk() {
        deleteBaseGrossProfitRate({ id: row.id }).then(res => {
          if (res.code === 0) {
            message.success('删除标的物名称"' + row.sourceName + '"成功！');
            _self.getData(1)
          } else {
            message.error('删除标的物名称失败：' + res.msg);
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
        title: '标的物名称',
        dataIndex: 'sourceName',
        key: 'sourceName',
        width: '25%'
      }, {
        title: '加工销售毛利率',
        dataIndex: 'grossProfitRate',
        key: 'grossProfitRate',
        render: (text, row) => text + '%',
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
          <span onClick={() => router.push(`/ods/baseGrossProfitRate/edit?id=${row.id}&sourceName=${row.sourceName}`)} style={{ fontSize: 14, color: '#1890FF', cursor: 'pointer', marginRight: 12 }}>编辑</span>
          <span onClick={() => this.handleDelete(row)} style={{ fontSize: 14, color: '#1890FF', cursor: 'pointer', marginRight: 12 }}>删除</span>
        </div>,
        width: '25%'
      },
    ];
    return (
      <div className={styles.container}>
        <Card
          bordered={false}
          title="数据仓库：原料加工销售毛利率"
          extra={<Button onClick={() => router.push('/ods/baseGrossProfitRate/edit')} type="primary" icon="plus">添加新标的物</Button>}
        >
          <Form layout="inline">
            <Row gutter={8}>
              <Col className={styles.colBox}>
                <FormItem>
                  {
                    getFieldDecorator('sourceName')(
                      <Input allowClear={false} style={{ width: 300 }} placeholder="请输入标的物名称" />
                    )
                  }
                </FormItem>
                <Button onClick={this.handleSearch.bind(this)} type="primary" icon="search"> </Button>
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
