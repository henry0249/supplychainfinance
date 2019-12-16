import React, { Component } from 'react';
import styles from './index.less';
import { Breadcrumb, Form, Input, Select, Table, Radio } from 'antd';
import { getList } from './services/index'
import { permissionTypes } from '@/common/configs'
import router from 'umi/router'
import Link from 'umi/link'
const { Search } = Input;

const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      totalRecords: 0,
      params: { permissionType: '0' },//搜索条件
      visible: false,
      modifyId: null,//修改配置的id
      list: [],
    }
  }

  componentDidMount() {
    this.getList()
  }

  getList(params = this.state.params, currentPage = this.state.currentPage, pageSize = this.state.pageSize) {
    getList({ ...params, currentPage, pageSize }).then(res => {
      if (res && res.code === 0) {
        this.setState({
          list: res.data,
          ...res.page
        })
      }
    })
  }

  onChange = (current) => {
    this.setState({
      currentPage: current
    }, () => this.getList())
  }
  //搜索條件改變時

  searchChange(type, value) {
    let { params } = this.state;
    params[type] = value;
    this.setState({ params }, () => {
      type === 'permissionType' && this.getList(undefined, 1);
    });
  }

  onShowSizeChange = (current, size) => {
    this.setState({
      pageSize: size,
      currentPage: 1
    }, () => this.getList())
  }

  handleSearch = (e) => {
    this.getList()
  }

  //配置
  toHandle(id, enterpriseName) {//进入
    const nextUrl = `/enterpriseConfig/configure${id ? '?id=' + id : ''}&enterpriseName=${enterpriseName}`
    router.push(nextUrl)
  }

  render() {

    const { list } = this.state;
    const { currentPage, pageSize, totalPage, totalRecords, params: { enterpriseName, permissionType } } = this.state;
    const columns = [{
      title: '企业id',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '企业名称',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
    }, {
      title: '企业角色',
      dataIndex: 'permissionName',
      key: 'permissionName',
    }, {
      title: '修改日期',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },

    {
      title: '操作',
      key: 'action',
      render: (text, row, record) => {
        return (
          <div>
            <a onClick={() => this.toHandle(row.id, row.enterpriseName)}>查看详情</a>
          </div>
        )
      },
    }];

    return (
      <div className={styles.container}>
        <div className={styles.crumb}>
          <Breadcrumb>
            <Breadcrumb.Item><Link to='/enterpriseConfig'>企业列表</Link></Breadcrumb.Item>
          </Breadcrumb>
          <span className={styles.title}>企业列表</span>
        </div>

        <div className={styles.body}>

          <div className={styles.top} >
            <Radio.Group value={permissionType} onChange={(e) => this.searchChange('permissionType', e.target.id)}>
              {permissionTypes.map(item => <Radio.Button key={item.key} value={item.key} id={item.key}>{item.name}</Radio.Button>)}
            </Radio.Group>
            <Search
              placeholder="请输入企业名称"
              onSearch={this.handleSearch.bind(this)}
              onChange={e => this.searchChange('enterpriseName', e.target.value)}
              value={enterpriseName}
              style={{ width: 300, marginLeft: 50 }}
            />
          </div>
          <Table
            style={{ marginTop: '30px' }}
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