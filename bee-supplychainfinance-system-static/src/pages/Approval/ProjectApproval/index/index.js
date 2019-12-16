import React, { Component } from 'react';
import styles from './index.less';
import { Breadcrumb, Divider, Form, Button, Input, Select, DatePicker, Table, Badge } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

@Form.create()
@connect(({ global, projectApproval, loading, incoming }) => ({
  incoming,
  projectApproval,
  loading: loading.effects
}))
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      totalRecords: 0,
      params: {}
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectApproval/fetch',
      payload: {
        url: `currentPage=1&pageSize=10`,
        params: {},
      },
      success: (page) => {
        this.setState({
          ...page
        })
      }
    })
    dispatch({
      type: 'projectApproval/getCount'
    })
  }

  onChange = (current) => {
    const { dispatch } = this.props;
    const { pageSize, params } = this.state;
    dispatch({
      type: 'projectApproval/fetch',
      payload: {
        url: `currentPage=${current}&pageSize=${pageSize}`,
        params: params
      },
      success: (page) => {
        this.setState({
          ...page
        })
      }
    })
  }

  onShowSizeChange = (current, size) => {
    const { dispatch } = this.props;
    const { params } = this.state;
    dispatch({
      type: 'projectApproval/fetch',
      payload: {
        url: `currentPage=1&pageSize=${size}`,
        params: params
      },
      success: (page) => {
        this.setState({
          ...page
        })
      }
    })
  }

  handleSearch = () => {
    const { validateFields } = this.props.form;
    const { dispatch } = this.props;
    const { pageSize } = this.state;
    validateFields((err, values) => {
      if (!err) {
        let params = { ...values };
        delete params['rangePicker']
        if (values.applyCompanyName) {
          params['applyCompanyName'] = values.applyCompanyName
        }
        if (values.status) {
          params['status'] = values.status
        }
        if (values.rangePicker) {
          params['startTime'] = moment(values['rangePicker'][0]).format('YYYY-MM-DD'),
            params['endTime'] = moment(values['rangePicker'][1]).format('YYYY-MM-DD')
        }
        dispatch({
          type: 'projectApproval/fetch',
          payload: {
            url: `currentPage=1&pageSize=${pageSize}`,
            params: params
          },
          success: (page) => {
            this.setState({
              ...page,
              params
            })
          }
        })
      }
    })
  }

  handleReset = () => {
    const { resetFields } = this.props.form;
    const { dispatch } = this.props;
    const { pageSize } = this.state;
    dispatch({
      type: 'projectApproval/fetch',
      payload: {
        url: `currentPage=1&pageSize=${pageSize}`,
        params: {},
      },
      success: (page) => {
        resetFields();
        this.setState({
          ...page,
          params: {}
        })
      }
    })
  }

  toHandle(id, type) {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectApproval/pickBusinessMode',
      payload: type,
      callback: () => {
        router.push(`/approval/projectapproval/handle?id=${id}`)
      }
    })
  }

  render() {
    const { list, counts } = this.props.projectApproval;
    const { getFieldDecorator } = this.props.form;
    const { currentPage, pageSize, totalPage, totalRecords } = this.state;
    const columns = [{
      title: 'ID',
      dataIndex: 'entrustBuyId',
      key: 'entrustBuyId',
      width: '14%'
    }, {
      title: '委托企业',
      dataIndex: 'applyCompanyName',
      key: 'applyCompanyName',
      render(text, row) {
        if (row.belongNow === 1) {
          return (
            <div>
              <Badge status="error" offset={[4, -2]}>
                {text}
              </Badge>
            </div>
          )
        }
        return text
      },
      width: '20%'
    }, {
      title: '创建部门',
      dataIndex: 'teamName',
      key: 'teamName',
      width: '13%'
    }, {
      title: '申请类型',
      dataIndex: 'businessMode',
      key: 'businessMode',
      render: (text, row) => {
        if (text === 0) {
          return '委托采购'
        } else if (text === 1) {
          return '委托销售'
        } else if (text === 2) {
          return '金融仓储'
        } else if (text === 4) {
          return "大企业委托采购"
        }
      },
      sorter: (a, b) => a.businessMode - b.businessMode,
      width: '13%'
    }, {
      title: '状态',
      dataIndex: 'applyStatus',
      key: 'applyStatus',
      render: (text, row) => {
        // text = text + 1;
        if (text === 0) {
          return '新增'
        } else if (text === 1) {
          return '退回'
        } else if (text === 2) {
          return '初审中'
        } else if (text === 3) {
          return '风控审核中'
        } else if (text === 4) {
          return '终审中'
        } else if (text === 5) {
          return '决策复核中'
        } else if (text === 6) {
          return '完成'
        }
      },
      width: '13%'
    }, {
      title: '申请日期',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: (a, b) => moment(a.createTime) - moment(b.createTime),
      width: '14%'
    }, {
      title: '操作',
      key: 'action',
      render: (text, row, record) => <a onClick={() => this.toHandle(row.id, row.businessMode)}>进入</a>,
      width: '13%'
    }];

    return (
      <div className={styles.container}>
        <div className={styles.crumb}>
          <Breadcrumb>
            <Breadcrumb.Item>立项审批管理</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className={styles.header}>
          <div className={styles.div}>
            <span>待补充订单</span>
            <span>{counts.orderToComplete ? counts.orderToComplete : 0}</span>
          </div>
          <Divider type="vertical" style={{ height: '62px' }} />
          <div className={styles.div}>
            <span>审核中订单</span>
            <span>{counts.orderExamining ? counts.orderExamining : 0}</span>
          </div>
          <Divider type="vertical" style={{ height: '62px' }} />
          <div className={styles.div}>
            <span>本周完成审批数</span>
            <span>{counts.orderWeek ? counts.orderWeek : 0}</span>
          </div>
        </div>

        <div className={styles.body}>
          <span className={styles.title}>订单列表</span>
          <Form className={styles.form} layout='inline'>
            <FormItem label='委托企业'>
              {
                getFieldDecorator('applyCompanyName')(
                  <Input style={{ width: 280 }} placeholder="请输入" />
                )
              }
            </FormItem>
            <FormItem label='状态'>
              {
                getFieldDecorator('status')(
                  <Select style={{ width: 280 }} placeholder="请选择">
                    <Option value="2">初审中</Option>
                    <Option value="3">风控审核中</Option>
                    <Option value="4">终审中</Option>
                    <Option value="5">决策复核中</Option>
                    <Option value="6">完成</Option>
                  </Select>
                )
              }
            </FormItem>
            <FormItem label='选择日期'>
              {
                getFieldDecorator('rangePicker')(
                  <RangePicker style={{ width: 280 }} allowClear={false} />
                )
              }
            </FormItem>
            <FormItem label='业务单号'>
              {
                getFieldDecorator('businessId')(
                  <Input style={{ width: 280 }} placeholder="请输入" />
                )
              }
            </FormItem>
            <FormItem label='业务类型'>
              {
                getFieldDecorator('businessMode')(
                  <Select style={{ width: 280 }} placeholder="请选择">
                    <Option value={0}>委托采购</Option>
                    <Option value={1}>委托销售</Option>
                    <Option value={2}>金融仓储</Option>
                    <Option value={4}>大企业委托采购</Option>
                  </Select>
                )
              }
            </FormItem>
            <div>
              <Button type="primary" onClick={this.handleSearch.bind(this)}>查 询</Button>
              <Button style={{ marginLeft: 10 }} onClick={this.handleReset.bind(this)}>重 置</Button>
            </div>
          </Form>

          <Table
            columns={columns}
            dataSource={list}
            rowKey={(i, index) => index}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              defaultCurrent: 1,
              defaultPageSize: 10,
              current: currentPage,
              pageSize: pageSize,
              total: totalRecords,
              onChange: this.onChange.bind(this),
              pageSizeOptions: ["10", "20", "30"],
              showTotal: (total, range) => `共 ${totalRecords} 条记录 第 ${currentPage} / ${totalPage} 页`,
              onShowSizeChange: this.onShowSizeChange.bind(this)
            }}
          />
        </div>
      </div>
    )
  }
}
