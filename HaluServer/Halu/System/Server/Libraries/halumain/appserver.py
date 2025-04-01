# coding: utf-8

import msgpackrpc

from halumain.haluconf    import HaluConf
from halurpc.appserverrpc import AppServer


"""
常駐型のアプリケーションサーバを立ち上げる

アプリケーションサーバ：halurpc/appserverrpcのHaluAppServerクラス
"""

hconf  = HaluConf()
server = msgpackrpc.Server(AppServer(), unpack_encoding='utf-8')
server.listen(msgpackrpc.Address(hconf.appserver_address, hconf.appserver_port))


print("*** halu app server start ***")
server.start()
