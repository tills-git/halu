/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
***********************************************/
(function($, $H){
  // 名前空間を設定する
  let App = $H.Application.Error404;

  // インスタンスプロパティを追加する
  class Controller extends $H.Controller {
    constructor(appspec, model, view) {
      $H.log("Controller init : start");
      super();
      this.appspec = appspec;
      this.model   = model;
      this.view    = view;
      this.createPubSubEvent();

      $H.log("Controller init : end");
    };
  }
  // 共通モジュールを追加する
  Controller.include($H.Library.EnterTabPFKeyMixin);
  Controller.include($H.Library.ControllerMixin);

  // 基本名称メンテパターンミックスインを追加する
  Controller.include($H.Library.SingleTableListFormControllerMixin);

  // --------------------------------------------------------
  // パターンに含まれない処理を追加する
  // また、パターン内の処理を変更するときは、オーバライドする
  // --------------------------------------------------------
  Controller.include({
    // ------------------------------------------------------
    // 処理開始
    // ------------------------------------------------------
    initExecute: function() {
      $H.log("Controller initExecute : start");

      // let arg = this.model.getログイン情報();
      // this.view.setログイン情報(arg);
      //this.on初期処理();

      $H.log("Controller initExecute : end");
    }

  });
  App.Controller = Controller;
}(jQuery, Halu));