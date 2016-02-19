var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("angular2/core");
var pagination_service_1 = require("./pagination-service");
var LARGE_NUMBER = 999999999;
var PaginatePipe = (function () {
    function PaginatePipe(service) {
        this.service = service;
        // store the values from the last time the pipe
        this.state = {};
    }
    PaginatePipe.prototype.transform = function (collection, args) {
        // for non-array types, throw an exception
        if (!(collection instanceof Array)) {
            throw new Error("PaginationPipe: Argument error - expected an array, got " + typeof collection);
        }
        var serverSideMode = args[0].totalItems !== undefined;
        var instance = this.createInstance(collection, args);
        var id = instance.id;
        var start, end;
        this.service.register(instance);
        /*if (instance.totalItems !== collection.length) {
            this.service.setTotalItems(id, collection.length);
        }*/
        var perPage = instance.itemsPerPage;
        if (!serverSideMode && collection instanceof Array) {
            perPage = perPage || LARGE_NUMBER;
            start = (instance.currentPage - 1) * perPage;
            end = start + perPage;
            var isIdentical = this.stateIsIdentical(id, collection, start, end);
            if (isIdentical) {
                return this.state[id].slice;
            }
            else {
                var slice = collection.slice(start, end);
                this.saveState(id, collection, slice, start, end);
                this.service.change.emit(id);
                return slice;
            }
        }
        return collection;
    };
    /**
     * Create an IPaginationInstance object, using defaults for any optional properties not supplied.
     */
    PaginatePipe.prototype.createInstance = function (collection, args) {
        var config = args[0];
        this.checkConfig(config);
        var instance = {
            id: config.id || this.service.defaultId,
            itemsPerPage: config.itemsPerPage || 0,
            currentPage: config.currentPage || 1,
            totalItems: config.totalItems || collection.length
        };
        return instance;
    };
    /**
     * Ensure the argument passed to the filter contains the required properties.
     */
    PaginatePipe.prototype.checkConfig = function (config) {
        var required = ['itemsPerPage', 'currentPage'];
        var missing = required.filter(function (prop) { return !config.hasOwnProperty(prop); });
        if (0 < missing.length) {
            throw new Error("PaginatePipe: Argument is missing the following required properties: " + missing.join(', '));
        }
    };
    /**
     * To avoid returning a brand new array each time the pipe is run, we store the state of the sliced
     * array for a given id. This means that the next time the pipe is run on this collection & id, we just
     * need to check that the collection, start and end points are all identical, and if so, return the
     * last sliced array.
     */
    PaginatePipe.prototype.saveState = function (id, collection, slice, start, end) {
        this.state[id] = {
            collection: collection,
            size: collection.length,
            slice: slice,
            start: start,
            end: end
        };
    };
    /**
     * For a given id, returns true if the collection, size, start and end values are identical.
     */
    PaginatePipe.prototype.stateIsIdentical = function (id, collection, start, end) {
        var state = this.state[id];
        if (!state) {
            return false;
        }
        return state.collection === collection &&
            state.size === collection.length &&
            state.start === start &&
            state.end === end;
    };
    PaginatePipe = __decorate([
        core_1.Pipe({
            name: 'paginate',
            pure: false
        }), 
        __metadata('design:paramtypes', [pagination_service_1.PaginationService])
    ], PaginatePipe);
    return PaginatePipe;
})();
exports.PaginatePipe = PaginatePipe;
