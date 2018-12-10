<?php

$content = file_get_contents('all-links-raw.xml');
//$content= strip_tags($content, '<p><h1><h2><h3><h4><span><a>');
//Change <p> tags into <p class="cleaned">
$content = preg_replace('#<\s*?p\b[^>]*>(.*?)</p\b[^>]*>#si', '<p class="cleaned">$1</p>', $content);

// Remove <commentary> tags and their parameters, but leave their contents.
$content = preg_replace('#<\s*?commentary\b[^>]*>(.*?)</commentary\b[^>]*>#s', '$1', $content);

//remove class extsrc
$content = preg_replace('#class="(.*?)"#i', '', $content);


//Remove all <a tref= … > tags.
$content = preg_replace('#<a\s*?tref=(.*?)</a\b[^>]*>#', '', $content);
// Remove all tag parameters apart from href=.
$content = preg_replace('#<a\s*?(.*?)href="(.*?)"(.*?)>(.*?)</a\b[^>]*>#', '<a href="$2">$4</a>', $content);
// Change <h1 … > tags to <p class="cleaned">.
$content = preg_replace('#<\s*?h1\b[^>]*>(.*?)</h1\b[^>]*>#si', '<p class="cleaned">$1</p>', $content);

//delete spans
$content = preg_replace('#<\s*?span\b[^>]*>(.*?)</span\b[^>]*>#s', '$1', $content);

//remove lines
$content = preg_replace("/^\n+|^[\t\s]*\n+/m", "", $content);
//remove entity spaces
$content = preg_replace('#&nbsp;#', ' ', $content);

//remove double spaces (will comprime the php output
$content= preg_replace('#\s+#', ' ', $content);

//Remove <h4 … > tags AND their contents.
$content = preg_replace("#<h4[^>]*?>[\r\n]+</h4>#", "\n", $content);
$content = preg_replace('#<h4[^>]*?>.*?</h4>#i', '', $content);


//remove spaces between tags
$content = preg_replace('#>\s+<#', '><', $content);

echo $content;
