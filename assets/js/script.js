/*======================================================
                    ZIHA PORTFOLIO
                    script.js
======================================================*/

/*======================================================
HEADER AL HACER SCROLL
======================================================*/

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    header.classList.toggle("scrolled", window.scrollY > 50);

});

/*======================================================
BOTÓN VOLVER ARRIBA
======================================================*/

const backTop = document.querySelector(".back-top");

window.addEventListener("scroll", () => {

    if(window.scrollY > 600){

        backTop.style.opacity = "1";
        backTop.style.pointerEvents = "auto";

    }else{

        backTop.style.opacity = "0";
        backTop.style.pointerEvents = "none";

    }

});

/*======================================================
SCROLL SUAVE
======================================================*/

document.querySelectorAll('a[href^="#"]').forEach(link=>{

    link.addEventListener("click",(e)=>{

        e.preventDefault();

        const target=document.querySelector(

            link.getAttribute("href")

        );

        if(target){

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});

/*======================================================
AÑO AUTOMÁTICO
======================================================*/

const year = document.querySelector("#year");

if(year){

    year.textContent = new Date().getFullYear();

}
/*======================================================
            INTERSECTION OBSERVER
======================================================*/

const observer = new IntersectionObserver(

(entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},

{

    threshold:0.15

});

document.querySelectorAll(

".hero-left, .hero-right, .project-card, .about-image, .about-content, .contact-info, .contact-form, .social-card, .footer-container"

).forEach(element=>{

    element.classList.add("hidden");

    observer.observe(element);

});

/*======================================================
            MENÚ ACTIVO
======================================================*/

const sections = document.querySelectorAll("section");

const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll",()=>{

    let current = "";

    sections.forEach(section=>{

        const sectionTop = section.offsetTop - 150;

        if(window.scrollY >= sectionTop){

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link=>{

        link.classList.remove("active");

        if(

            link.getAttribute("href") === "#" + current

        ){

            link.classList.add("active");

        }

    });

});
/*======================================================
                TYPEWRITER EFFECT
======================================================*/

const words = [

    "Full Stack Developer",

    "Frontend Developer",

    "Backend Developer",

    "UI / UX Enthusiast",

    "Problem Solver"

];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

const typingElement = document.querySelector(".typing");

function typeWriter(){

    if(!typingElement) return;

    const currentWord = words[wordIndex];

    if(!deleting){

        typingElement.textContent =
            currentWord.substring(0,charIndex++);

        if(charIndex > currentWord.length){

            deleting = true;

            setTimeout(typeWriter,1500);

            return;

        }

    }else{

        typingElement.textContent =
            currentWord.substring(0,--charIndex);

        if(charIndex === 0){

            deleting = false;

            wordIndex++;

            if(wordIndex >= words.length){

                wordIndex = 0;

            }

        }

    }

    setTimeout(

        typeWriter,

        deleting ? 45 : 90

    );

}

typeWriter();

/*======================================================
                COUNTERS
======================================================*/

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(

(entries)=>{

    entries.forEach(entry=>{

        if(!entry.isIntersecting) return;

        const counter = entry.target;

        const target = Number(counter.dataset.target);

        let value = 0;

        const speed = target / 120;

        const update = ()=>{

            value += speed;

            if(value < target){

                counter.textContent =
                    Math.floor(value);

                requestAnimationFrame(update);

            }else{

                counter.textContent = target;

            }

        };

        update();

        counterObserver.unobserve(counter);

    });

},

{

    threshold:.5

}

);

counters.forEach(counter=>{

    counterObserver.observe(counter);

});

/*======================================================
            SCROLL PROGRESS BAR
======================================================*/

const progressBar = document.querySelector(".progress-bar");

window.addEventListener("scroll",()=>{

    if(!progressBar) return;

    const totalHeight =

        document.documentElement.scrollHeight -

        window.innerHeight;

    const progress =

        (window.scrollY / totalHeight) * 100;

    progressBar.style.width = progress + "%";

});