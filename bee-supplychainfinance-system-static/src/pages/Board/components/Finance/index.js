import { Component } from 'react';
import { Card, Row, Col, Radio, Statistic, message, Form } from 'antd';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import styles from "./index.less";
import { connect } from 'dva';
import G2 from '@antv/g2';
import { getFinancialChart, getFinancialData, getListInfo } from '../../services';
import 'ant-design-pro/dist/ant-design-pro.css';
import BoardModal from '../BoardModal';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const defs = {
  'monthDate': {
    alias: '月份'
  },
  'payment': {
    alias: '金额'
  }
};

@Form.create()
@withRouter
@connect(({ global, loading }) => ({
  global,
  loading: loading.effects
}))
export default class Finance extends Component {
  constructor(props) {
    super();
    this.state = {
      key: 2, // 2付款，1收款
      type: null, // pay付款列表，rec收款列表
      visible: false,
      data: {
        businessShouldPay: 0, //业务应付款
        businessShouldReceived: 0, //业务应收款
        totalCollection: 0, //总收款金额
        totalPayment: 0, //总付款金额
      },
      list: [],
      page: {
        pageSize: 20,
        currentPage: 1,
        totalPage: 0,
        totalRecords: 0
      }
    }
    this.chart = null;
  }

  componentDidMount() {
    const { companyName } = this.props.location.query;
    const { key } = this.state;
    this.chart = new G2.Chart({
      container: 'financeChart',
      forceFit: true,
      height: 320,
      padding: [20, 40, 60, 80]
    });
    if (companyName) {
      this.getFinData({ companyName: companyName })
      this.getChartData({ type: key, companyName: companyName })
    } else {
      this.getFinData({})
      this.getChartData({ type: key })
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    const { key } = this.state;
    if (nextProps.location !== this.props.location) {
      if (nextProps.location && nextProps.location.query && nextProps.location.query.companyName) {
        this.getFinData({ companyName: nextProps.location.query.companyName })
        this.getChartData({ type: key, companyName: nextProps.location.query.companyName })
      } else {
        this.getFinData({})
        this.getChartData({ type: key })
      }
    }
  }

  getChartData = (params) => {
    getFinancialChart(params).then(res => {
      if (res && res.code === 0) {
        this.chart.source(res.data, defs);
        this.setState({
          key: params.type
        })
      } else {
        message.error('获取财务管理图表信息失败:' + res.msg)
        this.chart.source([], defs);
        this.setState({
          key: 2
        })
      }
      this.chart.axis('payment', {
        label: {
          formatter: function formatter(val) {
            return (val / 1000).toFixed(1) + 'k';
          }
        }
      });
      this.chart.line().position('monthDate*payment');
      this.chart.point().position('monthDate*payment').tooltip('monthDate*payment');
      this.chart.render();
    })
  }

  getFinData = (params) => {
    getFinancialData(params).then(res => {
      if (res && res.code === 0) {
        this.setState({
          data: res.data
        })
      } else {
        this.setState({
          data: {
            businessShouldPay: 0,
            businessShouldReceived: 0,
            totalCollection: 0,
            totalPayment: 0,
          }
        }, () => message.error('获取财务中心数据失败:' + res.msg))
      }
    })
  }

  getList = (params) => {
    getListInfo(params).then(res => {
      if (res && res.code === 0) {
        this.setState({
          visible: true,
          list: res.data,
          page: res.page,
          type: params.type
        })
      } else {
        this.setState({
          list: [],
          page: {
            pageSize: 20,
            currentPage: 1,
            totalPage: 0,
            totalRecords: 0
          },
          type: params.type
        }, () => message.error('获取财务中心列表失败:' + res.msg))
      }
    })
  }

  showModal = (type, current) => {
    const { companyName } = this.props.location.query;
    if (companyName) {
      this.getFinData({ companyName: companyName })
      this.getList({ type: type, current: current, companyName: companyName })
    } else {
      this.getFinData({})
      this.getList({ type: type, current: current })
    }
  }

  onChange = (e) => {
    const { companyName } = this.props.location.query;
    this.chart.clear(); // 清理所有
    if (companyName) {
      this.getChartData({ type: e.target.value, companyName: companyName })
    } else {
      this.getChartData({ type: e.target.value })
    }
  }

  onCurrentChange = (current) => {
    const { companyName } = this.props.location.query;
    const { type } = this.state;
    if (companyName) {
      this.getList({ type: type, current: current, companyName: companyName })
    } else {
      this.getList({ type: type, current: current })
    }
  }

  handlePush = (item) => {
    const { role } = this.props.global;
    const { companyName } = this.props.location.query;
    this.setState({
      visible: false
    }, () => {
      if (role.roleId === 1 || role.roleId === 2 || companyName) {
        sessionStorage.setItem("businessMode", item.type);
        router.push(`/orderManage/details?enterType=1&key=details&id=${item.id}`)
      } else {
        router.push(`/home?companyName=${item.name}`)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { key, type, visible, data, list, page } = this.state;
    const statisticsProps = { xxl: 5, xl: 5, lg: 5, md: 12, sm: 12, xs: 24 }
    let statisticData = [];
    if (data) {
      if (type === 'pay') {
        statisticData.push({
          title: '总付款金额',
          value: data.totalPayment
        }, {
            title: '业务应付款',
            value: data.businessShouldPay,
            color: '#1890FF'
          })
      } else {
        statisticData.push({
          title: '总收款金额',
          value: data.totalCollection
        }, {
            title: '业务应收款',
            value: data.businessShouldReceived,
            color: '#FF6600'
          })
      }
    }
    return (
      <div className={styles.container}>
        <Card
          bordered={false}
          title='财务管理'
        >
          <Row className={styles.pricesBox}>
            <Col {...statisticsProps} onClick={this.showModal.bind(this, 'pay', 1)}>
              <Statistic
                title='总付款金额'
                prefix="￥"
                value={data.totalPayment ? (data.totalPayment).toFixed(2) : 0.00}
                valueStyle={{ color: 'rgba(0, 0, 0, 0.85)' }}
              />
            </Col>
            <Col  {...statisticsProps} onClick={this.showModal.bind(this, 'pay', 1)}>
              <Statistic
                title='业务应付款'
                prefix="￥"
                value={data.businessShouldPay ? (data.businessShouldPay).toFixed(2) : 0.00}
                valueStyle={{ color: '#1890FF' }}
              />
            </Col>
            <Col offset={document.documentElement.clientWidth > 1200 ? 4 : 0} {...statisticsProps} onClick={this.showModal.bind(this, 'rec', 1)}>
              <Statistic
                title='总收款金额'
                prefix="￥"
                value={data.totalCollection ? (data.totalCollection).toFixed(2) : 0.00}
                valueStyle={{ color: 'rgba(0, 0, 0, 0.85)' }}
              />
            </Col>
            <Col {...statisticsProps} onClick={this.showModal.bind(this, 'rec', 1)}>
              <Statistic
                title='业务应收款'
                prefix="￥"
                value={data.businessShouldReceived ? (data.businessShouldReceived).toFixed(2) : 0.00}
                valueStyle={{ color: '#FF6600' }}
              />
            </Col>
          </Row>

          <div className={styles.button}>
            <Form>
              <FormItem>
                {getFieldDecorator('key', {
                  initialValue: key
                })(
                  <RadioGroup onChange={this.onChange}>
                    <RadioButton value={2}>付款金额</RadioButton>
                    <RadioButton value={1}>收款金额</RadioButton>
                  </RadioGroup>
                )}
              </FormItem>
            </Form>
          </div>
          <div id="financeChart"></div>
        </Card>

        <BoardModal
          visible={visible}
          width={720}
          onCancel={() => this.setState({ visible: false, list: [] })}
          onSkip={(item) => this.handlePush.bind(this, item)}
          statisticData={statisticData}
          data={list}
          page={page}
          paginationProps={{
            defaultCurrent: 1,
            defaultPageSize: 20,
            current: page.currentPage,
            pageSize: page.pageSize,
            total: page.totalRecords,
            size: "small",
            onChange: this.onCurrentChange
          }}
          valueColor={type === 'pay' ? '#1890ff' : '#FF6600'}
        />
      </div>
    )
  }
}