<?php
$wgExtensionCredits['other'][] = [
    'name' => 'Sandcraft Theme',
    'author' => 'Ton Nom',
    'version' => '1.0',
    'url' => 'https://github.com/ton-repo',
];

$wgHooks['BeforePageDisplay'][] = 'fnSandcraftAddCSS';

function fnSandcraftAddCSS( OutputPage $out, Skin $skin ) {
    $out->addModules('ext.sandcrafttheme.css');
    return true;
}
