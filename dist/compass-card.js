/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function t(t,e,i,n){var o,r=arguments.length,s=r<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,n);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(s=(r<3?o(s):r>3?o(e,i,s):o(e,i))||s);return r>3&&s&&Object.defineProperty(e,i,s),s
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */}const e="undefined"!=typeof window&&null!=window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,i=(t,e,i=null)=>{for(;e!==i;){const i=e.nextSibling;t.removeChild(e),e=i}},n=`{{lit-${String(Math.random()).slice(2)}}}`,o=`\x3c!--${n}--\x3e`,r=new RegExp(`${n}|${o}`);class s{constructor(t,e){this.parts=[],this.element=e;const i=[],o=[],s=document.createTreeWalker(e.content,133,null,!1);let c=0,u=-1,p=0;const{strings:h,values:{length:f}}=t;for(;p<f;){const t=s.nextNode();if(null!==t){if(u++,1===t.nodeType){if(t.hasAttributes()){const e=t.attributes,{length:i}=e;let n=0;for(let t=0;t<i;t++)a(e[t].name,"$lit$")&&n++;for(;n-- >0;){const e=h[p],i=l.exec(e)[2],n=i.toLowerCase()+"$lit$",o=t.getAttribute(n);t.removeAttribute(n);const s=o.split(r);this.parts.push({type:"attribute",index:u,name:i,strings:s}),p+=s.length-1}}"TEMPLATE"===t.tagName&&(o.push(t),s.currentNode=t.content)}else if(3===t.nodeType){const e=t.data;if(e.indexOf(n)>=0){const n=t.parentNode,o=e.split(r),s=o.length-1;for(let e=0;e<s;e++){let i,r=o[e];if(""===r)i=d();else{const t=l.exec(r);null!==t&&a(t[2],"$lit$")&&(r=r.slice(0,t.index)+t[1]+t[2].slice(0,-"$lit$".length)+t[3]),i=document.createTextNode(r)}n.insertBefore(i,t),this.parts.push({type:"node",index:++u})}""===o[s]?(n.insertBefore(d(),t),i.push(t)):t.data=o[s],p+=s}}else if(8===t.nodeType)if(t.data===n){const e=t.parentNode;null!==t.previousSibling&&u!==c||(u++,e.insertBefore(d(),t)),c=u,this.parts.push({type:"node",index:u}),null===t.nextSibling?t.data="":(i.push(t),u--),p++}else{let e=-1;for(;-1!==(e=t.data.indexOf(n,e+1));)this.parts.push({type:"node",index:-1}),p++}}else s.currentNode=o.pop()}for(const t of i)t.parentNode.removeChild(t)}}const a=(t,e)=>{const i=t.length-e.length;return i>=0&&t.slice(i)===e},c=t=>-1!==t.index,d=()=>document.createComment(""),l=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function u(t,e){const{element:{content:i},parts:n}=t,o=document.createTreeWalker(i,133,null,!1);let r=h(n),s=n[r],a=-1,c=0;const d=[];let l=null;for(;o.nextNode();){a++;const t=o.currentNode;for(t.previousSibling===l&&(l=null),e.has(t)&&(d.push(t),null===l&&(l=t)),null!==l&&c++;void 0!==s&&s.index===a;)s.index=null!==l?-1:s.index-c,r=h(n,r),s=n[r]}d.forEach(t=>t.parentNode.removeChild(t))}const p=t=>{let e=11===t.nodeType?0:1;const i=document.createTreeWalker(t,133,null,!1);for(;i.nextNode();)e++;return e},h=(t,e=-1)=>{for(let i=e+1;i<t.length;i++){const e=t[i];if(c(e))return i}return-1};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const f=new WeakMap,g=t=>"function"==typeof t&&f.has(t),m={},_={};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class y{constructor(t,e,i){this.__parts=[],this.template=t,this.processor=e,this.options=i}update(t){let e=0;for(const i of this.__parts)void 0!==i&&i.setValue(t[e]),e++;for(const t of this.__parts)void 0!==t&&t.commit()}_clone(){const t=e?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),i=[],n=this.template.parts,o=document.createTreeWalker(t,133,null,!1);let r,s=0,a=0,d=o.nextNode();for(;s<n.length;)if(r=n[s],c(r)){for(;a<r.index;)a++,"TEMPLATE"===d.nodeName&&(i.push(d),o.currentNode=d.content),null===(d=o.nextNode())&&(o.currentNode=i.pop(),d=o.nextNode());if("node"===r.type){const t=this.processor.handleTextExpression(this.options);t.insertAfterNode(d.previousSibling),this.__parts.push(t)}else this.__parts.push(...this.processor.handleAttributeExpressions(d,r.name,r.strings,this.options));s++}else this.__parts.push(void 0),s++;return e&&(document.adoptNode(t),customElements.upgrade(t)),t}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const S=` ${n} `;class v{constructor(t,e,i,n){this.strings=t,this.values=e,this.type=i,this.processor=n}getHTML(){const t=this.strings.length-1;let e="",i=!1;for(let r=0;r<t;r++){const t=this.strings[r],s=t.lastIndexOf("\x3c!--");i=(s>-1||i)&&-1===t.indexOf("--\x3e",s+1);const a=l.exec(t);e+=null===a?t+(i?S:o):t.substr(0,a.index)+a[1]+a[2]+"$lit$"+a[3]+n}return e+=this.strings[t],e}getTemplateElement(){const t=document.createElement("template");return t.innerHTML=this.getHTML(),t}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const N=t=>null===t||!("object"==typeof t||"function"==typeof t),b=t=>Array.isArray(t)||!(!t||!t[Symbol.iterator]);class w{constructor(t,e,i){this.dirty=!0,this.element=t,this.name=e,this.strings=i,this.parts=[];for(let t=0;t<i.length-1;t++)this.parts[t]=this._createPart()}_createPart(){return new E(this)}_getValue(){const t=this.strings,e=t.length-1;let i="";for(let n=0;n<e;n++){i+=t[n];const e=this.parts[n];if(void 0!==e){const t=e.value;if(N(t)||!b(t))i+="string"==typeof t?t:String(t);else for(const e of t)i+="string"==typeof e?e:String(e)}}return i+=t[e],i}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class E{constructor(t){this.value=void 0,this.committer=t}setValue(t){t===m||N(t)&&t===this.value||(this.value=t,g(t)||(this.committer.dirty=!0))}commit(){for(;g(this.value);){const t=this.value;this.value=m,t(this)}this.value!==m&&this.committer.commit()}}class W{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(d()),this.endNode=t.appendChild(d())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=d()),t.__insert(this.endNode=d())}insertAfterPart(t){t.__insert(this.startNode=d()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){if(null===this.startNode.parentNode)return;for(;g(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=m,t(this)}const t=this.__pendingValue;t!==m&&(N(t)?t!==this.value&&this.__commitText(t):t instanceof v?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):b(t)?this.__commitIterable(t):t===_?(this.value=_,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){const e=this.startNode.nextSibling,i="string"==typeof(t=null==t?"":t)?t:String(t);e===this.endNode.previousSibling&&3===e.nodeType?e.data=i:this.__commitNode(document.createTextNode(i)),this.value=t}__commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof y&&this.value.template===e)this.value.update(t.values);else{const i=new y(e,t.processor,this.options),n=i._clone();i.update(t.values),this.__commitNode(n),this.value=i}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let i,n=0;for(const o of t)i=e[n],void 0===i&&(i=new W(this.options),e.push(i),0===n?i.appendIntoPart(this):i.insertAfterPart(e[n-1])),i.setValue(o),i.commit(),n++;n<e.length&&(e.length=n,this.clear(i&&i.endNode))}clear(t=this.startNode){i(this.startNode.parentNode,t.nextSibling,this.endNode)}}class x{constructor(t,e,i){if(this.value=void 0,this.__pendingValue=void 0,2!==i.length||""!==i[0]||""!==i[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=i}setValue(t){this.__pendingValue=t}commit(){for(;g(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=m,t(this)}if(this.__pendingValue===m)return;const t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=m}}class k extends w{constructor(t,e,i){super(t,e,i),this.single=2===i.length&&""===i[0]&&""===i[1]}_createPart(){return new O(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class O extends E{}let P=!1;(()=>{try{const t={get capture(){return P=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch(t){}})();class C{constructor(t,e,i){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=i,this.__boundHandleEvent=t=>this.handleEvent(t)}setValue(t){this.__pendingValue=t}commit(){for(;g(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=m,t(this)}if(this.__pendingValue===m)return;const t=this.__pendingValue,e=this.value,i=null==t||null!=e&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),n=null!=t&&(null==e||i);i&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),n&&(this.__options=V(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=m}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}const V=t=>t&&(P?{capture:t.capture,passive:t.passive,once:t.once}:t.capture)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */;function z(t){let e=M.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},M.set(t.type,e));let i=e.stringsArray.get(t.strings);if(void 0!==i)return i;const o=t.strings.join(n);return i=e.keyString.get(o),void 0===i&&(i=new s(t,t.getTemplateElement()),e.keyString.set(o,i)),e.stringsArray.set(t.strings,i),i}const M=new Map,D=new WeakMap;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const A=new
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class{handleAttributeExpressions(t,e,i,n){const o=e[0];if("."===o){return new k(t,e.slice(1),i).parts}if("@"===o)return[new C(t,e.slice(1),n.eventContext)];if("?"===o)return[new x(t,e.slice(1),i)];return new w(t,e,i).parts}handleTextExpression(t){return new W(t)}};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.2.1");const T=(t,...e)=>new v(t,e,"html",A)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */,j=(t,e)=>`${t}--${e}`;let $=!0;void 0===window.ShadyCSS?$=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),$=!1);const R=t=>e=>{const i=j(e.type,t);let o=M.get(i);void 0===o&&(o={stringsArray:new WeakMap,keyString:new Map},M.set(i,o));let r=o.stringsArray.get(e.strings);if(void 0!==r)return r;const a=e.strings.join(n);if(r=o.keyString.get(a),void 0===r){const i=e.getTemplateElement();$&&window.ShadyCSS.prepareTemplateDom(i,t),r=new s(e,i),o.keyString.set(a,r)}return o.stringsArray.set(e.strings,r),r},Z=["html","svg"],U=new Set,Y=(t,e,i)=>{U.add(t);const n=i?i.element:document.createElement("template"),o=e.querySelectorAll("style"),{length:r}=o;if(0===r)return void window.ShadyCSS.prepareTemplateStyles(n,t);const s=document.createElement("style");for(let t=0;t<r;t++){const e=o[t];e.parentNode.removeChild(e),s.textContent+=e.textContent}(t=>{Z.forEach(e=>{const i=M.get(j(e,t));void 0!==i&&i.keyString.forEach(t=>{const{element:{content:e}}=t,i=new Set;Array.from(e.querySelectorAll("style")).forEach(t=>{i.add(t)}),u(t,i)})})})(t);const a=n.content;i?function(t,e,i=null){const{element:{content:n},parts:o}=t;if(null==i)return void n.appendChild(e);const r=document.createTreeWalker(n,133,null,!1);let s=h(o),a=0,c=-1;for(;r.nextNode();){c++;for(r.currentNode===i&&(a=p(e),i.parentNode.insertBefore(e,i));-1!==s&&o[s].index===c;){if(a>0){for(;-1!==s;)o[s].index+=a,s=h(o,s);return}s=h(o,s)}}}(i,s,a.firstChild):a.insertBefore(s,a.firstChild),window.ShadyCSS.prepareTemplateStyles(n,t);const c=a.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==c)e.insertBefore(c.cloneNode(!0),e.firstChild);else if(i){a.insertBefore(s,a.firstChild);const t=new Set;t.add(s),u(i,t)}};window.JSCompiler_renameProperty=(t,e)=>t;const I={toAttribute(t,e){switch(e){case Boolean:return t?"":null;case Object:case Array:return null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){switch(e){case Boolean:return null!==t;case Number:return null===t?null:Number(t);case Object:case Array:return JSON.parse(t)}return t}},q=(t,e)=>e!==t&&(e==e||t==t),H={attribute:!0,type:String,converter:I,reflect:!1,hasChanged:q};class L extends HTMLElement{constructor(){super(),this._updateState=0,this._instanceProperties=void 0,this._updatePromise=new Promise(t=>this._enableUpdatingResolver=t),this._changedProperties=new Map,this._reflectingProperties=void 0,this.initialize()}static get observedAttributes(){this.finalize();const t=[];return this._classProperties.forEach((e,i)=>{const n=this._attributeNameForProperty(i,e);void 0!==n&&(this._attributeToPropertyMap.set(n,i),t.push(n))}),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const t=Object.getPrototypeOf(this)._classProperties;void 0!==t&&t.forEach((t,e)=>this._classProperties.set(e,t))}}static createProperty(t,e=H){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;const i="symbol"==typeof t?Symbol():"__"+t,n=this.getPropertyDescriptor(t,i,e);void 0!==n&&Object.defineProperty(this.prototype,t,n)}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(i){const n=this[t];this[e]=i,this._requestUpdate(t,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this._classProperties&&this._classProperties.get(t)||H}static finalize(){const t=Object.getPrototypeOf(this);if(t.hasOwnProperty("finalized")||t.finalize(),this.finalized=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const t=this.properties,e=[...Object.getOwnPropertyNames(t),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t):[]];for(const i of e)this.createProperty(i,t[i])}}static _attributeNameForProperty(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}static _valueHasChanged(t,e,i=q){return i(t,e)}static _propertyValueFromAttribute(t,e){const i=e.type,n=e.converter||I,o="function"==typeof n?n:n.fromAttribute;return o?o(t,i):t}static _propertyValueToAttribute(t,e){if(void 0===e.reflect)return;const i=e.type,n=e.converter;return(n&&n.toAttribute||I.toAttribute)(t,i)}initialize(){this._saveInstanceProperties(),this._requestUpdate()}_saveInstanceProperties(){this.constructor._classProperties.forEach((t,e)=>{if(this.hasOwnProperty(e)){const t=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,t)}})}_applyInstanceProperties(){this._instanceProperties.forEach((t,e)=>this[e]=t),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){void 0!==this._enableUpdatingResolver&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,i){e!==i&&this._attributeToProperty(t,i)}_propertyToAttribute(t,e,i=H){const n=this.constructor,o=n._attributeNameForProperty(t,i);if(void 0!==o){const t=n._propertyValueToAttribute(e,i);if(void 0===t)return;this._updateState=8|this._updateState,null==t?this.removeAttribute(o):this.setAttribute(o,t),this._updateState=-9&this._updateState}}_attributeToProperty(t,e){if(8&this._updateState)return;const i=this.constructor,n=i._attributeToPropertyMap.get(t);if(void 0!==n){const t=i.getPropertyOptions(n);this._updateState=16|this._updateState,this[n]=i._propertyValueFromAttribute(e,t),this._updateState=-17&this._updateState}}_requestUpdate(t,e){let i=!0;if(void 0!==t){const n=this.constructor,o=n.getPropertyOptions(t);n._valueHasChanged(this[t],e,o.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),!0!==o.reflect||16&this._updateState||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,o))):i=!1}!this._hasRequestedUpdate&&i&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(t,e){return this._requestUpdate(t,e),this.updateComplete}async _enqueueUpdate(){this._updateState=4|this._updateState;try{await this._updatePromise}catch(t){}const t=this.performUpdate();return null!=t&&await t,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return 4&this._updateState}get hasUpdated(){return 1&this._updateState}performUpdate(){this._instanceProperties&&this._applyInstanceProperties();let t=!1;const e=this._changedProperties;try{t=this.shouldUpdate(e),t?this.update(e):this._markUpdated()}catch(e){throw t=!1,this._markUpdated(),e}t&&(1&this._updateState||(this._updateState=1|this._updateState,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=-5&this._updateState}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((t,e)=>this._propertyToAttribute(e,this[e],t)),this._reflectingProperties=void 0),this._markUpdated()}updated(t){}firstUpdated(t){}}L.finalized=!0;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const F=t=>e=>"function"==typeof e?((t,e)=>(window.customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:n}=e;return{kind:i,elements:n,finisher(e){window.customElements.define(t,e)}}})(t,e),J=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?Object.assign(Object.assign({},e),{finisher(i){i.createProperty(e.key,t)}}):{kind:"field",key:Symbol(),placement:"own",descriptor:{},initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};function B(t){return(e,i)=>void 0!==i?((t,e,i)=>{e.constructor.createProperty(i,t)})(t,e,i):J(t,e)}
/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const K="adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,G=Symbol();class Q{constructor(t,e){if(e!==G)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return void 0===this._styleSheet&&(K?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const X=(t,...e)=>{const i=e.reduce((e,i,n)=>e+(t=>{if(t instanceof Q)return t.cssText;if("number"==typeof t)return t;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(i)+t[n+1],t[0]);return new Q(i,G)};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
(window.litElementVersions||(window.litElementVersions=[])).push("2.3.1");const tt={};class et extends L{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;const t=this.getStyles();if(void 0===t)this._styles=[];else if(Array.isArray(t)){const e=(t,i)=>t.reduceRight((t,i)=>Array.isArray(i)?e(i,t):(t.add(i),t),i),i=e(t,new Set),n=[];i.forEach(t=>n.unshift(t)),this._styles=n}else this._styles=[t]}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const t=this.constructor._styles;0!==t.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?K?this.renderRoot.adoptedStyleSheets=t.map(t=>t.styleSheet):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(t=>t.cssText),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(t){const e=this.render();super.update(t),e!==tt&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(t=>{const e=document.createElement("style");e.textContent=t.cssText,this.renderRoot.appendChild(e)}))}render(){return tt}}et.finalized=!0,et.render=(t,e,n)=>{if(!n||"object"!=typeof n||!n.scopeName)throw new Error("The `scopeName` option is required.");const o=n.scopeName,r=D.has(e),s=$&&11===e.nodeType&&!!e.host,a=s&&!U.has(o),c=a?document.createDocumentFragment():e;if(((t,e,n)=>{let o=D.get(e);void 0===o&&(i(e,e.firstChild),D.set(e,o=new W(Object.assign({templateFactory:z},n))),o.appendInto(e)),o.setValue(t),o.commit()})(t,c,Object.assign({templateFactory:R(o)},n)),a){const t=D.get(c);D.delete(c);const n=t.value instanceof y?t.value.template:void 0;Y(o,c,n),i(e,e.firstChild),e.appendChild(c),D.set(e,t)}!r&&s&&window.ShadyCSS.styleElement(e.host)};var it=/d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,nt="[^\\s]+",ot=/\[([^]*?)\]/gm;function rt(t,e){for(var i=[],n=0,o=t.length;n<o;n++)i.push(t[n].substr(0,e));return i}var st=function(t){return function(e,i){var n=i[t].map((function(t){return t.toLowerCase()})).indexOf(e.toLowerCase());return n>-1?n:null}};function at(t){for(var e=[],i=1;i<arguments.length;i++)e[i-1]=arguments[i];for(var n=0,o=e;n<o.length;n++){var r=o[n];for(var s in r)t[s]=r[s]}return t}var ct=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dt=["January","February","March","April","May","June","July","August","September","October","November","December"],lt=rt(dt,3),ut={dayNamesShort:rt(ct,3),dayNames:ct,monthNamesShort:lt,monthNames:dt,amPm:["am","pm"],DoFn:function(t){return t+["th","st","nd","rd"][t%10>3?0:(t-t%10!=10?1:0)*t%10]}},pt=at({},ut),ht=function(t,e){for(void 0===e&&(e=2),t=String(t);t.length<e;)t="0"+t;return t},ft={D:function(t){return String(t.getDate())},DD:function(t){return ht(t.getDate())},Do:function(t,e){return e.DoFn(t.getDate())},d:function(t){return String(t.getDay())},dd:function(t){return ht(t.getDay())},ddd:function(t,e){return e.dayNamesShort[t.getDay()]},dddd:function(t,e){return e.dayNames[t.getDay()]},M:function(t){return String(t.getMonth()+1)},MM:function(t){return ht(t.getMonth()+1)},MMM:function(t,e){return e.monthNamesShort[t.getMonth()]},MMMM:function(t,e){return e.monthNames[t.getMonth()]},YY:function(t){return ht(String(t.getFullYear()),4).substr(2)},YYYY:function(t){return ht(t.getFullYear(),4)},h:function(t){return String(t.getHours()%12||12)},hh:function(t){return ht(t.getHours()%12||12)},H:function(t){return String(t.getHours())},HH:function(t){return ht(t.getHours())},m:function(t){return String(t.getMinutes())},mm:function(t){return ht(t.getMinutes())},s:function(t){return String(t.getSeconds())},ss:function(t){return ht(t.getSeconds())},S:function(t){return String(Math.round(t.getMilliseconds()/100))},SS:function(t){return ht(Math.round(t.getMilliseconds()/10),2)},SSS:function(t){return ht(t.getMilliseconds(),3)},a:function(t,e){return t.getHours()<12?e.amPm[0]:e.amPm[1]},A:function(t,e){return t.getHours()<12?e.amPm[0].toUpperCase():e.amPm[1].toUpperCase()},ZZ:function(t){var e=t.getTimezoneOffset();return(e>0?"-":"+")+ht(100*Math.floor(Math.abs(e)/60)+Math.abs(e)%60,4)},Z:function(t){var e=t.getTimezoneOffset();return(e>0?"-":"+")+ht(Math.floor(Math.abs(e)/60),2)+":"+ht(Math.abs(e)%60,2)}},gt=function(t){return+t-1},mt=[null,"[1-9]\\d?"],_t=[null,nt],yt=["isPm",nt,function(t,e){var i=t.toLowerCase();return i===e.amPm[0]?0:i===e.amPm[1]?1:null}],St=["timezoneOffset","[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",function(t){var e=(t+"").match(/([+-]|\d\d)/gi);if(e){var i=60*+e[1]+parseInt(e[2],10);return"+"===e[0]?i:-i}return 0}],vt=(st("monthNamesShort"),st("monthNames"),{default:"ddd MMM DD YYYY HH:mm:ss",shortDate:"M/D/YY",mediumDate:"MMM D, YYYY",longDate:"MMMM D, YYYY",fullDate:"dddd, MMMM D, YYYY",isoDate:"YYYY-MM-DD",isoDateTime:"YYYY-MM-DDTHH:mm:ssZ",shortTime:"HH:mm",mediumTime:"HH:mm:ss",longTime:"HH:mm:ss.SSS"});var Nt=function(t,e,i){if(void 0===e&&(e=vt.default),void 0===i&&(i={}),"number"==typeof t&&(t=new Date(t)),"[object Date]"!==Object.prototype.toString.call(t)||isNaN(t.getTime()))throw new Error("Invalid Date pass to format");var n=[];e=(e=vt[e]||e).replace(ot,(function(t,e){return n.push(e),"@@@"}));var o=at(at({},pt),i);return(e=e.replace(it,(function(e){return ft[e](t,o)}))).replace(/@@@/g,(function(){return n.shift()}))},bt=(function(){try{(new Date).toLocaleDateString("i")}catch(t){return"RangeError"===t.name}}(),function(){try{(new Date).toLocaleString("i")}catch(t){return"RangeError"===t.name}}(),function(){try{(new Date).toLocaleTimeString("i")}catch(t){return"RangeError"===t.name}}(),{version:"Verze",description:"Zobrazit kompas s indikátorem ve směru hodnoty entity",invalid_configuration:"Neplatná konfigurace",no_entity:"Entita není nakonfigurována",offset_not_a_number:"Kompenzace směru není číslo",invalid:"Neplatné",on:"Zapnuto",off:"Vypnuto"}),wt={name:"Název",optional:"Volitelný",entity:"Entita",required:"Požadované",primary:"Směr",secondary:"Sekundární",indicator:"Indikátor",direction:"Směr",offset:"Kompenzace",show:"Ukázat",abbreviations:"Zkratky",toggle:"Přepnout",language:"Jazyk","primary entity description":"Entita směru ","secondary entity description":"Sekundární entita","language description":"Jazyk zkratky směru","offset description":"Kompenzace směru","show north description":"Zobrazit indikátor severu"},Et={north:"Sever",east:"Východ",south:"Jih",west:"Západ",N:"S",NNE:"SSV",NE:"SV",ENE:"VSV",E:"V",ESE:"VJV",SE:"JV",SSE:"JJV",S:"J",SSW:"JJZ",SW:"JZ",WSW:"ZJZ",W:"Z",WNW:"ZSZ",NW:"SZ",NNW:"SSZ"},Wt={common:bt,editor:wt,directions:Et},xt={version:"Version",description:"Zeigt einen Kompass mit einem Indikator in Richtung des Entitätswertes an",invalid_configuration:"Ungültige Konfiguration",no_entity:"Entität nicht konfiguriert",offset_not_a_number:"Richtungs-Offset ist keine Zahl",invalid:"ungültig",on:"An",off:"Aus"},kt={name:"Name",optional:"Optional",entity:"Entität",required:"Benötigt",primary:"Richtung",secondary:"Sekundär",indicator:"Indikator",direction:"Richtung",offset:"Offset",show:"Zeige",abbreviations:"Abkürzungen",toggle:"Umschalten",language:"Sprache","primary entity description":"Richtungsentität","secondary entity description":"Sekundäre Entität","language description":"Sprache der Himmelsrichtungen","offset description":"Richtungsversatz","show north description":"Nord-Indikator anzeigen"},Ot={north:"Norden",east:"Osten",south:"Süden",west:"Westen",N:"N",NNE:"NNO",NE:"NO",ENE:"ONO",E:"O",ESE:"OSO",SE:"SO",SSE:"SSO",S:"S",SSW:"SSW",SW:"SW",WSW:"WSW",W:"W",WNW:"WNW",NW:"NW",NNW:"NNW"},Pt={common:xt,editor:kt,directions:Ot},Ct={version:"Version",description:"Show a compass with an indicator in the direction of the entity's value",invalid_configuration:"Invalid configuration",no_entity:"Entity not configured",offset_not_a_number:"Direction offset is not a number",invalid:"invalid",on:"On",off:"Off"},Vt={name:"Name",optional:"Optional",entity:"Entity",required:"Required",primary:"Direction",secondary:"Secondary",indicator:"Indicator",direction:"Direction",offset:"Offset",show:"Show",abbreviations:"Abbreviations",toggle:"Toggle",language:"Language","primary entity description":"Direction entity","secondary entity description":"Secondary entity","language description":"Direction abbreviation language","offset description":"Direction offset","show north description":"Show north indicator"},zt={north:"North",east:"East",south:"South",west:"West",N:"N",NNE:"NNE",NE:"NE",ENE:"ENE",E:"E",ESE:"ESE",SE:"SE",SSE:"SSE",S:"S",SSW:"SSW",SW:"SW",WSW:"WSW",W:"W",WNW:"WNW",NW:"NW",NNW:"NNW"},Mt={common:Ct,editor:Vt,directions:zt},Dt={version:"Versión",description:"Mostrar una brújula con un indicador en la dirección del valor de la entidad",invalid_configuration:"Configuración inválida",no_entity:"Entidad no configurada",offset_not_a_number:"El desplazamiento de dirección no es un número",invalid:"inválido",on:"Encendido",off:"Apagado"},At={name:"Nombre",optional:"Opcional",entity:"Entidad",required:"Requerido",primary:"Primario",secondary:"Secundario",indicator:"Indicador",direction:"Dirección",offset:"Desplazamiento",show:"Mostrar",abbreviations:"Abreviaturas",toggle:"Conmutar",language:"Idioma","primary entity description":"Entidad primaria","secondary entity description":"Entidad secundaria","language description":"Idioma abreviatura dirección","offset description":"Desplazamiento de la dirección","show north description":"Mostrar indicador del norte"},Tt={north:"Norte",east:"Este",south:"Sur",west:"Oeste",N:"N",NNE:"NNE",NE:"NE",ENE:"ENE",E:"E",ESE:"ESE",SE:"SE",SSE:"SSE",S:"S",SSW:"SSO",SW:"SO",WSW:"OSO",W:"O",WNW:"ONO",NW:"NO",NNW:"NNO"},jt={common:Dt,editor:At,directions:Tt},$t={version:"version",description:"Montre une boussole avec un indicateur dans la direction de la valeur de l'entité",invalid_configuration:"configuration non valable",no_entity:"entité non configurée",offset_not_a_number:"Le décalage de direction n'est pas un nombre",invalid:"invalide",on:"allumé",off:"éteint"},Rt={name:"Nom",optional:"Facultatif",entity:"entité",required:"obligatoire",primary:"primaire",secondary:"secondaire",indicator:"indicateur",direction:"direction",offset:"décalage",show:"montrer",abbreviations:"abréviations",toggle:"basculer",language:"langue","primary entity description":"Entité primaire","secondary entity description":"Entité secondaire","language description":"Langue abréviation de la direction","offset description":"Décalage de la direction","show north description":"Afficher l'indicateur du nord"},Zt={north:"Nord",east:"Est",south:"Sud",west:"Ouest",N:"N",NNE:"NNE",NE:"NE",ENE:"ENE",E:"E",ESE:"ESE",SE:"SE",SSE:"SSE",S:"S",SSW:"SSO",SW:"SO",WSW:"OSO",W:"O",WNW:"ONO",NW:"NO",NNW:"NNO"},Ut={common:$t,editor:Rt,directions:Zt},Yt={version:"Versione",description:"Mostra una bussola con un indicatore nella direzione indicata dal valore dell'entità.",invalid_configuration:"Configurazione non valida",no_entity:"Entità non configurata",offset_not_a_number:"L'offset della direzione non è un numero.",invalid:"invalido",on:"Acceso",off:"Spento"},It={name:"Nome",optional:"Opzionale",entity:"Entità",required:"Richiesto",primary:"Direzione",secondary:"Secondario",indicator:"Indicatore",direction:"Direzione",offset:"Compensazione",show:"Mostra",abbreviations:"Abbreviazioni",toggle:"Inverti stato",language:"Lingua","primary entity description":"Entità primaria","secondary entity description":"Entità secondaria","language description":"Lingua abbreviazione direzione","offset description":"Compensazione direzione","show north description":"Mostra indicatore Nord"},qt={north:"Nord",east:"Est",south:"Sud",west:"Ovest",N:"N",NNE:"NNE",NE:"NE",ENE:"ENE",E:"E",ESE:"ESE",SE:"SE",SSE:"SSE",S:"S",SSW:"SSO",SW:"SO",WSW:"OSO",W:"O",WNW:"ONO",NW:"NO",NNW:"NNO"},Ht={common:Yt,editor:It,directions:qt},Lt={version:"Versie",description:"Toon een kompas met een pijl wijzend naar de waarde van de entity",invalid_configuration:"Foutieve configuratie",no_entity:"Entity niet geconfigureerd",offset_not_a_number:"Direction offset is geen nummer",invalid:"ongeldig",on:"Aan",off:"Uit"},Ft={name:"Naam",optional:"Optioneel",entity:"Entiteit",required:"Noodzakelijk",primary:"Richting",secondary:"Secundaire",indicator:"Wijzer",direction:"Richting",offset:"Afwijking",show:"Toon",abbreviations:"Afkorting",toggle:"Wissel",language:"Taal","primary entity description":"Richtings entiteit","secondary entity description":"Secundaire entiteit","language description":"Richting afkortings taal","offset description":"Richtingsafwijking","show north description":"Toon indicator noorden"},Jt={north:"Noorden",east:"Oosten",south:"Zuiden",west:"Westen",N:"N",NNE:"NNO",NE:"NO",ENE:"ONO",E:"O",ESE:"OZO",SE:"ZO",SSE:"ZZO",S:"Z",SSW:"ZZW",SW:"ZW",WSW:"WZW",W:"W",WNW:"WNW",NW:"NW",NNW:"NNW"},Bt={common:Lt,editor:Ft,directions:Jt},Kt={version:"Versjon",description:"Vis et kompass med en indikator i retning av enhetens verdi",invalid_configuration:"Ugyldig konfigurasjon",no_entity:"Enheten er ikke konfigurert",offset_not_a_number:"Retningsforskyvning er ikke et tall",invalid:"Ugyldig",on:"På",off:"Av"},Gt={name:"Navn",optional:"Valgfri",entity:"Enhet",required:"Obligatorisk",primary:"Primær",secondary:"Sekundær",indicator:"Indikator",direction:"Retning",offset:"Offset",show:"Vis",abbreviations:"Forkortelser",toggle:"Veksle",language:"Språk","primary entity description":"Retningsenhet","secondary entity description":"Sekundær enhet","language description":"Retning for språkforkortelser","offset description":"Retningsforskyvningt","show north description":"Vis nordindikator"},Qt={north:"Nord",east:"Øst",south:"Sør",west:"Vest",N:"N",NNE:"NNØ",NE:"NØ",ENE:"ØNØ",E:"Ø",ESE:"ØSØ",SE:"SØ",SSE:"SSØ",S:"S",SSW:"SSV",SW:"SV",WSW:"VSV",W:"V",WNW:"VNV",NW:"NV",NNW:"NNV"},Xt={common:Kt,editor:Gt,directions:Qt},te={version:"Wersja",description:"Pokazuje kompas ze wskaźnikiem w kierunku wartości encji",invalid_configuration:"Nieprawidłowa konfiguracja",no_entity:"Encja nie została skonfigurowana",offset_not_a_number:"Przesunięcie kierunkowe nie jest liczbą",invalid:"Nieprawidłowy",on:"Włączony",off:"Wyłączony"},ee={name:"Nazwa",optional:"Opcjonalny",entity:"Encja",required:"Wymagany",primary:"Kierunek",secondary:"Dodatkowa",indicator:"Wskaźnik",direction:"Kierunek",offset:"Przesunięcie",show:"Pokaż",abbreviations:"Skróty",toggle:"Przełącznik",language:"Język","primary entity description":"Encja Kierunku","secondary entity description":"Encja Dodatkowa","language description":"Język Skrótów Kierunków","offset description":"Przesunięcie Kierunku","show north description":"Pokaż Wskaźnik Północy"},ie={north:"Północ",east:"Wschód",south:"Południe",west:"Zachód",N:"Pn",NNE:"Pn Pn Wsch",NE:"Pn Wsch",ENE:"Wsch Pn Wsch",E:"Wsch",ESE:"Wsch Pd Wsch",SE:"Pd Wsch",SSE:"Pd Pd Wsch",S:"Pd",SSW:"Pd Pd Zach",SW:"Pd Zach",WSW:"Zach Pd Zach",W:"Zach",WNW:"Zach Pn Zach",NW:"Pn Zach",NNW:"Pn Pn Zach"},ne={common:te,editor:ee,directions:ie},oe={version:"versão",description:"Exibe uma bússola com um indicador na direção do valor da entidade",invalid_configuration:"configuração inválida",no_entity:"entidade não configurada",offset_not_a_number:"o offset direcional não é um número",invalid:"inválido",on:"ligado",off:"desligado"},re={name:"nome",optional:"opcional",entity:"entidade",required:"necessário",primary:"primário",secondary:"secundário",indicator:"indicador",direction:"direção",offset:"offset",show:"mostra",abbreviations:"abreviações",toggle:"alternar",language:"idioma","primary entity description":"Entidade primária","secondary entity description":"Entidade secundária","language description":"Idioma abreviação de direção","offset description":"Offset de direção","show north description":"Mostrar o indicador norte"},se={north:"norte",east:"leste",south:"sul",west:"oeste",N:"N",NNE:"NNE",NE:"NE",ENE:"ENE",E:"L",ESE:"ESE",SE:"SE",SSE:"SSE",S:"S",SSW:"SSO",SW:"SO",WSW:"OSO",W:"O",WNW:"ONO",NW:"NO",NNW:"NNO"},ae={common:oe,editor:re,directions:se},ce={version:"Версия",description:"Показывает компас с индикатором в направлении значения объекта",invalid_configuration:"Неверная конфигурация",no_entity:"Объект не сконфигурирован",offset_not_a_number:"Смещение направления не является числом",invalid:"ошибка",on:"Вкл",off:"Выкл"},de={name:"Имя",optional:"Не обязательно",entity:"Объект",required:"Обязательно",primary:"Направление",secondary:"Дополнительно",indicator:"Индикатор",direction:"Направление",offset:"Смещение",show:"Показать",abbreviations:"Сокращения",toggle:"Включить",language:"Язык","primary entity description":"Объект направления","secondary entity description":"Дополнительный объект","language description":"Язык аббревиатуры направления","offset description":"Смещение направления","show north description":"Показать индикатор севера"},le={north:"Север",east:"Восток",south:"Юг",west:"Запад",N:"С",NNE:"ССВ",NE:"СВ",ENE:"ВСВ",E:"В",ESE:"ВСВ",SE:"ЮВ",SSE:"ЮЮВ",S:"Ю",SSW:"ЮЮЗ",SW:"ЮЗ",WSW:"ЗЮЗ",W:"З",WNW:"ЗСЗ",NW:"СЗ",NNW:"ССЗ"},ue={common:ce,editor:de,directions:le};const pe={cz:Object.freeze({__proto__:null,common:bt,editor:wt,directions:Et,default:Wt}),de:Object.freeze({__proto__:null,common:xt,editor:kt,directions:Ot,default:Pt}),en:Object.freeze({__proto__:null,common:Ct,editor:Vt,directions:zt,default:Mt}),es:Object.freeze({__proto__:null,common:Dt,editor:At,directions:Tt,default:jt}),fr:Object.freeze({__proto__:null,common:$t,editor:Rt,directions:Zt,default:Ut}),it:Object.freeze({__proto__:null,common:Yt,editor:It,directions:qt,default:Ht}),nl:Object.freeze({__proto__:null,common:Lt,editor:Ft,directions:Jt,default:Bt}),no:Object.freeze({__proto__:null,common:Kt,editor:Gt,directions:Qt,default:Xt}),pl:Object.freeze({__proto__:null,common:te,editor:ee,directions:ie,default:ne}),pt:Object.freeze({__proto__:null,common:oe,editor:re,directions:se,default:ae}),ru:Object.freeze({__proto__:null,common:ce,editor:de,directions:le,default:ue})},he=[...Object.keys(pe),""].sort();function fe(t,e="",i="",n=""){let o;""===n&&(n=(localStorage.getItem("selectedLanguage")||"en").replace(/['"]+/g,"").replace("-","_"));try{o=t.split(".").reduce((t,e)=>t[e],pe[n])}catch(e){o=t.split(".").reduce((t,e)=>t[e],pe.en)}return void 0===o&&(o=t.split(".").reduce((t,e)=>t[e],pe.en)),""!==e&&""!==i&&(o=o.replace(e,i)),o}const ge="mdi:compass",me={N:0,NNE:22.5,NE:45,ENE:67.5,E:90,ESE:112.5,SE:135,SSE:157.5,S:180,SSW:202.5,SW:225,WSW:247.5,W:270,WNW:292.5,NW:315,NNW:337.5},_e=[...Object.keys(me)],ye=fe("common.invalid"),Se=["arrow_inward","arrow_outward","circle"].sort(),ve=["sensor","input_number","input_text"];let Ne=class extends et{setConfig(t){this._config=t}get _name(){return this._config&&this._config.name||""}get _entity(){return this._config&&this._config.entity||""}get _secondary_entity(){return this._config&&this._config.secondary_entity||""}get _direction_offset(){return this._config&&this._config.direction_offset||"0"}get _compass_indicator(){var t,e;return this._config&&(null===(e=null===(t=this._config)||void 0===t?void 0:t.compass)||void 0===e?void 0:e.indicator)||Se[1]}get _compass_show_north(){var t,e;return this._config&&(null===(e=null===(t=this._config)||void 0===t?void 0:t.compass)||void 0===e?void 0:e.show_north)||!1}get _compass_language(){var t,e;return this._config&&(null===(e=null===(t=this._config)||void 0===t?void 0:t.compass)||void 0===e?void 0:e.language)||""}render(){if(!this.hass)return T``;const t=Object.keys(this.hass.states).filter(t=>ve.includes(t.substr(0,t.indexOf(".")))).sort();return T`
      <div class="card-config">
        ${this.getEditorInput("editor.name","editor.optional","name",this._name)}
        ${this.getEditorDropDown("editor.primary entity description","editor.required","entity",this._entity,t)}
        ${this.getEditorDropDown("editor.secondary entity description","editor.optional","secondary_entity",this._secondary_entity,t)}
        ${this.getEditorDropDown("editor.indicator","editor.optional","compass.indicator",this._compass_indicator,Se)}
        ${this.getEditorDropDown("editor.language description","editor.optional","compass.language",this._compass_language,he)}
        ${this.getEditorInput("editor.offset description","editor.optional","direction_offset",this._direction_offset)}
        ${this.getEditorSwitch("editor.show north description","compass.show_north",this._compass_show_north)}
      </div>
    `}getValue(t,e){const i=t.configValue.indexOf(".");if(i>-1){const n=t.configValue.substr(0,i),o=t.configValue.substr(i+1,t.configValue.length);return o.indexOf(".")>-1&&this.getValue(t,o),Object.assign(Object.assign({},e),{[n]:Object.assign(Object.assign({},e[n]),{[o]:void 0!==t.checked?t.checked:t.value})})}return Object.assign(Object.assign({},e),{[t.configValue]:void 0!==t.checked?t.checked:t.value})}_valueChanged(t){if(!this._config||!this.hass)return;const e=t.target;if(void 0!==e.checked){if(this["_"+e.configValue]===e.checked)return}else if(this["_"+e.configValue]===e.value)return;e.configValue&&(this._config=this.getValue(e,this._config)),function(t,e,i,n){n=n||{},i=null==i?{}:i;var o=new Event(e,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});o.detail=i,t.dispatchEvent(o)}(this,"config-changed",{config:this._config})}getEditorDropDown(t,e,i,n,o){return T` <paper-dropdown-menu class="editor-entity-select" label="${fe(t)} (${fe(e)})" @value-changed=${this._valueChanged} .configValue=${i}>
      <paper-listbox slot="dropdown-content" .selected=${o.indexOf(n)}>
        ${o.map(t=>T` <paper-item>${t}</paper-item> `)}
      </paper-listbox>
    </paper-dropdown-menu>`}getEditorInput(t,e,i,n){return T`<paper-input label="${fe(t)} (${fe(e)})" .value=${n} .configValue=${i} @value-changed=${this._valueChanged}></paper-input>`}getEditorSwitch(t,e,i){return T`        
      <div class="floated-label-placeholder">
          ${fe(t)}
        </div>
        <ha-switch
          aria-label=${`${fe("editor.toggle")} ${fe("directions.north")} ${fe(i?"common.off":"common.on")}`}
          .checked=${!1!==this._compass_show_north}
          .configValue=${e}
          @change=${this._valueChanged}
          >${fe(t)}</ha-switch>
      </div>`}static get styles(){return X`
      .editor-entity-select {
        width: 100%;
      }

      ha-switch {
        padding-bottom: 8px;
      }
      .floated-label-placeholder {
        font-family: var(--paper-font-caption_-_font-family);
        -webkit-font-smoothing: var(--paper-font-caption_-_-webkit-font-smoothing);
        white-space: var(--paper-font-caption_-_white-space);
        overflow: var(--paper-font-caption_-_overflow);
        text-overflow: var(--paper-font-caption_-_text-overflow);
        font-size: var(--paper-font-caption_-_font-size);
        font-weight: var(--paper-font-caption_-_font-weight);
        letter-spacing: var(--paper-font-caption_-_letter-spacing);
        line-height: var(--paper-font-caption_-_line-height);
      }
    `}};var be;t([B({attribute:!1})],Ne.prototype,"hass",void 0),t([B({attribute:!1,hasChanged:null==be?void 0:be.hasChanged})],Ne.prototype,"_config",void 0),Ne=t([F("compass-card-editor")],Ne);const we=X`
  :host ::slotted(.card-content:not(:first-child)),
  slot:not(:first-child)::slotted(.card-content) {
    padding-top: 0px;
    margin-top: -8px;
  }
  :host ::slotted(.card-content) {
    padding: 16px;
  }
  .floated-label-placeholder {
    font-family: var(--paper-font-caption_-_font-family);
    -webkit-font-smoothing: var(--paper-font-caption_-_-webkit-font-smoothing);
    white-space: var(--paper-font-caption_-_white-space);
    overflow: var(--paper-font-caption_-_overflow);
    text-overflow: var(--paper-font-caption_-_text-overflow);
    font-size: var(--paper-font-caption_-_font-size);
    font-weight: var(--paper-font-caption_-_font-weight);
    letter-spacing: var(--paper-font-caption_-_letter-spacing);
    line-height: var(--paper-font-caption_-_line-height);
    color: var(--disabled-text-color);
  }
  ha-card {
    flex-direction: column;
    flex: 1;
    position: relative;
    overflow: hidden;
  }
  .header {
    display: flex;
    justify-content: space-between;
    padding: 8px 16px 0px;
  }
  .header > .name {
    color: var(--secondary-text-color);
    line-height: 40px;
    font-weight: 500;
    font-size: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .icon {
    color: var(--state-icon-color);
    margin-top: 8px;
    float: right;
  }
  .compass {
    padding: 16px;
    display: block;
    width: 120px;
    height: 120px;
    position: relative;
    margin: 0 auto 10px;
    font-family: var(--paper-font-caption_-_font-family);
  }
  .compass > .direction {
    height: 100%;
    width: 100%;
    display: block;
    border-radius: 100%;
    border-width: 3px;
    border-color: var(--primary-color);
    border-style: solid;
    color: var(--primary-text-color);
  }
  .compass > .direction > p {
    text-align: center;
    margin: 0;
    padding: 30% 0 0 0;
    top: 30px;
    width: 100%;
    line-height: normal;
    display: block;
    font-size: 28px;
    font-weight: bold;
  }
  .compass > .direction > p > span {
    display: block;
    line-height: normal;
    font-size: 11px;
    font-weight: normal;
  }
  .compass > .indicator {
    width: 100%;
    height: 100%;
    display: block;
    position: absolute;
    /* substract the direction border width to get correct size */
    right: -3px;
    /* add the direction border width to get correct size */
    top: 3px;
  }
  .compass > .indicator:after {
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    margin-left: 0;
    z-index: 99;
  }

  .compass > .indicator.arrow_outward:after {
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 30px solid var(--accent-color);
    /* substract left+right border width from full size to center */
    left: calc((100% - 16px) / 2);
  }
  .compass > .indicator.arrow_inward:after {
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 30px solid var(--accent-color);
    /* substract left+right border width from full size to center */
    left: calc((100% - 16px) / 2);
  }
  .compass > .indicator.circle:after {
    border: 8px solid var(--accent-color);
    margin: 8px;
    border-radius: 50%;
    /* substract 2x border + 2x margin from full size to center */
    left: calc((100% - 32px) / 2);
  }
  .compass > .indicator.north:after {
    color: var(--primary-color);
    content: 'N';
    padding-top: 0px;
    margin: -3px;
    /* substract margin from full size to center */
    left: calc((100% - 3px) / 2);
  }
`;var Ee;console.info(`%c  COMPASS-CARD \n%c  ${fe("common.version")} 0.4.1    `,"color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"compass-card",name:"Compass Card",preview:!0,description:fe("common.description")});let We=Ee=class extends et{static async getConfigElement(){return document.createElement("compass-card-editor")}static getStubConfig(){return{entity:"",secondary_entity:"",direction_offset:0,name:"Compass Card"}}setConfig(t){if(!t)throw new Error(fe("common.invalid_configuration"));t.test_gui&&function(){var t=document.querySelector("home-assistant");if(t=(t=(t=(t=(t=(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))&&t.shadowRoot)&&t.querySelector("hui-root")){var e=t.lovelace;return e.current_view=t.___curView,e}return null}().setEditMode(!0),this._config=Object.assign({},t)}shouldUpdate(t){if(t.has("_config"))return!0;if(this._config.entity){const e=t.get("hass");if(e&&e.states[this._config.entity]!==this.hass.states[this._config.entity])return!0}if(this._config.secondary_entity){const e=t.get("hass");if(e&&e.states[this._config.secondary_entity]!==this.hass.states[this._config.secondary_entity])return!0}return!1}render(){if(!this._config||!this.hass)return T``;let t=0;Number.isNaN(Number(this._config.direction_offset))||(t=Ee.positiveDegrees(+this._config.direction_offset));const e=this.hass.states[this._config.entity],i=this._config.secondary_entity?this.hass.states[this._config.secondary_entity]:void 0,n=e?e.attributes.friendly_name:this._config.entity;return T`
      <ha-card tabindex="0" aria-label=${"Compass: "+n} class="flex" @click=${t=>this.handlePopup(t)}>
        ${this.renderHeader()}
        <div class="content">
          ${this.renderCompass(e,i,t)}
        </div>
      </ha-card>
    `}renderCompass(t,e,i){var n,o,r;let s=0,a=fe("common.invalid");const c=t?t.state:ye;if(Number.isNaN(Number(c))){if(s=Ee.getDegrees(c),a=c,-1===s){const t=c.replace(/\s+/g,"").match(/[+-]?\d+(\.\d)?/);s=(null==t?void 0:t.length)?Ee.positiveDegrees(parseFloat(t[0])):0,a=Ee.getCompassAbbreviation(s,null===(n=this._config.compass)||void 0===n?void 0:n.language)}}else s=Ee.positiveDegrees(parseFloat(c)),a=Ee.getCompassAbbreviation(s,null===(o=this._config.compass)||void 0===o?void 0:o.language);return T`
      <div class="compass">
        <div class="direction" style="${this.getConfigStyle(this._config.compass)}">
          <p>
            ${a}
            ${e?T`
                  <span>
                    ${e.state} ${e.attributes.unit_of_measurement}
                  </span>
                `:""}
          </p>
        </div>
        <div class="indicator ${Ee.computeIndicator(this._config)}" style="transform: rotate(${(s+i)%360}deg)"></div>
        ${(null===(r=this._config.compass)||void 0===r?void 0:r.show_north)?T`<div class="indicator north" style="transform: rotate(${Ee.positiveDegrees(i)}deg)"></div>`:""}
      </div>
    `}handlePopup(t){t.stopPropagation(),this._config.tap_action&&((t,e,i,n)=>{let o;switch(n.action||"more-info"){case"more-info":o=new Event("hass-more-info",{composed:!0}),o.detail={entityId:n.entity||(null==i?void 0:i.entity)},t.dispatchEvent(o);break;case"navigate":if(!n.navigation_path)return;if(n.new_tab||void 0===n.new_tab){window.open(n.navigation_path,"_blank");break}window.history.pushState(null,"",n.navigation_path),o=new Event("location-changed",{composed:!0}),o.detail={replace:!1},window.dispatchEvent(o);break;case"call-service":{if(!n.service)return;const[t,i]=n.service.split(".",2),o=n.service_data?Object.assign({},JSON.parse(n.service_data)):"";e.callService(t,i,o);break}case"url":if(!n.url)return;if(n.new_tab||void 0===n.new_tab){window.open(n.url,"_blank");break}window.location.href=n.url;break;default:;}})(this,this.hass,this._config,this._config.tap_action)}getConfigStyle(t){return t&&t.style_css?t.style_css:""}renderHeader(){return this.computeName()?T`
        <div class="header">
          <div class="name">
            <span>${this.computeName()}</span>
          </div>
          <div class="icon">
            <ha-icon .icon=${this.computeIcon()}></ha-icon>
          </div>
        </div>
      `:""}getCardSize(){return 4}computeName(){if(this._config.name&&this._config.name.trim().length>0)return this._config.name}computeIcon(){const t=this.hass.states[this._config.entity];return t&&t.attributes.icon?t.attributes.icon:ge}static get styles(){return we}static computeIndicator(t){return t.compass&&t.compass.indicator&&Se.indexOf(t.compass.indicator)>=0?t.compass.indicator:Se[1]}static getDegrees(t){return me[t]?me[t]:-1}static getCompassAbbreviation(t,e){const i=Math.round(Ee.positiveDegrees(t)/22.5);let n="N";return i>15&&(n=_e[0]),n=_e[i],fe("directions."+n,"","",e)}static positiveDegrees(t){return t<0?t+360*(Math.abs(Math.ceil(t/360))+1):t%360}};t([B({attribute:!1})],We.prototype,"hass",void 0),t([B({attribute:!1})],We.prototype,"_config",void 0),We=Ee=t([F("compass-card")],We);export{We as CompassCard};
