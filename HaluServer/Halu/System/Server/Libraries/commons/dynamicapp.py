# coding: utf-8


class DynamicApp():
    """
    before after メソッドを動的に実行する。
    """
    def doBeforeAfterMethod(self, method_type, record_info, temp_object):
        """
        json に指定されているbefore/ after メソッドを実行する。

        Parameters
        ----------
        method_type : str
            メソッドの種類('before'/ 'after')
        record_info : dict
            requestdict['records']/ sqldict['sqls']/ responsedict['records']
        temp_object : object
            メソッド実行オブジェクト。AppCache クラスでインスタンスされる。

        Returns
        -------
        result : str
            メソッド実行結果('OK'/ 'ERROR')
        """
        # before after メソッドが指定されているかチェック
        # 指定がない場合はリターン
        if method_type not in record_info:
            return 'OK'
        methods = record_info[method_type]
        if methods == '':
            return 'OK'

        result = 'OK'
        # メソッドが単一記述の場合
        if isinstance(methods, str):
            method_name, arg = self.splitMethodStr(methods)
            result = self.doMethod(temp_object, method_name, arg)
        # メソッドが配列記述の場合
        elif isinstance(methods, list):
            for method in methods:
                if method == '':
                    continue
                method_name, arg = self.splitMethodStr(method)
                result = self.doMethod(temp_object, method_name, arg)
                if result != 'OK':
                    break

        return result


    def splitMethodStr(self, method_str):
        """
        json に記載されているメソッドの文字列からメソッド名(method_name)と引数(arg)を取得する。
        例）'setSql_InitOfTest(arg1, arg2)'
            -> method_name = 'setSql_InitOfTest'
               arg         = ['arg1', 'arg2']

        Parameters
        ----------
        method_str : str
            メソッドの文字列 -> record_info[method_type]

        Returns
        -------
        method_name : str
            メソッド名
        arg : list
            引数
        """
        split_str = method_str.split('(')
        method_name = split_str[0]
        arg = [x.strip('\') ') for x in split_str[1].split(',')]
        if arg[0] == '':
            arg = []

        return method_name, arg


    def doMethod(self, obj, method_name, arg):
        """
        getattr でメソッドを実行する。

        Parameters
        ----------
        obj : object
            メソッド実行オブジェクト。
        method_name : str
            実行するメソッド名。
        arg : list
            引数。

        Returns
        -------
        result : str
            メソッド実行結果('OK'/ 'ERROR')
        """
        result = getattr(obj, method_name)(*arg)
        return result
