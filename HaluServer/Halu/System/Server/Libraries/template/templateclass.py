# coding: utf-8

from logger.halulogger import HaluLogger


class TemplateClass():
    """
    テンプレートクラスの説明
    """


    def __init__(self):
        self.log   = HaluLogger('templateclass')  # ログファイル名を設定
        self.log.debug('templateclass', 'TemplateClass init start')


        self.log.debug('templateclass', 'TemplateClass init end')


    def call(self):
        self.log.debug('templateclass', 'TemplateClass call start')

        result = self.methodAAA()


        self.log.debug('templateclass', 'TemplateClass call end')
        return result


    def methodAAA(self):
        self.log.debug('templateclass', 'methodAAA call start')

        result = 'OK'


        self.log.debug('templateclass', 'methodAAA call end')
        return result


# ---------------------------------------------
#    テンプレートクラス 実行開始
# ---------------------------------------------
def main():
    print('***  Template Class start  ***\n')


    print('\n***  Template Class start end  ***')


if __name__ == '__main__':
    main()
