# coding: UTF-8
# ***********************************************
# * Framework Name  :  Halu
# * (c) 2025 TILLS & Co.
# ***********************************************

import sys
from batchclientserver.batchclientmainserver import BatchClientMainServer



def main(args):
    """
    バッチリランの呼び出し：
    python BatchRerun.py DBName バッチID 分割番号 分割数

    """

    dbname          = args[1]
    controll_id     = int(args[2])
    cur_division    = int(args[3])
    division_number = int(args[4])
    
    # BatchClientMainServerをインスタンスする
    main_server = BatchClientMainServer()

    # BatchClientMainServerをコールする
    main_server.call(dbname, controll_id, cur_division, division_number)


if __name__ == '__main__':
    args = sys.argv
    main(args)
