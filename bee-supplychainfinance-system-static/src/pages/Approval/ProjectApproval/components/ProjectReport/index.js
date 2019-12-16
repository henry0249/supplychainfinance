import React, { Component } from 'react'
import { Card } from 'antd'
import { connect } from "dva"
import projectApproval from '../../models/projectApproval';
import { withRouter } from 'react-router';

//'立项报告'组件
@withRouter
@connect(({ projectApproval }) => ({
  projectApproval
}))
class ProjectReport extends Component {
  constructor(props) {
    super()
    this.state = {
      reportData: {}
    }

  }
  componentDidMount() {
    const self = this
    this.props.dispatch({
      type: "projectApproval/getReport",
      payload: {
        applyId: this.props.location.query.id,
      }
    })
  }
  render() {
    const data = Object.keys(this.props.projectApproval.report).length !== 0 ? this.props.projectApproval.report.data : {}
    let str1 = ""
    if (data) {
      const newData = " " + data.modelValue + " ";
      const str = newData.replace(/\n/g,"<br/>")
      const arr1 = str.split('<br/>')
      const arr = arr1.map((item, index) => {
        if (index !== arr1.length) {
          return (index + 1) + ".  " + item
        }
      })
      str1 = arr.join("<br/>")
    } else {
      str1 = "<p>暂无数据</p>"
    }
    
    return (

      <Card
        title="立项报告"
        bordered={false}
      >
        <h2>金蜜股份融资性贸易评估报告</h2>
        <h3><span>{data.department}</span>  <span>{data.creator}</span>  <span>{data.createTime}</span></h3>
        <p dangerouslySetInnerHTML={{ __html: str1 }}></p>
      </Card>
    )
  }
}


export default ProjectReport
