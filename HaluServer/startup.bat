rem Start the Halu server.

rem Executing no1_WebServerup.sh
start "" cmd /c no1_WebServerup.bat & 

timeout /t 3


rem Executing no2_AppServerup.sh
start "" cmd /c no2_AppServerup.bat &

timeout /t 3

rem Executing no3_PrintServerup.sh
start "" cmd /c no3_PrintServerup.bat &

timeout /t 3

rem Executing no4_BatchServerup.sh
start "" cmd /c no4_BatchServerup.bat

