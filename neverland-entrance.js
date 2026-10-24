/* Opening the academy starts at the photographed school entrance.
   Intentional links to subjects, students, or other in-page areas still work. */
(()=>{'use strict';const atEntrance=()=>!location.hash||location.hash==='#entrance';if(atEntrance()&&'scrollRestoration' in history)history.scrollRestoration='manual';function showEntrance(){if(atEntrance())window.scrollTo({top:0,left:0,behavior:'instant'})}showEntrance();document.addEventListener('DOMContentLoaded',showEntrance);window.addEventListener('pageshow',showEntrance)})();
