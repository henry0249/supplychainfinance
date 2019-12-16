import React, { Component } from 'react'
import styles from './index.less'
import {
  Breadcrumb,
  Popconfirm,
  Form,
  DatePicker,
  Button,
  Table,
  Radio,
  message,
  Select,
  Input,
  Row,
  Col,
  Icon,
  Tooltip
} from 'antd'
import Link from 'umi/link'
import { getUserList, editAccountStatus } from './services'
import moment from 'moment'
import router from 'umi/router'
import { connect } from 'dva'

@Form.create()
@connect(({ global, loading }) => ({
  global
}))
export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      count: '0',
      data: [],
      current: 1,
      pageSize: 10,
      totalPage: 1,
      total: 0,
      params: {},
      selectedRowKeys: [],
      type: '10',
      data: [],
      key: 'article',
      visible: false,
      button: false
    }
  }

  onTabChange = (key, type) => {
    this.setState({ [type]: key })
  }

  componentDidMount() {
    this.getUserList()
  }

  componentWillMount() {}

  //获得公告列表
  getUserList(currentPage = this.state.current, pageSize = 10) {
    getUserList({ currentPage, pageSize }).then(res => {
      if (res && res.code === 0 && res.data) {
        this.setState({
          data: res.data,
          current: currentPage,
          pageSize: pageSize,
          totalPage: res.page.totalPage,
          total: res.page.totalRecords
        })
      }
    })
  }

  //翻页
  onChange = current => {
    this.getUserList(current)
  }

  onShowSizeChange = (page, size) => {
    // this.getArticles(this.state.type, 1, size)
    const { params } = this.state
  }

  tableChange = pagination => {
    this.getUserList(pagination.currentPage, pagination.pageSize)
  }

  handleDelete = (id, status) => {
    editAccountStatus(id).then(res => {
      if (res && res.code === 0) {
        this.getUserList()
        message.success(res.message)
      } else {
        message.error(res.message)
      }
    })
  }

  //添加账户处理
  addNewUser = () => {
    router.push('/crm/edit')
  }

  article() {
    const {
      count,
      data,
      current,
      pageSize,
      totalPage,
      total,
      type
    } = this.state
    const { getFieldDecorator } = this.props.form
    const buttons = this.props.global.button || {}
    const roleId =
      (this.props.global &&
        this.props.global.user &&
        this.props.global.user.roleId) ||
      3
    const columns = [
      {
        title: '账户名',
        dataIndex: 'nickname',
        key: 'nickname'
      },
      {
        title: '注册手机号/邮箱',
        dataIndex: 'phoneEmail',
        key: 'phoneEmail'
      },
      {
        title: '账户权限组',
        dataIndex: 'roleName',
        key: 'roleName',
        width: '22%',
        render(text, row, index) {
          return text
        }
      },
      {
        title: '注册时间',
        dataIndex: 'createAt',
        key: 'createAt',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '账户状态',
        dataIndex: 'status',
        key: 'status',
        render: text => {
          if (text === 0) {
            return <span style={{ color: '#ff3300' }}>已禁用</span>
          } else {
            return <span style={{ color: '#66cc00' }}>启用中</span>
          }
        }
      },
      {
        title: '操作',
        key: 'action',
        width: '10%',
        render: (text, row, record) =>
          buttons['/crm'] === 1 ? (
            <span>
              {
                <span>
                  <Link to={`/crm/edit?managerId=${row.managerId}`}>编辑</Link>
                  {
                    <Popconfirm
                      title={
                        <div>
                          <p>{row.status === 0 ? '解禁' : '禁用'}账户</p>
                          <p>{`确认${row.status === 0 ? '解禁' : '禁用'}账户“${
                            row.nickname
                          }”吗`}</p>
                        </div>
                      }
                      onConfirm={this.handleDelete.bind(
                        this,
                        row.managerId,
                        row.status
                      )}
                      okText="确定"
                      className={styles.confirm}
                      cancelText="取消"
                      icon={<Icon type="info-circle" theme="filled" />}
                    >
                      <a style={{ marginLeft: 10, color: '#FF0000' }}>
                        {row.status === 0 ? '解禁' : '禁用'}
                      </a>
                    </Popconfirm>
                  }
                </span>
              }
            </span>
          ) : (
            <span>无</span>
          )
      }
    ]
    return (
      <div className={styles.body}>
        <Table
          // rowKey={(i, index) => i.id}
          style={{ marginTop: '30px', textAlign: 'center' }}
          // rowSelection={rowSelection}
          onChange={this.tableChange}
          columns={columns}
          dataSource={data}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            defaultCurrent: 1,
            defaultPageSize: 10,
            current: current,
            pageSize: pageSize,
            total: total,
            // onChange: this.onChange.bind(this),
            pageSizeOptions: ['10', '20', '30'],
            showTotal: (total, range) =>
              `共 ${total} 条记录 第 ${current} / ${totalPage} 页`
            // onShowSizeChange: this.onShowSizeChange.bind(this)
          }}
        />
      </div>
    )
  }

  render() {
    // const { button } = this.state
    const buttons = this.props.global.button || {}
    return (
      <div className={styles.container}>
        <div className={styles.crumb}>
          <Row gutter={24}>
            <Col span={22}>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <h3 style={{ fontWeight: 800 }}>账号管理</h3>
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
            <Col span={2}>
              {buttons['/crm'] === 1 && (
                <Button type="primary" onClick={this.addNewUser}>
                  添加新账户
                </Button>
              )}
            </Col>
          </Row>
        </div>
        <div>{this.article()}</div>
      </div>
    )
  }
}
