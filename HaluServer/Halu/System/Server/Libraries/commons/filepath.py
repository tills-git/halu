# coding: utf-8

from halumain.haluconf import HaluConf

class FilePath():
    """
    ファイル操作およびファイルパスの取得、編集を行う。

    Attributes
    ----------
    hconf : HaluConf
        設定情報読み込み用オブジェクト。クラス変数として保持。
    mvclog : HaluLogger
        ログ出力用オブジェクト。
    mvclogname : str
        ログの出力ファイル名。
    """
    # クラス変数を定義
    hconf = HaluConf()
    
    def __init__(self, mvclog, mvclogname):
        """
        Parameters
        ----------
        mvclog : HaluLogger
        mvclogname : str
        """
        self.mvclog     = mvclog
        self.mvclogname = mvclogname

        # HaluConf にload_type が無いので後回し
        # if hconf.load_type   != 'file':
            # self.app_cache = dict()

    def getJsonsPath(self, json_type, data):
        """
        JSONファイルの絶対パスを取得する。

        Parameters
        ----------
        json_type : str
             validation.json/ sql.json/ tran.json
        data : json
            requestdict/ sqldict/ responsedict

        Returns
        -------
        jsons_path + json_type : str
            JSONファイル名（絶対パス）
        """
        # ディレクトリーパスの設定
        temp_path = FilePath.hconf.apppath + '/' + data['html'] + '/'
        name_array = data['html'].split('/')
        # ファイル名の設定
        jsons_path = temp_path + name_array[-1] + '_'

        if (json_type == 'sql.json') or (json_type == 'tran.json'):
            jsons_path += data['mode'] + '_'

        return jsons_path + json_type


    def getAppsPath(self, py_type, data):
        """
        pyファイルの絶対パスを取得する。

        Parameters
        ----------
        py_type : str
            controller.py/ model.py/ view.py
        data : json
            requestdict/ sqldict/ responsedict

        Returns
        -------
        apps_path1 :
            pyファイル名（絶対パス）

        """
        # ディレクトリーパスの設定
        temp_path = FilePath.hconf.apppath + '/' + data['html'] + '/'
        name_array = data['html'].split('/')
        # ファイル名の設定
        apps_path = temp_path + name_array[-1] + '_' + py_type

        # JsonディレクトリをServerディレクトリに置換する
        apps_path1 = apps_path.replace('Json', 'Server')

        return apps_path1


    def getFolderName(self, data):
        """
        JSONデータのhtml情報からプログラムフォルダ名を取得する。
        例）'Member/Json/Apps/Login' -> 'Login'

        Parameters
        ----------
        data : json
            リクエストデータ、SQLデータ、レスポンスデータのいずれか

        Returns
        -------
        folder_name : str
            フォルダ名
        """
        folder_name = ''
        if '/' in data['html']:
            name_array = data['html'].split('/')
            folder_name = name_array[-1]
        else:
            folder_name = data['html']

        return folder_name


    def getProjectName(self, data):
        """
        JSONデータのhtml情報からプロジェクト名を取得する。
        例）'Member/Json/Apps/Login' -> 'Member'

        Parameters
        ----------
        data : json
            リクエストデータ、SQLデータ、レスポンスデータのいずれか

        Returns
        -------
        project_name :
            プロジェクト名
        """
        project_name = ''
        if '/' in data['html']:
            name_array = data['html'].split('/')
            project_name = name_array[0]
        else:
            project_name = data['html']

        return project_name


    def readFile(self, file_name):
        """
        ファイルの絶対パスを使用して、ファイル内容を文字コード：UTF-8で読み込む。

        Parameters
        ----------
        file_name : str
            読み込み対象ファイルの絶対パス

        Returns
        -------
        data : ファイル内に記述された情報
        """
        try:
            with open(file_name, mode='r', encoding='UTF-8') as f:
                data = f.read()

            return data
        except Exception as e:
             self.mvclog.error(self.mvclogname, f'FilePath readFile exception message : {e}')


    def readlinesFile(self, file_name):
        """
        CSVの際、使用。？
        ファイル名（パス情報含む）を使用してファイルを文字コード：UTF-8で読み込み、配列に格納する。

        Parameters
        ----------
        file_name : str
            読み込み対象ファイルの絶対パス

        Returns
        -------
        arraydata : list
            配列に格納されたデータ
        """
        try:
            with open(file_name, encoding='UTF-8') as f:
                arraydata = f.readlines()
            return arraydata
        except Exception as e:
             self.mvclog.error( self.mvclogname, f'FilePath readlinesFile exception message : {e}')


    def writeFile(self, file_name, data):
        """
        Json文字列をファイルに出力する？（呼び出し元に記述あり）
        ファイルを開き、data（json文字列)を書き込む？

        Parameters
        ----------
        file_name : str
            出力ファイルの絶対パス
        data : json
            出力する文字列データ
        """
        try:
            with open(file_name, 'w', encoding='UTF-8') as f:
                f.write(data)
        except Exception as e:
             self.mvclog.error( self.mvclogname, f'FilePath writeFile exception message : {e}')


    def writeCodeFile(self):

        result = 'OK'

        return result
