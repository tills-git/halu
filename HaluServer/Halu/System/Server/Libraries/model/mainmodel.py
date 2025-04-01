# coding: utf-8

from commons.jsoncache import JsonCache
from commons.appcache  import AppCache
from model.model       import Model

class MainModel():
    """
    AppServer から呼び出される。
    データベースのインスタンス、sql.jsonを読み込む。
    Model をインスタンスしてSQL実行結果データを取得する
    (リクエストデータとDB情報が引数）

    Attributes
    ----------
    log : MvcLogger
    json_cache : JsonCache
    app_cache : AppCache
    """
    def __init__(self, mlog, mlogname, dlog, dlogname):
        try:
            self.mlog     = mlog
            self.mlogname = mlogname
            self.mlog.debug(self.mlogname, 'MainModel init start')

            self.dlog     = dlog
            self.dlogname = dlogname

            # 利用する外部クラスをインスタンス
            self.json_cache  = JsonCache(self.mlog, self.mlogname, 'sql.json')
            self.app_cache   = AppCache(self.mlog, self.mlogname, 'model.py')

        except Exception as e:
            self.mlog.error(self.mlogname, f'MainModel init exception message : {e}')

        finally:
            self.mlog.debug(self.mlogname, 'MainModel init end\n')


    def call(self, requestdict):
        """
        メイン処理（コントローラから呼び出される）

        Parameters
        ----------
        requestdict ： dict
            リクエストデータ

        Returns
        -------
        sqldict ： dict
            SQLデータ -> model.call の戻り値
        """
        try:
            self.mlog.debug(self.mlogname, f'MainModel: call start requestdict : {requestdict}')

            # モデルをインスタンスし、callを実行、SQLデータを取得する
            model = Model(self.mlog, self.mlogname, self.dlog, self.dlogname, requestdict)
            sqldict = model.call(self.json_cache, self.app_cache)


            # SQLデータをコントローラへリターン
            self.mlog.debug(self.mlogname, f'MainModel: モデルが処理した sqldict : {sqldict}')

            return sqldict

        except Exception as e:
            self.mlog.error(self.mlogname, f'MainModel call exception message : {e}')

        finally:
            self.mlog.debug(self.mlogname, 'MainModel: call end\n')
