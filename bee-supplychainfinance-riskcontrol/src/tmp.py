#!/usr/bin/env python
# -*- coding:utf-8 -*-

"""
Created on 2019/2/8
@Author: regan
"""
from datetime import datetime

print datetime.strptime(datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S')
