package com.bee.supply.chain.finance.common.entity.es.thirdInterfaceForES;

import java.io.Serializable;

import com.baomidou.mybatisplus.enums.IdType;
import java.math.BigDecimal;
import java.util.Date;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.enums.IdType;
import com.baomidou.mybatisplus.activerecord.Model;
import com.baomidou.mybatisplus.annotations.TableName;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.io.Serializable;

/**
 * <p>
 * 订单-委托销售
 * </p>
 *
 * @author zhigang.zhou123
 * @since 2018-12-29
 */
public class OrderEntrustSaleApply {

    /**
     * id
     */
    @Field(type = FieldType.Long)
    private Long id;
    /**
     * 业务id
     */
    @Field(type = FieldType.Text)
    private String entrustSaleId;
    /**
     * 申请公司id
     */
    @Field(type = FieldType.Long)
    private Long applyCompanyId;
    /**
     * 申请公司名
     */
    @Field(type = FieldType.Text)
    private String applyCompanyName;
    /**
     * 上下游公司id
     */
    @Field(type = FieldType.Long)
    private Long upDownstreamId;
    /**
     * 上下游公司名
     */
    @Field(type = FieldType.Text)
    private String upDownstreamName;
    /**
     * 交易货品类id
     */
    @Field(type = FieldType.Integer)
    private Integer tradeGoodsTypeId;
    /**
     * 交易货品类名
     */
    @Field(type = FieldType.Text)
    private String tradeGoodsTypeName;
    /**
     * 交易货品子类名
     */
    @Field(type = FieldType.Text)
    private String tradeGoodsDetail;
    /**
     * 数量
     */
    @Field(type = FieldType.Double)
    private BigDecimal quantity;
    /**
     * 预计金额
     */
    @Field(type = FieldType.Double)
    private BigDecimal estimatedAmount;
    /**
     * 所属部门id
     */
    @Field(type = FieldType.Long)
    private Long approveDepartment;
    /**
     * 创建人id
     */
    @Field(type = FieldType.Long)
    private Long createId;
    /**
     * 创建人名称
     */
    @Field(type = FieldType.Text)
    private String creator;
    /**
     * 创建/申请时间
     */
    @Field(type = FieldType.Date)
    private Date createTime;
    /**
     * 修改人id
     */
    @Field(type = FieldType.Long)
    private Long modifyId;
    /**
     * 修改人名称
     */
    @Field(type = FieldType.Text)
    private String modifier;
    /**
     * 修改时间
     */
    @Field(type = FieldType.Date)
    private Date modifyTime;
    /**
     * 0委托采购1委托销售2金融仓储
     */
    @Field(type = FieldType.Integer)
    private Integer businessMode;
    /**
     * 申请状态 0新增1退回2初审中3风控审核中4终审中5决策复核中
     */
    @Field(type = FieldType.Integer)
    private Integer applyStatus;
    /**
     * 0贷前1贷中2贷后
     */
    @Field(type = FieldType.Integer)
    private Integer type;
    /**
     * 数据状态0删除1正常
     */
    @Field(type = FieldType.Integer)
    private Integer status;


}
