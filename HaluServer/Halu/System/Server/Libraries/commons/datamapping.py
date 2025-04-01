# coding: utf-8


class DataMapping():
    """
    項目移送を行う。
    tran.json/ sql.json で'fromtype' が設定されている項目のvalue データを編集する。
    """
    def fromRequestEditValue(self, value, requestdict):
        """
        tran.json/ sql.json で'fromtype' が'request' の項目が対象。
        リクエストデータの指定id の値をvalueデータに移送する。

        Parameters
        ----------
        value : dict.value
            sql_info['input']['record']['value']/ response_record['value']
        requestdict : dict(json)
        """
        for request_info in requestdict['records']:
            if value['fromid'] != request_info['id']:
                continue

            fromname = value['fromname']
            if fromname in request_info['record']:
                value['value'] = request_info['record'][fromname]['value']

        return


    def fromSqlInputEditValue(self, value, sqldict):
        """
        tran.json/ sql.json で'fromtype' が'sqls' かつ 'fromio' が'input'の項目が対象。
        SQLデータの指定id の入力データの値をvalueデータに移送する。

        Parameters
        ----------
        value : dict.value
            sql_info['input']['record']['value']/ response_record['value']
        sqldict : dict(json)
        """
        for sql_info in sqldict['sqls']:
            if value['fromid'] != sql_info['id']:
                continue

            fromname = value['fromname']
            if fromname in sql_info['input']['record']:
                value['value'] = sql_info['input']['record'][fromname]['value']

        return


    def fromSqlOutputEditValue(self, value, sqldict):
        """
        tran.json/ sql.json で'fromtype' が'sqls' かつ 'fromio' が'output'の項目が対象。
        SQLデータの指定id の出力データの値をvalueデータに移送する。

        Parameters
        ----------
        value : dict.value
            sql_info['input']['record']['value']/ response_record['value']
        sqldict : dict(json)
        """
        for sql_info in sqldict['sqls']:
            if value['fromid'] != sql_info['id']:
                continue

            fromname = value['fromname']
            if fromname in sql_info['output']['record']:
                value['value'] = sql_info['output']['record'][fromname]['value']

        return
