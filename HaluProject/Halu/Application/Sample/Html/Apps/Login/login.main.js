/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
***********************************************/
//------------------------------------------------------------
// ドキュメントロード時の初期処理
//------------------------------------------------------------
$(document).ready(function(){
  Halu.log("document ready GO !!!!!!!!!!!!!!");
  let app     = Halu.Application.Login;
  let appspec = new app.AppSpec("Login");
  appspec.initialSetting(app);
});
