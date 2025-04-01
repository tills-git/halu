/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
 * --------------------------------------------
 * タブメニューパターン
 * モデルミックスイン
***********************************************/

(function ($, $H) {
  // 名前空間を設定する
  let App = $H.Library;

  /**
   * 関数を追加する
   * @mixin TabMenuModelMixin
   */
  App.TabMenuModelMixin = {

    /**
     * 処理開始時に行う処理を追加する
     * 
     * @memberof TabMenuModelMixin
     * @param - なし
     */
    initExecute: function () {
      $H.log("Model initExecute : start");

      $H.log("Model initExecute : end");
    },

    /**
     * セッションストレージからログイン情報をデータセットに設定する
     * 
     * @memberof TabMenuModelMixin
     * @param - なし
     * @returns {object} ユーザ名称、ログイン時刻、ログイン和暦
     */
    getログイン情報: function () {
      $H.log("Model getログイン情報 : start");

      // セッションストレージに識別名を保存する
      sessionStorage.setIdName(this.appspec.sysname + ".Login");

      let username = sessionStorage.loadItem("ユーザ名称");
      let datetime = sessionStorage.loadItem("ログイン時刻");
      let jdate = sessionStorage.loadItem("ログイン和暦");
      let arg = { ユーザ名称: username, ログイン時刻: datetime, ログイン和暦: jdate };

      // ログイン情報をログインレコードに設定する
      let dataSet = this.dataset.getData();
      let loginRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, "login");
      if (loginRecord) {
        loginRecord["record"]["ユーザＩＤ"]["value"][0] = sessionStorage.loadItem("ユーザＩＤ");
        loginRecord["record"]["ユーザ名称"]["value"][0] = sessionStorage.loadItem("ユーザ名称");
      }

      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);

      $H.log("Model getログイン情報 : end");
      return arg;
    },

    /**
     * 次画面の情報をセッションストレージに保存する
     * 
     * @memberof TabMenuModelMixin
     * @param {object} arg - 次画面名
     */
    onメニュー項目: function (arg) {
      $H.log("Model onメニュー項目 : start");

      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      sessionStorage.saveItem("次画面名", arg["次画面名"]);

      $H.log("Model onメニュー項目 : end");
    },

    /**
     * 初期処理のリクエストデータへメニュー起動情報とローカル端末情報を設定する
     * 
     * @memberof TabMenuModelMixin
     * @param {object} requestData - リクエストデータ
     * @param {string} mode - 処理モード
     * @returns {boolean} true:チェックOK
     */
    on初期処理OfCheckRequestData: function (requestData, mode) {
      $H.log("Model on初期処理OfCheckRequestData : start");

      let headerRecord = this.appspec.getJSONChunkByIdAtRecords(requestData, "header")["record"];

      headerRecord["ユーザＩＤ"]["value"][0] = this.getUserID();
      headerRecord["画面名"]["value"][0] = "ログイン（メニュー開始）";
      this.setDisplayInfo(headerRecord);

      $H.log("Model on初期処理OfCheckRequestData : end");
      return true;
    },

    /**
     * ユーザ情報リクエストデータへ次画面名とローカル端末情報を設定する
     * 
     * @memberof TabMenuModelMixin
     * @param {object} requestData - リクエストデータ
     * @param {string} mode - 処理モード
     * @returns {boolean} true:チェックOK
     */
    onユーザ情報OfCheckRequestData: function (requestData, mode) {
      $H.log("Model onユーザ情報OfCheckRequestData : start");

      let headerRecord = this.appspec.getJSONChunkByIdAtRecords(requestData, "header")["record"];

      headerRecord["ユーザＩＤ"]["value"][0] = this.getUserID();
      headerRecord["画面名"]["value"][0] = this.getNextGuiName();
      this.setDisplayInfo(headerRecord);

      $H.log("Model onユーザ情報OfCheckRequestData : end");
      return true;
    },

    /**
     * 終了リクエストデータへメニュー終了情報とローカル端末情報を設定する
     * 
     * @memberof TabMenuModelMixin
     * @param {object} requestData - リクエストデータ
     * @param {string} mode - 処理モード
     * @returns {boolean} true:チェックOK
     */
    on終了処理OfCheckRequestData: function (requestData, mode) {
      $H.log("Model on終了処理OfCheckRequestData : start");

      let headerRecord = this.appspec.getJSONChunkByIdAtRecords(requestData, "header")["record"];

      headerRecord["ユーザＩＤ"]["value"][0] = this.getUserID();
      headerRecord["画面名"]["value"][0] = "ログオフ（メニュー終了）";
      this.setDisplayInfo(headerRecord);

      $H.log("Model on終了処理OfCheckRequestData : end");
      return true;
    },

    /**
     * 次画面名を取得し、呼び出し元へ返す
     * 
     * @memberof TabMenuModelMixin
     * @param {object} responseData - レスポンスデータ
     * @param {object} mode - 処理モード
     * @returns {string} 次画面名
     */
    onユーザ情報OfEditResponseData: function (responseData, mode) {
      $H.log("Model onユーザ情報OfEditResponseData : start");

      let nextGuiName = this.getNextGuiName();

      $H.log("Model onユーザ情報OfEditResponseData : end");
      return nextGuiName;
    },

    /**
     * セッションストレージのログイン情報をクリアする
     * 
     * @memberof TabMenuModelMixin
     * @param - なし
     */
    on終了処理OfEditResponseData: function () {
      $H.log("Model on終了処理OfEditResponseData : start");

      //  セッションストレージ（ログイン情報）をクリアする
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      sessionStorage.deleteAll("");

      sessionStorage.setIdName(this.appspec.sysname + ".Login");
      sessionStorage.deleteAll("");

      $H.log("Model on終了処理OfEditResponseData : end");
    },

    /**
     * ユーザＩＤを取得し、呼び出し元へ返す
     * 
     * @memberof TabMenuModelMixin
     * @param  - なし
     * @returns {string} ユーザＩＤ
     */
    getUserID: function () {
      $H.log("Model getUserID : start");

      sessionStorage.setIdName(this.appspec.sysname + ".Login");
      let userid = sessionStorage.loadItem("ユーザＩＤ");

      $H.log("Model getUserID : end");
      return userid;
    },

    /**
     * 次画面名を呼び出し元へ返す
     * 
     * @memberof TabMenuModelMixin
     * @param - なし
     * @returns {string} nextGuiName - 次画面名
     */
    getNextGuiName: function () {
      $H.log("Model getNextGuiName : start");

      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      let nextGuiName = sessionStorage.loadItem("次画面名");

      $H.log("Model getNextGuiName : end");
      return nextGuiName;
    },

    /**
     * ヘッダ情報にローカル端末情報を設定する
     * 
     * @memberof TabMenuModelMixin
     * @param {object} headerRecord - ヘッダ情報
     * @returns {object} 更新後ヘッダ情報
     */
    setDisplayInfo: function (headerRecord) {
      $H.log("Model setDisplayInfo : start");

      headerRecord["host"]["value"][0] = location.host;
      headerRecord["hostname"]["value"][0] = location.hostname;
      headerRecord["port"]["value"][0] = location.port;
      headerRecord["request"]["value"][0] = location.pathname;
      headerRecord["code"]["value"][0] = navigator.appCodeName;
      headerRecord["browser"]["value"][0] = navigator.appName;
      headerRecord["version"]["value"][0] = navigator.appVersion;
      headerRecord["lang"]["value"][0] = navigator.language;
      headerRecord["platform"]["value"][0] = navigator.platform;
      headerRecord["useragent"]["value"][0] = navigator.userAgent;
      headerRecord["referer"]["value"][0] = document.referrer;
      headerRecord["domain"]["value"][0] = document.domain;
      headerRecord["screen_w"]["value"][0] = screen.width;
      headerRecord["screen_h"]["value"][0] = screen.height;
      headerRecord["screen_col"]["value"][0] = screen.colorDepth + "Bit";

      $H.log("Model setDisplayInfo : end");
      return headerRecord;
    }

  };
}(jQuery, Halu));