"use strict";(self["webpackChunkstargazer_front"]=self["webpackChunkstargazer_front"]||[]).push([[264],{5806:function(l,e){e["Z"]={HELITICS:"ХЕЛИТИКА",REBORIA:"РЕБОРИЯ",SHAN_LIGIA:"ШEН ЛИГИЯ",ELECTRODYNAMICS:"ЭЛЕКТРОДИНАМИКА",VITAISM:"ВИТАИЗМ",PSINERGICS:"ПСИНЕРГИИ",SEFIROMANTICS:"СЕФИРОМАНТИКА",THEURGY:"ТЕУРГИЯ",CATALYSTICS:"КАТАЛИСТИКА",COMBISTICS:"КОМБИСТИКА",DEMIPHYSICS:"ДЕМИФИЗИКА",PHOTOKINETICS:"ФОТОКИНЕТИКА",BIOGENETICS:"БИОГЕНЕТИКА",CYBERSYNTHETICS:"КИБЕРСИНТЕТИКА",PNEUMOPRETICS:"ПНЕВМОПРЕТИКА"}},5264:function(l,e,t){t.r(e),t.d(e,{default:function(){return j}});var a=t(6252),s=t(3577);const i={class:"title d-flex justify-content-between align-items-center"},r={class:"d-flex align-items-center"},n=(0,a._)("i",{class:"ra ra-blaster ra-2x me-1"},null,-1),o={class:"roll-stat clear-bg bordered"},u=(0,a._)("i",{class:"ra ra-wrench me-1"},null,-1),c={class:"d-flex panel p-2 mb-3"},d={class:"stat"},_=(0,a.Uk)(" Стамина: "),b={class:"stat__value ms-1",style:{color:"#6b7742"}},y={class:"stat"},m=(0,a.Uk)(" Фокус: "),p={class:"stat__value ms-1",style:{color:"#4e4277"}},k={class:"stat"},w=(0,a.Uk)(" ОД: "),E={class:"stat__value ms-1",style:{color:"#426b77"}},g={class:"stat",style:{"margin-left":"auto"}},I=(0,a.Uk)(" Откат: "),M={class:"stat__value ms-1"},T=(0,a._)("i",{class:"ra ra-clockwork"},null,-1),v={class:"row"},D={class:"col"},f={class:"col"},A=(0,a._)("div",{class:"clear-bg bordered p-2 mb-2"},[(0,a._)("b",null,"Тэги способности:"),(0,a.Uk)(" //В разработке ")],-1),N={class:"clear-bg bordered p-2"},C={class:"m-0 mb-2"},S=(0,a._)("b",null,"Цель: ",-1),q={key:0,class:"m-0 mb-2"},R=(0,a._)("b",null,"Дистанция: ",-1),U={class:"m-0 mb-2"},z=(0,a._)("b",null,"Травмоопасность: ",-1);function h(l,e,t,h,O,L){const G=(0,a.up)("Requirements");return(0,a.wg)(),(0,a.iD)("div",{class:"ability-popup popup-regular",style:(0,s.j5)(!O.isLoaded&&"cursor: progress")},[O.isLoaded?((0,a.wg)(),(0,a.iD)(a.HY,{key:0},[(0,a._)("div",i,[(0,a._)("div",r,[n,(0,a.Uk)(" "+(0,s.zw)(O.abilityType[O.abilityModel.ability_type].toUpperCase())+": "+(0,s.zw)(O.abilityModel.name),1)]),(0,a._)("div",o,[u,(0,a.Uk)(" "+(0,s.zw)(O.skillsAndKnowledge[O.abilityModel.roll_stat]),1)])]),(0,a._)("div",c,[(0,a._)("div",d,[_,(0,a._)("div",b,(0,s.zw)(O.abilityModel.consume_stamina),1)]),(0,a._)("div",y,[m,(0,a._)("div",p,(0,s.zw)(O.abilityModel.consume_focus),1)]),(0,a._)("div",k,[w,(0,a._)("div",E,(0,s.zw)(O.abilityModel.consume_od),1)]),(0,a._)("div",g,[I,(0,a._)("div",M,[(0,a.Uk)((0,s.zw)(O.abilityModel.cooldown),1),T])])]),(0,a._)("div",v,[(0,a._)("div",D,[(0,a.Wm)(G,{attributes:O.abilityModel.attr_req,skills:O.abilityModel.skill_req,tags:O.abilityModel.tag_req,"stop-tags":O.abilityModel.tag_stop},null,8,["attributes","skills","tags","stop-tags"])]),(0,a._)("div",f,[A,(0,a._)("div",N,[(0,a._)("p",C,[S,(0,a.Uk)(" "+(0,s.zw)(O.targetTypes[O.abilityModel.target_type])+" "+(0,s.zw)(O.abilityModel.locational?"(по части тела)":""),1)]),0!==O.abilityModel.min_distance&&0!==O.abilityModel.max_distance?((0,a.wg)(),(0,a.iD)("p",q,[R,(0,a.Uk)(" "+(0,s.zw)(O.abilityModel.min_distance)+" - "+(0,s.zw)(O.abilityModel.max_distance),1)])):(0,a.kq)("",!0),(0,a._)("p",U,[z,(0,a.Uk)(" "+(0,s.zw)(O.abilityModel.traumatic?"Присутствует":"Отсутствует"),1)]),(0,a.Uk)(" "+(0,s.zw)(O.abilityModel.description),1)])])])],64)):(0,a.kq)("",!0)],4)}var O=t(6387),L=t(2974),G={TECHNIQUE:"техника",MANEUVER:"маневр",FEINT:"финт",GENERIC:"действие"},H=t(5806),Z={SINGLE:"Единичная",SINGLE_IMMEDIATE:"Единичная, мгновенно",SELF:"На себя",AOE:"Область",AOE_IMMEDIATE:"Область, мгновенно"},x=t(8255),Y={name:"AbilityPopup",components:{Requirements:x.Z},data(){return{abilityModel:{},isLoaded:!1,abilityType:G,skillsAndKnowledge:H.Z,targetTypes:Z}},props:{popupData:{type:Object}},beforeMount(){(0,O.h)(this.popupData.params.isDefensive?L.Z.GETAbilityDefensive:L.Z.GETAbility,{queryPayload:{characterName:this.$store.state.selectedCharacterName,abilityName:this.popupData.params.id}}).then((l=>{this.abilityModel=l.data.ability,this.isLoaded=!0}))}},P=t(3744);const K=(0,P.Z)(Y,[["render",h]]);var j=K},8255:function(l,e,t){t.d(e,{Z:function(){return N}});var a=t(6252),s=t(3577);const i={class:"requirements"},r={class:"holdables__container tree-view"},n=(0,a._)("b",null,"Требования",-1),o={key:0},u={key:1},c=(0,a._)("li",null,[(0,a._)("i",{class:"ra ra-wrench"}),(0,a.Uk)(" Навыки")],-1),d={key:2},_=(0,a._)("li",null,[(0,a._)("i",{class:"ra ra-muscle-up"}),(0,a.Uk)(" Атрибуты")],-1),b={key:3},y=(0,a._)("li",null,[(0,a._)("i",{class:"ra ra-cog"}),(0,a.Uk)(" Тэги")],-1),m=(0,a._)("ul",null,[(0,a._)("li",null,"///в разработке")],-1),p=[y,m],k={key:4},w=(0,a._)("li",null,[(0,a._)("i",{class:"ra ra-anchor"}),(0,a.Uk)(" Запрещающие тэги")],-1),E=(0,a._)("ul",null,[(0,a._)("li",null,"///в разработке")],-1),g=[w,E];function I(l,e,t,y,m,w){return(0,a.wg)(),(0,a.iD)("div",i,[(0,a._)("ul",r,[n,t.extraRequirements?.requirementsArray.length>0?((0,a.wg)(),(0,a.iD)("ul",o,[(0,a._)("li",null,(0,s.zw)(t.extraRequirements.name),1),(0,a._)("ul",null,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(t.extraRequirements.requirementsArray,((l,e)=>((0,a.wg)(),(0,a.iD)("li",{key:m.componentId+e+"extra"},(0,s.zw)(l),1)))),128))])])):(0,a.kq)("",!0),t.skills?((0,a.wg)(),(0,a.iD)("ul",u,[c,(0,a._)("ul",null,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(w.filterZeroValues(Object.entries(t.skills)),((l,e)=>((0,a.wg)(),(0,a.iD)("li",{key:m.componentId+e+"skill"},(0,s.zw)(m.skillsAndKnowledge[l[0]])+": "+(0,s.zw)(l[1]),1)))),128))])])):(0,a.kq)("",!0),t.attributes?((0,a.wg)(),(0,a.iD)("ul",d,[_,(0,a._)("ul",null,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(w.filterZeroValues(Object.entries(t.attributes)),((l,e)=>((0,a.wg)(),(0,a.iD)("li",{key:m.componentId+e+"attr"},(0,s.zw)(m.attributesEnum[l[0]])+": "+(0,s.zw)(l[1]),1)))),128))])])):(0,a.kq)("",!0),t.tags?((0,a.wg)(),(0,a.iD)("ul",b,p)):(0,a.kq)("",!0),t.stopTags?((0,a.wg)(),(0,a.iD)("ul",k,g)):(0,a.kq)("",!0)])])}var M=t(5806),T={STRENGTH:"СИЛА",AGILITY:"ЛОВКОСТЬ",ENDURANCE:"ВЫНОСЛИВОСТЬ",PERCEPTION:"ВОСПРИЯТИЕ",INTELLIGENCE:"ИНТЕЛЛЕКТ",DETERMINATION:"РЕШИМОСТЬ"},v=t(2610),D={name:"Requirements",data(){return{componentId:"Requirements"+(0,v.t)(),skillsAndKnowledge:M.Z,attributesEnum:T}},props:["skills","attributes","tags","stopTags","extraRequirements"],methods:{filterZeroValues(l){return l.filter((l=>0!==l[1]))}}},f=t(3744);const A=(0,f.Z)(D,[["render",I]]);var N=A}}]);
//# sourceMappingURL=264.9fd283e3.js.map