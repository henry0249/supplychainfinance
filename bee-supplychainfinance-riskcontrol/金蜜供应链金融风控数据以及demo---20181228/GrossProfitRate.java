package com.bee.supply.chain.finance.common.entity.es.thirdInterfaceForES;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import com.baomidou.mybatisplus.annotations.TableName;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * <p>
 * 原料加工销售毛利率表GrossProfitRate
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-28
 */
@TableName("gross_profit_rate")
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-gross_profit_rate", type = "gross_profit_rate" , shards = 4, replicas = 1)
public class GrossProfitRate{


    /**
     * 原材料唯一ID，预留字段
     */
	@Id
    @Field(type = FieldType.Keyword)
    private Long id;
    /**
     * 原材料名称
     */
    @Field(type = FieldType.Text)
    private String sourceName;
    /**
     * 毛利率
     */
    @Field(type = FieldType.Double)
    private Double grossProfitRate;
    /**
     * 计算公式
     */
    @Field(type = FieldType.Text)
    private String equationRemark;

}
