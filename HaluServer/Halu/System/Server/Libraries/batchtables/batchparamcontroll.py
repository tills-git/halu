# coding: utf-8

import json
from   logger.halulogger      import HaluLogger


class BatchParamControll():
    """
    以下のテーブルの更新を行う
    ・バッチパラメータ管理
    """

    def __init__(self, bdlog, bdlogname, database):
        self.bdlog     = bdlog
        self.bdlogname = bdlogname

        self.bdlog.debug(self.bdlogname, 'バッチパラメータ管理 テーブル init start')

        # インスタンス変数を設定
        self.database  = database


        self.bdlog.debug(self.bdlogname, 'バッチパラメータ管理 テーブル init end')


    def batchparam_insert(self, dbname, sql_info, controll_id):
        """
        バッチパラメータ管理 テーブル登録

        json.dumps(param_record) ・・・ jsonオブジェクト(dict型)を文字列に変換する
        """
        self.bdlog.debug(self.bdlogname, 'バッチパラメータ管理テーブル insert start')


        param_record = sql_info['input']['record']

        str_sql1 =  "INSERT INTO バッチパラメータ管理"
        str_sql2 =  " (バッチ管理ＩＤ, ＪＳＯＮデータ)"
        str_sql3 = f" VALUES ({controll_id}, '{json.dumps(param_record, ensure_ascii=False)}')"

        str_sql  = str_sql1 + str_sql2 + str_sql3
        self.database.execute(dbname, str_sql)

        self.bdlog.debug(self.bdlogname, 'バッチパラメータ管理テーブル insert end')

    def batchparam_select(self, dbname, controll_id):
        """
        バッチパラメータ管理 ＪＳＯＮデータ 取得

        json.loads(value) ・・・ 文字列をjsonオブジェクト(dict型)に変換する
        """
        self.bdlog.debug(self.bdlogname, 'バッチパラメータ管理テーブル batchparam_select start')
        
        str_sql  =  "SELECT ＪＳＯＮデータ FROM バッチパラメータ管理"
        str_sql += f" WHERE バッチ管理ＩＤ = {controll_id}"
        result   = self.database.execute(dbname, str_sql)

        param_string = ""
        for row in result:
            for key, value in row.items():
                param_string = value
                break
        
        self.bdlog.debug(self.bdlogname, f'バッチパラメータ管理テーブル batchparam_select end param : {param_string}')
        self.bdlog.debug(self.bdlogname, f'バッチパラメータ管理テーブル batchparam_select param_string type : {type(param_string)}')
        #return json.loads(param_string)
        return param_string
