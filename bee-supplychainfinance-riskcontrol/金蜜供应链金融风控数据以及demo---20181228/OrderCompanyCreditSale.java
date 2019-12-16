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
 * 订单-销售相关企业征信信息表
 * </p>
 *
 * @author zhigang.zhou123
 * @since 2018-12-29
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-order_company_credit_sale", type = "order_company_credit_sale" , shards = 4, replicas = 1)
public class OrderCompanyCreditSale  {

    /**
     * 征信信息ID
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
	 @Field(type = FieldType.Integer)
    private Integer overdue;
    /**
     * 未结清信贷金额
     */
	 @Field(type = FieldType.Double)
    private BigDecimal unclearedCreditAmount;
    /**
     * 排序字段
     */
	 @Field(type = FieldType.Integer)
    private Integer sort;
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
     * 数据状态0删除1正常
     */
	 @Field(type = FieldType.Integer)
    private Integer status;
    /**
     * 修改人id
     */
	 @Field(type = FieldType.Long)
    private Long modifyId;
    /**
     * 修改人
     */
	 @Field(type = FieldType.Text)
    private String modifier;
    /**
     * 修改时间
     */
	 @Field(type = FieldType.Date)
    private Date modifyTime;


}
