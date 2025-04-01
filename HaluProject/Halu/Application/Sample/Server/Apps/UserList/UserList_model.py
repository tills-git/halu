# coding: UTF-8
# ***********************************************
# * Framework Name  :  Halu
# * (c) 2025 TILLS & Co.
# ***********************************************

from commons.jsonchunk import getjsonchunkbyid
from PaginationModel import Pagination_model

class UserList_model():
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
            self.mvclog.debug(self.mvclogname, 'UserList_model init start')

            self.database    = database
            self.sqldict     = sqldict
            self.requestdict = requestdict

        except Exception as e:
            self.mvclog.error(self.mvclogname, f'UserList_model init exception message : {e}')

        finally:
            self.mvclog.debug(self.mvclogname, 'UserList_model init end')

    def getOffsetLineOfUserList(self, idName1, idName2):
        """
        カレントページ数とページ当りの行数を使って、オフセット行数を計算する

        Parameters
        ----------
        idName1 : str
            対象とするデータセットID(リクエストデータ)
        idName2 : str
            対象とするデータセットID(SQLデータ)

        Returns
        -------
        result : str
            'OK' 固定
        """

        self.mvclog.debug(self.mvclogname, 'UserList_model getOffsetLine start')

        tempObj = Pagination_model(self.requestdict, self.sqldict, self.mvclog, self.mvclogname)
        status  = tempObj.getOffsetLine(idName1, idName2)

        self.mvclog.debug(self.mvclogname, 'UserList_model getOffsetLine end')
        return status

    def setSql_UserList(self, idname1, idname2 ,genesql_freesql):
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
        fixed string : str（不要かも）

        """
        self.mvclog.debug(self.mvclogname, 'setSql_UserList start')

        requestdict = getjsonchunkbyid(self.requestdict, 'records', idname1, 'record')
        sqlInfo     = getjsonchunkbyid(self.sqldict, 'sqls', idname2)
        rep         = ''

        w_検索ユーザコード = requestdict['検索ユーザコード']['value'][0]
        w_検索ユーザ名 = requestdict['検索ユーザ名']['value'][0]
        w_検索パスワード = requestdict['検索パスワード']['value'][0]
        w_検索メニュー名 = requestdict['検索メニュー名']['value'][0]
        w_検索テーマコード = requestdict['検索テーマコード']['value'][0]
        w_検索備考 = requestdict['検索備考']['value'][0]

        # 検索社員番号
        if w_検索ユーザコード != '':
            rep = rep + f" AND ユーザコード LIKE '%%{w_検索ユーザコード}%%'"

        # 検索氏名
        if w_検索ユーザ名 != '':
            rep = rep + f" AND ユーザ名 LIKE '%%{w_検索ユーザ名}%%'"

        # 検索拠点コード
        if w_検索パスワード != '':
            rep = rep + f" AND パスワード = '{w_検索パスワード}'"

        # 検索部門コード
        if w_検索メニュー名 != '':
            rep = rep + f" AND メニュー名 = '{w_検索メニュー名}'"

        # 検索雇用形態
        if w_検索テーマコード != '':
            rep = rep + f" AND テーマコード = '{w_検索テーマコード}'"

        # 検索在籍区分
        if w_検索備考 != '':
            rep = rep + f" AND 備考 = '{w_検索備考}'"

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

        self.mvclog.debug(self.mvclogname, 'setSql_UserList end')
        return 'OK'