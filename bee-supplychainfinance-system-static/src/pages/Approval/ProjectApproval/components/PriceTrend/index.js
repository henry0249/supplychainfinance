import React, { Component } from 'react'
import style from "./index.less"
import NumberInfo from 'ant-design-pro/lib/NumberInfo';
import moment from 'moment';
import { DatePicker, Icon } from "antd"
import { getTimeDistance } from "@/utils/utils"
import propTypes from "prop-types"
import G2 from '@antv/g2';
import DataSet from '@antv/data-set';
import 'ant-design-pro/dist/ant-design-pro.css'
import { connect } from "dva"
import noData from "@/assets/u4854.png"

const { RangePicker } = DatePicker;
@connect(({ global, projectApproval }) => ({
  projectApproval, global
}))
class PriceTrend extends Component {
  constructor() {
    super()
    this.state = {
      salesType: 'all',
      currentTabKey: '',
      rangePickerValue: getTimeDistance('year'),
      text: "year",
      once: true,
      updateOnce: false,
      length: 0,
    };
    this.myRef = React.createRef();
    this._chart = null;
  }

  componentDidMount() {
    if (this.state.once) {
      this.renderChart()
      this.setState({
        once: false
      })
    }
  }

  renderChart() {
    let option = {}
    if (this.props.projectApproval.chart.code === 0) {
      if(Object.keys(this.props.projectApproval.chart.data).length !== 0) {
        const data = this.props.projectApproval.chart.data
        option = {
          option: {
            field: ["price"],
            ChartData: data.goodsPriceInfos
          }
        }
      } else {
        return
      }
    } else {
      return
    }
    const { ChartData = {}, field } = option.option ? option.option : option
    this._chart = new G2.Chart({
      container: 'container',
      forceFit: true,
      height: 294,
      width: 1200,
      padding: [20, 40, 50, 50]
    });
    var dv = new DataSet.View().source(ChartData);
    dv.transform({
      type: 'fold',
      fields: field,
      key: 'type',
      value: 'price',
    });
    this._chart.source(dv, {
      value: {
        formatter: function formatter(val) {
          return val+'元';
        }
      },
      priceDate: {
        range: [0, 1]
      }
    });
    this._chart.scale('priceDate', {//度量
      range: [0, 1],
      tickCount: 10,
      type: 'timeCat'
    });
    this._chart.tooltip({
      crosshairs: 'y',
      shared: false
    });
    // this._chart.legend({
    //   attachLast: true
    // });
    this._chart.area().position('priceDate*price').color('price', "#e8f4ff").shape('smooth');
    this._chart.line().position('priceDate*price').color('price', "#3ba1ff").shape('smooth');

    this._chart.render()
  }

  isActive = type => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return style.currentDate;
    }
    return '';
  }

  handleRangePickerChange = rangePickerValue => {
    this.setState({
      rangePickerValue
    }, () => {
      const time = this.state.rangePickerValue;
      const arr = this.getTime(time)
      this.props.handleChange(arr[0],(res) => {
        if (!this._chart) {
          res.data ? Object.keys(res.data).length !== 0 ? this.renderChart() : "" : ""
        }
      });
      this.setState({
        updateOnce: true,
      })
    });
  };
  selectDate = type => {
    this.setState({
      rangePickerValue: getTimeDistance(type),
      text: type
    }, () => {
      const time = this.state.rangePickerValue;
      const arr = this.getTime(time)
      this.props.handleChange(arr[0], (res) => {
        if (!this._chart) {
          res.data ? Object.keys(res.data).length !== 0 ? this.renderChart() : "" : ""
        }
      })
      this.setState({
        updateOnce: true,
        hidden: true
      })
    });
  };
  getTime(value) {
    const arr = []
    const newArr = value.map(item => {
      arr.push(moment(item).format("YYYY-MM-DD"))
      return arr
    })
    return newArr
  }

  setData(data){
  }

  render() {
    const isActive = this.isActive;
    const selectDate = this.selectDate
    let newData = {}
    const { name } = this.props
    const { rangePickerValue, salesType, currentTabKey, text } = this.state;
    let newText = ""
    switch(text) {
      case "week":
        newText = "一周"
        break;
      case "today":
        newText = "一天"
        break;
      case "month":
        newText = "一月"
        break;
      case "year":
        newText = "一年"
        break;
      default:
        newText = "一周"
        break;
    }
    if (this.props.projectApproval.chart.data) {
      const data = this.props.projectApproval.chart.data
      newData = {
        argPrice: data.yearAvgPrice,
        nowPrice: data.currentPrice,
        risk: data.chainRatio
      }
    } else {
      newData = {}
    }
    const { argPrice, nowPrice, risk } = newData;
    if (this._chart) {
      // if(this.props.projectApproval.chart.data) 
      if (this.props.projectApproval.chart.data.goodsPriceInfos) {
        this._chart.changeData(this.props.projectApproval.chart.data.goodsPriceInfos);
      } else {
        this._chart.destroy()
        this._chart = null;
      }
    }
    const hidden = this.props.projectApproval.chart.data ? Object.keys(this.props.projectApproval.chart.data).length !== 0 ? {} : {display: "none"} : {display: "none"}
    return (
      
      <div className={style.PriceTrend} id="charts">
        <div className={style.wrap}>
          <div className={style.header}>
            <p>{name ? name : ""}价格</p>
          </div>
          <div className={style.content}>
            <div className={style.contentLeft}>
              <div className={style.average}>
                <span>{argPrice || argPrice === 0 ? "全年平均价格" : ""}</span>
                <p>{argPrice ? String(argPrice).split(".")[1] ? String(argPrice).split(".")[1].length >= 3 ? argPrice.toFixed(3) : argPrice : argPrice : argPrice}</p>
              </div>
              <div className={style.now} style={{ position: "relative",width: '208px'}}>
                {nowPrice || nowPrice === 0 ? <NumberInfo
                  subTitle={nowPrice || nowPrice === 0 ? <span>当前价格</span> : ""}
                  total={nowPrice || nowPrice === 0 ? String(nowPrice).split(".")[1] ? String(nowPrice).split(".")[1].length >= 3 ? nowPrice.toFixed(3) : nowPrice : nowPrice : nowPrice}
                  subTotal={"周环比"}
                  status={risk < 0 ? "down" : "up"}
                /> : ""}
                <span className={style.risk} style={{right: "3%"}}>{risk || risk === 0 ? Math.abs(risk) + "%" : ""}</span>
              </div>
            </div>
            <div className={style.contentRight}>
              <div className={style.salesExtraWrap}>
                <div className={style.headerTitle}>最近{newText}活动发布</div>
                <div className={style.dateWrap}>
                  <div className={style.salesExtra}>
                    <a className={isActive('today')} onClick={() => { selectDate('today') }}>
                      今日
                        {/* <FormattedMessage id="app.analysis.all-day" defaultMessage="All Day" /> */}
                    </a>
                    <a className={isActive('week')} onClick={() => { selectDate('week') }}>
                      本周
                        {/* <FormattedMessage id="app.analysis.all-week" defaultMessage="All Week" /> */}
                    </a>
                    <a className={isActive('month')} onClick={() => { selectDate('month') }}>
                      本月
                        {/* <FormattedMessage id="app.analysis.all-month" defaultMessage="All Month" /> */}
                    </a>
                    <a className={isActive('year')} onClick={() => { selectDate('year') }}>
                      全年
                        {/* <FormattedMessage id="app.analysis.all-year" defaultMessage="All Year" /> */}
                    </a>
                  </div>
                  <RangePicker
                    value={rangePickerValue}
                    onChange={this.handleRangePickerChange.bind(this)}
                    allowClear={false}
                    style={{ width: 256 }}
                  />
                </div>
              </div>
              {
                this.props.projectApproval.chart.data ? Object.keys(this.props.projectApproval.chart.data).length !== 0 ? 
                <div id="container" style={{ marginTop: "80px",width: 1300}}></div>
                :
                <div className={style.imgWrap} style={{ marginTop: "80px",width: 1300,textAlign:"center"}}>
                  <img src={noData} alt=""/>
                  <p>暂无数据</p>
                </div>
                :
                <div className={style.imgWrap} style={{ marginTop: "80px",width: 1300, textAlign:"center"}}><img src={noData} alt=""/>
                <p>暂无数据</p></div>
              }
            </div>
          </div>
        </div>
      </div>
      
    )
  }
}

PriceTrend.propTypes = {
  data: propTypes.object
}

PriceTrend.defaultProps = {
  handleChange(time) {
  },
  data: {
    argPrice: 23,
    nowPrice: 45,
    risk: "20%",
    option: {
      field: ["price"],
      ChartData: [
        {
          "date": "1986",
          "price": 162
        }, {
          "date": "1987",
          "price": 134
        }, {
          "date": "1988",
          "price": 116
        }, {
          "date": "1989",
          "price": 122
        }, {
          "date": "1990",
          "price": 178
        }, {
          "date": "1991",
          "price": 144
        }, {
          "date": "1992",
          "price": 125
        }, {
          "date": "1993",
          "price": 176
        }, {
          "date": "1994",
          "price": 4
        }, {
          "date": "1995",
          "price": 46
        }, {
          "date": "1996",
          "price": 35
        }, {
          "date": "1997",
          "price": 462
        }
      ]
    }
  }
}

export default PriceTrend
