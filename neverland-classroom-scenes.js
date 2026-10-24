/* Subject-specific photography for the academy; activity content and save data are unchanged. */
(()=>{'use strict';const base=new URL('.',document.currentScript.src);const scenes={
basic:'neverland-basic-classroom',mythology:'neverland-mythology-classroom',coding:'neverland-classroom',practice:'neverland-classroom',projects:'neverland-classroom',
word:'neverland-writing-room',writing:'neverland-writing-room',reading:'neverland-writing-room',
excel:'neverland-numbers-room',powerpoint:'neverland-presentation-room',music:'neverland-presentation-room',events:'neverland-presentation-room',
access:'neverland-records-room',reference:'neverland-records-room',
helpdesk:'neverland-technology-room',science:'neverland-technology-room',
business:'neverland-office-classroom',creative:'neverland-office-classroom',design:'neverland-office-classroom',
history:'neverland-history-room',civilrights:'neverland-history-room',remembrance:'neverland-history-room',slavery:'neverland-history-room',boston:'neverland-history-room',rome:'neverland-history-room',inventors:'neverland-history-room',atlantic:'neverland-history-room',colonies:'neverland-history-room',reconstruction:'neverland-history-room',egypt:'neverland-history-room',ancient:'neverland-history-room',medieval:'neverland-history-room',renaissance:'neverland-history-room',victorian:'neverland-history-room',revolution:'neverland-history-room',geography:'neverland-history-room',homeschool:'neverland-classroom',typing:'neverland-classroom'};
function active(){return !!document.body.dataset.neverlandClassroom||location.hash==='#area/Classrooms'}
function get(key,force=false){return(force||active())?new URL('rooms/'+(scenes[key]||'neverland-classroom')+'.webp',base).href:null}
window.NeverlandClassroomScenes={get,scenes};
})();
