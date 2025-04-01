/** このファイルのエンコーディングは utf-8 です ******************************/
/* webstorage.js                                                             */
/* Webストレージの機能拡張                                                   */
/*---------------------------------------------------------------------------*/
/*  Written     by T.Mitsuyasu  2013.09.12                                   */
/*  Modified(1) by T.Mitsuyasu  2013.09.18                                   */
/*    ・メソッド仕様変更(saveItem, saveObject)                               */
/*      格納失敗時(エラー)の戻り値を変更 false ⇒ undefined                  */
/*    ・メソッド仕様変更(loadItem, loadObject)                               */
/*      第２引数の削除                                                       */
/*    ・メソッド仕様変更(deleteAll)                                          */
/*      戻り値を変更 なし ⇒ 削除したアイテム数                              */
/*      該当キーがない場合(エラー)の戻り値を変更 false ⇒ unefined           */
/*    ・メソッド追加(saveItemIfKeyNotExists, saveObjectIfKeyNotExists)       */
/*  Modified(2) by T.Mitsuyasu  2013.09.20                                   */
/*    ・メソッド追加(isIdNameExists)                                         */
/*  Modified(3) by T.Mitsuyasu  2015.02.06                                   */
/*    ・メソッド仕様変更(loadItem, loadObject)                               */
/*      第２引数(デフォルト値)の追加(1 で削除した部分の復帰)                 */
/*  Modified(4) by                                                           */
/*---------------------------------------------------------------------------*/
/* Webストレージを少しだけ便利に操作するための機能拡張を定義しています       */
/*****************************************************************************/


//*****************************************************************************
// WEBストレージへのアクセス時に使用するキー(アイテムキー)は
//   "<識別名>.<個別のキー名称>"
// の形式とします
//-----------------------------------------------------------------------------
// (追加プロパティ)
// id_name              : 識別名(文字列)
//-----------------------------------------------------------------------------
// (追加メソッド)
// setIdName            : 識別名を設定します
// getIdName            : 識別名を求めます
//
// getKeys              : 格納アイテムからキー名のリストを求めます
// getLength            : 格納アイテム数を求めます
// isIdNameExists       : 指定識別名による格納があるかを調べます
// isKeyExists          : 指定キー名による格納があるかを調べます
// saveItem             : 文字列を格納します
// saveObject           : オブジェクトを格納します
// saveItemIfKeyNotExists
//                      : キーに該当する格納がない場合、文字列を格納します
// saveObjectIfKeyNotExists
//                      : キーに該当する格納がない場合、オブジェクトを格納します
// loadItem             : 格納文字列を求めます
// loadObject           : 格納オブジェクトを求めます
// deleteItem           : 格納データを削除します
// deleteAll            : 格納データを全て削除します
//
// isExists             : 指定値が undefined でも null でもなけれは true を返却
// replaceIfUndefined   : 指定値が undefined の場合に代替値を与えます
// getItemKeyName       : アイテムキーを求めます
//*****************************************************************************


//- プロトタイプメソッド(getter / setter) -------------------------------------
// 識別名を設定します
// 入力値:
//   id_name            : 格納する識別名(文字列)
// 戻り値:
//   直近の識別名(設定がない場合は false)
Storage.prototype.setIdName =
function(id_name) {
  result = this.replaceIfUndefined(this._webstorage_id_name_, false);
  // 識別名が文字列ではない場合、代替として空文字列を使います
  this._webstorage_id_name_ =
    (this.isExists(id_name) && typeof(id_name) == 'string') ? id_name : '';
  return result;
}

// 識別名を求めます
// 入力値:
//   なし
// 戻り値:
//   識別名(文字列)
Storage.prototype.getIdName =
function() {
  return(this._webstorage_id_name_);
}

//- プロトタイプメソッド ------------------------------------------------------
// 格納アイテムからキー名のリストを求めます
// 入力値:
//   real_name          : 動作フラグ default : false
//                        (true)アイテムキー(実名)を求めます
//                        (false)キー名を求めます
// 戻り値:
//   キー名を０個以上含む配列
Storage.prototype.getKeys =
function(real_name) {
  var result = [];
  var real_name = this.replaceIfUndefined(real_name, false);
  var scan_key_name = this.getItemKeyName('');
  // 全ての格納アイテムから検索を実行
  for (var i = 0, n = this.length; i < n; i++) {
    var item_key_name = this.key(i);
    // アイテムキーには null などが含まれることもあるため、確認しておく
    if (this.isExists(item_key_name)) {
      // アイテムキーの先頭が一致するものを求めます
      if (item_key_name.indexOf(scan_key_name) == 0) {
        result.push(real_name ?
          item_key_name : item_key_name.substr(scan_key_name.length));
      }
    }
  }
  return result;
}

// 格納アイテム数を求めます
// 入力値:
//   なし
// 戻り値:
//   格納アイテム数(数値)
Storage.prototype.getLength =
function() {
  return this.getKeys(true).length;
}

// 指定識別名による格納があるかを調べます
// 入力値:
//   id_name            : 識別名(文字列)
// 戻り値:
//   true:格納あり または false:格納なし
Storage.prototype.isIdNameExists =
function(id_name) {
  var result = false;
  // 全ての格納アイテムから検索を実行
  for (var i = 0, n = this.length; i < n; i++) {
    var item_key_name = this.key(i);
    // アイテムキーには null などが含まれることもあるため、確認しておく
    if (this.isExists(item_key_name)) {
      // アイテムキーの先頭が一致すれば、戻り値を設定して検索終了
      if (item_key_name.indexOf(id_name) == 0) {
        result = true;
        break;
      }
    }
  }
  return result;
}

// 指定キー名による格納があるかを調べます
// 入力値:
//   key_name           : キー名(文字列)
// 戻り値:
//   true:格納あり または false:格納なし
Storage.prototype.isKeyExists =
function(key_name) {
  return(this.getKeys(false).indexOf(key_name) != -1);
}

// 文字列を格納します
// 入力値:
//   key_name           : キー名(文字列)
//   save_value         : 格納値(文字列)
// 戻り値:
//   格納値             : 格納成功
//   undefined          : アイテムキー無効につき格納失敗
Storage.prototype.saveItem =
function(key_name, save_value) {
  var result = undefined;
  // アイテムキーが正しく求められた場合、格納を行います
  var item_key_name = this.getItemKeyName(key_name);
  if (item_key_name !== false) {
    this.setItem(item_key_name, save_value);
    // 格納した値を取り出して、戻り値とします
    result = this.getItem(item_key_name);
  }
  return result;
}

// オブジェクトを格納します
// 入力値:
//   key_name           : キー名(文字列)
//   save_value         : 格納値(オブジェクト)
// 戻り値:
//   格納値             : 格納成功
//   undefined          : アイテムキー無効につき格納失敗
Storage.prototype.saveObject =
function(key_name, save_value) {
  // JSONエンコードして格納し、戻り値はデコードし直したものを返却
  var temp = this.saveItem(key_name, JSON.stringify(save_value));
  return temp !== undefined ? JSON.parse(temp) : temp;
}

// キーに対応する格納値が存在しない場合のみ、文字列の格納を試みます
// 入力値:
//   key_name           : キー名(文字列)
//   save_value         : 格納値(文字列)
// 戻り値:
//     true             : 該当キーあり
//     格納された格納値(文字列)
//                      : 該当キーなし・格納処理に成功
//     undefined        : 該当キーなし・格納処理に失敗
Storage.prototype.saveItemIfKeyNotExists =
function(key_name, save_value) {
  var result = this.isKeyExists(key_name);
  if (!result) {
    result = this.saveItem(key_name, save_value);
  }
  return result;
}

// キーに対応する格納値が存在しない場合のみ、オブジェクトの格納を試みます
// 入力値:
//   key_name           : キー名(文字列)
//   save_value         : 格納値(オブジェクト)
// 戻り値:
//     true             : 該当キーあり
//     格納された格納値(オブジェクト)
//                      : 該当キーなし・格納処理に成功
//     undefined        : 該当キーなし・格納処理に失敗
Storage.prototype.saveObjectIfKeyNotExists =
function(key_name, save_value) {
  var result = this.isKeyExists(key_name);
  if (!result) {
    result = this.saveObject(key_name, save_value);
  }
  return result;
}

// 格納文字列を求めます
// 入力値:
//   key_name           : キー名(文字列)
//   default_value      : デフォルト値(文字列) / 省略可
// 戻り値:
//   格納値(文字列)     : 該当キーあり
//   デフォルト値(文字列)
//                      : 該当キーなし・デフォルト値設定ありの場合
//   undefined          : 該当キーなし・デフォルト値設定省略の場合
Storage.prototype.loadItem =
function(key_name, default_value) {
  var result = undefined;
  var item_key_name = this.getItemKeyName(key_name);
  // アイテムキーが有効な場合のみ実行します
  if (item_key_name !== false) {
    // アイテムキーが存在する場合
    if (this.isKeyExists(key_name)) {
      // 該当する格納データを取得し、戻り値とします
      result = this.getItem(item_key_name);
    // アイテムキーが存在しない場合
    } else {
      // デフォルト値があれば格納を行い、それを戻り値とします
      if (default_value !== undefined) {
        result = this.saveItem(key_name, default_value);
      }
    }
  }
  return result;
}

// 格納オブジェクトを求めます
// 入力値:
//   key_name           : キー名(文字列)
//   default_value      : デフォルト値(オブジェクト) / 省略可
// 戻り値:
//   格納値(オブジェクト)
//                      : 該当キーあり
//   デフォルト値(オブジェクト)
//                      : 該当キーなし・デフォルト値設定ありの場合
//   undefined          : 該当キーなし・デフォルト値設定省略の場合
Storage.prototype.loadObject =
function(key_name, default_value) {
  // 格納値がJSONエンコードされているとみなし、デコードして返却
  // ただし、格納値がなくデフォルト値による代替を行う場合はデコードしない
  var temp = this.loadItem(key_name);
  return (temp !== undefined ? JSON.parse(temp) :
    (default_value !== undefined ? default_value : undefined));
}

// 格納データを削除します
// 入力値:
//   key_name           : キー名(文字列)
// 戻り値:
//   格納値             : 格納成功
//   false              : 該当キーなし または アイテムキー無効につき削除失敗
Storage.prototype.deleteItem =
function(key_name) {
  var result = false;
  // アイテムキーが正しく求められた場合、格納データを削除します
  var item_key_name = this.getItemKeyName(key_name);
  if (item_key_name !== false && this.isKeyExists(key_name)) {
    this.removeItem(item_key_name);
    result = true;
  }
  return result;
}

// 格納データを全て削除します
// 入力値:
//   なし
// 戻り値:
//   削除した格納アイテム数(数値)
Storage.prototype.deleteAll =
function() {
  var scan_key_name = this.getItemKeyName('');
  var remove_item_keys = new Array();
  // 全ての格納アイテムから削除対象となるキーを求める
  for (var i = 0, n = this.length; i < n; i++) {
    var item_key_name = this.key(i);
    // アイテムキーには null などが含まれることもあるため、確認しておく
    if (this.isExists(item_key_name)) {
      // アイテムキーの先頭が一致するものを削除対象とします
      if (item_key_name.indexOf(scan_key_name) == 0) {
        remove_item_keys.push(item_key_name);
      }
    }
  }
  // 削除の実施
  if (remove_item_keys.length > 0) {
    for (var i = 0, n = remove_item_keys.length; i < n; i++) {
      this.removeItem(remove_item_keys[i]);
    }
  }
  return remove_item_keys.length;
}

//- プロトタイプメソッド(内部で使用) ------------------------------------------
// 指定値が null でも undefined でもなければ true を返します
// 入力値:
//   value              : 判定値
// 戻り値:
//   true               : 判定値が null でも undefined でもない
//   false              : 上記以外の場合
Storage.prototype.isExists =
function(value) {
  return(value != null && value !== undefined);
}

// 指定値が undefined の場合に代替値を与えます
// 入力値:
//   value              : 判定値
//   replace            : 代替値
// 戻り値:
//   判定値             : 判定値が undefined ではない場合
//   代替値             : 判定値が undefined である場合
Storage.prototype.replaceIfUndefined =
function(value, replace) {
  var replace = replace !== undefined ? replace : null;
  return(value !== undefined ? value : replace);
}

// アイテムキーを求めます
// 入力値:
//   key_name           : キー名(文字列)
// 戻り値:
//   アイテムキー(文字列)
//                      : ＝識別名.キー名
Storage.prototype.getItemKeyName =
function(key_name) {
  var result = false;
  // 「識別名.キー名」 を戻り値とします
  // key_name が文字列ではない場合は false を戻り値とします
  if (this.isExists(key_name) && typeof(key_name) == 'string') {
    result = this.getIdName() + '.' + key_name;
  }
  return result;
}
