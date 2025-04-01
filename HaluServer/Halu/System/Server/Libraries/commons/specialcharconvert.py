# coding: utf-8


class SpecialCharConvert():
    """
    特殊文字（', ", ?, \）を変換/ 変換した特殊文字をもとに戻す
    """
    def editRequestDataToSpecialChar(self,requestdict):
        """
        リクエストデータの特殊文字を変換する

        Parameters
        ----------
        requestdict : dict
            HaluController から受け取ったリクエストデータ
            0.tran.jsonの"request": {}を受け取る
            1."records": [{}を探す
            2."record": {}を探す
            3."ログインＩＤ":{"value": [""] }を探す
            4.{"value": [""] }の[""]をvarにする
            5.varが文字列なら置き換える

        Returns
        -------
        requestdict : dict
            特殊文字を変換済のリクエストデータ
        """
        if 'records' in requestdict:
            for request_record in requestdict['records']:
                for value in request_record['record'].values():
                    idx = 0
                    for var in value['value']:
                        if isinstance(var, str):
                            str_var1 = var.replace('\'', '’’')
                            str_var2 = str_var1.replace('\"', '””')
                            str_var3 = str_var2.replace('?', '？？')
                            str_var4 = str_var3.replace('\\' ,'￥￥')
                            value['value'][idx] = str_var4
                        idx = idx + 1

        return requestdict


    def editSqlDataToNormalChar(self,before_string):
        """
        バインド変数置換後の文字列の特殊文字を元に戻す

        Parameters
        ----------
        before_string: str
            SQL文字列(createSQLメソッドの戻り値)

        Returns
        -------
        after_string4: str
            特殊文字を変換済のSQL文字列
        """

        after_string1 = before_string.replace('’’' ,'\'')
        after_string2 = after_string1.replace('””' ,'\"')
        after_string3 = after_string2.replace('？？' ,'?')
        after_string4 = after_string3.replace('￥￥' ,'\\')

        return after_string4
