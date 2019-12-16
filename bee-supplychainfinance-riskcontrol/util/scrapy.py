# -*- coding: utf-8 -*-

"""
Created on 2019/2/8
@Author: regan
"""
import requests, base64
import hashlib
import time
import urllib
import urllib2
import json
import string

FATEA_PRED_URL = "http://pred.fateadm.com"

def getHtml(url):
    # 获取网页内容
    page = urllib.urlopen(url)
    html = page.read()
    return html


def getcontent(html):
    # 内容分割的标签
    str = '<div class="form-group" id="yzm-group">'
    content = html.partition(str)[2]
    str1 = '<div class="col-sm-2 alert alert-warning mine-hidden mysetalert" style="padding: 5px;text-align:center;">'
    content = content.partition(str1)[0]
    return content  # 得到网页的内容


def title(content, beg=0):
    try:
        num1 = content.index('src="', beg)
        num2 = content.index('" onclick="refresh(this)"', num1)
        return 'http://zhixing.court.gov.cn/search/' + content[num1 + 5:num2]
    except Exception:
        num1 = content.index('src="', beg)
        num2 = content.index('" onclick="refresh(this)"', num1)
        return 'http://zhixing.court.gov.cn/search/' + content[num1 + 5:num2]


def LOG(log):
    # 不需要测试时，注释掉日志就可以了
    print(log)
    log = None


class TmpObj():
    def __init__(self):
        self.init = True
        self.value = None


class Rsp():
    def __init__(self):
        self.ret_code = -1
        self.cust_val = 0.0
        self.err_msg = "succ"
        self.pred_rsp = TmpObj()

    def ParseJsonRsp(self, rsp_data):
        if rsp_data is None:
            self.err_msg = "http request failed, get rsp Nil data"
            return
        jrsp = json.loads(rsp_data)
        self.ret_code = string.atoi(jrsp["RetCode"])
        self.err_msg = jrsp["ErrMsg"]
        self.request_id = jrsp["RequestId"]
        if self.ret_code == 0:
            rslt_data = jrsp["RspData"]
            if rslt_data is not None and rslt_data != "":
                jrsp_ext = json.loads(rslt_data)
                if jrsp_ext.has_key("cust_val"):
                    data = jrsp_ext["cust_val"]
                    self.cust_val = string.atof(data)
                if jrsp_ext.has_key("result"):
                    data = jrsp_ext["result"]
                    self.pred_rsp.value = data


def CalcSign(usr_id, passwd, timestamp):
    md5 = hashlib.md5()
    md5.update(timestamp + passwd)
    csign = md5.hexdigest()

    md5 = hashlib.md5()
    md5.update(usr_id + timestamp + csign)
    csign = md5.hexdigest()
    return csign


def CalcCardSign(cardid, cardkey, timestamp, passwd):
    md5 = hashlib.md5()
    md5.update(passwd + timestamp + cardid + cardkey)
    return md5.hexdigest()


def HttpRequest(url, body_data):
    rsp = Rsp()
    post_data = urllib.urlencode(body_data)
    request = urllib2.Request(url, post_data)
    request.add_header("User-Agent", "Mozilla/5.0")
    rsp_data = urllib2.urlopen(request).read()
    rsp.ParseJsonRsp(rsp_data)
    return rsp


class FateadmApi():
    def __init__(self, app_id, app_key, usr_id, usr_key):
        self.app_id = app_id
        if app_id is None:
            self.app_id = ""
        self.app_key = app_key
        self.usr_id = usr_id
        self.usr_key = usr_key
        self.host = FATEA_PRED_URL

    def SetHost(self, url):
        self.host = url

    #
    # 查询余额
    #
    def QueryBalc(self):
        tm = str(int(time.time()))
        sign = CalcSign(self.usr_id, self.usr_key, tm)
        param = {
            "user_id": self.usr_id,
            "timestamp": tm,
            "sign": sign
        }
        url = self.host + "/api/custval"
        rsp = HttpRequest(url, param)
        if rsp.ret_code == 0:
            LOG("query succ ret: {} cust_val: {} rsp: {} pred: {}".format(rsp.ret_code, rsp.cust_val, rsp.err_msg,
                                                                          rsp.pred_rsp.value))
        else:
            LOG("query failed ret: {} err: {}".format(rsp.ret_code, rsp.err_msg.encode('utf-8')))
        return rsp

    #
    # 查询网络延迟
    #
    def QueryTTS(self, pred_type):
        tm = str(int(time.time()))
        sign = CalcSign(self.usr_id, self.usr_key, tm)
        param = {
            "user_id": self.usr_id,
            "timestamp": tm,
            "sign": sign,
            "predict_type": pred_type,
        }
        if self.app_id != "":
            #
            asign = CalcSign(self.app_id, self.app_key, tm)
            param["appid"] = self.app_id
            param["asign"] = asign
        url = self.host + "/api/qcrtt"
        rsp = HttpRequest(url, param)
        if rsp.ret_code == 0:
            LOG("query rtt succ ret: {} request_id: {} err: {}".format(rsp.ret_code, rsp.request_id, rsp.err_msg))
        else:
            LOG("predict failed ret: {} err: {}".format(rsp.ret_code, rsp.err_msg.encode('utf-8')))
        return rsp

    #
    # 识别验证码
    #
    def Predict(self, pred_type, img_data):
        tm = str(int(time.time()))
        sign = CalcSign(self.usr_id, self.usr_key, tm)
        img_base64 = base64.b64encode(img_data)
        param = {
            "user_id": self.usr_id,
            "timestamp": tm,
            "sign": sign,
            "predict_type": pred_type,
            "img_data": img_base64,
        }
        if self.app_id != "":
            #
            asign = CalcSign(self.app_id, self.app_key, tm)
            param["appid"] = self.app_id
            param["asign"] = asign
        url = self.host + "/api/capreg"
        rsp = HttpRequest(url, param)
        if rsp.ret_code == 0:
            LOG("predict succ ret: {} request_id: {} pred: {} err: {}".format(rsp.ret_code, rsp.request_id,
                                                                              rsp.pred_rsp.value, rsp.err_msg))
        else:
            LOG("predict failed ret: {} err: {}".format(rsp.ret_code, rsp.err_msg.encode('utf-8')))
            if rsp.ret_code == 4003:
                # lack of money
                LOG("cust_val <= 0 lack of money, please charge immediately");
        return rsp

    #
    # 从文件进行验证码识别
    #
    def PredictFromFile(self, pred_type, file_name):
        with open(file_name, "rb+") as f:
            data = f.read()
        return self.Predict(pred_type, data)

    #
    # 识别失败，进行退款请求
    # 注意:
    #    Predict识别接口，仅在ret_code == 0时才会进行扣款，才需要进行退款请求，否则无需进行退款操作
    # 注意2:
    #   退款仅在正常识别出结果后，无法通过网站验证的情况，请勿非法或者滥用，否则可能进行封号处理
    #
    def Justice(self, request_id):
        if request_id == "":
            #
            return
        tm = str(int(time.time()))
        sign = CalcSign(self.usr_id, self.usr_key, tm)
        param = {
            "user_id": self.usr_id,
            "timestamp": tm,
            "sign": sign,
            "request_id": request_id
        }
        url = self.host + "/api/capjust"
        rsp = HttpRequest(url, param)
        if rsp.ret_code == 0:
            LOG("justice succ ret: {} request_id: {} pred: {} err: {}".format(rsp.ret_code, rsp.request_id,
                                                                              rsp.pred_rsp.value, rsp.err_msg))
        else:
            LOG("justice failed ret: {} err: {}".format(rsp.ret_code, rsp.err_msg.encode('utf-8')))
        return rsp

    #
    # 充值接口
    #
    def Charge(self, cardid, cardkey):
        tm = str(int(time.time()))
        sign = CalcSign(self.usr_id, self.usr_key, tm)
        csign = CalcCardSign(cardid, cardkey, tm, self.usr_key)
        param = {
            "user_id": self.usr_id,
            "timestamp": tm,
            "sign": sign,
            'cardid': cardid,
            'csign': csign
        }
        url = self.host + "/api/charge"
        rsp = HttpRequest(url, param)
        if rsp.ret_code == 0:
            LOG("charge succ ret: {} request_id: {} pred: {} err: {}".format(rsp.ret_code, rsp.request_id,
                                                                             rsp.pred_rsp.value, rsp.err_msg))
        else:
            LOG("charge failed ret: {} err: {}".format(rsp.ret_code, rsp.err_msg.encode('utf-8')))
        return rsp


def isZhixing(name, nameId):
    import random
    chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
             'L',
             'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g',
             'h',
             'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    nums = ""
    for i in range(32):
        id = int(random.random() * 61)
        nums += chars[id]

    captchaId = nums.replace("-", "")
    rheaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Connection': 'keep-alive',
        'Host': 'zxgk.court.gov.cn',
    }

    r = requests.post(url='http://zxgk.court.gov.cn/zhzxgk/captcha.do?', headers=rheaders, data=dict(captchaId=captchaId))

    with open('img.png', 'wb') as f:
        f.write(r.content)

    # pd账号秘钥，请在用户信息页获取
    pd_id = "111984"
    pd_key = "hNzePWyEq4U6LRtN8GX+13K53/Z8SHcM"
    app_id = "311984"
    app_key = "sBfljsq+Ee2ZqBotcIaLLEy+3fe4k0ff"
    # 具体类型可以查看官方网站的价格页选择具体的类型，不清楚类型的，可以咨询客服
    pred_type = "30400"
    # 初始化api接口
    api = FateadmApi(app_id, app_key, pd_id, pd_key)
    # 查询余额接口
    api.QueryBalc()
    # 通过文件识别验证码
    # 通过文件进行验证码识别,请使用自己的图片文件替换
    file_name = "img.png"
    # 如果是通过url直接获取内存图片，这直接调用 Predict接口就好
    rsp = api.PredictFromFile(pred_type, file_name)
    pCode = rsp.pred_rsp.value

    data = dict(pName=name, pCardNum=nameId, selectCourtId=0, pCode=pCode, captchaId=captchaId,
                searchCourtName='全国法院（包含地方各级法院）',
                selectCourtArrange=1, urrentPage=1)
    if json.loads(requests.post(url='http://zxgk.court.gov.cn/zhzxgk/searchZhcx.do', headers=rheaders, data=data).content)[0]['result']:
        return True
    return False


if __name__ == '__main__':
    print isZhixing('', '70316927-5')
