package com.bee.supply.chain.finance.common.entity.es.thirdInterfaceForES;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import java.util.Date;

/**
 * <p>
 * 行业分类数据表CompanyIndustry
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_industry", type = "company_industry" , shards = 4, replicas = 1)
public class CompanyIndustry {

    @Id
    @Field(type = FieldType.Keyword)
    private Long id;
    /**
     * 关联企业基础信息表id
     */
    @Field(type = FieldType.Long)
    private Long companyBaseId;
    /**
     * 行业门类code
     */
    @Field(type = FieldType.Text)
    private String industryCode;
    /**
     * 行业门类描述
     */
    @Field(type = FieldType.Text, searchAnalyzer = "ik", analyzer = "ik")
    private String Industry;
    /**
     * 行业大类code
     */
    @Field(type = FieldType.Text)
    private String subIndustryCode;
    /**
     * 行业大类描述
     */
    @Field(type = FieldType.Text, searchAnalyzer = "ik", analyzer = "ik")
    private String subIndustry;
    /**
     * 行业中类code
     */
    @Field(type = FieldType.Text)
    private String middleCategoryCode;
    /**
     * 行业中类描述
     */
    @Field(type = FieldType.Text, searchAnalyzer = "ik", analyzer = "ik")
    private String middleCategory;
    /**
     * 行业小类code
     */
    @Field(type = FieldType.Text)
    private String smallCategoryCode;
    /**
     * 行业小类描述
     */
    @Field(type = FieldType.Text, searchAnalyzer = "ik", analyzer = "ik")
    private String smallCategory;
    /**
     * 创建时间
     */
    @Field(type = FieldType.Date)
    private Date createTime;

}
