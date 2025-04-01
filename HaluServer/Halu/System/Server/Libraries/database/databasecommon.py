# coding: utf-8


class DatabaseCommon():
    """
    SQLデータからSQL文字列を作成する

    Attributes
    ----------
    sql_info : dict
        SQLデータの中の'sqls' の1要素 -> sqldict['sqls'][i]
    """
    def __init__(self, dlog, dlogname, sql_info):
        self.dlog     = dlog
        self.dlogname = dlogname

        # インスタンス変数を設定
        self.sql_info = sql_info


    def createSql(self):
        """
        SQL文を作成する

        Returns
        -------
        str_sql : str
            SQL文
        """
        try:
            sql_source = self.sql_info['sql']
            str_sql = ''
            if 'freesql' in sql_source:
                if sql_source['freesql'] != '':
                    str_sql = self.createFreeSql()
                    return str_sql

            if sql_source['type'] == 'insert':
                str_sql = self.createInsertSql()
            elif sql_source['type'] == 'update':
                str_sql = self.createUpdateSql()
            elif sql_source['type'] == 'delete':
                str_sql = self.createDeleteSql()
            else:
                str_sql = self.createSelectSql()

            return str_sql

        except Exception as e:
            self.dlog.error(self.dlogname, f'DatabaseCommon createSql exception message : {e}')


    def createInsertSql(self):
        """
        INSERT文の作成
        """
        try:
            sql_source = self.sql_info['sql']
            input_record = self.sql_info['input']['record']

            # テーブル名の設定
            temp = sql_source['genesql']['from']
            if isinstance(temp, list):
                table_name = temp[0]
            else:
                table_name = temp
            
            str_sql1 = f'INSERT INTO {table_name}'

            # 列名・値の設定
            str_sql2 = ' ('
            str_sql3 = ' VALUES ('
            for name, value in input_record.items():
                if 'field' in value:
                    str_sql2 += value['field'] + ', '
                else:
                    str_sql2 += name + ', '
                # 値の設定
                str_sql3 += self.getFunctStr(value)

            str_sql2 = str_sql2.rstrip(', ') + ')'
            str_sql3 = str_sql3.rstrip(', ') + ')'

            return str_sql1 + str_sql2 + str_sql3

        except Exception as e:
            self.dlog.error(self.dlogname, f'DatabaseCommon createInsertSql exception message : {e}')


    def createUpdateSql(self):
        """
        UPDATE文の作成
        """
        try:
            sql_source = self.sql_info['sql']
            input_record = self.sql_info['input']['record']

            # テーブル名の設定
            temp = sql_source['genesql']['from']
            if isinstance(temp, list):
                table_name = temp[0]
            else:
                table_name = temp
            
            str_sql1 = f'UPDATE {table_name} SET '

            # 列名・値の設定回数を計算する
            str_where = sql_source['genesql']['where']
            matched_count = str_where.count('?')
            data_count = len(input_record) - matched_count

            # 列名・値の設定
            str_sql2 = ''
            count = 0
            for name, value in input_record.items():
                count += 1
                if count > data_count:
                    break

                if 'field' in value:
                    str_sql2 += value['field'] + '='
                    str_sql2 += self.getFunctStr(value)
                else:
                    str_name = ' ' + name + ' '
                    if str_name not in str_where:
                        str_sql2 += name + '='
                        str_sql2  += self.getFunctStr(value)

            # WHERE句の設定
            str_sql3 = ' WHERE ' + str_where
            str_sql2 = str_sql2.rstrip(', ')

            return str_sql1 + str_sql2 + str_sql3

        except Exception as e:
            self.dlog.error(self.dlogname, f'DatabaseCommon createUpdateSql exception message : {e}')


    def createDeleteSql(self):
        """
        DELETE文の作成
        """
        try:
            sql_source = self.sql_info['sql']

            # テーブル名の設定
            temp = sql_source['genesql']['from']
            if isinstance(temp, list):
                table_name = temp[0]
            else:
                table_name = temp
            
            str_sql1 = f'DELETE FROM {table_name}'

            # WHERE句の設定
            str_sql2 = ' WHERE ' + sql_source['genesql']['where']

            return str_sql1 + str_sql2

        except Exception as e:
            self.dlog.error(self.dlogname, f'DatabaseCommon createDeleteSql exception message : {e}')


    def createSelectSql(self):
        """
        SELECT文の作成
        """
        try:
            sql_source = self.sql_info['sql']
            output_record = self.sql_info['output']['record']

            # DISTINCTの設定
            str_sql1 = 'SELECT '
            if 'dist' in sql_source['genesql']:
                if sql_source['genesql']['dist'] == 'yes':
                    str_sql1    += 'DISTINCT '

            # 列名の設定
            for name, value in output_record.items():
                if 'funct' in value:
                    if value['funct'] == '':
                        str_sql1 += self.getFunctStr(value)
                    else:
                        str_sql1 += value['funct'] + ' AS ' + name + ','
                else:
                    str_sql1 += self.getFieldStr(name, value)
            str_sql1 = str_sql1.rstrip(', ')

            # テーブル名の設定
            temp = sql_source['genesql']['from']
            if isinstance(temp, list):
                table_name = ' '.join(temp)
            else:
                table_name = temp

            if table_name != '':
                str_sql2 = ' FROM ' + table_name
            else:
                str_sql2 = ''

            # WHERE句の設定
            if 'where' in sql_source['genesql']:
                if sql_source['genesql']['where'] == '':
                    str_sql3 = ''
                else:
                    str_sql3 = ' WHERE ' + sql_source['genesql']['where']
            else:
                str_sql3 = ''

            # ORDER句の設定
            if 'order' in sql_source['genesql']:
                if sql_source['genesql']['order'] == '':
                    str_sql4 = ''
                else:
                    str_sql4 = ' ORDER BY ' + sql_source['genesql']['order']
            else:
                str_sql4 = ''

            # LIMIT句の設定
            if 'limit' in sql_source['genesql']:
                if sql_source['genesql']['limit'] == '':
                    str_sql5 = ''
                else:
                    str_sql5 = ' LIMIT ' + sql_source['genesql']['limit']
            else:
                str_sql5 = ''

            return str_sql1 + str_sql2 + str_sql3 + str_sql4 + str_sql5

        except Exception as e:
            self.dlog.error(self.dlogname, f'DatabaseCommon createSelectSql exception message : {e}')


    def createFreeSql(self):
        """
        ＳＱＬ文生成（freesql）
        """
        try:
            temp = self.sql_info['sql']['freesql']
            if isinstance(temp, list):
                str_sql = ' '.join(temp)
            else:
                str_sql = temp

            return str_sql

        except Exception as e:
            self.dlog.error(self.dlogname, f'DatabaseCommon createFreeSql exception message : {e}')


    def getFunctStr(self, value):
        """
        INSERT文のVALUES文字設定
        UPDATE文の列？文字設定
        """
        func_str = ''
        if 'funct' in value:
            if value['funct'] == '':
                func_str = '?, '
            else:
                func_str = value['funct'] + ', '
        else:
            func_str = '?, '

        return func_str

    def getFieldStr(self, name, value):
        """
        SELECT文の列名文字設定
        """
        field_str = ''
        if 'table' in value:
            if value['table'] != '':
                field_str = value['table'] + '.'

        if 'field' in value:
            if value['field'] == '':
                field_str += name + ', '
            else:
                field_str += value['field'] + ' AS ' + name + ', '
        else:
            field_str += name + ', '

        return field_str


    def getMaxLine(self):
        """
        値配列の最大行取得
        """
        max_line = 0
        record = self.sql_info['input']['record']

        if self.sql_info['input']['multiline'] == 'no':
            max_line = 1
        else:
            for name, value in record.items():
                size = len(value['value'])
                if size > max_line:
                    max_line = size

        return max_line

    def replaceSql(self, str_sql, input_record, idx):
        """
        バインド変数の値をSQL文に設定する

        Parameters
        ----------
        str_sql : str
            バインド変数置換前のSQL文字列
        input_record : dict
            sql.json 内のinput レコード -> sql_info['input']['record']
        idx : int
            value 配列のインデックス

        Returns
        -------
        str_sql : str
            バインド変数置換後のSQL文字列
        """
        for name, value in input_record.items():
            if 'funct' in value:
                if value['funct'] != '':
                    if '?' not in value['funct']:
                        continue

            value_length = len(value['value']) - 1
            if idx <= value_length:
                str_value = value['value'][idx]
            else:
                str_value = value['value'][0]

            if 'empty' in value:
                str_empty = value['empty']
                if str_empty != '' and str_value == '':
                    str_sql = str_sql.replace('?', str_empty, 1)
                    continue

            if 'fieldtype' in value:
                fieldtype = value['fieldtype']
                # (char)
                # 埋め込み値が Nil の場合 : NULL を ? へ埋め込む
                # 埋め込み値が "" の場合  : NULL を ? へ埋め込む
                # 上記以外の場合          : 埋め込み値前後に ' を付与して ? へ埋め込む
                if fieldtype == 'char':
                    if str_value is None or str_value == '':
                        str_null = 'NULL'
                        str_sql = str_sql.replace('?', str_null, 1)
                    else:
                        str_value = "\'" + str_value + "\'"
                        str_sql = str_sql.replace('?', str_value, 1)
                    continue

                # (doublequote)
                # 埋め込み値が Nil の場合 : NULL を ? へ埋め込む
                # 埋め込み値が "" の場合  : NULL を ? へ埋め込む
                # 上記以外の場合          : 埋め込み値の ' を \'\' に変換
                #                           更に前後に ' を付与して ? へ埋め込む
                if fieldtype == 'doublequote':
                    if str_value is None or str_value == '':
                        str_null = 'NULL'
                        str_sql = str_sql.replace('?', str_null, 1)
                    else:
                        str_value = str_value.replace("\'", "\'\'")
                        str_value = "\'" + str_value + "\'"
                        str_sql = str_sql.replace('?', str_value, 1)
                    continue

                # (noquote)
                # 埋め込み値が Nil の場合 : NULL を ? へ埋め込む
                # 埋め込み値が "" の場合  : NULL を ? へ埋め込む
                # 上記以外の場合          : 埋め込み値をそのまま ? へ埋め込む
                if fieldtype == 'noquote':
                    if str_value is None or str_value == '':
                        str_null = 'NULL'
                        str_sql = str_sql.replace('?', str_null, 1)
                    else:
                        str_sql = str_sql.replace('?', str_value, 1)
                    continue

                # (num)
                # 埋め込み値が Nil の場合 : NULL を ? へ埋め込む
                # 埋め込み値が "" の場合  : NULL を ? へ埋め込む
                # 上記以外の場合          : 埋め込み値をそのまま埋め込む
                if fieldtype == 'num':
                    if str_value is None or str_value == '':
                        str_null = 'NULL'
                        str_sql = str_sql.replace('?', str_null, 1)
                    else:
                        str_sql = str_sql.replace('?', str(str_value), 1)
                    continue

                if fieldtype == 'like':
                    str_sql = str_sql.replace('?', str_value, 1)
                    continue

            if isinstance(str_value, (int, float)):
                str_sql = str_sql.replace('?', str(str_value), 1)
            else:
                if str_value is None or str_value == '':
                    str_null = 'NULL'
                    str_sql = str_sql.replace('?', str_null, 1)
                else:
                    str_value = "\'" + str_value + "\'"
                    str_sql = str_sql.replace('?', str_value, 1)

        return str_sql
