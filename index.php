<!DOCTYPE html>
<html>
<head>
	<!-- Global site tag (gtag.js) - Google Analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=UA-8129838-4"></script>
	<script>
	  window.dataLayer = window.dataLayer || [];
	  function gtag(){dataLayer.push(arguments);}
	  gtag('js', new Date());
	  gtag('config', 'UA-8129838-4');
	</script>
	<title>The Planets Online (test release)</title>
	<link rel="icon" href="./img/favicon.png">

	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=yes">
	<meta http-equiv="content-type" content="text/html; charset=utf-8" >

	<!-- Font -->
	<link href="https://fonts.googleapis.com/css?family=Lato:300,900" rel="stylesheet">

	<!-- Templates -->
	<link rel="stylesheet" type="text/css" href="./templates/welcome-home.css">

	<!-- Self -->
	<link rel="stylesheet" type="text/css" href="./style.css">

</head>
<body>

	<div id="cndce-container" class="cndce-no-tabs">

		<div id="cndce-options-container">
			<div class="cndce-options-title">
				<div class="cndce-browser-top-buttons hidden">
					<div class="cndce-browser-top-button"></div>
					<div class="cndce-browser-top-button"></div>
					<div class="cndce-browser-top-button"></div>
				</div>
				The Planets Online
			</div>

			<div class="cndce-options-scrollable">
				<div class="cndce-options-body">
					<?php include('./templates/welcome-home.php') ?>					
				</div>

			</div>

			<center><button class="ok cndce-ok">OK</button></center>


			
			
		</div>

		<div id="cndce-video-information">
			<div id="cndce-video-section" class="cndce-section">
				<div id="cndce-videos-container"></div>

				<div class="cndce-video-commentary hidden"></div>

				<div data-resize="x" class="cndce-resize right"></div>

			</div>




			<div id="cndce-commentary-section" class="cndce-section">

				<div data-resize="y" class="cndce-resize top"></div>


				<div id="cndce-commentary-iframe-container" class="cndce-iframe-scroll-container">
					<iframe id="cndce-commentary-iframe"></iframe>
										
				</div>
			</div>
		</div>
		

		<div id="cndce-iframe-section" class="cndce-section">
			<div data-resize="y" class="cndce-resize top"></div>

			<div id="cndce-browser-container">
				<div class="cndce-browser-top">
					<a href="./pages/welcome.html" target="tpo">
						<img class="cndce-browser-icon" src="./img/home-1.svg">
						
					</a>
					<div class="cndce-browser-address"><input type="text" disabled></div>


					<div class="cndce-browser-options">
						<div class="cndce-browser-option cndce-share">
							<div class="addthis_inline_share_toolbox"></div>
						</div>
						<div class="cndce-browser-option cndce-update">
							<label>
								Update Automatically
								<input type="checkbox" checked>
							</label>
						</div>
						<div class="cndce-browser-option cndce-icon">
							<img src="./img/settings-1.svg"> <span>Options</span>
						</div>
					</div>

					<div class="cndce-browser-top-buttons hidden">
						<div class="cndce-browser-top-button"></div>
						<div class="cndce-browser-top-button"></div>
						<div class="cndce-browser-top-button"></div>
					</div>
				</div>
				<div class="cndce-browser-toolbar hidden">
					<div class="cndce-browser-tabs">
						<div class="cndce-browser-tab template">
							<div class="cndce-browser-tab-text"></div>
						</div>
						<div class="cndce-browser-tab active">
							<div class="cndce-browser-tab-text">
								http://www.theplanetsonline.com
							</div>
						</div>
						
						<div class="cndce-browser-tab"></div>
						<div class="cndce-browser-tab"></div>
					</div>
				</div>
				<div id="cndce-browser-iframe-container" class="cndce-iframe-scroll-container">
					<div id="cndce-browser-options">
						<?php include('./templates/welcome-home.php') ?>
					</div>
					<iframe id="cndce-browser-iframe" name="tpo" src=""></iframe>
					
				</div>
			</div>

			
		</div>
	</div>


	



	<!-- jQuery -->
	<script
	  src="https://code.jquery.com/jquery-3.2.1.min.js"
	  integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
	  crossorigin="anonymous"></script>

	<!-- AddThis -->
	<script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5b900fe21bf1327a"></script>



	<!-- Self -->
	<script type="text/javascript" src="./script.js"></script>

</body>
</html>
