import React, { Component } from 'react'
import styles from "./index.less"
import { Avatar, Row, Col } from 'antd';
import img from "@/assets/yay.jpg"

export default class HeaderOne extends Component {
  state = {
    now: ""
  }

  componentDidMount() {
    this.getTime()
  }

  getTime = () => {
    const now = new Date().getHours();
    this.setState({
      now,
    });
  };

  render() {
    const { funds, backlog, name, user, img, type } = this.props.data
    const { now } = this.state
    const blockStyle = {
      header: { xxl: 4, xl: 4, lg: 6, md: 8, sm: 6, xs: 6 },
      text: { xxl: 12, xl: 12, lg: 18, md: 16, sm: 18, xs: 18 },
      count: { xxl: 8, xl: 8, lg: 24, md: 24, sm: 24, xs: 24 },
    }
    return (
      <div className={styles.headerWrap}>
        <Row className={styles.HeaderContent}>
          <Col {...blockStyle.header}>
            <div className={styles.avatar}>
              <Avatar size="large" src={img} />
            </div></Col>
          <Col  {...blockStyle.text}>
            <div className={styles.content}>
              <div className={styles.contentTitle}>
                {
                  now < 12 && now >= 6 ? (
                    <span>上午好</span>
                  ) : now >= 12 && now < 19 ? (
                    <span>下午好</span>
                  ) : (
                        <span>晚上好</span>
                      )
                }
                ，{name ? name : ""}
                ，祝你开心每一天！
            </div>
            </div>
          </Col><Col  {...blockStyle.count}>
            <div className={styles.extraContent}>
              <div className={styles.statItem}>
                <p>待办事项</p>
                <p className={styles.titleNum}>{backlog}</p>
              </div>
              <div className={styles.statItem}>
                <p>
                  {
                    type === 1
                      ?
                      "占用资金"
                      :
                      "涉及资金"
                  }
                </p>
                <p className={styles.titleNum}>
                  {funds}
                </p>
              </div>
              {/* <div className={styles.statItem}>
              <p>项目访问</p>
              <p className={styles.titleNum}>2,223</p>
            </div> */}
            </div>
          </Col> </Row>
      </div>
    )
  }
}

HeaderOne.defaultProps = {
  data: {
    backlog: 342, //代办事项
    funds: 34, //占用资金
    img: {}, //用户头像
    user: 1, //用户角色
    name: "mengmengchihci" //用户名
  }
}
