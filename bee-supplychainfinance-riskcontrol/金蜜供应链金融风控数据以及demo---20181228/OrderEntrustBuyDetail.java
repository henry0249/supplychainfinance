package com.bee.supply.chain.finance.common.entity.es.thirdInterfaceForES;

import java.math.BigDecimal;
import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * <p>
 * 订单-委托采购信息表
 * </p>
 *
 * @author zhigang.zhou123
 * @since 2018-12-29
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-order_entrust_buy_detail", type = "order_entrust_buy_detail", shards = 4, replicas = 1)
public class OrderEntrustBuyDetail {


    /**
     * ID
     */
	@Id
	@Field(type = FieldType.Keyword)
    private Long id;
    /**
     * 业务主键id
     */
	@Field(type = FieldType.Text)
    private String entrustBuyDetailId;
    /**
     * 委托采购id
     */
	@Field(type = FieldType.Long)
    private Long entrustBuyApplyId;
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
    @Field(type = FieldType.Text, searchAnalyzer = "ik", analyzer = "ik")
    private String clientAddress;
    /**
     * 委托企业简称
     */
    @Field(type = FieldType.Text)
    private String clientAbbre;
    /**
     * 供应商公司ID
     */
    @Field(type = FieldType.Long)
    private Long supplierId;
    /**
     * 供应商公司名称
     */
    @Field(type = FieldType.Text)
    private String supplierName;
    /**
     * 供应商公司成立时间
     */
	@Field(type = FieldType.Date)
    private Date supplierFoundingTime;
    /**
     * 供应商公司法人
     */
    @Field(type = FieldType.Text)
    private String supplierCorporation;
    /**
     * 供应商公司注册资本
     */
    @Field(type = FieldType.Text)
    private String supplierRegistCapital;
    /**
     * 供应商公司地址
     */
    @Field(type = FieldType.Text, searchAnalyzer = "ik", analyzer = "ik")
    private String supplierAddress;
    /**
     * 供货企业简称
     */
    @Field(type = FieldType.Text)
    private String supplierAbbre;
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
     * 货物交割类型
     */
	@Field(type = FieldType.Integer)
    private Integer deliveryType;
    /**
     * 是否有担保企业
     */
	@Field(type = FieldType.Integer)
    private Integer hasGuarantor;
    /**
     * 担保企业名称
     */
    @Field(type = FieldType.Text)
    private String guarantorName;
    /**
     * 保证金比例
     */
    @Field(type = FieldType.Double)
    private BigDecimal marginRates;
    /**
     * 货权转移期限
     */
	@Field(type = FieldType.Integer)
    private Integer goodsTransferDeadline;
    /**
     * 供货商开票模式
     */
	@Field(type = FieldType.Integer)
    private Integer invoiceMode;
    /**
     * 首次开票比例
     */
	  @Field(type = FieldType.Double)
    private BigDecimal firstInvoiceRatio;
    /**
     * 开票时限
     */
	@Field(type = FieldType.Integer)
    private Integer invoiceDeadline;
    /**
     * 付款比例
     */
	  @Field(type = FieldType.Double)
    private BigDecimal paymentRatio;
    /**
     * 提货期限
     */
	@Field(type = FieldType.Integer)
    private Integer takeGoodsDeadline;
    /**
     * 货代公司名称
     */
    @Field(type = FieldType.Text)
    private String freightForwardName;
    /**
     * 发货地
     */
	@Field(type = FieldType.Integer)
    private Integer deliveryAddress;
    /**
     * 发货库位/港口
     */
    @Field(type = FieldType.Text)
    private String deliveryPlace;
    /**
     * 收货地
     */
	@Field(type = FieldType.Integer)
    private Integer takeGoodsAddress;
    /**
     * 收货库位/港口
     */
    @Field(type = FieldType.Text)
    private String takeGoodsPlace;
    /**
     * 交割提货地
     */
    @Field(type = FieldType.Text)
    private String transactionPlace;
    /**
     * 付款（运输）条款
     */
	@Field(type = FieldType.Integer)
    private Integer paymentProvision;
    /**
     * 年化利率
     */
	@Field(type = FieldType.Double)
    private BigDecimal annualRate;
    /**
     * 资金占用天数
     */
	@Field(type = FieldType.Integer)
    private Integer capitalOccupationDays;
    /**
     * 货物数量正负比例
     */
	  @Field(type = FieldType.Double)
    private BigDecimal goodsPlusMinusRatio;
    /**
     * 销售价格
     */
    @Field(type = FieldType.Double)
    private BigDecimal sellingPrice;
    /**
     * 委托采购价格
     */
    @Field(type = FieldType.Double)
    private BigDecimal purchasingPrice;
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
    @Field(type = FieldType.Long)
    private Long approveDepartment;
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
