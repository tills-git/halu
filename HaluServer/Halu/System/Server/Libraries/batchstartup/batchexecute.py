# coding: utf-8

import json
import subprocess

from halumain.haluconf import HaluConf

class BatchExecute():
    """
    バッチ起動用ファイルをPythonから起動する。
    ModelクラスのfromRequestToSqlメソッド内から呼び出される

    Attributes
    ----------
    log : clog
    """
    def __init__(self, clog, clogname):
        try:
            self.clog     = clog
            self.clogname = clogname
            self.clog.debug(self.clogname, 'BatchExecute init start')


        except Exception as e:
            self.clog.error(self.clogname, f'BatchExecute init exception message : {e}')

        finally:
            self.clog.debug(self.clogname, 'BatchExecute init end')




    def call(self, sql_info, sqldict):
        """
        ModelクラスのfromRequestToSqlメソッド内で
        id='batchStartup'が見つかるとBatchExecuteがインスタンスされ実行される

        Parameters
        ----------
        sql_info : dict バッチ処理名/バッチロードパス名の項目が設定されている
        sqldict  : dict sql.json（id="batchParam"にはバッチ用パラメータ項目が設定されている）

        Returns
        -------
        sqldict : dict バッチ起動結果（バッチが正常に起動されたかどうかの結果）
        """
        try:
            self.clog.debug(self.clogname, 'BatchExecute: call start')


            # バッチ起動用ロードパスを設定する
            conf        = HaluConf()
            w_batchname = sql_info["input"]["record"]["バッチ処理名"]["value"][0]
            w_passname  = conf.apppath + '/' + sql_info["input"]["record"]["バッチロードパス名"]["value"][0]

            # バッチ用パラメータがある時、アーギュメントとして設定する
            arg_str = ""
            for param_info in sqldict['sqls']:
                if param_info['id'] == 'batchParam':
                    for key, value in param_info["input"]["record"].items():
                        arg_str = arg_str + key + ":" + value["value"][0] + " "
                    break
            
            # バッチ起動コマンドを設定する
            if arg_str == "":
                w_command  = "python " +  w_passname
            else:
                w_command  = "python " +  w_passname + ' ' + arg_str

            # バッチ起動
            self.clog.debug(self.clogname, f'BatchExecute バッチ処理名      : {w_batchname}')
            self.clog.debug(self.clogname, f'BatchExecute バッチロードパス名 : {w_passname}')
            self.clog.debug(self.clogname, f'BatchExecute バッチパラメータ   : {arg_str}')
            subprocess.Popen(w_command)

            # sql.jsonのリターン値を設定する
            sqldict['message']['status'] = 'OK'
            sqldict['message']['msg']    = 'バッチ処理を起動しました。'
            return sqldict

        except Exception as e:
            self.clog.error(self.clogname, f'BatchExecute call exception message : {e}')
            sqldict['message']['status'] = 'ERROR'
            sqldict['message']['msg'] = e
            return sqldict

        finally:
            self.clog.debug(self.clogname, 'BatchExecute: call end')


    def call_next(self, next_info):
        """
        メイン処理（batchservermodel/batchservermodel.py の終了処理から呼び出される）
        最初のバッチが終了したとき、次に実行するバッチが指定されているかを判定し、
        次のバッチが指定されている時、呼び出される。

        Parameters
        ----------
        next_info : dict 次のバッチ処理名とロードパス名が設定されている

        Returns
        -------
        sqldict : dict
            SQL実行後のSQLデータ
        """
        try:
            self.clog.debug(self.clogname, 'BatchExecute: call_next start')

            # バッチ起動処理
            conf        = HaluConf()
            w_batchname = next_info["ＮＥＸＴ処理名"]
            w_passname  = conf.apppath + next_info["ＮＥＸＴロードパス名"]

            self.clog.debug(self.clogname, f'NEXT バッチ処理名 : {w_batchname}')
            self.clog.debug(self.clogname, f'NEXT バッチロードパス名 : {w_passname}')

            w_command  = "python " +  w_passname
            subprocess.Popen(w_command)

            return "OK"

        except Exception as e:
            self.clog.error(self.clogname, f'BatchExecute call_next exception message : {e}')
            return "ERROR"

        finally:
            self.clog.debug(self.clogname, 'BatchExecute: call end')
