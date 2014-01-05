### 
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
 ###
class window.KODataTable 
    constructor: (@options) ->
        @searchText = ko.observable @options?.searchText ? ""
        @columns = ko.observableArray @options?.columns ? []
        @rows = ko.observableArray @options?.rows ? []
        @currentPage = ko.observable @options?.currentPage ? 0           
        @pageSize = ko.observable @options?.pageSize ? 20
        @selectedColumn = ko.observable @options?.selectedColumn ? 0
        @tableHeight = @options?.tableHeight ? 0
        @tableWidth = @options?.tableWidth ? 0
        @sortDir = @options?.sortDir ? []
        @autoSearch = @options?.autoSearch ? true   
        @selectedRow = ko.observable @options?.selectedRow?        
        @filter = ko.observable @searchText()
        if @autoSearch 
            @throttleSearch = ko.computed =>            
                @filter @searchText()
            @throttleSearch.extend throttle : 300                    
            
        @filteredRows = ko.computed =>            
            filter = @filter().toLowerCase()                
                
            if not filter 
                @rows()
            else
                ko.utils.arrayFilter @rows(), (item) =>                    
                    item[@selectedColumn()].toString().toLowerCase().indexOf(filter) > -1
            
        @currentRows = ko.computed =>
            if (@currentPage() + 1) * @pageSize() > @filteredRows().length
                @filteredRows()[(@currentPage() * @pageSize())..]
            else
                @filteredRows()[(@currentPage() * @pageSize())..((@currentPage() + 1 * @pageSize()) - 1)]
        
        @pageCount = ko.computed =>
            Math.ceil(@filteredRows().length / @pageSize())
        
        @nextFn = @options?.nextFn?
        @prevFn = @options?.prevFn?        
        @searchFn = @options?.searchFn?
        @sortFn = @options?.sortFn?
        @lastFn = @options?.lastFn?
        @firstFn = @options?.firstFn?
        @selectFn = @options?.selectFn?

        if typeof jQuery.fn.jTableScroll is "function"
            jQuery =>
                jQuery('.jTableScroll').jTableScroll({ height: @tableHeight, width: @tableWidth })

    nextPage: ->        
        if (@currentPage() + 1) * @pageSize() < @filteredRows().length            
            @nextFn?()
            @currentPage(@currentPage() + 1)

    prevPage: ->
        if @currentPage() > 0
            @prevFn?()
            @currentPage(@currentPage() - 1)
    lastPage: ->                
            @lastFn?()
            @currentPage(Math.ceil(@filteredRows().length / @pageSize()) - 1)

    firstPage: ->
            @firstFn?()
            @currentPage(0)
    search: ->
            @searchFn?()  
            @filter @throttleSearch()()      
            @currentPage 0
    sort: (index) ->        
        if typeof @sortFn is "function"
            @sortFn index
        else
            @sortDir[index] = "A" if not @sortDir[index]
               
            @rows.sort (left, right) =>
                if @sortDir[index] == "A"
                    if left[@columns()[index]] == right[@columns()[index]] then 0 else if left[@columns()[index]] < right[@columns()[index]] then -1 else 1
                else 
                    if left[@columns()[index]] == right[@columns()[index]] then 0 else if left[@columns()[index]] > right[@columns()[index]] then -1 else 1
            @sortDir[index] = @sortDir[index] == "A" ? "D" : "A";
    selectRow: (data) ->
        @selectedRow(data)
        @selectFn?()
