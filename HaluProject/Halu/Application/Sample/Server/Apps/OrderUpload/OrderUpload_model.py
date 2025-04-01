# coding: UTF-8
# ***********************************************
# * Framework Name  :  Halu
# * (c) 2025 TILLS & Co.
# ***********************************************

import os
from commons.jsonchunk   import getjsonchunkbyid
from halumain.haluconf   import HaluConf

class OrderUpload_model():
    """
    sql.json から呼び出し("prog": "yes"の場合)

    Attributes
    ----------
    mvclog : obj
        ログ出力用オブジェクト
    mvclogname : str
        ログの出力ファイル名
    database : obj
        DB接続用オブジェクト
    sqldict : dict
        画面からのリクエストデータ(sql.json)
    requestdict : dict
        画面からのリクエストデータ(tran.json)
    """
    def __init__(self, mvclog, mvclogname, database, sqldict, requestdict):
        try:
            self.mvclog     = mvclog
            self.mvclogname = mvclogname
            self.mvclog.debug(self.mvclogname, 'OrderUpload_model init start')

            # インスタンス変数を設定
            self.database    = database
            self.sqldict     = sqldict
            self.requestdict = requestdict
            self.hconf       = HaluConf()

        except Exception as e:
            self.mvclog.error(self.mvclogname, f'OrderUpload_model init exception message : {e}')

        finally:
            self.mvclog.debug(self.mvclogname, 'OrderUpload_model init end')


    def insertJyutyuCsv(self, idName):
        """
        CSVファイルが存在するかチェックを行い、ＯＫであれば受注CSVテーブルへ登録する

        Parameters
        ----------
        idName : str
            対象とする項目名（キー項目）

        Returns
        -------
        status : str
            実行結果（'OK'/ 'ERROR'）
        """
        self.mvclog.debug(self.mvclogname, 'OrderUpload_model insertJyutyuCsv start')

        # アップロードしたファイルのパスを設定
        requestRecord = getjsonchunkbyid(self.requestdict, 'records', idName, 'record')
        filename      = self.hconf.apppath + '/Sample/UpLoad/Apps/OrderUpload/'+ requestRecord['ファイル名']['value'][0]
    
        # ファイルが存在するか？
        if os.path.exists(filename):
              status = 'OK'
        else:
          self.sqldict['message']['status'] = 'ERROR'
          self.sqldict['message']['msg']    = 'OrderUploadファイルが存在しません。'
          status = 'ERROR'
          self.mvclog.debug(self.mvclogname, f'OrderUpload_model insertJyutyuCsv end status = {status}')
          return status

        # CSVファイルを読み込み、受注CSVテーブルへ登録する
        status = self.readOrderUpload(filename)

        self.mvclog.debug(self.mvclogname, f'OrderUpload_model insertJyutyuCsv end status={status}')
        return status


    def readOrderUpload(self, filename):
        """
        CSVファイルを読み込み、受注CSVテーブルへ登録する

        Parameters
        ----------
        filename : str
            対象とするファイル名

        Returns
        -------
        status : str
            'OK' 固定
        """
        self.mvclog.debug(self.mvclogname, 'OrderUpload_model readOrderUpload start')
    
        status = 'OK'

        # CSVファイルの読み込み
        readList = self.readLines(filename)

        for index in range(len(readList)):
            if index == 0:
                continue

            w_ListData = readList[index].split(",")
            self.mvclog.debug(self.mvclogname, f'OrderUpload_model readOrderUpload  : {w_ListData}')

            self.insertJyutyuTable(w_ListData)

        # アップロードファイルを削除する
        os.remove(filename)

        self.mvclog.debug(self.mvclogname, 'OrderUpload_model readOrderUpload end')
        return status

    def readLines(self, file):
        """
        CSVファイルの読み込み

        Parameters
        ----------
        file : str
            対象とするファイル

        Returns
        -------
        readlist : list
            ファイル読込結果
        """
        try:
            with open(file, mode="r", encoding='UTF-8') as f:
                readlist = f.readlines()

            return readlist
        except Exception as e:
            self.mlog.error(self.mvclogname, f'OrderUpload_model readLines exception message type    : {str(type(e))}')
            self.mlog.error(self.mvclogname, f'OrderUpload_model readLines exception message arg     : {str(e.args)}')
            self.mlog.error(self.mvclogname, f'OrderUpload_model readLines exception message         : {e}')


    def insertJyutyuTable(self, w_ListData):
        """
        受注CSVテーブルにデータを登録する

        Parameters
        ----------
        w_ListData : list
            CSVファイルより取得した項目値

        Returns
        -------
        status : str
            'OK' 固定
        """
        self.mvclog.debug(self.mvclogname, 'OrderUpload_model insertJyutyuTable start')

        status = 'OK'

        str_sql1 = "INSERT INTO 受注ＣＳＶ ("
        str_sql1 += "受注番号, 明細番号, 顧客ＩＤ, 受注日, 受注金額合計, "
        str_sql1 += "商品名称, 納期日, 受注数量, 受注単価, 受注金額, 備考"
        str_sql1 += ") VALUES ("
        str_sql1 += f"'{w_ListData[0]}', "
        str_sql1 += f"{w_ListData[1]}, "
        str_sql1 += f"{w_ListData[2]}, "
        str_sql1 += f"TO_DATE('{w_ListData[3]}', 'YYYYMMDD'), "
        str_sql1 += f"{w_ListData[4]}, "
        str_sql1 += f"'{w_ListData[5]}', "
        str_sql1 += f"TO_DATE('{w_ListData[6]}', 'YYYYMMDD'), "
        str_sql1 += f"{w_ListData[7]}, "
        str_sql1 += f"{w_ListData[8]}, "
        str_sql1 += f"{w_ListData[9]}, "
        str_sql1 += f"'{w_ListData[10]}')"
        self.mvclog.debug(self.mvclogname, f'OrderUpload_model insertJyutyuTable sql : {str_sql1}')
                
        self.database.execute('sample', str_sql1)

        self.mvclog.debug(self.mvclogname, 'OrderUpload_model insertJyutyuTable end')
        return status
    

