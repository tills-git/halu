@echo on

rem Go to the Halu folder
cd ./Halu/

rem Start the Web Server & starlette
uvicorn halu:app