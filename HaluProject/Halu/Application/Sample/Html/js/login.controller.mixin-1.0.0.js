/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
 * --------------------------------------------
 * ログインパターン
 * コントローラミックスイン
***********************************************/

(function ($, $H) {
  // 名前空間を設定する
  let App = $H.Library;

  /**
   * 関数を追加する
   * @mixin LoginControllerMixin
   */
  App.LoginControllerMixin = {

    /**
     * 初期処理を実行する
     * 
     * @memberof LoginControllerMixin
     * @param - なし
     */
    initExecute: function () {
      $H.log("Controller initExecute : start");

      this.ajaxExecute("init");

      $H.log("Controller initExecute : end");
    },

    /**
     * フォーカス設定イベント<br>
     * 該当位置のデータをdatasetから取得、表示する<br>
     * 
     * @memberof LoginControllerMixin
     * @param {event} event - イベント情報
     */
    onFocus: function (event) {
      $H.log("Controller onFocus : start");

      this.onControllerFocus(event);

      $H.log("Controller onFocus : end");
    },
    
    /**
     * ロストフォーカスイベント<br>
     * 該当位置の入力値チェックおよびdatasetへの値設定を行う<br>
     * 
     * @memberof LoginControllerMixin
     * @param {event} event - イベント情報
     */
    onBlur: function (event) {
      $H.log("Controller onBlur : start");

      this.onControllerBlur(event);

      $H.log("Controller onBlur : end");
    },

    /**
     * 画面表示内容をクリアし、フォーカスを"ログインＩＤ"にあてる
     * 
     * @memberof LoginControllerMixin
     * @param {event} event - イベント情報
     */
    onクリア: function (event) {
      $H.log("Controller onクリア : start");

      let dataSet = this.model.dataset.getData();
      this.model.clearDatasetJson(dataSet);
      this.view.fromJsonDataToView(dataSet);

      this.view.onクリア();

      $H.log("Controller onクリア : end");
    },

    /**
     * ログイン時のチェック処理をする
     * 
     * @memberof LoginControllerMixin
     * @param {event} event - イベント情報
     */
    onログイン: function (event) {
      $H.log("Controller onログイン : start");

      this.ajaxExecute("check");

      $H.log("Controller onログイン : end");
    },

    /**
     * 初期処理実行前にバリデーションチェック処理をする
     * 
     * @memberof LoginControllerMixin
     * @param {Object} requestData - リクエストデータ
     * @param {String} mode        - 処理モード
     */
    on初期処理OfCheckRequestData: function (requestData, mode) {
      $H.log("Controller on初期処理OfCheckRequestData : start");

      let status = this.checkRequestData(requestData);

      $H.log("Controller on初期処理OfCheckRequestData : end");
      return status;
    },

    /**
     * チェック処理実行前にバリデーションチェック処理をする
     * 
     * @memberof LoginControllerMixin
     * @param {Object} requestData - リクエストデータ
     * @param {String} mode        - 処理モード
     */
    onチェックOfCheckRequestData: function (requestData, mode) {
      $H.log("Controller onチェックOfCheckRequestData : start");

      let status = this.checkRequestData(requestData);

      $H.log("Controller onチェックOfCheckRequestData : end");
      return status;
    },

    /**
     * 「DB：テーマ」に登録されているCSSファイル名をセッションストレージに保存し、<br>
     * 画面にCSSファイルの内容を適用する<br>
     * 
     * @memberof LoginControllerMixin
     * @param {Object} responseData - レスポンスデータ
     * @param {String} mode         - 処理モード
     */
    on初期処理OfEditResponseData: function (responseData, mode) {
      $H.log("Controller on初期処理OfEditResponseData : start");

      let arg = this.model.on初期処理OfEditResponseData(responseData);
      this.view.on初期処理OfEditResponseData(responseData, arg);

      $H.log("Controller on初期処理OfEditResponseData : end");
    },

    /**
     * セッションストレージにユーザＩＤに紐づいた情報を保存し、<br>
     * 次画面へ画面表示する<br>
     * 
     * @memberof LoginControllerMixin
     * @param {Object} responseData - レスポンスデータ
     * @param {String} mode         - 処理モード
     */
    onチェックOfEditResponseData: function (responseData, mode) {
      $H.log("Controller onチェックOfEditResponseData : start");

      // セッションストレージにユーザ情報を保存する
      this.model.onチェックOfEditResponseData(responseData);

      // 次画面を表示する
      let currName = this.appspec.urlInfo[0]["app"];
      let nextArray = currName.split("/");
      nextArray[3] = this.appspec.nextname;
      let nextName = nextArray.join("/");

      this.model.clearTransitionData();
      this.model.setTransitionData(currName.slice(0, -1));
      this.model.postHtmlTransition(nextName.slice(0, -1));

      $H.log("Controller onチェックOfEditResponseData : end");
    },

    /**
     * 処理のエラー情報をダイアログで表示する
     * 
     * @memberof LoginControllerMixin
     * @param {Object} responseData - レスポンスデータ
     * @param {String} mode         - 処理モード
     */
    onErrorResponseData: function (responseData, mode) {
      $H.log("Controller onErrorResponseData : start");

      this.errorResponseData(responseData);

      $H.log("Controller onErrorResponseData : end");
    },

    /**
     * 確認ダイアログ表示後に行う処理を追加する<br>
     * ※フレームワーク自体に実装はしていないため、個別で実装する必要あり<br>
     * 
     * @memberof LoginControllerMixin
     * @param - なし
     * @returns なし
     */
    onConfirmDialogAfter: function () {
      $H.log("Controller onConfirmDialogAfter : start");

      $H.log("Controller onConfirmDialogAfter : end");
    },

    /**
     * 実行ダイアログ表示後に行う処理を追加する<br>
     * ※フレームワーク自体に実装はしていないため、個別で実装する必要あり<br>
     * 
     * @memberof LoginControllerMixin
     * @param - なし
     * @returns なし
     */
    onExecuteDialogAfter: function () {
      $H.log("Controller onExecuteDialogAfter : start");

      $H.log("Controller onExecuteDialogAfter : end");
    },

    /**
     * サーバーダイアログ表示後に行う処理を追加する<br>
     * ※フレームワーク自体に実装はしていないため、個別で実装する必要あり<br>
     * 
     * @memberof LoginControllerMixin
     * @param - なし
     * @returns なし
     */
    onServerDialogAfter: function () {
      $H.log("Controller onServerDialogAfter : start");

      $H.log("Controller onServerDialogAfter : end");
    }

  };
}(jQuery, Halu));
