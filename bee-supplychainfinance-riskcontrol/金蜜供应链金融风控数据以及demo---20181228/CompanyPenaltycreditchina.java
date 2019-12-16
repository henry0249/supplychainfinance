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
 * 行政处罚【信用中国】表CompanyPenaltycreditchina
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_penaltycreditchina", type = "company_penaltycreditchina" , shards = 4, replicas = 1)
public class CompanyPenaltycreditchina{
    /**
     * 行政处罚【信用中国】表id
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
     * 决定文书号
     */
    @Field(type = FieldType.Text)
    private String caseNo;
    /**
     * 处罚名称
     */
    @Field(type = FieldType.Text)
    private String name;
    /**
     * 决定日期
     */
    @Field(type = FieldType.Date)
    private Date liandate;
    /**
     * 地域
     */
    @Field(type = FieldType.Text)
    private String province;
    /**
     * 所属人
     */
    @Field(type = FieldType.Text)
    private String ownerName;
    /**
     * 处罚事由
     */
	 @Field(type = FieldType.Text, searchAnalyzer = "ik", analyzer = "ik")
    private String caseReason;
    /**
     * 创建时间
     */
	 @Field(type = FieldType.Date)
    private Date createTime;

}
