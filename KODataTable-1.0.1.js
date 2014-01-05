/* 
 * Mike Allison Tools - KODataTable v.1.0.2
 * http://mikeallisononline.com/
 *
 * Dependent on Knockout and jQuery
 * http://knockoutjs.com/
 * http://jquery.com/
 *
 * Optional table scrolling with jTableScroll
 * http://mikeallisononline.com/
 *
 * Copyright 2013 Mike Allison
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
*/


(function() {
  window.KODataTable = (function() {
    function KODataTable(options) {
      var _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref2, _ref20, _ref21, _ref22, _ref23, _ref24, _ref25, _ref26, _ref27, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9,
        _this = this;

      this.options = options;
      this.searchText = ko.observable((_ref = (_ref1 = this.options) != null ? _ref1.searchText : void 0) != null ? _ref : "");
      this.columns = ko.observableArray((_ref2 = (_ref3 = this.options) != null ? _ref3.columns : void 0) != null ? _ref2 : []);
      this.rows = ko.observableArray((_ref4 = (_ref5 = this.options) != null ? _ref5.rows : void 0) != null ? _ref4 : []);
      this.currentPage = ko.observable((_ref6 = (_ref7 = this.options) != null ? _ref7.currentPage : void 0) != null ? _ref6 : 0);
      this.pageSize = ko.observable((_ref8 = (_ref9 = this.options) != null ? _ref9.pageSize : void 0) != null ? _ref8 : 20);
      this.selectedColumn = ko.observable((_ref10 = (_ref11 = this.options) != null ? _ref11.selectedColumn : void 0) != null ? _ref10 : 0);
      this.tableHeight = (_ref12 = (_ref13 = this.options) != null ? _ref13.tableHeight : void 0) != null ? _ref12 : 0;
      this.tableWidth = (_ref14 = (_ref15 = this.options) != null ? _ref15.tableWidth : void 0) != null ? _ref14 : 0;
      this.sortDir = (_ref16 = (_ref17 = this.options) != null ? _ref17.sortDir : void 0) != null ? _ref16 : [];
      this.autoSearch = (_ref18 = (_ref19 = this.options) != null ? _ref19.autoSearch : void 0) != null ? _ref18 : true;
      this.selectedRow = ko.observable(((_ref20 = this.options) != null ? _ref20.selectedRow : void 0) != null);
      this.filter = ko.observable(this.searchText());
      if (this.autoSearch) {
        this.throttleSearch = ko.computed(function() {
          return _this.filter(_this.searchText());
        });
        this.throttleSearch.extend({
          throttle: 300
        });
      }
      this.filteredRows = ko.computed(function() {
        var filter;

        filter = _this.filter().toLowerCase();
        if (!filter) {
          return _this.rows();
        } else {
          return ko.utils.arrayFilter(_this.rows(), function(item) {
            return item[_this.selectedColumn()].toString().toLowerCase().indexOf(filter) > -1;
          });
        }
      });
      this.currentRows = ko.computed(function() {
        if ((_this.currentPage() + 1) * _this.pageSize() > _this.filteredRows().length) {
          return _this.filteredRows().slice(_this.currentPage() * _this.pageSize());
        } else {
          return _this.filteredRows().slice(_this.currentPage() * _this.pageSize(), +((_this.currentPage() + 1 * _this.pageSize()) - 1) + 1 || 9e9);
        }
      });
      this.pageCount = ko.computed(function() {
        return Math.ceil(_this.filteredRows().length / _this.pageSize());
      });
      this.nextFn = ((_ref21 = this.options) != null ? _ref21.nextFn : void 0) != null;
      this.prevFn = ((_ref22 = this.options) != null ? _ref22.prevFn : void 0) != null;
      this.searchFn = ((_ref23 = this.options) != null ? _ref23.searchFn : void 0) != null;
      this.sortFn = ((_ref24 = this.options) != null ? _ref24.sortFn : void 0) != null;
      this.lastFn = ((_ref25 = this.options) != null ? _ref25.lastFn : void 0) != null;
      this.firstFn = ((_ref26 = this.options) != null ? _ref26.firstFn : void 0) != null;
      this.selectFn = ((_ref27 = this.options) != null ? _ref27.selectFn : void 0) != null;
      if (typeof jQuery.fn.jTableScroll === "function") {
        jQuery(function() {
          return jQuery('.jTableScroll').jTableScroll({
            height: _this.tableHeight,
            width: _this.tableWidth
          });
        });
      }
    }

    KODataTable.prototype.nextPage = function() {
      if ((this.currentPage() + 1) * this.pageSize() < this.filteredRows().length) {
        if (typeof this.nextFn === "function") {
          this.nextFn();
        }
        return this.currentPage(this.currentPage() + 1);
      }
    };

    KODataTable.prototype.prevPage = function() {
      if (this.currentPage() > 0) {
        if (typeof this.prevFn === "function") {
          this.prevFn();
        }
        return this.currentPage(this.currentPage() - 1);
      }
    };

    KODataTable.prototype.lastPage = function() {
      if (typeof this.lastFn === "function") {
        this.lastFn();
      }
      return this.currentPage(Math.ceil(this.filteredRows().length / this.pageSize()) - 1);
    };

    KODataTable.prototype.firstPage = function() {
      if (typeof this.firstFn === "function") {
        this.firstFn();
      }
      return this.currentPage(0);
    };

    KODataTable.prototype.search = function() {
      if (typeof this.searchFn === "function") {
        this.searchFn();
      }
      this.filter(this.throttleSearch()());
      return this.currentPage(0);
    };

    KODataTable.prototype.sort = function(index) {
      var _ref,
        _this = this;

      if (typeof this.sortFn === "function") {
        return this.sortFn(index);
      } else {
        if (!this.sortDir[index]) {
          this.sortDir[index] = "A";
        }
        this.rows.sort(function(left, right) {
          if (_this.sortDir[index] === "A") {
            if (left[_this.columns()[index]] === right[_this.columns()[index]]) {
              return 0;
            } else if (left[_this.columns()[index]] < right[_this.columns()[index]]) {
              return -1;
            } else {
              return 1;
            }
          } else {
            if (left[_this.columns()[index]] === right[_this.columns()[index]]) {
              return 0;
            } else if (left[_this.columns()[index]] > right[_this.columns()[index]]) {
              return -1;
            } else {
              return 1;
            }
          }
        });
        return this.sortDir[index] = (_ref = this.sortDir[index] === "A") != null ? _ref : {
          "D": "A"
        };
      }
    };

    KODataTable.prototype.selectRow = function(data) {
      this.selectedRow(data);
      return typeof this.selectFn === "function" ? this.selectFn() : void 0;
    };

    return KODataTable;

  })();

}).call(this);
