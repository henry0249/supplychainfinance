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
 * 变更信息表CompanyChangerecords
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_changerecords", type = "company_changerecords" , shards = 4, replicas = 1)
public class CompanyChangerecords {

    @Id
    @Field(type = FieldType.Keyword)
    private Long id;
    /**
     * 关联企业基础信息表id
     */
    @Field(type = FieldType.Long)
    private Long companyBaseId;
    /**
     * 变更事项
     */
    @Field(type = FieldType.Text)
    private String projectName;
    /**
     * 变更前内容
     */
    @Field(type = FieldType.Text, searchAnalyzer = "ik", analyzer = "ik")
    private String beforeContent;
    /**
     * 变更后内容
     */
    @Field(type = FieldType.Text, searchAnalyzer = "ik", analyzer = "ik")
    private String afterContent;
    /**
     * 变更日期
     */
    @Field(type = FieldType.Date)
    private Date changeDate;
    /**
     * 创建时间
     */
    @Field(type = FieldType.Date)
    private Date createTime;

}
