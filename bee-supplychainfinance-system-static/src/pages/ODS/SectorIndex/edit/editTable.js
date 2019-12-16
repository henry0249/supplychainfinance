import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Popconfirm, message, InputNumber, Input } from 'antd'
import { getEditList, updateEditList } from '../services/index'

export default class EditTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [{ date: '1992-08', id: 22, value: 22 }],
      editDatas: {},//保存修改过的参数
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      columns: [],
      totalRecords: 0,
      loading: true
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
    getEditList({ indexFirstTypeId: key.split('-')[0], indexSecondTypeId: key.split('-')[1], pageSize, currentPage }).then(res => {
      this.setState({
        list: this.listHandle(res.data.data, res.data.columns),
        columns: this.columnsHandle(res.data.columns),
        ...res.page,
        editDatas: {},
        loading: false
      })
    })
  }

  columnsHandle(data) {
    let columns = [];
    data.forEach(item => {
      if (item.key === 'time') {
        columns.push({
          dataIndex: item.key,
          title: item.name,
          key: item.key
        })
      } else {
        columns.push({
          dataIndex: `${item.key}&${item.indexId}`,
          title: item.name + (item.unit && item.unit !== '无' ? '(' + item.unit + ')' : ''),
          key: `${item.key}&${item.indexId}`,
          render: (text, row, index) => {
            if (row.isEdit) {
              if (this.state.editDatas[`${item.key}&${item.indexId}&${row.time}`] !== undefined) {
                return <InputNumber width={130}
                  value={this.state.editDatas[`${item.key}&${item.indexId}&${row.time}`] || 0}
                  onChange={e => this.editData(`${item.key}&${item.indexId}`, row.time, e)} />
              } else {
                this.editData(`${item.key}&${item.indexId}`, row.time, text)
              }
            } else {
              return <span>{text}</span>
            }
          }
        })
      }
    })
    columns.push({
      title: '操作',
      key: 'action',
      render: (text, row, index) => {
        if (row.isEdit) {
          return <div>
            <a onClick={() => this.save(row.time, row)}>保存</a>
            <Popconfirm title="将放弃所有编辑？" onConfirm={this.cancel.bind(this, row.time)} okText="确定" cancelText="取消">
              <span style={{ color: '#1890ff', marginLeft: 20, cursor: 'pointer' }} >取消</span>
            </Popconfirm>
          </div>
        } else {
          return <div>
            <a onClick={() => this.toHandle(row.time)}>编辑</a>
          </div>
        }
      },
    })
    return columns;
  }

  //处理列表数据
  listHandle(data = [], columns = []) {
    let newData = [];
    if (!data.length || !columns.length) {
      return newData
    }
    const newColumns = {};
    columns.forEach(item => { newColumns[item.key] = item.indexId })
    newData = data.map(item => {
      const arrayItem = { time: item.time }
      for (let key in item) {
        if (key !== 'time') {
          arrayItem[key + '&' + newColumns[key]] = item[key]
        }
      }
      return arrayItem
    })
    return newData
  }

  //编辑打开
  toHandle(id) {
    id = '' + id;
    let { list } = this.state;
    list = list.map(item => {
      if (item.time + '' === id) {
        return { ...item, isEdit: true }
      }
      return item
    })
    this.setState({ list });
  }

  editData(name, id, value) {//编辑数据操作
    id = '' + id;
    const { editDatas } = this.state;
    editDatas[`${name}&${id}`] = value;
    this.setState({
      editDatas,

    })
  }

  save(id, row) {//保存编辑或者添加保存 id为time
    id = '' + id
    const { editDatas } = this.state
    let params = this.saveParamsHandle(id, row, editDatas)
    updateEditList(params).then(res => {
      if (res.code === 0) {
        message.success('编辑成功!');
        this.setState({ loading: true })
        this.getData()
      }
      else {
        message.error(res.msg)
      }
    })
  }

  saveParamsHandle(time, row, editDatas) {
    let params = [];
    for (let key in row) {
      if (key !== 'time' && key !== 'isEdit') {
        const splitKey = key.split('&');//得到最初键与其对应的indexId
        params.push({ indexValue: '' + (editDatas[`${key}&${time}`] === undefined ? row[key] : editDatas[`${key}&${time}`]), indexId: Number(splitKey[1]), time, })
      }
    }
    return params
  }

  cancel(id) {//取消编辑或者取消添加
    id = '' + id;
    let { list } = this.state;
    list = list.map(item => {
      if (item.time === id) {
        return { ...item, isEdit: false }
      } else {
        return item
      }
    })
    this.setState({ list })
  }

  render() {
    const { list, editDatas, currentPage, pageSize, totalPage, totalRecords, columns, loading } = this.state
    return (
      <div>
        <p>说明：这是说明</p>
        <Table dataSource={list}
          columns={columns}
          rowKey='time'
          loading={loading}
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
