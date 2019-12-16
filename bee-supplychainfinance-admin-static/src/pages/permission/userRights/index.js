
import React, { Component } from 'react'
import styles from './index.less'
import {
  Breadcrumb,
  Popconfirm,
  Form,
  DatePicker,
  Button,
  Tag,
  Table,
  Radio,
  message,
  Select,
  Input,
  Row,
  Col,
  Card,
  Badge,
  Modal,
  Icon
} from 'antd'
import Link from 'umi/link'
import {
  getArticles,
  deleteArticle,
  getArticlesByCondition,
  getArticleTypes,
  editArticleType,
  deleteArticleType,
  getAllArticlesType,
  checkTypeUnique
} from './services/index'
import { utils } from '@/common'
import moment from 'moment'
import { getSimpleText, queryString } from '@/common/utils'
import router from 'umi/router'
import { connect } from 'dva'
import Backstage from './component/backstage'
import Middle from './component/middle'
const FormItem = Form.Item
const { RangePicker } = DatePicker
const Option = Select.Option
const RadioGroup = Radio.Group
const tabListNoTitle = [{
  key: 'backstage',
  tab: '后台用户',
}, {
  key: 'middle',
  tab: '中台用户',
}]

const contentListNoTitle = {
  backstage: <Backstage  />,
  middle: <Middle />
}
@Form.create()
@connect(({ global, loading }) => ({
  global
}))
export default class index extends Component {

  constructor(props) {
    super()
    this.state = {
      noTitleKey: 'backstage',
    }
  }

  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  }

  render() {
    // return (
    //   <div className={styles.container}>
    //     <div className={styles.crumb}>
    //       <Row gutter={24}>
    //         <Col span={22} />
    //         <Col span={2} />
    //       </Row>
    //       <h2 style={{ marginTop: 10, fontWeight: 'bold' }}>用户列表</h2>
    //     </div>
    //     <Card
    //       style={{ width: '100%' }}
    //       bordered={false}
    //       tabList={tabListNoTitle}
    //       activeTabKey={this.state.noTitleKey}
    //       onTabChange={(key) => { this.onTabChange(key, 'noTitleKey'); }}
    //     >
    //       {contentListNoTitle[this.state.noTitleKey]}
    //     </Card>
    //   </div>
    // )

    return (
      <Card
      title='用户列表'
      className={styles.crumb}
      >
        <Card
          style={{ width: '100%' }}
          bordered={false}
          tabList={tabListNoTitle}
          activeTabKey={this.state.noTitleKey}
          onTabChange={(key) => { this.onTabChange(key, 'noTitleKey'); }}
        >
          {contentListNoTitle[this.state.noTitleKey]}
        </Card>
      </Card>
    )

  }
}
