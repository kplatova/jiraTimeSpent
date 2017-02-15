// ==UserScript==
// @name         Jira TimeSpent
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://jira.superjob.ru/issues*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var TOTAL_ESTIMATE_ID = 'aggregatetimeoriginalestimate';
    var TIME_SPENT_ID = 'timespent';

    var colLength = $('.rowHeader th').length;

    var totalEctimateColIndex = calculateColIndex(TOTAL_ESTIMATE_ID);
    var timeSpentColIndex = calculateColIndex(TIME_SPENT_ID);

    var totalEstimate = 0;
    var timeSpent = 0;

    var totalEstimateCol = '';
    var timeSpentCol = '';
    var emptyCol = '<td></td>';
    var cols = '';
    var currentCol = '';

    for (var i = 0; i < colLength; i++) {
        switch (i) {
            case totalEctimateColIndex:
                currentCol = makeCol(calculateTime('aggregatetimeoriginalestimate', totalEstimate));
                break;
            case timeSpentColIndex:
                currentCol = makeCol(calculateTime('timespent', timeSpent));
                break;
            default:
                currentCol = emptyCol;
        }
        cols += currentCol;
    }

    cols = '<tr>' + cols + '</tr>';

    $('#issuetable tbody').append(cols).prepend(cols);

    function calculateColIndex(id) {
        var index = null;
        $('.rowHeader th').each(function(i){
            index = ($(this).attr('data-id') === id) ? i : index;
        });
        return index;
    }

    function makeCol(value) {
        return '<td>' + value + 'ч</td>';
    }

    function calculateTime(id, value) {
        var b = value;
        $('.' + id).each(function(i){

            var a = ($(this).text()) ? parseFloat($(this).text().replace('ч', '').replace(',', '.')) : 0;

            b += a;

        });
        return b;
    }

})();