(function ($, $H) {
  // 名前空間を設定する
  let App = $H.Library;

  /**
   * Fキー・Tab・Enterの設定<br>
   * @mixin EnterTabPFKeyMixin
   */
  App.EnterTabPFKeyMixin = {
    /**
     * キーイベントと各イベントの紐づけ
     * @memberof EnterTabPFKeyMixin
     * @function setEnterTabPFKey
     * @param {object} enterTabPFKey - キー情報
     */
    setEnterTabPFKey: function (enterTabPFKey) {
      $H.log("EnterTabPFKeyMixin setEnterTabPFKey : start");

      let self = this;
      jQuery.fn.jqKey = function (options) {
        window.onhelp = function () { return false; }
        const FKey = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"];

        //defaultsにFormsを追加
        let defaults = {
          // Enterで次項目へ移動する時は true を設定する
          "Enter": false
          // Tabで次項目へ移動する時は true を設定する
          , "Tab": false
          , "F1": null
          , "F2": null
          , "F3": null
          , "F4": null
          , "F5": null
          , "F6": null
          , "F7": null
          , "F8": null
          , "F9": null
          , "F10": null
          , "F11": null
          , "F12": null
          , "ESC": null
          , "Forms": 0
        };

        let setting = $.extend(defaults, options);
        let method = function (e) {
          let FocusMove = function (df, shift) {
            //フォームオブジェクトが何番目か探す
            let ln = df.length;
            let i;
            for (i = 0; i < ln; i++) {
              if (df[i] == obj) break;
            }
            //フォーカスを取得できないものは飛ばします
            // shiftキー押下の時、-1 そうで無い時、 1 を返す
            let mv = (shift ? -1 : 1);
            // 次にフォーカスを設定するオブジェクトの番号
            let j = (ln + i + mv) % ln;
            let Fo, Fs;
            while (true) {
              Fo = df[j];
              Fs = Fo.style;
              if (Fo.type != "hidden" &&
                Fo.style.visibility != "hidden" &&
                !Fo.disabled &&
                Fo.tabIndex != -1 &&
                Fs.visibility != "hidden" &&
                Fs.display != "none") {
                //対象のオブジェクトを戻す
                return Fo;
              }
              j = (j + mv + ln) % ln;
            }
            //Hitしない場合
            return df[i];
          }  // FocusMove 終わり

          let FocusMoveLeftRight = function (df, mv) {
            //フォームオブジェクトが何番目か探す
            let ln = df.length;
            let i;
            for (i = 0; i < ln; i++) {
              if (df[i] == obj) break;
            }
            //フォーカスを取得できないものは飛ばします
            // 次にフォーカスを設定するオブジェクトの番号
            let j = (ln + i + mv) % ln;
            let Fo, Fs;
            while (true) {
              Fo = df[j];
              Fs = Fo.style;
              if (Fo.type != "hidden" &&
                Fo.style.visibility != "hidden" &&
                !Fo.disabled &&
                Fo.tabIndex != -1 &&
                Fs.visibility != "hidden" &&
                Fs.display != "none") {
                //対象のオブジェクトを戻す
                return Fo;
              }
              j = (j + mv + ln) % ln;
            }
            //Hitしない場合
            return df[i];
          }  // FocusMoveLeftRight 終わり

          let FocusMoveUp = function (df) {
            //フォームオブジェクトが何番目か探す
            let ln = df.length;
            let i;
            for (i = 0; i < ln; i++) {
              if (df[i] == obj) break;
            }

            let j = i - 1;
            let k;
            for (k = j; k >= 0; k--) {
              if (df[k].name == obj.name) {
                return df[k];
              }
            }
            //Hitしない場合
            return df[i];
          }  // FocusMoveUp 終わり

          let FocusMoveDown = function (df) {
            //フォームオブジェクトが何番目か探す
            let ln = df.length;
            let i;
            for (i = 0; i < ln; i++) {
              if (df[i] == obj) break;
            }

            let j = i + 1;
            let k;
            for (k = j; k < ln; k++) {
              if (df[k].name == obj.name) {
                return df[k];
              }
            }
            //Hitしない場合
            return df[i];
          }  // FocusMoveDown 終わり

          //フォームオブジェクトの取得
          let df = document.forms[setting.Forms];
          //押下されたキー情報
          let k = e.key;
          let s = e.shiftKey;
          let c = e.ctrlKey;
          let a = e.altKey;
          // イベント発生時のオブジェクト 
          let obj = e.target;
          let blKey = true;

          //EnterキーとTabの設定が無効であれば処理終了
          if (!setting.Enter && k == "Enter") return true;
          if (!setting.Tab && k == "Tab") return true;

          //押下されたキーとイベント発生時のオブジェクトによって分岐
          switch (k) {
            case "Enter":
              // ENTERキー
              switch (obj.type) {
                case "button":
                  blKey = false;
                  break;
                case "file": case "textarea":
                  blKey = true;
                  break;
                case "text":
                  blKey = false;
                  break;
                case "checkbox":
                  blKey = false;
                  break;
                case "radio":
                  blKey = false;
                  break;
                case "select-one":
                  blKey = false;
                  break;
                case "select-multiple":
                  blKey = false;
                  break;
                default:
                  blKey = false;
                  break;
              }
              //keyイベントを処理するもののみ抽出
              if (!blKey) {
                //次のフォームオブジェクト探す
                obj = FocusMove(df, s);
              }
              break;

            case "Tab":
              //Tabキー
              switch (obj.type) {
                case "file":
                  blKey = true;
                  break;
                default:
                  //次のフォームオブジェクトを探す
                  obj = FocusMove(df, s);
                  blKey = false;
                  break;
              }
              break;

            case "Backspace":
              //Backspace
              switch (obj.type) {
                case "text": case "textarea": case "password": case "number":
                  blKey = true;
                  break;
                default:
                  blKey = true;
                  break;
              }
              break;

            case "Escape":
              if (setting.ESC) {
                eval("self." + setting.ESC + "(e)");
                blKey = false;
              }
              break;

            case "ArrowLeft":
              // ←(左矢印)
              if (c) {
                obj = FocusMoveLeftRight(df, -1);
                blKey = false;
              }
              break;

            case "ArrowUp":
              // ↑(上矢印)
              if (c) {
                obj = FocusMoveUp(df);
                blKey = false;
              }
              break;

            case "ArrowRight":
              // →(右矢印)
              if (c) {
                obj = FocusMoveLeftRight(df, 1);
                blKey = false;
              }
              break;

            case "ArrowDown":
              // ↓(下矢印)
              if (c) {
                obj = FocusMoveDown(df);
                blKey = false;
              }
              break;

            case "+":
              if (c) {
                self.onTabPainMove(1);
                blKey = false;
              }
              break;

            case "-":
              if (c) {
                self.onTabPainMove(-1);
                blKey = false;
              }
              break;
            default:
              //F1～F12キーの場合
              if (FKey.indexOf(k) !== -1) {
                //Fキーとコールバック関数が紐づけられているか？
                let func = setting[k];
                if (func) {
                  //コールバック関数あり
                  obj.blur();
                  //画面上のナビゲーションボタンにキーが割り当てられているか？
                  let executeFKey = self.getExecuteFKey(func);
                  if (executeFKey) {
                    eval("self." + func + "(e)");
                  }
                }
                blKey = false;
              }
              break;
          }  // switch(k) 終わり

          if (!blKey) {
            //イベントを伝播しない
            //F3検索・F5更新・F11最大化等をキャンセルします。
            if (document.getElementsByTagName('*')) {
              e.key = "";
              e.preventDefault();
            }
            //F1～F12キーの場合
            if (FKey.indexOf(k) !== -1) {
            }
            else {
              //F1～F12キー以外の場合
              obj.focus();

              if (obj.type == "text" || obj.type == "textarea" || obj.type == "password") {
                // キャレットを最後に設定する
                obj.value += "";
              }
            }
          }
          return blKey;
        };  // method 終わり

        this.each(function () {
          jQuery(this).keydown(function (e) {
            let ret = method(e);
            return ret;
          });
        });
      }

      if (arguments.length == 0) {
        enterTabPFKey = self.appspec.enterTabPFKey;
      }
      jQuery(document).jqKey(enterTabPFKey);

      $H.log("EnterTabPFKeyMixin setEnterTabPFKey : end");
    },

    /**
     * キーイベントと各イベントの紐づけを解除する
     * @memberof EnterTabPFKeyMixin
     */
    unbindEnterTabPFKey: function () {
      $H.log("EnterTabPFKeyMixin unbindEnterTabPFKey : start");

      jQuery.fn.unbindjqKey = function () {
        this.each(function () {
          jQuery(this).unbind("keydown");
        });
      }

      jQuery(document).unbindjqKey();

      $H.log("EnterTabPFKeyMixin unbindEnterTabPFKey : end");
    },

    /**
     * 実行後のフォーカス項目番号を設定する
     * @memberof EnterTabPFKeyMixin
     * @param {event} event - イベント情報
     */
    getNextFocusNo: function (event) {
      $H.log("EnterTabPFKeyMixin getNextFocusNo : start");

      // 実行後のフォーカス項目番号を設定する
      let formno = this.appspec.enterTabPFKey["Forms"];
      let objArray = document.forms[formno];
      let obj = event.target;
      let maxLength = objArray.length;
      let objNo = 1;
      for (let i = 0; i < maxLength; i++) {
        if (objArray[i] == obj) {
          objNo = i;
          break;
        }
      }

      $H.log("EnterTabPFKeyMixin getNextFocusNo : end");
      return objNo;
    },

    /**
     * ナビゲーションボタンとFキーのコールバック関数が紐づいているかチェックする
     * @memberof EnterTabPFKeyMixin
     * @param {object} F - Fキーに紐づいたコールバック関数
     * @returns チェック結果(true:あり/false:なし)
     */
    getExecuteFKey: function (F) {
      $H.log("EnterTabPFKeyMixin getExecuteFKey : start");

      let status = false;
      let navButtonEvent = this.appspec.navButtonEvent;
      let maxSize = navButtonEvent.length;
      for (let i = 0; i < maxSize; i++) {
        if (F != navButtonEvent[i][2]) {
          continue;
        }

        let selector = navButtonEvent[i][0];
        if ($(selector).is(':visible')) {
          status = true;
        }
        break;
      }

      $H.log("EnterTabPFKeyMixin getExecuteFKey : end");
      return status;
    }

  };
}(jQuery, Halu));
