const logoItems = [["DeRose Cookies", "Logo Design", "DeRose logo.png"], ["DeRose Cookies", "Logo Variation", "DeRose logo2.png"], ["Kamatla Holdings", "Brand Identity", "KAMATLA H.png"], ["Kamatla Holdings", "Logo Variation", "Kamatla-H.png"], ["Kamatla Holdings", "Premium Logo", "Kamatla.png"], ["KASITU Webs", "Brand Identity", "kasitu.webp"], ["Miss B's Fresh Eggs", "Logo Design", "MissBlogo.png"], ["Miss B's Fresh Eggs", "Logo Variation", "MissBlogo2.png"], ["Mumsy Braiding Studio", "Brand Identity", "mumsybraidingstudio.webp"], ["Thutis' Project", "Brand Identity", "thutisproject.png"]];
const designItems = [["KASITU Webs", "Website & Services", "black-blue.png", "flyer"], ["KASITU Webs", "Digital Services", "blue-othe.png", "flyer"], ["DeRose Cookies", "Menu / Price List", "de rose's other design_055317.png", "flyer"], ["DeRose Cookies", "Contact & Promotion", "de roses contact fixed_054054.png", "flyer"], ["Mumsy Braiding Studio", "Price List", "Flyerwiz_1774520479093.png", "flyer"], ["KASITU Webs", "Website Service Promotion", "Flyerwiz_1774522726815.png", "poster"], ["KASITU Webs", "Build a Website", "Flyerwiz_1774523175400.png", "poster"], ["Mumsy Braiding Studio", "Style Promotion", "Flyerwiz_1774621031425.png", "flyer"], ["Mumsy Braiding Studio", "Style Promotion", "Flyerwiz_1774626941812.png", "flyer"], ["Mumsy Braiding Studio", "Booking Promotion", "Flyerwiz_1774631967847.png", "poster"], ["Mumsy Braiding Studio", "Appointment Promotion", "Flyerwiz_1774640801330.png", "poster"], ["Mumsy Braiding Studio", "Styles Showcase", "Flyerwiz_1774641112012.png", "flyer"], ["Mumsy Braiding Studio", "Services Promotion", "Flyerwiz_1774641470144.png", "poster"], ["Mumsy Braiding Studio", "Price List", "Flyerwiz_1774643213843.png", "flyer"], ["Mumsy Braiding Studio", "Studio Promotion", "Flyerwiz_1774643853873.png", "poster"], ["Mumsy Braiding Studio", "Limited Time Offer", "Flyerwiz_1774645999757.png", "poster"], ["Mumsy Braiding Studio", "Studio Promotion", "Flyerwiz_1774646767046.png", "poster"], ["Mumsy Braiding Studio", "Hair Promotion", "Flyerwiz_1774647329614.png", "poster"], ["Mumsy Braiding Studio", "Hair Promotion", "Flyerwiz_1774648318961.png", "flyer"], ["DeRose Cookies", "Price List", "Flyerwiz_1774704288055.png", "flyer"], ["Mumsy Braiding Studio", "Business Promotion", "Flyerwiz_1774708485100.png", "poster"], ["KASITU Webs", "Web Design Promotion", "Flyerwiz_1774717899062.png", "poster"], ["KASITU Webs", "Website Development", "Flyerwiz_1774720023701.png", "poster"], ["KASITU Webs", "Business Registration", "Light-withiBusnessregother.png", "flyer"], ["KASITU Webs", "Web & App Services", "Ligth-with-businessreg.png", "flyer"], ["Miss B's Fresh Eggs", "Product Promotion", "missB new.png", "poster"], ["Malose Molefe", "Personal / Event Poster", "Mr Molefeee.png", "poster"], ["KASITU Webs", "Digital Solutions", "poster-blackgold.png", "poster"], ["KASITU Webs", "Digital Solutions", "poster-blue.png", "poster"], ["KASITU Webs", "Website & Apps", "poster-goldblack.png", "poster"]];

const logoGrid = document.getElementById("logoGrid");
const posterGrid = document.getElementById("posterGrid");
const flyerGrid = document.getElementById("flyerGrid");
const filters = document.querySelectorAll(".filter");
const sections = document.querySelectorAll(".work-section");

function esc(value){
    return String(value).replace(/[&<>"']/g, ch => ({
        "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[ch]));
}

function logoCard(item,index){
    const [title,type,file] = item;
return `<article class="logo-card design-item" data-type="logo" data-index="${index}"> 
    <div class="logo-image"><img src="../assets/logos/${encodeURIComponent(file)}" alt="${esc(title)} logo" loading="lazy"></div>
        <div class="logo-info"><strong>${esc(title)}</strong><span>${esc(type)}</span></div>
    </article>`;
}
function designCard(item,index){
    const [title,type,file,category] = item;
    return `<article class="design-card design-item" data-type="${category}" data-index="${index}">
<div class="design-image"><img src="../assets/designs/${encodeURIComponent(file)}"
 alt="${esc(title)} — ${esc(type)}" loading="lazy"></div>
        <div class="design-info"><strong>${esc(title)}</strong><span>${esc(type)}</span></div>
    </article>`;
}

logoGrid.innerHTML = logoItems.map(logoCard).join("");
posterGrid.innerHTML = designItems.map((x,i)=>x[3]==="poster" ? designCard(x,i) : "").join("");
flyerGrid.innerHTML = designItems.map((x,i)=>x[3]==="flyer" ? designCard(x,i) : "").join("");

function showFilter(filter){
    filters.forEach(btn => btn.classList.toggle("active", btn.dataset.filter === filter));
    sections.forEach(section => {
        const type = section.dataset.section;
        section.classList.toggle("hidden", !(filter === "all" || filter === "branding" || filter === type));
    });
    if(filter === "branding"){
        document.querySelector('[data-section="logo"]')?.scrollIntoView({behavior:"smooth",block:"start"});
    } else if(filter !== "all"){
        document.querySelector(`[data-section="${filter}"]`)?.scrollIntoView({behavior:"smooth",block:"start"});
    }
}
filters.forEach(btn => btn.addEventListener("click", () => showFilter(btn.dataset.filter)));
document.querySelectorAll("[data-filter-jump]").forEach(btn => btn.addEventListener("click", () => showFilter(btn.dataset.filterJump)));

/* Full-screen design preview */
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxMeta = document.getElementById("lightboxMeta");
let gallery = [];
let currentIndex = 0;

function openLightbox(items,index){
    gallery = items;
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden","false");
    document.body.style.overflow="hidden";
}
function updateLightbox(){
    const [title,type,file,category] = gallery[currentIndex];
const folder = category === "logo" ? "logos" : "designs";
lightboxImage.src = `../assets/${folder}/${encodeURIComponent(file)}`;
    lightboxImage.alt = `${title} — ${type}`;
    lightboxTitle.textContent = title;
    lightboxMeta.textContent = type;
}
function closeLightbox(){
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden","true");
    document.body.style.overflow="";
}
document.querySelectorAll(".logo-card").forEach((card,index)=>{
    card.addEventListener("click",()=>{
        openLightbox(logoItems.map(x=>[x[0],x[1],x[2],"logo"]),index);
    });
});
document.querySelectorAll(".design-card").forEach(card=>{
    card.addEventListener("click",()=>{
        const category=card.dataset.type;
        const original=Number(card.dataset.index);
        const items=designItems.filter(x=>x[3]===category);
        const local=items.findIndex(x=>x===designItems[original]);
        openLightbox(items,Math.max(0,local));
    });
});
document.querySelectorAll("[data-close]").forEach(el=>el.addEventListener("click",closeLightbox));
document.getElementById("prevBtn").addEventListener("click",()=>{
    currentIndex=(currentIndex-1+gallery.length)%gallery.length;
    updateLightbox();
});
document.getElementById("nextBtn").addEventListener("click",()=>{
    currentIndex=(currentIndex+1)%gallery.length;
    updateLightbox();
});
document.addEventListener("keydown",e=>{
    if(!lightbox.classList.contains("open")) return;
    if(e.key==="Escape") closeLightbox();
    if(e.key==="ArrowLeft") document.getElementById("prevBtn").click();
    if(e.key==="ArrowRight") document.getElementById("nextBtn").click();
});

/* Mobile menu */
const menuToggle=document.getElementById("menuToggle");
const mainNav=document.getElementById("mainNav");
menuToggle.addEventListener("click",()=>{
    const open=mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded",String(open));
});
mainNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded","false");
}));
window.addEventListener("scroll",()=>{
    if(window.scrollY>80) mainNav.classList.remove("open");
},{passive:true});

/* Theme */
const themeToggle=document.getElementById("themeToggle");
if(localStorage.getItem("kasitu-creative-theme")==="dark") document.body.classList.add("dark");
themeToggle.textContent=document.body.classList.contains("dark") ? "☀" : "☾";
themeToggle.addEventListener("click",()=>{
    document.body.classList.toggle("dark");
    const dark=document.body.classList.contains("dark");
    localStorage.setItem("kasitu-creative-theme",dark ? "dark" : "light");
    themeToggle.textContent=dark ? "☀" : "☾";
});

document.getElementById("year").textContent=new Date().getFullYear();
