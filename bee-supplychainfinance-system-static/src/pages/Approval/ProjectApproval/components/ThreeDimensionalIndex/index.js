import React, { Component } from 'react'
import style from "./index.less"
import { Button } from "antd";
import { Radar, ChartCard } from 'ant-design-pro/lib/Charts';
import noData from "@/assets/u4854.png"
import { relative } from 'path';
// import Center from '@/pages/Account/Center/Projects';

class ThreeDimensionalIndex extends Component {
  constructor() {
    super();
    this.state = {

    }
  }

  handleSubmit() {
  }
  
  render() {
    const radarData = this.props.data ? this.props.data.data ? this.props.data.data : [] : []
    const title = this.props.title
    let content = "";
    if (radarData.length !== 0) {
      content = (
        <div className={style.ThreeDimensionalIndex} style={{position: "relative"}}>
          <div className={style.wrap}>
            <div className={style.header}>
              <p>三维指数</p>
            </div>
            <div className={style.content}>
              <ChartCard title={title} footer={null} className={style.temp} >
                <Radar
                  height={this.props.height || 300}
                  data={radarData}
                  padding={[30, 60, 40, 100]}
                  hasLegend={this.props.hasLegend}
                />
              </ChartCard>
            </div>
          </div>
        </div>
      )
    } else {
      content = (
        <div className={style.ThreeDimensionalIndexNo} style={{position: "relative", ...this.props.style}}>
          <div className={style.wrap}>
            <div className={style.header}>
              <p>三维指数</p>
            </div>
            <div className={style.content}>
              <img src={noData} alt=""/>
              <p>暂无数据</p>
            </div>
            <div className={style.footer}>
              <p>请将该立项申请提交至风控模型</p>
              {/* <Button type="primary" onClick={this.props.handleSubmit()}>立即提交</Button> */}
            </div>
          </div>
        </div>
      )
    }

    return (
      content
    )
  }
}

// data 图表传入数据array<{name,label,value}>
// title 图表标题 height 图表高度 padding 图表内部距离 hasLegend 是否显示图例
ThreeDimensionalIndex.defaultProps = {
  data: [
    {name: "个人", label: "引用", value: 10}
    ,{name: "个人", label: "口碑", value: 8}
    ,{name: "个人", label: "产量", value: 4}
    ,{name: "个人", label: "贡献", value: 5}
    ,{name: "个人", label: "热度", value: 7}
    ,{name: "团队", label: "引用", value: 3}
    ,{name: "团队", label: "口碑", value: 9}
    ,{name: "团队", label: "产量", value: 6}
    ,{name: "团队", label: "贡献", value: 3}
    ,{name: "团队", label: "热度", value: 1}
    ,{name: "部门", label: "引用", value: 4}
    ,{name: "部门", label: "口碑", value: 1}
    ,{name: "部门", label: "产量", value: 6}
    ,{name: "部门", label: "贡献", value: 5}
    ,{name: "部门", label: "热度", value: 7}
  ],
  // title: "测试标题",
  handleSubmit: function() {
    return
  }
}

export default ThreeDimensionalIndex