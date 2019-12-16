import { Component } from 'react';
import { Card, Row, Col, Icon, Form, DatePicker, Modal, Statistic, Spin, message, Pagination } from 'antd';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import G2 from '@antv/g2';
import { getRiskData, getRiskChart } from '../../services';
import styles from './index.less';

const FormItem = Form.Item;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

const defs = {
  'date': {
    alias: '时间'
  },
  'riskExposure': {
    alias: '金额'
  }
};

@withRouter
@Form.create()
export default class Risk extends Component {
  constructor(props) {
    super();
    this.state = {
      list: [],
      listModal: [],
      total: 0,
      page: {
        currentPage: 1,
        pageSize: 20,
        totalPage: 0,
        totalRecords: 0,
      },
      dateType: 3, //0-日，1-周，2-月，3-年
      loading: false,
      visible: false,
    }
    this.chart = null;
  }

  componentDidMount() {
    const { companyName } = this.props.location.query;
    this.chart = new G2.Chart({
      container: 'riskChart',
      forceFit: true,
      height: 288,
      padding: [16, 30, 28, 70]
    });
    if (companyName) {
      this.getData({ current: 1, companyName: companyName })
      this.getChart({ dateType: 3, companyName: companyName })
    } else {
      this.getData({ current: 1 })
      this.getChart({ dateType: 3 })
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.location !== this.props.location) {
      if (nextProps.location && nextProps.location.query && nextProps.location.query.companyName) {
        this.getData({ current: 1, companyName: nextProps.location.query.companyName })
        this.getChart({ dateType: 3, companyName: nextProps.location.query.companyName })
      } else {
        this.getData({ current: 1 })
        this.getChart({ dateType: 3 })
      }
    }
  }

  renderChart(data) {
    this.chart.source(data, defs);
    // this.chart.scale({
    //   value: {
    //     min: 10000
    //   },
    //   year: {
    //     range: [0, 1]
    //   }
    // });
    this.chart.axis('riskExposure', {
      label: {
        formatter: function formatter(val) {
          if (val > 100000000) {
            return (val / 100000000).toFixed(1) + '亿';
          } else if (val > 10000) {
            return (val / 10000).toFixed(1) + '万';
          } else if (val < -100000000) {
            return (val / 100000000).toFixed(1) + '亿';
          } else if (val < -10000) {
            return (val / 10000).toFixed(1) + '万';
          } else {
            return val
          }
        }
      }
    });
    // this.chart.tooltip({
    //   crosshairs: {
    //     type: 'line'
    //   }
    // });
    this.chart.area().position('date*riskExposure').color('#1890ff').shape('smooth');
    this.chart.line().position('date*riskExposure').color('#1890ff').size(2).shape('smooth');
    this.chart.render();
  }

  getData = (params) => {
    this.setState({
      visible: false
    }, () => {
      getRiskData(params).then(res => {
        if (res && res.code === 0) {
          this.setState({
            list: res.data.riskExposureInfoDTOS,
            listModal: res.data.riskExposureInfoDTOS,
            total: res.data.todayRiskExposure,
            page: res.page,
          })
        } else {
          this.setState({
            list: [],
            listModal: [],
            total: 0,
            page: {
              currentPage: 1,
              pageSize: 20,
              totalPage: 0,
              totalRecords: 0,
            }
          })
          message.error('获取风险敞口列表失败:' + res.msg);
        }
      })
    })
  }

  getChart = (params) => {
    let _self = this;
    _self.setState({
      loading: true
    }, () => {
      getRiskChart(params).then(res => {
        if (res && res.code === 0) {
          _self.setState({
            dateType: params.dateType,
            loading: false
          })
          _self.renderChart(res.data)
        } else {
          _self.setState({
            dateType: 3,
            loading: false
          })
          _self.renderChart([])
          message.error('获取风险敞口图表数据失败:' + res.msg);
        }
      })
    })
  }

  getDataAndShowModal = (params, visible) => {
    const { companyName } = this.props.location.query;
    let newParmas = params;
    if (companyName) {
      newParmas['companyName'] = companyName;
    }
    getRiskData(newParmas).then(res => {
      if (res && res.code === 0) {
        this.setState({
          listModal: res.data.riskExposureInfoDTOS,
          total: res.data.todayRiskExposure,
          page: res.page,
          visible: visible
        })
      } else {
        this.setState({
          listModal: [],
          total: 0,
          page: {
            currentPage: 1,
            pageSize: 20,
            totalPage: 0,
            totalRecords: 0,
          }
        })
        message.error('获取风险敞口列表失败:' + res.msg);
      }
    })
  }

  handleQuery = (key) => {
    const { resetFields } = this.props.form;
    const { companyName } = this.props.location.query;
    let newParmas = {
      dateType: key
    }
    if (companyName) {
      newParmas['companyName'] = companyName;
    }
    resetFields();
    this.getChart(newParmas);
  }

  timeChange = (date, dateString) => {
    const { companyName } = this.props.location.query;
    let newParmas = {
      startTime: dateString[0],
      endTime: dateString[1]
    };
    if (companyName) {
      newParmas['companyName'] = companyName;
    }
    this.getChart(newParmas);
  }

  showModal = () => {
    this.getDataAndShowModal({ current: 1 }, true)
  }

  hideModal = () => {
    this.getDataAndShowModal({ current: 1 }, false)
  }

  onCurrentChange = (current) => {
    this.getDataAndShowModal({ current }, true)
  }

  handlePush = (item) => {
    const { companyName } = this.props.location.query;
    if (companyName) {
      sessionStorage.setItem("businessMode", item.type);
      if (!item.id) {
        message.error('数据异常，请检查数据')
      } else {
        router.push(`/orderManage/details?enterType=1&key=details&id=${item.id}`)
      }
    } else {
      router.push(`/home?companyName=${item.name}`)
    }
  }

  render() {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { list, listModal, total, page, dateType, loading, visible } = this.state;
    return (
      <div className={styles.container}>
        <Spin spinning={loading}>
          <Card
            bordered={false}
            title={
              <div className={styles.titleBox}>
                风险敞口
              <Icon onClick={this.showModal.bind(this)} style={{ fontSize: 18, cursor: 'pointer' }} type="arrows-alt" />
              </div>
            }
          >
            <Row type='flex' align='bottom'>
              <Col>
                <Statistic title="今日总风险敞口" prefix='￥' value={total ? total.toFixed(2) : 0.00} valueStyle={{ fontSize: 24, color: '#1890FF' }} />
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col xxl={6} xl={7} lg={8} md={9} sm={24} xs={24}>
                <Row>
                  <span className={styles.riskTitle}>风险敞口排名</span>
                </Row>
                {
                  list.map((item, i) => {
                    if (i < 7) {
                      return <Row gutter={10} style={{ marginTop: 22 }} key={i}>
                        <Col span={2}>
                          <div className={i < 3 ? styles.firstNumber : styles.normalNumber}>{i + 1}</div>
                        </Col>
                        <Col span={13}>
                          <span onClick={this.handlePush.bind(this, item)} className={styles.name}>{item.name}</span>
                        </Col>
                        <Col span={9}>
                          <Statistic valueStyle={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.65)' }} prefix='￥' value={item.riskExposure ? (item.riskExposure).toFixed(2) : 0.00} />
                        </Col>
                      </Row>
                    }
                  })
                }
              </Col>
              <Col xxl={18} xl={17} lg={16} md={15} sm={24} xs={24}>
                <Row>
                  <div className={styles.buttonBox}>
                    <div className={styles.btn}>
                      <span className={dateType === 0 ? styles.span : ''} onClick={this.handleQuery.bind(this, 0)}>今日</span>
                      <span className={dateType === 1 ? styles.span : ''} onClick={this.handleQuery.bind(this, 1)}>本周</span>
                      <span className={dateType === 2 ? styles.span : ''} onClick={this.handleQuery.bind(this, 2)}>本月</span>
                      <span className={dateType === 3 ? styles.span : ''} onClick={this.handleQuery.bind(this, 3)}>全年</span>
                    </div>
                    <Form style={{ marginLeft: 24 }}>
                      <FormItem style={{ marginBottom: 0 }}>
                        {getFieldDecorator('time')(
                          <RangePicker allowClear={false} format='YYYY-MM-DD' onChange={this.timeChange} />
                        )}
                      </FormItem>
                    </Form>
                  </div>
                </Row>
                <Row>
                  <div id="riskChart"></div>
                </Row>
              </Col>
            </Row>
          </Card>
        </Spin>

        <Modal
          width={640}
          visible={visible}
          onCancel={this.hideModal}
          footer={null}
        >
          <Spin spinning={loading}>
            <Row type='flex' align='bottom'>
              <Col>
                <Statistic title="今日总风险敞口" prefix='￥' value={total ? total.toFixed(2) : 0.00} valueStyle={{ fontSize: 24, color: '#1890FF' }} />
              </Col>
            </Row>
            {
              listModal.map((item, i) =>
                <Row gutter={10} style={{ marginTop: 22 }} key={i}>
                  <Col span={2}>
                    <div className={((page.currentPage - 1) * page.pageSize) + i < 3 ? styles.firstNumber : styles.normalNumber}>{((page.currentPage - 1) * page.pageSize) + i + 1}</div>
                  </Col>
                  <Col span={15}>
                    <span onClick={this.handlePush.bind(this, item)} className={styles.name}>{item.name}</span>
                  </Col>
                  <Col span={7}>
                    <Statistic valueStyle={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.65)' }} prefix='￥' value={item.riskExposure ? (item.riskExposure).toFixed(2) : 0.00} />
                  </Col>
                </Row>
              )
            }
            <div className={styles.pagination}>
              <Pagination
                defaultCurrent={1}
                defaultPageSize={20}
                current={page.currentPage}
                pageSize={page.pageSize}
                total={page.totalRecords}
                size="small"
                onChange={this.onCurrentChange}
              />
            </div>
          </Spin>
        </Modal>
      </div >
    )
  }
}