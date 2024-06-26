/*
 Highcharts JS v10.3.1 (2022-10-31)

 Accessibility module

 (c) 2010-2021 Highsoft AS
 Author: Oystein Moseng

 License: www.highcharts.com/license
*/
(function (a) { "object" === typeof module && module.exports ? (a["default"] = a, module.exports = a) : "function" === typeof define && define.amd ? define("highcharts/modules/accessibility", ["highcharts"], function (A) { a(A); a.Highcharts = A; return a }) : a("undefined" !== typeof Highcharts ? Highcharts : void 0) })(function (a) {
    function A(a, h, m, p) { a.hasOwnProperty(h) || (a[h] = p.apply(null, m), "function" === typeof CustomEvent && window.dispatchEvent(new CustomEvent("HighchartsModuleLoaded", { detail: { path: h, module: a[h] } }))) } a = a ? a._modules : {};
    A(a, "Accessibility/Utils/HTMLUtilities.js", [a["Core/Globals.js"], a["Core/Utilities.js"]], function (a, h) {
        function m(a) { if ("function" === typeof q.MouseEvent) return new q.MouseEvent(a.type, a); if (u.createEvent) { var f = u.createEvent("MouseEvent"); if (f.initMouseEvent) return f.initMouseEvent(a.type, a.bubbles, a.cancelable, a.view || q, a.detail, a.screenX, a.screenY, a.clientX, a.clientY, a.ctrlKey, a.altKey, a.shiftKey, a.metaKey, a.button, a.relatedTarget), f } return p(a.type) } function p(a, f) {
            f = f || { x: 0, y: 0 }; if ("function" ===
                typeof q.MouseEvent) return new q.MouseEvent(a, { bubbles: !0, cancelable: !0, composed: !0, view: q, detail: "click" === a ? 1 : 0, screenX: f.x, screenY: f.y, clientX: f.x, clientY: f.y }); if (u.createEvent) { var y = u.createEvent("MouseEvent"); if (y.initMouseEvent) return y.initMouseEvent(a, !0, !0, q, "click" === a ? 1 : 0, f.x, f.y, f.x, f.y, !1, !1, !1, !1, 0, null), y } return { type: a }
        } var u = a.doc, q = a.win, w = h.css; return {
            addClass: function (a, f) { a.classList ? a.classList.add(f) : 0 > a.className.indexOf(f) && (a.className += " " + f) }, cloneMouseEvent: m, cloneTouchEvent: function (a) {
                var f =
                    function (a) { for (var k = [], c = 0; c < a.length; ++c) { var e = a.item(c); e && k.push(e) } return k }; if ("function" === typeof q.TouchEvent) return f = new q.TouchEvent(a.type, { touches: f(a.touches), targetTouches: f(a.targetTouches), changedTouches: f(a.changedTouches), ctrlKey: a.ctrlKey, shiftKey: a.shiftKey, altKey: a.altKey, metaKey: a.metaKey, bubbles: a.bubbles, cancelable: a.cancelable, composed: a.composed, detail: a.detail, view: a.view }), a.defaultPrevented && f.preventDefault(), f; f = m(a); f.touches = a.touches; f.changedTouches = a.changedTouches;
                f.targetTouches = a.targetTouches; return f
            }, escapeStringForHTML: function (a) { return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;") }, getElement: function (a) { return u.getElementById(a) }, getFakeMouseEvent: p, getHeadingTagNameForElement: function (a) {
                var f = function (a) { a = parseInt(a.slice(1), 10); return "h" + Math.min(6, a + 1) }, n = function (a) {
                    var c; a: {
                        for (c = a; c = c.previousSibling;) { var e = c.tagName || ""; if (/H[1-6]/.test(e)) { c = e; break a } } c =
                            ""
                    } if (c) return f(c); a = a.parentElement; if (!a) return "p"; c = a.tagName; return /H[1-6]/.test(c) ? f(c) : n(a)
                }; return n(a)
            }, removeChildNodes: function (a) { for (; a.lastChild;)a.removeChild(a.lastChild) }, removeClass: function (a, f) { a.classList ? a.classList.remove(f) : a.className = a.className.replace(new RegExp(f, "g"), "") }, removeElement: function (a) { a && a.parentNode && a.parentNode.removeChild(a) }, reverseChildNodes: function (a) { for (var f = a.childNodes.length; f--;)a.appendChild(a.childNodes[f]) }, stripHTMLTagsFromString: function (a) {
                return "string" ===
                    typeof a ? a.replace(/<\/?[^>]+(>|$)/g, "") : a
            }, visuallyHideElement: function (a) { w(a, { position: "absolute", width: "1px", height: "1px", overflow: "hidden", whiteSpace: "nowrap", clip: "rect(1px, 1px, 1px, 1px)", marginTop: "-3px", "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=1)", filter: "alpha(opacity=1)", opacity: .01 }) }
        }
    }); A(a, "Accessibility/A11yI18n.js", [a["Core/FormatUtilities.js"], a["Core/Utilities.js"]], function (a, h) {
        var m = a.format, p = h.getNestedProperty, u = h.pick, q; (function (a) {
            function y(c, e) {
                var d =
                    c.indexOf("#each("), b = c.indexOf("#plural("), g = c.indexOf("["), a = c.indexOf("]"); if (-1 < d) { a = c.slice(d).indexOf(")") + d; b = c.substring(0, d); g = c.substring(a + 1); a = c.substring(d + 6, a).split(","); d = Number(a[1]); c = ""; if (e = p(a[0], e)) for (d = isNaN(d) ? e.length : d, d = 0 > d ? e.length + d : Math.min(d, e.length), a = 0; a < d; ++a)c += b + e[a] + g; return c.length ? c : "" } if (-1 < b) {
                        g = c.slice(b).indexOf(")") + b; b = c.substring(b + 8, g).split(","); switch (Number(p(b[0], e))) {
                            case 0: c = u(b[4], b[1]); break; case 1: c = u(b[2], b[1]); break; case 2: c = u(b[3], b[1]);
                                break; default: c = b[1]
                        }c ? (e = c, e = e.trim && e.trim() || e.replace(/^\s+|\s+$/g, "")) : e = ""; return e
                    } return -1 < g ? (b = c.substring(0, g), g = Number(c.substring(g + 1, a)), c = void 0, e = p(b, e), !isNaN(g) && e && (0 > g ? (c = e[e.length + g], "undefined" === typeof c && (c = e[0])) : (c = e[g], "undefined" === typeof c && (c = e[e.length - 1]))), "undefined" !== typeof c ? c : "") : "{" + c + "}"
            } function f(c, e, d) {
                var b = function (b, d) { b = b.slice(d || 0); var g = b.indexOf("{"), c = b.indexOf("}"); if (-1 < g && c > g) return { statement: b.substring(g + 1, c), begin: d + g + 1, end: d + c } }, g = [], a = 0;
                do { var B = b(c, a); var k = c.substring(a, B && B.begin - 1); k.length && g.push({ value: k, type: "constant" }); B && g.push({ value: B.statement, type: "statement" }); a = B ? B.end + 1 : a + 1 } while (B); g.forEach(function (b) { "statement" === b.type && (b.value = y(b.value, e)) }); return m(g.reduce(function (b, d) { return b + d.value }, ""), e, d)
            } function n(c, e) { c = c.split("."); for (var d = this.options.lang, b = 0; b < c.length; ++b)d = d && d[c[b]]; return "string" === typeof d ? f(d, e, this) : "" } var k = []; a.compose = function (c) {
                -1 === k.indexOf(c) && (k.push(c), c.prototype.langFormat =
                    n); return c
            }; a.i18nFormat = f
        })(q || (q = {})); return q
    }); A(a, "Accessibility/Utils/ChartUtilities.js", [a["Core/Globals.js"], a["Accessibility/Utils/HTMLUtilities.js"], a["Core/Utilities.js"]], function (a, h, m) {
        function p(b, g) { var c = g.type, e = b.hcEvents; n.createEvent && (b.dispatchEvent || b.fireEvent) ? b.dispatchEvent ? b.dispatchEvent(g) : b.fireEvent(c, g) : e && e[c] ? d(b, c, g) : b.element && p(b.element, g) } function u(b) {
            var d = b.chart, c = {}, e = "Seconds"; c.Seconds = ((b.dataMax || b.max || 0) - (b.dataMin || b.min || 0)) / 1E3; c.Minutes = c.Seconds /
                60; c.Hours = c.Minutes / 60; c.Days = c.Hours / 24;["Minutes", "Hours", "Days"].forEach(function (b) { 2 < c[b] && (e = b) }); var a = c[e].toFixed("Seconds" !== e && "Minutes" !== e ? 1 : 0); return d.langFormat("accessibility.axis.timeRange" + e, { chart: d, axis: b, range: a.replace(".0", "") })
        } function q(b) {
            var d = b.chart, c = d.options, e = c && c.accessibility && c.accessibility.screenReaderSection.axisRangeDateFormat || "", a = { min: b.dataMin || b.min || 0, max: b.dataMax || b.max || 0 }; c = function (g) { return b.dateTime ? d.time.dateFormat(e, a[g]) : a[g].toString() };
            return d.langFormat("accessibility.axis.rangeFromTo", { chart: d, axis: b, rangeFrom: c("min"), rangeTo: c("max") })
        } function w(b) { if (b.points && b.points.length) return (b = e(b.points, function (b) { return !!b.graphic })) && b.graphic && b.graphic.element } function y(b) { var d = w(b); return d && d.parentNode || b.graph && b.graph.element || b.group && b.group.element } function f(b, d) {
            d.setAttribute("aria-hidden", !1); d !== b.renderTo && d.parentNode && d.parentNode !== n.body && (Array.prototype.forEach.call(d.parentNode.childNodes, function (b) {
                b.hasAttribute("aria-hidden") ||
                b.setAttribute("aria-hidden", !0)
            }), f(b, d.parentNode))
        } var n = a.doc, k = h.stripHTMLTagsFromString, c = m.defined, e = m.find, d = m.fireEvent; return {
            fireEventOnWrappedOrUnwrappedElement: p, getChartTitle: function (b) { return k(b.options.title.text || b.langFormat("accessibility.defaultChartTitle", { chart: b })) }, getAxisDescription: function (b) {
                return b && (b.userOptions && b.userOptions.accessibility && b.userOptions.accessibility.description || b.axisTitle && b.axisTitle.textStr || b.options.id || b.categories && "categories" || b.dateTime &&
                    "Time" || "values")
            }, getAxisRangeDescription: function (b) { var d = b.options || {}; return d.accessibility && "undefined" !== typeof d.accessibility.rangeDescription ? d.accessibility.rangeDescription : b.categories ? (d = b.chart, b = b.dataMax && b.dataMin ? d.langFormat("accessibility.axis.rangeCategories", { chart: d, axis: b, numCategories: b.dataMax - b.dataMin + 1 }) : "", b) : !b.dateTime || 0 !== b.min && 0 !== b.dataMin ? q(b) : u(b) }, getPointFromXY: function (b, d, c) {
                for (var g = b.length, a; g--;)if (a = e(b[g].points || [], function (b) {
                    return b.x === d && b.y ===
                        c
                })) return a
            }, getSeriesFirstPointElement: w, getSeriesFromName: function (b, d) { return d ? (b.series || []).filter(function (b) { return b.name === d }) : b.series }, getSeriesA11yElement: y, unhideChartElementFromAT: f, hideSeriesFromAT: function (b) { (b = y(b)) && b.setAttribute("aria-hidden", !0) }, scrollToPoint: function (b) {
                var g = b.series.xAxis, e = b.series.yAxis, a = g && g.scrollbar ? g : e; if ((g = a && a.scrollbar) && c(g.to) && c(g.from)) {
                    e = g.to - g.from; if (c(a.dataMin) && c(a.dataMax)) {
                        var k = a.toPixels(a.dataMin), f = a.toPixels(a.dataMax); b = (a.toPixels(b["xAxis" ===
                            a.coll ? "x" : "y"] || 0) - k) / (f - k)
                    } else b = 0; g.updatePosition(b - e / 2, b + e / 2); d(g, "changed", { from: g.from, to: g.to, trigger: "scrollbar", DOMEvent: null })
                }
            }
        }
    }); A(a, "Accessibility/Utils/DOMElementProvider.js", [a["Core/Globals.js"], a["Accessibility/Utils/HTMLUtilities.js"]], function (a, h) {
        var m = a.doc, p = h.removeElement; return function () {
            function a() { this.elements = [] } a.prototype.createElement = function () { var a = m.createElement.apply(m, arguments); this.elements.push(a); return a }; a.prototype.destroyCreatedElements = function () {
                this.elements.forEach(function (a) { p(a) });
                this.elements = []
            }; return a
        }()
    }); A(a, "Accessibility/Utils/EventProvider.js", [a["Core/Globals.js"], a["Core/Utilities.js"]], function (a, h) { var m = h.addEvent; return function () { function h() { this.eventRemovers = [] } h.prototype.addEvent = function () { var h = m.apply(a, arguments); this.eventRemovers.push(h); return h }; h.prototype.removeAddedEvents = function () { this.eventRemovers.forEach(function (a) { return a() }); this.eventRemovers = [] }; return h }() }); A(a, "Accessibility/AccessibilityComponent.js", [a["Accessibility/Utils/ChartUtilities.js"],
    a["Accessibility/Utils/DOMElementProvider.js"], a["Accessibility/Utils/EventProvider.js"], a["Accessibility/Utils/HTMLUtilities.js"], a["Core/Utilities.js"]], function (a, h, m, p, u) {
        var q = a.fireEventOnWrappedOrUnwrappedElement, w = p.getFakeMouseEvent; a = u.extend; p = function () {
            function a() { this.proxyProvider = this.keyCodes = this.eventProvider = this.domElementProvider = this.chart = void 0 } a.prototype.initBase = function (a, n) {
                this.chart = a; this.eventProvider = new m; this.domElementProvider = new h; this.proxyProvider = n; this.keyCodes =
                    { left: 37, right: 39, up: 38, down: 40, enter: 13, space: 32, esc: 27, tab: 9, pageUp: 33, pageDown: 34, end: 35, home: 36 }
            }; a.prototype.addEvent = function (a, n, k, c) { return this.eventProvider.addEvent(a, n, k, c) }; a.prototype.createElement = function (a, n) { return this.domElementProvider.createElement(a, n) }; a.prototype.fakeClickEvent = function (a) { var f = w("click"); q(a, f) }; a.prototype.destroyBase = function () { this.domElementProvider.destroyCreatedElements(); this.eventProvider.removeAddedEvents() }; return a
        }(); a(p.prototype, {
            init: function () { },
            getKeyboardNavigation: function () { }, onChartUpdate: function () { }, onChartRender: function () { }, destroy: function () { }
        }); return p
    }); A(a, "Accessibility/KeyboardNavigationHandler.js", [a["Core/Utilities.js"]], function (a) {
        var h = a.find; a = function () {
            function a(a, h) { this.chart = a; this.keyCodeMap = h.keyCodeMap || []; this.validate = h.validate; this.init = h.init; this.terminate = h.terminate; this.response = { success: 1, prev: 2, next: 3, noHandler: 4, fail: 5 } } a.prototype.run = function (a) {
                var m = a.which || a.keyCode, q = this.response.noHandler,
                w = h(this.keyCodeMap, function (a) { return -1 < a[0].indexOf(m) }); w ? q = w[1].call(this, m, a) : 9 === m && (q = this.response[a.shiftKey ? "prev" : "next"]); return q
            }; return a
        }(); ""; return a
    }); A(a, "Accessibility/Components/ContainerComponent.js", [a["Accessibility/AccessibilityComponent.js"], a["Accessibility/KeyboardNavigationHandler.js"], a["Accessibility/Utils/ChartUtilities.js"], a["Core/Globals.js"], a["Accessibility/Utils/HTMLUtilities.js"]], function (a, h, m, p, u) {
        var q = this && this.__extends || function () {
            var a = function (c, e) {
                a =
                Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b } || function (d, b) { for (var a in b) b.hasOwnProperty(a) && (d[a] = b[a]) }; return a(c, e)
            }; return function (c, e) { function d() { this.constructor = c } a(c, e); c.prototype = null === e ? Object.create(e) : (d.prototype = e.prototype, new d) }
        }(), w = m.unhideChartElementFromAT, y = m.getChartTitle, f = p.doc, n = u.stripHTMLTagsFromString; return function (a) {
            function c() { return null !== a && a.apply(this, arguments) || this } q(c, a); c.prototype.onChartUpdate = function () {
                this.handleSVGTitleElement();
                this.setSVGContainerLabel(); this.setGraphicContainerAttrs(); this.setRenderToAttrs(); this.makeCreditsAccessible()
            }; c.prototype.handleSVGTitleElement = function () { var a = this.chart, d = "highcharts-title-" + a.index, b = n(a.langFormat("accessibility.svgContainerTitle", { chartTitle: y(a) })); if (b.length) { var c = this.svgTitleElement = this.svgTitleElement || f.createElementNS("http://www.w3.org/2000/svg", "title"); c.textContent = b; c.id = d; a.renderTo.insertBefore(c, a.renderTo.firstChild) } }; c.prototype.setSVGContainerLabel =
                function () { var a = this.chart, d = a.langFormat("accessibility.svgContainerLabel", { chartTitle: y(a) }); a.renderer.box && d.length && a.renderer.box.setAttribute("aria-label", d) }; c.prototype.setGraphicContainerAttrs = function () { var a = this.chart, d = a.langFormat("accessibility.graphicContainerLabel", { chartTitle: y(a) }); d.length && a.container.setAttribute("aria-label", d) }; c.prototype.setRenderToAttrs = function () {
                    var a = this.chart, d = "disabled" !== a.options.accessibility.landmarkVerbosity, b = a.langFormat("accessibility.chartContainerLabel",
                        { title: y(a), chart: a }); b && (a.renderTo.setAttribute("role", d ? "region" : "group"), a.renderTo.setAttribute("aria-label", b))
                }; c.prototype.makeCreditsAccessible = function () { var a = this.chart, d = a.credits; d && (d.textStr && d.element.setAttribute("aria-label", a.langFormat("accessibility.credits", { creditsStr: n(d.textStr) })), w(a, d.element)) }; c.prototype.getKeyboardNavigation = function () { var a = this.chart; return new h(a, { keyCodeMap: [], validate: function () { return !0 }, init: function () { var d = a.accessibility; d && d.keyboardNavigation.tabindexContainer.focus() } }) };
            c.prototype.destroy = function () { this.chart.renderTo.setAttribute("aria-hidden", !0) }; return c
        }(a)
    }); A(a, "Accessibility/FocusBorder.js", [a["Core/Renderer/SVG/SVGLabel.js"], a["Core/Utilities.js"]], function (a, h) {
        var m = h.addEvent, w = h.pick, u; (function (h) {
            function q() { var b = this.focusElement, d = this.options.accessibility.keyboardNavigation.focusBorder; b && (b.removeFocusBorder(), d.enabled && b.addFocusBorder(d.margin, { stroke: d.style.color, strokeWidth: d.style.lineWidth, r: d.style.borderRadius })) } function y(b, d) {
                var a =
                    this.options.accessibility.keyboardNavigation.focusBorder; (d = d || b.element) && d.focus && (d.hcEvents && d.hcEvents.focusin || m(d, "focusin", function () { }), d.focus(), a.hideBrowserFocusOutline && (d.style.outline = "none")); this.focusElement && this.focusElement.removeFocusBorder(); this.focusElement = b; this.renderFocusBorder()
            } function f(b) {
                if (!b.focusBorderDestroyHook) {
                    var d = b.destroy; b.destroy = function () { b.focusBorder && b.focusBorder.destroy && b.focusBorder.destroy(); return d.apply(b, arguments) }; b.focusBorderDestroyHook =
                        d
                }
            } function n(b, d) {
                this.focusBorder && this.removeFocusBorder(); var c = this.getBBox(), g = w(b, 3), e = this.parentGroup, z = this.scaleX || e && e.scaleX, n = this.scaleY || e && e.scaleY; z = (z ? !n : n) ? Math.abs(z || n || 1) : (Math.abs(z || 1) + Math.abs(n || 1)) / 2; c.x += this.translateX ? this.translateX : 0; c.y += this.translateY ? this.translateY : 0; n = c.x - g; var h = c.y - g, r = c.width + 2 * g, l = c.height + 2 * g, t = this instanceof a; if ("text" === this.element.nodeName || t) {
                    var C = !!this.rotation; if (t) var x = { x: C ? 1 : 0, y: 0 }; else {
                        var H = x = 0; "middle" === this.attr("text-anchor") ?
                            x = H = .5 : this.rotation ? x = .25 : H = .75; x = { x: x, y: H }
                    } H = +this.attr("x"); var v = +this.attr("y"); isNaN(H) || (n = H - c.width * x.x - g); isNaN(v) || (h = v - c.height * x.y - g); t && C && (t = r, r = l, l = t, isNaN(H) || (n = H - c.height * x.x - g), isNaN(v) || (h = v - c.width * x.y - g))
                } this.focusBorder = this.renderer.rect(n, h, r, l, parseInt((d && d.r || 0).toString(), 10) / z).addClass("highcharts-focus-border").attr({ zIndex: 99 }).add(e); this.renderer.styledMode || this.focusBorder.attr({ stroke: d && d.stroke, "stroke-width": (d && d.strokeWidth || 0) / z }); k(this, b, d); f(this)
            } function k(d) {
                for (var a =
                    [], c = 1; c < arguments.length; c++)a[c - 1] = arguments[c]; d.focusBorderUpdateHooks || (d.focusBorderUpdateHooks = {}, b.forEach(function (b) { b += "Setter"; var c = d[b] || d._defaultSetter; d.focusBorderUpdateHooks[b] = c; d[b] = function () { var b = c.apply(d, arguments); d.addFocusBorder.apply(d, a); return b } }))
            } function c() { e(this); this.focusBorderDestroyHook && (this.destroy = this.focusBorderDestroyHook, delete this.focusBorderDestroyHook); this.focusBorder && (this.focusBorder.destroy(), delete this.focusBorder) } function e(b) {
                b.focusBorderUpdateHooks &&
                (Object.keys(b.focusBorderUpdateHooks).forEach(function (d) { var a = b.focusBorderUpdateHooks[d]; a === b._defaultSetter ? delete b[d] : b[d] = a }), delete b.focusBorderUpdateHooks)
            } var d = [], b = "x y transform width height r d stroke-width".split(" "); h.compose = function (b, a) { -1 === d.indexOf(b) && (d.push(b), b = b.prototype, b.renderFocusBorder = q, b.setFocusToElement = y); -1 === d.indexOf(a) && (d.push(a), a = a.prototype, a.addFocusBorder = n, a.removeFocusBorder = c) }
        })(u || (u = {})); return u
    }); A(a, "Accessibility/Utils/Announcer.js", [a["Core/Renderer/HTML/AST.js"],
    a["Accessibility/Utils/DOMElementProvider.js"], a["Core/Globals.js"], a["Accessibility/Utils/HTMLUtilities.js"], a["Core/Utilities.js"]], function (a, h, m, p, u) {
        var q = m.doc, w = p.addClass, y = p.visuallyHideElement, f = u.attr; return function () {
            function n(a, c) { this.chart = a; this.domElementProvider = new h; this.announceRegion = this.addAnnounceRegion(c) } n.prototype.destroy = function () { this.domElementProvider.destroyCreatedElements() }; n.prototype.announce = function (k) {
                var c = this; a.setElementHTML(this.announceRegion, k); this.clearAnnouncementRegionTimer &&
                    clearTimeout(this.clearAnnouncementRegionTimer); this.clearAnnouncementRegionTimer = setTimeout(function () { c.announceRegion.innerHTML = a.emptyHTML; delete c.clearAnnouncementRegionTimer }, 1E3)
            }; n.prototype.addAnnounceRegion = function (a) { var c = this.chart.announcerContainer || this.createAnnouncerContainer(), e = this.domElementProvider.createElement("div"); f(e, { "aria-hidden": !1, "aria-live": a }); this.chart.styledMode ? w(e, "highcharts-visually-hidden") : y(e); c.appendChild(e); return e }; n.prototype.createAnnouncerContainer =
                function () { var a = this.chart, c = q.createElement("div"); f(c, { "aria-hidden": !1, "class": "highcharts-announcer-container" }); c.style.position = "relative"; a.renderTo.insertBefore(c, a.renderTo.firstChild); return a.announcerContainer = c }; return n
        }()
    }); A(a, "Accessibility/Components/AnnotationsA11y.js", [a["Accessibility/Utils/HTMLUtilities.js"]], function (a) {
        function h(a) { return (a.annotations || []).reduce(function (a, n) { n.options && !1 !== n.options.visible && (a = a.concat(n.labels)); return a }, []) } function m(a) {
            return a.options &&
                a.options.accessibility && a.options.accessibility.description || a.graphic && a.graphic.text && a.graphic.text.textStr || ""
        } function w(a) {
            var f = a.options && a.options.accessibility && a.options.accessibility.description; if (f) return f; f = a.chart; var n = m(a), k = a.points.filter(function (a) { return !!a.graphic }).map(function (a) {
                var b = a.accessibility && a.accessibility.valueDescription || a.graphic && a.graphic.element && a.graphic.element.getAttribute("aria-label") || ""; a = a && a.series.name || ""; return (a ? a + ", " : "") + "data point " +
                    b
            }).filter(function (a) { return !!a }), c = k.length, e = "accessibility.screenReaderSection.annotations.description" + (1 < c ? "MultiplePoints" : c ? "SinglePoint" : "NoPoints"); a = { annotationText: n, annotation: a, numPoints: c, annotationPoint: k[0], additionalAnnotationPoints: k.slice(1) }; return f.langFormat(e, a)
        } function u(a) { return h(a).map(function (a) { return (a = q(I(w(a)))) ? "<li>".concat(a, "</li>") : "" }) } var q = a.escapeStringForHTML, I = a.stripHTMLTagsFromString; return {
            getAnnotationsInfoHTML: function (a) {
                var f = a.annotations; if (!f ||
                    !f.length) return ""; a = u(a); return '<ul style="list-style-type: none">'.concat(a.join(" "), "</ul>")
            }, getAnnotationLabelDescription: w, getAnnotationListItems: u, getPointAnnotationTexts: function (a) { var f = h(a.series.chart).filter(function (f) { return -1 < f.points.indexOf(a) }); return f.length ? f.map(function (a) { return "".concat(m(a)) }) : [] }
        }
    }); A(a, "Accessibility/Components/InfoRegionsComponent.js", [a["Accessibility/A11yI18n.js"], a["Accessibility/AccessibilityComponent.js"], a["Accessibility/Utils/Announcer.js"], a["Accessibility/Components/AnnotationsA11y.js"],
    a["Core/Renderer/HTML/AST.js"], a["Accessibility/Utils/ChartUtilities.js"], a["Core/FormatUtilities.js"], a["Core/Globals.js"], a["Accessibility/Utils/HTMLUtilities.js"], a["Core/Utilities.js"]], function (a, h, m, p, u, q, I, y, f, n) {
        function k(a, b) {
            var d = b[0], c = a.series && a.series[0] || {}; c = { numSeries: a.series.length, numPoints: c.points && c.points.length, chart: a, mapTitle: a.mapView && a.mapView.geoMap && a.mapView.geoMap.title }; if (!d) return a.langFormat("accessibility.chartTypes.emptyChart", c); if ("map" === d) return c.mapTitle ?
                a.langFormat("accessibility.chartTypes.mapTypeDescription", c) : a.langFormat("accessibility.chartTypes.unknownMap", c); if (1 < a.types.length) return a.langFormat("accessibility.chartTypes.combinationChart", c); b = b[0]; d = a.langFormat("accessibility.seriesTypeDescriptions." + b, c); var l = a.series && 2 > a.series.length ? "Single" : "Multiple"; return (a.langFormat("accessibility.chartTypes." + b + l, c) || a.langFormat("accessibility.chartTypes.default" + l, c)) + (d ? " " + d : "")
        } var c = this && this.__extends || function () {
            var a = function (b,
                d) { a = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (a, b) { a.__proto__ = b } || function (a, b) { for (var d in b) b.hasOwnProperty(d) && (a[d] = b[d]) }; return a(b, d) }; return function (b, d) { function c() { this.constructor = b } a(b, d); b.prototype = null === d ? Object.create(d) : (c.prototype = d.prototype, new c) }
        }(), e = p.getAnnotationsInfoHTML, d = q.getAxisDescription, b = q.getAxisRangeDescription, g = q.getChartTitle, z = q.unhideChartElementFromAT, B = I.format, w = y.doc, G = f.addClass, D = f.getElement, F = f.getHeadingTagNameForElement,
            E = f.stripHTMLTagsFromString, r = f.visuallyHideElement, l = n.attr, t = n.pick; return function (C) {
                function x() { var a = null !== C && C.apply(this, arguments) || this; a.announcer = void 0; a.screenReaderSections = {}; return a } c(x, C); x.prototype.init = function () {
                    var a = this.chart, b = this; this.initRegionsDefinitions(); this.addEvent(a, "aftergetTableAST", function (a) { b.onDataTableCreated(a) }); this.addEvent(a, "afterViewData", function (a) { a.wasHidden && (b.dataTableDiv = a.element, setTimeout(function () { b.focusDataTable() }, 300)) }); this.announcer =
                        new m(a, "assertive")
                }; x.prototype.initRegionsDefinitions = function () {
                    var a = this; this.screenReaderSections = {
                        before: { element: null, buildContent: function (b) { var d = b.options.accessibility.screenReaderSection.beforeChartFormatter; return d ? d(b) : a.defaultBeforeChartFormatter(b) }, insertIntoDOM: function (a, b) { b.renderTo.insertBefore(a, b.renderTo.firstChild) }, afterInserted: function () { "undefined" !== typeof a.sonifyButtonId && a.initSonifyButton(a.sonifyButtonId); "undefined" !== typeof a.dataTableButtonId && a.initDataTableButton(a.dataTableButtonId) } },
                        after: { element: null, buildContent: function (b) { var d = b.options.accessibility.screenReaderSection.afterChartFormatter; return d ? d(b) : a.defaultAfterChartFormatter() }, insertIntoDOM: function (a, b) { b.renderTo.insertBefore(a, b.container.nextSibling) }, afterInserted: function () { a.chart.accessibility && a.chart.accessibility.keyboardNavigation.updateExitAnchor() } }
                    }
                }; x.prototype.onChartRender = function () { var a = this; this.linkedDescriptionElement = this.getLinkedDescriptionElement(); this.setLinkedDescriptionAttrs(); Object.keys(this.screenReaderSections).forEach(function (b) { a.updateScreenReaderSection(b) }) };
                x.prototype.getLinkedDescriptionElement = function () { var a = this.chart.options.accessibility.linkedDescription; if (a) { if ("string" !== typeof a) return a; a = B(a, this.chart); a = w.querySelectorAll(a); if (1 === a.length) return a[0] } }; x.prototype.setLinkedDescriptionAttrs = function () { var a = this.linkedDescriptionElement; a && (a.setAttribute("aria-hidden", "true"), G(a, "highcharts-linked-description")) }; x.prototype.updateScreenReaderSection = function (a) {
                    var b = this.chart, d = this.screenReaderSections[a], c = d.buildContent(b),
                    l = d.element = d.element || this.createElement("div"), g = l.firstChild || this.createElement("div"); c ? (this.setScreenReaderSectionAttribs(l, a), u.setElementHTML(g, c), l.appendChild(g), d.insertIntoDOM(l, b), b.styledMode ? G(g, "highcharts-visually-hidden") : r(g), z(b, g), d.afterInserted && d.afterInserted()) : (l.parentNode && l.parentNode.removeChild(l), d.element = null)
                }; x.prototype.setScreenReaderSectionAttribs = function (a, b) {
                    var d = this.chart, c = d.langFormat("accessibility.screenReaderSection." + b + "RegionLabel", { chart: d, chartTitle: g(d) });
                    b = "highcharts-screen-reader-region-".concat(b, "-").concat(d.index); l(a, { id: b, "aria-label": c || void 0 }); a.style.position = "relative"; c && a.setAttribute("role", "all" === d.options.accessibility.landmarkVerbosity ? "region" : "group")
                }; x.prototype.defaultBeforeChartFormatter = function () {
                    var b = this.chart, d = b.options.accessibility.screenReaderSection.beforeChartFormat; if (!d) return ""; var c = this.getAxesDescription(), l = b.sonify && b.options.sonification && b.options.sonification.enabled, t = "highcharts-a11y-sonify-data-btn-" +
                        b.index, x = "hc-linkto-highcharts-data-table-" + b.index, r = e(b), C = b.langFormat("accessibility.screenReaderSection.annotations.heading", { chart: b }); c = { headingTagName: F(b.renderTo), chartTitle: g(b), typeDescription: this.getTypeDescriptionText(), chartSubtitle: this.getSubtitleText(), chartLongdesc: this.getLongdescText(), xAxisDescription: c.xAxis, yAxisDescription: c.yAxis, playAsSoundButton: l ? this.getSonifyButtonText(t) : "", viewTableButton: b.getCSV ? this.getDataTableButtonText(x) : "", annotationsTitle: r ? C : "", annotationsList: r };
                    b = a.i18nFormat(d, c, b); this.dataTableButtonId = x; this.sonifyButtonId = t; return b.replace(/<(\w+)[^>]*?>\s*<\/\1>/g, "")
                }; x.prototype.defaultAfterChartFormatter = function () { var b = this.chart, d = b.options.accessibility.screenReaderSection.afterChartFormat; if (!d) return ""; var c = { endOfChartMarker: this.getEndOfChartMarkerText() }; return a.i18nFormat(d, c, b).replace(/<(\w+)[^>]*?>\s*<\/\1>/g, "") }; x.prototype.getLinkedDescription = function () { var a = this.linkedDescriptionElement; return E(a && a.innerHTML || "") }; x.prototype.getLongdescText =
                    function () { var a = this.chart.options, b = a.caption; b = b && b.text; var d = this.getLinkedDescription(); return a.accessibility.description || d || b || "" }; x.prototype.getTypeDescriptionText = function () { var a = this.chart; return a.types ? a.options.accessibility.typeDescription || k(a, a.types) : "" }; x.prototype.getDataTableButtonText = function (a) { var b = this.chart; b = b.langFormat("accessibility.table.viewAsDataTableButtonText", { chart: b, chartTitle: g(b) }); return '<button id="' + a + '">' + b + "</button>" }; x.prototype.getSonifyButtonText =
                        function (a) { var b = this.chart; if (b.options.sonification && !1 === b.options.sonification.enabled) return ""; b = b.langFormat("accessibility.sonification.playAsSoundButtonText", { chart: b, chartTitle: g(b) }); return '<button id="' + a + '">' + b + "</button>" }; x.prototype.getSubtitleText = function () { var a = this.chart.options.subtitle; return E(a && a.text || "") }; x.prototype.getEndOfChartMarkerText = function () {
                            var a = this.chart, b = a.langFormat("accessibility.screenReaderSection.endOfChartMarker", { chart: a }); return '<div id="highcharts-end-of-chart-marker-' +
                                a.index + '">' + b + "</div>"
                        }; x.prototype.onDataTableCreated = function (a) { var b = this.chart; if (b.options.accessibility.enabled) { this.viewDataTableButton && this.viewDataTableButton.setAttribute("aria-expanded", "true"); var d = a.tree.attributes || {}; d.tabindex = -1; d.summary = b.langFormat("accessibility.table.tableSummary", { chart: b }); a.tree.attributes = d } }; x.prototype.focusDataTable = function () { var a = this.dataTableDiv; (a = a && a.getElementsByTagName("table")[0]) && a.focus && a.focus() }; x.prototype.initSonifyButton = function (a) {
                            var b =
                                this, d = this.sonifyButton = D(a), c = this.chart, l = function (a) { d && (d.setAttribute("aria-hidden", "true"), d.setAttribute("aria-label", "")); a.preventDefault(); a.stopPropagation(); a = c.langFormat("accessibility.sonification.playAsSoundClickAnnouncement", { chart: c }); b.announcer.announce(a); setTimeout(function () { d && (d.removeAttribute("aria-hidden"), d.removeAttribute("aria-label")); c.sonify && c.sonify() }, 1E3) }; d && c && (d.setAttribute("tabindex", -1), d.onclick = function (a) {
                                    (c.options.accessibility && c.options.accessibility.screenReaderSection.onPlayAsSoundClick ||
                                        l).call(this, a, c)
                                })
                        }; x.prototype.initDataTableButton = function (a) { var b = this.viewDataTableButton = D(a), d = this.chart; a = a.replace("hc-linkto-", ""); b && (l(b, { tabindex: -1, "aria-expanded": !!D(a) }), b.onclick = d.options.accessibility.screenReaderSection.onViewDataTableClick || function () { d.viewData() }) }; x.prototype.getAxesDescription = function () {
                            var a = this.chart, b = function (b, d) { b = a[b]; return 1 < b.length || b[0] && t(b[0].options.accessibility && b[0].options.accessibility.enabled, d) }, d = !!a.types && 0 > a.types.indexOf("map") &&
                                0 > a.types.indexOf("treemap") && 0 > a.types.indexOf("tilemap"), c = !!a.hasCartesianSeries, l = b("xAxis", !a.angular && c && d); b = b("yAxis", c && d); d = {}; l && (d.xAxis = this.getAxisDescriptionText("xAxis")); b && (d.yAxis = this.getAxisDescriptionText("yAxis")); return d
                        }; x.prototype.getAxisDescriptionText = function (a) { var c = this.chart, l = c[a]; return c.langFormat("accessibility.axis." + a + "Description" + (1 < l.length ? "Plural" : "Singular"), { chart: c, names: l.map(function (a) { return d(a) }), ranges: l.map(function (a) { return b(a) }), numAxes: l.length }) };
                x.prototype.destroy = function () { this.announcer && this.announcer.destroy() }; return x
            }(h)
    }); A(a, "Accessibility/Components/MenuComponent.js", [a["Core/Chart/Chart.js"], a["Core/Utilities.js"], a["Accessibility/AccessibilityComponent.js"], a["Accessibility/KeyboardNavigationHandler.js"], a["Accessibility/Utils/ChartUtilities.js"], a["Accessibility/Utils/HTMLUtilities.js"]], function (a, h, m, p, u, q) {
        var w = this && this.__extends || function () {
            var a = function (c, d) {
                a = Object.setPrototypeOf || { __proto__: [] } instanceof Array &&
                function (a, d) { a.__proto__ = d } || function (a, d) { for (var b in d) d.hasOwnProperty(b) && (a[b] = d[b]) }; return a(c, d)
            }; return function (c, d) { function b() { this.constructor = c } a(c, d); c.prototype = null === d ? Object.create(d) : (b.prototype = d.prototype, new b) }
        }(), y = h.attr, f = u.getChartTitle, n = u.unhideChartElementFromAT, k = q.getFakeMouseEvent; h = function (a) {
            function c() { return null !== a && a.apply(this, arguments) || this } w(c, a); c.prototype.init = function () {
                var a = this.chart, b = this; this.addEvent(a, "exportMenuShown", function () { b.onMenuShown() });
                this.addEvent(a, "exportMenuHidden", function () { b.onMenuHidden() }); this.createProxyGroup()
            }; c.prototype.onMenuHidden = function () { var a = this.chart.exportContextMenu; a && a.setAttribute("aria-hidden", "true"); this.setExportButtonExpandedState("false") }; c.prototype.onMenuShown = function () { var a = this.chart, b = a.exportContextMenu; b && (this.addAccessibleContextMenuAttribs(), n(a, b)); this.setExportButtonExpandedState("true") }; c.prototype.setExportButtonExpandedState = function (a) {
                this.exportButtonProxy && this.exportButtonProxy.buttonElement.setAttribute("aria-expanded",
                    a)
            }; c.prototype.onChartRender = function () { var a = this.chart, b = a.focusElement, c = a.accessibility; this.proxyProvider.clearGroup("chartMenu"); this.proxyMenuButton(); this.exportButtonProxy && b && b === a.exportingGroup && (b.focusBorder ? a.setFocusToElement(b, this.exportButtonProxy.buttonElement) : c && c.keyboardNavigation.tabindexContainer.focus()) }; c.prototype.proxyMenuButton = function () {
                var a = this.chart, b = this.proxyProvider, c = a.exportSVGElements && a.exportSVGElements[0], e = a.options.exporting, k = a.exportSVGElements &&
                    a.exportSVGElements[0]; e && !1 !== e.enabled && e.accessibility && e.accessibility.enabled && k && k.element && c && (this.exportButtonProxy = b.addProxyElement("chartMenu", { click: c }, { "aria-label": a.langFormat("accessibility.exporting.menuButtonLabel", { chart: a, chartTitle: f(a) }), "aria-expanded": !1, title: a.options.lang.contextButtonTitle || null }))
            }; c.prototype.createProxyGroup = function () { this.chart && this.proxyProvider && this.proxyProvider.addGroup("chartMenu", "div") }; c.prototype.addAccessibleContextMenuAttribs = function () {
                var a =
                    this.chart, b = a.exportDivElements; b && b.length && (b.forEach(function (a) { a && ("LI" !== a.tagName || a.children && a.children.length ? a.setAttribute("aria-hidden", "true") : a.setAttribute("tabindex", -1)) }), (b = b[0] && b[0].parentNode) && y(b, { "aria-hidden": void 0, "aria-label": a.langFormat("accessibility.exporting.chartMenuLabel", { chart: a }), role: "list" }))
            }; c.prototype.getKeyboardNavigation = function () {
                var a = this.keyCodes, b = this.chart, c = this; return new p(b, {
                    keyCodeMap: [[[a.left, a.up], function () { return c.onKbdPrevious(this) }],
                    [[a.right, a.down], function () { return c.onKbdNext(this) }], [[a.enter, a.space], function () { return c.onKbdClick(this) }]], validate: function () { return !!b.exporting && !1 !== b.options.exporting.enabled && !1 !== b.options.exporting.accessibility.enabled }, init: function () { var a = c.exportButtonProxy, d = c.chart.exportingGroup; a && d && b.setFocusToElement(d, a.buttonElement) }, terminate: function () { b.hideExportMenu() }
                })
            }; c.prototype.onKbdPrevious = function (a) {
                var b = this.chart, d = b.options.accessibility; a = a.response; for (var c = b.highlightedExportItemIx ||
                    0; c--;)if (b.highlightExportItem(c)) return a.success; return d.keyboardNavigation.wrapAround ? (b.highlightLastExportItem(), a.success) : a.prev
            }; c.prototype.onKbdNext = function (a) { var b = this.chart, d = b.options.accessibility; a = a.response; for (var c = (b.highlightedExportItemIx || 0) + 1; c < b.exportDivElements.length; ++c)if (b.highlightExportItem(c)) return a.success; return d.keyboardNavigation.wrapAround ? (b.highlightExportItem(0), a.success) : a.next }; c.prototype.onKbdClick = function (a) {
                var b = this.chart, d = b.exportDivElements[b.highlightedExportItemIx],
                c = (b.exportSVGElements && b.exportSVGElements[0]).element; b.openMenu ? this.fakeClickEvent(d) : (this.fakeClickEvent(c), b.highlightExportItem(0)); return a.response.success
            }; return c
        }(m); (function (c) {
            function e() { var a = this.exportSVGElements && this.exportSVGElements[0]; if (a && (a = a.element, a.onclick)) a.onclick(k("click")) } function d() {
                var a = this.exportDivElements; a && this.exportContextMenu && this.openMenu && (a.forEach(function (a) { if (a && "highcharts-menu-item" === a.className && a.onmouseout) a.onmouseout(k("mouseout")) }),
                    this.highlightedExportItemIx = 0, this.exportContextMenu.hideMenu(), this.container.focus())
            } function b(a) {
                var b = this.exportDivElements && this.exportDivElements[a], d = this.exportDivElements && this.exportDivElements[this.highlightedExportItemIx]; if (b && "LI" === b.tagName && (!b.children || !b.children.length)) {
                    var c = !!(this.renderTo.getElementsByTagName("g")[0] || {}).focus; b.focus && c && b.focus(); if (d && d.onmouseout) d.onmouseout(k("mouseout")); if (b.onmouseover) b.onmouseover(k("mouseover")); this.highlightedExportItemIx =
                        a; return !0
                } return !1
            } function g() { if (this.exportDivElements) for (var a = this.exportDivElements.length; a--;)if (this.highlightExportItem(a)) return !0; return !1 } var z = []; c.compose = function (c) { -1 === z.indexOf(c) && (z.push(c), c = a.prototype, c.hideExportMenu = d, c.highlightExportItem = b, c.highlightLastExportItem = g, c.showExportMenu = e) }
        })(h || (h = {})); return h
    }); A(a, "Accessibility/KeyboardNavigation.js", [a["Core/Globals.js"], a["Accessibility/Components/MenuComponent.js"], a["Core/Utilities.js"], a["Accessibility/Utils/EventProvider.js"],
    a["Accessibility/Utils/HTMLUtilities.js"]], function (a, h, m, p, u) {
        var q = a.doc, w = a.win, y = m.addEvent, f = m.fireEvent, n = u.getElement; m = function () {
            function a(a, e) { this.components = this.chart = void 0; this.currentModuleIx = NaN; this.exitAnchor = this.eventProvider = void 0; this.modules = []; this.tabindexContainer = void 0; this.init(a, e) } a.prototype.init = function (a, e) {
                var d = this, b = this.eventProvider = new p; this.chart = a; this.components = e; this.modules = []; this.currentModuleIx = 0; this.update(); b.addEvent(this.tabindexContainer,
                    "keydown", function (a) { return d.onKeydown(a) }); b.addEvent(this.tabindexContainer, "focus", function (a) { return d.onFocus(a) });["mouseup", "touchend"].forEach(function (a) { return b.addEvent(q, a, function () { return d.onMouseUp() }) });["mousedown", "touchstart"].forEach(function (c) { return b.addEvent(a.renderTo, c, function () { d.isClickingChart = !0 }) }); b.addEvent(a.renderTo, "mouseover", function () { d.pointerIsOverChart = !0 }); b.addEvent(a.renderTo, "mouseout", function () { d.pointerIsOverChart = !1 })
            }; a.prototype.update = function (a) {
                var c =
                    this.chart.options.accessibility; c = c && c.keyboardNavigation; var d = this.components; this.updateContainerTabindex(); c && c.enabled && a && a.length ? (this.modules = a.reduce(function (a, c) { c = d[c].getKeyboardNavigation(); return a.concat(c) }, []), this.updateExitAnchor()) : (this.modules = [], this.currentModuleIx = 0, this.removeExitAnchor())
            }; a.prototype.updateExitAnchor = function () {
                var a = "highcharts-end-of-chart-marker-".concat(this.chart.index); a = n(a); this.removeExitAnchor(); a ? (this.makeElementAnExitAnchor(a), this.exitAnchor =
                    a) : this.createExitAnchor()
            }; a.prototype.move = function (a) { var c = this.modules && this.modules[this.currentModuleIx]; c && c.terminate && c.terminate(a); this.chart.focusElement && this.chart.focusElement.removeFocusBorder(); this.currentModuleIx += a; if (c = this.modules && this.modules[this.currentModuleIx]) { if (c.validate && !c.validate()) return this.move(a); if (c.init) return c.init(a), !0 } this.currentModuleIx = 0; this.exiting = !0; 0 < a ? this.exitAnchor && this.exitAnchor.focus() : this.tabindexContainer.focus(); return !1 }; a.prototype.onFocus =
                function (a) { var c = this.chart; a = a.relatedTarget && c.container.contains(a.relatedTarget); this.exiting || this.tabbingInBackwards || this.isClickingChart || a || (a = this.getFirstValidModuleIx(), null !== a && (this.currentModuleIx = a, this.modules[a].init(1))); this.exiting = !1 }; a.prototype.onMouseUp = function () {
                    delete this.isClickingChart; if (!this.keyboardReset) {
                        var a = this.chart; if (!this.pointerIsOverChart) { var e = this.modules && this.modules[this.currentModuleIx || 0]; e && e.terminate && e.terminate(); this.currentModuleIx = 0 } a.focusElement &&
                            (a.focusElement.removeFocusBorder(), delete a.focusElement); this.keyboardReset = !0
                    }
                }; a.prototype.onKeydown = function (a) { a = a || w.event; var c = this.modules && this.modules.length && this.modules[this.currentModuleIx], d; this.exiting = this.keyboardReset = !1; if (c) { var b = c.run(a); b === c.response.success ? d = !0 : b === c.response.prev ? d = this.move(-1) : b === c.response.next && (d = this.move(1)); d && (a.preventDefault(), a.stopPropagation()) } }; a.prototype.updateContainerTabindex = function () {
                    var a = this.chart.options.accessibility; a = a &&
                        a.keyboardNavigation; a = !(a && !1 === a.enabled); var e = this.chart, d = e.container; e.renderTo.hasAttribute("tabindex") && (d.removeAttribute("tabindex"), d = e.renderTo); this.tabindexContainer = d; var b = d.getAttribute("tabindex"); a && !b ? d.setAttribute("tabindex", "0") : a || e.container.removeAttribute("tabindex")
                }; a.prototype.createExitAnchor = function () { var a = this.chart, e = this.exitAnchor = q.createElement("div"); a.renderTo.appendChild(e); this.makeElementAnExitAnchor(e) }; a.prototype.makeElementAnExitAnchor = function (a) {
                    var c =
                        this.tabindexContainer.getAttribute("tabindex") || 0; a.setAttribute("class", "highcharts-exit-anchor"); a.setAttribute("tabindex", c); a.setAttribute("aria-hidden", !1); this.addExitAnchorEventsToEl(a)
                }; a.prototype.removeExitAnchor = function () { this.exitAnchor && this.exitAnchor.parentNode && (this.exitAnchor.parentNode.removeChild(this.exitAnchor), delete this.exitAnchor) }; a.prototype.addExitAnchorEventsToEl = function (a) {
                    var c = this.chart, d = this; this.eventProvider.addEvent(a, "focus", function (a) {
                        a = a || w.event; var b =
                            !(a.relatedTarget && c.container.contains(a.relatedTarget) || d.exiting); c.focusElement && delete c.focusElement; b ? (d.tabbingInBackwards = !0, d.tabindexContainer.focus(), delete d.tabbingInBackwards, a.preventDefault(), d.modules && d.modules.length && (d.currentModuleIx = d.modules.length - 1, (a = d.modules[d.currentModuleIx]) && a.validate && !a.validate() ? d.move(-1) : a && a.init(-1))) : d.exiting = !1
                    })
                }; a.prototype.getFirstValidModuleIx = function () {
                    for (var a = this.modules.length, e = 0; e < a; ++e) {
                        var d = this.modules[e]; if (!d.validate ||
                            d.validate()) return e
                    } return null
                }; a.prototype.destroy = function () { this.removeExitAnchor(); this.eventProvider.removeAddedEvents(); this.chart.container.removeAttribute("tabindex") }; return a
        }(); (function (k) {
            function c() { var a = this; f(this, "dismissPopupContent", {}, function () { a.tooltip && a.tooltip.hide(0); a.hideExportMenu() }) } function e(b) { 27 === (b.which || b.keyCode) && a.charts && a.charts.forEach(function (a) { a && a.dismissPopupContent && a.dismissPopupContent() }) } var d = []; k.compose = function (a) {
                h.compose(a); -1 ===
                    d.indexOf(a) && (d.push(a), a.prototype.dismissPopupContent = c); -1 === d.indexOf(q) && (d.push(q), y(q, "keydown", e)); return a
            }
        })(m || (m = {})); return m
    }); A(a, "Accessibility/Components/LegendComponent.js", [a["Core/Animation/AnimationUtilities.js"], a["Core/Globals.js"], a["Core/Legend/Legend.js"], a["Core/Utilities.js"], a["Accessibility/AccessibilityComponent.js"], a["Accessibility/KeyboardNavigationHandler.js"], a["Accessibility/Utils/ChartUtilities.js"], a["Accessibility/Utils/HTMLUtilities.js"]], function (a, h, m, p,
        u, q, I, y) {
            function f(a) { var b = a.legend && a.legend.allItems, d = a.options.legend.accessibility || {}; a = a.colorAxis && a.colorAxis.some(function (a) { return !a.dataClasses || !a.dataClasses.length }); return !(!b || !b.length || a || !1 === d.enabled) } function n(a, d) { var c = d.legendItem || {}; d.setState(a ? "hover" : "", !0); d = 0; for (var g = ["group", "label", "symbol"]; d < g.length; d++) { var e = c[g[d]]; (e = e && e.element || e) && b(e, a ? "mouseover" : "mouseout") } } var k = this && this.__extends || function () {
                var a = function (b, d) {
                    a = Object.setPrototypeOf || { __proto__: [] } instanceof
                    Array && function (a, b) { a.__proto__ = b } || function (a, b) { for (var d in b) b.hasOwnProperty(d) && (a[d] = b[d]) }; return a(b, d)
                }; return function (b, d) { function c() { this.constructor = b } a(b, d); b.prototype = null === d ? Object.create(d) : (c.prototype = d.prototype, new c) }
            }(), c = a.animObject, e = h.doc, d = p.addEvent, b = p.fireEvent, g = p.isNumber, z = p.pick, B = p.syncTimeout, w = I.getChartTitle, G = y.stripHTMLTagsFromString, D = y.addClass, F = y.removeClass; a = function (a) {
                function b() {
                    var b = null !== a && a.apply(this, arguments) || this; b.highlightedLegendItemIx =
                        NaN; b.proxyGroup = null; return b
                } k(b, a); b.prototype.init = function () {
                    var a = this; this.recreateProxies(); this.addEvent(m, "afterScroll", function () { this.chart === a.chart && (a.proxyProvider.updateGroupProxyElementPositions("legend"), a.updateLegendItemProxyVisibility(), -1 < a.highlightedLegendItemIx && this.chart.highlightLegendItem(a.highlightedLegendItemIx)) }); this.addEvent(m, "afterPositionItem", function (b) { this.chart === a.chart && this.chart.renderer && a.updateProxyPositionForItem(b.item) }); this.addEvent(m, "afterRender",
                        function () { this.chart === a.chart && this.chart.renderer && a.recreateProxies() && B(function () { return a.proxyProvider.updateGroupProxyElementPositions("legend") }, c(z(this.chart.renderer.globalAnimation, !0)).duration) })
                }; b.prototype.updateLegendItemProxyVisibility = function () {
                    var a = this.chart, b = a.legend, d = b.currentPage || 1, c = b.clipHeight || 0, g; (b.allItems || []).forEach(function (l) {
                        if (l.a11yProxyElement) {
                            var v = b.pages && b.pages.length, e = l.a11yProxyElement.element, x = !1; g = l.legendItem || {}; v && (l = g.pageIx || 0, v = g.y ||
                                0, x = g.label ? Math.round(g.label.getBBox().height) : 0, x = v + x - b.pages[l] > c || l !== d - 1); x ? a.styledMode ? D(e, "highcharts-a11y-invisible") : e.style.visibility = "hidden" : (F(e, "highcharts-a11y-invisible"), e.style.visibility = "")
                        }
                    })
                }; b.prototype.onChartRender = function () { f(this.chart) || this.removeProxies() }; b.prototype.highlightAdjacentLegendPage = function (a) {
                    var b = this.chart, d = b.legend; a = (d.currentPage || 1) + a; var c = d.pages || []; if (0 < a && a <= c.length) for (var l = c = 0, g = d.allItems; l < g.length; l++)((g[l].legendItem || {}).pageIx ||
                        0) + 1 === a && (d = b.highlightLegendItem(c)) && (this.highlightedLegendItemIx = c), ++c
                }; b.prototype.updateProxyPositionForItem = function (a) { a.a11yProxyElement && a.a11yProxyElement.refreshPosition() }; b.prototype.recreateProxies = function () {
                    var a = e.activeElement, b = this.proxyGroup; a = a && b && b.contains(a); this.removeProxies(); return f(this.chart) ? (this.addLegendProxyGroup(), this.proxyLegendItems(), this.updateLegendItemProxyVisibility(), this.updateLegendTitle(), a && this.chart.highlightLegendItem(this.highlightedLegendItemIx),
                        !0) : !1
                }; b.prototype.removeProxies = function () { this.proxyProvider.removeGroup("legend") }; b.prototype.updateLegendTitle = function () { var a = this.chart, b = G((a.legend && a.legend.options.title && a.legend.options.title.text || "").replace(/<br ?\/?>/g, " ")); a = a.langFormat("accessibility.legend.legendLabel" + (b ? "" : "NoTitle"), { chart: a, legendTitle: b, chartTitle: w(a) }); this.proxyProvider.updateGroupAttrs("legend", { "aria-label": a }) }; b.prototype.addLegendProxyGroup = function () {
                    this.proxyGroup = this.proxyProvider.addGroup("legend",
                        "ul", { "aria-label": "_placeholder_", role: "all" === this.chart.options.accessibility.landmarkVerbosity ? "region" : null })
                }; b.prototype.proxyLegendItems = function () { var a = this, b; ((this.chart.legend || {}).allItems || []).forEach(function (d) { b = d.legendItem || {}; b.label && b.label.element && a.proxyLegendItem(d) }) }; b.prototype.proxyLegendItem = function (a) {
                    var b = a.legendItem || {}; if (b.label && b.group) {
                        var d = this.chart.langFormat("accessibility.legend.legendItem", { chart: this.chart, itemName: G(a.name), item: a }); a.a11yProxyElement =
                            this.proxyProvider.addProxyElement("legend", { click: b.label, visual: (b.group.div ? b.label : b.group).element }, { tabindex: -1, "aria-pressed": a.visible, "aria-label": d })
                    }
                }; b.prototype.getKeyboardNavigation = function () {
                    var a = this.keyCodes, b = this, d = this.chart; return new q(d, {
                        keyCodeMap: [[[a.left, a.right, a.up, a.down], function (a) { return b.onKbdArrowKey(this, a) }], [[a.enter, a.space], function () { return b.onKbdClick(this) }], [[a.pageDown, a.pageUp], function (d) { b.highlightAdjacentLegendPage(d === a.pageDown ? 1 : -1); return this.response.success }]],
                        validate: function () { return b.shouldHaveLegendNavigation() }, init: function () { d.highlightLegendItem(0); b.highlightedLegendItemIx = 0 }, terminate: function () { b.highlightedLegendItemIx = -1; d.legend.allItems.forEach(function (a) { return n(!1, a) }) }
                    })
                }; b.prototype.onKbdArrowKey = function (a, b) {
                    var d = this.keyCodes, c = a.response, l = this.chart, g = l.options.accessibility, e = l.legend.allItems.length; b = b === d.left || b === d.up ? -1 : 1; if (l.highlightLegendItem(this.highlightedLegendItemIx + b)) return this.highlightedLegendItemIx += b,
                        c.success; 1 < e && g.keyboardNavigation.wrapAround && a.init(b); return c.success
                }; b.prototype.onKbdClick = function (a) { var b = this.chart.legend.allItems[this.highlightedLegendItemIx]; b && b.a11yProxyElement && b.a11yProxyElement.click(); return a.response.success }; b.prototype.shouldHaveLegendNavigation = function () { if (!f(this.chart)) return !1; var a = this.chart, b = (a.options.legend || {}).accessibility || {}; return !!(a.legend.display && b.keyboardNavigation && b.keyboardNavigation.enabled) }; return b
            }(u); (function (a) {
                function b(a) {
                    var b =
                        this.legend.allItems, d = this.accessibility && this.accessibility.components.legend.highlightedLegendItemIx, c = b[a], l = c.legendItem || {}; return c ? (g(d) && b[d] && n(!1, b[d]), b = this.legend, a = (b.allItems[a].legendItem || {}).pageIx, d = b.currentPage, "undefined" !== typeof a && a + 1 !== d && b.scroll(1 + a - d), l = l.label, a = c.a11yProxyElement && c.a11yProxyElement.buttonElement, l && l.element && a && this.setFocusToElement(l, a), n(!0, c), !0) : !1
                } function c(a) {
                    var b = a.item; this.chart.options.accessibility.enabled && b && b.a11yProxyElement && b.a11yProxyElement.buttonElement.setAttribute("aria-pressed",
                        a.visible ? "true" : "false")
                } var e = []; a.compose = function (a, l) { -1 === e.indexOf(a) && (e.push(a), a.prototype.highlightLegendItem = b); -1 === e.indexOf(l) && (e.push(l), d(l, "afterColorizeItem", c)) }
            })(a || (a = {})); return a
    }); A(a, "Accessibility/Components/SeriesComponent/SeriesDescriber.js", [a["Accessibility/Components/AnnotationsA11y.js"], a["Accessibility/Utils/ChartUtilities.js"], a["Core/FormatUtilities.js"], a["Accessibility/Utils/HTMLUtilities.js"], a["Core/Utilities.js"]], function (a, h, m, p, u) {
        function q(a) {
            var b =
                a.index; return a.series && a.series.data && H(b) ? t(a.series.data, function (a) { return !!(a && "undefined" !== typeof a.index && a.index > b && a.graphic && a.graphic.element) }) || null : null
        } function w(a) { var b = a.chart.options.accessibility.series.pointDescriptionEnabledThreshold; return !!(!1 !== b && a.points && a.points.length >= b) } function y(a) { var b = a.options.accessibility || {}; return !w(a) && !b.exposeAsGroupOnly } function f(a) {
            var b = a.chart.options.accessibility.keyboardNavigation.seriesNavigation; return !(!a.points || !(a.points.length <
                b.pointNavigationEnabledThreshold || !1 === b.pointNavigationEnabledThreshold))
        } function n(a, b) { var d = a.series, c = d.chart; a = c.options.accessibility.point || {}; var l = d.options.accessibility && d.options.accessibility.point || {}; d = d.tooltipOptions || {}; c = c.options.lang; return C(b) ? E(b, l.valueDecimals || a.valueDecimals || d.valueDecimals || -1, c.decimalPoint, c.accessibility.thousandsSep || c.thousandsSep) : b } function k(a) {
            var b = (a.options.accessibility || {}).description; return b && a.chart.langFormat("accessibility.series.description",
                { description: b, series: a }) || ""
        } function c(a, b) { return a.chart.langFormat("accessibility.series." + b + "Description", { name: B(a[b]), series: a }) } function e(a, b, d) { var c = b || "", l = d || ""; return a.series.pointArrayMap.reduce(function (b, d) { b += b.length ? ", " : ""; var g = n(a, x(a[d], a.options[d])); return b + (d + ": " + c + g + l) }, "") } function d(a) {
            var b = a.series, d = 1 < b.chart.series.length || b.options.name, c = a.series; var l = c.chart; var g = c.options.accessibility; g = g && g.point && g.point.valueDescriptionFormat || l.options.accessibility.point.valueDescriptionFormat;
            c = x(c.xAxis && c.xAxis.options.accessibility && c.xAxis.options.accessibility.enabled, !l.angular); if (c) {
                var v = a.series; var t = v.chart; var r = v.options.accessibility && v.options.accessibility.point || {}, C = t.options.accessibility.point || {}; (v = v.xAxis && v.xAxis.dateTime) ? (v = v.getXDateFormat(a.x || 0, t.options.tooltip.dateTimeLabelFormats), r = r.dateFormatter && r.dateFormatter(a) || C.dateFormatter && C.dateFormatter(a) || r.dateFormat || C.dateFormat || v, t = t.time.dateFormat(r, a.x || 0, void 0)) : t = void 0; r = (a.series.xAxis || {}).categories &&
                    H(a.category) && ("" + a.category).replace("<br/>", " "); C = H(a.id) && 0 > ("" + a.id).indexOf("highcharts-"); v = "x, " + a.x; t = a.name || t || r || (C ? a.id : v)
            } else t = ""; r = H(a.index) ? a.index + 1 : ""; C = a.series; var f = C.chart.options.accessibility.point || {}, k = C.chart.options.accessibility && C.chart.options.accessibility.point || {}, B = C.tooltipOptions || {}; v = k.valuePrefix || f.valuePrefix || B.valuePrefix || ""; f = k.valueSuffix || f.valueSuffix || B.valueSuffix || ""; k = n(a, a["undefined" !== typeof a.value ? "value" : "y"]); C = a.isNull ? C.chart.langFormat("accessibility.series.nullPointValue",
                { point: a }) : C.pointArrayMap ? e(a, v, f) : v + k + f; l = F(g, { point: a, index: r, xDescription: t, value: C, separator: c ? ", " : "" }, l); g = (g = a.options && a.options.accessibility && a.options.accessibility.description) ? " " + g : ""; b = d ? " " + b.name + "." : ""; d = a.series.chart; c = z(a); t = { point: a, annotations: c }; d = c.length ? d.langFormat("accessibility.series.pointAnnotationsDescription", t) : ""; a.accessibility = a.accessibility || {}; a.accessibility.valueDescription = l; return l + g + b + (d ? " " + d : "")
        } function b(a) {
            var b = y(a), c = f(a), g = a.chart.options.accessibility.point.describeNull;
            (b || c) && a.points.forEach(function (c) {
                var e; if (!(e = c.graphic && c.graphic.element)) {
                    var v = c.series; e = v && v.chart; v = v && v.is("sunburst"); e = e && e.options.accessibility.point.describeNull; if (e = c.isNull && !v && e) {
                        v = c.series; var t = q(c); v = (e = t && t.graphic) ? e.parentGroup : v.graph || v.group; t = t ? { x: x(c.plotX, t.plotX, 0), y: x(c.plotY, t.plotY, 0) } : { x: x(c.plotX, 0), y: x(c.plotY, 0) }; t = c.series.chart.renderer.rect(t.x, t.y, 1, 1); t.attr({ "class": "highcharts-a11y-mock-point", fill: "none", opacity: 0, "fill-opacity": 0, "stroke-opacity": 0 });
                        v && v.element ? (c.graphic = t, c.hasMockGraphic = !0, t.add(v), v.element.insertBefore(t.element, e ? e.element : null), e = t.element) : e = void 0
                    }
                } v = c.options && c.options.accessibility && !1 === c.options.accessibility.enabled; e && (c.isNull && !g ? e.setAttribute("aria-hidden", !0) : (e.setAttribute("tabindex", "-1"), a.chart.styledMode || (e.style.outline = "none"), b && !v ? (t = c.series, v = t.chart.options.accessibility.point || {}, t = t.options.accessibility && t.options.accessibility.point || {}, c = l(t.descriptionFormatter && t.descriptionFormatter(c) ||
                    v.descriptionFormatter && v.descriptionFormatter(c) || d(c)), e.setAttribute("role", "img"), e.setAttribute("aria-label", c)) : e.setAttribute("aria-hidden", !0)))
            })
        } function g(a) {
            var b = a.chart, d = b.types || [], l = k(a), g = function (d) { return b[d] && 1 < b[d].length && a[d] }, e = a.index + 1, t = c(a, "xAxis"), v = c(a, "yAxis"), x = { seriesNumber: e, series: a, chart: b }; d = 1 < d.length ? "Combination" : ""; x = b.langFormat("accessibility.series.summary." + a.type + d, x) || b.langFormat("accessibility.series.summary.default" + d, x); g = (g("yAxis") ? " " + v + "." :
                "") + (g("xAxis") ? " " + t + "." : ""); return F(b.options.accessibility.series.descriptionFormat || "", { seriesDescription: x, authorDescription: l ? " " + l : "", axisDescription: g, series: a, chart: b, seriesNumber: e }, void 0)
        } var z = a.getPointAnnotationTexts, B = h.getAxisDescription, J = h.getSeriesFirstPointElement, G = h.getSeriesA11yElement, D = h.unhideChartElementFromAT, F = m.format, E = m.numberFormat, r = p.reverseChildNodes, l = p.stripHTMLTagsFromString, t = u.find, C = u.isNumber, x = u.pick, H = u.defined; return {
            defaultPointDescriptionFormatter: d,
            defaultSeriesDescriptionFormatter: g, describeSeries: function (a) {
                var d = a.chart, c = J(a), e = G(a), t = d.is3d && d.is3d(); if (e) {
                    e.lastChild !== c || t || r(e); b(a); D(d, e); t = a.chart; d = t.options.chart; c = 1 < t.series.length; t = t.options.accessibility.series.describeSingleSeries; var x = (a.options.accessibility || {}).exposeAsGroupOnly; d.options3d && d.options3d.enabled && c || !(c || t || x || w(a)) ? e.removeAttribute("aria-label") : (d = a.chart.options.accessibility, c = d.landmarkVerbosity, (a.options.accessibility || {}).exposeAsGroupOnly ? e.setAttribute("role",
                        "img") : "all" === c ? e.setAttribute("role", "region") : e.setAttribute("role", "group"), e.setAttribute("tabindex", "-1"), a.chart.styledMode || (e.style.outline = "none"), e.setAttribute("aria-label", l(d.series.descriptionFormatter && d.series.descriptionFormatter(a) || g(a))))
                }
            }
        }
    }); A(a, "Accessibility/Components/SeriesComponent/NewDataAnnouncer.js", [a["Core/Globals.js"], a["Core/Utilities.js"], a["Accessibility/Utils/Announcer.js"], a["Accessibility/Utils/ChartUtilities.js"], a["Accessibility/Utils/EventProvider.js"], a["Accessibility/Components/SeriesComponent/SeriesDescriber.js"]],
        function (a, h, m, p, u, q) {
            function w(a) { var b = a.series.data.filter(function (b) { return a.x === b.x && a.y === b.y }); return 1 === b.length ? b[0] : a } function y(a, b) { var d = (a || []).concat(b || []).reduce(function (a, b) { a[b.name + b.index] = b; return a }, {}); return Object.keys(d).map(function (a) { return d[a] }) } var f = h.addEvent, n = h.defined, k = p.getChartTitle, c = q.defaultPointDescriptionFormatter, e = q.defaultSeriesDescriptionFormatter; h = function () {
                function d(a) {
                    this.announcer = void 0; this.dirty = { allSeries: {} }; this.eventProvider = void 0;
                    this.lastAnnouncementTime = 0; this.chart = a
                } d.prototype.init = function () { var a = this.chart, d = a.options.accessibility.announceNewData.interruptUser ? "assertive" : "polite"; this.lastAnnouncementTime = 0; this.dirty = { allSeries: {} }; this.eventProvider = new u; this.announcer = new m(a, d); this.addEventListeners() }; d.prototype.destroy = function () { this.eventProvider.removeAddedEvents(); this.announcer.destroy() }; d.prototype.addEventListeners = function () {
                    var a = this, d = this.chart, c = this.eventProvider; c.addEvent(d, "afterApplyDrilldown",
                        function () { a.lastAnnouncementTime = 0 }); c.addEvent(d, "afterAddSeries", function (b) { a.onSeriesAdded(b.series) }); c.addEvent(d, "redraw", function () { a.announceDirtyData() })
                }; d.prototype.onSeriesAdded = function (a) { this.chart.options.accessibility.announceNewData.enabled && (this.dirty.hasDirty = !0, this.dirty.allSeries[a.name + a.index] = a, this.dirty.newSeries = n(this.dirty.newSeries) ? void 0 : a) }; d.prototype.announceDirtyData = function () {
                    var a = this; if (this.chart.options.accessibility.announceNewData && this.dirty.hasDirty) {
                        var d =
                            this.dirty.newPoint; d && (d = w(d)); this.queueAnnouncement(Object.keys(this.dirty.allSeries).map(function (b) { return a.dirty.allSeries[b] }), this.dirty.newSeries, d); this.dirty = { allSeries: {} }
                    }
                }; d.prototype.queueAnnouncement = function (a, d, c) {
                    var b = this, e = this.chart.options.accessibility.announceNewData; if (e.enabled) {
                        var g = +new Date; e = Math.max(0, e.minAnnounceInterval - (g - this.lastAnnouncementTime)); a = y(this.queuedAnnouncement && this.queuedAnnouncement.series, a); if (d = this.buildAnnouncementMessage(a, d, c)) this.queuedAnnouncement &&
                            clearTimeout(this.queuedAnnouncementTimer), this.queuedAnnouncement = { time: g, message: d, series: a }, this.queuedAnnouncementTimer = setTimeout(function () { b && b.announcer && (b.lastAnnouncementTime = +new Date, b.announcer.announce(b.queuedAnnouncement.message), delete b.queuedAnnouncement, delete b.queuedAnnouncementTimer) }, e)
                    }
                }; d.prototype.buildAnnouncementMessage = function (b, d, z) {
                    var g = this.chart, f = g.options.accessibility.announceNewData; if (f.announcementFormatter && (b = f.announcementFormatter(b, d, z), !1 !== b)) return b.length ?
                        b : null; b = a.charts && 1 < a.charts.length ? "Multiple" : "Single"; b = d ? "newSeriesAnnounce" + b : z ? "newPointAnnounce" + b : "newDataAnnounce"; f = k(g); return g.langFormat("accessibility.announceNewData." + b, { chartTitle: f, seriesDesc: d ? e(d) : null, pointDesc: z ? c(z) : null, point: z, series: d })
                }; return d
            }(); (function (a) {
                function b(a) { var b = this.chart, d = this.newDataAnnouncer; d && d.chart === b && b.options.accessibility.announceNewData.enabled && (d.dirty.newPoint = n(d.dirty.newPoint) ? void 0 : a.point) } function d() {
                    var a = this.chart, b = this.newDataAnnouncer;
                    b && b.chart === a && a.options.accessibility.announceNewData.enabled && (b.dirty.hasDirty = !0, b.dirty.allSeries[this.name + this.index] = this)
                } a.composedClasses = []; a.compose = function (c) { -1 === a.composedClasses.indexOf(c) && (a.composedClasses.push(c), f(c, "addPoint", b), f(c, "updatedData", d)) }
            })(h || (h = {})); return h
        }); A(a, "Accessibility/ProxyElement.js", [a["Core/Globals.js"], a["Core/Utilities.js"], a["Accessibility/Utils/EventProvider.js"], a["Accessibility/Utils/ChartUtilities.js"], a["Accessibility/Utils/HTMLUtilities.js"]],
            function (a, h, m, p, u) {
                var q = a.doc, w = h.attr, y = h.css, f = h.merge, n = p.fireEventOnWrappedOrUnwrappedElement, k = u.cloneMouseEvent, c = u.cloneTouchEvent, e = u.getFakeMouseEvent, d = u.removeElement; return function () {
                    function a(a, b, d, c) {
                        this.chart = a; this.target = b; this.groupType = d; d = "ul" === d; this.eventProvider = new m; var e = d ? q.createElement("li") : null, g = this.buttonElement = q.createElement("button"); a.styledMode || this.hideButtonVisually(g); e ? (d && !a.styledMode && (e.style.listStyle = "none"), e.appendChild(g), this.element = e) :
                            this.element = g; this.updateTarget(b, c)
                    } a.prototype.click = function () { var a = this.getTargetPosition(); a.x += a.width / 2; a.y += a.height / 2; a = e("click", a); n(this.target.click, a) }; a.prototype.updateTarget = function (a, b) { this.target = a; this.updateCSSClassName(); var d = b || {}; Object.keys(d).forEach(function (a) { null === d[a] && delete d[a] }); w(this.buttonElement, f({ "aria-label": this.getTargetAttr(a.click, "aria-label") }, d)); this.eventProvider.removeAddedEvents(); this.addProxyEventsToButton(this.buttonElement, a.click); this.refreshPosition() };
                    a.prototype.refreshPosition = function () { var a = this.getTargetPosition(); y(this.buttonElement, { width: (a.width || 1) + "px", height: (a.height || 1) + "px", left: (Math.round(a.x) || 0) + "px", top: (Math.round(a.y) || 0) + "px" }) }; a.prototype.remove = function () { this.eventProvider.removeAddedEvents(); d(this.element) }; a.prototype.updateCSSClassName = function () {
                        var a = this.chart.legend; a = a.group && a.group.div; a = -1 < (a && a.className || "").indexOf("highcharts-no-tooltip"); var b = -1 < (this.getTargetAttr(this.target.click, "class") || "").indexOf("highcharts-no-tooltip");
                        this.buttonElement.className = a || b ? "highcharts-a11y-proxy-button highcharts-no-tooltip" : "highcharts-a11y-proxy-button"
                    }; a.prototype.addProxyEventsToButton = function (a, b) { var d = this; "click touchstart touchend touchcancel touchmove mouseover mouseenter mouseleave mouseout".split(" ").forEach(function (e) { var g = 0 === e.indexOf("touch"); d.eventProvider.addEvent(a, e, function (a) { var d = g ? c(a) : k(a); b && n(b, d); a.stopPropagation(); g || a.preventDefault() }, { passive: !1 }) }) }; a.prototype.hideButtonVisually = function (a) {
                        y(a,
                            { borderWidth: 0, backgroundColor: "transparent", cursor: "pointer", outline: "none", opacity: .001, filter: "alpha(opacity=1)", zIndex: 999, overflow: "hidden", padding: 0, margin: 0, display: "block", position: "absolute", "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=1)" })
                    }; a.prototype.getTargetPosition = function () {
                        var a = this.target.click; a = a.element ? a.element : a; a = this.target.visual || a; if (this.chart.renderTo && a && a.getBoundingClientRect) {
                            a = a.getBoundingClientRect(); var b = this.chart.pointer.getChartPosition();
                            return { x: (a.left - b.left) / b.scaleX, y: (a.top - b.top) / b.scaleY, width: a.right / b.scaleX - a.left / b.scaleX, height: a.bottom / b.scaleY - a.top / b.scaleY }
                        } return { x: 0, y: 0, width: 1, height: 1 }
                    }; a.prototype.getTargetAttr = function (a, b) { return a.element ? a.element.getAttribute(b) : a.getAttribute(b) }; return a
                }()
            }); A(a, "Accessibility/ProxyProvider.js", [a["Core/Globals.js"], a["Core/Utilities.js"], a["Accessibility/Utils/ChartUtilities.js"], a["Accessibility/Utils/DOMElementProvider.js"], a["Accessibility/Utils/HTMLUtilities.js"],
            a["Accessibility/ProxyElement.js"]], function (a, h, m, p, u, q) {
                var w = a.doc, y = h.attr, f = h.css, n = m.unhideChartElementFromAT, k = u.removeElement, c = u.removeChildNodes; return function () {
                    function a(a) { this.chart = a; this.domElementProvider = new p; this.groups = {}; this.groupOrder = []; this.beforeChartProxyPosContainer = this.createProxyPosContainer("before"); this.afterChartProxyPosContainer = this.createProxyPosContainer("after"); this.update() } a.prototype.addProxyElement = function (a, b, c) {
                        var d = this.groups[a]; if (!d) throw Error("ProxyProvider.addProxyElement: Invalid group key " +
                            a); a = new q(this.chart, b, d.type, c); d.proxyContainerElement.appendChild(a.element); d.proxyElements.push(a); return a
                    }; a.prototype.addGroup = function (a, b, c) {
                        var d = this.groups[a]; if (d) return d.groupElement; d = this.domElementProvider.createElement(b); if (c && c.role && "div" !== b) { var e = this.domElementProvider.createElement("div"); e.appendChild(d) } else e = d; e.className = "highcharts-a11y-proxy-group highcharts-a11y-proxy-group-" + a.replace(/\W/g, "-"); this.groups[a] = { proxyContainerElement: d, groupElement: e, type: b, proxyElements: [] };
                        y(e, c || {}); "ul" === b && d.setAttribute("role", "list"); this.afterChartProxyPosContainer.appendChild(e); this.updateGroupOrder(this.groupOrder); return e
                    }; a.prototype.updateGroupAttrs = function (a, b) { var d = this.groups[a]; if (!d) throw Error("ProxyProvider.updateGroupAttrs: Invalid group key " + a); y(d.groupElement, b) }; a.prototype.updateGroupOrder = function (a) {
                        var b = this; this.groupOrder = a.slice(); if (!this.isDOMOrderGroupOrder()) {
                            var d = a.indexOf("series"), e = -1 < d ? a.slice(0, d) : a, f = -1 < d ? a.slice(d + 1) : []; a = w.activeElement;
                            ["before", "after"].forEach(function (a) { var d = b["before" === a ? "beforeChartProxyPosContainer" : "afterChartProxyPosContainer"]; a = "before" === a ? e : f; c(d); a.forEach(function (a) { (a = b.groups[a]) && d.appendChild(a.groupElement) }) }); (this.beforeChartProxyPosContainer.contains(a) || this.afterChartProxyPosContainer.contains(a)) && a && a.focus && a.focus()
                        }
                    }; a.prototype.clearGroup = function (a) { var b = this.groups[a]; if (!b) throw Error("ProxyProvider.clearGroup: Invalid group key " + a); c(b.proxyContainerElement) }; a.prototype.removeGroup =
                        function (a) { var b = this.groups[a]; b && (k(b.groupElement), delete this.groups[a]) }; a.prototype.update = function () { this.updatePosContainerPositions(); this.updateGroupOrder(this.groupOrder); this.updateProxyElementPositions() }; a.prototype.updateProxyElementPositions = function () { Object.keys(this.groups).forEach(this.updateGroupProxyElementPositions.bind(this)) }; a.prototype.updateGroupProxyElementPositions = function (a) { (a = this.groups[a]) && a.proxyElements.forEach(function (a) { return a.refreshPosition() }) }; a.prototype.destroy =
                            function () { this.domElementProvider.destroyCreatedElements() }; a.prototype.createProxyPosContainer = function (a) { var b = this.domElementProvider.createElement("div"); b.setAttribute("aria-hidden", "false"); b.className = "highcharts-a11y-proxy-container" + (a ? "-" + a : ""); f(b, { top: "0", left: "0" }); this.chart.styledMode || (b.style.whiteSpace = "nowrap", b.style.position = "absolute"); return b }; a.prototype.getCurrentGroupOrderInDOM = function () {
                                var a = this, b = function (b) {
                                    var d = []; b = b.children; for (var c = 0; c < b.length; ++c) {
                                        a: {
                                            var e =
                                                b[c]; for (var g = Object.keys(a.groups), f = g.length; f--;) { var k = g[f], r = a.groups[k]; if (r && e === r.groupElement) { e = k; break a } } e = void 0
                                        } e && d.push(e)
                                    } return d
                                }, c = b(this.beforeChartProxyPosContainer); b = b(this.afterChartProxyPosContainer); c.push("series"); return c.concat(b)
                            }; a.prototype.isDOMOrderGroupOrder = function () { var a = this, b = this.getCurrentGroupOrderInDOM(), c = this.groupOrder.filter(function (b) { return "series" === b || !!a.groups[b] }), e = b.length; if (e !== c.length) return !1; for (; e--;)if (b[e] !== c[e]) return !1; return !0 };
                    a.prototype.updatePosContainerPositions = function () { var a = this.chart; if (!a.renderer.forExport) { var b = a.renderer.box; a.container.insertBefore(this.afterChartProxyPosContainer, b.nextSibling); a.container.insertBefore(this.beforeChartProxyPosContainer, b); n(this.chart, this.afterChartProxyPosContainer); n(this.chart, this.beforeChartProxyPosContainer) } }; return a
                }()
            }); A(a, "Stock/RangeSelector/RangeSelectorDefaults.js", [], function () {
                return {
                    lang: { rangeSelectorZoom: "Zoom", rangeSelectorFrom: "", rangeSelectorTo: "\u2192" },
                    rangeSelector: {
                        allButtonsEnabled: !1, buttons: void 0, buttonSpacing: 5, dropdown: "responsive", enabled: void 0, verticalAlign: "top", buttonTheme: { width: 28, height: 18, padding: 2, zIndex: 7 }, floating: !1, x: 0, y: 0, height: void 0, inputBoxBorderColor: "none", inputBoxHeight: 17, inputBoxWidth: void 0, inputDateFormat: "%b %e, %Y", inputDateParser: void 0, inputEditDateFormat: "%Y-%m-%d", inputEnabled: !0, inputPosition: { align: "right", x: 0, y: 0 }, inputSpacing: 5, selected: void 0, buttonPosition: { align: "left", x: 0, y: 0 }, inputStyle: {
                            color: "#335cad",
                            cursor: "pointer"
                        }, labelStyle: { color: "#666666" }
                    }
                }
            }); A(a, "Stock/RangeSelector/RangeSelectorComposition.js", [a["Core/Defaults.js"], a["Stock/RangeSelector/RangeSelectorDefaults.js"], a["Core/Utilities.js"]], function (a, h, m) {
                function p() {
                    var a = this.range, b = a.type, d = this.max, c = this.chart.time, e = function (a, d) { var e = "year" === b ? "FullYear" : "Month", l = new c.Date(a), g = c.get(e, l); c.set(e, l, g + d); g === c.get(e, l) && c.set("Date", l, 0); return l.getTime() - a }; if (B(a)) { var g = d - a; var v = a } else a && (g = d + e(d, -(a.count || 1)), this.chart &&
                        (this.chart.fixedRange = d - g)); var f = G(this.dataMin, Number.MIN_VALUE); B(g) || (g = f); g <= f && (g = f, "undefined" === typeof v && (v = e(g, a.count)), this.newMax = Math.min(g + v, G(this.dataMax, Number.MAX_VALUE))); B(d) ? !B(a) && a && a._offsetMin && (g += a._offsetMin) : g = void 0; return g
                } function u() { this.options.rangeSelector && this.options.rangeSelector.enabled && (this.rangeSelector = new E(this)) } function q() {
                    var a = this.axes, b = this.rangeSelector; b && (B(b.deferredYTDClick) && (b.clickButton(b.deferredYTDClick), delete b.deferredYTDClick),
                        a.forEach(function (a) { a.updateNames(); a.setScale() }), this.getAxisMargins(), b.render(), a = b.options.verticalAlign, b.options.floating || ("bottom" === a ? this.extraBottomMargin = !0 : "middle" !== a && (this.extraTopMargin = !0)))
                } function w(a) {
                    var b, c, e, g, f = a.rangeSelector, v = function () {
                        f && (b = a.xAxis[0].getExtremes(), c = a.legend, g = f && f.options.verticalAlign, B(b.min) && f.render(b.min, b.max), c.display && "top" === g && g === c.options.verticalAlign && (e = A(a.spacingBox), e.y = "vertical" === c.options.layout ? a.plotTop : e.y + f.getHeight(),
                            c.group.placed = !1, c.align(e)))
                    }; f && (z(D, function (b) { return b[0] === a }) || D.push([a, [d(a.xAxis[0], "afterSetExtremes", function (a) { f && f.render(a.min, a.max) }), d(a, "redraw", v)]]), v())
                } function y() { for (var a = 0, b = D.length; a < b; ++a) { var d = D[a]; if (d[0] === this) { d[1].forEach(function (a) { return a() }); D.splice(a, 1); break } } } function f() { var a = this.rangeSelector; a && (a = a.getHeight(), this.extraTopMargin && (this.plotTop += a), this.extraBottomMargin && (this.marginBottom += a)) } function n() {
                    var a = this.rangeSelector; a && !a.options.floating &&
                        (a.render(), a = a.options.verticalAlign, "bottom" === a ? this.extraBottomMargin = !0 : "middle" !== a && (this.extraTopMargin = !0))
                } function k(a) {
                    var d = a.options.rangeSelector; a = this.extraBottomMargin; var c = this.extraTopMargin, e = this.rangeSelector; d && d.enabled && !b(e) && this.options.rangeSelector && (this.options.rangeSelector.enabled = !0, this.rangeSelector = e = new E(this)); this.extraTopMargin = this.extraBottomMargin = !1; e && (w(this), d = d && d.verticalAlign || e.options && e.options.verticalAlign, e.options.floating || ("bottom" ===
                        d ? this.extraBottomMargin = !0 : "middle" !== d && (this.extraTopMargin = !0)), this.extraBottomMargin !== a || this.extraTopMargin !== c) && (this.isDirtyBox = !0)
                } var c = a.defaultOptions, e = a.setOptions, d = m.addEvent, b = m.defined, g = m.extend, z = m.find, B = m.isNumber, A = m.merge, G = m.pick, D = [], F = [], E; return {
                    compose: function (a, b, t) {
                        E = t; -1 === F.indexOf(a) && (F.push(a), a.prototype.minFromRange = p); -1 === F.indexOf(b) && (F.push(b), d(b, "afterGetContainer", u), d(b, "beforeRender", q), d(b, "destroy", y), d(b, "getMargins", f), d(b, "render", n), d(b, "update",
                            k), b.prototype.callbacks.push(w)); -1 === F.indexOf(e) && (g(c, { rangeSelector: h.rangeSelector }), g(c.lang, h.lang))
                    }
                }
            }); A(a, "Stock/RangeSelector/RangeSelector.js", [a["Core/Axis/Axis.js"], a["Core/Defaults.js"], a["Core/Globals.js"], a["Stock/RangeSelector/RangeSelectorComposition.js"], a["Core/Renderer/SVG/SVGElement.js"], a["Core/Utilities.js"]], function (a, h, m, p, u, q) {
                function w(a) {
                    if (-1 !== a.indexOf("%L")) return "text"; var b = "aAdewbBmoyY".split("").some(function (b) { return -1 !== a.indexOf("%" + b) }), d = "HkIlMS".split("").some(function (b) {
                        return -1 !==
                            a.indexOf("%" + b)
                    }); return b && d ? "datetime-local" : b ? "date" : d ? "time" : "text"
                } var y = h.defaultOptions, f = q.addEvent, n = q.createElement, k = q.css, c = q.defined, e = q.destroyObjectProperties, d = q.discardElement, b = q.extend, g = q.fireEvent, z = q.isNumber, B = q.merge, A = q.objectEach, G = q.pad, D = q.pick, F = q.pInt, E = q.splat; h = function () {
                    function r(a) { this.buttons = void 0; this.buttonOptions = r.prototype.defaultButtons; this.initialButtonGroupWidth = 0; this.options = void 0; this.chart = a; this.init(a) } r.compose = function (a, b) {
                        p.compose(a, b,
                            r)
                    }; r.prototype.clickButton = function (b, d) {
                        var e = this.chart, l = this.buttonOptions[b], t = e.xAxis[0], v = e.scroller && e.scroller.getUnionExtremes() || t || {}, k = l.type, n = l.dataGrouping, r = v.dataMin, h = v.dataMax, m = t && Math.round(Math.min(t.max, D(h, t.max))); v = l._range; var q, u = !0; if (null !== r && null !== h) {
                            e.fixedRange = v; this.setSelected(b); n && (this.forcedDataGrouping = !0, a.prototype.setDataGrouping.call(t || { chart: this.chart }, n, !1), this.frozenStates = l.preserveDataGrouping); if ("month" === k || "year" === k) if (t) {
                                k = {
                                    range: l, max: m,
                                    chart: e, dataMin: r, dataMax: h
                                }; var w = t.minFromRange.call(k); z(k.newMax) && (m = k.newMax); u = !1
                            } else v = l; else if (v) w = Math.max(m - v, r), m = Math.min(w + v, h), u = !1; else if ("ytd" === k) if (t) { if ("undefined" === typeof h || "undefined" === typeof r) r = Number.MAX_VALUE, h = Number.MIN_VALUE, e.series.forEach(function (a) { if (a = a.xData) r = Math.min(a[0], r), h = Math.max(a[a.length - 1], h) }), d = !1; k = this.getYTDExtremes(h, r, e.time.useUTC); w = q = k.min; m = k.max } else { this.deferredYTDClick = b; return } else "all" === k && t && (e.navigator && e.navigator.baseSeries[0] &&
                                (e.navigator.baseSeries[0].xAxis.options.range = void 0), w = r, m = h); u && l._offsetMin && c(w) && (w += l._offsetMin); l._offsetMax && c(m) && (m += l._offsetMax); this.dropdown && (this.dropdown.selectedIndex = b + 1); if (t) t.setExtremes(w, m, D(d, !0), void 0, { trigger: "rangeSelectorButton", rangeSelectorButton: l }); else { var p = E(e.options.xAxis)[0]; var B = p.range; p.range = v; var F = p.min; p.min = q; f(e, "load", function () { p.range = B; p.min = F }) } g(this, "afterBtnClick")
                        }
                    }; r.prototype.setSelected = function (a) {
                        this.selected = this.options.selected =
                            a
                    }; r.prototype.init = function (a) {
                        var b = this, d = a.options.rangeSelector, c = d.buttons || b.defaultButtons.slice(), e = d.selected, l = function () { var a = b.minInput, d = b.maxInput; a && a.blur && g(a, "blur"); d && d.blur && g(d, "blur") }; b.chart = a; b.options = d; b.buttons = []; b.buttonOptions = c; this.eventsToUnbind = []; this.eventsToUnbind.push(f(a.container, "mousedown", l)); this.eventsToUnbind.push(f(a, "resize", l)); c.forEach(b.computeButtonRange); "undefined" !== typeof e && c[e] && this.clickButton(e, !1); this.eventsToUnbind.push(f(a, "load",
                            function () { a.xAxis && a.xAxis[0] && f(a.xAxis[0], "setExtremes", function (d) { this.max - this.min !== a.fixedRange && "rangeSelectorButton" !== d.trigger && "updatedData" !== d.trigger && b.forcedDataGrouping && !b.frozenStates && this.setDataGrouping(!1, !1) }) }))
                    }; r.prototype.updateButtonStates = function () {
                        var a = this, b = this.chart, d = this.dropdown, c = b.xAxis[0], e = Math.round(c.max - c.min), g = !c.hasVisibleSeries, f = b.scroller && b.scroller.getUnionExtremes() || c, k = f.dataMin, r = f.dataMax; b = a.getYTDExtremes(r, k, b.time.useUTC); var n = b.min,
                            h = b.max, m = a.selected, q = a.options.allButtonsEnabled, u = a.buttons, w = z(m); a.buttonOptions.forEach(function (b, l) {
                                var v = b._range, t = b.type, x = b.count || 1, f = u[l], H = b._offsetMax - b._offsetMin, C = l === m, z = v > r - k, K = v < c.minRange; b = 0; var p = !1, E = !1; v = v === e; ("month" === t || "year" === t) && e + 36E5 >= 864E5 * { month: 28, year: 365 }[t] * x - H && e - 36E5 <= 864E5 * { month: 31, year: 366 }[t] * x + H ? v = !0 : "ytd" === t ? (v = h - n + H === e, p = !C) : "all" === t && (v = c.max - c.min >= r - k, E = !C && w && v); t = !q && (z || K || E || g); x = C && v || v && !w && !p || C && a.frozenStates; t ? b = 3 : x && (w = !0, b = 2); f.state !==
                                    b && (f.setState(b), d && (d.options[l + 1].disabled = t, 2 === b && (d.selectedIndex = l + 1)), 0 === b && m === l && a.setSelected())
                            })
                    }; r.prototype.computeButtonRange = function (a) { var b = a.type, d = a.count || 1, c = { millisecond: 1, second: 1E3, minute: 6E4, hour: 36E5, day: 864E5, week: 6048E5 }; if (c[b]) a._range = c[b] * d; else if ("month" === b || "year" === b) a._range = 864E5 * { month: 30, year: 365 }[b] * d; a._offsetMin = D(a.offsetMin, 0); a._offsetMax = D(a.offsetMax, 0); a._range += a._offsetMax - a._offsetMin }; r.prototype.getInputValue = function (a) {
                        a = "min" === a ? this.minInput :
                            this.maxInput; var b = this.chart.options.rangeSelector, d = this.chart.time; return a ? ("text" === a.type && b.inputDateParser || this.defaultInputDateParser)(a.value, d.useUTC, d) : 0
                    }; r.prototype.setInputValue = function (a, b) {
                        var d = this.options, e = this.chart.time, l = "min" === a ? this.minInput : this.maxInput; a = "min" === a ? this.minDateBox : this.maxDateBox; if (l) {
                            var g = l.getAttribute("data-hc-time"); g = c(g) ? Number(g) : void 0; c(b) && (c(g) && l.setAttribute("data-hc-time-previous", g), l.setAttribute("data-hc-time", b), g = b); l.value = e.dateFormat(this.inputTypeFormats[l.type] ||
                                d.inputEditDateFormat, g); a && a.attr({ text: e.dateFormat(d.inputDateFormat, g) })
                        }
                    }; r.prototype.setInputExtremes = function (a, b, d) { if (a = "min" === a ? this.minInput : this.maxInput) { var c = this.inputTypeFormats[a.type], e = this.chart.time; c && (b = e.dateFormat(c, b), a.min !== b && (a.min = b), d = e.dateFormat(c, d), a.max !== d && (a.max = d)) } }; r.prototype.showInput = function (a) {
                        var b = "min" === a ? this.minDateBox : this.maxDateBox; if ((a = "min" === a ? this.minInput : this.maxInput) && b && this.inputGroup) {
                            var d = "text" === a.type, c = this.inputGroup, e =
                                c.translateX; c = c.translateY; var l = this.options.inputBoxWidth; k(a, { width: d ? b.width + (l ? -2 : 20) + "px" : "auto", height: d ? b.height - 2 + "px" : "auto", border: "2px solid silver" }); d && l ? k(a, { left: e + b.x + "px", top: c + "px" }) : k(a, { left: Math.min(Math.round(b.x + e - (a.offsetWidth - b.width) / 2), this.chart.chartWidth - a.offsetWidth) + "px", top: c - (a.offsetHeight - b.height) / 2 + "px" })
                        }
                    }; r.prototype.hideInput = function (a) { (a = "min" === a ? this.minInput : this.maxInput) && k(a, { top: "-9999em", border: 0, width: "1px", height: "1px" }) }; r.prototype.defaultInputDateParser =
                        function (a, b, d) { var c = a.split("/").join("-").split(" ").join("T"); -1 === c.indexOf("T") && (c += "T00:00"); if (b) c += "Z"; else { var e; if (e = m.isSafari) e = c, e = !(6 < e.length && (e.lastIndexOf("-") === e.length - 6 || e.lastIndexOf("+") === e.length - 6)); e && (e = (new Date(c)).getTimezoneOffset() / 60, c += 0 >= e ? "+".concat(G(-e), ":00") : "-".concat(G(e), ":00")) } c = Date.parse(c); z(c) || (a = a.split("-"), c = Date.UTC(F(a[0]), F(a[1]) - 1, F(a[2]))); d && b && z(c) && (c += d.getTimezoneOffset(c)); return c }; r.prototype.drawInput = function (a) {
                            function d() {
                                var b =
                                    l.maxInput, d = l.minInput, e = c.xAxis[0], g = c.scroller && c.scroller.xAxis ? c.scroller.xAxis : e, v = g.dataMin; g = g.dataMax; var f = l.getInputValue(a); f !== Number(p.getAttribute("data-hc-time-previous")) && z(f) && (p.setAttribute("data-hc-time-previous", f), q && b && z(v) ? f > Number(b.getAttribute("data-hc-time")) ? f = void 0 : f < v && (f = v) : d && z(g) && (f < Number(d.getAttribute("data-hc-time")) ? f = void 0 : f > g && (f = g)), "undefined" !== typeof f && e.setExtremes(q ? f : e.min, q ? e.max : f, void 0, void 0, { trigger: "rangeSelectorInput" }))
                            } var c = this.chart,
                                e = this.div, g = this.inputGroup, l = this, f = c.renderer.style || {}, r = c.renderer, h = c.options.rangeSelector, q = "min" === a, u = y.lang[q ? "rangeSelectorFrom" : "rangeSelectorTo"] || ""; u = r.label(u, 0).addClass("highcharts-range-label").attr({ padding: u ? 2 : 0, height: u ? h.inputBoxHeight : 0 }).add(g); r = r.label("", 0).addClass("highcharts-range-input").attr({ padding: 2, width: h.inputBoxWidth, height: h.inputBoxHeight, "text-align": "center" }).on("click", function () { l.showInput(a); l[a + "Input"].focus() }); c.styledMode || r.attr({
                                    stroke: h.inputBoxBorderColor,
                                    "stroke-width": 1
                                }); r.add(g); var p = n("input", { name: a, className: "highcharts-range-selector" }, void 0, e); p.setAttribute("type", w(h.inputDateFormat || "%b %e, %Y")); c.styledMode || (u.css(B(f, h.labelStyle)), r.css(B({ color: "#333333" }, f, h.inputStyle)), k(p, b({ position: "absolute", border: 0, boxShadow: "0 0 15px rgba(0,0,0,0.3)", width: "1px", height: "1px", padding: 0, textAlign: "center", fontSize: f.fontSize, fontFamily: f.fontFamily, top: "-9999em" }, h.inputStyle))); p.onfocus = function () { l.showInput(a) }; p.onblur = function () {
                                    p ===
                                    m.doc.activeElement && d(); l.hideInput(a); l.setInputValue(a); p.blur()
                                }; var E = !1; p.onchange = function () { E || (d(), l.hideInput(a), p.blur()) }; p.onkeypress = function (a) { 13 === a.keyCode && d() }; p.onkeydown = function (a) { E = !0; 38 !== a.keyCode && 40 !== a.keyCode || d() }; p.onkeyup = function () { E = !1 }; return { dateBox: r, input: p, label: u }
                        }; r.prototype.getPosition = function () {
                            var a = this.chart, b = a.options.rangeSelector; a = "top" === b.verticalAlign ? a.plotTop - a.axisOffset[0] : 0; return {
                                buttonTop: a + b.buttonPosition.y, inputTop: a + b.inputPosition.y -
                                    10
                            }
                        }; r.prototype.getYTDExtremes = function (a, b, d) { var c = this.chart.time, e = new c.Date(a), g = c.get("FullYear", e); d = d ? c.Date.UTC(g, 0, 1) : +new c.Date(g, 0, 1); b = Math.max(b, d); e = e.getTime(); return { max: Math.min(a || e, e), min: b } }; r.prototype.render = function (a, b) {
                            var d = this.chart, e = d.renderer, g = d.container, l = d.options, f = l.rangeSelector, k = D(l.chart.style && l.chart.style.zIndex, 0) + 1; l = f.inputEnabled; if (!1 !== f.enabled) {
                                this.rendered || (this.group = e.g("range-selector-group").attr({ zIndex: 7 }).add(), this.div = n("div", void 0,
                                    { position: "relative", height: 0, zIndex: k }), this.buttonOptions.length && this.renderButtons(), g.parentNode && g.parentNode.insertBefore(this.div, g), l && (this.inputGroup = e.g("input-group").add(this.group), e = this.drawInput("min"), this.minDateBox = e.dateBox, this.minLabel = e.label, this.minInput = e.input, e = this.drawInput("max"), this.maxDateBox = e.dateBox, this.maxLabel = e.label, this.maxInput = e.input)); if (l && (this.setInputValue("min", a), this.setInputValue("max", b), a = d.scroller && d.scroller.getUnionExtremes() || d.xAxis[0] ||
                                        {}, c(a.dataMin) && c(a.dataMax) && (d = d.xAxis[0].minRange || 0, this.setInputExtremes("min", a.dataMin, Math.min(a.dataMax, this.getInputValue("max")) - d), this.setInputExtremes("max", Math.max(a.dataMin, this.getInputValue("min")) + d, a.dataMax)), this.inputGroup)) { var t = 0;[this.minLabel, this.minDateBox, this.maxLabel, this.maxDateBox].forEach(function (a) { if (a) { var b = a.getBBox().width; b && (a.attr({ x: t }), t += b + f.inputSpacing) } }) } this.alignElements(); this.rendered = !0
                            }
                        }; r.prototype.renderButtons = function () {
                            var a = this, b =
                                this.buttons, d = this.options, c = y.lang, e = this.chart.renderer, v = B(d.buttonTheme), k = v && v.states, r = v.width || 28; delete v.width; delete v.states; this.buttonGroup = e.g("range-selector-buttons").add(this.group); var h = this.dropdown = n("select", void 0, { position: "absolute", width: "1px", height: "1px", padding: 0, border: 0, top: "-9999em", cursor: "pointer", opacity: .0001 }, this.div); f(h, "touchstart", function () { h.style.fontSize = "16px" });[[m.isMS ? "mouseover" : "mouseenter"], [m.isMS ? "mouseout" : "mouseleave"], ["change", "click"]].forEach(function (d) {
                                    var c =
                                        d[0], e = d[1]; f(h, c, function () { var d = b[a.currentButtonIndex()]; d && g(d.element, e || c) })
                                }); this.zoomText = e.label(c && c.rangeSelectorZoom || "", 0).attr({ padding: d.buttonTheme.padding, height: d.buttonTheme.height, paddingLeft: 0, paddingRight: 0 }).add(this.buttonGroup); this.chart.styledMode || (this.zoomText.css(d.labelStyle), v["stroke-width"] = D(v["stroke-width"], 0)); n("option", { textContent: this.zoomText.textStr, disabled: !0 }, void 0, h); this.buttonOptions.forEach(function (d, c) {
                                    n("option", { textContent: d.title || d.text },
                                        void 0, h); b[c] = e.button(d.text, 0, 0, function (b) { var e = d.events && d.events.click, g; e && (g = e.call(d, b)); !1 !== g && a.clickButton(c); a.isActive = !0 }, v, k && k.hover, k && k.select, k && k.disabled).attr({ "text-align": "center", width: r }).add(a.buttonGroup); d.title && b[c].attr("title", d.title)
                                })
                        }; r.prototype.alignElements = function () {
                            var a = this, b = this.buttonGroup, d = this.buttons, c = this.chart, e = this.group, g = this.inputGroup, f = this.options, k = this.zoomText, r = c.options, h = r.exporting && !1 !== r.exporting.enabled && r.navigation && r.navigation.buttonOptions;
                            r = f.buttonPosition; var n = f.inputPosition, m = f.verticalAlign, z = function (b, d) { return h && a.titleCollision(c) && "top" === m && "right" === d.align && d.y - b.getBBox().height - 12 < (h.y || 0) + (h.height || 0) + c.spacing[0] ? -40 : 0 }, q = c.plotLeft; if (e && r && n) {
                                var p = r.x - c.spacing[3]; if (b) {
                                    this.positionButtons(); if (!this.initialButtonGroupWidth) { var u = 0; k && (u += k.getBBox().width + 5); d.forEach(function (a, b) { u += a.width; b !== d.length - 1 && (u += f.buttonSpacing) }); this.initialButtonGroupWidth = u } q -= c.spacing[3]; this.updateButtonStates(); k =
                                        z(b, r); this.alignButtonGroup(k); e.placed = b.placed = c.hasLoaded
                                } b = 0; g && (b = z(g, n), "left" === n.align ? p = q : "right" === n.align && (p = -Math.max(c.axisOffset[1], -b)), g.align({ y: n.y, width: g.getBBox().width, align: n.align, x: n.x + p - 2 }, !0, c.spacingBox), g.placed = c.hasLoaded); this.handleCollision(b); e.align({ verticalAlign: m }, !0, c.spacingBox); g = e.alignAttr.translateY; b = e.getBBox().height + 20; z = 0; "bottom" === m && (z = (z = c.legend && c.legend.options) && "bottom" === z.verticalAlign && z.enabled && !z.floating ? c.legend.legendHeight + D(z.margin,
                                    10) : 0, b = b + z - 20, z = g - b - (f.floating ? 0 : f.y) - (c.titleOffset ? c.titleOffset[2] : 0) - 10); if ("top" === m) f.floating && (z = 0), c.titleOffset && c.titleOffset[0] && (z = c.titleOffset[0]), z += c.margin[0] - c.spacing[0] || 0; else if ("middle" === m) if (n.y === r.y) z = g; else if (n.y || r.y) z = 0 > n.y || 0 > r.y ? z - Math.min(n.y, r.y) : g - b; e.translate(f.x, f.y + Math.floor(z)); r = this.minInput; n = this.maxInput; g = this.dropdown; f.inputEnabled && r && n && (r.style.marginTop = e.translateY + "px", n.style.marginTop = e.translateY + "px"); g && (g.style.marginTop = e.translateY +
                                        "px")
                            }
                        }; r.prototype.alignButtonGroup = function (a, b) { var d = this.chart, c = this.buttonGroup, e = this.options.buttonPosition, g = d.plotLeft - d.spacing[3], l = e.x - d.spacing[3]; "right" === e.align ? l += a - g : "center" === e.align && (l -= g / 2); c && c.align({ y: e.y, width: D(b, this.initialButtonGroupWidth), align: e.align, x: l }, !0, d.spacingBox) }; r.prototype.positionButtons = function () {
                            var a = this.buttons, b = this.chart, d = this.options, c = this.zoomText, e = b.hasLoaded ? "animate" : "attr", g = d.buttonPosition, f = b = b.plotLeft; c && "hidden" !== c.visibility &&
                                (c[e]({ x: D(b + g.x, b) }), f += g.x + c.getBBox().width + 5); c = 0; for (g = this.buttonOptions.length; c < g; ++c)if ("hidden" !== a[c].visibility) a[c][e]({ x: f }), f += a[c].width + d.buttonSpacing; else a[c][e]({ x: b })
                        }; r.prototype.handleCollision = function (a) {
                            var b = this, d = this.chart, c = this.buttonGroup, e = this.inputGroup, g = this.options, f = g.buttonPosition, l = g.dropdown, k = g.inputPosition; g = function () { var a = 0; b.buttons.forEach(function (b) { b = b.getBBox(); b.width > a && (a = b.width) }); return a }; var r = function (b) {
                                if (e && c) {
                                    var d = e.alignAttr.translateX +
                                        e.alignOptions.x - a + e.getBBox().x + 2, g = e.alignOptions.width, l = c.alignAttr.translateX + c.getBBox().x; return l + b > d && d + g > l && f.y < k.y + e.getBBox().height
                                } return !1
                            }, n = function () { e && c && e.attr({ translateX: e.alignAttr.translateX + (d.axisOffset[1] >= -a ? 0 : -a), translateY: e.alignAttr.translateY + c.getBBox().height + 10 }) }; if (c) { if ("always" === l) { this.collapseButtons(a); r(g()) && n(); return } "never" === l && this.expandButtons() } e && c ? k.align === f.align || r(this.initialButtonGroupWidth + 20) ? "responsive" === l ? (this.collapseButtons(a),
                                r(g()) && n()) : n() : "responsive" === l && this.expandButtons() : c && "responsive" === l && (this.initialButtonGroupWidth > d.plotWidth ? this.collapseButtons(a) : this.expandButtons())
                        }; r.prototype.collapseButtons = function (a) {
                            var b = this.buttons, d = this.buttonOptions, c = this.chart, e = this.dropdown, g = this.options, f = this.zoomText, l = c.userOptions.rangeSelector && c.userOptions.rangeSelector.buttonTheme || {}, k = function (a) {
                                return {
                                    text: a ? "" + a + " \u25be" : "\u25be", width: "auto", paddingLeft: D(g.buttonTheme.paddingLeft, l.padding, 8), paddingRight: D(g.buttonTheme.paddingRight,
                                        l.padding, 8)
                                }
                            }; f && f.hide(); var r = !1; d.forEach(function (a, d) { d = b[d]; 2 !== d.state ? d.hide() : (d.show(), d.attr(k(a.text)), r = !0) }); r || (e && (e.selectedIndex = 0), b[0].show(), b[0].attr(k(this.zoomText && this.zoomText.textStr))); d = g.buttonPosition.align; this.positionButtons(); "right" !== d && "center" !== d || this.alignButtonGroup(a, b[this.currentButtonIndex()].getBBox().width); this.showDropdown()
                        }; r.prototype.expandButtons = function () {
                            var a = this.buttons, b = this.buttonOptions, d = this.options, c = this.zoomText; this.hideDropdown();
                            c && c.show(); b.forEach(function (b, c) { c = a[c]; c.show(); c.attr({ text: b.text, width: d.buttonTheme.width || 28, paddingLeft: D(d.buttonTheme.paddingLeft, "unset"), paddingRight: D(d.buttonTheme.paddingRight, "unset") }); 2 > c.state && c.setState(0) }); this.positionButtons()
                        }; r.prototype.currentButtonIndex = function () { var a = this.dropdown; return a && 0 < a.selectedIndex ? a.selectedIndex - 1 : 0 }; r.prototype.showDropdown = function () {
                            var a = this.buttonGroup, b = this.buttons, d = this.chart, c = this.dropdown; if (a && c) {
                                var e = a.translateX; a = a.translateY;
                                b = b[this.currentButtonIndex()].getBBox(); k(c, { left: d.plotLeft + e + "px", top: a + .5 + "px", width: b.width + "px", height: b.height + "px" }); this.hasVisibleDropdown = !0
                            }
                        }; r.prototype.hideDropdown = function () { var a = this.dropdown; a && (k(a, { top: "-9999em", width: "1px", height: "1px" }), this.hasVisibleDropdown = !1) }; r.prototype.getHeight = function () {
                            var a = this.options, b = this.group, d = a.y, c = a.buttonPosition.y, e = a.inputPosition.y; if (a.height) return a.height; this.alignElements(); a = b ? b.getBBox(!0).height + 13 + d : 0; b = Math.min(e, c); if (0 >
                                e && 0 > c || 0 < e && 0 < c) a += Math.abs(b); return a
                        }; r.prototype.titleCollision = function (a) { return !(a.options.title.text || a.options.subtitle.text) }; r.prototype.update = function (a) { var b = this.chart; B(!0, b.options.rangeSelector, a); this.destroy(); this.init(b); this.render() }; r.prototype.destroy = function () {
                            var a = this, b = a.minInput, c = a.maxInput; a.eventsToUnbind && (a.eventsToUnbind.forEach(function (a) { return a() }), a.eventsToUnbind = void 0); e(a.buttons); b && (b.onfocus = b.onblur = b.onchange = null); c && (c.onfocus = c.onblur = c.onchange =
                                null); A(a, function (b, c) { b && "chart" !== c && (b instanceof u ? b.destroy() : b instanceof window.HTMLElement && d(b)); b !== r.prototype[c] && (a[c] = null) }, this)
                        }; return r
                }(); b(h.prototype, {
                    defaultButtons: [{ type: "month", count: 1, text: "1m", title: "View 1 month" }, { type: "month", count: 3, text: "3m", title: "View 3 months" }, { type: "month", count: 6, text: "6m", title: "View 6 months" }, { type: "ytd", text: "YTD", title: "View year to date" }, { type: "year", count: 1, text: "1y", title: "View 1 year" }, { type: "all", text: "All", title: "View all" }], inputTypeFormats: {
                        "datetime-local": "%Y-%m-%dT%H:%M:%S",
                        date: "%Y-%m-%d", time: "%H:%M:%S"
                    }
                }); ""; return h
            }); A(a, "Accessibility/Components/RangeSelectorComponent.js", [a["Stock/RangeSelector/RangeSelector.js"], a["Accessibility/AccessibilityComponent.js"], a["Accessibility/Utils/ChartUtilities.js"], a["Accessibility/Utils/Announcer.js"], a["Accessibility/KeyboardNavigationHandler.js"], a["Core/Utilities.js"]], function (a, h, m, p, u, q) {
                var w = this && this.__extends || function () {
                    var a = function (c, d) {
                        a = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (a, d) {
                            a.__proto__ =
                            d
                        } || function (a, d) { for (var b in d) d.hasOwnProperty(b) && (a[b] = d[b]) }; return a(c, d)
                    }; return function (c, d) { function b() { this.constructor = c } a(c, d); c.prototype = null === d ? Object.create(d) : (b.prototype = d.prototype, new b) }
                }(), y = m.unhideChartElementFromAT, f = m.getAxisRangeDescription, n = q.addEvent, k = q.attr; h = function (a) {
                    function c() { var d = null !== a && a.apply(this, arguments) || this; d.announcer = void 0; return d } w(c, a); c.prototype.init = function () { this.announcer = new p(this.chart, "polite") }; c.prototype.onChartUpdate = function () {
                        var a =
                            this.chart, b = this, c = a.rangeSelector; c && (this.updateSelectorVisibility(), this.setDropdownAttrs(), c.buttons && c.buttons.length && c.buttons.forEach(function (a) { b.setRangeButtonAttrs(a) }), c.maxInput && c.minInput && ["minInput", "maxInput"].forEach(function (d, e) { if (d = c[d]) y(a, d), b.setRangeInputAttrs(d, "accessibility.rangeSelector." + (e ? "max" : "min") + "InputLabel") }))
                    }; c.prototype.updateSelectorVisibility = function () {
                        var a = this.chart, b = a.rangeSelector, c = b && b.dropdown, e = b && b.buttons || []; b && b.hasVisibleDropdown && c ?
                            (y(a, c), e.forEach(function (a) { return a.element.setAttribute("aria-hidden", !0) })) : (c && c.setAttribute("aria-hidden", !0), e.forEach(function (b) { return y(a, b.element) }))
                    }; c.prototype.setDropdownAttrs = function () { var a = this.chart, b = a.rangeSelector && a.rangeSelector.dropdown; b && (a = a.langFormat("accessibility.rangeSelector.dropdownLabel", { rangeTitle: a.options.lang.rangeSelectorZoom }), b.setAttribute("aria-label", a), b.setAttribute("tabindex", -1)) }; c.prototype.setRangeButtonAttrs = function (a) {
                        k(a.element, {
                            tabindex: -1,
                            role: "button"
                        })
                    }; c.prototype.setRangeInputAttrs = function (a, b) { var c = this.chart; k(a, { tabindex: -1, "aria-label": c.langFormat(b, { chart: c }) }) }; c.prototype.onButtonNavKbdArrowKey = function (a, b) { var c = a.response, d = this.keyCodes, e = this.chart, f = e.options.accessibility.keyboardNavigation.wrapAround; b = b === d.left || b === d.up ? -1 : 1; return e.highlightRangeSelectorButton(e.highlightedRangeSelectorItemIx + b) ? c.success : f ? (a.init(b), c.success) : c[0 < b ? "next" : "prev"] }; c.prototype.onButtonNavKbdClick = function (a) {
                        a = a.response;
                        var b = this.chart; 3 !== b.oldRangeSelectorItemState && this.fakeClickEvent(b.rangeSelector.buttons[b.highlightedRangeSelectorItemIx].element); return a.success
                    }; c.prototype.onAfterBtnClick = function () { var a = this.chart, b = f(a.xAxis[0]); (a = a.langFormat("accessibility.rangeSelector.clickButtonAnnouncement", { chart: a, axisRangeDescription: b })) && this.announcer.announce(a) }; c.prototype.onInputKbdMove = function (a) {
                        var b = this.chart, c = b.rangeSelector, d = b.highlightedInputRangeIx = (b.highlightedInputRangeIx || 0) + a; 1 < d ||
                            0 > d ? b.accessibility && (b.accessibility.keyboardNavigation.tabindexContainer.focus(), b.accessibility.keyboardNavigation.move(a)) : c && (a = c[d ? "maxDateBox" : "minDateBox"], c = c[d ? "maxInput" : "minInput"], a && c && b.setFocusToElement(a, c))
                    }; c.prototype.onInputNavInit = function (a) {
                        var b = this, c = this, d = this.chart, e = 0 < a ? 0 : 1, f = d.rangeSelector, k = f && f[e ? "maxDateBox" : "minDateBox"]; a = f && f.minInput; f = f && f.maxInput; d.highlightedInputRangeIx = e; if (k && a && f) {
                            d.setFocusToElement(k, e ? f : a); this.removeInputKeydownHandler && this.removeInputKeydownHandler();
                            d = function (a) { (a.which || a.keyCode) === b.keyCodes.tab && (a.preventDefault(), a.stopPropagation(), c.onInputKbdMove(a.shiftKey ? -1 : 1)) }; var h = n(a, "keydown", d), m = n(f, "keydown", d); this.removeInputKeydownHandler = function () { h(); m() }
                        }
                    }; c.prototype.onInputNavTerminate = function () { var a = this.chart.rangeSelector || {}; a.maxInput && a.hideInput("max"); a.minInput && a.hideInput("min"); this.removeInputKeydownHandler && (this.removeInputKeydownHandler(), delete this.removeInputKeydownHandler) }; c.prototype.initDropdownNav = function () {
                        var a =
                            this, b = this.chart, c = b.rangeSelector, e = c && c.dropdown; c && e && (b.setFocusToElement(c.buttonGroup, e), this.removeDropdownKeydownHandler && this.removeDropdownKeydownHandler(), this.removeDropdownKeydownHandler = n(e, "keydown", function (c) { var d = b.accessibility; (c.which || c.keyCode) === a.keyCodes.tab && (c.preventDefault(), c.stopPropagation(), d && (d.keyboardNavigation.tabindexContainer.focus(), d.keyboardNavigation.move(c.shiftKey ? -1 : 1))) }))
                    }; c.prototype.getRangeSelectorButtonNavigation = function () {
                        var a = this.chart,
                        b = this.keyCodes, c = this; return new u(a, {
                            keyCodeMap: [[[b.left, b.right, b.up, b.down], function (a) { return c.onButtonNavKbdArrowKey(this, a) }], [[b.enter, b.space], function () { return c.onButtonNavKbdClick(this) }]], validate: function () { return !!(a.rangeSelector && a.rangeSelector.buttons && a.rangeSelector.buttons.length) }, init: function (b) { var d = a.rangeSelector; d && d.hasVisibleDropdown ? c.initDropdownNav() : d && (d = d.buttons.length - 1, a.highlightRangeSelectorButton(0 < b ? 0 : d)) }, terminate: function () {
                                c.removeDropdownKeydownHandler &&
                                (c.removeDropdownKeydownHandler(), delete c.removeDropdownKeydownHandler)
                            }
                        })
                    }; c.prototype.getRangeSelectorInputNavigation = function () { var a = this.chart, b = this; return new u(a, { keyCodeMap: [], validate: function () { return !!(a.rangeSelector && a.rangeSelector.inputGroup && "hidden" !== a.rangeSelector.inputGroup.element.style.visibility && !1 !== a.options.rangeSelector.inputEnabled && a.rangeSelector.minInput && a.rangeSelector.maxInput) }, init: function (a) { b.onInputNavInit(a) }, terminate: function () { b.onInputNavTerminate() } }) };
                    c.prototype.getKeyboardNavigation = function () { return [this.getRangeSelectorButtonNavigation(), this.getRangeSelectorInputNavigation()] }; c.prototype.destroy = function () { this.removeDropdownKeydownHandler && this.removeDropdownKeydownHandler(); this.removeInputKeydownHandler && this.removeInputKeydownHandler(); this.announcer && this.announcer.destroy() }; return c
                }(h); (function (c) {
                    function e(a) {
                        var b = this.rangeSelector && this.rangeSelector.buttons || [], c = this.highlightedRangeSelectorItemIx, d = this.rangeSelector && this.rangeSelector.selected;
                        "undefined" !== typeof c && b[c] && c !== d && b[c].setState(this.oldRangeSelectorItemState || 0); this.highlightedRangeSelectorItemIx = a; return b[a] ? (this.setFocusToElement(b[a].box, b[a].element), a !== d && (this.oldRangeSelectorItemState = b[a].state, b[a].setState(1)), !0) : !1
                    } function d() { var a = this.chart.accessibility; if (a && a.components.rangeSelector) return a.components.rangeSelector.onAfterBtnClick() } var b = []; c.compose = function (c, f) {
                        -1 === b.indexOf(c) && (b.push(c), c.prototype.highlightRangeSelectorButton = e); -1 === b.indexOf(f) &&
                            (b.push(f), n(a, "afterBtnClick", d))
                    }
                })(h || (h = {})); return h
            }); A(a, "Accessibility/Components/SeriesComponent/ForcedMarkers.js", [a["Core/Utilities.js"]], function (a) {
                var h = a.addEvent, m = a.merge, p; (function (a) {
                    function q(a) { m(!0, a, { marker: { enabled: !0, states: { normal: { opacity: 0 } } } }) } function p(a) { return a.marker.states && a.marker.states.normal && a.marker.states.normal.opacity } function u() {
                        if (this.chart.styledMode) {
                            if (this.markerGroup) this.markerGroup[this.a11yMarkersForced ? "addClass" : "removeClass"]("highcharts-a11y-markers-hidden");
                            this._hasPointMarkers && this.points && this.points.length && this.points.forEach(function (a) { a.graphic && (a.graphic[a.hasForcedA11yMarker ? "addClass" : "removeClass"]("highcharts-a11y-marker-hidden"), a.graphic[!1 === a.hasForcedA11yMarker ? "addClass" : "removeClass"]("highcharts-a11y-marker-visible")) })
                        }
                    } function f(a) { this.resetA11yMarkerOptions = m(a.options.marker || {}, this.userOptions.marker || {}) } function n() {
                        var a = this.options, e = !1 !== (this.options.accessibility && this.options.accessibility.enabled); if (e = this.chart.options.accessibility.enabled &&
                            e) e = this.chart.options.accessibility, e = this.points.length < e.series.pointDescriptionEnabledThreshold || !1 === e.series.pointDescriptionEnabledThreshold; if (e) {
                                if (a.marker && !1 === a.marker.enabled && (this.a11yMarkersForced = !0, q(this.options)), this._hasPointMarkers && this.points && this.points.length) for (a = this.points.length; a--;) {
                                    e = this.points[a]; var d = e.options, b = e.hasForcedA11yMarker; delete e.hasForcedA11yMarker; d.marker && (b = b && 0 === p(d), d.marker.enabled && !b ? (m(!0, d.marker, { states: { normal: { opacity: p(d) || 1 } } }),
                                        e.hasForcedA11yMarker = !1) : !1 === d.marker.enabled && (q(d), e.hasForcedA11yMarker = !0))
                                }
                            } else this.a11yMarkersForced && (delete this.a11yMarkersForced, (a = this.resetA11yMarkerOptions) && this.update({ marker: { enabled: a.enabled, states: { normal: { opacity: a.states && a.states.normal && a.states.normal.opacity } } } }), delete this.resetA11yMarkerOptions)
                    } var k = []; a.compose = function (a) { -1 === k.indexOf(a) && (k.push(a), h(a, "afterSetOptions", f), h(a, "render", n), h(a, "afterRender", u)) }
                })(p || (p = {})); return p
            }); A(a, "Accessibility/Components/SeriesComponent/SeriesKeyboardNavigation.js",
                [a["Core/Series/Point.js"], a["Core/Series/Series.js"], a["Core/Series/SeriesRegistry.js"], a["Core/Globals.js"], a["Core/Utilities.js"], a["Accessibility/KeyboardNavigationHandler.js"], a["Accessibility/Utils/EventProvider.js"], a["Accessibility/Utils/ChartUtilities.js"]], function (a, h, m, p, u, q, A, y) {
                    function f(a) { var b = a.index, c = a.series.points, d = c.length; if (c[b] !== a) for (; d--;) { if (c[d] === a) return d } else return b } function n(a) {
                        var b = a.chart.options.accessibility.keyboardNavigation.seriesNavigation, c = a.options.accessibility ||
                            {}, d = c.keyboardNavigation; return d && !1 === d.enabled || !1 === c.enabled || !1 === a.options.enableMouseTracking || !a.visible || b.pointNavigationEnabledThreshold && b.pointNavigationEnabledThreshold <= a.points.length
                    } function k(a) { var b = a.series.chart.options.accessibility, c = a.options.accessibility && !1 === a.options.accessibility.enabled; return a.isNull && b.keyboardNavigation.seriesNavigation.skipNullPoints || !1 === a.visible || !1 === a.isInside || c || n(a.series) } function c(a) {
                        a = a.series || []; for (var b = a.length, c = 0; c < b; ++c)if (!n(a[c])) {
                            a: {
                                var d =
                                    a[c].points || []; for (var e = d.length, f = 0; f < e; ++f)if (!k(d[f])) { d = d[f]; break a } d = null
                            } if (d) return d
                        } return null
                    } function e(a) { for (var b = a.series.length, c = !1; b-- && !(a.highlightedPoint = a.series[b].points[a.series[b].points.length - 1], c = a.series[b].highlightNextValidPoint());); return c } function d(a) { delete a.highlightedPoint; return (a = c(a)) ? a.highlight() : !1 } var b = m.seriesTypes, g = p.doc, w = u.defined, B = u.fireEvent, I = y.getPointFromXY, G = y.getSeriesFromName, D = y.scrollToPoint; m = function () {
                        function b(a, b) {
                            this.keyCodes =
                            b; this.chart = a
                        } b.prototype.init = function () {
                            var b = this, d = this.chart, e = this.eventProvider = new A; e.addEvent(h, "destroy", function () { return b.onSeriesDestroy(this) }); e.addEvent(d, "afterApplyDrilldown", function () { var a = c(this); a && a.highlight(!1) }); e.addEvent(d, "drilldown", function (a) { a = a.point; var c = a.series; b.lastDrilledDownPoint = { x: a.x, y: a.y, seriesName: c ? c.name : "" } }); e.addEvent(d, "drillupall", function () { setTimeout(function () { b.onDrillupAll() }, 10) }); e.addEvent(a, "afterSetState", function () {
                                var a = this.graphic &&
                                    this.graphic.element, b = g.activeElement, c = b && b.getAttribute("class"); c = c && -1 < c.indexOf("highcharts-a11y-proxy-button"); d.highlightedPoint === this && b !== a && !c && a && a.focus && a.focus()
                            })
                        }; b.prototype.onDrillupAll = function () { var a = this.lastDrilledDownPoint, b = this.chart, d = a && G(b, a.seriesName), e; a && d && w(a.x) && w(a.y) && (e = I(d, a.x, a.y)); e = e || c(b); b.container && b.container.focus(); e && e.highlight && e.highlight(!1) }; b.prototype.getKeyboardNavigationHandler = function () {
                            var a = this, b = this.keyCodes, f = this.chart, g = f.inverted;
                            return new q(f, {
                                keyCodeMap: [[g ? [b.up, b.down] : [b.left, b.right], function (b) { return a.onKbdSideways(this, b) }], [g ? [b.left, b.right] : [b.up, b.down], function (b) { return a.onKbdVertical(this, b) }], [[b.enter, b.space], function (a, b) { if (a = f.highlightedPoint) b.point = a, B(a.series, "click", b), a.firePointEvent("click"); return this.response.success }], [[b.home], function () { d(f); return this.response.success }], [[b.end], function () { e(f); return this.response.success }], [[b.pageDown, b.pageUp], function (a) {
                                    f.highlightAdjacentSeries(a ===
                                        b.pageDown); return this.response.success
                                }]], init: function () { return a.onHandlerInit(this) }, validate: function () { return !!c(f) }, terminate: function () { return a.onHandlerTerminate() }
                            })
                        }; b.prototype.onKbdSideways = function (a, b) { var c = this.keyCodes; return this.attemptHighlightAdjacentPoint(a, b === c.right || b === c.down) }; b.prototype.onHandlerInit = function (a) { var b = this.chart; b.options.accessibility.keyboardNavigation.seriesNavigation.rememberPointFocus && b.highlightedPoint ? b.highlightedPoint.highlight() : d(b); return a.response.success };
                        b.prototype.onKbdVertical = function (a, b) { var c = this.chart, d = this.keyCodes; b = b === d.down || b === d.right; d = c.options.accessibility.keyboardNavigation.seriesNavigation; if (d.mode && "serialize" === d.mode) return this.attemptHighlightAdjacentPoint(a, b); c[c.highlightedPoint && c.highlightedPoint.series.keyboardMoveVertical ? "highlightAdjacentPointVertical" : "highlightAdjacentSeries"](b); return a.response.success }; b.prototype.onHandlerTerminate = function () {
                            var a = this.chart, b = a.options.accessibility.keyboardNavigation;
                            a.tooltip && a.tooltip.hide(0); var c = a.highlightedPoint && a.highlightedPoint.series; if (c && c.onMouseOut) c.onMouseOut(); if (a.highlightedPoint && a.highlightedPoint.onMouseOut) a.highlightedPoint.onMouseOut(); b.seriesNavigation.rememberPointFocus || delete a.highlightedPoint
                        }; b.prototype.attemptHighlightAdjacentPoint = function (a, b) {
                            var c = this.chart, f = c.options.accessibility.keyboardNavigation.wrapAround; return c.highlightAdjacentPoint(b) ? a.response.success : f && (b ? d(c) : e(c)) ? a.response.success : a.response[b ? "next" :
                                "prev"]
                        }; b.prototype.onSeriesDestroy = function (a) { var b = this.chart; b.highlightedPoint && b.highlightedPoint.series === a && (delete b.highlightedPoint, b.focusElement && b.focusElement.removeFocusBorder()) }; b.prototype.destroy = function () { this.eventProvider.removeAddedEvents() }; return b
                    }(); (function (a) {
                        function c(a) {
                            var b = this.series, c = this.highlightedPoint, d = c && f(c) || 0, e = c && c.series.points || [], g = this.series && this.series[this.series.length - 1]; g = g && g.points && g.points[g.points.length - 1]; if (!b[0] || !b[0].points) return !1;
                            if (c) { if (b = b[c.series.index + (a ? 1 : -1)], d = e[d + (a ? 1 : -1)], !d && b && (d = b.points[a ? 0 : b.points.length - 1]), !d) return !1 } else d = a ? b[0].points[0] : g; return k(d) ? (b = d.series, n(b) ? this.highlightedPoint = a ? b.points[b.points.length - 1] : b.points[0] : this.highlightedPoint = d, this.highlightAdjacentPoint(a)) : d.highlight()
                        } function d(a) {
                            var b = this.highlightedPoint, c = Infinity, d; if (!w(b.plotX) || !w(b.plotY)) return !1; this.series.forEach(function (e) {
                                n(e) || e.points.forEach(function (f) {
                                    if (w(f.plotY) && w(f.plotX) && f !== b) {
                                        var g = f.plotY -
                                            b.plotY, n = Math.abs(f.plotX - b.plotX); n = Math.abs(g) * Math.abs(g) + n * n * 4; e.yAxis && e.yAxis.reversed && (g *= -1); !(0 >= g && a || 0 <= g && !a || 5 > n || k(f)) && n < c && (c = n, d = f)
                                    }
                                })
                            }); return d ? d.highlight() : !1
                        } function e(a) {
                            var b = this.highlightedPoint, c = this.series && this.series[this.series.length - 1], d = c && c.points && c.points[c.points.length - 1]; if (!this.highlightedPoint) return c = a ? this.series && this.series[0] : c, (d = a ? c && c.points && c.points[0] : d) ? d.highlight() : !1; c = this.series[b.series.index + (a ? -1 : 1)]; if (!c) return !1; d = g(b, c, 4); if (!d) return !1;
                            if (n(c)) return d.highlight(), a = this.highlightAdjacentSeries(a), a ? a : (b.highlight(), !1); d.highlight(); return d.series.highlightNextValidPoint()
                        } function g(a, b, c, d) { var e = Infinity, f = b.points.length, g = function (a) { return !(w(a.plotX) && w(a.plotY)) }; if (!g(a)) { for (; f--;) { var k = b.points[f]; if (!g(k) && (k = (a.plotX - k.plotX) * (a.plotX - k.plotX) * (c || 1) + (a.plotY - k.plotY) * (a.plotY - k.plotY) * (d || 1), k < e)) { e = k; var n = f } } return w(n) ? b.points[n] : void 0 } } function h(a) {
                            void 0 === a && (a = !0); var b = this.series.chart; if (!this.isNull &&
                                a) this.onMouseOver(); else b.tooltip && b.tooltip.hide(0); D(this); this.graphic && (b.setFocusToElement(this.graphic), !a && b.focusElement && b.focusElement.removeFocusBorder()); b.highlightedPoint = this; return this
                        } function m() { var a = this.chart.highlightedPoint, b = (a && a.series) === this ? f(a) : 0; a = this.points; var c = a.length; if (a && c) { for (var d = b; d < c; ++d)if (!k(a[d])) return a[d].highlight(); for (; 0 <= b; --b)if (!k(a[b])) return a[b].highlight() } return !1 } var q = []; a.compose = function (a, f, g) {
                            -1 === q.indexOf(a) && (q.push(a), a =
                                a.prototype, a.highlightAdjacentPoint = c, a.highlightAdjacentPointVertical = d, a.highlightAdjacentSeries = e); -1 === q.indexOf(f) && (q.push(f), f.prototype.highlight = h); -1 === q.indexOf(g) && (q.push(g), f = g.prototype, f.keyboardMoveVertical = !0, ["column", "gantt", "pie"].forEach(function (a) { b[a] && (b[a].prototype.keyboardMoveVertical = !1) }), f.highlightNextValidPoint = m)
                        }
                    })(m || (m = {})); return m
                }); A(a, "Accessibility/Components/SeriesComponent/SeriesComponent.js", [a["Accessibility/AccessibilityComponent.js"], a["Accessibility/Utils/ChartUtilities.js"],
                a["Accessibility/Components/SeriesComponent/ForcedMarkers.js"], a["Accessibility/Components/SeriesComponent/NewDataAnnouncer.js"], a["Accessibility/Components/SeriesComponent/SeriesDescriber.js"], a["Accessibility/Components/SeriesComponent/SeriesKeyboardNavigation.js"], a["Core/Tooltip.js"]], function (a, h, m, p, u, q, A) {
                    var w = this && this.__extends || function () {
                        var a = function (c, e) {
                            a = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (a, b) { a.__proto__ = b } || function (a, b) {
                                for (var c in b) b.hasOwnProperty(c) &&
                                    (a[c] = b[c])
                            }; return a(c, e)
                        }; return function (c, e) { function d() { this.constructor = c } a(c, e); c.prototype = null === e ? Object.create(e) : (d.prototype = e.prototype, new d) }
                    }(), f = h.hideSeriesFromAT, n = u.describeSeries; return function (a) {
                        function c() { return null !== a && a.apply(this, arguments) || this } w(c, a); c.compose = function (a, c, b) { p.compose(b); m.compose(b); q.compose(a, c, b) }; c.prototype.init = function () {
                            this.newDataAnnouncer = new p(this.chart); this.newDataAnnouncer.init(); this.keyboardNavigation = new q(this.chart, this.keyCodes);
                            this.keyboardNavigation.init(); this.hideTooltipFromATWhenShown(); this.hideSeriesLabelsFromATWhenShown()
                        }; c.prototype.hideTooltipFromATWhenShown = function () { var a = this; this.addEvent(A, "refresh", function () { this.chart === a.chart && this.label && this.label.element && this.label.element.setAttribute("aria-hidden", !0) }) }; c.prototype.hideSeriesLabelsFromATWhenShown = function () {
                            this.addEvent(this.chart, "afterDrawSeriesLabels", function () {
                                this.series.forEach(function (a) {
                                    a.labelBySeries && a.labelBySeries.attr("aria-hidden",
                                        !0)
                                })
                            })
                        }; c.prototype.onChartRender = function () { this.chart.series.forEach(function (a) { !1 !== (a.options.accessibility && a.options.accessibility.enabled) && a.visible ? n(a) : f(a) }) }; c.prototype.getKeyboardNavigation = function () { return this.keyboardNavigation.getKeyboardNavigationHandler() }; c.prototype.destroy = function () { this.newDataAnnouncer.destroy(); this.keyboardNavigation.destroy() }; return c
                    }(a)
                }); A(a, "Accessibility/Components/ZoomComponent.js", [a["Accessibility/AccessibilityComponent.js"], a["Accessibility/Utils/ChartUtilities.js"],
                a["Accessibility/KeyboardNavigationHandler.js"], a["Core/Utilities.js"]], function (a, h, m, p) {
                    var u = this && this.__extends || function () { var a = function (f, k) { a = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (a, e) { a.__proto__ = e } || function (a, e) { for (var c in e) e.hasOwnProperty(c) && (a[c] = e[c]) }; return a(f, k) }; return function (f, k) { function c() { this.constructor = f } a(f, k); f.prototype = null === k ? Object.create(k) : (c.prototype = k.prototype, new c) } }(), q = h.unhideChartElementFromAT, w = p.attr, y = p.pick; return function (a) {
                        function f() {
                            var f =
                                null !== a && a.apply(this, arguments) || this; f.focusedMapNavButtonIx = -1; return f
                        } u(f, a); f.prototype.init = function () { var a = this, c = this.chart; this.proxyProvider.addGroup("zoom", "div");["afterShowResetZoom", "afterApplyDrilldown", "drillupall"].forEach(function (e) { a.addEvent(c, e, function () { a.updateProxyOverlays() }) }) }; f.prototype.onChartUpdate = function () {
                            var a = this.chart, c = this; a.mapNavigation && a.mapNavigation.navButtons.forEach(function (e, d) {
                                q(a, e.element); c.setMapNavButtonAttrs(e.element, "accessibility.zoom.mapZoom" +
                                    (d ? "Out" : "In"))
                            })
                        }; f.prototype.setMapNavButtonAttrs = function (a, c) { var e = this.chart; c = e.langFormat(c, { chart: e }); w(a, { tabindex: -1, role: "button", "aria-label": c }) }; f.prototype.onChartRender = function () { this.updateProxyOverlays() }; f.prototype.updateProxyOverlays = function () {
                            var a = this.chart; this.proxyProvider.clearGroup("zoom"); a.resetZoomButton && this.createZoomProxyButton(a.resetZoomButton, "resetZoomProxyButton", a.langFormat("accessibility.zoom.resetZoomButton", { chart: a })); a.drillUpButton && a.breadcrumbs &&
                                a.breadcrumbs.list && this.createZoomProxyButton(a.drillUpButton, "drillUpProxyButton", a.langFormat("accessibility.drillUpButton", { chart: a, buttonText: a.breadcrumbs.getButtonText(a.breadcrumbs.list[a.breadcrumbs.list.length - 1]) }))
                        }; f.prototype.createZoomProxyButton = function (a, c, e) { this[c] = this.proxyProvider.addProxyElement("zoom", { click: a }, { "aria-label": e, tabindex: -1 }) }; f.prototype.getMapZoomNavigation = function () {
                            var a = this.keyCodes, c = this.chart, e = this; return new m(c, {
                                keyCodeMap: [[[a.up, a.down, a.left,
                                a.right], function (a) { return e.onMapKbdArrow(this, a) }], [[a.tab], function (a, b) { return e.onMapKbdTab(this, b) }], [[a.space, a.enter], function () { return e.onMapKbdClick(this) }]], validate: function () { return !!(c.mapZoom && c.mapNavigation && c.mapNavigation.navButtons.length) }, init: function (a) { return e.onMapNavInit(a) }
                            })
                        }; f.prototype.onMapKbdArrow = function (a, c) {
                            var e = this.keyCodes, d = this.chart[c === e.up || c === e.down ? "yAxis" : "xAxis"][0]; c = c === e.left || c === e.up ? -1 : 1; e = d.getExtremes(); var b = (e.max - e.min) / 3 * c, f = e.max +
                                b; b = e.min + b; var k = f - b; 0 > c && b < e.dataMin ? (b = e.dataMin, f = b + k) : 0 < c && f > e.dataMax && (f = e.dataMax, b = f - k); d.setExtremes(b, f); return a.response.success
                        }; f.prototype.onMapKbdTab = function (a, c) {
                            var e = this.chart; a = a.response; var d = (c = c.shiftKey) && !this.focusedMapNavButtonIx || !c && this.focusedMapNavButtonIx; e.mapNavigation.navButtons[this.focusedMapNavButtonIx].setState(0); if (d) return e.mapZoom(), a[c ? "prev" : "next"]; this.focusedMapNavButtonIx += c ? -1 : 1; c = e.mapNavigation.navButtons[this.focusedMapNavButtonIx]; e.setFocusToElement(c.box,
                                c.element); c.setState(2); return a.success
                        }; f.prototype.onMapKbdClick = function (a) { this.fakeClickEvent(this.chart.mapNavButtons[this.focusedMapNavButtonIx].element); return a.response.success }; f.prototype.onMapNavInit = function (a) { var c = this.chart, e = c.mapNavigation.navButtons[0], d = c.mapNavigation.navButtons[1]; e = 0 < a ? e : d; c.setFocusToElement(e.box, e.element); e.setState(2); this.focusedMapNavButtonIx = 0 < a ? 0 : 1 }; f.prototype.simpleButtonNavigation = function (a, c, e) {
                            var d = this.keyCodes, b = this, f = this.chart; return new m(f,
                                { keyCodeMap: [[[d.tab, d.up, d.down, d.left, d.right], function (a, b) { return this.response[a === d.tab && b.shiftKey || a === d.left || a === d.up ? "prev" : "next"] }], [[d.space, d.enter], function () { var a = e(this, f); return y(a, this.response.success) }]], validate: function () { return f[a] && f[a].box && b[c].buttonElement }, init: function () { f.setFocusToElement(f[a].box, b[c].buttonElement) } })
                        }; f.prototype.getKeyboardNavigation = function () {
                            return [this.simpleButtonNavigation("resetZoomButton", "resetZoomProxyButton", function (a, c) { c.zoomOut() }),
                            this.simpleButtonNavigation("drillUpButton", "drillUpProxyButton", function (a, c) { c.drillUp(); return a.response.prev }), this.getMapZoomNavigation()]
                        }; return f
                    }(a)
                }); A(a, "Accessibility/HighContrastMode.js", [a["Core/Globals.js"]], function (a) {
                    var h = a.doc, m = a.isMS, p = a.win; return {
                        isHighContrastModeActive: function () {
                            var a = /(Edg)/.test(p.navigator.userAgent); if (p.matchMedia && a) return p.matchMedia("(-ms-high-contrast: active)").matches; if (m && p.getComputedStyle) {
                                a = h.createElement("div"); a.style.backgroundImage =
                                    "url(".concat("data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==", ")"); h.body.appendChild(a); var q = (a.currentStyle || p.getComputedStyle(a)).backgroundImage; h.body.removeChild(a); return "none" === q
                            } return p.matchMedia && p.matchMedia("(forced-colors: active)").matches
                        }, setHighContrastTheme: function (a) {
                            a.highContrastModeActive = !0; var h = a.options.accessibility.highContrastTheme; a.update(h, !1); a.series.forEach(function (a) {
                                var m = h.plotOptions[a.type] || {}; a.update({
                                    color: m.color || "windowText",
                                    colors: [m.color || "windowText"], borderColor: m.borderColor || "window"
                                }); a.points.forEach(function (a) { a.options && a.options.color && a.update({ color: m.color || "windowText", borderColor: m.borderColor || "window" }, !1) })
                            }); a.redraw()
                        }
                    }
                }); A(a, "Accessibility/HighContrastTheme.js", [], function () {
                    return {
                        chart: { backgroundColor: "window" }, title: { style: { color: "windowText" } }, subtitle: { style: { color: "windowText" } }, colorAxis: { minColor: "windowText", maxColor: "windowText", stops: [] }, colors: ["windowText"], xAxis: {
                            gridLineColor: "windowText",
                            labels: { style: { color: "windowText" } }, lineColor: "windowText", minorGridLineColor: "windowText", tickColor: "windowText", title: { style: { color: "windowText" } }
                        }, yAxis: { gridLineColor: "windowText", labels: { style: { color: "windowText" } }, lineColor: "windowText", minorGridLineColor: "windowText", tickColor: "windowText", title: { style: { color: "windowText" } } }, tooltip: { backgroundColor: "window", borderColor: "windowText", style: { color: "windowText" } }, plotOptions: {
                            series: {
                                lineColor: "windowText", fillColor: "window", borderColor: "windowText",
                                edgeColor: "windowText", borderWidth: 1, dataLabels: { connectorColor: "windowText", color: "windowText", style: { color: "windowText", textOutline: "none" } }, marker: { lineColor: "windowText", fillColor: "windowText" }
                            }, pie: { color: "window", colors: ["window"], borderColor: "windowText", borderWidth: 1 }, boxplot: { fillColor: "window" }, candlestick: { lineColor: "windowText", fillColor: "window" }, errorbar: { fillColor: "window" }
                        }, legend: {
                            backgroundColor: "window", itemStyle: { color: "windowText" }, itemHoverStyle: { color: "windowText" }, itemHiddenStyle: { color: "#555" },
                            title: { style: { color: "windowText" } }
                        }, credits: { style: { color: "windowText" } }, labels: { style: { color: "windowText" } }, drilldown: { activeAxisLabelStyle: { color: "windowText" }, activeDataLabelStyle: { color: "windowText" } }, navigation: { buttonOptions: { symbolStroke: "windowText", theme: { fill: "window" } } }, rangeSelector: {
                            buttonTheme: { fill: "window", stroke: "windowText", style: { color: "windowText" }, states: { hover: { fill: "window", stroke: "windowText", style: { color: "windowText" } }, select: { fill: "#444", stroke: "windowText", style: { color: "windowText" } } } },
                            inputBoxBorderColor: "windowText", inputStyle: { backgroundColor: "window", color: "windowText" }, labelStyle: { color: "windowText" }
                        }, navigator: { handles: { backgroundColor: "window", borderColor: "windowText" }, outlineColor: "windowText", maskFill: "transparent", series: { color: "windowText", lineColor: "windowText" }, xAxis: { gridLineColor: "windowText" } }, scrollbar: {
                            barBackgroundColor: "#444", barBorderColor: "windowText", buttonArrowColor: "windowText", buttonBackgroundColor: "window", buttonBorderColor: "windowText", rifleColor: "windowText",
                            trackBackgroundColor: "window", trackBorderColor: "windowText"
                        }
                    }
                }); A(a, "Accessibility/Options/A11yDefaults.js", [], function () {
                    return {
                        accessibility: {
                            enabled: !0, screenReaderSection: {
                                beforeChartFormat: "<{headingTagName}>{chartTitle}</{headingTagName}><div>{typeDescription}</div><div>{chartSubtitle}</div><div>{chartLongdesc}</div><div>{playAsSoundButton}</div><div>{viewTableButton}</div><div>{xAxisDescription}</div><div>{yAxisDescription}</div><div>{annotationsTitle}{annotationsList}</div>", afterChartFormat: "{endOfChartMarker}",
                                axisRangeDateFormat: "%Y-%m-%d %H:%M:%S"
                            }, series: { descriptionFormat: "{seriesDescription}{authorDescription}{axisDescription}", describeSingleSeries: !1, pointDescriptionEnabledThreshold: 200 }, point: { valueDescriptionFormat: "{xDescription}{separator}{value}.", describeNull: !0 }, landmarkVerbosity: "all", linkedDescription: '*[data-highcharts-chart="{index}"] + .highcharts-description', keyboardNavigation: {
                                enabled: !0, focusBorder: {
                                    enabled: !0, hideBrowserFocusOutline: !0, style: { color: "#335cad", lineWidth: 2, borderRadius: 3 },
                                    margin: 2
                                }, order: ["series", "zoom", "rangeSelector", "legend", "chartMenu"], wrapAround: !0, seriesNavigation: { skipNullPoints: !0, pointNavigationEnabledThreshold: !1, rememberPointFocus: !1 }
                            }, announceNewData: { enabled: !1, minAnnounceInterval: 5E3, interruptUser: !1 }
                        }, legend: { accessibility: { enabled: !0, keyboardNavigation: { enabled: !0 } } }, exporting: { accessibility: { enabled: !0 } }
                    }
                }); A(a, "Accessibility/Options/LangDefaults.js", [], function () {
                    return {
                        accessibility: {
                            defaultChartTitle: "Chart", chartContainerLabel: "{title}. Highcharts interactive chart.",
                            svgContainerLabel: "Interactive chart", drillUpButton: "{buttonText}", credits: "Chart credits: {creditsStr}", thousandsSep: ",", svgContainerTitle: "", graphicContainerLabel: "", screenReaderSection: {
                                beforeRegionLabel: "", afterRegionLabel: "", annotations: { heading: "Chart annotations summary", descriptionSinglePoint: "{annotationText}. Related to {annotationPoint}", descriptionMultiplePoints: "{annotationText}. Related to {annotationPoint}{ Also related to, #each(additionalAnnotationPoints)}", descriptionNoPoints: "{annotationText}" },
                                endOfChartMarker: "End of interactive chart."
                            }, sonification: { playAsSoundButtonText: "Play as sound, {chartTitle}", playAsSoundClickAnnouncement: "Play" }, legend: { legendLabelNoTitle: languageNameSpace.labels['TSV'] + ", {chartTitle}", legendLabel: "Chart legend: {legendTitle}", legendItem: languageNameSpace.labels['SHOW'] + " {itemName}" }, zoom: { mapZoomIn: "Zoom chart", mapZoomOut: "Zoom out chart", resetZoomButton: "Reset zoom" }, rangeSelector: { dropdownLabel: "{rangeTitle}", minInputLabel: "Select start date.", maxInputLabel: "Select end date.", clickButtonAnnouncement: "Viewing {axisRangeDescription}" },
                            table: { viewAsDataTableButtonText: "View as data table, {chartTitle}", tableSummary: "Table representation of chart." }, announceNewData: { newDataAnnounce: "Updated data for chart {chartTitle}", newSeriesAnnounceSingle: "New data series: {seriesDesc}", newPointAnnounceSingle: "New data point: {pointDesc}", newSeriesAnnounceMultiple: "New data series in chart {chartTitle}: {seriesDesc}", newPointAnnounceMultiple: "New data point in chart {chartTitle}: {pointDesc}" }, seriesTypeDescriptions: {
                                boxplot: "Box plot charts are typically used to display groups of statistical data. Each data point in the chart can have up to 5 values: minimum, lower quartile, median, upper quartile, and maximum.",
                                arearange: "Arearange charts are line charts displaying a range between a lower and higher value for each point.", areasplinerange: "These charts are line charts displaying a range between a lower and higher value for each point.", bubble: "Bubble charts are scatter charts where each data point also has a size value.", columnrange: "Columnrange charts are column charts displaying a range between a lower and higher value for each point.", errorbar: "Errorbar series are used to display the variability of the data.",
                                funnel: "Funnel charts are used to display reduction of data in stages.", pyramid: "Pyramid charts consist of a single pyramid with item heights corresponding to each point value.", waterfall: "A waterfall chart is a column chart where each column contributes towards a total end value."
                            }, chartTypes: {
                                emptyChart: "Empty chart", mapTypeDescription: "Map of {mapTitle} with {numSeries} data series.", unknownMap: "Map of unspecified region with {numSeries} data series.", combinationChart: "Combination chart with {numSeries} data series.",
                                defaultSingle: "Chart with {numPoints} data {#plural(numPoints, points, point)}.", defaultMultiple: "Chart with {numSeries} data series.", splineSingle: "Line chart with {numPoints} data {#plural(numPoints, points, point)}.", splineMultiple: "Line chart with {numSeries} lines.", lineSingle: "Line chart with {numPoints} data {#plural(numPoints, points, point)}.", lineMultiple: "Line chart with {numSeries} lines.", columnSingle: "Bar chart with {numPoints} {#plural(numPoints, bars, bar)}.", columnMultiple: "Bar chart with {numSeries} data series.",
                                barSingle: "Bar chart with {numPoints} {#plural(numPoints, bars, bar)}.", barMultiple: "Bar chart with {numSeries} data series.", pieSingle: "Pie chart with {numPoints} {#plural(numPoints, slices, slice)}.", pieMultiple: "Pie chart with {numSeries} pies.", scatterSingle: "Scatter chart with {numPoints} {#plural(numPoints, points, point)}.", scatterMultiple: "Scatter chart with {numSeries} data series.", boxplotSingle: "Boxplot with {numPoints} {#plural(numPoints, boxes, box)}.", boxplotMultiple: "Boxplot with {numSeries} data series.",
                                bubbleSingle: "Bubble chart with {numPoints} {#plural(numPoints, bubbles, bubble)}.", bubbleMultiple: "Bubble chart with {numSeries} data series."
                            }, axis: {
                                xAxisDescriptionSingular: "The chart has 1 X axis displaying {names[0]}. {ranges[0]}", xAxisDescriptionPlural: "The chart has {numAxes} X axes displaying {#each(names, -1) }and {names[-1]}.", yAxisDescriptionSingular: "The chart has 1 Y axis displaying {names[0]}. {ranges[0]}", yAxisDescriptionPlural: "The chart has {numAxes} Y axes displaying {#each(names, -1) }and {names[-1]}.",
                                timeRangeDays: "Data range: {range} days.", timeRangeHours: "Data range: {range} hours.", timeRangeMinutes: "Data range: {range} minutes.", timeRangeSeconds: "Data range: {range} seconds.", rangeFromTo: "Data ranges from {rangeFrom} to {rangeTo}.", rangeCategories: "Data range: {numCategories} categories."
                            }, exporting: { chartMenuLabel: "Chart menu", menuButtonLabel: languageNameSpace.labels['VIEW_CHART_MENU'] + ", {chartTitle}" }, series: {
                                summary: {
                                    "default": "{series.name}, series {seriesNumber} of {chart.series.length} with {series.points.length} data {#plural(series.points.length, points, point)}.",
                                    defaultCombination: "{series.name}, series {seriesNumber} of {chart.series.length} with {series.points.length} data {#plural(series.points.length, points, point)}.", line: "{series.name}, line {seriesNumber} of {chart.series.length} with {series.points.length} data {#plural(series.points.length, points, point)}.", lineCombination: "{series.name}, series {seriesNumber} of {chart.series.length}. Line with {series.points.length} data {#plural(series.points.length, points, point)}.", spline: "{series.name}, line {seriesNumber} of {chart.series.length} with {series.points.length} data {#plural(series.points.length, points, point)}.",
                                    splineCombination: "{series.name}, series {seriesNumber} of {chart.series.length}. Line with {series.points.length} data {#plural(series.points.length, points, point)}.", column: "{series.name}, bar series {seriesNumber} of {chart.series.length} with {series.points.length} {#plural(series.points.length, bars, bar)}.", columnCombination: "{series.name}, series {seriesNumber} of {chart.series.length}. Bar series with {series.points.length} {#plural(series.points.length, bars, bar)}.", bar: "{series.name}, bar series {seriesNumber} of {chart.series.length} with {series.points.length} {#plural(series.points.length, bars, bar)}.",
                                    barCombination: "{series.name}, series {seriesNumber} of {chart.series.length}. Bar series with {series.points.length} {#plural(series.points.length, bars, bar)}.", pie: "{series.name}, pie {seriesNumber} of {chart.series.length} with {series.points.length} {#plural(series.points.length, slices, slice)}.", pieCombination: "{series.name}, series {seriesNumber} of {chart.series.length}. Pie with {series.points.length} {#plural(series.points.length, slices, slice)}.", scatter: "{series.name}, scatter plot {seriesNumber} of {chart.series.length} with {series.points.length} {#plural(series.points.length, points, point)}.",
                                    scatterCombination: "{series.name}, series {seriesNumber} of {chart.series.length}, scatter plot with {series.points.length} {#plural(series.points.length, points, point)}.", boxplot: "{series.name}, boxplot {seriesNumber} of {chart.series.length} with {series.points.length} {#plural(series.points.length, boxes, box)}.", boxplotCombination: "{series.name}, series {seriesNumber} of {chart.series.length}. Boxplot with {series.points.length} {#plural(series.points.length, boxes, box)}.", bubble: "{series.name}, bubble series {seriesNumber} of {chart.series.length} with {series.points.length} {#plural(series.points.length, bubbles, bubble)}.",
                                    bubbleCombination: "{series.name}, series {seriesNumber} of {chart.series.length}. Bubble series with {series.points.length} {#plural(series.points.length, bubbles, bubble)}.", map: "{series.name}, map {seriesNumber} of {chart.series.length} with {series.points.length} {#plural(series.points.length, areas, area)}.", mapCombination: "{series.name}, series {seriesNumber} of {chart.series.length}. Map with {series.points.length} {#plural(series.points.length, areas, area)}.", mapline: "{series.name}, line {seriesNumber} of {chart.series.length} with {series.points.length} data {#plural(series.points.length, points, point)}.",
                                    maplineCombination: "{series.name}, series {seriesNumber} of {chart.series.length}. Line with {series.points.length} data {#plural(series.points.length, points, point)}.", mapbubble: "{series.name}, bubble series {seriesNumber} of {chart.series.length} with {series.points.length} {#plural(series.points.length, bubbles, bubble)}.", mapbubbleCombination: "{series.name}, series {seriesNumber} of {chart.series.length}. Bubble series with {series.points.length} {#plural(series.points.length, bubbles, bubble)}."
                                },
                                description: "{description}", xAxisDescription: "X axis, {name}", yAxisDescription: "Y axis, {name}", nullPointValue: "No value", pointAnnotationsDescription: "{Annotation: #each(annotations). }"
                            }
                        }
                    }
                }); A(a, "Accessibility/Options/DeprecatedOptions.js", [a["Core/Utilities.js"]], function (a) {
                    function h(a, h, k) { for (var c, e = 0; e < h.length - 1; ++e)c = h[e], a = a[c] = y(a[c], {}); a[h[h.length - 1]] = k } function m(a, n, k, c) {
                        function e(a, b) { return b.reduce(function (a, b) { return a[b] }, a) } var d = e(a.options, n), b = e(a.options, k); Object.keys(c).forEach(function (e) {
                            var f,
                            g = d[e]; "undefined" !== typeof g && (h(b, c[e], g), w(32, !1, a, (f = {}, f[n.join(".") + "." + e] = k.join(".") + "." + c[e].join("."), f)))
                        })
                    } function p(a) { var f = a.options.chart, h = a.options.accessibility || {};["description", "typeDescription"].forEach(function (c) { var e; f[c] && (h[c] = f[c], w(32, !1, a, (e = {}, e["chart.".concat(c)] = "use accessibility.".concat(c), e))) }) } function u(a) { a.axes.forEach(function (f) { (f = f.options) && f.description && (f.accessibility = f.accessibility || {}, f.accessibility.description = f.description, w(32, !1, a, { "axis.description": "use axis.accessibility.description" })) }) }
                    function q(a) {
                        var f = { description: ["accessibility", "description"], exposeElementToA11y: ["accessibility", "exposeAsGroupOnly"], pointDescriptionFormatter: ["accessibility", "point", "descriptionFormatter"], skipKeyboardNavigation: ["accessibility", "keyboardNavigation", "enabled"], "accessibility.pointDescriptionFormatter": ["accessibility", "point", "descriptionFormatter"] }; a.series.forEach(function (k) {
                            Object.keys(f).forEach(function (c) {
                                var e, d = k.options[c]; "accessibility.pointDescriptionFormatter" === c && (d = k.options.accessibility &&
                                    k.options.accessibility.pointDescriptionFormatter); "undefined" !== typeof d && (h(k.options, f[c], "skipKeyboardNavigation" === c ? !d : d), w(32, !1, a, (e = {}, e["series.".concat(c)] = "series." + f[c].join("."), e)))
                            })
                        })
                    } var w = a.error, y = a.pick; return function (a) {
                        p(a); u(a); a.series && q(a); m(a, ["accessibility"], ["accessibility"], {
                            pointDateFormat: ["point", "dateFormat"], pointDateFormatter: ["point", "dateFormatter"], pointDescriptionFormatter: ["point", "descriptionFormatter"], pointDescriptionThreshold: ["series", "pointDescriptionEnabledThreshold"],
                            pointNavigationThreshold: ["keyboardNavigation", "seriesNavigation", "pointNavigationEnabledThreshold"], pointValueDecimals: ["point", "valueDecimals"], pointValuePrefix: ["point", "valuePrefix"], pointValueSuffix: ["point", "valueSuffix"], screenReaderSectionFormatter: ["screenReaderSection", "beforeChartFormatter"], describeSingleSeries: ["series", "describeSingleSeries"], seriesDescriptionFormatter: ["series", "descriptionFormatter"], onTableAnchorClick: ["screenReaderSection", "onViewDataTableClick"], axisRangeDateFormat: ["screenReaderSection",
                                "axisRangeDateFormat"]
                        }); m(a, ["accessibility", "keyboardNavigation"], ["accessibility", "keyboardNavigation", "seriesNavigation"], { skipNullPoints: ["skipNullPoints"], mode: ["mode"] }); m(a, ["lang", "accessibility"], ["lang", "accessibility"], {
                            legendItem: ["legend", "legendItem"], legendLabel: ["legend", "legendLabel"], mapZoomIn: ["zoom", "mapZoomIn"], mapZoomOut: ["zoom", "mapZoomOut"], resetZoomButton: ["zoom", "resetZoomButton"], screenReaderRegionLabel: ["screenReaderSection", "beforeRegionLabel"], rangeSelectorButton: ["rangeSelector",
                                "buttonText"], rangeSelectorMaxInput: ["rangeSelector", "maxInputLabel"], rangeSelectorMinInput: ["rangeSelector", "minInputLabel"], svgContainerEnd: ["screenReaderSection", "endOfChartMarker"], viewAsDataTable: ["table", "viewAsDataTableButtonText"], tableSummary: ["table", "tableSummary"]
                        })
                    }
                }); A(a, "Accessibility/Accessibility.js", [a["Core/Defaults.js"], a["Core/Globals.js"], a["Core/Utilities.js"], a["Accessibility/Utils/HTMLUtilities.js"], a["Accessibility/A11yI18n.js"], a["Accessibility/Components/ContainerComponent.js"],
                a["Accessibility/FocusBorder.js"], a["Accessibility/Components/InfoRegionsComponent.js"], a["Accessibility/KeyboardNavigation.js"], a["Accessibility/Components/LegendComponent.js"], a["Accessibility/Components/MenuComponent.js"], a["Accessibility/Components/SeriesComponent/NewDataAnnouncer.js"], a["Accessibility/ProxyProvider.js"], a["Accessibility/Components/RangeSelectorComponent.js"], a["Accessibility/Components/SeriesComponent/SeriesComponent.js"], a["Accessibility/Components/ZoomComponent.js"], a["Accessibility/HighContrastMode.js"],
                a["Accessibility/HighContrastTheme.js"], a["Accessibility/Options/A11yDefaults.js"], a["Accessibility/Options/LangDefaults.js"], a["Accessibility/Options/DeprecatedOptions.js"]], function (a, h, m, p, u, q, A, y, f, n, k, c, e, d, b, g, z, B, J, G, D) {
                    a = a.defaultOptions; var w = h.doc, E = m.addEvent, r = m.extend, l = m.fireEvent, t = m.merge, C = p.removeElement; h = function () {
                        function a(a) { this.proxyProvider = this.keyboardNavigation = this.components = this.chart = void 0; this.init(a) } a.prototype.init = function (a) {
                            this.chart = a; w.addEventListener &&
                                a.renderer.isSVG ? (D(a), this.proxyProvider = new e(this.chart), this.initComponents(), this.keyboardNavigation = new f(a, this.components)) : (this.zombie = !0, this.components = {}, a.renderTo.setAttribute("aria-hidden", !0))
                        }; a.prototype.initComponents = function () {
                            var a = this.chart, c = this.proxyProvider, e = a.options.accessibility; this.components = { container: new q, infoRegions: new y, legend: new n, chartMenu: new k, rangeSelector: new d, series: new b, zoom: new g }; e.customComponents && r(this.components, e.customComponents); var f =
                                this.components; this.getComponentOrder().forEach(function (b) { f[b].initBase(a, c); f[b].init() })
                        }; a.prototype.getComponentOrder = function () { if (!this.components) return []; if (!this.components.series) return Object.keys(this.components); var a = Object.keys(this.components).filter(function (a) { return "series" !== a }); return ["series"].concat(a) }; a.prototype.update = function () {
                            var a = this.components, b = this.chart, c = b.options.accessibility; l(b, "beforeA11yUpdate"); b.types = this.getChartTypes(); c = c.keyboardNavigation.order;
                            this.proxyProvider.updateGroupOrder(c); this.getComponentOrder().forEach(function (c) { a[c].onChartUpdate(); l(b, "afterA11yComponentUpdate", { name: c, component: a[c] }) }); this.keyboardNavigation.update(c); !b.highContrastModeActive && z.isHighContrastModeActive() && z.setHighContrastTheme(b); l(b, "afterA11yUpdate", { accessibility: this })
                        }; a.prototype.destroy = function () {
                            var a = this.chart || {}, b = this.components; Object.keys(b).forEach(function (a) { b[a].destroy(); b[a].destroyBase() }); this.proxyProvider && this.proxyProvider.destroy();
                            a.announcerContainer && C(a.announcerContainer); this.keyboardNavigation && this.keyboardNavigation.destroy(); a.renderTo && a.renderTo.setAttribute("aria-hidden", !0); a.focusElement && a.focusElement.removeFocusBorder()
                        }; a.prototype.getChartTypes = function () { var a = {}; this.chart.series.forEach(function (b) { a[b.type] = 1 }); return Object.keys(a) }; return a
                    }(); (function (a) {
                        function e() { this.accessibility && this.accessibility.destroy() } function g() {
                            this.a11yDirty && this.renderTo && (delete this.a11yDirty, this.updateA11yEnabled());
                            var a = this.accessibility; a && !a.zombie && (a.proxyProvider.updateProxyElementPositions(), a.getComponentOrder().forEach(function (b) { a.components[b].onChartRender() }))
                        } function h(a) { if (a = a.options.accessibility) a.customComponents && (this.options.accessibility.customComponents = a.customComponents, delete a.customComponents), t(!0, this.options.accessibility, a), this.accessibility && this.accessibility.destroy && (this.accessibility.destroy(), delete this.accessibility); this.a11yDirty = !0 } function l() {
                            var b = this.accessibility,
                            c = this.options.accessibility; c && c.enabled ? b && !b.zombie ? b.update() : (this.accessibility = b = new a(this), !b.zombie) && b.update() : b ? (b.destroy && b.destroy(), delete this.accessibility) : this.renderTo.setAttribute("aria-hidden", !0)
                        } function m() { this.series.chart.accessibility && (this.series.chart.a11yDirty = !0) } var q = []; a.i18nFormat = u.i18nFormat; a.compose = function (a, p, r, w, t, v, x) {
                            f.compose(p); c.compose(t); n.compose(p, r); k.compose(p); b.compose(p, w, t); u.compose(p); A.compose(p, v); x && d.compose(p, x); -1 === q.indexOf(p) &&
                                (q.push(p), p.prototype.updateA11yEnabled = l, E(p, "destroy", e), E(p, "render", g), E(p, "update", h), ["addSeries", "init"].forEach(function (a) { E(p, a, function () { this.a11yDirty = !0 }) }), ["afterApplyDrilldown", "drillupall"].forEach(function (a) { E(p, a, function () { var a = this.accessibility; a && !a.zombie && a.update() }) })); -1 === q.indexOf(w) && (q.push(w), E(w, "update", m)); -1 === q.indexOf(t) && (q.push(t), ["update", "updatedData", "remove"].forEach(function (a) { E(t, a, function () { this.chart.accessibility && (this.chart.a11yDirty = !0) }) }))
                        }
                    })(h ||
                        (h = {})); t(!0, a, J, { accessibility: { highContrastTheme: B }, lang: G }); return h
                }); A(a, "masters/modules/accessibility.src.js", [a["Core/Globals.js"], a["Accessibility/Accessibility.js"], a["Accessibility/AccessibilityComponent.js"], a["Accessibility/Utils/ChartUtilities.js"], a["Accessibility/Utils/HTMLUtilities.js"], a["Accessibility/KeyboardNavigationHandler.js"], a["Accessibility/Components/SeriesComponent/SeriesDescriber.js"]], function (a, h, m, p, u, q, A) {
                    a.i18nFormat = h.i18nFormat; a.A11yChartUtilities = p; a.A11yHTMLUtilities =
                        u; a.AccessibilityComponent = m; a.KeyboardNavigationHandler = q; a.SeriesAccessibilityDescriber = A; h.compose(a.Axis, a.Chart, a.Legend, a.Point, a.Series, a.SVGElement, a.RangeSelector)
                })
});
//# sourceMappingURL=accessibility.js.map