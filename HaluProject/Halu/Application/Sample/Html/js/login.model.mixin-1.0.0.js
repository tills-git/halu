/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
 * --------------------------------------------
 * ログインパターン
 * モデルミックスイン
***********************************************/

(function ($, $H) {
  // 名前空間を設定する
  let App = $H.Library;

  /**
   * 関数を追加する
   * @mixin LoginModelMixin
   */
  App.LoginModelMixin = {
    
    /**
     * 初期処理  ※処理なし
     * 
     * @memberof LoginModelMixin
     * @param - なし
     */
    initExecute: function () {
      $H.log("Model initExecute : start");

      $H.log("Model initExecute : end");
    },

    /**
     * DBから取得したCSSファイル名に相対パスを付与した形式で<br>
     * セッションストレージに保存する<br>
     * 
     * @memberof LoginModelMixin
     * @param {Object} responseData - レスポンスデータ
     * @return {Object} 画面情報(CSSファイル名)
     */
    on初期処理OfEditResponseData: function (responseData) {
      $H.log("Model on初期処理OfEditResponseData : start");

      // ＣＳＳファイル情報をセッションストレージに保存する
      // セッションストレージに識別名を保存する
      let responseRecord = this.appspec.getJSONChunkByIdAtRecords(responseData, "header");
      let cssName = responseRecord["record"]["ＣＳＳファイル名"]["value"][0];

      sessionStorage.setIdName(this.appspec.sysname + ".Login");
      let arg = null;
      if (cssName != "") {
        sessionStorage.saveItem("ＣＳＳファイル名", this.appspec.sysname + "/Html/css/" + cssName + ".css");
        arg = { ＣＳＳファイル名: this.appspec.sysname + "/Html/css/" + cssName + ".css" };
      }
      else {
        sessionStorage.saveItem("ＣＳＳファイル名", "");
        arg = { ＣＳＳファイル名: "" };
      }

      $H.log("Model on初期処理OfEditResponseData : end");
      return arg;
    },

    /**
     * ユーザ情報をレスポンスデータから取得し、セッションストレージに保存する<br>
     * また、現在時刻を取得しセッションストレージに保存する<br>
     * 
     * @memberof LoginModelMixin
     * @param {Object} responseData - レスポンスデータ
     */
    onチェックOfEditResponseData: function (responseData) {
      $H.log("Model onチェックOfEditResponseData : start");

      // ユーザ情報をセッションストレージに保存する
      // セッションストレージに識別名を保存する
      sessionStorage.setIdName(this.appspec.sysname + ".Login");

      // セッションストレージに項目データを保存する
      let responseRecord = this.appspec.getJSONChunkByIdAtRecords(responseData, "header");
      let userid = responseRecord["record"]["ユーザＩＤ"]["value"][0];
      let username = responseRecord["record"]["ユーザ名称"]["value"][0];
      let menuname = responseRecord["record"]["メニュー名"]["value"][0];
      let cssname = responseRecord["record"]["ＣＳＳファイル名"]["value"][0];
      let date = new Date();
      let datetime = date.getFullYear() + "/"
        + (date.getMonth() + 1) + "/"
        + date.getDate() + " "
        + date.getHours() + ":"
        + date.getMinutes();

      sessionStorage.saveItem("ユーザＩＤ", userid);
      sessionStorage.saveItem("ユーザ名称", username);
      sessionStorage.saveItem("メニュー名", menuname);
      sessionStorage.saveItem("ログイン時刻", datetime);

      let weekday = ["日", "月", "火", "水", "木", "金", "土"];
      let wday = "（" + weekday[date.getDay()] + "）";

      // 西暦⇒和暦
      let w_和暦年 = date.getFullYear() - 2018;
      if (w_和暦年 == 1) {
        w_和暦年 = "元"
      }

      let jdate = "令和" + w_和暦年 + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日" + wday;
      sessionStorage.saveItem("ログイン和暦", jdate);

      // 表示メニューを設定する
      if (menuname != "") {
        this.appspec.nextname = menuname;
      }

      // ログインユーザ専用ＣＳＳファイル名をセッションストレージに保存する
      if (cssname != "") {
        sessionStorage.saveItem("ＣＳＳファイル名", this.appspec.sysname + "/Html/css/" + cssname + ".css");
      }

      $H.log("Model onチェックOfEditResponseData : end");
    }

  };
}(jQuery, Halu));
