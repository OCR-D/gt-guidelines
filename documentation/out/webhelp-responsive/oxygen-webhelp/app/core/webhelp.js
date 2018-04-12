define(['util', 'jquery', 'jquery.highlight'], function(util, $) {
    // Add some Bootstrap classes when document is ready
    var highlighted = false;

    $(document).ready(function () {
        var scrollPosition = $(window).scrollTop();
        setContentWidth();
        handleSideTocPosition(scrollPosition);
        handlePageTocPosition(scrollPosition);

        $(window).scroll(function() {
            scrollPosition = handleSideTocPosition(scrollPosition);
            scrollPosition = handlePageTocPosition(scrollPosition);
        });
        $(window).resize(function(){
            $("#wh_publication_toc").removeAttr('style');
            scrollPosition = handleSideTocPosition(scrollPosition);
            scrollPosition = handlePageTocPosition(scrollPosition);
        });

        // Show/hide the button which expands/collapse the subtopics
        // if there are at least two subtopics in a topic
        var countSubtopics = $('.topic.nested1').length;
        var countSections = $('section.section').length;
        if(countSubtopics > 1 || countSections >1){
            $('.webhelp_expand_collapse_sections').show();
        }

        // WH-231
        // Expanding the side-toc
        $('.dots-before').click(function(){
            $(this).siblings('.hide-before').show();
            $(this).hide();
        });

        $('.dots-after').click(function(){
            $(this).siblings('.hide-after').show();
            $(this).hide();
        });

        // Get the image and insert it inside the modal - use its "alt" text as a caption
        $('img.image:not([usemap])').click(function(){
            $('#modal_img_large').css("display","block");
            $("#modal-img").attr('src',$(this).attr('src') );
            $("#caption").html( $(this).attr('alt') );
        });

        // When the user clicks on (x), close the modal
        $(".modal .close").click(function(){
            $(".modal").css("display","none");
        });

        // Navigational links and print
        $('#topic_navigation_links .navprev>a').addClass("glyphicon glyphicon-arrow-left");
        $('#topic_navigation_links .navnext>a').addClass("glyphicon glyphicon-arrow-right");
        $('.wh_print_link a').addClass('glyphicon glyphicon-print');

        // Hide sideTOC when it is empty
        var sideToc = $('#wh_publication_toc');
        if (sideToc !== undefined) {
            var sideTocChildren = sideToc.find('*');
            if (sideTocChildren.length == 0) {
                sideToc.css('display', 'none');

                // The topic content should span on all 12 columns
                sideToc.removeClass('col-lg-4 col-md-4 col-sm-4 col-xs-12');
                var topicContentParent = $('.wh_topic_content').parent();
                if (topicContentParent !== undefined) {
                    topicContentParent.removeClass(' col-lg-8 col-md-8 col-sm-8 col-xs-12 ');
                    topicContentParent.addClass(' col-lg-12 col-md-12 col-sm-12 col-xs-12 ');
                }
            } else {
                /* WH-1518: Check if the tooltip has content. */
                var emptyShortDesc = sideToc.find('.topicref .wh-tooltip .shortdesc:empty');
                if (emptyShortDesc.length > 0) {
                    var tooltip = emptyShortDesc.closest('.wh-tooltip');
                    tooltip.remove();
                }
            }
        }

        // WH-1518: Hide the Breadcrumb tooltip if it is empty.
        var breadcrumb = $('.wh_breadcrumb');
        var breadcrumbShortDesc = breadcrumb.find('.topicref .wh-tooltip .shortdesc:empty');
        if (breadcrumbShortDesc.length > 0) {
            var tooltip = breadcrumbShortDesc.closest('.wh-tooltip');
            tooltip.remove();
        }

        $(".wh_main_page_toc .wh_main_page_toc_accordion_header").click(function(event) {
            if ($(this).hasClass('expanded')) {
                $(this).removeClass("expanded");
            } else {
                $(".wh_main_page_toc .wh_main_page_toc_accordion_header").removeClass("expanded");
                $(this).addClass("expanded");
            }

            event.stopImmediatePropagation();
            return false;
        });

        $(".wh_main_page_toc a").click(function(event) {
            event.stopImmediatePropagation();
        });

        highlightSearchTerm();

        $("div.wh_content_area").css("visibility", "visible");

        /*
         * Codeblock copy to clipboard action
         */
        $('.codeblock').mouseover(function(){
            // WH-1806
            var item = $('<span class="copyTooltip wh-tooltip-container" data-tooltip-position="left"/>');
            if ( $(this).find('.copyTooltip').length == 0 ){
                $(this).prepend(item);

                $('.codeblock .copyTooltip').click(function(){
                    var txt = $(this).closest(".codeblock").text();
                    if(!txt || txt == ''){
                        return;
                    }
                    copyTextToClipboard(txt, $(this));
                });
            }
        });

        $('.codeblock').mouseleave(function(){
            $(this).find('.copyTooltip').remove();
        });

        /**
         * @description Copy the text to the clipboard
         */
        function copyTextToClipboard(text, copyTooltipSpan) {
            var textArea = document.createElement("textarea");
            textArea.style.position = 'fixed';
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                var successful = document.execCommand('copy');

                // WH-1806
                if (copyTooltipSpan.find('.wh-tooltip').length == 0) {
                    var tooltipContainer = $(
                    '<span>' +
                        '  <span class="wh-tooltip"><p class="wh-tooltip-content">Copied to clipboard</p></span>' +
                        '</span>'
                    );
                    copyTooltipSpan.prepend(tooltipContainer);
                    copyTooltipSpan.mouseleave(function() {
                        tooltipContainer.remove();
                    });
                    setTimeout(function(){ tooltipContainer.remove();}, 3000);
                }
            } catch (err) {
                // Unable to copy
                if (copyTooltipSpan.find('.wh-tooltip').length == 0) {
                    var tooltipContainer = $(
                        '<span>' +
                        '  <span class="wh-tooltip"><p class="wh-tooltip-content">Oops, unable to copy</p></span>' +
                        '</span>'
                    );
                    copyTooltipSpan.mouseleave(function() {
                        tooltipContainer.remove();
                    });
                    copyTooltipSpan.prepend(tooltipContainer);
                    setTimeout(function(){ tooltipContainer.remove(); }, 3000);
                }
                // WH-1806
                //$('.copyTooltip').tooltip({title: 'Oops, unable to copy', trigger: "click"});
                util.debug('Oops, unable to copy codeblock content!', err)
            }
            document.body.removeChild(textArea);
        }

        /**
         * Check to see if the window is top if not then display button
         */
        $(window).scroll(function(){
            if ($(this).scrollTop() > 5) {
                $('#go2top').fadeIn('fast');
            } else {
                $('#go2top').fadeOut('fast');
            }
        });

        /**
         * Click event to scroll to top
         */
        $('#go2top').click(function(){
            $('html, body').animate({scrollTop : 0},800);

            return false;
        });
    });

/**
 * @description Handle the vertical position of the side toc
 */
function handleSideTocPosition(scrollPosition) {
    var scrollPosition = scrollPosition !== undefined ? scrollPosition : 0;
    var $sideToc = $(".wh_publication_toc");
    var $sideTocID = $("#wh_publication_toc");
    var $navSection = $(".wh_tools");
    var bottomNavOffset = 0;
    var $slideSection = $('#wh_topic_body');
    var topOffset = 33;

    if ($sideToc.length > 0 && $slideSection.length > 0) {
        var minVisibleOffset = $(window).scrollTop();
        var tocHeight = parseInt($sideToc.height()) + parseInt($sideToc.css("padding-top")) + parseInt($sideToc.css("padding-bottom")) + parseInt($sideToc.css("margin-top")) + parseInt($sideToc.css("margin-bottom"));
        var tocWidth = parseInt($sideTocID.outerWidth()) - parseInt($sideTocID.css("padding-left")) - parseInt($sideTocID.css("padding-right"));
        var tocXNav = parseInt($slideSection.offset().left) - tocWidth;
    
        if (scrollPosition > $(window).scrollTop()) {
            if ($sideToc.offset().top < $sideToc.parent().offset().top) {
                $sideToc.css('position', 'inherit');
            }
        } else {
            if (tocHeight > $(window).height()) {
                $sideToc.css('position', 'inherit');
            }
        }

        if ($navSection.length > 0) {
            bottomNavOffset = parseInt($navSection.offset().top) + parseInt($navSection.height()) + parseInt($navSection.css("padding-top")) + parseInt($navSection.css("padding-bottom")) + parseInt($navSection.css("margin-top")) + parseInt($navSection.css("margin-bottom"));
        }
        if (bottomNavOffset > minVisibleOffset) {
            minVisibleOffset = bottomNavOffset;
        }
        if (tocHeight < $slideSection.height()) {
            if (parseInt(minVisibleOffset - topOffset) <= $(window).scrollTop()) {
                $sideToc.css("top", "20px").css("width", tocWidth + "px").css("position", "fixed");
            } else {
                $sideToc.removeAttr('style');
            }
        } else {
           // $slideSection.css("top", "0").css("min-height", tocHeight + "px").css("width", tocWidth + "px");
        }
        scrollPosition = $(window).scrollTop();
    }

		return $(window).scrollTop();
}

/**
 * @description Highlight the current node in the page toc section on scroll change
 */
function pageTocHighlightNode(scrollPosition) {
    var scrollPosition = scrollPosition !== undefined ? scrollPosition : 0;
    var topOffset = 100;

    $.each( $('.wh_topic_content .title'), function () {
        var currentId = $(this).parent().attr('id');

        if( ($(this).offset().top - topOffset) <  $(window).scrollTop() && ( $(this).offset().top >  $(window).scrollTop()) ){
            $('#wh_topic_toc li a').removeClass('current_node');
            $('#wh_topic_toc li a[data-tocid = "'+ $(this).parent().attr('id') + '"]').addClass('current_node');
        }
    });
    return $(window).scrollTop();
}

/**
 * @description  Check if Page TOC & Side TOC columns exists in order to set the size of the content column 
 */
function setContentWidth(){
    var $pageTOC = $(".wh_topic_toc");
    var $sideTOC = $(".wh_publication_toc");
    var $contentSection = $('#wh_topic_body');

    if(!$pageTOC.find('li').length > 0 && !$sideTOC.find('li').length > 0 ){
        $($contentSection).removeAttr('class').attr('class','col-lg-12 col-md-12 col-sm-12 col-xs-12');
    }  else if($pageTOC.find('li').length > 0 && !$sideTOC.find('li').length > 0) {
        $($contentSection).removeAttr('class').attr('class','col-lg-10 col-md-10 col-sm-10 col-xs-12');
    }  else if(! $pageTOC.find('li').length > 0 && $sideTOC.find('li').length > 0) {
        $($contentSection).removeAttr('class').attr('class','col-lg-9 col-md-9 col-sm-9 col-xs-12');
    } 
}


/**
 * @description Handle the vertical position of the page toc
 */
function handlePageTocPosition(scrollPosition) {
    var scrollPosition = scrollPosition !== undefined ? scrollPosition : 0;
    var $pageTOCID = $("#wh_topic_toc");
    var $pageTOC = $(".wh_topic_toc");
    var $navSection = $(".wh_tools");
    var bottomNavOffset = 0;
    var $slideSection = $('#wh_topic_body');
    var topOffset = 33;
    
    if($pageTOC.length > 0){
        pageTocHighlightNode(scrollPosition);

        if ($slideSection.length > 0) {
            var minVisibleOffset = $(window).scrollTop();
            var tocHeight = parseInt($pageTOC.height()) + parseInt($pageTOC.css("padding-top")) + parseInt($pageTOC.css("padding-bottom")) + parseInt($pageTOC.css("margin-top")) + parseInt($pageTOC.css("margin-bottom"));
            var tocWidth =  parseInt($pageTOCID.outerWidth()) - parseInt($pageTOCID.css("padding-left")) - parseInt($pageTOCID.css("padding-right"));
            var tocXNav = parseInt($slideSection.offset().left) + parseInt($slideSection.width()) + parseInt($slideSection.css('padding-left')) + parseInt($slideSection.css('padding-right')) + parseInt($pageTOCID.css('padding-left')) + 1;

            if (scrollPosition > $(window).scrollTop()) {
                if ($pageTOC.offset().top < $pageTOC.parent().offset().top) {
                    $pageTOC.css('position', 'inherit');
                }
            } else {
                if (tocHeight > $(window).height()) {
                    $pageTOC.css('position', 'inherit');
                }
            }

            if ($navSection.length > 0) {
                bottomNavOffset = parseInt($navSection.offset().top) + parseInt($navSection.height()) + parseInt($navSection.css("padding-top")) + parseInt($navSection.css("padding-bottom")) + parseInt($navSection.css("margin-top")) + parseInt($navSection.css("margin-bottom"));
            }
            if (bottomNavOffset > minVisibleOffset) {
                minVisibleOffset = bottomNavOffset;
            }
            if (tocHeight < $slideSection.height()) {
                if (parseInt(minVisibleOffset - topOffset) <= $(window).scrollTop()) {
                    $pageTOC.css("top", "20px").css("position", "fixed").css("left", tocXNav + "px").css("width", tocWidth + "px");
                } else {
                    $pageTOC.removeAttr('style');
                }
            } else {
                //$slideSection.css("top", "0").css("min-height", tocHeight + "px");
            }


            scrollPosition = $(window).scrollTop();
        }
} else {
   // console.log("PAGE TOC NOT EXISTS");
}

return $(window).scrollTop();
}

    /**
     * @description Highlight searched words
     */
    function highlightSearchTerm() {
        util.debug("highlightSearchTerm()");
        if (highlighted) {
            return;
        }
        try {
            var $body = $('.wh_topic_content');
            var $relatedLinks = $('.wh_related_links');
            var $childLinks = $('.wh_child_links');

            // Test if highlighter library is available
            if (typeof $body.removeHighlight != 'undefined') {
                $body.removeHighlight();
                $relatedLinks.removeHighlight();

                var hlParameter = util.getParameter('hl');
                if (hlParameter != undefined) {
                    var jsonString = decodeURIComponent(String(hlParameter));
                    util.debug("jsonString: ", jsonString);
                    if (jsonString !== undefined && jsonString != "") {
                        var words = jsonString.split(',');
                        util.debug("words: ", words);
                        for (var i = 0; i < words.length; i++) {
                            util.debug('highlight(' + words[i] + ');');
                            $body.highlight(words[i]);
                            $relatedLinks.highlight(words[i]);
                            $childLinks.highlight(words[i]);
                        }
                    }
                }
            } else {
                // JQuery highlights library is not loaded
            }
        }
        catch (e) {
            util.debug (e);
        }
        highlighted = true;
    }

    /*
     * Hide the highlight of the search results
     */
    $('.wh_hide_highlight').click(function(){
        $('.highlight').addClass('wh-h');
        $('.wh-h').toggleClass('highlight');
        $(this).toggleClass('hl-close');
    });

    /*
     * Show the highlight button only if 'hl' parameter is found
     */
    if( util.getParameter('hl')!= undefined ){
        $('.wh_hide_highlight').show();
    }

    /**
     * Open the link from top_menu when the current group is expanded.
     *
     * Apply the events also on the dynamically generated elements.
     */
    $(document).on('click', ".wh_top_menu li", function (event) {
        $(".wh_top_menu li").removeClass('active');
        $(this).addClass('active');
        $(this).parents('li').addClass('active');
        event.stopImmediatePropagation();
    });


    $(document).on('click', '.wh_top_menu a', function (event) {
        var isTouchEnabled = false;
        try {
            if (document.createEvent("TouchEvent")) {
                isTouchEnabled = true;
            }
        } catch (e) {
            util.debug(e);
        }
        if ($(window).width() < 767 || isTouchEnabled) {
            var areaExpanded = $(this).closest('li');
            var isActive = areaExpanded.hasClass('active');
            var hasChildren = areaExpanded.hasClass('has-children');
            if (isActive || !hasChildren) {
                window.location = $(this).attr("href");
                event.preventDefault();
                event.stopImmediatePropagation();
                return false;
            } else {
                event.preventDefault();
            }
        } else {
            return true;
        }
    });
});
