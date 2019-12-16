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
 * 订单-企业财务信息(委托销售)
 * </p>
 *
 * @author zhigang.zhou123
 * @since 2018-12-29
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-order_company_finance_sale", type = "order_company_finance_sale" , shards = 4, replicas = 1)
public class OrderCompanyFinanceSale {

    /**
     * 业务id
     */
	@Id
    @Field(type = FieldType.Keyword)
    private Long id;
    /**
     * 委托销售信息id
     */
	@Field(type = FieldType.Long)
    private Long entrustSaleDetailId;
    /**
     * 企业类型(1委托企业 2购货商)
     */
	@Field(type = FieldType.Integer)
    private Integer companyType;
    /**
     * 财年
     */
	@Field(type = FieldType.Integer)
    private Integer fiscalYear;
    /**
     * 资产负债率
     */
	@Field(type = FieldType.Double)
    private BigDecimal assetLiabilityRatio;
    /**
     * 流动比率
     */
	@Field(type = FieldType.Double)
    private BigDecimal liquidityRatio;
    /**
     * 速动比率
     */
	@Field(type = FieldType.Double)
    private BigDecimal quickRatio;
    /**
     * 利息保障倍数
     */
	@Field(type = FieldType.Integer)
    private Integer interestProtection;
    /**
     * 经营性现金净流量
     */
	@Field(type = FieldType.Double)
    private BigDecimal cashFlow;
    /**
     * 净利润现金含量（净利润）
     */
	@Field(type = FieldType.Double)
    private BigDecimal netProfit;
    /**
     * 销售利润增长率
     */
	@Field(type = FieldType.Double)
    private BigDecimal cashGrowthRate;
    /**
     * 净利润增长率
     */
	@Field(type = FieldType.Double)
    private BigDecimal profitGrowthRate;
    /**
     * 应收账款周转率
     */
	@Field(type = FieldType.Double)
    private BigDecimal creditVelocity;
    /**
     * 存货周转率
     */
	@Field(type = FieldType.Double)
    private BigDecimal stockVelocity;
    /**
     * 市盈率
     */
	@Field(type = FieldType.Double)
    private BigDecimal peRatio;
    /**
     * 市净率
     */
	@Field(type = FieldType.Double)
    private BigDecimal pbRatio;
    /**
     * 上一个财年的经营性现金需求
     */
	@Field(type = FieldType.Double)
    private BigDecimal cashDemand;
    /**
     * 生产销售毛利润率
     */
	@Field(type = FieldType.Double)
    private BigDecimal grossProfitRate;
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
