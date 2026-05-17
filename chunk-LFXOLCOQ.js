import{b as P,c as I,i as s}from"./chunk-CNXLAKVS.js";import{a as V,b as H,d as X}from"./chunk-Z5MZXJT4.js";import{a as z}from"./chunk-7KOZGFFL.js";import{$a as h,Eb as S,Fa as d,Ga as v,Hd as a,Ja as k,Ka as M,L as p,M as b,Nd as C,O as y,Q as o,Qa as f,Ta as A,Ua as O,X as T,Ya as N,Za as u,_a as g,a as w,b as B,ja as l,jb as R,pc as D,tb as j,ua as m,ub as L,vb as $,wb as c,xb as _,yb as U}from"./chunk-DBO36WIA.js";var W=class e{http=o(z);apiBaseUrl=o(H);dataMode=o(V);staticData=o(X);getMembers(){return this.dataMode==="static"?this.staticData.getMembers():this.http.get(`${this.apiBaseUrl}/members`)}getMember(i){return this.dataMode==="static"?this.staticData.getMember(i):this.http.get(`${this.apiBaseUrl}/members/${i}`)}getTeamMembers(i){return this.dataMode==="static"?this.staticData.getTeamMembers(i):this.http.get(`${this.apiBaseUrl}/teams/${i}/members`)}createMember(i){return this.dataMode==="static"?this.staticData.createMember(i):this.http.post(`${this.apiBaseUrl}/members`,i)}updateMember(i,t){return this.dataMode==="static"?this.staticData.updateMember(i,t):this.http.put(`${this.apiBaseUrl}/members/${i}`,t)}deleteMember(i){return this.dataMode==="static"?this.staticData.deleteMember(i):this.http.delete(`${this.apiBaseUrl}/members/${i}`)}static \u0275fac=function(t){return new(t||e)};static \u0275prov=p({token:e,factory:e.\u0275fac,providedIn:"root"})};var G=`
    .p-progressspinner {
        position: relative;
        margin: 0 auto;
        width: 100px;
        height: 100px;
        display: inline-block;
    }

    .p-progressspinner::before {
        content: '';
        display: block;
        padding-top: 100%;
    }

    .p-progressspinner-spin {
        height: 100%;
        transform-origin: center center;
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        animation: p-progressspinner-rotate 2s linear infinite;
    }

    .p-progressspinner-circle {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: 0;
        stroke: dt('progressspinner.colorOne');
        animation:
            p-progressspinner-dash 1.5s ease-in-out infinite,
            p-progressspinner-color 6s ease-in-out infinite;
        stroke-linecap: round;
    }

    @keyframes p-progressspinner-rotate {
        100% {
            transform: rotate(360deg);
        }
    }
    @keyframes p-progressspinner-dash {
        0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -35px;
        }
        100% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -124px;
        }
    }
    @keyframes p-progressspinner-color {
        100%,
        0% {
            stroke: dt('progressspinner.color.one');
        }
        40% {
            stroke: dt('progressspinner.color.two');
        }
        66% {
            stroke: dt('progressspinner.color.three');
        }
        80%,
        90% {
            stroke: dt('progressspinner.color.four');
        }
    }
`;var re={root:()=>["p-progressspinner"],spin:"p-progressspinner-spin",circle:"p-progressspinner-circle"},K=(()=>{class e extends C{name="progressspinner";style=G;classes=re;static \u0275fac=(()=>{let t;return function(n){return(t||(t=l(e)))(n||e)}})();static \u0275prov=p({token:e,factory:e.\u0275fac})}return e})();var q=new y("PROGRESSSPINNER_INSTANCE"),x=(()=>{class e extends I{componentName="ProgressSpinner";$pcProgressSpinner=o(q,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=o(s,{self:!0});styleClass;strokeWidth="2";fill="none";animationDuration="2s";ariaLabel;onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}_componentStyle=o(K);static \u0275fac=(()=>{let t;return function(n){return(t||(t=l(e)))(n||e)}})();static \u0275cmp=d({type:e,selectors:[["p-progressSpinner"],["p-progress-spinner"],["p-progressspinner"]],hostVars:5,hostBindings:function(r,n){r&2&&(f("aria-label",n.ariaLabel)("role","progressbar")("aria-busy",!0),c(n.cn(n.cx("root"),n.styleClass)))},inputs:{styleClass:"styleClass",strokeWidth:"strokeWidth",fill:"fill",animationDuration:"animationDuration",ariaLabel:"ariaLabel"},features:[S([K,{provide:q,useExisting:e},{provide:P,useExisting:e}]),k([s]),M],decls:2,vars:10,consts:[["viewBox","25 25 50 50",3,"pBind"],["cx","50","cy","50","r","20","stroke-miterlimit","10",3,"pBind"]],template:function(r,n){r&1&&(T(),u(0,"svg",0),h(1,"circle",1),g()),r&2&&(c(n.cx("spin")),j("animation-duration",n.animationDuration),N("pBind",n.ptm("spin")),m(),c(n.cx("circle")),N("pBind",n.ptm("circle")),f("fill",n.fill)("stroke-width",n.strokeWidth))},dependencies:[D,a,s],encapsulation:2,changeDetection:0})}return e})(),J=(()=>{class e{static \u0275fac=function(r){return new(r||e)};static \u0275mod=v({type:e});static \u0275inj=b({imports:[x,a,a]})}return e})();var Q=`
    .p-skeleton {
        display: block;
        overflow: hidden;
        background: dt('skeleton.background');
        border-radius: dt('skeleton.border.radius');
    }

    .p-skeleton::after {
        content: '';
        animation: p-skeleton-animation 1.2s infinite;
        height: 100%;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(-100%);
        z-index: 1;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0), dt('skeleton.animation.background'), rgba(255, 255, 255, 0));
    }

    [dir='rtl'] .p-skeleton::after {
        animation-name: p-skeleton-animation-rtl;
    }

    .p-skeleton-circle {
        border-radius: 50%;
    }

    .p-skeleton-animation-none::after {
        animation: none;
    }

    @keyframes p-skeleton-animation {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(100%);
        }
    }

    @keyframes p-skeleton-animation-rtl {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(-100%);
        }
    }
`;var oe={root:{position:"relative"}},se={root:({instance:e})=>["p-skeleton p-component",{"p-skeleton-circle":e.shape==="circle","p-skeleton-animation-none":e.animation==="none"}]},Y=(()=>{class e extends C{name="skeleton";style=Q;classes=se;inlineStyles=oe;static \u0275fac=(()=>{let t;return function(n){return(t||(t=l(e)))(n||e)}})();static \u0275prov=p({token:e,factory:e.\u0275fac})}return e})();var Z=new y("SKELETON_INSTANCE"),F=(()=>{class e extends I{componentName="Skeleton";$pcSkeleton=o(Z,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=o(s,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}styleClass;shape="rectangle";animation="wave";borderRadius;size;width="100%";height="1rem";_componentStyle=o(Y);get containerStyle(){let t=this._componentStyle?.inlineStyles.root,r;return this.$unstyled()||(this.size?r=B(w({},t),{width:this.size,height:this.size,borderRadius:this.borderRadius}):r=B(w({},t),{width:this.width,height:this.height,borderRadius:this.borderRadius})),r}get dataP(){return this.cn({[this.shape]:this.shape})}static \u0275fac=(()=>{let t;return function(n){return(t||(t=l(e)))(n||e)}})();static \u0275cmp=d({type:e,selectors:[["p-skeleton"]],hostVars:6,hostBindings:function(r,n){r&2&&(f("aria-hidden",!0)("data-p",n.dataP),$(n.containerStyle),c(n.cn(n.cx("root"),n.styleClass)))},inputs:{styleClass:"styleClass",shape:"shape",animation:"animation",borderRadius:"borderRadius",size:"size",width:"width",height:"height"},features:[S([Y,{provide:Z,useExisting:e},{provide:P,useExisting:e}]),k([s]),M],decls:0,vars:0,template:function(r,n){},dependencies:[D,a],encapsulation:2,changeDetection:0})}return e})(),ee=(()=>{class e{static \u0275fac=function(r){return new(r||e)};static \u0275mod=v({type:e});static \u0275inj=b({imports:[F,a,a]})}return e})();function pe(e,i){e&1&&h(0,"p-skeleton",1)(1,"p-skeleton",2)(2,"p-skeleton",3)}function le(e,i){if(e&1&&(h(0,"p-progress-spinner",4),u(1,"p"),_(2),g()),e&2){let t=R();m(2),U(t.message)}}var te=class e{variant="skeleton";message="Loading TeamPulse data";compact=!1;static \u0275fac=function(t){return new(t||e)};static \u0275cmp=d({type:e,selectors:[["tp-loading-state"]],inputs:{variant:"variant",message:"message",compact:"compact"},decls:3,vars:3,consts:[[1,"loading-state"],["height","2rem"],["height","7rem"],["height","2rem","width","60%"],["ariaLabel","Loading"]],template:function(t,r){t&1&&(u(0,"section",0),A(1,pe,3,0)(2,le,3,1),g()),t&2&&(L("compact",r.compact),m(),O(r.variant==="skeleton"?1:2))},dependencies:[J,x,ee,F],styles:[".loading-state[_ngcontent-%COMP%]{display:grid;gap:1rem;place-items:center;border:3px solid var(--tp-ink);border-radius:var(--tp-radius);background:var(--tp-panel);box-shadow:var(--tp-shadow-md);padding:2rem}.compact[_ngcontent-%COMP%]{border-width:2px;box-shadow:none;padding:1rem}p[_ngcontent-%COMP%]{margin:0;color:var(--tp-muted);font-weight:800}"]})};export{W as a,te as b};
