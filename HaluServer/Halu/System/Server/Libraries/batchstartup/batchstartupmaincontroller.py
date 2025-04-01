# coding: utf-8

from commons.jsoncache         import JsonCache
from commons.appcache          import AppCache
from controller.controller     import Controller
from halurpc.batchserverrpc    import BatchClient

class BatchStartupMainController():
    """
    1.AppServer からリクエストデータを受け取る
    2.Controllerを呼び出し、リクエストデータをチェック
    3.modelを呼び出す指示がある場合、MainModelを呼び出しSQLデータを取得
    4.MainViewを呼び出しレスポンスデータを取得
    5.レスポンスデータをAppServer に返す

    Attributes
    ----------
    log : HaluLogger
    main_model : MainModel
        メインモデル オブジェクト
    main_view  : MainView
        メインビュー オブジェクト
    json_cache : JsonCache
        validation定義情報のキャッシュ
    app_cache  : AppCache
        コントローラAPPのキャッシュ
    """
    def __init__(self, clog, clogname, mainmodel, mainview):
        try:
            self.clog     = clog
            self.clogname = clogname
            self.clog.debug(self.clogname, 'MainController init start')

            # 利用する外部クラスをインスタンス
            self.json_cache = JsonCache(self.clog, self.clogname, 'validation.json')
            self.app_cache  = AppCache(self.clog, self.clogname, 'controller.py')

            # インスタンス変数を設定
            self.main_model = mainmodel
            self.main_view  = mainview

        except Exception as e:
            self.clog.error(self.clogname, f'MainController init exception message : {e}')

        finally:
            self.clog.debug(self.clogname, 'MainController init end\n')


    def call(self, requestdict):
        """
        メイン処理（AppServer から呼び出される）

        Parameters
        ----------
        requestdict : dict
            1. リクエストJSONの  "message": {"status": "OK",の時
            2. "model": を検索する
            3. "model": "yes",の時
            4. main_modelからsqldictを貰う
            5.sqldict["sqls"]内に
              sql_info['id'] == 'printParam'、もしくは、sql_info['id'] == 'printKey'がある時
              プリント処理を起動し、レスポンスデータを取得する。
              どちらもない時は、メインビューのcallを実行し、レスポンスデータを取得する

        Returns
        -------
        responsedict : dict
            レスポンスデータ
            main_view.call の戻り値
        """
        try:
            self.clog.debug(self.clogname, f'MainController: call start requestdict : {requestdict}')

            controller = Controller(self.clog, self.clogname, requestdict)
            requestdict = controller.call(self.json_cache, self.app_cache)
            self.clog.debug(self.clogname, f'MainController: チェック済 requestdict : {requestdict}')


            # メインモデルのcallを実行し、SQLデータを取得する
            sqldict = {}
            if requestdict['message']['status'] == 'OK':
                if 'model' in requestdict:
                    if requestdict['model'] == 'yes':
                        sqldict = self.main_model.call(requestdict)
                        self.clog.debug(self.clogname, f'MainController: モデルが処理した sqldict : {sqldict}')


            # バッチサーバにを接続する
            batchclient  = BatchClient()
            responsedict = batchclient.call(sqldict)


            self.clog.debug(self.clogname, f'MainController: ビューが処理した responsedict : {responsedict}')
            return responsedict

        except Exception as e:
            self.clog.error(self.clogname, f'MainController: call exception message : {e}')

        finally:
            self.clog.debug(self.clogname, 'MainController: call end\n')
