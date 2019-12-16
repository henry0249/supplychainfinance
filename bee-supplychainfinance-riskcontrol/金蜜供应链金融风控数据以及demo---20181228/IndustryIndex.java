package com.bee.supply.chain.finance.common.entity.es.thirdInterfaceForES;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * <p>
 * 行业指数信息
 * </p>
 *
 * @author zhigang.zhou123
 * @since 2018-12-29
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-industry_index", type = "industry_index" , shards = 4, replicas = 1)
public class IndustryIndex {
	
	@Id
    @Field(type = FieldType.Keyword)
    private Long id;

    /**
     * 指数值
     */
    @Field(type = FieldType.Text)
    private String indexValue;
    /**
     * 细类名称：铬系、锰系、金属硅、镍系、硅铁等
     */
    @Field(type = FieldType.Text)
    private String indexFirstType;
    /**
     * 指数类型：综合指数，估价指数
     */
    @Field(type = FieldType.Text)
    private String indexSecondType;
    /**
     * 三级类型名称：铬矿综合指数、铬矿现货价格指数、铬矿期货价格指数等
     */
    @Field(type = FieldType.Text)
    private String indexThirdType;
    /**
     * 指数日期
     */
    @Field(type = FieldType.Date)
    private Date indexDate;

}
