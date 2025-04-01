# coding: utf-8

import logging
import logging.handlers

from   halumain.haluconf import HaluConf


class TestLogger:

    def __init__(self, logname):

        # コンフィグをインスタンス
        hconf      = HaluConf()


        # -------------------------------------------------------------
        # ログレベルの設定
        # Level = DEBUG      開発者用ログを出力
        #       = INFO       指示・案内等を出力（エラーではない）
        #       = WARNING    想定外のエラーが発生（継続可能）
        #       = ERROR      致命的なエラーが発生
        #       = CRITICAL   プログラムの実行不能なエラー
        # -------------------------------------------------------------

        # 指定された名前でロガーを取得する
        tlog = logging.getLogger(logname)

        # ロガーにログレベルを登録する
        tlog.setLevel(logging.DEBUG)


        #ログファイルを日別でローテーションするハンドラーを定義
        trh = logging.handlers.TimedRotatingFileHandler(
            filename    = hconf.serverpath + '/HaluTest/test_logs/' + logname + '.log',
            encoding    = 'utf-8',
            when        = 'MIDNIGHT',
            backupCount = 3
        )


        # 日別ハンドラーに出力のフォーマットを登録する
        formatter   = logging.Formatter('%(asctime)s <%(levelname)s> : %(message)s')
        trh.setFormatter(formatter)


        # 日別ハンドラーにログレベルを登録する
        trh.setLevel(logging.DEBUG)
        

        #ロガーに日別ハンドラーを登録する
        tlog.addHandler(trh)


    # ------------------------------------------
    # レベル別　ログ出力メソッド
    # ------------------------------------------
    # DEBUG ログ出力
    def debug(self, logname, msg):
        log = logging.getLogger(logname)
        log.debug(msg)


# ---------------------------
#    テスト＆使用法　開始
# ---------------------------
def main():

    log = TestLogger('database')
    log.debug('database', 'database test start')


    log.debug('database', 'database　デバッグ　ログ')

    
    log.debug('database', 'database test end')


if __name__ == '__main__':
    main()
