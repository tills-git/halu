/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
***********************************************/
(function ($, $H) {
  // 名前空間を設定する
  let App = $H.Application.ThemePersonalListMainte;

  // インスタンスプロパティを追加する
  class View extends $H.View {
    constructor(appspec) {
      $H.log("View init : start");
      super();
      this.appspec = appspec;

      $H.log("View init : end");
    }
  }

  // 共通モジュールを追加する
  View.include($H.Library.FormatMixin);
  View.include($H.Library.OutlineMixin);
  View.include($H.Library.LoadTemplateMixin);
  View.include($H.Library.ViewMixin);

  // 基本名称メンテパターンミックスインを追加する
  View.include($H.Library.SingleTableListFormViewMixin);

  // ----------------------------------------------------------
  // パターンに含まれない処理を追加する
  // また、パターン内の処理を変更するときは、オーバライドする
  // ----------------------------------------------------------
  View.include({
    // --------------------------------------------------------
    //  テーブル行クリック処理
    // --------------------------------------------------------
    on使用行クリック: function (arg) {
      $H.log("View on使用行クリック : start");

      var cssName = this.appspec.sysname + "/Html/css/" + arg["cssName"] + ".css";
      var arg = { cssName: cssName };
      this.appendCSS(arg);

      // ＣＳＳファイル情報をセッションストレージに保存する
      sessionStorage.setIdName(this.appspec.sysname + ".Login");
      sessionStorage.saveItem("ＣＳＳファイル名", cssName);

      $H.log("View on使用行クリック : end");
    }

  });
  App.View = View;
}(jQuery, Halu));