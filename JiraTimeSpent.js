// ==UserScript==
// @name         Jira Time Issues Calculator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Плагин считает "Первоначальная оценка" и "Затраченное время" в выдаче тасков по какому-либо запросу (эти колонки должны присутствовать)
// @author       you
// @match        https://jira.domain.ru/issues*
// @grant        
// ==/UserScript==

(function() {
    'use strict';

    $('.navigator-body').bind('DOMSubtreeModified', addRowsWithCalculatedTime);

    addRowsWithCalculatedTime();

    function addRowsWithCalculatedTime(){
        var TOTAL_ESTIMATE_ID = 'aggregatetimeoriginalestimate';
        var TIME_SPENT_ID = 'timespent';
        var TIME_CALCULATED_CLASS_NAME = 'sj-time-calculated';

        var $rows = $('.' + TIME_CALCULATED_CLASS_NAME);
        var rowsLength = $rows.length;

        if (rowsLength) {
            return false;
        }

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

        cols = '<tr class="' + TIME_CALCULATED_CLASS_NAME + '">' + cols + '</tr>';

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

                var timeDimension = $(this).text().slice(-1);
                var a = ($(this).text()) ? parseFloat($(this).text().replace(/н|д|ч|м|с/g, '').replace(',', '.')) : 0;

                switch (timeDimension) {
                    case 'н':
                        a = a * 24 * 7;
                        break;
                    case 'д':
                        a = a * 24;
                        break;
                    case 'ч':
                        break;
                    case 'м':
                        a = 1 / 60 * a;
                        break;
                    case 'с':
                        a = 1 / 60 / 60 * a;
                        break;
                    default:

                }

                b += a;

            });
            return b.toFixed(2);
        }
    }


})();
