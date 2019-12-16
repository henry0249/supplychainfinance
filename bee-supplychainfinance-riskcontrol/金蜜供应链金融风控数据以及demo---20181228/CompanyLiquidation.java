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
 * 清算CompanyLiquidation
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_liquidation", type = "company_liquidation" , shards = 4, replicas = 1)
public class CompanyLiquidation {

    /**
     * 清算表id
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
     * 清算组负责人
     */
    @Field(type = FieldType.Text)
    private String leader;
    /**
     * 清算组成员
     */
    @Field(type = FieldType.Text)
    private String member;
    /**
     * 创建时间
     */
    @Field(type = FieldType.Date)
    private Date createTime;

}
