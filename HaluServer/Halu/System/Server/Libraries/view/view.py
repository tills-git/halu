# coding: utf-8

from commons.datamapping    import DataMapping
from commons.dynamicapp     import DynamicApp

class View():
    """
    ビュークラス。

    Attributes
    ----------
    log : MvcLogger
    datamapping : DataMapping
    dynamicapp : DynamicApp
    requestdict : dict
        画面からのリクエストデータ
    sqldict : dict
        SQLデータ（sql.json）
    """
    def __init__(self, vlog, vlogname, requestdict, sqldict):
        try:
            self.vlog     = vlog
            self.vlogname = vlogname
            self.vlog.debug(self.vlogname, 'View init start')

            # 利用する外部クラスをインスタンス
            self.datamapping = DataMapping()
            self.dynamicapp = DynamicApp()

            # インスタンス変数を設定
            self.requestdict = requestdict
            self.sqldict = sqldict

        except Exception as e:
            self.vlog.error(self.vlogname, f'View init exception message : {e}')

        finally:
            self.vlog.debug(self.vlogname, 'View init end')

    def fromSqlToResponse(self, responsedict, temp_object):
        """
        sql実行結果データからレスポンスデータを編集する。

        Parameters
        ----------
        responsedict : dict
            レスポンスデータ
        temp_object : Class
            サーバプログラム実行用のモデルオブジェクト -> AppCache.getViewObject() の戻り値
        """
        if 'records' in responsedict:
            for response_info in responsedict['records']:
                self.editResponse(response_info, temp_object)
        return


    def editResponse(self, response_info, temp_object):
        """
        レスポンスデータの編集

        Parameters
        ----------
        response_info : dict
            レスポンスデータの'record' の1要素 -> responsedict['records'][i]
        temp_object : Class
            サーバプログラム実行用のモデルオブジェクト -> AppCache.getViewObject() の戻り値
        """
        # beforeメソッド処理
        result = self.dynamicapp.doBeforeAfterMethod('before', response_info, temp_object)

        if result == 'OK':
            self.editResponseRecord(response_info['record'], response_info)

        # afterメソッド処理
        self.dynamicapp.doBeforeAfterMethod('after', response_info, temp_object)

        return


    def editResponseRecord(self, response_record, response_info):
        """
        レスポンスデータの行編集

        Parameters
        ----------
        response_record : dict
            response_infoの'record' の1要素 -> response_info['record']
        response_info : dict
            レスポンスデータの'records' の1要素 -> responsedict['records'][i]
        """
        for name, value in response_record.items():
            # fromtype 処理
            if 'fromtype' in value:
                if value['fromtype'] != '':
                    if value['fromtype'] == 'request':
                        # 違うid のrequest から編集する
                        self.datamapping.fromRequestEditValue(value, self.requestdict)
                        continue

                    if value['fromio'] == 'input':
                        # sqldict のinput から編集する
                        self.datamapping.fromSqlInputEditValue(value, self.sqldict)
                    else:
                        # sql_data のoutput から編集する
                        self.datamapping.fromSqlOutputEditValue(value, self.sqldict)
                    continue

            # 同じid のsqldict から編集する
            for sql_info in self.sqldict['sqls']:
                if response_info['id'] != sql_info['id']:
                    continue

                sql_record = sql_info['output']['record']
                if name in sql_record:
                    value['value'] = sql_record[name]['value']
                break


    def setRequestError(self, responsedict):
        """
        リクエストエラーを設定する

        Parameters
        ----------
        responsedict : dict
            レスポンスデータ

        Returns
        -------
        responsedict : dict
            エラー設定後のレスポンスデータ
        """
        responsedict['message'] = self.requestdict['message']
        return responsedict


    def setSqlError(self, responsedict):
        """
        SQLエラーを設定する

        Parameters
        ----------
        responsedict : dict
            レスポンスデータ

        Returns
        -------
        responsedict : dict
            エラー設定後のレスポンスデータ
        """
        responsedict['message'] = self.sqldict['message']
        return responsedict


    def call(self, json_cache, app_cache):
        """
        メイン処理

        Parameters
        ----------
        json_cache : dict
            tran情報定義のキャッシュ -> JsonCache("tran.json")
        app_cache : dict
            ビューAPP のキャッシュ -> AppCache("view.py")

        Returns
        -------
        responsedict : dict
            レスポンスデータ
        """
        try:
            self.vlog.debug(self.vlogname, 'View call start')

            # レスポンスデータを取得
            self.vlog.debug(self.vlogname, 'View レスポンスデータを取得 start')

            tran_data = json_cache.getJsonData(self.requestdict)
            responsedict  = tran_data['response']

            self.vlog.debug(self.vlogname, 'View レスポンスデータを取得 end')


            # ビューオブジェクトを動的生成
            self.vlog.debug(self.vlogname, 'View ビューオブジェクトを動的生成 start')

            temp_object = app_cache.getViewObject(responsedict, self.sqldict, self.requestdict)

            self.vlog.debug(self.vlogname, 'View ビューオブジェクトを動的生成 end')


            # リクエストエラーを設定
            self.vlog.debug(self.vlogname, 'View リクエストエラーを判定 start')

            if self.requestdict['message']['status'] != 'OK':
                self.vlog.debug( self.vlogname, 'View リクエストデータ エラー')
                return self.setRequestError(responsedict)

            self.vlog.debug(self.vlogname, 'View リクエストデータ ＯＫ')


            # ＳＱＬエラーを設定
            self.vlog.debug(self.vlogname, 'View ＳＱＬエラーを判定 start')

            if self.sqldict['message']['status'] != 'OK':
                self.vlog.debug( self.vlogname, 'View ＳＱＬデータ エラー')
                return self.setSqlError(responsedict)


            # ＳＱＬ ＯＫ （ sqldict['message']をresponsedict['message']にセット ）
            responsedict['message'] = self.sqldict['message']
            self.vlog.debug(self.vlogname, 'View ＳＱＬデータ ＯＫ')


            # ＳＱＬデータからレスポンスデータを設定する
            self.vlog.debug(self.vlogname, 'View ＳＱＬデータからレスポンスデータを設定 start')

            self.fromSqlToResponse(responsedict, temp_object)

            self.vlog.debug(self.vlogname, 'View ＳＱＬデータからレスポンスデータを設定 end')


            return responsedict

        except Exception as e:
            responsedict['message']['status'] = 'ERROR'
            responsedict['message']['msg'] = e
            return responsedict

        finally:
            self.vlog.debug(self.vlogname, 'View call end')
