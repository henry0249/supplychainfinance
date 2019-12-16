import React, { Component } from 'react';
import styles from './index.less';
import { Breadcrumb, Form, Button, Input, DatePicker, Table, message } from 'antd';
import { baseUrls, request } from '@/utils';
import moment from 'moment';
import router from 'umi/router';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const api = `${baseUrls.domain}/supplychainfinance-audit/PickUpApplyExamine/applies`;

@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      totalRecords: 0,
      params: {
        roleId: 10
      }
    }
  }

  componentDidMount() {
    request(api + `?currentPage=1&pageSize=10`, {
      method: 'POST',
      body: { roleId: 10 }
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          data: res.data,
          ...res.page
        })
      } else if (res) {
        message.error(res.msg)
      } else {
        message.error("获取列表失败，请刷新重试");
      }
    })
  }

  onChange = (current) => {
    const { pageSize, params } = this.state;
    request(api + `?currentPage=${current}&pageSize=${pageSize}`, {
      method: 'POST',
      body: params
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          data: res.data,
          ...res.page
        })
      } else if (res) {
        message.error(res.msg)
      } else {
        message.error("获取列表失败，请刷新重试");
      }
    })
  }

  onShowSizeChange = (current, size) => {
    const { params } = this.state;
    request(api + `?currentPage=1&pageSize=${size}`, {
      method: 'POST',
      body: params
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          data: res.data,
          ...res.page
        })
      } else if (res) {
        message.error(res.msg)
      } else {
        message.error("获取列表失败，请刷新重试");
      }
    })
  }

  handleSearch = () => {
    const { validateFields } = this.props.form;
    const { pageSize, params } = this.state;
    validateFields((err, values) => {
      if (!err) {
        // let params = {};
        if (values.entrustCompanyName) {
          params['entrustCompanyName'] = values.entrustCompanyName
        }
        if (values.rangePicker) {
          params['startTime'] = moment(values['rangePicker'][0]).format('YYYY-MM-DD'),
            params['endTime'] = moment(values['rangePicker'][1]).format('YYYY-MM-DD')
        }
        request(api + `?currentPage=1&pageSize=${pageSize}`, {
          method: 'POST',
          body: params
        }).then((res) => {
          if (res && res.code === 0) {
            this.setState({
              data: res.data,
              ...res.page
            })
          } else if (res) {
            message.error(res.msg)
          } else {
            message.error("获取列表失败，请刷新重试");
          }
        })
      }
    })
  }

  handleReset = () => {
    const { resetFields } = this.props.form;
    const { pageSize } = this.state;
    request(api + `?currentPage=1&pageSize=${pageSize}`, {
      method: 'POST',
      body: {}
    }).then((res) => {
      resetFields();
      if (res && res.code === 0) {
        this.setState({
          data: res.data,
          ...res.page,
          params: { roleId: 10 }
        })
      } else if (res) {
        message.error(res.msg)
      } else {
        message.error("获取列表失败，请刷新重试");
      }
    })
  }

  handleJump = (type, id) => {
    sessionStorage.setItem("businessMode", type);
    router.push(`/approval/goods/details?enterType=0&type=goods&key=bill&id=${id}`)
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { data, currentPage, pageSize, totalPage, totalRecords } = this.state;
    const columns = [{
      title: 'ID',
      dataIndex: 'orderBusinessId',
      key: 'orderBusinessId',
      width: '20%'
    }, {
      title: '委托企业',
      dataIndex: 'entrustCompany',
      key: 'entrustCompany',
      width: '20%'
    }, {
      title: '业务类型',
      dataIndex: 'type',
      key: 'type',
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
      sorter: (a, b) => a.type - b.type,
      width: '20%'
    }, {
      title: '申请日期',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: (a, b) => moment(a.createTime) - moment(b.createTime),
      width: '20%'
    }, {
      title: '操作',
      key: 'action',
      render: (text, row, record) =>
        <span onClick={this.handleJump.bind(this, row.type, row.orderBusinessId)} style={{ color: '#40a9ff', cursor: 'pointer' }}>进入</span>,
      width: '20%'
    }];

    return (
      <div className={styles.container}>
        <div className={styles.crumb}>
          <Breadcrumb>
            <Breadcrumb.Item>提货申请管理</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className={styles.body}>
          <span className={styles.title}>订单列表</span>
          <Form className={styles.form} layout='inline'>
            <FormItem label='委托企业'>
              {
                getFieldDecorator('entrustCompanyName')(
                  <Input style={{ width: 280 }} placeholder="请输入" />
                )
              }
            </FormItem>
            <FormItem label='选择日期'>
              {
                getFieldDecorator('rangePicker')(
                  <RangePicker style={{ width: 280 }} format='YYYY-MM-DD' allowClear={false} />
                )
              }
            </FormItem>
            <div className={styles.btnBox}>
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
