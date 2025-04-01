# coding: utf-8

import json
from time              import sleep
from commons.jsonchunk import getjsonchunkbyid
from commons.jsoncache import JsonCache
from halumain.haluconf import HaluConf

from logger.halulogger                   import HaluLogger
from batchclientserver.batchclientserver import BatchClientServer
from database.database                   import Database
from batchtables.batchcontroll           import BatchControll
from batchtables.batchdivisioncontroll   import BatchDivisionControll
from batchtables.batchkeycontroll        import BatchKeyControll
from batchtables.batchparamcontroll      import BatchParamControll

class BatchClientMainServer():
    """
    
    """


    def __init__(self):
        try:
            self.bmlog     = HaluLogger('batch/batchclientserver')
            self.bmlogname = 'batch/batchclientserver'
            self.bmlog.debug(self.bmlogname, 'BatchClientMainServer init start')

            self.bdlog     = HaluLogger('batch/batchclientdatabase')
            self.bdlogname = 'batch/batchclientdatabase'
            # インスタンス変数を設定
            self.conf              = HaluConf()
            self.database          = Database(self.bdlog, self.bdlogname)
      
            self.json_cache        = JsonCache(self.bmlog, self.bmlogname, 'tran.json')
    
            # バッチ管理　テーブル インスタンス
            self.controlltable     = BatchControll(self.bdlog, self.bdlogname, self.database)
            self.divisiontable     = BatchDivisionControll(self.bdlog, self.bdlogname, self.database)
            self.keytable          = BatchKeyControll(self.bdlog, self.bdlogname, self.database)
            self.paramtable        = BatchParamControll(self.bdlog, self.bdlogname, self.database)
    
            self.batchclientserver = BatchClientServer(self.bmlog, self.bmlogname, self.bdlog, self.bdlogname)
    
    
                
        except Exception as e:
            self.bmlog.error(self.bmlogname, f'BatchClientMainServer init exception message : {e}')
        finally:
            self.bmlog.debug(self.bmlogname, 'BatchClientMainServer init end\n')
    
    
    def call(self, dbname, controll_id, cur_division, division_number):
        """
        Parameters
            dbname : データベース名（業務ＤＢ名）
            controll_id : バッチ管路ＩＤ
            cur_division : カレント回数
            division_number : 分割回数
        """
        self.bmlog.debug(self.bmlogname, 'BatchClientMainServer call start')

        try:
            self.bmlog.debug(self.bmlogname, 'BatchClientMainServer DB 接続 start')

            self.database.create_engine(dbname)
            self.database.connection(dbname)
            self.database.begin(dbname)

            self.bmlog.debug(self.bmlogname, 'BatchClientMainServer DB 接続 end')

            # バッチ管理テーブル 開始日時の更新
            if cur_division == 1:
                self.bmlog.debug(self.bmlogname, 'BatchClientMainServer バッチ管理テーブル 開始日時の更新')
                self.controlltable.batchcontroll_start_datetime(dbname, controll_id)
            
            # バッチ分割管理テーブル 開始日時の更新
            self.bmlog.debug(self.bmlogname, 'BatchClientMainServer バッチ分割管理テーブル 開始日時の更新')
            self.divisiontable.batchdivision_start_datetime(dbname, controll_id, cur_division)

            # トランjsonを読み込み、リクエストデータを取得する
            controll_dict = self.controlltable.batchcontroll_all_info(dbname, controll_id)
            load_pass     = controll_dict["ロードパス名"]
            mode          = controll_dict["処理モード"]
            file_pass     = self.conf.apppath + "/" + load_pass + "/" + mode + "_tran.json"
            str_tran      = self.json_cache.getFileData(file_pass)
            trandict      = json.loads(str_tran)
            requestdict   = trandict['request']
            self.bmlog.debug(self.bmlogname, f'BatchClientMainServer リクエストデータを取得 requestdict : {requestdict}')

            # バッチキー管理テーブルからキーデータを取得する
            key_dict      = self.keytable.batchkey_select(dbname, controll_id)
            self.bmlog.debug(self.bmlogname, f'BatchClientMainServer キーデータを取得 key_dict : {key_dict}')
    
            # バッチパラメータ管理テーブルからパラメータデータを取得する
            param_dict    = self.paramtable.batchparam_select(dbname, controll_id)
            self.bmlog.debug(self.bmlogname, f'BatchClientMainServer パラメータデータを取得 param_dict : {param_dict}')
    
            # バッチキー管理テーブルから処理開始行と処理終了行を取得する
            start_row, end_row = self.keytable.batchkey_start_end_row(dbname, controll_id, cur_division, division_number)
            self.bmlog.debug(self.bmlogname, f'BatchClientMainServer 処理開始行を取得 start_row : {start_row}')
            self.bmlog.debug(self.bmlogname, f'BatchClientMainServer 処理終了行を取得 end_row   : {end_row}')

            end_row = end_row + 1
            for row in range(start_row, end_row):
                self.bmlog.debug(self.bmlogname, f'BatchClientMainServer 処理開始 row : {row}')
                idx = row - 1

                # requestdictにバッチキーを設定する
                key_record   = getjsonchunkbyid(requestdict, 'records', 'batchKey',   'record')
                for key, value in key_dict.items():
                    if key in key_record.keys():
                        key_record[key]["value"][0] = value["value"][idx]
    
                # requestdictにバッチパラメータを設定する
                param_record = getjsonchunkbyid(requestdict, 'records', 'batchParam', 'record')
                for key, value in param_dict.items():
                    if key in param_record.keys():
                        param_record[key]["value"][0] = value["value"][0]
                
                # BatchClientServerをコールする（バッチ用コントローラが実行される）
                self.bmlog.debug(self.bmlogname, f'BatchClientMainServer BatchClientServer call requestdict : {requestdict}')
                sqldict = self.batchclientserver.call(requestdict, self.database)

            # バッチ分割管理テーブル 終了日時の更新
            self.divisiontable.batchdivision_end_datetime(dbname, controll_id, cur_division)
            self.bmlog.debug(self.bmlogname, 'BatchClientMainServer バッチ分割管理テーブル 終了日時の更新')
                
            # バッチ管理テーブル 終了日時の更新
            self.controlltable.batchcontroll_end_datetime(dbname, controll_id)
            self.bmlog.debug(self.bmlogname, 'BatchClientMainServer バッチ管理テーブル 終了日時の更新')

            # NEXTバッチ処理情報を取得する
            next_dict = self.controlltable.batchcontroll_next_info(dbname, controll_id)
            self.bmlog.debug(self.bmlogname, f'BatchClientMainServer NEXTバッチ処理情報 : {next_dict}')


            self.bmlog.debug(self.bmlogname, 'BatchClientMainServer DB コミット・クローズ start')

            # コミット
            self.database.commit()
            # コネクションをクローズ
            self.database.close()

            self.bmlog.debug(self.bmlogname, 'BatchClientMainServer DB コミット・クローズ end')
            sleep(3)    

            return next_dict
    
    
        except:
            # ロールバック
            self.database.rollback()
            raise
        finally:
            self.bmlog.debug(self.bmlogname, 'BatchClientMainServer call end\n')
