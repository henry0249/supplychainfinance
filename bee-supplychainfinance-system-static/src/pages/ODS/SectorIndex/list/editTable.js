import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Popconfirm, message, InputNumber, Input, Select } from 'antd'
import { getList, uploadList, getUnits } from '../services/index'
import router from 'umi/router'

export default class EditTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [{ date: '1992-08', id: 22, value: 22 }],
      editDatas: {},//保存修改过的参数
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      totalRecords: 0,
      crawlTime: [],
      units: [{ id: 1, name: '元/吨' }]
    };
    this.tabKey = this.props.tabKey
  }

  static propTypes = {
    prop: PropTypes
  }

  componentDidMount() {
    this.getData()
    this.getCrawlTimes()
    this.getUnits()
  }

  //生成时间
  getCrawlTimes() {
    let crawlTime = [];
    for (let i = 0; i < 24; i += 2) {
      crawlTime.push(`每天${i}:00`)
    }
    this.setState({ crawlTime })
  }

  //获得单位下拉
  getUnits() {
    getUnits().then(res => {
      if (res.code === 0) {
        this.setState({
          units: res.data
        })
      }
    })
  }

  //获取数据
  getData(key = this.tabKey, pageSize = this.state.pageSize, currentPage = this.state.currentPage) {
    getList({ indexFirstTypeId: key.split('-')[0], indexSecondTypeId: key.split('-')[1], pageSize, currentPage }).then(res => {
      this.setState({
        list: res.data,
        ...res.page,
        editDatas: {}
      })
    })
  }

  //编辑打开
  toHandle(id, toEdit) {
    if (toEdit) {
      router.push('/ods/sectorIndex/edit')
    }
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

  editData(name, id, value = null) {//编辑数据操作
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
    const { editDatas } = this.state;
    params.indexThirdType = editDatas[`indexThirdType${id}`] === undefined ? row.indexThirdType : editDatas[`indexThirdType${id}`];
    params.priceUnit = editDatas[`priceUnit${id}`] === undefined ? row.priceUnit : editDatas[`priceUnit${id}`];
    params.crawlTime = editDatas[`crawlTime${id}`] === undefined ? row.crawlTime : editDatas[`crawlTime${id}`];
    params.id = Number(id);
    params.indexFirstTypeId = Number(this.tabKey.split('-')[0])
    params.indexSecondTypeId = Number(this.tabKey.split('-')[1])
    uploadList(params).then(res => {
      if (res.code === 0) {
        message.success('编辑成功!');
        this.getData()
        // list = list.map(item => {
        //   if (item.id + '' === id) {
        //     return { ...item, data: params.data, isEdit: false }
        //   } else {
        //     return item
        //   }
        // })
        // this.setState({
        //   list
        // })
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
    const { list, editDatas, units, currentPage, pageSize, totalPage, totalRecords, crawlTime } = this.state
    const columns = [
      {
        title: `指数名称`,
        dataIndex: 'indexThirdType',
        key: 'id',
        render: (text, row, index) => {
          if (row.isEdit) {
            if (editDatas[`indexThirdType${row.id}`] !== undefined) {
              return <Input width={130}
                value={editDatas[`indexThirdType${row.id}`]} onChange={e => this.editData('indexThirdType', row.id, e.target.value)} />
            } else {
              this.editData('indexThirdType', row.id, text)
            }
          } else {
            return <span>{text}</span>
          }
        }
      },
      {
        title: `指数单位`,
        dataIndex: 'unitName',
        key: 'id',
        render: (text, row, index) => {
          if (row.isEdit) {
            if (editDatas[`priceUnit${row.id}`] !== undefined) {
              return <Select style={{ width: 140 }}
                value={editDatas[`priceUnit${row.id}`]} onChange={e => this.editData('priceUnit', row.id, e)} >
                {units.map(item => (
                  <Select.Option key={item.id} value={item.id}>{item.priceUnit}</Select.Option>
                ))}
              </Select>
            } else {
              this.editData('priceUnit', row.id, row.priceUnit)
            }
          } else {
            return <span>{text}</span>
          }
        }
      },
      {
        title: `自动爬取时间`,
        dataIndex: 'crawlTime',
        key: 'id',
        width: '150px',
        render: (text, row, index) => {
          if (row.isEdit) {
            if (editDatas[`crawlTime${row.id}`] !== undefined) {
              return <Select style={{ width: 140 }}
                value={editDatas[`crawlTime${row.id}`]} onChange={e => this.editData('crawlTime', row.id, e)} >
                {crawlTime.map(item => (
                  <Select.Option key={item} value={item}>{item}</Select.Option>
                ))}
              </Select>
            } else {
              this.editData('crawlTime', row.id, text)
            }
          } else {
            return <span>{text}</span>
          }
        }
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
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
              <a onClick={() => this.toHandle(row.id)}>编辑属性</a>&nbsp;&nbsp;
              <a onClick={() => this.toHandle(row.id, true)}>编辑数值</a>
            </div>
          }
        },
      }]
    return (
      <div>
        <p>说明：这是说明</p>
        <Table dataSource={list}
          columns={columns}
          key='id'
          pagination={false}
        // pagination={{
        //   showQuickJumper: true,
        //   showSizeChanger: true,
        //   defaultCurrent: 1,
        //   defaultPageSize: 10,
        //   current: currentPage,
        //   pageSize: pageSize,
        //   total: totalRecords,
        //   onChange: (current) => this.getData(undefined, undefined, current),
        //   pageSizeOptions: ['10', '20', '30'],
        //   showTotal: (total, range) =>
        //     `共 ${totalRecords} 条记录 第 ${currentPage} / ${totalPage} 页`,
        //   onShowSizeChange: (currentSize, size) => this.getData(undefined, size, 1)
        // }}
        />
      </div>
    )
  }
}
