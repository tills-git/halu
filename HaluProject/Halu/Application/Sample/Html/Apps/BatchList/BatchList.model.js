/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
***********************************************/
(function($, $H){
  // 名前空間を設定する
  var App = $H.Application.BatchList;

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

  // マスター一覧パターン  ミックスインを追加する
  Model.include($H.Library.MultiTableListFormModelMixin);

  // --------------------------------------------------------
  // パターンに含まれない処理を追加する
  // また、パターン内の処理を変更するときは、オーバライドする
  // --------------------------------------------------------
  Model.include({
    // -----------------------------------
    //  リクエストデータ  チェック処理
    // -----------------------------------
   on処理削除OfCheckRequestData: function(requestData, mode) {
      $H.log("Controller on処理削除OfCheckRequestData : start");

      var dataSet       = this.dataset.getData();
      var detailRecord  = this.appspec.getJSONChunkByIdAtRecords(dataSet, "detail")["record"];
      var requestRecord = this.appspec.getJSONChunkByIdAtRecords(requestData, "header")["record"];

      // セッションデータに識別名を設定する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      var row = sessionStorage.loadItem("クリック行");
      requestRecord["バッチ管理削除ＩＤ"]["value"][0] = detailRecord["バッチ管理ＩＤ"]["value"][row];

      $H.log("Controller on処理削除OfCheckRequestData : end");
      return true;
    }
    
    // -------------------------------------------------------
    //  レスポンスデータ  編集処理
    // -------------------------------------------------------
   ,on処理削除OfEditResponseData: function(responseData) {
      $H.log("Model on処理削除OfEditResponseData : start");

      var status = responseData["message"]["status"];
      var msg    = responseData["message"]["msg"];
      var arg    = {title: "サーバ処理確認", status: status, message: msg};
      this.pubsub.publish("serverDialog", arg);

      $H.log("Model on処理削除OfEditResponseData : end");
    }
    
  });
  App.Model = Model;

}(jQuery, Halu));