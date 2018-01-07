angular.module('DeerEx')
.filter('endStr', function () {
    return function (value) {
    	if (!value) return;
        return value.substring(value.lastIndexOf(",")+1).trim();
    };
})

.filter('startStr', function () {
    return function (value) {
    	if (!value) return;
        return value.substring(0, value.lastIndexOf(","));
    };
})

.filter('escapeHtml', function () {
    return function (value) {
    	if (!value) return;
        return value.replace(/<br>/g, ' ');
    };
});