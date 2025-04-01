# coding: utf-8

import json

from halumain.haluconf import HaluConf
from commons.filepath  import FilePath

class JsonCache():
    """
    Json ファイルを読み込む。
    HaluConf の'load_type' の設定値に応じてデータをキャッシュする（未実装）。

    Attributes
    ----------
    hconf : HaluConf
    filepath : FilePath
    json_type : str
        json ファイルの種類('validation.json'/ 'sql.json'/ 'tran.json'/ 'form.json')
    """
    def __init__(self, mvclog, mvclogname, json_type):
        self.mvclog     = mvclog
        self.mvclogname = mvclogname

        # 利用する外部クラスをインスタンス
        self.hconf     = HaluConf()
        self.filepath  = FilePath(self.mvclog, self.mvclogname)

        # インスタンス変数を設定
        self.json_type = json_type

        # HaluConf にload_type が無いので後回し
        # if hconf.load_type   != 'file':
            # self.app_cache = dict()


    def createCache(self):
        """
        load_type が'static' もしくは'dynamic'の時に使う。
        """
        result = 'OK'

        return result


    def createHash(self):
        """
        load_type が'static' もしくは'dynamic'の時に使う。
        """
        result = 'OK'

        return result


    def getJsonData(self, data):
        """
        JSONファイル名（パス情報）の取得。

        Parameters
        ----------
        data : json
            リクエストデータ、レスポンスデータのいずれか

        Returns
        -------
        json.loads(json_data) :
            filepath.readFileの結果情報(jsonデータ)を読み込み、ハッシュに置き換える。
        """
        file_path = self.filepath.getJsonsPath(self.json_type, data)
        json_data = self.getFileData(file_path)

        return json.loads(json_data)


    def getStaticData(self):
        """
        load_type が'static' 時に使う。
        """
        result = 'OK'

        return result


    def getDynamicData(self):
        """
        load_type が'dynamic' 時に使う。
        """
        result = 'OK'

        return result


    def getFileData(self, file_path):
        """
        json ファイルを読み込む。
        load_type が'file' 以外の場合はキャッシュからデータを取得（未実装）。

        Parameters
        ----------
        file_path : str
            ファイルパス -> FilePath.getJsonPath() の戻り値

        Returns
        -------
        file_data : str
            json ファイルの文字列データ -> FilePath.readFile() の戻り値
        """
        file_data = self.filepath.readFile(file_path)

        return file_data
