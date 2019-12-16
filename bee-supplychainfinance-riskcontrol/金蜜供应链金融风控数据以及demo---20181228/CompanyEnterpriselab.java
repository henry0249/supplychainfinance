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
 * 企业对外投资信息表CompanyEnterpriselab
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_enterpriselab", type = "company_enterpriselab" , shards = 4, replicas = 1)
public class CompanyEnterpriselab {

    /**
     * 企业对外投资信息表id
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
     * 投资公司KeyNo
     */
    @Field(type = FieldType.Text)
    private String keyNo;
    /**
     * 投资方名称
     */
    @Field(type = FieldType.Text)
    private String companyName;
    /**
     * 投资方简称
     */
    @Field(type = FieldType.Text)
    private String investerShortName;
    /**
     * 投资方Id
     */
    @Field(type = FieldType.Text)
    private String investId;
    /**
     * 被投公司名称
     */
    @Field(type = FieldType.Text)
    private String toCompanyName;
    /**
     * 被投公司KeyNo
     */
    @Field(type = FieldType.Text)
    private String toKeyNo;
    /**
     * 投资日期
     */
    @Field(type = FieldType.Date)
    private Date changeDate;
    /**
     * 创建时间
     */
    @Field(type = FieldType.Date)
    private Date createTime;

}
