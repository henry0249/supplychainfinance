import { Component } from 'react';
import { Card, Button, Form, Row, Col, Divider, Select, Input, Table, Modal, message } from 'antd';
import router from 'umi/router'
import styles from './index.less';
import {
  getAllProvince,
  getDataByProvince,
  getDataByName,
  deleteData,
  saveData
} from './services';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
export default class Index extends Component {
  state = {
    type: 0,
    list: [],
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
    getAllProvince().then(res => {
      if (res.code === 0) {
        this.setState({
          list: res.data,
        })
      } else {
        message.error('获取省份列表失败：' + res.msg);
      }
    })
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
          if (province) {
            params['province'] = values.province
          }
          getDataByProvince(params).then(res => {
            if (res.code === 0) {
              resetFields(['companyName']);
              this.setState({
                data: res.data,
                page: res.page,
                type
              })
            } else {
              message.error('获取环保失信列表失败：' + res.msg);
            }
          })
        } else if (type === 1) {
          if (values.companyName) {
            params['companyName'] = values.companyName
          }
          getDataByName(params).then(res => {
            if (res.code === 0) {
              resetFields(['province']);
              this.setState({
                data: res.data,
                page: res.page,
                type
              })
            } else {
              message.error('获取环保失信列表失败：' + res.msg);
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
      title: '删除环保失信企业',
      content: `删除企业“${row.companyName}”吗？`,
      onOk() {
        deleteData({ id: row.id }).then(res => {
          if (res.code === 0) {
            message.success('删除环保失信企业"' + row.companyName + '"成功！');
            _self.getData(1, type)
          } else {
            message.error('删除环保失信企业失败：' + res.msg);
          }
        })
      },
      onCancel() { },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { list, data, page } = this.state;
    const columns = [
      {
        title: '所在省',
        dataIndex: 'province',
        key: 'province',
        width: '15%'
      }, {
        title: '企业名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width: '20%'
      }, {
        title: '违法行为',
        dataIndex: 'unlawfulActive',
        key: 'unlawfulActive',
        width: '30%'
      }, {
        title: '更新时间',
        dataIndex: 'modifyTime',
        key: 'modifyTime',
        width: '20%'
      }, {
        title: '操作',
        key: 'action',
        render: (text, row, record) => <div>
          <span onClick={() => router.push(`/ods/baseLoseCreditList/edit?id=${row.id}`)} style={{ fontSize: 14, color: '#1890FF', cursor: 'pointer', marginRight: 12 }}>编辑</span>
          <span onClick={() => this.handleDelete(row)} style={{ fontSize: 14, color: '#1890FF', cursor: 'pointer', marginRight: 12 }}>删除</span>
        </div>,
        width: '15%'
      },
    ];
    return (
      <div className={styles.container}>
        <Card
          bordered={false}
          title="数据仓库：环保失信企业名单"
          extra={<Button onClick={() => router.push('/ods/baseLoseCreditList/edit')} type="primary" icon="plus">添加新企业</Button>}
        >
          <Form layout="inline">
            <Row gutter={8}>
              <Col className={styles.colBox} xs={24} sm={24} md={24} lg={24} xl={9}>
                <FormItem label="所在省">
                  {
                    getFieldDecorator('province')(
                      <Select allowClear={false} style={{ width: 150 }} placeholder="请选择">
                        {
                          list.length !== 0 && list.map(
                            item => <Option value={item.district} key={item.id}>{item.district}</Option>
                          )
                        }
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
