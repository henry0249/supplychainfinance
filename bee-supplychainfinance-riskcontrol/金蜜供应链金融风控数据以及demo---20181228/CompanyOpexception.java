package com.bee.supply.chain.finance.common.entity.es.thirdInterfaceForES;

import java.io.Serializable;
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
 * 企业经营异常信息
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_opexception", type = "company_opexception" , shards = 4, replicas = 1)
public class CompanyOpexception implements Serializable {

	private static final long serialVersionUID = -2436332266893362615L;
	/**
     * 企业经营异常信息表id
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
     * 列入经营异常名录原因
     */
    @Field(type = FieldType.Text, searchAnalyzer = "ik", analyzer = "ik")
    private String addReason;
    /**
     * 列入日期
     */
    @Field(type = FieldType.Date)
    private Date addDate;
    /**
     * 移出经营异常名录原因
     */
    @Field(type = FieldType.Text, searchAnalyzer = "ik", analyzer = "ik")
    private String romoveReason;
    /**
     * 移出日期
     */
    @Field(type = FieldType.Date)
    private Date removeDate;
    /**
     * 作出决定机关
     */
    @Field(type = FieldType.Text)
    private String decisionOffice;
    /**
     * 移除决定机关
     */
    @Field(type = FieldType.Text)
    private String removeDecisionOffice;
    /**
     * 创建时间
     */
    @Field(type = FieldType.Date)
    private Date createTime;

}
