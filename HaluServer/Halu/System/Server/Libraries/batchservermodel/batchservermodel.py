# coding: utf-8

import json
from time import sleep

from database.database                        import Database
from batchtables.batchcontroll                import BatchControll
from batchtables.batchdivisioncontroll        import BatchDivisionControll
from batchtables.batchkeycontroll             import BatchKeyControll
from batchtables.batchparamcontroll           import BatchParamControll
from batchclientserver.batchclientmainserver  import BatchClientMainServer
from batchstartup.batchexecute                import BatchExecute

class BatchServerModel():
    """
    バッチ管理・バッチ分割管理・バッチキー管理・バッチパラメータ管理の各テーブル
    を登録し、バッチ処理を起動する

    Parameters
    ----------
    sqldict : json
        バッチ処理の指示情報が設定されているSQLデータを受け取る。
        BatchKey : バッチキー データ
        BatchParam : バッチパラメータ データ
        BatchControll : バッチ管理 データ
    """


    def __init__(self, bmlog, bmlogname, bdlog, bdlogname, sqldict):
        try:
            self.bmlog     = bmlog
            self.bmlogname = bmlogname
            self.bmlog.debug(self.bmlogname, 'BatchServerModel init start')
            
            self.bdlog     = bdlog
            self.bdlogname = bdlogname
    
            # インスタンス変数を設定
            self.sqldict         = sqldict
            self.database        = Database(self.bdlog, self.bdlogname)
    
            # バッチ管理　テーブル インスタンス
            self.controlltable   = BatchControll(self.bdlog, self.bdlogname, self.database)
            self.divisiontable   = BatchDivisionControll(self.bdlog, self.bdlogname, self.database)
            self.keytable        = BatchKeyControll(self.bdlog, self.bdlogname, self.database)
            self.paramtable      = BatchParamControll(self.bdlog, self.bdlogname, self.database)
    
            # バッチ管理ＩＤ
            self.controll_id     = 0
    
            # 分割数（当分の間は1）
            self.division_number = 1

            # NEXTバッチ処理情報
            self.next_dict = {}
    
        except Exception as e:
            self.bmlog.error(self.bmlogname, f'BatchServerModel init exception message : {e}')
        finally:
            self.bmlog.debug(self.bmlogname, 'BatchServerModel init end\n')
    
    def call(self):
        self.bmlog.debug(self.bmlogname, 'BatchServerModel call start')

        # ＤＢ名を設定する
        dbname = self.sqldict['dbname']
        # BatchControllにdbnameの指定が有る時は、そちらを優先する
        for sql_info in self.sqldict['sqls']:
            if sql_info['id'] == 'BatchControll':
                if 'dbname' in sql_info:
                  dbname = sql_info['dbname']
                break
        self.bmlog.debug(self.bmlogname, f'BatchServerModel call set dbname : {dbname}')

        try:
            self.bmlog.debug(self.bmlogname, f'BatchServerModel call DB 接続 start')

            self.database.create_engine(dbname)
            self.database.connection(dbname)
            self.database.begin(dbname)

            self.bmlog.debug(self.bmlogname, f'BatchServerModel call DB 接続 end')
    
            # バッチサーバモデル　初期処理
            #バッチ管理・バッチ分割管理・バッチキー管理・バッチパラメータ管理の登録処理

            self.batchserver_init(dbname)
            # コミット
            self.database.commit()

            # コネクションをクローズ
            self.database.close()
            
            sleep(3)    
    
            # バッチサーバモデル　メイン処理
            self.batchserver_main(dbname)
    
    
            # バッチサーバモデル　後処理
            result = self.batchserver_term(dbname)
            return result
        except:
            # ロールバック
            self.database.rollback()
            raise
        finally:
            self.bmlog.debug(self.bmlogname, 'BatchServerModel call end')
        
    def batchserver_init(self, dbname):
        """
        ・バッチ管理・バッチ分割管理・バッチキー管理・バッチパラメータ管理の登録処理
        ・インスタンス変数（controll_id, division_number）の設定
        Parameters
        ----------
        dbname : string
            データベース名
        """
        self.bmlog.debug(self.bmlogname, f'BatchServerModel batchserver_init start')

        for sql_info in self.sqldict['sqls']:
            if sql_info['id'] == 'batchControll':
                # バッチ管理 テーブル登録
                self.controll_id = self.controlltable.batchcontroll_insert(dbname, sql_info)
    
                # バッチ分割管理 テーブル登録
                self.division_number = self.divisiontable.batchdivision_insert(dbname, sql_info, self.controll_id)
                break

        for sql_info in self.sqldict['sqls']:
            if sql_info['id'] == 'batchParam':
                # バッチパラメータ管理 テーブル登録
                self.paramtable.batchparam_insert(dbname, sql_info, self.controll_id)
                continue
            if sql_info['id'] == 'batchKey':
                # バッチキー管理 テーブル登録
                self.keytable.batchkey_insert(dbname, sql_info, self.controll_id)
                continue

        self.bmlog.debug(self.bmlogname, f'BatchServerModel batchserver_init end\n')
                
    
    def batchserver_main(self, dbname):
        """
        Parameters
        ----------
        """
        self.bmlog.debug(self.bmlogname, f'BatchServerModel batchserver_main start')

        # BatchClientMainServerをインスタンスする
        main_model = BatchClientMainServer()
   
        # 分割数回、BatchClientMainModelを実行する
        for row in range(self.division_number):
            cur_division = row + 1
    
            self.bmlog.debug(self.bmlogname, f'BatchServerModel batchserver_main BatchClientMainServer {cur_division} 分割目 start')

            self.next_dict = main_model.call(dbname, self.controll_id, cur_division, self.division_number)

            self.bmlog.debug(self.bmlogname, f'BatchServerModel batchserver_main BatchClientMainServer {cur_division} 分割目 end')
    
        self.bmlog.debug(self.bmlogname, f'BatchServerModel batchserver_main end\n')
    
         
    def batchserver_term(self, dbname):
        """
    
        Parameters
        ----------
        """
        self.bmlog.debug(self.bmlogname, f'BatchServerModel batchserver_term start')
    
        # NEXTバッチ処理 なし
        if self.next_dict["ＮＥＸＴ処理名"] == "":
            self.bmlog.debug(self.bmlogname, f'BatchServerModel batchserver_term end : NEXTバッチ処理 なし\n')
            return "OK"
        
        # NEXTバッチ処理 あり
        batch_execute = BatchExecute(self.bmlog, self.bmlogname, self.database)
        result        = batch_execute.call_next(self.next_dict)

        self.bmlog.debug(self.bmlogname, f'BatchServerModel batchserver_term end : NEXTバッチ処理 あり\n')
        return result
    