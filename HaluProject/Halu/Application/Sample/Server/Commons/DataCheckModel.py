# coding: UTF-8
# ***********************************************
# * Framework Name  :  Halu
# * (c) 2025 TILLS & Co.
# ***********************************************

from commons.jsonchunk import getjsonchunkbyid

class DataCheck_model():
    """
    データチェック用の共通メソッドを保持する(Model)

    Attributes
    ----------
    requestdict : dict
        リクエストデータ
    sqldict : dict
        SQLデータ
    mvclog : obj
        ログ出力用オブジェクト
    mvclogname : str
        ログの出力ファイル名
    """
    def __init__(self, requestdict, sqldict, mvclog, mvclogname):

        self.requestdict = requestdict
        self.sqldict = sqldict
        self.mvclog     = mvclog
        self.mvclogname = mvclogname

    def isEmptyPassForRequestData(self, requestId, dataName):
        """
        リクエストデータが空か（空の時、パス）

        Parameters
        ----------
        requestId : str
            対象とするリクエストデータのデータセットID
        dataName : str
            対象とする項目名

        Returns
        -------
        status : str
            実行結果（'OK'/ 'PASS'）
        """
        self.mvclog.debug(self.mvclogname, 'DataCheck_model isEmptyPassForRequestData start')

        status = 'OK'
        requestRecord = getjsonchunkbyid(self.requestdict, 'records', requestId, 'record')

        if requestRecord[dataName]['value'][0] == '':
            status = 'PASS'

        self.mvclog.debug(self.mvclogname, f'DataCheck_model isEmptyPassForRequestData end status = {status}')
        return status

    def notEmptyPassForRequestData(self, requestId, dataName):
        """
        リクエストデータが設定されているか（NOT 空の時、パス）

        Parameters
        ----------
        requestId : str
            対象とするリクエストデータのデータセットID
        dataName : str
            対象とする項目名

        Returns
        -------
        status : str
            実行結果（'OK'/ 'PASS'）
        """
        self.mvclog.debug(self.mvclogname, 'DataCheck_model notEmptyPassForRequestData start')

        status = 'OK'
        requestRecord = getjsonchunkbyid(self.requestdict, 'records', requestId, 'record')

        if requestRecord[dataName]['value'][0] != '':
            status = 'PASS'

        self.mvclog.debug(self.mvclogname, f'DataCheck_model notEmptyPassForRequestData end status = {status}')
        return status

    def isEmptyPassForSqlsData(self, sqlsId, dataName):
        """
        SQLの出力項目が空のとき、SQLをパスする

        Parameters
        ----------
        sqlsId : str
            sql.jsonのid名
        dataName : str
            対象とする項目名

        Returns
        -------
        status : str
            実行結果（'OK'/ 'PASS'）
        """
        self.mvclog.debug(self.mvclogname, 'DataCheck_model isEmptyPassForSqlsData start')

        status = 'OK'
        sqlRecord = getjsonchunkbyid(self.sqldict, 'sqls', sqlsId, 'output', 'record')

        if sqlRecord[dataName]['value'][0] == '':
            status = 'PASS'

        self.mvclog.debug(self.mvclogname, f'DataCheck_model isEmptyPassForSqlsData end status = {status}')
        return status

    def notEmptyPassForSqlsData(self, sqlsId, dataName):
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
            実行結果（'OK'/ 'PASS'）
        """
        self.mvclog.debug(self.mvclogname, 'DataCheck_model notEmptyPassForSqlsData start')

        status = 'OK'
        sqlRecord = getjsonchunkbyid(self.sqldict, 'sqls', sqlsId, 'output', 'record')

        if sqlRecord[dataName]['value'][0] != '':
            status = 'PASS'

        self.mvclog.debug(self.mvclogname, f'DataCheck_model notEmptyPassForSqlsData end status = {status}')
        return status
