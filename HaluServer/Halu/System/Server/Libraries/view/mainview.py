# coding: utf-8

from commons.jsoncache import JsonCache
from commons.appcache  import AppCache
from view.view         import View

class MainView():
    """
    AppServer から呼び出される。
    コントローラから渡されたリクエストデータと
    SQLデータを使ってViewをインスタンスし、
    レスポンスデータを取得する。

    Attributes
    ----------
    log : MvcLogger
    json_cache : JsonCache
    app_cache : AppCache
    """
    def __init__(self, vlog, vlogname):
        try:
            self.vlog     = vlog
            self.vlogname = vlogname
            self.vlog.debug(self.vlogname, 'MainView init start')

            # 利用する外部クラスをインスタンス
            self.json_cache = JsonCache(self.vlog, self.vlogname, 'tran.json')
            self.app_cache  = AppCache(self.vlog, self.vlogname, 'view.py')

        except Exception as e:
            self.vlog.error(self.vlogname, f'MainView init exception message : {e}')

        finally:
            self.vlog.debug(self.vlogname, 'MainView init end\n')


    def call(self, requestdict, sqldict):
        """
        メイン処理（コントローラから呼び出される）

        Parameters
        ----------
        requestdict ： dict
            リクエストデータ
        sqldict ： dict
            SQLデータ

        Returns
        -------
        responsedict ： dict
            レスポンスデータ -> view.call の戻り値
        """
        try:
            self.vlog.debug(self.vlogname, f'MainView: call start requestdict : {requestdict}')
            self.vlog.debug(self.vlogname, f'MainView:            sqldict     : {sqldict}')

            # ビューをインスタンスし、callを実行、レスポンスデータを取得する
            view = View(self.vlog, self.vlogname, requestdict, sqldict)
            responsedict = view.call(self.json_cache, self.app_cache)

            # レスポンスデータをコントローラへリターン
            self.vlog.debug(self.vlogname, f'MainView: ビューが処理した responsedict : {responsedict}')
            return responsedict

        except Exception as e:
            self.vlog.error(self.vlogname, f'MainView call exception message : {e}')

        finally:
            self.vlog.debug(self.vlogname, 'MainView: call end\n')
