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
 * 分支机构表CompanyBranches
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_branches", type = "company_branches" , shards = 4, replicas = 1)
public class CompanyBranches{

    @Id
    @Field(type = FieldType.Keyword)
    private Long id;
    /**
     * 关联企业基础信息表id
     */
    @Field(type = FieldType.Long)
    private Long companyBaseId;
    /**
     * 公司KeyNo
     */
    @Field(type = FieldType.Text)
    private String companyId;
    /**
     * 注册号或社会统一信用代码（存在社会统一信用代码显示社会统一信用代码，否则显示注册号）
     */
    @Field(type = FieldType.Text)
    private String regNo;
    /**
     * 名称
     */
    @Field(type = FieldType.Text)
    private String name;
    /**
     * 登记机关
     */
    @Field(type = FieldType.Text)
    private String belongOrg;
    /**
     * 社会统一信用代码（保留字段，目前为空）
     */
    @Field(type = FieldType.Text)
    private String creditCode;
    /**
     * 法人姓名（保留字段，目前为空）
     */
    @Field(type = FieldType.Text)
    private String operName;
    /**
     * 创建时间
     */
    @Field(type = FieldType.Date)
    private Date createTime;

}
