/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
***********************************************/
//------------------------------------------------------------
// ドキュメントロード時の初期処理
//------------------------------------------------------------
$(document).ready(function(){
  Halu.log("document ready GO !!!!!!!!!!!!!!");
  let app     = Halu.Application.ThemePersonalListMainte;
  let appspec = new app.AppSpec("ThemePersonalListMainte");
  appspec.initialSetting(app);
});
