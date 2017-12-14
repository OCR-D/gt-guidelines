
/*
    
Oxygen WebHelp Plugin
Copyright (c) 1998-2016 Syncro Soft SRL, Romania.  All rights reserved.

*/

function debug(msg, obj) {
  logLocal(msg);
}

/**
 * @description This function find all matches using the search term
 * @param {HTMLObjectElement} ditaSearch_Form The search form from WebHelp page as HTML Object
 */
function SearchToc(query) {
    debug('SearchToc(..)');

    result = new Pages([]);
    noWords = [];
    excluded = [];
    stackResults = [];

    //START - EXM-30790
    var $searchResults = $("#searchResults");
    var footer = $searchResults.find(".footer");
    //END - EXM-30790
    // Check browser compatibility
    if (navigator.userAgent.indexOf("Konquerer") > -1) {
        alert(getLocalization(txt_browser_not_supported));
        return;
    }

    searchTextField = trim(query);
    // Eliminate the cross site scripting possibility.
    searchTextField = searchTextField.replace(/</g, " ")
        .replace(/>/g, " ")
        .replace(/"/g, " ")
        .replace(/'/g, " ")
        .replace(/=/g, " ")
        .replace(/0\\/g, " ")
        .replace(/\\/g, " ")
        .replace(/\//g, " ")
        .replace(/  +/g, " ");

    var expressionInput = searchTextField;
    debug('Search for: ' + expressionInput);

    var wordsArray = [];
    var splittedExpression = expressionInput.split(" ");
    for (var t in splittedExpression) {
        if (!contains(stopWords, splittedExpression[t]) || contains(knownOperators, splittedExpression[t])) {
            wordsArray.push(splittedExpression[t]);
        } else {
            excluded.push(splittedExpression[t]);
        }
    }
    expressionInput = wordsArray.join(" ");

    realSearchQuery = expressionInput;

    if (expressionInput.trim().length > 0 || excluded.length > 0) {
        searchAndDisplayResults(expressionInput);

        //START - EXM-30790
        $searchResults.append(footer);
        $searchResults.scrollTop(0);
        //END - EXM-30790
    } else {
        clearHighlights();
    }
}

/**
 * @description Display results in HTML format
 * @param {Array} fileAndWordList Array with pages and indices that will be displayed
 */
function displayResults(fileAndWordList) {
    var linkTab = [];

    var results = "";

    var txt_wordsnotfound = "";

    for (var i = 0; i < excluded.length; i++) {
        txt_wordsnotfound += excluded[i] + " ";
    }

    if (fileAndWordList.value !== undefined) {
        var allPages = fileAndWordList.sort().value;

        if (excluded.length > 0) {
            var tempString = "<p>" + partialSearch1;
            tempString += "<br />" + partialSearch2 + " " + txt_wordsnotfound + "</p>";
            linkTab.push(tempString);
        }

        if (realSearchQuery.length > 0) {
            linkTab.push("<p>" + getLocalization(txt_results_for) + " " + "<span class=\"wh_search_expression\">" + realSearchQuery + "</span>" + "</p>");
        }
        linkTab.push("<ul class='searchresult'>");
        var ttScore_first = 1;
        if (allPages.length > 0) {
            ttScore_first = allPages[0].scoring;
        }
        for (var page = 0; page < allPages.length; page++) {
            debug("Page number: " + page);

            var hundredPercent = allPages[page].scoring + 100 * allPages[page].motsnb;
            var numberOfWords = allPages[page].motsnb;
            debug("hundredPercent: " + hundredPercent + "; ttScore_first: " + ttScore_first + "; numberOfWords: " + numberOfWords);

            var ttInfo = allPages[page].filenb;
            // Get scoring
            var ttScore = allPages[page].scoring;

            debug('score for' + allPages[page].motslisteDisplay + ' = ' + ttScore);

            var tempInfo = fil[ttInfo];
            var pos1 = tempInfo.indexOf("@@@");
            var pos2 = tempInfo.lastIndexOf("@@@");
            var tempPath = tempInfo.substring(0, pos1);
            // EXM-27709 START
            // Display words between '<' and '>' in title of search results.
            var tempTitle = tempInfo.substring(pos1 + 3, pos2)
                .replace(/</g, "&lt;").replace(/>/g, "&gt;");
            // EXM-27709 END
            var tempShortDesc = tempInfo.substring(pos2 + 3, tempInfo.length);

            if (tempPath == 'toc.html') {
                continue;
            }
            //var split = allPages[page].motsliste.split(",");
            var finalArray = allPages[page].motsliste.split(", ");
            debug(finalArray);
            var arrayString = 'Array(';
            for (var x in finalArray) {
                if (finalArray[x].length >= 2 || useCJKTokenizing || (indexerLanguage == "ja" && finalArray[x].length >= 1)) {
                    arrayString += "'" + finalArray[x] + "',";
                }
            }
            arrayString = arrayString.substring(0, arrayString.length - 1) + ")";

            var idLink = 'foundLink' + page;
            var link = 'return openAndHighlight(\'' + tempPath + '\', ' + arrayString + '\)';
            var linkString = '<li><a id="' + idLink + '" href="' + tempPath + '" class="foundResult" onclick="' + link + '">' + tempTitle + '</a>';
            // Fake value
            var maxNumberOfWords = allPages[page].motsnb;
            var starWidth = (ttScore * 100 / hundredPercent) / (ttScore_first / hundredPercent) * (numberOfWords / maxNumberOfWords);
            starWidth = starWidth < 10 ? (starWidth + 5) : starWidth;
            // Keep the 5 stars format
            if (starWidth > 85) {
                starWidth = 85;
            }
            // Also check if we have a valid description
            if ((tempShortDesc != "null" && tempShortDesc != '...')) {
                linkString += "\n<div class=\"shortdesclink\">" + tempShortDesc + "</div>";
            }

            try {
                if (webhelpSearchRanking) {
                    // Add rating values for scoring at the list of matches
                    linkString += "<div id=\"rightDiv\">";
                    linkString += "<div id=\"star\">";
                    linkString += "<div id=\"star0\" class=\"star\">";
                    linkString += "<div id=\"starCur0\" class=\"curr\" style=\"width: " + starWidth + "px;\">&nbsp;</div>";
                    linkString += "</div>";
                    linkString += "<br style=\"clear: both;\">";
                    linkString += "</div>";
                    linkString += "</div>";
                }
            } catch (e) {
                debug(e);
            }

            linkString += "</li>";
            linkTab.push(linkString);
        }


        linkTab.push("</ul>");

        if (linkTab.length > 2) {
            results = "<p>";
            for (var t in linkTab) {
                results += linkTab[t].toString();
            }
            results += "</p>";
        } else {
            results = "<p>" + getLocalization("Search no results") + " " + "<span class=\"wh_search_expression\">" + txt_wordsnotfound + "</span>" + "</p>";
        }
    } else {
        results = "<p>" + getLocalization("Search no results") + " " + "<span class=\"wh_search_expression\">" + txt_wordsnotfound + "</span>" + "</p>";
    }

    document.getElementById('searchResults').innerHTML = results;

    $("#search").trigger('click');
}