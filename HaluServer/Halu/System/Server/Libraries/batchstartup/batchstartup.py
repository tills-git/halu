# coding: utf-8

import json

from commons.jsoncache          import JsonCache
from commons.jsonchunk          import getjsonchunkbyid
from logger.halulogger          import HaluLogger
from model.mainmodel            import MainModel
from view.mainview              import MainView
from batchstartup.batchstartupmaincontroller import BatchStartupMainController

class BatchStartup():
    """
    起動元：モデル内でbatchstartup/batchexecute.pyが実行されると、
            BatchStartupDaily_～.py や BatchStartupMonthly_～.py が起動され
            当該クラスがインスタンス・コールされる

    呼び出し元：
    仮引数：file_path    : 入力トランザクションjsonのファイルパス
            output_path : 出力ファイルのファイルパス
    戻り値：output_path へ responsedict を出力する
    """

    def __init__(self, file_path, output_path):
        self.blog     = HaluLogger('batch/batchstartup')
        self.blogname = 'batch/batchstartup'
        self.blog.debug(self.blogname, 'batchstartup init start')

        # MVCをインスタンスする
        mlog                 = HaluLogger('batch/batchstartupmodel')
        mlogname             = 'batch/batchstartupmodel'
        dlog                 = HaluLogger('batch/batchstartupdatabase')
        dlogname             = 'batch/batchstartupdatabase'
        self.main_model      = MainModel(mlog, mlogname, dlog, dlogname)

        vlog                 = HaluLogger('batch/batchstartupview')
        vlogname             = 'batch/batchstartupview'
        self.main_view       = MainView(vlog, vlogname)

        clog                 = HaluLogger('batch/batchstartupcontroller')
        clogname             = 'batch/batchstartupcontroller'
        self.main_controller = BatchStartupMainController(clog, clogname, self.main_model, self.main_view)

        # バッチ用トランザクションのパスと起動結果情報のテキストファイルパス
        self.tran_filepath   = file_path
        self.output_filepath = output_path

        self.blog.debug(self.blogname, 'batchstartup init end\n')


    def call(self, args):
        try:
            self.blog.debug(self.blogname, f'batchstartup    start :')
            self.blog.debug(self.blogname, f'batchstartup filepath : {self.tran_filepath}')
            self.blog.debug(self.blogname, f'batchstartup     args : {args}')
    
            # トランザクションJSONを読み込み、オブジェクトに変換する
            json_cache = JsonCache(self.blog, self.blogname, 'tran.json')
            str_tran   = json_cache.getFileData(self.tran_filepath)
            trandict   = json.loads(str_tran)

            # リクエストデータを取得する
            requestdict = trandict['request']
            self.blog.debug(self.blogname, f'batchstartup requestdict init : {requestdict}')


            # id='batchStartup'のレコード項目の内容（バッチ用パラメータ項目）がアーギュメントとして設定されている
            param_dict = {}
            if len(args) > 1:
                max_count = len(args)
                for i in range(max_count):
                    if i == 0:
                        continue

                    w_list = args[i].split(':')
                    if w_list[0] != "":
                        key = w_list[0]
                        param_dict[key] = w_list[1]

            self.blog.debug(self.blogname, f'batchstartup  param_dict : {param_dict}')

            # パラメータが空でない時、requestdictにバッチパラメータを設定する
            if param_dict:
                param_record = getjsonchunkbyid(requestdict, 'records', 'batchParam', 'record')
                for key, value in param_dict.items():
                    if key in param_record.keys():
                        param_record[key]["value"][0] = value

    
            # メインコントローラをコールする
            self.blog.debug(self.blogname, f'batchstartup requestdict start : {requestdict}')
            responsedict    = self.main_controller.call(requestdict)
    
            # レスポンスデータを出力する
            with open(self.output_filepath, 'w', encoding='UTF-8') as f:
                json.dump(responsedict, f, indent=2, ensure_ascii=False)
                
        except Exception as e:
            self.blog.error(self.blogname, f'batchstartup abnormal message : {e}')

        finally:
            self.blog.debug(self.blogname, f'batchstartup end\n')
