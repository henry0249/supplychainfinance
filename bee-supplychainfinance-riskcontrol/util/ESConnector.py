#!/usr/bin/python
# -*- coding: utf-8 -*-

from Connector import Connector
from elasticsearch import Elasticsearch, helpers
import traceback, logging


class ESConnector(Connector):
    def __init__(self, **args):
        super(ESConnector, self).__init__('elasticsearch', **args)

        host = []
        for item in self.host.split(','):
            p = item.split(':')
            host.append({'host': p[0], 'port': int(p[1])})
        self.host = host

        try:
            self.__client = Elasticsearch(self.host, timeout=60)
        except Exception, e:
            raise e

    def create(self, index, setting, force=False):
        tag = True
        try:
            if self.__client.indices.exists(index) and force:
                self.__client.indices.delete(index)
                self.__client.indices.create(index, {'settings': setting})
            elif not self.__client.indices.exists(index):
                self.__client.indices.create(index, {'settings': setting})
            else:
                logging.warning('The index(%s) is created.' % (index))
                tag = False
        except:
            logging.error(traceback.format_exc())
            tag = False
        finally:
            return tag

    def map(self, index, mapping, properties):
        tag = True
        try:
            self.__client.indices.put_mapping(mapping, {mapping: properties}, index)
        except:
            logging.error(traceback.format_exc())
            tag = False
        finally:
            return tag

    def find(self, index, doc_type, dsl, source=False):
        page = {}
        try:
            page = self.__client.search(index, doc_type, dsl, _source=source)
        except Exception, e:
            logging.error(traceback.format_exc())
        finally:
            return page

    def count(self, index, doc_type, dsl='{}'):
        page = {}
        try:
            page = self.__client.count(index, doc_type, dsl)
        except Exception, e:
            logging.error(traceback.format_exc())
        finally:
            return page

    def scan(self, index, doc_type, dsl):
        try:
            for hit in helpers.scan(self.__client, query=dsl, index=index, doc_type=doc_type):
                yield hit
        except Exception, e:
            logging.error(traceback.format_exc())

    def bulk(self, actions):
        page = (False, 0)
        try:
            page = helpers.bulk(self.__client, actions, stats_only=True, request_timeout=120)
        except Exception, e:
            logging.error(traceback.format_exc())
        finally:
            return page

    def delete(self, index, doc_type, id):
        page = {}
        try:
            page = self.__client.delete(index=index.lower(), doc_type=doc_type, id=id)
        except Exception, e:
            logging.error(traceback.format_exc())
        finally:
            return page

    def delete_by_query(self, index, doc_type, body):
        try:
            self.__client.delete_by_query(index=index, doc_type=doc_type, body=body, conflicts='proceed')
        except Exception, e:
            logging.error(traceback.format_exc())

    def insert(self, index, doc_type, id, body):
        page = {}
        try:
            page = self.__client.index(index=index, doc_type=doc_type, id=id, body=body)
        except Exception, e:
            logging.error(traceback.format_exc())
        finally:
            return page
