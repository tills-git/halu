# coding: UTF-8
# ***********************************************
# * Framework Name  :  Halu
# * (c) 2025 TILLS & Co.
# ***********************************************

from commons.jsonchunk import getjsonchunkbyid

class OrderDetailListMainte_model():
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
            self.mvclog.debug(self.mvclogname, 'OrderDetailListMainte_model init start')

            # インスタンス変数を設定
            self.database = database
            self.sqldict = sqldict
            self.requestdict = requestdict

        except Exception as e:
            self.mvclog.error(self.mvclogname, f'OrderDetailListMainte_model init exception message : {e}')

        finally:
            self.mvclog.debug(self.mvclogname, 'OrderDetailListMainte_model init end')


    def setUpdateData(self, requestId, sqlsId, idName):
        """
        更新データを設定する

        Parameters
        ----------
        requestId : str
            セットする値を保持するリクエストデータのデータセットID
        sqlsId : str
            対象とするSQLデータのデータセットID
        idName : str
            対象とする項目名（キー項目）

        Returns
        -------
        emptySW : str
            実行結果（'OK'/ 'PASS'）
        """
        self.mvclog.debug(self.mvclogname, 'OrderDetailListMainte_model setUpdateData start')

        requestRecord = getjsonchunkbyid(self.requestdict, 'records', requestId, 'record')
        sqlRecord = getjsonchunkbyid(self.sqldict, 'sqls', sqlsId, 'input', 'record')

        deleteCheck = requestRecord['削除']['value']
        idData = requestRecord[idName]['value']
        j = 0
        emptySW = 'PASS'
        for i in range(len(idData)):
            if deleteCheck[i] == '9':
                continue
            if idData[i] == '':
                continue

            for key, value in requestRecord.items():
                if key in sqlRecord:
                    if j == 0:
                        sqlRecord[key]['value'][0] = value['value'][i]
                    else:
                        sqlRecord[key]['value'].append(value['value'][i])
                    emptySW = 'OK'
            j += 1

        self.mvclog.debug(self.mvclogname, f'OrderDetailListMainte_model setUpdateData end status = {emptySW}')
        return emptySW

    def setInsertData(self, requestId, sqlsId, idName):
        """
        登録データを設定する

        Parameters
        ----------
        requestId : str
            セットする値を保持するリクエストデータのデータセットID
        sqlsId : str
            対象とするSQLデータのデータセットID
        idName : str
            対象とする項目名（キー項目）

        Returns
        -------
        emptySW : str
            実行結果（'OK'/ 'PASS'）
        """
        self.mvclog.debug(self.mvclogname, 'OrderDetailListMainte_model setInsertData start')

        requestRecord = getjsonchunkbyid(self.requestdict, 'records', requestId, 'record')
        sqlRecord = getjsonchunkbyid(self.sqldict, 'sqls', sqlsId, 'input', 'record')

        idData = requestRecord[idName]['value']
        maxId = max([a for a in idData if a != ''], key=int)
        if maxId == '':
            maxId = 0
        j = 0
        emptySW = 'PASS'
        for i in range(len(idData)):
            if idData[i] != '':
                continue

            idData[i] = maxId + 1
            maxId += 1
            for key, value in requestRecord.items():
                if key in sqlRecord:
                    if j == 0:
                        sqlRecord[key]['value'][0] = value['value'][i]
                    else:
                        sqlRecord[key]['value'].append(value['value'][i])
                    emptySW = 'OK'
            j += 1

        self.mvclog.debug(self.mvclogname, f'OrderDetailListMainte_model setInsertData end status = {emptySW}')
        return emptySW

    def setDeleteData(self, requestId, sqlsId, idName):
        """
        削除データを設定する

        Parameters
        ----------
        requestId : str
            セットする値を保持するリクエストデータのデータセットID
        sqlsId : str
            対象とするSQLデータのデータセットID
        idName : str
            対象とする項目名（キー項目）

        Returns
        -------
        emptySW : str
            実行結果（'OK'/ 'PASS'）
        """
        self.mvclog.debug(self.mvclogname, 'OrderDetailListMainte_model setDeleteData start')

        requestRecord = getjsonchunkbyid(self.requestdict, 'records', requestId, 'record')
        sqlRecord = getjsonchunkbyid(self.sqldict, 'sqls', sqlsId, 'input', 'record')

        deleteCheck = requestRecord['削除']['value']
        idData = requestRecord[idName]['value']
        # maxLength = len(deleteCheck) - 1
        maxLength = len(deleteCheck)
        j = 0
        emptySW = 'PASS'
        for i in range(maxLength):
            if deleteCheck[i] != '9':
                continue
            if idData[i] == '':
                continue

            for key, value in requestRecord.items():
                if key in sqlRecord:
                    sqlRecord[key]['value'][j] = value['value'][i]
                    emptySW = 'OK'
            j = j + 1

        self.mvclog.debug(self.mvclogname, f'OrderDetailListMainte_model setDeleteData end status = {emptySW}')
        return emptySW


