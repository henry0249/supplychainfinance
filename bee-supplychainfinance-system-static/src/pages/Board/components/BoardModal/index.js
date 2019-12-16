import { Component } from 'react';
import PropTypes from "prop-types";
import { Statistic, Modal, Row, Col, Pagination } from 'antd';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import styles from "./index.less";

@withRouter
export default class BoardModal extends Component {
  render() {
    const { visible, width, onCancel, onSkip, statisticData, data, page, paginationProps, valueColor } = this.props;
    return (
      <Modal
        visible={visible}
        width={width}
        footer={null}
        centered
        onCancel={onCancel}
      >
        <Row>
          {
            statisticData.map((item, i) =>
              <Col style={{ textAlign: "center" }} span={12} key={i}>
                <Statistic
                  title={item.title}
                  prefix="￥"
                  value={item.value ? item.value.toFixed(2) : 0.00}
                  valueStyle={item.color ? { color: item.color } : { color: 'rgba(0, 0, 0, 0.85)' }}
                />
              </Col>
            )
          }
        </Row>
        {
          data.map((item, i) =>
            <Row gutter={10} key={i} style={{ marginTop: 16 }}>
              <Col span={2}>
                <div className={((page.currentPage - 1) * page.pageSize) + i < 3 ? styles.firstNumber : styles.normalNumber}>
                  {((page.currentPage - 1) * page.pageSize) + i + 1}
                </div>
              </Col>
              <Col span={10}>
                <span onClick={onSkip(item)} className={styles.name}>{item.name}</span>
              </Col>
              <Col span={6}>
                <Statistic valueStyle={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.65)' }} prefix='￥' value={item.alreadyData ? item.alreadyData.toFixed(2) : 0.00} />
              </Col>
              <Col span={6}>
                <Statistic valueStyle={valueColor ? { fontSize: 14, color: valueColor } : { fontSize: 14, color: '#1890ff' }} prefix='￥' value={item.shouldData.toFixed(2)} />
              </Col>
            </Row>
          )
        }
        <div className={styles.paginationBox}>
          <Pagination {...paginationProps} />
        </div>
      </Modal>
    )
  }
}

//限定控件传入的属性类型
BoardModal.propTypes = {
  visible: PropTypes.bool, // 控制modal层显隐
  width: PropTypes.number, // modal层宽度控制
  onCancel: PropTypes.func,  //关闭modal层的回调
  statisticData: PropTypes.array, // 顶部数据统计
  data: PropTypes.array, // 列表数据
  page: PropTypes.object, // 列表页分页对象
  paginationProps: PropTypes.object, // 分页对象的props属性
  valueColor: PropTypes.string // 第二个数值字体颜色
}

//设置默认属性
BoardModal.defaultProps = {
  visible: false,
  width: 520, //默认520
  onCancel: () => { },
  statisticData: [],
  data: [],
  page: {
    pageSize: 20,
    currentPage: 1,
    totalPage: 0,
    totalRecords: 0
  },
  paginationProps: {
    defaultCurrent: 1,
    defaultPageSize: 20,
    current: 0,
    pageSize: 20,
    total: 0,
    size: "small",
    onChange: () => { }
  },
  valueColor: '#1890ff'
}