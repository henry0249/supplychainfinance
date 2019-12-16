package com.bee.supply.chain.finance.common.entity.es.thirdInterfaceForES;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

/**
 * <p>
 * 公司产品表CompanyCompanyproducts
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_companyproducts", type = "company_companyproducts" , shards = 4, replicas = 1)
public class CompanyCompanyproducts {

    /**
     * 公司产品id
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
     * 企业名称
     */
    @Field(type = FieldType.Text)
    private String companyName;
    /**
     * 企业的关联链接
     */
    @Field(type = FieldType.Text)
    private String link;
    /**
     * 产品的图片
     */
    @Field(type = FieldType.Text)
    private String imageUrl;
    /**
     * 产品名称
     */
    @Field(type = FieldType.Text)
    private String name;
    /**
     * 产品领域
     */
    @Field(type = FieldType.Text)
    private String domain;
    /**
     * 产品标签
     */
    @Field(type = FieldType.Text)
    private String tags;
    /**
     * 产品描述
     */
    @Field(type = FieldType.Text, searchAnalyzer = "ik", analyzer = "ik")
    private String description;
    /**
     * 产品类型
     */
    @Field(type = FieldType.Text)
    private String category;

}
