/* Trek matching tool, "מה הפסגה הבאה שלכם?" (owner, 10 Nov 2026: the tool built in the chat,
   claude.ai/artifact/T2ACUJppQYbM6uPGQv9LFg, on the site as a hidden page, /trek-match).
   The quiz is the artifact's own code, kept as it was written (same questions, same scoring, same
   texts). What changed for the site: the paths of its photos, links to our own expedition pages,
   our WhatsApp number from contact.js, and the end of the form: a lead in the Lead Center through
   /api/submit-lead (owner's choice), with the consent line every form on the site carries.
   mountTrekMatch() draws into the page's markup (TrekMatchPage.jsx) and returns a cleanup. */

export const ASSETS = '/images/trek-match/';
const SITE = '/expedition/';

/* fit: כושר נדרש 1-5 · tech: רמה טכנית 0-3 · techReq/altReq: ניסיון מינימלי
   region: hi/af/eu/far/me · mot: מה המסע נותן · snow: 0 בלי, 1 לילה קר, 2 שלג וקרח
   id = the expedition's slug on the site (/expedition/<id>). */
export const TRIPS = [
 {id:"sinai",name:"טרק להר הגבוה בסיני",country:"מצרים",alt:2642,days:6,price:950,cur:"$",type:"trek",region:"me",mot:["scenery","culture","combo"],snow:0,stay:"tents",stayL:"לינה בבוסתנים בדואיים",fit:2,tech:0,techReq:0,altReq:0,months:[3,4,5,9,10,11],success:null,blurb:"ג'בל קתרינה, ואדיות אדומות ובריכות בלב המדבר, וסיום בשנורקל בבלו הול בדהב."},
 {id:"olympus",name:"טיפוס לאולימפוס",country:"יוון",alt:2918,days:6,price:1750,cur:"€",type:"summit",region:"eu",mot:["summit","scenery","combo"],snow:0,stay:"huts",stayL:"בקתות הרים",fit:3,tech:0,techReq:0,altReq:0,months:[6,7,8,9,10],success:98,blurb:"פסגת מיטיקאס, יערות פריוניה ויום קניונינג בנהר האורליאס."},
 {id:"peaks-of-balkan",name:"טרק פסגות הבלקן",country:"אלבניה, קוסובו ומונטנגרו",alt:2656,days:10,price:1750,cur:"€",type:"trek",region:"eu",mot:["scenery","culture"],snow:0,stay:"huts",stayL:"גסטהאוסים משפחתיים",fit:3,tech:0,techReq:0,altReq:0,months:[6,7,8,9,10],success:96,blurb:"שלוש מדינות ברגל, שייט באגם קומאני ופסגת ג'רביצה."},
 {id:"ethiopia",name:"הרי סימיאן ומדבר דנקיל",country:"אתיופיה",alt:4430,days:12,price:3000,cur:"$",type:"trek",region:"af",mot:["culture","combo","scenery"],snow:1,stay:"mixed",stayL:"אוהלים ומלונות",fit:3,tech:0,techReq:0,altReq:0,months:[11,12,1,2],success:92,blurb:"קופי ג'לדה, אגם הלבה הפעיל בארטה אלה וכנסיות חצובות בסלע."},
 {id:"kilimanjaro",name:"טיפוס לקילימנג'רו",country:"טנזניה",alt:5895,days:9,price:2900,cur:"$",type:"summit",region:"af",mot:["summit","combo","scenery"],seven:true,snow:1,stay:"tents",stayL:"אוהלים עם פורטרים",fit:3,tech:0,techReq:0,altReq:0,months:[1,2,6,7,8,9,10],success:94,blurb:"מסלול מצ'אמה לפסגת אוהורו, עם אופציה ל־3 ימי ספארי."},
 {id:"kilimanjaro-kosher",name:"קילימנג'רו לשומרי מסורת",country:"טנזניה",alt:5895,days:10,price:3100,cur:"$",type:"summit",region:"af",mot:["summit","combo","scenery"],seven:true,snow:1,stay:"tents",stayL:"אוהלים עם פורטרים",fit:3,tech:0,techReq:0,altReq:0,months:[1,2,6,7,8,9,10],success:94,kosher:true,blurb:"הטיפוס כולו בין שתי שבתות עם חב\"ד ארושה, ואוכל כשר על ההר."},
 {id:"annapurna",name:"טרק סובב אנאפורנה",country:"נפאל",alt:5416,days:16,price:2500,cur:"$",type:"trek",region:"hi",mot:["scenery","culture"],snow:1,stay:"huts",stayL:"בקתות (טי־האוסים)",fit:4,tech:0,techReq:0,altReq:0,months:[4,5,9,10],success:90,blurb:"אגם טיליצ'ו ומעבר תורונג לה, הלופ הקלאסי של ההימלאיה."},
 {id:"manaslu-circuit",name:"טרק סובב מנסלו",country:"נפאל",alt:5106,days:16,price:2250,cur:"$",type:"trek",region:"hi",mot:["scenery","culture"],snow:1,stay:"huts",stayL:"בקתות (טי־האוסים)",fit:4,tech:0,techReq:0,altReq:0,months:[4,5,9,10],success:91,blurb:"שבילים שקטים, כפרים טיבטיים ומעבר לרקיה לה."},
 {id:"everest-base-camp",name:"טרק אוורסט בייס קמפ וגוקיו",country:"נפאל",alt:5545,days:19,price:3800,cur:"$",type:"trek",region:"hi",mot:["scenery","culture","summit"],snow:1,stay:"huts",stayL:"בקתות (טי־האוסים)",fit:4,tech:0,techReq:0,altReq:0,months:[4,5,9,10],success:93,blurb:"בייס קמפ, זריחה מקאלה פטאר, מעבר צ'ו לה ואגמי גוקיו."},
 {id:"kazbek",name:"טיפוס לקזבק",country:"גאורגיה",alt:5054,days:8,price:2300,cur:"€",type:"summit",region:"eu",mot:["summit","scenery"],snow:2,stay:"mixed",stayL:"בקתה ואוהלים על הקרחון",fit:4,tech:1,techReq:0,altReq:0,months:[6,7,8,9],success:88,blurb:"פסגת הקרחון הראשונה שלכם, בצוותי חבל, עם ציוד כלול."},
 {id:"elbrus",name:"טיפוס לאלברוס",country:"רוסיה",alt:5642,days:10,price:3500,cur:"$",type:"summit",region:"eu",mot:["summit"],seven:true,snow:2,stay:"huts",stayL:"בקתות הרים",fit:4,tech:1,techReq:1,altReq:1,months:[6,7,8,9],success:85,blurb:"ההר הגבוה באירופה, אחת משבע הפסגות."},
 {id:"mera-peak",name:"טיפוס למרה פיק",country:"נפאל",alt:6476,days:19,price:3800,cur:"$",type:"summit",region:"hi",mot:["summit","scenery"],snow:2,stay:"mixed",stayL:"בקתות והיי קמפ",fit:5,tech:1,techReq:0,altReq:1,months:[4,5,9,10],success:80,blurb:"פסגת הטרקינג הגבוהה בנפאל, עם נוף על חמש פסגות 8,000."},
 {id:"island-peak",name:"טיפוס לאיילנד פיק",country:"נפאל",alt:6189,days:20,price:3550,cur:"$",type:"summit",region:"hi",mot:["summit","scenery"],snow:2,stay:"mixed",stayL:"בקתות ואוהלים",fit:5,tech:2,techReq:1,altReq:2,months:[4,5,9,10],success:84,blurb:"בייס קמפ אוורסט ופסגה על חבלים קבועים, עם מדריך טיפוס אישי."},
 {id:"lobuche-peak",name:"טיפוס ללובוצ'ה פיק",country:"נפאל",alt:6119,days:19,price:3550,cur:"$",type:"summit",region:"hi",mot:["summit"],snow:2,stay:"mixed",stayL:"בקתות ואוהלים",fit:5,tech:2,techReq:1,altReq:2,months:[4,5,9,10],success:82,blurb:"6,000 טכני מול הקומבו אייספול."},
 {id:"aconcagua",name:"טיפוס לאקונקגואה",country:"ארגנטינה",alt:6962,days:20,price:10000,cur:"$",type:"summit",region:"far",mot:["summit"],seven:true,snow:2,stay:"tents",stayL:"אוהל יחיד ומחנות גובה",fit:5,tech:1,techReq:0,altReq:2,months:[12,1,2],success:75,blurb:"הפסגה הגבוהה מחוץ לאסיה, שלושה מחנות גובה, יציאה אחת בשנה בינואר."},
 {id:"lenin-peak",name:"טיפוס ללנין פיק",country:"קירגיזסטן",alt:7134,days:20,price:6200,cur:"$",type:"summit",region:"far",mot:["summit"],snow:2,stay:"tents",stayL:"בייס קמפ ביורטות ואוהלים",fit:5,tech:2,techReq:1,altReq:3,months:[7,8],success:68,blurb:"ה־7,000 הנגיש בעולם, מול רכס הפמיר."},
 {id:"himlung-himal",name:"טיפוס להימלונג הימאל",country:"נפאל",alt:7126,days:30,price:8500,cur:"$",type:"summit",region:"hi",mot:["summit"],snow:2,stay:"mixed",stayL:"בקתות ואוהלים",fit:5,tech:2,techReq:2,altReq:3,months:[10],success:80,blurb:"ה־7,000 הראשון שלכם, והכנה לשמיניות."},
 {id:"ama-dablam",name:"טיפוס לאמא דאבלם",country:"נפאל",alt:6812,days:30,price:7000,cur:"$",type:"summit",region:"hi",mot:["summit"],snow:2,stay:"mixed",stayL:"בקתות ואוהלים",fit:5,tech:3,techReq:3,altReq:3,months:[10],success:65,blurb:"סלע, קרח וטיפוס משולב על \"המטרהורן של ההימלאיה\"."},
 {id:"manaslu",name:"משלחת למנסלו",country:"נפאל",alt:8163,days:30,price:15000,cur:"$",type:"summit",region:"hi",mot:["summit"],snow:2,stay:"mixed",stayL:"בקתות ואוהלים",fit:5,tech:2,techReq:2,altReq:4,months:[9],success:null,blurb:"שמינייה עם שרפה אישי וחמצן."}
];

const ALT_LEVELS=[2500,3500,5000,6000,7000];
const REGION_NAME={hi:"בהימלאיה",af:"באפריקה",eu:"באירופה ובקווקז",far:"באנדים ובפמיר",me:"בסיני"};
export const Q = [
 {key:"type",title:"מה מושך אתכם יותר?",opts:[
   ["trek","טרק","כמה ימים על השביל, מעברי הרים וכפרים"],
   ["summit","פסגה","לעלות להר ולעמוד למעלה"],
   ["any","שניהם",""]]},
 {key:"region",title:"לאן תרצו לנסוע?",hint:"אפשר לבחור יותר מאחד",multi:true,any:"any",opts:[
   ["hi","הימלאיה","נפאל, בין ענקי ה־8,000"],["af","אפריקה","קילימנג'רו ואתיופיה"],
   ["eu","אירופה והקווקז","יוון, הבלקן, גאורגיה ורוסיה"],["far","אנדים ופמיר","ארגנטינה וקירגיזסטן"],
   ["me","סיני","קרוב לבית, 6 ימים"],["any","לא משנה לי",""]]},
 {key:"mot",title:"מה הכי חשוב לכם במסע?",opts:[
   ["summit","להגיע לפסגה","ואולי לסמן אחת משבע הפסגות"],
   ["scenery","נופים וטבע","קרחונים, אגמים ורכסים"],
   ["culture","תרבות ואנשים","כפרים, מנזרים ומפגשים עם מקומיים"],
   ["combo","שילוב של חוויות","למשל ספארי, הר געש או שנורקל"]]},
 {key:"stay",title:"איפה נוח לכם לישון?",opts:[
   ["huts","בבקתה, עם מיטה","בקתות הרים וגסטהאוסים"],
   ["tents","באוהל","הצוות מקים את המחנה בכל ערב"],
   ["any","לא משנה לי",""]]},
 {key:"cold",title:"איך אתם מסתדרים עם קור?",opts:[
   [0,"מעדיפים להימנע","לילות נעימים יותר"],
   [1,"לילה קר אחד זה בסדר","כמה מעלות מתחת לאפס ביום הפסגה"],
   [2,"שלג וקרח מתאימים לנו","הליכה עם קרמפונים וגרזן קרח"]]},
 {key:"fit",title:"איך הכושר שלכם כרגע?",opts:[
   [1,"הולכים מדי פעם","כמה ק\"מ בסופי שבוע"],
   [2,"מטיילים קבועים","מסלול של 3–4 שעות זה כיף"],
   [3,"מטיילים חזקים","6–8 שעות הליכה, יום אחרי יום"],
   [4,"מתאמנים ברצינות","4+ אימונים בשבוע, עליות ארוכות עם תיק"],
   [5,"ספורטאי סיבולת","מאמץ של כמה ימים ברצף לא מפחיד אתכם"]]},
 {key:"done",peaks:true,title:"על אילו הרים כבר עליתם?",hint:"סמנו מהרשימה או כתבו בחופשיות. לא נמליץ לכם על הר שכבר הייתם בו.",opts:[]},
 {key:"alt",title:"מה הגובה הכי גבוה שהגעתם אליו?",opts:[
   [0,"מתחת ל־2,500 מ'","חרמון, רמון, מסלולים בארץ"],[1,"עד 3,500 מ'",""],[2,"עד 5,000 מ'","למשל אנאפורנה או בייס קמפ"],
   [3,"עד 6,000 מ'","למשל קילימנג'רו או אלברוס"],[4,"מעל 6,000 מ'",""]]},
 {key:"tech",title:"יש לכם ניסיון עם ציוד טיפוס?",opts:[
   [0,"אין",""],[1,"קרמפונים וגרזן קרח","הלכתי על שלג או קרחון עם מדריך"],
   [2,"חבלים קבועים וג'ומאר","עליתי על חבל מקובע"],[3,"טיפוס סלע, קרח או משולב","טיפסתי מסלולים טכניים"]]},
 {key:"days",title:"כמה זמן יש לכם?",opts:[
   [7,"עד שבוע",""],[12,"8–12 ימים",""],[21,"שבועיים־שלושה",""],[99,"חודש ומעלה",""]]},
 {key:"season",title:"מתי תרצו לצאת?",hint:"אפשר לבחור יותר מעונה אחת",multi:true,any:"flex",opts:[
   ["w","דצמבר–פברואר",""],["sp","מרץ–מאי",""],["su","יוני–אוגוסט",""],["au","ספטמבר–נובמבר",""],["flex","גמישים",""]]},
 {key:"budget",title:"מה התקציב, לאדם ובלי טיסות?",opts:[
   [1500,"עד $1,500",""],[3000,"$1,500–3,000",""],[5000,"$3,000–5,000",""],[1e9,"מעל $5,000",""],[0,"עוד לא יודעים",""]]}
];
const GAL={"sinai":4,"olympus":4,"peaks-of-balkan":4,"ethiopia":4,"kilimanjaro":4,"kilimanjaro-kosher":4,"annapurna":4,"manaslu-circuit":4,"everest-base-camp":4,"kazbek":4,"elbrus":4,"mera-peak":4,"island-peak":4,"lobuche-peak":1,"aconcagua":4,"lenin-peak":0,"himlung-himal":0,"ama-dablam":4,"manaslu":4};
const TILE={type:{trek:"c/annapurna.webp",summit:"q/hero1.webp"},
 region:{hi:"c/everest-base-camp.webp",af:"c/kilimanjaro.webp",eu:"c/peaks-of-balkan.webp",far:"c/aconcagua.webp",me:"c/sinai.webp"},
 mot:{summit:"q/mot.webp",scenery:"c/manaslu-circuit.webp",culture:"c/ethiopia.webp",combo:"q/budget.webp"},
 stay:{huts:"q/days.webp",tents:"q/stay.webp"},
 cold:{0:"c/sinai.webp",1:"c/kilimanjaro.webp",2:"q/cold.webp"}};
const SEASON={w:[12,1,2],sp:[3,4,5],su:[6,7,8],au:[9,10,11]};
const MON=["","ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
const MOT_REASON={summit:"נותן את ההישג שאתם מחפשים",scenery:"מלא נופים וטבע פראי",culture:"עשיר בתרבות ובמפגשים מקומיים",combo:"משלב כמה חוויות במסע אחד"};
const SHORT={"sinai":"הר גבוה בסיני","olympus":"אולימפוס","peaks-of-balkan":"פסגות הבלקן","ethiopia":"סימיאן, אתיופיה","kilimanjaro":"קילימנג'רו","annapurna":"סובב אנאפורנה","manaslu-circuit":"סובב מנסלו","everest-base-camp":"אוורסט בייס קמפ","kazbek":"קזבק","elbrus":"אלברוס","mera-peak":"מרה פיק","island-peak":"איילנד פיק","lobuche-peak":"לובוצ'ה פיק","aconcagua":"אקונקגואה","lenin-peak":"לנין פיק","himlung-himal":"הימלונג הימאל","ama-dablam":"אמא דאבלם","manaslu":"פסגת מנסלו"};
/* מילות זיהוי לטקסט חופשי: מסעות שלנו לפי id, הרים אחרים לפי גובה */
const ALIAS=[
 ["manaslu",["פסגת מנסלו","manaslu summit","manaslu peak"]],
 ["manaslu-circuit",["מנסלו","manaslu"]],
 ["everest-base-camp",["בייס קמפ","בייסקמפ","base camp","ebc","קאלה פטאר","kala patthar","kala pattar","גוקיו","gokyo"]],
 ["kilimanjaro",["קילימנג","קילימנז","קילי ","kilimanjaro","kili ","אוהורו","uhuru"]],
 ["annapurna",["אנאפורנה","אנפורנה","annapurna","תורונג","thorong"]],
 ["kazbek",["קזבק","kazbek","kazbegi"]],["elbrus",["אלברוס","elbrus"]],["olympus",["אולימפוס","olympus"]],
 ["mera-peak",["מרה פיק","מרה","mera"]],["island-peak",["איילנד","island peak","imja"]],["lobuche-peak",["לובוצ","lobuche"]],
 ["aconcagua",["אקונקגואה","aconcagua"]],["lenin-peak",["לנין","lenin"]],["himlung-himal",["הימלונג","himlung"]],
 ["ama-dablam",["אמא דאבלם","אמה דבלם","ama dablam"]],["sinai",["קתרינה","סיני","sinai"]],["peaks-of-balkan",["בלקן","balkan"]],["ethiopia",["סימיאן","simien","דנקיל"]],
 [8849,["פסגת אוורסט","everest summit"]],[6190,["דנאלי","denali","מקינלי"]],[6263,["צ'ימבורסו","צימבורסו","chimborazo"]],[6153,["סטוק קנגרי","stok kangri"]],
 [6088,["הוואינה פוטוסי","huayna"]],[5897,["קוטופקסי","cotopaxi"]],[5636,["אוריסבה","orizaba"]],[5137,["אררט","ararat"]],
 [5109,["רוונזורי","rwenzori"]],[4985,["הר קניה","mount kenya","לנאנה"]],[4808,["מון בלאן","מונבלאן","mont blanc"]],
 [4478,["מטרהורן","matterhorn"]],[4167,["טובקל","toubkal"]],[4095,["קינבלו","kinabalu"]],[3776,["פוג'י","פוגי","fuji"]],
 [3357,["אטנה","etna"]],[3718,["טיידה","teide"]],[2814,["חרמון","hermon"]]
];
const levelOf=h=>h<=0?0:h<=2500?0:h<=3500?1:h<=5000?2:h<=6000?3:4;
export function parsePeaks(txt){
  let t=" "+String(txt||"").toLowerCase().replace(/[׳`’]/g,"'").replace(/["״]/g,"").replace(/[,.;/\n-]+/g," ")+" ";
  const ids=[],others=[];
  for(const [key,words] of ALIAS){
    const w=words.find(x=>t.includes(x));
    if(!w) continue;
    t=t.split(w).join(" ");
    if(typeof key==="string"){if(!ids.includes(key))ids.push(key)}
    else others.push({name:w.trim(),alt:key});
  }
  return {ids,others};
}
const WITH=["לבד","בזוג","עם חברים","עם המשפחה","עם צוות מהעבודה"];
const CONSENT="אני מסכימ/ה למדיניות הפרטיות ולקבלת דיוור שיווקי";   // the line every form on the site carries
const usd=t=>t.cur==="€"?t.price*1.1:t.price;
const fmt=n=>n.toLocaleString("en-US");
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const label=(key,v)=>{const q=Q.find(x=>x.key===key);const o=q&&q.opts.find(x=>x[0]===v);return o?o[1]:""};

/* The quiz's state and its pure parts, apart from the screen, so the lead can be checked in a test. */
export function createQuiz(){
  const A={season:[],region:[]};const lead={name:"",phone:"",email:"",kosher:false,with:"",consent:false};
  const isDone=t=>(A.done||[]).includes(t.id)||(t.id==="kilimanjaro-kosher"&&(A.done||[]).includes("kilimanjaro"));
  const doneMax=()=>{const ids=A.done||[];const hs=ids.map(id=>TRIPS.find(t=>t.id===id).alt).concat((A.doneOther||[]).map(o=>o.alt));return hs.length?Math.max(...hs):0};
  const doneNames=()=>(A.done||[]).map(id=>SHORT[id]).concat((A.doneOther||[]).map(o=>o.name));
  const syncDone=()=>{const p=parsePeaks(A.doneText);A.done=[...new Set([...(A.donePick||[]),...p.ids])];A.doneOther=p.others};

  function score(t){
    const reasons=[],heads=[];
    if(isDone(t)) return null;
    const dm=doneMax();
    const nextStep=dm>0&&t.alt>dm&&t.alt-dm<=1700&&t.techReq<=A.tech;
    if(t.techReq>A.tech||t.altReq>A.alt||t.fit-A.fit>=2) return null;
    if(t.kosher&&!lead.kosher) return null;
    if(t.id==="kilimanjaro"&&lead.kosher) return null;
    if(t.days>A.days*1.35) return null;
    if(A.cold===0&&t.snow===2) return null;
    let s=90;
    if(A.type!=="any"&&A.type!==t.type) s-=22;
    else if(A.type!=="any") reasons.push(t.type==="trek"?"טרק אמיתי, בלי טיפוס טכני":`פסגה אמיתית: ${fmt(t.alt)} מ'`);
    if(!A.region.includes("any")){
      if(A.region.includes(t.region)) reasons.push(`${REGION_NAME[t.region]}, כמו שרציתם`);
      else s-=15;
    }
    if(t.mot[0]===A.mot){s+=4;reasons.push(t.seven&&A.mot==="summit"?"אחת משבע הפסגות":MOT_REASON[A.mot])}
    else if(t.mot.includes(A.mot)) reasons.push(t.seven&&A.mot==="summit"?"אחת משבע הפסגות":MOT_REASON[A.mot]);
    else s-=9;
    if(t.fit>A.fit){s-=14;heads.push("דורש קצת יותר כושר. נשלח לכם תוכנית אימונים.")}
    else if(A.fit-t.fit>=2) s-=8*(A.fit-t.fit-1);
    else reasons.push("מתאים לרמת הכושר שלכם");
    if(A.cold===0&&t.snow===1){s-=8;heads.push("לילה אחד או שניים קרים בגובה")}
    if(A.cold===1&&t.snow===2){s-=10;heads.push("כולל הליכה על שלג וקרח, עם הדרכה וציוד")}
    if(A.cold===2&&t.snow===2){s+=4;reasons.push("שלג, קרח וקרמפונים, בדיוק מה שביקשתם")}
    if(A.cold===2&&t.snow===0&&t.type==="summit") s-=10;
    if(A.stay!=="any"){
      if(t.stay===A.stay) reasons.push(`${t.stayL}, כמו שאתם אוהבים`);
      else if(t.stay==="mixed"){s-=6;heads.push(`לינה: ${t.stayL}`)}
      else{s-=16;heads.push(`לינה: ${t.stayL}`)}
    }
    if(!A.season.includes("flex")){
      const want=A.season.flatMap(k=>SEASON[k]);
      const hit=t.months.filter(m=>want.includes(m));
      if(hit.length) reasons.push(`יוצא ב${hit.slice(0,3).map(m=>MON[m]).join(", ")}${hit.length>3?" ועוד":""}`);
      else{s-=24;heads.push(`העונה היא ${t.months.map(m=>MON[m]).join(", ")}, מחוץ לחלון שבחרתם`)}
    }
    if(A.budget){
      const p=usd(t);
      if(p<=A.budget) reasons.push("בתוך התקציב שלכם");
      else if(p<=A.budget*1.3){s-=9;heads.push("קצת מעל התקציב שבחרתם")}
      else s-=22;
    }
    if(t.days>A.days){s-=10;heads.push(`${t.days} ימים, קצת יותר ממה שתכננתם`)}
    else if(A.days>=21&&t.days<=7) s-=8;
    if(A.alt>=3&&t.alt<4000) s-=14;
    if(A.alt>=2&&t.alt<=ALT_LEVELS[A.alt]&&t.type==="summit") s-=6*(A.alt-1);
    if(A.tech>=2&&t.tech<=1&&t.type==="summit") s-=8;
    if(nextStep){s+=7;const top=(A.done||[]).map(id=>TRIPS.find(x=>x.id===id)).sort((a,b)=>b.alt-a.alt)[0];reasons.unshift(top&&top.alt===dm?`הצעד הבא אחרי ${SHORT[top.id]}`:`הצעד הבא שלכם: ${fmt(t.alt)} מ'`)}
    else if(t.alt>ALT_LEVELS[A.alt]&&t.alt-ALT_LEVELS[A.alt]<1800&&t.techReq<=A.tech){s+=6;reasons.push(`הגובה הבא שלכם: ${fmt(t.alt)} מ'`)}
    if(t.tech===0&&A.tech===0) reasons.push("לא צריך שום ניסיון טכני");
    if(t.kosher){s+=12;reasons.unshift("אוכל כשר ושבת עם חב\"ד ארושה")}
    if(t.success) s+=(t.success-85)/5;
    return {t,score:Math.max(40,Math.min(99,Math.round(s))),reasons:reasons.slice(0,4),heads:heads.slice(0,1)};
  }

  function getResults(){
    A.alt=Math.max(A.alt||0,levelOf(doneMax()));
    const all=TRIPS.map(score).filter(Boolean).sort((a,b)=>b.score-a.score);
    let rs=all.filter(r=>r.score>=60).slice(0,3);
    let fallback=false;
    if(!rs.length&&all.length){fallback=true;rs=all.slice(0,1)}
    else if(!rs.length){
      fallback=true;
      const pick=[lead.kosher?"kilimanjaro-kosher":"peaks-of-balkan","sinai","olympus","peaks-of-balkan","kilimanjaro"].map(id=>TRIPS.find(t=>t.id===id)).find(t=>!isDone(t)&&(!!t.kosher===lead.kosher||t.id!=="kilimanjaro"&&!t.kosher))||TRIPS.filter(t=>!isDone(t)&&!t.kosher).sort((a,b)=>a.alt-b.alt)[0];
      rs=!pick?[]:[{t:pick,score:70,reasons:["מסע נגיש בלי שום ניסיון טכני"],heads:["כדאי להתחיל בתוכנית אימונים של 3 חודשים"]}];
    }
    return {rs,fallback};
  }

  /* The lead for the Lead Center (/api/submit-lead, the contract every form on the site uses).
     Expedition = the first recommendation, by its site name (what the expedition forms send);
     the answers and the three recommendations go in the message, for the agent who calls. */
  function leadFields(rs,nameHe=id=>id){
    const top=rs[0]&&rs[0].t;
    const many=(key,vals)=>(vals||[]).map(v=>label(key,v)).filter(Boolean).join(", ");
    const lines=[
      "שאלון התאמה, ההמלצות: "+(rs.length?rs.map((r,i)=>`${i+1}. ${r.t.name} (${r.score}%)`).join(" · "):"אין"),
      `סוג: ${label("type",A.type)} · אזור: ${many("region",A.region)} · הכי חשוב: ${label("mot",A.mot)}`,
      `לינה: ${label("stay",A.stay)} · קור: ${label("cold",A.cold)} · זמן: ${label("days",A.days)} · עונה: ${many("season",A.season)} · תקציב: ${label("budget",A.budget)}`,
    ];
    if(lead.with) lines.push(`יוצאים: ${lead.with}`);
    if(lead.kosher) lines.push("שומרים כשרות ושבת");
    const done=doneNames();
    const experience=[`כושר: ${label("fit",A.fit)}`,`גובה מקסימלי: ${label("alt",A.alt)}`,`ציוד טיפוס: ${label("tech",A.tech)}`,done.length?`עלו על: ${done.join(", ")}`:""].filter(Boolean).join(" · ");
    const size=lead.with==="לבד"?1:lead.with==="בזוג"?2:undefined;
    return {
      Name:lead.name,
      Phone:lead.phone,
      Email:lead.email||undefined,
      Expedition:top?nameHe(top.id):undefined,
      Experience:experience,
      'Group Size':size,
      Message:lines.join("\n"),
      Source:"Trek Match Quiz",
    };
  }
  return {A,lead,score,getResults,leadFields,syncDone,doneMax,doneNames,isDone};
}

function ridge(done,total){
  const pts=[[0,40],[30,32],[50,36],[85,24],[110,28],[150,16],[175,20],[215,9],[240,13],[270,4],[300,4]];
  const d=pts.map(p=>p.join(",")).join(" ");
  const w=Math.round(300*done/total);
  return `<svg class="ridge" viewBox="0 0 300 44" preserveAspectRatio="none" aria-hidden="true">
   <defs><clipPath id="cp"><rect x="0" y="0" width="${w}" height="44"/></clipPath></defs>
   <polyline points="${d}" fill="none" stroke="var(--line)" stroke-width="3" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
   <polyline points="${d}" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linejoin="round" clip-path="url(#cp)" vector-effect="non-scaling-stroke"/></svg>`;
}

/* Draws the quiz into the page. opts: { wa: our WhatsApp number, onLead(quiz, rs): sends the lead,
   checkPhone(raw): '' when the number is fine, otherwise the error to show }. Returns a cleanup. */
export function mountTrekMatch(root,{wa,onLead,checkPhone}={}){
  const $=id=>root.querySelector("#"+id);
  const img=p=>ASSETS+p;
  const quiz=createQuiz();const {A,lead}=quiz;
  let step=0;let interacted=false;let tick=null;
  const app=$("app");
  const reduced=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;

  function render(){
    if(interacted&&step>=0){const r=app.getBoundingClientRect();if(r.top<0||r.top>innerHeight*0.6)app.scrollIntoView({behavior:reduced()?"auto":"smooth",block:"start"})}
    if(step<Q.length) return question();
    if(step===Q.length) return contact();
    return results();
  }

  function question(){
    interacted=interacted||step>0;
    const q=Q[step]; const val=A[q.key];
    if(q.peaks) return peaksQuestion(q);
    const tiles=TILE[q.key];
    app.innerHTML=`${tiles?"":`<div class="banner"><img src="${img(`q/${q.key}.webp`)}" alt=""></div>`}<div>
      ${ridge(step,Q.length+1)}
      <div class="ridge-meta"><span>שאלה ${step+1} מתוך ${Q.length}</span><span>בסוף: ההמלצות שלכם</span></div></div>
    <div style="display:flex;flex-direction:column;gap:6px"><h2 id="qt">${q.title}</h2>${q.hint?`<p class="lead">${q.hint}</p>`:""}${q.key==="alt"&&A.altAuto?`<p class="auto-note">סימנו לפי ההרים שציינתם. אפשר לשנות.</p>`:""}</div>
    <div class="opts ${tiles?"tiles":q.opts.length>3&&!q.opts.some(o=>o[2])?"two":""}" role="${q.multi?"group":"radiogroup"}" aria-labelledby="qt">
     ${q.opts.map(([v,l,s],i)=>{const on=q.multi?val.includes(v):val===v;const ph=tiles&&tiles[v];
       const inp=`<input id="q${step}o${i}" type="${q.multi?"checkbox":"radio"}" name="q${step}" value="${i}" ${on?"checked":""}>`;
       if(tiles) return `<label class="opt tile ${q.multi?"multi":""} ${ph?"":"noph"}">${inp}${ph?`<img class="ph" src="${img(ph)}" alt="" loading="lazy">`:""}<span class="dot"></span><span class="tx"><span><b>${l}</b>${s?`<small>${s}</small>`:""}</span></span></label>`;
       return `<label class="opt ${q.multi?"multi":""}">${inp}<span class="dot"></span><span><b>${l}</b>${s?`<small>${s}</small>`:""}</span></label>`}).join("")}
    </div>
    <div class="row"><button class="ghost" id="back"${step===0?" hidden":""}>חזרה</button><button class="primary" id="next">${step===Q.length-1?"כמעט שם":"המשך"}</button></div>`;
    const next=$("next");
    const sync=()=>{next.disabled=q.multi?!A[q.key].length:A[q.key]===undefined};
    app.querySelectorAll("input").forEach(inp=>inp.onchange=()=>{
      const v=q.opts[+inp.value][0];
      if(q.multi){
        if(v===q.any) A[q.key]=inp.checked?[q.any]:[];
        else{A[q.key]=A[q.key].filter(x=>x!==q.any&&x!==v); if(inp.checked)A[q.key].push(v)}
        app.querySelectorAll("input").forEach(i=>i.checked=A[q.key].includes(q.opts[+i.value][0]));
      } else { A[q.key]=v; setTimeout(()=>{step++;render()},180); }
      sync();
    });
    sync();
    next.onclick=()=>{step++;render()};
    $("back").onclick=()=>{step--;render()};
  }

  function peaksQuestion(q){
    A.donePick=A.donePick||[];A.doneText=A.doneText||"";
    const list=TRIPS.filter(t=>t.id!=="kilimanjaro-kosher").sort((a,b)=>a.alt-b.alt);
    app.innerHTML=`<div class="banner"><img src="${img("q/hero2.webp")}" alt=""></div><div>
      ${ridge(step,Q.length+1)}
      <div class="ridge-meta"><span>שאלה ${step+1} מתוך ${Q.length}</span><span>בסוף: ההמלצות שלכם</span></div></div>
    <div style="display:flex;flex-direction:column;gap:6px"><h2 id="qt">${q.title}</h2><p class="lead">${q.hint}</p></div>
    <fieldset><legend>מהמסעות שלנו</legend><div class="pills peaks" role="group" aria-labelledby="qt">
     ${list.map((t,i)=>`<label class="pill"><input type="checkbox" id="pk${i}" value="${t.id}" ${A.donePick.includes(t.id)?"checked":""}>${SHORT[t.id]} <span class="pa">${fmt(t.alt)}</span></label>`).join("")}
    </div></fieldset>
    <label class="field">הרים אחרים (לא חובה)<input id="peaktxt" autocomplete="off" placeholder="למשל: מון בלאן, טובקל, החרמון" value="${esc(A.doneText)}"></label>
    <p class="detected" id="det" aria-live="polite"></p>
    <div class="row"><button class="ghost" id="back">חזרה</button><button class="primary" id="next">המשך</button></div>`;
    const det=$("det"),next=$("next"),txt=$("peaktxt");
    const upd=()=>{quiz.syncDone();
      const p=parsePeaks(A.doneText);
      const extra=p.ids.filter(id=>!A.donePick.includes(id)).map(id=>SHORT[id]).concat(p.others.map(o=>`${o.name} (${fmt(o.alt)} מ')`));
      det.textContent=extra.length?`זיהינו: ${extra.join(", ")}`:"";
      next.textContent=A.done.length||A.doneOther.length?"המשך":"עוד לא עליתי על אף אחד מהם"};
    app.querySelectorAll(".peaks input").forEach(inp=>inp.onchange=()=>{
      A.donePick=inp.checked?[...A.donePick,inp.value]:A.donePick.filter(x=>x!==inp.value);upd()});
    txt.oninput=()=>{A.doneText=txt.value;upd()};
    upd();
    next.onclick=()=>{quiz.syncDone();const lv=levelOf(quiz.doneMax());
      if(lv>0&&(A.alt===undefined||A.alt<lv)){A.alt=lv;A.altAuto=true}
      step++;render()};
    $("back").onclick=()=>{step--;render()};
  }

  function contact(){
    app.innerHTML=`<div class="banner"><img src="${img("q/contact.webp")}" alt=""></div><div>${ridge(Q.length,Q.length+1)}<div class="ridge-meta"><span>שלב אחרון</span><span>בסוף: ההמלצות שלכם</span></div></div>
    <h2>לאן לשלוח את ההמלצות?</h2>
    <p class="lead">ההמלצות יופיעו כאן מיד. אם תרצו, נחזור אליכם בוואטסאפ כדי לענות על שאלות.</p>
    <form id="f" novalidate style="display:flex;flex-direction:column;gap:16px">
     <label class="field">שם פרטי<input id="name" autocomplete="given-name" value="${esc(lead.name)}"></label>
     <label class="field">מספר וואטסאפ<input id="phone" type="tel" autocomplete="tel" placeholder="050-1234567" value="${esc(lead.phone)}"></label>
     <label class="field">אימייל (לא חובה)<input id="email" type="email" autocomplete="email" value="${esc(lead.email)}"></label>
     <fieldset><legend>עם מי אתם יוצאים? (לא חובה)</legend><div class="pills">
       ${WITH.map((w,i)=>`<label class="pill"><input type="radio" name="with" id="w${i}" value="${w}" ${lead.with===w?"checked":""}>${w}</label>`).join("")}
     </div></fieldset>
     <label class="check"><input id="kosher" type="checkbox" ${lead.kosher?"checked":""}>שומרים כשרות ושבת</label>
     <label class="check"><input id="consent" type="checkbox" ${lead.consent?"checked":""}>${CONSENT}</label>
     <p class="err" id="err" role="alert"></p>
     <div class="row"><button type="button" class="ghost" id="back">חזרה</button><button class="primary" type="submit">הראו לי את ההמלצות</button></div>
    </form>`;
    $("back").onclick=()=>{step--;render()};
    $("f").onsubmit=e=>{
      e.preventDefault();
      lead.name=$("name").value.trim();
      lead.phone=$("phone").value.trim();
      lead.email=$("email").value.trim();
      lead.kosher=$("kosher").checked;
      lead.consent=$("consent").checked;
      const w=app.querySelector('input[name="with"]:checked'); lead.with=w?w.value:"";
      const err=$("err");
      if(!lead.name) return err.textContent="הוסיפו שם פרטי, כדי שנדע למי לפנות.";
      const phoneErr=checkPhone?checkPhone(lead.phone):(lead.phone.replace(/\D/g,"").length<9?"x":"");
      if(phoneErr) return err.textContent="הוסיפו מספר וואטסאפ מלא, למשל 050-1234567.";
      if(lead.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return err.textContent="כתובת האימייל לא תקינה. אפשר גם להשאיר אותה ריקה.";
      if(!lead.consent) return err.textContent="כדי להמשיך, סמנו שאתם מסכימים למדיניות הפרטיות.";
      /* The results are shown whatever the network does: the lead goes out on its own. */
      if(onLead){try{onLead(quiz,quiz.getResults().rs)}catch(_){/* never stops the results */}}
      step++;loading();
    };
  }

  function loading(){
    const msgs=["עוברים על המסעות…","מתאימים לתשובות שלכם…","כמעט מוכן…","מוכן"];
    app.innerHTML=`<div class="loading"><img src="${img("q/hero3.webp")}" alt=""><svg class="climb" viewBox="0 0 300 60" aria-hidden="true"><polyline points="0,56 40,44 70,50 110,32 140,38 180,20 205,26 245,10 270,16 300,4" fill="none" stroke="var(--line)" stroke-width="4" stroke-linejoin="round"/><polyline class="go" points="0,56 40,44 70,50 110,32 140,38 180,20 205,26 245,10 270,16 300,4" fill="none" stroke="var(--accent)" stroke-width="4" stroke-linejoin="round"/></svg><h2 id="lm">${msgs[0]}</h2></div>`;
    let i=0;const lm=$("lm");
    tick=setInterval(()=>{i++;if(i<msgs.length&&lm)lm.textContent=msgs[i];if(i>=msgs.length){clearInterval(tick);tick=null;step=Q.length+1;render()}},650);
  }

  function altBar(t){
    const max=8400,pct=v=>Math.min(100,v/max*100).toFixed(1);
    const you=ALT_LEVELS[A.alt];
    return `<div class="altw" role="img" aria-label="הגובה שלכם עד ${fmt(you)} מ', המסע מגיע ל־${fmt(t.alt)} מ'">
     <div class="altrow"><span>גובה המסע: <b>${fmt(t.alt)} מ'</b></span><span>הגבוה ביותר שלכם: <b>${A.alt===0?"מתחת ל־2,500":A.alt===4?"מעל 6,000":"עד "+fmt(you)} מ'</b></span></div>
     <div class="track" dir="ltr"><div class="fill" style="width:${pct(t.alt)}%"></div><div class="you" style="left:${pct(you)}%"></div><div class="peak" style="left:${pct(t.alt)}%"></div></div>
     <div class="scale" dir="ltr">${[0,2000,4000,6000,8000].map(v=>`<span style="left:${pct(v)}%">${fmt(v)}</span>`).join("")}</div></div>`;
  }

  function card(r,top){
    const t=r.t;
    const dn=quiz.doneNames();const msg=`היי HighAir, יצא לי ${t.name} בהתאמה של ${r.score}%. אשמח לשמוע על הקבוצה הבאה.${dn.length?` כבר עליתי על ${dn.join(", ")}.`:""}${lead.with?` אני יוצא/ת ${lead.with}.`:""} – ${lead.name}`;
    return `<article class="result ${top?"top":""}">
     <div class="cover"><img src="${img(`c/${t.id}.webp`)}" alt="${t.name}" loading="lazy">${top?`<span class="ribbon">ההתאמה הכי טובה</span>`:""}<span class="badge">${r.score}%<small>התאמה</small></span></div>
     <div><h3 style="font-size:${top?"24px":"19px"}">${t.name}</h3><p class="lead" style="font-size:14px">${t.country}</p></div>
     <p>${t.blurb}</p>
     <div class="facts"><span class="chip">${t.days} ימים</span><span class="chip" dir="ltr">${t.cur}${fmt(t.price)}+</span><span class="chip">${t.stayL}</span>${t.success?`<span class="chip">${t.success}% הצלחה</span>`:""}</div>
     ${GAL[t.id]?`<div class="thumbs" aria-label="תמונות מהמסע">${Array.from({length:GAL[t.id]},(_,i)=>`<button type="button" data-trip="${t.id}" data-i="${i}" aria-label="תמונה ${i+1} מ${t.name}"><img src="${img(`g/${t.id}-${i}.webp`)}" alt="" loading="lazy"></button>`).join("")}</div>`:""}
     ${altBar(t)}
     <ul class="why" aria-label="למה זה מתאים לכם">${r.reasons.map(x=>`<li>${x}</li>`).join("")}${r.heads.map(x=>`<li class="heads">${x}</li>`).join("")}</ul>
     <div class="row" style="justify-content:flex-start">
       <a class="btn ${top?"primary":"ghost"}" target="_blank" rel="noopener" href="https://wa.me/${wa}?text=${encodeURIComponent(msg)}">לשאלות בוואטסאפ</a>
       <a class="btn ghost" target="_blank" rel="noopener" href="${SITE}${t.id}">לפרטי המסלול</a>
     </div></article>`;
  }

  function results(){
    const {rs,fallback}=quiz.getResults();
    app.innerHTML=`<div class="eyebrow">ההמלצות שלכם</div>
     <h2>${esc(lead.name)}, ${fallback?"זו נקודת התחלה טובה":"אלה המסעות שהכי מתאימים לכם"}</h2>
     ${fallback&&rs.length?`<p class="lead">אף מסע לא עונה כרגע על כל מה שסימנתם. זה מסע טוב להתחיל ממנו, ונשמח לעזור לכם לתכנן את ההמשך.</p>`:""}
     ${!rs.length?`<p class="lead">עליתם כבר על כל המסעות שלנו. נשמח לדבר איתכם על הפרויקט הבא.</p><div class="row" style="justify-content:flex-start"><a class="btn primary" target="_blank" rel="noopener" href="https://wa.me/${wa}">לשיחה בוואטסאפ</a></div>`:""}
     ${(A.done||[]).length?`<p class="skipped">לא כללנו מסעות שכבר עשיתם: ${(A.done||[]).map(id=>SHORT[id]).join(", ")}</p>`:""}
     ${rs.map((r,i)=>card(r,i===0)).join("")}
     <p class="lead" style="font-size:14px">המחירים לאדם, בלי טיסות. מכל מסע, חלק הולך למאבק במחלת הסרטן.</p>
     <div class="row"><button class="ghost" id="again">להתחיל מחדש</button></div>`;
    app.querySelectorAll(".thumbs button").forEach(b=>b.onclick=()=>openLb(b.dataset.trip,+b.dataset.i));
    $("again").onclick=()=>{step=0;interacted=true;for(const k in A)delete A[k];A.season=[];A.region=[];A.donePick=[];A.doneText="";render()};
  }

  /* lightbox */
  let LB={list:[],i:0};
  const lb=$("lb"),lbimg=$("lbimg");
  function showLb(){const n=LB.list.length;LB.i=(LB.i+n)%n;const it=LB.list[LB.i];lbimg.src=it.src;lbimg.alt=it.cap;
    $("lbc").textContent=`${it.cap} · ${LB.i+1}/${n}`}
  function openList(list,i){LB={list,i};showLb();lb.hidden=false;$("lbx").focus()}
  function openLb(trip,i){const t=TRIPS.find(x=>x.id===trip);openList(Array.from({length:GAL[trip]},(_,k)=>({src:img(`g/${trip}-${k}.webp`),cap:t.name})),i)}
  const closeLb=()=>{lb.hidden=true};
  $("lbx").onclick=closeLb;
  $("lbn").onclick=()=>{LB.i++;showLb()};
  $("lbp").onclick=()=>{LB.i--;showLb()};
  lb.onclick=e=>{if(e.target===lb)closeLb()};
  const onKey=e=>{if(lb.hidden)return;if(e.key==="Escape")closeLb();if(e.key==="ArrowLeft"){LB.i++;showLb()}if(e.key==="ArrowRight"){LB.i--;showLb()}};
  document.addEventListener("keydown",onKey);

  /* the page around the quiz */
  const MOSAIC=[["q/hero3.webp","קפיצה מול האוורסט"],["q/hero5.webp","קבוצה בקילימנג'רו"],["q/hero1.webp","פסגה עם הדגל"],["q/stay.webp","ארוחת ערב באוהל"],["q/cold.webp","חבל מטפסים על אלברוס"],["q/hero4.webp","הקבוצה ליד אגם הרים"],["q/tech.webp","יציאה לפסגה עם פנסים"],["q/contact.webp","פסגה בשלג"]].map(([src,cap])=>({src:img(src),cap}));
  $("mosaic").innerHTML=MOSAIC.map((m,i)=>`<button type="button" data-i="${i}" aria-label="להגדלה: ${m.cap}"><img src="${m.src}" alt="${m.cap}" loading="lazy"></button>`).join("");
  root.querySelectorAll("#mosaic button").forEach(b=>b.onclick=()=>openList(MOSAIC,+b.dataset.i));
  const ladder=[...TRIPS].filter(t=>t.id!=="kilimanjaro-kosher").sort((a,b)=>a.alt-b.alt);
  $("ladder").innerHTML=ladder.map(t=>`<a class="peakcard" href="${SITE}${t.id}" target="_blank" rel="noopener"><img src="${img(`c/${t.id}.webp`)}" alt="" loading="lazy"><span class="alt-tag">${fmt(t.alt)} מ'</span><span class="pc-body"><b>${t.name}</b><small>${t.country} · ${t.days} ימים</small></span></a>`).join("");
  const startQuiz=e=>{e.preventDefault();$("quiz").scrollIntoView({behavior:reduced()?"auto":"smooth",block:"start"})};
  const starts=[...root.querySelectorAll("[data-start]")];
  starts.forEach(b=>b.addEventListener("click",startQuiz));
  const v=$("herovid");
  if(v&&reduced()){v.removeAttribute("autoplay");v.pause()}
  render();

  return ()=>{document.removeEventListener("keydown",onKey);starts.forEach(b=>b.removeEventListener("click",startQuiz));if(tick)clearInterval(tick)};
}
