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
import { getPerGroup, deleteRole } from './services'
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
    this.getPerGroup()
  }

  getPerGroup = () => {
    getPerGroup().then(res => {
      if (res && res.code === 0) {
        this.setState({
          data: res.data
        })
      }
    })
  }

  handleDelete = id => {
    deleteRole(id).then(res => {
      if (res && res.code === 0) {
        message.success(res.message)
      } else {
        message.error(res.message)
      }

      this.getPerGroup()
    })
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
        title: '用户组名称',
        dataIndex: 'roleName',
        key: 'roleName',
        render: (text, row) => text
      },
      {
        title: '账户数量',
        dataIndex: 'accountNum',
        key: 'accountNum',
        render: text => text
      },
      {
        title: '操作',
        key: 'action',
        width: '10%',
        render: (text, row, record) =>
          buttons['/permission'] === 1 ? (
            <span>
              {
                <span>
                  <Link
                    to={`/permission/edit?id=${row.roleId}&name=${
                      row.roleName
                    }&er=${row.modifier}&time=${row.modifyTime}`}
                  >
                    编辑
                  </Link>
                  {row.accountNum === 0 ? (
                    <Popconfirm
                      title={`确认删除该权限组"${row.roleName}"吗`}
                      onConfirm={this.handleDelete.bind(this, row.roleId)}
                      okText="确定"
                      className={styles.confirm}
                      cancelText="取消"
                    >
                      <a style={{ marginLeft: 10, color: '#FF0000' }}>删除</a>
                    </Popconfirm>
                  ) : (
                    <Popconfirm
                      title={
                        <div>
                          <p>无法删除权限组</p>
                          <p>权限组“{row.roleName}”下账户数量不为0！</p>
                        </div>
                      }
                      okText=""
                      cancelText=""
                      icon={<Icon type="close-circle" theme="filled" />}
                      overlayClassName={styles.confirm}
                    >
                      <a style={{ marginLeft: 10, color: '#FF0000' }}>删除</a>
                    </Popconfirm>
                  )}
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
          columns={columns}
          dataSource={data}
          // pagination={{
          //   showSizeChanger: true,
          //   showQuickJumper: true,
          //   defaultCurrent: 1,
          //   defaultPageSize: 10,
          //   current: current,
          //   pageSize: pageSize,
          //   total: total,
          //   onChange: this.onChange.bind(this),
          //   pageSizeOptions: ['10', '20', '30'],
          //   showTotal: (total, range) =>
          //     `共 ${total} 条记录 第 ${current} / ${totalPage} 页`,
          //   onShowSizeChange: this.onShowSizeChange.bind(this)
          // }}
          pagination={false}
        />
      </div>
    )
  }

  render() {
    const buttons = this.props.global.button || {}
    return (
      <div className={styles.container}>
        <div className={styles.crumb}>
          <Row gutter={24}>
            <Col span={22}>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <h3 style={{ fontWeight: 800 }}>用户组权限配置</h3>
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
            <Col span={2}>
              {buttons['/permission'] && (
                <Button
                  type="primary"
                  onClick={() => router.push('/permission/edit')}
                >
                  添加新项目组
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
