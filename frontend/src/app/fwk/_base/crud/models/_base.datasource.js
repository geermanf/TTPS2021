"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDataSource = void 0;
var _ = require("lodash");
var rxjs_1 = require("rxjs");
var query_results_model_1 = require("./query-models/query-results.model");
// Why not use MatTableDataSource?
/*  In this example, we will not be using the built-in MatTableDataSource because its designed for filtering,
    sorting and pagination of a client - side data array.
    Read the article: 'https://blog.angular-university.io/angular-material-data-table/'
**/
var BaseDataSource = /** @class */ (function () {
    function BaseDataSource() {
        //this.paginatorTotal$ = this.paginatorTotalSubject.asObservable();
        var _this = this;
        this.entitySubject = new rxjs_1.BehaviorSubject([]);
        this.hasItems = true; // Need to show message: 'No records found'
        // Loading | Progress bar
        this.loadingSubject = new rxjs_1.BehaviorSubject(false);
        this.isPreloadTextViewed$ = rxjs_1.of(true);
        // Paginator | Paginators count
        this.paginatorTotalSubject = new rxjs_1.BehaviorSubject(0);
        this.subscriptions = [];
        //// subscribe hasItems to (entitySubject.length==0)
        //const hasItemsSubscription = this.paginatorTotal$.pipe(
        //  distinctUntilChanged(),
        //  skip(1)
        //).subscribe(res => this.hasItems = res > 0);
        //this.subscriptions.push(hasItemsSubscription);
        this.loading$ = this.loadingSubject.asObservable();
        this.paginatorTotal$ = this.paginatorTotalSubject.asObservable();
        this.paginatorTotal$.subscribe(function (res) { return _this.hasItems = res > 0; });
    }
    BaseDataSource.prototype.connect = function (collectionViewer) {
        // Connecting data source
        return this.entitySubject.asObservable();
    };
    BaseDataSource.prototype.disconnect = function (collectionViewer) {
        // Disconnect data source
        this.entitySubject.complete();
        this.paginatorTotalSubject.complete();
        this.subscriptions.forEach(function (sb) { return sb.unsubscribe(); });
        this.loadingSubject.complete();
    };
    BaseDataSource.prototype.baseFilter = function (entities, queryParams, filtrationFields) {
        if (filtrationFields === void 0) { filtrationFields = []; }
        // Filtration
        var entitiesResult = this.searchInArray(entities, queryParams.filter, filtrationFields);
        // Sorting
        // start
        if (queryParams.sortField) {
            entitiesResult = this.sortArray(entitiesResult, queryParams.sortField, queryParams.sortOrder);
        }
        // end
        // Paginator
        // start
        var totalCount = entitiesResult.length;
        var initialPos = queryParams.pageNumber * queryParams.pageSize;
        entitiesResult = entitiesResult.slice(initialPos, initialPos + queryParams.pageSize);
        // end
        var queryResults = new query_results_model_1.QueryResultsModel();
        queryResults.items = entitiesResult;
        queryResults.totalCount = totalCount;
        return queryResults;
    };
    BaseDataSource.prototype.sortArray = function (incomingArray, sortField, sortOrder) {
        if (sortField === void 0) { sortField = ''; }
        if (sortOrder === void 0) { sortOrder = 'asc'; }
        if (!sortField) {
            return incomingArray;
        }
        var result = [];
        result = incomingArray.sort(function (a, b) {
            if (a[sortField] < b[sortField]) {
                return sortOrder === 'asc' ? -1 : 1;
            }
            if (a[sortField] > b[sortField]) {
                return sortOrder === 'asc' ? 1 : -1;
            }
            return 0;
        });
        return result;
    };
    BaseDataSource.prototype.searchInArray = function (incomingArray, queryObj, filtrationFields) {
        if (filtrationFields === void 0) { filtrationFields = []; }
        var result = [];
        var resultBuffer = [];
        var indexes = [];
        var firstIndexes = [];
        var doSearch = false;
        filtrationFields.forEach(function (item) {
            if (item in queryObj) {
                incomingArray.forEach(function (element, index) {
                    if (element[item] === queryObj[item]) {
                        firstIndexes.push(index);
                    }
                });
                firstIndexes.forEach(function (element) {
                    resultBuffer.push(incomingArray[element]);
                });
                incomingArray = resultBuffer.slice(0);
                resultBuffer = [].slice(0);
                firstIndexes = [].slice(0);
            }
        });
        Object.keys(queryObj).forEach(function (key) {
            var searchText = queryObj[key].toString().trim().toLowerCase();
            if (key && !_.includes(filtrationFields, key) && searchText) {
                doSearch = true;
                try {
                    incomingArray.forEach(function (element, index) {
                        var _val = element[key].toString().trim().toLowerCase();
                        if (_val.indexOf(searchText) > -1 && indexes.indexOf(index) === -1) {
                            indexes.push(index);
                        }
                    });
                }
                catch (ex) {
                    console.log(ex, key, searchText);
                }
            }
        });
        if (!doSearch) {
            return incomingArray;
        }
        indexes.forEach(function (re) {
            result.push(incomingArray[re]);
        });
        return result;
    };
    BaseDataSource.prototype.searchStringInArray = function (incomingArray, queryObj, filtrationFields) {
        if (filtrationFields === void 0) { filtrationFields = []; }
        var result = [];
        var indexes = [];
        var doSearch = false;
        Object.keys(queryObj).forEach(function (key) {
            var searchText = queryObj[key].toString().trim().toLowerCase();
            if (key && searchText) {
                doSearch = true;
                try {
                    incomingArray.forEach(function (element, index) {
                        var _val = element[key].toString().trim().toLowerCase();
                        if (_val.indexOf(searchText) > -1 && indexes.indexOf(index) === -1) {
                            indexes.push(index);
                        }
                    });
                }
                catch (ex) {
                    console.log(ex, key, searchText);
                }
            }
        });
        if (!doSearch) {
            return incomingArray;
        }
        indexes.forEach(function (re) {
            result.push(incomingArray[re]);
        });
        return result;
    };
    return BaseDataSource;
}());
exports.BaseDataSource = BaseDataSource;
//# sourceMappingURL=_base.datasource.js.map