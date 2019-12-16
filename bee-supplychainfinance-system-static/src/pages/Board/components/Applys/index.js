import React, { Component } from 'react'
import styles from './index.less'
import { Row, Col, Icon, Tooltip } from 'antd'
import { ChartCard, Field } from 'ant-design-pro/lib/Charts'
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import Modal from './Modal'

export default class HeaderTwo extends Component {
  constructor() {
    super()
    this.state = {}
  }
  render() {
    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 8,
      style: { marginBottom: 24 }
    }
    let { nodeList } = this.props
    const { Description } = DescriptionList;
    return (
      <div className={styles.content}>
        <Row gutter={24}>
          <Col className={styles.title} {...ColSpans.styles1}>
            <div>我的申请</div>
          </Col>
          <Col {...ColSpans.styles2}>
            <Row className={styles.item}>
              <Col {...ColSpans.styles3}>
                正在审核的额度
         </Col>
              <Col {...ColSpans.styles4}>
                ￥2,262,323
         </Col>
            </Row>
          </Col>
          <Col  {...ColSpans.styles2}>
            <Row className={styles.item}>
              <Col {...ColSpans.styles3}>
                已通过的额度
         </Col>
              <Col {...ColSpans.styles4}>
                ￥2,262,323
         </Col>
            </Row>

          </Col>
          <Col  {...ColSpans.styles2}>
            <Row className={styles.item}>
              <Col {...ColSpans.styles3}>
                剩余额度
         </Col>
              <Col {...ColSpans.styles4}>
                ￥2,262,323
         </Col>
            </Row>
          </Col>
          <Col className={styles.addApply} {...ColSpans.styles1}>
            <Modal />
          </Col>
        </Row>
      </div>
    )
  }
}

HeaderTwo.defaultProps = {
  user: 1, //用户角色
  list: [
    //列表信息
    {
      id: 1,
      title: '代办事项',
      num: 22,
      tip: '所有工作流已流转用户的订单'
    },
    {
      id: 2,
      title: '风险事项',
      num: 24,
      tip: '当前除“已解除”以外总预警订单'
    },
    {
      id: 3,
      title: '异常订单',
      num: 22,
      tip: '已冻结的订单数'
    },
    {
      id: 4,
      title: '进件通过率',
      num: 232,
      tip: '合同总审批数/退回次数'
    }
  ]
}

const ColSpans = {
  styles1: { xxl: 3, xl: 3, lg: 3, md: 3, sm: 24, xs: 24 },
  styles2: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 24, xs: 24 },
  styles3: { xxl: 24, xl: 24, lg: 24, md: 24, sm: 24, xs: 10 },
  styles4: { xxl: 24, xl: 24, lg: 24, md: 24, sm: 24, xs: 14 }
}