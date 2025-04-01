# coding: utf-8

import json
from   logger.halulogger      import HaluLogger


class BatchKeyControll():
    """
    以下のテーブルの更新を行う
    ・バッチキー管理
    """

    def __init__(self, bdlog, bdlogname, database):
        self.bdlog     = bdlog
        self.bdlogname = bdlogname

        self.bdlog.debug(self.bdlogname, 'バッチキー管理テーブル init start')

        # インスタンス変数を設定
        self.database  = database


        self.bdlog.debug(self.bdlogname, 'バッチキー管理テーブル init end')


    def batchkey_insert(self, dbname, sql_info, controll_id):
        """
        バッチキー管理 テーブル登録

        json.dumps(keys_record) ・・・ jsonオブジェクト(dict型)を文字列に変換する
        """
        self.bdlog.debug(self.bdlogname, 'バッチキー管理テーブル insert start')
        
        if sql_info['output']:
           keys_record = sql_info['output']['record']
        else:
           keys_record = sql_info['input']['record']

        str_sql1 =  "INSERT INTO バッチキー管理"
        str_sql2 =  " (バッチ管理ＩＤ, ＪＳＯＮデータ)"
        str_sql3 = f" VALUES ({controll_id}, '{json.dumps(keys_record, ensure_ascii=False)}')"

        str_sql  = str_sql1 + str_sql2 + str_sql3
        self.database.execute(dbname, str_sql)

        self.bdlog.debug(self.bdlogname, 'バッチキー管理テーブル insert end')


    def batchkey_select(self, dbname, controll_id):
        """
        バッチキー管理 テーブルのＪＳＯＮデータを取得する
        dbnam : データベース名
        controll_id : バッチ管理ＩＤ

        json.loads(value) ・・・ 文字列をjsonオブジェクト(dict型)に変換する
        """
        self.bdlog.debug(self.bdlogname, 'バッチキー管理テーブル batchkey_select start')
        
        str_sql  =  "SELECT ＪＳＯＮデータ FROM バッチキー管理"
        str_sql += f" WHERE バッチ管理ＩＤ = {controll_id}"
        result   = self.database.execute(dbname, str_sql)

        key_string = ""
        for row in result:
            for key, value in row.items():
                key_string = value
                break

        self.bdlog.debug(self.bdlogname, f'バッチキー管理テーブル batchkey_select end key : {key_string}')
        self.bdlog.debug(self.bdlogname, f'バッチキー管理テーブル batchkey_select key_string type : {type(key_string)}')
        self.bdlog.debug(self.bdlogname, f'バッチキー管理テーブル batchkey_select 受注番号 : {key_string["受注番号"]}')
        #return json.loads(key_string)
        return key_string
    

    def batchkey_maxrow(self, dbname, controll_id):
        """
        キー項目の最大行数を求める

        dbnam : データベース名
        controll_id : バッチ管理ＩＤ
        """
        self.bdlog.debug(self.bdlogname, 'バッチキー管理テーブル batchkey_maxrow start')
        
        key_dict = self.batchkey_select(dbname, controll_id)

        maxrow = 0
        for val in key_dict.values():
            length = len(val["value"])
            if length > maxrow:
                maxrow = length
        

        self.bdlog.debug(self.bdlogname, f'バッチキー管理テーブル batchkey_maxrow end maxrow : {maxrow}')
        return maxrow
    

    def batchkey_start_end_row(self, dbname, controll_id, cur_division, division_number):
        """
        処理開始行と終了行を求める

        dbnam : データベース名
        controll_id : バッチ管理ＩＤ
        cur_division : カレント分割数
        division_number : 分割数

        """
        self.bdlog.debug(self.bdlogname, 'バッチキー管理テーブル batchkey_start_end_row start')
        
        maxrow = self.batchkey_maxrow(dbname, controll_id)
        syou   = maxrow // division_number

        start_row = (cur_division - 1) * syou + 1
        if cur_division == division_number:
            end_row = maxrow
        else:
            end_row = cur_division * syou

        self.bdlog.debug(self.bdlogname, f'バッチキー管理テーブル start_row : {start_row}')
        self.bdlog.debug(self.bdlogname, f'バッチキー管理テーブル   end_row : {end_row}')
        self.bdlog.debug(self.bdlogname, 'バッチキー管理テーブル batchkey_start_end_row end')
        return start_row, end_row
