# coding: utf-8

import msgpackrpc

from halumain.haluconf      import HaluConf
from halurpc.batchserverrpc import BatchServer


"""
常駐型のバッチサーバを立ち上げる

バッチサーバ：halurpc/batchserverrpcのHaluBatchServerクラス
"""

hconf  = HaluConf()
server = msgpackrpc.Server(BatchServer(), unpack_encoding='utf-8')
server.listen(msgpackrpc.Address(hconf.batchserver_address, hconf.batchserver_port))


print("*** halu batch server start ***")
server.start()
