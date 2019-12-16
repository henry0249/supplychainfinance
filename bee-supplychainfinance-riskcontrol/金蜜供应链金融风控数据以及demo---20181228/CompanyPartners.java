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
 * 投资人及出资信息表CompanyPartners
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_partners", type = "company_partners" , shards = 4, replicas = 1)
public class CompanyPartners {
	
	@Id
    @Field(type = FieldType.Keyword)
    private Long id;
    /**
     * 关联企业基础信息表id
     */
    @Field(type = FieldType.Long)
    private Long companyBaseId;
    /**
     * 投资人
     */
    @Field(type = FieldType.Text)
    private String stockName;
    /**
     * 投资人类型
     */
    @Field(type = FieldType.Text)
    private String stockType;
    /**
     * 出资比例百分数（1位小数）
     */
    @Field(type = FieldType.Double)
    private BigDecimal stockPercent;
    /**
     * 认缴出资额
     */
    @Field(type = FieldType.Double)
    private BigDecimal shouldCapi;
    /**
     * 认缴出资时间
     */
    @Field(type = FieldType.Date)
    private Date shoudDate;
    /**
     * 认出资方式
     */
    @Field(type = FieldType.Text)
    private String investType;
    /**
     * 实出资方式
     */
    @Field(type = FieldType.Text)
    private String investName;
    /**
     * 实缴出资额
     */
    @Field(type = FieldType.Double)
    private BigDecimal realCapi;
    /**
     * 实缴时间
     */
    @Field(type = FieldType.Double)
    private Date capiDate;
    /**
     * 是否第一大股东
     */
    @Field(type = FieldType.Text)
    private String isFirstShareholder;
    /**
     * 创建时间
     */
    @Field(type = FieldType.Date)
    private Date createTime;

}
