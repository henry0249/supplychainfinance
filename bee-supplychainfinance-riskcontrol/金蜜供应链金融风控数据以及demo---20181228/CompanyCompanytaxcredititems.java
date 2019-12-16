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
 * 纳税信用等级表CompanyCompanytaxcredititems
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */

@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_companytaxcredititems", type = "company_companytaxcredititems" , shards = 4, replicas = 1)
public class CompanyCompanytaxcredititems {

    /**
     * 纳税信用等级id
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
     * 纳税人识别号
     */
    @Field(type = FieldType.Text)
    private String no;
    /**
     * 纳税人名称
     */
    @Field(type = FieldType.Text)
    private String name;
    /**
     * 评价年度
     */
    @Field(type = FieldType.Text)
    private String year;
    /**
     * 信用等级
     */
    @Field(type = FieldType.Text)
    private String level;
    /**
     * 创建时间
     */
    @Field(type = FieldType.Date)
    private Date createTime;

}
