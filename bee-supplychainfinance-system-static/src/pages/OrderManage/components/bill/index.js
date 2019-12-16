import React, { Component } from 'react';
import styles from './index.less';
import { Collapse, Button, Modal, message, Table, Form, Input, Icon } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import withRouter from "umi/withRouter";
import TransferModal from './components/transferModal/index';
import InvoiceModal from './components/invoiceModal/index';
import BailModal from './components/bailModal/index';
import DelayModal from './components/delayModal/index';
import GoodsModal from './components/goodsModal/index';
import WarehouseModal from './components/warehouseModal/index';
import PaymentModal from './components/paymentModal/index';
import DeliveryModal from './components/deliveryModal/index';
import LetterModal from './components/letterModal/index';
import pdf from '@/assets/pdf.png';
import zip from '@/assets/zip.png';

const FormItem = Form.Item;
const { TextArea } = Input;
const Panel = Collapse.Panel;
const columns = [{
  title: '操作类型',
  dataIndex: 'operateType',
  key: 'operateType',
}, {
  title: '操作人',
  dataIndex: 'operateName',
  key: 'operateName',
}, {
  title: '执行结果',
  dataIndex: 'operateResult',
  key: 'operateResult',
}, {
  title: '操作时间',
  dataIndex: 'operateTime',
  key: 'operateTime',
}];

// 王尧 - 票据组件
@withRouter
@Form.create()
@connect(({ global, detail, bill, loading }) => ({
  global,
  detail,
  bill,
  loading: loading.effects
}))
export default class Bill extends Component {
  state = {
    activeKeys: [],
    type: '', // 退回证明类型
    id: '', // 退回证明业务ID
    modalId: null,
    visible: false, // 退回modal
    visibleCheck: false, // 审核退回modal
    visibleTransfer: false, // 提交转移证明modal
    visibleInvoice: false, // 提交开票证明modal
    visibleBail: false, // 提交保证金证明modal
    visibleDelay: false, // 提交延期提货证明modal
    visibleGoods: false, // 提交提货证明modal
    visibleWarehouse: false, // 提交仓单证明modal
    visiblePayment: false, // 提交付款证明modal
    visibleDelivery: false, // 提交放货证明modal
    visibleLetter: false, // 提交采购函证明modal
    billInvoiceType: null, //开票类型
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    const { enterType, id } = this.props.location.query;
    let { activeKeys } = this.state;
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
    // 获取所有类型票据
    dispatch({
      type: 'bill/getInfo',
      payload: id,
      success: (data) => {
        data && Object.keys(data).forEach(key => {
          key && data[key] && data[key].forEach((i, index) => {
            // 只是默认展开待审核、已退回的
            if (i.isPass !== 1) {
              activeKeys.push(key + "_" + index);
            }
          })
        });
        this.setState({
          activeKeys
        });
      },
      error: (msg) => {
        message.error('获取所有票据失败：' + msg);
      }
    })
    // 获取票据的退回信息
    dispatch({
      type: 'bill/getRefused',
      payload: id,
      error: (msg) => {
        message.error('获取票据退回信息失败：' + msg);
      }
    })
    // 获取票据操作日志
    if (enterType === '1') {
      dispatch({
        type: 'bill/getLogs',
        payload: `${id}&currentPage=1&pageSize=20`,
        error: (msg) => {
          message.error('获取票据操作日志失败：' + msg);
        }
      })
    }
  }

  confirmBill = (type, id, e) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    if (type === 'invoice') {
      // 确认开票接口
      dispatch({
        type: 'check/confirmInvoice',
        payload: {
          invoiceBusinessId: id
        },
        success: () => {
          this.getData();
          message.success("确认开票证明成功");
        },
        error: (msg) => {
          message.error('确认开票证明失败：' + msg);
        }
      })
    } else if (type === 'transfer') {
      // 确认货权转移接口
      if (sessionStorage.businessMode === '0') {
        Modal.confirm({
          keyboard: false,
          title: '请选择是否终止发货？',
          content: <p>如果选择继续发货，流程将回到上一步<Icon onClick={() => Modal.destroyAll()} type="close" style={{ fontSize: 16, color: 'rgba(0,0,0,0.45)', position: 'absolute', right: 12, top: 12, cursor: 'pointer' }} /></p>,
          okText: '终止发货',
          okButtonProps: {
            type: "primary",
            onClick: this.stopShip.bind(this, 1, id)
          },
          cancelText: '继续发货',
          cancelButtonProps: {
            onClick: this.stopShip.bind(this, 0, id)
          }
        });
      } else {
        dispatch({
          type: 'check/confirmTransfer',
          payload: {
            goodsPowerBusinessId: id,
          },
          success: () => {
            this.getData();
            message.success("确认货权转移证明成功");
          },
          error: (msg) => {
            message.error('确认货权转移证明失败：' + msg);
          }
        })
      }
    } else if (type === 'payment') {
      // 确认付款证明接口
      dispatch({
        type: 'check/paymentSure',
        payload: {
          paymentBusinessId: id
        },
        success: () => {
          this.getData();
          message.success("确认放款证明成功");
        },
        error: (msg) => {
          message.error('确认放款证明失败：' + msg);
        }
      })
    }
  }

  stopShip = (type, id, e) => {
    e.stopPropagation();
    const { dispatch } = this.props;

    dispatch({
      type: 'check/confirmTransfer',
      payload: {
        goodsPowerBusinessId: id,
        terminateStatus: type
      },
      success: () => {
        this.getData();
        Modal.destroyAll()
        message.success("确认货权转移证明成功");
      },
      error: (msg) => {
        Modal.destroyAll()
        message.error('确认货权转移证明失败：' + msg);
      }
    })
  }

  showReturnModal = (type, id, e) => {
    e.stopPropagation();
    this.setState({
      type,
      id,
      visible: true
    })
  }

  return = () => {
    const { dispatch } = this.props;
    const { validateFields } = this.props.form;
    const { type, id } = this.state;
    validateFields((err, values) => {

      if (!err) {
        if (type === 'invoice') {
          // 退回开票证明
          let params = {
            invoiceBusinessId: id, // 发票业务ID
            refuseReason: values.recentlyReason // 发票退回原因
          }
          dispatch({
            type: 'check/returnInvoice',
            payload: params,
            success: () => {
              this.getData();
              this.setState({
                visible: false,
              }, () => {
                message.success('退回开票证明成功');
              })
            },
            error: (msg) => {
              this.setState({
                visible: false,
              }, () => {
                message.error('退回开票证明失败：' + msg);
              })
            }
          })
        } else if (type === 'transfer') {
          // 退回货权转移证明
          let params = {
            goodsPowerBusinessId: id, // 货权转移证明业务ID
            recentlyReason: values.recentlyReason // 发票退回原因
          }
          dispatch({
            type: 'check/returnTransfer',
            payload: params,
            success: () => {
              this.getData();
              this.setState({
                visible: false,
              }, () => {
                message.success('退回货权转移证明成功')
              })
            },
            error: (msg) => {
              this.setState({
                visible: false,
              }, () => {
                message.error(msg)
              })
            }
          })
        } else if (type === 'payment') {
          // 退回放款证明
          let params = {
            paymentBusinessId: id, // 放款证明业务ID
            recentlyReason: values.recentlyReason // 发票退回原因
          }
          dispatch({
            type: 'check/paymentReturn',
            payload: params,
            success: () => {
              this.getData();
              this.setState({
                visible: false,
              }, () => {
                message.success('退回放款证明成功');
              })
            },
            error: (msg) => {
              this.setState({
                visible: false,
              }, () => {
                message.error('退回放款证明失败：' + msg);
              })
            }
          })
        }
      }
    })
  }

  showModal = (key, id, billInvoiceType, e) => {
    this.setState({
      [key]: true,
      modalId: id,
      billInvoiceType
    })
  }

  handlePreview = (file) => {
    // 预览票据文件
    let url = '';
    if (file.name.indexOf('.rar') > -1 || file.name.indexOf('.zip') > -1) {
      return message.warning('压缩文件暂不支持预览');
    } else {
      url = file.response.data.access_url;
    }
    // console.log(file)
    window.open(url)
  }

  // 用于重置modalKey、modalId的组件回调
  callback = (key) => {
    const { onHideModal } = this.props;
    onHideModal && onHideModal();
    this.setState({
      [key]: false,
      modalId: null
    })
  }

  // 票据操作日志的分页回调
  onChange = (current) => {
    const { dispatch } = this.props;
    const { id } = this.props.location.query;
    dispatch({
      type: 'bill/getLogs',
      payload: `${id}&currentPage=${current}&pageSize=20`,
      error: (msg) => {
        message.error('获取票据操作日志失败：' + msg);
      }
    })
  }

  showConfirm = (e) => {
    e.stopPropagation();
    Modal.confirm({
      title: '请确认所有审核意见',
      content: '提交后将无法修改任何信息',
      okText: '继续',
      cancelText: '取消',
      onOk: this.passOk
    })
  }

  passOk = () => {
    const { dispatch } = this.props;
    const { data } = this.props.bill;
    const { type } = this.props.location.query;
    let businessId;

    if (type === 'deferred') {
      data && Object.keys(data).forEach(key => {
        data[key].forEach((i, index) => {
          if (key === 'delayApplyDTO' && i.isPass === 2) {
            businessId = i.delayApplyBusinessId
          }
        })
      });
      let params = {
        delayApplyBusinessId: businessId,// 延期提货申请id
        isPass: 1	// 是否通过，0否，1是
      }
      dispatch({
        type: 'check/checkDelay',
        payload: params,
        success: () => {
          router.push(`/result?type=deferred&id=${businessId}&status=0&isManage=1`)
        },
        error: (msg) => {
          message.error("审批延期提货失败：" + msg);
        }
      })
    } else if (type === 'goods') {
      data && Object.keys(data).forEach(key => {
        data[key].forEach(i => {
          if (key === 'pickUpApplyDTO' && i.isPass === 2) {
            businessId = i.pickUpBusinessId
          }
        })
      });
      let params = {
        pickUpBusinessId: businessId, // 订单id
        isPass: 1, // 是否通过，0否，1是
      }
      dispatch({
        type: 'check/checkGoods',
        payload: params,
        success: () => {
          router.push(`/result?type=goods&id=${businessId}&status=0&isManage=1`)
        },
        error: (msg) => {
          message.error("审批提货申请失败：" + msg);
        }
      })
    } else if (type === 'bail') {
      data && Object.keys(data).forEach(key => {
        data[key].forEach((i, index) => {
          if (key === 'bondProofDTO' && i.isPass === 2) {
            businessId = i.bondBusinessId
          }
        })
      });
      let params = {
        bondBusinessId: businessId, // 订单id
        isPass: 1, // 是否通过，0否，1是
      }
      dispatch({
        type: 'check/checkBail',
        payload: params,
        success: () => {
          router.push(`/result?type=bail&id=${businessId}&status=0&isManage=1`)
        },
        error: (msg) => {
          message.error("审批保证金失败：" + msg);
        }
      })
    } else if (type === 'warehouse') {
      data && Object.keys(data).forEach(key => {
        data[key].forEach((i, index) => {
          if (key === 'houseProofDTO' && i.isPass === 2) {
            businessId = i.storehouseBillId
          }
        })
      });
      let params = {
        storehouseBillId: businessId, // 订单id
        isPass: 1, // 是否通过，0否，1是
      }
      dispatch({
        type: 'check/checkStorage',
        payload: params,
        success: () => {
          router.push(`/result?type=warehouse&id=${businessId}&status=0&isManage=1`)
        },
        error: (msg) => {
          message.error("审批仓单失败：" + msg);
        }
      })
    }
  }

  returnOk = () => {
    const { dispatch } = this.props;
    const { data } = this.props.bill;
    const { validateFields } = this.props.form;
    const { type } = this.props.location.query;
    let businessId;
    validateFields((err, values) => {
      if (!err) {
        if (type === 'deferred') {
          data && Object.keys(data).forEach(key => {
            data[key].forEach((i, index) => {
              if (key === 'delayApplyDTO' && i.isPass === 2) {
                businessId = i.delayApplyBusinessId
              }
            })
          });
          let params = {
            delayApplyBusinessId: businessId,// 延期提货申请id
            isPass: 0,	// 是否通过，0否，1是
            recentlyReason: values.recentlyReason //驳回原因
          }
          dispatch({
            type: 'check/checkDelay',
            payload: params,
            success: () => {
              router.push(`/result?type=deferred&id=${businessId}&status=1&isManage=1`)
            },
            error: (msg) => {
              this.setState({
                visible: false
              }, () => message.error("审批延期提货失败：" + msg))
            }
          })
        } else if (type === 'goods') {
          data && Object.keys(data).forEach(key => {
            data[key].forEach((i, index) => {
              if (key === 'pickUpApplyDTO' && i.isPass === 2) {
                businessId = i.pickUpBusinessId
              }
            })
          });
          let params = {
            pickUpBusinessId: businessId,// 延期提货申请id
            isPass: 0,	// 是否通过，0否，1是
            recentlyReason: values.recentlyReason //驳回原因
          }
          dispatch({
            type: 'check/checkGoods',
            payload: params,
            success: () => {
              router.push(`/result?type=goods&id=${businessId}&status=1&isManage=1`)
            },
            error: (msg) => {
              this.setState({
                visible: false
              }, () => message.error("审批提货申请失败：" + msg))
            }
          })
        } else if (type === 'bail') {
          data && Object.keys(data).forEach(key => {
            data[key].forEach((i, index) => {
              if (key === 'bondProofDTO' && i.isPass === 2) {
                businessId = i.bondBusinessId
              }
            })
          });
          let params = {
            bondBusinessId: businessId, // 订单id
            isPass: 0, // 是否通过，0否，1是
            recentlyReason: values.recentlyReason //驳回原因
          }
          dispatch({
            type: 'check/checkBail',
            payload: params,
            success: () => {
              router.push(`/result?type=bail&id=${businessId}&status=1&isManage=1`)
            },
            error: (msg) => {
              this.setState({
                visible: false
              }, () => message.error("审批保证金失败：" + msg))
            }
          })
        } else if (type === 'warehouse') {
          data && Object.keys(data).forEach(key => {
            data[key].forEach((i, index) => {
              if (key === 'houseProofDTO' && i.isPass === 2) {
                businessId = i.storehouseBillId
              }
            })
          });
          let params = {
            storehouseBillId: businessId, // 订单id
            isPass: 0, // 是否通过，0否，1是
            recentlyReason: values.recentlyReason //驳回原因
          }
          dispatch({
            type: 'check/checkStorage',
            payload: params,
            success: () => {
              router.push(`/result?type=warehouse&id=${businessId}&status=1&isManage=1`)
            },
            error: (msg) => {
              this.setState({
                visible: false
              }, () => message.error("审批仓单失败：" + msg))
            }
          })
        }
      }
    })
  }

  render() {
    const { modalKey, invoiceType, letterType } = this.props;
    const { role } = this.props.global;
    const { orderInfo } = this.props.detail;
    const { data, refusedInfo, logs, logsPages } = this.props.bill;
    const { getFieldDecorator } = this.props.form;
    const { enterType, type, id } = this.props.location.query;
    const {
      activeKeys,
      modalId,
      visible,
      visibleCheck,
      visibleTransfer,
      visibleInvoice,
      visibleBail,
      visibleDelay,
      visibleGoods,
      visibleWarehouse,
      visiblePayment,
      visibleDelivery,
      visibleLetter,
      billInvoiceType,
    } = this.state;
    let params;
    if (sessionStorage.businessMode === '0') {
      params = {
        pickUpTime: orderInfo.originalExtractTime, //最晚提货日期
        sellingPrice: orderInfo.sellingPrice //销售价格
      };
    } else if (sessionStorage.businessMode === '2') {
      params = {
        pickUpTime: orderInfo.latestDeliveryDate, //最晚提货日期
        unitPrice: orderInfo.unitPrice, //单价
        pledgeRatio: orderInfo.pledgeRatio, //质押比例
        annualRate: orderInfo.annualRate, //年化利率
        capitalOccupationDays: orderInfo.capitalOccupationDays, //资金占用天数
        taxRate: orderInfo.taxRate //税率
      };
    }
    if (sessionStorage.businessMode !== '1' && sessionStorage.businessMode !== '4' && orderInfo.grade) {
      params['grade'] = orderInfo.grade
    }

    let empty = true;
    data && Object.keys(data).forEach(key => {
      if (data[key].length !== 0) {
        empty = false;
      }
    })

    return (
      <div className={styles.container}>
        {
          refusedInfo && Object.keys(refusedInfo).length !== 0 && Object.keys(refusedInfo).map(key => {
            let row = refusedInfo[key].map((i, index) => {
              let modalKey = null, id = null;
              modalKey = key === 'bondProofRefusedDTO' ? 'visibleBail' :
                key === 'delayApplyRefusedDTO' ? 'visibleDelay' :
                  key === 'deliverGoodsProofRefusedDTO' ? 'visibleDelivery' :
                    key === 'goodsPowerTransferProofRefusedDTO' ? 'visibleTransfer' :
                      key === 'invoiceRefusedDTO' ? 'visibleInvoice' :
                        key === 'paymentProofRefusedDTO' ? 'visiblePayment' :
                          key === 'pickUpApplyRefusedDTO' ? 'visibleGoods' :
                            key === 'houseProofRefusedDTO' ? 'visibleWarehouse' : null;
              id = key === 'bondProofRefusedDTO' ? i.bondBusinessId :
                key === 'delayApplyRefusedDTO' ? i.delayApplyBusinessId :
                  key === 'goodsPowerTransferProofRefusedDTO' ? i.goodsPowerBusinessId :
                    key === 'invoiceRefusedDTO' ? i.invoiceBusinessId :
                      key === 'pickUpApplyRefusedDTO' ? i.pickUpBusinessId :
                        key === 'houseProofRefusedDTO' ? i.storehouseBillId : null;
              return (
                <div className={styles.backInfo} key={index}>
                  <Icon type="exclamation-circle" style={{ color: '#FAAD14', fontSize: 24 }} />
                  <div className={styles.detailsBox}>
                    <span style={{ fontSize: 16 }}>请注意！您提交的{
                      key === 'bondProofRefusedDTO' ? '保证金' :
                        key === 'delayApplyRefusedDTO' ? '延期提货' :
                          key === 'deliverGoodsProofRefusedDTO' ? '放货证明' :
                            key === 'goodsPowerTransferProofRefusedDTO' ? '货权转移证明' :
                              key === 'invoiceRefusedDTO' ? '发票' :
                                key === 'paymentProofRefusedDTO' ? '付款证明' :
                                  key === 'pickUpApplyRefusedDTO' ? '提货申请' :
                                    key === 'houseProofRefusedDTO' ? '仓单' : '未知票据'
                    }被退回，请重新编辑</span>
                    <div className={styles.details}>
                      <span>退回原因：</span>
                      <div className={styles.text}>
                        <pre>{i.recentlyReason}</pre>
                      </div>
                    </div>
                    {
                      orderInfo.frozenStatus !== 0 ? (
                        sessionStorage.businessMode === '0' ? (
                          key === 'bondProofRefusedDTO' ? (role.roleId === 1 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) :
                            key === 'goodsPowerTransferProofRefusedDTO' ? (role.roleId === 2 || role.roleId === 10 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) :
                              key === 'paymentProofRefusedDTO' ? (role.roleId === 10 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) :
                                key === 'invoiceRefusedDTO' ? (role.roleId === 2 || role.roleId === 10 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id, 0)}>重新编辑</span> : null) :
                                  key === 'pickUpApplyRefusedDTO' ? (role.roleId === 1 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) :
                                    key === 'delayApplyRefusedDTO' ? (role.roleId === 1 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) :
                                      key === 'deliverGoodsProofRefusedDTO' ? (role.roleId === 7 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) : null
                        ) :
                          sessionStorage.businessMode === '1' ? (
                            key === 'bondProofRefusedDTO' ? (role.roleId === 1 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) :
                              key === 'goodsPowerTransferProofRefusedDTO' ? (role.roleId === 1 || role.roleId === 2 || role.roleId === 10 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) :
                                key === 'paymentProofRefusedDTO' ? (
                                  orderInfo.orderStatus === 5 || orderInfo.orderStatus === 10 ? (
                                    role.roleId === 10 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null
                                  ) : (
                                      role.roleId === 2 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null
                                    )
                                ) :
                                  key === 'invoiceRefusedDTO' ? (
                                    orderInfo.orderStatus === 4 || orderInfo.orderStatus === 9 ? (
                                      role.roleId === 1 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id, 0)}>重新编辑</span> : null
                                    ) : (
                                        role.roleId === 10 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id, 0)}>重新编辑</span> : null
                                      )
                                  ) : null
                          ) :
                            sessionStorage.businessMode === '2' ? (
                              key === 'paymentProofRefusedDTO' ? (role.roleId === 10 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) :
                                key === 'invoiceRefusedDTO' ? (
                                  orderInfo.orderStatus === 5 ? (
                                    role.roleId === 3 || role.roleId === 10 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id, 0)}>重新编辑</span> : null
                                  ) : (role.roleId === 10 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id, 0)}>重新编辑</span> : null)
                                ) :
                                  key === 'pickUpApplyRefusedDTO' ? (role.roleId === 1 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) :
                                    key === 'delayApplyRefusedDTO' ? (role.roleId === 1 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) :
                                      key === 'deliverGoodsProofRefusedDTO' ? (role.roleId === 7 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) :
                                        key === 'houseProofRefusedDTO' ? (role.roleId === 3 || role.roleId === 10 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) : null
                            ) :
                              (
                                key === 'bondProofRefusedDTO' ? (role.roleId === 1 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) :
                                  key === 'goodsPowerTransferProofRefusedDTO' ? (role.roleId === 2 || role.roleId === 10 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) :
                                    null
                              )
                      ) : null
                    }

                  </div>
                </div>
              )
            })
            return row
          })
        }

        {
          modalKey === 'visibleBail' || visibleBail ? <BailModal
            id={modalId}
            orderBusinessId={id}
            refreshData={this.getData} //订单详情的用于刷新数据，订单管理列表里面不用传
            callback={this.callback}
            preview={this.handlePreview}
          /> : null
        }

        {
          modalKey === 'visibleDelivery' || visibleDelivery ? <DeliveryModal
            orderBusinessId={id}
            refreshData={this.getData} //订单详情的用于刷新数据，订单管理列表里面不用传
            callback={this.callback}
            preview={this.handlePreview}
          /> : null
        }

        {
          modalKey === 'visibleDelay' || visibleDelay ? <DelayModal
            id={modalId}
            params={params}
            orderBusinessId={id}
            refreshData={this.getData} //订单详情的用于刷新数据，订单管理列表里面不用传
            callback={this.callback}
          /> : null
        }

        {
          modalKey === 'visibleGoods' || visibleGoods ? <GoodsModal
            id={modalId}
            params={params}
            orderBusinessId={id}
            refreshData={this.getData} //订单详情的用于刷新数据，订单管理列表里面不用传
            callback={this.callback}
            preview={this.handlePreview}
          /> : null
        }

        {
          modalKey === 'visibleInvoice' || visibleInvoice ? <InvoiceModal
            id={modalId}
            orderBusinessId={id}
            invoiceType={invoiceType !== null ? invoiceType : billInvoiceType} //开票类型 必传
            refreshData={this.getData} //订单详情的用于刷新数据，订单管理列表里面不用传
            callback={this.callback}
            preview={this.handlePreview}
          /> : null
        }

        {
          modalKey === 'visibleLetter' || visibleLetter ? <LetterModal
            orderBusinessId={id}
            letterType={letterType}
            refreshData={this.getData} //订单详情的用于刷新数据，订单管理列表里面不用传
            callback={this.callback}
            preview={this.handlePreview}
          /> : null
        }

        {
          modalKey === 'visiblePayment' || visiblePayment === true ? <PaymentModal
            orderBusinessId={id}
            retreatFillType={invoiceType}
            refreshData={this.getData} //订单详情的用于刷新数据，订单管理列表里面不用传
            callback={this.callback}
            preview={this.handlePreview}
          /> : null
        }

        {
          modalKey === 'visibleTransfer' || visibleTransfer ? <TransferModal
            id={modalId} //用于重新编辑，订单管理列表里面不用传
            orderBusinessId={id} //订单ID
            refreshData={this.getData} //订单详情的用于刷新数据，订单管理列表里面不用传 
            callback={this.callback} //用于回调重置modalKey、modalId, 订单管理列表可以不传
            preview={this.handlePreview} //用于预览上传的图片
          /> : null
        }

        {
          modalKey === 'visibleWarehouse' || visibleWarehouse ? <WarehouseModal
            id={modalId}
            orderBusinessId={id}
            refreshData={this.getData} //订单详情的用于刷新数据，订单管理列表里面不用传
            callback={this.callback}
            preview={this.handlePreview}
          /> : null
        }

        <div className={styles.content}>
          {
            empty ? <p className={styles.empty}>暂无可查看票据</p> :
              <Collapse defaultActiveKey={activeKeys}>
                {
                  data && Object.keys(data).map(key => {
                    // bondProofDTO	保证金
                    // delayApplyDTO 延期收货
                    // deliverGoodsProofDTO 放货证明
                    // goodsPowerTransferProofDTO 货权转移证明
                    // invoiceDTO 开票证明（发票）
                    // paymentProofDTO 付款证明
                    // pickUpApplyDTO 提货申请
                    // 是否通过（0.未通过 1.通过 2.审核中）
                    let row = data[key].map((i, index) => {
                      let modalKey = null, id = null;
                      modalKey = key === 'bondProofDTO' ? 'visibleBail' :
                        key === 'delayApplyDTO' ? 'visibleDelay' :
                          key === 'deliverGoodsProofDTO' ? 'visibleDelivery' :
                            key === 'goodsPowerTransferProofDTO' ? 'visibleTransfer' :
                              key === 'invoiceDTO' ? 'visibleInvoice' :
                                key === 'paymentProofDTO' ? 'visiblePayment' :
                                  key === 'pickUpApplyDTO' ? 'visibleGoods' :
                                    key === 'houseProofDTO' ? 'visibleWarehouse' : null
                      id = key === 'bondProofDTO' ? i.bondBusinessId :
                        key === 'delayApplyDTO' ? i.delayApplyBusinessId :
                          key === 'goodsPowerTransferProofDTO' ? i.goodsPowerBusinessId :
                            key === 'invoiceDTO' ? i.invoiceBusinessId :
                              key === 'pickUpApplyDTO' ? i.pickUpBusinessId :
                                key === 'paymentProofDTO' ? i.paymentBusinessId :
                                  key === 'houseProofDTO' ? i.storehouseBillId : null
                      return (
                        <Panel header={
                          <div className={styles.header}>
                            票据： {
                              key === 'bondProofDTO' ? '保证金' :
                                key === 'delayApplyDTO' ? '延期提货' :
                                  key === 'deliverGoodsProofDTO' ? '放货证明' :
                                    key === 'goodsPowerTransferProofDTO' ? '货权转移证明' :
                                      key === 'invoiceDTO' ? '发票' :
                                        key === 'paymentProofDTO' ? '付款证明' :
                                          key === 'pickUpApplyDTO' ? '提货申请' :
                                            key === 'houseProofDTO' ? '仓单' :
                                              key === 'buyLetterDTO' ? '委托采购函' :
                                                key === 'saleLetterDTO' ? '委托销售函' :
                                                  key === 'payLetterDTO' ? '委托付款函' : null
                            }
                            <span style={i.isPass === 0 ? { color: '#FF6347' } : i.isPass === 2 ? { color: '#de9d5b' } : { color: '#5bbd5b' }}>{
                              i.isPass === 0 ? ' （被退回）' : i.isPass === 2 ? ' （待确定）' : ' （已通过）'
                            }</span>
                            {
                              orderInfo.frozenStatus !== 0 ? (
                                type === 'bail' && key === 'bondProofDTO' && i.isPass === 2 ? (
                                  role.roleId === 10 || role.roleId === 11 || role.roleId === 12 ? (
                                    orderInfo.auditStatus ? <div className={styles.btnBox}>
                                      <Button type="primary" disabled={true}>无法审核</Button>
                                    </div> : <div className={styles.btnBox}>
                                        <Button onClick={(e) => {
                                          e.stopPropagation();
                                          this.setState({ visibleCheck: true })
                                        }}>拒绝</Button>
                                        <Button type="primary" onClick={this.showConfirm.bind(this)}>通过</Button>
                                      </div>
                                  ) : null
                                ) :
                                  type === 'goods' && key === 'pickUpApplyDTO' && i.isPass === 2 ? (
                                    sessionStorage.businessMode !== '2' && (role.roleId === 10 || role.roleId === 11 || role.roleId === 12) ? (
                                      orderInfo.auditStatus ? <div className={styles.btnBox}>
                                        <Button type="primary" disabled={true}>无法审核</Button>
                                      </div> : <div className={styles.btnBox}>
                                          <Button onClick={(e) => {
                                            e.stopPropagation();
                                            this.setState({ visibleCheck: true })
                                          }}>拒绝</Button>
                                          <Button type="primary" onClick={this.showConfirm.bind(this)}>通过</Button>
                                        </div>
                                    ) :
                                      sessionStorage.businessMode === '2' && (role.roleId === 6 || role.roleId === 7 || role.roleId === 8) ? (
                                        orderInfo.auditStatus ? <div className={styles.btnBox}>
                                          <Button type="primary" disabled={true}>无法审核</Button>
                                        </div> : <div className={styles.btnBox}>
                                            <Button onClick={(e) => {
                                              e.stopPropagation();
                                              this.setState({ visibleCheck: true })
                                            }}>拒绝</Button>
                                            <Button type="primary" onClick={this.showConfirm.bind(this)}>通过</Button>
                                          </div>
                                      ) : null
                                  ) :
                                    type === 'warehouse' && key === 'houseProofDTO' && i.isPass === 2 ? (
                                      role.roleId === 6 || role.roleId === 7 || role.roleId === 8 ? (
                                        orderInfo.auditStatus ? <div className={styles.btnBox}>
                                          <Button type="primary" disabled={true}>无法审核</Button>
                                        </div> : <div className={styles.btnBox}>
                                            <Button onClick={(e) => {
                                              e.stopPropagation();
                                              this.setState({ visibleCheck: true })
                                            }}>拒绝</Button>
                                            <Button type="primary" onClick={this.showConfirm.bind(this)}>通过</Button>
                                          </div>
                                      ) : null
                                    ) :
                                      type === 'deferred' && key === 'delayApplyDTO' && i.isPass === 2 ? (
                                        role.roleId === 4 || role.roleId === 5 || role.roleId === 6 || role.roleId === 7 || role.roleId === 8 ? (
                                          orderInfo.auditStatus ? <div className={styles.btnBox}>
                                            <Button type="primary" disabled={true}>无法审核</Button>
                                          </div> : <div className={styles.btnBox}>
                                              <Button onClick={(e) => {
                                                e.stopPropagation();
                                                this.setState({ visibleCheck: true })
                                              }}>拒绝</Button>
                                              <Button type="primary" onClick={this.showConfirm.bind(this)}>通过</Button>
                                            </div>
                                        ) :
                                          role.roleId === 14 ? (
                                            orderInfo.quota && orderInfo.quota > 5000000 ? (
                                              orderInfo.auditStatus ? <div className={styles.btnBox}>
                                                <Button type="primary" disabled={true}>已审核</Button>
                                              </div> : <div className={styles.btnBox}>
                                                  <Button onClick={(e) => {
                                                    e.stopPropagation();
                                                    this.setState({ visibleCheck: true })
                                                  }}>否决</Button>
                                                  <Button type="primary" onClick={this.showConfirm.bind(this)}>通过</Button>
                                                </div>
                                            ) : null
                                          ) : null
                                      ) :
                                        key === 'invoiceDTO' ? (
                                          role.roleId === 10 && i.isPass === 2 && <div className={styles.btnBox}>
                                            <Button onClick={this.showReturnModal.bind(this, 'invoice', i.invoiceBusinessId)}>退回</Button>
                                            <Button onClick={this.confirmBill.bind(this, 'invoice', i.invoiceBusinessId)} type="primary">确认票据</Button>
                                          </div>
                                        ) :
                                          key === 'paymentProofDTO' ? (
                                            role.roleId === 10 && i.isPass === 2 && <div className={styles.btnBox}>
                                              <Button onClick={this.showReturnModal.bind(this, 'payment', i.paymentBusinessId)}>退回</Button>
                                              <Button onClick={this.confirmBill.bind(this, 'payment', i.paymentBusinessId)} type="primary">确认票据</Button>
                                            </div>
                                          ) :
                                            key === 'goodsPowerTransferProofDTO' ? (
                                              role.roleId === 7 && i.isPass === 2 && <div className={styles.btnBox}>
                                                <Button onClick={this.showReturnModal.bind(this, 'transfer', i.goodsPowerBusinessId)}>退回</Button>
                                                <Button onClick={this.confirmBill.bind(this, 'transfer', i.goodsPowerBusinessId)} type="primary">确认票据</Button>
                                              </div>
                                            ) : null
                              ) : null
                            }
                          </div>
                        } key={key + "_" + index}>
                          <div className={styles.infoBox}>
                            {
                              key === 'buyLetterDTO' || key === 'saleLetterDTO' || key === 'payLetterDTO' ? null :
                                key === 'goodsPowerTransferProofDTO' ?
                                  <span>放货公司：{i.transferCompany !== undefined ? i.transferCompany : '无'}</span> :
                                  <span>提交公司：{
                                    i.freightForwardingCompany !== undefined ? i.freightForwardingCompany :
                                      i.entrustCompany !== undefined ? i.entrustCompany :
                                        i.deliverCompany !== undefined ? i.deliverCompany :
                                          i.invoiceCompany !== undefined ? i.invoiceCompany :
                                            i.paymentCompany !== undefined ? i.paymentCompany : '无'}</span>
                            }
                            {
                              key === 'houseProofDTO' && <span>入仓数量：{i.goodsAmount !== undefined ? i.goodsAmount + '吨' : '无'}</span>
                            }
                            {
                              key === 'paymentProofDTO' ? <span>收款公司：{i.receiveCompanyName !== undefined ? i.receiveCompanyName : '无'}</span> : null
                            }
                            {
                              key === 'goodsPowerTransferProofDTO' ?
                                <span>货物数量：{i.goodsAmount !== undefined ? i.goodsAmount : '无'}</span> : null
                            }
                            {
                              key === 'pickUpApplyDTO' || key === 'delayApplyDTO' ?
                                <span>提货日期：{i.pickUpTime !== undefined ? i.pickUpTime : '无'}</span> : null
                            }
                            {
                              key === 'pickUpApplyDTO' ?
                                <span>提货数量：{i.pickUpAmount !== undefined ? i.pickUpAmount + '吨' : '无'}</span> : null
                            }
                            {
                              key === 'pickUpApplyDTO' ?
                                <span>
                                  <span style={{ display: 'block', width: '100%', padding: 0 }}>付款金额：{i.paymentMoney !== undefined ? i.paymentMoney + '元' : '无'}</span>
                                  {
                                    i.systemMoney !== undefined && i.systemMoney !== null && <span style={{ display: 'block', marginTop: 10, color: 'red', width: '100%', padding: 0 }}>系统金额：{i.systemMoney + '元'}</span>
                                  }
                                </span> : null
                            }
                            {
                              key === 'bondProofDTO' || key === 'invoiceDTO' || key === 'paymentProofDTO' ?
                                <span>{
                                  key === 'bondProofDTO' ? '保证金金额' :
                                    key === 'invoiceDTO' ? '开票金额' :
                                      key === 'paymentProofDTO' ? '放款金额' : '金额'
                                }：{
                                    i.bondMoney !== undefined ? i.bondMoney :
                                      i.invoiceMoney !== undefined ? i.invoiceMoney :
                                        i.paymentMoney !== undefined ? i.paymentMoney : '无'}元</span> : null
                            }
                            {
                              key === 'invoiceDTO' ?
                                <span>开票比例：{i.invoiceRatio !== undefined ? i.invoiceRatio + '%' : '无'}</span> : null
                            }
                            {
                              key === 'invoiceDTO' ?
                                <span>开票数量：{i.invoiceQuantity !== undefined ? i.invoiceQuantity + '吨' : '无'}</span> : null
                            }
                            {
                              key === 'bondProofDTO' && sessionStorage.businessMode !== '1' ?
                                <span>保证金比例：{i.bondRatio !== undefined ? i.bondRatio + '%' : '无'}</span> : null
                            }
                            {
                              key === 'delayApplyDTO' ? <span>延期原因：{i.delayReason ? i.delayReason : '无'}</span> :
                                <span>备注：{i.remark ? i.remark : '无'}</span>
                            }
                          </div>
                          <div className={styles.imgBox}>
                            {
                              key === 'delayApplyDTO' ? null : i.files.map((url, index) =>
                                url.url ? (
                                  url.url.indexOf('.rar') > -1 || url.url.indexOf('.zip') > -1 ?
                                    <a style={{ width: 160, height: 160 }} href={url.url} key={index}>
                                      <Icon className={styles.download} type="download" />
                                      <img className={styles.logo} src={zip} alt="图片" />
                                    </a> :
                                    url.url.indexOf('.pdf') > -1 ?
                                      <a style={{ width: 160, height: 160 }} onClick={() => window.open(url.url)} key={index}>
                                        <Icon className={styles.download} type="zoom-in" />
                                        <img className={styles.logo} src={pdf} alt="图片" />
                                      </a> :
                                      <a style={{ width: 240, height: 160 }} onClick={() => window.open(url.url)} key={index}>
                                        <Icon className={styles.download} type="zoom-in" />
                                        <img className={styles.img} src={url.url} alt="图片" />
                                      </a>
                                ) : null
                              )
                            }
                            {/* {
                              key !== 'delayApplyDTO' && <span onClick={() => window.open(i.url || i.files)}>查看大图</span>
                            } */}
                            {
                              orderInfo.frozenStatus !== 0 ? (
                                i.isPass === 0 || i.isPass === 2 ? (
                                  sessionStorage.businessMode === '0' ? (
                                    key === 'bondProofDTO' ? (role.roleId === 1 ? <span onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) :
                                      key === 'goodsPowerTransferProofDTO' ? (role.roleId === 2 || role.roleId === 10 ? <span onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) :
                                        key === 'paymentProofDTO' ? (role.roleId === 10 ? <span onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) :
                                          key === 'invoiceDTO' ? (role.roleId === 2 || role.roleId === 10 ? <span onClick={this.showModal.bind(this, modalKey, id, 0)}>重新编辑</span> : null) :
                                            key === 'pickUpApplyDTO' ? (role.roleId === 1 ? <span onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) :
                                              key === 'deliverGoodsProofDTO' ? (role.roleId === 7 ? <span onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) : null
                                  ) :
                                    sessionStorage.businessMode === '1' ? (
                                      key === 'bondProofDTO' ? (role.roleId === 1 ? <span onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) :
                                        key === 'goodsPowerTransferProofDTO' ? (role.roleId === 1 || role.roleId === 2 || role.roleId === 10 ? <span onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) :
                                          key === 'paymentProofDTO' ? (
                                            orderInfo.orderStatus === 5 || orderInfo.orderStatus === 10 ? (
                                              role.roleId === 10 ? <span onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null
                                            ) : (
                                                role.roleId === 2 ? <span onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null
                                              )
                                          ) :
                                            key === 'invoiceDTO' ? (
                                              orderInfo.orderStatus === 4 || orderInfo.orderStatus === 9 ? (
                                                role.roleId === 1 ? <span onClick={this.showModal.bind(this, modalKey, id, 0)}>重新编辑</span> : null
                                              ) : (
                                                  role.roleId === 10 ? <span onClick={this.showModal.bind(this, modalKey, id, 0)}>重新编辑</span> : null
                                                )
                                            ) : null
                                    ) : (
                                        key === 'paymentProofDTO' ? (role.roleId === 10 ? <span onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) :
                                          key === 'invoiceDTO' ? (
                                            orderInfo.orderStatus === 5 ? (
                                              role.roleId === 3 || role.roleId === 10 ? <span onClick={this.showModal.bind(this, modalKey, id, 0)}>重新编辑</span> : null
                                            ) : (role.roleId === 10 ? <span onClick={this.showModal.bind(this, modalKey, id, 0)}>重新编辑</span> : null)
                                          ) :
                                            key === 'pickUpApplyDTO' ? (role.roleId === 1 ? <span onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) :
                                              key === 'deliverGoodsProofDTO' ? (role.roleId === 7 ? <span onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) :
                                                key === 'houseProofDTO' ? (role.roleId === 3 || role.roleId === 10 ? <span onClick={this.showModal.bind(this, modalKey, id)}>重新编辑</span> : null) : null
                                      )
                                ) : null
                              ) : null
                            }
                          </div>
                        </Panel>
                      )
                    })
                    return row
                  })
                }
              </Collapse>
          }
        </div>

        {
          enterType === '1' && role.roleId !== 1 && role.roleId !== 2 && role.roleId !== 3 && <div className={styles.logBox}>
            <span className={styles.title}>操作日志</span>
            <div className={styles.tableBox}>
              <Table
                rowKey={(row, i) => row.operateId + '_' + i}
                dataSource={logs}
                columns={columns}
                pagination={{
                  defaultCurrent: 1,
                  defaultPageSize: 20,
                  pageSize: logsPages.pageSize,
                  current: logsPages.currentPage,
                  total: logsPages.totalRecords,
                  onChange: this.onChange.bind(this),
                }} />
            </div>
          </div>
        }

        <Modal
          title="退回原因"
          visible={visible}
          onOk={this.return}
          onCancel={() => this.setState({ visible: false })}
        >
          <Form layout='inline'>
            <FormItem label='退回原因'>
              {getFieldDecorator('recentlyReason', {
                rules: [{
                  required: true, message: '请输入退回原因',
                }]
              })(
                <TextArea style={{ width: 350 }} autosize={{ minRows: 5, maxRows: 5 }} placeholder="请输入" />
              )}
            </FormItem>
          </Form>
        </Modal>

        <Modal
          title="退回原因"
          visible={visibleCheck}
          onOk={this.returnOk}
          onCancel={() => this.setState({ visibleCheck: false })}
        >
          <Form layout='inline'>
            <FormItem label='退回原因' style={{ marginTop: 20 }}>
              {getFieldDecorator('recentlyReason', {
                rules: [{
                  required: true, message: '请输入退回原因',
                }, {
                  max: 255, message: '超出最大长度限制'
                }]
              })(
                <TextArea style={{ width: 350 }} autosize={{ minRows: 5, maxRows: 5 }} placeholder="请输入" />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}