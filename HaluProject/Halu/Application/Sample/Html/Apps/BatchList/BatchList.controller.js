/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
***********************************************/
(function($, $H){
  // 名前空間を設定する
  var App = $H.Application.BatchList;

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

   ,on分割画面: function(event) {
      $H.log("Controller on分割画面 : start");

      // 次画面の処理モードを設定する
      this.model.saveSessionStorageOfNextMode("BatchDivisionList", "select");

      // 次画面に画面遷移する
      this.model.on次画面表示("BatchDivisionList", "select");

      $H.log("Controller on分割画面 : end");
    }

   ,on処理削除: function(event) {
      $H.log("Controller on処理削除 : start");

      if (!this.model.check行選択()) return;
      
      var arg = {};
      arg["title"]   = "削除  実行確認";
      arg["message"] = "削除を実行します。よろしいですか。";
      this.pubsub.publish("executeDialog", arg);    

      $H.log("Controller on処理削除 : end");
    }
    
    ,onExecuteDialogAfter: function() {
      $H.log("Controller onExecuteDialogAfter : start");
      
      var yesno = sessionStorage.getItem("executeDialog");

      if (yesno != 1){
        $H.log("Controller onExecuteDialogAfter : end");
        return;
      }
      
      this.ajaxExecute("delete");

      $H.log("Controller onExecuteDialogAfter : end");
    }

    // -----------------------------------
    //  リクエストデータ  チェック処理
    // -----------------------------------
   ,on処理削除OfCheckRequestData: function(requestData, mode) {
      $H.log("Controller on処理削除OfCheckRequestData : start");

      var status = this.model.on処理削除OfCheckRequestData(requestData, mode);
      if (status) {
        status = this.checkRequestData(requestData);
      }

      $H.log("Controller on処理削除OfCheckRequestData : end");
      return status;
    }

    // -------------------------------
    //  レスポンスデータ  編集処理
    // -------------------------------
   ,on処理削除OfEditResponseData: function(responseData, mode) {
      $H.log("Controller on処理削除OfEditResponseData : start");

      this.model.on処理削除OfEditResponseData(responseData);
      this.onリロード();

      $H.log("Controller on処理削除OfEditResponseData : end");
    }

  });
  App.Controller = Controller;
  
}(jQuery, Halu));