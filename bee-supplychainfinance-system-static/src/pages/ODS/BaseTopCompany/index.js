import { Component } from 'react';
import { Card, Button, Form, Row, Col, Divider, Select, Input, Table, Icon, Modal, message } from 'antd';
import router from 'umi/router'
import styles from './index.less';
import {
  getYears,
  getListByCondition,
  getDataByName,
  deleteData
} from './services';

const FormItem = Form.Item;

@Form.create()
export default class Index extends Component {
  state = {
    type: 0,
    years: [],
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
    getYears().then(res => {
      if (res.code === 0) {
        this.setState({
          years: res.data.years,
        })
      } else {
        message.error('获取所有年份失败：' + res.msg);
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
          params['years'] = values.years
          params['inland'] = values.inland
          getListByCondition(params).then(res => {
            if (res.code === 0) {
              resetFields(['companyName']);
              this.setState({
                data: res.data,
                page: res.page,
                type
              })
            } else {
              message.error('获取世界500强企业列表失败：' + res.msg);
            }
          })
        } else if (type === 1) {
          params['companyName'] = values.companyName
          getDataByName(params).then(res => {
            if (res.code === 0) {
              resetFields(['years', 'inland']);
              this.setState({
                data: res.data,
                page: res.page,
                type
              })
            } else {
              message.error('获取世界500强企业列表失败：' + res.msg);
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
      title: '删除世界500强企业',
      content: `删除企业“${row.companyCname}”吗？`,
      onOk() {
        deleteData({ id: row.id }).then(res => {
          if (res.code === 0) {
            message.success('删除世界500强企业成功！');
            _self.getData(1, type)
          } else {
            message.error('删除世界500强企业失败：' + res.msg);
          }
        })
      },
      onCancel() { },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { years, data, page } = this.state;
    const columns = [
      {
        title: '年份',
        dataIndex: 'years',
        key: 'years',
        render: (text, row) => text + '年'
      }, {
        title: '排名',
        dataIndex: 'rank',
        key: 'rank',
      }, {
        title: '是否内地（不含港澳台）',
        dataIndex: 'inland',
        key: 'inland',
        render: (text, row) => text === 1 ? <Icon style={{ color: '#52C41A', fontSize: 17 }} type="check-circle" theme="filled" /> :
          <Icon style={{ color: '#F5222D', fontSize: 17 }} type="close-circle" theme="filled" />
      }, {
        title: '企业名称',
        dataIndex: 'companyCname',
        key: 'companyCname',
      }, {
        title: '更新时间',
        dataIndex: 'modifyTime',
        key: 'modifyTime',
      }, {
        title: '操作',
        key: 'action',
        render: (text, row, record) => <div>
          <span onClick={() => router.push(`/ods/baseTopCompany/edit?id=${row.id}`)} style={{ fontSize: 14, color: '#1890FF', cursor: 'pointer', marginRight: 12 }}>编辑</span>
          <span onClick={() => this.handleDelete(row)} style={{ fontSize: 14, color: '#1890FF', cursor: 'pointer', marginRight: 12 }}>删除</span>
        </div>
      },
    ];
    return (
      <div className={styles.container}>
        <Card
          bordered={false}
          title="数据仓库：世界500强企业名单"
          extra={<Button onClick={() => router.push('/ods/baseTopCompany/edit')} type="primary" icon="plus">添加新企业</Button>}
        >
          <Form layout="inline">
            <Row gutter={8}>
              <Col className={styles.colBox} xs={24} sm={24} md={24} lg={24} xl={13}>
                <FormItem label="年份">
                  {
                    getFieldDecorator('years')(
                      <Select allowClear={false} style={{ width: 150 }} placeholder="请选择">
                        {
                          years.length !== 0 && years.map(
                            (item, i) => <Option value={item}>{item}</Option>
                          )
                        }
                      </Select>
                    )
                  }
                </FormItem>
                <FormItem label="国内/国外">
                  {
                    getFieldDecorator('inland')(
                      <Select allowClear={false} style={{ width: 150 }} placeholder="请选择">
                        <Option value={0}>全部</Option>
                        <Option value={1}>仅内地（不含港澳台）</Option>
                        <Option value={2}>仅国外</Option>
                      </Select>
                    )
                  }
                </FormItem>
                <Button onClick={this.handleSearch.bind(this, 0)} type="primary">筛选</Button>
              </Col>
              <Col xs={0} sm={0} md={0} lg={0} xl={1}>
                <Divider type="vertical" style={{ height: 40 }} />
              </Col>
              <Col className={styles.colBox} xs={24} sm={24} md={24} lg={24} xl={10}>
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
