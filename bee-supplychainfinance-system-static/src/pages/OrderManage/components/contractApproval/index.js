import React, { Component, Fragment } from 'react'
import style from './index.less'
import { Breadcrumb } from 'antd';
import { ContractManage, Oplog, SignedContract } from './components'
import { withRouter } from "react-router";
import { connect } from "dva";

@withRouter
@connect(({ global,appContract}) => ({
  global,appContract
}))
class Index extends Component {
  constructor(props){
    super(props)
    this.state={
      orderId:this.props.location.query.id,
      roleId: this.props.global.role.roleId,
      type: sessionStorage.businessMode
    }
  }
  render() {
    const {orderId,roleId,type}=this.state;
    return (
      <div className={style.box}>
        <ContractManage orderId={orderId} roleId={roleId} type={type}/>
        <SignedContract orderId={orderId} roleId={roleId} type={type}/>
        <Oplog orderId={orderId} roleId={roleId} type={type}/>
      </div>
    )
  }
}
export default Index