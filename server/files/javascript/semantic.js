// namespace
window.semantic = {
  handler: {}
};

// Allow for console.log to not break IE
if (typeof window.console == "undefined" || typeof window.console.log == "undefined") {
  window.console = {
    log  : function() {},
    info : function(){},
    warn : function(){}
  };
}
if(typeof window.console.group == 'undefined' || typeof window.console.groupEnd == 'undefined' || typeof window.console.groupCollapsed == 'undefined') {
  window.console.group = function(){};
  window.console.groupEnd = function(){};
  window.console.groupCollapsed = function(){};
}
if(typeof window.console.markTimeline == 'undefined') {
  window.console.markTimeline = function(){};
}
window.console.clear = function(){};

// ready event
semantic.ready = function() {

  // selector cache
  var

    $sortableTables   = $('.sortable.table'),
    $sticky           = $('.ui.sticky'),

    $themeDropdown    = $('.theme.dropdown'),

    $ui               = $('.ui').not('.hover, .down'),
    $swap             = $('.theme.menu .item'),
    $menu             = $('#menu'),
    $hideMenu         = $('#menu .hide.item'),
    $sortTable        = $('.sortable.table'),
    $demo             = $('.demo'),

    $container        = $('.main.container'),
    $allHeaders       = $('.main.container > h2, .main.container > .tab > h2, .main.container > .tab > .examples h2'),
    $sectionHeaders   = $container.children('h2'),
    $followMenu       = $container.find('.following.menu'),
    $sectionExample   = $container.find('.example'),
    $exampleHeaders   = $sectionExample.children('h4'),
    $footer           = $('.page > .footer'),

    $menuPopup        = $('.ui.main.menu .popup.item'),
    $menuDropdown     = $('.ui.main.menu .dropdown'),
    $pageTabMenu      = $('.tab.header.segment .tabular.menu'),
    $pageTabs         = $('.tab.header.segment .menu .item'),

    $downloadDropdown = $('.download.buttons .dropdown'),

    $helpPopup        = $('.header .help.icon'),

    $example          = $('.example'),
    $shownExample     = $example.filter('.shown'),

    $developer        = $('.developer.item'),
    $overview         = $('.overview.item, .overview.button'),
    $designer         = $('.designer.item'),

    $sidebarButton    = $('.fixed.launch.button'),
    $code             = $('div.code').not('.existing'),
    $existingCode     = $('.existing.code'),

    // alias
    handler
  ;


  // event handlers
  handler = {

    createIcon: function() {
      $example
        .each(function(){
          $('<i/>')
            .addClass('icon code')
            .appendTo( $(this) )
          ;
        })
      ;
    },

    createWaypoints: function() {
      $sectionHeaders
        .visibility({
          once: false,
          offset: 70,
          onTopPassed: handler.activate.section,
          onBottomPassed: handler.activate.section,
          onTopPassedReverse: handler.activate.previous
        })
      ;

      $sectionExample
        .visibility({
          once: false,
          offset: 70,
          onTopPassed: handler.activate.example,
          onBottomPassedReverse: handler.activate.example
        })
      ;
      $footer
        .visibility({
          once: false,
          onTopVisible: function() {
            var
              $title = $followMenu.find('> .item > .title').last()
            ;
            $followMenu
              .accordion('open', $title)
            ;
          }
        })
      ;
    },

    activate: {
      previous: function() {
        var
          $menuItems  = $followMenu.children('.item'),
          $section    = $menuItems.filter('.active'),
          index       = $menuItems.index($section)
        ;
        if($section.prev().size() > 0) {
          $section
            .removeClass('active')
            .prev('.item')
            .addClass('active')
          ;
          $followMenu
            .accordion('open', index - 1)
          ;
        }
      },
      section: function() {
        var
          $section       = $(this),
          index          = $sectionHeaders.index($section),
          $followSection = $followMenu.children('.item'),
          $activeSection = $followSection.eq(index)
        ;
        $followSection
          .removeClass('active')
        ;
        $activeSection
          .addClass('active')
        ;
        $followMenu
          .accordion('open', index)
        ;
      },
      example: function() {
        var
          $section       = $(this).children('h4').eq(0),
          index          = $exampleHeaders.index($section),
          $followSection = $followMenu.find('.menu > .item'),
          $activeSection = $followSection.eq(index)
        ;
        if($(this).not('.another.example').size() > 0) {
          $followSection
            .removeClass('active')
          ;
          $activeSection
            .addClass('active')
          ;
        }
      }
    },

    tryCreateMenu: function(event) {
      if($(window).width() > 1000) {
        if($container.find('.following.menu').size() === 0) {
          handler.createMenu();
          handler.createWaypoints();
          $(window).off('resize.menu');
        }
      }
    },

    createAnchors: function() {
      $allHeaders
        .each(function() {
          var
            $section = $(this),
            safeName = $section.text().trim().replace(/\s+/g, '-').toLowerCase(),
            id       = window.escape(safeName),
            $anchor  = $('<a />').addClass('anchor').attr('id', id)
          ;
          $section
            .append($anchor)
          ;
        })
      ;
      $example
        .each(function() {
          var
            $title   = $(this).children('h4').eq(0),
            safeName = $title.text().trim().replace(/\s+/g, '-').toLowerCase(),
            id       = window.escape(safeName),
            $anchor  = $('<a />').addClass('anchor').attr('id', id)
          ;
          if($title.size() > 0) {
            $title.prepend($anchor);
          }
        })
      ;

    },

    createMenu: function() {
      // grab each h3
      var
        html = '',
        $sticky,
        $rail
      ;
      $sectionHeaders
        .each(function(index) {
          var
            $currentHeader = $(this),
            $nextElements  = $currentHeader.nextUntil('h2'),
            $examples      = $nextElements.find('.example').andSelf().filter('.example'),
            activeClass    = (index === 0)
              ? 'active '
              : '',
            safeName = $currentHeader.text().trim().replace(/\s+/g, '-').toLowerCase(),
            id       = window.escape(safeName),
            $anchor  = $('<a />').addClass('anchor').attr('id', id)
          ;
          html += '<div class="item">';
          if($examples.size() === 0) {
            html += '<a class="'+activeClass+'title" href="'+id+'"><b>' + $(this).text() + '</b></a>';
          }
          else {
            html += '<a class="'+activeClass+'title"><i class="dropdown icon"></i> <b>' + $(this).text() + '</b></a>';
          }
          if($examples.size() > 0) {
            html += '<div class="'+activeClass+'content menu">';
            $examples
              .each(function() {
                var
                  $title   = $(this).children('h4').eq(0),
                  safeName = $title.text().trim().replace(/\s+/g, '-').toLowerCase(),
                  id       = window.escape(safeName),
                  $anchor  = $('<a />').addClass('anchor').attr('id', id)
                ;
                if($title.size() > 0) {
                  html += '<a class="item" href="#'+id+'">' + $(this).children('h4').text() + '</a>';
                }
              })
            ;
            html += '</div>';
          }
          html += '</div>';
        })
      ;
      $followMenu = $('<div />')
        .addClass('ui secondary vertical following fluid accordion menu')
        .html(html)
      ;
      $sticky = $('<div />')
        .addClass('ui sticky hidden transition')
        .html($followMenu)
      ;
      $rail = $('<div />')
        .addClass('ui close right rail')
        .html($sticky)
        .appendTo($container)
      ;
      $followMenu
        .accordion({
          exclusive: false,
          onChange: function() {
            $sticky.sticky('refresh');
          }
        })
        .find('.menu a[href], .title[href]')
          .on('click', handler.scrollTo)
      ;
      $sticky
        .transition('fade', function() {
          $sticky.sticky({
            context: $container,
            offset: 50
          });
        })
      ;
    },

    scrollTo: function(event) {
      var
        id       = $(this).attr('href').replace('#', ''),
        $element = $('#'+id),
        position = $element.offset().top
      ;
      $element
        .addClass('active')
      ;
      $('html, body')
        .animate({
          scrollTop: position
        }, 500)
      ;
      location.hash = '#' + id;
      event.stopImmediatePropagation();
      event.preventDefault();
      return false;
    },

    less: {

      parseFile: function(content) {
        var
          variables = {},
          lines = content.match(/^(@[\s|\S]+?;)/gm),
          name,
          value
        ;
        $.each(lines, function(index, line) {
          // clear whitespace
          line = $.trim(line);
          // match variables only
          if(line[0] == '@') {
            name = line.match(/^@(.+):/);
            value = line.match(/:\s*([\s|\S]+?;)/);
            if( ($.isArray(name) && name.length >= 2) && ($.isArray(value) && value.length >= 2) ) {
              name = name[1];
              value = value[1];
              variables[name] = value;
            }
          }
        });
        return variables;
      },

      changeTheme: function(theme) {
        var
          variableURL = '/build/less/themes/packages/{$theme}/{$type}s/{$element}.variables',
          overrideURL = '/build/less/themes/packages/{$theme}/{$type}s/{$element}.overrides',
          urlData     = {
            theme   : typeof(theme === 'string')
              ? theme.toLowerCase()
              : theme,
            type    : $themeDropdown.data('type'),
            element : $themeDropdown.data('element')
          }
        ;
        $themeDropdown
          .api({
            on       : 'now',
            url      : variableURL,
            dataType : 'text',
            urlData  : urlData,
            onSuccess: function(content) {
              less.modifyVars( handler.less.parseFile(content) );
              $themeDropdown
                .api({
                  on       : 'now',
                  url      : overrideURL,
                  dataType : 'text',
                  urlData  : urlData,
                  onSuccess: function(content) {
                    if( $('style.override').size() > 0 ) {
                      $('style.override').remove();
                    }
                    console.log(content);
                    $('<style>' + content + '</style>')
                      .addClass('override')
                      .appendTo('body')
                    ;
                  }
                })
              ;
            }
          })
        ;
      }

    },

    create: {
      examples: function(json) {
        var
          types      = json['Types'],
          text       = json['Text'],
          states     = json['States'],
          variations = json['Variations'],

          $element,
          html
        ;
        $.each(types, function(name, type){
          html += '<h2 class="ui dividing header">' + name + '</h2';
          if($.isPlainObject(type)) {
            $.each(type, function(name, subType) {
              $element = $.zc(subType);
              $element = handler.create.text($element, text);
              html += '<h3 class="ui header">' + name + '</h3';
              html += handler.create.variations($element, variations);
            });
          }
          else {
            $element = $.zc(type);
            $element = handler.create.text($element);
            html += handler.create.variations($element, variations);
          }
        });
        // Each TYPE
        //   show type name
        //   html = koan (html)
        //   each text
        //     find label
        //     if(obj)
        //       replace random text
        //     else
        //       replace text
        //   end
        //   Each variation
        //     (if obj)
        //       each
        //         add class
        //     (else)
        //       add class
        //     label = property
        //     class = class
        //     show html
        //   end
        // end
      },
      element: function(koan, type, text, variation) {

      },
      variations: function($element, variations) {
        $.each(variations, function(name, variation){

        });
      },
      text: function($element, text) {
        $.each(text, function(selector, text) {
          $element.find(selector).text(text);
        });
        return $element;
      }
    },
    overviewMode: function() {
      var
        $button  = $(this),
        $body    = $('body'),
        $example = $('.example')
      ;
      $body.toggleClass('overview');
      $button.toggleClass('active');
      if($body.hasClass('overview')) {
        $developer.addClass('disabled').popup('destroy');
        $designer.addClass('disabled').popup('destroy');
        $example.each(function() {
          $(this).children().not('.ui.header:eq(0), .example p:eq(0), .annotation').hide();
        });
        $example.filter('.another').hide();
      }
      else {
        $developer.removeClass('disabled').popup();
        $designer.removeClass('disabled').popup();
        $example.each(function() {
          $(this).children().not('.ui.header:eq(0), .example p:eq(0), .annotation').show();
        });
        $example.filter('.another').show();
      }
      $('.sticky').sticky('refresh');
    },
    developerMode: function() {
      var
        $example = $('.example').not('.no')
      ;
      $developer.addClass('active');
      $designer.removeClass('active');
      $example
        .each(function() {
          $.proxy(handler.createCode, $(this))('developer');
        })
      ;
      $('.sticky').sticky('refresh');
    },
    designerMode: function() {
      var
        $example = $('.example').not('.no')
      ;
      $designer.addClass('active');
      $developer.removeClass('active');
      $example
        .each(function() {
          $.proxy(handler.createCode, $(this))('designer');
        })
      ;
      $('.sticky').sticky('refresh');
    },

    getIndent: function(text) {
      var
        lines           = text.split("\n"),
        firstLine       = (lines[0] === '')
          ? lines[1]
          : lines[0],
        spacesPerIndent = 2,
        leadingSpaces   = firstLine.length - firstLine.replace(/^\s*/g, '').length,
        indent
      ;
      if(leadingSpaces !== 0) {
        indent = leadingSpaces;
      }
      else {
        // string has already been trimmed, get first indented line and subtract 2
        $.each(lines, function(index, line) {
          leadingSpaces = line.length - line.replace(/^\s*/g, '').length;
          if(leadingSpaces !== 0) {
            indent = leadingSpaces - spacesPerIndent;
            return false;
          }
        });
      }
      return indent || 4;
    },

    generateCode: function() {
      var
        $example    = $(this).closest('.example'),
        $annotation = $example.find('.annotation'),
        $code       = $annotation.find('.code'),
        $header     = $example.not('.another').children('.ui.header:first-of-type').eq(0).add('p:first-of-type'),
        $ignored    = $('i.code:last-child, .code, .existing, .pointing.below.label, .instructive, .language.label, .annotation, br, .ignore, .ignored'),
        $demo       = $example.children().not($header).not($ignored),
        code        = ''
      ;
      if( $code.size() === 0) {
        $demo
          .each(function(){
            var $this = $(this).clone(false);
            if($this.not('br')) {
              // allow inline styles only with this one class
              if($this.is('.my-container')) {
                code += $this.get(0).outerHTML + "\n";
              }
              else {
                code += $this.removeAttr('style').get(0).outerHTML + "\n";
              }
            }
          })
        ;
      }
      $example.data('code', code);
      return code;
    },
    createCode: function(type) {
      var
        $example        = $(this).closest('.example'),
        $header         = $example.children('.ui.header:first-of-type').eq(0).add('p:first-of-type'),
        $annotation     = $example.find('.annotation'),
        $code           = $annotation.find('.code'),
        $ignoredContent = $('.ui.popup, i.code:last-child, .code, .existing.segment, .instructive, .language.label, .annotation, br, .ignore, .ignored'),
        $demo           = $example.children().not($header).not($ignoredContent),
        code            = $example.data('code') || $.proxy(handler.generateCode, this)()
      ;
      if( $code.hasClass('existing') ) {
        $annotation.show();
        $code.removeClass('existing');
        $.proxy(handler.initializeCode, $code)();
      }

      if($annotation.size() === 0) {
        $annotation = $('<div/>')
          .addClass('annotation')
          .appendTo($example)
        ;
      }

      if( $example.find('.instructive').size() === 0) {
        $code = $('<div/>')
          .data('type', 'html')
          .addClass('code')
          .html(code)
          .hide()
            .appendTo($annotation)
        ;
        $.proxy(handler.initializeCode, $code)();
      }

      if( ($demo.first().is(':visible') || type == 'developer') && type != 'designer' ) {
        $demo.hide();
        $header.show();
        $annotation.fadeIn(500);
      }
      else {
        $annotation.hide();
        if($demo.size() > 1) {
          $demo.show();
        }
        else {
          $demo.fadeIn(500);
        }
      }
    },

    createAnnotation: function() {
      if(!$(this).data('type')) {
        $(this).data('type', 'html');
      }
      $(this)
        .wrap('<div class="annotation">')
        .parent()
        .hide()
      ;
    },

    resizeCode: function() {
      $('.ace_editor')
        .each(function() {
          var
            $code = $(this),
            padding     = 50,
            editor,
            editorSession,
            codeHeight
          ;
          $code.css('height', 'auto');
          editor        = ace.edit($code[0]);
          editorSession = editor.getSession();

          codeHeight = editorSession.getScreenLength() * editor.renderer.lineHeight + padding;
          $code.css('height', codeHeight);
          editor.resize();
        })
      ;
    },

    makeCode: function() {
      if(window.ace !== undefined) {
        $code
          .filter(':visible')
          .each(handler.initializeCode)
        ;
        $existingCode
          .each(handler.createAnnotation)
        ;
      }
    },


    initializeCode: function() {
      var
        $code        = $(this).show(),
        code         = $code.html(),
        existingCode = $code.hasClass('existing'),
        evaluatedCode = $code.hasClass('evaluated'),
        contentType  = $code.data('type')    || 'javascript',
        title        = $code.data('title')   || false,
        demo         = $code.data('demo')    || false,
        preview      = $code.data('preview') || false,
        label        = $code.data('label')   || false,
        displayType  = {
          html       : 'HTML',
          javascript : 'Javascript',
          css        : 'CSS',
          text       : 'Command Line',
          sh         : 'Command Line'
        },
        indent     = handler.getIndent(code) || 2,
        padding    = 20,
        name = (evaluatedCode)
          ? 'existing'
          : 'instructive',
        whiteSpace,
        $label,
        editor,
        editorSession,
        codeHeight
      ;

      // trim whitespace
      whiteSpace = new RegExp('\\n\\s{' + indent + '}', 'g');
      code = $.trim(code).replace(whiteSpace, '\n');

      if(contentType == 'html') {
        $code.text(code);
      }
      else {
        $code.html(code);
      }

      // evaluate if specified
      if(evaluatedCode) {
        eval(code);
      }

      // initialize
      editor        = ace.edit($code[0]);
      editorSession = editor.getSession();

      //editor.setTheme('ace/theme/tomorrow');
      editor.setTheme('ace/theme/github');
      editor.setShowPrintMargin(false);
      editor.setReadOnly(true);
      editor.renderer.setShowGutter(false);
      editor.setHighlightActiveLine(false);
      editorSession.setMode('ace/mode/'+ contentType);
      editorSession.setUseWrapMode(true);
      editorSession.setTabSize(2);
      editorSession.setUseSoftTabs(true);
      codeHeight = editorSession.getScreenLength() * editor.renderer.lineHeight + padding;
      $(this)
        .height(codeHeight + 'px')
        .wrap('<div class="ui ' + name + ' segment">')
      ;
      // add label
      if(title) {
        $('<div>')
          .addClass('ui attached top label')
          .html('<span class="title">' + title + '</span>' + '<em>' + (displayType[contentType] || contentType) + '</em>')
          .prependTo( $(this).parent() )
        ;
      }
      if(label) {
        $('<div>')
          .addClass('ui pointing below label')
          .html(displayType[contentType] || contentType)
          .insertBefore ( $(this).parent() )
        ;
      }
      // add run code button
      if(demo) {
        $('<a>')
          .addClass('ui pointing below label')
          .html('Run Code')
          .on('click', function() {
            eval(code);
          })
          .insertBefore ( $(this).parent() )
        ;
      }
      // add preview if specified
      if(preview) {
        $(code)
          .insertAfter( $(this).parent() )
        ;
      }
      editor.resize();
    },

    swapStyle: function() {
      var
        theme = $(this).data('theme')
      ;
      $(this)
        .addClass('active')
        .siblings()
          .removeClass('active')
      ;
      $('head link.ui')
        .each(function() {
          var
            href         = $(this).attr('href'),
            subDirectory = href.split('/')[3],
            newLink      = href.replace(subDirectory, theme)
          ;
          $(this)
            .attr('href', newLink)
          ;
        })
      ;
    }
  };


  handler.createAnchors();

  if( $pageTabs.size() > 0 ) {
    $pageTabs
      .tab({
        context      : '.main.container',
        childrenOnly : true,
        history      : true,
        onTabInit    : function() {
          handler.makeCode();

          $container = ($('.fixed.column').size() > 0 )
            ? $(this).find('.examples')
            : $(this)
          ;
          $sectionHeaders = $container.children('h2');
          $sectionExample = $container.find('.example');
          $exampleHeaders = $sectionExample.children('h4');
          // create code
          handler.tryCreateMenu();
          $(window).on('resize.menu', function() {
            handler.tryCreateMenu();
          });
        },
        onTabLoad : function() {
          $sticky.filter(':visible').sticky('refresh');
        }
      })
    ;
  }
  else {
    handler.makeCode();
    handler.tryCreateMenu();
    $(window).on('resize.menu', function() {
      handler.tryCreateMenu();
    });
  }


  $sticky
    .sticky({
      context : '.main.container',
      pushing : true
    })
  ;

  $menu
    .sidebar('attach events', '.launch.button, .view-ui.button, .launch.item')
    .sidebar('attach events', $hideMenu, 'hide')
  ;

  handler.createIcon();
  $example
    .each(function() {
      $.proxy(handler.generateCode, this)();
    })
    .find('i.code')
      .on('click', handler.createCode)
  ;

  $shownExample
    .each(handler.createCode)
  ;

  $(window)
    .on('resize', function() {
      clearTimeout(handler.timer);
      handler.timer = setTimeout(handler.resizeCode, 500);
    })
  ;

  $downloadDropdown
    .dropdown({
      on         : 'click',
      transition : 'scale'
    })
  ;

  $themeDropdown
    .dropdown({
      action: 'select',
      onChange: handler.less.changeTheme
    })
  ;

  if($.fn.tablesort !== undefined && $sortTable.size() > 0) {
    $sortTable
      .tablesort()
    ;
  }

  $helpPopup
    .popup()
  ;

  $swap
    .on('click', handler.swapStyle)
  ;

  $developer
    .on('click', handler.developerMode)
  ;
  $designer
    .on('click', handler.designerMode)
  ;
  $overview
    .on('click', handler.overviewMode)
  ;

  $menuPopup
    .popup({
      position  : 'bottom center',
      className : {
        popup: 'ui popup'
      }
    })
  ;

  $menuDropdown
    .dropdown({
      on       : 'hover',
      action   : 'nothing',
      allowTab : false
    })
  ;

  if($('body').hasClass('index') ) {
    $('.masthead')
      .visibility({
        once: false
      })
      .visibility('bottom visible', function(){
        $('.main.menu').removeClass('filled');
      })
      .visibility('bottom passed', function(){
        $('.main.menu').addClass('filled');
      })
      .find('.button')
        .popup({
          position  : 'top center'
        })
    ;
  }

};


// attach ready event
$(document)
  .ready(semantic.ready)
;
