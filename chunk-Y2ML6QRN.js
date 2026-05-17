import{a as xe,b as we,c as Ee}from"./chunk-OAD4BY24.js";import{a as Te}from"./chunk-5MCFAIFX.js";import{a as Me,b as Be,c as ie,g as ae}from"./chunk-C5SDTGJS.js";import{a as ne,b as K,c as j,i as g,j as v,p as Pe,s as De,t as Ie}from"./chunk-CNXLAKVS.js";import{$a as x,Eb as F,Fa as I,Fd as Ce,Ga as z,Gb as Y,Gd as Ae,Hd as w,Ja as M,K as R,Ka as B,L as W,La as s,M as q,Nd as oe,O as P,Pb as ye,Pc as L,Q as l,Qa as m,Qc as pe,Rc as $,Ta as ge,Tb as f,Ua as me,V as U,W as G,X as Q,Xb as S,Ya as a,Za as b,Zb as le,_a as C,a as T,aa as D,ac as Z,db as N,eb as O,fa as ue,fb as J,gb as de,hb as fe,ib as k,ja as y,jb as p,kb as H,lb as A,mb as X,mc as ee,nb as he,ob as h,oc as te,pb as _,pc as V,tb as _e,ua as r,wb as u,xb as ve,yb as be}from"./chunk-DBO36WIA.js";var Ne=`
    .p-accordionpanel {
        display: flex;
        flex-direction: column;
        border-style: solid;
        border-width: dt('accordion.panel.border.width');
        border-color: dt('accordion.panel.border.color');
    }

    .p-accordionheader {
        all: unset;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: dt('accordion.header.padding');
        color: dt('accordion.header.color');
        background: dt('accordion.header.background');
        border-style: solid;
        border-width: dt('accordion.header.border.width');
        border-color: dt('accordion.header.border.color');
        font-weight: dt('accordion.header.font.weight');
        border-radius: dt('accordion.header.border.radius');
        transition:
            background dt('accordion.transition.duration'),
            color dt('accordion.transition.duration'),
            outline-color dt('accordion.transition.duration'),
            box-shadow dt('accordion.transition.duration');
        outline-color: transparent;
    }

    .p-accordionpanel:first-child > .p-accordionheader {
        border-width: dt('accordion.header.first.border.width');
        border-start-start-radius: dt('accordion.header.first.top.border.radius');
        border-start-end-radius: dt('accordion.header.first.top.border.radius');
    }

    .p-accordionpanel:last-child > .p-accordionheader {
        border-end-start-radius: dt('accordion.header.last.bottom.border.radius');
        border-end-end-radius: dt('accordion.header.last.bottom.border.radius');
    }

    .p-accordionpanel:last-child.p-accordionpanel-active > .p-accordionheader {
        border-end-start-radius: dt('accordion.header.last.active.bottom.border.radius');
        border-end-end-radius: dt('accordion.header.last.active.bottom.border.radius');
    }

    .p-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.color');
    }

    .p-accordionpanel:not(.p-disabled) .p-accordionheader:focus-visible {
        box-shadow: dt('accordion.header.focus.ring.shadow');
        outline: dt('accordion.header.focus.ring.width') dt('accordion.header.focus.ring.style') dt('accordion.header.focus.ring.color');
        outline-offset: dt('accordion.header.focus.ring.offset');
    }

    .p-accordionpanel:not(.p-accordionpanel-active):not(.p-disabled) > .p-accordionheader:hover {
        background: dt('accordion.header.hover.background');
        color: dt('accordion.header.hover.color');
    }

    .p-accordionpanel:not(.p-accordionpanel-active):not(.p-disabled) .p-accordionheader:hover .p-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.hover.color');
    }

    .p-accordionpanel:not(.p-disabled).p-accordionpanel-active > .p-accordionheader {
        background: dt('accordion.header.active.background');
        color: dt('accordion.header.active.color');
    }

    .p-accordionpanel:not(.p-disabled).p-accordionpanel-active > .p-accordionheader .p-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.active.color');
    }

    .p-accordionpanel:not(.p-disabled).p-accordionpanel-active > .p-accordionheader:hover {
        background: dt('accordion.header.active.hover.background');
        color: dt('accordion.header.active.hover.color');
    }

    .p-accordionpanel:not(.p-disabled).p-accordionpanel-active > .p-accordionheader:hover .p-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.active.hover.color');
    }

    .p-accordioncontent {
        display: grid;
        grid-template-rows: 1fr;
    }

    .p-accordioncontent-wrapper {
        min-height: 0;
    }

    .p-accordioncontent-content {
        border-style: solid;
        border-width: dt('accordion.content.border.width');
        border-color: dt('accordion.content.border.color');
        background-color: dt('accordion.content.background');
        color: dt('accordion.content.color');
        padding: dt('accordion.content.padding');
    }
`;var re=["*"],$e=["toggleicon"],We=t=>({active:t});function qe(t,d){}function Ue(t,d){t&1&&s(0,qe,0,0,"ng-template")}function Ge(t,d){if(t&1&&s(0,Ue,1,0,null,0),t&2){let e=p();a("ngTemplateOutlet",e.toggleicon)("ngTemplateOutletContext",Y(2,We,e.active()))}}function ze(t,d){if(t&1&&x(0,"span",4),t&2){let e=p(3);u(e.cn(e.cx("toggleicon"),e.pcAccordion.collapseIcon)),a("pBind",e.ptm("toggleicon")),m("aria-hidden",!0)}}function Je(t,d){if(t&1&&(Q(),x(0,"svg",5)),t&2){let e=p(3);u(e.cx("toggleicon")),a("pBind",e.ptm("toggleicon")),m("aria-hidden",!0)}}function Xe(t,d){if(t&1&&(N(0),s(1,ze,1,4,"span",2)(2,Je,1,4,"svg",3),O()),t&2){let e=p(2);r(),a("ngIf",e.pcAccordion.collapseIcon),r(),a("ngIf",!e.pcAccordion.collapseIcon)}}function Ye(t,d){if(t&1&&x(0,"span",4),t&2){let e=p(3);u(e.cn(e.cx("toggleicon"),e.pcAccordion.expandIcon)),a("pBind",e.ptm("toggleicon")),m("aria-hidden",!0)}}function Ze(t,d){if(t&1&&(Q(),x(0,"svg",7)),t&2){let e=p(3);a("pBind",e.ptm("toggleicon")),m("aria-hidden",!0)}}function et(t,d){if(t&1&&(N(0),s(1,Ye,1,4,"span",2)(2,Ze,1,2,"svg",6),O()),t&2){let e=p(2);r(),a("ngIf",e.pcAccordion.expandIcon),r(),a("ngIf",!e.pcAccordion.expandIcon)}}function tt(t,d){if(t&1&&s(0,Xe,3,2,"ng-container",1)(1,et,3,2,"ng-container",1),t&2){let e=p();a("ngIf",e.active()),r(),a("ngIf",!e.active())}}var nt=`
${Ne}

/* For PrimeNG */
.p-accordionheader-toggle-icon.icon-start {
    order: -1;
}

.p-accordionheader:has(.p-accordionheader-toggle-icon.icon-start) {
    justify-content: flex-start;
    gap: dt('accordion.header.padding');
}

.p-accordionheader.p-ripple {
    overflow: hidden;
    position: relative;
}

.p-accordioncontent .p-motion {
    display: grid;
    grid-template-rows: 1fr;
}
`,ot={root:"p-accordion p-component",panel:({instance:t})=>["p-accordionpanel",{"p-accordionpanel-active":t.active(),"p-disabled":t.disabled()}],header:"p-accordionheader",toggleicon:"p-accordionheader-toggle-icon",contentContainer:"p-accordioncontent",contentWrapper:"p-accordioncontent-wrapper",content:"p-accordioncontent-content"},E=(()=>{class t extends oe{name="accordion";style=nt;classes=ot;static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();var Oe=new P("ACCORDION_PANEL_INSTANCE"),ke=new P("ACCORDION_HEADER_INSTANCE"),He=new P("ACCORDION_CONTENT_INSTANCE"),Fe=new P("ACCORDION_INSTANCE"),se=(()=>{class t extends j{$pcAccordionPanel=l(Oe,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=l(g,{self:!0});componentName="AccordionPanel";onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("root"))}pcAccordion=l(R(()=>ce));value=le(void 0);disabled=S(!1,{transform:e=>ae(e)});active=f(()=>this.pcAccordion.multiple()?this.valueEquals(this.pcAccordion.value(),this.value()):this.pcAccordion.value()===this.value());valueEquals(e,o){return Array.isArray(e)?e.includes(o):e===o}_componentStyle=l(E);static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275cmp=I({type:t,selectors:[["p-accordion-panel"],["p-accordionpanel"]],hostVars:4,hostBindings:function(o,n){o&2&&(m("data-p-disabled",n.disabled())("data-p-active",n.active()),u(n.cx("panel")))},inputs:{value:[1,"value"],disabled:[1,"disabled"]},outputs:{value:"valueChange"},features:[F([E,{provide:Oe,useExisting:t},{provide:K,useExisting:t}]),M([g]),B],ngContentSelectors:re,decls:1,vars:0,template:function(o,n){o&1&&(H(),A(0))},dependencies:[V,v],encapsulation:2,changeDetection:0})}return t})(),it=(()=>{class t extends j{$pcAccordionHeader=l(ke,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=l(g,{self:!0});componentName="AccordionHeader";onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("root"))}pcAccordion=l(R(()=>ce));pcAccordionPanel=l(R(()=>se));id=f(()=>`${this.pcAccordion.id()}_accordionheader_${this.pcAccordionPanel.value()}`);active=f(()=>this.pcAccordionPanel.active());disabled=f(()=>this.pcAccordionPanel.disabled());ariaControls=f(()=>`${this.pcAccordion.id()}_accordioncontent_${this.pcAccordionPanel.value()}`);toggleicon;onClick(e){if(this.disabled())return;let o=this.active();this.changeActiveValue();let n=this.active(),i=this.pcAccordionPanel.value();!o&&n?this.pcAccordion.onOpen.emit({originalEvent:e,index:i}):o&&!n&&this.pcAccordion.onClose.emit({originalEvent:e,index:i})}onFocus(){!this.disabled()&&this.pcAccordion.selectOnFocus()&&this.changeActiveValue()}onKeydown(e){switch(e.code){case"ArrowDown":this.arrowDownKey(e);break;case"ArrowUp":this.arrowUpKey(e);break;case"Home":this.onHomeKey(e);break;case"End":this.onEndKey(e);break;case"Enter":case"Space":case"NumpadEnter":this.onEnterKey(e);break;default:break}}_componentStyle=l(E);changeActiveValue(){this.pcAccordion.updateValue(this.pcAccordionPanel.value())}findPanel(e){return e?.closest('[data-pc-name="accordionpanel"]')}findHeader(e){return L(e,'[data-pc-name="accordionheader"]')}findNextPanel(e,o=!1){let n=o?e:e.nextElementSibling;return n?$(n,"data-p-disabled")?this.findNextPanel(n):this.findHeader(n):null}findPrevPanel(e,o=!1){let n=o?e:e.previousElementSibling;return n?$(n,"data-p-disabled")?this.findPrevPanel(n):this.findHeader(n):null}findFirstPanel(){return this.findNextPanel(this.pcAccordion.el.nativeElement.firstElementChild,!0)}findLastPanel(){return this.findPrevPanel(this.pcAccordion.el.nativeElement.lastElementChild,!0)}changeFocusedPanel(e,o){pe(o)}arrowDownKey(e){let o=this.findNextPanel(this.findPanel(e.currentTarget));o?this.changeFocusedPanel(e,o):this.onHomeKey(e),e.preventDefault()}arrowUpKey(e){let o=this.findPrevPanel(this.findPanel(e.currentTarget));o?this.changeFocusedPanel(e,o):this.onEndKey(e),e.preventDefault()}onHomeKey(e){let o=this.findFirstPanel();this.changeFocusedPanel(e,o),e.preventDefault()}onEndKey(e){let o=this.findLastPanel();this.changeFocusedPanel(e,o),e.preventDefault()}onEnterKey(e){this.disabled()||this.changeActiveValue(),e.preventDefault()}get dataP(){return this.cn({active:this.active()})}static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275cmp=I({type:t,selectors:[["p-accordion-header"],["p-accordionheader"]],contentQueries:function(o,n,i){if(o&1&&X(i,$e,5),o&2){let c;h(c=_())&&(n.toggleicon=c.first)}},hostVars:13,hostBindings:function(o,n){o&1&&k("click",function(c){return n.onClick(c)})("focus",function(){return n.onFocus()})("keydown",function(c){return n.onKeydown(c)}),o&2&&(m("id",n.id())("aria-expanded",n.active())("aria-controls",n.ariaControls())("aria-disabled",n.disabled())("role","button")("tabindex",n.disabled()?"-1":"0")("data-p-active",n.active())("data-p-disabled",n.disabled())("data-p",n.dataP),u(n.cx("header")),_e("user-select","none"))},features:[F([E,{provide:ke,useExisting:t},{provide:K,useExisting:t}]),M([Pe,g]),B],ngContentSelectors:re,decls:3,vars:1,consts:[[4,"ngTemplateOutlet","ngTemplateOutletContext"],[4,"ngIf"],[3,"class","pBind",4,"ngIf"],["data-p-icon","chevron-up",3,"class","pBind",4,"ngIf"],[3,"pBind"],["data-p-icon","chevron-up",3,"pBind"],["data-p-icon","chevron-down",3,"pBind",4,"ngIf"],["data-p-icon","chevron-down",3,"pBind"]],template:function(o,n){o&1&&(H(),A(0),ge(1,Ge,1,4)(2,tt,2,2)),o&2&&(r(),me(n.toggleicon?1:2))},dependencies:[V,ee,te,Te,xe,v,g],encapsulation:2,changeDetection:0})}return t})(),at=(()=>{class t extends j{$pcAccordionContent=l(He,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=l(g,{self:!0});componentName="AccordionContent";onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("root"))}pcAccordion=l(R(()=>ce));pcAccordionPanel=l(R(()=>se));active=f(()=>this.pcAccordionPanel.active());ariaLabelledby=f(()=>`${this.pcAccordion.id()}_accordionheader_${this.pcAccordionPanel.value()}`);id=f(()=>`${this.pcAccordion.id()}_accordioncontent_${this.pcAccordionPanel.value()}`);_componentStyle=l(E);ptParams=f(()=>({context:this.active()}));computedMotionOptions=f(()=>T(T({},this.ptm("motion",this.ptParams())),this.pcAccordion.computedMotionOptions()));static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275cmp=I({type:t,selectors:[["p-accordion-content"],["p-accordioncontent"]],hostVars:6,hostBindings:function(o,n){o&2&&(m("id",n.id())("role","region")("data-p-active",n.active())("aria-labelledby",n.ariaLabelledby()),u(n.cx("contentContainer")))},features:[F([E,{provide:He,useExisting:t},{provide:K,useExisting:t}]),M([g]),B],ngContentSelectors:re,decls:4,vars:10,consts:[["name","p-collapsible","hideStrategy","visibility",3,"visible","mountOnEnter","unmountOnLeave","options"],[3,"pBind"]],template:function(o,n){o&1&&(H(),b(0,"p-motion",0)(1,"div",1)(2,"div",1),A(3),C()()()),o&2&&(a("visible",n.active())("mountOnEnter",!1)("unmountOnLeave",!1)("options",n.computedMotionOptions()),r(),u(n.cx("contentWrapper")),a("pBind",n.ptm("contentWrapper",n.ptParams())),r(),u(n.cx("content")),a("pBind",n.ptm("content",n.ptParams())))},dependencies:[V,v,g,ie,Me],encapsulation:2,changeDetection:0})}return t})(),ce=(()=>{class t extends j{componentName="Accordion";$pcAccordion=l(Fe,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=l(g,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("root"))}value=le(void 0);multiple=S(!1,{transform:e=>ae(e)});styleClass;expandIcon;collapseIcon;selectOnFocus=S(!1,{transform:e=>ae(e)});transitionOptions="400ms cubic-bezier(0.86, 0, 0.07, 1)";motionOptions=S(void 0);computedMotionOptions=f(()=>T(T({},this.ptm("motion")),this.motionOptions()));onClose=new D;onOpen=new D;id=ue(ne("pn_id_"));_componentStyle=l(E);onKeydown(e){switch(e.code){case"ArrowDown":this.onTabArrowDownKey(e);break;case"ArrowUp":this.onTabArrowUpKey(e);break;case"Home":e.shiftKey||this.onTabHomeKey(e);break;case"End":e.shiftKey||this.onTabEndKey(e);break}}onTabArrowDownKey(e){let o=this.findNextHeaderAction(e.target.parentElement);o?this.changeFocusedTab(o):this.onTabHomeKey(e),e.preventDefault()}onTabArrowUpKey(e){let o=this.findPrevHeaderAction(e.target.parentElement);o?this.changeFocusedTab(o):this.onTabEndKey(e),e.preventDefault()}onTabHomeKey(e){let o=this.findFirstHeaderAction();this.changeFocusedTab(o),e.preventDefault()}changeFocusedTab(e){e&&pe(e)}findNextHeaderAction(e,o=!1){let n=o?e:e.nextElementSibling,i=L(n,'[data-pc-section="accordionheader"]');return i?$(i,"data-p-disabled")?this.findNextHeaderAction(i.parentElement):L(i.parentElement,'[data-pc-section="accordionheader"]'):null}findPrevHeaderAction(e,o=!1){let n=o?e:e.previousElementSibling,i=L(n,'[data-pc-section="accordionheader"]');return i?$(i,"data-p-disabled")?this.findPrevHeaderAction(i.parentElement):L(i.parentElement,'[data-pc-section="accordionheader"]'):null}findFirstHeaderAction(){let e=this.el.nativeElement.firstElementChild;return this.findNextHeaderAction(e,!0)}findLastHeaderAction(){let e=this.el.nativeElement.lastElementChild;return this.findPrevHeaderAction(e,!0)}onTabEndKey(e){let o=this.findLastHeaderAction();this.changeFocusedTab(o),e.preventDefault()}getBlockableElement(){return this.el.nativeElement.children[0]}updateValue(e){let o=this.value();if(this.multiple()){let n=Array.isArray(o)?[...o]:[],i=n.indexOf(e);i!==-1?n.splice(i,1):n.push(e),this.value.set(n)}else o===e?this.value.set(void 0):this.value.set(e)}static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275cmp=I({type:t,selectors:[["p-accordion"]],hostVars:2,hostBindings:function(o,n){o&1&&k("keydown",function(c){return n.onKeydown(c)}),o&2&&u(n.cn(n.cx("root"),n.styleClass))},inputs:{value:[1,"value"],multiple:[1,"multiple"],styleClass:"styleClass",expandIcon:"expandIcon",collapseIcon:"collapseIcon",selectOnFocus:[1,"selectOnFocus"],transitionOptions:"transitionOptions",motionOptions:[1,"motionOptions"]},outputs:{value:"valueChange",onClose:"onClose",onOpen:"onOpen"},features:[F([E,{provide:Fe,useExisting:t},{provide:K,useExisting:t}]),M([g]),B],ngContentSelectors:re,decls:1,vars:0,template:function(o,n){o&1&&(H(),A(0))},dependencies:[V,w,v],encapsulation:2,changeDetection:0})}return t})(),en=(()=>{class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=z({type:t});static \u0275inj=q({imports:[ce,w,se,it,at,v,w,v]})}return t})();var Se=`
    .p-panel {
        display: block;
        border: 1px solid dt('panel.border.color');
        border-radius: dt('panel.border.radius');
        background: dt('panel.background');
        color: dt('panel.color');
    }

    .p-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: dt('panel.header.padding');
        background: dt('panel.header.background');
        color: dt('panel.header.color');
        border-style: solid;
        border-width: dt('panel.header.border.width');
        border-color: dt('panel.header.border.color');
        border-radius: dt('panel.header.border.radius');
    }

    .p-panel-toggleable .p-panel-header {
        padding: dt('panel.toggleable.header.padding');
    }

    .p-panel-title {
        line-height: 1;
        font-weight: dt('panel.title.font.weight');
    }

    .p-panel-content-container {
        display: grid;
        grid-template-rows: 1fr;
    }

    .p-panel-content-wrapper {
        min-height: 0;
    }

    .p-panel-content {
        padding: dt('panel.content.padding');
    }

    .p-panel-footer {
        padding: dt('panel.footer.padding');
    }
`;var rt=["header"],ct=["icons"],dt=["content"],lt=["footer"],pt=["headericons"],st=["contentWrapper"],ut=["*",[["p-header"]],[["p-footer"]]],gt=["*","p-header","p-footer"],mt=t=>({$implicit:t});function ft(t,d){if(t&1&&(b(0,"span",4),ve(1),C()),t&2){let e=p(2);u(e.cx("title")),a("pBind",e.ptm("title")),m("id",e.id+"_header"),r(),be(e._header)}}function ht(t,d){t&1&&J(0)}function _t(t,d){}function vt(t,d){t&1&&s(0,_t,0,0,"ng-template")}function bt(t,d){if(t&1&&(N(0),Q(),x(1,"svg",12),O()),t&2){let e=p(5);r(),a("pBind",e.ptm("pcToggleButton.icon"))}}function yt(t,d){if(t&1&&(N(0),Q(),x(1,"svg",13),O()),t&2){let e=p(5);r(),a("pBind",e.ptm("pcToggleButton.icon"))}}function Ct(t,d){if(t&1&&(N(0),s(1,bt,2,1,"ng-container",10)(2,yt,2,1,"ng-container",10),O()),t&2){let e=p(4);r(),a("ngIf",!e.collapsed),r(),a("ngIf",e.collapsed)}}function At(t,d){}function Tt(t,d){t&1&&s(0,At,0,0,"ng-template")}function xt(t,d){if(t&1&&s(0,Ct,3,2,"ng-container",10)(1,Tt,1,0,null,11),t&2){let e=p(3);a("ngIf",!e.headerIconsTemplate&&!e._headerIconsTemplate&&!(e.toggleButtonProps!=null&&e.toggleButtonProps.icon)),r(),a("ngTemplateOutlet",e.headerIconsTemplate||e._headerIconsTemplate)("ngTemplateOutletContext",Y(3,mt,e.collapsed))}}function wt(t,d){if(t&1){let e=de();b(0,"p-button",9),k("click",function(n){U(e);let i=p(2);return G(i.onIconClick(n))})("keydown",function(n){U(e);let i=p(2);return G(i.onKeyDown(n))}),s(1,xt,2,5,"ng-template",null,1,ye),C()}if(t&2){let e=p(2);a("text",!0)("rounded",!0)("styleClass",e.cx("pcToggleButton"))("buttonProps",e.toggleButtonProps)("pt",e.ptm("pcToggleButton"))("unstyled",e.unstyled()),m("id",e.id+"_header")("aria-label",e.buttonAriaLabel)("aria-controls",e.id+"_content")("aria-expanded",!e.collapsed)}}function Et(t,d){if(t&1){let e=de();b(0,"div",7),k("click",function(n){U(e);let i=p();return G(i.onHeaderClick(n))}),s(1,ft,2,5,"span",6),A(2,1),s(3,ht,1,0,"ng-container",5),b(4,"div",4),s(5,vt,1,0,null,5)(6,wt,3,10,"p-button",8),C()()}if(t&2){let e=p();u(e.cx("header")),a("pBind",e.ptm("header")),m("id",e.id+"-titlebar")("data-p",e.dataP),r(),a("ngIf",e._header),r(2),a("ngTemplateOutlet",e.headerTemplate||e._headerTemplate),r(),u(e.cx("headerActions")),a("pBind",e.ptm("headerActions")),r(),a("ngTemplateOutlet",e.iconsTemplate||e._iconsTemplate),r(),a("ngIf",e.toggleable)}}function Pt(t,d){t&1&&J(0)}function Dt(t,d){t&1&&J(0)}function It(t,d){if(t&1&&(b(0,"div",4),A(1,2),s(2,Dt,1,0,"ng-container",5),C()),t&2){let e=p();u(e.cx("footer")),a("pBind",e.ptm("footer")),r(2),a("ngTemplateOutlet",e.footerTemplate||e._footerTemplate)}}var Mt={root:({instance:t})=>["p-panel p-component",{"p-panel-toggleable":t.toggleable,"p-panel-expanded":!t._collapsed&&t.toggleable,"p-panel-collapsed":t._collapsed&&t.toggleable}],header:"p-panel-header",title:"p-panel-title",headerActions:({instance:t})=>["p-panel-header-actions",{"p-panel-icons-start":t.iconPos==="start","p-panel-icons-end":t.iconPos==="end","p-panel-icons-center":t.iconPos==="center"}],pcToggleButton:"p-panel-toggle-button",contentContainer:"p-panel-content-container",contentWrapper:"p-panel-content-wrapper",content:"p-panel-content",footer:"p-panel-footer"},Ve=(()=>{class t extends oe{name="panel";style=Se;classes=Mt;static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();var Ke=new P("PANEL_INSTANCE"),Bt=(()=>{class t extends j{componentName="Panel";$pcPanel=l(Ke,{optional:!0,skipSelf:!0})??void 0;_componentStyle=l(Ve);bindDirectiveInstance=l(g,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}id=ne("pn_id_");toggleable;_header;_collapsed;get collapsed(){return this._collapsed}set collapsed(e){this._collapsed=e}styleClass;iconPos="end";showHeader=!0;toggler="icon";transitionOptions="400ms cubic-bezier(0.86, 0, 0.07, 1)";toggleButtonProps;motionOptions=S(void 0);computedMotionOptions=f(()=>T(T({},this.ptm("motion")),this.motionOptions()));collapsedChange=new D;onBeforeToggle=new D;onAfterToggle=new D;footerFacet;headerTemplate;iconsTemplate;contentTemplate;footerTemplate;headerIconsTemplate;_headerTemplate;_iconsTemplate;_contentTemplate;_footerTemplate;_headerIconsTemplate;contentWrapperViewChild;get buttonAriaLabel(){return this._header}onHeaderClick(e){this.toggler==="header"&&this.toggle(e)}onIconClick(e){this.toggler==="icon"&&this.toggle(e)}toggle(e){this.onBeforeToggle.emit({originalEvent:e,collapsed:this.collapsed}),this.collapsed?this.expand():this.collapse(),e.preventDefault()}expand(){this._collapsed=!1,this.collapsedChange.emit(!1),this.updateTabIndex()}collapse(){this._collapsed=!0,this.collapsedChange.emit(!0),this.updateTabIndex()}getBlockableElement(){return this.el.nativeElement}updateTabIndex(){this.contentWrapperViewChild&&this.contentWrapperViewChild.nativeElement.querySelectorAll("input, button, select, a, textarea, [tabindex]").forEach(o=>{this.collapsed?o.setAttribute("tabindex","-1"):o.removeAttribute("tabindex")})}onKeyDown(e){(e.code==="Enter"||e.code==="Space")&&(this.toggle(e),e.preventDefault())}onToggleDone(e){this.onAfterToggle.emit({originalEvent:e,collapsed:this.collapsed})}templates;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"header":this._headerTemplate=e.template;break;case"content":this._contentTemplate=e.template;break;case"footer":this._footerTemplate=e.template;break;case"icons":this._iconsTemplate=e.template;break;case"headericons":this._headerIconsTemplate=e.template;break;default:this._contentTemplate=e.template;break}})}get dataP(){return this.cn({toggleable:this.toggleable})}static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275cmp=I({type:t,selectors:[["p-panel"]],contentQueries:function(o,n,i){if(o&1&&X(i,Ce,5)(i,rt,4)(i,ct,4)(i,dt,4)(i,lt,4)(i,pt,4)(i,Ae,4),o&2){let c;h(c=_())&&(n.footerFacet=c.first),h(c=_())&&(n.headerTemplate=c.first),h(c=_())&&(n.iconsTemplate=c.first),h(c=_())&&(n.contentTemplate=c.first),h(c=_())&&(n.footerTemplate=c.first),h(c=_())&&(n.headerIconsTemplate=c.first),h(c=_())&&(n.templates=c)}},viewQuery:function(o,n){if(o&1&&he(st,5),o&2){let i;h(i=_())&&(n.contentWrapperViewChild=i.first)}},hostVars:4,hostBindings:function(o,n){o&2&&(fe("id",n.id),m("data-p",n.dataP),u(n.cn(n.cx("root"),n.styleClass)))},inputs:{id:"id",toggleable:[2,"toggleable","toggleable",Z],_header:[0,"header","_header"],collapsed:[2,"collapsed","collapsed",Z],styleClass:"styleClass",iconPos:"iconPos",showHeader:[2,"showHeader","showHeader",Z],toggler:"toggler",transitionOptions:"transitionOptions",toggleButtonProps:"toggleButtonProps",motionOptions:[1,"motionOptions"]},outputs:{collapsedChange:"collapsedChange",onBeforeToggle:"onBeforeToggle",onAfterToggle:"onAfterToggle"},features:[F([Ve,{provide:Ke,useExisting:t},{provide:K,useExisting:t}]),M([g]),B],ngContentSelectors:gt,decls:8,vars:18,consts:[["contentWrapper",""],["icon",""],[3,"pBind","class","click",4,"ngIf"],["pMotionName","p-collapsible","role","region",3,"pMotionOnAfterEnter","pBind","pMotion","pMotionOptions","id"],[3,"pBind"],[4,"ngTemplateOutlet"],[3,"pBind","class",4,"ngIf"],[3,"click","pBind"],["severity","secondary","type","button","role","button",3,"text","rounded","styleClass","buttonProps","pt","unstyled","click","keydown",4,"ngIf"],["severity","secondary","type","button","role","button",3,"click","keydown","text","rounded","styleClass","buttonProps","pt","unstyled"],[4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["data-p-icon","minus",3,"pBind"],["data-p-icon","plus",3,"pBind"]],template:function(o,n){o&1&&(H(ut),s(0,Et,7,12,"div",2),b(1,"div",3),k("pMotionOnAfterEnter",function(c){return n.onToggleDone(c)}),b(2,"div",4)(3,"div",4,0),A(5),s(6,Pt,1,0,"ng-container",5),C(),s(7,It,3,4,"div",6),C()()),o&2&&(a("ngIf",n.showHeader),r(),u(n.cx("contentContainer")),a("pBind",n.ptm("contentContainer"))("pMotion",!n.toggleable||n.toggleable&&!n.collapsed)("pMotionOptions",n.computedMotionOptions())("id",n.id+"_content"),m("aria-labelledby",n.id+"_header")("aria-hidden",n.collapsed)("tabindex",n.collapsed?"-1":void 0),r(),u(n.cx("contentWrapper")),a("pBind",n.ptm("contentWrapper")),r(),u(n.cx("content")),a("pBind",n.ptm("content")),r(3),a("ngTemplateOutlet",n.contentTemplate||n._contentTemplate),r(),a("ngIf",n.footerFacet||n.footerTemplate||n._footerTemplate))},dependencies:[V,ee,te,Ee,we,Ie,De,w,v,g,ie,Be],encapsulation:2,changeDetection:0})}return t})(),Dn=(()=>{class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=z({type:t});static \u0275inj=q({imports:[Bt,w,v,w,v]})}return t})();export{se as a,it as b,at as c,ce as d,en as e,Bt as f,Dn as g};
