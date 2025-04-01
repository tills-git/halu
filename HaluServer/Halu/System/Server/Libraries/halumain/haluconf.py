# coding: utf-8

import os

class HaluConf():

    def __init__(self):

        # -------------------------------------------------------------
        # OSを判定し、システムパスとアプリケーションパスを設定する
        # -------------------------------------------------------------
        if os.name == 'nt':
            self.__sysos      = 'Windows'
            self.__serverpath = 'C:/git_tills/dev_halu/HaluServer'
            self.__syspath    = 'C:/git_tills/dev_halu/HaluServer/Halu/System'
            self.__apppath    = 'C:/git_tills/dev_halu/HaluProject/Halu/Application'
            self.__soffice    = 'C:/LibreOffice/program/soffice'
        elif os.name == 'posix':
            self.__sysos      = 'Linux'
            self.__serverpath = '/app/halu/HaluServer'
            self.__syspath    = '/app/halu/HaluServer/Halu/System'
            self.__apppath    = '/app/halu/HaluProject/Halu/Application'
            self.__soffice    = '/usr/bin/soffice'


        # -------------------------------------------------------------
        # ログレベルの設定
        # Level = DEBUG      開発者用ログを出力
        #       = INFO       指示・案内等を出力（エラーではない）
        #       = WARNING    想定外のエラーが発生（継続可能）
        #       = ERROR      致命的なエラーが発生
        #       = CRITICAL   プログラムの実行不能なエラー
        # -------------------------------------------------------------
        self.__loglebel  = 'DEBUG'


        # -------------------------------------------------------------
        # Halu アプリケーションサーバのIPアドレス＆ポート番号を設定する
        # -------------------------------------------------------------
        self.__appserver_address = 'localhost'
        self.__appserver_port    = 18800


        # -------------------------------------------------------------
        # Halu プリントサーバのIPアドレス＆ポート番号を設定する
        # -------------------------------------------------------------
        self.__printserver_address = 'localhost'
        self.__printserver_port    = 18810


        # -------------------------------------------------------------
        # Halu バッチサーバのIPアドレス＆ポート番号を設定する
        # -------------------------------------------------------------
        self.__batchserver_address = 'localhost'
        self.__batchserver_port    = 18820


        # --------------------------------------------------------------
        # Rmenu アプリケーションサーバのIPアドレス＆ポート番号を設定する
        # --------------------------------------------------------------
        self.__rmenu_appserver_address = 'localhost'
        self.__rmenu_appserver_port    = 12345


        # -------------------------------------------------------------
        # プロジェクト別 IPアドレスの制限有無
        # -------------------------------------------------------------
        self.__ipaddress_check = {}
        self.__ipaddress_check['Sample']       = 'no'
        self.__ipaddress_check['HaluAssistant']     = 'no'


        # -------------------------------------------------------------
        #   プロジェクト別 データベース定義 開始
        # -------------------------------------------------------------
        self.__def_database = {}

        # Sample DB
        database0             = {}
        database0['dbdriver'] = 'postgresql'
        database0['hostname'] = '127.0.0.1'
        database0['portno']   = '5432'
        database0['database'] = 'sample'
        database0['username'] = 'postgres'
        database0['password'] = 'postgres'
        self.__def_database['sample'] = database0

        # アシスタント DB
        database1             = {}
        database1['dbdriver'] = 'postgresql'
        database1['hostname'] = '127.0.0.1'
        database1['portno']   = '55432'
        database1['database'] = 'haluassistant'
        database1['username'] = 'postgres'
        database1['password'] = 'postgres'
        self.__def_database['haluassistant'] = database1

        # -------------------------------------------------------------
        #   プロジェクト別 データベース定義 終了
        # -------------------------------------------------------------



    # OSの種別
    @property
    def sysos(self):
        return self.__sysos

    # サーバパス
    @property
    def serverpath(self):
        return self.__serverpath

    # システムパス
    @property
    def syspath(self):
        return self.__syspath

    # アプリケーションパス
    @property
    def apppath(self):
        return self.__apppath

    # PDF変換アプリパス
    @property
    def soffice(self):
        return self.__soffice

    # Halu アプリケーションサーバ ＩＰアドレス
    @property
    def appserver_address(self):
        return self.__appserver_address

    # Halu アプリケーションサーバ ポート番号
    @property
    def appserver_port(self):
        return self.__appserver_port

    # Halu プリントサーバ ＩＰアドレス
    @property
    def printserver_address(self):
        return self.__printserver_address

    # Halu プリントサーバ ポート番号
    @property
    def printserver_port(self):
        return self.__printserver_port

    # Halu バッチサーバ ＩＰアドレス
    @property
    def batchserver_address(self):
        return self.__batchserver_address

    # Halu バッチサーバ ポート番号
    @property
    def batchserver_port(self):
        return self.__batchserver_port

    # Rmenu アプリケーションサーバ ＩＰアドレス
    @property
    def rmenu_appserver_address(self):
        return self.__rmenu_appserver_address

    # Rmenu アプリケーションサーバ ポート番号
    @property
    def rmenu_appserver_port(self):
        return self.__rmenu_appserver_port

    # ログレベル
    @property
    def loglebel(self):
        return self.__loglebel

    # プロジェクト別 IPアドレスの制限有無
    @property
    def ipaddress_check(self):
        return self.__ipaddress_check

    # プロジェクト別 データベース定義
    @property
    def def_database(self):
        return self.__def_database



# ---------------------------
#    テスト＆使用法 開始
# ---------------------------
def main():
    print('***  main start  ***\n')

    conf = HaluConf()
    print(f'ＯＳ：{conf.sysos}')
    print(f'サーバパス：{conf.serverpath}')
    print(f'ＳＹＳパス：{conf.syspath}')
    print(f'ＡＰＰパス：{conf.apppath}')
    print(f'ＡＰＰサーバアドレス：{conf.appserver_address}')
    print(f'ＡＰＰサーバポート：{conf.appserver_port}')
    print(f'プリントサーバアドレス：{conf.printserver_address}')
    print(f'プリントサーバポート：{conf.printserver_port}')
    print(f'ログレベル：{conf.loglebel}')
    print(f'Rmenu ＡＰＰサーバアドレス：{conf.rmenu_appserver_address}')
    print(f'Rmenu ＡＰＰサーバポート：{conf.rmenu_appserver_port}')

    projectname = conf.ipaddress_check['Sample']
    print(f'ＩＰアドレスチェック：{projectname}')


    print('\n***  main end  ***')


if __name__ == '__main__':
    main()
