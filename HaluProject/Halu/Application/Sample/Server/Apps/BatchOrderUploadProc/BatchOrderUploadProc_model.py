# coding: UTF-8
# ***********************************************
# * Framework Name  :  Halu
# * (c) 2025 TILLS & Co.
# ***********************************************

from DataCheckModel import DataCheck_model

class BatchOrderUploadProc_model():
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
            self.mvclog.debug(self.mvclogname, 'BatchOrderUploadProc_model init start')

            # インスタンス変数を設定
            self.database = database
            self.sqldict = sqldict
            self.requestdict = requestdict

        except Exception as e:
            self.mvclog.error(self.mvclogname, f'BatchOrderUploadProc_model init exception message : {e}')

        finally:
            self.mvclog.debug(self.mvclogname, 'BatchOrderUploadProc_model init end')

    def notEmptyPassForSqlsDataOfBatchProc(self, sqlsId, dataName):
        """
        SQLの出力項目が空でないとき、SQLをパスする

        Parameters
        ----------
        sqlsId : str
            sql.jsonのid名
        dataName : str
            出力レコードの項目名

        Returns
        -------
        status : str
            OK または PASS
        """
        self.mvclog.debug(self.mvclogname, 'BatchOrderUploadProc_model notEmptyPassForSqlsDataOfBatchProc start')

        tempObj = DataCheck_model(self.requestdict, self.sqldict, self.mvclog, self.mvclogname)
        status = tempObj.notEmptyPassForSqlsData(sqlsId, dataName)

        self.mvclog.debug(self.mvclogname, f'BatchOrderUploadProc_model notEmptyPassForSqlsDataOfBatchProc end status : {status}')
        return status
