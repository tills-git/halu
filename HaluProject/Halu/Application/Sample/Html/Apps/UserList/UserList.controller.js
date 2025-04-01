/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
***********************************************/
(function ($, $H) {
  // 名前空間を設定する
  let App = $H.Application.UserList;

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
    }
  }

  // 共通モジュールを追加する
  Controller.include($H.Library.EnterTabPFKeyMixin);
  Controller.include($H.Library.ControllerMixin);

  // マスター一覧パターンミックスインを追加する
  Controller.include($H.Library.MultiTableListFormControllerMixin);

  // --------------------------------------------------------
  // パターンに含まれない処理を追加する
  // また、パターン内の処理を変更するときは、オーバライドする
  // --------------------------------------------------------
  Controller.include({
    // ------------------------------------------------------
    // 初期処理
    // ------------------------------------------------------
    on初期処理: function () {
      $H.log("Controller on初期処理 : start");

      let arg = this.model.on初期処理();
      this.view.on初期処理(arg);

      // セッションストレージに識別名を保存する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      let currentpage = sessionStorage.loadItem("カレントページ");

      if (currentpage === undefined) {
        // メニュー画面または別一覧画面から呼び出された時
        // 別の一覧画面からの引き継ぎデータをデータセットに設定する
        this.model.setFromBeforeStorageDataToDataset();
        this.on最初のページ();
      }
      else {
        // 次画面から戻って来た時
        let dataSet = this.model.on初期リロード前処理();
        this.view.on初期リロード前処理(dataSet);
        // this.onリロード();
      }

      // 初期処理を実行する
      this.ajaxExecute("init");

      $H.log("Controller on初期処理 : end");
    }

  });
  App.Controller = Controller;
}(jQuery, Halu));