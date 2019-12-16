import { PureComponent, Fragment } from 'react';
import styles from './index.less';
import { Breadcrumb } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
@connect(({ projectApproval }) => ({
  projectApproval,
}))
export default class Content extends PureComponent {
  constructor() {
    super();
    this.businessMode = ['委托采购', '委托销售', '金融仓储', "", "大企业委托采购"];
  }
  render() {
    const { projectApproval: { data } } = this.props;
    return (<Fragment>
      <Breadcrumb className={styles.breadcrumb}>
        <Breadcrumb.Item><Link to={'/approval/projectapproval/index'}>审批管理</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{data.applyCompanyName}</Breadcrumb.Item>
      </Breadcrumb>
      <h2 style={{ marginLeft: 50 }}>{data.applyCompanyName} 立项审批</h2>
      <div className={styles.pageHeaderContent} style={{ marginLeft: 50, background: 'white' }}>
        <div className={styles.headListLeft}>
          <p>创建人：<span>{data.creator}</span></p>
          <p>创建时间：<span>{data.createTime}</span></p>
          <p>委托方：<span>{data.applyCompanyName}</span></p>
        </div>
        <div className={styles.headListRight}>
          <p>业务类型：<span>{this.businessMode[data.businessMode]}</span></p>
          <p>贷品：<span className={styles.daipin}>{data.tradeGoods}</span></p>
          <p>项目意义：<span>{data.projectSignificance}</span></p>
        </div>
      </div>
    </Fragment>);
  }
}
