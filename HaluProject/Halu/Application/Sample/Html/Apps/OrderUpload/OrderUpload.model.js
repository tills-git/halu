/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
***********************************************/
(function($, $H){
  // 名前空間を設定する
  var App = $H.Application.OrderUpload;

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

  // --------------------------------------------------------
  // パターンに含まれない処理を追加する
  // また、パターン内の処理を変更するときは、オーバライドする
  // --------------------------------------------------------
  Model.include({
    // ---------------------------------------
    // ファイルチェック処理
    // ---------------------------------------
    onファイル選択チェック処理: function(filename) {
      $H.log("Model onファイル選択チェック処理 : start");

      var result = filename.indexOf(".csv")
      if (result == -1) {
        var arg = {title: "ファイル選択エラー", message: "ファイル名が間違っています。ファイルをキャンセル後、正しいファイル名：.csvを選択して下さい。"};
        this.pubsub.publish("alertDialog", arg);

        $H.log("Model onファイル選択チェック処理 : end");
        return "ERROR";
      }

      var dataSet = this.dataset.getData();
      var headerRecord   = this.appspec.getJSONChunkByIdAtRecords(dataSet, "header")["record"];
      if (headerRecord["ファイル名"]["value"][0] != "") {
        var arg = {title: "ファイル選択エラー", message: "複数のファイルは選択できません。"};
        this.pubsub.publish("alertDialog", arg);

        $H.log("Model onファイル選択チェック処理 : end");
        return "ERROR";
      }

      $H.log("Model onファイル選択チェック処理 : end");
      return "OK";
    }

    // ---------------------------------------
    // ファイルチェック処理
    // ---------------------------------------
    ,onファイルチェック処理: function(filename) {
      $H.log("Model onファイルチェック処理 : start");

      var dataSet = this.dataset.getData();
      var headerRecord   = this.appspec.getJSONChunkByIdAtRecords(dataSet, "header")["record"];
      headerRecord["ファイル名"]["value"][0] = filename

      $H.log("Model onファイルチェック処理 : end");
      return "OK";
    }

    // ---------------------------------------
    // ボタン・ファンクションキー イベント処理
    // ---------------------------------------
    ,on実行: function(event) {
      $H.log("Model on実行 : start");


      $H.log("Model on実行 : end");
      return "OK";
    }

    // ---------------------------------------
    // データアップロード処理
    // ---------------------------------------
    ,onデータアップロード処理: function(self) {
      $H.log("Model onデータアップロード処理 : start");

      $('#drag-and-drop-zone').dmUploader('start');

      $H.log("Model onデータアップロード処理 : end");
      return "OK";
    }

  });
  App.Model = Model;

}(jQuery, Halu));