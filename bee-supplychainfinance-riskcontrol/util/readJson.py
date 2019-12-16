#!/usr/bin/env python
# -*- coding:utf-8 -*-

"""
Created on 2019/2/16
@Author: regan
"""
import json, sys, os


def read(path):
    result = set()
    with open(path, 'r') as f:
        for line in f.readlines():
            result.add(json.loads(line)['name'])
    return result


if __name__ == '__main__':
    dir = os.path.dirname(os.path.realpath(__file__))
    sys.path.append(os.path.dirname(dir))
    path = os.path.join(os.path.dirname(dir), 'spider', 'creditBlack.json')
    print read(path)
