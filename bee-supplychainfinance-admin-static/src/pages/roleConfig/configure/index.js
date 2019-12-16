import React, { Component, Fragment } from 'react';
import styles from '../index.less';
import { Breadcrumb, Form, Button, Input, Select, message, Popconfirm, Icon } from 'antd';
import router from 'umi/router'
import Link from 'umi/link';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
import { updateById, } from '../services'
import Log from './log'
import Power from './power'

const FormItem = Form.Item;
const Option = Select.Option;
@withRouter

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSave: false,
      permissionName: props.location.query.name || '',
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      totalRecords: 0,
    }
    this.id = props.location.query.id || false
    this.name = props.location.query.name || false
  }

  componentDidMount() {
    // this.dataInit()
  }


  //选中
  roleNameChange(permissionName) {
    this.setState({ permissionName });
  }

  save() {
    const { permissionName } = this.state;
    let params = { permissionId: this.id, permissionName }
    updateById(params).then(res => {
      if (res.code === 0) {
        message.success(res.msg)
        this.name = permissionName;
        router.replace(`/roleConfig/configure?id=${this.id}&name=${permissionName}`)
        this.setState({
          showSave: false
        })
      }
      else {
        message.error(res.msg)
      }
    })
  }

  showSave(showSave) {
    this.setState({
      showSave
    })
  }

  render() {
    const { showSave, allPermissons, permissionName, permissions } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.crumb}>
          <Breadcrumb className={styles.breadcrumb}>
            <Breadcrumb.Item><Link to={'/roleConfig'}>企业角色列表</Link></Breadcrumb.Item>
            <Breadcrumb.Item>企业角色详情</Breadcrumb.Item>
          </Breadcrumb>
          <div className={styles.title}>
            <Icon style={{ fontSize: 28 }} type="home" theme="twoTone" />
            {!showSave ? <Fragment><span className={styles.name}>{this.name}</span>
              <span className={styles.showSave} onClick={this.showSave.bind(this, true)}>修改名称</span></Fragment>
              :
              <Fragment><Input className={styles.input} value={permissionName} onChange={(e) => this.roleNameChange(e.target.value)} />
                <Button type='primary' onClick={this.save.bind(this)}>保存</Button><Button onClick={this.showSave.bind(this, false)}>取消</Button></Fragment>}
            <div className={styles.btnBox}>
              <Popconfirm title="退出后内容将不能保存" okText="确定" cancelText="取消" onConfirm={() => { router.push('/roleConfig') }}><Button type="default" size='large'>返 回</Button></Popconfirm>
              {/* <Button style={{ marginLeft: 10 }} size='large' onClick={this.save.bind(this)}>保 存</Button> */}
            </div>
          </div>
        </div>
        <Power id={this.id} />
        <Log />
      </div>
    )
  }
}
