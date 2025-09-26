(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}})();const fs="https://v2.api.noroff.dev/social",ms="c/eb3d-d728-4cdf-ab19",hs="Expected a function",tr="js-lazy-load",gs="js-app";function K(r,e){if(!r)return;const t=typeof e=="string"?e:JSON.stringify(e);window.localStorage.setItem(r,t)}function Qe(r){if(!r)return null;const e=window.localStorage.getItem(r);if(e===null)return null;try{return JSON.parse(e)}catch{return e}}class ze extends Error{statusCode;constructor(e,t){super(e),this.name="ApiError",this.statusCode=t}}function ys(r,e,t,s,n){return console.warn("--- Global Error Caught ---"),console.warn("Message:",r),console.warn("Source:",e),console.warn("Line:",t),console.warn("Column:",s),console.warn("Error Object:",n),Xe(et(typeof r=="string"?r:"A generic error occured in our app")),!0}function ps(r){console.log("--- Unhandled Promise Rejection Caught ---"),console.log("Reason for rejection:",r.reason);const e=et(r.reason.message,r.reason.stack);Xe(e),r.preventDefault()}async function Xe(r){try{await sr(`/${ms}`,r)}catch(e){console.log(e)}}function et(r="No error message provided.",e="No stack trace available."){return{message:r,stack:e,timestamp:new Date().toISOString(),url:window.location.href}}const ws="X-Noroff-API-Key";function rr(){const r=Qe("accessToken")??Qe("token")??null;if(!r)return null;if(typeof r=="string")return r;try{const e=typeof r=="object"?r:JSON.parse(String(r??"null"));if(e&&typeof e=="object"){if(typeof e.accessToken=="string")return e.accessToken;if(typeof e.token=="string")return e.token}}catch{}return null}function bs(r){K("accessToken",r)}async function we(r,e={}){const{body:t,...s}=e,n={method:t?s.method??"POST":s.method??"GET",...s,headers:{...s.headers||{}}},i=Qe("apiKey"),a=rr();i&&(n.headers[ws]=i),a&&(n.headers.Authorization=`Bearer ${a}`),t!=null&&(t instanceof FormData?n.body=t:typeof t=="string"||t instanceof Blob?(n.body=t,typeof t=="string"&&(n.headers["Content-Type"]=n.headers["Content-Type"]??"application/json")):(n.headers["Content-Type"]=n.headers["Content-Type"]??"application/json",n.body=JSON.stringify(t)));const o=fs.replace(/\/+$/,"");let l=r.replace(/^\/+/,"");o.endsWith("/social")&&/^social\/?/i.test(l)&&(l=l.replace(/^social\/?/i,""));const u=`${o}/${l}`;try{const c=await fetch(u,n),f=c.headers.get("content-type")??"";if(c.status===204||!f.includes("application/json")){if(!c.ok)throw new ze(`HTTP Error: ${c.status}`,c.status);return null}const h=await c.json();if(!c.ok){const d=h?.errors?.[0]?.message||`HTTP Error: ${c.status}`;throw new ze(d,c.status)}return Array.isArray(h)?h.filter(d=>d?.media?.url!==""&&d?.url!==""):h}catch(c){throw c instanceof ze?c:new Error("A network or client error occurred.")}}function tt(r,e){return we(r,e)}const vs=r=>we(r,{method:"GET"}),sr=(r,e)=>we(r,{method:"POST",body:e}),xs=(r,e)=>we(r,{method:"PUT",body:e}),ks=r=>we(r,{method:"DELETE"});async function Ts(r){const t=await(await fetch("https://v2.api.noroff.dev/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json(),s=t?.data?.accessToken||t?.accessToken;return typeof s=="string"&&bs(s),t}async function Ss(r){return(await fetch("https://v2.api.noroff.dev/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json()}async function Os(r){const e=await fetch("https://v2.api.noroff.dev/auth/create-api-key",{method:"POST",headers:{Authorization:`Bearer ${r}`}});if(!e.ok)throw new Error(`Failed to fetch API key: ${e.status} ${e.statusText}`);const s=(await e.json())?.data?.key;return typeof s=="string"&&K("apiKey",s),s}async function rt(){return setTimeout(()=>{const r=document.getElementById("loginForm");if(r){const t=r.querySelector("button[type='submit']");r.addEventListener("submit",async s=>{s.preventDefault();const n=document.getElementById("loginEmail"),i=document.getElementById("loginPassword"),a=document.getElementById("loginMessage");if(!n||!i){console.error("Form inputs not found");return}const o=n.value.trim(),l=i.value;if(a&&(a.textContent="",a.style.color="red"),!o&&!l){a&&(a.textContent="Please enter both email and password.");return}if(!o){a&&(a.textContent="Please enter your email address.");return}if(!l){a&&(a.textContent="Please enter your password.");return}if(!o.includes("@")){a&&(a.textContent="Please enter a valid email address.");return}if(!o.endsWith("@stud.noroff.no")){a&&(a.textContent="Please use your @stud.noroff.no email address.");return}if(l.length<8){a&&(a.textContent="Password must be at least 8 characters long.");return}t&&(t.disabled=!0,t.textContent="🔄 Signing In...");const u=window.loadingScreen;u&&u.showWithMessage("Authenticating...");const c={email:o,password:l};try{const f=await Ts(c);if(f.errors&&f.errors.length>0){const h=f.errors[0]?.message||"Login failed.";a&&(h.toLowerCase().includes("email")?a.textContent="❌ Email address not found. Please check your email or register for an account.":h.toLowerCase().includes("password")?a.textContent="❌ Incorrect password. Please check your password and try again.":h.toLowerCase().includes("user")&&h.toLowerCase().includes("not")?a.textContent="❌ No account found with this email. Please register first.":h.toLowerCase().includes("invalid")?a.textContent="❌ Invalid login credentials. Please check your email and password.":h.toLowerCase().includes("credentials")?a.textContent="❌ Invalid email or password. Please double-check your credentials.":a.textContent=`❌ ${h}`)}else if(f.data){const{accessToken:h,name:d}=f.data;h&&K("accessToken",h),d&&K("user",d);try{const w=await Os(h);w&&K("apiKey",w)}catch(w){console.warn("Failed to get API key:",w)}a&&(a.style.color="white",a.textContent="✅ Login successful! Redirecting to your dashboard..."),typeof window.refreshNavbar=="function"&&window.refreshNavbar(),setTimeout(()=>{history.pushState({path:"/feed"},"","/feed"),$("/feed")},1e3),setTimeout(()=>{history.pushState({path:"/"},"","/"),$("/")},1e3)}else a&&(a.textContent="Unexpected response from server.")}catch(f){console.error("Login error:",f),a&&(f instanceof TypeError&&f.message.includes("fetch")?a.textContent="🌐 Network error. Please check your internet connection and try again.":a.textContent="⚠️ Something went wrong. Please try again in a moment.")}finally{const f=window.loadingScreen;f&&f.hideLoadingScreen(),t&&(t.disabled=!1,t.textContent="🚀 Sign In")}})}const e=document.getElementById("register-link");e&&e.addEventListener("click",t=>{t.preventDefault(),history.pushState({path:"/register"},"","/register"),$("/register")})},0),`
   <div class="page px-5 active flex items-center justify-center min-h-screen bg-gradient-to-br bg-blue-900" id="loginPage">
  <div class="auth-container w-full max-w-md px-6 py-8 bg-blue-500 rounded-xl shadow-lg">
    <div class="auth-card">
      <h1 class="text-3xl font-extrabold text-center text-indigo-700 mb-6">Welcome Back</h1>
      <div id="loginMessage" class="mb-4 text-center font-medium text-red-500"></div>
      <form id="loginForm" class="space-y-5">
        <div class="form-group">
          <label for="loginEmail" class="block mb-2 text-sm font-semibold text-gray-700">Email Address</label>
          <input type="email" id="loginEmail" required
            placeholder="Enter your @stud.noroff.no email"
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
        </div>
        <div class="form-group">
          <label for="loginPassword" class="block mb-2 text-sm font-semibold text-gray-700">Password</label>
          <input type="password" id="loginPassword" required
            placeholder="Enter your password"
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
        </div>
        <button type="submit"
          class="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition flex items-center justify-center gap-2">
          <span>🚀</span> Sign In
        </button>
      </form>

      <div
        class="login-tips mt-6 p-4 rounded-lg border border-indigo-300 bg-indigo-50 text-indigo-700 text-sm leading-relaxed">
        <div class="font-semibold mb-2 flex items-center gap-2">
          <span>💡</span> Login Tips:
        </div>
        <ul class="list-disc list-inside text-indigo-600">
          <li>Use your @stud.noroff.no email address</li>
          <li>Password must be at least 8 characters</li>
          <li>Make sure you've registered an account first</li>
        </ul>
      </div>

      <div class="auth-links mt-6 text-center text-black text-sm">
        <p class="text-black-900 text-m">
          Don't have an account?
          <a href="#" id="register-link" class=" text-white font-medium">Create one here</a>
        </p>
      </div>
    </div>
  </div>
</div>

  `}async function Es(r){r.preventDefault();const e=document.getElementById("email-input").value,t=document.getElementById("password-input").value;try{const s=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})}),n=await s.json();s.ok&&n.accessToken?await Hi(n.accessToken):alert("Login failed: "+n.message)}catch(s){console.error("Login error:",s)}}document.getElementById("login-form")?.addEventListener("submit",Es);async function Is(){return setTimeout(()=>{const r=document.getElementById("registerForm");if(r){const t=r.querySelector("button[type='submit']");r.addEventListener("submit",async s=>{s.preventDefault();const n=document.getElementById("registerName"),i=document.getElementById("registerEmail"),a=document.getElementById("registerPassword"),o=document.getElementById("registerConfirmPassword"),l=document.getElementById("registerMessage");if(!n||!i||!a||!o){console.error("Form inputs not found");return}const u=n.value.trim(),c=i.value.trim(),f=a.value,h=o.value;if(l&&(l.textContent="",l.style.color="red"),!u||!c||!f||!h){l&&(l.textContent="Please fill in all the fields.");return}if(!c.includes("@")){l&&(l.textContent="Please enter a valid email address.");return}if(!c.endsWith("@stud.noroff.no")){l&&(l.textContent="Please use your @stud.noroff.no email address.");return}if(f.length<8){l&&(l.textContent="Password must be at least 8 characters long.");return}if(f!==h){l&&(l.textContent="Passwords do not match.");return}t&&(t.disabled=!0,t.textContent="🔄 Registering...");const d=window.loadingScreen;d&&d.showWithMessage("Registering...");const w={name:u,email:c,password:f};try{const v=await Ss(w);if(v.errors&&v.errors.length>0){const E=v.errors[0]?.message||"Registration failed.";l&&(E.toLowerCase().includes("email")?l.textContent="❌ Email address already in use.":l.textContent=`❌ ${E}`)}else v.data?(l&&(l.style.color="green",l.textContent="✅ Registration successful! Redirecting to login page..."),v.data.accessToken&&K("accessToken",v.data.accessToken),v.data.name&&K("user",v.data.name),setTimeout(()=>{history.pushState({path:"/login"},"","/login"),$("/login")},1500)):l&&(l.textContent="Unexpected response from server.")}catch(v){console.error("Registration error:",v),l&&(v instanceof TypeError&&v.message.includes("fetch")?l.textContent="🌐 Network error. Please check your internet connection and try again.":l.textContent="⚠️ Something went wrong. Please try again in a moment.")}finally{d&&d.hideLoadingScreen(),t&&(t.disabled=!1,t.textContent="🚀 Register")}})}const e=document.getElementById("login-link");e&&e.addEventListener("click",t=>{t.preventDefault(),history.pushState({path:"/login"},"","/login"),$("/login")})},0),`
  <div class="page px-5 active flex items-center justify-center min-h-screen bg-gradient-to-br bg-green-900" id="registerPage">
    <div class="auth-container w-full max-w-md px-6 py-8 bg-green-500 rounded-xl shadow-lg">
      <div class="auth-card">
        <h1 class="text-3xl font-extrabold text-center text-green-700 mb-6">Create Account</h1>
        <div id="registerMessage" class="mb-4 text-center font-medium text-red-500"></div>
        <form id="registerForm" class="space-y-5">
          <div class="form-group">
            <label for="registerName" class="block mb-2 text-sm font-semibold text-gray-700">Full Name</label>
            <input type="text" id="registerName" required
              placeholder="Enter your full name"
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
          </div>
          <div class="form-group">
            <label for="registerEmail" class="block mb-2 text-sm font-semibold text-gray-700">Email Address</label>
            <input type="email" id="registerEmail" required
              placeholder="Enter your @stud.noroff.no email"
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
          </div>
          <div class="form-group">
            <label for="registerPassword" class="block mb-2 text-sm font-semibold text-gray-700">Password</label>
            <input type="password" id="registerPassword" required
              placeholder="Enter your password"
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
          </div>
          <div class="form-group">
            <label for="registerConfirmPassword" class="block mb-2 text-sm font-semibold text-gray-700">Confirm Password</label>
            <input type="password" id="registerConfirmPassword" required
              placeholder="Confirm your password"
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
          </div>
          <button type="submit"
            class="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition flex items-center justify-center gap-2">
            <span>🚀</span> Register
          </button>
        </form>

        <div class="auth-links mt-6 text-center text-white text-sm">
          <p>
            Already have an account?
            <a href="#" id="login-link" class="font-medium underline">Login here</a>
          </p>
        </div>
      </div>
    </div>
  </div>
  `}class Q extends Error{}class Ns extends Q{constructor(e){super(`Invalid DateTime: ${e.toMessage()}`)}}class Cs extends Q{constructor(e){super(`Invalid Interval: ${e.toMessage()}`)}}class Ms extends Q{constructor(e){super(`Invalid Duration: ${e.toMessage()}`)}}class re extends Q{}class nr extends Q{constructor(e){super(`Invalid unit ${e}`)}}class I extends Q{}class B extends Q{constructor(){super("Zone is an abstract class")}}const m="numeric",R="short",D="long",$e={year:m,month:m,day:m},ir={year:m,month:R,day:m},Ds={year:m,month:R,day:m,weekday:R},ar={year:m,month:D,day:m},or={year:m,month:D,day:m,weekday:D},lr={hour:m,minute:m},ur={hour:m,minute:m,second:m},cr={hour:m,minute:m,second:m,timeZoneName:R},dr={hour:m,minute:m,second:m,timeZoneName:D},fr={hour:m,minute:m,hourCycle:"h23"},mr={hour:m,minute:m,second:m,hourCycle:"h23"},hr={hour:m,minute:m,second:m,hourCycle:"h23",timeZoneName:R},gr={hour:m,minute:m,second:m,hourCycle:"h23",timeZoneName:D},yr={year:m,month:m,day:m,hour:m,minute:m},pr={year:m,month:m,day:m,hour:m,minute:m,second:m},wr={year:m,month:R,day:m,hour:m,minute:m},br={year:m,month:R,day:m,hour:m,minute:m,second:m},$s={year:m,month:R,day:m,weekday:R,hour:m,minute:m},vr={year:m,month:D,day:m,hour:m,minute:m,timeZoneName:R},xr={year:m,month:D,day:m,hour:m,minute:m,second:m,timeZoneName:R},kr={year:m,month:D,day:m,weekday:D,hour:m,minute:m,timeZoneName:D},Tr={year:m,month:D,day:m,weekday:D,hour:m,minute:m,second:m,timeZoneName:D};class be{get type(){throw new B}get name(){throw new B}get ianaName(){return this.name}get isUniversal(){throw new B}offsetName(e,t){throw new B}formatOffset(e,t){throw new B}offset(e){throw new B}equals(e){throw new B}get isValid(){throw new B}}let qe=null;class Ve extends be{static get instance(){return qe===null&&(qe=new Ve),qe}get type(){return"system"}get name(){return new Intl.DateTimeFormat().resolvedOptions().timeZone}get isUniversal(){return!1}offsetName(e,{format:t,locale:s}){return Lr(e,t,s)}formatOffset(e,t){return ye(this.offset(e),t)}offset(e){return-new Date(e).getTimezoneOffset()}equals(e){return e.type==="system"}get isValid(){return!0}}const st=new Map;function Fs(r){let e=st.get(r);return e===void 0&&(e=new Intl.DateTimeFormat("en-US",{hour12:!1,timeZone:r,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",era:"short"}),st.set(r,e)),e}const Ls={year:0,month:1,day:2,era:3,hour:4,minute:5,second:6};function As(r,e){const t=r.format(e).replace(/\u200E/g,""),s=/(\d+)\/(\d+)\/(\d+) (AD|BC),? (\d+):(\d+):(\d+)/.exec(t),[,n,i,a,o,l,u,c]=s;return[a,n,i,o,l,u,c]}function Vs(r,e){const t=r.formatToParts(e),s=[];for(let n=0;n<t.length;n++){const{type:i,value:a}=t[n],o=Ls[i];i==="era"?s[o]=a:y(o)||(s[o]=parseInt(a,10))}return s}const Be=new Map;class q extends be{static create(e){let t=Be.get(e);return t===void 0&&Be.set(e,t=new q(e)),t}static resetCache(){Be.clear(),st.clear()}static isValidSpecifier(e){return this.isValidZone(e)}static isValidZone(e){if(!e)return!1;try{return new Intl.DateTimeFormat("en-US",{timeZone:e}).format(),!0}catch{return!1}}constructor(e){super(),this.zoneName=e,this.valid=q.isValidZone(e)}get type(){return"iana"}get name(){return this.zoneName}get isUniversal(){return!1}offsetName(e,{format:t,locale:s}){return Lr(e,t,s,this.name)}formatOffset(e,t){return ye(this.offset(e),t)}offset(e){if(!this.valid)return NaN;const t=new Date(e);if(isNaN(t))return NaN;const s=Fs(this.name);let[n,i,a,o,l,u,c]=s.formatToParts?Vs(s,t):As(s,t);o==="BC"&&(n=-Math.abs(n)+1);const h=Pe({year:n,month:i,day:a,hour:l===24?0:l,minute:u,second:c,millisecond:0});let d=+t;const w=d%1e3;return d-=w>=0?w:1e3+w,(h-d)/(60*1e3)}equals(e){return e.type==="iana"&&e.name===this.name}get isValid(){return this.valid}}let St={};function Ws(r,e={}){const t=JSON.stringify([r,e]);let s=St[t];return s||(s=new Intl.ListFormat(r,e),St[t]=s),s}const nt=new Map;function it(r,e={}){const t=JSON.stringify([r,e]);let s=nt.get(t);return s===void 0&&(s=new Intl.DateTimeFormat(r,e),nt.set(t,s)),s}const at=new Map;function Ps(r,e={}){const t=JSON.stringify([r,e]);let s=at.get(t);return s===void 0&&(s=new Intl.NumberFormat(r,e),at.set(t,s)),s}const ot=new Map;function Us(r,e={}){const{base:t,...s}=e,n=JSON.stringify([r,s]);let i=ot.get(n);return i===void 0&&(i=new Intl.RelativeTimeFormat(r,e),ot.set(n,i)),i}let me=null;function Rs(){return me||(me=new Intl.DateTimeFormat().resolvedOptions().locale,me)}const lt=new Map;function Sr(r){let e=lt.get(r);return e===void 0&&(e=new Intl.DateTimeFormat(r).resolvedOptions(),lt.set(r,e)),e}const ut=new Map;function Zs(r){let e=ut.get(r);if(!e){const t=new Intl.Locale(r);e="getWeekInfo"in t?t.getWeekInfo():t.weekInfo,"minimalDays"in e||(e={...Or,...e}),ut.set(r,e)}return e}function zs(r){const e=r.indexOf("-x-");e!==-1&&(r=r.substring(0,e));const t=r.indexOf("-u-");if(t===-1)return[r];{let s,n;try{s=it(r).resolvedOptions(),n=r}catch{const l=r.substring(0,t);s=it(l).resolvedOptions(),n=l}const{numberingSystem:i,calendar:a}=s;return[n,i,a]}}function qs(r,e,t){return(t||e)&&(r.includes("-u-")||(r+="-u"),t&&(r+=`-ca-${t}`),e&&(r+=`-nu-${e}`)),r}function Bs(r){const e=[];for(let t=1;t<=12;t++){const s=g.utc(2009,t,1);e.push(r(s))}return e}function js(r){const e=[];for(let t=1;t<=7;t++){const s=g.utc(2016,11,13+t);e.push(r(s))}return e}function Se(r,e,t,s){const n=r.listingMode();return n==="error"?null:n==="en"?t(e):s(e)}function Hs(r){return r.numberingSystem&&r.numberingSystem!=="latn"?!1:r.numberingSystem==="latn"||!r.locale||r.locale.startsWith("en")||Sr(r.locale).numberingSystem==="latn"}class Ys{constructor(e,t,s){this.padTo=s.padTo||0,this.floor=s.floor||!1;const{padTo:n,floor:i,...a}=s;if(!t||Object.keys(a).length>0){const o={useGrouping:!1,...s};s.padTo>0&&(o.minimumIntegerDigits=s.padTo),this.inf=Ps(e,o)}}format(e){if(this.inf){const t=this.floor?Math.floor(e):e;return this.inf.format(t)}else{const t=this.floor?Math.floor(e):wt(e,3);return O(t,this.padTo)}}}class _s{constructor(e,t,s){this.opts=s,this.originalZone=void 0;let n;if(this.opts.timeZone)this.dt=e;else if(e.zone.type==="fixed"){const a=-1*(e.offset/60),o=a>=0?`Etc/GMT+${a}`:`Etc/GMT${a}`;e.offset!==0&&q.create(o).valid?(n=o,this.dt=e):(n="UTC",this.dt=e.offset===0?e:e.setZone("UTC").plus({minutes:e.offset}),this.originalZone=e.zone)}else e.zone.type==="system"?this.dt=e:e.zone.type==="iana"?(this.dt=e,n=e.zone.name):(n="UTC",this.dt=e.setZone("UTC").plus({minutes:e.offset}),this.originalZone=e.zone);const i={...this.opts};i.timeZone=i.timeZone||n,this.dtf=it(t,i)}format(){return this.originalZone?this.formatToParts().map(({value:e})=>e).join(""):this.dtf.format(this.dt.toJSDate())}formatToParts(){const e=this.dtf.formatToParts(this.dt.toJSDate());return this.originalZone?e.map(t=>{if(t.type==="timeZoneName"){const s=this.originalZone.offsetName(this.dt.ts,{locale:this.dt.locale,format:this.opts.timeZoneName});return{...t,value:s}}else return t}):e}resolvedOptions(){return this.dtf.resolvedOptions()}}class Gs{constructor(e,t,s){this.opts={style:"long",...s},!t&&$r()&&(this.rtf=Us(e,s))}format(e,t){return this.rtf?this.rtf.format(e,t):wn(t,e,this.opts.numeric,this.opts.style!=="long")}formatToParts(e,t){return this.rtf?this.rtf.formatToParts(e,t):[]}}const Or={firstDay:1,minimalDays:4,weekend:[6,7]};class k{static fromOpts(e){return k.create(e.locale,e.numberingSystem,e.outputCalendar,e.weekSettings,e.defaultToEN)}static create(e,t,s,n,i=!1){const a=e||S.defaultLocale,o=a||(i?"en-US":Rs()),l=t||S.defaultNumberingSystem,u=s||S.defaultOutputCalendar,c=dt(n)||S.defaultWeekSettings;return new k(o,l,u,c,a)}static resetCache(){me=null,nt.clear(),at.clear(),ot.clear(),lt.clear(),ut.clear()}static fromObject({locale:e,numberingSystem:t,outputCalendar:s,weekSettings:n}={}){return k.create(e,t,s,n)}constructor(e,t,s,n,i){const[a,o,l]=zs(e);this.locale=a,this.numberingSystem=t||o||null,this.outputCalendar=s||l||null,this.weekSettings=n,this.intl=qs(this.locale,this.numberingSystem,this.outputCalendar),this.weekdaysCache={format:{},standalone:{}},this.monthsCache={format:{},standalone:{}},this.meridiemCache=null,this.eraCache={},this.specifiedLocale=i,this.fastNumbersCached=null}get fastNumbers(){return this.fastNumbersCached==null&&(this.fastNumbersCached=Hs(this)),this.fastNumbersCached}listingMode(){const e=this.isEnglish(),t=(this.numberingSystem===null||this.numberingSystem==="latn")&&(this.outputCalendar===null||this.outputCalendar==="gregory");return e&&t?"en":"intl"}clone(e){return!e||Object.getOwnPropertyNames(e).length===0?this:k.create(e.locale||this.specifiedLocale,e.numberingSystem||this.numberingSystem,e.outputCalendar||this.outputCalendar,dt(e.weekSettings)||this.weekSettings,e.defaultToEN||!1)}redefaultToEN(e={}){return this.clone({...e,defaultToEN:!0})}redefaultToSystem(e={}){return this.clone({...e,defaultToEN:!1})}months(e,t=!1){return Se(this,e,Wr,()=>{const s=this.intl==="ja"||this.intl.startsWith("ja-");t&=!s;const n=t?{month:e,day:"numeric"}:{month:e},i=t?"format":"standalone";if(!this.monthsCache[i][e]){const a=s?o=>this.dtFormatter(o,n).format():o=>this.extract(o,n,"month");this.monthsCache[i][e]=Bs(a)}return this.monthsCache[i][e]})}weekdays(e,t=!1){return Se(this,e,Rr,()=>{const s=t?{weekday:e,year:"numeric",month:"long",day:"numeric"}:{weekday:e},n=t?"format":"standalone";return this.weekdaysCache[n][e]||(this.weekdaysCache[n][e]=js(i=>this.extract(i,s,"weekday"))),this.weekdaysCache[n][e]})}meridiems(){return Se(this,void 0,()=>Zr,()=>{if(!this.meridiemCache){const e={hour:"numeric",hourCycle:"h12"};this.meridiemCache=[g.utc(2016,11,13,9),g.utc(2016,11,13,19)].map(t=>this.extract(t,e,"dayperiod"))}return this.meridiemCache})}eras(e){return Se(this,e,zr,()=>{const t={era:e};return this.eraCache[e]||(this.eraCache[e]=[g.utc(-40,1,1),g.utc(2017,1,1)].map(s=>this.extract(s,t,"era"))),this.eraCache[e]})}extract(e,t,s){const n=this.dtFormatter(e,t),i=n.formatToParts(),a=i.find(o=>o.type.toLowerCase()===s);return a?a.value:null}numberFormatter(e={}){return new Ys(this.intl,e.forceSimple||this.fastNumbers,e)}dtFormatter(e,t={}){return new _s(e,this.intl,t)}relFormatter(e={}){return new Gs(this.intl,this.isEnglish(),e)}listFormatter(e={}){return Ws(this.intl,e)}isEnglish(){return this.locale==="en"||this.locale.toLowerCase()==="en-us"||Sr(this.intl).locale.startsWith("en-us")}getWeekSettings(){return this.weekSettings?this.weekSettings:Fr()?Zs(this.locale):Or}getStartOfWeek(){return this.getWeekSettings().firstDay}getMinDaysInFirstWeek(){return this.getWeekSettings().minimalDays}getWeekendDays(){return this.getWeekSettings().weekend}equals(e){return this.locale===e.locale&&this.numberingSystem===e.numberingSystem&&this.outputCalendar===e.outputCalendar}toString(){return`Locale(${this.locale}, ${this.numberingSystem}, ${this.outputCalendar})`}}let je=null;class C extends be{static get utcInstance(){return je===null&&(je=new C(0)),je}static instance(e){return e===0?C.utcInstance:new C(e)}static parseSpecifier(e){if(e){const t=e.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);if(t)return new C(Ue(t[1],t[2]))}return null}constructor(e){super(),this.fixed=e}get type(){return"fixed"}get name(){return this.fixed===0?"UTC":`UTC${ye(this.fixed,"narrow")}`}get ianaName(){return this.fixed===0?"Etc/UTC":`Etc/GMT${ye(-this.fixed,"narrow")}`}offsetName(){return this.name}formatOffset(e,t){return ye(this.fixed,t)}get isUniversal(){return!0}offset(){return this.fixed}equals(e){return e.type==="fixed"&&e.fixed===this.fixed}get isValid(){return!0}}class Js extends be{constructor(e){super(),this.zoneName=e}get type(){return"invalid"}get name(){return this.zoneName}get isUniversal(){return!1}offsetName(){return null}formatOffset(){return""}offset(){return NaN}equals(){return!1}get isValid(){return!1}}function H(r,e){if(y(r)||r===null)return e;if(r instanceof be)return r;if(rn(r)){const t=r.toLowerCase();return t==="default"?e:t==="local"||t==="system"?Ve.instance:t==="utc"||t==="gmt"?C.utcInstance:C.parseSpecifier(t)||q.create(r)}else return Y(r)?C.instance(r):typeof r=="object"&&"offset"in r&&typeof r.offset=="function"?r:new Js(r)}const ht={arab:"[٠-٩]",arabext:"[۰-۹]",bali:"[᭐-᭙]",beng:"[০-৯]",deva:"[०-९]",fullwide:"[０-９]",gujr:"[૦-૯]",hanidec:"[〇|一|二|三|四|五|六|七|八|九]",khmr:"[០-៩]",knda:"[೦-೯]",laoo:"[໐-໙]",limb:"[᥆-᥏]",mlym:"[൦-൯]",mong:"[᠐-᠙]",mymr:"[၀-၉]",orya:"[୦-୯]",tamldec:"[௦-௯]",telu:"[౦-౯]",thai:"[๐-๙]",tibt:"[༠-༩]",latn:"\\d"},Ot={arab:[1632,1641],arabext:[1776,1785],bali:[6992,7001],beng:[2534,2543],deva:[2406,2415],fullwide:[65296,65303],gujr:[2790,2799],khmr:[6112,6121],knda:[3302,3311],laoo:[3792,3801],limb:[6470,6479],mlym:[3430,3439],mong:[6160,6169],mymr:[4160,4169],orya:[2918,2927],tamldec:[3046,3055],telu:[3174,3183],thai:[3664,3673],tibt:[3872,3881]},Ks=ht.hanidec.replace(/[\[|\]]/g,"").split("");function Qs(r){let e=parseInt(r,10);if(isNaN(e)){e="";for(let t=0;t<r.length;t++){const s=r.charCodeAt(t);if(r[t].search(ht.hanidec)!==-1)e+=Ks.indexOf(r[t]);else for(const n in Ot){const[i,a]=Ot[n];s>=i&&s<=a&&(e+=s-i)}}return parseInt(e,10)}else return e}const ct=new Map;function Xs(){ct.clear()}function W({numberingSystem:r},e=""){const t=r||"latn";let s=ct.get(t);s===void 0&&(s=new Map,ct.set(t,s));let n=s.get(e);return n===void 0&&(n=new RegExp(`${ht[t]}${e}`),s.set(e,n)),n}let Et=()=>Date.now(),It="system",Nt=null,Ct=null,Mt=null,Dt=60,$t,Ft=null;class S{static get now(){return Et}static set now(e){Et=e}static set defaultZone(e){It=e}static get defaultZone(){return H(It,Ve.instance)}static get defaultLocale(){return Nt}static set defaultLocale(e){Nt=e}static get defaultNumberingSystem(){return Ct}static set defaultNumberingSystem(e){Ct=e}static get defaultOutputCalendar(){return Mt}static set defaultOutputCalendar(e){Mt=e}static get defaultWeekSettings(){return Ft}static set defaultWeekSettings(e){Ft=dt(e)}static get twoDigitCutoffYear(){return Dt}static set twoDigitCutoffYear(e){Dt=e%100}static get throwOnInvalid(){return $t}static set throwOnInvalid(e){$t=e}static resetCaches(){k.resetCache(),q.resetCache(),g.resetCache(),Xs()}}class U{constructor(e,t){this.reason=e,this.explanation=t}toMessage(){return this.explanation?`${this.reason}: ${this.explanation}`:this.reason}}const Er=[0,31,59,90,120,151,181,212,243,273,304,334],Ir=[0,31,60,91,121,152,182,213,244,274,305,335];function A(r,e){return new U("unit out of range",`you specified ${e} (of type ${typeof e}) as a ${r}, which is invalid`)}function gt(r,e,t){const s=new Date(Date.UTC(r,e-1,t));r<100&&r>=0&&s.setUTCFullYear(s.getUTCFullYear()-1900);const n=s.getUTCDay();return n===0?7:n}function Nr(r,e,t){return t+(ve(r)?Ir:Er)[e-1]}function Cr(r,e){const t=ve(r)?Ir:Er,s=t.findIndex(i=>i<e),n=e-t[s];return{month:s+1,day:n}}function yt(r,e){return(r-e+7)%7+1}function Fe(r,e=4,t=1){const{year:s,month:n,day:i}=r,a=Nr(s,n,i),o=yt(gt(s,n,i),t);let l=Math.floor((a-o+14-e)/7),u;return l<1?(u=s-1,l=pe(u,e,t)):l>pe(s,e,t)?(u=s+1,l=1):u=s,{weekYear:u,weekNumber:l,weekday:o,...Re(r)}}function Lt(r,e=4,t=1){const{weekYear:s,weekNumber:n,weekday:i}=r,a=yt(gt(s,1,e),t),o=se(s);let l=n*7+i-a-7+e,u;l<1?(u=s-1,l+=se(u)):l>o?(u=s+1,l-=se(s)):u=s;const{month:c,day:f}=Cr(u,l);return{year:u,month:c,day:f,...Re(r)}}function He(r){const{year:e,month:t,day:s}=r,n=Nr(e,t,s);return{year:e,ordinal:n,...Re(r)}}function At(r){const{year:e,ordinal:t}=r,{month:s,day:n}=Cr(e,t);return{year:e,month:s,day:n,...Re(r)}}function Vt(r,e){if(!y(r.localWeekday)||!y(r.localWeekNumber)||!y(r.localWeekYear)){if(!y(r.weekday)||!y(r.weekNumber)||!y(r.weekYear))throw new re("Cannot mix locale-based week fields with ISO-based week fields");return y(r.localWeekday)||(r.weekday=r.localWeekday),y(r.localWeekNumber)||(r.weekNumber=r.localWeekNumber),y(r.localWeekYear)||(r.weekYear=r.localWeekYear),delete r.localWeekday,delete r.localWeekNumber,delete r.localWeekYear,{minDaysInFirstWeek:e.getMinDaysInFirstWeek(),startOfWeek:e.getStartOfWeek()}}else return{minDaysInFirstWeek:4,startOfWeek:1}}function en(r,e=4,t=1){const s=We(r.weekYear),n=V(r.weekNumber,1,pe(r.weekYear,e,t)),i=V(r.weekday,1,7);return s?n?i?!1:A("weekday",r.weekday):A("week",r.weekNumber):A("weekYear",r.weekYear)}function tn(r){const e=We(r.year),t=V(r.ordinal,1,se(r.year));return e?t?!1:A("ordinal",r.ordinal):A("year",r.year)}function Mr(r){const e=We(r.year),t=V(r.month,1,12),s=V(r.day,1,Le(r.year,r.month));return e?t?s?!1:A("day",r.day):A("month",r.month):A("year",r.year)}function Dr(r){const{hour:e,minute:t,second:s,millisecond:n}=r,i=V(e,0,23)||e===24&&t===0&&s===0&&n===0,a=V(t,0,59),o=V(s,0,59),l=V(n,0,999);return i?a?o?l?!1:A("millisecond",n):A("second",s):A("minute",t):A("hour",e)}function y(r){return typeof r>"u"}function Y(r){return typeof r=="number"}function We(r){return typeof r=="number"&&r%1===0}function rn(r){return typeof r=="string"}function sn(r){return Object.prototype.toString.call(r)==="[object Date]"}function $r(){try{return typeof Intl<"u"&&!!Intl.RelativeTimeFormat}catch{return!1}}function Fr(){try{return typeof Intl<"u"&&!!Intl.Locale&&("weekInfo"in Intl.Locale.prototype||"getWeekInfo"in Intl.Locale.prototype)}catch{return!1}}function nn(r){return Array.isArray(r)?r:[r]}function Wt(r,e,t){if(r.length!==0)return r.reduce((s,n)=>{const i=[e(n),n];return s&&t(s[0],i[0])===s[0]?s:i},null)[1]}function an(r,e){return e.reduce((t,s)=>(t[s]=r[s],t),{})}function ie(r,e){return Object.prototype.hasOwnProperty.call(r,e)}function dt(r){if(r==null)return null;if(typeof r!="object")throw new I("Week settings must be an object");if(!V(r.firstDay,1,7)||!V(r.minimalDays,1,7)||!Array.isArray(r.weekend)||r.weekend.some(e=>!V(e,1,7)))throw new I("Invalid week settings");return{firstDay:r.firstDay,minimalDays:r.minimalDays,weekend:Array.from(r.weekend)}}function V(r,e,t){return We(r)&&r>=e&&r<=t}function on(r,e){return r-e*Math.floor(r/e)}function O(r,e=2){const t=r<0;let s;return t?s="-"+(""+-r).padStart(e,"0"):s=(""+r).padStart(e,"0"),s}function j(r){if(!(y(r)||r===null||r===""))return parseInt(r,10)}function _(r){if(!(y(r)||r===null||r===""))return parseFloat(r)}function pt(r){if(!(y(r)||r===null||r==="")){const e=parseFloat("0."+r)*1e3;return Math.floor(e)}}function wt(r,e,t="round"){const s=10**e;switch(t){case"expand":return r>0?Math.ceil(r*s)/s:Math.floor(r*s)/s;case"trunc":return Math.trunc(r*s)/s;case"round":return Math.round(r*s)/s;case"floor":return Math.floor(r*s)/s;case"ceil":return Math.ceil(r*s)/s;default:throw new RangeError(`Value rounding ${t} is out of range`)}}function ve(r){return r%4===0&&(r%100!==0||r%400===0)}function se(r){return ve(r)?366:365}function Le(r,e){const t=on(e-1,12)+1,s=r+(e-t)/12;return t===2?ve(s)?29:28:[31,null,31,30,31,30,31,31,30,31,30,31][t-1]}function Pe(r){let e=Date.UTC(r.year,r.month-1,r.day,r.hour,r.minute,r.second,r.millisecond);return r.year<100&&r.year>=0&&(e=new Date(e),e.setUTCFullYear(r.year,r.month-1,r.day)),+e}function Pt(r,e,t){return-yt(gt(r,1,e),t)+e-1}function pe(r,e=4,t=1){const s=Pt(r,e,t),n=Pt(r+1,e,t);return(se(r)-s+n)/7}function ft(r){return r>99?r:r>S.twoDigitCutoffYear?1900+r:2e3+r}function Lr(r,e,t,s=null){const n=new Date(r),i={hourCycle:"h23",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"};s&&(i.timeZone=s);const a={timeZoneName:e,...i},o=new Intl.DateTimeFormat(t,a).formatToParts(n).find(l=>l.type.toLowerCase()==="timezonename");return o?o.value:null}function Ue(r,e){let t=parseInt(r,10);Number.isNaN(t)&&(t=0);const s=parseInt(e,10)||0,n=t<0||Object.is(t,-0)?-s:s;return t*60+n}function Ar(r){const e=Number(r);if(typeof r=="boolean"||r===""||!Number.isFinite(e))throw new I(`Invalid unit value ${r}`);return e}function Ae(r,e){const t={};for(const s in r)if(ie(r,s)){const n=r[s];if(n==null)continue;t[e(s)]=Ar(n)}return t}function ye(r,e){const t=Math.trunc(Math.abs(r/60)),s=Math.trunc(Math.abs(r%60)),n=r>=0?"+":"-";switch(e){case"short":return`${n}${O(t,2)}:${O(s,2)}`;case"narrow":return`${n}${t}${s>0?`:${s}`:""}`;case"techie":return`${n}${O(t,2)}${O(s,2)}`;default:throw new RangeError(`Value format ${e} is out of range for property format`)}}function Re(r){return an(r,["hour","minute","second","millisecond"])}const ln=["January","February","March","April","May","June","July","August","September","October","November","December"],Vr=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],un=["J","F","M","A","M","J","J","A","S","O","N","D"];function Wr(r){switch(r){case"narrow":return[...un];case"short":return[...Vr];case"long":return[...ln];case"numeric":return["1","2","3","4","5","6","7","8","9","10","11","12"];case"2-digit":return["01","02","03","04","05","06","07","08","09","10","11","12"];default:return null}}const Pr=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],Ur=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],cn=["M","T","W","T","F","S","S"];function Rr(r){switch(r){case"narrow":return[...cn];case"short":return[...Ur];case"long":return[...Pr];case"numeric":return["1","2","3","4","5","6","7"];default:return null}}const Zr=["AM","PM"],dn=["Before Christ","Anno Domini"],fn=["BC","AD"],mn=["B","A"];function zr(r){switch(r){case"narrow":return[...mn];case"short":return[...fn];case"long":return[...dn];default:return null}}function hn(r){return Zr[r.hour<12?0:1]}function gn(r,e){return Rr(e)[r.weekday-1]}function yn(r,e){return Wr(e)[r.month-1]}function pn(r,e){return zr(e)[r.year<0?0:1]}function wn(r,e,t="always",s=!1){const n={years:["year","yr."],quarters:["quarter","qtr."],months:["month","mo."],weeks:["week","wk."],days:["day","day","days"],hours:["hour","hr."],minutes:["minute","min."],seconds:["second","sec."]},i=["hours","minutes","seconds"].indexOf(r)===-1;if(t==="auto"&&i){const f=r==="days";switch(e){case 1:return f?"tomorrow":`next ${n[r][0]}`;case-1:return f?"yesterday":`last ${n[r][0]}`;case 0:return f?"today":`this ${n[r][0]}`}}const a=Object.is(e,-0)||e<0,o=Math.abs(e),l=o===1,u=n[r],c=s?l?u[1]:u[2]||u[1]:l?n[r][0]:r;return a?`${o} ${c} ago`:`in ${o} ${c}`}function Ut(r,e){let t="";for(const s of r)s.literal?t+=s.val:t+=e(s.val);return t}const bn={D:$e,DD:ir,DDD:ar,DDDD:or,t:lr,tt:ur,ttt:cr,tttt:dr,T:fr,TT:mr,TTT:hr,TTTT:gr,f:yr,ff:wr,fff:vr,ffff:kr,F:pr,FF:br,FFF:xr,FFFF:Tr};class N{static create(e,t={}){return new N(e,t)}static parseFormat(e){let t=null,s="",n=!1;const i=[];for(let a=0;a<e.length;a++){const o=e.charAt(a);o==="'"?((s.length>0||n)&&i.push({literal:n||/^\s+$/.test(s),val:s===""?"'":s}),t=null,s="",n=!n):n||o===t?s+=o:(s.length>0&&i.push({literal:/^\s+$/.test(s),val:s}),s=o,t=o)}return s.length>0&&i.push({literal:n||/^\s+$/.test(s),val:s}),i}static macroTokenToFormatOpts(e){return bn[e]}constructor(e,t){this.opts=t,this.loc=e,this.systemLoc=null}formatWithSystemDefault(e,t){return this.systemLoc===null&&(this.systemLoc=this.loc.redefaultToSystem()),this.systemLoc.dtFormatter(e,{...this.opts,...t}).format()}dtFormatter(e,t={}){return this.loc.dtFormatter(e,{...this.opts,...t})}formatDateTime(e,t){return this.dtFormatter(e,t).format()}formatDateTimeParts(e,t){return this.dtFormatter(e,t).formatToParts()}formatInterval(e,t){return this.dtFormatter(e.start,t).dtf.formatRange(e.start.toJSDate(),e.end.toJSDate())}resolvedOptions(e,t){return this.dtFormatter(e,t).resolvedOptions()}num(e,t=0,s=void 0){if(this.opts.forceSimple)return O(e,t);const n={...this.opts};return t>0&&(n.padTo=t),s&&(n.signDisplay=s),this.loc.numberFormatter(n).format(e)}formatDateTimeFromString(e,t){const s=this.loc.listingMode()==="en",n=this.loc.outputCalendar&&this.loc.outputCalendar!=="gregory",i=(d,w)=>this.loc.extract(e,d,w),a=d=>e.isOffsetFixed&&e.offset===0&&d.allowZ?"Z":e.isValid?e.zone.formatOffset(e.ts,d.format):"",o=()=>s?hn(e):i({hour:"numeric",hourCycle:"h12"},"dayperiod"),l=(d,w)=>s?yn(e,d):i(w?{month:d}:{month:d,day:"numeric"},"month"),u=(d,w)=>s?gn(e,d):i(w?{weekday:d}:{weekday:d,month:"long",day:"numeric"},"weekday"),c=d=>{const w=N.macroTokenToFormatOpts(d);return w?this.formatWithSystemDefault(e,w):d},f=d=>s?pn(e,d):i({era:d},"era"),h=d=>{switch(d){case"S":return this.num(e.millisecond);case"u":case"SSS":return this.num(e.millisecond,3);case"s":return this.num(e.second);case"ss":return this.num(e.second,2);case"uu":return this.num(Math.floor(e.millisecond/10),2);case"uuu":return this.num(Math.floor(e.millisecond/100));case"m":return this.num(e.minute);case"mm":return this.num(e.minute,2);case"h":return this.num(e.hour%12===0?12:e.hour%12);case"hh":return this.num(e.hour%12===0?12:e.hour%12,2);case"H":return this.num(e.hour);case"HH":return this.num(e.hour,2);case"Z":return a({format:"narrow",allowZ:this.opts.allowZ});case"ZZ":return a({format:"short",allowZ:this.opts.allowZ});case"ZZZ":return a({format:"techie",allowZ:this.opts.allowZ});case"ZZZZ":return e.zone.offsetName(e.ts,{format:"short",locale:this.loc.locale});case"ZZZZZ":return e.zone.offsetName(e.ts,{format:"long",locale:this.loc.locale});case"z":return e.zoneName;case"a":return o();case"d":return n?i({day:"numeric"},"day"):this.num(e.day);case"dd":return n?i({day:"2-digit"},"day"):this.num(e.day,2);case"c":return this.num(e.weekday);case"ccc":return u("short",!0);case"cccc":return u("long",!0);case"ccccc":return u("narrow",!0);case"E":return this.num(e.weekday);case"EEE":return u("short",!1);case"EEEE":return u("long",!1);case"EEEEE":return u("narrow",!1);case"L":return n?i({month:"numeric",day:"numeric"},"month"):this.num(e.month);case"LL":return n?i({month:"2-digit",day:"numeric"},"month"):this.num(e.month,2);case"LLL":return l("short",!0);case"LLLL":return l("long",!0);case"LLLLL":return l("narrow",!0);case"M":return n?i({month:"numeric"},"month"):this.num(e.month);case"MM":return n?i({month:"2-digit"},"month"):this.num(e.month,2);case"MMM":return l("short",!1);case"MMMM":return l("long",!1);case"MMMMM":return l("narrow",!1);case"y":return n?i({year:"numeric"},"year"):this.num(e.year);case"yy":return n?i({year:"2-digit"},"year"):this.num(e.year.toString().slice(-2),2);case"yyyy":return n?i({year:"numeric"},"year"):this.num(e.year,4);case"yyyyyy":return n?i({year:"numeric"},"year"):this.num(e.year,6);case"G":return f("short");case"GG":return f("long");case"GGGGG":return f("narrow");case"kk":return this.num(e.weekYear.toString().slice(-2),2);case"kkkk":return this.num(e.weekYear,4);case"W":return this.num(e.weekNumber);case"WW":return this.num(e.weekNumber,2);case"n":return this.num(e.localWeekNumber);case"nn":return this.num(e.localWeekNumber,2);case"ii":return this.num(e.localWeekYear.toString().slice(-2),2);case"iiii":return this.num(e.localWeekYear,4);case"o":return this.num(e.ordinal);case"ooo":return this.num(e.ordinal,3);case"q":return this.num(e.quarter);case"qq":return this.num(e.quarter,2);case"X":return this.num(Math.floor(e.ts/1e3));case"x":return this.num(e.ts);default:return c(d)}};return Ut(N.parseFormat(t),h)}formatDurationFromString(e,t){const s=this.opts.signMode==="negativeLargestOnly"?-1:1,n=c=>{switch(c[0]){case"S":return"milliseconds";case"s":return"seconds";case"m":return"minutes";case"h":return"hours";case"d":return"days";case"w":return"weeks";case"M":return"months";case"y":return"years";default:return null}},i=(c,f)=>h=>{const d=n(h);if(d){const w=f.isNegativeDuration&&d!==f.largestUnit?s:1;let v;return this.opts.signMode==="negativeLargestOnly"&&d!==f.largestUnit?v="never":this.opts.signMode==="all"?v="always":v="auto",this.num(c.get(d)*w,h.length,v)}else return h},a=N.parseFormat(t),o=a.reduce((c,{literal:f,val:h})=>f?c:c.concat(h),[]),l=e.shiftTo(...o.map(n).filter(c=>c)),u={isNegativeDuration:l<0,largestUnit:Object.keys(l.values)[0]};return Ut(a,i(l,u))}}const qr=/[A-Za-z_+-]{1,256}(?::?\/[A-Za-z0-9_+-]{1,256}(?:\/[A-Za-z0-9_+-]{1,256})?)?/;function ae(...r){const e=r.reduce((t,s)=>t+s.source,"");return RegExp(`^${e}$`)}function oe(...r){return e=>r.reduce(([t,s,n],i)=>{const[a,o,l]=i(e,n);return[{...t,...a},o||s,l]},[{},null,1]).slice(0,2)}function le(r,...e){if(r==null)return[null,null];for(const[t,s]of e){const n=t.exec(r);if(n)return s(n)}return[null,null]}function Br(...r){return(e,t)=>{const s={};let n;for(n=0;n<r.length;n++)s[r[n]]=j(e[t+n]);return[s,null,t+n]}}const jr=/(?:([Zz])|([+-]\d\d)(?::?(\d\d))?)/,vn=`(?:${jr.source}?(?:\\[(${qr.source})\\])?)?`,bt=/(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/,Hr=RegExp(`${bt.source}${vn}`),vt=RegExp(`(?:[Tt]${Hr.source})?`),xn=/([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/,kn=/(\d{4})-?W(\d\d)(?:-?(\d))?/,Tn=/(\d{4})-?(\d{3})/,Sn=Br("weekYear","weekNumber","weekDay"),On=Br("year","ordinal"),En=/(\d{4})-(\d\d)-(\d\d)/,Yr=RegExp(`${bt.source} ?(?:${jr.source}|(${qr.source}))?`),In=RegExp(`(?: ${Yr.source})?`);function ne(r,e,t){const s=r[e];return y(s)?t:j(s)}function Nn(r,e){return[{year:ne(r,e),month:ne(r,e+1,1),day:ne(r,e+2,1)},null,e+3]}function ue(r,e){return[{hours:ne(r,e,0),minutes:ne(r,e+1,0),seconds:ne(r,e+2,0),milliseconds:pt(r[e+3])},null,e+4]}function xe(r,e){const t=!r[e]&&!r[e+1],s=Ue(r[e+1],r[e+2]),n=t?null:C.instance(s);return[{},n,e+3]}function ke(r,e){const t=r[e]?q.create(r[e]):null;return[{},t,e+1]}const Cn=RegExp(`^T?${bt.source}$`),Mn=/^-?P(?:(?:(-?\d{1,20}(?:\.\d{1,20})?)Y)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20}(?:\.\d{1,20})?)W)?(?:(-?\d{1,20}(?:\.\d{1,20})?)D)?(?:T(?:(-?\d{1,20}(?:\.\d{1,20})?)H)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,20}))?S)?)?)$/;function Dn(r){const[e,t,s,n,i,a,o,l,u]=r,c=e[0]==="-",f=l&&l[0]==="-",h=(d,w=!1)=>d!==void 0&&(w||d&&c)?-d:d;return[{years:h(_(t)),months:h(_(s)),weeks:h(_(n)),days:h(_(i)),hours:h(_(a)),minutes:h(_(o)),seconds:h(_(l),l==="-0"),milliseconds:h(pt(u),f)}]}const $n={GMT:0,EDT:-240,EST:-300,CDT:-300,CST:-360,MDT:-360,MST:-420,PDT:-420,PST:-480};function xt(r,e,t,s,n,i,a){const o={year:e.length===2?ft(j(e)):j(e),month:Vr.indexOf(t)+1,day:j(s),hour:j(n),minute:j(i)};return a&&(o.second=j(a)),r&&(o.weekday=r.length>3?Pr.indexOf(r)+1:Ur.indexOf(r)+1),o}const Fn=/^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;function Ln(r){const[,e,t,s,n,i,a,o,l,u,c,f]=r,h=xt(e,n,s,t,i,a,o);let d;return l?d=$n[l]:u?d=0:d=Ue(c,f),[h,new C(d)]}function An(r){return r.replace(/\([^()]*\)|[\n\t]/g," ").replace(/(\s\s+)/g," ").trim()}const Vn=/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/,Wn=/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/,Pn=/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;function Rt(r){const[,e,t,s,n,i,a,o]=r;return[xt(e,n,s,t,i,a,o),C.utcInstance]}function Un(r){const[,e,t,s,n,i,a,o]=r;return[xt(e,o,t,s,n,i,a),C.utcInstance]}const Rn=ae(xn,vt),Zn=ae(kn,vt),zn=ae(Tn,vt),qn=ae(Hr),_r=oe(Nn,ue,xe,ke),Bn=oe(Sn,ue,xe,ke),jn=oe(On,ue,xe,ke),Hn=oe(ue,xe,ke);function Yn(r){return le(r,[Rn,_r],[Zn,Bn],[zn,jn],[qn,Hn])}function _n(r){return le(An(r),[Fn,Ln])}function Gn(r){return le(r,[Vn,Rt],[Wn,Rt],[Pn,Un])}function Jn(r){return le(r,[Mn,Dn])}const Kn=oe(ue);function Qn(r){return le(r,[Cn,Kn])}const Xn=ae(En,In),ei=ae(Yr),ti=oe(ue,xe,ke);function ri(r){return le(r,[Xn,_r],[ei,ti])}const Zt="Invalid Duration",Gr={weeks:{days:7,hours:168,minutes:10080,seconds:10080*60,milliseconds:10080*60*1e3},days:{hours:24,minutes:1440,seconds:1440*60,milliseconds:1440*60*1e3},hours:{minutes:60,seconds:3600,milliseconds:3600*1e3},minutes:{seconds:60,milliseconds:60*1e3},seconds:{milliseconds:1e3}},si={years:{quarters:4,months:12,weeks:52,days:365,hours:365*24,minutes:365*24*60,seconds:365*24*60*60,milliseconds:365*24*60*60*1e3},quarters:{months:3,weeks:13,days:91,hours:2184,minutes:2184*60,seconds:2184*60*60,milliseconds:2184*60*60*1e3},months:{weeks:4,days:30,hours:720,minutes:720*60,seconds:720*60*60,milliseconds:720*60*60*1e3},...Gr},L=146097/400,X=146097/4800,ni={years:{quarters:4,months:12,weeks:L/7,days:L,hours:L*24,minutes:L*24*60,seconds:L*24*60*60,milliseconds:L*24*60*60*1e3},quarters:{months:3,weeks:L/28,days:L/4,hours:L*24/4,minutes:L*24*60/4,seconds:L*24*60*60/4,milliseconds:L*24*60*60*1e3/4},months:{weeks:X/7,days:X,hours:X*24,minutes:X*24*60,seconds:X*24*60*60,milliseconds:X*24*60*60*1e3},...Gr},J=["years","quarters","months","weeks","days","hours","minutes","seconds","milliseconds"],ii=J.slice(0).reverse();function Z(r,e,t=!1){const s={values:t?e.values:{...r.values,...e.values||{}},loc:r.loc.clone(e.loc),conversionAccuracy:e.conversionAccuracy||r.conversionAccuracy,matrix:e.matrix||r.matrix};return new b(s)}function Jr(r,e){let t=e.milliseconds??0;for(const s of ii.slice(1))e[s]&&(t+=e[s]*r[s].milliseconds);return t}function zt(r,e){const t=Jr(r,e)<0?-1:1;J.reduceRight((s,n)=>{if(y(e[n]))return s;if(s){const i=e[s]*t,a=r[n][s],o=Math.floor(i/a);e[n]+=o*t,e[s]-=o*a*t}return n},null),J.reduce((s,n)=>{if(y(e[n]))return s;if(s){const i=e[s]%1;e[s]-=i,e[n]+=i*r[s][n]}return n},null)}function qt(r){const e={};for(const[t,s]of Object.entries(r))s!==0&&(e[t]=s);return e}class b{constructor(e){const t=e.conversionAccuracy==="longterm"||!1;let s=t?ni:si;e.matrix&&(s=e.matrix),this.values=e.values,this.loc=e.loc||k.create(),this.conversionAccuracy=t?"longterm":"casual",this.invalid=e.invalid||null,this.matrix=s,this.isLuxonDuration=!0}static fromMillis(e,t){return b.fromObject({milliseconds:e},t)}static fromObject(e,t={}){if(e==null||typeof e!="object")throw new I(`Duration.fromObject: argument expected to be an object, got ${e===null?"null":typeof e}`);return new b({values:Ae(e,b.normalizeUnit),loc:k.fromObject(t),conversionAccuracy:t.conversionAccuracy,matrix:t.matrix})}static fromDurationLike(e){if(Y(e))return b.fromMillis(e);if(b.isDuration(e))return e;if(typeof e=="object")return b.fromObject(e);throw new I(`Unknown duration argument ${e} of type ${typeof e}`)}static fromISO(e,t){const[s]=Jn(e);return s?b.fromObject(s,t):b.invalid("unparsable",`the input "${e}" can't be parsed as ISO 8601`)}static fromISOTime(e,t){const[s]=Qn(e);return s?b.fromObject(s,t):b.invalid("unparsable",`the input "${e}" can't be parsed as ISO 8601`)}static invalid(e,t=null){if(!e)throw new I("need to specify a reason the Duration is invalid");const s=e instanceof U?e:new U(e,t);if(S.throwOnInvalid)throw new Ms(s);return new b({invalid:s})}static normalizeUnit(e){const t={year:"years",years:"years",quarter:"quarters",quarters:"quarters",month:"months",months:"months",week:"weeks",weeks:"weeks",day:"days",days:"days",hour:"hours",hours:"hours",minute:"minutes",minutes:"minutes",second:"seconds",seconds:"seconds",millisecond:"milliseconds",milliseconds:"milliseconds"}[e&&e.toLowerCase()];if(!t)throw new nr(e);return t}static isDuration(e){return e&&e.isLuxonDuration||!1}get locale(){return this.isValid?this.loc.locale:null}get numberingSystem(){return this.isValid?this.loc.numberingSystem:null}toFormat(e,t={}){const s={...t,floor:t.round!==!1&&t.floor!==!1};return this.isValid?N.create(this.loc,s).formatDurationFromString(this,e):Zt}toHuman(e={}){if(!this.isValid)return Zt;const t=e.showZeros!==!1,s=J.map(n=>{const i=this.values[n];return y(i)||i===0&&!t?null:this.loc.numberFormatter({style:"unit",unitDisplay:"long",...e,unit:n.slice(0,-1)}).format(i)}).filter(n=>n);return this.loc.listFormatter({type:"conjunction",style:e.listStyle||"narrow",...e}).format(s)}toObject(){return this.isValid?{...this.values}:{}}toISO(){if(!this.isValid)return null;let e="P";return this.years!==0&&(e+=this.years+"Y"),(this.months!==0||this.quarters!==0)&&(e+=this.months+this.quarters*3+"M"),this.weeks!==0&&(e+=this.weeks+"W"),this.days!==0&&(e+=this.days+"D"),(this.hours!==0||this.minutes!==0||this.seconds!==0||this.milliseconds!==0)&&(e+="T"),this.hours!==0&&(e+=this.hours+"H"),this.minutes!==0&&(e+=this.minutes+"M"),(this.seconds!==0||this.milliseconds!==0)&&(e+=wt(this.seconds+this.milliseconds/1e3,3)+"S"),e==="P"&&(e+="T0S"),e}toISOTime(e={}){if(!this.isValid)return null;const t=this.toMillis();return t<0||t>=864e5?null:(e={suppressMilliseconds:!1,suppressSeconds:!1,includePrefix:!1,format:"extended",...e,includeOffset:!1},g.fromMillis(t,{zone:"UTC"}).toISOTime(e))}toJSON(){return this.toISO()}toString(){return this.toISO()}[Symbol.for("nodejs.util.inspect.custom")](){return this.isValid?`Duration { values: ${JSON.stringify(this.values)} }`:`Duration { Invalid, reason: ${this.invalidReason} }`}toMillis(){return this.isValid?Jr(this.matrix,this.values):NaN}valueOf(){return this.toMillis()}plus(e){if(!this.isValid)return this;const t=b.fromDurationLike(e),s={};for(const n of J)(ie(t.values,n)||ie(this.values,n))&&(s[n]=t.get(n)+this.get(n));return Z(this,{values:s},!0)}minus(e){if(!this.isValid)return this;const t=b.fromDurationLike(e);return this.plus(t.negate())}mapUnits(e){if(!this.isValid)return this;const t={};for(const s of Object.keys(this.values))t[s]=Ar(e(this.values[s],s));return Z(this,{values:t},!0)}get(e){return this[b.normalizeUnit(e)]}set(e){if(!this.isValid)return this;const t={...this.values,...Ae(e,b.normalizeUnit)};return Z(this,{values:t})}reconfigure({locale:e,numberingSystem:t,conversionAccuracy:s,matrix:n}={}){const a={loc:this.loc.clone({locale:e,numberingSystem:t}),matrix:n,conversionAccuracy:s};return Z(this,a)}as(e){return this.isValid?this.shiftTo(e).get(e):NaN}normalize(){if(!this.isValid)return this;const e=this.toObject();return zt(this.matrix,e),Z(this,{values:e},!0)}rescale(){if(!this.isValid)return this;const e=qt(this.normalize().shiftToAll().toObject());return Z(this,{values:e},!0)}shiftTo(...e){if(!this.isValid)return this;if(e.length===0)return this;e=e.map(a=>b.normalizeUnit(a));const t={},s={},n=this.toObject();let i;for(const a of J)if(e.indexOf(a)>=0){i=a;let o=0;for(const u in s)o+=this.matrix[u][a]*s[u],s[u]=0;Y(n[a])&&(o+=n[a]);const l=Math.trunc(o);t[a]=l,s[a]=(o*1e3-l*1e3)/1e3}else Y(n[a])&&(s[a]=n[a]);for(const a in s)s[a]!==0&&(t[i]+=a===i?s[a]:s[a]/this.matrix[i][a]);return zt(this.matrix,t),Z(this,{values:t},!0)}shiftToAll(){return this.isValid?this.shiftTo("years","months","weeks","days","hours","minutes","seconds","milliseconds"):this}negate(){if(!this.isValid)return this;const e={};for(const t of Object.keys(this.values))e[t]=this.values[t]===0?0:-this.values[t];return Z(this,{values:e},!0)}removeZeros(){if(!this.isValid)return this;const e=qt(this.values);return Z(this,{values:e},!0)}get years(){return this.isValid?this.values.years||0:NaN}get quarters(){return this.isValid?this.values.quarters||0:NaN}get months(){return this.isValid?this.values.months||0:NaN}get weeks(){return this.isValid?this.values.weeks||0:NaN}get days(){return this.isValid?this.values.days||0:NaN}get hours(){return this.isValid?this.values.hours||0:NaN}get minutes(){return this.isValid?this.values.minutes||0:NaN}get seconds(){return this.isValid?this.values.seconds||0:NaN}get milliseconds(){return this.isValid?this.values.milliseconds||0:NaN}get isValid(){return this.invalid===null}get invalidReason(){return this.invalid?this.invalid.reason:null}get invalidExplanation(){return this.invalid?this.invalid.explanation:null}equals(e){if(!this.isValid||!e.isValid||!this.loc.equals(e.loc))return!1;function t(s,n){return s===void 0||s===0?n===void 0||n===0:s===n}for(const s of J)if(!t(this.values[s],e.values[s]))return!1;return!0}}const ee="Invalid Interval";function ai(r,e){return!r||!r.isValid?T.invalid("missing or invalid start"):!e||!e.isValid?T.invalid("missing or invalid end"):e<r?T.invalid("end before start",`The end of an interval must be after its start, but you had start=${r.toISO()} and end=${e.toISO()}`):null}class T{constructor(e){this.s=e.start,this.e=e.end,this.invalid=e.invalid||null,this.isLuxonInterval=!0}static invalid(e,t=null){if(!e)throw new I("need to specify a reason the Interval is invalid");const s=e instanceof U?e:new U(e,t);if(S.throwOnInvalid)throw new Cs(s);return new T({invalid:s})}static fromDateTimes(e,t){const s=fe(e),n=fe(t),i=ai(s,n);return i??new T({start:s,end:n})}static after(e,t){const s=b.fromDurationLike(t),n=fe(e);return T.fromDateTimes(n,n.plus(s))}static before(e,t){const s=b.fromDurationLike(t),n=fe(e);return T.fromDateTimes(n.minus(s),n)}static fromISO(e,t){const[s,n]=(e||"").split("/",2);if(s&&n){let i,a;try{i=g.fromISO(s,t),a=i.isValid}catch{a=!1}let o,l;try{o=g.fromISO(n,t),l=o.isValid}catch{l=!1}if(a&&l)return T.fromDateTimes(i,o);if(a){const u=b.fromISO(n,t);if(u.isValid)return T.after(i,u)}else if(l){const u=b.fromISO(s,t);if(u.isValid)return T.before(o,u)}}return T.invalid("unparsable",`the input "${e}" can't be parsed as ISO 8601`)}static isInterval(e){return e&&e.isLuxonInterval||!1}get start(){return this.isValid?this.s:null}get end(){return this.isValid?this.e:null}get lastDateTime(){return this.isValid&&this.e?this.e.minus(1):null}get isValid(){return this.invalidReason===null}get invalidReason(){return this.invalid?this.invalid.reason:null}get invalidExplanation(){return this.invalid?this.invalid.explanation:null}length(e="milliseconds"){return this.isValid?this.toDuration(e).get(e):NaN}count(e="milliseconds",t){if(!this.isValid)return NaN;const s=this.start.startOf(e,t);let n;return t?.useLocaleWeeks?n=this.end.reconfigure({locale:s.locale}):n=this.end,n=n.startOf(e,t),Math.floor(n.diff(s,e).get(e))+(n.valueOf()!==this.end.valueOf())}hasSame(e){return this.isValid?this.isEmpty()||this.e.minus(1).hasSame(this.s,e):!1}isEmpty(){return this.s.valueOf()===this.e.valueOf()}isAfter(e){return this.isValid?this.s>e:!1}isBefore(e){return this.isValid?this.e<=e:!1}contains(e){return this.isValid?this.s<=e&&this.e>e:!1}set({start:e,end:t}={}){return this.isValid?T.fromDateTimes(e||this.s,t||this.e):this}splitAt(...e){if(!this.isValid)return[];const t=e.map(fe).filter(a=>this.contains(a)).sort((a,o)=>a.toMillis()-o.toMillis()),s=[];let{s:n}=this,i=0;for(;n<this.e;){const a=t[i]||this.e,o=+a>+this.e?this.e:a;s.push(T.fromDateTimes(n,o)),n=o,i+=1}return s}splitBy(e){const t=b.fromDurationLike(e);if(!this.isValid||!t.isValid||t.as("milliseconds")===0)return[];let{s}=this,n=1,i;const a=[];for(;s<this.e;){const o=this.start.plus(t.mapUnits(l=>l*n));i=+o>+this.e?this.e:o,a.push(T.fromDateTimes(s,i)),s=i,n+=1}return a}divideEqually(e){return this.isValid?this.splitBy(this.length()/e).slice(0,e):[]}overlaps(e){return this.e>e.s&&this.s<e.e}abutsStart(e){return this.isValid?+this.e==+e.s:!1}abutsEnd(e){return this.isValid?+e.e==+this.s:!1}engulfs(e){return this.isValid?this.s<=e.s&&this.e>=e.e:!1}equals(e){return!this.isValid||!e.isValid?!1:this.s.equals(e.s)&&this.e.equals(e.e)}intersection(e){if(!this.isValid)return this;const t=this.s>e.s?this.s:e.s,s=this.e<e.e?this.e:e.e;return t>=s?null:T.fromDateTimes(t,s)}union(e){if(!this.isValid)return this;const t=this.s<e.s?this.s:e.s,s=this.e>e.e?this.e:e.e;return T.fromDateTimes(t,s)}static merge(e){const[t,s]=e.sort((n,i)=>n.s-i.s).reduce(([n,i],a)=>i?i.overlaps(a)||i.abutsStart(a)?[n,i.union(a)]:[n.concat([i]),a]:[n,a],[[],null]);return s&&t.push(s),t}static xor(e){let t=null,s=0;const n=[],i=e.map(l=>[{time:l.s,type:"s"},{time:l.e,type:"e"}]),a=Array.prototype.concat(...i),o=a.sort((l,u)=>l.time-u.time);for(const l of o)s+=l.type==="s"?1:-1,s===1?t=l.time:(t&&+t!=+l.time&&n.push(T.fromDateTimes(t,l.time)),t=null);return T.merge(n)}difference(...e){return T.xor([this].concat(e)).map(t=>this.intersection(t)).filter(t=>t&&!t.isEmpty())}toString(){return this.isValid?`[${this.s.toISO()} – ${this.e.toISO()})`:ee}[Symbol.for("nodejs.util.inspect.custom")](){return this.isValid?`Interval { start: ${this.s.toISO()}, end: ${this.e.toISO()} }`:`Interval { Invalid, reason: ${this.invalidReason} }`}toLocaleString(e=$e,t={}){return this.isValid?N.create(this.s.loc.clone(t),e).formatInterval(this):ee}toISO(e){return this.isValid?`${this.s.toISO(e)}/${this.e.toISO(e)}`:ee}toISODate(){return this.isValid?`${this.s.toISODate()}/${this.e.toISODate()}`:ee}toISOTime(e){return this.isValid?`${this.s.toISOTime(e)}/${this.e.toISOTime(e)}`:ee}toFormat(e,{separator:t=" – "}={}){return this.isValid?`${this.s.toFormat(e)}${t}${this.e.toFormat(e)}`:ee}toDuration(e,t){return this.isValid?this.e.diff(this.s,e,t):b.invalid(this.invalidReason)}mapEndpoints(e){return T.fromDateTimes(e(this.s),e(this.e))}}class Oe{static hasDST(e=S.defaultZone){const t=g.now().setZone(e).set({month:12});return!e.isUniversal&&t.offset!==t.set({month:6}).offset}static isValidIANAZone(e){return q.isValidZone(e)}static normalizeZone(e){return H(e,S.defaultZone)}static getStartOfWeek({locale:e=null,locObj:t=null}={}){return(t||k.create(e)).getStartOfWeek()}static getMinimumDaysInFirstWeek({locale:e=null,locObj:t=null}={}){return(t||k.create(e)).getMinDaysInFirstWeek()}static getWeekendWeekdays({locale:e=null,locObj:t=null}={}){return(t||k.create(e)).getWeekendDays().slice()}static months(e="long",{locale:t=null,numberingSystem:s=null,locObj:n=null,outputCalendar:i="gregory"}={}){return(n||k.create(t,s,i)).months(e)}static monthsFormat(e="long",{locale:t=null,numberingSystem:s=null,locObj:n=null,outputCalendar:i="gregory"}={}){return(n||k.create(t,s,i)).months(e,!0)}static weekdays(e="long",{locale:t=null,numberingSystem:s=null,locObj:n=null}={}){return(n||k.create(t,s,null)).weekdays(e)}static weekdaysFormat(e="long",{locale:t=null,numberingSystem:s=null,locObj:n=null}={}){return(n||k.create(t,s,null)).weekdays(e,!0)}static meridiems({locale:e=null}={}){return k.create(e).meridiems()}static eras(e="short",{locale:t=null}={}){return k.create(t,null,"gregory").eras(e)}static features(){return{relative:$r(),localeWeek:Fr()}}}function Bt(r,e){const t=n=>n.toUTC(0,{keepLocalTime:!0}).startOf("day").valueOf(),s=t(e)-t(r);return Math.floor(b.fromMillis(s).as("days"))}function oi(r,e,t){const s=[["years",(l,u)=>u.year-l.year],["quarters",(l,u)=>u.quarter-l.quarter+(u.year-l.year)*4],["months",(l,u)=>u.month-l.month+(u.year-l.year)*12],["weeks",(l,u)=>{const c=Bt(l,u);return(c-c%7)/7}],["days",Bt]],n={},i=r;let a,o;for(const[l,u]of s)t.indexOf(l)>=0&&(a=l,n[l]=u(r,e),o=i.plus(n),o>e?(n[l]--,r=i.plus(n),r>e&&(o=r,n[l]--,r=i.plus(n))):r=o);return[r,n,o,a]}function li(r,e,t,s){let[n,i,a,o]=oi(r,e,t);const l=e-n,u=t.filter(f=>["hours","minutes","seconds","milliseconds"].indexOf(f)>=0);u.length===0&&(a<e&&(a=n.plus({[o]:1})),a!==n&&(i[o]=(i[o]||0)+l/(a-n)));const c=b.fromObject(i,s);return u.length>0?b.fromMillis(l,s).shiftTo(...u).plus(c):c}const ui="missing Intl.DateTimeFormat.formatToParts support";function x(r,e=t=>t){return{regex:r,deser:([t])=>e(Qs(t))}}const ci=" ",Kr=`[ ${ci}]`,Qr=new RegExp(Kr,"g");function di(r){return r.replace(/\./g,"\\.?").replace(Qr,Kr)}function jt(r){return r.replace(/\./g,"").replace(Qr," ").toLowerCase()}function P(r,e){return r===null?null:{regex:RegExp(r.map(di).join("|")),deser:([t])=>r.findIndex(s=>jt(t)===jt(s))+e}}function Ht(r,e){return{regex:r,deser:([,t,s])=>Ue(t,s),groups:e}}function Ee(r){return{regex:r,deser:([e])=>e}}function fi(r){return r.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function mi(r,e){const t=W(e),s=W(e,"{2}"),n=W(e,"{3}"),i=W(e,"{4}"),a=W(e,"{6}"),o=W(e,"{1,2}"),l=W(e,"{1,3}"),u=W(e,"{1,6}"),c=W(e,"{1,9}"),f=W(e,"{2,4}"),h=W(e,"{4,6}"),d=E=>({regex:RegExp(fi(E.val)),deser:([M])=>M,literal:!0}),v=(E=>{if(r.literal)return d(E);switch(E.val){case"G":return P(e.eras("short"),0);case"GG":return P(e.eras("long"),0);case"y":return x(u);case"yy":return x(f,ft);case"yyyy":return x(i);case"yyyyy":return x(h);case"yyyyyy":return x(a);case"M":return x(o);case"MM":return x(s);case"MMM":return P(e.months("short",!0),1);case"MMMM":return P(e.months("long",!0),1);case"L":return x(o);case"LL":return x(s);case"LLL":return P(e.months("short",!1),1);case"LLLL":return P(e.months("long",!1),1);case"d":return x(o);case"dd":return x(s);case"o":return x(l);case"ooo":return x(n);case"HH":return x(s);case"H":return x(o);case"hh":return x(s);case"h":return x(o);case"mm":return x(s);case"m":return x(o);case"q":return x(o);case"qq":return x(s);case"s":return x(o);case"ss":return x(s);case"S":return x(l);case"SSS":return x(n);case"u":return Ee(c);case"uu":return Ee(o);case"uuu":return x(t);case"a":return P(e.meridiems(),0);case"kkkk":return x(i);case"kk":return x(f,ft);case"W":return x(o);case"WW":return x(s);case"E":case"c":return x(t);case"EEE":return P(e.weekdays("short",!1),1);case"EEEE":return P(e.weekdays("long",!1),1);case"ccc":return P(e.weekdays("short",!0),1);case"cccc":return P(e.weekdays("long",!0),1);case"Z":case"ZZ":return Ht(new RegExp(`([+-]${o.source})(?::(${s.source}))?`),2);case"ZZZ":return Ht(new RegExp(`([+-]${o.source})(${s.source})?`),2);case"z":return Ee(/[a-z_+-/]{1,256}?/i);case" ":return Ee(/[^\S\n\r]/);default:return d(E)}})(r)||{invalidReason:ui};return v.token=r,v}const hi={year:{"2-digit":"yy",numeric:"yyyyy"},month:{numeric:"M","2-digit":"MM",short:"MMM",long:"MMMM"},day:{numeric:"d","2-digit":"dd"},weekday:{short:"EEE",long:"EEEE"},dayperiod:"a",dayPeriod:"a",hour12:{numeric:"h","2-digit":"hh"},hour24:{numeric:"H","2-digit":"HH"},minute:{numeric:"m","2-digit":"mm"},second:{numeric:"s","2-digit":"ss"},timeZoneName:{long:"ZZZZZ",short:"ZZZ"}};function gi(r,e,t){const{type:s,value:n}=r;if(s==="literal"){const l=/^\s+$/.test(n);return{literal:!l,val:l?" ":n}}const i=e[s];let a=s;s==="hour"&&(e.hour12!=null?a=e.hour12?"hour12":"hour24":e.hourCycle!=null?e.hourCycle==="h11"||e.hourCycle==="h12"?a="hour12":a="hour24":a=t.hour12?"hour12":"hour24");let o=hi[a];if(typeof o=="object"&&(o=o[i]),o)return{literal:!1,val:o}}function yi(r){return[`^${r.map(t=>t.regex).reduce((t,s)=>`${t}(${s.source})`,"")}$`,r]}function pi(r,e,t){const s=r.match(e);if(s){const n={};let i=1;for(const a in t)if(ie(t,a)){const o=t[a],l=o.groups?o.groups+1:1;!o.literal&&o.token&&(n[o.token.val[0]]=o.deser(s.slice(i,i+l))),i+=l}return[s,n]}else return[s,{}]}function wi(r){const e=i=>{switch(i){case"S":return"millisecond";case"s":return"second";case"m":return"minute";case"h":case"H":return"hour";case"d":return"day";case"o":return"ordinal";case"L":case"M":return"month";case"y":return"year";case"E":case"c":return"weekday";case"W":return"weekNumber";case"k":return"weekYear";case"q":return"quarter";default:return null}};let t=null,s;return y(r.z)||(t=q.create(r.z)),y(r.Z)||(t||(t=new C(r.Z)),s=r.Z),y(r.q)||(r.M=(r.q-1)*3+1),y(r.h)||(r.h<12&&r.a===1?r.h+=12:r.h===12&&r.a===0&&(r.h=0)),r.G===0&&r.y&&(r.y=-r.y),y(r.u)||(r.S=pt(r.u)),[Object.keys(r).reduce((i,a)=>{const o=e(a);return o&&(i[o]=r[a]),i},{}),t,s]}let Ye=null;function bi(){return Ye||(Ye=g.fromMillis(1555555555555)),Ye}function vi(r,e){if(r.literal)return r;const t=N.macroTokenToFormatOpts(r.val),s=rs(t,e);return s==null||s.includes(void 0)?r:s}function Xr(r,e){return Array.prototype.concat(...r.map(t=>vi(t,e)))}class es{constructor(e,t){if(this.locale=e,this.format=t,this.tokens=Xr(N.parseFormat(t),e),this.units=this.tokens.map(s=>mi(s,e)),this.disqualifyingUnit=this.units.find(s=>s.invalidReason),!this.disqualifyingUnit){const[s,n]=yi(this.units);this.regex=RegExp(s,"i"),this.handlers=n}}explainFromTokens(e){if(this.isValid){const[t,s]=pi(e,this.regex,this.handlers),[n,i,a]=s?wi(s):[null,null,void 0];if(ie(s,"a")&&ie(s,"H"))throw new re("Can't include meridiem when specifying 24-hour format");return{input:e,tokens:this.tokens,regex:this.regex,rawMatches:t,matches:s,result:n,zone:i,specificOffset:a}}else return{input:e,tokens:this.tokens,invalidReason:this.invalidReason}}get isValid(){return!this.disqualifyingUnit}get invalidReason(){return this.disqualifyingUnit?this.disqualifyingUnit.invalidReason:null}}function ts(r,e,t){return new es(r,t).explainFromTokens(e)}function xi(r,e,t){const{result:s,zone:n,specificOffset:i,invalidReason:a}=ts(r,e,t);return[s,n,i,a]}function rs(r,e){if(!r)return null;const s=N.create(e,r).dtFormatter(bi()),n=s.formatToParts(),i=s.resolvedOptions();return n.map(a=>gi(a,r,i))}const _e="Invalid DateTime",Yt=864e13;function he(r){return new U("unsupported zone",`the zone "${r.name}" is not supported`)}function Ge(r){return r.weekData===null&&(r.weekData=Fe(r.c)),r.weekData}function Je(r){return r.localWeekData===null&&(r.localWeekData=Fe(r.c,r.loc.getMinDaysInFirstWeek(),r.loc.getStartOfWeek())),r.localWeekData}function G(r,e){const t={ts:r.ts,zone:r.zone,c:r.c,o:r.o,loc:r.loc,invalid:r.invalid};return new g({...t,...e,old:t})}function ss(r,e,t){let s=r-e*60*1e3;const n=t.offset(s);if(e===n)return[s,e];s-=(n-e)*60*1e3;const i=t.offset(s);return n===i?[s,n]:[r-Math.min(n,i)*60*1e3,Math.max(n,i)]}function Ie(r,e){r+=e*60*1e3;const t=new Date(r);return{year:t.getUTCFullYear(),month:t.getUTCMonth()+1,day:t.getUTCDate(),hour:t.getUTCHours(),minute:t.getUTCMinutes(),second:t.getUTCSeconds(),millisecond:t.getUTCMilliseconds()}}function Ce(r,e,t){return ss(Pe(r),e,t)}function _t(r,e){const t=r.o,s=r.c.year+Math.trunc(e.years),n=r.c.month+Math.trunc(e.months)+Math.trunc(e.quarters)*3,i={...r.c,year:s,month:n,day:Math.min(r.c.day,Le(s,n))+Math.trunc(e.days)+Math.trunc(e.weeks)*7},a=b.fromObject({years:e.years-Math.trunc(e.years),quarters:e.quarters-Math.trunc(e.quarters),months:e.months-Math.trunc(e.months),weeks:e.weeks-Math.trunc(e.weeks),days:e.days-Math.trunc(e.days),hours:e.hours,minutes:e.minutes,seconds:e.seconds,milliseconds:e.milliseconds}).as("milliseconds"),o=Pe(i);let[l,u]=ss(o,t,r.zone);return a!==0&&(l+=a,u=r.zone.offset(l)),{ts:l,o:u}}function te(r,e,t,s,n,i){const{setZone:a,zone:o}=t;if(r&&Object.keys(r).length!==0||e){const l=e||o,u=g.fromObject(r,{...t,zone:l,specificOffset:i});return a?u:u.setZone(o)}else return g.invalid(new U("unparsable",`the input "${n}" can't be parsed as ${s}`))}function Ne(r,e,t=!0){return r.isValid?N.create(k.create("en-US"),{allowZ:t,forceSimple:!0}).formatDateTimeFromString(r,e):null}function Ke(r,e,t){const s=r.c.year>9999||r.c.year<0;let n="";if(s&&r.c.year>=0&&(n+="+"),n+=O(r.c.year,s?6:4),t==="year")return n;if(e){if(n+="-",n+=O(r.c.month),t==="month")return n;n+="-"}else if(n+=O(r.c.month),t==="month")return n;return n+=O(r.c.day),n}function Gt(r,e,t,s,n,i,a){let o=!t||r.c.millisecond!==0||r.c.second!==0,l="";switch(a){case"day":case"month":case"year":break;default:if(l+=O(r.c.hour),a==="hour")break;if(e){if(l+=":",l+=O(r.c.minute),a==="minute")break;o&&(l+=":",l+=O(r.c.second))}else{if(l+=O(r.c.minute),a==="minute")break;o&&(l+=O(r.c.second))}if(a==="second")break;o&&(!s||r.c.millisecond!==0)&&(l+=".",l+=O(r.c.millisecond,3))}return n&&(r.isOffsetFixed&&r.offset===0&&!i?l+="Z":r.o<0?(l+="-",l+=O(Math.trunc(-r.o/60)),l+=":",l+=O(Math.trunc(-r.o%60))):(l+="+",l+=O(Math.trunc(r.o/60)),l+=":",l+=O(Math.trunc(r.o%60)))),i&&(l+="["+r.zone.ianaName+"]"),l}const ns={month:1,day:1,hour:0,minute:0,second:0,millisecond:0},ki={weekNumber:1,weekday:1,hour:0,minute:0,second:0,millisecond:0},Ti={ordinal:1,hour:0,minute:0,second:0,millisecond:0},Me=["year","month","day","hour","minute","second","millisecond"],Si=["weekYear","weekNumber","weekday","hour","minute","second","millisecond"],Oi=["year","ordinal","hour","minute","second","millisecond"];function De(r){const e={year:"year",years:"year",month:"month",months:"month",day:"day",days:"day",hour:"hour",hours:"hour",minute:"minute",minutes:"minute",quarter:"quarter",quarters:"quarter",second:"second",seconds:"second",millisecond:"millisecond",milliseconds:"millisecond",weekday:"weekday",weekdays:"weekday",weeknumber:"weekNumber",weeksnumber:"weekNumber",weeknumbers:"weekNumber",weekyear:"weekYear",weekyears:"weekYear",ordinal:"ordinal"}[r.toLowerCase()];if(!e)throw new nr(r);return e}function Jt(r){switch(r.toLowerCase()){case"localweekday":case"localweekdays":return"localWeekday";case"localweeknumber":case"localweeknumbers":return"localWeekNumber";case"localweekyear":case"localweekyears":return"localWeekYear";default:return De(r)}}function Ei(r){if(ge===void 0&&(ge=S.now()),r.type!=="iana")return r.offset(ge);const e=r.name;let t=mt.get(e);return t===void 0&&(t=r.offset(ge),mt.set(e,t)),t}function Kt(r,e){const t=H(e.zone,S.defaultZone);if(!t.isValid)return g.invalid(he(t));const s=k.fromObject(e);let n,i;if(y(r.year))n=S.now();else{for(const l of Me)y(r[l])&&(r[l]=ns[l]);const a=Mr(r)||Dr(r);if(a)return g.invalid(a);const o=Ei(t);[n,i]=Ce(r,o,t)}return new g({ts:n,zone:t,loc:s,o:i})}function Qt(r,e,t){const s=y(t.round)?!0:t.round,n=y(t.rounding)?"trunc":t.rounding,i=(o,l)=>(o=wt(o,s||t.calendary?0:2,t.calendary?"round":n),e.loc.clone(t).relFormatter(t).format(o,l)),a=o=>t.calendary?e.hasSame(r,o)?0:e.startOf(o).diff(r.startOf(o),o).get(o):e.diff(r,o).get(o);if(t.unit)return i(a(t.unit),t.unit);for(const o of t.units){const l=a(o);if(Math.abs(l)>=1)return i(l,o)}return i(r>e?-0:0,t.units[t.units.length-1])}function Xt(r){let e={},t;return r.length>0&&typeof r[r.length-1]=="object"?(e=r[r.length-1],t=Array.from(r).slice(0,r.length-1)):t=Array.from(r),[e,t]}let ge;const mt=new Map;class g{constructor(e){const t=e.zone||S.defaultZone;let s=e.invalid||(Number.isNaN(e.ts)?new U("invalid input"):null)||(t.isValid?null:he(t));this.ts=y(e.ts)?S.now():e.ts;let n=null,i=null;if(!s)if(e.old&&e.old.ts===this.ts&&e.old.zone.equals(t))[n,i]=[e.old.c,e.old.o];else{const o=Y(e.o)&&!e.old?e.o:t.offset(this.ts);n=Ie(this.ts,o),s=Number.isNaN(n.year)?new U("invalid input"):null,n=s?null:n,i=s?null:o}this._zone=t,this.loc=e.loc||k.create(),this.invalid=s,this.weekData=null,this.localWeekData=null,this.c=n,this.o=i,this.isLuxonDateTime=!0}static now(){return new g({})}static local(){const[e,t]=Xt(arguments),[s,n,i,a,o,l,u]=t;return Kt({year:s,month:n,day:i,hour:a,minute:o,second:l,millisecond:u},e)}static utc(){const[e,t]=Xt(arguments),[s,n,i,a,o,l,u]=t;return e.zone=C.utcInstance,Kt({year:s,month:n,day:i,hour:a,minute:o,second:l,millisecond:u},e)}static fromJSDate(e,t={}){const s=sn(e)?e.valueOf():NaN;if(Number.isNaN(s))return g.invalid("invalid input");const n=H(t.zone,S.defaultZone);return n.isValid?new g({ts:s,zone:n,loc:k.fromObject(t)}):g.invalid(he(n))}static fromMillis(e,t={}){if(Y(e))return e<-Yt||e>Yt?g.invalid("Timestamp out of range"):new g({ts:e,zone:H(t.zone,S.defaultZone),loc:k.fromObject(t)});throw new I(`fromMillis requires a numerical input, but received a ${typeof e} with value ${e}`)}static fromSeconds(e,t={}){if(Y(e))return new g({ts:e*1e3,zone:H(t.zone,S.defaultZone),loc:k.fromObject(t)});throw new I("fromSeconds requires a numerical input")}static fromObject(e,t={}){e=e||{};const s=H(t.zone,S.defaultZone);if(!s.isValid)return g.invalid(he(s));const n=k.fromObject(t),i=Ae(e,Jt),{minDaysInFirstWeek:a,startOfWeek:o}=Vt(i,n),l=S.now(),u=y(t.specificOffset)?s.offset(l):t.specificOffset,c=!y(i.ordinal),f=!y(i.year),h=!y(i.month)||!y(i.day),d=f||h,w=i.weekYear||i.weekNumber;if((d||c)&&w)throw new re("Can't mix weekYear/weekNumber units with year/month/day or ordinals");if(h&&c)throw new re("Can't mix ordinal dates with month/day");const v=w||i.weekday&&!d;let E,M,F=Ie(l,u);v?(E=Si,M=ki,F=Fe(F,a,o)):c?(E=Oi,M=Ti,F=He(F)):(E=Me,M=ns);let Te=!1;for(const de of E){const ds=i[de];y(ds)?Te?i[de]=M[de]:i[de]=F[de]:Te=!0}const Ze=v?en(i,a,o):c?tn(i):Mr(i),Tt=Ze||Dr(i);if(Tt)return g.invalid(Tt);const ls=v?Lt(i,a,o):c?At(i):i,[us,cs]=Ce(ls,u,s),ce=new g({ts:us,zone:s,o:cs,loc:n});return i.weekday&&d&&e.weekday!==ce.weekday?g.invalid("mismatched weekday",`you can't specify both a weekday of ${i.weekday} and a date of ${ce.toISO()}`):ce.isValid?ce:g.invalid(ce.invalid)}static fromISO(e,t={}){const[s,n]=Yn(e);return te(s,n,t,"ISO 8601",e)}static fromRFC2822(e,t={}){const[s,n]=_n(e);return te(s,n,t,"RFC 2822",e)}static fromHTTP(e,t={}){const[s,n]=Gn(e);return te(s,n,t,"HTTP",t)}static fromFormat(e,t,s={}){if(y(e)||y(t))throw new I("fromFormat requires an input string and a format");const{locale:n=null,numberingSystem:i=null}=s,a=k.fromOpts({locale:n,numberingSystem:i,defaultToEN:!0}),[o,l,u,c]=xi(a,e,t);return c?g.invalid(c):te(o,l,s,`format ${t}`,e,u)}static fromString(e,t,s={}){return g.fromFormat(e,t,s)}static fromSQL(e,t={}){const[s,n]=ri(e);return te(s,n,t,"SQL",e)}static invalid(e,t=null){if(!e)throw new I("need to specify a reason the DateTime is invalid");const s=e instanceof U?e:new U(e,t);if(S.throwOnInvalid)throw new Ns(s);return new g({invalid:s})}static isDateTime(e){return e&&e.isLuxonDateTime||!1}static parseFormatForOpts(e,t={}){const s=rs(e,k.fromObject(t));return s?s.map(n=>n?n.val:null).join(""):null}static expandFormat(e,t={}){return Xr(N.parseFormat(e),k.fromObject(t)).map(n=>n.val).join("")}static resetCache(){ge=void 0,mt.clear()}get(e){return this[e]}get isValid(){return this.invalid===null}get invalidReason(){return this.invalid?this.invalid.reason:null}get invalidExplanation(){return this.invalid?this.invalid.explanation:null}get locale(){return this.isValid?this.loc.locale:null}get numberingSystem(){return this.isValid?this.loc.numberingSystem:null}get outputCalendar(){return this.isValid?this.loc.outputCalendar:null}get zone(){return this._zone}get zoneName(){return this.isValid?this.zone.name:null}get year(){return this.isValid?this.c.year:NaN}get quarter(){return this.isValid?Math.ceil(this.c.month/3):NaN}get month(){return this.isValid?this.c.month:NaN}get day(){return this.isValid?this.c.day:NaN}get hour(){return this.isValid?this.c.hour:NaN}get minute(){return this.isValid?this.c.minute:NaN}get second(){return this.isValid?this.c.second:NaN}get millisecond(){return this.isValid?this.c.millisecond:NaN}get weekYear(){return this.isValid?Ge(this).weekYear:NaN}get weekNumber(){return this.isValid?Ge(this).weekNumber:NaN}get weekday(){return this.isValid?Ge(this).weekday:NaN}get isWeekend(){return this.isValid&&this.loc.getWeekendDays().includes(this.weekday)}get localWeekday(){return this.isValid?Je(this).weekday:NaN}get localWeekNumber(){return this.isValid?Je(this).weekNumber:NaN}get localWeekYear(){return this.isValid?Je(this).weekYear:NaN}get ordinal(){return this.isValid?He(this.c).ordinal:NaN}get monthShort(){return this.isValid?Oe.months("short",{locObj:this.loc})[this.month-1]:null}get monthLong(){return this.isValid?Oe.months("long",{locObj:this.loc})[this.month-1]:null}get weekdayShort(){return this.isValid?Oe.weekdays("short",{locObj:this.loc})[this.weekday-1]:null}get weekdayLong(){return this.isValid?Oe.weekdays("long",{locObj:this.loc})[this.weekday-1]:null}get offset(){return this.isValid?+this.o:NaN}get offsetNameShort(){return this.isValid?this.zone.offsetName(this.ts,{format:"short",locale:this.locale}):null}get offsetNameLong(){return this.isValid?this.zone.offsetName(this.ts,{format:"long",locale:this.locale}):null}get isOffsetFixed(){return this.isValid?this.zone.isUniversal:null}get isInDST(){return this.isOffsetFixed?!1:this.offset>this.set({month:1,day:1}).offset||this.offset>this.set({month:5}).offset}getPossibleOffsets(){if(!this.isValid||this.isOffsetFixed)return[this];const e=864e5,t=6e4,s=Pe(this.c),n=this.zone.offset(s-e),i=this.zone.offset(s+e),a=this.zone.offset(s-n*t),o=this.zone.offset(s-i*t);if(a===o)return[this];const l=s-a*t,u=s-o*t,c=Ie(l,a),f=Ie(u,o);return c.hour===f.hour&&c.minute===f.minute&&c.second===f.second&&c.millisecond===f.millisecond?[G(this,{ts:l}),G(this,{ts:u})]:[this]}get isInLeapYear(){return ve(this.year)}get daysInMonth(){return Le(this.year,this.month)}get daysInYear(){return this.isValid?se(this.year):NaN}get weeksInWeekYear(){return this.isValid?pe(this.weekYear):NaN}get weeksInLocalWeekYear(){return this.isValid?pe(this.localWeekYear,this.loc.getMinDaysInFirstWeek(),this.loc.getStartOfWeek()):NaN}resolvedLocaleOptions(e={}){const{locale:t,numberingSystem:s,calendar:n}=N.create(this.loc.clone(e),e).resolvedOptions(this);return{locale:t,numberingSystem:s,outputCalendar:n}}toUTC(e=0,t={}){return this.setZone(C.instance(e),t)}toLocal(){return this.setZone(S.defaultZone)}setZone(e,{keepLocalTime:t=!1,keepCalendarTime:s=!1}={}){if(e=H(e,S.defaultZone),e.equals(this.zone))return this;if(e.isValid){let n=this.ts;if(t||s){const i=e.offset(this.ts),a=this.toObject();[n]=Ce(a,i,e)}return G(this,{ts:n,zone:e})}else return g.invalid(he(e))}reconfigure({locale:e,numberingSystem:t,outputCalendar:s}={}){const n=this.loc.clone({locale:e,numberingSystem:t,outputCalendar:s});return G(this,{loc:n})}setLocale(e){return this.reconfigure({locale:e})}set(e){if(!this.isValid)return this;const t=Ae(e,Jt),{minDaysInFirstWeek:s,startOfWeek:n}=Vt(t,this.loc),i=!y(t.weekYear)||!y(t.weekNumber)||!y(t.weekday),a=!y(t.ordinal),o=!y(t.year),l=!y(t.month)||!y(t.day),u=o||l,c=t.weekYear||t.weekNumber;if((u||a)&&c)throw new re("Can't mix weekYear/weekNumber units with year/month/day or ordinals");if(l&&a)throw new re("Can't mix ordinal dates with month/day");let f;i?f=Lt({...Fe(this.c,s,n),...t},s,n):y(t.ordinal)?(f={...this.toObject(),...t},y(t.day)&&(f.day=Math.min(Le(f.year,f.month),f.day))):f=At({...He(this.c),...t});const[h,d]=Ce(f,this.o,this.zone);return G(this,{ts:h,o:d})}plus(e){if(!this.isValid)return this;const t=b.fromDurationLike(e);return G(this,_t(this,t))}minus(e){if(!this.isValid)return this;const t=b.fromDurationLike(e).negate();return G(this,_t(this,t))}startOf(e,{useLocaleWeeks:t=!1}={}){if(!this.isValid)return this;const s={},n=b.normalizeUnit(e);switch(n){case"years":s.month=1;case"quarters":case"months":s.day=1;case"weeks":case"days":s.hour=0;case"hours":s.minute=0;case"minutes":s.second=0;case"seconds":s.millisecond=0;break}if(n==="weeks")if(t){const i=this.loc.getStartOfWeek(),{weekday:a}=this;a<i&&(s.weekNumber=this.weekNumber-1),s.weekday=i}else s.weekday=1;if(n==="quarters"){const i=Math.ceil(this.month/3);s.month=(i-1)*3+1}return this.set(s)}endOf(e,t){return this.isValid?this.plus({[e]:1}).startOf(e,t).minus(1):this}toFormat(e,t={}){return this.isValid?N.create(this.loc.redefaultToEN(t)).formatDateTimeFromString(this,e):_e}toLocaleString(e=$e,t={}){return this.isValid?N.create(this.loc.clone(t),e).formatDateTime(this):_e}toLocaleParts(e={}){return this.isValid?N.create(this.loc.clone(e),e).formatDateTimeParts(this):[]}toISO({format:e="extended",suppressSeconds:t=!1,suppressMilliseconds:s=!1,includeOffset:n=!0,extendedZone:i=!1,precision:a="milliseconds"}={}){if(!this.isValid)return null;a=De(a);const o=e==="extended";let l=Ke(this,o,a);return Me.indexOf(a)>=3&&(l+="T"),l+=Gt(this,o,t,s,n,i,a),l}toISODate({format:e="extended",precision:t="day"}={}){return this.isValid?Ke(this,e==="extended",De(t)):null}toISOWeekDate(){return Ne(this,"kkkk-'W'WW-c")}toISOTime({suppressMilliseconds:e=!1,suppressSeconds:t=!1,includeOffset:s=!0,includePrefix:n=!1,extendedZone:i=!1,format:a="extended",precision:o="milliseconds"}={}){return this.isValid?(o=De(o),(n&&Me.indexOf(o)>=3?"T":"")+Gt(this,a==="extended",t,e,s,i,o)):null}toRFC2822(){return Ne(this,"EEE, dd LLL yyyy HH:mm:ss ZZZ",!1)}toHTTP(){return Ne(this.toUTC(),"EEE, dd LLL yyyy HH:mm:ss 'GMT'")}toSQLDate(){return this.isValid?Ke(this,!0):null}toSQLTime({includeOffset:e=!0,includeZone:t=!1,includeOffsetSpace:s=!0}={}){let n="HH:mm:ss.SSS";return(t||e)&&(s&&(n+=" "),t?n+="z":e&&(n+="ZZ")),Ne(this,n,!0)}toSQL(e={}){return this.isValid?`${this.toSQLDate()} ${this.toSQLTime(e)}`:null}toString(){return this.isValid?this.toISO():_e}[Symbol.for("nodejs.util.inspect.custom")](){return this.isValid?`DateTime { ts: ${this.toISO()}, zone: ${this.zone.name}, locale: ${this.locale} }`:`DateTime { Invalid, reason: ${this.invalidReason} }`}valueOf(){return this.toMillis()}toMillis(){return this.isValid?this.ts:NaN}toSeconds(){return this.isValid?this.ts/1e3:NaN}toUnixInteger(){return this.isValid?Math.floor(this.ts/1e3):NaN}toJSON(){return this.toISO()}toBSON(){return this.toJSDate()}toObject(e={}){if(!this.isValid)return{};const t={...this.c};return e.includeConfig&&(t.outputCalendar=this.outputCalendar,t.numberingSystem=this.loc.numberingSystem,t.locale=this.loc.locale),t}toJSDate(){return new Date(this.isValid?this.ts:NaN)}diff(e,t="milliseconds",s={}){if(!this.isValid||!e.isValid)return b.invalid("created by diffing an invalid DateTime");const n={locale:this.locale,numberingSystem:this.numberingSystem,...s},i=nn(t).map(b.normalizeUnit),a=e.valueOf()>this.valueOf(),o=a?this:e,l=a?e:this,u=li(o,l,i,n);return a?u.negate():u}diffNow(e="milliseconds",t={}){return this.diff(g.now(),e,t)}until(e){return this.isValid?T.fromDateTimes(this,e):this}hasSame(e,t,s){if(!this.isValid)return!1;const n=e.valueOf(),i=this.setZone(e.zone,{keepLocalTime:!0});return i.startOf(t,s)<=n&&n<=i.endOf(t,s)}equals(e){return this.isValid&&e.isValid&&this.valueOf()===e.valueOf()&&this.zone.equals(e.zone)&&this.loc.equals(e.loc)}toRelative(e={}){if(!this.isValid)return null;const t=e.base||g.fromObject({},{zone:this.zone}),s=e.padding?this<t?-e.padding:e.padding:0;let n=["years","months","days","hours","minutes","seconds"],i=e.unit;return Array.isArray(e.unit)&&(n=e.unit,i=void 0),Qt(t,this.plus(s),{...e,numeric:"always",units:n,unit:i})}toRelativeCalendar(e={}){return this.isValid?Qt(e.base||g.fromObject({},{zone:this.zone}),this,{...e,numeric:"auto",units:["years","months","days"],calendary:!0}):null}static min(...e){if(!e.every(g.isDateTime))throw new I("min requires all arguments be DateTimes");return Wt(e,t=>t.valueOf(),Math.min)}static max(...e){if(!e.every(g.isDateTime))throw new I("max requires all arguments be DateTimes");return Wt(e,t=>t.valueOf(),Math.max)}static fromFormatExplain(e,t,s={}){const{locale:n=null,numberingSystem:i=null}=s,a=k.fromOpts({locale:n,numberingSystem:i,defaultToEN:!0});return ts(a,e,t)}static fromStringExplain(e,t,s={}){return g.fromFormatExplain(e,t,s)}static buildFormatParser(e,t={}){const{locale:s=null,numberingSystem:n=null}=t,i=k.fromOpts({locale:s,numberingSystem:n,defaultToEN:!0});return new es(i,e)}static fromFormatParser(e,t,s={}){if(y(e)||y(t))throw new I("fromFormatParser requires an input string and a format parser");const{locale:n=null,numberingSystem:i=null}=s,a=k.fromOpts({locale:n,numberingSystem:i,defaultToEN:!0});if(!a.equals(t.locale))throw new I(`fromFormatParser called with a locale of ${a}, but the format parser was created for ${t.locale}`);const{result:o,zone:l,specificOffset:u,invalidReason:c}=t.explainFromTokens(e);return c?g.invalid(c):te(o,l,s,`format ${t.format}`,e,u)}static get DATE_SHORT(){return $e}static get DATE_MED(){return ir}static get DATE_MED_WITH_WEEKDAY(){return Ds}static get DATE_FULL(){return ar}static get DATE_HUGE(){return or}static get TIME_SIMPLE(){return lr}static get TIME_WITH_SECONDS(){return ur}static get TIME_WITH_SHORT_OFFSET(){return cr}static get TIME_WITH_LONG_OFFSET(){return dr}static get TIME_24_SIMPLE(){return fr}static get TIME_24_WITH_SECONDS(){return mr}static get TIME_24_WITH_SHORT_OFFSET(){return hr}static get TIME_24_WITH_LONG_OFFSET(){return gr}static get DATETIME_SHORT(){return yr}static get DATETIME_SHORT_WITH_SECONDS(){return pr}static get DATETIME_MED(){return wr}static get DATETIME_MED_WITH_SECONDS(){return br}static get DATETIME_MED_WITH_WEEKDAY(){return $s}static get DATETIME_FULL(){return vr}static get DATETIME_FULL_WITH_SECONDS(){return xr}static get DATETIME_HUGE(){return kr}static get DATETIME_HUGE_WITH_SECONDS(){return Tr}}function fe(r){if(g.isDateTime(r))return r;if(r&&r.valueOf&&Y(r.valueOf()))return g.fromJSDate(r);if(r&&typeof r=="object")return g.fromObject(r);throw new I(`Unknown datetime argument: ${r}, of type ${typeof r}`)}function Ii({id:r,body:e="The post you are looking for does not exist",tags:t=[],title:s="No title available",userId:n=0,createdAt:i=new Date().toISOString(),media:a={url:"",alt:""},isFollowing:o=!1,_count:l={reactions:0,comments:0},isLiked:u=!1},c=0){const f=`@user${n}`,h=l?.reactions??0,d=l?.comments??0,w=g.fromISO(i).toRelative({locale:"en"})||"just now",v=`/post/${r}`,E=o?"Unfollow":"Follow",M=o?"bg-red-500 hover:bg-red-600":"bg-blue-500 hover:bg-blue-600",F=c>0?`animate__delay-${c}s`:"",Te=u?"text-pink-600 animate__animated animate__heartBeat":"text-pink-500";return`
  <article 
    class="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden mb-6 flex flex-col h-[400px] animate__animated animate__fadeInUp ${F}" 
    data-postid="${r}" 
    data-authorid="${n}"
    data-component="postCard"
  >
    <!-- Header: Avatar & Author Info -->
    <div class="flex items-center px-4 pt-4 justify-between">
      <div class="flex items-center">
        <div class="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center mr-3">
          <img 
            src="https://i.pravatar.cc/100?u=${n}" 
            alt="${f}'s avatar" 
            class="w-full h-full object-cover" 
          />
        </div>
        <div>
          <span class="font-semibold text-gray-800">${f}</span>
          <span class="block text-xs text-gray-400">${w}</span>
        </div>
      </div>

      <!-- Follow / Unfollow Button -->
      <button
        class="follow-btn text-white cursor-pointer px-3 py-1 rounded ${M} text-sm font-semibold transition-colors"
        data-authorid="${n}"
        aria-label="${E} ${f}"
      >
        ${E}
      </button>
    </div>

    <!-- Body: Title, Image, Body, Tags -->
    <div class="px-4 py-2 flex-grow overflow-y-auto">
      <h2 class="text-lg font-bold text-gray-800 mb-2">${s}</h2>

      ${a?.url?`
          <div class="mb-3">
            <img 
              src="${a.url}" 
              alt="${a.alt||"Post image"}" 
              class="w-full h-auto rounded" 
            />
          </div>
        `:""}

      <p class="text-gray-900 text-base mb-3">${e}</p>

      ${t?.length?`
        <div class="flex flex-wrap gap-2 mb-3">
          ${t.map(Ze=>`<span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">#${Ze}</span>`).join("")}
        </div>
      `:""}
    </div>

    <!-- Footer: Like Button & Comments count -->
    <div class="px-4 pb-4 flex items-center justify-between">
      <button 
        class="like-btn flex items-center ${Te} hover:text-pink-600 transition-colors" 
        data-postid="${r}"
        aria-pressed="${u}"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          class="w-5 h-5 mr-1"
        >
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
        </svg>
        <span class="font-semibold like-count">${h}</span>
      </button>

      <div class="flex items-center text-gray-600 text-sm">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          viewBox="0 0 24 24" 
          class="w-5 h-5 mr-1"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-8l-4 4v-4H7a2 2 0 01-2-2v-2"/>
        </svg>
        <span>${d}</span>
      </div>

      <a href="${v}" data-link class="text-blue-500 text-m hover:underline pt-2 ml-4">View details</a>
    </div>
  </article>
  `}const Ni="/posts";async function is(){const r=await vs(Ni);return{...r,data:r.data.filter(t=>t.media&&typeof t.media.url=="string"&&t.media.url.trim()!=="")}}async function Ci(){let r=[];try{const e=await is();Array.isArray(e)?r=e:e?.data&&Array.isArray(e.data)?r=e.data:console.warn("Unexpected result from getAllPosts:",e)}catch(e){console.error("Error loading posts:",e)}return`
   <div class="container fixed grid min-w-full grid-cols-5 min-h-dvh bg-gray-900">

      <!-- MOBILE NAV (bottom) -->
      <div
        class="aside fixed bottom-0 right-0 left-0 z-30 flex justify-evenly items-center gap-5 h-15 w-full border-r-1 bg-blue-950 border-gray-300 bg-bg-light lg:hidden">
        
        <a href="/feed" class="flex items-center w-12 h-12 pl-2" title="Home / Feed">
          <img src="/public/logo.png" alt="Logo">
        </a>

        <a href="/feed" class="flex items-center hover:text-darkOrange" title="Feed">
          <i class="text-xl text-gray-200 cursor-pointer fa-solid fa-house-user"></i>
          <span class="text-xl cursor-pointer ps-4"></span>
        </a>

        <a href="/profile" class="flex items-center hover:text-darkOrange" title="Profile">
          <i class="text-xl text-gray-200 cursor-pointer fa-solid fa-user"></i>
          <span class="text-xl cursor-pointer ps-4"></span>
        </a>

        <a href="/create" class="flex items-center hover:text-darkOrange" title="Create">
          <i class="text-xl text-gray-200 cursor-pointer fa fa-camera"></i>
          <span class="text-xl cursor-pointer ps-4"></span>
        </a>

        <a href="/more" class="flex items-center hover:text-darkOrange" title="More">
          <i class="text-xl text-gray-200 cursor-pointer fa-solid fa-bars"></i>
          <span class="text-xl cursor-pointer ps-4"></span>
        </a>
      </div>

      <!-- DESKTOP NAV (left) -->
      <div
        class="aside hidden lg:flex flex-col gap-15 h-full w-full border-r-1 border-gray-300 min-h-dvh bg-blue-1000 text-white">
        
        <a href="/feed" class="flex items-center h-20 py-20 pl-10 w-55 shadow-white" title="Home / Feed">
          <img src="/public/logo.png" alt="Logo" class="shadow-white">
        </a>

        <a href="/feed" class="flex items-center hover:text-darkOrange" title="Feed">
          <i class="text-xl text-gray-200 cursor-pointer fa-solid fa-house-user ps-12"></i>
          <span class="text-xl text-gray-200 cursor-pointer ps-4">Feed</span>
        </a>

        <!-- UWAGA: zmienione z <div> na <a> -->
        <a href="/profile" class="flex items-center hover:text-darkOrange" title="Profile">
          <i class="text-xl text-gray-200 cursor-pointer fa-solid fa-user ps-12"></i>
          <span class="text-xl text-gray-200 cursor-pointer ps-4">Profile</span>
        </a>

        <a href="/create" class="flex items-center hover:text-darkOrange" title="Create">
          <i class="text-xl text-gray-200 cursor-pointer fa fa-camera ps-12"></i>
          <span class="text-xl text-gray-200 cursor-pointer ps-4">Create</span>
        </a>

        <a href="/more" class="flex items-center hover:text-darkOrange" title="More">
          <i class="text-xl text-gray-200 cursor-pointer fa-solid fa-bars ps-12"></i>
          <span class="text-xl text-gray-200 cursor-pointer ps-4">More</span>
        </a>
      </div>

      <!-- RIGHT / MAIN CONTENT -->
      <div
        class="aside grid grid-rows-4 col-span-5 h-dvh w-full pt-20 px-5 place-items-center overflow-y-scroll bg-bg s:pt-10 s:px-10 lg:col-span-4 lg:px-0">
        
        <div class="flex flex-col items-center mt-10 top-container s:mt-10 md:mt-30 lg:mt-30">

          <div class="top flex justify-center gap-5 pb-5 max-w-3xl border-b-1 border-gray-600 s:gap-10 md:pb-12">
            <div class="text-center">
              <div
                class="mx-auto overflow-hidden border-2 border-blue-300 rounded-full w-25 h-25 hover:border-text-blue-500 s:border-4 s:w-30 s:h-30 md:w-40 md:h-40">
                <img id="profile-img" src="/public/profile.avif" alt="Profile Picture"
                  class="object-cover w-full h-full" />
              </div>

              <label for="file-input" class="block mt-4 text-blue-200 cursor-pointer">
                Change Profile Picture
              </label>
              <input type="file" id="file-input" class="hidden" accept="image/*" />
            </div>

            <div class="text-div">
              <div class="flex items-center mb-4 space-x-4 justify-self-start s:mt-5 ">
                <div class="text-xl font-medium text-gray-200 md:text-2xl">
                  <span id="profile-name">Tom Cruise</span>
                </div>

                <button id="edit-btn" class="text-blue-100 cursor-pointer hover:text-blue-300" aria-label="Edit name">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 3l4 4-10 10H7v-4L17 3z"></path>
                  </svg>
                </button>
              </div>

              <div id="edit-section" class="hidden mb-4">
                <input type="text" id="name-input" class="w-full p-2 text-gray-200 border border-gray-300 rounded-md"
                  placeholder="Enter your name" />
                <div class="flex justify-between mt-4">
                  <button id="save-btn" class="px-4 py-2 text-gray-200 bg-gray-900 rounded-md hover:bg-blue-700">
                    Save
                  </button>
                  <button id="cancel-btn" class="px-4 py-2 text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              </div>

              <div class="post-followers-following flex flex-wrap gap-3 md:gap-10" id="profileMetrics"></div>

              <div class="flex items-center mt-10 mb-4 space-x-4 justify-self-start">
                <div class="text-gray-200 text-s font-small s:text-m md:text-lg">
                  <span id="bio-text">American actor and film producer</span>
                </div>

                <button id="edit-bio-btn" class="text-blue-100 cursor-pointer hover:text-blue-300" aria-label="Edit bio">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 3l4 4-10 10H7v-4L17 3z"></path>
                  </svg>
                </button>
              </div>

              <div id="edit-bio-section" class="hidden mb-4">
                <input type="text" id="bio-input" class="w-full p-2 text-gray-200 border border-gray-300 rounded-md"
                  placeholder="Enter your bio"></input>
                <div class="flex justify-between mt-4">
                  <button id="save-bio-btn" class="px-4 py-2 text-gray-200 bg-gray-900 rounded-md hover:bg-blue-700">
                    Save
                  </button>
                  <button id="cancel-bio-btn" class="px-4 py-2 text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-center posts-tagged gap-15">
            <div
              class="flex items-center justify-center gap-1 text-gray-200 uppercase cursor-pointer posts text-xs/10 text-md w-fit border-t-1 border-vibPink">
              <i class="fa-solid fa-image"></i>
              Posts
            </div>
            <div
              class="flex items-center justify-center gap-1 text-xs text-gray-200 uppercase cursor-pointer tagged text-md w-fit">
              <i class="fa-solid fa-people-arrows"></i>
              Tagged
            </div>
          </div>
        </div>

        <div class="w-full mt-20 h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 pr-10 pl-10 md:mt-60 place-items-start">
          ${r.map((e,t)=>Ii(e,t)).join("")}
        </div>

      </div>
    </div>
  `}function Mi(){let r=JSON.parse(localStorage.getItem("followedUsers")??"[]");document.querySelectorAll(".follow-btn").forEach(e=>{const t=e.dataset.authorid;t&&r.includes(t)&&(e.textContent="Followed",e.classList.remove("bg-blue-500","hover:bg-blue-600"),e.classList.add("bg-green-500","hover:bg-green-600"),e.setAttribute("aria-label",`Unfollow @user${t}`))}),document.addEventListener("click",e=>{const s=e.target.closest(".follow-btn");if(!s)return;const n=s.dataset.authorid;if(!n)return;r.includes(n)?(r=r.filter(a=>a!==n),s.textContent="Follow",s.classList.remove("bg-green-500","hover:bg-green-600"),s.classList.add("bg-blue-500","hover:bg-blue-600"),s.setAttribute("aria-label",`Follow @user${n}`)):(r.push(n),s.textContent="Followed",s.classList.remove("bg-blue-500","hover:bg-blue-600"),s.classList.add("bg-green-500","hover:bg-green-600"),s.setAttribute("aria-label",`Unfollow @user${n}`)),localStorage.setItem("followedUsers",JSON.stringify(r))})}document.addEventListener("DOMContentLoaded",Mi);async function Di(){return"<h1>The Page you looking for can't be found</h1>"}async function $i(r=[]){const e=Number(r[0]);if(isNaN(e))return'<p class="text-red-500 text-center p-10">Invalid post ID</p>';const t=await is();let s=[];if(Array.isArray(t))s=t;else if(t?.data&&Array.isArray(t.data))s=t.data;else return'<p class="text-red-500 text-center p-10">Error loading post</p>';const n=s.find(d=>d.id===e);if(!n)return'<p class="text-red-500 text-center p-10">Post not found</p>';const i=g.fromISO(n.createdAt||new Date().toISOString()).toRelative({locale:"en"})||"just now",a=n.isLiked??!1,o=a?"text-pink-600 animate__animated animate__heartBeat":"text-pink-500",l=n._count?.reactions??0,u=n._count?.comments??0,c=n.isFollowing??!1,f=c?"Unfollow":"Follow",h=c?"bg-red-500 hover:bg-red-600":"bg-blue-500 hover:bg-blue-600";return`
  <div class="min-h-screen flex flex-col bg-gray-900 text-white">
    <div class="flex-grow flex items-center justify-center p-4 overflow-auto">
      <article class="max-w-2xl w-full bg-white rounded-xl shadow-md overflow-hidden p-6 text-gray-900 flex flex-col"
               style="min-height: 100%; max-height: 100vh;">

        <!-- Header: Avatar & Author Info -->
        <div class="flex items-center mb-6 justify-between">
          <div class="flex items-center">
            <div class="w-14 h-14 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center mr-4">
              <img
                src="${n.media?.url?n.media.url:`https://i.pravatar.cc/100?u=${n.userId}`}"
                alt="${n.author||`user${n.userId}`}'s avatar"
                class="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-800">${n.title}</h1>
              <p class="text-sm text-gray-500">
                ${i} • By 
                <span class="font-semibold">${n.author||`@user${n.userId}`}</span>
              </p>
            </div>
          </div>
          <!-- Follow / Unfollow Button -->
          <button
            class="follow-btn text-white cursor-pointer px-3 py-1 rounded ${h} text-sm font-semibold transition-colors"
            data-authorid="${n.userId}"
            aria-label="${f} ${n.author||`user${n.userId}`}"
          >
            ${f}
          </button>
        </div>

        <!-- Post Image -->
        ${n.media?.url?`<div class="mb-6 flex-shrink-0">
                <img
                  src="${n.media.url}"
                  alt="${n.media.alt||"Post image"}"
                  class="w-full rounded-lg shadow-md max-h-[50vh] object-contain mx-auto"
                />
              </div>`:""}

        <!-- Post Body -->
        <p class="text-gray-900 text-lg leading-relaxed mb-6 flex-grow overflow-auto">
          ${n.body}
        </p>

        <!-- Tags -->
        ${n.tags?.length?`<div class="flex flex-wrap gap-3 mb-6">
                ${n.tags.map(d=>`<span class="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full cursor-default">#${d}</span>`).join("")}
              </div>`:""}

        <!-- Footer: Likes, Comments & Back Link -->
        <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">

          <!-- Like Button -->
          <button
            class="like-btn flex items-center ${o} hover:text-pink-600 transition-colors"
            data-postid="${n.id}"
            aria-pressed="${a}"
            aria-label="Like post"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
              class="w-6 h-6 mr-2"
            >
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
            </svg>
            <span class="font-semibold text-lg like-count">${l}</span>
          </button>

          <!-- Comments count -->
          <div class="flex items-center text-gray-600 text-sm cursor-pointer" aria-label="View comments" role="button" tabindex="0">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              viewBox="0 0 24 24" 
              class="w-5 h-5 mr-1"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-8l-4 4v-4H7a2 2 0 01-2-2v-2"/>
            </svg>
            <span>${u}</span>
          </div>

          <!-- Back to Feed Button -->
          <button
            id="back-to-feed"
            class="text-blue-600 hover:underline text-sm font-semibold cursor-pointer"
            type="button"
            aria-label="Back to feed"
          >
            ← Back to Feed
          </button>
        </div>

        <!-- Comment Form -->
        <form id="comment-form" class="mt-6">
          <textarea id="comment-text" placeholder="Write a comment..." required
            class="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"></textarea>
          <button type="submit"
            class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Post Comment
          </button>
        </form>

      </article>
    </div>
  </div>
  `}function Fi(){const r=localStorage.getItem("name");if(r)try{return JSON.parse(r)}catch{return r}const e=localStorage.getItem("username");if(e)try{return JSON.parse(e)}catch{return e}const t=rr();if(!t)return null;try{const s=JSON.parse(atob(t.split(".")[1]||""));if(s&&typeof s.name=="string")return s.name}catch{}return null}function z(r){return String(r??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}async function Li(){const r=Fi();if(!r)return`
      <main class="min-h-dvh bg-gray-900 text-gray-100 p-8">
        <h1 class="text-3xl font-bold mb-6">Your Profile</h1>
        <p class="opacity-80">
          Brak nazwy użytkownika. Zaloguj się ponownie lub zapisz:
          <code>localStorage.setItem('name', JSON.stringify('TwojaNazwa'))</code>
        </p>
        <a class="inline-block mt-6 underline" href="/login">→ Go to Login</a>
      </main>
    `;let e;try{e=await tt(`/profiles/${encodeURIComponent(r)}`)}catch(c){return`
      <main class="min-h-dvh bg-gray-900 text-gray-100 p-8">
        <h1 class="text-3xl font-bold mb-6">Your Profile</h1>
        <div class="p-4 rounded bg-red-900/30 border border-red-700">
          <div class="font-semibold mb-1">Error loading profile</div>
          <code class="text-sm break-all">${z(c?.message??String(c))}</code>
        </div>
        <p class="mt-4 opacity-80">Sprawdź token / API key.</p>
      </main>
    `}let t=[];try{const c=await tt(`/profiles/${encodeURIComponent(r)}/posts?limit=50&sort=created&sortOrder=desc`);t=Array.isArray(c)?c:Array.isArray(c?.data)?c.data:[]}catch{t=[]}const s=e?.name??r,n=(typeof e?.avatar=="string"?e.avatar:e?.avatar?.url)||"/public/profile.avif",i=e?._count?.followers??e?.followers?.length??0,a=e?._count?.following??e?.following?.length??0,o=t.length,l=e?.bio||"",u=`
    <main class="min-h-dvh bg-gray-900 text-gray-100 px-4 sm:px-6 py-6">
      <!-- Top card (centered) -->
      <header class="max-w-3xl mx-auto rounded-2xl border border-gray-800 bg-gray-850/60 p-6 shadow mb-8">
        <div class="flex flex-col items-center text-center gap-4">
          <img src="${z(n)}" alt="Avatar"
               class="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border border-gray-700"/>
          <div>
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">${z(s)}</h1>
            <p class="opacity-80 text-sm sm:text-base mt-2">${l?z(l):"—"}</p>
            <div class="mt-3 text-xs sm:text-sm opacity-80 flex items-center justify-center gap-3">
              <span>Followers: <b>${i}</b></span>
              <span>Following: <b>${a}</b></span>
              <span>Posts: <b>${o}</b></span>
            </div>

            <!-- New Post under stats -->
            <div class="mt-4">
              <button id="toggle-create"
                      class="px-4 py-2 rounded-lg border border-blue-500/40 text-blue-100
                             hover:bg-blue-600/20 hover:border-blue-500 transition">
                New Post
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Editor Card -->
      <section id="editor" class="max-w-2xl mx-auto hidden">
        <div class="rounded-xl border border-gray-800 bg-gray-850/60 backdrop-blur p-4 sm:p-5 shadow-lg">
          <h2 id="editor-title" class="text-lg sm:text-xl font-semibold mb-3">Create a new post</h2>
          <form id="post-form" class="space-y-4">
            <input type="hidden" id="postId" value="">
            <div>
              <label class="block mb-1 text-sm">Title <span class="text-red-400">*</span></label>
              <input id="title" required
                     class="w-full p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label class="block mb-1 text-sm">Body</label>
              <textarea id="body" rows="6"
                        class="w-full p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:border-blue-500"></textarea>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block mb-1 text-sm">Image URL</label>
                <input id="imgUrl"
                       class="w-full p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:border-blue-500"
                       placeholder="https://..." />
              </div>
              <div>
                <label class="block mb-1 text-sm">Image ALT</label>
                <input id="imgAlt"
                       class="w-full p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div>
              <label class="block mb-1 text-sm">Tags (comma separated)</label>
              <input id="tags"
                     class="w-full p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:border-blue-500"
                     placeholder="news, cats" />
            </div>
            <div class="flex items-center gap-3 pt-1">
              <button type="submit" id="save-btn" class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500">Create</button>
              <button type="button" id="cancel-edit" class="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600">Cancel</button>
              <button type="button" id="reset-edit" class="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700">Reset</button>
              <span id="msg" class="text-sm opacity-80 ml-1"></span>
            </div>
          </form>
        </div>
      </section>

      <!-- Posts -->
      <section class="max-w-6xl mx-auto mt-8">
        <div class="flex items-center gap-2 mb-3">
          <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gray-800 border border-gray-700">🗂️</span>
          <h2 class="text-lg sm:text-xl font-semibold">Your posts</h2>
        </div>
        <div id="posts" class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          ${t.length?t.map(c=>{const f=Array.isArray(c.media)?c.media?.[0]?.url:c.media?.url,h=c.author?.name===e.name,d=c.created?new Date(c.created).toLocaleString():"",w=Array.isArray(c.tags)&&c.tags.length?`<div class="flex flex-wrap gap-1 mt-2">${c.tags.slice(0,5).map(v=>`<span class="text-xs px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700">${z(v)}</span>`).join("")}</div>`:"";return`
                    <article class="rounded-xl bg-gray-850/60 border border-gray-800 p-4 hover:border-gray-700 transition shadow">
                      ${f?`<img class="w-full h-44 object-cover rounded-md mb-3 border border-gray-800" src="${z(f)}" alt="">`:""}
                      <h3 class="font-semibold mb-1">${z(c.title)}</h3>
                      <div class="text-xs opacity-60 mb-2">${z(d)}</div>
                      <div class="text-sm opacity-90 line-clamp-3">${z(c.body??"")}</div>
                      ${w}
                      ${h?`<div class="flex gap-2 mt-3">
                               <button class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 js-edit" data-id="${c.id}">Edit</button>
                               <button class="px-3 py-1 rounded bg-red-600 hover:bg-red-500 js-delete" data-id="${c.id}">Delete</button>
                             </div>`:""}
                    </article>
                  `}).join(""):'<p class="opacity-70">No posts yet.</p>'}
        </div>
      </section>

      <div class="max-w-6xl mx-auto">
        <a class="inline-block mt-10 underline" href="/feed">← Back to Feed</a>
      </div>
    </main>
  `;return Wi(),u}function p(r){return document.querySelector(r)}function Ai(){const r=p("#editor"),e=p("#editor-title"),t=p("#postId"),s=p("#save-btn"),n=p("#msg"),i=p("#title"),a=p("#body"),o=p("#imgUrl"),l=p("#imgAlt"),u=p("#tags");r?.classList.remove("hidden"),e&&(e.textContent="Create a new post"),s&&(s.textContent="Create"),t&&(t.value=""),n&&(n.textContent=""),i&&(i.value=""),a&&(a.value=""),o&&(o.value=""),l&&(l.value=""),u&&(u.value=""),i?.focus()}function Vi(r){const e=p("#editor"),t=p("#editor-title"),s=p("#postId"),n=p("#save-btn"),i=p("#msg"),a=p("#post-form"),o=p("#title"),l=p("#body"),u=p("#imgUrl"),c=p("#imgAlt"),f=p("#tags");e?.classList.remove("hidden"),t&&(t.textContent=`Edit post #${r.id}`),n&&(n.textContent="Save changes"),s&&(s.value=String(r.id)),i&&(i.textContent="");const h=Array.isArray(r.media)?r.media?.[0]:r.media||{},d={id:r?.id??"",title:r?.title??"",body:r?.body??"",imgUrl:h?.url??"",imgAlt:h?.alt??"",tags:Array.isArray(r?.tags)?r.tags:[]};o&&(o.value=d.title),l&&(l.value=d.body),u&&(u.value=d.imgUrl),c&&(c.value=d.imgAlt),f&&(f.value=d.tags.join(", ")),a&&(a.dataset.original=JSON.stringify(d)),o?.focus()}function er(){const r=p("#editor"),e=p("#postId"),t=p("#msg");r?.classList.add("hidden"),e&&(e.value=""),t&&(t.textContent="")}function Wi(){window.__profileHandlersWired||(window.__profileHandlersWired=!0,document.addEventListener("click",async r=>{const e=r.target;if(e.closest("#toggle-create")){const n=p("#editor");if(!n)return;n.classList.contains("hidden")?Ai():er();return}if(e.closest("#cancel-edit")){if(!p("#editor"))return;er();return}if(e.closest("#reset-edit")){const n=p("#post-form");if(!n?.dataset.original)return;const i=JSON.parse(n.dataset.original),a=p("#title"),o=p("#body"),l=p("#imgUrl"),u=p("#imgAlt"),c=p("#tags");a&&(a.value=i.title||""),o&&(o.value=i.body||""),l&&(l.value=i.imgUrl||""),u&&(u.value=i.imgAlt||""),c&&(c.value=Array.isArray(i.tags)?i.tags.join(", "):"");return}const t=e.closest(".js-edit");if(t){const n=t.getAttribute("data-id");if(!n)return;try{const i=await tt(`/posts/${n}?_author=true&_reactions=true&_comments=true`),a=i?.data??i;Vi({id:a?.id??n,title:a?.title??"",body:a?.body??"",tags:Array.isArray(a?.tags)?a.tags:[],media:a?.media??null})}catch{alert("Failed to load post for edit")}return}const s=e.closest(".js-delete");if(s){const n=s.getAttribute("data-id");if(!n||!confirm("Delete this post? This cannot be undone."))return;try{await ks(`/posts/${n}`),$("/profile")}catch(i){alert(`Delete failed: ${i?.message??String(i)}`)}return}}),document.addEventListener("submit",async r=>{if(r.target?.id!=="post-form")return;r.preventDefault();const t=p("#save-btn"),s=p("#msg"),n=p("#postId"),i=p("#title"),a=p("#body"),o=p("#imgUrl"),l=p("#imgAlt"),u=p("#tags");if(!i||!t||!s)return;const c=n?.value?.trim(),f=i.value.trim(),h=a?.value?.trim()||"",d=o?.value?.trim()||"",w=l?.value?.trim()||"",v=u?.value?.trim()||"",E=v?v.split(",").map(F=>F.trim()).filter(Boolean):[];if(!f){s.textContent="Title is required.";return}const M={title:f};h&&(M.body=h),E.length&&(M.tags=E),M.media=d?{url:d,...w?{alt:w}:{}}:null;try{t.disabled=!0,t.textContent=c?"Saving…":"Creating…",s.textContent="",c?await xs(`/posts/${c}`,M):await sr("/posts",M),$("/profile")}catch(F){s.textContent=`Error: ${F?.message??String(F)}`}finally{t.disabled=!1,t.textContent=c?"Save changes":"Create"}}))}function Pi(r,e=250){let t;if(typeof r!="function")throw new TypeError(hs);return function(...s){const n=this;clearTimeout(t),t=setTimeout(()=>{r.apply(n,s)},e)}}function Ui(){return`
    <button
      id="logout-btn"
      type="button"
      class="rounded-xl bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow-sm hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
    >
      Log out
    </button>
  `}function Ri(){const r=document.getElementById("logout-btn");r&&r.addEventListener("click",()=>{localStorage.removeItem("accessToken"),localStorage.removeItem("apiKey"),localStorage.removeItem("user"),history.pushState({path:"/"},"","/"),$("/")})}function Zi(){return`
    <div class="flex items-center justify-center w-full px-2 mb-2">
      <!-- Search input -->
      <input
        id="feed-search-input"
        type="text"
        placeholder="Search posts..."
        class="w-2/3 max-w-2xl border border-gray-600 rounded-lg px-3 py-2
               bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
 
      <!-- Reuse existing logout button -->
      <div class="ml-2">
        ${Ui()}
      </div>
    </div>
  `}function as(){console.log("initFeedPageScripts running...");const r=document.querySelector(".aside.grid.grid-rows-4.col-span-5");r&&!document.getElementById("feed-search-input")&&(r.insertAdjacentHTML("afterbegin",Zi()),Ri());const e=document.getElementById("feed-search-input"),t=document.querySelector(".w-full.mt-20.h-full.grid");if(!e||!t){console.warn("Search bar or feed grid not ready yet.");return}const s=Pi(()=>{const n=e.value.toLowerCase(),i=t.querySelectorAll("article[data-component='postCard']");let a=0;i.forEach(l=>{(l.querySelector("h2")?.textContent?.toLowerCase()||"").includes(n)?(l.style.display="",a++):l.style.display="none"});let o=document.getElementById("no-results-message");o||(o=document.createElement("p"),o.id="no-results-message",o.textContent="No posts found.",t.parentElement?.appendChild(o)),o.style.display=a===0?"":"none"},300);e.addEventListener("input",s)}function zi(r=[],e){r.forEach(t=>{if(t.isIntersecting){const s=t.target;s.src=s.dataset.src,s.classList.remove(tr),e.unobserve(s)}})}function qi(r=tr,e="15%"){const t=document.querySelectorAll(`.${r}`),s={root:null,rootMargin:`0px 0px ${e} 0px`},n=new IntersectionObserver(zi,s);t.forEach(i=>n.observe(i))}const Bi={home:{url:"/",component:rt,protected:!1},login:{url:"/login",component:rt,protected:!1},register:{url:"/register",component:Is,protected:!1},feed:{url:"/feed",component:Ci,protected:!0},profile:{url:"/profile",component:Li,protected:!0},postDetails:{url:/^\/post\/(\d+)$/,component:$i,protected:!0}};function ji(){return!!localStorage.getItem("accessToken")}async function Hi(r){localStorage.setItem("accessToken",r),history.pushState({},"","/feed"),await $("/feed")}async function Yi(r="",e=Bi){r=r||window.location.pathname;let t=[],s=null;for(const i of Object.keys(e)){const a=e[i];if(typeof a.url=="string"){if(a.url===r){s=a;break}}else if(a.url instanceof RegExp){const o=r.match(a.url);if(o){s=a,t=o.slice(1);break}}}let n;return s?s.protected&&!ji()?(history.replaceState({},"","/login"),n=await rt()):n=await s.component(t):n=await Di(),n}async function $(r){const e=r??window.location.pathname,t=document.getElementById(gs);if(t){if(t.innerHTML=await Yi(e),qi(),/^\/post\/\d+$/.test(e)){const s=document.getElementById("back-to-feed");s&&s.addEventListener("click",n=>{n.preventDefault(),history.pushState({},"","/feed"),$("/feed")})}e==="/feed"&&as()}}function kt(r){r==="/feed"&&as()}function _i(r){history.pushState({path:r},"",r),$(r),kt(r)}const os=window.location.pathname;$(os);kt(os);window.onerror=ys;window.addEventListener("unhandledrejection",ps);window.addEventListener("popstate",r=>{const e=r.state?.path||window.location.pathname;$(e),kt(e)});document.body.addEventListener("click",r=>{const t=r.target.closest('a[href^="/"], a[data-link]');if(t){const s=t.getAttribute("href");s&&s.startsWith("/")&&(r.preventDefault(),_i(s))}});
