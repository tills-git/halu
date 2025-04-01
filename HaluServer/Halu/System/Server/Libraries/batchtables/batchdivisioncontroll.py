# coding: utf-8

import json
from   logger.halulogger      import HaluLogger

class BatchDivisionControll():
    """
    以下のテーブルの更新を行う
    ・バッチ分割管理
    """


    def __init__(self, bdlog, bdlogname, database):
        self.bdlog     = bdlog
        self.bdlogname = bdlogname

        self.bdlog.debug(self.bdlogname, 'バッチ分割管理テーブル init start')

        # インスタンス変数を設定
        self.database  = database



        self.bdlog.debug(self.bdlogname, 'バッチ分割管理テーブル init end')
                

    def batchdivision_insert(self, dbname, sql_info, controll_id):
        """
        バッチ分割管理 テーブル登録
        """
        self.bdlog.debug(self.bdlogname, 'バッチ分割管理テーブル insert start')
        
        division_number = int(sql_info['input']['record']['分割数']['value'][0])

        str_sql1 = "INSERT INTO バッチ分割管理"
        str_sql2 = " (バッチ管理ＩＤ, バッチ分割管理ＩＤ)"

        for i in range(division_number):
            str_sql3 = f" VALUES ({controll_id}, {i + 1})"

            str_sql = str_sql1 + str_sql2 + str_sql3
            self.database.execute(dbname, str_sql)
        
        self.bdlog.debug(self.bdlogname, f'バッチ分割管理テーブル insert end 分割数 : {division_number}')
        return division_number


    def batchdivision_start_datetime(self, dbname, controll_id, cur_division):
        """
        バッチ分割管理 テーブル 開始日時の更新
        """
        self.bdlog.debug(self.bdlogname, 'バッチ分割管理テーブル 開始日時の更新 start')

        str_sql  =  "UPDATE バッチ分割管理 SET 開始日時 = CURRENT_TIMESTAMP"
        str_sql += f" WHERE バッチ管理ＩＤ = {controll_id} AND バッチ分割管理ＩＤ = {cur_division}"

        self.database.execute(dbname, str_sql)
        self.bdlog.debug(self.bdlogname, 'バッチ分割管理テーブル 開始日時の更新 end')


    def batchdivision_end_datetime(self, dbname, controll_id, cur_division):
        """
        バッチ分割管理 テーブル 終了日時の更新
        """
        self.bdlog.debug(self.bdlogname, 'バッチ分割管理テーブル 終了日時の更新 start')

        str_sql  =  "UPDATE バッチ分割管理 SET 終了日時 = CURRENT_TIMESTAMP"
        str_sql += f" WHERE バッチ管理ＩＤ = {controll_id} AND バッチ分割管理ＩＤ = {cur_division}"

        self.database.execute(dbname, str_sql)
        self.bdlog.debug(self.bdlogname, 'バッチ分割管理テーブル 終了日時の更新 end')
