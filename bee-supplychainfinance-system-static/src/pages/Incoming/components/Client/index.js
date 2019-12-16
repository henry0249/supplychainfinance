import React, { Fragment, Component } from 'react'
import { connect } from 'dva'
import {
  Form,
  Input,
  Button,
  Divider,
  Card,
  Row,
  Col,
  Icon,
  message
} from 'antd'
import router from 'umi/router'
import styles from './index.less'
import moment from 'moment'

@connect(({ incomingstep, loading }) => ({
  incomingstep
}))
class Client extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isProved: 2,
      loading: false,
      newData: {},
      companyData: {},
      clientCompanyBaseId: null,
      supplyCompanyBaseId: null,
      purchaseCompanyBaseId: null
    }
  }

  componentDidMount() {
    const { type, getData, dispatch, applyId, onChange, typeItem } = this.props
    const { setFieldsValue } = this.props.rcForm
    const self = this
    switch (type) {
      case 'p':
        self.setState(
          {
            newData: getData.entrustBuyDetailDTO
              ? getData.entrustBuyDetailDTO
              : {}
          },
          () => {
            const { newData } = this.state
            if (typeItem) {
              if (newData.supplierName && newData.supplierCreditId) {
                self.setState({
                  isProved: 1
                })
              }
            } else {
              if (newData.clientName && newData.clientCreditId) {
                self.setState({
                  isProved: 1
                })
              }
            }
            if (newData.clientName) {
              setFieldsValue({
                clientName: newData.clientName
              })
            } else {
              if (getData.entrustBuyDTO) {
                if (getData.entrustBuyDTO.applyCompanyName) {
                  setFieldsValue({
                    clientName: getData.entrustBuyDTO.applyCompanyName
                  })
                }
              }
            }
            self.setState({
              clientCompanyBaseId: newData.clientCreditId
                ? newData.clientCreditId
                : null,
              supplyCompanyBaseId: newData.supplierCreditId
                ? newData.supplierCreditId
                : null,
              purchaseCompanyBaseId: newData.purchaserCreditId
                ? newData.purchaserCreditId
                : null
            })
          }
        )
        break
      case 'L':
        self.setState(
          {
            newData: getData.largeEntrustBuyDetailDTO
              ? getData.largeEntrustBuyDetailDTO
              : {}
          },
          () => {
            const { newData } = this.state
            if (typeItem) {
              if (newData.supplierName && newData.supplierCreditId) {
                self.setState({
                  isProved: 1
                })
              }
            } else {
              if (newData.clientName && newData.clientCreditId) {
                self.setState({
                  isProved: 1
                })
              }
            }
            if (newData.clientName) {
              setFieldsValue({
                clientName: newData.clientName
              })
            } else {
              if (getData.entrustBuyDTO) {
                if (getData.entrustBuyDTO.applyCompanyName) {
                  setFieldsValue({
                    clientName: getData.entrustBuyDTO.applyCompanyName
                  })
                }
              }
            }
            self.setState({
              clientCompanyBaseId: newData.clientCreditId
                ? newData.clientCreditId
                : null,
              supplyCompanyBaseId: newData.supplierCreditId
                ? newData.supplierCreditId
                : null,
              purchaseCompanyBaseId: newData.purchaserCreditId
                ? newData.purchaserCreditId
                : null
            })
          }
        )
        break
      case 's':
        self.setState(
          {
            newData: getData.entrustSaleDetailDTO
              ? getData.entrustSaleDetailDTO
              : {}
          },
          () => {
            const { newData } = this.state
            if (typeItem) {
              if (newData.purchaserName && newData.purchaserCreditId) {
                self.setState({
                  isProved: 1
                })
              }
            } else {
              if (newData.clientName && newData.clientCreditId) {
                self.setState({
                  isProved: 1
                })
              }
            }
            if (newData.clientName) {
              setFieldsValue({
                clientName: newData.clientName
              })
            } else {
              if (getData.entrustBuyDTO) {
                if (getData.entrustBuyDTO.applyCompanyName) {
                  setFieldsValue({
                    clientName: getData.entrustBuyDTO.applyCompanyName
                  })
                }
              }
            }
            self.setState({
              clientCompanyBaseId: newData.clientCreditId
                ? newData.clientCreditId
                : null,
              supplyCompanyBaseId: newData.supplierCreditId
                ? newData.supplierCreditId
                : null,
              purchaseCompanyBaseId: newData.purchaserCreditId
                ? newData.purchaserCreditId
                : null
            })
          }
        )
        break
      case 'w':
        self.setState(
          {
            newData: getData.financeStorageDetailDTO
              ? getData.financeStorageDetailDTO
              : {}
          },
          () => {
            const { newData } = this.state
            if (newData.clientName && newData.clientCreditId) {
              self.setState({
                isProved: 1
              })
            }
            if (newData.clientName) {
              setFieldsValue({
                clientName: newData.clientName
              })
            } else {
              if (getData.entrustBuyDTO) {
                if (getData.entrustBuyDTO.applyCompanyName) {
                  setFieldsValue({
                    clientName: getData.entrustBuyDTO.applyCompanyName
                  })
                }
              }
            }
            self.setState({
              clientCompanyBaseId: newData.clientCreditId
                ? newData.clientCreditId
                : null,
              supplyCompanyBaseId: newData.supplierCreditId
                ? newData.supplierCreditId
                : null,
              purchaseCompanyBaseId: newData.purchaserCreditId
                ? newData.purchaserCreditId
                : null
            })
          }
        )
        break
      default:
        break
    }
  }
  onProve = typeItem => {
    const { getFieldValue, validateFields } = this.props.rcForm
    const self = this
    const {
      clientCompanyBaseId,
      supplyCompanyBaseId,
      purchaseCompanyBaseId
    } = this.state
    let companyName = ''
    let companyBaseId = ''
    switch (typeItem) {
      case '':
        companyBaseId = clientCompanyBaseId
        companyName = getFieldValue('clientName')
        break
      case 'supply':
        companyBaseId = supplyCompanyBaseId
        companyName = getFieldValue('supplierName')
        break
      default:
        companyBaseId = purchaseCompanyBaseId
        companyName = getFieldValue('purchaserName')
        break
    }
    const { dispatch, applyId, onChange, entrustBuyId } = this.props
    let getData = {}
    if (companyName) {
      self.setState(
        {
          loading: true
        },
        () => {
          dispatch({
            type: 'incomingstep/getCompanyDetail',
            payload: {
              companyName: companyName,
              applyId: entrustBuyId,
              companyBaseId: companyBaseId
            },
            callback: (code, msg, data) => {
              if (code === 0) {
                self.setState(
                  {
                    companyData: data,
                    isProved: data.status,
                    loading: false
                  },
                  () => {
                    switch (typeItem) {
                      case '':
                        getData['clientAddress'] = data.address
                        getData['clientCorporation'] = data.operName
                        getData['clientRegistCapital'] = data.registCapi
                        getData['clientFoundingTime'] = data.startDate
                        getData['clientCreditId'] = data.companyBaseId
                        break
                      case 'supply':
                        getData['supplierAddress'] = data.address
                        getData['supplierCorporation'] = data.operName
                        getData['supplierRegistCapital'] = data.registCapi
                        getData['supplierFoundingTime'] = data.startDate
                        getData['supplierCreditId'] = data.companyBaseId
                        break
                      default:
                        getData['purchaserAddress'] = data.address
                        getData['purchaserCorporation'] = data.operName
                        getData['purchaserRegistCapital'] = data.registCapi
                        getData['purchaserFoundingTime'] = data.startDate
                        getData['purchaserCreditId'] = data.companyBaseId
                        break
                    }
                    self.props.rcForm.setFieldsValue(getData)
                    dispatch({
                      type: 'incomingstep/setFirstData',
                      payload: {
                        ...self.props.incomingstep.buyFirstPartOne,
                        ...getData,
                        applyId: applyId
                      }
                    })
                    // let values = {
                    //   ...this.props.incomingstep.buyFirstPartOne,
                    //   ...getData
                    // };
                  }
                )
              } else {
                self.setState({
                  loading: false
                })
                message.error(msg)
              }
            }
          })
        }
      )
    } else {
      validateFields(['clientName', 'supplierName', 'purchaserName'])
    }
  }

  companyChange = typeItem => {
    this.setState({
      isProved: 2
    })
    let getData = {}
    const { onChange } = this.props
    switch (typeItem) {
      case '':
        getData['clientAddress'] = ''
        getData['clientCorporation'] = ''
        getData['clientRegistCapital'] = ''
        getData['clientFoundingTime'] = ''
        break
      case 'supply':
        getData['supplierAddress'] = ''
        getData['supplierCorporation'] = ''
        getData['supplierRegistCapital'] = ''
        getData['supplierFoundingTime'] = ''
        break
      default:
        getData['purchaserAddress'] = ''
        getData['purchaserCorporation'] = ''
        getData['purchaserRegistCapital'] = ''
        getData['purchaserFoundingTime'] = ''
        break
    }
    const { dispatch, applyId } = this.props
    this.props.rcForm.setFieldsValue(getData)
  }

  render() {
    const { isProved, newData } = this.state
    const {
      rcForm,
      dispatch,
      companyType,
      companyNickHead,
      typeItem,
      onChange,
      applyId,
      headValue,
      getData
    } = this.props
    const { getFieldDecorator, validateFields } = rcForm
    return (
      <div className={styles.ClientBox}>
        <Fragment>
          <Card>
            <Form layout="vertical" className={styles.stepForm}>
              <Row>
                <Col sm={8} xs={10}>
                  <Form.Item
                    label={companyType ? companyType : '委托方'}
                    layout="inline"
                  >
                    {getFieldDecorator(
                      typeItem
                        ? typeItem === 'supply'
                          ? 'supplierName'
                          : 'purchaserName'
                        : 'clientName',
                      {
                        initialValue: typeItem
                          ? typeItem === 'supply'
                            ? newData.supplierName
                            : newData.purchaserName
                          : getData.entrustBuyDTO
                          ? getData.entrustBuyDTO.applyCompanyName
                          : '',
                        rules: [
                          {
                            required: true,
                            message: `请输入正确的${
                              companyType ? companyType : '委托方'
                            }，最长不超过30字符`,
                            max: 30
                          }
                        ]
                      }
                    )(
                      <Input
                        style={{ width: '79%' }}
                        placeholder={`请输入${
                          companyType ? companyType : '委托方'
                        }`}
                        // readOnly={
                        //   typeItem
                        //     ? typeItem === "supply"
                        //       ? false
                        //       : false
                        //     : true
                        // }
                        onChange={this.companyChange.bind(this, typeItem)}
                      />
                    )}
                  </Form.Item>
                </Col>
                {/* <Col sm={8} xs={10}>
                手机号：<span>请先验证</span>
                </Col> */}
                <Col sm={11} xs={10} style={{ marginTop: 32 }}>
                  {this.props.hasPhone
                    ? getData.entrustBuyDTO
                      ? `手机号：${getData.entrustBuyDTO.phoneNumber}`
                      : ''
                    : ''}
                </Col>
                <Col sm={5} xs={10} style={{ marginTop: 20 }}>
                  <span style={{ marginRight: '10px' }}>
                    <span
                      style={
                        isProved
                          ? { color: 'green', marginRight: '10px' }
                          : { color: '#f00', marginRight: '10px' }
                      }
                    >
                      {(typeItem
                        ? typeItem === 'supply'
                          ? this.props.rcForm.getFieldValue('supplierName')
                          : this.props.rcForm.getFieldValue('purchaserName')
                        : this.props.rcForm.getFieldValue('clientName')) &&
                      isProved === 1 ? (
                        <Icon
                          type="check-circle"
                          theme="twoTone"
                          twoToneColor="#52c41a"
                        />
                      ) : isProved === 2 ? (
                        <Icon
                          type="info-circle"
                          theme="twoTone"
                          twoToneColor="orange"
                        />
                      ) : isProved === 1 ? (
                        <Icon
                          type="check-circle"
                          theme="twoTone"
                          twoToneColor="#52c41a"
                        />
                      ) : (
                        <Icon
                          type="close-circle"
                          theme="twoTone"
                          twoToneColor="#f00"
                        />
                      )}
                    </span>
                    {(typeItem
                      ? typeItem === 'supply'
                        ? this.props.rcForm.getFieldValue('supplierName')
                        : this.props.rcForm.getFieldValue('purchaserName')
                      : this.props.rcForm.getFieldValue('clientName')) &&
                    isProved === 1 ? (
                      <span>验证通过</span>
                    ) : isProved === 2 ? (
                      <span>请先验证</span>
                    ) : isProved === 1 ? (
                      <span>验证通过</span>
                    ) : (
                      <span>验证失败</span>
                    )}
                  </span>
                  <Button
                    type="primary"
                    onClick={this.onProve.bind(this, typeItem)}
                    loading={this.state.loading}
                    disabled={
                      (typeItem
                        ? typeItem === 'supply'
                          ? this.props.rcForm.getFieldValue('supplierName')
                          : this.props.rcForm.getFieldValue('purchaserName')
                        : this.props.rcForm.getFieldValue('clientName')) &&
                      isProved === 1
                        ? true
                        : false
                    }
                  >
                    验证企业
                  </Button>
                </Col>
              </Row>
              <Divider style={{ margin: '0 0 24px 0' }} />
              <Row>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="成立时间">
                    {getFieldDecorator(
                      typeItem
                        ? typeItem === 'supply'
                          ? 'supplierFoundingTime'
                          : 'purchaserFoundingTime'
                        : 'clientFoundingTime',
                      {
                        initialValue: typeItem
                          ? typeItem === 'supply'
                            ? newData.supplierFoundingTime
                            : newData.purchaserFoundingTime
                          : newData.clientFoundingTime,
                        rules: [{ required: true, message: '请验证企业！' }]
                      }
                    )(
                      <Input
                        style={{ width: '79%' }}
                        readOnly
                        placeholder="请验证企业！"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="法人">
                    {getFieldDecorator(
                      typeItem
                        ? typeItem === 'supply'
                          ? 'supplierCorporation'
                          : 'purchaserCorporation'
                        : 'clientCorporation',
                      {
                        initialValue: typeItem
                          ? typeItem === 'supply'
                            ? newData.supplierCorporation
                            : newData.purchaserCorporation
                          : newData.clientCorporation,
                        rules: [{ required: true, message: '请验证企业！' }]
                      }
                    )(
                      <Input
                        style={{ width: '79%' }}
                        readOnly
                        placeholder="请验证企业！"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="注册资本">
                    {getFieldDecorator(
                      typeItem
                        ? typeItem === 'supply'
                          ? 'supplierRegistCapital'
                          : 'purchaserRegistCapital'
                        : 'clientRegistCapital',
                      {
                        initialValue: typeItem
                          ? typeItem === 'supply'
                            ? newData.supplierRegistCapital
                            : newData.purchaserRegistCapital
                          : newData.clientRegistCapital,
                        rules: [{ required: true, message: '请验证企业！' }]
                      }
                    )(
                      <Input
                        style={{ width: '79%' }}
                        readOnly
                        placeholder="请验证企业！"
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label="地址">
                    {getFieldDecorator(
                      typeItem
                        ? typeItem === 'supply'
                          ? 'supplierAddress'
                          : 'purchaserAddress'
                        : 'clientAddress',
                      {
                        initialValue: typeItem
                          ? typeItem === 'supply'
                            ? newData.supplierAddress
                            : newData.purchaserAddress
                          : newData.clientAddress,
                        rules: [{ required: true, message: '请验证企业！' }]
                      }
                    )(
                      <Input
                        style={{ width: '79%' }}
                        readOnly
                        placeholder="请验证企业！"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item
                    layout="vertical"
                    label={companyNickHead ? companyNickHead : '委托企业简称'}
                  >
                    {getFieldDecorator(
                      typeItem
                        ? typeItem === 'supply'
                          ? 'supplierAbbre'
                          : 'purchaserAbbre'
                        : 'clientAbbre',
                      {
                        initialValue: typeItem
                          ? typeItem === 'supply'
                            ? newData.supplierAbbre
                            : newData.purchaserAbbre
                          : newData.clientAbbre,
                        rules: [
                          {
                            required: true,
                            message: '请输入正确的企业简称，最长不超过20字符！',
                            max: 20
                          }
                        ]
                      }
                    )(
                      <Input
                        style={{ width: '79%' }}
                        placeholder="由业务员填写"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col sm={8} xs={10}>
                  <Form.Item layout="vertical" label={'法人身份证号'}>
                    {getFieldDecorator(
                      typeItem
                        ? typeItem === 'supply'
                          ? 'supplierCorporationIdcard'
                          : 'purchaserCorporationIdcard'
                        : 'clientCorporationIdcard',
                      {
                        initialValue: typeItem
                          ? typeItem === 'supply'
                            ? newData.supplierCorporationIdcard
                            : newData.purchaserCorporationIdcard
                          : newData.clientCorporationIdcard,
                        rules: [
                          // {
                          //   required: true,
                          //   message: '请输入法人身份证号！'
                          // },
                          {
                            pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                            message: '身份证格式不正确，请重新输入'
                          }
                        ]
                      }
                    )(
                      <Input
                        style={{ width: '79%' }}
                        placeholder="由业务员填写"
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Fragment>
      </div>
    )
  }
}

export default Client
