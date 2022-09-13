
/**
 * RemoteURLOpener
 * 
 * @todo    Add dom change detection to deal with links that are generated on
 *          the fly (eg. HTML injected into the page).
 * @access  public
 * @var     Object
 */
var RemoteURLOpener = (function() {

    /**
     * Properties (private)
     * 
     */

    /**
     * __config
     * 
     * @access  private
     * @var     Object
     */
    var __config = {

        /**
         * ignoreClassNames
         * 
         * An array of class names that will result in those respective elements
         * being excluded from any event binding.
         * 
         * In english: elements with one of these class names will not have a
         * click event trigger a new tab or window.
         * 
         * @access  private
         * @var     Object
         */
        ignoreClassNames: [
            'remote-urls-ignore'
        ],

        /**
         * includeMailtoElements
         * 
         * Whether elements pointing to a mailto: flow ought to open in a new
         * tab or window.
         * 
         * @access  private
         * @var     Boolean (default: true)
         */
        includeMailtoElements: true,

        /**
         * invalidProtocols
         * 
         * Any elements that are pointing to resources, but with a protocol
         * defined in this array, will not have a click event listener bound to
         * them. This is because those resources are "special", and event
         * listeners should not get between them and the default browser/client
         * behaviour.
         * 
         * @access  private
         * @var     Array
         */
        invalidProtocols: [
            'chrome'
        ],

        /**
         * outboundClickParams
         * 
         * @access  private
         * @var     Object (default: {})
         */
        outboundClickParams: {},

        /**
         * validHostnames
         * 
         * An array of hostnames that are excluded from any event binding.
         * 
         * In english: any element on the page that has a hostname in this array
         * will not have a click event trigger a new tab or window.
         * 
         * @access  private
         * @var     Array
         */
        validHostnames: [
            window.location.host
        ]
    };

    /**
     * __string
     * 
     * @access  private
     * @var     String (default: 'RemoteURLOpener')
     */
    var __string = 'RemoteURLOpener';

    /**
     * Methods
     * 
     */

    /**
     * __addClickEventListener
     * 
     * @access  private
     * @param   HTMLElement $element
     * @return  void
     */
    var __addClickEventListener = function($element) {
        var handler = __handleClickEvent;
        $element.addEventListener('click', handler);
    };

    /**
     * __elementAlreadyOpeningExternally
     * 
     * @access  private
     * @param   HTMLElement $element
     * @return  Boolean
     */
    var __elementAlreadyOpeningExternally = function($element) {
        var target = $element.getAttribute('target');
        if (target === null) {
            return false;
        }
        if (target === undefined) {
            return false;
        }
        target = target.trim().toLowerCase();
        if (target === '_blank') {
            return true;
        }
        return false;
    };

    /**
     * __getOutboundURL
     * 
     * @see     https://developer.mozilla.org/en-US/docs/Web/API/URL
     * @access  private
     * @param   HTMLElement $element
     * @return  String
     */
    var __getOutboundURL = function($element) {
        var href = $element.getAttribute('href');
        if (__isMailtoElement($element) === true) {
            return href;
        }
        var url = new URL(href);
        for (var key in __config.outboundClickParams) {
            var value = __config.outboundClickParams[key];
            url.searchParams.append(key, value);
        }
        url = url.toString();
        return url;
    };

    /**
     * __getSelector
     * 
     * @access  private
     * @return  String
     */
    var __getSelector = function() {
        var selector = 'a',
            ignoreClassNames = __config.ignoreClassNames;
        for (var className of ignoreClassNames) {
            selector = (selector) + ':not(.' + (className) + ')';
        }
        return selector;
    };

    /**
     * __handleClickEvent
     * 
     * @access  private
     * @param   Object event
     * @return  void
     */
    var __handleClickEvent = function(event) {
        event.preventDefault();
        var $element = this,
            url = __getOutboundURL($element);
        window.open(url);
    };

    /**
     * __isMailtoElement
     * 
     * @access  private
     * @param   HTMLElement $element
     * @return  void
     */
    var __isMailtoElement = function($element) {
        var href = $element.getAttribute('href');
        if (href === null) {
            return false;
        }
        if (href === undefined) {
            return false;
        }
        var pattern = /^mailto\:/i;
        if (href.match(pattern) === null) {
            return false;
        }
        return true;
    };

    /**
     * __isReservedElement
     * 
     * @see     https://i.imgur.com/Qnj3yBU.png
     * @access  private
     * @param   HTMLElement $element
     * @return  Boolean
     */
    var __isReservedElement = function($element) {
        try {
            var href = $element.getAttribute('href'),
                invalidProtocols = __config.invalidProtocols,
                url = new URL(href);
        } catch (err) {
            return false;
        }
        for (var invalidProtocol of invalidProtocols) {
            invalidProtocol = (invalidProtocol) + ':';
            if (invalidProtocol === url.protocol) {
                return true;
            }
        }
        return false;
    };

    /**
     * __remotableElement
     * 
     * @access  private
     * @param   HTMLElement $element
     * @return  Boolean
     */
    var __remotableElement = function($element) {
        if (__config.includeMailtoElements && __isMailtoElement($element) === true) {
            return true;
        }
        var hostname = $element.hostname;
        if (hostname === '') {
            return false;
        }
        if (__config.validHostnames.includes(hostname) === true) {
            return false;
        }
        if (__elementAlreadyOpeningExternally($element) === true) {
            return false;
        }
        return true;
    };

    /**
     * __remoteOpen
     * 
     * @access  private
     * @param   String url
     * @return  void
     */
    var __remoteOpen = function(url) {
        window.open(url);
    };

    /**
     * __scan
     * 
     * @access  private
     * @return  void
     */
    var __scan = function() {
        var selector = __getSelector(),
            $elements = document.querySelectorAll(selector);
        for (var $element of $elements) {
            if (__remotableElement($element) === false) {
                continue;
            }
            if (__isReservedElement($element) === true) {
                continue;
            }
            __addClickEventListener($element);
        }
    };

    /**
     * Public methods
     */
    return {

        /**
         * init
         * 
         * @access  public
         * @return  Boolean
         */
        init: function() {
            __scan();
            return true;
        },

        /**
         * setConfig
         * 
         * @access  public
         * @param   Object|String key
         * @param   undefined|String value
         * @return  Boolean
         */
        setConfig: function(key, value) {
            if (typeof key === 'object') {
                var config = key;
                __config = config;
                return true;
            }
            __config[key] = value;
            return true;
        },

        /**
         * setRef
         * 
         * @access  public
         * @param   String ref
         * @return  Boolean
         */
        setRef: function(ref) {
            var key = 'outboundClickParams',
                params = {};
            params.ref = ref;
            var value = params,
                response = RemoteURLOpener.setConfig(key, value);
            return response;
        }
    };
})();
