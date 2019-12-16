import React, { Component } from 'react'
import styles from './style.less'
import {
  Breadcrumb,
  Divider,
  Form,
  Button,
  Modal,
  Input,
  Select,
  DatePicker,
  Table,
  message,
  Row,
  Col
} from 'antd'
import { connect } from 'dva'
import moment from 'moment'
import router from 'umi/router'

const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker

@Form.create()
@connect(({ global, incoming, loading }) => ({
  incoming,
  loading: loading.effects
}))
export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      totalRecords: 0,
      params: {}
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'incoming/fetch',
      payload: {
        url: `currentPage=1&pageSize=10`,
        params: {}
      },
      success: page => {
        this.setState({
          ...page
        })
      }
    })
    dispatch({
      type: 'incoming/getCount'
    })
  }

  onChange = current => {
    const { dispatch } = this.props
    const { pageSize, params } = this.state
    dispatch({
      type: 'incoming/fetch',
      payload: {
        url: `currentPage=${current}&pageSize=${pageSize}`,
        params: params
      },
      success: page => {
        this.setState({
          ...page
        })
      }
    })
  }

  onShowSizeChange = (current, size) => {
    const { dispatch } = this.props
    const { params } = this.state
    dispatch({
      type: 'incoming/fetch',
      payload: {
        url: `currentPage=1&pageSize=${size}`,
        params: params
      },
      success: page => {
        this.setState({
          ...page
        })
      }
    })
  }

  handleSearch = () => {
    const { validateFields } = this.props.form
    const { dispatch } = this.props
    const { pageSize } = this.state
    validateFields((err, values) => {
      if (!err) {
        let params = { ...values }
        delete params['rangePicker']
        if (values.applyCompanyName) {
          params['applyCompanyName'] = values.applyCompanyName
        }
        if (values.status) {
          params['status'] = values.status
        }
        if (values.rangePicker) {
          ; (params['startTime'] = moment(values['rangePicker'][0]).format(
            'YYYY-MM-DD'
          )),
            (params['endTime'] = moment(values['rangePicker'][1]).format(
              'YYYY-MM-DD'
            ))
        }
        dispatch({
          type: 'incoming/fetch',
          payload: {
            url: `currentPage=1&pageSize=${pageSize}`,
            params: params
          },
          success: page => {
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
    const { resetFields } = this.props.form
    const { dispatch } = this.props
    const { pageSize } = this.state
    dispatch({
      type: 'incoming/fetch',
      payload: {
        url: `currentPage=1&pageSize=${pageSize}`,
        params: {}
      },
      success: page => {
        resetFields()
        this.setState({
          ...page,
          params: {}
        })
      }
    })
  }

  handleDelete = (id, mode, e) => {
    const { dispatch } = this.props
    const { pageSize, params } = this.state
    const self = this
    Modal.confirm({
      title: '你还要继续吗？',
      content: '删除后该申请内容将无法恢复！',
      okText: '继续',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'incoming/delete',
          payload: { id, mode },
          success: () => {
            dispatch({
              type: 'incoming/fetch',
              payload: {
                url: `currentPage=1&pageSize=${pageSize}`,
                params: params
              },
              success: page => {
                self.setState({
                  ...page
                })
              }
            })
          }
        })
      },
      onCancel: () => { }
    })
  }

  //todo 移除type p,s,w做标示
  toHandle(id, mode, type, entrustBuyId) {
    //进入 暂时保留type（p s w），
    const { dispatch } = this.props
    dispatch({
      type: 'incoming/pickIcomingMode',
      payload: mode,
      callback: () => {
        router.push(
          `/incoming/purchase/step1?applyId=${id}&type=${type}&entrustBuyId=${entrustBuyId}`
        )
      }
    })
  }

  render() {
    const { list, counts } = this.props.incoming
    const { getFieldDecorator } = this.props.form
    const { currentPage, pageSize, totalPage, totalRecords } = this.state
    const columns = [
      {
        title: 'ID',
        dataIndex: 'entrustBuyId',
        key: 'entrustBuyId'
      },
      {
        title: '委托企业',
        dataIndex: 'applyCompanyName',
        key: 'applyCompanyName'
      },
      {
        title: '核心企业',
        dataIndex: 'upDownstreamName',
        key: 'upDownstreamName'
      },
      {
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
            return '大企业委托采购'
          }
        },
        sorter: (a, b) => a.businessMode - b.businessMode
      },
      {
        title: '状态',
        dataIndex: 'applyStatus',
        key: 'applyStatus',
        render: (text, row) => {
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
          }
        }
      },
      {
        title: '申请日期',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: (a, b) => moment(a.createTime) - moment(b.createTime)
      },
      {
        title: '修改时间',
        dataIndex: 'modifyTime',
        key: 'modifyTime',
        sorter: (a, b) => moment(a.modifyTime) - moment(b.modifyTime)
      },
      {
        title: '操作',
        key: 'action',
        render: (text, row, record) => {
          let type = ''
          if (row.businessMode === 0) {
            type = 'p'
          } else if (row.businessMode === 1) {
            type = 's'
          } else if (row.businessMode === 2) {
            type = 'w'
          } else if (row.businessMode === 4) {
            type = 'L'
          }
          return (
            <div>
              <a onClick={this.toHandle.bind(this, row.id, row.businessMode, type, row.entrustBuyId)} > 进入 </a>
              <span
                style={{ color: '#1890ff', marginLeft: 20, cursor: 'pointer' }}
                onClick={this.handleDelete.bind(this, row.id, row.businessMode)}
              >
                删除
              </span>
            </div>
          )
        }
      }
    ]

    return (
      <div className={styles.container}>
        <div className={styles.crumb}>
          <Breadcrumb>
            <Breadcrumb.Item>进件管理</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className={styles.header}>
          <div className={styles.div}>
            <span>新增的申请</span>
            <span>{counts.applyNew ? counts.applyNew : 0}</span>
          </div>
          <Divider type="vertical" style={{ height: '62px' }} />
          <div className={styles.div}>
            <span>退回的项目</span>
            <span>{counts.applyRefused ? counts.applyRefused : 0}</span>
          </div>
          <Divider type="vertical" style={{ height: '62px' }} />
          <div className={styles.div}>
            <span>本周完成</span>
            <span>{counts.applyWeek ? counts.applyWeek : 0}</span>
          </div>
        </div>

        <div className={styles.body}>
          <span className={styles.title}>申请列表</span>
          <Form className={styles.form} layout="inline">
            <FormItem label="委托企业">
              {getFieldDecorator('applyCompanyName')(
                <Input style={{ width: 280 }} placeholder="请输入" />
              )}
            </FormItem>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select style={{ width: 280 }} placeholder="请选择">
                  <Option value="0">新增</Option>
                  <Option value="1">退回</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="选择日期">
              {getFieldDecorator('rangePicker')(
                <RangePicker style={{ width: 280 }} allowClear={false} />
              )}
            </FormItem>
            <FormItem label="业务单号">
              {getFieldDecorator('businessId')(
                <Input style={{ width: 280 }} placeholder="请输入" />
              )}
            </FormItem>
            <FormItem label="业务类型">
              {getFieldDecorator('businessMode')(
                <Select style={{ width: 280 }} placeholder="请选择">
                  <Option value={0}>委托采购</Option>
                  <Option value={1}>委托销售</Option>
                  <Option value={2}>金融仓储</Option>
                  <Option value={4}>大企业委托采购</Option>
                </Select>
              )}
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
              pageSizeOptions: ['10', '20', '30'],
              showTotal: (total, range) =>
                `共 ${totalRecords} 条记录 第 ${currentPage} / ${totalPage} 页`,
              onShowSizeChange: this.onShowSizeChange.bind(this)
            }}
          />
        </div>
      </div>
    )
  }
}
