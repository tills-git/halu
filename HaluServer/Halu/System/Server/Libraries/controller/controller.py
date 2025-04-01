# coding: utf-8

from commons.dynamicapp         import DynamicApp
from commons.specialcharconvert import SpecialCharConvert
from validation.validation      import Validation

class Controller():
    """
    コントローラクラス。

    Attributes
    ----------
    log : HaluLogger
    dynamicapp : DynamicApp
    specialcharconvert : SpecialCharConvert
    validation : Validation
    requestdict : dict
        画面からのリクエストデータ
    """
    def __init__(self, clog, clogname, requestdict):
        try:
            self.clog     = clog
            self.clogname = clogname
            self.clog.debug(self.clogname, 'Controller init start')
            
            # 利用する外部クラスをインスタンス
            self.dynamicapp = DynamicApp()
            self.specialcharconvert = SpecialCharConvert()
            self.validation = Validation(self.clog, self.clogname, requestdict)

            # インスタンス変数を設定
            self.requestdict = requestdict

        except Exception as e:
            self.clog.error(self.clogname, f'Controller init exception message : {e}')

        finally:
            self.clog.debug(self.clogname, 'Controller init end')


    def checkRequestData(self, validation_data, temp_object):
        """
        リクエストデータチェック処理１（リクエストデータからレコード配列を取り出す）
        配列：requestdict['records']の要素（idごと：record_info)を順番に取り出し、
        self.checkRecordを実行。

        Parameters
        ----------
        validation_data : json
            画面定義項目（validation.json の内容）
        temp_object : Class
            サーバプログラム実行用のコントローラオブジェクト -> app_cache.getControllerObject() の戻り値
        """
        # リクエストデータの有無を判定（無い場合はリターン）
        if 'records' not in self.requestdict:
            return

        for record_info in self.requestdict['records']:
            result = self.checkRecord(record_info, validation_data, temp_object)
            if result == 'ERROR':
                return


    def checkRecord(self, record_info, validation_data, temp_object):
        """
        リクエストデータチェック処理２（リクエストレコードと同じIDをdatasetレコード配列から取り出す）
        dynamicapp.doBeforeAfterMethod :json に指定されているbefore/ after メソッドの実行。
        validation.checkRecordItem     :validationに、request.jsonと同じidが存在する場合、
                                        バリデーションのチェックを行う。

        Parameters
        ----------
        record_info : dict
            リクエストデータの'record' の1要素 -> requestdict['records'][i]
        validation_data : json
            画面定義項目（validation.json の内容）
        temp_object : Class
            サーバプログラム実行用のコントローラオブジェクト -> app_cache.getControllerObject() の戻り値

        Returns
        -------
        result : str
            Before/ After メソッド実行結果('OK'/ 'ERROR')
        """
        # beforeメソッド処理
        result = self.dynamicapp.doBeforeAfterMethod('before', record_info, temp_object)

        if result == 'OK':
            for validation_info in validation_data['records']:
                if record_info['id'] == validation_info['id']:
                    result = self.validation.checkRecordItem(record_info['record'], validation_info['record'])
                    if result == 'ERROR':
                        return
                    break

        # afterメソッド処理
        result = self.dynamicapp.doBeforeAfterMethod('after', record_info, temp_object)

        return result


    def call(self, json_cache, app_cache):
        """
        メイン処理

        Parameters
        ----------
        json_cache :JsonCache
            validation 定義情報のキャッシュ -> JsonCache("validation.json")
        app_cache : AppCache
            コントローラAPPのキャッシュ -> AppCache("controller.py")

        Returns
        -------
        requestdict : dict
            チェック済みのリクエストデータ
        """
        try:
            self.clog.debug(self.clogname, 'Controller: call start')
            
            # 画面定義項目を取得
            self.clog.debug(self.clogname, 'Controller: 画面定義項目を取得 start')

            validation_data = json_cache.getJsonData(self.requestdict)

            self.clog.debug(self.clogname, 'Controller: 画面定義項目を取得 end')



            # コントローラオブジェクトを動的生成
            self.clog.debug(self.clogname, 'Controller: コントローラオブジェクトを動的生成 start')

            temp_object = app_cache.getControllerObject(self.requestdict, validation_data)

            self.clog.debug(self.clogname, 'Controller: コントローラオブジェクトを動的生成 end')



            # リクエストデータの特殊文字を変換する
            self.clog.debug(self.clogname, 'Controller: リクエストデータ特殊文字を変換 start')

            self.specialcharconvert.editRequestDataToSpecialChar(self.requestdict)

            self.clog.debug(self.clogname, 'Controller: リクエストデータ特殊文字を変換 end')



            # リクエストデータをチェック
            self.clog.debug(self.clogname, 'Controller: リクエストデータをチェック start')

            self.checkRequestData(validation_data, temp_object)

            self.clog.debug(self.clogname, 'Controller: リクエストデータをチェック end')



            # リクエストデータをリターン
            self.clog.debug(self.clogname, 'Controller: call end')

            return self.requestdict

        except Exception as e:
            self.clog.debug(self.clogname, 'Controller: 例外処理が発生しました。')

            self.requestdict['message']['status'] = 'ERROR'
            self.requestdict['message']['msg'] = e
            return self.requestdict
