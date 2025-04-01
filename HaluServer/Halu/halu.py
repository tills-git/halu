# coding: utf-8

import os
import json

from starlette.applications    import Starlette
from starlette.middleware      import Middleware
from starlette.middleware.cors import CORSMiddleware

from starlette.responses       import JSONResponse
from starlette.responses       import FileResponse
from starlette.responses       import PlainTextResponse
from starlette.routing         import Route, Mount, WebSocketRoute
   
from logger.halulogger         import HaluLogger
from halumain.haluconf         import HaluConf

from halurpc.appserverrpc      import AppClient
from halurpc.rmenuappserverrpc import RmenuClient


hconf    = HaluConf()
hlog     = HaluLogger('halu')
hlogname = 'halu'

def homepage(request):
    hlog.debug(hlogname, 'homepage request Hello, halu user!')

    return PlainTextResponse('Hello, halu user!\n\n Enter the URL of the project you want to connect to')

# -----------------------------------------
# Halu Application Server
# -----------------------------------------
async def halumain(request):
    formdata    = await request.form()    
    requestjson = formdata['data']
    requestdict = json.loads(requestjson)

    hlog.debug(hlogname, f'halumain request /HaluASGI/Halumain data={requestdict}')


    # アプリケーションクライアントをインスタンスし、アプリケーションサーバに接続する
    # リクエストデータをセットしcallを実行、レスポンスデータを受け取る
    appclient    = AppClient()
    responsedict = appclient.call(requestdict)


    hlog.debug(hlogname, f'halumain response data={responsedict}\n')
    return JSONResponse(responsedict)


async def haluhtml(request):
    formdata = await request.form()
    htmlname = formdata['gamen']
    hlog.debug(hlogname, f'haluhtml request /HaluASGI/Haluhtml gamen={htmlname}')

    # ファイルの存在チェック
    url = hconf.apppath + '/' + htmlname + '/index.html'
    hlog.debug(hlogname, f'haluhtml request /HaluASGI/Haluhtml url={url}')

    exist_file = os.path.isfile(url)
    if exist_file:
        response = FileResponse(url)
    else:
        dir_list = htmlname.split('/')
        dir_list[-1] = 'Error404'

        error_url = hconf.apppath + '/' + '/'.join(dir_list) + '/index.html'
        response = FileResponse(error_url)

    # return FileResponse(f'{hconf.apppath}/{htmlname}/index.html')
    return response


async def haludownload(request):
    formdata     = await request.form()    
    hlog.debug(hlogname, f'haludownload request /HaluASGI/haludownload formdata={formdata}')

    #fileurl  = hconf.apppath + '/' + formdata['file']
    fileurl  = formdata['file']
    filetype = formdata['type']

    if 'download' in formdata.keys():
        newname  = formdata['download']
    else:
        newname  = fileurl.split('/')[-1]
    
    return FileResponse(fileurl, media_type=filetype, filename=newname)


async def haluupload(request):
    formdata = await request.form()
    hlog.debug(hlogname, f'haluupload request /HaluASGI/haluupload start')

    # アップロードファイルの名前を取得
    filename = formdata["file"].filename

    # アップロードファイルを読み込む
    contents = await formdata["file"].read()

    # アップロードファイルの格納先を取得する
    datalist = formdata["data"]

    # アップロードファイルの格納先フォルダーの有無を確認し、なければ作成する
    if os.path.exists(hconf.apppath + '/' + datalist):
        pass
    else:
        os.mkdir(hconf.apppath + '/' + datalist)

    # 読み込んだデータを指定の場所に出力する
    filename9  = hconf.apppath + '/' + datalist + '/' + filename
    f = open(filename9, 'wb')
    f.write(contents)
    f.close()

    return PlainTextResponse('ファイルアップロードは正常に終了しました。')


async def halulogin(request):
    pass

# -----------------------------------------
# Rmenu Application Server
# -----------------------------------------
async def rmenumain(request):
    formdata    = await request.form()    
    requestjson = formdata['data']
    requestdict = json.loads(requestjson)

    hlog.debug(hlogname, f'rmenumain request /RmenuASGI/Rmenumain data={requestdict}')


    # アプリケーションクライアントをインスタンスし、アプリケーションサーバに接続する
    # リクエストデータをセットしcallを実行、レスポンスデータを受け取る
    rmenuclient  = RmenuClient()
    responsedict = rmenuclient.call(requestdict)


    hlog.debug(hlogname, f'rmenumain response data={responsedict}\n')
    return JSONResponse(responsedict)


async def rmenuhtml(request):
    formdata = await request.form()    
    htmlname = formdata['gamen']

    hlog.debug(hlogname, f'rmenuhtml request /RmenuASGI/Rmenuhtml gamen={htmlname}')
    return FileResponse(f'{hconf.apppath}/{htmlname}/index.html')


async def rmenudownload(request):
    pass


async def rmenuupload(request):
    pass


async def rmenulogin(request):
    pass


# -----------------------------------------
# Application File Request
# -----------------------------------------
async def appfile(request):
    apppath = request.path_params['appfile']

    hlog.debug(hlogname, f'appfile request /Application/{apppath}')
    return FileResponse(f'{hconf.apppath}/{apppath}')


# -----------------------------------------
# System File Request
# -----------------------------------------
async def sysfile(request):
    syspath = request.path_params['sysfile']

    if "Server/" in syspath:
        hlog.debug(hlogname, f'sysfile request /System/{syspath}')
        hlog.debug(hlogname, f'sysfile request ERROR')
        return PlainTextResponse('Hello, halu user!\n\n sysfile request ERROR')

    hlog.debug(hlogname, f'sysfile request /System/{syspath}')
    return FileResponse(f'{hconf.syspath}/{syspath}')

# -----------------------------------------
# WebSocket EndPoint
# -----------------------------------------
async def websocket_endpoint(websocket):
    await websocket.accept()
    await websocket.send_text('Hello, websocket!')
    await websocket.close()


# -----------------------------------------
# Start Up
# -----------------------------------------
def startup():
    hlog.debug(hlogname, 'startup Ready Starlette to go!\n')

# -----------------------------------------
# CORSMiddleware 定義
# -----------------------------------------
middleware = [
    Middleware(CORSMiddleware, allow_origins=['*'])
]

# -----------------------------------------
# Routes 定義
# -----------------------------------------
routes = [
    Route('/', homepage),

    # -----------------------------------------
    # WebSocket EndPoint
    # -----------------------------------------
    WebSocketRoute('/ws', websocket_endpoint),


    # -----------------------------------------
    # Halu Application Server
    # -----------------------------------------
    Route('/HaluASGI/Halumain', halumain, methods=['POST']),
    Route('/HaluASGI/Haluhtml', haluhtml, methods=['POST']),
    Route('/HaluASGI/HaluDownload', haludownload, methods=['POST']),
    Route('/HaluASGI/HaluUpload', haluupload, methods=['POST']),
    Route('/HaluASGI/HaluLogin', halulogin, methods=['POST']),


    # -----------------------------------------
    # Rmenu Application Server
    # -----------------------------------------
    Route('/RmenuASGI/Rmenumain', rmenumain, methods=['POST']),
    Route('/RmenuASGI/Rmenuhtml', rmenuhtml, methods=['POST']),
    Route('/RmenuASGI/RmenuDownload', rmenudownload, methods=['POST']),
    Route('/RmenuASGI/RmenuUpload', rmenuupload, methods=['POST']),
    Route('/RmenuASGI/RmenuLogin', rmenulogin, methods=['POST']),


    # -----------------------------------------
    # Halu Application & System File Request
    # -----------------------------------------
    Route('/Application/{appfile:path}', appfile),
    Route('/System/{sysfile:path}', sysfile),
    

    # -----------------------------------------
    # Rmenu Application & System File Request
    # -----------------------------------------
    Route('/Rmenu/Application/{appfile:path}', appfile),
    Route('/Rmenu/System/{sysfile:path}', sysfile),
]

app = Starlette(debug=True, routes=routes, middleware=middleware, on_startup=[startup])
