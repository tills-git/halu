# coding: utf-8

import sys

from halumain.haluconf import HaluConf

class AppendPath():
    """
    パスを動的に追加する。

    Attributes
    ----------
    hconf : HaluConf
        設定情報読み込み用オブジェクト。クラス変数として保持。
    """
    # クラス変数を定義
    hconf = HaluConf()

    def append_apppath(self, data):
        """
        サーバプログラム実行用クラスのパスを動的に追加する。
        json 内の"html" からパスを生成して追加する。

        Parameters
        ----------
        data : json
            コントローラはrequestdict , モデルはsqldict, ビューはresponsedict
        """
        # パスの設定
        html_path = AppendPath.hconf.apppath + '/' + data['html']
        w_path = html_path.replace('Json', 'Server')
        sys.path.append(w_path)


    def append_modulepath(self, data):
        """
        サーバプログラムで利用するモジュール用パスを動的に追加する。

        Parameters
        ----------
        project_name : str
             プロジェクト名
        """
        # パスの設定
        project_name = ''
        if '/' in data['html']:
            name_array = data['html'].split('/')
            project_name = name_array[0]
        else:
            project_name = data['html']

        w_path = AppendPath.hconf.apppath + '/' + project_name + '/Server/Commons'
        sys.path.append(w_path)
