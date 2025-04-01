# coding: UTF-8
# ***********************************************
# * Framework Name  :  Halu
# * (c) 2025 TILLS & Co.
# ***********************************************

from commons.jsonchunk import getjsonchunkbyid

class OrderListPrint_model():
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
            self.mvclog.debug(self.mvclogname, 'OrderListPrint_model init start')

            self.database    = database
            self.sqldict     = sqldict
            self.requestdict = requestdict

        except Exception as e:
            self.mvclog.error(self.mvclogname, f'OrderListPrint_model init exception message : {e}')

        finally:
            self.mvclog.debug(self.mvclogname, 'OrderListPrint_model init end')

    def setSql_OrderListPrint_printH(self, idname1, idname2 ,genesql_freesql):
        """
        リクエストデータからSQL文の検索条件を作成し、SQL文字列を編集する
        (where 句の'&&'を置換)

        Parameters
        ----------
        idname1 : str
            処理対象のリクエストデータセットID(tran.json > request)
        idname2 : str
            処理対象のSQLデータセットID(sql.json > sqls)
        genesql_freesql : str
            'genesql' or 'freesql' (sql.json)

        Returns
        -------
        result : str
            'OK' 固定

        """
        self.mvclog.debug(self.mvclogname, 'setSql_OrderListPrint_printH start')

        requestdict = getjsonchunkbyid(self.requestdict, 'records', idname1, 'record')
        sqlInfo     = getjsonchunkbyid(self.sqldict, 'sqls', idname2)
        rep         = ''

        w_検索顧客ＩＤ = requestdict['検索顧客ＩＤ']['value'][0]
        w_検索受注日カラ = requestdict['検索受注日カラ']['value'][0]
        w_検索受注日マデ = requestdict['検索受注日マデ']['value'][0]

        # 検索顧客ＩＤ
        if w_検索顧客ＩＤ != '':
            rep = rep + f" AND cst.顧客ＩＤ = {w_検索顧客ＩＤ}"

        # 検索受注日カラ
        if w_検索受注日カラ != '':
            rep = rep + f" AND hdr.受注日 >= '{w_検索受注日カラ}'"

        # 検索受注日マデ
        if w_検索受注日マデ != '':
            rep = rep + f" AND hdr.受注日 <= '{w_検索受注日マデ}'"


        # 検索条件の置き換え && を検索条件に置き換える
        if genesql_freesql == 'genesql':
            sqlInforep = sqlInfo['sql']['genesql']['where'].replace('&&', rep)
            sqlInfo['sql']['genesql']['where'] = sqlInforep
        elif genesql_freesql == 'freesql':
            strJoin = sqlInfo['sql']['freesql'].join('\\t')
            strJoinrep = strJoin.replace('&&', rep)
            strSplit = strJoinrep.split('\\t')
            for idx,temp in enumerate(sqlInfo['sql']['freesql']):
                sqlInfo['sql']['freesql'][idx] = strSplit[idx]

        self.mvclog.debug(self.mvclogname, 'setSql_OrderListPrint_printH end')
        return 'OK'