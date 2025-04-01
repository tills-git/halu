# coding: utf-8

import smtplib
from email.mime.text import MIMEText
from email.utils import formatdate

class Mail():
    """
    メール送信用のクラス。メールの作成・送信を行う。

    Attributes
    ----------
    mvclog : HaluLogger
        ログ出力用オブジェクト。
    mvclogname : str
        ログの出力ファイル名。
    """
    def __init__(self, mvclog, mvclogname):
        self.mvclog     = mvclog
        self.mvclogname = mvclogname


    def create_message(self, from_addr, to_addr, subject, body):
        """
        メールメッセージ(MIMEText)を作成する。

        Parameters
        ----------
        from_addr : str
            送信元メールアドレス
        to_addr : str
            宛先メールアドレス
        subject : str
            メールのタイトル
        body : str
            メールの本文

        Returns
        -------
        msg : dict
            作成したメールメッセージ（MIMEText）
        """
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = from_addr
        msg['To'] = to_addr
        msg['Date'] = formatdate()

        return msg


    def send_mail(self,server_addr, port, user_addr, password, msg):
        """
        メールを送信する。

        Parameters
        ----------
        server_addr : str
            メールサーバのアドレス
        port : str
            メールサーバのポート番号
        user_addr : str
            メールサーバのログインアドレス
        password : str
            メールサーバのログインパスワード
        msg : dict
            メールメッセージ(MIMEText)
        """
        try:
            server = smtplib.SMTP(server_addr, port)
            server.starttls()
            server.login(user_addr, password)

            server.send_message(msg)
            server.quit()

        except Exception as e:
            self.mvclog.error(self.mvclogname, f'Mail send_mail exception message : {e}')
