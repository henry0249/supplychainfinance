import { Component } from 'react';
import { Card, Row, Col, Icon, Modal, message, Spin, Pagination, Statistic } from 'antd';
import router from 'umi/router';
import { Bar } from 'ant-design-pro/lib/Charts';
import { getAmountRank, getAmountChart } from '../../services';
import styles from './index.less';

const tabList = [{
  key: 'profit',
  tab: '利润额',
}, {
  key: 'sales',
  tab: '销售额',
}];

export default class Amount extends Component {
  state = {
    key: 'profit',
    rank: [],
    rankModal: [],
    page: {
      currentPage: 1,
      pageSize: 20,
      totalPage: 0,
      totalRecords: 0,
    },
    chart: [],
    loading: false,
    visible: false,
  };

  componentDidMount() {
    const { key } = this.state;
    this.getRank({ type: key, current: 1 })
    this.getChart({ type: key })
  }

  getRank = ({ type, current }) => {
    let _self = this;
    _self.setState({
      loading: true
    }, () => {
      getAmountRank({ type, current }).then(res => {
        if (res.code === 0) {
          if (current === 1) {
            _self.setState({
              rank: res.data.list || res.data,
              rankModal: res.data.list || res.data,
              page: res.page,
              loading: false
            })
          } else {
            _self.setState({
              rankModal: res.data.list || res.data,
              page: res.page,
              loading: false
            })
          }
        } else {
          _self.setState({
            rank: [],
            rankModal: [],
            page: {
              currentPage: 1,
              pageSize: 20,
              totalPage: 0,
              totalRecords: 0,
            },
            loading: false
          }, () => message.error('获取闭卷业务数据排行失败:' + res.msg))
        }
      })
    })
  }

  getChart = ({ type, companyName }) => {
    getAmountChart({ type, companyName }).then(res => {
      if (res && res.code === 0) {
        let newArr = [];
        res.data.forEach(item => {
          newArr.push({
            x: item.date,
            y: item.record
          })
        })
        this.setState({
          chart: newArr,
        })
      } else {
        this.setState({
          chart: []
        }, () => message.error('获取闭卷业务额度图表数据失败:' + res.msg))
      }
    })
  }

  onTabChange = (key, type) => {
    this.setState({ [type]: key });
    this.getRank({ type: key, current: 1 })
    this.getChart({ type: key })
  };

  showModal = () => {
    const { loading } = this.state;
    if (loading) {
      return message.warning("数据加载中，请稍等");
    } else {
      this.setState({ visible: true })
    }
  }

  onCurrentChange = (current) => {
    const { key } = this.state;
    this.getRank({ key, current })
  }

  render() {
    const { key, rank, rankModal, page, chart, loading, visible } = this.state;
    return (
      <div className={styles.container}>
        <Card
          activeTabKey={key}
          bodyStyle={{ position: 'relative' }}
          extra={
            <Icon
              onClick={this.showModal}
              style={{ position: 'absolute', top: 17.5, right: 24, fontSize: 18, cursor: 'pointer', zIndex: 100 }}
              type="arrows-alt"
            />
          }
          headStyle={{ position: 'relative' }}
          tabList={tabList}
          onTabChange={key => {
            this.onTabChange(key, 'key');
          }}
        >
          <Row gutter={60}>
            <Col md={10} lg={12} xl={15} xxl={17}>
              <Row className={styles.rowBox}>
                <span className={styles.title}>{key === 'profit' ? '闭卷业务利润额' : '业务销售额'}</span>
              </Row>
              <Row className={styles.barBox}>
                <Bar height={300} data={chart} />
              </Row>
            </Col>
            <Col md={14} lg={12} xl={9} xxl={7}>
              <Spin spinning={loading}>
                <Row>
                  <Col>
                    <span className={styles.title}>{key === 'profit' ? '利润' : '销售'}排名</span>
                  </Col>
                  <Col className={styles.ranking}>
                    {
                      rank.map((item, i) => {
                        if (i < 7) {
                          return <Row className={styles.item} key={i}>
                            <Col span={2}>
                              <div className={i < 3 ? styles.first : styles.num}>{i + 1}</div>
                            </Col>
                            <Col span={14}>
                              <span onClick={() => router.push(`/home?companyName=${item.name}`)} className={styles.name}>{item.name ? item.name : '无'}</span>
                            </Col>
                            <Col span={8}>
                              <Statistic
                                valueStyle={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.65)' }}
                                prefix='￥'
                                value={item.record ? (item.record).toFixed(2) : 0.00} />
                            </Col>
                          </Row>
                        }
                      })
                    }
                  </Col>
                </Row>
              </Spin>
            </Col>
          </Row>
        </Card>

        <Modal
          width={640}
          visible={visible}
          onCancel={() => this.setState({ visible: false })}
          footer={null}
        >
          {
            rankModal.map((item, i) =>
              <Row gutter={20} key={i} style={{ marginTop: 16 }}>
                <Col span={2}>
                  <div className={((page.currentPage - 1) * page.pageSize) + i < 3 ? styles.first : styles.num}>{((page.currentPage - 1) * page.pageSize) + i + 1}</div>
                </Col>
                <Col span={15}>
                  <span onClick={() => router.push(`/home?companyName=${item.name}`)} className={styles.name}>{item.name ? item.name : '无'}</span>
                </Col>
                <Col span={7}>
                  <Statistic valueStyle={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.65)' }} prefix='￥' value={item.record ? (item.record).toFixed(2) : 0.00} />
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
        </Modal>
      </div >
    )
  }
}