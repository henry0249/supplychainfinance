import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Popconfirm, message, InputNumber, Select } from 'antd'
import { getEconomicData, updateMacroEconomicGrowth } from '../services/index'
const { Option } = Select
export default class EditTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [{ date: '1992-08', id: 22, value: 22 }],
      editDatas: {},//保存修改过的参数
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      totalRecords: 0
    };
    this.tabKey = this.props.tabKey
  }

  static propTypes = {
    prop: PropTypes
  }

  componentDidMount() {
    this.getData()
  }

  //获取数据
  getData(key = this.tabKey, pageSize = this.state.pageSize, currentPage = this.state.currentPage) {
    getEconomicData({ key, pageSize, currentPage }).then(res => {
      this.setState({
        list: res.data,
        ...res.page
      })
    })
  }

  //编辑打开
  toHandle(id) {
    id = '' + id;
    let { list } = this.state;
    list = list.map(item => {

      if (item.id + '' === id) {
        return { ...item, isEdit: true }
      }
      return item
    })
    this.setState({ list });
  }

  editData(name, id, value) {//编辑数据操作
    id = '' + id;
    const { editDatas } = this.state;
    editDatas[`${name}${id}`] = value;
    this.setState({
      editDatas,

    })
  }

  save(id, row) {//保存编辑或者添加保存
    id = '' + id;
    let params = {};
    params.data = this.state.editDatas[`data${id}`] === undefined ? row.data : this.state.editDatas[`data${id}`];
    let { list } = this.state;
    params.id = id;
    updateMacroEconomicGrowth(params, this.tabKey).then(res => {
      if (res.code === 0) {
        message.success('编辑成功!');
        list = list.map(item => {
          if (item.id + '' === id) {
            return { ...item, data: params.data, isEdit: false }
          } else {
            return item
          }
        })
        this.setState({
          list
        })
      }
      else {
        message.error(res.msg)
      }
    })
  }

  cancel(id) {//取消编辑或者取消添加
    id = '' + id;
    let { list } = this.state;

    list = list.map(item => {
      if (Number(item.id) === Number(id)) {
        return { ...item, isEdit: false }
      } else {
        return item
      }
    })
    this.setState({ list })
  }

  render() {
    const { list, editDatas, currentPage, pageSize, totalPage, totalRecords } = this.state
    const { unit, options } = this.props
    let optionsObj = false
    if (options && options.length) {
      optionsObj = {};
      options.forEach(item => {
        optionsObj[item.type] = item.value
      })
    }
    const columns = [{
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: '40%'
    },
    {
      title: `数值${unit ? '(' + unit + ')' : ''}`,
      dataIndex: 'data',
      key: 'data',
      width: '50%',
      render: (text, row, index) => {
        if (row.isEdit) {
          if (editDatas[`data${row.id}`] !== undefined) {
            if (options && options.length) {
              return (<Select width={130} value={editDatas[`data${row.id}`]} onChange={e => this.editData('data', row.id, e)} >
                {options.map(item => (<Option key={item.type} value={item.type}>{item.value}</Option>))}
              </Select >)
            } else {
              return <InputNumber width={130}
                value={editDatas[`data${row.id}`]} onChange={e => this.editData('data', row.id, e)} />
            }
          } else {
            this.editData('data', row.id, text)
          }
        } else {
          return <span>{optionsObj ? optionsObj[text] : text}{unit || ''}</span>
        }
      }
    }, {
      title: '操作',
      key: 'action',
      render: (text, row, index) => {
        if (row.isEdit) {
          return <div>
            <a onClick={() => this.save(row.id, row)}>保存</a>
            <Popconfirm title="将放弃所有编辑？" onConfirm={this.cancel.bind(this, row.id)} okText="确定" cancelText="取消">
              <span style={{ color: '#1890ff', marginLeft: 20, cursor: 'pointer' }} >取消</span>
            </Popconfirm>
          </div>
        } else {
          return <div>
            <a onClick={() => this.toHandle(row.id)}>编辑</a>
          </div>
        }
      },
    }]
    return (
      <div>
        <p>说明：这是说明</p>
        <Table dataSource={list}
          columns={columns}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            defaultCurrent: 1,
            defaultPageSize: 10,
            current: currentPage,
            pageSize: pageSize,
            total: totalRecords,
            onChange: (current) => this.getData(undefined, undefined, current),
            pageSizeOptions: ['10', '20', '30'],
            showTotal: (total, range) =>
              `共 ${totalRecords} 条记录 第 ${currentPage} / ${totalPage} 页`,
            onShowSizeChange: (currentSize, size) => this.getData(undefined, size, 1)
          }} />
      </div>
    )
  }
}
