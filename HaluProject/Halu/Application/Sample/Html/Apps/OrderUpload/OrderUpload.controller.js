/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
***********************************************/
(function($, $H){
  // 名前空間を設定する
  var App = $H.Application.OrderUpload;

  // インスタンスプロパティを追加する
  class Controller extends $H.Controller {
    constructor(appspec, model, view) {
      $H.log("Controller init : start");
      super();
      this.appspec = appspec;
      this.model = model;
      this.view = view;
      this.createPubSubEvent();
    
    // ----------------------------------------------------------------------------- //
    // dmUploader Template スタート（Controllerのinit内に設定する）
    // ----------------------------------------------------------------------------- //
    self = this;
    
    $('#drag-and-drop-zone').dmUploader({ //
      url: $H.UploadASGIURL,
      maxFileSize: 3000000, // 3 Megs max
      multiple: false,
      auto: true,
      queue: false,
      allowedTypes: "*",
      extFilter: ["csv"],
      extraData: function () {
        return {
          // アップロードファイルの格納先を設定する
          "data": appspec["urlInfo"][0]["app"].slice(0, -1).replace("Html", "UpLoad")
        };
      },
      onDragEnter: function(){
        // Happens when dragging something over the DnD area
        // DnD領域に何かをドラッグすると発生する
        this.addClass('active');
      },
      onDragLeave: function(){
        // Happens when dragging something OUT of the DnD area
        // DnDエリアの外に何かをドラッグすると発生する
        this.removeClass('active');
      },
      onInit: function(){
        // Plugin is ready to use
        // プラグインが使用可能になった時に発生する。
        //ui_add_log('Penguin initialized :)', 'info');
        ui_add_log('アップローダの初期処理が終了しました。', 'info');
      },
      onComplete: function(){
        // All files in the queue are processed (success or error)
        // キュー内の全てのファイルの処理が完了したときに発生する（成功またはエラー)

        // 全てのファイルをアップロードした後に、後処理用トランザクションを起動する
        // self ・・・ Controller を代入している
        self.onデータアップロード後処理();

        //ui_add_log('All pending tranfers finished');
        ui_add_log('全ファイルのアップロードが完了しました。');
      },
      onNewFile: function(id, file){
        // When a new file is added using the file selector or the DnD area
        // ファイルセレクターやDnDエリアで新規ファイルを追加した時に発生する

        // ファイル名チェック
        // self ・・・ Controller を代入している
        var result = self.onファイル選択チェック処理(file.name);
        if (result != "OK") {
          // 指定した id のキューをクリアする
          $('#drag-and-drop-zone').dmUploader('cancel', id);
          return;
        }

        //ui_add_log('New file added #' + id);
        ui_add_log('新しいファイルが File List に追加されました。#' + id);
        ui_multi_add_file(id, file);


        // ファイル名チェック
        // self ・・・ Controller を代入している
        self.onファイルチェック処理(file.name);
      },
      onBeforeUpload: function(id){
        // about tho start uploading a file
        // ファイルのアップロードが実行されようとしている時に発生する
        //ui_add_log('Starting the upload of #' + id);
        ui_add_log('ファイルのアップロードが開始されました。#' + id);
        ui_multi_update_file_status(id, 'uploading', 'Uploading...');
        ui_multi_update_file_progress(id, 0, '', true);
        ui_multi_update_file_controls(id, false, true);  // change control buttons status
      },
      onUploadProgress: function(id, percent){
        // Updating file progress
        // ファイルの新しいアップロード率を取得します
        ui_multi_update_file_progress(id, percent);
      },
      onUploadSuccess: function(id, data){
        // A file was successfully uploaded
        // ファイルのアップロードに成功した時に発生する
        //ui_add_log('Server Response for file #' + id + ': ' + JSON.stringify(data));
        //ui_add_log('Upload of file #' + id + ' COMPLETED', 'success');
        ui_add_log('サーバ レスポンス #' + id + ': ' + JSON.stringify(data));
        ui_add_log('Upload of file #' + id + ' アップロードが完了しました。', 'success');
        ui_multi_update_file_status(id, 'success', 'Upload Complete');
        ui_multi_update_file_progress(id, 100, 'success', false);
        ui_multi_update_file_controls(id, false, false);  // change control buttons status
      },
      onUploadCanceled: function(id) {
        // アップロードがユーザーによってキャンセルされた時に発生する
        //ui_multi_update_file_status(id, 'warning', 'Canceled by User');
        //ui_multi_update_file_progress(id, 0, 'warning', false);
        //ui_multi_update_file_controls(id, true, false);
      },
      onUploadError: function(id, xhr, status, message){
        // アップロードリクエスト中にエラーが発生したに発生する
        ui_multi_update_file_status(id, 'danger', message);
        ui_multi_update_file_progress(id, 0, 'danger', false);  
        ui_multi_update_file_controls(id, true, false, true); // change control buttons status
        },
      onFallbackMode: function(){
        // When the browser doesn't support this plugin :(
        // ブラウザがこのプラグインをサポートしていない時に発生する
        //ui_add_log('Plugin cant be used here, running Fallback callback', 'danger');
        ui_add_log('このアップローダは、ブラウザが未サポートです。', 'danger');
      },
      onFileSizeError: function(file){
        // ファイルサイズの検証に失敗したに発生する
        //ui_add_log('File \'' + file.name + '\' cannot be added: size excess limit', 'danger');
        ui_add_log('File \'' + file.name + '\' ファイルサイズが最大値を超えています。', 'danger');
      }
    });
  
    /*
      Global controls
    */
    //$('#btnApiStart').on('click', function(evt){
    //  evt.preventDefault();
  
    //  $('#drag-and-drop-zone').dmUploader('start');
    //});
  
    //$('#btnApiCancel').on('click', function(evt){
    //  evt.preventDefault();
  
    //  $('#drag-and-drop-zone').dmUploader('cancel');
    //});
  
    /*
      Each File element action
     */
    //$('#files').on('click', 'button.start', function(evt){
    //  evt.preventDefault();
  
    //  var id = $(this).closest('li.media').data('file-id');
    //  $('#drag-and-drop-zone').dmUploader('start', id);
    //});
  
    $('#files').on('click', 'button.cancel', function(evt){
      evt.preventDefault();
      var id = $(this).closest('li.media').data('file-id');
      ui_add_log('ファイルがキュンセルされました。#' + id);
      
      $('#drag-and-drop-zone').dmUploader('cancel', id);
      $('#uploaderFile' + id).fadeOut(); // remove the 'no files yet'
    });

  // ----------------------------------------------------------------------------- //
  // dmUploader Template エンド
  // ----------------------------------------------------------------------------- //

  $H.log("Controllerr init : end");
};
}

  // 共通モジュールを追加する
  Controller.include($H.Library.EnterTabPFKeyMixin);
  Controller.include($H.Library.ControllerMixin);

  // 基本名称メンテパターンミックスインを追加する
  Controller.include($H.Library.SingleTableListFormControllerMixin);

  // --------------------------------------------------------
  // パターンに含まれない処理を追加する
  // また、パターン内の処理を変更するときは、オーバライドする
  // --------------------------------------------------------
  Controller.include({
    // ---------------------------------------
    // 初期処理
    // ---------------------------------------
    on初期処理: function() {
      $H.log("Controller on初期処理 : start");

      var arg = this.model.on初期処理();
      this.view.on初期処理(arg);
            
      $H.log("Controller on初期処理 : end");
    }

    // ---------------------------------------
    // onファイル選択チェック処理
    // ---------------------------------------
    ,onファイル選択チェック処理: function(filename) {
      $H.log("Controller onファイル選択チェック処理 : start");

      var status = this.model.onファイル選択チェック処理(filename)

      $H.log("Controller onファイル選択チェック処理 : end");
      return status;
    }


    // ---------------------------------------
    // ファイル アップロード後処理
    // ---------------------------------------
    ,onファイルチェック処理: function(filename) {
      $H.log("Controller onファイルチェック処理 : start");

      var status = this.model.onファイルチェック処理(filename)

      $H.log("Controller onファイルチェック処理 : end");
      return status;
    }


    // ---------------------------------------
    // ボタン・ファンクションキー イベント処理
    // ---------------------------------------
   ,on実行: function(event) {
      $H.log("Controller on実行 : start");

      var status = this.model.on実行(event);
      if (status != "OK") {
        $H.log("Controller on実行 : end");
        return;
      }

      var arg = {};
      arg["title"]   = "受注CSVデータ 更新処理  確認";
      arg["message"] = "受注CSVデータ 更新処理を実行します。よろしいですか？";
      this.pubsub.publish("executeDialog", arg);

      $H.log("Controller on実行 : end");
    }

    // ---------------------------------------
    // 実行確認ダイアログ  後処理
    // ---------------------------------------
    ,onExecuteDialogAfter: function() {
      $H.log("Controller onExecuteDialogAfter : start");
      
      var yesno = sessionStorage.getItem("executeDialog");

      if (yesno != 1){
        $H.log("Controller onExecuteDialogAfter : end");
        return;
      }
      
      // ファイル アップロード後処理
      this.ajaxExecute("execute");

      $H.log("Controller onExecuteDialogAfter : end");
    }


    // -------------------------------
    //  レスポンスデータ  編集処理
    // -------------------------------
    ,on初期処理OfEditResponseData: function(responseData, mode) {
      $H.log("Controller on初期処理OfEditResponseData : start");

      var dataSet = this.model.on初期処理OfEditResponseData(responseData, mode);
      
      // セレクトボックスの一括初期表示
      //this.onShowSelectBoxAll(responseData, this.appspec.selectbox);
      
      // 画面ヘッダ  キー定義の値をdataSetに設定する
      // メニュー画面から遷移した時：なにも処理されない
      // 遷移先画面から戻って来た時：遷移前の値が設定される
      //this.model.setMyUIStorageData();
      
      //this.ajaxExecute("select");

      $H.log("Controller on初期処理OfEditResponseData : end");
    }

    // -----------------------------------
    //  リクエストデータ  チェック処理
    // -----------------------------------
    ,on実行OfCheckRequestData: function(requestData, mode) {
      $H.log("Controller on実行OfCheckRequestData : start");

      var status = this.model.on実行OfCheckRequestData(requestData, mode);
      if (status) {
        status = this.checkRequestData(requestData);
      }

      $H.log("Controller on実行OfCheckRequestData : end");
      return status;
    }

    // -------------------------------
    //  レスポンスデータ  編集処理
    // -------------------------------    
    ,on実行OfEditResponseData: function(responseData, mode) {
      $H.log("Controller on実行OfEditResponseData : start");

      //var dataSet = this.model.on照会OfEditResponseData(responseData, mode);
      //this.view.on照会OfEditResponseData(dataSet, responseData, mode);

      this.model.onサーバ処理確認ダイアログ(responseData);

      $H.log("Controller on実行OfEditResponseData : end");
    }
    
  });
  App.Controller = Controller;

}(jQuery, Halu));