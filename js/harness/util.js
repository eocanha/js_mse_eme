/*
Copyright 2014 Google Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
'use strict';

(function() {

if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      throw new TypeError('What is trying to be bound is not a function');
    }

    var aArgs = Array.prototype.slice.call(arguments, 1);
    var fToBind = this;
    var fNOP = function() {};
    var fBound = function() {
      return fToBind.apply(
          this instanceof fNOP && oThis ? this : oThis,
          aArgs.concat(Array.prototype.slice.call(arguments)));
    };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

var util = {};

util.createElement = function(tag, id, class_, innerHTML) {
  var element = document.createElement(tag);
  if (id != null)
    element.id = id;
  if (innerHTML != null)
    element.innerHTML = innerHTML;
  if (class_ != null)
    element.classList.add(class_);
  return element;
};

util.getClosestElement = function(refElement) {
  if (arguments.length === 1)
    return null;

  var bestElement = arguments[1];
  var bestDistance =
      Math.abs((bestElement.offsetLeft + bestElement.offsetWidth / 2) -
               (refElement.offsetLeft + refElement.offsetWidth / 2));
  for (var i = 2; i < arguments.length; ++i) {
    var currElement = arguments[i];
    var currDistance =
        Math.abs((currElement.offsetLeft + currElement.offsetWidth / 2) -
                 (refElement.offsetLeft + refElement.offsetWidth / 2));
    if (currDistance < bestDistance) {
      bestDistance = currDistance;
      bestElement = currElement;
    }
  }

  return bestElement;
};

util.fireEvent = function(obj, eventName) {
  if (document.createEvent) {
    var event = document.createEvent('MouseEvents');
    event.initEvent(eventName, true, false);
    obj.dispatchEvent(event);
  } else if (document.createEventObject) {
    obj.fireEvent('on' + eventName);
  }
};

util.getElementWidth = function(element) {
  var style = window.getComputedStyle(element);
  var width = 0;

  if (!isNaN(parseInt(style.width))) width += parseInt(style.width);
  if (!isNaN(parseInt(style.marginLeft))) width += parseInt(style.marginLeft);
  if (!isNaN(parseInt(style.marginRight))) width += parseInt(style.marginRight);

  return width;
};

util.isValidArgument = function(arg) {
  return typeof(arg) != 'undefined' && arg != null;
};

util.MakeCapitalName = function(name) {
  name = name.substr(0, 1).toUpperCase() + name.substr(1);
  var offset = 0;
  for (;;) {
    var space = name.indexOf(' ', offset);
    if (space === -1)
      break;
    name = name.substr(0, space + 1) +
        name.substr(space + 1, 1).toUpperCase() + name.substr(space + 2);
    offset = space + 1;
  }
  return name;
};

util.Round = function(value, digits) {
  return Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits);
};

util.SizeToText = function(sizeInBytes) {
  var unit = 'B';
  sizeInBytes *= 8;
  if (sizeInBytes >= 1024 * 1024) {
    sizeInBytes /= 1024 * 1024;
    unit = 'M';
  } else if (sizeInBytes >= 1024) {
    sizeInBytes /= 1024;
    unit = 'K';
  }
  if ((sizeInBytes - Math.floor(sizeInBytes)) * 10 <
      Math.floor(sizeInBytes))
    sizeInBytes = Math.floor(sizeInBytes);
  else
    sizeInBytes = util.Round(sizeInBytes, 3);
  return sizeInBytes + unit;
};

util.formatStatus = function(status) {
  if (typeof status === 'undefined')
    return 'undefined';
  else if (typeof status === 'string')
    return '"' + status + '"';
  else if (typeof status === 'number')
    return status.toString();
  else if (typeof status === 'boolean')
    return status ? 'true' : 'false';
  throw 'unknown status type';
};

util.getAttr = function(obj, attr) {
  attr = attr.split('.');
  if (!obj || attr.length === 0)
    return undefined;
  while (attr.length) {
    if (!obj)
      return undefined;
    obj = obj[attr.shift()];
  }
  return obj;
};

util.resize = function(str, newLength, fillValue) {
  if (typeof str != 'string')
    throw 'Only string is supported';
  if (str.length > newLength) {
    str.substr(0, newLength);
  } else {
    while (str.length < newLength)
      str += fillValue;
  }

  return str;
};

window.util = util;

})();

