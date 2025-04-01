# coding: utf-8

import json
import msgpackrpc

from logger.halulogger                     import HaluLogger
from halumain.haluconf                     import HaluConf
from batchservermodel.batchservermainmodel import BatchServerMainModel


class BatchServer():
    """
    起動元：halumain/batchserver.pyから起動される常駐型のバッチサーバ

    呼び出し元：BatchClient
    仮引数：sqldict
    戻り値：result（OK・ERROR）

    sqldictのid=batchkey , batchparam にバッチキー情報とバッチパラメータ情報が設定されている

    """
    
    def __init__(self):
        self.blog     = HaluLogger('batch/batchserver')  # ログファイル名を設定
        self.blogname = 'batch/batchserver'
        self.blog.debug(self.blogname, 'BatchServer init start')

        bmlog                      = HaluLogger('batch/batchservermodel')
        bmlogname                  = 'batch/batchservermodel'
        
        bdlog                      = HaluLogger('batch/batchserverdatabase')
        bdlogname                  = 'batch/batchserverdatabase'
        
        self.batchserver_mainmodel = BatchServerMainModel(bmlog, bmlogname, bdlog, bdlogname)


        self.blog.debug(self.blogname, 'BatchServer init end\n')


    def call(self, sqldict):
        try:
            self.blog.debug(self.blogname, f'BatchServer call start sqldict   : {sqldict}')

            # メインモデルをコールする
            #result = self.batchserver_mainmodel.call(sqldict)
            self.batchserver_mainmodel.call(sqldict)

            #return result

        except Exception as e:
            self.blog.error(self.blogname, f'BatchServer abnormal message : {e}')

        finally:
            self.blog.debug(self.blogname, f'BatchServer end\n')


class BatchClient():
    """
    バッチ用モデル内でインスタンスされる

    呼び出し先：BatchServer
    実引数：sqldict
    戻り値：result（OK・ERROR）
    """

    def __init__(self):
        hconf          = HaluConf()
        self.ipaddress = hconf.batchserver_address
        self.port      = hconf.batchserver_port


    def call(self, sqldict):
        client       = msgpackrpc.Client(msgpackrpc.Address(self.ipaddress, self.port), unpack_encoding='utf-8')

        # RPC サーバへリクエストデータを送信（レスポンスデータ 不要）
        client.notify('call', sqldict)
        return "OK"
