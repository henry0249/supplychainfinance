import { Component } from 'react';
import { Card, Row, Col, Spin, Statistic, message } from 'antd';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import { getAmountRank } from '../../services';
import styles from './index.less';

@withRouter
export default class TotalProfit extends Component {
  state = {
    list: [],
    totle: 0,
    loading: false
  }

  componentDidMount() {
    const { companyName } = this.props.location.query;
    this.getRank({ type: 'profit', current: 1, companyName: companyName })
  }

  getRank = (params) => {
    let _self = this;
    _self.setState({
      loading: true
    }, () => {
      getAmountRank(params).then(res => {
        if (res && res.code === 0) {
          _self.setState({
            list: res.data.list || res.data,
            totle: res.data.total,
            loading: false
          })
        } else {
          _self.setState({
            list: [],
            totle: 0,
            loading: false
          }, () => message.error('获取各闭卷业务利润排名失败:' + res.msg))
        }
      })
    })
  }

  handlePush = (item) => {
    sessionStorage.setItem("businessMode", item.type);
    router.push(`/orderManage/details?enterType=1&key=details&id=${item.orderId}`)
  }

  render() {
    const { list, totle, loading } = this.state;
    return (
      <Spin spinning={loading}>
        <div className={styles.container} style={{
          ...this.props.styles,
        }}>
          <Card
            bordered={false}
          >
            <Row>
              <Col>
                <Statistic
                  title={<span style={{ fontSize: 14, color: '#434343' }}>业务总利润</span>}
                  prefix='￥'
                  value={totle ? totle.toFixed(2) : 0.00}
                  valueStyle={{ fontSize: 30, color: '#434343' }} />
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ marginTop: 24 }} >
              <Col>
                <Row>
                  <span className={styles.title}>各闭卷业务利润排名</span>
                </Row>
                {
                  list.map((item, i) => {
                    if (i < 7) {
                      return <Row gutter={10} style={{ marginTop: 22 }} key={i}>
                        <Col span={3}>
                          <div className={i < 3 ? styles.firstNumber : styles.normalNumber}>{i + 1}</div>
                        </Col>
                        <Col span={14}>
                          <span onClick={this.handlePush.bind(this, item)} className={styles.name}>{item.name}</span>
                        </Col>
                        <Col span={7}>
                          <Statistic valueStyle={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.65)' }} prefix='￥' value={item.record ? (item.record).toFixed(2) : 0.00} />
                        </Col>
                      </Row>
                    }
                  })
                }
              </Col>
            </Row>
          </Card>
        </div >
      </Spin>
    )
  }
}