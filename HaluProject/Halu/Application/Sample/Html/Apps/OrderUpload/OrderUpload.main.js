/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
***********************************************/
// -------------------------------------------------------------
//             ドキュメントロード時の初期処理                   
// -------------------------------------------------------------
$(document).ready(function(){
  Halu.log("document ready GO !!!!!!!!!!!!!!");
  var app     = Halu.Application.OrderUpload;
  var appspec = new app.AppSpec("OrderUpload");
  appspec.initialSetting(app);
});
