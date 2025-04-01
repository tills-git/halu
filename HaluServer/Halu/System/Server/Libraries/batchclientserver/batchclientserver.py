# coding: utf-8

import json
import msgpackrpc

from logger.halulogger                      import HaluLogger
from halumain.haluconf                      import HaluConf
from batchclientmodel.batchclientmainmodel  import BatchClientMainModel
from view.mainview                          import MainView
from controller.maincontroller              import MainController


class BatchClientServer():
    """
    起動元：halumain/batchclientserver.pyから起動される常駐型のアプリケーションサーバ

    呼び出し元：AppClient
    仮引数：requestdict
    戻り値：responsedict
    """
    def __init__(self, bmlog, bmlogname, bdlog, bdlogname):
        try:
            self.bmlog     = bmlog
            self.bmlogname = bmlogname
            self.bmlog.debug(self.bmlogname, 'batchclientserver init start')
    
            self.bdlog     = bdlog
            self.bdlogname = bdlogname
            
    
            # MVCをインスタンスする
            bmlog                 = HaluLogger('batch/batchclientmodel')
            bmlogname             = 'batch/batchclientmodel'
            self.main_model       = BatchClientMainModel(bmlog, bmlogname, bdlog, bdlogname)
    
    
        except Exception as e:
            self.bmlog.error(self.bmlogname, f'batchclientserver init exception message : {e}')

        finally:
            self.bmlog.debug(self.bmlogname, 'batchclientserver init end')


    def call(self, requestdict, database):
        try:
            self.bmlog.debug(self.bmlogname, f'batchclientserver call requestdict : {requestdict}')

            # メインモデルをコールする
            sqldict = self.main_model.call(requestdict, database)

            return sqldict

        except Exception as e:
            self.bmlog.error(self.bmlogname, f'batchclientserver abnormal  message : {e}')

        finally:
            self.bmlog.debug(self.bmlogname, f'batchclientserver end  sqldict : {sqldict}\n')


#class BatchClient():
#    """
#    halu/halu.pyのhalumain内でインスタンスされ、callが実行される
#
#    呼び出し先：batchclientserver
#    実引数：requestdict
#    戻り値：responsedict
#    """
#    def __init__(self):
#        hconf          = HaluConf()
#        self.ipaddress = hconf.batchclientserver_address
#        self.port      = hconf.batchclientserver_port
#
#
#    def call(self, requestdict):
#        # アプリケーションサーバへ接続する
#        client = msgpackrpc.Client(msgpackrpc.Address(self.ipaddress, self.port), unpack_encoding='utf-8')
#
#        # アプリケーションサーバへリクエストデータを送信し、レスポンスデータを受け取る
#        #responsedict = client.call('call', requestdict)
#        future       = client.call_async('call', requestdict)
#        responsedict = future.get()
#        return responsedict
#