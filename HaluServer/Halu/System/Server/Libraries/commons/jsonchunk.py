# coding: utf-8


"""
使用法

import 方法（getjsonchunkbyidが直接記述できる）
from commons.jsonchunk import getjsonchunkbyid


リクエスト・レスポンスの指定方法
getjsonchunkbyid(jsondict, 'records', 'idname')
getjsonchunkbyid(jsondict, 'records', 'idname', 'record')

SQLの指定方法
getjsonchunkbyid(jsondict, 'sqls', 'idname')
getjsonchunkbyid(jsondict, 'sqls', 'idname', 'input')
getjsonchunkbyid(jsondict, 'sqls', 'idname', 'input', 'record')
getjsonchunkbyid(jsondict, 'sqls', 'idname', 'output')
getjsonchunkbyid(jsondict, 'sqls', 'idname', 'output', 'record')

"""

def getjsonchunkbyid(jsondict, listname, idname, *args):
    # 第２引数が records の時
    if listname == 'records':
        for recordinfo in jsondict['records']:
            # 第３引数がマッチの時
            if recordinfo['id'] == idname:
                # 第４引数の処理
                for other in args:
                    # 第４引数が record の時
                    if other == 'record':
                        return recordinfo['record']

                # 第４引数なしの時（id がマッチ）
                return recordinfo

        # 第３引数アンマッチの時（id が不明）
        return jsondict['records']

    
    # 第２引数が sqls の時
    if listname == 'sqls':
        for recordinfo in jsondict['sqls']:
            # 第３引数がマッチの時
            if recordinfo['id'] == idname:
                recordio = {}
                # 第４・５引数の処理
                for other in args:
                    # 第４引数が input の時
                    if other == 'input':
                        recordio = recordinfo['input']
                    # 第４引数が output の時
                    if other == 'output':
                        recordio = recordinfo['output']
                    if other == 'record':
                        # 第５引数が record の時
                        if len(recordio) > 0:
                            return recordio['record']

                if len(recordio) == 0:
                    # 第３引数まで指定の時（id がマッチ）
                    return recordinfo
                else:
                    # 第４引数まで指定の時（input もしくは output がマッチ）
                    return recordio

        # 第３引数アンマッチの時（id が不明）
        return jsondict['sqls']
    

    # 第２引数アンマッチの時（records,sqls 以外が指定された）
    return jsondict
