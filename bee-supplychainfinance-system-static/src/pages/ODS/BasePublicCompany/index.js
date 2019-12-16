import { Component } from 'react';
import { Card, Button, Form, Row, Col, Divider, Select, Input, Table, Icon, Modal, message } from 'antd';
import router from 'umi/router'
import styles from './index.less';
import {
  getDataByName,
  deleteData,
  saveData
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

        if (values.companyName) {
          params['companyName'] = values.companyName
        }
        getDataByName(params).then(res => {
          if (res.code === 0) {
            this.setState({
              data: res.data,
              page: res.page
            })
          } else {
            message.error('获取国内上市列表失败：' + res.msg);
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
      title: '删除国内上市企业',
      content: `删除企业“${row.companyName}”吗？`,
      onOk() {
        deleteData({ id: row.id }).then(res => {
          if (res.code === 0) {
            message.success('删除国内上市企业"' + row.companyName + '"成功！');
            _self.getData(1)
          } else {
            message.error('删除国内上市企业失败：' + res.msg);
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
        title: '企业名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width: '25%'
      }, {
        title: '上市时间',
        dataIndex: 'publicTime',
        key: 'publicTime',
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
          <span onClick={() => router.push(`/ods/basePublicCompany/edit?id=${row.id}`)} style={{ fontSize: 14, color: '#1890FF', cursor: 'pointer', marginRight: 12 }}>编辑</span>
          <span onClick={() => this.handleDelete(row)} style={{ fontSize: 14, color: '#1890FF', cursor: 'pointer', marginRight: 12 }}>删除</span>
        </div>,
        width: '25%'
      },
    ];
    return (
      <div className={styles.container}>
        <Card
          bordered={false}
          title="数据仓库：国内上市企业名单"
          extra={<Button onClick={() => router.push('/ods/basePublicCompany/edit')} type="primary" icon="plus">添加新企业</Button>}
        >
          <Form layout="inline">
            <Row type="flex" justify="end" align="middle">
              <Col>
                <FormItem>
                  {
                    getFieldDecorator('companyName')(
                      <Input allowClear={false} style={{ width: 360 }} placeholder="请输入企业名称" />
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
