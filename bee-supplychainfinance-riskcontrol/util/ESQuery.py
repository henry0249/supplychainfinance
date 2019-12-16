# -*- coding: utf-8 -*-

import os, sys
from util.ESConnector import ESConnector
from xml.etree import ElementTree

dir = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.dirname(dir))

configpath = os.path.join(os.path.dirname(dir), 'conf', 'conf.xml')
indexpath = os.path.join(os.path.dirname(dir), 'conf', 'index.xml')


class myEs(object):
    def __readxml(self, filepath):
        tree = ElementTree.ElementTree(file=filepath)
        root = tree.getroot()

        fields = {}
        doc_type = None
        for index_node in root.findall('index'):
            index = index_node.attrib['name'].lower()
            for map_node in index_node.findall('map'):
                doc_type = map_node.attrib['name'].lower()
                for field_node in map_node.findall('field'):
                    if field_node.attrib['type'] == 'integer':
                        fields[field_node.text] = 0
                    else:
                        fields[field_node.text] = ''
                break
            break
        return index, doc_type, fields

    def __init__(self, dbconf, indexconf):
        self.index, self.doc_type, self.fields = self.__readxml(indexconf)
        self.handle = ESConnector(config=dbconf)

    def __add_default(self, hit, fields):
        doc = {}
        for k in fields:
            if k == 'id':
                doc['id'] = hit['_id']
            elif k not in hit['_source']:
                doc[k] = self.fields[k]
            elif isinstance(self.fields[k], int) and not isinstance(hit['_source'][k], int):
                doc[k] = int(hit['_source'][k])
            else:
                doc[k] = hit['_source'][k]
        return doc

    def __append_item(self, filter):
        booldsl = []
        for k, v in filter.items():
            if isinstance(v, list):
                term = {'terms': {k: v}}
            elif isinstance(v, dict):
                term = {'range': {k: v}}
            else:
                term = {'term': {k: v}}
            booldsl.append(term)
        return booldsl

    def __append_sort(self, sort):
        return [{s[0]: {'order': s[1]}} for s in sort]

    def __build_dsl(self, query, filter, fields, sort, rows):
        dsl = {'query': {'bool': {}}}

        if rows:
            dsl['size'] = rows

        should = []
        for field, values in query.items():
            for word in values:
                booldsl = [{'term': {field: word}}]
                should.append({'bool': {'must': booldsl}})
        if should:
            dsl['query']['bool']['should'] = should
            dsl['query']['bool']['minimum_should_match'] = 1

        booldsl = self.__append_item(filter)
        if booldsl:
            dsl['query']['bool']['filter'] = booldsl

        sortdsl = self.__append_sort(sort)
        if sortdsl:
            dsl['sort'] = sortdsl

        if fields:
            dsl['_source'] = fields

        # print json.JSONEncoder().encode(dsl)
        return dsl

    def select(self, query=[], filter={}, fields=[], sort=[], rows=10):
        f = not fields and self.fields.keys() or fields
        dsl = self.__build_dsl(query, filter, fields, sort, rows)
        for doc in self.handle.find(self.index, self.doc_type, dsl, True)['hits']['hits']:
            yield self.__add_default(doc, f)

    def cursor(self, query={}, filter={}, fields=[], sort=[]):
        f = not fields and self.fields.keys() or fields
        dsl = self.__build_dsl(query, filter, fields, sort, None)
        for doc in self.handle.scan(self.index, self.doc_type, dsl):
            yield self.__add_default(doc, f)


if __name__ == '__main__':
    es = myEs(configpath, indexpath)
    query = {'sentiment_id': ['bb42e2116848a08fd0a5e28bd583a565', '91e1bbbc935dbd99676a8bb73b41acac']}

    for doc in es.cursor(query=query, fields=['negative_index', 'media_type', 'emotional']):
        print doc['media_type']
