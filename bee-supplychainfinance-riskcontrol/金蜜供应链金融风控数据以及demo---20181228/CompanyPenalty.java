package com.bee.supply.chain.finance.common.entity.es.thirdInterfaceForES;

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
 * 行政处罚表CompanyPenalty
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_penalty", type = "company_penalty" , shards = 4, replicas = 1)
public class CompanyPenalty{
    /**
     * 行政处罚表id
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
     * 行政处罚决定书文号
     */
	 @Field(type = FieldType.Text)
    private String docNo;
    /**
     * 违法行为类型
     */
	 @Field(type = FieldType.Text)
    private String penaltyType;
    /**
     * 行政处罚决定机关名称
     */
	 @Field(type = FieldType.Text)
    private String officeName;
    /**
     * 行政处罚内容
     */
	 @Field(type = FieldType.Text, searchAnalyzer = "ik", analyzer = "ik")
    private String content;
    /**
     * 作出行政处罚决定日期
     */
	 @Field(type = FieldType.Date)
    private Date penaltyDate;
    /**
     * 作出行政公示日期
     */
	 @Field(type = FieldType.Date)
    private Date publicDate;
    /**
     * 备注
     */
	 @Field(type = FieldType.Text)
    private String remark;
    /**
     * 创建时间
     */
	 @Field(type = FieldType.Date)
    private Date createTime;

}
