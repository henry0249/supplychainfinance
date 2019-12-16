import React, { Fragment, PureComponent, Component } from 'react'
import { Button, Row, Col, Icon, Steps, Card, Breadcrumb } from 'antd'
import Result from '@/components/Result'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import { getResult } from './services'
import withRouter from 'umi/withRouter'
import dic from './data'
import Link from 'umi/link'
import style from './index.less'

@withRouter
export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: { list: [] }
    }
  }

  componentDidMount = () => {
    //type 操作类型；id：查询进度需要的id；status：0提交成功，1是退回成功；isManage:判断是否是订单管理页面统一处理，如果是 则返回订单页面列表
    const { type, id, isManage } = this.props.location.query
    if (dic[type]) {
      getResult({ id, type, isManage }).then(res => {
        if (res.code === 0) {
          this.setState({
            data: res.data
          })
        }
      })
    }
  }

  render() {
    const { data } = this.state
    const { list } = data
    const { type, status, isManage } = this.props.location.query
    const { Step } = Steps
    const desc1 = item => (
      <div
        style={{
          fontSize: 12,
          color: 'rgba(0, 0, 0, 0.45)',
          position: 'relative',
          left: 42,
          textAlign: 'left'
        }}
      >
        <div style={{ margin: '8px 0 4px' }}>
          <span>{item.modifier}</span>
        </div>
        <div>{item.modifyTime}</div>
      </div>
    )

    const extra = data ? (
      <Fragment>
        <div
          style={{
            fontSize: 16,
            color: 'rgba(0, 0, 0, 0.85)',
            fontWeight: '600',
            marginBottom: 20,
            marginTop: 60
          }}
        >
          {data.entrustCompany}
        </div>
        <Row style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={12} lg={12} xl={6}>
            <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
              项目ID：{data.orderBusinessId}
            </span>
          </Col>
          <Col xs={24} sm={12} md={12} lg={12} xl={6}>
            <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
              创建人：{data.creator}
            </span>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
              创建时间：{data.createTime}
            </span>
          </Col>
        </Row>
        {list
          ? list.length > 0 && (
              <Steps
                style={{ marginLeft: -42, width: 'calc(100% + 84px)' }}
                progressDot
              >
                {list.map((item, index) => {
                  if (index < 4) {
                    return (
                      <Step
                        key={index}
                        title={
                          <span style={{ fontSize: 14 }}>
                            {item.operateStatusName}
                          </span>
                        }
                        status={item.isPassStatus === 1 ? 'finish' : 'wait'}
                        description={desc1(item)}
                      />
                    )
                  }
                })}
              </Steps>
            )
          : ''}
        {list
          ? list.length > 3 && (
              <Steps
                style={{
                  marginLeft: -42,
                  marginTop: 42,
                  width: 'calc(100% + 84px)'
                }}
                progressDot
              >
                {list.map((item, index) => {
                  if (index > 3) {
                    return (
                      <Step
                        key={index}
                        title={
                          <span style={{ fontSize: 14 }}>
                            {item.operateStatusName}
                          </span>
                        }
                        status={item.isPassStatus === 1 ? 'finish' : 'wait'}
                        description={desc1(item)}
                      />
                    )
                  }
                })}
              </Steps>
            )
          : ''}
      </Fragment>
    ) : null

    const actions = (
      <Fragment>
        <Button
          type="primary"
          onClick={() => {
            this.props.history.push(dic[type].next(isManage) || '/home')
          }}
        >
          返回列表
        </Button>
      </Fragment>
    )
    const titleRender = () => {
      return (
        <span className={style.title}>
          <Link to={(dic[type] && dic[type].from) || '/home'}>
            {dic[type] && dic[type].fromText}
          </Link>{' '}
          / {Number(status) === 0 ? '提交成功' : '退回成功'}
        </span>
      )
    }
    return (
      <PageHeaderWrapper title={titleRender()}>
        <Card
          bordered={false}
          style={{ margin: 30 }}
          bodyStyle={{ height: 830, position: 'relative' }}
        >
          {type ? (
            <Result
              type="success"
              title={Number(status) === 0 ? '提交成功' : '退回成功'}
              extra={extra}
              actions={actions}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ) : (
            <div>
              <p>信息丢失了~</p>
              <Button
                type="primary"
                onClick={() => {
                  this.props.history.push('/home')
                }}
              >
                返回首页
              </Button>
            </div>
          )}
        </Card>
      </PageHeaderWrapper>
    )
  }
}
