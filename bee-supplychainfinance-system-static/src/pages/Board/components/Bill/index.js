import React, { Component } from 'react'
import { Card, Statistic, Modal, Icon, Row, Col, message } from 'antd';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import G2 from '@antv/g2';
import styles from './index.less';
import { connect } from 'dva';
import { getBillData, getBillList, getInvoice } from '../../services'
import BoardModal from '../BoardModal';

@withRouter
@connect(({ global, loading }) => ({
  global,
  loading: loading.effects
}))
export default class RiskRatio extends Component {
  constructor(props) {
    super(props)
    this.state = {
      salesType: 'all',
      currentTabKey: '',
      visible: false,
      statisticData: {},
      chartData: [],
      list: [],
      page: {
        pageSize: 20,
        currentPage: 1,
        totalPage: 0,
        totalRecords: 0
      },
      type: 0
    }
    this._chart = null
  }

  //数据初始化
  init(params) {
    getBillData(params).then(res => {
      if (res.code === 0) {
        this.setState({
          statisticData: res.data
        })
      }
    });
    getInvoice(params).then(res => {
      if (res.code === 0) {
        this.setState({
          chartData: this.chartDataHandle(res.data)
        }, () => {
          this._chart.source(this.state.chartData);
          this._chart.render()
        })
      }
    });
  }

  getList = (type, currentPage) => {
    const { companyName } = this.props.location.query;
    getBillList({ type, currentPage, companyName }).then(res => {
      if (res.code === 0) {
        this.setState({
          visible: true,
          list: res.data,
          page: res.page,
          type
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
          type
        }, () => message.error(res.msg))
      }
    })
  }

  chartDataHandle(data) {
    let invoices = [];
    let ticketCollections = []
    data.forEach(element => {
      invoices.push({ monthDate: element.monthDate, '金额': element.invoice, name: '已开票金额' })
      ticketCollections.push({ monthDate: element.monthDate, '金额': element.ticketCollection, name: '已收票金额' })
    });
    return [...invoices, ...ticketCollections]
  }

  //业务类型修改
  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value
    })
  }

  componentDidMount() {
    const { companyName } = this.props.location.query;
    let params = {};
    if (companyName) {
      params['companyName'] = companyName
    }
    this._chart = new G2.Chart({
      container: 'billContainer',
      forceFit: true,
      height: 320,
      padding: [20, 40, 60, 80]
    });
    this._chart.interval().position('monthDate*金额').color('name').adjust([{
      type: 'dodge',
      marginRatio: 1 / 32
    }]);
    this.init(params)
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.location !== this.props.location) {
      if (nextProps.location && nextProps.location.query && nextProps.location.query.companyName) {
        this.init({ companyName: nextProps.location.query.companyName })
      } else {
        this.init({})
      }
    }
  }

  modalControl(visible, type) {
    const { companyName } = this.props.location.query;
    if (visible) {
      getBillData({ companyName: companyName }).then(res => {
        if (res.code === 0) {
          this.setState({
            statisticData: res.data
          })
        }
      });
      this.getList(type, 1)
    } else
      this.setState({ visible })
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
    const { visible, statisticData, list, type, page } = this.state
    const { statistics } = this.props
    const statisticsProps = { xxl: 5, xl: 5, lg: 5, md: 12, sm: 12, xs: 24 }
    const modalData = []
    // console.log(statistics)
    type === 0 ? modalData.push({
      title: statistics[0].name,
      value: statisticData[statistics[0].key]
    }, {
        title: statistics[1].name,
        value: statisticData[statistics[1].key],
        color: '#1890FF'
      }) : modalData.push({
        title: statistics[2].name,
        value: statisticData[statistics[2].key],
      }, {
          title: statistics[3].name,
          value: statisticData[statistics[3].key],
          color: '#FF6600'
        })
    return (
      <div
        className={styles.bill}
        style={{
          ...this.props.style,
        }}
      >
        <Card
          className={styles.card}
          bordered={false}
          title={'票据管理'}
          style={{ height: '100%' }}
        >
          <Row className={styles.statistics}>
            {
              statistics && statistics.length ? statistics.map((item, index) =>
                <Col offset={document.documentElement.clientWidth > 1200 && index === 2 ? 4 : 0} {...statisticsProps} style={{ cursor: 'pointer' }} key={item.key} onClick={this.modalControl.bind(this, true, index < 2 ? 0 : 1)}>
                  <Statistic
                    valueStyle={index % 2 === 0 ? { color: 'rgba(0, 0, 0, 0.85)' } : index < 2 ? { color: '#1890FF' } : { color: '#FF6600' }}
                    title={item.name}
                    prefix='￥'
                    value={statisticData[item.key] ? (statisticData[item.key]).toFixed(2) : 0.00} />
                </Col>
              ) : null
            }
          </Row>
          <div className={styles.content}>
            <div id='billContainer'></div>
          </div>
        </Card>

        <BoardModal
          visible={visible}
          width={720}
          onCancel={() => this.modalControl(false)}
          onSkip={(item) => this.handlePush.bind(this, item)}
          statisticData={modalData}
          data={list}
          page={page}
          paginationProps={{
            defaultCurrent: 1,
            defaultPageSize: 20,
            current: page.currentPage,
            pageSize: page.pageSize,
            total: page.totalRecords,
            size: "small",
            onChange: (nextpage) => this.getList(type, nextpage)
          }}
          valueColor={type === 0 ? '#1890ff' : '#FF6600'}
        />
      </div>
    )
  }
}

RiskRatio.defaultProps = {
  statistics: [{ name: '已开发票金额', key: 'alreadyPayBill' }, { name: '应开发票金额', key: 'shouldPayBill' }, { name: '已收发票金额', key: 'alreadyReceivedBill' }
    , { name: '应收发票金额', key: 'shouldReceivedBill' }]
}
