# coding: utf-8

import json
from   logger.halulogger      import HaluLogger

class BatchControll():
    """
    以下のテーブルの更新を行う
    ・バッチ管理
    """


    def __init__(self, bdlog, bdlogname, database):
        self.bdlog     = bdlog
        self.bdlogname = bdlogname

        self.bdlog.debug(self.bdlogname, 'バッチ管理テーブル init start')

        # インスタンス変数を設定
        self.database  = database



        self.bdlog.debug(self.bdlogname, 'バッチ管理テーブル init end')

        
                
    def batchcontroll_insert(self, dbname, sql_info):
        """
        バッチ管理 テーブルの登録
        """
        self.bdlog.debug(self.bdlogname, 'バッチ管理テーブル insert start')

        controllrecord = sql_info['input']['record']

        str_sql1 = "INSERT INTO バッチ管理"
        str_sql2 = " (バッチ管理ＩＤ"
        str_sql3 = " VALUES (NEXTVAL('バッチ管理_バッチ管理ＩＤ_seq')"

        for key, value in controllrecord.items():
            if key == "バッチ管理ＩＤ":
                continue
            elif key == "開始日時":
                continue
            elif key == "終了日時":
                continue
            else:
                str_sql2 += f", {key}"

                if type(value['value'][0]) == int:
                    str_sql3 += f", {value['value'][0]}"
                else:
                    str_sql3 += f", '{value['value'][0]}'"

        str_sql = str_sql1 + str_sql2 + ")" + str_sql3 + ")"
        self.database.execute(dbname, str_sql)


        # 登録したバッチ管理テーブルのバッチ管理IDを取得する
        str_sql9 = "SELECT CURRVAL('バッチ管理_バッチ管理ＩＤ_seq')"
        result   = self.database.execute(dbname, str_sql9)
        for row in result:
            for key, value in row.items():
                controll_id = value
                break
            break

        self.bdlog.debug(self.bdlogname, f'バッチ管理テーブル insert end バッチ管理ＩＤ : {controll_id}')
        return controll_id

    def batchcontroll_start_datetime(self, dbname, controll_id):
        """
        バッチ管理 テーブル 開始日時の更新
        """
        self.bdlog.debug(self.bdlogname, 'バッチ管理テーブル 開始日時の更新 start')

        str_sql  =  "UPDATE バッチ管理 SET 開始日時 = CURRENT_TIMESTAMP"
        str_sql += f" WHERE バッチ管理ＩＤ = {controll_id}"

        self.database.execute(dbname, str_sql)
        self.bdlog.debug(self.bdlogname, 'バッチ管理テーブル 開始日時の更新 end')

    def batchcontroll_end_datetime(self, dbname, controll_id):
        """
        バッチ管理 テーブル 分割終了数 終了日時の更新
        """
        self.bdlog.debug(self.bdlogname, 'バッチ管理テーブル 分割終了数 終了日時の更新 start')

        str_sql  =  "SELECT 分割数, (分割終了数 + 1) AS 分割終了数 FROM バッチ管理"
        str_sql += f" WHERE バッチ管理ＩＤ = {controll_id}"

        result = self.database.execute(dbname, str_sql)
        division_dict = {}
        for row in result:
            for key, value in row.items():
                division_dict[key] = value

        if division_dict['分割数'] == division_dict['分割終了数']:
            str_sql  =  "UPDATE バッチ管理 SET 分割終了数 = (分割終了数 + 1), 終了日時 = current_timestamp"
            str_sql += f" WHERE バッチ管理ＩＤ = {controll_id}"
        else:
            str_sql  =  "UPDATE バッチ管理 SET 分割終了数 = (分割終了数 + 1)"
            str_sql += f" WHERE バッチ管理ＩＤ = {controll_id}"

        self.database.execute(dbname, str_sql)
        self.bdlog.debug(self.bdlogname, 'バッチ管理テーブル 分割終了数 終了日時の更新 end')

    def batchcontroll_next_info(self, dbname, controll_id):
        """
        バッチ管理 テーブル NEXT処理情報を取得する
        """
        self.bdlog.debug(self.bdlogname, 'バッチ管理テーブル NEXT処理情報 start')

        str_sql  =  "SELECT ＮＥＸＴ処理名, ＮＥＸＴロードパス名 FROM バッチ管理"
        str_sql += f" WHERE バッチ管理ＩＤ = {controll_id}"

        result = self.database.execute(dbname, str_sql)
        next_dict = {}
        for row in result:
            for key, value in row.items():
                next_dict[key] = value
        
        self.bdlog.debug(self.bdlogname, f'バッチ管理テーブル NEXT処理情報 end nextinfo : {next_dict}')
        return next_dict

    def batchcontroll_all_info(self, dbname, controll_id):
        """
        バッチ管理 テーブル 全情報を取得する
        """
        self.bdlog.debug(self.bdlogname, 'バッチ管理テーブル all_info start')

        str_sql1  =  "SELECT"
        str_sql2  =  " 会社名, 部門名, 処理名, ロードパス名, 処理モード, 分割数, 分割終了数,"
        str_sql3  =  " ＮＥＸＴ処理名, ＮＥＸＴロードパス名, ユーザ名称, ＤＢ名, コミット件数, 開始日時, 終了日時"
        str_sql4  =  " FROM バッチ管理"
        str_sql5  = f" WHERE バッチ管理ＩＤ = {controll_id}"
        str_sql   = str_sql1 + str_sql2 + str_sql3 + str_sql4 + str_sql5

        result = self.database.execute(dbname, str_sql)
        controll_dict = {}
        for row in result:
            for key, value in row.items():
                controll_dict[key] = value
        
        self.bdlog.debug(self.bdlogname, f'バッチ管理テーブル all_info end all_info : {controll_dict}')
        return controll_dict





