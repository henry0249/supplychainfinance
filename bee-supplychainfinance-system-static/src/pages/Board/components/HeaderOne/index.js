import React, { Component } from 'react'
import styles from "./index.less"
import { Avatar, Row, Col } from 'antd';


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
    const { userData, otherData } = this.props;
    const { now } = this.state;
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
              <Avatar size="large" src={userData.img} />
            </div>
          </Col>
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
                ，{userData.name ? userData.name : ""}
                ，祝你开心每一天！
            </div>
            </div>
          </Col>
          {
            Object.keys(otherData).length !== 0 &&
            <Col  {...blockStyle.count}>
              <div className={styles.extraContent}>
                {
                  otherData && otherData.length && otherData.map((item, index) =>
                    <div className={styles.statItem} key={index}>
                      <p>{item.label}</p>
                      <p className={styles.titleNum}>{item.value}</p>
                    </div>
                  )
                }
              </div>
            </Col>
          }
        </Row>
      </div>
    )
  }
}