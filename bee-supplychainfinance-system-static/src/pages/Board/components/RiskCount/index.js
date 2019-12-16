import React, { Component } from 'react'
import styles from "./index.less"
import {Card} from "antd"

export default class RiskCount extends Component {
  constructor() {
    super()
    this.state = {

    }
    this.chart = null
  }
  componentDidMount() {
    this.renderChart()
  }
  renderChart = () => {
    const { data } = this.props
    this.chart = new G2.Chart({
      container: 'container',
      forceFit: true,
      padding: [10, 30, 80, 70]
    });
    this.chart.source(data.list, {
      months: {
        range: [0, 1]
      }
    });
    this.chart.tooltip({
      crosshairs: {
        type: 'line'
      }
    });
    data.list[0] ? (data.list[0].countType && this.chart.axis('countType', {
      label: {
        formatter: function formatter(val) {
          return val;
        }
      }
    })) : ""
    data.list[0] ? (data.list[0].countMoney && this.chart.axis('countMoney', {
      label: {
        formatter: function formatter(val) {
          // if (val.length >= 6) {
          //   return digitUppercase(val)
          // }
          return val;
        },
        textStyle: {
          fontSize: '12', 
        }
      }
    })) : "";
    data.list[0] ? (data.list[0].countType && this.chart.line().position('months*countType').color('type')) : "";
    data.list[0] ? (data.list[0].countMoney && this.chart.line().position('months*countMoney').color('type')) : "";
    // this.chart.point().position('months*countType').color('type').size(4).shape('circle').style({
    //   stroke: '#fff',
    //   lineWidth: 1
    // });
    this.chart.render();
  }
  render() {
    const { data } = this.props
    // if (this.chart) {
    //   this.chart.changeData(data)
    // }
    return (
      <div className={styles.RiskCount} style={{ marginTop: 24, ...this.props.style }}>
        <Card
          className={styles.salesCard}
          bordered={false}
          title={data.type ? "每月总回款金额" : "风险事件统计"}
          bodyStyle={{padding: 0, paddingTop: "24px"}}
        >
          <div id="container"></div>

        </Card>
      </div>
    )
  }
}

RiskCount.defaultProps = {
  data: [{
    "month": "一月",
    "city": "付款时间",
    "temperature": 7
  }, {
    "month": "二月",
    "city": "货值预警",
    "temperature": 3.9
  }, {
    "month": "三月",
    "city": "货值预警",
    "temperature": 3.9
  }, {
    "month": "四月",
    "city": "货值预警",
    "temperature": 3.9
  }, {
    "month": "五月",
    "city": "货值预警",
    "temperature": 3.9
  }, {
    "month": "六月",
    "city": "货值预警",
    "temperature": 3.9
  }, {
    "month": "七月",
    "city": "货值预警",
    "temperature": 3.9
  }, {
    "month": "八月",
    "city": "货值预警",
    "temperature": 3.9
  }, {
    "month": "九月",
    "city": "货值预警",
    "temperature": 3.9
  }, {
    "month": "十月",
    "city": "货值预警",
    "temperature": 3.9
  }, {
    "month": "十一月",
    "city": "货值预警",
    "temperature": 3.9
  }, {
    "month": "十二月",
    "city": "货值预警",
    "temperature": 6.9
  }, {
    "month": "二月",
    "city": "付款时间",
    "temperature": 4.2
  }, {
    "month": "三月",
    "city": "付款时间",
    "temperature": 9.5
  }, {
    "month": "四月",
    "city": "付款时间",
    "temperature": 9.5
  }, {
    "month": "五月",
    "city": "付款时间",
    "temperature": 9.5
  }, {
    "month": "六月",
    "city": "付款时间",
    "temperature": 9.5
  }, {
    "month": "七月",
    "city": "付款时间",
    "temperature": 9.5
  }, {
    "month": "十二月",
    "city": "付款时间",
    "temperature": 9.5
  }, {
    "month": "八月",
    "city": "付款时间",
    "temperature": 9.5
  }, {
    "month": "九月",
    "city": "付款时间",
    "temperature": 9.5
  }, {
    "month": "十月",
    "city": "付款时间",
    "temperature": 9.5
  }, {
    "month": "十一月",
    "city": "付款时间",
    "temperature": 9.5
  }, {
    "month": "一月",
    "city": "货值预警",
    "temperature": 5.7
  }, {
    "month": "四月",
    "city": "开票时间",
    "temperature": 14.5
  }, {
    "month": "五月",
    "city": "开票时间",
    "temperature": 14.5
  }, {
    "month": "六月",
    "city": "开票时间",
    "temperature": 14.5
  }, {
    "month": "七月",
    "city": "开票时间",
    "temperature": 14.5
  }, {
    "month": "八月",
    "city": "开票时间",
    "temperature": 14.5
  }, {
    "month": "九月",
    "city": "开票时间",
    "temperature": 14.5
  }, {
    "month": "十月",
    "city": "开票时间",
    "temperature": 14.5
  }, {
    "month": "四月",
    "city": "物流时间",
    "temperature": 8.5
  }, {
    "month": "十一月",
    "city": "开票时间",
    "temperature": 18.4
  }, {
    "month": "五月",
    "city": "物流时间",
    "temperature": 11.9
  }, {
    "month": "十二月",
    "city": "开票时间",
    "temperature": 21.5
  }, {
    "month": "六月",
    "city": "物流时间",
    "temperature": 15.2
  }, {
    "month": "三月",
    "city": "开票时间",
    "temperature": 25.2
  }, {
    "month": "七月",
    "city": "物流时间",
    "temperature": 17
  }, {
    "month": "二月",
    "city": "开票时间",
    "temperature": 26.5
  }, {
    "month": "八月",
    "city": "物流时间",
    "temperature": 16.6
  }, {
    "month": "九月",
    "city": "风险要素",
    "temperature": 23.3
  }, {
    "month": "八月",
    "city": "风险要素",
    "temperature": 23.3
  }, {
    "month": "七月",
    "city": "风险要素",
    "temperature": 23.3
  }, {
    "month": "六月",
    "city": "风险要素",
    "temperature": 23.3
  }, {
    "month": "五月",
    "city": "风险要素",
    "temperature": 23.3
  }, {
    "month": "四月",
    "city": "风险要素",
    "temperature": 23.3
  }, {
    "month": "三月",
    "city": "风险要素",
    "temperature": 23.3
  }, {
    "month": "二月",
    "city": "风险要素",
    "temperature": 23.3
  }, {
    "month": "一月",
    "city": "风险要素",
    "temperature": 23.3
  }, {
    "month": "九月",
    "city": "风险要素",
    "temperature": 23.3
  }, {
    "month": "九月",
    "city": "物流时间",
    "temperature": 14.2
  }, {
    "month": "十月",
    "city": "风险要素",
    "temperature": 18.3
  }, {
    "month": "一月",
    "city": "物流时间",
    "temperature": 10.3
  }, {
    "month": "十月",
    "city": "物流时间",
    "temperature": 10.3
  }, {
    "month": "三月",
    "city": "物流时间",
    "temperature": 10.3
  }, {
    "month": "二月",
    "city": "物流时间",
    "temperature": 10.3
  }, {
    "month": "十一月",
    "city": "风险要素",
    "temperature": 13.9
  }, {
    "month": "十一月",
    "city": "物流时间",
    "temperature": 6.6
  }, {
    "month": "一月",
    "city": "开票时间",
    "temperature": 9.6
  }, {
    "month": "十二月",
    "city": "物流时间",
    "temperature": 4.8
  }]
}