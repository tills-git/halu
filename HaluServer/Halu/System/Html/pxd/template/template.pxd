<?xml version="1.0" encoding="shift-jis"?>
<!-- 用紙サイズ「A4」用紙方向「縦」portrait -->
<!-- 用紙サイズ「A4」用紙方向「横」landscape -->
<pxd paper-type="a4" orientation="portrait">
<page type="hidden" id="back1">
	<!-- ここに内容を描写します -->
	<svg x="0" y="0" width="29.7cm" height="21cm" viewBox="0 0 2970 2100">
		<rect x="200" y="300" width="1500" height="200" stroke="black" stroke-width="1" fill="none"/>
		<text x="200" y="300" font-size="100" fill="black" stroke="none">こちらは背景</text>
	</svg>
</page>
<page>
	<!-- 背景を指定する -->
	<background id="back1"/>
	<!-- ここに内容を描写します -->
	<svg x="0" y="0" width="29.7cm" height="21cm" viewBox="0 0 2970 2100">
		<text x="200" y="500" font-size="200" fill="black" stroke="none">１ページ目</text>
	</svg>
</page>
</pxd>