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
 * 经营异常表CompanyExceptions
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_exceptions", type = "company_exceptions" , shards = 4, replicas = 1)
public class CompanyExceptions {

    /**
     * 经营异常表id
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
     * 列入经营异常名录原因
     */
    @Field(type = FieldType.Text, searchAnalyzer = "ik", analyzer = "ik")
    private String addReason;
    /**
     * 列入日期
     */
    @Field(type = FieldType.Date)
    private Date addDate;
    /**
     * 移出经营异常名录原因
     */
    @Field(type = FieldType.Text, searchAnalyzer = "ik", analyzer = "ik")
    private String romoveReason;
    /**
     * 移出日期
     */
    @Field(type = FieldType.Date)
    private Date removeDate;
    /**
     * 作出决定机关
     */
    @Field(type = FieldType.Text)
    private String decisionOffice;
    /**
     * 移除决定机关
     */
    @Field(type = FieldType.Text)
    private String removeDecisionOffice;
    /**
     * 创建时间
     */
    @Field(type = FieldType.Date)
    private Date createTime;

}
