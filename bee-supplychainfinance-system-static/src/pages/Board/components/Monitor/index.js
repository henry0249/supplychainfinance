import { Component } from 'react';
import { Card, Row, Col, Divider, Statistic, message } from 'antd';
import G2 from '@antv/g2';
import { getOrderCount, getMonitorChart } from '../../services';
import styles from './index.less';

export default class Monitor extends Component {
  constructor(props) {
    super();
    this.state = {
      data: {
        doingOrders: 0,
        warningOrders: 0
      }
    }
    this.chart = null;
  }

  componentDidMount() {
    this.chart = new G2.Chart({
      container: 'monitorChart',
      forceFit: true,
      height: 320,
      padding: [20, 40, 60, 40]
    });
    getOrderCount().then(res => {
      if (res && res.code === 0) {
        this.setState({
          data: res.data
        })
      } else {
        message.error('获取监控管理当日订单统计数失败:' + res.msg);
      }
    })
    getMonitorChart().then(res => {
      if (res && res.code === 0) {
        let arr = [];
        res.data.forEach(item => {
          arr.push({
            dateTime: item.dateTime,
            key: '进行中的订单',
            data: item.doingOrders,
          }, {
              dateTime: item.dateTime,
              key: '有预警的订单',
              data: item.warningOrders,
            })
        })
        this.renderChart(arr)
      } else {
        message.error('获取监控管理图表数据失败:' + res.msg);
      }
    })
  }

  renderChart(arr) {
    this.chart.source(arr);
    this.chart.line().position('dateTime*data').color('key');
    this.chart.render();
  }

  render() {
    const { data } = this.state;
    return (
      <div className={styles.container}>
        <Card
          bordered={false}
          title='监控管理'
        >
          <Row>
            <Col xxl={3} xl={4} lg={5} md={6} sm={7} xs={24}>
              <Row>
                <Col style={{ display: 'flex', marginBottom: 32 }} sm={24} xs={12}>
                  <Divider type="vertical" style={{ width: 4, height: 79, marginRight: 12, backgroundColor: '#1890FF' }} />
                  <Statistic title="进行中的订单" value={data.doingOrders} valueStyle={{ fontSize: 36, color: '#333333' }} />
                </Col>
                <Col style={{ display: 'flex', marginBottom: 32 }} sm={24} xs={12}>
                  <Divider type="vertical" style={{ width: 4, height: 79, marginRight: 12, backgroundColor: '#00FF00' }} />
                  <Statistic title="有预警的订单" value={data.warningOrders} valueStyle={{ fontSize: 36, color: '#333333' }} />
                </Col>
              </Row>
            </Col>
            <Col xxl={21} xl={20} lg={19} md={18} sm={17} xs={24}>
              <div id="monitorChart"></div>
            </Col>
          </Row>
        </Card>
      </div >
    )
  }
}