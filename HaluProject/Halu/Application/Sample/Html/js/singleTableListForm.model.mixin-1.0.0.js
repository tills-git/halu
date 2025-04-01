/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
 * --------------------------------------------
 * 一覧登録(単一テーブル)パターン
 * モデルミックスイン 
***********************************************/

(function ($, $H) {
  // 名前空間を設定する
  let App = $H.Library;

  /**
   * 関数を追加する
   * @mixin SingleTableListFormModelMixin
   */
  App.SingleTableListFormModelMixin = {

    /**
     * データセットを取得し、値をクリアする
     * 
     * @memberof SingleTableListFormModelMixin
     */
    initExecute: function () {
      $H.log("Model initExecute : start");

      let dataSet = this.dataset.getData();
      this.clearDatasetJson(dataSet);

      $H.log("Model initExecute : end");
    },

    /**
     * セッションストレージからログイン情報を取得し、データセットへ設定する
     * 
     * @memberof SingleTableListFormModelMixin
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
     * 処理なし ※初期処理を追加したい場合に活用する
     * 
     * @memberof SingleTableListFormModelMixin
     * @param - なし
     * @returns {object} なし
     */
    on初期処理: function () {
      $H.log("Model on初期処理 : start");

      let arg = {};

      $H.log("Model on初期処理 : end");
      return arg;
    },

    /**
     * 自画面のセッションストレージをクリアする
     * 
     * @memberof SingleTableListFormModelMixin
     * @param - なし
     */
    clearセッション情報: function () {
      $H.log("Model clearセッション情報 : start");

      // セッションストレージに識別名を保存する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      sessionStorage.deleteAll("");

      $H.log("Model clearセッション情報 : end");
    },

    /**
     * セッションストレージとデータセットに入っている画面ヘッダー情報をクリアする<br>
     * 
     * @memberof SingleTableListFormModelMixin
     * @param - なし
     * @returns {object} データセット
     */
    onクリア: function () {
      $H.log("Model onクリア : start");

      // データセットを設定する
      let dataSet = this.dataset.getData();

      this.clearSessionStorageOfKeyInfo(this.appspec.sessionStorageHeaderKey);
      this.setFromSessionStorageToDatasetOfKeyInfo(dataSet, this.appspec.sessionStorageHeaderKey);

      $H.log("Model onクリア : end");
      return dataSet;
    },

    /**
     * 指定された行に空行を追加する
     *  
     * @memberof SingleTableListFormModelMixin
     * @param {number} index - 行のindex
     * @returns {object} データセット
     */
    on行追加クリック: function (index) {
      $H.log("Model on行追加クリック : start");

      // デフォルトラインを設定する
      let dataSet = this.dataset.getData();
      let detailRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, "detail");
      this.insertRowOfDetailRecord(detailRecord, index);

      $H.log("Model on行追加クリック : end");
      return dataSet;
    },

    /**
     * データセットを取得し、セッションストレージ(画面明細キー定義)へ保存する<br>
     * 引数で渡ってきた自画面名と行のindexも合わせてセッションに保存する<br>
     * 
     * @memberof SingleTableListFormModelMixin
     * @param {String} name  - 自画面名
     * @param {number} index - 行のindex
     */
    on行チェック: function (name, index) {
      $H.log("Model on行チェック : start");

      // セッションストレージに識別名を保存する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);

      // データセットを取得する
      let dataSet = this.dataset.getData();

      // 画面明細キー定義情報をセッションストレージに保存する
      let datasetID = this.appspec.sessionStorageDetailKey[0]["datasetid"];
      let datasetRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, datasetID)["record"];
      let maxSize = this.appspec.sessionStorageDetailKey[0]["dataname"].length;
      for (let i = 0; i < maxSize; i++) {
        let itemName = this.appspec.sessionStorageDetailKey[0]["dataname"][i]
        sessionStorage.saveItem(itemName, datasetRecord[itemName]["value"][index]);
      }

      sessionStorage.saveItem("クリック名", name);
      sessionStorage.saveItem("クリック行", index);

      $H.log("Model on行チェック : end");
    },

    /**
     * データセットを取得し、セッションストレージ(画面明細キー定義)へ保存する<br>
     * 
     * @memberof SingleTableListFormModelMixin
     * @param {Object} arg - 画面情報（クリック行のindex）
     */
    onテーブル行クリック: function (arg) {
      $H.log("Model onテーブル行クリック : start");

      let clickRow = arg["クリック行"];

      // セッションストレージに識別名を保存する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);

      // データセットを取得する
      let dataSet = this.dataset.getData();

      // 画面明細キー定義情報をセッションストレージに保存する
      let datasetID = this.appspec.sessionStorageDetailKey[0]["datasetid"];
      let datasetRecord = this.appspec.getJSONChunkByIdAtRecords(dataSet, datasetID)["record"];
      let maxSize = this.appspec.sessionStorageDetailKey[0]["dataname"].length;
      for (let i = 0; i < maxSize; i++) {
        let itemName = this.appspec.sessionStorageDetailKey[0]["dataname"][i]
        sessionStorage.saveItem(itemName, datasetRecord[itemName]["value"][clickRow]);
      }

      $H.log("Model onテーブル行クリック : end");
    },

    /**
     * 次画面への引き渡しデータのチェックを行い、<br>
     * 自画面のキー定義情報および次画面への引き渡しデータをセッションストレージに保存して<br>
     * 画面遷移を行う<br>
     * 
     * @memberof SingleTableListFormModelMixin
     * @param {String} nextGui - 次画面名
     * @param {String} mode    - 処理モード 
     */
    on次画面表示: function (nextGui, mode) {
      $H.log("Model on次画面表示 : start");

      // 次画面への引き渡しデータをチェックする
      let arg = this.checkNextStorageData();
      if (arg["status"] != "OK") {
        this.pubsub.publish("alertDialog", arg);
        return;
      }

      // 自画面のキー定義情報をセッションストレージに保存する
      this.saveSessionStorage();

      // 次画面への引き渡しデータを設定する
      this.setNextStorageData(nextGui);

      let currName = this.appspec.urlInfo[0]["app"];
      let nextArray = currName.split("/");
      nextArray[3] = nextGui;
      let nextName = nextArray.join("/");

      this.setTransitionData(currName.slice(0, -1));
      this.postHtmlTransition(nextName.slice(0, -1));

      $H.log("Model on次画面表示 : end");
    },

    /**
     * 照会処理実行前にデータセットからリクエストデータへ設定を行う<br>
     * ※on実行OfCheckRequestData処理を実施<br>
     * 
     * @memberof SingleTableListFormModelMixin
     * @param {Object} requestData - リクエストデータ
     * @param {String} mode        - 処理モード 
     * @returns {boolean} 設定結果
     */
    on照会OfCheckRequestData: function (requestData, mode) {
      $H.log("Model on照会OfCheckRequestData : start");

      this.on実行OfCheckRequestData(requestData, mode);

      $H.log("Model on照会OfCheckRequestData : end");
      return true;
    },

    /**
     * 実行処理前にデータセットからリクエストデータへ設定を行う
     * 
     * @memberof SingleTableListFormModelMixin
     * @param {Object} requestData - リクエストデータ
     * @param {String} mode        - 処理モード 
     * @returns {boolean} 設定結果
     * 
     */
    on実行OfCheckRequestData: function (requestData, mode) {
      $H.log("Model on実行OfCheckRequestData : start");

      // データセットからリクエストデータを設定する
      let dataSet = this.dataset.getData();
      this.setDatasetToJsonRecordsInDeleteLine(dataSet, requestData);

      $H.log("Model on実行OfCheckRequestData : end");
      return true;
    },

    /**
     * 処理なし（リナンバリング処理の為、データセットを再度リクエストデータには設定してない）
     * 
     * @memberof SingleTableListFormModelMixin
     * @param {Object} requestData - リクエストデータ
     * @param {String} mode        - 処理モード 
     * @returns {boolean} 設定結果
     */
    on表示順再設定OfCheckRequestData: function (requestData, mode) {
      $H.log("Model on表示順再設定OfCheckRequestData : start");

      $H.log("Model on表示順再設定OfCheckRequestData : end");
      return true;
    },

    /**
     * 初期処理実行後、レスポンスデータからデータセットへ設定を行う
     * 
     * @memberof SingleTableListFormModelMixin
     * @param {Object} responseData - レスポンスデータ
     * @returns {Object} データセット
     */
    on初期処理OfEditResponseData: function (responseData) {
      $H.log("Model on初期処理OfEditResponseData : start");

      let dataSet = this.dataset.getData();
      this.setJsonRecordsToDataset(responseData, dataSet, this.pubsub);

      $H.log("Model on初期処理OfEditResponseData : end");
      return dataSet;
    },

    /**
     * 照会処理実行後、レスポンスデータからデータセットへ設定を行う
     * 
     * @memberof SingleTableListFormModelMixin
     * @param {Object} responseData - レスポンスデータ
     * @returns {Object} データセット
     */
    on照会OfEditResponseData: function (responseData) {
      $H.log("Model on照会OfEditResponseData : start");

      let dataSet = this.dataset.getData();
      this.setJsonRecordsToDataset(responseData, dataSet, this.pubsub);

      $H.log("Model on照会OfEditResponseData : end");
      return dataSet;
    },
    
    /**
     * 実行処理実行後、レスポンスデータからデータセットへ設定を行う<br>
     * ※on照会OfEditResponseData処理を実施<br>
     * 
     * @memberof SingleTableListFormModelMixin
     * @param {Object} responseData - レスポンスデータ
     */
    on実行OfEditResponseData: function (responseData) {
      $H.log("Model on実行OfEditResponseData : start");

      this.on照会OfEditResponseData(responseData);

      $H.log("Model on実行OfEditResponseData : end");
    },

    /**
     * サーバー処理確認ダイアログを表示する
     * 
     * @memberof SingleTableListFormModelMixin
     * @param {Object} responseData - レスポンスデータ
     */
    onサーバ処理確認ダイアログ: function (responseData) {
      $H.log("Model onサーバ処理確認ダイアログ : start");

      let status = responseData["message"]["status"];
      let msg = responseData["message"]["msg"];
      let arg = { title: "サーバ処理確認", status: status, message: msg };
      this.pubsub.publish("serverDialog", arg);

      $H.log("Model onサーバ処理確認ダイアログ : end");
    }

  };
}(jQuery, Halu));
