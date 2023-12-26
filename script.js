(function(){
    var script = {
 "horizontalAlign": "left",
 "children": [
  "this.MainViewer",
  "this.veilPopupPanorama",
  "this.zoomImagePopupPanorama",
  "this.closeButtonPopupPanorama"
 ],
 "id": "rootPlayer",
 "defaultVRPointer": "laser",
 "scripts": {
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "existsKey": function(key){  return key in window; },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "getKey": function(key){  return window[key]; },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "registerKey": function(key, value){  window[key] = value; },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "unregisterKey": function(key){  delete window[key]; },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); }
 },
 "downloadEnabled": false,
 "borderSize": 0,
 "start": "this.init()",
 "scrollBarColor": "#000000",
 "width": "100%",
 "minHeight": 20,
 "borderRadius": 0,
 "overflow": "visible",
 "paddingRight": 0,
 "propagateClick": false,
 "verticalAlign": "top",
 "minWidth": 20,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "desktopMipmappingEnabled": false,
 "height": "100%",
 "definitions": [{
 "hfovMin": "135%",
 "hfov": 360,
 "label": "IMG_9294",
 "id": "panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6",
 "thumbnailUrl": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_t.jpg",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_t.jpg"
  }
 ],
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_6CE91973_66DE_528C_41D5_4E999AA55A24",
   "yaw": 131.44,
   "distance": 1,
   "backwardYaw": 30.2,
   "class": "AdjacentPanorama"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_74DBA0B8_66E1_D3FC_41CF_AA79E35A7354",
  "this.overlay_754BED5E_66E2_32B7_418B_0A2220C2B5C0",
  "this.overlay_AB036761_A4B9_3493_41B2_A0F6F7A46CF2",
  "this.popup_ABC4443F_A4BB_14EF_41D6_11D5BEC7BC1D",
  "this.overlay_B538007F_A4BB_0D6F_41DA_AD77317B5E60",
  "this.popup_B6C3629A_A4BB_0DB1_41B9_D26BCEC54002",
  "this.overlay_B580BABA_A4B9_7DF1_41E3_8324BA546E54",
  "this.popup_B6F2C025_A4B9_0C93_41CF_19D674403A28"
 ],
 "partial": false
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 145,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_B6EBF565_A489_1490_41DA_6AF359A91AE9",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMin": "120%",
 "hfov": 360,
 "label": "IMG_9296",
 "id": "panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906",
 "thumbnailUrl": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_t.jpg",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_t.jpg"
  }
 ],
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_6CE91973_66DE_528C_41D5_4E999AA55A24",
   "yaw": -1.35,
   "distance": 1,
   "backwardYaw": -99.69,
   "class": "AdjacentPanorama"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_76E289C2_66E2_358C_41C4_A562A71C0444",
  "this.overlay_77F70AF7_66E6_3774_41CF_630EACD1357F",
  "this.overlay_A9FB2BBC_A497_73F1_41A9_54A4CD78E76C",
  "this.popup_AACA030E_A489_0C91_41DE_0B35F543C396"
 ],
 "partial": false
},
{
 "hfovMin": "135%",
 "hfov": 360,
 "label": "IMG_9292",
 "id": "panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06",
 "thumbnailUrl": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_t.jpg",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_t.jpg"
  }
 ],
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_6CE91973_66DE_528C_41D5_4E999AA55A24",
   "yaw": 106.39,
   "distance": 1,
   "backwardYaw": 101.41,
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0",
   "yaw": 9.44,
   "distance": 1,
   "backwardYaw": 165.07,
   "class": "AdjacentPanorama"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_7502EC7F_66DE_5374_41A4_DC74BCA20B73",
  "this.overlay_72F8B044_66DE_5294_41C9_4F71D8FCCD6C",
  "this.overlay_7226913C_6726_D2F4_4193_90DBAE56649F",
  "this.overlay_7270E71E_6726_3EB4_41CE_83B4E5BC36C5"
 ],
 "partial": false
},
{
 "rotationY": 0,
 "hideDuration": 500,
 "rotationZ": 0,
 "class": "PopupPanoramaOverlay",
 "hfov": 4.16,
 "showEasing": "cubic_in",
 "id": "popup_ABD27E91_A489_15B3_41E1_D21A9C79AF9B",
 "rotationX": 0,
 "popupMaxWidth": "50%",
 "hideEasing": "cubic_out",
 "popupDistance": 100,
 "image": {
  "levels": [
   {
    "url": "media/popup_ABD27E91_A489_15B3_41E1_D21A9C79AF9B_0_0.png",
    "width": 405,
    "height": 133,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "pitch": 3.72,
 "popupMaxHeight": "50%",
 "showDuration": 500,
 "yaw": 74.56
},
{
 "items": [
  {
   "media": "this.panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906",
   "camera": "this.panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6CE91973_66DE_528C_41D5_4E999AA55A24",
   "camera": "this.panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6",
   "camera": "this.panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06",
   "camera": "this.panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0",
   "camera": "this.panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0",
   "camera": "this.panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "end": "this.trigger('tourEnded')"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -48.56,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_B6FA4573_A489_1770_419D_816C68347932",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "rotationY": 0,
 "hideDuration": 500,
 "rotationZ": 0,
 "class": "PopupPanoramaOverlay",
 "hfov": 5.02,
 "showEasing": "cubic_in",
 "id": "popup_B6C3629A_A4BB_0DB1_41B9_D26BCEC54002",
 "rotationX": 0,
 "popupMaxWidth": "50%",
 "hideEasing": "cubic_out",
 "popupDistance": 100,
 "image": {
  "levels": [
   {
    "url": "media/popup_B6C3629A_A4BB_0DB1_41B9_D26BCEC54002_0_0.png",
    "width": 471,
    "height": 134,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "pitch": 24.46,
 "popupMaxHeight": "50%",
 "showDuration": 500,
 "yaw": 65.06
},
{
 "rotationY": 0,
 "hideDuration": 500,
 "rotationZ": 0,
 "class": "PopupPanoramaOverlay",
 "hfov": 4.39,
 "showEasing": "cubic_in",
 "id": "popup_B6F2C025_A4B9_0C93_41CF_19D674403A28",
 "rotationX": 0,
 "popupMaxWidth": "50%",
 "hideEasing": "cubic_out",
 "popupDistance": 100,
 "image": {
  "levels": [
   {
    "url": "media/popup_B6F2C025_A4B9_0C93_41CF_19D674403A28_0_0.png",
    "width": 572,
    "height": 134,
    "class": "ImageResourceLevel"
   },
   {
    "url": "media/popup_B6F2C025_A4B9_0C93_41CF_19D674403A28_0_1.png",
    "width": 512,
    "height": 119,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "pitch": 9.86,
 "popupMaxHeight": "50%",
 "showDuration": 500,
 "yaw": -7.5
},
{
 "rotationY": 0,
 "hideDuration": 500,
 "rotationZ": 0,
 "class": "PopupPanoramaOverlay",
 "hfov": 3.72,
 "showEasing": "cubic_in",
 "id": "popup_AA507521_A489_3493_41DE_33C8C1F8C483",
 "rotationX": 0,
 "popupMaxWidth": "50%",
 "hideEasing": "cubic_out",
 "popupDistance": 100,
 "image": {
  "levels": [
   {
    "url": "media/popup_AA507521_A489_3493_41DE_33C8C1F8C483_0_0.png",
    "width": 520,
    "height": 118,
    "class": "ImageResourceLevel"
   },
   {
    "url": "media/popup_AA507521_A489_3493_41DE_33C8C1F8C483_0_1.png",
    "width": 512,
    "height": 116,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "pitch": 12.51,
 "popupMaxHeight": "50%",
 "showDuration": 500,
 "yaw": -83.1
},
{
 "rotationY": 0,
 "hideDuration": 500,
 "rotationZ": 0,
 "class": "PopupPanoramaOverlay",
 "hfov": 6.11,
 "showEasing": "cubic_in",
 "id": "popup_ABC4443F_A4BB_14EF_41D6_11D5BEC7BC1D",
 "rotationX": 0,
 "popupMaxWidth": "50%",
 "hideEasing": "cubic_out",
 "popupDistance": 100,
 "image": {
  "levels": [
   {
    "url": "media/popup_ABC4443F_A4BB_14EF_41D6_11D5BEC7BC1D_0_0.png",
    "width": 557,
    "height": 126,
    "class": "ImageResourceLevel"
   },
   {
    "url": "media/popup_ABC4443F_A4BB_14EF_41D6_11D5BEC7BC1D_0_1.png",
    "width": 512,
    "height": 115,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "pitch": -9.88,
 "popupMaxHeight": "50%",
 "showDuration": 500,
 "yaw": -70.45
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -14.93,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_B6E07557_A489_14B0_41E3_B787A87306FA",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 105,
  "yaw": 178.65,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_B6D77590_A489_17B0_41D3_E3E2EBD35650",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "rotationY": 0,
 "hideDuration": 500,
 "rotationZ": 0,
 "class": "PopupPanoramaOverlay",
 "hfov": 3.49,
 "showEasing": "cubic_in",
 "id": "popup_AA7B5A90_A48B_1DB1_41E4_60E1D0A81C01",
 "rotationX": 0,
 "popupMaxWidth": "50%",
 "hideEasing": "cubic_out",
 "popupDistance": 100,
 "image": {
  "levels": [
   {
    "url": "media/popup_AA7B5A90_A48B_1DB1_41E4_60E1D0A81C01_0_0.png",
    "width": 495,
    "height": 117,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "pitch": -10.21,
 "popupMaxHeight": "50%",
 "showDuration": 500,
 "yaw": -78.02
},
{
 "rotationY": 0,
 "hideDuration": 500,
 "rotationZ": 0,
 "class": "PopupPanoramaOverlay",
 "hfov": 2.64,
 "showEasing": "cubic_in",
 "id": "popup_AACA030E_A489_0C91_41DE_0B35F543C396",
 "rotationX": 0,
 "popupMaxWidth": "50%",
 "hideEasing": "cubic_out",
 "popupDistance": 100,
 "image": {
  "levels": [
   {
    "url": "media/popup_AACA030E_A489_0C91_41DE_0B35F543C396_0_0.jpg",
    "width": 505,
    "height": 126,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "pitch": 9.74,
 "popupMaxHeight": "50%",
 "showDuration": 500,
 "yaw": -0.8
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -78.59,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_B696C548_A489_1490_41DB_A0EB23B9FB04",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -149.8,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_B68D653A_A489_14F0_41AB_B9CE4E8340B2",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMin": "135%",
 "hfov": 360,
 "label": "IMG_9293",
 "id": "panorama_6CE91973_66DE_528C_41D5_4E999AA55A24",
 "thumbnailUrl": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_t.jpg",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_t.jpg"
  }
 ],
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6",
   "yaw": 30.2,
   "distance": 1,
   "backwardYaw": 131.44,
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06",
   "yaw": 101.41,
   "distance": 1,
   "backwardYaw": 106.39,
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906",
   "yaw": -99.69,
   "distance": 1,
   "backwardYaw": -1.35,
   "class": "AdjacentPanorama"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_71254270_6722_368C_41B5_EDFF37188934",
  "this.overlay_7F32016F_6722_5294_41D5_CBA394D9B704",
  "this.overlay_7D7FFA3F_673E_76F4_41C7_465F7F8572C0",
  "this.overlay_7F2C807B_673E_337C_4186_665F714B6836",
  "this.overlay_7C66257C_673E_5D74_41C0_8029EC25B870",
  "this.overlay_714D7328_6722_569C_41CE_74E2E6F154D2",
  "this.overlay_B5F0CA7C_A48B_1D71_41DB_BE847FD683C3",
  "this.overlay_ABEA287A_A489_1D71_41C7_D0E8EA3E855A",
  "this.popup_AA507521_A489_3493_41DE_33C8C1F8C483",
  "this.overlay_AB6B5042_A48F_0C91_41C2_381FF3AEC393",
  "this.popup_AB3325EA_A48F_1791_41D4_4486E7ECCE97",
  "this.overlay_ABBCA79C_A489_73B1_41B2_168DB954DA2F",
  "this.popup_AA76D9BC_A489_FFF1_41A8_D923EA6D6318",
  "this.popup_AA7B5A90_A48B_1DB1_41E4_60E1D0A81C01",
  "this.overlay_AA61B549_A489_7493_41D7_17CD242B2FFE",
  "this.popup_ABD27E91_A489_15B3_41E1_D21A9C79AF9B",
  "this.overlay_ABC56375_A4B7_3373_41D6_FCD35ED5DFA2",
  "this.popup_B61A8A62_A4B7_1C91_41C1_577D2251EE2C",
  "this.overlay_AB36D274_A4B7_0D71_41D2_2ED20A26811E",
  "this.popup_AA717C5C_A4B9_34B1_41CD_5D983AB5BE12"
 ],
 "partial": false
},
{
 "rotationY": 0,
 "hideDuration": 500,
 "rotationZ": 0,
 "class": "PopupPanoramaOverlay",
 "hfov": 4.12,
 "showEasing": "cubic_in",
 "id": "popup_AA717C5C_A4B9_34B1_41CD_5D983AB5BE12",
 "rotationX": 0,
 "popupMaxWidth": "50%",
 "hideEasing": "cubic_out",
 "popupDistance": 100,
 "image": {
  "levels": [
   {
    "url": "media/popup_AA717C5C_A4B9_34B1_41CD_5D983AB5BE12_0_0.png",
    "width": 455,
    "height": 134,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "pitch": -14.12,
 "popupMaxHeight": "50%",
 "showDuration": 500,
 "yaw": 131.53
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -73.61,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_B6CAC581_A489_1793_41D0_ABBFFE43C4B5",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -170.56,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_B627E59E_A489_17B0_41B8_1995606C6C25",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "rotationY": 0,
 "hideDuration": 500,
 "rotationZ": 0,
 "class": "PopupPanoramaOverlay",
 "hfov": 4.34,
 "showEasing": "cubic_in",
 "id": "popup_B61A8A62_A4B7_1C91_41C1_577D2251EE2C",
 "rotationX": 0,
 "popupMaxWidth": "50%",
 "hideEasing": "cubic_out",
 "popupDistance": 100,
 "image": {
  "levels": [
   {
    "url": "media/popup_B61A8A62_A4B7_1C91_41C1_577D2251EE2C_0_0.png",
    "width": 459,
    "height": 104,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "pitch": -1.46,
 "popupMaxHeight": "50%",
 "showDuration": 500,
 "yaw": 148.15
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 80.31,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_B60435BA_A489_17F0_41BF_49CE07479936",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "mouseControlMode": "drag_acceleration",
 "viewerArea": "this.MainViewer",
 "class": "PanoramaPlayer",
 "touchControlMode": "drag_rotation",
 "id": "MainViewerPanoramaPlayer",
 "displayPlaybackBar": true,
 "gyroscopeVerticalDraggingEnabled": true
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 143.97,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_B635B5AC_A489_1790_41E1_E1AD03DF8E5A",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 105,
  "yaw": -0.04,
  "pitch": -0.75,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMin": "135%",
 "hfov": 360,
 "label": "IMG_9291",
 "id": "panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0",
 "thumbnailUrl": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_t.jpg",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_t.jpg"
  }
 ],
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06",
   "yaw": 165.07,
   "distance": 1,
   "backwardYaw": 9.44,
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0",
   "yaw": -35,
   "distance": 1,
   "backwardYaw": -36.03,
   "class": "AdjacentPanorama"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_72677DF3_6722_2D8C_41D2_9C9E35EF9E94",
  "this.overlay_7E53E8DB_6722_33BC_41D9_BF25010D0C05",
  "this.overlay_7DBB20F2_6722_738C_41B6_4B0840E44DA0",
  "this.overlay_7EE83627_672E_7E94_41D3_951A549103C7",
  "this.overlay_B6F706A9_A4BF_1593_41D2_7B36F6DF5065",
  "this.popup_B4E0A6D3_A4BF_15B7_41D2_E3DB2AB85D45"
 ],
 "partial": false
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "rotationY": 0,
 "hideDuration": 500,
 "rotationZ": 0,
 "class": "PopupPanoramaOverlay",
 "hfov": 4.31,
 "showEasing": "cubic_in",
 "id": "popup_AA76D9BC_A489_FFF1_41A8_D923EA6D6318",
 "rotationX": 0,
 "popupMaxWidth": "50%",
 "hideEasing": "cubic_out",
 "popupDistance": 100,
 "image": {
  "levels": [
   {
    "url": "media/popup_AA76D9BC_A489_FFF1_41A8_D923EA6D6318_0_0.png",
    "width": 487,
    "height": 131,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "pitch": 6.99,
 "popupMaxHeight": "50%",
 "showDuration": 500,
 "yaw": 57.62
},
{
 "rotationY": 0,
 "hideDuration": 500,
 "rotationZ": 0,
 "class": "PopupPanoramaOverlay",
 "hfov": 4.49,
 "showEasing": "cubic_in",
 "id": "popup_AB3325EA_A48F_1791_41D4_4486E7ECCE97",
 "rotationX": 0,
 "popupMaxWidth": "50%",
 "hideEasing": "cubic_out",
 "popupDistance": 100,
 "image": {
  "levels": [
   {
    "url": "media/popup_AB3325EA_A48F_1791_41D4_4486E7ECCE97_0_0.png",
    "width": 591,
    "height": 134,
    "class": "ImageResourceLevel"
   },
   {
    "url": "media/popup_AB3325EA_A48F_1791_41D4_4486E7ECCE97_0_1.png",
    "width": 512,
    "height": 116,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "pitch": -6.9,
 "popupMaxHeight": "50%",
 "showDuration": 500,
 "yaw": -41.5
},
{
 "hfovMin": "135%",
 "hfov": 360,
 "label": "IMG_9290",
 "id": "panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0",
 "thumbnailUrl": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_t.jpg",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "colCount": 5,
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_t.jpg"
  }
 ],
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0",
   "yaw": -36.03,
   "distance": 1,
   "backwardYaw": -35,
   "class": "AdjacentPanorama"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_7333E564_6722_5294_41D8_E80B18514603",
  "this.overlay_74A961F0_6723_D58C_41BD_4B2B3AF327D3"
 ],
 "partial": false
},
{
 "rotationY": 0,
 "hideDuration": 500,
 "rotationZ": 0,
 "class": "PopupPanoramaOverlay",
 "hfov": 5.54,
 "showEasing": "cubic_in",
 "id": "popup_B4E0A6D3_A4BF_15B7_41D2_E3DB2AB85D45",
 "rotationX": 0,
 "popupMaxWidth": "50%",
 "hideEasing": "cubic_out",
 "popupDistance": 100,
 "image": {
  "levels": [
   {
    "url": "media/popup_B4E0A6D3_A4BF_15B7_41D2_E3DB2AB85D45_0_0.png",
    "width": 512,
    "height": 134,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "pitch": 4.64,
 "popupMaxHeight": "50%",
 "showDuration": 500,
 "yaw": -42.88
},
{
 "toolTipFontWeight": "normal",
 "playbackBarBackgroundColorDirection": "vertical",
 "id": "MainViewer",
 "playbackBarRight": 0,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderSize": 0,
 "progressBarBorderRadius": 0,
 "width": "100%",
 "playbackBarBorderRadius": 0,
 "toolTipShadowOpacity": 1,
 "minHeight": 50,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipFontFamily": "Arial",
 "toolTipFontStyle": "normal",
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressLeft": 0,
 "paddingRight": 0,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBorderRadius": 0,
 "height": "100%",
 "minWidth": 100,
 "playbackBarBorderSize": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "toolTipShadowHorizontalLength": 0,
 "playbackBarHeadShadowColor": "#000000",
 "progressRight": 0,
 "toolTipShadowVerticalLength": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressBarBackgroundColorDirection": "vertical",
 "toolTipFontColor": "#606060",
 "vrPointerSelectionTime": 2000,
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "progressBottom": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "shadow": false,
 "playbackBarHeadShadowOpacity": 0.7,
 "vrPointerColor": "#FFFFFF",
 "toolTipPaddingRight": 6,
 "toolTipBorderSize": 1,
 "progressBarOpacity": 1,
 "borderSize": 0,
 "toolTipPaddingTop": 4,
 "toolTipDisplayTime": 600,
 "toolTipPaddingLeft": 6,
 "progressBorderSize": 0,
 "displayTooltipInTouchScreens": true,
 "progressBorderRadius": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadShadowVerticalLength": 0,
 "transitionMode": "blending",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "transitionDuration": 500,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBarBorderColor": "#000000",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColorDirection": "vertical",
 "playbackBarLeft": 0,
 "playbackBarHeadOpacity": 1,
 "playbackBarBottom": 5,
 "progressBorderColor": "#000000",
 "toolTipShadowSpread": 0,
 "toolTipShadowBlurRadius": 3,
 "paddingBottom": 0,
 "toolTipTextShadowColor": "#000000",
 "toolTipOpacity": 1,
 "toolTipBorderColor": "#767676",
 "class": "ViewerArea",
 "toolTipFontSize": "1.11vmin",
 "paddingTop": 0,
 "toolTipPaddingBottom": 4,
 "paddingLeft": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipTextShadowBlurRadius": 3,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "data": {
  "name": "Main Viewer"
 },
 "toolTipShadowColor": "#333333",
 "playbackBarHeight": 10,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6
},
{
 "id": "veilPopupPanorama",
 "left": 0,
 "borderSize": 0,
 "right": 0,
 "backgroundOpacity": 0.55,
 "minHeight": 0,
 "borderRadius": 0,
 "paddingRight": 0,
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "backgroundColor": [
  "#000000"
 ],
 "top": 0,
 "minWidth": 0,
 "bottom": 0,
 "paddingBottom": 0,
 "paddingTop": 0,
 "class": "UIComponent",
 "paddingLeft": 0,
 "showEffect": {
  "duration": 350,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "backgroundColorDirection": "vertical",
 "visible": false,
 "shadow": false,
 "data": {
  "name": "UIComponent16567"
 }
},
{
 "id": "zoomImagePopupPanorama",
 "left": 0,
 "borderSize": 0,
 "right": 0,
 "backgroundOpacity": 1,
 "minHeight": 0,
 "borderRadius": 0,
 "paddingRight": 0,
 "backgroundColorRatios": [],
 "propagateClick": false,
 "backgroundColor": [],
 "top": 0,
 "minWidth": 0,
 "bottom": 0,
 "paddingBottom": 0,
 "paddingTop": 0,
 "class": "ZoomImage",
 "scaleMode": "custom",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical",
 "visible": false,
 "shadow": false,
 "data": {
  "name": "ZoomImage16568"
 }
},
{
 "iconLineWidth": 5,
 "horizontalAlign": "center",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "CloseButton16569"
 },
 "shadowBlurRadius": 6,
 "id": "closeButtonPopupPanorama",
 "fontFamily": "Arial",
 "iconColor": "#000000",
 "shadowColor": "#000000",
 "borderSize": 0,
 "right": 10,
 "backgroundOpacity": 0.3,
 "iconHeight": 20,
 "shadowSpread": 1,
 "pressedIconColor": "#888888",
 "minHeight": 0,
 "borderRadius": 0,
 "borderColor": "#000000",
 "paddingRight": 5,
 "backgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "propagateClick": false,
 "verticalAlign": "middle",
 "backgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "top": 10,
 "minWidth": 0,
 "rollOverIconColor": "#666666",
 "label": "",
 "mode": "push",
 "gap": 5,
 "iconBeforeLabel": true,
 "fontSize": "1.29vmin",
 "paddingBottom": 5,
 "fontStyle": "normal",
 "paddingTop": 5,
 "class": "CloseButton",
 "paddingLeft": 5,
 "showEffect": {
  "duration": 350,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "backgroundColorDirection": "vertical",
 "iconWidth": 20,
 "textDecoration": "none",
 "visible": false,
 "cursor": "hand",
 "shadow": false,
 "fontWeight": "normal",
 "layout": "horizontal"
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6CE91973_66DE_528C_41D5_4E999AA55A24, this.camera_B68D653A_A489_14F0_41AB_B9CE4E8340B2); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c"
 },
 "maps": [
  {
   "hfov": 15.36,
   "yaw": 131.44,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0_HS_0_1_0_map.gif",
      "width": 83,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -4.38,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_74DBA0B8_66E1_D3FC_41CF_AA79E35A7354",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "items": [
  {
   "hfov": 33.43,
   "image": "this.AnimatedImageResource_7CBD9DC0_6722_ED8C_41D4_E411CEF12921",
   "pitch": -12.06,
   "yaw": 123.24,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "data": {
  "label": "Arrow 02c Right-Up"
 },
 "maps": [
  {
   "hfov": 33.43,
   "yaw": 123.24,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0_HS_1_0_0_map.gif",
      "width": 26,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -12.06,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_754BED5E_66E2_32B7_418B_0A2220C2B5C0",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.showPopupPanoramaOverlay(this.popup_ABC4443F_A4BB_14EF_41D6_11D5BEC7BC1D, {'backgroundColorRatios':[0,0.09803921568627451,1],'rollOverIconWidth':20,'rollOverIconColor':'#666666','pressedBackgroundOpacity':0.3,'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverIconHeight':20,'rollOverBorderColor':'#000000','iconWidth':20,'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverBorderSize':0,'pressedIconHeight':20,'paddingBottom':5,'borderSize':0,'rollOverBackgroundColorDirection':'vertical','pressedIconWidth':20,'backgroundOpacity':0.3,'paddingTop':5,'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','iconColor':'#000000','iconHeight':20,'pressedBorderSize':0,'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','paddingLeft':5,'pressedIconLineWidth':5,'rollOverIconLineWidth':5,'paddingRight':5,'iconLineWidth':5,'rollOverBackgroundOpacity':0.3,'backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedBackgroundColorRatios':[0,0.09803921568627451,1],'borderColor':'#000000'}, null, null, null, null, null, false)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 6.11,
   "yaw": -70.45,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0_HS_2_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -9.88,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 6.11,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0_HS_2_0.png",
      "width": 119,
      "height": 119,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -70.45,
   "pitch": -9.88
  }
 ],
 "id": "overlay_AB036761_A4B9_3493_41B2_A0F6F7A46CF2",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.showPopupPanoramaOverlay(this.popup_B6C3629A_A4BB_0DB1_41B9_D26BCEC54002, {'backgroundColorRatios':[0,0.09803921568627451,1],'rollOverIconWidth':20,'rollOverIconColor':'#666666','pressedBackgroundOpacity':0.3,'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverIconHeight':20,'rollOverBorderColor':'#000000','iconWidth':20,'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverBorderSize':0,'pressedIconHeight':20,'paddingBottom':5,'borderSize':0,'rollOverBackgroundColorDirection':'vertical','pressedIconWidth':20,'backgroundOpacity':0.3,'paddingTop':5,'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','iconColor':'#000000','iconHeight':20,'pressedBorderSize':0,'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','paddingLeft':5,'pressedIconLineWidth':5,'rollOverIconLineWidth':5,'paddingRight':5,'iconLineWidth':5,'rollOverBackgroundOpacity':0.3,'backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedBackgroundColorRatios':[0,0.09803921568627451,1],'borderColor':'#000000'}, null, null, null, null, null, false)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 5.02,
   "yaw": 65.06,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0_HS_3_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 24.46,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 5.02,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0_HS_3_0.png",
      "width": 105,
      "height": 104,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 65.06,
   "pitch": 24.46
  }
 ],
 "id": "overlay_B538007F_A4BB_0D6F_41DA_AD77317B5E60",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.showPopupPanoramaOverlay(this.popup_B6F2C025_A4B9_0C93_41CF_19D674403A28, {'backgroundColorRatios':[0,0.09803921568627451,1],'rollOverIconWidth':20,'rollOverIconColor':'#666666','pressedBackgroundOpacity':0.3,'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverIconHeight':20,'rollOverBorderColor':'#000000','iconWidth':20,'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverBorderSize':0,'pressedIconHeight':20,'paddingBottom':5,'borderSize':0,'rollOverBackgroundColorDirection':'vertical','pressedIconWidth':20,'backgroundOpacity':0.3,'paddingTop':5,'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','iconColor':'#000000','iconHeight':20,'pressedBorderSize':0,'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','paddingLeft':5,'pressedIconLineWidth':5,'rollOverIconLineWidth':5,'paddingRight':5,'iconLineWidth':5,'rollOverBackgroundOpacity':0.3,'backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedBackgroundColorRatios':[0,0.09803921568627451,1],'borderColor':'#000000'}, null, null, null, null, null, false)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 4.39,
   "yaw": -7.5,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0_HS_4_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 9.86,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 4.39,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0_HS_4_0.png",
      "width": 85,
      "height": 87,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -7.5,
   "pitch": 9.86
  }
 ],
 "id": "overlay_B580BABA_A4B9_7DF1_41E3_8324BA546E54",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6CE91973_66DE_528C_41D5_4E999AA55A24, this.camera_B60435BA_A489_17F0_41BF_49CE07479936); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c"
 },
 "maps": [
  {
   "hfov": 10.71,
   "yaw": -1.35,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0_HS_0_1_0_map.gif",
      "width": 103,
      "height": 185,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 5.98,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_76E289C2_66E2_358C_41C4_A562A71C0444",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "items": [
  {
   "hfov": 17.15,
   "image": "this.AnimatedImageResource_72DC2FA9_6726_ED9C_41CA_E8AE1903B61B",
   "pitch": -1.57,
   "yaw": -2.08,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 02a"
 },
 "maps": [
  {
   "hfov": 17.15,
   "yaw": -2.08,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0_HS_1_0_0_map.gif",
      "width": 26,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -1.57,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_77F70AF7_66E6_3774_41CF_630EACD1357F",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.showPopupPanoramaOverlay(this.popup_AACA030E_A489_0C91_41DE_0B35F543C396, {'backgroundColorRatios':[0,0.09803921568627451,1],'rollOverIconWidth':20,'rollOverIconColor':'#666666','pressedBackgroundOpacity':0.3,'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverIconHeight':20,'rollOverBorderColor':'#000000','iconWidth':20,'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverBorderSize':0,'pressedIconHeight':20,'paddingBottom':5,'borderSize':0,'rollOverBackgroundColorDirection':'vertical','pressedIconWidth':20,'backgroundOpacity':0.3,'paddingTop':5,'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','iconColor':'#000000','iconHeight':20,'pressedBorderSize':0,'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','paddingLeft':5,'pressedIconLineWidth':5,'rollOverIconLineWidth':5,'paddingRight':5,'iconLineWidth':5,'rollOverBackgroundOpacity':0.3,'backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedBackgroundColorRatios':[0,0.09803921568627451,1],'borderColor':'#000000'}, null, null, null, null, null, false)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 2.64,
   "yaw": -0.8,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0_HS_2_0_0_map.gif",
      "width": 17,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 9.74,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 2.64,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0_HS_2_0.png",
      "width": 51,
      "height": 47,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -0.8,
   "pitch": 9.74
  }
 ],
 "id": "overlay_A9FB2BBC_A497_73F1_41A9_54A4CD78E76C",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6CE91973_66DE_528C_41D5_4E999AA55A24, this.camera_B696C548_A489_1490_41DB_A0EB23B9FB04); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c"
 },
 "maps": [
  {
   "hfov": 49.81,
   "yaw": 106.39,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0_HS_0_1_0_map.gif",
      "width": 115,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -9.38,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_7502EC7F_66DE_5374_41A4_DC74BCA20B73",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "items": [
  {
   "hfov": 37.59,
   "image": "this.AnimatedImageResource_7CBA1DBF_6722_EDF4_41BE_4AE18A4C1258",
   "pitch": -20.85,
   "yaw": 108.55,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 02a"
 },
 "maps": [
  {
   "hfov": 37.59,
   "yaw": 108.55,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0_HS_1_0_0_map.gif",
      "width": 26,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -20.85,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_72F8B044_66DE_5294_41C9_4F71D8FCCD6C",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0, this.camera_B6E07557_A489_14B0_41E3_B787A87306FA); this.mainPlayList.set('selectedIndex', 4)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c"
 },
 "maps": [
  {
   "hfov": 40.65,
   "yaw": 9.44,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0_HS_2_1_0_map.gif",
      "width": 120,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -8.42,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_7226913C_6726_D2F4_4193_90DBAE56649F",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "items": [
  {
   "hfov": 29.98,
   "image": "this.AnimatedImageResource_70DCFFFA_672E_ED7D_41D7_D87E54B0381E",
   "pitch": -13.92,
   "yaw": 7.17,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 02a"
 },
 "maps": [
  {
   "hfov": 29.98,
   "yaw": 7.17,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0_HS_3_0_0_map.gif",
      "width": 26,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -13.92,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_7270E71E_6726_3EB4_41CE_83B4E5BC36C5",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06, this.camera_B6CAC581_A489_1793_41D0_ABBFFE43C4B5); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c"
 },
 "maps": [
  {
   "hfov": 25.27,
   "yaw": 101.41,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_0_1_0_map.gif",
      "width": 117,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -4.89,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_71254270_6722_368C_41B5_EDFF37188934",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "items": [
  {
   "hfov": 27.29,
   "image": "this.AnimatedImageResource_713973F1_6722_558C_41C5_5DDF5415DD76",
   "pitch": -11.72,
   "yaw": 102.03,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 02c"
 },
 "maps": [
  {
   "hfov": 27.29,
   "yaw": 102.03,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_1_0_0_map.gif",
      "width": 26,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -11.72,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_7F32016F_6722_5294_41D5_CBA394D9B704",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6, this.camera_B6FA4573_A489_1770_419D_816C68347932); this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c"
 },
 "maps": [
  {
   "hfov": 12.65,
   "yaw": 30.2,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_2_1_0_map.gif",
      "width": 78,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -3.35,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_7D7FFA3F_673E_76F4_41C7_465F7F8572C0",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "items": [
  {
   "hfov": 32.27,
   "image": "this.AnimatedImageResource_713913F1_6722_558C_41D7_53B6E5FACF35",
   "pitch": -7.26,
   "yaw": 38.2,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "data": {
  "label": "Arrow 02c Left-Up"
 },
 "maps": [
  {
   "hfov": 32.27,
   "yaw": 38.2,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_3_0_0_map.gif",
      "width": 26,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -7.26,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_7F2C807B_673E_337C_4186_665F714B6836",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906, this.camera_B6D77590_A489_17B0_41D3_E3E2EBD35650); this.mainPlayList.set('selectedIndex', 0)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c"
 },
 "maps": [
  {
   "hfov": 20.98,
   "yaw": -99.69,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_4_1_0_map.gif",
      "width": 126,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -5.75,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_7C66257C_673E_5D74_41C0_8029EC25B870",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "items": [
  {
   "hfov": 24.78,
   "image": "this.AnimatedImageResource_7139B3F1_6722_558C_41CA_1BC7F122EAEC",
   "pitch": -9.45,
   "yaw": -99.97,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 02b"
 },
 "maps": [
  {
   "hfov": 24.78,
   "yaw": -99.97,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_5_0_0_map.gif",
      "width": 26,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -9.45,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_714D7328_6722_569C_41CE_74E2E6F154D2",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.showPopupPanoramaOverlay(this.popup_AA7B5A90_A48B_1DB1_41E4_60E1D0A81C01, {'backgroundColorRatios':[0,0.09803921568627451,1],'rollOverIconWidth':20,'rollOverIconColor':'#666666','pressedBackgroundOpacity':0.3,'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverIconHeight':20,'rollOverBorderColor':'#000000','iconWidth':20,'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverBorderSize':0,'pressedIconHeight':20,'paddingBottom':5,'borderSize':0,'rollOverBackgroundColorDirection':'vertical','pressedIconWidth':20,'backgroundOpacity':0.3,'paddingTop':5,'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','iconColor':'#000000','iconHeight':20,'pressedBorderSize':0,'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','paddingLeft':5,'pressedIconLineWidth':5,'rollOverIconLineWidth':5,'paddingRight':5,'iconLineWidth':5,'rollOverBackgroundOpacity':0.3,'backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedBackgroundColorRatios':[0,0.09803921568627451,1],'borderColor':'#000000'}, null, null, null, null, null, false)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 3.49,
   "yaw": -78.02,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_6_0_0_map.gif",
      "width": 16,
      "height": 17,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -10.21,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 3.49,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_6_0.png",
      "width": 68,
      "height": 74,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -78.02,
   "pitch": -10.21
  }
 ],
 "id": "overlay_B5F0CA7C_A48B_1D71_41DB_BE847FD683C3",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.showPopupPanoramaOverlay(this.popup_AA507521_A489_3493_41DE_33C8C1F8C483, {'backgroundColorRatios':[0,0.09803921568627451,1],'rollOverIconWidth':20,'rollOverIconColor':'#666666','pressedBackgroundOpacity':0.3,'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverIconHeight':20,'rollOverBorderColor':'#000000','iconWidth':20,'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverBorderSize':0,'pressedIconHeight':20,'paddingBottom':5,'borderSize':0,'rollOverBackgroundColorDirection':'vertical','pressedIconWidth':20,'backgroundOpacity':0.3,'paddingTop':5,'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','iconColor':'#000000','iconHeight':20,'pressedBorderSize':0,'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','paddingLeft':5,'pressedIconLineWidth':5,'rollOverIconLineWidth':5,'paddingRight':5,'iconLineWidth':5,'rollOverBackgroundOpacity':0.3,'backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedBackgroundColorRatios':[0,0.09803921568627451,1],'borderColor':'#000000'}, null, null, null, null, null, false)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 3.72,
   "yaw": -83.1,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_7_0_0_map.gif",
      "width": 17,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 12.51,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 3.72,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_7_0.png",
      "width": 73,
      "height": 68,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -83.1,
   "pitch": 12.51
  }
 ],
 "id": "overlay_ABEA287A_A489_1D71_41C7_D0E8EA3E855A",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.showPopupPanoramaOverlay(this.popup_AB3325EA_A48F_1791_41D4_4486E7ECCE97, {'backgroundColorRatios':[0,0.09803921568627451,1],'rollOverIconWidth':20,'rollOverIconColor':'#666666','pressedBackgroundOpacity':0.3,'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverIconHeight':20,'rollOverBorderColor':'#000000','iconWidth':20,'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverBorderSize':0,'pressedIconHeight':20,'paddingBottom':5,'borderSize':0,'rollOverBackgroundColorDirection':'vertical','pressedIconWidth':20,'backgroundOpacity':0.3,'paddingTop':5,'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','iconColor':'#000000','iconHeight':20,'pressedBorderSize':0,'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','paddingLeft':5,'pressedIconLineWidth':5,'rollOverIconLineWidth':5,'paddingRight':5,'iconLineWidth':5,'rollOverBackgroundOpacity':0.3,'backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedBackgroundColorRatios':[0,0.09803921568627451,1],'borderColor':'#000000'}, null, null, null, null, null, false)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 4.49,
   "yaw": -41.5,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_8_0_0_map.gif",
      "width": 18,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -6.9,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 4.49,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_8_0.png",
      "width": 86,
      "height": 73,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -41.5,
   "pitch": -6.9
  }
 ],
 "id": "overlay_AB6B5042_A48F_0C91_41C2_381FF3AEC393",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.showPopupPanoramaOverlay(this.popup_AA76D9BC_A489_FFF1_41A8_D923EA6D6318, {'backgroundColorRatios':[0,0.09803921568627451,1],'rollOverIconWidth':20,'rollOverIconColor':'#666666','pressedBackgroundOpacity':0.3,'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverIconHeight':20,'rollOverBorderColor':'#000000','iconWidth':20,'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverBorderSize':0,'pressedIconHeight':20,'paddingBottom':5,'borderSize':0,'rollOverBackgroundColorDirection':'vertical','pressedIconWidth':20,'backgroundOpacity':0.3,'paddingTop':5,'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','iconColor':'#000000','iconHeight':20,'pressedBorderSize':0,'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','paddingLeft':5,'pressedIconLineWidth':5,'rollOverIconLineWidth':5,'paddingRight':5,'iconLineWidth':5,'rollOverBackgroundOpacity':0.3,'backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedBackgroundColorRatios':[0,0.09803921568627451,1],'borderColor':'#000000'}, null, null, null, null, null, false)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 4.31,
   "yaw": 57.62,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_9_0_0_map.gif",
      "width": 16,
      "height": 17,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 6.99,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 4.31,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_9_0.png",
      "width": 83,
      "height": 91,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 57.62,
   "pitch": 6.99
  }
 ],
 "id": "overlay_ABBCA79C_A489_73B1_41B2_168DB954DA2F",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.showPopupPanoramaOverlay(this.popup_ABD27E91_A489_15B3_41E1_D21A9C79AF9B, {'backgroundColorRatios':[0,0.09803921568627451,1],'rollOverIconWidth':20,'rollOverIconColor':'#666666','pressedBackgroundOpacity':0.3,'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverIconHeight':20,'rollOverBorderColor':'#000000','iconWidth':20,'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverBorderSize':0,'pressedIconHeight':20,'paddingBottom':5,'borderSize':0,'rollOverBackgroundColorDirection':'vertical','pressedIconWidth':20,'backgroundOpacity':0.3,'paddingTop':5,'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','iconColor':'#000000','iconHeight':20,'pressedBorderSize':0,'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','paddingLeft':5,'pressedIconLineWidth':5,'rollOverIconLineWidth':5,'paddingRight':5,'iconLineWidth':5,'rollOverBackgroundOpacity':0.3,'backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedBackgroundColorRatios':[0,0.09803921568627451,1],'borderColor':'#000000'}, null, null, null, null, null, false)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 4.16,
   "yaw": 74.56,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_10_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 3.72,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 4.16,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_10_0.png",
      "width": 79,
      "height": 78,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 74.56,
   "pitch": 3.72
  }
 ],
 "id": "overlay_AA61B549_A489_7493_41D7_17CD242B2FFE",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.showPopupPanoramaOverlay(this.popup_B61A8A62_A4B7_1C91_41C1_577D2251EE2C, {'backgroundColorRatios':[0,0.09803921568627451,1],'rollOverIconWidth':20,'rollOverIconColor':'#666666','pressedBackgroundOpacity':0.3,'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverIconHeight':20,'rollOverBorderColor':'#000000','iconWidth':20,'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverBorderSize':0,'pressedIconHeight':20,'paddingBottom':5,'borderSize':0,'rollOverBackgroundColorDirection':'vertical','pressedIconWidth':20,'backgroundOpacity':0.3,'paddingTop':5,'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','iconColor':'#000000','iconHeight':20,'pressedBorderSize':0,'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','paddingLeft':5,'pressedIconLineWidth':5,'rollOverIconLineWidth':5,'paddingRight':5,'iconLineWidth':5,'rollOverBackgroundOpacity':0.3,'backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedBackgroundColorRatios':[0,0.09803921568627451,1],'borderColor':'#000000'}, null, null, null, null, null, false)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 4.34,
   "yaw": 148.15,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_11_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -1.46,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 4.34,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_11_0.png",
      "width": 83,
      "height": 85,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 148.15,
   "pitch": -1.46
  }
 ],
 "id": "overlay_ABC56375_A4B7_3373_41D6_FCD35ED5DFA2",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.showPopupPanoramaOverlay(this.popup_AA717C5C_A4B9_34B1_41CD_5D983AB5BE12, {'backgroundColorRatios':[0,0.09803921568627451,1],'rollOverIconWidth':20,'rollOverIconColor':'#666666','pressedBackgroundOpacity':0.3,'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverIconHeight':20,'rollOverBorderColor':'#000000','iconWidth':20,'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverBorderSize':0,'pressedIconHeight':20,'paddingBottom':5,'borderSize':0,'rollOverBackgroundColorDirection':'vertical','pressedIconWidth':20,'backgroundOpacity':0.3,'paddingTop':5,'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','iconColor':'#000000','iconHeight':20,'pressedBorderSize':0,'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','paddingLeft':5,'pressedIconLineWidth':5,'rollOverIconLineWidth':5,'paddingRight':5,'iconLineWidth':5,'rollOverBackgroundOpacity':0.3,'backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedBackgroundColorRatios':[0,0.09803921568627451,1],'borderColor':'#000000'}, null, null, null, null, null, false)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 4.12,
   "yaw": 131.53,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_12_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -14.12,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 4.12,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_12_0.png",
      "width": 81,
      "height": 79,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 131.53,
   "pitch": -14.12
  }
 ],
 "id": "overlay_AB36D274_A4B7_0D71_41D2_2ED20A26811E",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06, this.camera_B627E59E_A489_17B0_41B8_1995606C6C25); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c"
 },
 "maps": [
  {
   "hfov": 25.52,
   "yaw": 165.07,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0_HS_0_1_0_map.gif",
      "width": 116,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -6.2,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_72677DF3_6722_2D8C_41D2_9C9E35EF9E94",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "items": [
  {
   "hfov": 28.14,
   "image": "this.AnimatedImageResource_70DF8FFA_672E_ED7C_41AB_AF9B9D4F103D",
   "pitch": -10.56,
   "yaw": 165.67,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 02c"
 },
 "maps": [
  {
   "hfov": 28.14,
   "yaw": 165.67,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0_HS_1_0_0_map.gif",
      "width": 26,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -10.56,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_7E53E8DB_6722_33BC_41D9_BF25010D0C05",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0, this.camera_B635B5AC_A489_1790_41E1_E1AD03DF8E5A); this.mainPlayList.set('selectedIndex', 5)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c"
 },
 "maps": [
  {
   "hfov": 7.6,
   "yaw": -35,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0_HS_2_1_0_map.gif",
      "width": 27,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -7.29,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 7.6,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0_HS_2_0.png",
      "width": 146,
      "height": 1072,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "roll": 0,
   "yaw": -35,
   "pitch": -7.29
  }
 ],
 "id": "overlay_7DBB20F2_6722_738C_41B6_4B0840E44DA0",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "items": [
  {
   "hfov": 32.82,
   "image": "this.AnimatedImageResource_70DFEFFA_672E_ED7C_41D9_79272A4484E1",
   "pitch": -12.61,
   "yaw": -28.66,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "data": {
  "label": "Arrow 02c Left-Up"
 },
 "maps": [
  {
   "hfov": 32.82,
   "yaw": -28.66,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0_HS_3_0_0_map.gif",
      "width": 26,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -12.61,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_7EE83627_672E_7E94_41D3_951A549103C7",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.showPopupPanoramaOverlay(this.popup_B4E0A6D3_A4BF_15B7_41D2_E3DB2AB85D45, {'backgroundColorRatios':[0,0.09803921568627451,1],'rollOverIconWidth':20,'rollOverIconColor':'#666666','pressedBackgroundOpacity':0.3,'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverIconHeight':20,'rollOverBorderColor':'#000000','iconWidth':20,'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverBorderSize':0,'pressedIconHeight':20,'paddingBottom':5,'borderSize':0,'rollOverBackgroundColorDirection':'vertical','pressedIconWidth':20,'backgroundOpacity':0.3,'paddingTop':5,'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','iconColor':'#000000','iconHeight':20,'pressedBorderSize':0,'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','paddingLeft':5,'pressedIconLineWidth':5,'rollOverIconLineWidth':5,'paddingRight':5,'iconLineWidth':5,'rollOverBackgroundOpacity':0.3,'backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedBackgroundColorRatios':[0,0.09803921568627451,1],'borderColor':'#000000'}, null, null, null, null, null, false)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 5.54,
   "yaw": -42.88,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0_HS_4_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 4.64,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 5.54,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0_HS_4_0.png",
      "width": 106,
      "height": 109,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -42.88,
   "pitch": 4.64
  }
 ],
 "id": "overlay_B6F706A9_A4BF_1593_41D2_7B36F6DF5065",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0, this.camera_B6EBF565_A489_1490_41DA_6AF359A91AE9); this.mainPlayList.set('selectedIndex', 4)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c"
 },
 "maps": [
  {
   "hfov": 12.93,
   "yaw": -36.03,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0_HS_0_1_0_map.gif",
      "width": 48,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -7.12,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_7333E564_6722_5294_41D8_E80B18514603",
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "items": [
  {
   "hfov": 31.09,
   "image": "this.AnimatedImageResource_7CBA8DBF_6722_EDF4_41D3_3F9055F2F184",
   "pitch": -15.49,
   "yaw": -30.1,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "data": {
  "label": "Arrow 02b Left-Up"
 },
 "maps": [
  {
   "hfov": 31.09,
   "yaw": -30.1,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0_HS_1_0_0_map.gif",
      "width": 26,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -15.49,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_74A961F0_6723_D58C_41BD_4B2B3AF327D3",
 "rollOverDisplay": false
},
{
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_7CBD9DC0_6722_ED8C_41D4_E411CEF12921",
 "levels": [
  {
   "url": "media/panorama_6CE63367_66DE_7694_41C4_91B9E86B95C6_0_HS_1_0.png",
   "width": 400,
   "height": 360,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24
},
{
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_72DC2FA9_6726_ED9C_41CA_E8AE1903B61B",
 "levels": [
  {
   "url": "media/panorama_6CE64709_66DE_5E9C_41D2_ACED11D1F906_0_HS_1_0.png",
   "width": 400,
   "height": 360,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24
},
{
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_7CBA1DBF_6722_EDF4_41BE_4AE18A4C1258",
 "levels": [
  {
   "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0_HS_1_0.png",
   "width": 400,
   "height": 360,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24
},
{
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_70DCFFFA_672E_ED7D_41D7_D87E54B0381E",
 "levels": [
  {
   "url": "media/panorama_6CEB8018_66DE_52BC_41C2_566543B9CF06_0_HS_3_0.png",
   "width": 400,
   "height": 360,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24
},
{
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_713973F1_6722_558C_41C5_5DDF5415DD76",
 "levels": [
  {
   "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_1_0.png",
   "width": 400,
   "height": 360,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24
},
{
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_713913F1_6722_558C_41D7_53B6E5FACF35",
 "levels": [
  {
   "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_3_0.png",
   "width": 400,
   "height": 360,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24
},
{
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_7139B3F1_6722_558C_41CA_1BC7F122EAEC",
 "levels": [
  {
   "url": "media/panorama_6CE91973_66DE_528C_41D5_4E999AA55A24_0_HS_5_0.png",
   "width": 400,
   "height": 360,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24
},
{
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_70DF8FFA_672E_ED7C_41AB_AF9B9D4F103D",
 "levels": [
  {
   "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0_HS_1_0.png",
   "width": 400,
   "height": 360,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24
},
{
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_70DFEFFA_672E_ED7C_41D9_79272A4484E1",
 "levels": [
  {
   "url": "media/panorama_6CF795F4_66DE_3D74_41B4_B332B103D2F0_0_HS_3_0.png",
   "width": 400,
   "height": 360,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24
},
{
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_7CBA8DBF_6722_EDF4_41D3_3F9055F2F184",
 "levels": [
  {
   "url": "media/panorama_6DF2FA4F_66DE_D694_41D1_C56D6629CED0_0_HS_1_0.png",
   "width": 400,
   "height": 360,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24
}],
 "gap": 10,
 "scrollBarMargin": 2,
 "paddingBottom": 0,
 "backgroundPreloadEnabled": true,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "mouseWheelEnabled": true,
 "class": "Player",
 "vrPolyfillScale": 0.5,
 "paddingLeft": 0,
 "mobileMipmappingEnabled": false,
 "contentOpaque": false,
 "shadow": false,
 "data": {
  "name": "Player435"
 },
 "layout": "absolute"
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
