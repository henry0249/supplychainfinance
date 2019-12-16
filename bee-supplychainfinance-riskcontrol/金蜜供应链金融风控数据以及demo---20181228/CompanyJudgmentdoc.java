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
 * 企业司法相关信息CompanyJudgmentdoc
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_judgmentdoc", type = "company_judgmentdoc" , shards = 4, replicas = 1)
public class CompanyJudgmentdoc {

    /**
     * 企业司法相关信息表id
     */
    @Id
    @Field(type = FieldType.Keyword)
    private Long judId;
    /**
     * 关联企业基础信息表id
     */
    @Field(type = FieldType.Long)
    private Long companyBaseId;
    /**
     * 三方接口返回id
     */
    @Field(type = FieldType.Text)
    private String id;
    /**
     * 执行法院
     */
    @Field(type = FieldType.Text)
    private String court;
    /**
     * 裁判文书名字
     */
    @Field(type = FieldType.Text)
    private String caseName;
    /**
     * 裁判文书编号
     */
    @Field(type = FieldType.Text)
    private String caseNo;

    @Field(type = FieldType.Text)
    private String caseType;
    /**
     * 发布时间
     */
    @Field(type = FieldType.Date)
    private Date submitDate;
    /**
     * 审判时间
     */
    @Field(type = FieldType.Date)
    private Date updateDate;
    /**
     * 是否原告（供参考）
     */
    @Field(type = FieldType.Text)
    private String isProsecutor;
    /**
     * 是否被告（供参考）
     */
    @Field(type = FieldType.Text)
    private String isDefendant;
    /**
     * 开庭时间年份
     */
    @Field(type = FieldType.Text)
    private String courtYear;
    /**
     * 涉案人员角色
     */
    @Field(type = FieldType.Text)
    private String caseRole;
    /**
     * 创建时间
     */
    @Field(type = FieldType.Date)
    private Date createTime;

}
