import React, { Component } from 'react'
import { Tabs, Button } from "antd"
import style from "./index.less"
import noData from "@/assets/u4854.png"
import propTypes from "prop-types"

const TabPane = Tabs.TabPane;
class BusinessScore extends Component {
  
  constructor() {
    super()
    this.state = {

    }
  }

  render() {
    //data 页面内容数据 
    //type 页面种类 P：委托采购 S:委托销售 M:金融仓储 （大写）
    //handleSubmit 提交事件
    const data = this.props.data ? this.props.data.data : {};
    const handleSubmit = this.props.handleSubmit;
    let content = ['', '' ,''];
    if (data) {
      Object.values(data).forEach((item, index) => {
        content[index] = (
        <div className={style.content} key={index}>
          <table>
            <thead>
              <tr>
                <th>指标项</th>
                <th>分值</th>
              </tr>
            </thead>
            <tbody>
              {
                item.map(curr => {
                  return (
                    <tr key={curr.name}>
                      <td style={{color: "#1890FF"}}>{curr.name}</td>
                      <td style={{color: "rgba(0, 0, 0, 0.647058823529412)"}}>{curr.risk}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
        )
      })
    }
    const layout = (
      <div className={style.BusinessScoreNo} style={{position: "relative"}}>
        <div className={style.wrap}>
          <div className={style.header}>
            <p>业务评分</p>
          </div>
          <div className={style.content}>
            <img src={noData} alt=""/>
            <p>暂无数据</p>
          </div>
          <div className={style.footer}>
            <p>请将该立项申请提交至风控模型</p>
            {/* <Button type="primary" onClick={handleSubmit.bind(this)}>立即提交</Button> */}
          </div>
        </div>
      </div>
    )

    return <div className={style.BusinessScoreWrap} style={{flex: '1', marginLeft: 20}}>
      {
        data ?
        (
          data.length !== 0
          ?
          <div className={style.BusinessScore}>
            <div className={style.wrap}>
              <div className={style.header}>
                <p>业务评分</p>
              </div>
              <Tabs className={style.tabs}>
                <TabPane tab="委托企业" key="1">{content[0]}</TabPane>
                {
                  this.props.type === 0 || this.props.type === 4
                  ? 
                  <TabPane tab="供货商" key="2">{content[1]}</TabPane>
                  :
                  this.props.type === 1
                  ?
                  <TabPane tab="购货商" key="2">{content[1]}</TabPane>
                  :
                  ""
                }
                <TabPane tab="货代及货值" key="3">{this.props.type === 2 ? content[1] : content[2]}</TabPane>
              </Tabs>
            </div>
          </div>
          :
          layout
        )
        :
        layout
      }
    </div>
  }
}

BusinessScore.defaultProps = {
  // type: "S",
  handleSubmit: function() {
    return
  },
  data: [ //二维数组  对象字段为 name risk
    [
      {
        name: "err",
        risk: "20%"
      },
      {
        name: "err",
        risk: "23%"
      },
      {
        name: "err",
        risk: "10%"
      },
    ],
    [
      {
        name: "err",
        risk: "20%"
      },
      {
        name: "err",
        risk: "23%"
      },
      {
        name: "err",
        risk: "10%"
      },
    ],
    [
      {
        name: "err",
        risk: "20%"
      },
      {
        name: "err",
        risk: "23%"
      },
      {
        name: "err",
        risk: "10%"
      },
    ],
  ]
}
BusinessScore.propTypes = {
  // data: propTypes.array,
  type: propTypes.number,
  handleSubmit: propTypes.func
}

export default BusinessScore
