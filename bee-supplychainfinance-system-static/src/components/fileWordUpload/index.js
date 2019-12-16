import React from "react";
import PropTypes from "prop-types";
import { message, Upload, Icon, Button } from "antd";
import styles from "./index.less";
import { baseUrls } from '@/utils'

//文件上传  
class FileWordUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: []
    };
  }

  componentDidMount() {
    /*将当前组件通过参数传给父组件*/
    if (this.props.getComponent) {
      this.props.getComponent(this);
    }
  }

  render() {
    const upLoadProps = {
      name: "file",
      action: `${baseUrls.domain}/supplychainfinance-common/file/uploadWordToPdf`,
      headers: {
        authorization: "authorization-text",
        sys_id: localStorage.sys_id,
        sys_authentication: localStorage.sys_authentication,
        tradeToken: localStorage.tradeToken,
        financeToken: localStorage.financeToken,
        beeRouter: window.location.pathname
      },
      onChange(info) {//info为文件对象
        let { fileList } = info;
        if (info.file.status === "uploading") {
          self.props.onChange('uploading')
        }
        if (info.file.status === "done") {
          if (info.file.response.code === 0) {
            if (self.props.onChange) {
              self.props.labelInValue
                ? self.props.onChange({
                  value: info.file.response.data,
                  name: info.file.name
                })
                : self.props.onChange(
                  info.file.response.data.access_url
                );
            }
            message.success(`${info.file.name} 上传成功!`);
            self.setState({ fileList: [...info.fileList] });
          } else {
            message.error(`${info.file.response.msg}`);
            fileList.status = "error";
            fileList.response = info.file.response.msg;
          }
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} 上传失败`);
        }
        self.setState({ fileList });
      },
      ...this.props.upLoadProps
    };
    const self = this;
    const { fileList } = this.state;
    const { text, style, showUploadList } = this.props;
    return (
      <Upload
        {...upLoadProps}
        showUploadList={showUploadList}
        fileList={fileList}
      >
        {this.props.Button}
      </Upload>
    );
  }
}

export default FileWordUpload;

//限定控件传入的属性类型
FileWordUpload.propTypes = {
  beforeUpload: PropTypes.func,
  onChange: PropTypes.func  //选中时的回调
};

//设置默认属性
FileWordUpload.defaultProps = {
  style: { width: "120px" },
  type: 2, //0为图片--1为文件--2为图片或者文件
  showFileList: "",
  onChange: () => false,
  showUploadList: true,
  Button: (
    <Button>
      <Icon type="upload" />
      添加附件
    </Button>
  ),
  beforeUpload: file => {
    //文件或者图片验证
    this.file = file;
    let typeToken = false;
    if (file.type === "image/jpg") {
      typeToken = true;
    }
    if (file.type === "image/png") {
      typeToken = true;
    }
    if (file.type === "image/jpeg") {
      typeToken = true;
    }
    if (file.type === "image/doc" || file.type === "image/docx") {
      typeToken = true;
    }
    if (!typeToken) {
      message.error("请上传JPG，JPEG，PNG，格式文件");
    }
    const isMin2M = file.size / 1024 / 1024 > 2;
    const isMax5M = file.size / 1024 / 1024 < 5;
    if (!isMin2M) {
      message.error("图片最小为2M！");
    }
    if (!isMax5M) {
      message.error("图片最大为5M！");
    }
    return typeToken && isMin2M && isMax5M;
  },
  labelInValue: false,
  upLoadProps: {}, //antd上传文件组件属性
  getComponent: null//方法一:通过comp获得fileWordUpload实例;使用列子和方法二见下↓
};

/*处理当前公共组件内部属性方法一
  eg:
  <FileWordUpload getComponent={this.getComponent}} />

(comp)=>getComponent{ this.fileComp=comp;}
this.fileComp.setState({ fileList: []})

方法二：父组件通过refs拿到此函数，
  eg:
      <FileWordUpload  ref={this.fileWordUpload} />

      this.fileWordUpload=React.createRef();
      this.fileWordUpload.current.setState({ fileList: []})
    */
