<?php 
	require_once('functions.php') ;

	if(isset($_GET['planet']))
		$isPlanet = is_planet($_GET['planet']);
	else
		$isPlanet = false;
?>

<!DOCTYPE html>
<html lang="en-US">
<head>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-8129838-3"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', 'UA-8129838-4');
    </script>

	<?php
		if($isPlanet){
			include('./headers/header-' . $_GET['planet'] . '.php');
		}else{
			include('./headers/header-index.php');
		}
	?>

	
	<link rel="icon" href="./img/favicon.png">

	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=yes">
	<meta http-equiv="content-type" content="text/html; charset=utf-8" >
	<meta property="og:title" content="The Planets Online" />
	<meta property="og:type" content="website" />
	<meta property="og:description" content="'The Planets Online' is a fun way to learn about the planets, science, music, and much more - all while accompanied by an orchestra" />
	<meta property="og:url" content="https://theplanetsonline.com" />
	<meta property="og:image" content="https://theplanetsonline.com/img/sitethumb.jpg" />

	<!-- Font -->
	<link href="https://fonts.googleapis.com/css?family=Lato:300,900" rel="stylesheet">
	

	<!-- Templates -->
	<link rel="stylesheet" type="text/css" href="./templates/welcome-home.css">
	<link rel="stylesheet" type="text/css" href="./templates/commentary.css">
	<link rel="stylesheet" type="text/css" href="./commentaries/commentaries-custom.css">

	<!-- Self -->
	<link rel="stylesheet" type="text/css" href="./style.css">
		
	<style type="text/css">
		#aw-all-links{
			position: fixed;
			top: 100%;
			height: 0;
			overflow: hidden;
			z-index: -1;
			color: transparent !important;
		}

		#aw-all-links *{
			color: transparent !important;
		}


	</style>

	<script type="text/javascript">
		<?php if($isPlanet): ?>
			var cndcePlanet = '<?php echo $_GET['planet'] ?>';
		<?php else: ?>
			var cndcePlanet = 'index';
		<?php endif; ?>
	</script>
</head>
<body>

	<!-- Google Tag Manager (noscript) -->
	<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N4DPMC9"
	height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
	<!-- End Google Tag Manager (noscript) -->

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
					<!-- <iframe id="cndce-commentary-iframe"></iframe> -->
					<?php include('./templates/commentary.php') ?>
										
				</div>
			</div>
		</div>
		

		<div id="cndce-iframe-section" class="cndce-section">
			<div data-resize="y" class="cndce-resize top"></div>

			<div id="cndce-browser-container">
				<div class="cndce-browser-top">

					<?php if($isPlanet): ?>
						<a href="./">
							<img class="cndce-browser-icon" src="./img/home-1.svg" alt="Home Button">
						</a>
					<?php else: ?>
						<img class="cndce-browser-icon" src="./img/home-1.svg" alt="Home Button">
					<?php endif; ?>
						
					<div class="cndce-browser-address"><input type="text" disabled></div>


					<div class="cndce-browser-options">
						<div class="cndce-browser-option cndce-share">
							<div class="addthis_inline_share_toolbox"></div>
						</div>
						<div class="cndce-browser-option cndce-update">
							Update <span class="cndce-update-val" style="display: none"></span>
							<div class="cndce-update-choices">
								<select>
									<option class="cndce-update-choice" value="every">
										On Every Link
									</option>
									<option class="cndce-update-choice" value="frequently">
										Frequently
									</option>
									<option class="cndce-update-choice" value="automatically">
										Automatically
									</option>
									<option class="cndce-update-choice" value="never">
										Never
									</option>
								</select>

							</div>
						</div>
						<div class="cndce-browser-option cndce-icon">
							<img src="./img/settings-1.svg" alt="Options Button"> <span>Options</span>
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
					<?php $isiPad = (bool) strpos($_SERVER['HTTP_USER_AGENT'],'iPad'); ?>
					<iframe id="cndce-browser-iframe" name="tpo" <?php if ($isiPad) { ?> scrolling="no" <?php } ?>></iframe>
					
				</div>
			</div>

			
		</div>
	</div>


	<!-- AW explicitly list all available content and links for search crawlers -->
	<div id="aw-all-links">
		<?php
			if($isPlanet){
				include('./seo/seo-' . $_GET['planet'] . '.php');
			}else{
				include('./seo/seo-index.php');
			}

		?>
	</div>
	<!-- don't show content that's duplicated for crawlers on load -->
	<script>document.getElementById('aw-all-links').style.display = 'none';</script>
	<!-- AW End -->
	



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
