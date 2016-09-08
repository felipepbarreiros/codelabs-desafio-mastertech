/*! (C) WebReflection Mit Style License */
var URLSearchParams=URLSearchParams||function(){"use strict";function e(e){return encodeURIComponent(e).replace(i,u)}function t(e){return decodeURIComponent(e.replace(s," "))}function n(e){this[f]=Object.create(null);if(!e)return;for(var n,r,i=(e||"").split("&"),s=0,o=i.length;s<o;s++)r=i[s],n=r.indexOf("="),-1<n&&this.append(t(r.slice(0,n)),t(r.slice(n+1)))}function l(){try{return!!Symbol.iterator}catch(e){return!1}}var r=n.prototype,i=/[!'\(\)~]|%20|%00/g,s=/\+/g,o={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\0"},u=function(e){return o[e]},a=l(),f="__URLSearchParams__:"+Math.random();r.append=function(t,n){var r=this[f];t in r?r[t].push(""+n):r[t]=[""+n]},r.delete=function(t){delete this[f][t]},r.get=function(t){var n=this[f];return t in n?n[t][0]:null},r.getAll=function(t){var n=this[f];return t in n?n[t].slice(0):[]},r.has=function(t){return t in this[f]},r.set=function(t,n){this[f][t]=[""+n]},r.forEach=function(t,n){var r=this[f];Object.getOwnPropertyNames(r).forEach(function(e){r[e].forEach(function(r){t.call(n,r,e,this)},this)},this)},r.keys=function(){var t=[];this.forEach(function(e,n){t.push(n)});var n={next:function(){var e=t.shift();return{done:e===undefined,value:e}}};return a&&(n[Symbol.iterator]=function(){return n}),n},r.values=function(){var t=[];this.forEach(function(e){t.push(e)});var n={next:function(){var e=t.shift();return{done:e===undefined,value:e}}};return a&&(n[Symbol.iterator]=function(){return n}),n},r.entries=function(){var t=[];this.forEach(function(e,n){t.push([n,e])});var n={next:function(){var e=t.shift();return{done:e===undefined,value:e}}};return a&&(n[Symbol.iterator]=function(){return n}),n},a&&(r[Symbol.iterator]=r.entries),r.toJSON=function(){return{}},r.toString=function y(){var t=this[f],n=[],r,i,s,o;for(i in t){s=e(i);for(r=0,o=t[i];r<o.length;r++)n.push(s+"="+e(o[r]))}return n.join("&")};var c=Object.defineProperty,h=Object.getOwnPropertyDescriptor,p=function(e){function t(t,n){r.append.call(this,t,n),t=this.toString(),e.set.call(this._usp,t?"?"+t:"")}function n(t){r.delete.call(this,t),t=this.toString(),e.set.call(this._usp,t?"?"+t:"")}function i(t,n){r.set.call(this,t,n),t=this.toString(),e.set.call(this._usp,t?"?"+t:"")}return function(e,r){return e.append=t,e.delete=n,e.set=i,c(e,"_usp",{configurable:!0,writable:!0,value:r})}},d=function(e){return function(t,n){return c(t,"_searchParams",{configurable:!0,writable:!0,value:e(n,t)}),n}},v=function(e){var t=e.append;e.append=r.append,n.call(e,e._usp.search.slice(1)),e.append=t},m=function(e,t){if(!(e instanceof t))throw new TypeError("'searchParams' accessed on an object that does not implement interface "+t.name)},g=function(e){var t=e.prototype,r=h(t,"searchParams"),i=h(t,"href"),s=h(t,"search"),o;!r&&s&&s.set&&(o=d(p(s)),Object.defineProperties(t,{href:{get:function(){return i.get.call(this)},set:function(e){var t=this._searchParams;i.set.call(this,e),t&&v(t)}},search:{get:function(){return s.get.call(this)},set:function(e){var t=this._searchParams;s.set.call(this,e),t&&v(t)}},searchParams:{get:function(){return m(this,e),this._searchParams||o(this,new n(this.search.slice(1)))},set:function(t){m(this,e),o(this,t)}}}))};return g(HTMLAnchorElement),/^function|object$/.test(typeof URL)&&g(URL),n}();
(function(window, document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');
  app.categoryStartCards = {};

  app.displayInstalledToast = function() {
    document.querySelector('#caching-complete').show();
  };

  // template is="dom-bind" has stamped its content.
  app.addEventListener('dom-change', function(e) {
    // Use element's protected _readied property to signal if a dom-change
    // has already happened.
    if (app._readied) {
      return;
    }

    // Calculate category offsets.
    var cards = document.querySelectorAll('.codelab-card');
    Array.prototype.forEach.call(cards, function(card, i) {
      var category = card.getAttribute('data-category');
      if (app.categoryStartCards[category] === undefined) {
        app.categoryStartCards[category] = card;
      }
    });
  });

  app.addEventListener('app-ready', function(e) {
    // app.debounce('job', fn) fails with "Cannot read property of undefined"
    // without this:
    if (app._setupDebouncers) {
      app._setupDebouncers();
    }
    this.reconstructFromURL(); // Deep link category filtering from URL.
  });

  app.codelabUrl = function(view, codelab) {
    var codelabUrlParams = 'index=' + encodeURIComponent('../..' + view.url);
    if (view.ga) {
      codelabUrlParams += '&viewga=' + view.ga;
    }
    return codelab.url + '?' + codelabUrlParams;
  };

  app.sortBy = function(e, detail) {
    var filter = detail.item.textContent.toLowerCase();
    this.$.cards.sort(filter);
  };

  app.filterBy = function(e, detail) {
    if (detail.hasOwnProperty('selected')) {
      this.$.cards.filterByCategory(detail.selected);
    } else {
      this.$.cards.filter(detail);
    }

    // Hide filters if on mobile.
    if (this.isPhoneSize) {
      this.selectedFilter = null;
    }
  };

  app.onCategoryActivate = function(e, detail) {
    var item = e.target.selectedItem;
    if (item && item.getAttribute('filter') === detail.selected) {
      detail.selected = null;
    }
    if (!detail.selected) {
      this.async(function() { e.target.selected = null; });
    }
    this.filterBy(e, {selected: detail.selected});

    // Update URL deep link to filter.
    var params = new URLSearchParams(window.location.search.slice(1));
    params.delete('cat'); // delete all cat params
    if (detail.selected) {
      params.set('cat',  detail.selected);
    }

    // record in browser history to make the back button work
    var url = window.location.pathname;
    var search = '?' + params;
    if (search !== '?') {
      url += search;
    }
    window.history.pushState({}, '', url);
  };

  app.onFilterPageSelect = function(e, detail) {
    var label = this.selectedFilter === 'events' ? 'Events' : 'Codelabs';
    this.$.banner_slider_title.textContent = label;
  };

  app.reconstructFromURL = function() {
    var params = new URLSearchParams(window.location.search.slice(1));
    var cat = params.get('cat');
    var tags = params.getAll('tags');

    if (this.$.categorylist) {
      this.$.categorylist.selected = cat;
    }
    this.filterBy(null, {cat: cat, tags: tags});
  };

  // Prevent immediate link navigation.
  app.navigate = function(event) {
    event.preventDefault();

    var go = function(href) {
      window.location.href = href;
    };

    var target = event.currentTarget;
    var wait = target.hasAttribute('data-wait-for-ripple');
    if (wait) {
      target.addEventListener('transitionend', go.bind(target, target.href));
    } else {
      go(target.href);
    }
  };

  app.clearSearch = function(e, detail) {
    this.searchVal = null;
    this.$.cards.filterByText(null);
  };

  app.onSearchKeyDown = function(e, detail) {
    this.debounce('search', function() {
      this.$.cards.filterByText(app.searchVal);
    }, 250);
  };

  app._toBoolean = function(val) {
    return Boolean(val);
  };

  app._showMoreFiltersArrow = function(selectedFilter, isDesktopSize) {
    return selectedFilter && isDesktopSize;
  };

  app._shiftContentRight = function(e, detail) {
    var list = this.$.banner.querySelector('.banner-events');
    shiftContentRight(list);
  };

  app._shiftContentLeft = function(e, detail) {
    var list = this.$.banner.querySelector('.banner-events');
    shiftContentLeft(list);
  };

  /**
   * Slides (transforms) container to the left.
   * @param {Element} container The container to move.
   */
  function shiftContentLeft(container) {
    var transform = container.style.transform;

    // "translate3d(100px, 0px, 0px)" -> 100
    var lastX = transform ? parseInt(transform.split('(')[1].split(',')[0]) : 0;

    var cardRect = container.lastElementChild.getBoundingClientRect();
    var cardWidth = cardRect.width;

    var newX = lastX + cardWidth;
    if (newX < cardWidth) {
      container.style.transform = 'translate3d(' + newX + 'px, 0, 0)';
    }
  }

  /**
   * Slides (transforms) container to the right.
   * @param {Element} container The container to move.
   */
  function shiftContentRight(container) {
    var transform = container.style.transform;

    // "translate3d(100px, 0px, 0px)" -> 100
    var lastX = transform ? parseInt(transform.split('(')[1].split(',')[0]) : 0;

    var containerWidth = container.getBoundingClientRect().width;
    var cardRect = container.lastElementChild.getBoundingClientRect();
    var lastCardRight = cardRect.right;
    var cardWidth = cardRect.width;

    var newX = lastX - cardWidth;
    if (lastCardRight > containerWidth) {
      container.style.transform = 'translate3d(' + newX + 'px, 0, 0)';
    }
  }

  function loadWebComponentsPolyfillsIfNeed() {
    // Feature detect and conditionally load the web component polyfills.
    var webComponentsSupported = (
      'registerElement' in document &&
      'import' in document.createElement('link') &&
      'content' in document.createElement('template'));
    if (!webComponentsSupported) {
      var script = document.createElement('script');
      script.async = true;
      script.src = 'bower_components/webcomponentsjs/webcomponents-lite.min.js';
      document.head.appendChild(script);
    }
  }

  function init() {
    loadWebComponentsPolyfillsIfNeed();

    var eventLists = document.querySelectorAll('.banner-events');
    [].forEach.call(eventLists, function(list) {
      list.selected = window.location.pathname;
    });

    window.addEventListener('popstate', function(e) {
      app.reconstructFromURL();
    });

    // jscs:disable
    /* jshint ignore:start */
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    /* jshint ignore:end */
    // jscs:enable

    ga('create', window.GA, 'auto');
    ga('send', 'pageview');

    if (window.GA_VIEW) {
      ga('create', window.GA_VIEW, 'auto', {name: 'view'});
      ga('view.send', 'pageview');
    }
  }

  init();

})(window, document);

(function(window, document) {
  'use script';

  window.Polymer = window.Polymer || {dom: 'shadow'};

  window.onImportsLoaded = function(e) {
    document.body.classList.remove('loading');
    if (window.CustomEvent) {
      document.body.dispatchEvent(new CustomEvent('app-ready'));
    }
  };

})(window, document);
