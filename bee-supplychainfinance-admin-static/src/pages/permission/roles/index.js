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
import { listRoleSystemCode, deleteRole,listSubSystemCode } from './services/index'
import { queryString } from '@/common/utils'

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
      visible: false,
      id: null,
      expand: true,
      listRole: [],
      listSub: []
    }
  }

  componentDidMount() {
    const { button } = this.props.global
    const { pathname } = location
    this.getDefaultData({})
    listRoleSystemCode().then(res => {
      if (res && res.code === 0) {
        this.setState({
          listRole: res.data
        })
      }
    })
    listSubSystemCode().then(res => {
      if (res && res.code === 0) {
        this.setState({
          listSub: res.data
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
    request(api + `?currentPage=${current}&pageSize=${pageSize}`, {
      method: 'POST',
      body: params
    }).then(res => {
      if (res && res.code === 0) {
        this.setState({
          data: res.data,
          ...res.page,
          pageSize: pageSize
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
      this.setState({
        params:value
      })
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
    this.getDefaultData({})
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
      listRole,
      listSub
    } = this.state
    const self = this
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
        align: 'center'
      },
      {
        title: '关联账号数量',
        dataIndex: 'relatedNumber',
        key: 'relatedNumber',
        align: 'center',
        width: '10%'
      },
      // {
      //   title: '角色权限',
      //   dataIndex: 'role',
      //   key: 'role',
      //   align: 'center'
      // },
      {
        title: '角色类型',
        dataIndex: 'roleType',
        key: 'roleType',
        render(h) {
          const a = self.state.listRole.filter(item => {
            return h === item.sysCode
          })
          if (a[0]) {
            return a[0].sysCodeDesc
          }
          return
        },
        align: 'center'
      },
      {
        title: '子系统类型',
        dataIndex: 'subSys',
        key: 'subSys',
        render(h) {
          const a = self.state.listSub.filter(item => {
            return item.sysCode === h
          })
          if (a[0]) {
            return a[0].sysCodeDesc
          }
        },
        editable: true
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: (a, b) => moment(a.createTime) - moment(b.createTime),
        align: 'center'
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
          ),
        align: 'center'
      }
    ]

    return (
      <div className={styles.container}>
        <h3 style={{ fontWeight: 700 }}>角色管理</h3>
        <div className={styles.body}>
          <Form layout="inline">
            <Row gutter={48}>
              <Col span={3}>
                <FormItem>
                  {/* <RadioGroup
              onChange={e => this.valueChange('type', e.target.value)}
              value={type}
            >
              {this.types &&
                this.types.map(item => {
                  return (
                    <Radio key={item.type} value={item.type}>
                      {item.name}
                    </Radio>
                  )
                })}
            </RadioGroup> */}
                  {getFieldDecorator('roleName', {})(
                    <Input placeholder="按角色名称搜索" />
                  )}
                </FormItem>
              </Col>
              <Col span={7}>
                <FormItem
                  label="子系统类型"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  {getFieldDecorator('sysType', {
                    // rules: [
                    //   {
                    //     required: true,
                    //     message: '请选择子系统类型'
                    //   }
                    // ]
                  })(
                    <Select
                      style={{ width: 286 }}
                      placeholder="请选择"
                      onChange={this.handleSubType}
                    >
                      {listSub.map(item => {
                        return (
                          <Option key={item.sysCode} value={item.sysCode}>
                            {item.sysCodeDesc}
                          </Option>
                        )
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={9}>
                <FormItem
                  label="角色类型"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  {getFieldDecorator('roleType', {
                    // rules: [{ type: 'array' }]
                  })(
                    <Select style={{ width: 286 }} placeholder="请选择">
                      {listRole.map(item => {
                        return (
                          <Option key={item.level} value={item.sysCode}>
                            {item.sysCodeDesc}
                          </Option>
                        )
                      })}
                    </Select>
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
                    <a
                      style={{ marginLeft: 8, fontSize: 12 }}
                      onClick={() => {
                        this.setState({
                          expand: !this.state.expand
                        })
                      }}
                    >
                      {this.state.expand ? '展开' : '收起'}{' '}
                      <Icon type={this.state.expand ? 'up' : 'down'} />
                    </a>
                  </div>
                </FormItem>
              </Col>
            </Row>
            {!this.state.expand && (
              <Row gutter={48} style={{ marginTop: 30 }}>
                {/* <Col span={7}>
                  <FormItem
                    label="更新时间"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {getFieldDecorator('uptime', {
                      rules: [{ type: 'array' }]
                    })(<RangePicker />)}
                  </FormItem>
                </Col> */}
                <Col span={9}>
                  <FormItem
                    label="创建时间"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {getFieldDecorator('crtime', {
                      rules: [{ type: 'array' }]
                    })(<RangePicker />)}
                  </FormItem>
                </Col>
              </Row>
            )}

            <Row gutter={48} style={{ marginTop: 30 }}>
              <Col span={2} style={{ height: 40 }}>
                <div>
                  {
                    <Button
                      type="primary"
                      onClick={() => router.push('/permission/roles/edit')}
                    >
                      添加角色
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
