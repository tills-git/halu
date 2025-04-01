/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
***********************************************/
(function ($, $H) {
  // 名前空間を設定する
  let App = $H.Application.OrderDetailListMainte;

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

  // マスターメンテパターンミックスインを追加する
  Model.include($H.Library.SingleRecordFormModelMixin);

  // --------------------------------------------------------
  // パターンに含まれない処理を追加する
  // また、パターン内の処理を変更するときは、オーバライドする
  // --------------------------------------------------------
  Model.include({
    // ------------------------------------------------------
    // 導出項目編集用カスタムイベント処理
    // ------------------------------------------------------
    calc受注金額: function (arg) {
      $H.log("Model calc受注金額 : start");

      var row = arg["row"];
      var dataSet = this.dataset.getData();
      var detailRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, "detail")["record"];
      var w_数量 = detailRecord["受注数量"]["value"][row];
      var w_単価 = detailRecord["受注単価"]["value"][row];
      var w_金額 = w_数量 * w_単価;
      detailRecord["受注金額"]["value"][row] = w_金額;

      var arg1 = {};
      arg1["受注金額"] = w_金額;
      arg1["row"] = row;
      arg1["status"] = "OK";

      $H.log("Model calc受注金額 : end");
      return arg1;
    }
    , calc合計金額: function () {
      $H.log("Model calc合計金額 : start");

      var dataSet = this.dataset.getData();
      var detailRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, "detail")["record"];
      var headerRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, "header")["record"];

      var maxSize = detailRecord["受注金額"]["value"].length;
      var w_合計金額 = 0;
      for (var i = 0; i < maxSize; i++) {
        if (detailRecord["削除"]["value"][i] == "9") {
          continue;
        }
        var tmp = detailRecord["受注金額"]["value"][i];
        w_合計金額 = new BigNumber(w_合計金額).plus(Number(tmp)).toPrecision();
      }
      var arg1 = {};
      arg1["合計金額"] = w_合計金額;
      arg1["status"] = "OK";
      headerRecord["合計金額"]["value"][0] = w_合計金額;

      $H.log("Model calc合計金額 : end");
      return arg1;
    }
    // ------------------------------------------------------------------------
    //  リクエストデータ編集・チェック処理
    // ------------------------------------------------------------------------
    , on訂正OfCheckRequestData: function (requestData, mode) {
      $H.log("Model on訂正OfCheckRequestData : start");

      // データセットからリクエストにデータを設定する
      var dataSet = this.dataset.getData();
      this.setDatasetToJsonRecordsInDeleteLine(dataSet, requestData);    // 削除行をリクエストデータに出力する
      // this.setDatasetToJsonRecordsNoDeleteLine(dataSet, requestData);    // 削除行をリクエストデータに出力しない

      $H.log("Model on訂正OfCheckRequestData : end");
      return true;
    }

  });
  App.Model = Model;
}(jQuery, Halu));