/* Subject-specific photography for the academy; activity content and save data are unchanged. */
(()=>{'use strict';const base=new URL('.',document.currentScript.src);const scenes={games:'neverland-sidebar-games',puzzle:'neverland-sidebar-puzzles',visual:'neverland-sidebar-visual',maker:'neverland-sidebar-makers',hospital:'neverland-sidebar-operations',adventures:'neverland-fairy-glade',
basic:'neverland-basic-classroom',mythology:'neverland-mythology-classroom',coding:'neverland-office-classroom',practice:'neverland-office-classroom',projects:'neverland-office-classroom',
word:'neverland-writing-room',writing:'neverland-writing-room',reading:'neverland-sidebar-library',
excel:'neverland-numbers-room',powerpoint:'neverland-presentation-room',music:'neverland-sidebar-music',events:'neverland-presentation-room',
access:'neverland-records-room',reference:'neverland-records-room',
helpdesk:'neverland-technology-room',science:'neverland-technology-room',
business:'neverland-office-classroom',creative:'neverland-office-classroom',design:'neverland-sidebar-design',
history:'neverland-history-room',civilrights:'neverland-history-civilrights',remembrance:'neverland-history-remembrance',slavery:'neverland-history-slavery',boston:'neverland-history-boston',rome:'neverland-history-rome',inventors:'neverland-history-inventors',atlantic:'neverland-history-atlantic',colonies:'neverland-history-colonies',reconstruction:'neverland-history-reconstruction',egypt:'neverland-history-egypt',ancient:'neverland-history-room',medieval:'neverland-history-room',renaissance:'neverland-history-room',victorian:'neverland-history-room',revolution:'neverland-history-room',geography:'neverland-history-room',homeschool:'neverland-classroom',typing:'neverland-classroom'};
function active(){return !!document.body.dataset.neverlandClassroom||!!document.body.dataset.academyArea||location.hash.startsWith('#area/')}
function get(key,force=false){return(force||active())?new URL('rooms/'+(scenes[key]||scenes[window.NeverlandSidebar?.rooms[document.body.dataset.academyArea]?.key]||'neverland-classroom')+'.webp',base).href:null}
window.NeverlandClassroomScenes={get,scenes};
})();
