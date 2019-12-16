import React, { Component } from 'react'
import { Card, Radio, Row, Col, Modal, Icon, message } from 'antd';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import styles from './index.less'
import { getSettlementMoneyChart } from '../../services'
import { titleToUpperCase } from '@/utils/utils'

@withRouter
export default class RiskRatio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'all',
      modeModal: 'all',
      data: {},
      rank: [],
      dataModal: {},
      rankModal: [],
      visible: false,
    };
    this._Chart = null;
    this._ModalChart = null;
  }

  componentDidMount() {
    const { companyName } = this.props.location.query;
    if (companyName) {
      this.getBaseData({ detail: 0, companyName: companyName }, false)
    } else {
      this.getBaseData({ detail: 0 }, false)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      if (nextProps.location && nextProps.location.query && nextProps.location.query.companyName) {
        this.getBaseData({ detail: 0, companyName: nextProps.location.query.companyName }, true)
      } else {
        this.getBaseData({ detail: 0 }, true)
      }
    }
  }

  //数据初始化
  getBaseData(params, repaint) {
    const { mode } = this.state
    getSettlementMoneyChart(params).then(res => {
      if (res && res.code === 0) {
        const { rank, chart } = dataHandle(res.data, mode)
        this.renderChart('_Chart', chart, res.data[`money${titleToUpperCase(mode)}`], repaint)
        this.setState({
          data: res.data,
          rank
        })
      } else {
        message.error('获取资金占用比失败:' + res.msg)
      }
    })
  }

  //modal层数据初始化
  getModalData(params, visible) {
    let _self = this
    const { modeModal } = _self.state;
    _self.setState({
      visible
    }, () => {
      getSettlementMoneyChart(params).then(res => {
        if (res && res.code === 0) {
          const { rank, chart } = dataHandle(res.data, modeModal)
          _self.renderChart('_ModalChart', chart, res.data[`money${titleToUpperCase(modeModal)}`], false)
          _self.setState({
            dataModal: res.data,
            rankModal: rank,
            modalMount: false
          })
        } else {
          message.error('获取所有资金占用比失败:' + res.msg)
        }
      })
    })
  }

  renderChart = (name, data, totle, repaint) => {
    if (repaint) {
      this[name].destroy();
    }
    this[name] = new G2.Chart({
      container: name,
      forceFit: true,
      height: 300,
      padding: [20, 40, 20, 40]
    });
    this[name].source(data);
    this[name].coord('theta', {
      innerRadius: 0.75
    });
    this[name].guide().html({
      position: ['50%', '50%'],
      html: `<div style="color:rgba(0,0,0,0.45);font-size: 14px;text-align: center;width: 10em;">被占用资金<br><span style="color:rgba(0,0,0,0.85);font-size:24px">${totle ? totle : 0}</span></div>`,
      alignX: 'middle',
      alignY: 'middle'
    });
    this[name].tooltip({
      showTitle: false
    });
    this[name].intervalStack().position('countMoney').color('name*color', (name, color) => color).shape('sliceShape');
    this[name].render();
  }

  //业务类型修改
  handleChangeSalesType = (value, detail) => {
    const { data, dataModal } = this.state
    this.setState({
      [`${detail ? 'modeModal' : 'mode'}`]: value
    }, () => {
      // 1为modal层，0为原始层
      if (detail) {
        const { rank, chart } = dataHandle(dataModal, value)
        this.renderChart('_ModalChart', chart, dataModal[`money${titleToUpperCase(value)}`], true)
        this.setState({
          rankModal: rank
        })
      } else {
        const { rank, chart } = dataHandle(data, value)
        this.renderChart('_Chart', chart, data[`money${titleToUpperCase(value)}`], true)
        this.setState({
          rank
        })
      }
    })
  }

  //弹出层显隐控制
  modalControl(visible) {
    const { companyName } = this.props.location.query;
    if (visible) {
      if (companyName) {
        this.getModalData({ detail: 1, companyName: companyName }, visible)
      } else {
        this.getModalData({ detail: 1 }, visible)
      }
    } else {
      this.setState({
        visible
      }, () => {
        this._ModalChart.destroy();
      })
    }
  }

  handlePush = (item) => {
    const { companyName } = this.props.location.query;
    const { visible } = this.state;
    if (visible) {
      this.setState({
        visible: false
      }, () => {
        this._ModalChart.destroy();
        if (item.name) {
          if (item.name === '其他') {
            message.warning('此为剩余企业总称，无法查看')
          } else {
            router.push(`/home?companyName=${item.name}`)
          }
        } else {
          message.warning('无法获取到企业信息')
        }
      })
    } else {
      if (companyName) {
        if (item.type === 3) {
          message.warning('全部业务分类无法查看订单详情！')
        } else {
          if (item.name === '其他') {
            message.warning('此为剩余订单总称，无法查看')
          } else if (item.orderId) {
            sessionStorage.setItem("businessMode", item.type);
            router.push(`/orderManage/details?enterType=1&key=details&id=${item.orderId}`)
          } else {
            message.warning('无法获取到订单信息')
          }
        }
      } else {
        if (item.name) {
          if (item.name === '其他') {
            message.warning('此为剩余企业总称，无法查看')
          } else {
            router.push(`/home?companyName=${item.name}`)
          }
        } else {
          message.warning('无法获取到企业信息')
        }
      }
    }
  }

  render() {
    const { isMobile } = this.props;
    const { companyName } = this.props.location.query;
    const { mode, modeModal, data, rank, dataModal, rankModal, visible } = this.state;
    return (
      <div
        className={styles.RiskRatio}
        style={{
          ...this.props.styles,
        }}
      >
        <Card
          bordered={false}
          title={companyName ? '各业务资金占比' : '各企业资金占比'}
          style={{ height: '100%' }}
          extra={
            !companyName ?
              <Icon type="arrows-alt" onClick={() => this.modalControl(true)} className={styles.spread} style={{ fontSize: 20 }} /> : null
          }
        >
          <Row>
            <div className={styles.salesTypeRadio}>
              <Radio.Group
                value={mode}
                onChange={e => this.handleChangeSalesType(e.target.value, 0)}
              >
                <Radio.Button value='all'>全部业务</Radio.Button>
                <Radio.Button value='buy'>委托采购</Radio.Button>
                <Radio.Button value='sale'>委托销售</Radio.Button>
                <Radio.Button value='storage'>金融仓储</Radio.Button>
                <Radio.Button value='largeBuy'>大企业委托采购</Radio.Button>
              </Radio.Group>
            </div>
          </Row>
          <Row type="flex" align='middle' style={{ marginTop: 24 }} gutter={32}>
            <Col xs={24} sm={24} md={24} lg={13} xl={13} xxl={13}>
              <div id='_Chart'></div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={11} xl={11} xxl={11}>
              {
                rank.map((item, i) => <Row type='flex' align='middle' gutter={12} className={styles.rankBox} key={i}>
                  <Col span={2}>
                    <div className={styles.circle} style={{ backgroundColor: item.color }}></div>
                  </Col>
                  <Col span={10}>
                    <span onClick={this.handlePush.bind(this, item)} className={styles.name}>{item.name ? item.name : '无'}</span>
                  </Col>
                  <Col span={4}>
                    <span className={styles.percent}>{item.percent}%</span>
                  </Col>
                  <Col span={8}>
                    <span className={styles.count}>￥{item.countMoney !== undefined && item.countMoney !== null ? item.countMoney : '未知'}</span>
                  </Col>
                </Row>)
              }
            </Col>
          </Row>
        </Card>

        <Modal
          visible={visible}
          centered
          forceRender={true}
          width={isMobile ? document.documentElement.clientWidth - 30 : document.documentElement.clientWidth * 0.7}
          onCancel={this.modalControl.bind(this, false)}
          footer={null}
        >
          <Card
            bordered={false}
            title={companyName ? '各业务资金占比' : '各企业资金占比'}
            style={{ height: '100%' }}
            extra={
              companyName ?
                <Icon type="arrows-alt" onClick={() => modalControl(true)} className={styles.spread} style={{ fontSize: 20 }} /> : null
            }
          >
            <Row>
              <div className={styles.salesTypeRadio}>
                <Radio.Group
                  value={modeModal}
                  onChange={e => this.handleChangeSalesType(e.target.value, 1)}
                >
                  <Radio.Button value='all'>全部业务</Radio.Button>
                  <Radio.Button value='buy'>委托采购</Radio.Button>
                  <Radio.Button value='sale'>委托销售</Radio.Button>
                  <Radio.Button value='storage'>金融仓储</Radio.Button>
                  <Radio.Button value='largeBuy'>大企业委托采购</Radio.Button>
                </Radio.Group>
              </div>
            </Row>
            <Row type="flex" align='middle' style={{ marginTop: 24 }} gutter={32}>
              <Col xs={24} sm={24} md={24} lg={13} xl={13} xxl={13}>
                <div id='_ModalChart'></div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={11} xl={11} xxl={11}>
                {
                  rankModal.map((item, i) => <Row type='flex' align='middle' gutter={12} className={styles.rankBox} key={"modal_" + i}>
                    <Col span={2}>
                      <div className={styles.circle} style={{ backgroundColor: item.color }}></div>
                    </Col>
                    <Col span={10}>
                      <span onClick={this.handlePush.bind(this, item)} className={styles.name}>{item.name ? item.name : '无'}</span>
                    </Col>
                    <Col span={4}>
                      <span className={styles.percent}>{item.percent > 0 ? item.percent : 0}%</span>
                    </Col>
                    <Col span={8}>
                      <span className={styles.count}>￥{item.countMoney !== undefined && item.countMoney !== null ? item.countMoney : '未知'}</span>
                    </Col>
                  </Row>)
                }
              </Col>
            </Row>
          </Card>
        </Modal>
      </div>
    )
  }
}

//图表数据处理
const dataHandle = (data, mode) => {
  let rank = [], chart = [];
  let index = 0, all = 0;
  let totle = 0;
  data[mode].forEach((item, i) => {
    if (item.countMoney > 0) {
      index = i;
      totle += item.countMoney
    }
  })
  data[mode].forEach((item, i) => {
    // 计算最后一个的百分比
    let color = renderColor();
    if (index !== i && item.countMoney > 0 && totle !== 0) {
      all += Number((item.countMoney * 100 / totle).toFixed(2))
    }
    rank.push({
      ...item,
      color: color,
      percent: item.countMoney > 0 && totle !== 0 ? (
        index === i ? (100 - all).toFixed(2) : (item.countMoney * 100 / totle).toFixed(2)
      ) : 0
    })
    if (item.countMoney >= 0) {
      chart.push({
        ...item,
        color: color,
        percent: item.countMoney > 0 && totle !== 0 ? (
          index === i ? (100 - all).toFixed(2) : (item.countMoney * 100 / totle).toFixed(2)
        ) : 0
      })
    }
  })
  return { rank, chart }
}

const renderColor = () => {
  let colors = ['4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += colors[Math.floor(Math.random() * 12)]
  }
  return color
}