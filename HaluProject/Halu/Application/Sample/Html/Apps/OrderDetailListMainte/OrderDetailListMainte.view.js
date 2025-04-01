/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
***********************************************/
(function($, $H){
  // 名前空間を設定する
  let App = $H.Application.OrderDetailListMainte;

  // インスタンスプロパティを追加する
  class View extends $H.View{
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
    set項目制御: function(mode) {
      $H.log("View set項目制御 : start");

      // モードに応じて項目の活性・非活性をセット
      if (mode == "select" || mode == "delete") {
        $("input").prop('disabled', true);
        $("select").prop('disabled', true);
      }
      if (mode == "insert") {
        $("#実行").hide();
        $("input").prop('disabled', true);
        $("select").prop('disabled', true);
      }

      $H.log("View set項目制御 : end");
    }
    // ------------------------------------------------------
    // 導出項目編集用カスタムイベント処理
    // ------------------------------------------------------
    ,set受注金額: function(arg1) {
      $H.log("View set受注金額 : start");

      var row = arg1["row"];
      var w_金額 = this.formatExecute["money"]["format"](arg1["受注金額"]);
      $($(".受注金額")[row]).val(w_金額);

      $H.log("View set受注金額 : end");
    }
    ,set合計金額: function(arg1) {
      $H.log("View set合計金額 : start");

      var w_合計金額 = this.formatExecute["money"]["format"](arg1["合計金額"]);
      $("#合計金額").val(w_合計金額);

      $H.log("View set合計金額 : end");
    }
  });
  App.View = View;
}(jQuery, Halu));