import React, { Component } from 'react';
import styles from './index.less';
import { Card, message, Badge } from 'antd';
import BuyHeader from '../components/buyHeader' // 头部
import SaleHeader from '../components/saleHeader' // 头部
import StorageHeader from '../components/storageHeader' // 头部
import NewBuyHeader from '../components/newBuyHeader' // 头部
import Detail from '../components/detail'; //详情
import ContractApproval from '../components/contractApproval'; //审批合同
import ContractOrder from '../components/contractOrder'; //订单合同
import Bill from '../components/bill'; //票据
import Settlement from '../components/settlement'; // 结算单
import Logistics from '../components/logistics'; // 物流信息
import Warning from '../components/warning'; // 预警信息
import ApprovalResult from '../components/approvalResult'; // 审批结果
import Children from '../components/children'; // 审批结果
import { connect } from 'dva';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import { getOrderTodo } from '../../../services'

@withRouter
@connect(({ global, detail, loading }) => ({
  global,
  detail,
  loading: loading.effects
}))
export default class Index extends Component {
  state = {
    tabListNoTitle: [{
      key: 'details',
      tab: '详情'
    }, {
      key: 'contract',
      tab: '合同'
    }, {
      key: 'bill',
      tab: '票据'
    }],
    key: 'details',
    modalKey: null,
    invoiceType: null,
    letterType: null,
    todo: []
  }

  componentDidMount() {
    // getTodo().then(resp=>{
    //   if(resp && resp.code === 0){
    //     this.setState({
    //       todo:resp.data
    //     })
    //   }
    // })
    // const { id } = this.props.location.query
    const { dispatch } = this.props;
    const { role } = this.props.global;
    const { key, id, modalKey, invoiceType, letterType } = this.props.location.query;
    let { tabListNoTitle } = this.state;
    if (sessionStorage.businessMode !== '1' && sessionStorage.businessMode !== '4') {
      tabListNoTitle.push({
        key: 'settlement',
        tab: '结算单'
      })
    }

    if (sessionStorage.businessMode !== '2') {
      if (role.permissionId === 4) {
        tabListNoTitle.push({
          key: 'logistics',
          tab: '物流信息'
        }, {
            key: 'warning',
            tab: '风控预警'
          })
      }
    } else {
      // 金融仓储没有物流信息
      if (role.permissionId === 4) {
        tabListNoTitle.push({
          key: 'warning',
          tab: '风控预警'
        })
      }
    }

    if (role.permissionId === 2 || role.permissionId === 4 || role.permissionId === 5 || role.permissionId === 7) {
      tabListNoTitle.push({
        key: 'approval',
        tab: '审批结果'
      })
    }

    if (sessionStorage.businessMode === '1' || sessionStorage.businessMode === '4') {
      tabListNoTitle.push({
        key: 'children',
        tab: '发货单'
      })
    }

    //获取订单信息
    dispatch({
      type: 'detail/getOrderInfo',
      payload: id,
      success: (res) => {
        if (res.type === 0 && res.orderStatus === 4) {
          dispatch({
            type: 'check/queryPay',
            payload: id,
            success: () => {
            },
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

    let newTab = null
    getOrderTodo(sessionStorage.businessMode, id).then(resp => {
      if (resp && resp.code === 0) {
        for (let i in resp.data) {
          if (i === 'riskWarningDTO') {
            resp.data['warning'] = resp.data[i]
            delete resp.data[i]
          }
        }
        try {
          newTab = tabListNoTitle.map(item => {
            for (let k in resp.data) {
              if (item.key === k && resp.data[k].isHaveRecord === 1) {
                return {
                  ...item, tab: <Badge status="error" offset={[4, 0]}>
                    <span>{item.tab}</span>
                  </Badge>
                }
              } else {
                return { ...item }
              }
            }
          })
          this.setState({
            tabListNoTitle: newTab,
            key
          })
        } catch (error) {

        }
      }
    })


    if (letterType !== undefined && letterType !== null) {
      this.setState({
        letterType
      })
    }
  }

  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  }

  onShowModal = (key, invoiceType, letterType) => {
    this.setState({
      modalKey: key,
      invoiceType,
      letterType
    })
  }

  onHideModal = () => {
    const { pathname, query } = this.props.location;
    let url = pathname + '?';
    Object.keys(query).forEach((key, index) => {
      if (key !== 'modalKey' && key !== 'invoiceType' && key !== 'letterType') {
        if (index !== Object.keys(query).length - 1) {
          url += `${key}=${query[key]}&`
        } else {
          url += `${key}=${query[key]}`
        }
      }
    })

    this.setState({
      modalKey: null,
      invoiceType: null,
      letterType: null
    }, () => {
      router.replace(url)
    })
  }

  onChangeTab = (key) => {
    this.setState({
      key
    })
  }

  render() {
    const { enterType } = this.props.location.query;
    const { tabListNoTitle, key, modalKey, invoiceType, letterType } = this.state;
    return (
      <div className={styles.container}>
        {
          sessionStorage.businessMode === '0' ? <BuyHeader onShowModal={this.onShowModal} onChangeTab={this.onChangeTab} /> :
            sessionStorage.businessMode === '1' ? <SaleHeader onShowModal={this.onShowModal} onChangeTab={this.onChangeTab} /> :
              sessionStorage.businessMode === '2' ? <StorageHeader onShowModal={this.onShowModal} onChangeTab={this.onChangeTab} /> :
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
            key === 'details' ? <Detail /> :
              key === 'contract' && parseInt(enterType) === 0 ? <ContractApproval /> :
                key === 'contract' && parseInt(enterType) === 1 ? <ContractOrder /> :
                  key === 'bill' ? <Bill modalKey={modalKey} invoiceType={invoiceType} letterType={letterType} onHideModal={this.onHideModal} /> :
                    key === 'settlement' ? <Settlement /> :
                      key === 'logistics' ? <Logistics /> :
                        key === 'warning' ? <Warning /> :
                          key === 'approval' ? <ApprovalResult /> :
                            key === 'children' ? <Children /> : ''
          }
        </Card>
      </div>
    )
  }
}