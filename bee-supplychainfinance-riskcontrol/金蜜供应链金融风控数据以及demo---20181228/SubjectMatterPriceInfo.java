package com.bee.supply.chain.finance.common.entity.es.thirdInterfaceForES;

import java.util.Date;

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
 * 标的物时间价格信息表
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-28
 */
@TableName("subject_matter_price_info")
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-subject_matter_price_info", type = "subject_matter_price_info" , shards = 4, replicas = 1)
public class SubjectMatterPriceInfo{

    /**
     * 标的物唯一ID，与标的物信息表ID关联
     */
	@Id
    @Field(type = FieldType.Keyword)
    private Long id;
	
    @Field(type = FieldType.Long)
    private Long sId;
    /**
     * 日期
     */
    @Field(type = FieldType.Date)
    private Date priceDate;
    /**
     * 价格
     */
    @Field(type = FieldType.Date)
    private Double price;


}
