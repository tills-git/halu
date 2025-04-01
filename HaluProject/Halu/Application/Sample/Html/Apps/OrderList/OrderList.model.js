/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
***********************************************/
(function ($, $H) {
  // 名前空間を設定する
  let App = $H.Application.OrderList;

  // インスタンスプロパティを追加する
  class Model extends $H.Model {
    constructor(appspec) {
      $H.log("Model init : start");
      super();
      this.appspec = appspec;

      $H.log("Model init : end");
    }
  }
  // 共通モジュールを追加する
  Model.include($H.Library.ValidationMixin);
  Model.include($H.Library.ModelMixin);
  Model.include($H.Library.HtmlTransitionMixin);

  // マスター一覧パターンミックスインを追加する
  Model.include($H.Library.MultiTableListFormModelMixin);

  // --------------------------------------------------------
  // パターンに含まれない処理を追加する
  // また、パターン内の処理を変更するときは、オーバライドする
  // --------------------------------------------------------
  Model.include({
    // -------------------------------------------
    //     受注一覧H  レスポンスデータ編集処理
    // -------------------------------------------
    on受注一覧HOfEditResponseData: function (responseData, mode) {
      $H.log("Model on受注一覧HOfEditResponseData : start");

      let savefile = responseData["excelinfo"]["savefile"];
      let pdffile  = savefile.replace('.xlsx', '.pdf');
      let newname  = responseData["excelinfo"]["pdfname"];

      let argHash  = {};
      argHash["file"]   = pdffile;
      argHash["download"] = newname + ".pdf";
      argHash["type"]   = "pdf";
      argHash["delete"] = "yes";
      this.postDownloadASGI(argHash);

      $H.log("Model on受注一覧HOfEditResponseData : end");
    },
    
    // -------------------------------------------
    //     受注一覧HM  レスポンスデータ編集処理
    // -------------------------------------------
    on受注一覧HMOfEditResponseData: function (responseData, mode) {
      $H.log("Model on受注一覧HMOfEditResponseData : start");

      let savefile = responseData["excelinfo"]["savefile"];
      let pdffile  = savefile.replace('.xlsx', '.pdf');
      let newname  = responseData["excelinfo"]["pdfname"];

      let argHash  = {};
      argHash["file"]   = pdffile;
      argHash["download"] = newname + ".pdf";
      argHash["type"]   = "pdf";
      argHash["delete"] = "yes";
      this.postDownloadASGI(argHash);

      $H.log("Model on受注一覧HMOfEditResponseData : end");
    }

  });
  App.Model = Model;

}(jQuery, Halu));