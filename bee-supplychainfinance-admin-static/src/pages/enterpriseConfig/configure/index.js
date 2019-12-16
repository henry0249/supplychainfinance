import React, { Component } from 'react';
import styles from '../index.less';
import { Breadcrumb, Form, Button, Input, Select, message, Popconfirm, Icon } from 'antd';
import router from 'umi/router'
import Link from 'umi/link';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
import { saveEnterprisePermission, getEnterprisePermission, getAllPermissions } from '../services'
import Log from './log'
import Power from './power'
import Check from './check'

const FormItem = Form.Item;
const Option = Select.Option;
@withRouter

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSave: false,
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      totalRecords: 0,
      cloumns: [],//低分规则配置可修改字段
      cloumnsData: null,//低分规则配置值
      triggerTypes: [],//低分规则的风控评分类型
      data: { businessMode: 0, subjectName: '' },//标的物与业务类型值
      goods: [{ name: '全部', key: 0 }, { name: '核心企业', key: 1 }, { name: '货代公司', key: 2 }, { name: '结算管理', key: 3 }],//标的物种类
    }
    this.id = props.location.query.id || false
    this.enterpriseName = props.location.query.enterpriseName || false
  }

  componentDidMount() {
    this.dataInit()
  }

  //角色信息初始化
  dataInit() {
    getAllPermissions().then(res => {
      if (res.code === 0) {
        this.setState({
          allPermissons: res.data
        })
      }
      return false
    }).then(() => {
      getEnterprisePermission({ id: this.id }).then(res => {
        if (res.code === 0 && res.data && res.data.length) {
          const permissions = res.data.map(item => ({
            key: item.permissionId, label: item.permissionName
          }))
          this.setState({
            permissions
          })
        }
      })
    })
  }

  //查询低分规则配置可修改字段
  getTriggerType(businessMode = 0, callback) {
    getTriggerType(businessMode).then(res => {
      if (res.code === 1) {
        this.setState({
          cloumns: res.data
        }, () => { callback && callback() })
      } else {
        this.setState({
          cloumns: []
        })
      }
    })
  }

  //标的物低分规则配置详细查询
  findLowGradeConfig(id, callback) {
    findLowGradeConfig(id).then(res => {
      if (res.code === 1) {
        let cloumnsData = {};
        if (res.data.updateColumnInfo && res.data.updateColumnInfo.length) {
          cloumnsData = handleCloumnDate(res.data.updateColumnInfo)
        }
        this.setState({
          cloumnsData,
          data: { businessMode: res.data.businessMode, subjectName: res.data.subjectName }
        }, () => { callback && callback(res.data.businessMode) })
      } else {
        this.setState({
          cloumns: []
        })
      }
    })
  }

  //选中
  permissionChange(permissions) {
    this.setState({ permissions, showSave: true });
  }

  //配置项值更改
  cloumnsChange(id, type, value) {
    let { cloumnsData } = this.state;
    cloumnsData[`data${id}`][type] = value;
    this.setState({ cloumnsData })
  }

  save() {
    const { permissions } = this.state;
    let params = { enterpriseId: this.id }
    params.permissionIds = permissions.map(item => (item.key))
    saveEnterprisePermission(params).then(res => {
      if (res.code === 0) {
        message.success(res.msg)
        this.setState({
          showSave: false
        })
      }
      else {
        message.error(res.msg)
      }
    })
  }

  render() {
    const { showSave, allPermissons, permissions } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.crumb}>
          <Breadcrumb className={styles.breadcrumb}>
            <Breadcrumb.Item><Link to={'/enterpriseConfig'}>企业列表</Link></Breadcrumb.Item>
            <Breadcrumb.Item>企业详情</Breadcrumb.Item>
          </Breadcrumb>
          <div className={styles.title}>
            <Icon style={{ fontSize: 28 }} type="home" theme="twoTone" />
            <span className={styles.name}>{this.enterpriseName}</span>

            <div className={styles.btnBox}>
              <Popconfirm title="退出后内容将不能保存" okText="确定" cancelText="取消" onConfirm={() => { router.push('/enterpriseConfig') }}><Button type="default" size='large'>返 回</Button></Popconfirm>
              {/* <Button style={{ marginLeft: 10 }} size='large' onClick={this.save.bind(this)}>保 存</Button> */}
            </div>
          </div>
          <Form className={styles.topForm} layout='inline'>
            <FormItem label='企业角色'>
              <Select
                style={{ width: 500, marginRight: 15 }}
                placeholder="请选择标的物类型"
                onChange={(e) => this.permissionChange(e)}
                value={permissions || []}
                mode="multiple"
                labelInValue
              >
                {allPermissons && allPermissons.length > 0 ? allPermissons.map(item => (
                  <Option key={item.permissionId} value={item.permissionId} >
                    {item.permissionName}
                  </Option>
                )) : null}
              </Select>
              <Button type='primary' onClick={this.save.bind(this)} disabled={!showSave}>保存</Button>
            </FormItem>
          </Form>
        </div>
        <Power />
        <Check />
        <Log />
      </div>
    )
  }
}

//初始化规则配置的值
const initCloumnDate = (data = []) => {
  let obj = {};
  data.forEach(item => {
    obj[`data${item.id}`] = { triggerGrade: '', triggerType: '', updateColumnId: item.id, updateContent: '' }
  })
  return obj;
}

//后台传回的值处理成为规则配置的值
const handleCloumnDate = (data = []) => {
  let obj = {};
  data.forEach(item => {
    obj[`data${item.updateColumnId}`] = { triggerGrade: item.triggerGrade, triggerType: item.triggerType !== undefined ? item.triggerType + '' : '', updateColumnId: item.updateColumnId, updateContent: item.updateContent }
  })
  return obj;
}