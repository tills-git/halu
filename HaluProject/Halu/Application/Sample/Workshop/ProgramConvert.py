import sys
import os
import tkinter as tk
import tkinter.messagebox as mb
import tkinter.filedialog as fd
import tkinter.simpledialog as sd
import glob

# 置換文字列の設定（0:FROM, 1:TO）
CONVERT_STRING = {}
CONVERT_STRING['projectName'] = ['Member', 'Sample']
CONVERT_STRING['databaseName'] = ['member', 'sample']
CONVERT_STRING['programName'] = ['', '']

# tkinter の窓を非表示
tk.Tk().withdraw()
# フォルダ選択
dirpath = fd.askdirectory(
    title='実行するフォルダを指定してください',
    initialdir='./HaluProject/Halu/Application/Sample'
)
if dirpath is None or dirpath == '':
    mb.showinfo('処理終了','処理を終了します')
    sys.exit()

# 指定したフォルダ内のファイルを取得
files = glob.glob(dirpath +'/*.*')
if len(files) == 0:
    mb.showinfo('処理終了','プログラムフォルダを指定してください')
    sys.exit()

# 変更前プログラム名の設定
dirname = dirpath.split('/')[-1]
CONVERT_STRING['programName'][0] = dirname
# 変更後プログラム名の設定
program_name = sd.askstring(
    '変更後プログラム名入力', '変更後プログラム名',
    initialvalue=dirname
)
CONVERT_STRING['programName'][1] = program_name

# ファイルごとに文字列置換
for file in files:
    # ファイル内容と拡張子取得
    ext = os.path.splitext(file)[1]
    filedata = open(file, 'r', encoding='utf-8')
    lines = filedata.read()
    filedata.close()
    # 文字列置換
    if ext == '.html':
        lines = lines.replace(CONVERT_STRING['projectName'][0],CONVERT_STRING['projectName'][1])
        lines = lines.replace(CONVERT_STRING['programName'][0],CONVERT_STRING['programName'][1])
    elif ext == '.js':
        lines = lines.replace(CONVERT_STRING['projectName'][0],CONVERT_STRING['projectName'][1])
        lines = lines.replace(CONVERT_STRING['programName'][0],CONVERT_STRING['programName'][1])
    elif ext == '.json':
        lines = lines.replace(CONVERT_STRING['projectName'][0],CONVERT_STRING['projectName'][1])
        lines = lines.replace(CONVERT_STRING['programName'][0],CONVERT_STRING['programName'][1])
        lines = lines.replace(CONVERT_STRING['databaseName'][0],CONVERT_STRING['databaseName'][1])
    elif ext == '.py':
        lines = lines.replace(CONVERT_STRING['projectName'][0],CONVERT_STRING['projectName'][1])
        lines = lines.replace(CONVERT_STRING['programName'][0],CONVERT_STRING['programName'][1])
    else:
        mb.showinfo('INFO',f'{file} は処理対象外です')
    
    # 上書き保存
    with open(file, mode='w', encoding='utf-8') as f:
        f.write(lines)
        f.close()
    # ファイル名の変更
    new_file = dirpath + '/' + os.path.basename(file).replace(CONVERT_STRING['programName'][0],CONVERT_STRING['programName'][1])
    os.rename(file, new_file)

# フォルダ名の変更
new_dirpath = dirpath.replace(CONVERT_STRING['programName'][0],CONVERT_STRING['programName'][1])
os.rename(dirpath, new_dirpath)
