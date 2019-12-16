import React, { Fragment, PureComponent } from 'react';
import { Button, Row, Col, Icon, Steps, Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from 'dva';

//'进度条'组件
// 进度条由props的stepData渲染,相应父组件需要传入stepData,如stepData:[
@connect(({ projectApproval }) => ({
  projectApproval
}))
export default class Step extends PureComponent {

  constructor() {
    super()
  }

  componentDidMount() { }

  render() {
    let state = 0, list = [{ name: '', time: '' }];

    const { Step } = Steps;
    const { projectApproval = {} } = this.props;
    if (projectApproval.process) {
      state = projectApproval.process.state;
      list = projectApproval.process.list;
    }
    list = list.filter(item => item);
    const desc = (i) => {
      const len = list.length
      return (
        <div
          style={{
            fontSize: 12,
            color: 'rgba(0, 0, 0, 0.45)',
            position: 'relative',
            left: 42,
            textAlign: 'left',
          }}
        >
          <div style={{ margin: '8px 0 4px' }}>
            {
              state >= i
                ? i > 4 ? null : <span style={{ color: '#000' }}>{list[i].name}</span>
                : <span>{list[i].name}</span>
            }
          </div>
          {
            state >= i
              ? i > 4 ? <div> {list[len-1].time}</div>: < div >{list[i].time}</div>
              : <div>{list[i].time}</div>
          }
        </div>
      )
    }
    return (
      <Card bordered={false}>
        <Fragment>
          <Steps style={{ marginLeft: -42, width: 'calc(100% + 84px)' }} progressDot current={state}>
            <Step
              title={
                <span style={{ fontSize: 14 }}>
                  创建项目
                </span>
              }

              description={state >= 0 ? desc(0) : ''}
            />
            <Step
              title={
                <span style={{ fontSize: 14 }}>
                  经理审核
                </span>
              }

              description={state >= 1 ? desc(1) : ''}
            />
            <Step
              title={
                <span style={{ fontSize: 14 }}>
                  风控初审
                </span>
              }

              description={state >= 2 ? desc(2) : ''}
            />
            <Step
              title={
                <span style={{ fontSize: 14 }}>
                  业务审核
                </span>
              }

              description={state >= 3 ? desc(3) : ''}
            />

          </Steps>
          <Steps style={{ marginLeft: -42, marginTop: 42, width: 'calc(100% + 84px)' }} progressDot current={state >= 3 ? state - 4 : 0}>
            <Step
              title={
                <span style={{ fontSize: 14 }}>
                  风控终审
                </span>
              }
              description={state >= 4 ? desc(4) : ''}
              status={state >= 4 ? "" : "wait"}
            />
            <Step
              title={
                <span style={{ fontSize: 14 }}>
                  决策委员会
                </span>
              }
              description={state >= 5 ? desc(5) : ''}
            />
            <Step
              title={
                <span style={{ fontSize: 14 }}>
                  完成
                </span>
              }
              description={state >= 6 ? desc(6) : ''}
            />
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
