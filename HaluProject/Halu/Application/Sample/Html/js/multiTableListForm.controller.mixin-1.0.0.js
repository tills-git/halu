/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
 * --------------------------------------------
 * 一覧照会(親子テーブル)パターン
 * コントローラミックスイン
***********************************************/

(function ($, $H) {
  // 名前空間を設定する
  let App = $H.Library;

  /**
   * 関数を追加する
   * @mixin MultiTableListFormControllerMixin
   */
  App.MultiTableListFormControllerMixin = {

    /**
     * ログイン情報を表示し、初期処理を実行する
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param - なし
     */
    initExecute: function () {
      $H.log("Controller initExecute : start");

      let arg = this.model.getログイン情報();
      this.view.setログイン情報(arg);
      this.on初期処理();

      $H.log("Controller initExecute : end");
    },

    /**
     * 各種初期処理ののち、前画面の情報によって対象データを判定して表示する<br>
     * ・選択画面でデータを選択した場合：選択データ<br>
     * ・メニューまたは別一覧画面から呼び出された場合：引継ぎデータ<br>
     * ・次画面から戻ってきた場合：遷移前に表示していたデータ<br>
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param - なし
     * @returns なし
     */
    on初期処理: function () {
      $H.log("Controller on初期処理 : start");

      let arg = null;
      let dataSet = null;

      arg = this.model.on初期処理();
      this.view.on初期処理(arg);

      arg = null;
      arg = this.model.on選択画面戻り();

      // 選択画面戻り処理
      if (arg["status"] == "OK") {
        dataSet = this.model.dataset.getData();
        this.view.on照会OfEditResponseData(dataSet, dataSet, "");

        // 選択画面で選択データなし
        if (arg["selected"] == "CANCEL") {
          if (arg["responseData"]["cancelfunction"] != "") {
            // 選択画面後処理関数呼出
            this.pubsub.publish(arg["responseData"]["cancelfunction"], arg);
          }
        }
        else {
          // 選択画面で選択データあり
          if (arg["responseData"]["afterfunction"] != "") {
            // 選択画面後処理関数呼出
            this.pubsub.publish(arg["responseData"]["afterfunction"], arg);
          }
        }

        $H.log("Controller on初期処理 : end");
        return;
      }

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
        dataSet = null;
        dataSet = this.model.on初期リロード前処理();
        this.view.on初期リロード前処理(dataSet);
        this.onリロード();
      }

      $H.log("Controller on初期処理 : end");
    },

    /**
     * フォーカス設定イベント<br>
     * 該当位置のデータをdatasetから取得、表示する<br>
     * 
     * @memberof MultiTableListFormControllerMixin
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
     * @memberof MultiTableListFormControllerMixin
     * @param {event} event - イベント情報
     */
    onBlur: function (event) {
      $H.log("Controller onBlur : start");

      this.onControllerBlur(event);

      $H.log("Controller onBlur : end");
    },

    /**
     * F12キー押下時、フォーカスをあてる項目を指定する
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param {event} event - イベント情報
     */
    onFocus12: function (event) {
      $H.log("Controller onFocus12 : start");

      this.view.setF12FocusItem();

      $H.log("Controller onFocus12 : end");
    },
    
    /**
     * 自画面と次画面のセッションストレージをクリアし、前画面へ遷移する
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param {event} event - イベント情報
     */
    on戻る: function (event) {
      $H.log("Controller on戻る : start");

      this.model.clearセッション情報();
      this.model.previousTransition();

      $H.log("Controller on戻る : end");
    },

    /** 
     * カレントページ情報を1ページ目に設定し、検索処理を実行する
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param {event} event - イベント情報
     */
    on検索: function (event) {
      $H.log("Controller on検索 : start");

      this.on最初のページ();

      $H.log("Controller on検索 : end");
    },

    /** 
     * ヘッダのセッションストレージおよび画面表示内容をクリアする<br>
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param {event} event - イベント情報
     */
    onクリア: function (event) {
      $H.log("Controller onクリア : start");

      let dataSet = this.model.onクリア();
      this.view.onクリア(dataSet);

      $H.log("Controller onクリア : end");
    },

    /**
     * 一覧内のデータが選択されている場合は<br>
     * 次画面の処理モードを"登録"に設定し、次画面へ遷移する<br>
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param {event} event - イベント情報
     */
    on登録: function (event) {
      $H.log("Controller on登録 : start");

      // 次画面の処理モードを設定する
      this.model.saveSessionStorageOfNextMode(this.appspec.nextname, "insert");

      // 次画面に画面遷移する
      this.model.on次画面表示(this.appspec.nextname, "insert");

      $H.log("Controller on登録 : end");
    },

    /**
     * 一覧内のデータが選択されている場合は<br>
     * 次画面の処理モードを"訂正"に設定し、次画面へ遷移する<br>
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param {event} event - イベント情報
     * @returns なし
     */
    on訂正: function (event) {
      $H.log("Controller on訂正 : start");

      if (!this.model.check行選択()) return;

      // 次画面の処理モードを設定する
      this.model.saveSessionStorageOfNextMode(this.appspec.nextname, "update");

      // 次画面に画面遷移する
      this.model.on次画面表示(this.appspec.nextname, "update");

      $H.log("Controller on訂正 : end");
    },

    /**
     * 一覧内のデータが選択されている場合は<br>
     * 次画面の処理モードを"削除"に設定し、次画面へ遷移する<br>
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param {event} event - イベント情報
     * @returns なし
     */
    on削除: function (event) {
      $H.log("Controller on削除 : start");

      if (!this.model.check行選択()) return;

      // 次画面の処理モードを設定する
      this.model.saveSessionStorageOfNextMode(this.appspec.nextname, "delete");

      // 次画面に画面遷移する
      this.model.on次画面表示(this.appspec.nextname, "delete");

      $H.log("Controller on削除 : end");
    },
    
    /**
     * 一覧内のデータが選択されている場合は<br>
     * 次画面の処理モードを"照会"に設定し、次画面へ遷移する<br>
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param {event} event - イベント情報
     * @returns なし
     */
    on照会: function (event) {
      $H.log("Controller on照会 : start");

      if (!this.model.check行選択()) return;

      // 次画面の処理モードを設定する
      this.model.saveSessionStorageOfNextMode(this.appspec.nextname, "select");

      // 次画面に画面遷移する
      this.model.on次画面表示(this.appspec.nextname, "select");

      $H.log("Controller on照会 : end");
    },

    /**
     * 一覧内のデータが選択されている場合は<br>
     * 次画面の処理モードを"複製"に設定し、次画面へ遷移する<br>
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param {event} event - イベント情報
     * @returns なし
     */
    on複製: function (event) {
      $H.log("Controller on複製 : start");

      if (!this.model.check行選択()) return;

      this.model.saveSessionStorageOfNextMode(this.appspec.nextname, "convert");

      // 次画面に画面遷移する
      this.model.on次画面表示(this.appspec.nextname, "convert");

      $H.log("Controller on複製 : end");
    },

    /**
     * カレントページ情報を1ページ目に設定し、検索処理を実行する
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param {event} event - イベント情報
     */
    on最初のページ: function (event) {
      $H.log("Controller on最初のページ : start");

      this.model.on最初のページ();
      this.ajaxExecute("select");

      $H.log("Controller on最初のページ : end");
    },
    
    /**
     * カレントページ情報を1ページ前に設定し、検索処理を実行する
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param {event} event - イベント情報
     */
    on前のページ: function (event) {
      $H.log("Controller on前のページ : start");

      this.model.on前のページ();
      this.ajaxExecute("select");

      $H.log("Controller on前のページ : end");
    },
    
    /**
     * カレントページ情報を1ページ次に設定し、検索処理を実行する
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param {event} event - イベント情報
     */
    on次のページ: function (event) {
      $H.log("Controller on次のページ : start");

      this.model.on次のページ();
      this.ajaxExecute("select");

      $H.log("Controller on次のページ : end");
    },
    
    /**
     * カレントページ情報を最後のページに設定し、検索処理を実行する
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param {event} event - イベント情報
     */
    on最後のページ: function (event) {
      $H.log("Controller on最後のページ : start");

      this.model.on最後のページ();
      this.ajaxExecute("select");

      $H.log("Controller on最後のページ : end");
    },

    /**
     * セッションストレージのカレントページ情報をデータセットへ保存し、検索処理を実行する
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param {event} event - イベント情報
     */
    onリロード: function () {
      $H.log("Controller onリロード : start");

      this.model.onリロード();
      this.ajaxExecute("select");

      $H.log("Controller onリロード : end");
    },

    /**
     * クリックしたテーブルと行の情報をセッションストレージに保存し、<br>
     * 選択行の背景色を変更する<br>
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param {event} event  - イベント情報
     * @param {object} arg   - クリック行情報(datasetのindex、セレクタ名)
     */
    onテーブル行クリック: function (event, arg) {
      $H.log("Controller onテーブル行クリック : start");

      let row = event.currentTarget.parentNode.rowIndex;
      let idName = event.currentTarget.offsetParent.id;
      let selectArg = { クリック行: row, セレクタ名: idName };
      let status = this.model.onテーブル行クリック(selectArg);
      if (status == "OK") {
        this.view.onテーブル行クリック(selectArg);
      }

      $H.log("Controller onテーブル行クリック : end");
    },

    /**
     * セレクトボックス選択変更イベント<br>
     * 変更後の選択値をデータセットへ反映し、戻り値として返す<br>
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param  {event} event - イベント情報
     * @return {String} セレクトボックス選択値 
     */
    onChangeSelectBox: function (event) {
      $H.log("Controller onChangeSelectBox : start");

      let targetValue = this.model.onChangeSelectBox(event, this.appspec.selectbox);

      $H.log("Controller onChangeSelectBox : end");
      return targetValue;
    },

    /**
     * テーブル形式のセレクトボックス選択変更イベント<br>
     * 変更後の選択値をデータセットへ反映し、戻り値として返す<br>
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param  {event} event - イベント情報
     * @return {String} セレクトボックス選択値 
     */
    onChangeTableSelectBox: function (event) {
      $H.log("Controller onChangeTableSelectBox : start");

      let row = event.currentTarget.parentNode.parentNode.rowIndex;
      let targetValue = this.model.onChangeTableSelectBox(event, row, this.appspec.selectbox);

      $H.log("Controller onChangeTableSelectBox : end");
      return targetValue;
    },

    /**
     * チェックボックス値変更イベント<br>
     * 変更後の値をデータセットへ反映し、戻り値として返す<br>
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param  {event} event - イベント情報
     * @return {boolean} チェックボックスの値 
     */
    onChangeCheckBox: function (event) {
      $H.log("Controller onChangeCheckBox : start");

      let checkValue = this.model.onChangeTableCheckBox(event, this.appspec.checkboxDetail);

      $H.log("Controller onChangeCheckBox : end");
      return checkValue;
    },
    
    /**
     * チェックボックス(テーブル形式)値変更イベント<br>
     * 変更後の値をデータセットへ反映し、戻り値として返す<br>
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param  {event} event - イベント情報
     * @returns {boolean} チェックボックスの値 
     */
    onChangeTableCheckBox: function (event) {
      $H.log("Controller onChangeTableCheckBox : start");

      let row = event.currentTarget.parentNode.parentNode.rowIndex;
      let checkValue = this.model.onChangeTableCheckBox(event, row, this.appspec.checkboxDetail);

      $H.log("Controller onChangeTableCheckBox : end");
      return checkValue;
    },

    /**
     * 初期処理に使用するリクエストデータのバリデーションチェック処理を行う
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param {object} requestData - リクエストデータ
     * @param {string} mode - 処理モード
     * @returns {object} チェック結果
     */
    on初期処理OfCheckRequestData: function (requestData, mode) {
      $H.log("Controller on初期処理OfCheckRequestData : start");

      let status = this.checkRequestData(requestData);

      $H.log("Controller on初期処理OfCheckRequestData : end");
      return status;
    },
    
    /**
     * 照会処理に使用するリクエストデータのバリデーションチェック処理を行う
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param {object} requestData - リクエストデータ
     * @param {string} mode - 処理モード
     * @returns {object} チェック結果
     */
    on照会OfCheckRequestData: function (requestData, mode) {
      $H.log("Controller on照会OfCheckRequestData : start");

      let status = this.checkRequestData(requestData);

      $H.log("Controller on照会OfCheckRequestData : end");
      return status;
    },

    /**
     * 初期処理のレスポンスデータと前画面から受け取った情報を取得し、<br>
     * セレクトボックスの初期表示と照会処理を実行する<br>
     * 次画面から戻ってきた場合はリロード処理を行う<br>
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param {object} responseData - レスポンスデータ
     * @param {object} mode - 処理モード
     */
    on初期処理OfEditResponseData: function (responseData, mode) {
      $H.log("Controller on初期処理OfEditResponseData : start");

      let dataSet = null;
      dataSet = this.model.on初期処理OfEditResponseData(responseData, mode);

      // セレクトボックスの一括初期表示
      this.onShowSelectBoxAll(responseData, this.appspec.selectbox);

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
        dataSet = null;
        dataSet = this.model.on初期リロード前処理();
        this.view.on初期リロード前処理(dataSet);
        this.onリロード();
      }

      $H.log("Controller on初期処理OfEditResponseData : end");
    },
    
    /**
     * 照会処理のレスポンスデータの内容をデータセットへ設定し、画面へ表示する<br>
     * 処理モードによってクリック行情報の保存または削除を行う<br>
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param {object} responseData - レスポンスデータ
     * @param {object} mode - 処理モード
     */
    on照会OfEditResponseData: function (responseData, mode) {
      $H.log("Controller on照会OfEditResponseData : start");

      let dataSet = this.model.on照会OfEditResponseData(responseData, mode);
      this.view.on照会OfEditResponseData(dataSet, responseData, mode);

      // セッションストレージに識別名を保存する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      let selectMode = sessionStorage.loadItem("処理モード");
      if (selectMode != "delete") {
        let clickRow = sessionStorage.loadItem("クリック行");
        if (clickRow === undefined) {
        }
        else {
          let arg = { クリック行: parseInt(clickRow, 10) };
          this.model.onテーブル行クリック(arg);
          this.view.onテーブル行クリック(arg);
        }
      }
      else {
        sessionStorage.deleteItem("クリック行");
      }
      sessionStorage.saveItem("処理モード", "");

      this.view.setFirstFocusItem();

      $H.log("Controller on照会OfEditResponseData : end");
    },

    /**
     * 処理のエラー情報をダイアログで表示する
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param {object} responseData - レスポンスデータ
     * @param {object} mode - 処理モード
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
     * @memberof MultiTableListFormControllerMixin
     * @param - なし
     */
    onConfirmDialogAfter: function () {
      $H.log("Controller onConfirmDialogAfter : start");

      $H.log("Controller onConfirmDialogAfter : end");
    },
    
    /**
     * 実行ダイアログ表示後に行う処理を追加する<br>
     * ※フレームワーク自体に実装はしていないため、個別で実装する必要あり<br>
     * 
     * @memberof MultiTableListFormControllerMixin
     * @param - なし
     */
    onExecuteDialogAfter: function () {
      $H.log("Controller onExecuteDialogAfter : start");

      $H.log("Controller onExecuteDialogAfter : end");
    },
    
    /**
     * サーバーダイアログ表示後、先頭項目にフォーカスを設定する<br>
     * ※フレームワーク自体に実装はしていないため、個別で実装する必要あり<br>
     *
     * @memberof MultiTableListFormControllerMixin
     * @param - なし
     */
    onServerDialogAfter: function () {
      $H.log("Controller onServerDialogAfter : start");

      this.view.setFirstFocusItem();

      $H.log("Controller onServerDialogAfter : end");
    }

  };
}(jQuery, Halu));
