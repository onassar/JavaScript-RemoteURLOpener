
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
     * Properties
     * 
     */

    /**
     * __config
     * 
     * @access  private
     * @var     Object
     */
    var __config = {
        ignoreClassNames: [
            'remote-urls-ignore'
        ],
        validHosts: [
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
        var destination = this.getAttribute('href');
        window.open(destination);
    };

    /**
     * __remotableElement
     * 
     * @access  private
     * @param   HTMLElement $element
     * @return  Boolean
     */
    var __remotableElement = function($element) {
        var hostname = $element.hostname;
        if (hostname === '') {
            return false;
        }
        if (__config.validHosts.includes(hostname) === true) {
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
            __addClickEventListener($element);
        }
    };

    /**
     * Public methods
     */
    return {

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
         * init
         * 
         * @access  public
         * @return  Boolean
         */
        init: function() {
            __scan();
            return true;
        }
    };
})();
