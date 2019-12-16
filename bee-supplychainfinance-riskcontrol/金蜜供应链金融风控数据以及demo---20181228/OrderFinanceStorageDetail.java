package com.bee.supply.chain.finance.common.entity.es.thirdInterfaceForES;

import java.math.BigDecimal;
import java.util.Date;

import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.enums.IdType;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

/**
 * <p>
 * 订单-金融仓储信息表
 * </p>
 *
 * @author zhigang.zhou123
 * @since 2018-12-29
 */
public class OrderFinanceStorageDetail {

    /**
     * ID
     */
    @Id
    @Field(type = FieldType.Keyword)
    private Long id;
    /**
     * 业务主键id
     */
    @Field(type = FieldType.Text)
    private String financeStorageDetailId;
    /**
     * 金融仓储id
     */
    @Field(type = FieldType.Long)
    private Long financeStorageApplyId;
    /**
     * 项目意义
     */
    @Field(type = FieldType.Text)
    private String projectSignificance;
    /**
     * 委托方公司ID
     */
    @Field(type = FieldType.Long)
    private Long clientId;
    /**
     * 委托方公司名称
     */
    @Field(type = FieldType.Text)
    private String clientName;
    /**
     * 委托方公司成立时间
     */
    @Field(type = FieldType.Date)
    private Date clientFoundingTime;
    /**
     * 委托方公司法人
     */
    @Field(type = FieldType.Text)
    private String clientCorporation;
    /**
     * 委托方公司注册资本
     */
    @Field(type = FieldType.Text)
    private String clientRegistCapital;
    /**
     * 委托方公司地址
     */
    @Field(type = FieldType.Text)
    private String clientAddress;
    /**
     * 委托企业简称
     */
    @Field(type = FieldType.Text)
    private String clientAbbre;
    /**
     * 货品code
     */
    @Field(type = FieldType.Integer)
    private Integer tradeGoodsCode;
    /**
     * 货品
     */
    @Field(type = FieldType.Text)
    private String tradeGoods;
    /**
     * 规格code
     */
    @Field(type = FieldType.Integer)
    private Integer specificationsCode;
    /**
     * 规格
     */
    @Field(type = FieldType.Text)
    private String specifications;
    /**
     * 来源地区code
     */
    @Field(type = FieldType.Integer)
    private Integer sourceAreaCode;
    /**
     * 来源地区
     */
    @Field(type = FieldType.Text)
    private String sourceArea;
    /**
     * 数量
     */
    @Field(type = FieldType.Double)
    private BigDecimal quantity;
    /**
     * 单价
     */
    @Field(type = FieldType.Double)
    private BigDecimal unitPrice;
    /**
     * 品位
     */
    @Field(type = FieldType.Double)
    private BigDecimal grade;
    /**
     * 质押比例
     */
    @Field(type = FieldType.Double)
    private BigDecimal pledgeRatio;
    /**
     * 货代公司名称
     */
    @Field(type = FieldType.Text)
    private String freightForwardName;
    /**
     * 是否有担保企业
     */
    @Field(type = FieldType.Integer)
    private Integer hasGuarantor;
    /**
     * 担保企业名称
     */
    @Field(type = FieldType.Text)
    private String guarantorName;
    /**
     * 委托企业支付方式（现金、承兑）
     */
    @Field(type = FieldType.Integer)
    private Integer paymentMode;
    /**
     * 最晚提货日期
     */
    @Field(type = FieldType.Date)
    private Date latestDeliveryDate;
    /**
     * 资金占用天数
     */
    @Field(type = FieldType.Integer)
    private Integer capitalOccupationDays;
    /**
     * 年化利率
     */
    @Field(type = FieldType.Double)
    private BigDecimal annualRate;
    /**
     * 其他补充信息
     */
    @Field(type = FieldType.Text, searchAnalyzer = "ik", analyzer = "ik")
    private String additionalInformation;
    /**
     * 额度
     */
    @Field(type = FieldType.Double)
    private BigDecimal quota;
    /**
     * 立项人所属部门
     */
    @Field(type = FieldType.Text)
    private String approveDepartment;
    /**
     * 立项人姓名
     */
    @Field(type = FieldType.Text)
    private String approveName;
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
     * 数据状态0删除1正常
     */
    @Field(type = FieldType.Integer)
    private Integer status;


}
