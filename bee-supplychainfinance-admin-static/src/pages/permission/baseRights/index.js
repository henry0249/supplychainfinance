import React, { Component } from 'react'
import styles from './index.less'
import {
  Select,
  Form,
  Button,
  Input,
  Table,
  message,
  Icon,
  Modal,
  Row,
  Col,
  DatePicker,
  Popconfirm
} from 'antd'
import { request } from '@/common'
import moment from 'moment'
import router from 'umi/router'
import Link from 'umi/link'
import withRouter from 'umi/withRouter'
import { connect } from 'dva'
import apis from './services/apis'
import { listRoleSystemCode, deleteRole } from './services/index'

const FormItem = Form.Item
const { TextArea } = Input
const { confirm } = Modal
const { Option } = Select
const api = apis.getPerGroup.api()
const { RangePicker } = DatePicker

@withRouter
@Form.create()
@connect(({ global, loading }) => ({
  global
}))
export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      totalRecords: 0,
      params: {},
      levelTitle: '全部',
      levelNow: '0',
      statusTitle: '全部',
      statusNow: '3',
      visible: false,
      id: null,
      listRole: []
    }
  }

  componentDidMount() {
    this.getDefaultData({})
    listRoleSystemCode().then(res => {
      if (res && res.code === 0) {
        this.setState({
          listRole: res.data
        })
      }
    })
  }
  //获取默认数据
  getDefaultData = params => {
    request(api, {
      method: 'POST',
      body: params
    }).then(res => {
      if (res && res.code === 0) {
        this.setState({
          data: res.data,
          ...res.page,
          pageSize: this.state.pageSize
        })
      } else if (res) {
        message.error(res.message)
      } else {
        message.error('获取列表失败，请刷新重试')
      }
    })
  }
  onChange = current => {
    const { pageSize, params } = this.state
    request(api + `?page=${current}&size=${pageSize}`, {
      method: 'POST',
      body: params
    }).then(res => {
      if (res && res.code === 0) {
        this.setState({
          data: res.data,
          ...res.page
        })
      } else if (res) {
        message.error(res.message)
      } else {
        message.error('获取列表失败，请刷新重试')
      }
    })
  }
  handleSearch = () => {
    const { validateFields } = this.props.form
    const { pageSize } = this.state
    validateFields((err, value) => {
      for (let key in value) {
        if (value[key] !== 0 && !value[key]) {
          delete value[key]
        }
      }
      // if (value.uptime) {
      //   const b = value.uptime.map(item => {
      //     const a = moment(item).format('YYYY-MM-DD')
      //     return a
      //   })
      //   if (b) {
      //     value.updateStartTime = b[0]
      //     value.updateEndTime = b[1]
      //   }
      //   delete value.uptime
      // }
      if (value.crtime) {
        const b = value.crtime.map(item => {
          const a = moment(item).format('YYYY-MM-DD')
          return a
        })
        if (b) {
          value.createStartTime = b[0]
          value.createEndTime = b[1]
        }
        delete value.crtime
      }
      this.getDefaultData(value)
    })
  }
  handleJump = (type, id) => {
    sessionStorage.setItem('businessMode', type)
    router.push(
      `/home/workOrder/detail?enterType=0&type=bail&key=bill&id=${id}`
    )
  }

  handleReset = () => {
    this.props.form.resetFields()
    this.getDefaultData()
  }

  handleDelete = id => {
    deleteRole(id).then(res => {
      if (res && res.code === 0) {
        message.success(res.message)
        this.getDefaultData({})
      } else {
        message.error(res.message)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const {
      data,
      currentPage,
      pageSize,
      totalPage,
      totalRecords,
      listRole
    } = this.state
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName'
      },
      {
        title: '关联账号数量',
        dataIndex: 'appName',
        key: 'appName'
      },
      {
        title: '角色权限',
        dataIndex: 'role',
        key: 'role'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: (a, b) => moment(a.createTime) - moment(b.createTime)
      },
      {
        title: '操作',
        key: 'action',
        render: (text, row, record) =>
          1 === 1 ? (
            <span>
              <Link to={`/permission/roles/edit?id=${row.id}`}>编辑</Link>
              <Popconfirm
                title={
                  <div>
                    <p>删除角色</p>
                    <p>{`确认删除资角色“${row.roleName}”吗`}</p>
                  </div>
                }
                onConfirm={this.handleDelete.bind(this, row.id)}
                okText="确定"
                cancelText="取消"
              >
                <a style={{ marginLeft: 10, color: '#FF0000' }}>删除</a>
              </Popconfirm>
            </span>
          ) : (
            <span>无</span>
          )
      }
    ]

    return (
      <div className={styles.container}>
        <h3 style={{ fontWeight: 700 }}>基础权限配置</h3>
        <div className={styles.body}>
          <Form layout="inline">
            <Row gutter={48}>
              <Col span={7}>
                <FormItem>
                  {getFieldDecorator('roleName', {})(
                    <Input placeholder="按角色名称搜索" />
                  )}
                </FormItem>
              </Col>

              <Col span={9}>
                <FormItem
                  label="创建时间"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  {getFieldDecorator('time', { rules: [{ type: 'array' }] })(
                    <RangePicker />
                  )}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem label="">
                  <div>
                    <Button
                      type="primary"
                      style={{ marginLeft: 20, marginTop: 4 }}
                      onClick={this.handleSearch}
                    >
                      查询
                    </Button>
                    <Button
                      style={{ marginLeft: 20, marginTop: 4 }}
                      onClick={this.handleReset}
                    >
                      重置
                    </Button>
                  </div>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={48} style={{ marginTop: 30 }}>
              <Col span={2} style={{ height: 40 }}>
                <div>
                  {
                    <Button type="primary" onClick={this.handleSearch}>
                      导入基础权限
                    </Button>
                  }
                </div>
              </Col>
              <Col span={2} style={{ height: 40 }}>
                <div>
                  {
                    <Button type="primary" onClick={this.handleSearch}>
                      添加基础权限
                    </Button>
                  }
                </div>
              </Col>
            </Row>
          </Form>
          <Table
            className="workTable"
            style={{ marginTop: '20px' }}
            columns={columns}
            dataSource={data}
            rowKey={(i, index) => index}
            pagination={{
              showQuickJumper: true,
              defaultCurrent: 1,
              defaultPageSize: 10,
              current: currentPage,
              pageSize: pageSize,
              total: totalRecords,
              onChange: this.onChange.bind(this),
              pageSizeOptions: ['10', '20', '30'],
              showTotal: (total, range) =>
                `共 ${totalRecords} 条记录 第 ${currentPage} / ${totalPage} 页`
            }}
          />
        </div>
      </div>
    )
  }
}
