package com.bee.supply.chain.finance.common.entity.es.thirdInterfaceForES;

import java.io.Serializable;

import java.math.BigDecimal;
import java.util.Date;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.enums.IdType;
import com.baomidou.mybatisplus.activerecord.Model;
import com.baomidou.mybatisplus.annotations.TableName;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.io.Serializable;

/**
 * <p>
 * 订单-委托销售信息表
 * </p>
 *
 * @author zhigang.zhou123
 * @since 2018-12-29
 */
public class OrderEntrustSaleDetail {

    /**
     * ID
     */
    @Field(type = FieldType.Long)
    private Long id;
    /**
     * 业务主键id
     */
    @Field(type = FieldType.Text)
    private String entrustSaleDetailId;
    /**
     * 委托销售id
     */
    @Field(type = FieldType.Long)
    private Long entrustSaleApplyId;
    /**
     * 项目意义
     */
    @Field(type = FieldType.Text)
    private String projectSignificance;
    /**
     * 委托方公司ID
     */
    @Field(type = FieldType.Long)
    private Long clientId;
    /**
     * 委托方公司名称
     */
    @Field(type = FieldType.Text)
    private String clientName;
    /**
     * 委托方公司成立时间
     */
    @Field(type = FieldType.Date)
    private Date clientFoundingTime;
    /**
     * 委托方公司法人
     */
    @Field(type = FieldType.Text)
    private String clientCorporation;
    /**
     * 委托方公司注册资本
     */
    @Field(type = FieldType.Text)
    private String clientRegistCapital;
    /**
     * 委托方公司地址
     */
    @Field(type = FieldType.Text)
    private String clientAddress;
    /**
     * 委托企业简称
     */
    @Field(type = FieldType.Text)
    private String clientAbbre;
    /**
     * 采购商公司ID
     */
    @Field(type = FieldType.Long)
    private Long purchaserId;
    /**
     * 采购商公司名称
     */
    @Field(type = FieldType.Text)
    private String purchaserName;
    /**
     * 采购商公司成立时间
     */
    @Field(type = FieldType.Date)
    private Date purchaserFoundingTime;
    /**
     * 采购商公司法人
     */
    @Field(type = FieldType.Text)
    private String purchaserCorporation;
    /**
     * 采购商公司注册资本
     */
    @Field(type = FieldType.Text)
    private String purchaserRegistCapital;
    /**
     * 采购商公司地址
     */
    @Field(type = FieldType.Text)
    private String purchaserAddress;
    /**
     * 采购企业简称
     */
    @Field(type = FieldType.Text)
    private String purchaserAbbre;
    /**
     * 货品code
     */
    @Field(type = FieldType.Integer)
    private Integer tradeGoodsCode;
    /**
     * 货品
     */
    @Field(type = FieldType.Text)
    private String tradeGoods;
    /**
     * 规格code
     */
    @Field(type = FieldType.Integer)
    private Integer specificationsCode;
    /**
     * 规格
     */
    @Field(type = FieldType.Text)
    private String specifications;
    /**
     * 来源地区code
     */
    @Field(type = FieldType.Integer)
    private Integer sourceAreaCode;
    /**
     * 来源地区
     */
    @Field(type = FieldType.Text)
    private String sourceArea;
    /**
     * 数量
     */
    @Field(type = FieldType.Double)
    private BigDecimal quantity;
    /**
     * 单价
     */
    @Field(type = FieldType.Double)
    private BigDecimal unitPrice;
    /**
     * 品位
     */
    @Field(type = FieldType.Double)
    private BigDecimal grade;
    /**
     * 验货条件
     */
    @Field(type = FieldType.Text)
    private String inspectionConditions;
    /**
     * 货代公司名称
     */
    @Field(type = FieldType.Text)
    private String freightForwardName;
    /**
     * 物流方式
     */
    @Field(type = FieldType.Integer)
    private Integer logisticsMode;
    /**
     * 是否有担保企业
     */
    @Field(type = FieldType.Integer)
    private Integer hasGuarantor;
    /**
     * 担保企业名称
     */
    @Field(type = FieldType.Integer)
    private String guarantorName;
    /**
     * 保证金金额
     */
    @Field(type = FieldType.Double)
    private BigDecimal marginAmount;
    /**
     * 委托企业开票模式
     */
    @Field(type = FieldType.Integer)
    private Integer invoiceMode;
    /**
     * 开票时限
     */
    @Field(type = FieldType.Integer)
    private Integer invoiceDeadline;
    /**
     * 首次开票比例
     */
    @Field(type = FieldType.Double)
    private BigDecimal firstInvoiceRatio;
    /**
     * 购货方支付方式
     */
    @Field(type = FieldType.Integer)
    private Integer paymentMode;
    /**
     * 付款比例
     */
    @Field(type = FieldType.Double)
    private BigDecimal paymentRatio;
    /**
     * 最迟付款时间
     */
    @Field(type = FieldType.Date)
    private Date latestPaymentTime;
    /**
     * 结算比例
     */
    @Field(type = FieldType.Double)
    private BigDecimal settlementRatio;
    /**
     * 购货商一票结算时限
     */
    @Field(type = FieldType.Integer)
    private Integer settlementDeadline;
    /**
     * 付款（运输）条款（装车后付款、货到后付款）
     */
    @Field(type = FieldType.Integer)
    private Integer paymentProvision;
    /**
     * 资金占用天数
     */
    @Field(type = FieldType.Integer)
    private Integer capitalOccupationDays;
    /**
     * 年化利率
     */
    @Field(type = FieldType.Double)
    private BigDecimal annualRate;
    /**
     * 委托销售价格
     */
    @Field(type = FieldType.Double)
    private BigDecimal purchasingPrice;
    /**
     * 采购价格
     */
    @Field(type = FieldType.Double)
    private BigDecimal purchasePrice;
    /**
     * 其他补充信息
     */
    @Field(type = FieldType.Text, searchAnalyzer = "ik", analyzer = "ik")
    private String additionalInformation;
    /**
     * 额度
     */
    @Field(type = FieldType.Double)
    private BigDecimal quota;
    /**
     * 立项人所属部门
     */
    @Field(type = FieldType.Text)
    private String approveDepartment;
    /**
     * 立项人姓名
     */
    @Field(type = FieldType.Text)
    private String approveName;
    /**
     * 创建人id
     */
    @Field(type = FieldType.Long)
    private Long createId;
    /**
     * 创建人名称
     */
    @Field(type = FieldType.Text)
    private String creator;
    /**
     * 创建/申请时间
     */
    @Field(type = FieldType.Date)
    private Date createTime;
    /**
     * 修改人id
     */
    @Field(type = FieldType.Long)
    private Long modifyId;
    /**
     * 修改人名称
     */
    @Field(type = FieldType.Text)
    private String modifier;
    /**
     * 修改时间
     */
    @Field(type = FieldType.Date)
    private Date modifyTime;
    /**
     * 数据状态0删除1正常
     */
    @Field(type = FieldType.Integer)
    private Integer status;


}
