import './style-scroll.css'

import * as ScrollMagic from 'scrollmagic';

export function setupScroll() {
    const path = document.querySelector('path');
    const length = path!.getTotalLength();
    path!.style.strokeDasharray = length.toString();
    path!.style.strokeDashoffset = '0';

    var controller = new ScrollMagic.Controller();

    new ScrollMagic.Scene({
        triggerElement: "#trigger1",
        duration: 500
    })
    .setPin(".pin1")
    .triggerHook(0.05)
    .on('enter', () => drawPath(path!))
    .addTo(controller);

    new ScrollMagic.Scene({
        triggerElement: "#algo"
    })
    .setClassToggle(document.getElementById("contenuAlgo")!, "visibleGauche")
    .addTo(controller);

    new ScrollMagic.Scene({
        triggerElement: "#particules"
    })
    .setClassToggle(document.getElementById("contenuParticules")!, "visibleDroite")
    .addTo(controller);

    document.getElementById("go")!.addEventListener("click", function() {
        scrollToElement("titreProgrammation");
    });

    document.getElementById("kotlin")!.addEventListener("click", function() {
        scrollToElement("titreOOP");
    });
}

function drawPath(path : SVGPathElement) {
    const length = path!.getTotalLength();
    path.style.transition = 'stroke-dashoffset 1s ease-in-out';
    path.style.strokeDashoffset = length.toString();
}

function scrollToElement(id : string) {
    document.getElementById(id)!.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
}