import React, { Component } from 'react';
import styles from './index.less';
import { Breadcrumb, Form, Input, Select, Table, Radio } from 'antd';
import { getList } from './services/index'
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
      params: { keyword: '' },//搜索条件
      visible: false,
      modifyId: null,//修改配置的id
      list: [],
    }
  }

  componentDidMount() {
    this.getList()
  }

  getList(params = this.state.params, ) {
    getList({ ...params }).then(res => {
      if (res && res.code === 0) {
        this.setState({
          list: res.data,
          ...res.page
        })
      }
    })
  }
  //搜索條件改變時

  searchChange(type, value) {
    let { params } = this.state;
    params[type] = value;
    this.setState({ params })
  }

  handleSearch = (e) => {
    this.getList()
  }

  //配置
  toHandle(id, name) {//进入
    const nextUrl = `/roleConfig/configure${id ? '?id=' + id : ''}&name=${name}`
    router.push(nextUrl)
  }

  render() {

    const { list } = this.state;
    const { params: { keyword } } = this.state;
    const columns = [{
      title: 'id',
      dataIndex: 'permissionId',
      key: 'permissionId',
    }, {
      title: '企业角色',
      dataIndex: 'permissionName',
      key: 'permissionName',
    }, {
      title: '拥有企业数',
      dataIndex: 'enterpriseNum',
      key: 'enterpriseNum',
    }, {
      title: '修改日期',
      dataIndex: 'modifyTime',
      key: 'modifyTime',
    },

    {
      title: '操作',
      key: 'action',
      render: (text, row, record) => {
        return (
          <div>
            <a onClick={() => this.toHandle(row.permissionId, row.permissionName)}>查看详情</a>
          </div>
        )
      },
    }];

    return (
      <div className={styles.container}>
        <div className={styles.crumb}>
          <Breadcrumb>
            <Breadcrumb.Item><Link to='/roleConfig'>企业角色列表</Link> </Breadcrumb.Item>
          </Breadcrumb>
          <span className={styles.title}>企业角色详情</span>
        </div>

        <div className={styles.body}>

          <div className={styles.top} >

            {/* <Search
              placeholder="请输入"
              onSearch={this.handleSearch.bind(this)}
              onChange={e => this.searchChange('keyword', e.target.value)}
              value={keyword}
              style={{ width: 300, marginLeft: 50 }}
            /> */}
          </div>
          <Table
            style={{ marginTop: '30px' }}
            columns={columns}
            dataSource={list}
            rowKey={(i, index) => index}
            pagination={false}
          />
        </div>
      </div>
    )
  }
}