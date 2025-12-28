// Lightbox
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lightboxImg");
const lbClose = document.querySelector(".lightboxClose");

document.querySelectorAll(".galleryPremium img").forEach(img=>{
  img.addEventListener("click",()=>{
    lbImg.src = img.src;
    lb.classList.add("show");
  });
});

lbClose.onclick = ()=>lb.classList.remove("show");
lb.onclick = e=>{ if(e.target===lb) lb.classList.remove("show"); };

// Ripple effect (super lightweight)
document.querySelectorAll(".ripple").forEach(btn=>{
  btn.addEventListener("click",e=>{
    const r=document.createElement("span");
    const rect=btn.getBoundingClientRect();
    r.style.cssText=`
      position:absolute;
      width:20px;height:20px;
      border-radius:50%;
      background:rgba(255,255,255,.6);
      left:${e.clientX-rect.left}px;
      top:${e.clientY-rect.top}px;
      transform:scale(0);
      animation:ripple .6s linear;
      pointer-events:none;
    `;
    btn.appendChild(r);
    setTimeout(()=>r.remove(),600);
  });
});

// Ripple animation
const style=document.createElement("style");
style.textContent=`
@keyframes ripple{
  to{transform:scale(15);opacity:0}
}`;
document.head.appendChild(style);

// Service Worker
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("/sw.js").catch(()=>{});
}
