$(document).ready(function () {
	if(window.localStorage.getItem('cndceUpdateAutomatically') == null) {
		window.localStorage.setItem('cndceUpdateAutomatically', true);
	}
	// Constants
	var HR_TO_SEC = 3600;
	var MIN_TO_SEC = 60;

	var SETTINGS_URL = './cndce-config.json';

	// Variables
	var cndceSettings;
	var activePlayer = undefined;


	var $currentCommentary;




	var $body = $('body');
	var $cndceContainer = $('#cndce-container');


	var $optionsContainer = $('#cndce-options-container');
	var $optionsScrollable = $('.cndce-options-scrollable', $optionsContainer);
	var $optionsVideos = $('.cndce-options-videos', $optionsContainer);
	var $optionsCommentaries = $('.cndce-options-commentaries', $optionsContainer);
	var $optionsVideoTemplate = $('.cndce-options-video.template', $optionsVideos).clone(true);
	var $optionsCommentaryTemplate = $('.cndce-options-commentary.template', $optionsCommentaries).clone(true);

	$optionsVideoTemplate.removeClass('template');
	$optionsCommentaryTemplate.removeClass('template');


	var $videoInformation = $('#cndce-video-information');

	var $videoSection = $('#cndce-video-section');
	var $videosContainer = $('#cndce-videos-container', $videoSection);
	var $videoCommentary = $('.cndce-video-commentary', $videoSection);



	var $iframeSection = $('#cndce-iframe-section');
	var $iframeBrowserContainer = $('#cndce-browser-container', $iframeSection);
	var $iframeBrowserScrollContainer = $('#cndce-browser-iframe-container', $iframeSection);
	var $iframeBrowserAddress = $('.cndce-browser-address', $iframeSection);
	var $iframeBrowserAddressInput = $('input', $iframeBrowserAddress);
	var $iframeBrowserTab = $('.cndce-browser-tab.active', $iframeSection)
	var $iframeBrowserOptionsButton = $('.cndce-browser-option.cndce-icon', $iframeSection);
	var $iframeBrowserIconButton = $('.cndce-browser-icon', $iframeSection);

	var $iframeUpdateContainer = $('.cndce-browser-option.cndce-update', $iframeSection);
	var $iframeUpdateVal = $('.cndce-update-val', $iframeUpdateContainer);
	var $iframeUpdateChoice = $('.cndce-update-choices', $iframeUpdateContainer);
	var $iframeUpdateFrequency = $('select', $iframeUpdateChoice);


	var $iframe = $('#cndce-browser-iframe', $iframeSection);


	var $iframeBrowserOptions = $('#cndce-browser-options', $iframeSection);
	var $iframeBrowserOptionsTemplate = $('.cndce-template[data-template="welcome-home"]', $iframeBrowserOptions);

	var $iframeBrowserOptionsVideos = $('.cndce-options-videos', $iframeBrowserOptions);
	var $iframeBrowserOptionsCommentaries = $('.cndce-options-commentaries tbody', $iframeBrowserOptions);
	var $iframeBrowserOptionsVideoTemplate = $('.cndce-options-video.template', $iframeBrowserOptionsVideos).clone(true);
	var $iframeBrowserOptionsCommentaryTemplate = $('.cndce-options-commentary.template', $iframeBrowserOptionsCommentaries).clone(true);


	$iframeBrowserOptionsVideoTemplate.removeClass('template');
	$iframeBrowserOptionsCommentaryTemplate.removeClass('template');




	var $commentariesSection = $('#cndce-commentary-section');
	// var $commentariesIframe = $('#cndce-commentary-iframe', $commentariesSection);
	var $commentariesScrollContainer = $('#cndce-commentary-iframe-container', $commentariesSection);

	var $commentaries;
	var $commentariesHtml = $('.cndce-template[data-template="commentary"]', $commentariesSection);

	var $commentariesTotalSpan = $('#welcome-commentary .commentary-type-total', $commentariesHtml);
	var $commentariesActiveSpan = $('#welcome-commentary .commentary-type-active', $commentariesHtml);
	var $commentariesTagsSpan = $('#welcome-commentary .commentary-type-tags', $commentariesHtml);



	// Resize Variables
	var $sectionResizeDiv = $('.cndce-resize', $cndceContainer);
	var $sectionResizeTarget;


	var onPlayerProgressInterval;


	// Mouse Variables
	var mouseX;
	var mouseY;


	// Get Parameters
	var getParamCommentaries;
	var getParamVideo;
	var getParamStartTime;
	var getParamConfig;


	// CommentaryCookie
	var hasCommentaryCookie;


	// Time
	var iframeLastUpdateTimestamp = new Date();



	function isLayoutMobile() {
		//AW The following line inexplicably fixes a problem on the Microsoft Edge browser where it incorrectly switches to narrow mode. 
		//AW This is because on Edge $body.width() is evidently not a reliable value - if you send it to the console you'll see it sometimes drops to 100 for no reason. Reading it into a dummy variable somehow avoids this false reading.
		var bodyWidthDummyVar = $body.width();
		return $body.width() <= 768;
	}

	function isLayoutPortrait() {
		return $body.width() < $body.height();
	}

	function isLayoutRelayout() {
		return $cndceContainer.hasClass('cndce-relayout');
	}

	function isVideoWithinMinWidth() {
		return $videoSection.width() > cndceSettings.minSizes.video.width;
	}

	function isCommentaryIframeWithinMinWidth() {
		return $commentariesSection.width() > cndceSettings.minSizes.commentIframe.width;
	}

	function isCommentaryIframeWithinMinHeight() {
		return $commentariesSection.height() > cndceSettings.minSizes.commentIframe.height;
	}

	function isBrowserIframeWithinMinWidth() {
		return $iframeSection.width() > cndceSettings.minSizes.browserIframe.width;
	}

	function isBrowserIframeWithinMinHeight() {
		return $iframeSection.height() > cndceSettings.minSizes.browserIframe.height;
	}

	function isSizeWithinMinimumsX() {
		return isCommentaryIframeWithinMinWidth()
			// && isCommentaryIframeWithinMinHeight()
			// && isBrowserIframeWithinMinWidth()
			&& isBrowserIframeWithinMinHeight()
			&& isVideoWithinMinWidth();
	}

	function isSizeWithinMinimumsY() {
		return isSizeWithinMinimumsX();
	}


	function isVideoWithinSmartRelayoutAspect() {
		var videoWidth = $commentariesSection.width();
		var videoHeight = $commentariesSection.height();
		var videoAspect = videoWidth / videoHeight;


		return videoAspect >= cndceSettings.smartRelayout.minVideoAspectRatio && videoAspect <= cndceSettings.smartRelayout.maxVideoAspectRatio;
	}

	function isVideoWithinSmartRelayoutBounds() {
		// var boundary = cndceSettings.smartRelayoutBoundary;
		var boundary = cndceSettings.minSizes.browserIframe.width;
		// var videoWidth = $videoSection.width();
		var videoWidth = $cndceContainer.width() - $videoSection.width();

		// if(boundary.indexOf('%') != 0){
		// 	boundary = $cndceContainer.width() * (parseFloat(boundary) / 100);
		// }

		return videoWidth > boundary;
	}


	function isCommentaryInGetParam(type){
		return getParamCommentaries.indexOf(type) != -1
	}

	function isCommentaryInCookie(type){
		var commentaryCookie = getLocalStorage('cndceCommentaries');


		return commentaryCookie.indexOf(type) != -1
	}

	function isCommentaryDefaultEnabled(commentary){
		return commentary.defaultEnabled != undefined && commentary.defaultEnabled;
	}


	function isIframeUpdatable(){
		var updateFrequency = $iframeUpdateFrequency.val();


		if(updateFrequency == 'never'){
			return false;

		}else if(updateFrequency == 'every'){
			return true;
		}


		var timeNow = new Date();
		var diffMSec = timeNow.getTime() - iframeLastUpdateTimestamp.getTime();


		if(diffMSec >= cndceSettings.autoUpdateInterval[updateFrequency])
			return true;


	}


	function playerSeekTo(sec, forcePlay) {
		// activePlayer.playVideo();
		// activePlayer.pauseVideo();
		activePlayer.seekTo(sec, true);
		// activePlayer.pauseVideo();

		if (forcePlay != undefined && forcePlay)
			activePlayer.playVideo();

	}

	function getTimeStringToSeconds(timeString) {
		var time = timeString.split(':');

		if (time.length != 3)
			return false;

		var timeSeconds = (parseInt(time[0]) * HR_TO_SEC) + (parseInt(time[1]) * MIN_TO_SEC) + parseInt(time[2]);

		return timeSeconds;
	}

	function getCookie(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}


	function getLocalStorage(name){
		var localStorage = window.localStorage.getItem(name);

		// Commentary cookie
		if(name == 'cndceCommentaries' && hasCommentaryCookie == undefined){
			if(localStorage == undefined)
				hasCommentaryCookie = false;
			else
				hasCommentaryCookie = true;

			console.log('cookieee', hasCommentaryCookie);
			
		}

		if (localStorage == undefined || localStorage == '') {
			localStorage = [];
		} else {
			localStorage = localStorage.split(',');
		}


		return localStorage;
	}

	function getParameter(parameterName) {
		var result = undefined,
			tmp = [];
		var items = location.search.substr(1).split("&");
		for (var index = 0; index < items.length; index++) {
			tmp = items[index].split("=");
			if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
		}

		return result;
	}


	function findCommentarySettingByType(commentaryType) {
		for (var i = 0; i < cndceSettings.commentaries.length; i++) {
			if (cndceSettings.commentaries[i].type == commentaryType)
				return cndceSettings.commentaries[i];
		}

		return undefined;
	}

	function initGetParameters() {
		getParamCommentaries = getParameter('commentary');

		if (getParamCommentaries != undefined) {
			getParamCommentaries = getParamCommentaries.split('+');
		} else {
			getParamCommentaries = [];
		}



		getParamVideo = getParameter('video');

		getParamStartTime = getParameter('start');

		getParamConfig = getParameter('config');

	}

	function initVideos() {
		for (var i = 0; i < cndceSettings.videos.length; i++) {
			var videoID = 'cndce-video-' + i;
			var $videoDiv = $('<div id="' + videoID + '"></div>');

			$videoDiv.addClass('cndce-video');

			$videosContainer.append($videoDiv);

			var playerVars = {
				'autoplay': 0,
				'playsinline': 1,
				'rel': 0
			};

			var events = {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange,
				'onPlaybackRateChange': onPlayerPlaybackRateChange
			};

			// Add start time if get param exists
			if (getParamStartTime != undefined && getParamStartTime != '') {
				playerVars.start = getTimeStringToSeconds(getParamStartTime);
				// playerVars.autoplay = 1;
			}

			var videoPlayer = new YT.Player(videoID, {
				videoId: cndceSettings.videos[i].id,
				playerVars: playerVars,
				events: events
			});


			// Add video to options - Options Window
			var $videoOption = $optionsVideoTemplate.clone(true);
			$('.cndce-options-video-name', $videoOption).text(cndceSettings.videos[i].name);

			$('input', $videoOption).data('ivideo', i);

			$optionsVideos.append($videoOption);


			// Add video to options - Options Browser Window
			var $iframeBrowserVideoOption = $iframeBrowserOptionsVideoTemplate.clone(true);
			var $iframeBrowserVideoInput = $('input', $iframeBrowserVideoOption);

			$('.cndce-options-video-name', $iframeBrowserVideoOption).text(cndceSettings.videos[i].name);

			$iframeBrowserVideoInput.data('ivideo', i);
			$iframeBrowserVideoInput.attr('name', 'cndce-browser-option-video');


			$iframeBrowserOptionsVideos.append($iframeBrowserVideoOption);



			cndceSettings.videos[i].player = videoPlayer;
			cndceSettings.videos[i].$inputBox = $videoOption.add($iframeBrowserVideoOption);

		}
	}

	function initCommentaries() {

		var commentaryCookie = getLocalStorage('cndceCommentaries');


		for (var i = 1; i < cndceSettings.commentaries.length; i++) {


			if (!$('a', $commentariesTagsSpan).hasClass(cndceSettings.commentaries[i].type)) {
				// Add commentary tags
				// TODO: Organize style
				var $tag = $(document.createElement('a'));

				$tag.addClass(cndceSettings.commentaries[i].type);
				$tag.addClass('hidden');
				$tag.addClass('cndce-open-options cndce-open-commentaries');
				$tag.text(cndceSettings.commentaries[i].name);
				$tag.css({
					'background': cndceSettings.commentaries[i].color
				});

				$commentariesTagsSpan.append($tag)



				// Add commentary to option - Options Window
				var $commentaryOption = $optionsCommentaryTemplate.clone(true);
				var $iframeBrowserCommentaryOption = $iframeBrowserOptionsCommentaryTemplate.clone(true);


				var $commentaryOptions = $commentaryOption.add($iframeBrowserCommentaryOption);


				$('.cndce-options-commentary-name', $commentaryOptions).text(cndceSettings.commentaries[i].name);
				$('.cndce-options-commentary-description', $commentaryOptions).text(cndceSettings.commentaries[i].description);

				if(cndceSettings.commentaries[i].description == ''){
					$('.cndce-options-commentary-dash', $commentaryOption).css({
						display: 'none'
					})

				}

				$commentaryOptions.css({
					background: cndceSettings.commentaries[i].color
				})

				var $inputCommentaryOption = $('input', $commentaryOptions);

				$inputCommentaryOption.data('icommentary', i);
				$inputCommentaryOption.attr('data-commentary-type', cndceSettings.commentaries[i].type);




				$optionsCommentaries.append($commentaryOption);
				$iframeBrowserOptionsCommentaries.append($iframeBrowserCommentaryOption);


				cndceSettings.commentaries[i].$inputBox = $commentaryOptions;
				$inputCommentaryOption.data('$copy', $inputCommentaryOption);




				// console.log('option storage=======>', $optionsCommentaries);




				// Load Cookie and Get Parameter
				var commentaryType = cndceSettings.commentaries[i].type;
				if ( isCommentaryInGetParam(commentaryType)
					|| (getParamCommentaries.length == 0 && (isCommentaryInCookie(commentaryType)
						|| (!hasCommentaryCookie && isCommentaryDefaultEnabled(cndceSettings.commentaries[i]))))
				) {
					// loadCommentaries(cndceSettings.commentaries[i]);
					$inputCommentaryOption.prop('checked', true);

					$inputCommentaryOption.trigger('change');
					;
				}
			}


		}

		// First commentary available by default
		loadCommentaries(cndceSettings.commentaries[0]);


	}


	function initCommentary($commentary, type) {

		var timeSeconds = getTimeStringToSeconds($commentary.attr('time'));


		$commentary.attr('data-time-sec', timeSeconds);
		

		if (type != undefined){
			$commentary.attr('type', type);

			var settings = findCommentarySettingByType(type);
			$commentary.css({
				background: settings.color
			})

		}
	}


	function initCommentaryTemplate(){

		$commentaries = $('commentary', $commentariesHtml);

		$commentaries.each(function (e) {
			initCommentary($(this));
		})

		// $commentariesActiveSpan.text(0);
		$commentariesActiveSpan.text($('input:checked', $optionsCommentaries).length);

		$commentariesTotalSpan.text(cndceSettings.commentaries.length - 1);


		initCommentaries();



	}


	function loadCommentaries(commentary) {
		if (commentary == undefined)
			return false;


		if (commentary.isLoaded != undefined && commentary.isLoaded) {
			return false;
		}



		var commentaryUrl = cndceSettings.commentariesBaseUrl + commentary.url;

		// Check for cross domain URLS
		if(commentary.url.indexOf('http://') != -1 || commentary.url.indexOf('https://') != -1){
			commentaryUrl = commentary.url;
		}

		commentary.isLoaded = true;

		if (commentary.$inputBox != undefined)
			$('input', commentary.$inputBox).prop('checked', true);



		$.ajax({
			url: commentaryUrl,
			dataType: 'html',
			success: function (doc) {
				var $newCommentaries = $(doc).filter('commentary');


				$newCommentaries.each(function () {
					var $newCommentary = $(this);
					initCommentary($newCommentary, commentary.type);


					// For first commentary
					// if ($commentaries == undefined || $commentaries.length == 0) {
					// 	$('body', $commentariesHtml).append($newCommentary);

					// 	$commentaries = $('commentary', $commentariesHtml);
					// }


					// TODO: Clean implementation. Sort commentary by time
					$commentaries.each(function (i) {
						$commentary = $(this);

						if (parseInt($commentary.attr('data-time-sec')) > parseInt($newCommentary.attr('data-time-sec'))) {

							$commentary.before($newCommentary);

							// $newCommentary.css('height', $newCommentary.height());
							// console.log('FIST',$newCommentary.height());


							$commentaries = $('commentary', $commentariesHtml);


							return false;
						}

						if (i == $commentaries.length - 1) {
							$commentary.after($newCommentary);

							// $newCommentary.css('height', 'auto');
							// console.log('SECOND',$newCommentary.height(), $newCommentary.outerHeight(), $newCommentary[0].outerHeight);
							// $newCommentary.css('height', $newCommentary.height());

							$commentaries = $('commentary', $commentariesHtml);


							return false;
						}

					})
				})



			}
		});


	}

	function loadYoutubeIframeAPI() {
		var script = document.createElement('script');
		script.src = "//www.youtube.com/iframe_api";

		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
	}

	function setPlayerProgressInterval() {
		if (onPlayerProgressInterval != undefined) {
			clearTimeout(onPlayerProgressInterval);
		}

		onPlayerProgress();
		onPlayerProgressInterval = setInterval(onPlayerProgress, 1000 / activePlayer.getPlaybackRate());
	}

	function setCommentaryOnProgress($commentary) {
		$videoCommentary.text($commentary.text());

		$commentaries.removeClass('active');
		$commentary.addClass('active');

		$commentariesHtml.animate({ scrollTop: $commentariesHtml.scrollTop() + $commentary.position().top }, 300);


		if ($commentary.attr('iframe') != undefined) {
			if (isIframeUpdatable()){
				setBrowserPage($commentary.attr('iframe'), $commentary.attr('iframe-preview'), true);

				// Remove options page
				if(!isLayoutMobile()){
					$cndceContainer.removeClass('options-shown');
				}
			}
		}


		// Add highlight effect
		$commentary.addClass('highlight');

		setTimeout(function () {
			$commentary.removeClass('highlight');
		}, 750);

		// console.log($commentary);

	}

	function setBrowserPage(url, isPreview, setIframeSrc) {
		var urlText = url;

		if (isPreview != undefined && isPreview) {
			url = './preview.php?' + url;
		}

		if (setIframeSrc) {
			$iframe[0].src = url;
		}

		if (urlText.indexOf('./pages/') != -1)
			urlText = '';

		$iframeBrowserAddressInput.val(urlText);

		$('.cndce-browser-tab-text', $iframeBrowserTab).text(urlText);

	}


	function setActivePlayer(video) {
		if (activePlayer == video.player)
			return;


		// Make sure radio button is selected
		$('input', video.$inputBox).prop('checked', true);



		$('.active', $videosContainer).removeClass('active');

		var currentTime = 0;
		var currentPlaybackRate = 1;
		var currentState = YT.PlayerState.UNSTARTED;

		if (activePlayer != undefined) {
			console.log('active');
			activePlayer.pauseVideo();
			currentTime = activePlayer.getCurrentTime();
			currentPlaybackRate = activePlayer.getPlaybackRate();
			currentState = activePlayer.getPlayerState();


		}


		activePlayer = video.player;
		$(activePlayer.getIframe()).addClass('active');

		if (currentTime != 0)
			activePlayer.seekTo(currentTime);

		if (activePlayer.setPlaybackRate != undefined)
			activePlayer.setPlaybackRate(currentPlaybackRate);

		if (currentState == YT.PlayerState.PLAYING) {
			activePlayer.playVideo();
		}
	}





	// Keep Video Aspect Ratio
	function resizeVideoY() {
		var height = $videoSection.height();
		var targetWidth = (height / cndceSettings.videoAspectRatio.height) * cndceSettings.videoAspectRatio.width;

		$videoSection.css({
			'max-width': targetWidth,
			'min-width': targetWidth
		})

	}

	function resizeVideoX() {

		var width = $videoSection.width();
		var targetHeight = (width / cndceSettings.videoAspectRatio.width) * cndceSettings.videoAspectRatio.height;

		targetHeight = $iframeSection.parent().height() - targetHeight;
		targetHeight -= parseFloat($iframeSection.css('margin-top'));
		targetHeight -= parseFloat($iframeSection.css('margin-bottom'));
		targetHeight -= parseFloat($videoInformation.css('padding-bottom'));
		targetHeight -= parseFloat($videoInformation.css('padding-top'));

		$iframeSection.css({
			'max-height': targetHeight,
			'min-height': targetHeight
		})
	}

	function resizeVideoPortrait() {
		var width = $videoSection.width();
		var targetHeight = (width / cndceSettings.videoAspectRatio.width) * cndceSettings.videoAspectRatio.height;


		$videoSection.css({
			'max-height': targetHeight,
			'min-height': targetHeight
		})
	}




	// Section Sizes Cookie
	function loadSectionSizesFromCookie() {
		var cVideoWidth = getCookie('cndceVideoSectionWidth');
		var cContainerWidth = getCookie('cndceContainerWidth');
		var cContainerHeight = getCookie('cndceContainerHeight');


		if ($cndceContainer.width() == cContainerWidth && $cndceContainer.height() == cContainerHeight) {



			$videoSection.css({
				'max-width': cVideoWidth + 'px',
				'min-width': cVideoWidth + 'px'
			});
		}
	}

	function saveSectionSizesToCookie() {
		document.cookie = "cndceVideoSectionWidth=" + $videoSection.width();
		document.cookie = "cndceContainerWidth=" + $cndceContainer.width();
		document.cookie = "cndceContainerHeight=" + $cndceContainer.height();
	}


	function doSmartRelayout() {

		// Within Smart Relayout Bounds
		if (isVideoWithinSmartRelayoutBounds()) {

			var videoHeight = ($videoSection.width() / cndceSettings.videoAspectRatio.width) * cndceSettings.videoAspectRatio.height;


			if (!$cndceContainer.hasClass('cndce-relayout')) {
				$cndceContainer.addClass('cndce-relayout');

				// WRONG RELAYOUT
				// $commentariesSection.append($iframeBrowserContainer);
				// $iframeSection.append($commentariesScrollContainer);

			}


			$videoInformation.css({
				'min-width': $videoSection.css('min-width'),
				'max-width': $videoSection.css('max-width'),
				'-webkit-flex-basis': $videoSection.css('-webkit-flex-basis'),
				'-ms-flex-preferred-size': $videoSection.css('-ms-flex-preferred-size'),
				'flex-basis': $videoSection.css('flex-basis')
			});


			$videoSection.css({
				'min-height': videoHeight + 'px',
				'max-height': videoHeight + 'px'
			})

			$iframeSection.css({
				'min-height': 'inherit',
				'max-height': 'inherit'
			})



			// Not Within Smart Relayout Bounds
		} else {
			if ($cndceContainer.hasClass('cndce-relayout')) {
				$cndceContainer.removeClass('cndce-relayout');

				// WRONG RELAYOUT
				// $iframeSection.append($iframeBrowserContainer);
				// $commentariesSection.append($commentariesScrollContainer);

				$videoInformation.css({
					'min-width': '',
					'max-width': '',
					'-webkit-flex-basis': '',
					'-ms-flex-preferred-size': '',
					'flex-basis': ''
				});


				$commentariesSection.css({
					'min-height': '',
					'max-height': ''
				})

				$videoSection.css({
					'min-height': '',
					'max-height': ''
				})

				resizeVideoX();
			}

		}

	}





	function onYouTubeIframeAPIReady() {
		initVideos();

		initCommentaryTemplate();

		// $commentariesIframe.attr('src', cndceSettings.commentariesBaseUrl);

	}

	function onPlayerProgress() {
		var time = parseInt(activePlayer.getCurrentTime());
//AW 	On iOS the following console output shows the time is 1 second prior to what's expected when a tref link is clicked:		
//AW	console.log(time);
		var $commentary;
		// var $commentary = $($commentaries.filter(':not(.hidden)').filter('[data-time-sec=' + time + ']'));

		var i;

		for (i = 0; i < $commentaries.length; i++) {
			var currTime = parseInt($($commentaries[i]).attr('data-time-sec'));


			if (currTime >= time) {
				if (currTime == time)
					i++;
				break;
			}
		}

		$commentary = $($commentaries[i - 1]);

		if ($commentary.hasClass('hidden'))
			return;


		if ($commentary.length > 0
			&& ($commentaries.index($currentCommentary) != $commentaries.index($commentary)
				|| $currentCommentary == undefined
			)) {

			$currentCommentary = $commentary;
			setCommentaryOnProgress($commentary);


		}


	}

	function onPlayerReady() {
		var iVideo = getCookie('cndceVideo');

		if (iVideo == undefined || iVideo == '')
			iVideo = 0;

		// Get parameters
		if (getParamVideo != undefined && cndceSettings.videos[getParamVideo] != undefined)
			iVideo = getParamVideo;

		setActivePlayer(cndceSettings.videos[iVideo]);

		if (getParamStartTime != undefined && getParamStartTime != ''
			&& cndceSettings.videos[iVideo].player.playVideo != undefined) {

			cndceSettings.videos[iVideo].player.playVideo();
		}

	}

	function onPlayerStateChange(e) {
		if (onPlayerProgressInterval != undefined) {
			clearTimeout(onPlayerProgressInterval);
		}

		if (e.data == YT.PlayerState.PLAYING) {
			setPlayerProgressInterval();
		}
	}

	function onPlayerPlaybackRateChange() {
		if (activePlayer.getPlayerState() == YT.PlayerState.PLAYING)
			setPlayerProgressInterval();
	}


	function mockRefresh($el){
		$el.addClass('refresh');

		setTimeout(function(){
			$el.removeClass('refresh');
		}, 500);
	}

	function refreshLastUpdateTimestamp(){
		iframeLastUpdateTimestamp = new Date();
	}

	function scrollOptionsTo(scrollTopOptions, scrollTopBrowser){
		$optionsScrollable.animate({
			scrollTop: scrollTopOptions
		}, 1000);

		$iframeBrowserScrollContainer.animate({
			scrollTop: scrollTopBrowser
		}, 1000)
	}

	// Events

	// Link Event
	$cndceContainer.add($optionsContainer).on('click', 'a[target="tpo"]', function(e){
		var $this = $(this);

		$cndceContainer.removeClass('options-shown');

		// If on mobile, open on a new tab as well
		if (isLayoutMobile()) {
			var $thisDuplicate = $this.clone(true);
			
			$thisDuplicate.attr('target', 'tpoTab');

			$thisDuplicate[0].click();

			e.preventDefault();
			e.stopPropagation();
		}

	})


	$iframeBrowserIconButton.click(function(e){
		if($cndceContainer.hasClass('options-shown') && $iframeBrowserScrollContainer.scrollTop() == 0){
			mockRefresh($iframeBrowserOptionsTemplate);
			return;
		}

		refreshLastUpdateTimestamp();
		

		$iframeBrowserAddressInput.val('');

		$cndceContainer.addClass('options-shown');
		scrollOptionsTo(0, 0);

		e.stopPropagation();
	})


	$iframeBrowserAddress.click(function () {
		if ($iframeBrowserAddressInput.val() != '') {
			window.open($iframeBrowserAddressInput.val())
		}
	})

	$iframeBrowserOptionsButton.click(function (e) {

		// Scroll
		scrollOptionsTo($optionsCommentaries.position().top - 24, $iframeBrowserOptionsCommentaries.position().top - 24);


		refreshLastUpdateTimestamp();
		


		if($cndceContainer.hasClass('options-shown')){
			// mockRefresh($iframeBrowserOptionsTemplate);

			return;
		}

		// if(isLayoutMobile())
		activePlayer.pauseVideo();

		$iframeBrowserAddressInput.val('');
		$cndceContainer.addClass('options-shown');
		e.stopPropagation();






	})


	$iframe.on('load', function (e) {
		// $('.cndce-browser-tab-text', $iframeBrowserTab).text(this.contentDocument.title);
		refreshLastUpdateTimestamp();

	})


	$iframeUpdateFrequency.change(function () {
		var $this = $(this);
		// var $parent = $this.parents('.cndce-update-choice');

		// $iframeUpdateChoice.removeClass('cndce-checked');
		// $parent.addClass('cndce-checked');

		// $iframeUpdateVal.text($parent.text());


		window.localStorage.setItem('cndceUpdateFrequency', $iframeUpdateFrequency.val());
	})




	$optionsContainer.click(function (e) {
		e.stopPropagation();
	})

	$optionsVideos.add($iframeBrowserOptionsVideos).on('change', 'input', function () {
		var $this = $(this);

		var iVideo = $this.data('ivideo');

		setActivePlayer(cndceSettings.videos[iVideo]);

		// Cookie
		document.cookie = 'cndceVideo=' + iVideo;
	})

	$optionsCommentaries.add($iframeBrowserOptionsCommentaries).on('change', 'input', function () {

		var $this = $(this);

		var iCommentary = $this.data('icommentary');
		var commentary = cndceSettings.commentaries[iCommentary];


		var $commentariesChange = $commentaries.filter('[type="' + $this.attr('data-commentary-type') + '"]');


		var commentaryCookie = getLocalStorage('cndceCommentaries');


		// MESSAGE (Remove once read): Please make sure to remove your testing scripts. It clutters the console
		// console.log('data--->', commentaryCookie)


		var commentaryType = $this.attr('data-commentary-type');


		if ($this.prop('checked')) {
			loadCommentaries(commentary);

			$commentariesChange.removeClass('hidden');

			$('.' + $this.attr('data-commentary-type'), $commentariesTagsSpan).removeClass('hidden');

			if (commentaryCookie.indexOf(commentaryType) == -1)
				commentaryCookie.push(commentaryType);

		} else {
			// TODO: Animation doesn't appear the first time
			$commentariesChange.each(function () {
				var $commentaryChange = $(this);

				$commentaryChange.css('height', $commentaryChange.height());
				$commentaryChange.addClass('hidden');
			})

			$('.' + $this.attr('data-commentary-type'), $commentariesTagsSpan).addClass('hidden');

			commentaryCookie.splice(commentaryCookie.indexOf(commentaryType), 1);

		}

		// Update value of copy
		$this.data('$copy').prop('checked', $this.prop('checked'));

		$commentariesActiveSpan.text($('input:checked', $optionsCommentaries).length);



		// Cookies
		// document.cookie = 'cndceCommentaries=' + commentaryCookie.toString();
		window.localStorage.setItem('cndceCommentaries', commentaryCookie.toString());

	})

	$('.ok', $optionsContainer).click(function (e) {
		console.log(this);
		$cndceContainer.removeClass('options-shown');
		console.log('ok dclicked');

	})


	// Section Resize Events
	$cndceContainer.on('mousemove touchmove', function (e) {
		if (!$cndceContainer.hasClass('resizing'))
			return;


		var pageX, pageY;
		if (e.touches == undefined) {
			pageX = e.pageX;
			pageY = e.pageY;
		} else {
			pageX = e.touches[0].pageX;
			pageY = e.touches[0].pageY;
		}


		var deltaX = (mouseX - pageX) / 1.5;
		var deltaY = -(mouseY - pageY) / 2;



		if ($cndceContainer.attr('data-resize') == 'x') {
			var targetWidth = $sectionResizeTarget.width();

			$sectionResizeTarget.css({
				'max-width': targetWidth - deltaX + 'px',
				'min-width': targetWidth - deltaX + 'px'
			})

			resizeVideoX();

			// Reverse if not within minimum bounds
			if (!isSizeWithinMinimumsX()) {
				$sectionResizeTarget.css({
					'max-width': targetWidth + 'px',
					'min-width': targetWidth + 'px'
				})

				resizeVideoX();
			}
		} else if ($cndceContainer.attr('data-resize') == 'y') {

			// Smart Relayout
			if ($cndceContainer.hasClass('cndce-relayout')) {
				$sectionResizeTarget = $videoSection;

				deltaY *= -1;
			} else {
				$sectionResizeTarget = $iframeSection;
			}


			var targetHeight = $sectionResizeTarget.height();


			$sectionResizeTarget.css({
				'max-height': targetHeight - deltaY + 'px',
				'min-height': targetHeight - deltaY + 'px'
			})

			resizeVideoY();


			// Reverse if not within minimum bounds
			if (!isSizeWithinMinimumsY()) {
				$sectionResizeTarget.css({
					'max-height': targetHeight + 'px',
					'min-height': targetHeight + 'px'
				})

				resizeVideoY();
			}


		}



		saveSectionSizesToCookie();





		e.preventDefault();
	})



	// Smart Relayout
	$cndceContainer.on('mousemove touchmove', function (e) {


		if (!$cndceContainer.hasClass('resizing'))
			return;


		doSmartRelayout();
	})



	$sectionResizeDiv.on('mousedown touchstart', function (e) {
		var $this = $(this);

		$sectionResizeTarget = $this.parent();

		$cndceContainer.addClass('resizing');
		$cndceContainer.attr('data-resize', $this.data('resize'));

	})

	$cndceContainer.on('mouseup touchend', function (e) {
		$cndceContainer.removeClass('resizing');
		$cndceContainer.attr('data-resize', '');
		$sectionResizeTarget = undefined;
	})


	$body.on('mouseleave', function () {
		if ($cndceContainer.hasClass('resizing')) {
			$cndceContainer.trigger('mouseup');
		}
	})


	// Window Resize Events
	$(window).on('resize', function () {


		doSmartRelayout();





		// Keep Video Aspect Ratio
		if (isLayoutRelayout()) {


			if (!isCommentaryIframeWithinMinHeight()) {
				$commentariesSection.css({
					'max-height': cndceSettings.minSizes.commentIframe.height + 'px'
				});

				$videoSection.css({
					'min-height': '',
					'max-height': ''
				})

				// Reassign min/max
				$videoSection.css({
					'min-width': $videoSection.width() + 'px',
					'max-width': $videoSection.width() + 'px'
				})

				$commentariesSection.css({
					'max-height': ''
				});

				resizeVideoY();

				// Trigger Smart Relayout
				doSmartRelayout();
			}

		}
		else if (!isLayoutMobile()) {


			// Minimum Sizes
			$commentariesSection.css({
				'min-width': cndceSettings.minSizes.commentIframe.width + 'px'
			});

			$iframeSection.css({
				'min-height': cndceSettings.minSizes.browserIframe.height + 'px'
			})



			// Reset Values
			$videoSection.css({
				'min-height': '',
				'max-height': ''
			})


			resizeVideoX();
			resizeVideoY(); // To give video min/max-width


			// Check minimum sizes
			if (!isCommentaryIframeWithinMinWidth()) {
				$commentariesSection.css({
					'max-width': cndceSettings.minSizes.commentIframe.width + 'px'
				});

				// Reset min/max width values to stretch and auto adjust size on DOM side
				$videoSection.css({
					'min-width': '',
					'max-width': ''
				})

				// Reassign min/max
				$videoSection.css({
					'min-width': $videoSection.width() + 'px',
					'max-width': $videoSection.width() + 'px'
				})

				$commentariesSection.css({
					'max-width': ''
				});

				resizeVideoX();


			}



			if (!isBrowserIframeWithinMinHeight()) {
				$iframeSection.css({
					'max-height': cndceSettings.minSizes.browserIframe.height + 'px'
				})

				// Reset min/max width values to stretch and auto adjust size on DOM side
				$videoSection.css({
					'min-width': '',
					'max-width': ''
				})

				// Reassign min/max
				$videoSection.css({
					'min-width': $videoSection.width() + 'px',
					'max-width': $videoSection.width() + 'px'
				})

				resizeVideoY();

			}


			// resizeVideoY();





		}

		else {
			$videoSection.css({
				'min-width': '',
				'max-width': '',
				'max-height': '',
				'min-height': ''
			})


			$iframeSection.css({
				'max-height': '',
				'min-height': ''
			})


			if (isLayoutPortrait()) {
				resizeVideoPortrait();
			}

		}




		// Save section sizes
		// saveSectionSizesToCookie();



	})





	// Mouse Position Events

	$cndceContainer.bind('touchmove mousemove', function (e) {
		if (e.touches == undefined) {
			mouseX = e.pageX;
			mouseY = e.pageY;
		} else {
			mouseX = e.touches[0].pageX;
			mouseY = e.touches[0].pageY;
		}

	})



	// Commentary Events
	$commentariesHtml.on('click', 'a', function (e) {
		var $this = $(this);

		// href
		if ($this.attr('href') != undefined) {
			if ($this.attr('target') == undefined)
				$this.attr('target', 'tpo');

			if ($this.attr('target') == 'tpo') {
				if ($this.attr('iframe-preview') == 'true') {
					setBrowserPage($this.attr('href'), $this.attr('iframe-preview'), true);
					e.preventDefault();
				} else
					setBrowserPage($this.attr('href'), $this.attr('iframe-preview'), false);

			}

		}

		// tref
		if ($this.attr('tref') != undefined) {
			var timeSeconds = getTimeStringToSeconds($this.attr('tref'));
			// console.log('original value===>', timeSeconds);
			// console.log('value=====>', getTimeStringToSeconds($this.data("value")));
			if (timeSeconds === false)
				timeSeconds = $this.attr('tref');
		//AW Added +1 to following as temp fix to iOS issue
			timeSeconds++;
			playerSeekTo(timeSeconds, true);
		}

		// if($this.attr('target') == 'tpo')
		// e.preventDefault();
	})


	// Open Options Box
	$commentariesHtml.on('click', '.cndce-open-options', function (e) {
		$iframeBrowserOptionsButton.click();
		e.stopPropagation();
	})
	$commentariesHtml.on('click', '.cndce-open-home', function (e) {
		$iframeBrowserIconButton.click();
		e.stopPropagation();
	})


	// Commentaries Scroll Event
	$commentariesHtml.add($commentariesScrollContainer).scroll(function (e) {
		document.cookie = "cndceCommentariesScroll=" + $(this).scrollTop();
		document.cookie = "cndceCommentariesScrollHeight=" + $(this)[0].scrollHeight;
	})



	// End Event
	$cndceContainer.click(function () {
		if (isLayoutMobile() && $cndceContainer.hasClass('options-shown')) {
			$('.ok', $optionsContainer).trigger('click');
		}
	})


	


	// Restore previous size
	loadSectionSizesFromCookie();
	initGetParameters();

	if (getParamConfig != undefined && getParamConfig != '') {
		SETTINGS_URL = getParamConfig;
	}


	$.ajax({
		url: SETTINGS_URL,
		dataType: 'json',
		success: function (settings) {
			console.log(settings);
			cndceSettings = settings;

			window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

			loadYoutubeIframeAPI();


			// Show options window
			if(!isLayoutMobile()){
				$cndceContainer.addClass('options-shown');
			}

			$body.trigger('resize');

			// Update Automatically Session
			// var updateAutomatically = getCookie('cndceUpdateAutomatically');
			var updateFrequency = window.localStorage.getItem('cndceUpdateFrequency');

			if(updateFrequency == undefined)
				updateFrequency = 'automatically';


			$iframeUpdateFrequency.val(updateFrequency);






		}
	})




})
