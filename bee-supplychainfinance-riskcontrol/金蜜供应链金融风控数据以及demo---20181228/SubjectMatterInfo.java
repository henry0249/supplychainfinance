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
 * 标的物信息表SubjectMatterInfo
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-28
 */
@TableName("subject_matter_info")
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-subject_matter_info", type = "subject_matter_info" , shards = 4, replicas = 1)
public class SubjectMatterInfo{


    /**
     * 标的物唯一ID
     */
	@Id
    @Field(type = FieldType.Keyword)
    private Long id;
    /**
     * 标的物名称（品名）
     */
	 @Field(type = FieldType.Text)
    private String tast;
    /**
     * 大类
     */
	 @Field(type = FieldType.Text)
    private String bigType;
    /**
     * 规格
     */
	 @Field(type = FieldType.Text)
    private String specification;
    /**
     * 标的物来源
     */
	 @Field(type = FieldType.Text)
    private String sourceAddress;
    /**
     * 是否标准品
     */
	 @Field(type = FieldType.Text)
    private String ifStanard;
    /**
     * 数据来源
     */
	 @Field(type = FieldType.Text)
    private String dataFrom;
    /**
     * 价格单位
     */
	 @Field(type = FieldType.Text)
    private String priceUnit;
    /**
     * 标的物变现能力
     */
	 @Field(type = FieldType.Text)
    private String sourceToMoney;
    /**
     * 标的物易损耗性
     */
	 @Field(type = FieldType.Text)
    private String sourceConsumable;
    /**
     * 标的物稳定性
     */
	 @Field(type = FieldType.Text)
    private String sourceStabilization;
    /**
     * 创建时间
     */
	 @Field(type = FieldType.Date)
    private Date createTime;
    /**
     * 创建人
     */
	 @Field(type = FieldType.Text)
    private String creator;
    /**
     * 更新时间
     */
	 @Field(type = FieldType.Date)
    private Date updateTime;
    /**
     * 更新人
     */
	 @Field(type = FieldType.Text)
    private String updatePerson;

}
