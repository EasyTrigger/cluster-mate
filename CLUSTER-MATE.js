// ==UserScript==
// @id             iitc-plugin-cluster-mate
// @name           CLUSTER-MATE
// @category       Mods
// @author         @EasyTrigger
// @version        0.1.1.20160613.040600
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://github.com/EasyTrigger/cluster-mate/blob/master/CLUSTER-MATE.js
// @downloadURL    https://github.com/EasyTrigger/cluster-mate/blob/master/CLUSTER-MATE.js
// @description    See plug-in info prova
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @include        https://www.ingress.com/mission/*
// @include        http://www.ingress.com/mission/*
// @match          https://www.ingress.com/mission/*
// @match          http://www.ingress.com/mission/*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
if(typeof window.plugin !== 'function') window.plugin = function() {};

// PLUG-IN ////////////////////////////////////////////////////////////////////////////////////////////////
//  INFO  /////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
//  CLUSTER-MATE is a plugin born to monitor an anomaly site, it hides useless iitc tabs in a view-only  //
//  mode, prevents iitc to go idle, refreshes the browser periodically at user-defined time intervals    //
//  (not during measurements windows) to keep it fast and automatically cycles the map view between      //
//  clusters and site view during measurements displaying the remaining times.                           //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// REPLACE ANOMALY SITE AND CLUSTER URLs HERE //////////////////////////////////////////////////////
                                                                                                  //
  var siteurl  = 'https://www.ingress.com/intel?ll=43.703119,7.252933&z=13';  //ANOMALY SITE URL  //
  var cluster1 = 'https://www.ingress.com/intel?ll=43.704724,7.242192&z=18';  //CLUSTER 1 URL     //
  var cluster2 = 'https://www.ingress.com/intel?ll=43.706539,7.250049&z=18';  //CLUSTER 2 URL     //
  var cluster3 = 'https://www.ingress.com/intel?ll=43.703429,7.259114&z=18';  //CLUSTER 3 URL     //
  var cluster4 = 'https://www.ingress.com/intel?ll=43.699837,7.277654&z=18';  //CLUSTER 4 URL     //
                                                                                                  //
////////////////////////////////////////////////////////////////////////////////////////////////////

// SET TIMINGS HERE ///////////////////////////////////////////////////////////////
                                                                                 //
  var reload = 2; // Set time check for autoreloading intel map in MINUTES here  //
                                                                                 //
  var measurement1 = 14; // FIRST measurement (HOURS ONLY)                       //
  var measurement2 = 15; // FIRST measurement (HOURS ONLY)                       //
  var measurement3 = 16; // FIRST measurement (HOURS ONLY)                       //
  var measurement4 = 17; // FIRST measurement (HOURS ONLY)                       //
                                                                                 //
  var clusterview_stop = 10;  // Ending minute of measurement window             //
                                                                                 //
///////////////////////////////////////////////////////////////////////////////////

window.plugin.clusterCycle = function() {
  var clusterurl;
  var my_hour = new Date().getHours();
  switch (my_hour) {
  case measurement1: clusterurl = cluster1; cluster = 'CLUSTER 1'; break;
  case measurement2: clusterurl = cluster2; cluster = 'CLUSTER 2'; break;
  case measurement3: clusterurl = cluster3; cluster = 'CLUSTER 3'; break;
  case measurement4: clusterurl = cluster4; cluster = 'CLUSTER 4'; break;
  default: clusterurl = siteurl; cluster = 'ANOMALY SITE'; break;}
  if (new Date().getMinutes() > clusterview_stop) {cluster = 'ANOMALY SITE';}
  var my_min = new Date().getMinutes();
  if (my_min >= 0 && my_min < clusterview_stop) {
  if (window.location.href != clusterurl) {window.location.assign(clusterurl);}
  }else { if (window.location.href != siteurl) {window.location.assign(siteurl);}}
  idleReset();};

window.plugin.autoReload = function(elm) {
  var c = map.getCenter();
  var lat = Math.round(c.lat*1E6)/1E6;
  var lng = Math.round(c.lng*1E6)/1E6;
  var qry = 'll='+lat+','+lng+'&z=' + map.getZoom();
  var currenturl = ('https://www.ingress.com/intel?' + qry);
  var minrel = new Date().getMinutes();
  if (minrel > clusterview_stop && minrel <=59) {
  window.location.assign(currenturl);}};

window.plugin.clusterSec = function() {
  var my_min = new Date().getMinutes();
  var my_hour = new Date().getHours();
  var actualsec = new Date().getHours()*3600 + new Date().getMinutes()*60 + new Date().getSeconds();
  if (actualsec < measurement1 * 3600) {counter = measurement1 * 3600 - actualsec; nextcluster = 'CLUSTER 1'; view = 0;}
  else if (actualsec > measurement4 * 3600) {counter = 24 * 3600 - actualsec + measurement1 * 3600; nextcluster = 'CLUSTER 1'; view = 0;}
  else { if (actualsec > measurement1 * 3600 && actualsec < measurement2 * 3600) {counter = measurement2 * 3600 - actualsec; nextcluster = 'CLUSTER 2'; view = 0;}
  else if (actualsec > measurement2 * 3600 && actualsec < measurement3 * 3600) {counter = measurement3 * 3600 - actualsec; nextcluster = 'CLUSTER 3'; view = 0;}
  else if (actualsec > measurement3 * 3600 && actualsec < measurement4 * 3600) {counter = measurement4 * 3600 - actualsec; nextcluster = 'CLUSTER 4'; view = 0;}}
  if (my_min < clusterview_stop && my_hour === measurement1) {counter = measurement1 * 3600 + clusterview_stop * 60 - actualsec; view = 1;}
  else if (my_min < clusterview_stop && my_hour === measurement2) {counter = measurement2 * 3600 + clusterview_stop * 60 - actualsec; view = 1;}
  else if (my_min < clusterview_stop && my_hour === measurement3) {counter = measurement3 * 3600 + clusterview_stop * 60 - actualsec; view = 1;}
  else if (my_min < clusterview_stop && my_hour === measurement4) {counter = measurement4 * 3600 + clusterview_stop * 60 - actualsec; view = 1;}};

window.plugin.countDown = function() {
  var thh = Math.floor(counter / 3600);
  var tmm = Math.floor((counter - (thh * 3600)) /60);
  var tss = Math.floor((counter - (thh * 3600) - (tmm * 60)));
  var sh; var sm; var ss;
  if (thh !== 1) {sh = 's';} else {sh = '';}
  if (tmm !== 1) {sm = 's';} else {sm = '';}
  if (tss !== 1) {ss = 's';} else {ss = '';}
  if (view === 0) {$('#chatinput tr').text(cluster + ' -  Time before next view (' + nextcluster + '):  ' + thh + ' Hour'+sh + ' ' + tmm + ' Minute'+sm + ' ' + tss + ' Second'+ss); counter = counter-1;}
  else {$('#chatinput tr').text(cluster + ' -  MEASUREMENT TIME LEFT:  ' + tmm + ' Minute'+sm + ' ' + tss + ' Second'+ss); counter = counter-1;}
  $('#chatinput tr').attr('style', 'color: rgb(255, 206, 0) !important; text-align: center !important;');};

window.plugin.cleanCast = function() {
  $('#scrollwrapper').remove();
  $('#sidebartoggle').remove();
  $('#chatcontrols').remove();
  $('#chat').remove();
  $('#chatinput td').remove();
  $('a').remove(".leaflet-control-layers-toggle");
  $('a').remove(".leaflet-control-zoom-in");
  $('a').remove(".leaflet-control-zoom-out");
  $('.leaflet-bottom leaflet-left').remove();
  $('.leaflet-control-container').remove();};

var clustermate =  function() {
  var cluster;
  var nextcluster;
  var counter;
  var view;
  window.plugin.cleanCast();
  window.plugin.clusterSec();
  setInterval ( window.plugin.countDown, 1000);
  setInterval ( window.plugin.clusterCycle, 1000 );
  setInterval ( window.plugin.autoReload, reload*60*1000 );};

clustermate.info = plugin_info;
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(clustermate);
if(window.iitcLoaded && typeof clustermate === 'function') clustermate();
}
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);
