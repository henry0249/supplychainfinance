import React, { Component } from 'react';
import styles from './index.less';
import { Card, message } from 'antd';
import SaleHeader from './saleHeader' // 销售头部
import ParentSaleHeader from '../../components/parentSaleHeader'; // 母订单销售头部
import NewBuyHeader from './newBuyHeader' // 新采购头部
import ParentNewBuyHeader from '../../components/parentNewBuyHeader' // 母订单新采购头部
import Bill from './bill'; //票据
import Settlement from './settlement'; // 结算单
import { connect } from 'dva';
import withRouter from 'umi/withRouter';

const tabListNoTitle = [{
  key: 'bill',
  tab: '票据'
}, {
  key: 'settlement',
  tab: '结算单'
}]

@withRouter
@connect(({ global, detail, loading }) => ({
  global,
  detail,
  loading: loading.effects
}))
export default class Index extends Component {
  state = {
    key: 'bill',
    modalKey: null,
    invoiceType: null,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { id, key, modalKey, invoiceType, orderId } = this.props.location.query;
    // 获取订单详情
    dispatch({
      type: 'detail/getOrderInfo',
      payload: orderId
    })
    //获取子订单信息
    dispatch({
      type: 'detail/getChildOrderInfo',
      payload: id,
      success: (res) => {
        if (res.data.type === 4 && res.data.orderStatus === 0) {
          dispatch({
            type: 'check/queryPay',
            payload: id,
            error: (msg) => {
              message.error(`查询委托付款函确认情况失败：` + msg)
            }
          })
        }
      },
      error: (msg) => {
        message.error('获取订单详情失败：' + msg)
      }
    })
    if (key) {
      this.setState({
        key
      })
    }
    if (modalKey) {
      this.setState({
        modalKey
      })
    }
    if (invoiceType !== undefined && invoiceType !== null) {
      this.setState({
        invoiceType
      })
    }
  }

  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  }

  onShowModal = (key, invoiceType) => {
    this.setState({
      modalKey: key,
      invoiceType,
    })
  }

  onHideModal = () => {
    this.setState({
      modalKey: null
    })
  }

  onChangeTab = (key) => {
    this.setState({
      key
    })
  }

  render() {
    const { key, modalKey, invoiceType } = this.state;
    return (
      <div className={styles.container}>
        {
          sessionStorage.businessMode === '1' ? <ParentSaleHeader /> : <ParentNewBuyHeader />
        }
        <div className={styles.content}>
          {
            sessionStorage.businessMode === '1' ? <SaleHeader onShowModal={this.onShowModal} onChangeTab={this.onChangeTab} /> :
              <NewBuyHeader onShowModal={this.onShowModal} onChangeTab={this.onChangeTab} />
          }

          <Card
            style={{ width: '100%', border: 'none' }}
            bodyStyle={{ padding: 0, backgroundColor: '#f0f2f5' }}
            tabList={tabListNoTitle}
            activeTabKey={key}
            onTabChange={(key) => { this.onTabChange(key, 'key'); }}
          >
            {
              key === 'bill' ? <Bill modalKey={modalKey} invoiceType={invoiceType} onHideModal={this.onHideModal} /> :
                key === 'settlement' ? <Settlement /> : null
            }
          </Card>
        </div>
      </div>
    )
  }
}