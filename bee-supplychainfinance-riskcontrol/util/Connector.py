import traceback, os, logging
from xml.etree import ElementTree

class Connector(object):
    def __parsexml(self, config, dbtype):
        if not os.path.dirname(config):
            DIR = os.path.dirname(os.path.realpath(__file__))
            config = os.path.join(DIR, config)
        
        if not os.path.exists(config):
            logging.warning('There is not any file named %s.' % (config))
        else:
            tree = ElementTree.ElementTree(file = config)
            root = tree.getroot()
            
            for node in root.find(dbtype):
                self.__setattr__(node.tag.lower(), node.text)
                
#             node = root.find(dbtype)
#              
#             if node is None:
#                 logging.warning('There are any nodes named %s in %s.' % (dbtype, config))
#             else:
#                 host = node.find('host')
#                 if host is None:
#                     logging.warning('There are any nodes named host in %s of %s.' % (config, dbtype))
#                 else:
#                     self._host = host.text
#                 port = node.find('port')
#                 if port is None:
#                     logging.warning('There are any nodes named port in %s of %s.' % (config, dbtype))
#                 else:
#                     self._port = port.text
#                 database = node.find('database')
#                 if database is None:
#                     logging.warning('There are any nodes named database in %s of %s.' % (config, dbtype))
#                 else:
#                     self._database = database.text
#                 user = node.find('user')
#                 if user is None:
#                     logging.warning('There are any nodes named user in %s of %s.' % (config, dbtype))
#                 else:
#                     self._user = user.text
#                 password = node.find('password')
#                 if password is None:
#                     logging.warning('There are any nodes named password in %s of %s.' % (config, dbtype))
#                 else:
#                     self._password = password.text
#                 charset = node.find('charset')
#                 if charset is not None:
#                     self._charset = charset.text
    
    def __init__(self, dbtype, **args): 
        if 'config' in args.keys():
            self.__parsexml(args['config'], dbtype)
        
        for k, v in args.items():
            if k == 'config':
                continue
            self.__setattr__(k, v)
        