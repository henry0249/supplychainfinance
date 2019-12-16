import React, { Component, Fragment } from "react";
import style from "./index.less";
import { Breadcrumb, Alert } from "antd";
import { ContractManage, Oplog, SignedContract } from "./components";
import { withRouter } from "react-router";
import { connect } from "dva";

@withRouter
@connect(({ orderManage, global }) => ({
  orderManage,
  global
}))

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: this.props.location.query.id,
      roleId: this.props.global.role.roleId,
      type: sessionStorage.businessMode,
      reason: null
    };
  }
  //获取退回原因
  refuseReason = reason => {
    this.setState({
      reason: reason
    });
  };
  render() {
    const { orderId, roleId, type, reason } = this.state;
    return (
      <Fragment>
        {reason &&
        (roleId === 1 || roleId === 2 || roleId === 3 || roleId === 4) ? (
          <div className={style.warningBack}>
            <Alert
              message="该订单合同被退回!"
              description={<Fragment>
                <div style={{float: "left"}}>退回原因：</div><pre>{reason}</pre>
              </Fragment>}
              type="warning"
              showIcon
            />
          </div>
        ) : null}
        <div className={style.box}>
          <ContractManage
            orderId={orderId}
            roleId={roleId}
            type={type}
            getReason={this.refuseReason.bind(this)}
          />
          <SignedContract orderId={orderId} roleId={roleId} type={type} />
          {roleId === 1 || roleId === 2 || roleId === 3 ? null : (
            <Oplog orderId={orderId} roleId={roleId} type={type} />
          )}
        </div>
      </Fragment>
    );
  }
}
export default index;
