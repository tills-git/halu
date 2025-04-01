(function($, $H){
  // 名前空間を設定する
  let App = $H.Library;

  /**
   * Webソケット通信  関数
   * @mixin WebsocketMixin
   */
  App.WebsocketMixin = {
    /**
     * サーバ  ソケットサーバとの通信
     * @memberof WebsocketMixin
     * @param {object} self - 呼び出し元情報
     * @param {string} serverURL - サーバのURL
     * @returns WebSocketオブジェクト
     */
    initSocketServer_Server: function (self, serverURL) {
      $H.log("WebsocketMixin initSocketServer_Server start");

      let socketOfServer = new WebSocket(serverURL);
       
      // 通信が接続された場合
      socketOfServer.onopen = function (event) {
        $H.log("WebsocketMixin サーバと接続されました。");
      };
       
      // エラーが発生した場合
      socketOfServer.onerror = function (event) {
        $H.log("WebsocketMixin ソケット通信（サーバ）でエラーが発生しました。");
        $H.log("WebsocketMixin エラー：" + event.data);
      };
       
      // メッセージを受け取った場合
      socketOfServer.onmessage = function (event) {
        $H.log("WebsocketMixin サーバからメッセージを受信しました。");
        self.onMessageSocketOfServer(event.data);
      };
        
      // 通信が切断された場合
      socketOfServer.onclose = function () {
        $H.log("WebsocketMixin サーバ接続（サーバ）が切断されました");
      };

      $H.log("WebsocketMixin initSocketServer_Server end");
      // このオブジェクトを使って、メッセージ送信とクローズを行う
      // メッセージ送信：socketOfServer.send(data);
      // 通信クローズ  ：socketOfServer.close();
      return socketOfServer;
    },
    /**
     * クライアント  ソケットサーバとの通信
     * @memberof WebsocketMixin
     * @param {object} self - 呼び出し元情報
     * @param {string} clientURL - クライアントURL
     * @returns WebSocketオブジェクト
     */
    initSocketServer_Client: function(self, clientURL) {
      $H.log("WebsocketMixin initSocketServer_Client start");

      let socketOfClient = new WebSocket(clientURL);
     
      // 通信が接続された場合
      socketOfClient.onopen = function(event) {
        $H.log("WebsocketMixin ");
      };
       
      // エラーが発生した場合
      socketOfClient.onerror = function(event) {
        $H.log("WebsocketMixin ソケット通信（クライアント）でエラーが発生しました。");
        $H.log("WebsocketMixin エラー：" + event.data);
      };
       
      // メッセージを受け取った場合
      socketOfClient.onmessage = function(event) {
        $H.log("WebsocketMixin サーバからメッセージを受信しました。");
        self.onMessageSocketOfClient(event.data);
      };
        
      // 通信が切断された場合
      socketOfClient.onclose = function() {
        $H.log("WebsocketMixin サーバ接続（クライアント）が切断されました");
      };
  
      $H.log("WebsocketMixin initSocketServer_Client end");
      // このオブジェクトを使って、メッセージ送信とクローズを行う
      // メッセージ送信：socketOfClient.send(data);
      // 通信クローズ  ：socketOfClient.close();
      return socketOfClient;
    }
 };
}(jQuery, Halu));
