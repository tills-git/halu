/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
***********************************************/
(function ($, $H) {
  // 名前空間を設定する
  let App = $H.Application.StartMenu;

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

  // メニューパターンミックスインを追加する
  View.include($H.Library.TabMenuViewMixin);

  // ----------------------------------------------------------
  // パターンに含まれない処理を追加する
  // また、パターン内の処理を変更するときは、オーバライドする
  // ----------------------------------------------------------
  View.include({

  });
  App.View = View;

}(jQuery, Halu));