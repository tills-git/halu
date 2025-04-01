/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
***********************************************/
(function ($, $H) {
  // 名前空間を設定する
  let App = $H.Application.UserDetailMainte;

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

  // マスターメンテパターンミックスインを追加する
  View.include($H.Library.SingleRecordFormViewMixin);

  // --------------------------------------------------------
  // パターンに含まれない処理を追加する
  // また、パターン内の処理を変更するときは、オーバライドする
  // --------------------------------------------------------
  View.include({
    // ------------------------------------------------------
    //  項目の活性・非活性を設定
    // ------------------------------------------------------
    set項目制御: function (mode) {
      $H.log("View set項目制御 : start");

      // モードに応じて項目の活性・非活性をセット
      if (mode == "select" || mode == "delete") {
        $("input").prop('disabled', true);
        $("select").prop('disabled', true);
      }

      $H.log("View set項目制御 : end");
    }

  });
  App.View = View;
}(jQuery, Halu));