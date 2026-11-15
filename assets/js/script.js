/*======================================================
                    ZIHA PORTFOLIO
                    script.js
======================================================*/

/*======================================================
HEADER AL HACER SCROLL
======================================================*/

const header = document.querySelector("header");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.getElementById("main-nav");

if (menuToggle && mainNav) {
    document.documentElement.classList.add("js-nav");
    const setMenu = (open) => {
        mainNav.classList.toggle("is-open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    };
    menuToggle.addEventListener("click", () => setMenu(!mainNav.classList.contains("is-open")));
    mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && mainNav.classList.contains("is-open")) { setMenu(false); menuToggle.focus(); }
    });
    document.addEventListener("click", event => {
        if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) setMenu(false);
    });
    window.matchMedia("(max-width: 900px)").addEventListener("change", () => setMenu(false));
}

window.addEventListener("scroll", () => {

    header?.classList.toggle("scrolled", window.scrollY > 50);

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

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
        const href = link.getAttribute("href");
        if (!href || href.length < 2) { event.preventDefault(); return; }
        const target = document.getElementById(href.slice(1));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
        history.replaceState(null, "", href);
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

if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove("hidden");
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });
    document.querySelectorAll(".hero-left, .hero-right, .project-card, .about-image, .about-content, .contact-info, .contact-form, .social-card, .footer-container").forEach(element => {
        // Keep keyboard navigation and tall project cards usable.
        element.classList.add("hidden");
        element.addEventListener("focusin", () => { element.classList.remove("hidden"); element.classList.add("show"); });
        observer.observe(element);
    });
}

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
    "Estudiante de ASIR",
    "Sistemas Linux",
    "Automatización Bash",
    "Redes y servidores",
    "Desarrollo Web"
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

if (!reducedMotion) typeWriter();

/*======================================================
                COUNTERS
======================================================*/

const counters = document.querySelectorAll(".counter");

if ("IntersectionObserver" in window && !reducedMotion) {
    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const counter = entry.target;
            const target = Number(counter.dataset.target);
            let start;
            const animate = time => {
                if (start === undefined) start = time;
                const progress = Math.min((time - start) / 900, 1);
                counter.textContent = Math.floor(target * progress);
                if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
            counterObserver.unobserve(counter);
        });
    }, {threshold: 0.5});
    counters.forEach(counter => counterObserver.observe(counter));
}

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

        totalHeight > 0 ? Math.max(0, Math.min(100, (window.scrollY / totalHeight) * 100)) : 0;

    progressBar.style.width = progress + "%";

});
/*======================================================
                FORMULARIO - EMAILJS
======================================================*/

if (typeof emailjs !== "undefined") emailjs.init({
    publicKey: "ehzp2IPeHCLHGcmDk"
});

const contactForm = document.getElementById("contact-form");
const formStatus = document.querySelector(".form-status");

if(contactForm){

    contactForm.addEventListener("submit", function(event){

        event.preventDefault();

        if (typeof emailjs === "undefined") {
            if (formStatus) { formStatus.textContent = "El formulario no está disponible. Escribe a contacto@ziha.es."; formStatus.classList.add("error"); }
            return;
        }

        const submitButton =
            contactForm.querySelector('button[type="submit"]');

        submitButton.disabled = true;

        submitButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

        if(formStatus){

            formStatus.textContent = "";

            formStatus.classList.remove("success","error");

        }

        emailjs.sendForm(
            "service_3bh1rm5",
            "template_8sjmdme",
            contactForm
        )
        .then(() => {

            if(formStatus){

                formStatus.textContent =
                    "✓ Mensaje enviado correctamente.";

                formStatus.classList.add("success");

            }

            contactForm.reset();

        })
        .catch((error) => {

            console.error("Error EmailJS:", error);

            if(formStatus){

                formStatus.textContent =
                    "No se pudo enviar el mensaje. Inténtalo de nuevo.";

                formStatus.classList.add("error");

            }

        })
        .finally(() => {

            submitButton.disabled = false;

            submitButton.innerHTML =
                '<i class="fa-solid fa-paper-plane"></i> Enviar mensaje';

        });

    });

}