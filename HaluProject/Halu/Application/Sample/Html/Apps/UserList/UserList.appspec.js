/***********************************************
 * Framework Name  :  Halu
 * (c) 2025 TILLS & Co.
***********************************************/
(function ($, $H) {
  // 名前空間を設定する
  let App = $H.Application.UserList = {};

  // インスタンスプロパティを追加する
  class AppSpec extends $H.AppSpec {
    constructor(name) {
      $H.log("AppSpec init : start");
      super();
      this.name = name;
      this.nextname = "UserDetailMainte";
      this.beforename = "";

      $H.log("AppSpec init : end");
    }
  }

  // 共通モジュールを追加する
  AppSpec.include($H.Library.AppSpecMixin);

  AppSpec.include({
    // -----------------------------------------------------------------------------------------------
    // プログラム・JSONファイルのURL情報を定義する（サブシステム名・種類・Apps・プログラムフォルダ名）
    // -----------------------------------------------------------------------------------------------
    urlInfo: [
      { app: "Sample/Html/Apps/UserList/" }
      , { json: "Sample/Json/Apps/UserList/" }
    ]
    // -----------------------------------------------------------------------------------------------
    // JSONファイル情報を定義する
    // -----------------------------------------------------------------------------------------------
    , jsonInfo: [
      { dataset: "yes" }
      , { validation: "yes" }
    ]
    // -----------------------------------------------------------------------------------------------
    // トランザクション・リクエストチェック・レスポンス編集・エラーのコールバック関数を定義する
    // -----------------------------------------------------------------------------------------------
    , requestInfo: [
      ["select", "on照会OfCheckRequestData", "on照会OfEditResponseData", "onErrorResponseData"]
      // ここから追加処理
      , ["init", "on初期処理OfCheckRequestData", "on初期処理OfEditResponseData", "onErrorResponseData"]
    ]
    // -----------------------------------------------------------------------------------------------
    // 外部トランザクション定義する
    // 外部プログラム名・トランザクション・リクエストチェック・レスポンス編集・エラーのコールバック関数を定義する
    // -----------------------------------------------------------------------------------------------
    , externalInfo: [
      // ここから追加処理
    ]
    // -----------------------------------------------------------------------------------------------
    // エンター・タブとPFキーのコールバック関数を定義する
    // -----------------------------------------------------------------------------------------------
    , enterTabPFKey: {
      Enter: true
      , Tab: true
      , F1: "on登録"
      , F2: null
      , F3: "on訂正"
      , F4: "on削除"
      , F5: "on照会"
      , F6: null
      , F7: null
      , F8: null
      , F9: "on最初のページ"
      , F10: "on前のページ"
      , F11: "on次のページ"
      , F12: "on最後のページ"
      , ESC: "on戻る"
      , Forms: 0
    }
    // -----------------------------------------------------------------------------------------------
    // イベント設定はセレクタ・イベント・コールバック関数の順に指定する
    // -----------------------------------------------------------------------------------------------
    // NAVボタンのイベントを定義する
    , navButtonEvent: [
      ["#戻る", "click", "on戻る"]
      , ["#登録", "click", "on登録"]
      , ["#訂正", "click", "on訂正"]
      , ["#削除", "click", "on削除"]
      , ["#照会", "click", "on照会"]
      , ["#最初のページ", "click", "on最初のページ"]
      , ["#前のページ", "click", "on前のページ"]
      , ["#次のページ", "click", "on次のページ"]
      , ["#最後のページ", "click", "on最後のページ"]
      , ["#検索", "click", "on検索"]
      , ["#クリア", "click", "onクリア"]
      , ["#mainTable td", "click", "onテーブル行クリック"]
      // ここから追加処理
    ]
    // バリデーションのイベントを定義する
    , validationEvent: [
      ["#mainForm", "focus", "onFocus"]
      , ["#mainForm", "blur", "onBlur"]
    ]
    // その他セレクターイベントを定義する
    , selectorEvent: [
      // ここから追加処理
      ["#検索メニュー名", "change", "onChangeSelectBox"]
      , ["#検索テーマコード", "change", "onChangeSelectBox"]
    ]
    // -----------------------------------------------------------------------------------------------
    // カスタムイベント設定はイベント名・実行コンテキスト・コールバック関数の順に指定する
    // -----------------------------------------------------------------------------------------------
    // チェック用カスタムイベントを定義する
    , pubsubCheckEvent: [
      // ここから追加処理
    ]
    // 導出項目編集用カスタムイベントを定義する
    , pubsubDeriveEvent: [
      ["deriveトータル件数", "model", "onDeriveトータル件数"]
      // ここから追加処理
    ]
    // その他カスタムイベントを定義する
    , pubsubOtherEvent: [
      ["showページ情報", "view", "showページ情報"]
      // ここから追加処理
    ]
    // -----------------------------------------------------------------------------------------------
    // 画面が表示された時、最初にフォーカスを設定する項目を指定する
    // -----------------------------------------------------------------------------------------------
    , firstFocusItem: [
      // ここから追加処理
    ]
    // -----------------------------------------------------------------------------------------------
    // F12押下時、フォーカスを設定する項目を指定する
    // -----------------------------------------------------------------------------------------------
    , f12FocusItem: [
      // ここから追加処理
    ]
    // -----------------------------------------------------------------------------------------------
    // 画面ヘッダキー定義
    // （自画面のセッションストレージに保存される）
    // datasetid  : datasetのidを指定する
    // dataname   : datasetの項目名を指定する
    // classname  : HTMLのクラス名を指定する
    // typename   : HTMLのTYPEを指定する
    // -----------------------------------------------------------------------------------------------
    , sessionStorageHeaderKey: [
      {
        datasetid: "header"
        , dataname: ["検索ユーザコード", "検索ユーザ名", "検索パスワード", "検索メニュー名", "検索テーマコード", "検索備考"]
        , classname: ["検索ユーザコード", "検索ユーザ名", "検索パスワード", "検索メニュー名", "検索テーマコード", "検索備考"]
        , typename: ["text", "text", "text", "select", "select", "text"]
      }
    ]
    // -----------------------------------------------------------------------------------------------
    // 画面明細キー定義
    // テーブル明細行をクリックしたときに設定するキー項目名を指定する
    // （自画面のセッションストレージに保存される）
    // datasetid  : datasetのidを指定する
    // dataname   : datasetの項目名を指定する
    // typename   : datasetもしくはHTMLのTYPEを指定する
    // -----------------------------------------------------------------------------------------------
    , sessionStorageDetailKey: [
      {
        datasetid: "detail"
        , dataname: ["ユーザＩＤ"]
        , typename: ["dataset"]
      }
    ]
    // -----------------------------------------------------------------------------------------------
    // 画面フッターキー定義
    // （自画面のセッションストレージに保存される）
    // datasetid  : datasetのidを指定する
    // dataname   : datasetの項目名を指定する
    // typename   : datasetもしくはHTMLのTYPEを指定する
    // -----------------------------------------------------------------------------------------------
    , sessionStorageFooterKey: [
      {
        datasetid: "header"
        , dataname: ["カレントページ", "ページライン数"]
        , typename: ["dataset", "dataset"]
      }
    ]
    // -----------------------------------------------------------------------------------------------
    // 次画面への引き継ぎデータ定義
    // （次画面のセッションストレージに保存される）
    // datasetid  : datasetのidを指定する
    // dataname   : datasetの項目名を指定する
    // validation : required(必須)もしくはnonrequired(省略可能)を指定する
    // titlename  : エラーメッセージのタイトルを指定する
    // -----------------------------------------------------------------------------------------------
    , nextStorageData: [
      {
        datasetid: "detail"
        , dataname: ["ユーザＩＤ"]
        , validation: ["nonrequired"]
        , titlename: ["社員ＩＤ"]
      }
    ]
    // -----------------------------------------------------------------------------------------------
    // 前画面からの引き継ぎデータ定義
    // datasetid  : datasetのidを指定する
    // dataname   : datasetの項目名を指定する
    // classname  : HTMLのクラス名を指定する
    // typename   : datasetもしくはHTMLのTYPEを指定する
    // -----------------------------------------------------------------------------------------------
    , beforeStorageData: [
    ]
    // -----------------------------------------------------------------------------------------------
    // 選択画面への引きデータ定義
    // requestname : 選択画面名を指定する
    // datasetid   : datasetのidを指定する
    // dataname    : datasetの項目名を指定する
    // value       : 空白（項目名の値がセットされ選択画面へ渡される）
    // -----------------------------------------------------------------------------------------------
    , selectStorageRequestData: [
    ]
    // -----------------------------------------------------------------------------------------------
    // 選択画面からの引き渡しデータ定義
    // responsename  : 自画面名を指定する
    // datasetid     : datasetのidを指定する
    // dataname      : datasetの項目名を指定する
    // value         : 空白（選択画面からの引き渡しデータの値がセットされる）
    // afterfunction : 後処理関数を指定する（同時に、pubsubOtherEventにも設定する）
    // -----------------------------------------------------------------------------------------------
    , selectStorageResponseData: [
    ]
    // -----------------------------------------------------------------------------------------------
    // セレクトボックス定義
    // selectorid  : HTMLのIDを指定する
    // selectorname: HTMLのnameを指定する（テーブル内で使用する時に定義する）
    // init        :
    // initvalue   : 初期値（０）
    // inithtml    : 初期表示（～選択）
    // datasetid   : datasetのID名を指定する
    // valuename   : datasetに定義されているキー値の項目名
    // htmlname    : datasetに定義されている表示用データの項目名
    // change      :
    // datasetid   : datasetのID名を指定する
    // valuename   : 選択したキー値を格納するdatasetの項目名
    // htmlname    : 選択した表示値を格納するdatasetの項目名
    // -----------------------------------------------------------------------------------------------
    , selectbox: [
      {
        selectorid: "検索メニュー名"
        , selectorname: ""
        , init: { initvalue: "", inithtml: "メニュー選択", datasetid: "選択検索メニュー名", valuename: "list_メニューコード", htmlname: "list_メニュー名" }
        , change: { datasetid: "header", valuename: "検索メニュー名", htmlname: "" }
      },
      {
        selectorid: "検索テーマコード"
        , selectorname: ""
        , init: { initvalue: "", inithtml: "テーマ選択", datasetid: "選択検索テーマコード", valuename: "list_テーマコード", htmlname: "list_テーマ名称" }
        , change: { datasetid: "header", valuename: "検索テーマコード", htmlname: "" }
      }
    ]
    // -----------------------------------------------------------------------------------------------
    // 明細行削除チェックボックス定義
    // selectorid  : HTMLのIDを指定する
    // selectorname: HTMLのnameを指定する（テーブル内で使用する時に定義する）
    // datasetid   : チェックボックスの値が設定されるdatasetのＩＤ名を指定する
    // datasetname : チェックボックスの値が設定されるdatasetの項目名を指定する
    // value       :
    // on          : チェックされた時に取る値を指定する
    // off         : チェックが外された時に取る値を指定する
    // -----------------------------------------------------------------------------------------------
    , checkboxDetail: [
    ]
  });
  App.AppSpec = AppSpec;
}(jQuery, Halu));
