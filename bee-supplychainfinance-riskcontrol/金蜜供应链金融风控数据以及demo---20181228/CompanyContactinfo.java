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
 * 联系信息表CompanyContactinfo
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */

@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_contactinfo", type = "company_contactinfo" , shards = 4, replicas = 1)
public class CompanyContactinfo {

    /**
     * 网址名称
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
     * 联系电话
     */
    @Field(type = FieldType.Text)
    private String webSiteName;
    /**
     * 网址地址
     */
    @Field(type = FieldType.Text)
    private String webSiteUrl;
    /**
     * 联系电话
     */
    @Field(type = FieldType.Text)
    private String phoneNumber;
    /**
     * 邮箱
     */
    @Field(type = FieldType.Text)
    private String email;
    /**
     * 创建时间
     */
    @Field(type = FieldType.Date)
    private Date createTime;

}
