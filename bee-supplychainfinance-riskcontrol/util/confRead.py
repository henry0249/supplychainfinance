#!/usr/bin/env python
# -*- coding:utf-8 -*-

"""
Created on 2019/1/27
@Author: regan
"""
import os, sys, configparser

dir = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.dirname(dir))


def confRead(buyOrSell, gradeOrWeight):
    if buyOrSell == 'buy' and gradeOrWeight == 'grade':
        buy_grade_path = os.path.join(os.path.dirname(dir), 'conf', 'buy_grade.cfg')
        conf_grade = configparser.ConfigParser()
        conf_grade.read(buy_grade_path, encoding='utf-8')
        return conf_grade
    elif buyOrSell == 'buy' and gradeOrWeight == 'weight':
        buy_weight_path = os.path.join(os.path.dirname(dir), 'conf', 'buy_weight.cfg')
        conf_weight = configparser.ConfigParser()
        conf_weight.read(buy_weight_path, encoding='utf-8')
        return conf_weight
    elif buyOrSell == 'sell' and gradeOrWeight == 'grade':
        sell_grade_path = os.path.join(os.path.dirname(dir), 'conf', 'sell_grade.cfg')
        conf_grade = configparser.ConfigParser()
        conf_grade.read(sell_grade_path, encoding='utf-8')
        return conf_grade
    elif buyOrSell == 'sell' and gradeOrWeight == 'weight':
        sell_weight_path = os.path.join(os.path.dirname(dir), 'conf', 'sell_weight.cfg')
        conf_weight = configparser.ConfigParser()
        conf_weight.read(sell_weight_path, encoding='utf-8')
        return conf_weight
