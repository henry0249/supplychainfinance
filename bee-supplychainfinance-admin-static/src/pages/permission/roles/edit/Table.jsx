import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Input } from 'antd'
const Search = Input.Search;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type'
      },
      {
        title: 'url',
        dataIndex: 'url',
        key: 'url'
      },
    ]
  }

  //性能优化
  shouldComponentUpdate(next){
    if(next.dataSource===this.props.dataSource&&next.selectedRowKeys===this.props.selectedRowKeys){
      return false
    }else{
      return true
    }
  }

  render() {
    const { dataSource = [], onSearch, selectedRowKeys = [], onChange,searchValueChange } = this.props
console.log('table render')
    const rowSelection = {
      onChange,
      selectedRowKeys
    };
    return (
      <div style={{ padding: '0 30px' }}>
        <h4>接口配置</h4>
        <Search
          placeholder="请输入菜单的路由"
          onSearch={value => onSearch(value)}
          style={{ width: 250 }}
          // onChange={(e)=>searchValueChange(e.target.value)}
          // value={value}
        />
        <Table  rowSelection={rowSelection} rowKey='id' pagination={false} columns={this.columns} dataSource={dataSource} scroll={{  y: 500 }} />
      </div>
    )
  }
}
