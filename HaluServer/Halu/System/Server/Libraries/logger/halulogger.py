# coding: utf-8

import logging
import logging.handlers

from   halumain.haluconf import HaluConf


class HaluLogger:

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
        hlog = logging.getLogger(logname)

        # ロガーにログレベルを登録する
        if hconf.loglebel   == 'DEBUG':
            hlog.setLevel(logging.DEBUG)

        elif hconf.loglebel == 'INFO':
            hlog.setLevel(logging.INFO)

        elif hconf.loglebel == 'WARNING':
            hlog.setLevel(logging.WARNING)

        elif hconf.loglebel == 'ERROR':
            hlog.setLevel(logging.ERROR)

        else:
            hlog.setLevel(logging.CRITICAL)


        #ログファイルを日別でローテーションするハンドラーを定義
        trh = logging.handlers.TimedRotatingFileHandler(
            filename    = hconf.syspath + '/Server/Logs/' + logname + '.log',
            encoding    = 'utf-8',
            when        = 'MIDNIGHT',
            backupCount = 3
        )

        # 日別ハンドラーに出力のフォーマットを登録する
        formatter   = logging.Formatter('%(asctime)s <%(levelname)s> : %(message)s')
        trh.setFormatter(formatter)

        # 日別ハンドラーにログレベルを登録する
        if hconf.loglebel   == 'DEBUG':
            trh.setLevel(logging.DEBUG)

        elif hconf.loglebel == 'INFO':
            trh.setLevel(logging.INFO)

        elif hconf.loglebel == 'WARNING':
            trh.setLevel(logging.WARNING)

        elif hconf.loglebel == 'ERROR':
            trh.setLevel(logging.ERROR)

        else:
            trh.setLevel(logging.CRITICAL)

        #ロガーに日別ハンドラーを登録する
        hlog.addHandler(trh)


    # ------------------------------------------
    # レベル別 ログ出力メソッド
    # ------------------------------------------
    # DEBUG ログ出力
    def debug(self, logname, msg):
        log = logging.getLogger(logname)
        log.debug(msg)

    # INFO ログ出力
    def info(self, logname, msg):
        log = logging.getLogger(logname)
        log.info(msg)

    # WARNING ログ出力
    def warning(self, logname, msg):
        log = logging.getLogger(logname)
        log.warning(msg)

    # ERROR ログ出力
    def error(self, logname, msg):
        log = logging.getLogger(logname)
        log.error(msg)

    # CRITICAL ログ出力
    def critical(self, logname, msg):
        log = logging.getLogger(logname)
        log.critical(msg)



# ---------------------------
#    テスト＆使用法 開始
# ---------------------------
def main():
    print('***  main start  ***\n')


    log = HaluLogger('controller')
    log.debug('controller', 'コントローラ デバッグ ログ')
    log.error('controller', 'コントローラ エラー ログ')

    log = HaluLogger('model')
    log.debug('model', 'モデル DEBUG ログ')
    log.info('model', 'モデル INFO ログ')
    log.warning('model', 'モデル WARNING ログ')
    log.error('model', 'モデル ERROR ログ')
    log.critical('model', 'モデル CRITICAL ログ')

    log = HaluLogger('modeldb')
    log.debug('modeldb', 'モデルDB デバッグ ログ')
    log.error('modeldb', 'モデルDB エラー ログ')

    log = HaluLogger('view')
    log.debug('view', 'ビュー デバッグ ログ')
    log.error('view', 'ビュー エラー ログ')


    print('\n***  main end  ***')


if __name__ == '__main__':
    main()
