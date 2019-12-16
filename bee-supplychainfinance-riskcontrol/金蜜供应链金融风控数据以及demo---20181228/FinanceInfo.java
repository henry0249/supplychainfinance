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
 * 企业财务信息
 * </p>
 *
 * @author  chenxm66777123
 * @since 2018-12-29
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_finance_info", type = "company_finance_info" , shards = 4, replicas = 1)
public class FinanceInfo {


    /**
     * 财务信息id
     */
	@Id
    @Field(type = FieldType.Keyword)
    private Long id;
    /**
     * 关联企业基础信息表id
     */
	 @Field(type = FieldType.Long)
    private Long companyBaseId;
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
     * 上一个财年的经营性现金需求
     */
	 @Field(type = FieldType.Double)
    private BigDecimal cashDemand;
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
     * 生产销售毛利润率
     */
	 @Field(type = FieldType.Double)
    private BigDecimal grossProfitRate;
    /**
     * 创建时间
     */
	 @Field(type = FieldType.Date)
    private Date createTime;


}
