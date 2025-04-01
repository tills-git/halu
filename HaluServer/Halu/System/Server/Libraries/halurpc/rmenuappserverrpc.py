# coding: utf-8

import json
import msgpackrpc

from logger.halulogger         import HaluLogger
from halumain.haluconf         import HaluConf


class RmenuClient():
    """
    halu/halu.pyのrmenumain内でインスタンスされ、callが実行される

    呼び出し先：Rmenu AppServer
    実引数：requestdict
    戻り値：responsedict
    """
    def __init__(self):
        hconf          = HaluConf()
        self.ipaddress = hconf.rmenu_appserver_address
        self.port      = hconf.rmenu_appserver_port


    def call(self, requestdict):
        # アプリケーションサーバへ接続する
        client = msgpackrpc.Client(msgpackrpc.Address(self.ipaddress, self.port), unpack_encoding='utf-8')

        # アプリケーションサーバへリクエストデータを送信し、レスポンスデータを受け取る
        #responsedict = client.call('call', requestdict)
        future       = client.call_async('call', requestdict)
        responsedict = future.get()
        return responsedict
