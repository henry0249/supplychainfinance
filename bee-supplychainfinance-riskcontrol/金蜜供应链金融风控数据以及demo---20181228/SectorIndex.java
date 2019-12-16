package com.bee.supply.chain.finance.common.entity.es.thirdInterfaceForES;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * <p>
 * 原料加工销售毛利率表SectorIndex
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-28
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-sector_index", type = "sector_index" , shards = 4, replicas = 1)
public class SectorIndex{

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
    @Field(type = FieldType.Text)
    private Double grossProfitRate;
    /**
     * 计算公式
     */
    @Field(type = FieldType.Text)
    private String equationRemark;


}
