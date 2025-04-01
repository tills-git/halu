# coding: utf-8

import msgpackrpc

from halumain.haluconf      import HaluConf
from halurpc.printserverrpc import PrintServer


"""
常駐型のプリントサーバを立ち上げる

プリントサーバ：halurpc/HaluPrintServerのHaluPrintServerクラス
"""

hconf  = HaluConf()
server = msgpackrpc.Server(PrintServer(), unpack_encoding='utf-8')
server.listen(msgpackrpc.Address(hconf.printserver_address, hconf.printserver_port))


print("*** halu print server start ***")
server.start()
