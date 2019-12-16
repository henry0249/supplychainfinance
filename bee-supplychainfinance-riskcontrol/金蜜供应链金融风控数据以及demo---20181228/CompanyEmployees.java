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
 * 主要人员表CompanyEmployees
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_employees", type = "company_employees" , shards = 4, replicas = 1)
public class CompanyEmployees {

    @Id
    @Field(type = FieldType.Keyword)
    private Long id;
    /**
     * 关联企业基础信息表id
     */
    @Field(type = FieldType.Long)
    private Long companyBaseId;
    /**
     * 名称
     */
    @Field(type = FieldType.Text)
    private String name;
    /**
     * 职位
     */
    @Field(type = FieldType.Text)
    private String job;
    /**
     * 创建时间
     */
    @Field(type = FieldType.Date)
    private Date createTime;

}
