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
 * 严重违法表CompanySeriousviolation
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_seriousviolation", type = "company_seriousviolation" , shards = 4, replicas = 1)
public class CompanySeriousviolation{


    /**
     * 严重违法表id
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
     * 类型
     */
	@Field(type = FieldType.Text)
    private String type;
    /**
     * 列入原因
     */
	@Field(type = FieldType.Text, searchAnalyzer = "ik", analyzer = "ik")
    private String addReason;
    /**
     * 列入时间
     */
	@Field(type = FieldType.Date)
    private Date addDate;
    /**
     * 列入决定机关
     */
	@Field(type = FieldType.Text)
    private String addOffice;
    /**
     * 移除原因
     */
	@Field(type = FieldType.Text, searchAnalyzer = "ik", analyzer = "ik")
    private String removeReason;
    /**
     * 移除时间
     */
	@Field(type = FieldType.Date)
    private Date removeDate;
    /**
     * 移除决定机关
     */
	@Field(type = FieldType.Text)
    private String removeOffice;
    /**
     * 创建时间
     */
	@Field(type = FieldType.Date)
    private Date createTime;

}
