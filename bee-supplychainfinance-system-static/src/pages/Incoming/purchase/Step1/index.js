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
  Alert,
  Popconfirm,
  message
} from 'antd'
import { FileUpload } from '@/components'
import { ReportBottom, Client, ReportHeader } from '../../components'
import router from 'umi/router'
import { withRouter } from 'react-router'
import styles from '../style.less'

@withRouter
@Form.create()
@connect(({ incomingstep, loading }) => ({
  incomingstep
}))
class Step1 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isProved: true,
      type: '',
      headValue: false,
      applyId: null,
      err: true,
      clientValue: false,
      getData: {},
      isShow: false,
      file: [],
      entrustBuyId: null
    }
    this.com = null
  }
  componentDidMount() {
    this.setState(
      {
        // type:this.props.global.role
        type: this.props.location.query.type,
        applyId: this.props.location.query.applyId,
        entrustBuyId: this.props.location.query.entrustBuyId,
        projectSignificance: null
      },
      () => {
        const { type, applyId } = this.state
        switch (type) {
          case 'p':
            this.props.dispatch({
              type: 'incomingstep/setBuyDetailData',
              payload: applyId,
              callback: (code, msg, data) => {
                if (code === 0) {
                  this.setState({
                    getData: data,
                    isShow: true
                  })
                } else {
                  this.setState({
                    isShow: true
                  })
                }
              }
            })
            break
          case 's':
            this.props.dispatch({
              type: 'incomingstep/setSaleDetailData',
              payload: applyId,
              callback: (code, msg, data) => {
                if (code === 0) {
                  this.setState({
                    getData: data,
                    isShow: true
                  })
                } else {
                  this.setState({
                    isShow: true
                  })
                }
              }
            })
            break
          case 'w':
            this.props.dispatch({
              type: 'incomingstep/setStorageDetailData',
              payload: applyId,
              callback: (code, msg, data) => {
                if (code === 0) {
                  this.setState({
                    getData: data,
                    isShow: true
                  })
                } else {
                  this.setState({
                    isShow: true
                  })
                }
              }
            })
            break
          case 'L':
            this.props.dispatch({
              type: 'incomingstep/setLargeBuyDetailData',
              payload: applyId,
              callback: (code, msg, data) => {
                if (code === 0) {
                  this.setState({
                    getData: data,
                    isShow: true
                  })
                } else {
                  this.setState({
                    isShow: true
                  })
                }
              }
            })
          default:
            break
        }
        let data = {}
        switch (type) {
          case 'p':
          case 'L':
            data = {
              clientAbbre: '',
              clientAddress: '',
              clientCorporation: '',
              clientFoundingTime: '',
              clientName: '',
              clientRegistCapital: '',
              projectSignificance: '',
              supplierAbbre: '',
              supplierAddress: '',
              supplierCorporation: '',
              supplierFoundingTime: '',
              supplierName: '',
              supplierRegistCapital: ''
            }
            break
          case 's':
            data = {
              clientAbbre: '',
              clientAddress: '',
              clientCorporation: '',
              clientFoundingTime: '',
              clientName: '',
              clientRegistCapital: '',
              projectSignificance: '',
              purchaserAbbre: '',
              purchaserAddress: '',
              purchaserCorporation: '',
              purchaserFoundingTime: '',
              purchaserName: '',
              purchaserRegistCapital: ''
            }
            break
          case 'w':
            data = {
              clientAbbre: '',
              clientAddress: '',
              clientCorporation: '',
              clientFoundingTime: '',
              clientName: '',
              clientRegistCapital: '',
              projectSignificance: ''
            }
            break
          default:
            break
        }
        this.props.dispatch({
          type: 'incomingstep/setFirstData',
          payload: {
            ...data,
            applyId: applyId
          }
        })
      }
    )
  }

  onRemoveFile = value => {
    let url = ''
    let arr = []
    const { dispatch } = this.props
    const { file, applyId } = this.state
    if (value.response ? value.response.code === 0 : false) {
      url = value.response.data.access_url
      arr = file.filter(item => {
        return item.fileUrl !== url
      })
    }
    this.setState({
      file: arr
    })
    dispatch({
      type: 'incomingstep/setFirstData',
      payload: {
        ...this.props.incomingstep.buyFirstPartOne,
        addFileInfoList: arr,
        applyId: applyId
      }
    })
  }

  fileUpload = value => {
    const { applyId } = this.state
    let params = {
      fileName: value.name,
      fileUrl: value.value
    }
    let newFile = [].concat(this.state.file)
    newFile.push(params)
    this.setState({
      file: newFile
    })
    this.props.dispatch({
      type: 'incomingstep/setFirstData',
      payload: {
        ...this.props.incomingstep.buyFirstPartOne,
        addFileInfoList: newFile,
        applyId: applyId
      }
    })
  }

  removeFile() {
    //删除dva缓存的附件
    const { dispatch } = this.props
    const { applyId } = this.state
    dispatch({
      type: 'incomingstep/setFirstData',
      payload: {
        ...this.props.incomingstep.buyFirstPartOne,
        addFileInfoList: [],
        applyId: applyId
      }
    })
  }

  onValidateForm = (saveType, callback) => {
    const { getData, err, isShow } = this.state
    const { getFieldDecorator, validateFields, getFieldValue } = this.props.form
    const { dispatch, incomingstep } = this.props
    const { type, applyId, id, entrustBuyId } = this.props.location.query
    const self = this
    validateFields((err, values) => {
      if (saveType === 'save') {
        err = false
        values = this.props.form.getFieldsValue()
      }
      if (!err) {
        let stepOne = {}
        switch (type) {
          case 'p':
            if (getData.entrustBuyDetailDTO) {
              ;(values.clientCreditId = incomingstep.buyFirstPartOne
                .clientCreditId
                ? incomingstep.buyFirstPartOne.clientCreditId
                : getData.entrustBuyDetailDTO.clientCreditId
                ? getData.entrustBuyDetailDTO.clientCreditId
                : null),
                (values.supplierCreditId = incomingstep.buyFirstPartOne
                  .supplierCreditId
                  ? incomingstep.buyFirstPartOne.supplierCreditId
                  : getData.entrustBuyDetailDTO.supplierCreditId
                  ? getData.entrustBuyDetailDTO.supplierCreditId
                  : null)
            }
            break
          case 's':
            if (getData.entrustSaleDetailDTO) {
              ;(values.clientCreditId = incomingstep.buyFirstPartOne
                .clientCreditId
                ? incomingstep.buyFirstPartOne.clientCreditId
                : getData.entrustSaleDetailDTO.clientCreditId
                ? getData.entrustSaleDetailDTO.clientCreditId
                : null),
                (values.purchaserCreditId = incomingstep.buyFirstPartOne
                  .purchaserCreditId
                  ? incomingstep.buyFirstPartOne.purchaserCreditId
                  : getData.entrustSaleDetailDTO.purchaserCreditId
                  ? getData.entrustSaleDetailDTO.purchaserCreditId
                  : null)
            }
            break
          case 'w':
            if (getData.financeStorageDetailDTO) {
              values.clientCreditId = incomingstep.buyFirstPartOne
                .clientCreditId
                ? incomingstep.buyFirstPartOne.clientCreditId
                : getData.financeStorageDetailDTO.clientCreditId
                ? getData.financeStorageDetailDTO.clientCreditId
                : null
            }
            break
          case 'L':
            if (getData.largeEntrustBuyDetailDTO) {
              ;(values.clientCreditId = incomingstep.buyFirstPartOne
                .clientCreditId
                ? incomingstep.buyFirstPartOne.clientCreditId
                : getData.largeEntrustBuyDetailDTO.clientCreditId
                ? getData.largeEntrustBuyDetailDTO.clientCreditId
                : null),
                (values.supplierCreditId = incomingstep.buyFirstPartOne
                  .supplierCreditId
                  ? incomingstep.buyFirstPartOne.supplierCreditId
                  : getData.largeEntrustBuyDetailDTO.supplierCreditId
                  ? getData.largeEntrustBuyDetailDTO.supplierCreditId
                  : null)
            }
          default:
            break
        }
        stepOne = {
          ...this.props.incomingstep.buyFirstPartOne,
          applyId: applyId,
          ...values
        }
        switch (type) {
          case 'p':
            dispatch({
              type: 'incomingstep/dataFirst',
              payload: { ...stepOne },
              callback: (code, msg, data) => {
                if (code === 0) {
                  // this.removeFile() 保存成功删除dva缓存
                  callback && callback()
                  saveType !== 'save'
                    ? router.push(
                        `/incoming/purchase/step2?type=${type}&applyId=${applyId}&id=${
                          data.id
                        }&entrustBuyId=${entrustBuyId}`
                      )
                    : message.success(msg)
                } else {
                  callback && callback()
                  message.error(msg)
                  router.push(
                    `/incoming/purchase/step1?type=${type}&applyId=${applyId}&entrustBuyId=${entrustBuyId}`
                  )
                }
              }
            })
            break
          case 's':
            dispatch({
              type: 'incomingstep/dataFirst',
              payload: { ...stepOne },
              callback: (code, msg, data) => {
                if (code === 0) {
                  // this.removeFile()
                  callback && callback()
                  saveType !== 'save'
                    ? router.push(
                        `/incoming/purchase/step2?type=${type}&applyId=${applyId}&id=${
                          data.id
                        }&entrustBuyId=${entrustBuyId}`
                      )
                    : message.success(msg)
                } else {
                  callback && callback()
                  message.error(msg)
                  router.push(
                    `/incoming/purchase/step1?type=${type}&applyId=${applyId}&entrustBuyId=${entrustBuyId}`
                  )
                }
              }
            })
            break
          case 'w':
            dispatch({
              type: 'incomingstep/dataFirst',
              payload: { ...stepOne },
              callback: (code, msg, data) => {
                if (code === 0) {
                  // this.removeFile()
                  callback && callback()
                  saveType !== 'save'
                    ? router.push(
                        `/incoming/purchase/step2?type=${type}&applyId=${applyId}&id=${
                          data.id
                        }&entrustBuyId=${entrustBuyId}`
                      )
                    : message.success(msg)
                } else {
                  callback && callback()
                  message.error(msg)
                  router.push(
                    `/incoming/purchase/step1?type=${type}&applyId=${applyId}&entrustBuyId=${entrustBuyId}`
                  )
                }
              }
            })
            break
          case 'L':
            dispatch({
              type: 'incomingstep/dataFirst',
              payload: { ...stepOne },
              callback: (code, msg, data) => {
                if (code === 0) {
                  // this.removeFile()
                  callback && callback()
                  saveType !== 'save'
                    ? router.push(
                        `/incoming/purchase/step2?type=${type}&applyId=${applyId}&id=${
                          data.id
                        }&entrustBuyId=${entrustBuyId}`
                      )
                    : message.success(msg)
                } else {
                  callback && callback()
                  message.error(msg)
                  router.push(
                    `/incoming/purchase/step1?type=${type}&applyId=${applyId}&entrustBuyId=${entrustBuyId}`
                  )
                }
              }
            })
          default:
            break
        }
      } else {
        callback && callback()
        let str = ''
        Object.values(err)[0]
        str = Object.values(err)[0].errors[0].message
        message.error(str)
      }
    })
  }
  render() {
    const {
      isProved,
      type,
      err,
      applyId,
      headValue,
      getData,
      isShow,
      entrustBuyId
    } = this.state
    const { form, dispatch, data } = this.props
    let title = ''
    if (getData.entrustBuyDTO) {
      title = getData.entrustBuyDTO.applyCompanyName
    }

    return (
      <Fragment>
        {isShow ? (
          <ReportHeader
            showInput={true}
            title={title}
            step={1}
            type={type}
            getData={getData}
            applyId={applyId}
            rcForm={this.props.form}
            onValidateFormOne={this.onValidateForm}
          />
        ) : null}

        {getData.entrustBuyDTO ? (
          <Fragment>
            <div className={styles.application}>
              <Card>
                <Fragment>
                  <div className={styles.applicationBox}>
                    <h3 className={styles.applicationHead}>申请详情</h3>
                    <div className={styles.applicationDetail}>
                      <Row>
                        <Col sm={8} xs={2}>
                          <span className={styles.detailItem}>
                            <span>委托企业:</span>
                            <span style={{ marginLeft: '10px' }}>
                              {isShow && getData.entrustBuyDTO.applyCompanyName
                                ? getData.entrustBuyDTO.applyCompanyName
                                : '无'}
                            </span>
                          </span>
                        </Col>
                        {type === 'w' ? null : (
                          <Col sm={8} xs={2}>
                            <span className={styles.detailItem}>
                              <span>核心企业:</span>
                              <span style={{ marginLeft: '10px' }}>
                                {isShow &&
                                getData.entrustBuyDTO.upDownstreamName
                                  ? getData.entrustBuyDTO.upDownstreamName
                                  : '无'}
                              </span>
                            </span>
                          </Col>
                        )}
                        <Col sm={8} xs={2}>
                          <span className={styles.detailItem}>
                            <span>业务模式:</span>
                            <span style={{ marginLeft: '10px' }}>
                              {isShow &&
                              (getData.entrustBuyDTO.businessMode ||
                                getData.entrustBuyDTO.businessMode === 0)
                                ? getData.entrustBuyDTO.businessMode === 0
                                  ? '委托采购'
                                  : getData.entrustBuyDTO.businessMode === 1
                                  ? '委托销售'
                                  : getData.entrustBuyDTO.businessMode === 2
                                  ? '金融仓储'
                                  : '大企业委托采购'
                                : '无'}
                            </span>
                          </span>
                        </Col>
                      </Row>
                    </div>
                    <div className={styles.applicationDetail}>
                      <Row>
                        <Col sm={8} xs={2}>
                          <span className={styles.detailItem}>
                            <span>标的物:</span>
                            <span style={{ marginLeft: '10px' }}>
                              {isShow && getData.entrustBuyDTO.tradeGoodsDetail
                                ? getData.entrustBuyDTO.tradeGoodsDetail
                                : '无'}
                            </span>
                          </span>
                        </Col>
                        <Col sm={8} xs={2}>
                          <span className={styles.detailItem}>
                            <span>数量:</span>
                            <span style={{ marginLeft: '10px' }}>
                              {isShow && getData.entrustBuyDTO.quantity
                                ? getData.entrustBuyDTO.quantity
                                : '无'}
                            </span>
                          </span>
                        </Col>
                        <Col sm={8} xs={2}>
                          <span className={styles.detailItem}>
                            <span>预计金额:</span>
                            <span style={{ marginLeft: '10px' }}>
                              {isShow && getData.entrustBuyDTO.estimatedAmount
                                ? getData.entrustBuyDTO.estimatedAmount
                                : '无'}
                            </span>
                          </span>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Fragment>
              </Card>
            </div>
            {getData.rejectReason ? (
              <div className={styles.warningBack}>
                <Alert
                  message="该立项报告被退回!"
                  description={
                    <Fragment>
                      <div style={{ float: 'left' }}>退回原因：</div>
                      <pre>{getData.rejectReason}</pre>
                      {getData.lowRuleDetail ? (
                        <pre>
                          {getData.lowRuleDetail.split('&d;').join('\r\n')}
                        </pre>
                      ) : (
                        ''
                      )}
                    </Fragment>
                  }
                  type="warning"
                  showIcon
                />
              </div>
            ) : null}
          </Fragment>
        ) : (
          <Fragment>
            <div className={styles.application}>
              <Card>
                <Fragment>
                  <div className={styles.applicationBox}>
                    <h3 className={styles.applicationHead}>申请详情</h3>
                    <div className={styles.applicationDetail}>
                      <Row>
                        <Col sm={8} xs={2}>
                          <span className={styles.detailItem}>
                            <span>委托企业:</span>
                            <span style={{ marginLeft: '10px' }}>无</span>
                          </span>
                        </Col>
                        <Col sm={8} xs={2}>
                          <span className={styles.detailItem}>
                            <span>核心企业:</span>
                            <span style={{ marginLeft: '10px' }}>无</span>
                          </span>
                        </Col>
                        <Col sm={8} xs={2}>
                          <span className={styles.detailItem}>
                            <span>业务模式:</span>
                            <span style={{ marginLeft: '10px' }}>无</span>
                          </span>
                        </Col>
                      </Row>
                    </div>
                    <div className={styles.applicationDetail}>
                      <Row>
                        <Col sm={8} xs={2}>
                          <span className={styles.detailItem}>
                            <span>标的物:</span>
                            <span style={{ marginLeft: '10px' }}>无</span>
                          </span>
                        </Col>
                        <Col sm={8} xs={2}>
                          <span className={styles.detailItem}>
                            <span>数量:</span>
                            <span style={{ marginLeft: '10px' }}>无</span>
                          </span>
                        </Col>
                        <Col sm={8} xs={2}>
                          <span className={styles.detailItem}>
                            <span>预计金额:</span>
                            <span style={{ marginLeft: '10px' }}>无</span>
                          </span>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Fragment>
              </Card>
            </div>
          </Fragment>
        )}

        {isShow ? (
          type === 'p' ? (
            <Fragment>
              <Client
                applyId={applyId}
                headValue={headValue}
                typeItem=""
                getData={getData}
                type={type}
                hasPhone
                rcForm={this.props.form}
                entrustBuyId={entrustBuyId}
              />
              <Client
                applyId={applyId}
                companyType="供应商"
                companyNickHead="供货企业简称"
                dataHead="supply"
                typeItem="supply"
                getData={getData}
                type={type}
                rcForm={this.props.form}
                entrustBuyId={entrustBuyId}
              />
            </Fragment>
          ) : type === 's' ? (
            <Fragment>
              <Client
                applyId={applyId}
                headValue={headValue}
                typeItem=""
                getData={getData}
                type={type}
                hasPhone
                rcForm={this.props.form}
                entrustBuyId={entrustBuyId}
              />
              <Client
                applyId={applyId}
                companyType="采购商"
                companyNickHead="采购企业简称"
                dataHead="purchase"
                typeItem="purchase"
                getData={getData}
                type={type}
                rcForm={this.props.form}
                entrustBuyId={entrustBuyId}
              />
            </Fragment>
          ) : type === 'w' ? (
            <Fragment>
              <Client
                applyId={applyId}
                headValue={headValue}
                dataHead="moneySave"
                typeItem=""
                getData={getData}
                hasPhone
                rcForm={this.props.form}
                entrustBuyId={entrustBuyId}
                type={type}
              />
            </Fragment>
          ) : type === 'L' ? (
            <Fragment>
              <Client
                applyId={applyId}
                headValue={headValue}
                typeItem=""
                getData={getData}
                type={type}
                hasPhone
                rcForm={this.props.form}
                entrustBuyId={entrustBuyId}
              />
              <Client
                applyId={applyId}
                companyType="供应商"
                companyNickHead="供货企业简称"
                dataHead="supply"
                typeItem="supply"
                getData={getData}
                type={type}
                rcForm={this.props.form}
                entrustBuyId={entrustBuyId}
              />
            </Fragment>
          ) : null
        ) : null}
        <div className={styles.upLoadFile}>
          <Card>
            <Row>
              <Col sm={8} xs={2}>
                <span style={{ marginRight: '10px' }}>补充资料上传:</span>
                <FileUpload
                  onChange={this.fileUpload.bind(this)}
                  labelInValue={true}
                  upLoadProps={{
                    onRemove: this.onRemoveFile //删除文件参数
                  }}
                  getComponent={this.getComponent}
                />
                <p style={{ color: '#ccc', paddingLeft: '100px' }}>
                  支持扩展名：.rar .zip .doc .docx .pdf .jpg...
                </p>
              </Col>
            </Row>
          </Card>
        </div>
        <ReportBottom
          step={1}
          broad={3}
          type={type}
          err={err}
          applyId={applyId}
          entrustBuyId={entrustBuyId}
          onValidateFormOne={this.onValidateForm}
        />
      </Fragment>
    )
  }
}

export default Step1
