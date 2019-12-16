import React, { Component } from 'react'
import { Card } from 'antd';
import Effect from './components/effect/index'
import Relieve from './components/relieve/index'
import Apply from './components/apply/index'

const contentListNoTitle = {
  effect: <Effect />,//生效中
  relieve: <Relieve />,//已解除
  apply: <Apply />,//申请中
}
const tabListNoTitle = [{
  key: 'effect',//生效中
  tab: '生效中',
}, {
  key: 'relieve',//已解除
  tab: '已解除',
}, {
  key: 'apply',//申请中
  tab: <span>申请中</span>
}]

export default class Index extends Component {

  constructor() {
    super()
    this.state = {
      noTitleKey: 'effect',
    }
  }

  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  }

  render() {
    return (
        <div style={{padding:25}}>
        <Card
          style={{ width: '100%' }}
          tabList={tabListNoTitle}
          activeTabKey={this.state.noTitleKey}
          onTabChange={(key) => { this.onTabChange(key, 'noTitleKey'); }}
          bordered={false}
        >
          {contentListNoTitle[this.state.noTitleKey]}
        </Card>
      </div>
    )
  }
}
