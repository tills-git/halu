/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
 * --------------------------------------------
 * タブメニューパターン
 * ビューミックスイン
***********************************************/

(function ($, $H) {
  // 名前空間を設定する
  let App = $H.Library;

  /**
   * 関数を追加する
   * @mixin TabMenuViewMixin
   */
  App.TabMenuViewMixin = {

    /**
     * テンプレートのロードおよび各ダイアログの初期処理を実行する
     * 
     * @memberof TabMenuViewMixin
     * @param - なし
     */
    initExecute: function () {
      $H.log("View initExecute : start");

      this.initテンプレートロード();
      this.initAlertDialog();        // 警告メッセージ用ダイアログ 初期処理
      this.initConfirmDialog(this);  // 確認メッセージ用ダイアログ 初期処理
      this.initExecuteDialog(this);  // 実行確認メッセージ用ダイアログ 初期処理
      this.initServerDialog(this);   // サーバ確認メッセージ用ダイアログ 初期処理

      $H.log("View initExecute : end");
    },

    /**
     * CSSファイルの追加処理を実行する
     * 
     * @memberof TabMenuViewMixin
     * @param - なし
     */
    initテンプレートロード: function () {
      $H.log("View initテンプレートロード : start");

      // ＣＳＳファイル名をセッションストレージから取得しロードする
      sessionStorage.setIdName(this.appspec.sysname + ".Login");
      let cssName = sessionStorage.loadItem("ＣＳＳファイル名");

      if (cssName) {
        let arg = { cssName: cssName };
        this.appendCSS(arg);
      }

      $('body').fadeIn("normal");

      $H.log("View initテンプレートロード : end");
    },

    /**
     * 引数からログイン情報を取得し、画面へ表示する
     * 
     * @memberof TabMenuViewMixin
     * @param {object} arg  - ユーザ名称、ログイン時刻、ログイン和暦
     */
    setログイン情報: function (arg) {
      $H.log("View setログイン情報 : start");

      $("#ログイン和暦").html(arg["ログイン和暦"]);
      $("#ログイン日時").html(arg["ログイン時刻"]);
      $("#ユーザ氏名").html(arg["ユーザ名称"]);

      $H.log("View setログイン情報 : end");
    },

    /**
     * 引数で指定された名称のメニュータブを表示する
     * 
     * @memberof TabMenuViewMixin
     * @param {string} tabname - タブ名
     */
    openメニュータブ: function (tabName) {
      $H.log("Model openメニュータブ : start");

      $("#" + tabName).tab('show');
      $("#" + tabName).focus();

      $H.log("Model openメニュータブ : end");
    }

  };
}(jQuery, Halu));