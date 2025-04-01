(function ($, $H) {

  // 名前空間を設定する
  let App = $H.Library;

  /**
   * 関数を追加する
   * @mixin AppSpecMixin
   */
  App.AppSpecMixin = {

    /**
     * 値の型を取得する(typeof の代替メソッド)
     * @memberof AppSpecMixin
     * @param {object} value - チェック対象
     * @returns 値の型
     */
    typeOf: function (value) {
      //変数宣言
      let result = null;

      result = Object.prototype.toString.call(value);

      const LTSH_NULL_OR_UNDEFINED = {
        '[object Object]': 'IE',
        '[object Window]': 'Opera',
        '[object DOMWindow]': 'Safari iOS',
        '[object global]': 'Android'
      };
      if (!value) {
        if (result in LTSH_NULL_OR_UNDEFINED) {
          result = (value === null ? 'Null' : 'Undefined');
        }
      }
      if (result === 'Object') {
        if (value.constructor !== Object) {
          return (null);
        }
      }
      return (result.toLowerCase().replace(/^\[.+ (.+)\]$/, "$1"));
    },

    /**
     * 値の有無チェック
     * @memberof AppSpecMixin
     * @param {object} value - チェック対象
     * @return 判定結果(true:値あり/false:nullまたはundefined)
     */
    isExists: function (value) {
      return (value != null && value != undefined);
    },

    /**
     * 値の型チェック(数値)<br>
     * チェック対象が数値型かどうかチェックする
     * @memberof AppSpecMixin
     * @param {object} value - チェック対象
     * @param {object} strict - 判定基準(true:数値型のみ/false:数字のみの文字列型も許可)
     * @returns 判定結果(true:OK/false:NG)
     * <br><hr>
     */
    isNumeric: function (value, strict) {
      //変数宣言
      let type = null;

      //判断基準を取得：引数の値が未設定の場合はtrueを設定
      strict = App.AppSpecMixin.replaceIfUndefined(strict, true) == true;
      //チェック対象の型を取得
      type = typeof (value);
      //数値型 または 数字のみの文字列型 かどうか、判定結果を返す
      return (
        (type == 'number' || (!strict && type == 'string' && value != '')) &&
        !isNaN(value) &&
        isFinite(value));
    },

    /**
     * 値の型チェック(配列)
     * チェック対象が配列かどうかチェックする
     * @memberof AppSpecMixin
     * @param {object} obj - チェック対象
     * @returns 判定結果(true:配列/false:非配列)
     */
    isArrayObj: function (obj) {
      //配列かどうか、判定結果を返す
      return (obj.constructor === Array);
    },

    /**
     * チェック対象がnull または undefined の場合、代替値をセットして返す
     * @memberof AppSpecMixin
     * @param {object} value - チェック対象
     * @param {object} replace - 代替値
     * @returns 判定後の値
     */
    replaceIfNotExists: function (value, replace) {
      //代替値がundefinedの場合はnullを設定
      replace = replace != undefined ? replace : null;
      //チェック対象がnull または undefined の場合、代替値をセットして返す
      return (App.AppSpecMixin.isExists(value) ? value : replace);
    },

    /**
     * チェック対象が undefined の場合、代替値をセットして返す
     * @memberof AppSpecMixin
     * @param {object} value - チェック対象
     * @param {object} replace - 代替値
     * @returns 判定後の値
     */
    replaceIfUndefined: function (value, replace) {
      //チェック対象がundefinedの場合はnullを設定
      replace = replace != undefined ? replace : null;
      //チェック対象が undefined の場合、代替値をセットして返す
      //undefined出ない場合は元の値をそのまま返す
      return (value != undefined ? value : replace);
    },

    /** 
     * チェック対象が数値ではない場合、代替値をセットして返す
     * @memberof AppSpecMixin
     * @param { object } value - チェック対象
     * @param { object } replace - 代替値
     * @param { boolean } strict - 判定基準(true:数値型のみ/false:数字のみの文字列も許可)
     * @returns (数値の場合:value/それ以外の場合:replace)
    */
    replaceIfNotNumeric: function (value, replace, strict) {
      let temp =
        replace == null ? replace : App.AppSpecMixin.replaceIfUndefined(replace, 0);
      return (App.AppSpecMixin.isNumeric(value, strict) ? value : temp);
    },

    /**
     * 指定オブジェクトから、キーの配列を生成する
     * @memberof AppSpecMixin
     * @param { object } obj - オブジェクト
     * @returns キー配列
     */
    getArrayOfKey: function (obj) {
      let result = false;
      let key = null;

      switch (App.AppSpecMixin.typeOf(obj)) {
        case 'object':
          result = [];
          for (key in obj) {
            result.push(key);
          }
          break;
        case 'array':
          result = [];
          for (let i = 0, n = obj.length; i < n; i++) {
            result.push(i);
          }
          break;
      }
      return (result);
    },

    /**
     * 指定オブジェクトから、値の配列を生成する
     * @memberof AppSpecMixin
     * @param { object } obj - オブジェクト
     * @returns 値の配列
     */
    getArrayOfValue: function (obj) {
      let result = false;

      switch (App.AppSpecMixin.typeOf(obj)) {
        case 'object':
          result = [];
          for (key in obj) {
            result.push(obj[key]);
          }
          break;
        case 'array':
          result = [];
          for (let i = 0, n = obj.length; i < n; i++) {
            result.push(obj[i]);
          }
          break;
      }
      return (result);
    },

    /**
     * JSONオブジェクトに含まれる配列(sqls, records など)から、<br>
     * 指定idに対応する要素を求めて返す<br>
     * <br>
     * ここで扱うJSONオブジェクトには、次の構造が含まれることを想定しています<br>
     * jsonObj[index]["id"]  (index:0～)
     * @memberof AppSpecMixin
     * @param { object } jsonObj - 検索対象のJSONオブジェクト
     * @param { object }  id - 検索ID
     * @returns 検索結果(該当なし または jsonObj が配列ではない場合:false)
     *
     */
    getJSONChunkById: function (jsonObj, id) {
      //変数定義
      let result = false; // 戻り値
      let index = 0;
      let temp = null;

      // jsonObj が配列の場合のみ検索を実施
      if (jsonObj.constructor === Array) {
        for (index in jsonObj) {
          //変数初期化
          remp = null;
          //配列を取得
          temp = jsonObj[index];
          // id が合致していたら、現在の要素を戻り値とする
          if (temp["id"] === id) {
            result = temp;
            break;
          }
        }
      }
      return (result);
    },

    /**
     *  JSONオブジェクトid検索(ラッパー関数)
     * JSONオブジェクトに含まれる「sqls 部分」から、
     * 指定idに対応する要素を求めて返却します
     *
     * ここで扱うJSONオブジェクトには、次の構造が含まれることを想定しています
     * jsonObj["sqls"][index]["id"]  (index:0～)
     * @memberof AppSpecMixin
     * @param {object} jsonObj - 検索対象のJSONオブジェクト
     * @param {object} id - 検索ID
     * @returns 検索結果(該当なし または jsonObj["sqls"] なしの場合:false)
     */
    getJSONChunkByIdAtSqls: function (jsonObj, id) {
      return (this.getJSONChunkById(jsonObj["sqls"], id));
    },

    /** 
     * JSONオブジェクトid検索(ラッパー関数)<br>
     * JSONオブジェクトに含まれる「records 部分」から、
     * 指定idに対応する要素を求めて返却します
     *
     * ここで扱うJSONオブジェクトには、次の構造が含まれることを想定しています
     * jsonObj["records"][index]["id"]  (index:0～)
     * @memberof AppSpecMixin
     * @param {object} jsonObj - 検索対象のJSONオブジェクト
     * @param {object} id - 検索ID
     * @returns 検索結果(該当なし または jsonObj["records"] なしの場合:false)
    */
    getJSONChunkByIdAtRecords: function (jsonObj, id) {
      return (this.getJSONChunkById(jsonObj["records"], id));
    },
  
    /** 
     * 配列インデックス指定を正規表現に変換する
     * 数値・正規表現文字列・正規表現を受け付けます
     * @memberof AppSpecMixin
     * @param {object} index - 配列インデックス(def:'.*')
     * @returns 変換された正規表現
     */
    convertIndexToRegExp: function (index) {
      let result = App.AppSpecMixin.replaceIfNotExists(index, '.*');
      switch (App.AppSpecMixin.typeOf(result)) {
        case 'regexp':
          break;
        case 'number':
          result = new RegExp('^' + result.toString() + '$');
          break;
        case 'string':
          if (App.AppSpecMixin.isNumeric(result, false)) {
            result = new RegExp('^' + result + '$');
          } else {
            result = new RegExp(result);
          }
          break;
        default:
          result = new RegExp('.*');
          break;
      }
      return (result);
    }
  };

}(jQuery, Halu));
