/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
***********************************************/
(function ($, $H) {
  // 名前空間を設定する
  let App = $H.Application.UserDetailMainte;

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
  //del start 2024/11/12
  //Model.include($H.Library.MemberModelMixin);
  //del end   2024/11/12

  // --------------------------------------------------------
  // パターンに含まれない処理を追加する
  // また、パターン内の処理を変更するときは、オーバライドする
  // --------------------------------------------------------
  Model.include({
    // ------------------------------------------------------
    //  初期処理
    // ------------------------------------------------------
    on初期処理: function () {
      $H.log("Model on初期処理 : start");

      // セッションストレージに識別名を保存する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);

      // // 画面のセッションストレージの処理モードを保存する(2021/1/28 MK)
      // sessionStorage.saveItem("処理モード", "update");

      let mode = sessionStorage.loadItem("処理モード");
      let beforeHtmlName = this.getBeforeHtmlName();

      let arg = { 処理モード: mode, 前画面名: beforeHtmlName };
      this.pubsub.publish("showヘッダータイトル", arg);

      let dataSet = this.dataset.getData();
      arg["データセット"] = dataSet;

      $H.log("Model on初期処理 : end");
      return arg;
    }
  });
  App.Model = Model;
}(jQuery, Halu));