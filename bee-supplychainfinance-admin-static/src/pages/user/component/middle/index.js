import React, { Component } from 'react'
import styles from './index.less'
import {
  Breadcrumb,
  Popconfirm,
  Form,
  DatePicker,
  Button,
  Tag,
  Table,
  Radio,
  message,
  Select,
  Input,
  Row,
  Col,
  Card,
  Badge,
  Modal,
  Icon,
  Cascader
} from 'antd'
import Link from 'umi/link'
import {
  getMiddleList,
  forbit,
  getComListCa
} from '../../services'
import { utils } from '@/common'
import moment from 'moment'
import { getSimpleText, queryString } from '@/common/utils'
import router from 'umi/router'
import { connect } from 'dva'
import { timingSafeEqual } from 'crypto'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const Option = Select.Option
const RadioGroup = Radio.Group
@Form.create()
@connect(({ global, loading }) => ({
  global
}))
export default class index extends Component {
  constructor() {
    super()
    this.state = {
      expand: false,
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      totalRecords: 0,
      params: {},
      list: null,
      role: null
    }
  }

  componentDidMount() {
    const url = `currentPage=1&pageSize=10`
    getMiddleList(url, {}).then(resp => {
      console.log(resp)
      if (resp && resp.code === 0) {
        this.setState({
          list: resp.data,
          ...resp.page
        })
      } else {
        this.setState({
          list: null,
          currentPage: 1,
          pageSize: 10,
          totalPage: 0,
          totalRecords: 0
        })
      }
    })

    // getRole().then(resp=>{
    //   if(resp && resp.code ===0){
    //     this.setState({
    //       role: resp.data
    //     })
    //   }
    // })

    getComListCa().then(resp => {
      console.log(resp)
      if (resp && resp.code === 0) {
        // let str = JSON.stringify(resp.data);
        // str = str.replace(/id/g, 'value');
        // str = str.replace(/name/g, "label");
        // str = str.replace(/subList/g, "children");
        // let str = [resp.data]
        // // 遍历第一层部门
        // for (let i = 0; i < str.length; i++) {
        //   // 判断子节点不为零
        //   if (str[i]['children'].length !== 0) {
        //     // 遍历第二层节点
        //     for (let m = 0; m < str[i]['children'].length; m++) {
        //       // 判断子节点不为零
        //       if (str[i]['children'][m]['children'].length !== 0) {
        //         // 遍历第三层节点
        //         for (let n = 0; n < str[i]['children'][m]['children'].length; n++) {
        //           // 删除第三层所有的children
        //           delete str[i]['children'][m]['children'][n]['children']
        //         }
        //       }
        //     }
        //   }
        // }
        this.setState({
          company: resp.data
        })
      } else {
        this.setState({
          company: null
        })
      }
    })
  }

  onChange = current => {
    // const { dispatch } = this.props;
    const { pageSize, params } = this.state
    const url = `currentPage=${current}&pageSize=${pageSize}`
    getMiddleList(url, params).then(resp => {
      if (resp && resp.code === 0) {
        this.setState({
          list: resp.data,
          ...resp.page
        })
      } else {
        this.setState({
          list: null,
          currentPage: 1,
          pageSize: 10,
          totalPage: 0,
          totalRecords: 0
        })
      }
    })
  }

  onShowSizeChange = (current, size) => {
    const { params } = this.state
    const url = `currentPage=${1}&pageSize=${size}`
    getMiddleList(url, params).then(resp => {
      if (resp && resp.code === 0) {
        this.setState({
          list: resp.data,
          ...resp.page
        })
      } else {
        this.setState({
          list: null,
          currentPage: 1,
          pageSize: 10,
          totalPage: 0,
          totalRecords: 0
        })
      }
    })
  }

  expand = expand => {
    this.setState({
      expand: !expand
    })
  }

  handleSearch = () => {
    const { validateFields } = this.props.form
    const { currentPage, pageSize } = this.state
    validateFields((err, values) => {
      if (!err) {
        let params = {}
        if (values.name) {
          params['keyword'] = values.name
        }
        if (values.role) {
          params['role'] = values.role
        }
        if (values.position) {
          params['postId'] = values.position
        }
        if (values.com) {
          params['enterpriseName'] = values.com
        }
        if (values.status) {
          params['status'] = values.status
        }
        if (values.time) {
          params['startTime'] = moment(values['time'][0]).format(
            'YYYY-MM-DD HH:mm:ss'
          )
          params['endTime'] = moment(values['time'][1]).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        }
        console.log(params)
        const url = `currentPage=${1}&pageSize=${pageSize}`
        getMiddleList(url, params).then(resp => {
          if (resp && resp.code === 0) {
            this.setState({
              list: resp.data,
              ...resp.page,
              params
            })
          } else {
            this.setState({
              list: null,
              currentPage: 1,
              pageSize: 10,
              totalPage: 0,
              totalRecords: 0,
              params: {}
            })
          }
        })
      }
    })
  }

  handleReset = () => {
    const { resetFields } = this.props.form
    resetFields()
    const url = `currentPage=1&pageSize=10`
    getMiddleList(url, {}).then(resp => {
      console.log(resp)
      if (resp && resp.code === 0) {
        this.setState({
          list: resp.data,
          ...resp.page,
          params: {}
        })
      } else {
        this.setState({
          list: null,
          currentPage: 1,
          pageSize: 10,
          totalPage: 0,
          totalRecords: 0,
          params: {},
          company: null
        })
      }
    })
  }

  forbitMiddle = row => {
    if (row.status === 0) {
      //禁用状态，解禁操作
      forbit(`userId=${row.userId}&status=1`).then(resp => {
        console.log(resp)
        if (resp && resp.code === 0) {
          message.success('解禁成功')
          const { currentPage, pageSize, params } = this.state
          const url = `currentPage=${currentPage}&pageSize=${pageSize}`
          getMiddleList(url, params).then(resp => {
            if (resp && resp.code === 0) {
              this.setState({
                list: resp.data,
                ...resp.page,
                params: {}
              })
            } else {
              this.setState({
                list: null,
                currentPage: 1,
                pageSize: 10,
                totalPage: 0,
                totalRecords: 0,
                params: {}
              })
            }
          })
        } else {
          message.warning('解禁失败')
        }
      })
    } else {
      //解禁状态，禁用操作
      forbit(`userId=${row.userId}&status=0`).then(resp => {
        console.log(resp)
        if (resp && resp.code === 0) {
          const { currentPage, pageSize, params } = this.state
          const url = `currentPage=${currentPage}&pageSize=${pageSize}`
          getMiddleList(url, params).then(resp => {
            if (resp && resp.code === 0) {
              this.setState({
                list: resp.data,
                ...resp.page,
                params: {}
              })
            } else {
              this.setState({
                list: null,
                currentPage: 1,
                pageSize: 10,
                totalPage: 0,
                totalRecords: 0,
                params: {}
              })
            }
          })
          message.success('禁用成功')
        } else {
          message.warning('禁用失败')
        }
      })
    }
  }

  comChange = () => { }

  render() {
    const {
      expand,
      currentPage,
      pageSize,
      totalPage,
      totalRecords,
      list,
      role,
      company
    } = this.state
    const { getFieldDecorator } = this.props.form
    const columns = [
      {
        title: '企业名称',
        dataIndex: 'enterpriseName',
        key: 'enterpriseName'
      },
      {
        title: '用户名',
        dataIndex: 'fullName',
        key: 'fullName'
      },
      {
        title: '注册手机号',
        dataIndex: 'userName',
        key: 'userName'
      },
      // {
      //   title: '成员姓名',
      //   dataIndex: 'name',
      //   key: 'name'
      // },
      // {
      //   title: '角色',
      //   dataIndex: 'roleName',
      //   key: 'roleName',
      // },
      // {
      //   title: '部门',
      //   dataIndex: 'departmentName',
      //   key: 'departmentName'
      // },
      // {
      //   title: '职位',
      //   dataIndex: 'postName',
      //   key: 'postName'
      // },
      {
        title: '注册时间',
        dataIndex: 'createTime',
        key: 'createTime',
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
        render: (text, row, record) => (
          <span>
            {
              <span>
                {row.status === 1 ? (
                  <Link
                    to={`/user/middle?id=${row.userId}&enterType=0&orgId=${
                      row.enterpriseId
                      }`}
                  >
                    编辑
                  </Link>
                ) : (
                    <Link
                      to={`/user/middle?id=${row.userId}$enterType=1&orgId=${
                        row.enterpriseId
                        }`}
                    >
                      查看
                  </Link>
                  )}

                {
                  <Popconfirm
                    title={
                      <div>
                        <p>{row.status === 0 ? '解禁' : '禁用'}本账号</p>
                        <p>{`确认${row.status === 0 ? '解禁' : '禁用'}账户“${
                          row.fullName
                          }”吗`}</p>
                      </div>
                    }
                    onConfirm={this.forbitMiddle.bind(this, row)}
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
        )
      }
    ]

    return (
      <div className={styles.body}>
        <Form layout="inline">
          {this.state.expand ? (
            <Row gutter={48}>
              <Col span={8}>
                <FormItem
                  label=""
                  wrapperCol={{ span: 16 }}
                  style={{ width: '100%' }}
                >
                  {getFieldDecorator('name')(
                    <Input
                      style={{ width: 350 }}
                      placeholder="按账户名/手机号"
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem label="企业名称">
                  {getFieldDecorator('com')(
                    <Input
                      options={company}
                      onChange={this.comChange}
                      placeholder="请输入企业名称"
                      style={{ width: 350 }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="账户状态">
                  {getFieldDecorator('status')(
                    <Select style={{ width: 350 }} placeholder="请选择">
                      <Option value="1">启用中</Option>
                      <Option value="0">已禁用</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="注册时间">
                  {getFieldDecorator('time')(
                    <RangePicker
                      style={{ width: 350 }}
                      format="YYYY-MM-DD HH:mm:ss"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          ) : (
              <Row gutter={48}>
                <Col span={8}>
                  <FormItem
                    label=""
                    wrapperCol={{ span: 16 }}
                    style={{ width: '100%' }}
                  >
                    {getFieldDecorator('name')(
                      <Input
                        placeholder="按账户名/手机号"
                        style={{ width: 350 }}
                      />
                    )}
                  </FormItem>
                </Col>

                <Col span={8}>
                  <FormItem label="企业名称">
                    {getFieldDecorator('com')(
                      <Input
                        onChange={this.comChange}
                        placeholder="请选择"
                        style={{ width: 350 }}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            )}
          <Row style={{ marginTop: 15 }}>
            <Col span={24} style={{ textAlign: 'left' }}>
              <Button type="primary" onClick={this.handleSearch} icon="search">
                查询
              </Button>
              <Button onClick={this.handleReset} style={{ marginLeft: 10 }}>
                重置
              </Button>
              <a
                onClick={this.expand.bind(this, this.state.expand)}
                style={{ marginLeft: 8, fontSize: 12 }}
              >
                {this.state.expand ? '收起' : '展开'}{' '}
                <Icon type={this.state.expand ? 'up' : 'down'} />
              </a>
            </Col>
          </Row>
          {/* <Row style={{ marginTop: 15 }}>
            <Col span={24} style={{ textAlign: 'left' }}>
              <Button type="primary" onClick={this.handleSearch} icon="plus">
                添加后台用户
              </Button>
            </Col>
          </Row> */}
        </Form>

        <Table
          // rowKey={(i, index) => i.id}
          className="articles"
          style={{ marginTop: '30px', textAlign: 'center' }}
          // rowSelection={rowSelection}
          // onChange={this.onChange}
          columns={columns}
          dataSource={list}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            defaultCurrent: 1,
            defaultPageSize: 5,
            current: currentPage,
            pageSize: pageSize,
            total: totalRecords,
            onChange: this.onChange.bind(this),
            pageSizeOptions: ['5', '10', '20'],
            showTotal: (total, range) =>
              `共 ${totalRecords} 条记录 第 ${currentPage} / ${totalPage} 页`,
            onShowSizeChange: this.onShowSizeChange.bind(this)
          }}
        />
      </div>
    )
  }
}

const handleCascader = data => {
  let str = JSON.stringify(data)
  str = str.replace(/id/g, 'value')
  str = str.replace(/name/g, 'label')
  str = str.replace(/subList/g, 'children')
  str = JSON.parse(str)
  // 遍历第一层部门
  for (let i = 0; i < str.length; i++) {
    // 判断子节点不为零
    if (str[i]['children'].length !== 0) {
      // 遍历第二层节点
      for (let m = 0; m < str[i]['children'].length; m++) {
        // 判断子节点不为零
        if (str[i]['children'][m]['children'].length !== 0) {
          // 遍历第三层节点
          for (let n = 0; n < str[i]['children'][m]['children'].length; n++) {
            // 删除第三层所有的children
            delete str[i]['children'][m]['children'][n]['children']
          }
        }
      }
    }
  }
  return str
}
