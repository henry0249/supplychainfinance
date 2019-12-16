import React, { Component } from 'react';
import styles from './index.less';
import { Breadcrumb, Form, Button, Input, Select, DatePicker, Table, message } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import moment from 'moment';
import request from '@/utils/request';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

@Form.create()
@connect(({ projectApproval }) => ({
  projectApproval,
}))
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      totalRecords: 0,
      params: {}
    }
  }

  componentDidMount() {
    const { params } = this.state
    //获取预警列表
    request(`/supplychainfinance-audit/earlyWariningRecord/getWariningRecords?currentPage=1&pageSize=10`, {
      method: 'POST',
      body: params
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          data: res.data,
          ...res.page
        })
      } else if (res && res.code === -1) {
        // message.error('获取预警列表失败：' + res.msg)
        this.setState({
          data: [],
          currentPage: 1,
          pageSize: 10,
          totalPage: 0,
          totalRecords: 0,
        })
      } else {
        message.error("获取列表失败，请刷新重试")
      }
    })
  }

  onChange = (current) => {
    const { pageSize, params } = this.state;
    request(`/supplychainfinance-audit/earlyWariningRecord/getWariningRecords?currentPage=${current}&pageSize=${pageSize}`, {
      method: 'POST',
      body: params
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          data: res.data,
          ...res.page
        })
      } else if (res && res.code === -1) {
        // message.error('获取预警列表失败：' + res.msg)
        this.setState({
          data: [],
          currentPage: 1,
          pageSize: 10,
          totalPage: 0,
          totalRecords: 0,
        })
      } else {
        message.error("获取列表失败，请刷新重试")
      }
    })
  }

  onShowSizeChange = (current, size) => {
    const { params } = this.state;
    request(`/supplychainfinance-audit/earlyWariningRecord/getWariningRecords?currentPage=${current}&pageSize=${size}`, {
      method: 'POST',
      body: params
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          data: res.data,
          ...res.page
        })
      } else if (res && res.code === -1) {
        message.error('获取预警列表失败：' + res.msg)
        this.setState({
          data: [],
          currentPage: 1,
          pageSize: 10,
          totalPage: 0,
          totalRecords: 0,
        })
      } else {
        message.error("获取列表失败，请刷新重试")
      }
    })
  }

  handleSearch = () => {
    const { validateFields } = this.props.form;
    validateFields((err, values) => {
      if (!err) {
        let params = {};
        if (values.orderId) {
          params['orderId'] = values.orderId
        }
        if (values.warningStatus) {
          params['warningStatus'] = values.warningStatus
        }
        if (values.warningType) {
          params['warningType'] = values.warningType
        }
        if (values.businessMode) {
          params['businessMode'] = values.businessMode
        }
        if (values.rangePicker) {
          params['operateStartTime'] = moment(values['rangePicker'][0]).format('YYYY-MM-DD'),
            params['operateEndTime'] = moment(values['rangePicker'][1]).format('YYYY-MM-DD')
        }
        request(`/supplychainfinance-audit/earlyWariningRecord/getWariningRecords?currentPage=${1}&pageSize=${10}`, {
          method: 'POST',
          body: params
        }).then((res) => {
          if (res && res.code === 0) {
            this.setState({
              data: res.data,
              ...res.page,
              params,
            })
          } else if (res && res.code === -1) {
            // message.error('获取预警列表失败：' + res.msg)
            this.setState({
              data: [],
              currentPage: 1,
              pageSize: 10,
              totalPage: 0,
              totalRecords: 0,
            })
          } else {
            message.error("获取列表失败，请刷新重试");
          }
        })
      }
    })
  }

  handleReset = () => {
    const { resetFields } = this.props.form;
    request(`/supplychainfinance-audit/earlyWariningRecord/getWariningRecords?currentPage=${1}&pageSize=${10}`, {
      method: 'POST',
      body: {}
    }).then((res) => {
      resetFields();
      if (res && res.code === 0) {
        this.setState({
          data: res.data,
          ...res.page,
          params: {}
        })
      } else if (res && res.code === -1) {
        // message.error('获取预警列表失败：' + res.msg)
        this.setState({
          data: [],
          currentPage: 1,
          pageSize: 10,
          totalPage: 0,
          totalRecords: 0,
        })
      } else {
        message.error("获取列表失败，请刷新重试");
      }
    })
  }

  toDetail = (row) => {
    sessionStorage.setItem('orderStatus', row.orderStatus)
    sessionStorage.setItem('businessMode', row.businessMode)
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { currentPage, pageSize, totalPage, totalRecords, data, params } = this.state;
    const columns = [{
      title: '信息类型',
      dataIndex: 'warningType',
      key: 'warningType',
      render: (text, row) => {
        if (text === 0) {
          return '提示信息'
        } else if (text === 1) {
          return '预警信息'
        } else if (text === 2) {
          return '预警信息（人工）'
        }
      },
      width: '17%'
    }, {
      title: '业务类型',
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
      width: '17%'
    }, {
      title: '供应链订单编号',
      dataIndex: 'orderId',
      key: 'orderId',
      sorter: (a, b) => a.businessMode - b.businessMode,
      width: '17%'
    }, {
      title: '生成日期',
      dataIndex: 'operateTime',
      key: 'operateTime',
      sorter: (a, b) => moment(a.createTime) - moment(b.createTime),
      width: '17%'
    }, {
      title: '状态',
      dataIndex: 'warningStatus',
      key: 'warningStatus',
      render: (text, row) => {
        if (text === 0) {
          return '待处理'
        } else if (text === 1) {
          return '已处理'
        } else if (text === 2) {
          return '申请中'
        } else if (text === 3) {
          return '已冻结'
        } else if (text === 4) {
          return '已解除'
        }
      },
      width: '16%'
    }, {
      title: '操作',
      key: 'action',
      render: (text, row, record) => <Link onClick={this.toDetail.bind(this, row)} to={`/approval/warning/details?id=${row.id}&orderId=${row.orderId}&warningType=${row.warningType}&warningStatus=${row.warningStatus}`}>查看详情</Link>,
      width: '16%'
    }];

    return (
      <div className={styles.container}>
        <div className={styles.crumb}>
          <Breadcrumb>
            <Breadcrumb.Item>预警审批管理</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={styles.body}>
          <span className={styles.title}>信息处理</span>
          <Form className={styles.form} layout='inline'>
            <FormItem label='订单编号'>
              {
                getFieldDecorator('orderId')(
                  <Input style={{ width: 300 }} placeholder="请输入" />
                )
              }
            </FormItem>
            <FormItem label='状态'>
              {
                getFieldDecorator('warningStatus')(
                  <Select style={{ width: 300 }} placeholder="请选择">
                    <Option value="0">待处理</Option>
                    <Option value="1">已处理</Option>
                    <Option value="2">申请中</Option>
                    <Option value="3">已冻结</Option>
                    <Option value="4">已解除</Option>
                  </Select>
                )
              }
            </FormItem>
            <FormItem label='信息类型'>
              {
                getFieldDecorator('warningType')(
                  <Select style={{ width: 300 }} placeholder="请选择">
                    <Option value="0">提示信息</Option>
                    <Option value="1">预警信息</Option>
                    <Option value="2">预警信息(人工)</Option>
                  </Select>
                )
              }
            </FormItem>
            <FormItem label='业务类型'>
              {
                getFieldDecorator('businessMode')(
                  <Select style={{ width: 300 }} placeholder="请选择">
                    <Option value="0">委托采购</Option>
                    <Option value="1">委托销售</Option>
                    <Option value="2">金融仓储</Option>
                    <Option value="4">大型企业委托采购</Option>
                  </Select>
                )
              }
            </FormItem>
            <FormItem label='选择日期'>
              {
                getFieldDecorator('rangePicker')(
                  <RangePicker style={{ width: 300 }} allowClear={false} />
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
            dataSource={data}
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
