/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
***********************************************/
(function ($, $H) {
  // 名前空間を設定する
  let App = $H.Application.ThemeListMainte;

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

  // 基本名称メンテパターンミックスインを追加する
  Model.include($H.Library.SingleTableListFormModelMixin);

  // ----------------------------------------------------------
  // パターンに含まれない処理を追加する  
  // また、パターン内の処理を変更するときは、オーバライドする
  // ----------------------------------------------------------
  Model.include({
    // --------------------------------------------------------
    //  テーブルの選択行をセッションストレージに保存する
    // --------------------------------------------------------
    on使用行クリック: function (arg) {
      $H.log("Model on使用行クリック : start");

      var clickRow = arg["クリック行"];

      var dataset = this.dataset.getData();
      var detailInfo = this.appspec.getJSONChunkByIdAtRecords(dataset, "detail");
      var maxLines = detailInfo["record"]["使用"]["value"].length;
      var i;

      for (i = 0; i < maxLines; i++) {
        detailInfo["record"]["使用"]["value"][i] = "";
      }
      detailInfo["record"]["使用"]["value"][clickRow] = "1";

      var arg9 = {};
      arg9["cssName"] = detailInfo["record"]["テーマコード"]["value"][clickRow];

      $H.log("Model on使用行クリック : end");
      return arg9;
    }

    // --------------------------------------------------------
    //  実行前編集処理
    // --------------------------------------------------------
    , on実行OfCheckRequestData: function (requestData) {
      $H.log("Model on実行OfCheckRequestData : start");

      var dataSet = this.dataset.getData();
      this.setDatasetToJsonRecordsNoDeleteLine(dataSet, requestData);

      $H.log("Model on実行OfCheckRequestData : end");
      return true;
    }

  });
  App.Model = Model;
}(jQuery, Halu));