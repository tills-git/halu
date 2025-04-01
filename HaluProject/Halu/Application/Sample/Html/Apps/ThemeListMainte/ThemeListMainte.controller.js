/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
***********************************************/
(function ($, $H) {
  // 名前空間を設定する
  let App = $H.Application.ThemeListMainte;

  // インスタンスプロパティを追加する
  class Controller extends $H.Controller {
    constructor(appspec, model, view) {
      $H.log("Controller init : start");
      super();
      this.appspec = appspec;
      this.model = model;
      this.view = view;
      this.createPubSubEvent();

      $H.log("Controller init : end");
    };
  }

  // 共通モジュールを追加する
  Controller.include($H.Library.EnterTabPFKeyMixin);
  Controller.include($H.Library.ControllerMixin);

  // 基本名称メンテパターンミックスインを追加する
  Controller.include($H.Library.SingleTableListFormControllerMixin);

  // ----------------------------------------------------------
  // パターンに含まれない処理を追加する
  // また、パターン内の処理を変更するときは、オーバライドする
  // ----------------------------------------------------------
  Controller.include({
    // --------------------------------------------------------
    // テーブル行クリック処理処理
    // --------------------------------------------------------
    on使用行クリック: function (event, arg) {
      $H.log("Controller on使用行クリック : start");

      var row = event.currentTarget.parentNode.parentNode.rowIndex;
      var arg = { クリック行: row };
      var arg9 = this.model.on使用行クリック(arg);
      this.view.on使用行クリック(arg9);

      $H.log("Controller on使用行クリック : end");
    }

    // --------------------------------------------------------
    //  リクエストデータチェック処理
    // --------------------------------------------------------
    , on実行OfCheckRequestData: function (requestData, mode) {
      $H.log("Controller on実行OfCheckRequestData : start");

      var status = this.model.on実行OfCheckRequestData(requestData, mode);
      if (status) {
        status = this.checkRequestData(requestData);
      }

      $H.log("Controller on実行OfCheckRequestData : end");
      return status;
    }

  });
  App.Controller = Controller;
}(jQuery, Halu));