//  Mapbox Directions v0.1.0  ** ============================================================== //
  ;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
  'use strict';

  if (!L.mapbox) throw new Error('include mapbox.js before mapbox.directions.js');

  L.mapbox.directions = require('./src/directions');
  L.mapbox.directions.format = require('./src/format');
  L.mapbox.directions.layer = require('./src/layer');
  L.mapbox.directions.inputControl = require('./src/input_control');
  L.mapbox.directions.errorsControl = require('./src/errors_control');
  L.mapbox.directions.routesControl = require('./src/routes_control');
  L.mapbox.directions.instructionsControl = require('./src/instructions_control');

  },{"./src/directions":6,"./src/errors_control":7,"./src/format":8,"./src/input_control":9,"./src/instructions_control":10,"./src/layer":11,"./src/routes_control":12}],2:[function(require,module,exports){
  !function(){
    var d3 = {version: "3.4.1"}; // semver
  var d3_arraySlice = [].slice,
      d3_array = function(list) { return d3_arraySlice.call(list); }; // conversion for NodeLists

  var d3_document = document,
      d3_documentElement = d3_document.documentElement,
      d3_window = window;

  // Redefine d3_array if the browser doesn’t support slice-based conversion.
  try {
    d3_array(d3_documentElement.childNodes)[0].nodeType;
  } catch(e) {
    d3_array = function(list) {
      var i = list.length, array = new Array(i);
      while (i--) array[i] = list[i];
      return array;
    };
  }
  var d3_subclass = {}.__proto__?

  // Until ECMAScript supports array subclassing, prototype injection works well.
  function(object, prototype) {
    object.__proto__ = prototype;
  }:

  // And if your browser doesn't support __proto__, we'll use direct extension.
  function(object, prototype) {
    for (var property in prototype) object[property] = prototype[property];
  };

  function d3_vendorSymbol(object, name) {
    if (name in object) return name;
    name = name.charAt(0).toUpperCase() + name.substring(1);
    for (var i = 0, n = d3_vendorPrefixes.length; i < n; ++i) {
      var prefixName = d3_vendorPrefixes[i] + name;
      if (prefixName in object) return prefixName;
    }
  }

  var d3_vendorPrefixes = ["webkit", "ms", "moz", "Moz", "o", "O"];

  function d3_selection(groups) {
    d3_subclass(groups, d3_selectionPrototype);
    return groups;
  }

  var d3_select = function(s, n) { return n.querySelector(s); },
      d3_selectAll = function(s, n) { return n.querySelectorAll(s); },
      d3_selectMatcher = d3_documentElement[d3_vendorSymbol(d3_documentElement, "matchesSelector")],
      d3_selectMatches = function(n, s) { return d3_selectMatcher.call(n, s); };

  // Prefer Sizzle, if available.
  if (typeof Sizzle === "function") {
    d3_select = function(s, n) { return Sizzle(s, n)[0] || null; };
    d3_selectAll = function(s, n) { return Sizzle.uniqueSort(Sizzle(s, n)); };
    d3_selectMatches = Sizzle.matchesSelector;
  }

  d3.selection = function() {
    return d3_selectionRoot;
  };

  var d3_selectionPrototype = d3.selection.prototype = [];


  d3_selectionPrototype.select = function(selector) {
    var subgroups = [],
        subgroup,
        subnode,
        group,
        node;

    selector = d3_selection_selector(selector);

    for (var j = -1, m = this.length; ++j < m;) {
      subgroups.push(subgroup = []);
      subgroup.parentNode = (group = this[j]).parentNode;
      for (var i = -1, n = group.length; ++i < n;) {
        if (node = group[i]) {
          subgroup.push(subnode = selector.call(node, node.__data__, i, j));
          if (subnode && "__data__" in node) subnode.__data__ = node.__data__;
        } else {
          subgroup.push(null);
        }
      }
    }

    return d3_selection(subgroups);
  };

  function d3_selection_selector(selector) {
    return typeof selector === "function" ? selector : function() {
      return d3_select(selector, this);
    };
  }

  d3_selectionPrototype.selectAll = function(selector) {
    var subgroups = [],
        subgroup,
        node;

    selector = d3_selection_selectorAll(selector);

    for (var j = -1, m = this.length; ++j < m;) {
      for (var group = this[j], i = -1, n = group.length; ++i < n;) {
        if (node = group[i]) {
          subgroups.push(subgroup = d3_array(selector.call(node, node.__data__, i, j)));
          subgroup.parentNode = node;
        }
      }
    }

    return d3_selection(subgroups);
  };

  function d3_selection_selectorAll(selector) {
    return typeof selector === "function" ? selector : function() {
      return d3_selectAll(selector, this);
    };
  }
  var d3_nsPrefix = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };

  d3.ns = {
    prefix: d3_nsPrefix,
    qualify: function(name) {
      var i = name.indexOf(":"),
          prefix = name;
      if (i >= 0) {
        prefix = name.substring(0, i);
        name = name.substring(i + 1);
      }
      return d3_nsPrefix.hasOwnProperty(prefix)
          ? {space: d3_nsPrefix[prefix], local: name}
          : name;
    }
  };

  d3_selectionPrototype.attr = function(name, value) {
    if (arguments.length < 2) {

      // For attr(string), return the attribute value for the first node.
      if (typeof name === "string") {
        var node = this.node();
        name = d3.ns.qualify(name);
        return name.local
            ? node.getAttributeNS(name.space, name.local)
            : node.getAttribute(name);
      }

      // For attr(object), the object specifies the names and values of the
      // attributes to set or remove. The values may be functions that are
      // evaluated for each element.
      for (value in name) this.each(d3_selection_attr(value, name[value]));
      return this;
    }

    return this.each(d3_selection_attr(name, value));
  };

  function d3_selection_attr(name, value) {
    name = d3.ns.qualify(name);

    // For attr(string, null), remove the attribute with the specified name.
    function attrNull() {
      this.removeAttribute(name);
    }
    function attrNullNS() {
      this.removeAttributeNS(name.space, name.local);
    }

    // For attr(string, string), set the attribute with the specified name.
    function attrConstant() {
      this.setAttribute(name, value);
    }
    function attrConstantNS() {
      this.setAttributeNS(name.space, name.local, value);
    }

    // For attr(string, function), evaluate the function for each element, and set
    // or remove the attribute as appropriate.
    function attrFunction() {
      var x = value.apply(this, arguments);
      if (x == null) this.removeAttribute(name);
      else this.setAttribute(name, x);
    }
    function attrFunctionNS() {
      var x = value.apply(this, arguments);
      if (x == null) this.removeAttributeNS(name.space, name.local);
      else this.setAttributeNS(name.space, name.local, x);
    }

    return value == null
        ? (name.local ? attrNullNS : attrNull) : (typeof value === "function"
        ? (name.local ? attrFunctionNS : attrFunction)
        : (name.local ? attrConstantNS : attrConstant));
  }
  function d3_collapse(s) {
    return s.trim().replace(/\s+/g, " ");
  }
  d3.requote = function(s) {
    return s.replace(d3_requote_re, "\\$&");
  };

  var d3_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

  d3_selectionPrototype.classed = function(name, value) {
    if (arguments.length < 2) {

      // For classed(string), return true only if the first node has the specified
      // class or classes. Note that even if the browser supports DOMTokenList, it
      // probably doesn't support it on SVG elements (which can be animated).
      if (typeof name === "string") {
        var node = this.node(),
            n = (name = d3_selection_classes(name)).length,
            i = -1;
        if (value = node.classList) {
          while (++i < n) if (!value.contains(name[i])) return false;
        } else {
          value = node.getAttribute("class");
          while (++i < n) if (!d3_selection_classedRe(name[i]).test(value)) return false;
        }
        return true;
      }

      // For classed(object), the object specifies the names of classes to add or
      // remove. The values may be functions that are evaluated for each element.
      for (value in name) this.each(d3_selection_classed(value, name[value]));
      return this;
    }

    // Otherwise, both a name and a value are specified, and are handled as below.
    return this.each(d3_selection_classed(name, value));
  };

  function d3_selection_classedRe(name) {
    return new RegExp("(?:^|\\s+)" + d3.requote(name) + "(?:\\s+|$)", "g");
  }

  function d3_selection_classes(name) {
    return name.trim().split(/^|\s+/);
  }

  // Multiple class names are allowed (e.g., "foo bar").
  function d3_selection_classed(name, value) {
    name = d3_selection_classes(name).map(d3_selection_classedName);
    var n = name.length;

    function classedConstant() {
      var i = -1;
      while (++i < n) name[i](this, value);
    }

    // When the value is a function, the function is still evaluated only once per
    // element even if there are multiple class names.
    function classedFunction() {
      var i = -1, x = value.apply(this, arguments);
      while (++i < n) name[i](this, x);
    }

    return typeof value === "function"
        ? classedFunction
        : classedConstant;
  }

  function d3_selection_classedName(name) {
    var re = d3_selection_classedRe(name);
    return function(node, value) {
      if (c = node.classList) return value ? c.add(name) : c.remove(name);
      var c = node.getAttribute("class") || "";
      if (value) {
        re.lastIndex = 0;
        if (!re.test(c)) node.setAttribute("class", d3_collapse(c + " " + name));
      } else {
        node.setAttribute("class", d3_collapse(c.replace(re, " ")));
      }
    };
  }

  d3_selectionPrototype.style = function(name, value, priority) {
    var n = arguments.length;
    if (n < 3) {

      // For style(object) or style(object, string), the object specifies the
      // names and values of the attributes to set or remove. The values may be
      // functions that are evaluated for each element. The optional string
      // specifies the priority.
      if (typeof name !== "string") {
        if (n < 2) value = "";
        for (priority in name) this.each(d3_selection_style(priority, name[priority], value));
        return this;
      }

      // For style(string), return the computed style value for the first node.
      if (n < 2) return d3_window.getComputedStyle(this.node(), null).getPropertyValue(name);

      // For style(string, string) or style(string, function), use the default
      // priority. The priority is ignored for style(string, null).
      priority = "";
    }

    // Otherwise, a name, value and priority are specified, and handled as below.
    return this.each(d3_selection_style(name, value, priority));
  };

  function d3_selection_style(name, value, priority) {

    // For style(name, null) or style(name, null, priority), remove the style
    // property with the specified name. The priority is ignored.
    function styleNull() {
      this.style.removeProperty(name);
    }

    // For style(name, string) or style(name, string, priority), set the style
    // property with the specified name, using the specified priority.
    function styleConstant() {
      this.style.setProperty(name, value, priority);
    }

    // For style(name, function) or style(name, function, priority), evaluate the
    // function for each element, and set or remove the style property as
    // appropriate. When setting, use the specified priority.
    function styleFunction() {
      var x = value.apply(this, arguments);
      if (x == null) this.style.removeProperty(name);
      else this.style.setProperty(name, x, priority);
    }

    return value == null
        ? styleNull : (typeof value === "function"
        ? styleFunction : styleConstant);
  }

  d3_selectionPrototype.property = function(name, value) {
    if (arguments.length < 2) {

      // For property(string), return the property value for the first node.
      if (typeof name === "string") return this.node()[name];

      // For property(object), the object specifies the names and values of the
      // properties to set or remove. The values may be functions that are
      // evaluated for each element.
      for (value in name) this.each(d3_selection_property(value, name[value]));
      return this;
    }

    // Otherwise, both a name and a value are specified, and are handled as below.
    return this.each(d3_selection_property(name, value));
  };

  function d3_selection_property(name, value) {

    // For property(name, null), remove the property with the specified name.
    function propertyNull() {
      delete this[name];
    }

    // For property(name, string), set the property with the specified name.
    function propertyConstant() {
      this[name] = value;
    }

    // For property(name, function), evaluate the function for each element, and
    // set or remove the property as appropriate.
    function propertyFunction() {
      var x = value.apply(this, arguments);
      if (x == null) delete this[name];
      else this[name] = x;
    }

    return value == null
        ? propertyNull : (typeof value === "function"
        ? propertyFunction : propertyConstant);
  }

  d3_selectionPrototype.text = function(value) {
    return arguments.length
        ? this.each(typeof value === "function"
        ? function() { var v = value.apply(this, arguments); this.textContent = v == null ? "" : v; } : value == null
        ? function() { this.textContent = ""; }
        : function() { this.textContent = value; })
        : this.node().textContent;
  };

  d3_selectionPrototype.html = function(value) {
    return arguments.length
        ? this.each(typeof value === "function"
        ? function() { var v = value.apply(this, arguments); this.innerHTML = v == null ? "" : v; } : value == null
        ? function() { this.innerHTML = ""; }
        : function() { this.innerHTML = value; })
        : this.node().innerHTML;
  };

  d3_selectionPrototype.append = function(name) {
    name = d3_selection_creator(name);
    return this.select(function() {
      return this.appendChild(name.apply(this, arguments));
    });
  };

  function d3_selection_creator(name) {
    return typeof name === "function" ? name
        : (name = d3.ns.qualify(name)).local ? function() { return this.ownerDocument.createElementNS(name.space, name.local); }
        : function() { return this.ownerDocument.createElementNS(this.namespaceURI, name); };
  }

  d3_selectionPrototype.insert = function(name, before) {
    name = d3_selection_creator(name);
    before = d3_selection_selector(before);
    return this.select(function() {
      return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null);
    });
  };

  // TODO remove(selector)?
  // TODO remove(node)?
  // TODO remove(function)?
  d3_selectionPrototype.remove = function() {
    return this.each(function() {
      var parent = this.parentNode;
      if (parent) parent.removeChild(this);
    });
  };
  function d3_class(ctor, properties) {
    try {
      for (var key in properties) {
        Object.defineProperty(ctor.prototype, key, {
          value: properties[key],
          enumerable: false
        });
      }
    } catch (e) {
      ctor.prototype = properties;
    }
  }

  d3.map = function(object) {
    var map = new d3_Map;
    if (object instanceof d3_Map) object.forEach(function(key, value) { map.set(key, value); });
    else for (var key in object) map.set(key, object[key]);
    return map;
  };

  function d3_Map() {}

  d3_class(d3_Map, {
    has: d3_map_has,
    get: function(key) {
      return this[d3_map_prefix + key];
    },
    set: function(key, value) {
      return this[d3_map_prefix + key] = value;
    },
    remove: d3_map_remove,
    keys: d3_map_keys,
    values: function() {
      var values = [];
      this.forEach(function(key, value) { values.push(value); });
      return values;
    },
    entries: function() {
      var entries = [];
      this.forEach(function(key, value) { entries.push({key: key, value: value}); });
      return entries;
    },
    size: d3_map_size,
    empty: d3_map_empty,
    forEach: function(f) {
      for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) f.call(this, key.substring(1), this[key]);
    }
  });

  var d3_map_prefix = "\0", // prevent collision with built-ins
      d3_map_prefixCode = d3_map_prefix.charCodeAt(0);

  function d3_map_has(key) {
    return d3_map_prefix + key in this;
  }

  function d3_map_remove(key) {
    key = d3_map_prefix + key;
    return key in this && delete this[key];
  }

  function d3_map_keys() {
    var keys = [];
    this.forEach(function(key) { keys.push(key); });
    return keys;
  }

  function d3_map_size() {
    var size = 0;
    for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) ++size;
    return size;
  }

  function d3_map_empty() {
    for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) return false;
    return true;
  }

  d3_selectionPrototype.data = function(value, key) {
    var i = -1,
        n = this.length,
        group,
        node;

    // If no value is specified, return the first value.
    if (!arguments.length) {
      value = new Array(n = (group = this[0]).length);
      while (++i < n) {
        if (node = group[i]) {
          value[i] = node.__data__;
        }
      }
      return value;
    }

    function bind(group, groupData) {
      var i,
          n = group.length,
          m = groupData.length,
          n0 = Math.min(n, m),
          updateNodes = new Array(m),
          enterNodes = new Array(m),
          exitNodes = new Array(n),
          node,
          nodeData;

      if (key) {
        var nodeByKeyValue = new d3_Map,
            dataByKeyValue = new d3_Map,
            keyValues = [],
            keyValue;

        for (i = -1; ++i < n;) {
          keyValue = key.call(node = group[i], node.__data__, i);
          if (nodeByKeyValue.has(keyValue)) {
            exitNodes[i] = node; // duplicate selection key
          } else {
            nodeByKeyValue.set(keyValue, node);
          }
          keyValues.push(keyValue);
        }

        for (i = -1; ++i < m;) {
          keyValue = key.call(groupData, nodeData = groupData[i], i);
          if (node = nodeByKeyValue.get(keyValue)) {
            updateNodes[i] = node;
            node.__data__ = nodeData;
          } else if (!dataByKeyValue.has(keyValue)) { // no duplicate data key
            enterNodes[i] = d3_selection_dataNode(nodeData);
          }
          dataByKeyValue.set(keyValue, nodeData);
          nodeByKeyValue.remove(keyValue);
        }

        for (i = -1; ++i < n;) {
          if (nodeByKeyValue.has(keyValues[i])) {
            exitNodes[i] = group[i];
          }
        }
      } else {
        for (i = -1; ++i < n0;) {
          node = group[i];
          nodeData = groupData[i];
          if (node) {
            node.__data__ = nodeData;
            updateNodes[i] = node;
          } else {
            enterNodes[i] = d3_selection_dataNode(nodeData);
          }
        }
        for (; i < m; ++i) {
          enterNodes[i] = d3_selection_dataNode(groupData[i]);
        }
        for (; i < n; ++i) {
          exitNodes[i] = group[i];
        }
      }

      enterNodes.update
          = updateNodes;

      enterNodes.parentNode
          = updateNodes.parentNode
          = exitNodes.parentNode
          = group.parentNode;

      enter.push(enterNodes);
      update.push(updateNodes);
      exit.push(exitNodes);
    }

    var enter = d3_selection_enter([]),
        update = d3_selection([]),
        exit = d3_selection([]);

    if (typeof value === "function") {
      while (++i < n) {
        bind(group = this[i], value.call(group, group.parentNode.__data__, i));
      }
    } else {
      while (++i < n) {
        bind(group = this[i], value);
      }
    }

    update.enter = function() { return enter; };
    update.exit = function() { return exit; };
    return update;
  };

  function d3_selection_dataNode(data) {
    return {__data__: data};
  }

  d3_selectionPrototype.datum = function(value) {
    return arguments.length
        ? this.property("__data__", value)
        : this.property("__data__");
  };

  d3_selectionPrototype.filter = function(filter) {
    var subgroups = [],
        subgroup,
        group,
        node;

    if (typeof filter !== "function") filter = d3_selection_filter(filter);

    for (var j = 0, m = this.length; j < m; j++) {
      subgroups.push(subgroup = []);
      subgroup.parentNode = (group = this[j]).parentNode;
      for (var i = 0, n = group.length; i < n; i++) {
        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
          subgroup.push(node);
        }
      }
    }

    return d3_selection(subgroups);
  };

  function d3_selection_filter(selector) {
    return function() {
      return d3_selectMatches(this, selector);
    };
  }

  d3_selectionPrototype.order = function() {
    for (var j = -1, m = this.length; ++j < m;) {
      for (var group = this[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
        if (node = group[i]) {
          if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }
    return this;
  };
  d3.ascending = function(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  };

  d3_selectionPrototype.sort = function(comparator) {
    comparator = d3_selection_sortComparator.apply(this, arguments);
    for (var j = -1, m = this.length; ++j < m;) this[j].sort(comparator);
    return this.order();
  };

  function d3_selection_sortComparator(comparator) {
    if (!arguments.length) comparator = d3.ascending;
    return function(a, b) {
      return a && b ? comparator(a.__data__, b.__data__) : !a - !b;
    };
  }
  function d3_noop() {}

  d3.dispatch = function() {
    var dispatch = new d3_dispatch,
        i = -1,
        n = arguments.length;
    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
    return dispatch;
  };

  function d3_dispatch() {}

  d3_dispatch.prototype.on = function(type, listener) {
    var i = type.indexOf("."),
        name = "";

    // Extract optional namespace, e.g., "click.foo"
    if (i >= 0) {
      name = type.substring(i + 1);
      type = type.substring(0, i);
    }

    if (type) return arguments.length < 2
        ? this[type].on(name)
        : this[type].on(name, listener);

    if (arguments.length === 2) {
      if (listener == null) for (type in this) {
        if (this.hasOwnProperty(type)) this[type].on(name, null);
      }
      return this;
    }
  };

  function d3_dispatch_event(dispatch) {
    var listeners = [],
        listenerByName = new d3_Map;

    function event() {
      var z = listeners, // defensive reference
          i = -1,
          n = z.length,
          l;
      while (++i < n) if (l = z[i].on) l.apply(this, arguments);
      return dispatch;
    }

    event.on = function(name, listener) {
      var l = listenerByName.get(name),
          i;

      // return the current listener, if any
      if (arguments.length < 2) return l && l.on;

      // remove the old listener, if any (with copy-on-write)
      if (l) {
        l.on = null;
        listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
        listenerByName.remove(name);
      }

      // add the new listener, if any
      if (listener) listeners.push(listenerByName.set(name, {on: listener}));

      return dispatch;
    };

    return event;
  }

  d3.event = null;

  function d3_eventPreventDefault() {
    d3.event.preventDefault();
  }

  function d3_eventSource() {
    var e = d3.event, s;
    while (s = e.sourceEvent) e = s;
    return e;
  }

  // Like d3.dispatch, but for custom events abstracting native UI events. These
  // events have a target component (such as a brush), a target element (such as
  // the svg:g element containing the brush) and the standard arguments `d` (the
  // target element's data) and `i` (the selection index of the target element).
  function d3_eventDispatch(target) {
    var dispatch = new d3_dispatch,
        i = 0,
        n = arguments.length;

    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);

    // Creates a dispatch context for the specified `thiz` (typically, the target
    // DOM element that received the source event) and `argumentz` (typically, the
    // data `d` and index `i` of the target element). The returned function can be
    // used to dispatch an event to any registered listeners; the function takes a
    // single argument as input, being the event to dispatch. The event must have
    // a "type" attribute which corresponds to a type registered in the
    // constructor. This context will automatically populate the "sourceEvent" and
    // "target" attributes of the event, as well as setting the `d3.event` global
    // for the duration of the notification.
    dispatch.of = function(thiz, argumentz) {
      return function(e1) {
        try {
          var e0 =
          e1.sourceEvent = d3.event;
          e1.target = target;
          d3.event = e1;
          dispatch[e1.type].apply(thiz, argumentz);
        } finally {
          d3.event = e0;
        }
      };
    };

    return dispatch;
  }

  d3_selectionPrototype.on = function(type, listener, capture) {
    var n = arguments.length;
    if (n < 3) {

      // For on(object) or on(object, boolean), the object specifies the event
      // types and listeners to add or remove. The optional boolean specifies
      // whether the listener captures events.
      if (typeof type !== "string") {
        if (n < 2) listener = false;
        for (capture in type) this.each(d3_selection_on(capture, type[capture], listener));
        return this;
      }

      // For on(string), return the listener for the first node.
      if (n < 2) return (n = this.node()["__on" + type]) && n._;

      // For on(string, function), use the default capture.
      capture = false;
    }

    // Otherwise, a type, listener and capture are specified, and handled as below.
    return this.each(d3_selection_on(type, listener, capture));
  };

  function d3_selection_on(type, listener, capture) {
    var name = "__on" + type,
        i = type.indexOf("."),
        wrap = d3_selection_onListener;

    if (i > 0) type = type.substring(0, i);
    var filter = d3_selection_onFilters.get(type);
    if (filter) type = filter, wrap = d3_selection_onFilter;

    function onRemove() {
      var l = this[name];
      if (l) {
        this.removeEventListener(type, l, l.$);
        delete this[name];
      }
    }

    function onAdd() {
      var l = wrap(listener, d3_array(arguments));
      onRemove.call(this);
      this.addEventListener(type, this[name] = l, l.$ = capture);
      l._ = listener;
    }

    function removeAll() {
      var re = new RegExp("^__on([^.]+)" + d3.requote(type) + "$"),
          match;
      for (var name in this) {
        if (match = name.match(re)) {
          var l = this[name];
          this.removeEventListener(match[1], l, l.$);
          delete this[name];
        }
      }
    }

    return i
        ? listener ? onAdd : onRemove
        : listener ? d3_noop : removeAll;
  }

  var d3_selection_onFilters = d3.map({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  });

  d3_selection_onFilters.forEach(function(k) {
    if ("on" + k in d3_document) d3_selection_onFilters.remove(k);
  });

  function d3_selection_onListener(listener, argumentz) {
    return function(e) {
      var o = d3.event; // Events can be reentrant (e.g., focus).
      d3.event = e;
      argumentz[0] = this.__data__;
      try {
        listener.apply(this, argumentz);
      } finally {
        d3.event = o;
      }
    };
  }

  function d3_selection_onFilter(listener, argumentz) {
    var l = d3_selection_onListener(listener, argumentz);
    return function(e) {
      var target = this, related = e.relatedTarget;
      if (!related || (related !== target && !(related.compareDocumentPosition(target) & 8))) {
        l.call(target, e);
      }
    };
  }

  d3_selectionPrototype.each = function(callback) {
    return d3_selection_each(this, function(node, i, j) {
      callback.call(node, node.__data__, i, j);
    });
  };

  function d3_selection_each(groups, callback) {
    for (var j = 0, m = groups.length; j < m; j++) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; i++) {
        if (node = group[i]) callback(node, i, j);
      }
    }
    return groups;
  }

  d3_selectionPrototype.call = function(callback) {
    var args = d3_array(arguments);
    callback.apply(args[0] = this, args);
    return this;
  };

  d3_selectionPrototype.empty = function() {
    return !this.node();
  };

  d3_selectionPrototype.node = function() {
    for (var j = 0, m = this.length; j < m; j++) {
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
        var node = group[i];
        if (node) return node;
      }
    }
    return null;
  };

  d3_selectionPrototype.size = function() {
    var n = 0;
    this.each(function() { ++n; });
    return n;
  };

  function d3_selection_enter(selection) {
    d3_subclass(selection, d3_selection_enterPrototype);
    return selection;
  }

  var d3_selection_enterPrototype = [];

  d3.selection.enter = d3_selection_enter;
  d3.selection.enter.prototype = d3_selection_enterPrototype;

  d3_selection_enterPrototype.append = d3_selectionPrototype.append;
  d3_selection_enterPrototype.empty = d3_selectionPrototype.empty;
  d3_selection_enterPrototype.node = d3_selectionPrototype.node;
  d3_selection_enterPrototype.call = d3_selectionPrototype.call;
  d3_selection_enterPrototype.size = d3_selectionPrototype.size;


  d3_selection_enterPrototype.select = function(selector) {
    var subgroups = [],
        subgroup,
        subnode,
        upgroup,
        group,
        node;

    for (var j = -1, m = this.length; ++j < m;) {
      upgroup = (group = this[j]).update;
      subgroups.push(subgroup = []);
      subgroup.parentNode = group.parentNode;
      for (var i = -1, n = group.length; ++i < n;) {
        if (node = group[i]) {
          subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode, node.__data__, i, j));
          subnode.__data__ = node.__data__;
        } else {
          subgroup.push(null);
        }
      }
    }

    return d3_selection(subgroups);
  };

  d3_selection_enterPrototype.insert = function(name, before) {
    if (arguments.length < 2) before = d3_selection_enterInsertBefore(this);
    return d3_selectionPrototype.insert.call(this, name, before);
  };

  function d3_selection_enterInsertBefore(enter) {
    var i0, j0;
    return function(d, i, j) {
      var group = enter[j].update,
          n = group.length,
          node;
      if (j != j0) j0 = j, i0 = 0;
      if (i >= i0) i0 = i + 1;
      while (!(node = group[i0]) && ++i0 < n);
      return node;
    };
  }

  // import "../transition/transition";

  d3_selectionPrototype.transition = function() {
    var id = d3_transitionInheritId || ++d3_transitionId,
        subgroups = [],
        subgroup,
        node,
        transition = d3_transitionInherit || {time: Date.now(), ease: d3_ease_cubicInOut, delay: 0, duration: 250};

    for (var j = -1, m = this.length; ++j < m;) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = -1, n = group.length; ++i < n;) {
        if (node = group[i]) d3_transitionNode(node, i, id, transition);
        subgroup.push(node);
      }
    }

    return d3_transition(subgroups, id);
  };
  // import "../transition/transition";

  d3_selectionPrototype.interrupt = function() {
    return this.each(d3_selection_interrupt);
  };

  function d3_selection_interrupt() {
    var lock = this.__transition__;
    if (lock) ++lock.active;
  }

  // TODO fast singleton implementation?
  d3.select = function(node) {
    var group = [typeof node === "string" ? d3_select(node, d3_document) : node];
    group.parentNode = d3_documentElement;
    return d3_selection([group]);
  };

  d3.selectAll = function(nodes) {
    var group = d3_array(typeof nodes === "string" ? d3_selectAll(nodes, d3_document) : nodes);
    group.parentNode = d3_documentElement;
    return d3_selection([group]);
  };

  var d3_selectionRoot = d3.select(d3_documentElement);
    if (typeof define === "function" && define.amd) {
      define(d3);
    } else if (typeof module === "object" && module.exports) {
      module.exports = d3;
    } else {
      this.d3 = d3;
    }
  }();

  },{}],3:[function(require,module,exports){
  function xhr(url, callback, cors) {
      var sent = false;

      if (typeof window.XMLHttpRequest === 'undefined') {
          return callback(Error('Browser not supported'));
      }

      if (typeof cors === 'undefined') {
          var m = url.match(/^\s*https?:\/\/[^\/]*/);
          cors = m && (m[0] !== location.protocol + '//' + location.domain +
                  (location.port ? ':' + location.port : ''));
      }

      var x;

      function isSuccessful(status) {
          return status >= 200 && status < 300 || status === 304;
      }

      if (cors && (
          // IE7-9 Quirks & Compatibility
          typeof window.XDomainRequest === 'object' ||
          // IE9 Standards mode
          typeof window.XDomainRequest === 'function'
      )) {
          // IE8-10
          x = new window.XDomainRequest();

          // Ensure callback is never called synchronously, i.e., before
          // x.send() returns (this has been observed in the wild).
          // See https://github.com/mapbox/mapbox.js/issues/472
          var original = callback;
          callback = function() {
              if (sent) {
                  original.apply(this, arguments);
              } else {
                  var that = this, args = arguments;
                  setTimeout(function() {
                      original.apply(that, args);
                  }, 0);
              }
          }
      } else {
          x = new window.XMLHttpRequest();
      }

      function loaded() {
          if (
              // XDomainRequest
              x.status === undefined ||
              // modern browsers
              isSuccessful(x.status)) callback.call(x, null, x);
          else callback.call(x, x, null);
      }

      // Both `onreadystatechange` and `onload` can fire. `onreadystatechange`
      // has [been supported for longer](http://stackoverflow.com/a/9181508/229001).
      if ('onload' in x) {
          x.onload = loaded;
      } else {
          x.onreadystatechange = function readystate() {
              if (x.readyState === 4) {
                  loaded();
              }
          };
      }

      // Call the callback with the XMLHttpRequest object as an error and prevent
      // it from ever being called again by reassigning it to `noop`
      x.onerror = function error(evt) {
          // XDomainRequest provides no evt parameter
          callback.call(this, evt || true, null);
          callback = function() { };
      };

      // IE9 must have onprogress be set to a unique function.
      x.onprogress = function() { };

      x.ontimeout = function(evt) {
          callback.call(this, evt, null);
          callback = function() { };
      };

      x.onabort = function(evt) {
          callback.call(this, evt, null);
          callback = function() { };
      };

      // GET is the only supported HTTP Verb by XDomainRequest and is the
      // only one supported here.
      x.open('GET', url, true);

      // Send the request. Sending data is not supported.
      x.send(null);
      sent = true;

      return x;
  }

  if (typeof module !== 'undefined') module.exports = xhr;

  },{}],4:[function(require,module,exports){
  /**
   * Debounces a function by the given threshold.
   *
   * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
   * @param {Function} function to wrap
   * @param {Number} timeout in ms (`100`)
   * @param {Boolean} whether to execute at the beginning (`false`)
   * @api public
   */

  module.exports = function debounce(func, threshold, execAsap){
    var timeout;

    return function debounced(){
      var obj = this, args = arguments;

      function delayed () {
        if (!execAsap) {
          func.apply(obj, args);
        }
        timeout = null;
      }

      if (timeout) {
        clearTimeout(timeout);
      } else if (execAsap) {
        func.apply(obj, args);
      }

      timeout = setTimeout(delayed, threshold || 100);
    };
  };

  },{}],5:[function(require,module,exports){
  var polyline = {};

  // Based off of [the offical Google document](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
  //
  // Some parts from [this implementation](http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/PolylineEncoder.js)
  // by [Mark McClure](http://facstaff.unca.edu/mcmcclur/)

  function encode(coordinate, factor) {
      coordinate = Math.round(coordinate * factor);
      coordinate <<= 1;
      if (coordinate < 0) {
          coordinate = ~coordinate;
      }
      var output = '';
      while (coordinate >= 0x20) {
          output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
          coordinate >>= 5;
      }
      output += String.fromCharCode(coordinate + 63);
      return output;
  }

  // This is adapted from the implementation in Project-OSRM
  // https://github.com/DennisOSRM/Project-OSRM-Web/blob/master/WebContent/routing/OSRM.RoutingGeometry.js
  polyline.decode = function(str, precision) {
      var index = 0,
          lat = 0,
          lng = 0,
          coordinates = [],
          shift = 0,
          result = 0,
          byte = null,
          latitude_change,
          longitude_change,
          factor = Math.pow(10, precision || 5);

      // Coordinates have variable length when encoded, so just keep
      // track of whether we've hit the end of the string. In each
      // loop iteration, a single coordinate is decoded.
      while (index < str.length) {

          // Reset shift, result, and byte
          byte = null;
          shift = 0;
          result = 0;

          do {
              byte = str.charCodeAt(index++) - 63;
              result |= (byte & 0x1f) << shift;
              shift += 5;
          } while (byte >= 0x20);

          latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

          shift = result = 0;

          do {
              byte = str.charCodeAt(index++) - 63;
              result |= (byte & 0x1f) << shift;
              shift += 5;
          } while (byte >= 0x20);

          longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

          lat += latitude_change;
          lng += longitude_change;

          coordinates.push([lat / factor, lng / factor]);
      }

      return coordinates;
  };

  polyline.encode = function(coordinates, precision) {
      if (!coordinates.length) return '';

      var factor = Math.pow(10, precision || 5),
          output = encode(coordinates[0][0], factor) + encode(coordinates[0][1], factor);

      for (var i = 1; i < coordinates.length; i++) {
          var a = coordinates[i], b = coordinates[i - 1];
          output += encode(a[0] - b[0], factor);
          output += encode(a[1] - b[1], factor);
      }

      return output;
  };

  if (typeof module !== undefined) module.exports = polyline;

  },{}],6:[function(require,module,exports){
  'use strict';

  var corslite = require('corslite'),
      polyline = require('polyline');

  var Directions = L.Class.extend({
      includes: [L.Mixin.Events],

      statics: {
          URL_TEMPLATE: 'https://api.tiles.mapbox.com/v4/directions/{profile}/{waypoints}.json?instructions=html&geometry=polyline&access_token={token}'
      },

      initialize: function(options) {
          L.setOptions(this, options);
          this._waypoints = [];
      },

      getOrigin: function () {
          return this.origin;
      },

      getDestination: function () {
          return this.destination;
      },

      setOrigin: function (origin) {
          origin = this._normalizeWaypoint(origin);

          this.origin = origin;
          this.fire('origin', {origin: origin});

          if (!origin) {
              this._unload();
          }

          return this;
      },

      setDestination: function (destination) {
          destination = this._normalizeWaypoint(destination);

          this.destination = destination;
          this.fire('destination', {destination: destination});

          if (!destination) {
              this._unload();
          }

          return this;
      },

      getProfile: function() {
          return this.profile || this.options.profile || 'mapbox.driving';
      },

      setProfile: function (profile) {
          this.profile = profile;
          this.fire('profile', {profile: profile});
          return this;
      },

      getWaypoints: function() {
          return this._waypoints;
      },

      setWaypoints: function (waypoints) {
          this._waypoints = waypoints.map(this._normalizeWaypoint);
          return this;
      },

      addWaypoint: function (index, waypoint) {
          this._waypoints.splice(index, 0, this._normalizeWaypoint(waypoint));
          return this;
      },

      removeWaypoint: function (index) {
          this._waypoints.splice(index, 1);
          return this;
      },

      setWaypoint: function (index, waypoint) {
          this._waypoints[index] = this._normalizeWaypoint(waypoint);
          return this;
      },

      reverse: function () {
          var o = this.origin,
              d = this.destination;

          this.origin = d;
          this.destination = o;
            // No need for reverse, we do that in scripts-routes.js 
            // this._waypoints.reverse();

          this.fire('origin', {origin: this.origin})
              .fire('destination', {destination: this.destination});

          return this;
      },

      selectRoute: function (route) {
          this.fire('selectRoute', {route: route});
      },

      highlightRoute: function (route) {
          this.fire('highlightRoute', {route: route});
      },

      highlightStep: function (step) {
          this.fire('highlightStep', {step: step});
      },

      queryURL: function () {
          var template = Directions.URL_TEMPLATE,
              token = this.options.accessToken || L.mapbox.accessToken,
              profile = this.getProfile(),
              points = [this.origin].concat(this._waypoints).concat([this.destination]);
          return L.Util.template(template, {
              token: token,
              profile: profile,
              waypoints: points.map(function (point) {
                  return point.properties.query || point.geometry.coordinates;
              }).join(';')
          });
      },

      queryable: function () {
          return this.getOrigin() && this.getDestination();
      },

      query: function () {
          if (!this.queryable()) return this;

          if (this._query) {
              this._query.abort();
          }

          this._query = corslite(this.queryURL(), L.bind(function (err, resp) {
              this._query = null;

              if (err && err.type === 'abort') {
                  return;
              }

              resp = resp || err;

              if (resp && resp.responseText) {
                  try {
                      resp = JSON.parse(resp.responseText);
                  } catch (e) {
                      resp = {error: resp.responseText};
                  }
              }

              if (err || resp.error) {
                  return this.fire('error', resp);
              }

              this.directions = resp;
              this.directions.routes.forEach(function (route) {
                  route.geometry = {
                      type: "LineString",
                      coordinates: polyline.decode(route.geometry, 6).map(function (c) { return c.reverse(); })
                  };
              });

              this.origin = this.directions.origin;
              this.destination = this.directions.destination;

              this.fire('load', this.directions);
          }, this));

          return this;
      },

      _unload: function () {
          this._waypoints = [];
          delete this.directions;
          this.fire('unload');
      },

      _normalizeWaypoint: function (waypoint) {
          if (!waypoint || waypoint.type === 'Feature') {
              return waypoint;
          }

          var coordinates,
              properties = {};

          if (waypoint instanceof L.LatLng) {
              waypoint = waypoint.wrap();
              coordinates = properties.query = [waypoint.lng, waypoint.lat];
          } else if (typeof waypoint === 'string') {
              properties.query = waypoint;
          }

          return {
              type: 'Feature',
              geometry: {
                  type: 'Point',
                  coordinates: coordinates
              },
              properties: properties
          };
      }
  });

  module.exports = function(options) {
      return new Directions(options);
  };

  },{"corslite":3,"polyline":5}],7:[function(require,module,exports){
  'use strict';

  var d3 = require('../lib/d3'),
      format = require('./format');

  module.exports = function (container, directions) {
      var control = {}, map;

      control.addTo = function (_) {
          map = _;
          return control;
      };

      container = d3.select(L.DomUtil.get(container))
          .classed('mapbox-directions-errors', true);

      directions.on('load unload', function () {
          container
              .classed('mapbox-error-active', false)
              .html('');
      });

      directions.on('error', function (e) {
          container
              .classed('mapbox-error-active', true)
              .html('')
              .append('span')
              .attr('class', 'mapbox-directions-error')
              .text(e.error);

          container
              .insert('span', 'span')
              .attr('class', 'mapbox-directions-icon mapbox-error-icon');
      });

      return control;
  };

  },{"../lib/d3":2,"./format":8}],8:[function(require,module,exports){
  'use strict';

  module.exports = {
      duration: function (s) {
          var m = Math.floor(s / 60),
              h = Math.floor(m / 60);
          s %= 60;
          m %= 60;
          if (h === 0 && m === 0) return s + ' s';
          if (h === 0) return m + ' min';
          return h + ' h ' + m + ' min';
      },

      imperial: function (m) {
          var mi = m / 1609.344;
          if (mi >= 100) return mi.toFixed(0) + ' mi';
          if (mi >= 10)  return mi.toFixed(1) + ' mi';
          if (mi >= 0.1) return mi.toFixed(2) + ' mi';
          return (mi * 5280).toFixed(0) + ' ft';
      },

      metric: function (m) {
          if (m >= 100000) return (m / 1000).toFixed(0) + ' km';
          if (m >= 10000)  return (m / 1000).toFixed(1) + ' km';
          if (m >= 100)    return (m / 1000).toFixed(2) + ' km';
          return m.toFixed(0) + ' m';
      }
  };

  },{}],9:[function(require,module,exports){
  'use strict';

  var d3 = require('../lib/d3');

  module.exports = function (container, directions) {
      var control = {}, map;

      control.addTo = function (_) {
          map = _;
          return control;
      };

      container = d3.select(L.DomUtil.get(container))
          .classed('mapbox-directions-inputs', true);

      var form = container.append('form')
          .on('keypress', function () {
              if (d3.event.keyCode === 13) {
                  d3.event.preventDefault();

                  directions
                      .setOrigin(originInput.property('value'))
                      .setDestination(destinationInput.property('value'));

                  if (directions.queryable())
                      directions.query();
              }
          });

      var origin = form.append('div')
          .attr('class', 'mapbox-directions-origin');

      origin.append('label')
          .attr('class', 'mapbox-form-label')
          .on('click', function () {
              if (directions.getOrigin() instanceof L.LatLng) {
                  map.panTo(directions.getOrigin());
              }
          })
          .append('span')
          .attr('class', 'mapbox-directions-icon mapbox-depart-icon');

      var originInput = origin.append('input')
          .attr('type', 'text')
          .attr('required', 'required')
          .attr('id', 'mapbox-directions-origin-input')
          .attr('placeholder', 'Start');

      origin.append('div')
          .attr('class', 'mapbox-directions-icon mapbox-close-icon')
          .attr('title', 'Clear value')
          .on('click', function () {
              directions.setOrigin(undefined);
          });

      form.append('span')
          .attr('class', 'mapbox-directions-icon mapbox-reverse-icon mapbox-directions-reverse-input')
          .attr('title', 'Reverse origin & destination')
          .on('click', function () {
              directions.reverse().query();
          });

      var destination = form.append('div')
          .attr('class', 'mapbox-directions-destination');

      destination.append('label')
          .attr('class', 'mapbox-form-label')
          .on('click', function () {
              if (directions.getDestination() instanceof L.LatLng) {
                  map.panTo(directions.getDestination());
              }
          })
          .append('span')
          .attr('class', 'mapbox-directions-icon mapbox-arrive-icon');

      var destinationInput = destination.append('input')
          .attr('type', 'text')
          .attr('required', 'required')
          .attr('id', 'mapbox-directions-destination-input')
          .attr('placeholder', 'End');

      destination.append('div')
          .attr('class', 'mapbox-directions-icon mapbox-close-icon')
          .attr('title', 'Clear value')
          .on('click', function () {
              directions.setDestination(undefined);
          });

      /*  var profile = form.append('div')
          .attr('class', 'mapbox-directions-profile');

      var profiles = profile.selectAll('span')
          .data([['mapbox.driving', 'driving', 'Driving'], ['mapbox.walking', 'walking', 'Walking']])
          .enter()
          .append('span');

      profiles.append('input')
          .attr('type', 'radio')
          .attr('name', 'profile')
          .attr('id', function (d) { return 'mapbox-directions-profile-' + d[1]; })
          .property('checked', function (d, i) { return i === 0; })
          .on('change', function (d) {
              directions.setProfile(d[0]).query();
          });

      profiles.append('label')
          .attr('for', function (d) { return 'mapbox-directions-profile-' + d[1]; })
          .text(function (d) { return d[2]; }); */

      function format(waypoint) {
          if (!waypoint) {
              return '';
          } else if (waypoint.properties.name) {
              return waypoint.properties.name;
          } else if (waypoint.geometry.coordinates) {
              var precision = Math.max(0, Math.ceil(Math.log(map.getZoom()) / Math.LN2));
              return waypoint.geometry.coordinates[0].toFixed(precision) + ', ' +
                     waypoint.geometry.coordinates[1].toFixed(precision);
          } else {
              return waypoint.properties.query || '';
          }
      }

      directions
          .on('origin', function (e) {
              originInput.property('value', format(e.origin));
          })
          .on('destination', function (e) {
              destinationInput.property('value', format(e.destination));
          })
          .on('profile', function (e) {
              profiles.selectAll('input')
                  .property('checked', function (d) { return d[0] === e.profile; });
          })
          .on('load', function (e) {
              originInput.property('value', format(e.origin));
              destinationInput.property('value', format(e.destination));
          });

      return control;
  };

  },{"../lib/d3":2}],10:[function(require,module,exports){
  'use strict';

  var d3 = require('../lib/d3'),
      format = require('./format');

  module.exports = function (container, directions) {
      var control = {}, map;

      control.addTo = function (_) {
          map = _;
          return control;
      };

      container = d3.select(L.DomUtil.get(container))
          .classed('mapbox-directions-instructions', true);

      directions.on('error', function () {
          container.html('');
      });

      directions.on('selectRoute', function (e) {
          var route = e.route;

          container.html('');

          var steps = container.append('ol')
              .attr('class', 'mapbox-directions-steps')
              .selectAll('li')
              .data(route.steps)
              .enter().append('li')
              .attr('class', 'mapbox-directions-step');

          steps.append('span')
              .attr('class', function (step) {
                  return 'mapbox-directions-icon mapbox-' + step.maneuver.type.replace(/\s+/g, '-').toLowerCase() + '-icon';
              });

          steps.append('div')
              .attr('class', 'mapbox-directions-step-maneuver')
              .html(function (step) { return step.maneuver.instruction; });

          steps.append('div')
              .attr('class', 'mapbox-directions-step-distance')
              .text(function (step) { return step.distance ? format.imperial(step.distance) : ''; });

          steps.on('mouseover', function (step) {
              directions.highlightStep(step);
          });

          steps.on('mouseout', function () {
              directions.highlightStep(null);
          });

          steps.on('click', function (step) {
              map.panTo(L.GeoJSON.coordsToLatLng(step.maneuver.location.coordinates));
          });
      });

      return control;
  };

  },{"../lib/d3":2,"./format":8}],11:[function(require,module,exports){
  'use strict';

  var debounce = require('debounce');

  var Layer = L.LayerGroup.extend({
      initialize: function(directions) {
          this._directions = directions || new L.Directions();
          L.LayerGroup.prototype.initialize.apply(this);

          this._drag = debounce(L.bind(this._drag, this), 100);

          this.originMarker = L.marker([0, 0], {
              draggable: true,
              icon: L.icon({
                  iconUrl: '/wp-content/themes/walkbikenc/img/marker.svg',
                  iconSize: [21, 27],
                  iconAnchor: [10, 20]
              })
          }).on('drag', this._drag, this);

          this.destinationMarker = L.marker([0, 0], {
              draggable: true,
              icon: L.icon({
                  iconUrl: '/wp-content/themes/walkbikenc/img/marker-finish.svg',
                  iconSize: [21, 27],
                  iconAnchor: [10, 20]
              })
          }).on('drag', this._drag, this);

          this.stepMarker = L.marker([0, 0], {
              icon: L.divIcon({
                  className: 'mapbox-marker-drag-icon mapbox-marker-drag-icon-step',
                  iconSize: new L.Point(12, 12)
              })
          });

          this.dragMarker = L.marker([0, 0], {
              draggable: true,
              icon: this._waypointIcon()
          });

          this.dragMarker
              .on('dragstart', this._dragStart, this)
              .on('drag', this._drag, this)
              .on('dragend', this._dragEnd, this);

          this.routeLayer = L.geoJson();
          this.routeHighlightLayer = L.geoJson();

          this.waypointMarkers = [];
      },

      onAdd: function() {
          L.LayerGroup.prototype.onAdd.apply(this, arguments);

          this._map
              .on('click', this._click, this)
              .on('mousemove', this._mousemove, this);

          this._directions
              .on('origin', this._origin, this)
              .on('destination', this._destination, this)
              .on('load', this._load, this)
              .on('unload', this._unload, this)
              .on('selectRoute', this._selectRoute, this)
              .on('highlightRoute', this._highlightRoute, this)
              .on('highlightStep', this._highlightStep, this);
      },

      onRemove: function() {
          this._directions
              .off('origin', this._origin, this)
              .off('destination', this._destination, this)
              .off('load', this._load, this)
              .off('unload', this._unload, this)
              .off('selectRoute', this._selectRoute, this)
              .off('highlightRoute', this._highlightRoute, this)
              .off('highlightStep', this._highlightStep, this);

          this._map
              .off('click', this._click, this)
              .off('mousemove', this._mousemove, this);

          L.LayerGroup.prototype.onRemove.apply(this, arguments);
      },

      _click: function(e) {
          if (!this._directions.getOrigin()) {
              this._directions.setOrigin(e.latlng);
          } else if (!this._directions.getDestination()) {
              this._directions.setDestination(e.latlng);
          }

          if (this._directions.queryable()) {
              this._directions.query();
          }
      },

      _mousemove: function(e) {
          if (!this.routeLayer || !this.hasLayer(this.routeLayer) || this._currentWaypoint !== undefined) {
              return;
          }

          var p = this._routePolyline().closestLayerPoint(e.layerPoint);

          if (!p || p.distance > 15) {
              return this.removeLayer(this.dragMarker);
          }

          var m = this._map.project(e.latlng),
              o = this._map.project(this.originMarker.getLatLng()),
              d = this._map.project(this.destinationMarker.getLatLng());

          if (o.distanceTo(m) < 15 || d.distanceTo(m) < 15) {
              return this.removeLayer(this.dragMarker);
          }

          for (var i = 0; i < this.waypointMarkers.length; i++) {
              var w = this._map.project(this.waypointMarkers[i].getLatLng());
              if (i !== this._currentWaypoint && w.distanceTo(m) < 15) {
                  return this.removeLayer(this.dragMarker);
              }
          }

          this.dragMarker.setLatLng(this._map.layerPointToLatLng(p));
          this.addLayer(this.dragMarker);
      },

      _origin: function(e) {
          if (e.origin && e.origin.geometry.coordinates) {
              this.originMarker.setLatLng(L.GeoJSON.coordsToLatLng(e.origin.geometry.coordinates));
              this.addLayer(this.originMarker);
          } else {
              this.removeLayer(this.originMarker);
          }
      },

      _destination: function(e) {
          if (e.destination && e.destination.geometry.coordinates) {
              this.destinationMarker.setLatLng(L.GeoJSON.coordsToLatLng(e.destination.geometry.coordinates));
              this.addLayer(this.destinationMarker);
          } else {
              this.removeLayer(this.destinationMarker);
          }
      },

      _dragStart: function(e) {
          if (e.target === this.dragMarker) {
              this._currentWaypoint = this._findWaypointIndex(e.target.getLatLng());
              this._directions.addWaypoint(this._currentWaypoint, e.target.getLatLng());
          } else {
              this._currentWaypoint = this.waypointMarkers.indexOf(e.target);
          }
      },

      _drag: function(e) {
          var latLng = e.target.getLatLng();

          if (e.target === this.originMarker) {
              this._directions.setOrigin(latLng);
          } else if (e.target === this.destinationMarker) {
              this._directions.setDestination(latLng);
          } else {
              this._directions.setWaypoint(this._currentWaypoint, latLng);
          }

          if (this._directions.queryable()) {
              this._directions.query();
          }
      },

      _dragEnd: function() {
          this._currentWaypoint = undefined;
      },

      _removeWaypoint: function(e) {
          this._directions.removeWaypoint(this.waypointMarkers.indexOf(e.target)).query();
      },

      _load: function(e) {
          this._origin(e);
          this._destination(e);

          function waypointLatLng(i) {
              return L.GeoJSON.coordsToLatLng(e.waypoints[i].geometry.coordinates);
          }

          var l = Math.min(this.waypointMarkers.length, e.waypoints.length),
              i = 0;

          // Update existing
          for (; i < l; i++) {
              this.waypointMarkers[i].setLatLng(waypointLatLng(i));
          }

          // Add new
          for (; i < e.waypoints.length; i++) {
              var waypointMarker = L.marker(waypointLatLng(i), {
                  draggable: true,
                  icon: this._waypointIcon()
              });

              waypointMarker
                  .on('click', this._removeWaypoint, this)
                  .on('dragstart', this._dragStart, this)
                  .on('drag', this._drag, this)
                  .on('dragend', this._dragEnd, this);

              this.waypointMarkers.push(waypointMarker);
              this.addLayer(waypointMarker);
          }

          // Remove old
          for (; i < this.waypointMarkers.length; i++) {
              this.removeLayer(this.waypointMarkers[i]);
          }

          this.waypointMarkers.length = e.waypoints.length;
      },

      _unload: function() {
          this.removeLayer(this.routeLayer);
          for (var i = 0; i < this.waypointMarkers.length; i++) {
              this.removeLayer(this.waypointMarkers[i]);
          }
      },

      _selectRoute: function(e) {
          this.routeLayer
              .clearLayers()
              .addData(e.route.geometry);
          this.addLayer(this.routeLayer);
      },

      _highlightRoute: function(e) {
          if (e.route) {
              this.routeHighlightLayer
                  .clearLayers()
                  .addData(e.route.geometry);
              this.addLayer(this.routeHighlightLayer);
          } else {
              this.removeLayer(this.routeHighlightLayer);
          }
      },

      _highlightStep: function(e) {
          if (e.step) {
              this.stepMarker.setLatLng(L.GeoJSON.coordsToLatLng(e.step.maneuver.location.coordinates));
              this.addLayer(this.stepMarker);
          } else {
              this.removeLayer(this.stepMarker);
          }
      },

      _routePolyline: function() {
          return this.routeLayer.getLayers()[0];
      },

      _findWaypointIndex: function(latLng) {
          var segment = this._findNearestRouteSegment(latLng);

          for (var i = 0; i < this.waypointMarkers.length; i++) {
              var s = this._findNearestRouteSegment(this.waypointMarkers[i].getLatLng());
              if (s > segment) {
                  return i;
              }
          }

          return this.waypointMarkers.length;
      },

      _findNearestRouteSegment: function(latLng) {
          var min = Infinity,
              index,
              p = this._map.latLngToLayerPoint(latLng),
              positions = this._routePolyline()._originalPoints;

          for (var i = 1; i < positions.length; i++) {
              var d = L.LineUtil._sqClosestPointOnSegment(p, positions[i - 1], positions[i], true);
              if (d < min) {
                  min = d;
                  index = i;
              }
          }

          return index;
      },

      _waypointIcon: function() {
          return L.divIcon({
              className: 'mapbox-marker-drag-icon',
              iconSize: new L.Point(12, 12)
          });
      }
  });

  module.exports = function(directions) {
      return new Layer(directions);
  };

  },{"debounce":4}],12:[function(require,module,exports){
  'use strict';

  var d3 = require('../lib/d3'),
      format = require('./format');

  module.exports = function (container, directions) {
      var control = {}, map, selection = 0;

      control.addTo = function (_) {
          map = _;
          return control;
      };

      container = d3.select(L.DomUtil.get(container))
          .classed('mapbox-directions-routes', true);

      directions.on('error', function () {
          container.html('');
      });

      directions.on('load', function (e) {
          container.html('');

          var routes = container.append('ul')
              .selectAll('li')
              .data(e.routes)
              .enter().append('li')
              .attr('class', 'mapbox-directions-route');

          routes.append('div')
              .attr('class','mapbox-directions-route-heading')
              .text(function (route) { return 'Route ' + (e.routes.indexOf(route) + 1); });

          routes.append('div')
              .attr('class', 'mapbox-directions-route-summary')
              .text(function (route) { return route.summary; });

          routes.append('div')
              .attr('class', 'mapbox-directions-route-details')
              .text(function (route) { return format.imperial(route.distance) + ', ' + format.duration(route.duration); });

          routes.on('mouseover', function (route) {
              directions.highlightRoute(route);
          });

          routes.on('mouseout', function () {
              directions.highlightRoute(null);
          });

          routes.on('click', function (route) {
              directions.selectRoute(route);
          });

          directions.selectRoute(e.routes[0]);
      });

      directions.on('selectRoute', function (e) {
          container.selectAll('.mapbox-directions-route')
              .classed('mapbox-directions-route-active', function (route) { return route === e.route; });
      });

      return control;
  };

  },{"../lib/d3":2,"./format":8}]},{},[1]);