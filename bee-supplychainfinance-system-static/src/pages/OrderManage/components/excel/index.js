// excel.js
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { message } from 'antd';
import * as XLSX from 'xlsx';
import styles from './index.css';

class Excel extends Component {
  onImportExcel = file => {
    const self = this;
    // 获取上传的文件对象
    const { files } = file.target;
    // 通过FileReader对象读取文件
    const fileReader = new FileReader();
    fileReader.onload = event => {
      try {
        const { result } = event.target;
        // 以二进制流方式读取得到整份excel表格对象
        const workbook = XLSX.read(result, { type: 'binary' });
        // 存储获取到的数据
        let data = [];
        // 遍历每张工作表进行读取（这里默认只读取第一张表）
        for (const sheet in workbook.Sheets) {
          // esline-disable-next-line
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            // break; // 如果只取第一张表，就取消注释这行
          }
        }
        // 最终获取到并且格式化后的 json 数据
        message.success('上传成功！')
        if (self.props.onChange) {
          self.props.onChange(data)
        }
      } catch (e) {
        // 这里可以抛出文件类型错误不正确的相关提示
        message.error('文件类型不正确！');
      }
    };
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(files[0]);
  }

  render() {
    const { text, style } = this.props
    return (
      <a className={styles.panel} style={style}>
        {text}
        <input
          className={styles.input}
          type="file"
          accept='.xlsx, .xls'
          onChange={e => this.onImportExcel(e, 1)}
        />
      </a>
    );
  }
}

export default Excel;

//限定控件传入的属性类型
Excel.propTypes = {
  //选中时的回调
  onChange: PropTypes.func
  //每个地区选择框的样式如果为对象则三个为一样，为数组时分别为三个的样式
  // style: PropTypes.object || PropTypes.array,
  //返回值的模式
  // mode: PropTypes.objectOf(['districtID'])，
  //返回值的模式
  // value: PropTypes.objectOf(['districtID'])
}

//设置默认属性
Excel.defaultProps = {
  onChange: () => false,
  style: {},
  text: '+批量导入'
  // mode: 'districtID'
}
