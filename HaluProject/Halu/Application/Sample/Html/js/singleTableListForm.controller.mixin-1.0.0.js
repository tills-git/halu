/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
 * --------------------------------------------
 * 一覧登録(単一テーブル)パターン
 * コントローラミックスイン 
***********************************************/

(function ($, $H) {
  // 名前空間を設定する
  let App = $H.Library;

  /**
   * 関数を追加する
   * @mixin SingleTableListFormControllerMixin
   */
  App.SingleTableListFormControllerMixin = {

    /**
     * ログイン情報を表示し、初期処理を実行する
     * 
     * @memberof SingleTableListFormControllerMixin
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
     * 選択画面からの戻り処理を実行<br>
     * 前画面からの引継ぎデータを取得後、検索処理を実行する
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param - なし
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

      // 画面ヘッダキー定義の値をdataSetに設定する
      // メニュー画面から遷移した時：なにも処理されない
      // 遷移先画面から戻って来た時：遷移前の値が設定される
      this.model.setMyUIStorageData();

      // 初期処理：前画面の引き継ぎデータをデータセットに設定する
      let status = this.model.setFromBeforeStorageDataToDataset();
      if (status == "OK") {
        dataSet = null;
        dataSet = this.model.dataset.getData();
        this.view.fromJsonDataToView(dataSet);
      }

      this.ajaxExecute("select");

      $H.log("Controller on初期処理 : end");
    },

    /**
     * フォーカス設定イベント<br>
     * 該当位置のデータをdatasetから取得、表示する
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param {event} event - イベント情報
     */
    onFocus: function (event) {
      $H.log("Controller onFocus : start");

      this.onControllerFocus(event);

      $H.log("Controller onFocus : end");
    },
    
    /**
     * ロストフォーカスイベント<br>
     * 該当位置の入力値チェックおよびdatasetへの値設定を行う
     * 
     * @memberof SingleTableListFormControllerMixin
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
     * @memberof SingleTableListFormControllerMixin
     * @param {event} event - イベント情報
     */
    onFocus12: function (event) {
      $H.log("Controller onFocus12 : start");

      this.view.setF12FocusItem();

      $H.log("Controller onFocus12 : end");
    },
    
    /**
     * セッションに保持している情報をクリアし、前画面に戻る
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param {event} event - イベント情報
     */
    on戻る: function (event) {
      $H.log("Controller on戻る : start");

      this.model.clearセッション情報();
      this.model.previousTransition();

      $H.log("Controller on戻る : end");
    },
    
    /**
     * 実行処理を行う
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param {event} event - イベント情報
     */
    on実行: function (event) {
      $H.log("Controller on実行 : start");

      this.ajaxExecute("execute");

      $H.log("Controller on実行 : end");
    },
    
    /**
     * 検索処理を行う
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param {event} event - イベント情報
     */
    on検索: function (event) {
      $H.log("Controller on検索 : start");

      this.ajaxExecute("select");

      $H.log("Controller on検索 : end");
    }, 
    
    /**
     * ヘッダのセッションストレージおよび画面表示内容をクリアする<br>
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param {event} event - イベント情報
     */
    onクリア: function (event) {
      $H.log("Controller onクリア : start");

      let dataSet = this.model.onクリア();
      this.view.onクリア(dataSet);

      $H.log("Controller onクリア : end");
    },

    /**
     * カーソルが当たってる行のindexを取得し、最後尾に空行を追加する
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param {event} event - イベント情報
     * @param {*}     arg   - 画面情報
     */
    on行追加クリック: function (event, arg) {
      $H.log("Controller on行追加クリック : start");

      // 明細テーブルの最大値を取得する
      let rowMax = document.querySelector('#mainTable').rows.length;
      
      // 最後尾に空行を挿入する
      let dataSet = this.model.on行追加クリック(rowMax + 1);
      this.view.on行追加クリック(dataSet);
      $('#mainTable tr').eq(rowMax).find('td:nth-child(2) input').focus();

      $H.log("Controller on行追加クリック : end");
    },

    /**
     * 任意の項目をリナンバリングする
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param {event} event - イベント情報
     * @param {*}     arg   - 画面情報
     */
    on表示順再設定: function (event, arg) {
      $H.log("Controller on表示順再設定 : start");

      this.ajaxExecute("renumber");

      $H.log("Controller on表示順再設定 : end");
    },

    /**
     * セレクトボックスの値を変更した場合、データセットに格納した値を元に再設定する
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param {event} event - イベント情報
     */
    onChangeSelectBox: function (event) {
      $H.log("Controller onChangeSelectBox : start");

      let targetValue = this.model.onChangeSelectBox(event, this.appspec.selectbox);

      $H.log("Controller onChangeSelectBox : end");
      return targetValue;
    },
    
    /**
     * 明細データに存在するセレクトボックスの値を変更した場合、<br>
     * データセットに格納した値を元に再設定する
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param {event} event - イベント情報
     */
    onChangeTableSelectBox: function (event) {
      $H.log("Controller onChangeTableSelectBox : start");

      let row = event.currentTarget.parentNode.parentNode.rowIndex;
      let targetValue = this.model.onChangeTableSelectBox(event, row, this.appspec.selectbox);

      $H.log("Controller onChangeTableSelectBox : end");
      return targetValue;
    },
    
    /**
     * ヘッダー部のチェックボックスをクリック後、<br>
     * チェックボックスのON/OFFの情報をデータセットに設定する
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param {event} event - イベント情報
     */
    onChangeCheckBox: function (event) {
      $H.log("Controller onChangeCheckBox : start");

      let checkValue = this.model.onChangeTableCheckBox(event, this.appspec.checkboxDetail);

      $H.log("Controller onChangeCheckBox : end");
      return checkValue;
    },
    
    /**
     * テーブルのチェックボックスをクリック後、<br>
     * 選択されたチェックボックスのON/OFFの情報をデータセットに設定する
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param {event} event - イベント情報
     */
    onChangeTableCheckBox: function (event) {
      $H.log("Controller onChangeTableCheckBox : start");

      let row = event.currentTarget.parentNode.parentNode.rowIndex;
      let checkValue = this.model.onChangeTableCheckBox(event, row, this.appspec.checkboxDetail);

      $H.log("Controller onChangeTableCheckBox : end");
      return checkValue;
    },
    
    /**
     * テーブルの削除チェックボックスをクリック後、<br>
     * 選択されたチェックボックスのON/OFFの情報をデータセットに設定する
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param {event} event - イベント情報
     * @param {Object} arg  - 画面情報
     */
    on削除: function (event, arg) {
      $H.log("Controller on削除 : start");

      let row = event.currentTarget.parentNode.parentNode.rowIndex;
      let checkValue = this.model.onChangeTableCheckBox(event, row, this.appspec.checkboxDetail);

      $H.log("Controller on削除 : end");
      return checkValue;
    },
    
    /**
     * 選択した行をセッションストレージに保存した後、<br>
     * 選択した行をチェックONにし、選択行以外をチェックOFFにする
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param {event} event - イベント情報
     * @param {Object} arg  - 画面情報
     */
    on行チェック: function (event, arg) {
      $H.log("Controller on行チェック : start");

      let name = event.currentTarget.name;
      let row = event.currentTarget.parentNode.parentNode.rowIndex;
      this.model.on行チェック(name, row);
      this.view.on行チェック(name, row);

      $H.log("Controller on行チェック : end");
    },

    /**
     * テーブルの選択行の情報をセッションストレージに保存し、<br>
     * 選択行の背景色を変更する
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param {event} event - イベント情報
     * @param {Object} arg  - 画面情報
     */
    onテーブル行クリック: function (event, arg) {
      $H.log("Controller onテーブル行クリック : start");

      let row = event.currentTarget.parentNode.rowIndex;
      let idName = event.currentTarget.offsetParent.id;
      let selectArg = { クリック行: row, セレクタ名: idName };
      this.model.onテーブル行クリック(selectArg);
      this.view.onテーブル行クリック(selectArg);

      $H.log("Controller onテーブル行クリック : end");
    },

    /**
     * 初期処理実行前にデータチェックをする
     * 
     * @memberof SingleTableListFormControllerMixin
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
     * 検索処理実行前にデータセットからリクエストデータを設定し、<br>
     * リクエストデータに対しバリデーションチェック処理をする
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param {Object} requestData - リクエストデータ
     * @param {String} mode        - 処理モード
     */
    on照会OfCheckRequestData: function (requestData, mode) {
      $H.log("Controller on照会OfCheckRequestData : start");

      let status = this.model.on照会OfCheckRequestData(requestData, mode);
      if (status) {
        status = this.checkRequestData(requestData);
      }

      $H.log("Controller on照会OfCheckRequestData : end");
      return status;
    },
    
    /**
     * 実行処理実行前にデータセットからリクエストデータを設定し、<br>
     * リクエストデータに対しバリデーションチェック処理をする
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param {Object} requestData - リクエストデータ
     * @param {String} mode        - 処理モード
     */
    on実行OfCheckRequestData: function (requestData, mode) {
      $H.log("Controller on実行OfCheckRequestData : start");

      let status = this.model.on実行OfCheckRequestData(requestData, mode);
      if (status) {
        status = this.checkRequestData(requestData);
      }

      $H.log("Controller on実行OfCheckRequestData : end");
      return status;
    },
    
    /**
     * リナンバリング処理実行前に<br>
     * リクエストデータに対しバリデーションチェック処理をする
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param {Object} requestData - リクエストデータ
     * @param {String} mode        - 処理モード
     */
    on表示順再設定OfCheckRequestData: function (requestData, mode) {
      $H.log("Controller on表示順再設定OfCheckRequestData : start");

      let status = this.model.on表示順再設定OfCheckRequestData(requestData, mode);
      if (status) {
        status = this.checkRequestData(requestData);
      }

      $H.log("Controller on表示順再設定OfCheckRequestData : end");
      return status;
    },

    /**
     * 初期処理実行後、<br>
     * レスポンスデータからデータセットに値を設定し、セレクトボックスの一括初期表示を設定します。<br>
     * 前画面からの引継ぎデータを取得後、検索処理を実行する
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param {Object} responseData - レスポンスデータ
     * @param {String} mode         - 処理モード
     */
    on初期処理OfEditResponseData: function (responseData, mode) {
      $H.log("Controller on初期処理OfEditResponseData : start");

      let dataSet = this.model.on初期処理OfEditResponseData(responseData, mode);

      // セレクトボックスの一括初期表示
      this.onShowSelectBoxAll(responseData, this.appspec.selectbox);

      // 画面ヘッダキー定義の値をdataSetに設定する
      // メニュー画面から遷移した時：なにも処理されない
      // 遷移先画面から戻って来た時：遷移前の値が設定される
      this.model.setMyUIStorageData();

      this.ajaxExecute("select");

      $H.log("Controller on初期処理OfEditResponseData : end");
    },
    
    /**
     * 検索処理実行後、レスポンスデータからデータセットに値を設定する<br>
     * また、以下の画面表示内容を実施<br>
     *   ・テーブルに削除チェックボックスが存在する場合、全てチェックOFFにする<br>
     *   ・セッションストレージに明細テーブルの行番を保持している場合、<br>
     *     選択行の背景色を変更し、セッションストレージにデータを保存する<br>
     *   ・最初の項目にフォーカスを設定しなおす<br>
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param {Object} responseData - レスポンスデータ
     * @param {String} mode         - 処理モード
     */
    on照会OfEditResponseData: function (responseData, mode) {
      $H.log("Controller on照会OfEditResponseData : start");

      let dataSet = this.model.on照会OfEditResponseData(responseData, mode);
      this.view.on照会OfEditResponseData(dataSet, responseData, mode);

      // セッションストレージに識別名を保存する
      sessionStorage.setIdName(this.appspec.sysname + "." + this.appspec.name);
      let row = sessionStorage.loadItem("クリック行");
      if (row === undefined) {
      }
      else {
        let arg = { クリック行: row };
        this.view.onテーブル行クリック(arg);

        let name = sessionStorage.loadItem("クリック名");
        if (name === undefined) {
        }
        else {
          this.model.on行チェック(name, row);
          this.view.on行チェック(name, row);
        }
      }

      this.view.setFirstFocusItem();

      $H.log("Controller on照会OfEditResponseData : end");
    },
    
    /**
     * 実行処理後、レスポンスデータからデータセットに値を設定する<br>
     * また、以下の画面表示内容を実施<br>
     *   ・テーブルに削除チェックボックスが存在する場合、全てチェックOFFにする<br>
     *   ・レスポンスデータに設定されているメッセージをダイアログに表示する<br>
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param {Object} responseData - レスポンスデータ
     * @param {String} mode         - 処理モード
     */
    on実行OfEditResponseData: function (responseData, mode) {
      $H.log("Controller on実行OfEditResponseData : start");

      let dataSet = this.model.on照会OfEditResponseData(responseData, mode);
      this.view.on照会OfEditResponseData(dataSet, responseData, mode);

      this.model.onサーバ処理確認ダイアログ(responseData);

      $H.log("Controller on実行OfEditResponseData : end");
    },
    
    /**
     * リナンバリング処理後、レスポンスデータからデータセットに値を設定する<br>
     * また、以下の画面表示内容を実施<br>
     *   ・テーブルに削除チェックボックスが存在する場合、全てチェックOFFにする<br>
     *   ・レスポンスデータに設定されているメッセージをダイアログに表示する<br>
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param {Object} responseData - レスポンスデータ
     * @param {String} mode         - 処理モード
     */
    on表示順再設定OfEditResponseData: function (responseData, mode) {
      $H.log("Controller on表示順再設定OfEditResponseData : start");

      let dataSet = this.model.on照会OfEditResponseData(responseData, mode);
      this.view.on照会OfEditResponseData(dataSet, responseData, mode);

      this.model.onサーバ処理確認ダイアログ(responseData);

      $H.log("Controller on表示順再設定OfEditResponseData : end");
    },

    /**
     * 処理のエラー情報をダイアログで表示する
     * 
     * @memberof SingleTableListFormControllerMixin
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
     * ※フレームワーク自体に実装はしていないため、個別で実装する必要あり
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param - なし
     * @returns なし
     */
    onConfirmDialogAfter: function () {
      $H.log("Controller onConfirmDialogAfter : start");

      $H.log("Controller onConfirmDialogAfter : end");
    },
    
    /**
     * 実行ダイアログ表示後に行う処理を追加する<br>
     * ※フレームワーク自体に実装はしていないため、個別で実装する必要あり
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param - なし
     * @returns なし
     */
    onExecuteDialogAfter: function () {
      $H.log("Controller onExecuteDialogAfter : start");

      $H.log("Controller onExecuteDialogAfter : end");
    },
    
    /**
     * サーバーダイアログ表示後、先頭項目にフォーカスを設定する<br>
     * ※フレームワーク自体に実装はしていないため、個別で実装する必要あり
     * 
     * @memberof SingleTableListFormControllerMixin
     * @param - なし
     * @returns なし
     */
    onServerDialogAfter: function () {
      $H.log("Controller onServerDialogAfter : start");

      this.view.setFirstFocusItem();

      $H.log("Controller onServerDialogAfter : end");
    }

  };
}(jQuery, Halu));
