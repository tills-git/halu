# coding: utf-8

from commons.filepath   import FilePath
from commons.appendpath import AppendPath

class AppCache():
    """
    python ファイルを読み込む。
    HaluConf の'load_type' の設定値に応じてデータをキャッシュする（未実装）。

    Attributes
    ----------
    filepath : FilePath
    appendpath : AppendPath
    mvclog : HaluLogger
        ログ出力用オブジェクト。
    mvclogname : str
        ログの出力ファイル名。
    py_type : str
        python ファイルの種類('controller.py'/ 'model.py'/ 'view.py'/ 'form.py')
    """
    def __init__(self, mvclog, mvclogname, py_type):
        self.mvclog     = mvclog
        self.mvclogname = mvclogname

        # 利用する外部クラスをインスタンス
        self.filepath   = FilePath(self.mvclog, self.mvclogname)
        self.appendpath = AppendPath()

        # インスタンス変数を設定
        self.py_type = py_type


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


    def getAppData(self, data):
        """
        アプリデータを取得する。

        Parameters
        ----------
        data : json
            リクエストデータ、SQLデータ、レスポンスデータのいずれか

        Returns
        -------
        app_data : str
            python ファイルの文字列データ -> self.getFileData() の戻り値
        """
        # load_type の値によって分岐処理（未実装）
        file_path = self.filepath.getAppsPath(self.py_type, data)
        app_data = self.getFileData(file_path)
        return app_data


    def getFileData(self, file_path):
        """
        python プログラムファイルを読み込む。
        load_type が'file' 以外の場合はキャッシュからデータを取得（未実装）。

        Parameters
        ----------
        file_path : str
            ファイルパス -> FilePath.getAppsPath() の戻り値

        Returns
        -------
        file_data : str
            python ファイルの文字列データ -> FilePath.readFile() の戻り値
        """
        file_data = self.filepath.readFile(file_path)
        return file_data


    def getControllerObject(self, requestdict, validation_data):
        """
        サーバプログラム実行用のコントローラクラスを動的にインスタンス。
        サーバプログラムとサーバプログラム用モジュール(Sever/Commons)のパス追加も行う。

        Parameters
        ----------
        requestdict : json
        validation_data : json

        Returns
        -------
        app_object : object
            サーバプログラムを実行するクラスのインスタンスオブジェクト
        """
        # クラス名とインポート文を取得
        class_name, w_import = self.getImportString(requestdict)
        if class_name == '':
            return None
        # 動的にインポート文を実行
        self.appendpath.append_apppath(requestdict)
        self.appendpath.append_modulepath(requestdict)
        exec(w_import)
        # クラスをインスタンス
        w_class = class_name + '(self.mvclog, self.mvclogname, requestdict, validation_data)'
        app_object = eval(w_class)

        return app_object


    def getModelObject(self, database, sqldict, requestdict):
        """
        サーバプログラム実行用のモデルクラスを動的にインスタンス。
        サーバプログラムとサーバプログラム用モジュール(Sever/Commons)のパス追加も行う。

        Parameters
        ----------
        database : database
        sqldict  : json
        requestdict : json

        Returns
        -------
        app_object : object
            サーバプログラムを実行するクラスのインスタンスオブジェクト
        """
        # クラス名とインポート文を取得
        class_name, w_import = self.getImportString(sqldict)
        if class_name == '':
            return None
        # 動的にインポート文を実行
        self.appendpath.append_apppath(sqldict)
        self.appendpath.append_modulepath(sqldict)
        exec(w_import)
        # クラスをインスタンス
        w_class = class_name + '(self.mvclog, self.mvclogname, database, sqldict, requestdict)'
        app_object = eval(w_class)

        return app_object


    def getViewObject(self, responsedict, sqldict, requestdict):
        """
        サーバプログラム実行用のビュークラスを動的にインスタンス。
        サーバプログラムとサーバプログラム用モジュール(Sever/Commons)のパス追加も行う。

        Parameters
        ----------
        responsedict : json
        sqldict : json
        requestdict : json

        Returns
        -------
        app_object : object
            サーバプログラムを実行するクラスのインスタンスオブジェクト
        """
        # クラス名とインポート文を取得
        class_name, w_import = self.getImportString(responsedict)
        if class_name == '':
            return None
        # 動的にインポート文を実行
        self.appendpath.append_apppath(responsedict)
        self.appendpath.append_modulepath(responsedict)
        exec(w_import)
        # クラスをインスタンス
        w_class = class_name + '(self.mvclog, self.mvclogname, responsedict, sqldict, requestdict)'
        app_object = eval(w_class)

        return app_object


    def getFormObject(self, excelcreate, responsedict, sqldict, requestdict):
        """
        フォームクラスを動的にインスタンス。
        サーバプログラムとサーバプログラム用モジュール(Sever/Commons)のパス追加も行う。

        Parameters
        ----------
        pdfcreate : ??
        responsedict : json
        sqldict : json
        requestdict : json

        Returns
        -------
        app_object : object
            プログラムを実行するクラスのインスタンス。
        """
        # クラス名とインポート文を取得
        class_name, w_import = self.getFormImportString(responsedict)
        if class_name == '':
            return None
        # 動的にインポート文を実行
        self.appendpath.append_apppath(responsedict)
        self.appendpath.append_modulepath(responsedict)
        exec(w_import)
        # クラスをインスタンス
        w_class = class_name + '(self.mvclog, self.mvclogname, excelcreate, responsedict, sqldict, requestdict)'
        app_object = eval(w_class)

        return app_object


    def getImportString(self, data):
        """
        プログラム実行クラスのimport 用文字列を生成。
        クラスが不要（python プログラムが呼ばれない）の場合、空文字をリターン。

        Parameters
        ----------
        data : json
            コントローラはrequestdict , モデルはsqldict, ビューはresponsedict

        Returns
        -------
        class_name : str
            インスタンスするクラス名
        w_import : str
            クラスのimport 文 -> 'from [File_name] import [Class_name]'
        """
        # クラスの要否を判定
        if 'prog' not in data:
            return '', ''
        if data['prog'] == 'no':
            return '', ''

        # インスタンスするクラス名(=ファイル名)を取得
        folder_name = self.filepath.getFolderName(data)
        class_type = self.py_type.replace('.py','')
        class_name = folder_name + '_' + class_type
        # クラスのインポート文を取得
        w_import = 'from ' + class_name + ' import ' + class_name

        return class_name, w_import
    
    
    def getFormImportString(self, data):
        """
        プログラム実行クラスのimport 用文字列を生成。
        クラスが不要（python プログラムが呼ばれない）の場合、空文字をリターン。

        Parameters
        ----------
        data : json
            コントローラはrequestdict , モデルはsqldict, ビューはresponsedict

        Returns
        -------
        class_name : str
            インスタンスするクラス名
        w_import : str
            クラスのimport 文 -> 'from [File_name] import [Class_name]'
        """
        # クラスの要否を判定
        if 'prog' not in data['excelinfo']:
            return '', ''
        if data['excelinfo']['prog'] == 'no':
            return '', ''

        # インスタンスするクラス名(=ファイル名)を取得
        folder_name = self.filepath.getFolderName(data)
        class_type = self.py_type.replace('.py','')
        class_name = folder_name + '_' + class_type
        # クラスのインポート文を取得
        w_import = 'from ' + class_name + ' import ' + class_name

        return class_name, w_import
