import React, { Component } from 'react'
import styles from './index.less'
import { Form, Button, Select, Icon, message, Table, Avatar, Modal, Tag, Checkbox } from 'antd'
import withRouter from 'umi/withRouter'
import { configureApprovalManagement, getApprovalManagementList, getApprovalManagementDetail } from '../../services/index'
const { Option } = Select

@withRouter
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      totalRecords: 0,
      params: {},//搜索条件
      visible: false,
      modifyId: null,//修改配置的id
      list: [],
      detail: {},
      permissions: [],
      levels: [],
      processDesc: '',
      activeCode: 0,
      processType: '',
      inLoan: 0,//审批类型0立项审批 1贷中审批
      enable: false
    }
    this.chineseText = { 0: '一', 1: '二', 2: '三', 3: '四', 4: '五' }//大写
  }

  componentDidMount() {
    this.id = this.props.location.query.id
    if (!this.id) {
      message.error('请先选择企业');
      this.props.history.goback()
    }
    this.getApprovalManagementList(this.id)
  }

  getApprovalManagementList(id = this.id) {
    getApprovalManagementList({ id }).then(res => {
      if (res && res.code === 0) {
        this.setState({
          list: res.data
        })
      }
    })
  }

  //获得详情
  getApprovalManagementDetail(processType) {
    getApprovalManagementDetail({ processType, id: this.id }).then(res => {
      if (res.code === 0) {
        this.dataHandle(res.data)
        this.setState({
          visible: true
        })
      } else {
        message.error(res.msg)
      }

    })
  }

  //数据回写
  dataHandle(data) {
    let levels = data.levels;
    let permissions = data.permissions;
    if (levels && levels.length) {
      levels = levels.map(item => {
        let value = {}
        if (item.nodeAuditRoleId !== undefined) {
          permissions = permissions.map((item1, index) => {
            if (item.nodeAuditRoleId === item1.roleId) {
              value.roleId = item1.roleId
              value.roleName = item1.roleName
              value.levelIndex = index
              return { ...item1, processNodeCode: item.processNodeCode }
            } else {
              return item1
            }
          })
          return { ...item, value }
        } else {
          return item
        }
      })
    } else {
      levels = [{
        "processNodeCode": 0,
        "processNodeDesc": "一级审批"
      }]
    }
    this.setState({
      permissions,
      levels,
      enable: levels[0] && levels[0].enable || undefined
    })
  }

  //是否启用状态更改
  enableChange(index, enable) {
    let levels = [...this.state.levels]
    levels[index].enable = enable
    this.setState({
      levels
    })
  }

  //权限选中统一处理
  onChange(processNodeCode, index, checked) {
    let permissions = [...this.state.permissions];
    let levels = [...this.state.levels];
    if (checked) {
      permissions = permissions.map(item => {
        if (item.processNodeCode === processNodeCode) {
          return { ...item, processNodeCode: null }
        } else {
          return item
        }
      })
      permissions[index] = { ...permissions[index], processNodeCode }
      levels[processNodeCode] = { ...levels[processNodeCode], value: { roleId: permissions[index].roleId, roleName: permissions[index].roleName, levelIndex: index } }
    } else {
      permissions[index] = { ...permissions[index], processNodeCode: null }
      levels[processNodeCode] = { ...levels[processNodeCode], value: {} }
    }

    this.setState({
      permissions,
      levels
    })
  }

  //搜索條件改變時
  searchChange(type, value) {
    let { params } = this.state;
    params[type] = value;
    this.setState({ params });
  }

  handleSearch = (e) => {
    this.getApprovalManagementList()
  }

  hideModal = () => {
    this.setState({
      visible: false
    })
  }

  //配置
  toHandle(row) {
    this.getApprovalManagementDetail(row.processType);
    this.setState({
      processType: row.processType,
      processDesc: row.processDesc,
      inLoan: row.inLoan//审批类型 
    })
  }

  //保存编辑
  save = () => {
    let { levels, processDesc, processType, inLoan } = this.state;
    let params = { processDesc, processType };
    params.id = this.id;
    let hasEmptyLevel = false;//是否有审批项未选择权限组
    params.list = levels.map(item => {
      if (!item.value || !item.value.roleId) {
        hasEmptyLevel = item.processNodeDesc + '未选择权限组'
      }
      else if (item.enable === undefined) {
        hasEmptyLevel = item.processNodeDesc + '未设置启停'
      }
      return {
        processNodeCode: item.processNodeCode,
        processNodeDesc: item.processNodeDesc,
        roleId: item.value && item.value.roleId !== undefined ? item.value.roleId : null,
        enable: item.enable
      }
    })

    if (inLoan === 0 && hasEmptyLevel) {
      message.error(`${hasEmptyLevel}`);
      return
    }

    configureApprovalManagement(params).then(res => {
      if (res.code === 0) {
        message.success(res.msg);
        this.getApprovalManagementList()
        this.setState({
          visible: false
        })
      } else {
        message.error(res.msg)
      }
    })
  }

  //删除审批的权限组
  tagDelete = (code, value) => {
    this.onChange(code, value.levelIndex, false)
  }

  //删除一行
  deleteRow = (code) => {
    let permissions = [...this.state.permissions];
    let levels = [...this.state.levels];
    levels = levels.slice(0, -1)
    permissions = permissions.map(item => {
      if (code === item.processNodeCode) {
        return { ...item, processNodeCode: null }
      } else {
        return item
      }
    })
    this.setState({
      permissions,
      levels
    })
  }

  //添加一行
  addRow() {
    let levels = [...this.state.levels];
    levels.push({ processNodeCode: levels.length, processNodeDesc: `${this.chineseText[levels.length]}级审批` })
    this.setState({ levels })
  }

  //审批步凑点击
  itemClick(activeCode, enable) {
    this.setState({
      activeCode,
      enable
    })
  }

  render() {
    const { list, levels, permissions, processDesc, activeCode, inLoan, enable } = this.state;
    const columns = [{
      title: '审批名称',
      dataIndex: 'processDesc',
      key: 'processDesc',
    }, {
      title: '修改时间',
      dataIndex: 'modifyTime',
      key: 'modifyTime',
    }, {
      title: '操作',
      key: 'action',
      render: (text, row, record) => {
        return (
          <div>
            <a onClick={() => this.toHandle(row)}>配置</a>
          </div>
        )
      },
    }];
    return (
      <div className={styles.body}>
        <div className={styles.title}>审批管理配置</div>
        <Table
          style={{ marginTop: '30px' }}
          columns={columns}
          dataSource={list}
          rowKey={(i, index) => index}
          pagination={false}
        />

        <Modal
          title="审批管理配置"
          visible={this.state.visible}
          onOk={this.save}
          onCancel={this.hideModal}
          centered
          okText="确认"
          cancelText="取消"
          width={878}
          wrapClassName={styles.modal}
        >
          <div>审批名称:{processDesc}</div>
          <div className={styles.panel}>
            {/* 审批流程 */}
            <div className={styles.left}>
              {levels.length ?
                levels.map((item, index) => <Item itemClick={this.itemClick.bind(this, item.processNodeCode, item.enable)}
                  inLoan={inLoan} enableChange={this.enableChange.bind(this, index)}
                  enable={item.enable}
                  activeCode={activeCode} tagDelete={this.tagDelete} {...item} key={item.processNodeCode}
                  isLast={index !== 0 && index + 1 === levels.length} deleteRow={this.deleteRow.bind(this)} value={item.value || {}} />)
                : null}
              {levels.length < 5 && inLoan === 1 ? <div className={styles.add} onClick={this.addRow.bind(this)}> + &nbsp;添加</div> : null}
            </div>

            {/* 权限选择 */}
            <div className={styles.right}>
              <div className={styles.top}>
                <div className={styles.label}>可选权限组 共({permissions.length || 0})条:</div>
                {/* <div className={styles.value}>
                  <Input.Search
                    placeholder="请输入用户名称"
                    onSearch={value => console.log(value)}
                    style={{ width: 200 }}
                  />
                </div> */}
              </div>
              <div className={styles.bottom}>
                <div className={styles.title}>
                  权限组名称
            </div>
                <div className={styles.checkPanel}>
                  {permissions.length ? permissions.map((item, index) => <Checkbox className={styles.checkbox}
                    checked={item.processNodeCode === 0 || item.processNodeCode > 0 ? true : false}
                    disabled={((item.processNodeCode === 0 || item.processNodeCode > 0) && item.processNodeCode !== activeCode) || enable === 2}
                    onChange={(e) => this.onChange(activeCode, index, e.target.checked)}
                  >
                    {item.roleName}
                  </Checkbox>) : null}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

const enables = [{ value: 0, label: '未启用', disabled: false }, { value: 1, label: '启用', disabled: false }, { value: 2, label: '启用', disabled: true }]

const Item = ({ activeCode, processNodeCode, processNodeDesc, value = {}, tagDelete, itemClick, isLast = true, deleteRow, enableChange, enable, inLoan }) => {
  return <div onClick={() => itemClick()} className={`${styles.item} ${activeCode === processNodeCode ? styles.active : ''}`}>
    <div className={styles.label}>{processNodeDesc}:</div>
    <div className={styles.value}>
      {value.roleName ? <Tag closable={enable !== 2} onClose={() => tagDelete(processNodeCode, value)}>{value.roleName}</Tag> : null}
    </div>
    {inLoan === 0 ? <Select style={{ width: 90 }} onSelect={enableChange} placeholder="" value={enable} disabled={enable === 2}>
      {
        enables && enables.map(item => {
          return <Option disabled={item.disabled} value={item.value} key={item.value}>{item.label}</Option>
        })
      }
    </Select>
      : <div className={styles.delete}>
        {isLast ? <Icon onClick={e => { e.stopPropagation(); deleteRow(processNodeCode) }} width={30} height={30} type="delete" /> : null}
      </div>}
  </div>
}