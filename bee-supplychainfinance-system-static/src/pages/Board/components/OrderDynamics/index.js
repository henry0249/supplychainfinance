import React, { Component } from 'react'
import { Row, Col, Card, List, Avatar } from 'antd';
import moment from "moment"
import styles from "./index.less"
import Link from "umi/link"
import Router from "umi/router"

export default class OrderDynamics extends Component {
  renderActivities() {
    let {
      list
    } = this.props;
    return list.map((curr, i) => {
      curr.key = i
      return curr
    }).map(item => {
      const events = () => {
        return (
          <a onClick={() => this.jumpClick(item)}>
            {item.operateType}
          </a >
        );
      }
      return (
        <List.Item key={item.key}>
          <List.Item.Meta
            // avatar={<Avatar src={item.userPhoto} />}
            title={
              <span style={{fontWeight: 650,color:" rgba(0, 0, 0, 0.847058823529412)"}}>
                <i className={styles.username}>{item.userName}</i>
                &nbsp;在 
                <a onClick={() => this.jumpClick(item)}>{item.orderId}</a> 中
                <span className={styles.event}> {events()}</span>
              </span>
            }
            description={
              <span className={styles.datetime} title={item.updatedAt}>
                {moment(item.operateTime).fromNow()}
              </span>
            }
          />
        </List.Item>
      );
    });
  }
  jumpClick = (item) => {
    sessionStorage.setItem("businessMode", item.businessType)
    Router.push(`/orderManage/details?enterType=1&key=details&id=${item.orderId}`)
  }
  render() {
    const obj = {
      minHeight: "400px",
      textAlign: "center",
      lineHeight: "400px",
    }
    
    return (
      <div className={styles.OrderDynamics}>
        <Card
          bodyStyle={{ padding: 0}}
          bordered={false}
          className={styles.activeCard}
          title="订单动态"
          style={{width: "72.6667%"}}
        >
          <List size="large">
            <div className={styles.activitiesList} style={this.renderActivities().length === 0 ? {textAlign: "center"} :{}}>
              {
                this.renderActivities().length === 0 
                ?
                <span style={obj}>暂无数据</span>
                :
                this.renderActivities()
              }
            </div>
          </List>
        </Card>
  </div>
    )
  }
}

OrderDynamics.defaultProps = {
  list: JSON.parse(`[{
    "orderId": "1901290025011020",
    "userName": null,
    "operateType": "转移货权",
    "operateTime": "2019-01-29 11:15:48",
    "userPhoto": null
  }, {
    "orderId": "1901290025011020",
    "userName": "结算专员_测试账号",
    "operateType": "转移货权",
    "operateTime": "2019-01-29 11:15:15",
    "userPhoto": null
  }, {
    "orderId": "1901290025011020",
    "userName": "结算专员_测试账号",
    "operateType": "支付货款",
    "operateTime": "2019-01-29 11:14:47",
    "userPhoto": null
  }, {
    "orderId": "1901290025011020",
    "userName": "风控负责人_测试账号",
    "operateType": "签订合同",
    "operateTime": "2019-01-29 11:12:01",
    "userPhoto": null
  }, {
    "orderId": "1901290025011020",
    "userName": "蚂蚁",
    "operateType": "签订合同",
    "operateTime": "2019-01-29 11:10:40",
    "userPhoto": null
  }]`)
}
