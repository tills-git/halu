echo on

# Haluフォルダに移動する
cd ./halu/HaluServer/Halu/

# Webサーバ＆スターレットを起動する
uvicorn halu:app --host 172.19.0.02 --port 80


