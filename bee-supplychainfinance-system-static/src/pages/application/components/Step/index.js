import React, { Fragment, PureComponent } from 'react'
import { Button, Row, Col, Icon, Steps, Card } from 'antd'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import { connect } from 'dva'

//'进度条'组件
// 进度条由props的stepData渲染,相应父组件需要传入stepData,如stepData:[
@connect(({ application }) => ({
  application
}))
export default class Step extends PureComponent {
  constructor() {
    super()
  }

  componentDidMount() {}

  render() {
    let state = 0,
      list = [{ name: '', time: '' }]

    const { Step } = Steps
    const { application = {} } = this.props
    if (application.process) {
      state = application.process.state
      list = application.process.list
    }
    list = list.filter(item => item)
    return (
      <Card bordered={false}>
        <Fragment>
          <Steps
            style={{ marginLeft: -42, width: 'calc(100% + 84px)' }}
            progressDot
            current={state}
          >
            <Step title={<span style={{ fontSize: 14 }}>创建项目</span>} />
            <Step title={<span style={{ fontSize: 14 }}>经理审核</span>} />
            <Step title={<span style={{ fontSize: 14 }}>风控初审</span>} />
            <Step title={<span style={{ fontSize: 14 }}>业务审核</span>} />
          </Steps>
          <Steps
            style={{
              marginLeft: -42,
              marginTop: 42,
              width: 'calc(100% + 84px)'
            }}
            progressDot
            current={state >= 3 ? state - 4 : 0}
          >
            <Step
              title={<span style={{ fontSize: 14 }}>风控终审</span>}
              status={state >= 4 ? '' : 'wait'}
            />
            <Step title={<span style={{ fontSize: 14 }}>决策委员会</span>} />
            <Step title={<span style={{ fontSize: 14 }}>完成</span>} />
          </Steps>
        </Fragment>
      </Card>
    )
  }
}
Step.defaultProps = {
  data: [
    {
      name: '曲丽丽',
      time: '2018/12/28'
    },
    {
      name: '周毛毛',
      time: '2018/12/28'
    }
  ]
}
