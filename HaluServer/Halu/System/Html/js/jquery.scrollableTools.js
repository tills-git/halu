"use strict";

/**
*jquery.scrollableTools.js
*任意のテーブルをスクロール可能とするjQueryプラグイン.
*指定の幅・高さに領域を固定し,ヘッダーとフッター及び列の表示位置を固定することで大きなtableの可視性を高めます.
*従来のプラグインと比較し，既存のレイアウトを極力汚染しないように気をつけた．
*target browser:firefox,chrome,opera,safari,ie6,ie7,ie8,ie9
*※ブラウザ間の完全な互換を謳うわけではありません．
*
*[使い方]
*1.tableタグに引数を設定
*<table id="b" cellspacing="0" scrollable="true" fixwidth="300" fixheight="300" flozenf="1" flozenl="1">
*2．コード内部で次を指定
*$("#tblA").scrollable(tableWidth, tableHeight, flozenF, flozenL);
*
*[history]
*2012/02/04 初版・新規作成．
*2012/02/04 列の追加を行った際の再設定を可能とした．
*2012/02/04 border-collapse:collapseが設定されていた際のcellSpacing値の取得を修正．
*2012/02/04 ie6-8では動作しないように処理を追加.
*2012/02/05 ie8で動作するように機能を追加.
*2012/02/05 ie6,7で動作するように機能を追加.
*2012/02/06 ie9で動作するように変更．(一部不具合有り)
*2012/02/06 header,footerの行毎の高さ設定に対応．
*2012/02/06 IE8において固定列を変更した際に不要なdiv要素が残ってしまうのを修正.
*2012/02/06 縦スクロールと比較し，横スクロールは処理のコストが高いため，列の固定処理はsetIntervalで行う．
*2012/02/06 cssセレクタ記述の厳密化とセレクタの指定ミスを修正．
*2012/02/06 スクロール処理の若干の軽量化．
*2012/02/06 コードの整理．IE6,7で動作しなくなっていたのを修正.
*2012/02/07 全体的な軽量化を図った．
*2012/02/08 横スクロール時の軽量化を行った.
*2012/02/08 スクロール指定時にscrolled=trueを設定するようにした.
*2012/02/10 tableタグへのマークアップのみで動作するように変更．scrollable="true"で動作する．
*2012/02/10 列の固定を指定しなかった場合にエラーとなる部分を修正．
*NOTE:pushpin headerと異なる点はスクロールバーの高さがテーブル全体の高さとなること．
*NOTE:タイマーは必要？→行数が増えると余りに負荷が高い.
*@author DEFGHI1977@xboxlive http://defghi1977-onblog.blogspot.com/
*
*[使用許諾/免責]
*・本プログラムの著作権はDEFGHI1977@xboxliveに帰属する．
*・本コードを利用することで発生した不具合・損害については当方は一切関知しないこととする
*上記に承諾した場合に限り商用・私用を問わず，用途を問わず利用可能とする．
*コードの改変・修正については自己責任で行う限り禁止しない．
*/
(function(){
	
	//from http://d.hatena.ne.jp/amachang/20071010/1192012056
	/*@cc_on
	var doc = document;
	eval('var document = doc');
	@*/

	/**
	*列固定処理のインターバル
	*/
	var synchronizeInterval = 20;
	
	/**
	*列固定処理のインターバルの属性名
	*/
	var TIMER_ID = "timerId";
	
	/**
	*空文字列
	*/
	var NULL_STR = "";

	/**
	*jQuery拡張:テーブルにスクロール機能を追加する.
	*@param tableWidth テーブルの表示幅
	*@param tableHeight テーブルの表示高
	*@param flozenF 固定列数（左）
	*@param flozenL 固定列数（右）
	*@return 処理対象となったjQueryオブジェクト
	*/
	jQuery.fn.scrollable = function(
		tableWidth, tableHeight, flozenF, flozenL){
		this.each(function(){
			setScrollable(jQuery(this), tableWidth, tableHeight, flozenF, flozenL);
		});
		return this;
	};
	/**
	*テーブルにスクロール機能を追加する.
	*table要素でなかったら何もしない.
	*無引数の場合，属性値が設定されていたらそちらを参照する．
	*@param singleTable 単一テーブルのjqueryオブジェクト
	*@param tableWidth テーブルの表示幅
	*@param tableHeight テーブルの表示高
	*@param flozenF 固定列数（左）
	*@param flozenL 固定列数（右）
	*@return 処理対象となったjQueryオブジェクト
	*/
	function setScrollable(singleTable ,tableWidth, tableHeight, flozenF, flozenL){
		if(!singleTable.is("table")){
			return singleTable;
		}

		//引数調整
		if(!tableWidth){
			if(singleTable.attr("fixWidth")){
				tableWidth = ~~singleTable.attr("fixWidth");
			}else{
				tableWidth = 300;
			}
		}

		if(!tableHeight){
			if(singleTable.attr("fixHeight")){
				tableHeight = ~~singleTable.attr("fixHeight");
			}else{
				tableHeight = 300;
			}
		}

		if(!flozenF){
			if(singleTable.attr("flozenF")){
				flozenF = ~~singleTable.attr("flozenF");
			}else{
				flozenF = 0;
			}
		}

		if(!flozenL){
			if(singleTable.attr("flozenL")){
				flozenL = ~~singleTable.attr("flozenL");
			}else{
				flozenL = 0;
			}
		}
		
		singleTable.attr("fixWidth", tableWidth)
			.attr("fixHeight", tableHeight)
			.attr("flozenF", flozenF)
			.attr("flozenL", flozenL)
			.attr("scrollable", true);
		
		//IE判定
		var ie = isIE();
		var func;
		
		if(!ie){
			func = forOther.addScrollFunction;
		}else if(ie == 8){
			func = forIE8.addScrollFunction;
		}else{
			func = forIE.addScrollFunction;
		}
		func(singleTable, tableWidth, tableHeight, flozenF, flozenL);
		return singleTable;
	}
	
	/**
	*実行環境がIEかどうかを判定する
	*NOTE:document.ready後でないと正しく動作しない.
	*@return IEのバージョン番号（他のブラウザではundefined）
	*/
	var ieVal = 0;
	function isIE(){
		if(ieVal == 0){
			if(document.body.style.maxHeight != undefined){
				ieVal = (!/*@cc_on!@*/false) ? undefined: !document.documentMode ? 7: document.documentMode;
				return ieVal;
			} else {
				ieVal = 6;
				return ieVal;// IE6, older browsers
			}
		}else{
			return ieVal;
		}
	}

	/**
	*スクロールバーの幅を取得する．
	*NOTE:document.ready後でないと正しく動作しない.
	*@return スクロールバーの幅
	*/
	function getScrollbarWidth(){
		var body = jQuery("body");
		var outer = jQuery("<div>");
		outer.css({
			width: 100,
			height: 100, 
			overflow: "scroll",
			border: "none",
			padding: 0,
			margin: 0,
			visibility: "hidden"
		});
		var inner = jQuery("<div>&nbsp;</div>");
		inner.css({
			width: 200,
			height: 200,
			border: "none",
			padding: 0,
			margin: 0
		});
		outer.append(inner).appendTo(body);
		outer.scrollTop(200);
		var barWidth = outer.scrollTop() - 100;
		outer.remove();
		return barWidth;
	}
	
	/**
	*テーブルのIDを生成する.
	*@return テーブルのID
	*/
	var cnt = 0;
	var SCROLLABLE = "scrollable_";
	function getId(){
		cnt++;
		return "scrollable_" + cnt;
	}
	
	/**
	*セルの相対位置を削除する．
	*この値を削除することでスタイルシートの位置に初期化出来る．
	*@param jqTbl 削除対象のテーブル
	*/
	function resetPosition(jqTbl){
		jqTbl.find("td,th").css({
			top: NULL_STR, left: NULL_STR
		});
	}
	
	/**
	*スタイル文字列の生成ヘルパーオブジェクト
	*ie6の場合はセレクタ「>」を指定しても無視する．
	*@param top トップレベルエレメントのID
	*@param selectors セレクタ文字列の配列
	*@param css スタイル値のhash
	*/
	function styleBuilder(top, selectors, css){
		this.top = top;
		this.selectors = selectors;
		this.css = css;
	}
	(function(p){
		/**
		*トップレベルエレメントのID
		*/
		p.top = NULL_STR;
		/**
		*セレクタ文字列を格納するフィールド
		*/
		p.selectors = new Array();
		/**
		*cssスタイルシート値を格納するフィールド
		*/
		p.css = new Object();
		/**
		*スタイル文字列を取得する
		*@return スタイル文字列
		*/
		p.toString = function(){
			var len = this.selectors.length;
			if(this.top == NULL_STR || len == 0){
				//throw new TypeError("missing parameters.");
				return NULL_STR;
			}
			var i;
			for(i = 0; i<len; i++){
				if(this.selectors[i].match(",")){
					throw new TypeError("some selectors contain [,].");
				}
			}
			var top = "#" + this.top;
			var str =  top + " " + this.selectors.join("," + top + " ");
			str += "{\r";
			for(i in this.css){
				str += "    " + i + ":" + this.css[i] + ";\r";
			}
			str += "}";
			//ie6,7の場合はセレクタ「>」が利用不可
			if(isIE() == 6 || isIE() == 7){
				str = str.replace(/>/g, " ");
			}
			return str;
		};
	})(styleBuilder.prototype);
	
	/**
	*pxを取り除いた値を取得する.
	*@param 値取得対象の文字列
	*@return 変換後の値
	*/
	var PX = "px";
	function removePx(str){
		return ~~(str.replace(PX, NULL_STR));
	}
	
	/**
	*カラムにクラスを設定する.
	*左から[f0,f1…l1,l0]
	*@param tbl 機能を追加する対象のtblエレメント
	*@param flozenF 固定列（左）
	*@param flozenL 固定列（右）
	*/
	function appendRowClass(
		jqTbl, flozenF, flozenL){
		var tblId = jqTbl.attr("id");
		
		var rows = jqTbl.find("tr");
		var colCount = rows[0].children.length;
		
		var i, j, cells;
		for(i = 0; i<flozenF; i++){
			cells = rows.find("td:eq(" + i + "),th:eq(" + i + ")");
			cells.addClass("f" + i);
		}
		for(i = 0; i<flozenL; i++){
			j = colCount - i - 1;
			cells = rows.find("td:eq(" + j + "),th:eq(" + j + ")");
			cells.addClass("l" + i);
		}
	}
	
	/**
	*スタイル要素を削除する．
	*@param jqTbl スタイルを削除するテーブル
	*/
	function removeStyleElem(jqTbl){
		jQuery("#" + getStyleId(jqTbl)).remove();
	}
	/**
	*スタイル要素を追加する．
	*@param jqTbl スタイルを追加するテーブル
	*@param style スタイル文字列
	*/
	function appendStyleElem(jqTbl, style){
		jQuery("head").append(
			'<style id="' + getStyleId(jqTbl) + '" type="text/css">' + style + '</style>');
	}
	/**
	*テーブルをdivタグで2重に囲む．
	*@param jqTbl 対象のTBL
	*/
	function wrapTableByDivs(jqTbl){
		var tblId = jqTbl.attr("id");
		jqTbl.wrap(
			'<div id="' + getScrollerId(jqTbl) + '"><div id="' + getFixerId(jqTbl) + '"></div></div>'
		);
	}
	/**
	*テーブルの殻を取得する．（スクロール部）
	*@param jqTbl 対象のTBL
	*@return スクロール部におけるjQueryオブジェクト
	*/
	function getScroller(jqTbl){
		return jQuery("#" + getScrollerId(jqTbl));
	}
	/**
	*テーブルの殻を取得する．（サイズの固定部）
	*@param jqTbl 対象のTBL
	*/
	function getFixer(jqTbl){
		return jQuery("#" + getFixerId(jqTbl));
	}
	/**
	*テーブルのIDを取得する．
	*@param jqTbl 対象のTBL
	*/
	function getId(jqTbl){
		var tblId = jqTbl.attr("id");
		if(tblId == NULL_STR){
			tblId = getId();
			jqTbl.attr("id", tblId);
		}
		return tblId;
	}
	/**
	*テーブルのスタイル要素のIDを取得する．
	*@param jqTbl 対象のTBL
	*/
	var _STYLE = "_style";
	function getStyleId(jqTbl){
		return getId(jqTbl) + _STYLE;
	}
	/**
	*テーブルの殻のIDを取得する．（スクロール部）
	*@param jqTbl 対象のTBL
	*/
	var _SCROLLER = "_scroller";
	function getScrollerId(jqTbl){
		return getId(jqTbl) + _SCROLLER;
	}
	/**
	*テーブルの殻のIDを取得する．（サイズの固定部）
	*@param jqTbl 対象のTBL
	*/
	var _FIXER = "_fixer";
	function getFixerId(jqTbl){
		return getId(jqTbl) + _FIXER;
	}
	/**
	*テーブル内部のDIVのクラス名を取得する．
	*@param jqTbl 対象のTBL
	*/
	var _DIV = "_div";
	function getDivClass(jqTbl){
		return getId(jqTbl) + _DIV;
	}
	/**
	*内部要素のスタイルを配列として取得する.
	*@param jq 入手対象のjQueryオブジェクト
	*@return スタイルの配列
	*/
	function toStyleArr(jq){
		var styles = new Array();
		var elems = jq.get();
		for(var i = 0, len = elems.length; i<len; i++){
			styles.push(elems[i].style);
		}
		return styles;
	}

	/**
	*レガシーIE以外のブラウザ用
	*/
	var forOther = new (function(){
		/**
		*Tableにスクロール機能を追加する．
		*@param tbl 機能を追加する対象のtblエレメント
		*@param tableWidth テーブルの幅
		*@param tableHeight テーブルの高さ
		*@param flozenF 固定列（左）
		*@param flozenL 固定列（右）
		*/
		this.addScrollFunction = function(
			tbl, tableWidth, tableHeight, flozenF, flozenL){

			var jqTbl = jQuery(tbl);
			jqTbl.css("visibility","hidden");

			//インターバルをクリア
			clearInterval(~~jqTbl.attr(TIMER_ID));
			//スタイルシートを追加
			appendStyle(
				jqTbl, tableWidth, tableHeight, flozenF, flozenL);
			//タグの順番を変更
			switchOrder(jqTbl);
			//セルのポジションのリセット
			resetPosition(jqTbl);
			//イベントの追加
			addScrollEvent(jqTbl, flozenF, flozenL);
			jqTbl.css("visibility", NULL_STR);

		};

		/**
		*スクロールイベントの処理を追加する
		*@param jqTbl イベントを追加したい対象のテーブル
		*@param flozenF 固定したい左列数
		*@param flozenL 固定したい右列数
		*/
		function addScrollEvent(jqTbl, flozenF, flozenL){
			jqTbl.unbind("scroll");
			jqTbl.bind(
				"scroll", 
				getScrollAction(jqTbl, flozenF, flozenL));
		}
	
		/**
		*スクロール処理のactionを取得する
		*@param jqTbl 対象テーブル
		*@param flozenF 固定したい左列数
		*@param flozenL 固定したい右列数
		*@return スクロール処理の関数
		*/
		function getScrollAction(jqTbl, flozenF, flozenL){
			
			var PX = "px", AUTO = "auto";
			//スクロールバーの幅
			var barWidth = getScrollbarWidth();

			//要素群
			var header = jqTbl.find("thead");
			var body = jqTbl.find("tbody");
			var footer = jqTbl.find("tfoot");
			var footerOuterHeight = footer.outerHeight();
			var rows = jqTbl.find("tr");
		
			//要素の大きさ
			var tableWidth = removePx(jqTbl.css("width"));
			var bodyWidth = body.innerWidth();
			var tableHeight = removePx(jqTbl.css("height"));
			var bodyHeight = body.outerHeight();

			//右要素位置の差分
			var leftDiff = tableHeight > bodyHeight 
				? 0
				: barWidth;

			//下要素位置の差分
			var topDiff = tableWidth > bodyWidth 
				? tableHeight - footerOuterHeight 
				: tableHeight - footerOuterHeight - barWidth;

			//styles
			var headerElemStyle,footerElemStyle;
			if(header.length > 0){
				headerElemStyle = header[0].style;
			}
			if(footer.length > 0){
				footerElemStyle = footer[0].style;
			}
		
			var i, col;
			//左の固定セル
			var lefts = new Array();
			var leftPos = new Array();//表示の基準位置
			for(i = 0; i < flozenF; i++){
				col = rows.find("th:eq(" + i + "),td:eq(" + i + ")");
				lefts.push(toStyleArr(col));
				leftPos.push(removePx(jQuery(col[0]).css("left")));
			}
			//右の固定セル
			var rights = new Array();
			var r_leftPos = new Array();	//表示の基準位置
			var colCount = jqTbl.find("tr:eq(0)").children().length;
			for(i = 0; i < flozenL; i++){
				var j = colCount - i - 1;
				col = rows.find("th:eq(" + j + "),td:eq(" + j + ")");
				rights.push(toStyleArr(col));
				var cellLeft = removePx(jQuery(col[0]).css("left"));
				//tableの右端にセルが並ぶようにleftをずらしておく．
				r_leftPos.push(cellLeft - bodyWidth + tableWidth);
			}
			
			//位置の同期を取るための位置情報
			//次回の位置
			var nextLeft = 0;
			var mooving = false;
			//前回の位置
			var preTop;
			var preLeft;
		
			fixRows(0);
			fixColumns(0);
			
			//列固定はインターバル処理とする
			var timerId = setInterval(function(){
				if(!mooving && preLeft != nextLeft){
					preLeft = nextLeft;
					mooving = true;
					fixColumns(nextLeft);
					mooving = false;
				}
			}, synchronizeInterval);
			jqTbl.attr(TIMER_ID, timerId);

			/**
			*行を固定する
			*@param top 縦方向のスクロール量
			*/
			function fixRows(top){
				//面倒だが処理を少しでも軽くするため,生のElementを操作する.
				if(headerElemStyle){
					headerElemStyle.top = top + PX;
				}
				var f_top = top + topDiff;
				if(footerElemStyle){
					var tmp = footerElemStyle;
					tmp.top = f_top + PX;
					tmp.bottom = AUTO;
				}
			}
		
			/**
			*列を固定する
			*@param left 横方向のスクロール量
			*/
			function fixColumns(left){
				var r_left = left - leftDiff;
				//面倒だが処理を少しでも軽くするため,生のElementを操作する.
				var i, len, col, j, len2, leftPosText;
				for(i = 0,len = lefts.length; i<len; i++){
					col = lefts[i];
					leftPosText = (left + leftPos[i]) + PX;
					for(j = 0, len2 = col.length; j<len2; j++){
						col[j].left = leftPosText;
					}
				}
				for(i = 0,len = rights.length; i<len; i++){
					col = rights[i];
					leftPosText = (r_left + r_leftPos[i]) + PX;
					for(j = 0, len2 = col.length; j<len2; j++){
						col[j].left = leftPosText;
					}
				}
			}

			//アクション関数を返す
			return function(e){
				var ct = e.currentTarget;
				var top = ct.scrollTop;
				var left = ct.scrollLeft;
				//行固定
				if(preTop != top){
					fixRows(top);
					preTop = top;
				}
				//列固定→インターバル処理
				nextLeft = left;
			};
		}
		
		/**
		*TableのCellSpacing
		*border-collapse:collapseが設定されていたら強制的に0pxとする
		*@param jqTbl 値を取得したいtblのjQueryオブジェクト
		*@return 得られたcell-spacing値の配列
		*/
		function getBorderSpacing(jqTbl){
			if(jqTbl.css("border-collapse") == "collapse"){
				return [0, 0];
			}		
			var bsText = jqTbl.css("border-spacing");
			var bsArr = bsText.split(" ");
			return	[
				removePx(bsArr[0]), 
				//For Opera
				bsArr[1] == undefined ? removePx(bsArr[0]) : removePx(bsArr[1])
			];
		}
	
		/**
		*スクロールテーブル用のスタイルシートを追加する.
		*tableのもつレイアウト機能を全て殺してblock要素で再構築する．
		*@param jqTbl スクロールテーブル
		*@param tableWidth 固定幅
		*@param tableHeight 固定高さ
		*@param flozenF 固定したい左列の数(既定値0)
		*@param flozenL 固定したい右列の数(既定値0)
		*/
		function appendStyle(
			jqTbl, tableWidth, tableHeight, flozenF, flozenL){

			//既存スタイルの削除
			removeStyleElem(jqTbl);

			//head要素に追加
			var style = getStyleString(
				jqTbl, tableWidth, tableHeight, flozenF, flozenL);
			appendStyleElem(jqTbl, style);
		}
		/**
		*スクロールテーブル用のスタイルシートの設定文字列を取得する.
		*@param jqTbl スクロールテーブル
		*@param tableWidth 固定幅
		*@param tableHeight 固定高さ
		*@param flozenF 固定したい左列の数
		*@param flozenL 固定したい右列の数
		*/
		function getStyleString(
			jqTbl, tableWidth, tableHeight, flozenF, flozenL){
			var tblId = getId(jqTbl);
			var borderSpacings = getBorderSpacing(jqTbl);
			var borderSpacingX = borderSpacings[0];
			var borderSpacingY = borderSpacings[1];

			var styles = new Array();

			//全体をblock要素に
			styles.push(
				new styleBuilder(
					tblId,
					["", "thead", "tbody", "tfoot", "tr", "td", "td"],
					{"display": "block"}
				)
			);
		
			//処理の都合上,td,th→tr→thead,tbody,tfoot→tableの順にスタイルを設定
			styles.push(
				new styleBuilder(
					tblId,
					["th", "td"],
					{"position": "absolute","overflow":"hidden"}
				)
			);

			//列方向
			var i,len,row;
			var tds = jqTbl.find("tr:eq(0)").children();
			var left = borderSpacingX;
			for(i = 0, len = tds.length; i<len; i++){
				var td = jQuery(tds[i]);
				var o_width = td.outerWidth(true);
				var i_width = cellInnerWidth(td);
				styles.push(
					new styleBuilder(
						tblId,
						[">thead>tr>th:nth-child(" + (i + 1) + ")", 
							">tbody>tr>td:nth-child(" + (i + 1) + ")"],
						{
							"width": i_width + "px",
							"left" : left + "px",
							"top" : borderSpacingY + "px"
						}
					)
				);
				styles.push(
					new styleBuilder(
						tblId,
						[">tfoot>tr>td:nth-child(" + (i + 1) + ")"],
						{
							"width": i_width + "px",
							"left" : left + "px",
							"top" : 0
						}
					)
				);
				left += (borderSpacingX + o_width);
			}
			styles.push(
				new styleBuilder(
					tblId,
					["tr"],
					{
						"position": "relative", 
						"width": left + "px", 
						"overflow": "hidden"
					}
				)
			);
			styles.push(
				new styleBuilder(
					tblId,
					[""],
					{
						"position": "relative", 
						"width": left + "px", "height": "auto"
					}
				)
			);

			//行方向
			var thtr = jqTbl.find("thead tr");
			var throwHeight;
			var headerHeight = 0;
			if(thtr.length != 0){
				for(i = 0,len = thtr.length; i<len; i++){
					row = jQuery(thtr[i]);
					throwHeight = row.innerHeight() + borderSpacingY;
					styles.push(
						new styleBuilder(
							tblId,
							[">thead>tr:nth-child(" + (i+1) + ")"],
							{"height": throwHeight + "px"}
						)
					);
					styles.push(
						new styleBuilder(
							tblId,
							[">thead>tr:nth-child(" + (i+1) + ") > th"],
							{"height": cellInnerHeight(row.find("th:eq(0)")) + "px"}
						)
					);
					headerHeight += throwHeight;
				}
			}
			//body部は1行目の高さを共通の高さとする．
			var tbtr = jqTbl.find("tbody tr:eq(0)");
			var tbtd = tbtr.find("td:eq(0)");
			if(tbtr.length != 0){
				styles.push(
					new styleBuilder(
						tblId,
						[">tbody>tr"],
						{"height": (tbtr.innerHeight() + borderSpacingY) + "px"}
					)
				);
				styles.push(
					new styleBuilder(
						tblId,
						[">tbody>tr>td"],
						{"height": cellInnerHeight(tbtd) + "px"}
					)
				);
			}
			var tftr = jqTbl.find(">tfoot>tr");
			var tfrowHeight;
			var footerHeight = 0;
			if(tftr.length != 0){
				for(i = 0, len = tftr.length; i<len; i++){
					row = jQuery(tftr[i]);
					tfrowHeight = row.innerHeight() + borderSpacingY;
					styles.push(
						new styleBuilder(
							tblId,
							[">tfoot>tr:nth-child(" + (i+1) + ")"],
							{"height": tfrowHeight + "px"}
						)
					);
					styles.push(
						new styleBuilder(
							tblId,
							[">tfoot>tr:nth-child(" + (i+1) + ")>td"],
							{"height": cellInnerHeight(row.find("td:eq(0)")) + "px"}
						)
					);
					footerHeight += tfrowHeight;
				}
			}
			styles.push(
				new styleBuilder(
					tblId,
					[">thead"],
					{
						"position": "absolute", 
						"top": 0,
						"z-index": 100,
						"overflow": "hidden"
					}
				)
			);
			styles.push(
				new styleBuilder(
					tblId,
					[">tfoot"],
					{
						"position": "absolute",
						"bottom": 0,
						"z-index": 100,
						"overflow": "hidden"
					}
				)
			);
			//NOTE:tbody部のpaddingでなければ下部空白を作ることができない．(opera,chrome)
			styles.push(
				new styleBuilder(
					tblId,
					[">tbody"],
					{
						"width": left + "px",
						"height": "auto",
						"padding-top": headerHeight + "px", 
						"padding-bottom": footerHeight + borderSpacingY + "px",
						"padding-right": 0,
						"padding-left": 0
					}
				)
			);

			//固定列
			var selectors = new Array();
			var j;
			for(j = 1; j <= flozenF; j++){
				selectors.push(">thead>tr>th:nth-child(" + j + ")");
				selectors.push(">tfoot>tr>td:nth-child(" + j + ")");
			}
			for(j = 1; j <= flozenL; j++){
				selectors.push(">thead>tr>th:nth-last-child(" + j + ")");
				selectors.push(">tfoot>tr>td:nth-last-child(" + j + ")");
			}
			styles.push(
				new styleBuilder(
					tblId,
					selectors,
					{"z-index": 150}
				)
			);
			for(j = 1; j <= flozenF; j++){
				selectors.push(">tbody>tr>td:nth-child(" + j + ")");
			}
			for(j = 1; j <= flozenL; j++){
				selectors.push(">tbody>tr>td:nth-last-child(" + j + ")");
			}
			styles.push(
				new styleBuilder(
					tblId,
					selectors,
					{"z-index": 50}
				)
			);

			//table本体
			var pos = jqTbl.css("position");
			if(pos == "" || pos == "static"){
				pos = "relative";
			}
			styles.push(
				new styleBuilder(
					tblId,
					[""],
					{
						"position": pos,
						"overflow": "auto",
						"width": (tableWidth - borderSpacingX) + "px",
						"height": (tableHeight - borderSpacingY)  + "px"
					}
				)
			);

			return styles.join("\n");
		}
	
		/**
		*テーブルのセルの内部幅を取得する.
		*@param 幅を取得したいtd,th要素のjQueryオブジェクト
		*@return cellpaddingが取り除かれた幅
		*/
		function cellInnerWidth(cell){
			//NOTE:td,th要素においてはinnerWidth,innerHeightから得られた値にpaddingが含まれている.
			return cell.innerWidth() 
				- removePx(cell.css("padding-left")) 
				- removePx(cell.css("padding-right"));
		}
		/**
		*テーブルのセルの内部の高さを取得する.
		*@param 高さを取得したいtd,th要素のjQueryオブジェクト
		*@return cellpaddingが取り除かれた高さ
		*/
		function cellInnerHeight(cell){
			return cell.innerHeight() 
				- removePx(cell.css("padding-top")) 
				- removePx(cell.css("padding-bottom"));
		}
		/**
		*テーブルのthead,tbody,tfootの順番を入れ替える
		*@param 入れ替え対象のテーブルのjQueryオブジェクト
		*/
		function switchOrder(jqTbl){
			var thead = jqTbl.find("thead").remove();
			var tbody = jqTbl.find("tbody").remove();
			var tfoot = jqTbl.find("tfoot").remove();
			jqTbl.append(thead).append(tbody).append(tfoot);
		}
	})();

	/**
	*IE8用
	*/
	var forIE8 = new (function(){
		/**
		*Tableにスクロール機能を追加する．
		*@param tbl 機能を追加する対象のtblエレメント
		*@param tableWidth テーブルの幅
		*@param tableHeight テーブルの高さ
		*@param flozenF 固定列（左）
		*@param flozenL 固定列（右）
		*/
		this.addScrollFunction = function(
			tbl, tableWidth, tableHeight, flozenF, flozenL){
			
			var jqTbl = jQuery(tbl);
			
			//インターバル処理の削除
			clearInterval(~~jqTbl.attr(TIMER_ID));
			
			//2重のdivで囲む
			if(getScroller(jqTbl).length == 0){
				wrapTableByDivs(jqTbl);
			}
			
			//列方向のクラスを追加
			appendRowClass(jqTbl, flozenF, flozenL);
			//スタイルシートの削除
			removeStyleElem(jqTbl);
			//セルの内部divタグの追加
			appendDivs(jqTbl, flozenF, flozenL);
			//スタイルシートを追加
			appendStyle(
				jqTbl, tableWidth, tableHeight, flozenF, flozenL);
			//セルのポジションのリセット
			resetPosition(jqTbl);
			//イベントの追加
			addScrollEvent(jqTbl, flozenF, flozenL);
		};
		
		/**
		*スクロールイベントを追加する．
		*@param tbl 機能を追加する対象のtblエレメント
		*@param flozenF 固定列（左）
		*@param flozenL 固定列（右）
		*/
		function addScrollEvent(jqTbl, flozenF, flozenL){
			var scroller = getScroller(jqTbl);
			scroller.unbind("scroll");
			scroller.bind(
				"scroll", 
				getScrollAction(jqTbl, flozenF, flozenL));
		}
		
		/**
		*スクロール時の処理を取得する
		*@param tbl 機能を追加する対象のtblエレメント
		*@param flozenF 固定列（左）
		*@param flozenL 固定列（右）
		*/
		function getScrollAction(jqTbl, flozenF, flozenL){

			var PX = "px";
			
			var tblId = getId(jqTbl);
			var scroller = getScroller(jqTbl);
			var fixer = getFixer(jqTbl);
			
			var barWidth = getScrollbarWidth();
			var scrollerWidth = scroller.innerWidth();
			var scrollerHeight = scroller.innerHeight();
			var fixerWidth = fixer.outerWidth();
			var fixerHeight = fixer.outerHeight();

			//右要素位置の差分
			var leftDiff = scrollerHeight > fixerHeight
				? fixerWidth - scrollerWidth
				: fixerWidth - scrollerWidth + barWidth;

			//下要素位置の差分
			var topDiff = scrollerWidth > fixerWidth
				? fixerHeight - scrollerHeight 
				: fixerHeight - scrollerHeight + barWidth;

			var headElemStyles = toStyleArr(jqTbl.find("thead>tr>th"));
			var footElemStyles = toStyleArr(jqTbl.find("tfoot>tr>td"));
			
			var i;
			var selectors;
			selectors = new Array();
			for(i = 0; i < flozenF; i++){
				selectors.push("tr>td.f" + i + ",tr>th.f" + i);
			}
			var leftElemStyles = toStyleArr(jqTbl.find(selectors.join(",")));
			selectors = new Array();
			for(i = 0; i < flozenL; i++){
				selectors.push("tr>td.l" + i + ",tr>th.l" + i);
			}
			var rightElemStyles = toStyleArr(jqTbl.find(selectors.join(",")));

			var nextLeft = 0;
			var mooving = false;
			var preTop;
			var preLeft;
			
			fixRows(0);
			fixColumns(0);

			//列固定はインターバル処理とする
			var timerId = setInterval(function(){
				if(!mooving && preLeft != nextLeft){
					preLeft = nextLeft;
					mooving = true;
					fixColumns(nextLeft);
					mooving = false;
				}
			}, synchronizeInterval);
			jqTbl.attr(TIMER_ID, timerId);
			
			//アクション関数を返す
			return function(e){
				var top = scroller.scrollTop();
				var left = scroller.scrollLeft();
				//変化のあった方向のみ実行
				if(preTop != top){
					fixRows(top);
					preTop = top;
				}
				nextLeft = left;
			}
			/**
			*行を固定する
			*@param top 縦方向のスクロール量
			*/
			function fixRows(top){
				var i, len, topText;
				topText = top + PX;
				for(i = 0, len = headElemStyles.length; i<len; i++){
					headElemStyles[i].top = topText;
				}
				var b_top = top - topDiff;
				topText = b_top + PX;
				for(i = 0, len = footElemStyles.length; i<len; i++){
					footElemStyles[i].top = topText;
				}
			}
			/**
			*列を固定する
			*@param left 横方向のスクロール量
			*/
			function fixColumns(left){
				var i, len, leftText;
				leftText = left + PX;
				for(i = 0, len = leftElemStyles.length; i<len; i++){
					leftElemStyles[i].left = leftText;
				}
				var r_left = left - leftDiff;
				leftText = r_left + PX;
				for(i = 0, len = rightElemStyles.length; i<len; i++){
					rightElemStyles[i].left = leftText;
				}
			}
		}
		
		/**
		*固定セルの内部をdivタグで囲む
		*NOTE:ie8では背景色が意図した形でレンダリングされないため.
		*/
		function appendDivs(jqTbl, flozenF, flozenL){
			var cls = getDivClass(jqTbl);
			
			//既存のdivを削除する
			jqTbl.find("div." + cls).remove();
			
			//ヘッダーとフッター
			jqTbl.find("thead>tr,tfoot>tr").each(getWrapDiv("th,td"));
			
			var selectors = new Array();
			var i;
			for(i = 0; i<flozenF; i++){
				selectors.push("td.f" + i);
			}
			for(i = 0; i<flozenL; i++){
				selectors.push("td.l" + i);
			}
			var selectorString = selectors.join(",");
			jqTbl.find("tbody>tr").each(getWrapDiv(selectorString));
			
			function getWrapDiv(cellSelector){
				return function(i, elem){
					var row = jQuery(elem);
					var height = row.innerHeight();
					row.find(cellSelector).each(wrapDiv);
					
					function wrapDiv(i, elem){
						var jq = jQuery(elem);
						
						//border表示用のdiv
						//NOTE:ie8ではposition:relativeが設定されているセルはbackground-colorがborderの全面にレンダリングされてしまう.
						var borderDiv = jQuery("<div>").addClass(cls);
						borderDiv.css({
							"position": "absolute",
							"width": jq.outerWidth(),
							"height": jq.outerHeight(),
							"top": -1 * removePx(jq.css("border-top-width")),
							"left": -1 * removePx(jq.css("border-left-width")),
							"border-top-width": jq.css("border-top-width"),
							"border-top-style": jq.css("border-top-style"),
							"border-top-color": jq.css("border-top-color"),
							"border-right-width": jq.css("border-right-width"),
							"border-right-style": jq.css("border-right-style"),
							"border-right-color": jq.css("border-right-color"),
							"border-bottom-width": jq.css("border-bottom-width"),
							"border-bottom-style": jq.css("border-bottom-style"),
							"border-bottom-color": jq.css("border-bottom-color"),
							"border-left-width": jq.css("border-left-width"),
							"border-left-style": jq.css("border-left-style"),
							"border-left-color": jq.css("border-left-color")
						});
						jq.append(borderDiv);
					}
				}
			}
		}
		
		/**
		*スクロールテーブル用のスタイルシートを追加する.
		*tableのもつレイアウト機能を全て殺してblock要素で再構築する．
		*@param jqTbl スクロールテーブル
		*@param tableWidth 固定幅
		*@param tableHeight 固定高さ
		*@param flozenF 固定したい左列の数(既定値0)
		*@param flozenL 固定したい右列の数(既定値0)
		*/
		function appendStyle(
			jqTbl, tableWidth, tableHeight, flozenF, flozenL){
			
			//head要素に追加
			var style = getStyleString(
				jqTbl, tableWidth, tableHeight, flozenF, flozenL);		
			appendStyleElem(jqTbl, style);
		}
		
		/**
		*スクロールテーブル用のスタイルシートの設定文字列を取得する.
		*@param jqTbl スクロールテーブル
		*@param tableWidth 固定幅
		*@param tableHeight 固定高さ
		*@param flozenF 固定したい左列の数
		*@param flozenL 固定したい右列の数
		*/
		function getStyleString(
			jqTbl, tableWidth, tableHeight, flozenF, flozenL){
			var tblId = getId(jqTbl);
			var fixerId = getFixerId(jqTbl);
			var scrollerId = getScrollerId(jqTbl);
			var styles = new Array();
			
			//スクロール部
			var position = jqTbl.css("position");
			if(position == "" || position == "static"){
				position = "relative";
			}
			styles.push(
				new styleBuilder(
					scrollerId,
					[""],
					{
						"position": position,
						"top": jqTbl.css("top"),
						"left": jqTbl.css("left"),
						"right": jqTbl.css("right"),
						"bottom": jqTbl.css("bottom"),
						"overflow": "auto",
						//NOTE:IE8ではborderの分width,heightがずれてしまう
						"width": tableWidth - removePx(jqTbl.css("border-right-width")) - removePx(jqTbl.css("border-left-width")) + "px",
						"height": tableHeight - removePx(jqTbl.css("border-top-width")) - removePx(jqTbl.css("border-bottom-width")) + "px",
						"border-top-width": jqTbl.css("border-top-width"),
						"border-top-style": jqTbl.css("border-top-style"),
						"border-top-color": jqTbl.css("border-top-color"),
						"border-right-width": jqTbl.css("border-right-width"),
						"border-right-style": jqTbl.css("border-right-style"),
						"border-right-color": jqTbl.css("border-right-color"),
						"border-bottom-width": jqTbl.css("border-bottom-width"),
						"border-bottom-style": jqTbl.css("border-bottom-style"),
						"border-bottom-color": jqTbl.css("border-bottom-color"),
						"border-left-width": jqTbl.css("border-left-width"),
						"border-left-style": jqTbl.css("border-left-style"),
						"border-left-color": jqTbl.css("border-left-color"),
						"margin-top": jqTbl.css("margin-top"),
						"margin-right": jqTbl.css("margin-right"),
						"margin-bottom": jqTbl.css("margin-bottom"),
						"margin-left": jqTbl.css("margin-left")
					}
				)
			);
			//幅固定
			styles.push(
				new styleBuilder(
					fixerId,
					[""],
					{
						"position": "static",
						"width": jqTbl.innerWidth() + "px"
					}
				)
			);
			//本体
			styles.push(
				new styleBuilder(
					tblId,
					[""],
					{
						"vertical-align": "top",
						"position": "static",
						"top": 0,
						"left": 0,
						"border": "none",
						"margin": 0
					}
				)
			);
			
			//ヘッダ,フッタ
			styles.push(
				new styleBuilder(
					tblId,
					[">thead>tr>th", ">tfoot>tr>td"],
					{
						"position": "relative",
						"overflow": "hidden",
						"z-index": 25
					}
				)
			);
			//固定列
			var i;
			for(i = 0; i<flozenF; i++){
				styles.push(
					new styleBuilder(
						tblId,
						[">thead>tr>th.f" + i, ">tfoot>tr>td.f" + i],
						{
							"position": "relative",
							"overflow": "hidden",
							"z-index": 100
						}
					)
				);
				styles.push(
					new styleBuilder(
						tblId,
						[">tbody>tr>td.f" + i],
						{
							"position": "relative",
							"overflow": "hidden",
							"z-index": 50
						}
					)
				);
			}
			for(i = 0; i<flozenL; i++){
				styles.push(
					new styleBuilder(
						tblId,
						[">thead>tr>th.l" + i, ">tfoot>tr>td.l" + i],
						{
							"position": "relative",
							"overflow": "hidden",
							"z-index": 100
						}
					)
				);
				styles.push(
					new styleBuilder(
						tblId,
						[">tbody>tr>td.l" + i],
						{
							"position": "relative",
							"overflow": "hidden",
							"z-index": 50
						}
					)
				);
			}
			//NOTE:thead,tbody,tfootに透明を指定しないとセルの背景色が表示されない
			styles.push(
				new styleBuilder(
					tblId,
					[">thead", ">tbody", ">tfoot"],
					{
						"background-color": "transparent"
					}
				)
			);
			//NOTE:vertical-align:topとしないと基準がずれる
			styles.push(
				new styleBuilder(
					tblId,
					["th", "td"],
					{
						"vertical-align": "top"
					}
				)
			);
			return styles.join("\n");
		}
	})();
	
	/**
	*IE用
	*/
	var forIE = new (function(){
		/**
		*Tableにスクロール機能を追加する．
		*@param tbl 機能を追加する対象のtblエレメント
		*@param tableWidth テーブルの幅
		*@param tableHeight テーブルの高さ
		*@param flozenF 固定列（左）
		*@param flozenL 固定列（右）
		*/
		this.addScrollFunction = function(
			tbl, tableWidth, tableHeight, flozenF, flozenL){
			
			var jqTbl = jQuery(tbl);
			clearInterval(~~jqTbl.attr(TIMER_ID));
			
			//2重のdivで囲む
			if(getScroller(jqTbl).length == 0){
				wrapTableByDivs(jqTbl);
			}
			
			//列方向のクラスを追加
			appendRowClass(jqTbl, flozenF, flozenL);
			//スタイルシートを追加
			appendStyle(
				jqTbl, tableWidth, tableHeight, flozenF, flozenL);
			//セルのポジションのリセット
			resetPosition(jqTbl);
			//イベントの追加
			addScrollEvent(jqTbl, flozenF, flozenL);
		}
		/**
		*スクロールイベントを追加する．
		*@param tbl 機能を追加する対象のtblエレメント
		*@param flozenF 固定列（左）
		*@param flozenL 固定列（右）
		*/
		function addScrollEvent(jqTbl, flozenF, flozenL){
			var scroller = getScroller(jqTbl);
			scroller.unbind("scroll");
			scroller.bind(
				"scroll", 
				getScrollAction(jqTbl, flozenF, flozenL));
		}
		
		/**
		*スクロール時の処理を取得する
		*@param tbl 機能を追加する対象のtblエレメント
		*@param flozenF 固定列（左）
		*@param flozenL 固定列（右）
		*/
		function getScrollAction(jqTbl, flozenF, flozenL){
			
			var PX = "px";
			
			var tblId = getId(jqTbl);
			var scroller = getScroller(jqTbl);
			var fixer = getFixer(jqTbl);
			
			var barWidth = getScrollbarWidth();
			var scrollerWidth = scroller.innerWidth();
			var scrollerHeight = scroller.innerHeight();
			var fixerWidth = fixer.outerWidth();
			var fixerHeight = fixer.outerHeight();
			
			//右要素位置の差分
			var leftDiff = scrollerHeight > fixerHeight
				? fixerWidth - scrollerWidth
				: fixerWidth - scrollerWidth + barWidth;

			//下要素位置の差分
			var topDiff = scrollerWidth > fixerWidth
				? fixerHeight - scrollerHeight 
				: fixerHeight - scrollerHeight + barWidth;

			var headElemStyles = toStyleArr(jqTbl.find("thead tr th"));
			var footElemStyles = toStyleArr(jqTbl.find("tfoot tr td"));
			
			var i;
			var selectors;
			selectors = new Array();
			for(i = 0; i < flozenF; i++){
				selectors.push("tr td.f" + i + ",tr th.f" + i);
			}
			var leftElemStyles = toStyleArr(jqTbl.find(selectors.join(",")));
			selectors = new Array();
			for(i = 0; i < flozenL; i++){
				selectors.push("tr td.l" + i + ",tr th.l" + i);
			}
			var rightElemStyles = toStyleArr(jqTbl.find(selectors.join(",")));

			var nextLeft = 0;
			var mooving = false;
			var preTop;
			var preLeft;
			
			fixRows(0);
			fixColumns(0);

			var timerId = setInterval(function(){
				if(!mooving && preLeft != nextLeft){
					preLeft = nextLeft;
					mooving = true;
					fixColumns(nextLeft);
					mooving = false;
				}
			}, synchronizeInterval);
			jqTbl.attr(TIMER_ID, timerId);
			
			//アクション関数を返す
			return function(e){
				var top = scroller.scrollTop();
				var left = scroller.scrollLeft();
				//変化のあった方向のみ実行
				if(preTop != top){
					fixRows(top);
					preTop = top;
				}
				nextLeft = left;
			}
			/**
			*行を固定する
			*@param top 縦方向のスクロール量
			*/
			function fixRows(top){
				var i, len, topText;
				topText = top + PX;
				for(i = 0, len = headElemStyles.length; i<len; i++){
					headElemStyles[i].top = topText;
				}
				var b_top = top - topDiff;
				topText = b_top + PX;
				for(i = 0, len = footElemStyles.length; i<len; i++){
					footElemStyles[i].top = topText;
				}
			}
			/**
			*列を固定する
			*@param left 横方向のスクロール量
			*/
			function fixColumns(left){
				var i, len, leftText;
				leftText = left + PX;
				for(i = 0, len = leftElemStyles.length; i<len; i++){
					leftElemStyles[i].left = leftText;
				}
				var r_left = left - leftDiff;
				leftText = r_left + PX;
				for(i = 0, len = rightElemStyles.length; i<len; i++){
					rightElemStyles[i].left = leftText;
				}
			}
		}
				
		/**
		*スクロールテーブル用のスタイルシートを追加する.
		*tableのもつレイアウト機能を全て殺してblock要素で再構築する．
		*@param jqTbl スクロールテーブル
		*@param tableWidth 固定幅
		*@param tableHeight 固定高さ
		*@param flozenF 固定したい左列の数(既定値0)
		*@param flozenL 固定したい右列の数(既定値0)
		*/
		function appendStyle(
			jqTbl, tableWidth, tableHeight, flozenF, flozenL){
			
			//既存スタイルの削除
			removeStyleElem(jqTbl);
			
			//head要素に追加
			var style = getStyleString(
				jqTbl, tableWidth, tableHeight, flozenF, flozenL);		
			appendStyleElem(jqTbl, style);	
		}
		/**
		*スクロールテーブル用のスタイルシートの設定文字列を取得する.
		*@param jqTbl スクロールテーブル
		*@param tableWidth 固定幅
		*@param tableHeight 固定高さ
		*@param flozenF 固定したい左列の数
		*@param flozenL 固定したい右列の数
		*/
		function getStyleString(
			jqTbl, tableWidth, tableHeight, flozenF, flozenL){
			
			var tblId = getId(jqTbl);
			var scrollerId = getScrollerId(jqTbl);
			var fixerId = getFixerId(jqTbl);
			var styles = new Array();
			
			//スクロール部
			var position = jqTbl.css("position");
			if(position == "" || position == "static"){
				position = "relative";
			}
			styles.push(
				new styleBuilder(
					scrollerId,
					[""],
					{
						"position": position,
						"top": jqTbl.css("top"),
						"left": jqTbl.css("left"),
						"right": jqTbl.css("right"),
						"bottom": jqTbl.css("bottom"),
						"overflow": "auto",
						//NOTE:IEではborderの分width,heightがずれてしまう
						"width": tableWidth - removePx(jqTbl.css("border-right-width")) - removePx(jqTbl.css("border-left-width")) + "px",
						"height": tableHeight - removePx(jqTbl.css("border-top-width")) - removePx(jqTbl.css("border-bottom-width")) + "px",
						"border-top-width": jqTbl.css("border-top-width"),
						"border-top-style": jqTbl.css("border-top-style"),
						"border-top-color": jqTbl.css("border-top-color"),
						"border-right-width": jqTbl.css("border-right-width"),
						"border-right-style": jqTbl.css("border-right-style"),
						"border-right-color": jqTbl.css("border-right-color"),
						"border-bottom-width": jqTbl.css("border-bottom-width"),
						"border-bottom-style": jqTbl.css("border-bottom-style"),
						"border-bottom-color": jqTbl.css("border-bottom-color"),
						"border-left-width": jqTbl.css("border-left-width"),
						"border-left-style": jqTbl.css("border-left-style"),
						"border-left-color": jqTbl.css("border-left-color"),
						"margin-top": jqTbl.css("margin-top"),
						"margin-right": jqTbl.css("margin-right"),
						"margin-bottom": jqTbl.css("margin-bottom"),
						"margin-left": jqTbl.css("margin-left")
					}
				)
			);
			
			//幅固定
			styles.push(
				new styleBuilder(
					fixerId,
					[""],
					{
						"position": "static",
						"width": jqTbl.innerWidth() + "px"
					}
				)
			);
			//本体
			styles.push(
				new styleBuilder(
					tblId,
					[""],
					{
						"vertical-align": "top",
						"position": "static",
						"top": 0,
						"left": 0,
						"border": "none",
						"margin": 0
					}
				)
			);
			
			//ヘッダ,フッタ
			styles.push(
				new styleBuilder(
					tblId,
					[">thead>tr>th", ">tfoot>tr>td"],
					{
						"position": "relative",
						"overflow": "hidden",
						"z-index": 25
					}
				)
			);
			//固定列
			var i;
			for(i = 0; i<flozenF; i++){
				styles.push(
					new styleBuilder(
						tblId,
						[">thead>tr>th.f" + i, ">tfoot>tr>td.f" + i],
						{
							"position": "relative",
							"overflow": "hidden",
							"z-index": 100
						}
					)
				);
				styles.push(
					new styleBuilder(
						tblId,
						[">tbody>tr>td.f" + i],
						{
							"position": "relative",
							"overflow": "hidden",
							"z-index": 50
						}
					)
				);
			}
			for(i = 0; i<flozenL; i++){
				styles.push(
					new styleBuilder(
						tblId,
						[">thead>tr>th.l" + i, ">tfoot>tr>td.l" + i],
						{
							"position": "relative",
							"overflow": "hidden",
							"z-index": 100
						}
					)
				);
				styles.push(
					new styleBuilder(
						tblId,
						[">tbody>tr>td.l" + i],
						{
							"position": "relative",
							"overflow": "hidden",
							"z-index": 50
						}
					)
				);
			}
			//NOTE:他のブラウザとの挙動の統一
			styles.push(
				new styleBuilder(
					tblId,
					["th", "td"],
					{
						"vertical-align": "top"
					}
				)
			);
			return styles.join("\n");
		}
	})();
})(jQuery);

/**
*ロード時の処理
*/
jQuery(function(){
	jQuery("table[scrollable=true]").scrollable();
});
