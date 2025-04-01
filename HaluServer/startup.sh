echo "Haluサーバを起動します。"

# no1_WebServerup.shの実行
/app/halu/HaluServer/no1_WebServerup.sh & 

# 待機
sleep 5

# no2_AppServerup.shの実行
/app/halu/HaluServer/no2_AppServerup.sh &

# 待機
sleep 5

# no3_PrintServerup.shの実行
/app/halu/HaluServer/no3_PrintServerup.sh &

# 待機
sleep 5

# no4_BatchServerup.shの実行
/app/halu/HaluServer/no4_BatchServerup.sh

