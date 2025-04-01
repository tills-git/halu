# coding: utf-8

from commons.jsonchunk import getjsonchunkbyid


class PrintController():
    """
    プリントコントローラクラス

    call:
    １．printParamをパラメータにjson_cacheのgetJsonDataを呼び出し、プリント用のトランザクションjsonを取得し
        そこからrequestdictを取得する
    ２．printKey, printParamを使って、requestdictにプリント処理用キー情報とパラメータ情報を設定する
    ３．requestdictをリターンする
    

    Attributes
    ----------
    log : HaluLogger
    printparamdict : printparam内のhtmlとModeからプリント処理用のトランザクションjsonを取得する
    keyvaluedict : プリント処理用のキー情報： １行もしくは複数行
    """


    def __init__(self, clog, clogname, param_info, keydict):
        try:
            self.clog     = clog
            self.clogname = clogname
            self.clog.debug(self.clogname, 'PrintController init start')

            # プリントパラメータ情報とプリントキー情報
            self.param_info   = param_info
            self.keyvaluedict = keydict


        except Exception as e:
            self.clog.error(self.clogname, f'PrintController init exception message : {e}')

        finally:
            self.clog.debug(self.clogname, 'PrintController init end')


    def call(self, json_cache, app_cache):
        """
        メイン処理

        Parameters
        ----------
        json_cache :JsonCache
            tran 定義情報のキャッシュ -> JsonCache("tran.json")
        app_cache : AppCache
            コントローラAPPのキャッシュ -> AppCache("controller.py")

        Returns
        -------
        requestdict : dict
            プリントキー情報とパラメータ情報を設定済みのリクエストデータ
        """
        try:
            self.clog.debug(self.clogname, 'PrintController call start')

            # レスポンスデータを取得
            self.clog.debug(self.clogname, 'PrintController クエストデータを取得 start')

            # id=printParam内のHTMLとModeからプリント処理用のトランザクションjsonを取得する
            tran_data   = json_cache.getJsonData(self.param_info)
            requestdict = tran_data['request']

            # リクエストデータにプリント処理用のパラメータ情報を設定する
            printParamRecord = getjsonchunkbyid(requestdict, 'records', 'printParam', 'record')
            for key, value in self.param_info["input"]["record"].items():
                if key in printParamRecord:
                    printParamRecord[key]['value'][0] = value['value'][0]

            # リクエストデータにプリント処理用のキー情報を設定する
            printkeyRecord = getjsonchunkbyid(requestdict, 'records', 'printKey', 'record')
            for key, value in self.keyvaluedict.items():
                if key in printkeyRecord:
                    printkeyRecord[key]['value'][0] = value


            return requestdict

        except Exception as e:
            self.clog.error(self.clogname, f'PrintController exception message type    : {str(type(e))}')
            self.clog.error(self.clogname, f'PrintController exception message arg     : {str(e.args)}')
            self.clog.error(self.clogname, f'PrintController exception message message : {e.message}')
            self.clog.error(self.clogname, f'PrintController exception message         : {e}')
            return requestdict

        finally:
            self.clog.debug(self.clogname, 'PrintController call end')



# ---------------------------------------------
#    テンプレートクラス 実行開始
# ---------------------------------------------
def main():
    print('***  PrintController start  ***\n')


    print('\n***  PrintController start end  ***')


if __name__ == '__main__':
    main()
