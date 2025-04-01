# coding: utf-8

from logger.halulogger                   import HaluLogger
from batchservermodel.batchservermodel   import BatchServerModel

class BatchServerMainModel():
    """
    バッチサーバモデルをインスタンし、callメソッドを実行する
    バッチ管理の関連テーブルを登録し、バッチ処理を起動する
    バッチ終了後、NEXT処理有無の判定を行い
    NEXT処理がない時は終了し、ある時はNEXT処理の～.pyファイルを起動する
    """


    def __init__(self, bmlog, bmlogname, bdlog, bdlogname):
        try:
            self.bmlog     = bmlog
            self.bmlogname = bmlogname
            self.bmlog.debug(self.bmlogname, 'BatchServerMainModel init start')

            self.bdlog     = bdlog
            self.bdlogname = bdlogname


            
        except Exception as e:
            self.bmlog.error(self.bmlogname, f'BatchServerMainModel init exception message : {e}')

        finally:
            self.bmlog.debug(self.bmlogname, 'BatchServerMainModel init end\n')


    def call(self, sqldict):
        self.bmlog.debug(self.bmlogname, 'BatchServerMainModel call start')

        model  = BatchServerModel(self.bmlog, self.bmlogname, self.bdlog, self.bdlogname, sqldict)
        result = model.call()


        self.bmlog.debug(self.bmlogname, f'BatchServerMainModel result : {result}')
        self.bmlog.debug(self.bmlogname,  'BatchServerMainModel call end')
        return result
