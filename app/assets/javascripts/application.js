// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require foundation
//= require_tree .
function replaceEmojiWithImages(root) {
  var REGIONAL_INDICATOR_A = parseInt('1f1e6', 16), REGIONAL_INDICATOR_Z = parseInt('1f1ff', 16), IMAGE_HOST = 'assets.github.com', IMAGE_PATH = '/images/icons/emoji/unicode/', IMAGE_EXT = '.png';
  // String.fromCodePoint is super helpful
  if (!String.fromCodePoint) {
    /*!
     * ES6 Unicode Shims 0.1
     * (c) 2012 Steven Levithan <http://slevithan.com/>
     * MIT License
     **/
    String.fromCodePoint = function fromCodePoint() {
      var chars = [], point, offset, units, i;
      for (i = 0; i < arguments.length; ++i) {
        point = arguments[i];
        offset = point - 65536;
        units = point > 65535 ? [
          55296 + (offset >> 10),
          56320 + (offset & 1023)
        ] : [point];
        chars.push(String.fromCharCode.apply(null, units));
      }
      return chars.join('');
    };
  }
  /**
   * Create a treewalker to walk an element and return an Array of Text Nodes.
   * This function is (hopefully) smart enough to exclude unwanted text nodes
   * like whitespace and script tags.
   * https://gist.github.com/mwunsch/4693383
   */
  function getLegitTextNodes(element) {
    if (!document.createTreeWalker)
      return [];
    var blacklist = [
        'SCRIPT',
        'OPTION',
        'TEXTAREA'
      ], textNodes = [], walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, function excludeBlacklistedNodes(node) {
        if (blacklist.indexOf(node.parentElement.nodeName.toUpperCase()) >= 0)
          return NodeFilter.FILTER_REJECT;
        if (String.prototype.trim && !node.nodeValue.trim().length)
          return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      }, false);
    while (walker.nextNode())
      textNodes.push(walker.currentNode);
    return textNodes;
  }
  /**
   * Determine if this browser supports emoji.
   */
  function doesSupportEmoji() {
    var context, smiley;
    if (!document.createElement('canvas').getContext)
      return;
    context = document.createElement('canvas').getContext('2d');
    if (typeof context.fillText != 'function')
      return;
    smile = String.fromCodePoint(128516);
    // :smile: String.fromCharCode(55357) + String.fromCharCode(56835)
    context.textBaseline = 'top';
    context.font = '32px Arial';
    context.fillText(smile, 0, 0);
    return context.getImageData(16, 16, 1, 1).data[0] !== 0;
  }
  /**
   * For a UTF-16 (JavaScript's preferred encoding...kinda) surrogate pair,
   * return a Unicode codepoint.
   */
  function surrogatePairToCodepoint(lead, trail) {
    return (lead - 55296) * 1024 + (trail - 56320) + 65536;
  }
  /**
   * Get an Image element for an emoji codepoint (in hex).
   */
  function getImageForCodepoint(hex) {
    var img = document.createElement('IMG');
    img.style.width = '1.4em';
    img.style.verticalAlign = 'top';
    img.src = '//' + IMAGE_HOST + IMAGE_PATH + hex + IMAGE_EXT;
    return img;
  }
  /**
   * Convert an HTML string into a DocumentFragment, for insertion into the dom.
   */
  function fragmentForString(htmlString) {
    var tmpDoc = document.createElement('DIV'), fragment = document.createDocumentFragment(), childNode;
    tmpDoc.innerHTML = htmlString;
    while (childNode = tmpDoc.firstChild) {
      fragment.appendChild(childNode);
    }
    return fragment;
  }
  /**
   * Iterate through a list of nodes, find emoji, replace with images.
   */
  function emojiReplace(nodes) {
    var PATTERN = /([\ud800-\udbff])([\udc00-\udfff])/g;
    nodes.forEach(function (node) {
      var replacement, value = node.nodeValue, matches = value.match(PATTERN);
      if (matches) {
        replacement = value.replace(PATTERN, function (match, p1, p2) {
          var codepoint = surrogatePairToCodepoint(p1.charCodeAt(0), p2.charCodeAt(0)), img = getImageForCodepoint(codepoint.toString(16));
          return img.outerHTML;
        });
        node.parentNode.replaceChild(fragmentForString(replacement), node);
      }
    });
  }
  // Call everything we've defined
  if (!doesSupportEmoji()) {
    emojiReplace(getLegitTextNodes(root));
  }
}
$(document).ready(function () {
  $(document).foundation();

  var el = document.body;
  replaceEmojiWithImages(el);
  var editor = new Editor();
  editor.render();
});

  var meny = Meny.create({
    menuElement: document.querySelector('.meny'),
    contentsElement: document.querySelector('.contents'),
    position: 'right',
    height: 200,
    width: 260,
    angle: 20,
    threshold: 40,
    overlap: 60,
    transitionDuration: '1.0s',
    transitionEasing: 'ease-out',
    gradient: 'rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.65) 100%)',
    mouse: true,
    touch: true
  });

