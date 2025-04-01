/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
***********************************************/
(function($, $H){
  // 名前空間を設定する
  var App = $H.Application.BatchDivisionList;

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

  // マスター一覧パターン  ミックスインを追加する
  Controller.include($H.Library.MultiTableListFormControllerMixin);

  // --------------------------------------------------------
  // パターンに含まれない処理を追加する
  // また、パターン内の処理を変更するときは、オーバライドする
  // --------------------------------------------------------
  Controller.include({
    // ---------------------------------------
    // ボタン・ファンクションキー イベント処理
    // ---------------------------------------
    on再表示: function(event) {
      $H.log("Controller on再表示 : start");

      this.onリロード();

      $H.log("Controller on再表示 : end");
    }

    // -----------------------------------
    //  リクエストデータ  チェック処理
    // -----------------------------------
   ,on再処理OfCheckRequestData: function(requestData, mode) {
      $H.log("Controller on再処理OfCheckRequestData : start");

      var status = this.model.on再処理OfCheckRequestData(requestData, mode);
      if (status) {
        status = this.checkRequestData(requestData);
      }

      $H.log("Controller on再処理OfCheckRequestData : end");
      return status;
    }

    // -------------------------------
    //  レスポンスデータ  編集処理
    // -------------------------------
   ,on再処理OfEditResponseData: function(responseData, mode) {
      $H.log("Controller on再処理OfEditResponseData : start");

      this.onリロード();

      $H.log("Controller on再処理OfEditResponseData : end");
    }

  });
  App.Controller = Controller;
  
}(jQuery, Halu));