import React, { Component } from 'react'
import { Card, Table,message } from 'antd'
import { connect } from 'dva'
@connect(({ warning }) => ({
  warning,
}))
export default class Index extends Component {

  constructor(props) {
    super()
    this.state = {
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      totalRecords: 0,
      params: {},
      page: null
    }
  }

  componentDidMount() {
    const { dispatch, id } = this.props;
    const { params } = this.state;
    this.setState({
      page: this.props.page
    })
    //获取操作日志
    dispatch({
      type: 'warning/getLogs',
      payload: {
        url: `currentPage=1&orderId=${id}&pageSize=${10}`,
        params: params
      },
      success: (resp) => {
        if (resp.code === 0) {
          this.setState({
            ...resp.page
          })
        }  else if (resp && resp.code === -1) {
          this.setState({
            currentPage: 1,
            pageSize: 10,
            totalPage: 0,
            totalRecords: 0,
          })
        }else if (resp) {
          message.error(resp.msg)
          this.setState({
            currentPage: 1,
            pageSize: 10,
            totalPage: 0,
            totalRecords: 0,
          })
        } else {
          message.error('获取操作日志失败')
          this.setState({
            currentPage: 1,
            pageSize: 10,
            totalPage: 0,
            totalRecords: 0,
          })
        }

      }
    })
  }


  onChange = (current) => {
    const { dispatch, id } = this.props;
    const { pageSize, params } = this.state;
    dispatch({
      type: 'warning/getLogs',
      payload: {
        url: `currentPage=${current}&orderId=${id}&pageSize=${pageSize}`,
        params: params
      },
      success: (resp) => {
        if (resp.code === 0) {
          this.setState({
            ...resp.page
          })
        } else if (resp) {
          message.error(resp.msg)
          this.setState({
            currentPage: 1,
            pageSize: 10,
            totalPage: 0,
            totalRecords: 0,
          })
        } else {
          message.error('获取操作日志失败')
          this.setState({
            currentPage: 1,
            pageSize: 10,
            totalPage: 0,
            totalRecords: 0,
          })
        }

      }
    })
  }

  onShowSizeChange = (current, size) => {
    const { dispatch, id } = this.props;
    const { params } = this.state;
    dispatch({
      type: 'warning/getLogs',
      payload: {
        url: `currentPage=1&orderId=${id}&pageSize=${size}`,
        params: params
      },
      success: (resp) => {
        if (resp.code === 0) {
          this.setState({
            ...resp.page
          })
        } else if (resp) {
          message.error(resp.msg)
          this.setState({
            currentPage: 1,
            pageSize: 10,
            totalPage: 0,
            totalRecords: 0,
          })
        } else {
          message.error('获取操作日志失败')
          this.setState({
            currentPage: 1,
            pageSize: 10,
            totalPage: 0,
            totalRecords: 0,
          })
        }

      }
    })
  }

  render() {
    const { currentPage, pageSize, totalPage, totalRecords, params } = this.state
    const { logs } = this.props.warning
    const { page } = this.props
    const columns = [{
      title: '操作类型',
      dataIndex: 'operateTypeName',
      key: 'operateTypeName',
    }, {
      title: '操作员',
      dataIndex: 'operateName',
      key: 'operateName',
    }, {
      title: '操作时间',
      dataIndex: 'operateTime',
      key: 'operateTime',
    }, {
      title: '操作说明',
      dataIndex: 'operateReason',
      key: 'operateReason',
    }, {
      title: '查看附件',
      dataIndex: 'annexUrl',
      key: 'annexUrl',
      render: (text, row, record) => <a href={row.annexUrl ? row.annexUrl : 'javascript:;'}>附件信息</a>,
    }]
    return (
      <Card
        title={<div style={{ color: "#1890FF" }}>操作日志</div>}
        // style={{padding:24}}
      >
        <Table columns={columns} dataSource={logs} rowKey='id'
          pagination={page ? {
            showQuickJumper: true,
            showSizeChanger: true,
            defaultCurrent: 1,
            defaultPageSize: 10,
            currentPage: page.currentPage,
            pageSize: page.pageSize,
            total: page.totalRecords,
            onChange: this.onChange.bind(this),
            pageSizeOptions: ["10", "20", "30"],
            showTotal: (total, range) => `共 ${page.totalRecords} 条记录 第 ${page.currentPage} / ${page.totalPage} 页`,
            onShowSizeChange: this.onShowSizeChange.bind(this)
          } : {
              showQuickJumper: true,
              showSizeChanger: true,
              defaultCurrent: 1,
              defaultPageSize: 10,
              currentPage: currentPage,
              pageSize: pageSize,
              total: totalRecords,
              onChange: this.onChange.bind(this),
              pageSizeOptions: ["10", "20", "30"],
              showTotal: (total, range) => `共 ${totalRecords} 条记录 第 ${currentPage} / ${totalPage} 页`,
              onShowSizeChange: this.onShowSizeChange.bind(this)
            }}
        />
      </Card>
    )
  }
}
