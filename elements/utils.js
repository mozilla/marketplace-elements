define('elements/utils', [], function() {
    var utils = {
        forEach: function (arr, fn) {
            // For NodeList.
            return Array.prototype.forEach.call(arr, fn);
        },

        find: function (arr, predicate) {
            // For NodeList.
            for (var i = 0, n = arr.length; i < n; i++) {
                if (predicate(arr[i])) {
                    return arr[i];
                }
            }
        },

        map: function (arr, fn) {
            // For NodeList.
            return Array.prototype.map.call(arr, fn);
        },

        filter: function (arr, fn) {
            // For NodeList.
            return Array.prototype.filter.call(arr, fn);
        },

        serialize: function (form) {
            var data = {};
            utils.forEach(form.elements, function(ele) {
                if (!ele.disabled && ele.name) {
                    data[ele.name] = ele.value;
                }
            });
            return data;
        },
    };

    return utils;
});
