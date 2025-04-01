(function ($, $H) {
  // 名前空間を設定する
  let App = $H.Library;

  /**
   * TabbedPanel オブジェクト<br>
   * 参考URL：http://www.switchonthecode.com/tutorials/javascript-and-css-tutorial-dynamic-tabbed-panels
   * @extends Class
   * @property {string} name - 名前
   * @property {object} tabContainer - タブコントロール
   * @property {object} panelContainer - パネルコントロール
   * @property {number} tabNumber = タブ番号
   * @property {object} currentHighPanel - 現在パネル
   * @property {object} currentHighTab - 現在タブ
   * @property {object} lowTabStyle - 下タブのstyle
   * @property {object} highTabStyle - 上タブのstyle
   */
  class TabbedPanel extends $H.Class {
    constructor() {
      super();
      this.name;
      this.tabContainer;
      this.panelContainer;
      this.tabNumber = 0;
      this.currentHighPanel = null;
      this.currentHighTab = null;
      this.lowTabStyle = "lowTab";
      this.highTabStyle = "highTab";
    }
  }
  TabbedPanel.include({
    /**
     * コントロール初期設定を行う
     * @memberof TabbedPanel
     * @param {string} name - 名前
     * @param {object} tabContainer - タブコントロール
     * @param {object} panelContainer - パネルコントロール
     */
    setInitContainer: function (name, tabContainer, panelContainer) {
      this.name = name;
      this.tabContainer = tabContainer;
      this.panelContainer = panelContainer;
    },
    /**
     * タブを作成する
     * @memberof TabbedPanel
     * @param {string} tabName - 名前
     * @returns パネル情報
     */
    createTab: function (tabName) {
      let tabID = this.name + 'Tab' + this.tabNumber;
      let panelID = this.name + 'Panel' + this.tabNumber;

      let panel = document.createElement('div');
      panel.style.left = '0px';
      panel.style.top = '0px';
      panel.style.width = '100%';
      panel.style.height = '100%';
      panel.style.display = 'none';
      panel.tabNum = this.tabNumber;
      panel.id = panelID;

      if (this.panelContainer.insertAdjacentElement == null) {
        this.panelContainer.appendChild(panel);
      }
      else {
        //Internet Explorer
        this.panelContainer.insertAdjacentElement("beforeEnd", panel);
      }
      //insert new tab before spacer cell
      let cell = this.tabContainer.insertCell(this.tabContainer.cells.length - 1);
      cell.id = tabID;
      cell.className = this.lowTabStyle;
      cell.tabNum = this.tabNumber;
      cell.onclick = this.onTabClicked;
      cell.innerHTML = '&nbsp;' + tabName;
      cell.panelObj = this;
      this.tabClickEl(cell);
      this.tabNumber++;
      return panel;
    },
    /**
     * タブクリックイベント
     * @memberof TabbedPanel
     * @param {event} event - イベント情報
     */
    onTabClicked: function (event) {
      // Other : Internet Explorer
      let el = (window.event == null) ? event.target : window.event.srcElement;
      el.panelObj.tabClickEl(el);
    },
    /**
     * 要素クリックイベント
     * @memberof TabbedPanel
     * @param {object} element - 要素
     * @returns なし
     */
    tabClickEl: function (element) {
      if (this.currentHighTab == element) return;
      if (this.currentHighTab != null) this.currentHighTab.className = this.lowTabStyle;
      if (this.currentHighPanel != null) this.currentHighPanel.style.display = 'none';
      this.currentHighPanel = null;
      this.currentHighTab = null;
      if (element == null) return;

      this.currentHighTab = element;
      this.currentHighPanel = document.getElementById(this.name + 'Panel' + this.currentHighTab.tabNum);
      if (this.currentHighPanel == null) {
        this.currentHighTab = null
        return;
      }
      this.currentHighTab.className = this.highTabStyle;
      this.currentHighPanel.style.display = '';
    },
    /**
     * タブを閉じる
     * @memberof TabbedPanel
     * @param {object} element - 要素
     * @returns なし
     */
    tabCloseEl: function (element) {
      if (element == null) return;
      if (element == this.currentHighTab) {
        let i = -1;
        if (this.tabContainer.cells.length > 2) {
          i = element.cellIndex;
          if (i == this.tabContainer.cells.length - 2) {
            i = this.tabContainer.cells.length - 3;
          }
          else {
            i++;
          }
        }
        if (i >= 0) {
          this.tabClickEl(this.tabContainer.cells[i]);
        }
        else {
          this.tabClickEl(null);
        }
      }

      let panel = document.getElementById(this.name + 'Panel' + element.tabNum);
      if (panel != null) this.panelContainer.removeChild(panel);

      this.tabContainer.deleteCell(element.cellIndex);
    }
  });
  App.TabbedPanel = TabbedPanel;

  /**
   * @mixin TabbedPanelMixin
   */
  App.TabbedPanelMixin = {
    /**
     * TabPanelオブジェクトを作成する<br>
     * @memberof TabbedPanelMixin
     * @param {string} name - タブオブジェクトに付ける名前
     * @param {string} tabElement - タブタイトルid 
     * @param {string} panelElement - タブコンテンツid
     * @returns TabPanelオブジェクト
     */
    createTabObject: function (name, tabElement, panelElement) {
      $H.log("View createTabObject : start");

      let tabbedPanel = new $H.Library.TabbedPanel();
      let tabContainer = document.getElementById(tabElement);
      let panelContainer = document.getElementById(panelElement);

      tabbedPanel.setInitContainer(name, tabContainer, panelContainer);

      $H.log("View createTabObject : end");
      return tabbedPanel;
    },
    /**
     * TabPanelを追加する
     * @memberof TabbedPanelMixin
     * @param {object} tabController - タブオブジェクト
     * @param {string} tabTitle - タブタイトル名
     * @param {object} tabContents - タブコンテンツデータ
     */
    addTabPanel: function (tabController, tabTitle, tabContents) {
      let tabPanel = tabController.createTab(tabTitle);
      tabPanel.innerHTML = tabContents;
    },
    /**
     * 選択中のTabPanelを削除する
     * @memberof TabbedPanelMixin
     * @param {object} tabController - タブオブジェクト
     */
    removeTabPanel: function (tabController) {
      tabController.tabCloseEl(tabController.currentHighTab);
    }
  };
}(jQuery, Halu));