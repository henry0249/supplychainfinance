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
 * 企业征信信息表
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-29
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_credit_info", type = "company_credit_info" , shards = 4, replicas = 1)
public class CreditInfo {

    /**
     * 征信信息ID
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
     * 信贷起始日期
     */
	 @Field(type = FieldType.Date)
    private Date creditStartingDate;
    /**
     * 还款截止日期
     */
	 @Field(type = FieldType.Date)
    private Date repaymentTerm;
    /**
     * 信贷合作机构名称
     */
	 @Field(type = FieldType.Text)
    private String cooperativeInstitution;
    /**
     * 信贷金额
     */
	 @Field(type = FieldType.Double)
    private BigDecimal creditAmount;
    /**
     * 是否逾期
     */
	 @Field(type = FieldType.Text)
    private String overdue;
    /**
     * 未结清信贷金额
     */
	 @Field(type = FieldType.Double)
    private BigDecimal unclearedCreditAmount;
    /**
     * 创建时间
     */
	 @Field(type = FieldType.Date)
    private Date createTime;


}
