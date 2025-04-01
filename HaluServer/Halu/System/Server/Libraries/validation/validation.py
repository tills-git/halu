# coding: utf-8

import re
import datetime

class Validation():
    """
    リクエストレコードから項目を取りだし
    validation.jsonを読み込んで入力値チェックを行う
    """


    def __init__(self, clog, clogname, requestdict):
        self.clog     = clog
        self.clogname = clogname
        self.requestdict = requestdict

    def checkRecordItem(self, record, validation_record):
        """
        リクエストレコードから項目を取りだし、チェックを行う
            1.バリデーション チェック
            2.最少桁数 チェック
            3.最大桁数 チェック
            4.最少バイト数 チェック
            5.最大バイト数 チェック
        """
        self.clog.debug(self.clogname, 'Validation: バリデーション チェック スタート')
        self.clog.debug(self.clogname, f'Validation: requestdict    : {record}')
        self.clog.debug(self.clogname, f'Validation: validationdict : {validation_record}')
        
        for key, value in record.items():
            # validation_record に存在するキーに対して処理を行う
            if key in validation_record:
                valid_info = validation_record[key]

                validation_list = valid_info.get('validation', [])

                # バリデーションのチェックを行う
                for validation_method in validation_list:
                    if validation_method == '':
                        continue
                    
                    # バリデーションメソッドを呼び出す
                    method_name = f'halu_{validation_method}'
                    method = getattr(self, method_name)

                    # バリデーションを実行
                    for record_value in value['value']:
                        result = method(record_value, key)

                        self.clog.debug(self.clogname, f'Validation: item:{key} {method_name} value:{record_value} result:{result}')

                        if result != 'OK':
                            self.clog.debug(self.clogname, 'Validation: バリデーション チェック エンド result : ERROR')
                            return 'ERROR'

             # 最少桁数 チェック
                if 'min' in valid_info:
                    minsize  = int(valid_info['min'])

                    for record_value in value['value']:
                        result = self.halu_min(minsize, record_value, key)

                        self.clog.debug(self.clogname, f'Validation: item:{key} Min check:{minsize} value:{record_value} result:{result}')
                        
                        if result != 'OK':
                            self.clog.debug(self.clogname, 'Validation: バリデーション チェック エンド result : ERROR')
                            return 'ERROR'

             # 最大桁数 チェック
                if 'max' in valid_info:
                    maxsize  = int(valid_info['max'])

                    for record_value in value['value']:

                        result = self.halu_max(maxsize, record_value, key)

                        self.clog.debug(self.clogname, f'Validation: item:{key} MAX check:{maxsize} value:{record_value} result:{result}')
                        
                        if result != 'OK':
                            self.clog.debug(self.clogname, 'Validation: バリデーション チェック エンド result : ERROR')
                            return 'ERROR'


             # 最少バイト数 チェック
                if 'minbyte' in valid_info:
                    minsize  = int(valid_info['minbyte'])

                    for record_value in value['value']:

                        result = self.halu_minbyte(minsize, record_value, key)

                        self.clog.debug(self.clogname, f'Validation: item:{key} MinByte check:{minsize} value:{record_value} result:{result}')
                        
                        if result != 'OK':
                            self.clog.debug(self.clogname, 'Validation: バリデーション チェック エンド result : ERROR')
                            return 'ERROR'


             # 最大バイト数 チェック
                if 'maxbyte' in valid_info:
                    maxsize  = int(valid_info['max'])

                    for record_value in value['value']:
                        result = self.halu_maxbyte(maxsize, record_value, key)

                        self.clog.debug(self.clogname, f'Validation: item:{key} MaxByte check:{maxsize} value:{record_value} result:{result}')
                        
                        if result != 'OK':
                            self.clog.debug(self.clogname, 'Validation: バリデーション チェック エンド result : ERROR')
                            return 'ERROR'

        self.clog.debug(self.clogname, 'Validation: バリデーション チェック エンド result : OK')
        return 'OK'


    def halu_required(self, value, name):
        """
        必須チェック
        Parameters
        ----------
        value : 
        name : 

        Returns
        -------
        result : str
        空の時はエラーメッセージを返す
        空じゃない時はOKを返す

        """

        if value == '':
            result = self.valid_error(f'{name} :入力必須項目です。省略できません。')
        else :
            result = 'OK'
            
        return result

    def halu_nonrequired(self, value, name):
        """
        省略可チェック
        なし
        """

        result = 'OK'
        return result

    def halu_free(self, value, name):
        """
        free チェック
        なし
        """

        result = 'OK'
        return result

    def halu_integerP(self, value, name):
        """
        数字（整数）チェック
        """
        if value == '':
            result = 'OK'
        elif isinstance(value, int):
            result = 'OK'
        elif value.isdigit():
            result = 'OK'
        else:
            result = self.valid_error(f'{name} :数字以外の文字。')

        return result

    def halu_integer(self, value, name):
        """
        符号付き（省略可）数字（整数）チェック
        """
        pattern = re.compile(r'[+-]?[0-9]+')

#        value = value.strip()   　必要？理由は「符号付き小数チェック」に記述

        if value == '':
            result = 'OK'
        elif pattern.fullmatch(value):
            result = 'OK'
        else:
            result = self.valid_error(f'{name} :符号・数字以外の文字。')

        return result

    def halu_decimals(self, value, name):
        """
        小数チェック
        """

        pattern = re.compile(r'\d+(\.\d+)?$')
        
        if value == '':
            result = 'OK'
        elif pattern.fullmatch(value):
         result = 'OK'
        else :
            result = self.valid_error(f'{name} :小数の入力が間違っています。')

        return result

    def halu_decimalS(self, value, name):
        """
        符号付き小数チェック
        """

#        ↑と合わせる:

        value = value.strip()   #+1.5でエラーになったため、意図せずエスケープ文字や不正な形式で渡されている可能性を削除

        pattern = re.compile(r'^[+-]?\d+(\.\d+)?$')
        if value == '':
            result = 'OK'
        elif pattern.fullmatch(value):
         result = 'OK'
        else :
            result = self.valid_error(f'{name} :小数字と小数点、符号以外の文字が入力されています。')

        return result

    def halu_alphabet(self, value, name):
        """
        アルファベット（大文字・小文字）チェック
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'^[a-zA-Z]+$')

        if pattern.fullmatch(value):
            result = 'OK'
        else:
            result = self.valid_error(f'{name} :アルファベット（大文字・小文字）以外の文字が入力されています。')

        return result

    def halu_alphabetS(self, value, name):
        """
        アルファベット（小文字）チェック
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'^[a-z]+$')

        if pattern.fullmatch(value):
            result = 'OK'
        else:
            result = self.valid_error(f'{name} :アルファベット（小文字）以外の文字が入力されています。')

        return result

    def halu_alphabetB(self, value, name):
        """
        アルファベット（大文字）チェック
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'^[A-Z]+$')

        if pattern.fullmatch(value):
            result = 'OK'
        else:
            result = self.valid_error(f'{name} :アルファベット（大文字）以外の文字が入力されています。')

        return result

    def halu_alphanum(self, value, name):
        """
        英数字チェック1
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'[a-zA-Z0-9]+$')

        if pattern.fullmatch(value):
            result = 'OK'
        else:
            result = self.valid_error(f'{name} :英数字以外の文字が入力されています。')

        return result

    def halu_alphanumspace(self, value, name):
        """
        英数字チェック2(半角スペース)
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'[a-zA-Z0-9 ]+$')

        if pattern.fullmatch(value):
            result = 'OK'
        else:
            result = self.valid_error(f'{name} :英数字、スペース以外の文字が入力されています。')

        return result

    def halu_alphanumS(self, value, name):
        """
        英数字（0～9と小文字）チェック
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'[a-z0-9]+$')

        if pattern.fullmatch(value):
            result = 'OK'
        else:
            result = self.valid_error(f'{name} :英数字（0～9と小文字）以外の文字が入力されています。')

        return result

    def halu_alphanumB(self, value, name):
        """
        英数字（0～9と大文字）チェック
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'[A-Z0-9]+$')

        if pattern.fullmatch(value):
            result = 'OK'
        else:
            result = self.valid_error(f'{name} :英数字（0～9と大文字）以外の文字が入力されています。')

        return result

    def halu_hiragana(self, value, name):
        """
        ひらがな チェック(ー、全角スペース含む、)
        、。・は含まない。
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'^[ぁ-んー　]+$')

        if pattern.fullmatch(value):
            result = 'OK'
        else:
            result = self.valid_error(f'{name} :ひらがな以外の文字が入力されています。')

        return result

    def halu_katakana(self, value, name):
        """
        カタカナ チェック(、。ー・含む、ヵヶ含まない)
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'^[ァ-ヴー、。ー・　]+$')

        if pattern.fullmatch(value):
            result = 'OK'
        else:
            result = self.valid_error(f'{name} :カタカナ以外の文字が入力されています。')

        return result

    def halu_katakanaH(self, value, name):
        """
        半角カタカナ チェック1
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'^[ｦ-ﾟ ]+$')

        if pattern.fullmatch(value):
            result = 'OK'
        else:
            result = self.valid_error(f'{name} :半角カタカナ以外の文字が入力されています。')

        return result

    def halu_halfchar(self, value, name):
        """
        半角 チェック
        半角カタカナ+ASCII文字
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'[ｦ-ﾟ ･､｡\x20-\x7E｢｣]+$')

        if pattern.fullmatch(value):
            result = 'OK'
        else:
            result = self.valid_error(f'{name} :半角文字以外の文字が入力されています。')

        return result

    def halu_zenkaku(self, value, name):
        """
        全角 チェック
        英数、空白         [ A-Za-z0-9]
        英記号             [\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]
        半角カナ、カナ記号 [｡-ﾟ]
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'[ A-Za-z0-9\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E｡-ﾟ]+$')

        result = 'OK'
#        if pattern.fullmatch(value):
#            result = 'OK'
#        else:
#            result = self.valid_error(f'{name} :全角文字以外の文字が入力されています。')

        return result

    def halu_kanji(self, value, name):
        """
        漢字チェック
        なし
        """

        result = 'OK'

        return result


    def halu_yyyymmdd(self, value, name):
        """
        西暦日付チェック
        4桁/2桁/2桁
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'^\d{8}$')

        if not pattern.fullmatch(value):
            return self.valid_error(f'{name} :日付が間違っています。')
        
        try:
            year  = int(value[0:4])
            month = int(value[4:6])
            day   = int(value[6:8])

            d = datetime.date( year , month , day )
            return 'OK'
        
        except ValueError as e:
            return self.valid_error(f'{name} :日付が間違っています。')


    def halu_yyyysmmsdd(self, value, name):
        """
        西暦日付チェック（／付き１０桁）
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'^\d{4}/\d{2}/\d{2}$')

        if not pattern.fullmatch(value):
            return self.valid_error(f'{name} :日付が間違っています。')

        try:
            year  = int(value[0:4])
            month = int(value[5:7])
            day   = int(value[8:10])
            d = datetime.date( year , month , day )
            return 'OK'

        except ValueError as e:
            return self.valid_error(f'{name} :日付が間違っています。')


    def halu_yyyyhmmhdd(self, value, name):
        """
        西暦日付チェック（-付き１０桁）
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'^\d{4}-\d{2}-\d{2}$')

        if not pattern.fullmatch(value):
            return self.valid_error(f'{name} :日付が間違っています。')
        
        try:
            year  = int(value[0:4])
            month = int(value[5:7])
            day   = int(value[8:10])
            d = datetime.date( year , month , day )
            return 'OK'

        except ValueError as e:
            return self.valid_error(f'{name} :日付が間違っています。')


    def halu_yyyymm(self, value, name):
        """
        年月チェック
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'^\d{6}$')

        if not pattern.fullmatch(value):
            return self.valid_error(f'{name} :日付が間違っています。')
        
        try:
            year  = int(value[0:4])
            month = int(value[4:6])
            day   = 1

            d = datetime.date( year , month , day )
            return 'OK'

        except ValueError as e:
            return self.valid_error(f'{name} :年月が間違っています。')

    def halu_yyyysmm(self, value, name):
        """
        年月チェック（／付き７桁）
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'^\d{4}/\d{2}$')

        if not pattern.fullmatch(value):
            return self.valid_error(f'{name} :日付が間違っています。')
        
        try:
            year  = int(value[0:4])
            month = int(value[5:7])
            day   = 1

            d = datetime.date( year , month , day )
            return 'OK'

        except ValueError as e:
            return self.valid_error(f'{name} :年月が間違っています。')

    def halu_yyyyhmm(self, value, name):
        """
        年月チェック（-付き７桁）
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'^\d{4}-\d{2}$')

        if not pattern.fullmatch(value):
            return self.valid_error(f'{name} :日付が間違っています。')
        
        try:
            year  = int(value[0:4])
            month = int(value[5:7])
            day   = 1

            d = datetime.date( year , month , day )
            return 'OK'

        except ValueError as e:
            return self.valid_error(f'{name} :年月が間違っています。')


    def halu_mmdd(self, value, name):
        """
        月日チェック
        """

        if value == '':
            return 'OK'
        
        pattern = re.compile(r'^\d{4}$')
        
        if not pattern.fullmatch(value):
            return self.valid_error(f'{name} :月日が間違っています。')
        
        try:
            year  = 9999
            month = int(value[0:2])
            day   = int(value[2:4])

            d = datetime.date( year , month , day )
            return 'OK'

        except ValueError as e:
            return self.valid_error(f'{name} :月日が間違っています。')
        

    def halu_mmsdd(self, value, name):
        """
        月日チェック(／付き５桁)
        """

        if value == '':
            return 'OK'
        
        pattern = re.compile(r'^\d{1,2}/\d{1,2}$')
        if not pattern.fullmatch(value):
            return self.valid_error(f'{name} :月日が間違っています。')

        try:
            year  = 9999
            month = int(value[0:2])
            day   = int(value[3:5])

            d = datetime.date( year , month , day )
            return 'OK'

        except ValueError as e:
            return self.valid_error(f'{name} :月日が間違っています。')


    def halu_mmhdd(self, value, name):
        """
        月日チェック(-付き５桁)
        """

        if value == '':
            return 'OK'
        
        pattern = re.compile(r'^\d{1,2}-\d{1,2}$')
        if not pattern.fullmatch(value):
            return self.valid_error(f'{name} :月日が間違っています。')

        try:
            year  = 9999
            month = int(value[0:2])
            day   = int(value[3:5])

            d = datetime.date( year , month , day )
            return 'OK'

        except ValueError as e:
            return self.valid_error(f'{name} :月日が間違っています。')


    def halu_hhmm(self, value, name):
        """
        時刻チェック
        """

        if value == '':
            return 'OK'
        
        pattern = re.compile(r'^\d{4}$')
        if not pattern.fullmatch(value):
            return self.valid_error(f'{name} :時刻が間違っています。')

        try:
            hh = int(value[0:2])
            mm = int(value[2:4])
            ss = 0

            t = datetime.time( hh , mm , ss )
            return 'OK'

        except ValueError as e:
            return self.valid_error(f'{name} :時刻が間違っています。')
        

    def halu_hhcmm(self, value, name):
        """
        時刻チェック（：付き５桁）
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'^\d{2}:\d{2}$')
        if not pattern.fullmatch(value):
            return self.valid_error(f'{name} :時刻が間違っています。')

        try:
            hh = int(value[0:2])
            mm = int(value[3:5])
            ss = 0

            t = datetime.time( hh , mm , ss )
            return 'OK'

        except ValueError as e:
            return self.valid_error(f'{name} :時刻が間違っています。')


    def halu_postno(self, value, name):
        """
        郵便番号チェック
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'^[0-9]{3}-[0-9]{4}$')

        if pattern.fullmatch(value):
            result = 'OK'
        else:
            result = self.valid_error(f'{name} :郵便番号が間違っています。')

        return result

    def halu_telno(self, value, name):
        """
        電話番号チェック
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'^0\d{1,4}-\d{1,4}-\d{4}$')

        if pattern.fullmatch(value):
            result = 'OK'
        else:
            result = self.valid_error(f'{name} :電話番号が間違っています。')

        return result


    def halu_keitaino(self, value, name):
        """
        携帯番号チェック
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'^0\d{2}-\d{4}-\d{4}$|^0\d{10}$')

        if pattern.fullmatch(value):
            result = 'OK'
        else:
            result = self.valid_error(f'{name} :携帯番号が間違っています。')

        return result

    def halu_mailaddress(self, value, name):
        """
        メールアドレスチェック
        なし
        """

        if value == '':
            return 'OK'
        
        pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')

        if pattern.fullmatch(value):
            result = 'OK'
        else:
            result = self.valid_error(f'{name} :メールアドレスが間違っています。')

        return result
    

    def url(self, value, name):
        """
        URLチェック
        なし
        """

        if value == '':
            return 'OK'

        pattern = re.compile(r'^(https?://)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(/.*)?$')

        if pattern.fullmatch(value):
            result = 'OK'
        else:
            result = self.valid_error(f'{name} :URLが間違っています。')

        return result

    def halu_ipaddress(self, value, name):
        """
        IPアドレスチェック
         なし
       """

        result = 'OK'

        return result

    def halu_min(self, minsize, value, name):
        """
        最少桁数チェック
        引数が多い
        """
        if value == '':
            return 'OK'
        if minsize == 0:
            return 'OK'

        if self.vintegerString(value) or self.vfloatString(value):
            str_value = str(value)
        else:
            str_value = value

        if len(str_value) < minsize:
            result = self.valid_error(f'{name} :桁数が足りません。')
        else:
            result =  'OK'

        return result


    def halu_max(self, maxsize, value, name):
        """
        最大桁数チェック
        """
        if value == '':
            return 'OK'
        if maxsize == 0:
            return 'OK'

        if self.vintegerString(value) or self.vfloatString(value):
            str_value = str(value)
        else:
            str_value = value

        if len(str_value) > maxsize:
            result = self.valid_error(f'{name} :桁数オーバです。')
        else:
            result =  'OK'

        return result

    def halu_minbyte(self, minsize, value, name):
        """
        最少バイト数チェック
        rubyは日本語　minsize*1.5バイト、'.'含まない。
        記号どこまで含むか。
#        print(len(str_value))
#        print(len(str_value.encode('utf-8')))
        """
        if value == '':
            return 'OK'
        if minsize == 0:
            return 'OK'

        if self.vintegerString(value) or self.vfloatString(value):
            str_value = str(value)
        else:
            str_value = value

        # 英数字の判定
        if re.fullmatch(r'^[a-zA-Z0-9]+$',str_value):
           # 英数字
            if len(str_value) < minsize:
                result = self.valid_error(f'{name} :バイト数が足りません。')
            else:
                result =  'OK'
        else:
           # 日本語
            bytesize = minsize*3
            if len(str_value.encode('utf-8')) < bytesize:
                result = self.valid_error(f'{name} :バイト数が足りません。')
            else:
                result =  'OK'
 
        return result

    def halu_maxbyte(self, maxsize, value, name):
        """
        最大バイト数チェック
        """
        if value == '':
            return 'OK'
        if maxsize == 0:
            return 'OK'

        if self.vintegerString(value) or self.vfloatString(value):
            str_value = str(value)
        else:
            str_value = value

        # 英数字の判定
        if re.fullmatch('^[a-zA-Z0-9]+$',str_value):
           # 英数字
            if len(str_value) > maxsize:
                result = self.valid_error(f'{name} :バイト数オーバです。')
            else:
                result =  'OK'
        else:
           # 日本語
            bytesize = maxsize*3
            if len(str_value.encode('utf-8')) > bytesize:
                result = self.valid_error(f'{name} :バイト数オーバです。')
            else:
                result =  'OK'

        return result

    def vintegerString(self, value):
        """
        数字か チェック
        """
        try:
            int(value) 
            return  True
        except ValueError as e:
            return  False


    def vfloatString(self, value):
        """
        浮動小数点数字か チェック
        """
        try:
            float(value) 
            return  True
        except ValueError as e:
            return  False

    def valid_error(self, error_message):
        """
        リクエストデータにエラー情報を設定する
        """
#        try:
#            result = 'OK'
#        except ValueError as error_message:
#            result = 'ERROR'
#
#        return result

        self.requestdict['message']['status'] = 'ERROR'
        self.requestdict['message']['msg'] = error_message

        return error_message
