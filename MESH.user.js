// ==UserScript==
// @name	Mesh
// @namespace	Mush Expedition System Help
// @description	Script Mush para asistir en las exploraciones
// @downloadURL	https://github.com/Javiernh/MESH/raw/master/MESH.user.js
// @include	http://mush.twinoid.*/
// @include	http://mush.twinoid.*/#
// @include	http://mush.vg/
// @include	http://mush.vg/#
// @grant	GM_getResourceText
// @require	http://code.jquery.com/jquery-latest.js
// @require	http://data.mush.twinoid.es/js/4/jquery-ui-1.9.1.custom.min.js
// @require	https://raw.githubusercontent.com/Javiernh/MESH/master/lib/i18next.js
// @resource	translation:es https://raw.githubusercontent.com/Javiernh/MESH/release/translate/locales/es/translation.json
// @resource	translation:en https://raw.githubusercontent.com/Javiernh/MESH/release/translate/locales/en/translation.json
// @resource	translation:fr https://raw.githubusercontent.com/Javiernh/MESH/release/translate/locales/fr/translation.json
// @version	0.6
// ==/UserScript==
/* jshint -W043 */

String.prototype.capitalize = function() {
	return this.replace(/(?:^|\s)\S/g, function(a) {
		return a.toUpperCase();
	});
};

MESH = {};
MESH.version = GM_info.script.version;
MESH.name = GM_info.script.name;
MESH.Title = GM_info.script.namespace;
MESH.domain = document.domain;
MESH.URL = document.URL;
MESH.MushURL = 'http://' + MESH.domain;
MESH.Path = location.pathname;
MESH.icon = 'http://imgup.motion-twin.com/twinoid/2/e/4acc992f_946355.jpg';

MESH.astroTags = ["oxygen", "hydrocarbon", "insect", "intelligent", "mankarog", "predator", "ruminant", "hot", "cold", "sismic_activity", "strong_wind", "volcanic_activity",
				  "cave", "cristal_field", "desert", "forest", "mountain", "ocean", "fruit_trees", "ruins", "wreck", "swamp"];
MESH.items = ["postit", "space_suit", "trad_module", "driller", "echo_sounder", "quad_compass", "rope", "heat_seeker", "white_flag",
			  "blaster", "knife", "natamy_riffle", "items_decoup_05", "machine_gun", "missile_launcher", "grenade"];
// TODO: Add Polyvalent and maybe Pilot
MESH.skills = ["botanic", "diplomacy", "gunman", "sprint", "survival"];
MESH.heroes = ["jin_su", "frieda", "kuan_ti", "janice", "roland", "hua", "paola", "chao", "finola",
			   "stephen", "ian", "chun", "raluca", "gioele", "eleesha", "terrence", "andie", "derek"];

MESH.initLang = function() {
	switch (MESH.domain) {
		case 'mush.twinoid.es':	// SPANISH
			MESH.lang = 'es';
			break;
		case 'mush.twinoid.com':	// ENGLISH
			MESH.lang = 'en';
			break;
		default:	// FRENCH
			MESH.lang = 'fr';
	}	// END SWITCH
	try {
		var translationText = GM_getResourceText('translation:'+ MESH.lang);
		if (typeof translationText === 'undefined') {
			console.warn("No translations for '" + MESH.lang + "' languaje.");
			return;
		}
		var translationData = JSON.parse(translationText);
		i18next.init(translationData);
		i18next.changeLanguage(MESH.lang);
	} catch(err) {
		console.error("Error getting translation data:", err);
	}
};	// END FUNCTION - MESH.initLang

MESH.MakeInput = function(content, src, imgheight, tiptitle, tipdesc) {
	var div = $('<div>');
	$('<img>').attr('src', src)
		.attr("_title", tiptitle.replace('_', ' '))
		.attr("_desc", tipdesc)
		.attr("height", imgheight)
		.on("mouseover", MESH.CustomTip)
		.on("mouseout", MESH.hideTip)
		.on("click", function() {content.focus(); content.select();})
		.appendTo(div);
	content.appendTo(div);

	return div;
};	// END FUNCTION - MESH.MakeInput

MESH.initWindow = function() {
	// ----------------- CONTENT ----------------- //
	var divform = $('<div>')
		.attr('id', 'MESH')
		.attr('title', MESH.Title)
		.appendTo('#cdUiHook');
	var form = $('<form>').attr('id', 'MESH-form').appendTo(divform);
	var planet = $('<div>').addClass('MESH-planet MESHfloat').appendTo(form);
	var astrotags = $('<div>').addClass('MESH-astrotags MESHfloat').appendTo(form);
	var exploheroes = $('<div>').addClass('MESH-exploheroes MESHfloat').appendTo(form);
	var output = $('<div>').addClass('MESH-output MESHfloat').appendTo(form);
	MESH.astroinfo(planet, astrotags);
	MESH.index = (!$('#cdBottomBlock li[data-p="_ICARUS_LARGER_BAY"]').length) ? 4 : 6;
	MESH.exploHeroes(exploheroes);
	MESH.generatext(output);
	$('#MESH').dialog({
		autoOpen: false,
		width: 787,
		resizable: false,
//		zIndex: 8
		});
	// ----------------- SELECT INPUT ON CLICK ----------------- //
	$('#MESH-form input, #MESH-form textarea').on('click', function() {
		$(this).focus();
		$(this).select();
	});
};	// END FUNCTION - MESH.initWindow

MESH.astroinfo = function(pdata, astrotags) {
	// ----------------- PLANET DATA ----------------- //
	var pdiv = $('<div>').appendTo(pdata);
	$('<span>' + i18next.t('planet.title') + ': </span>').appendTo(pdiv);
	$('<input>').attr('type', 'text').attr('name', 'pname').attr('maxlength', '23').attr('tid_default', i18next.t('planet.default')).appendTo(pdiv);
	var pdir = $('<div><span>' + i18next.t('direction.title') + ': </span></div>').appendTo(pdata);
	var pdirsel = $('<select name="pdirection"></select>').appendTo(pdir);
		$('<option value="" selected>-----</option>').appendTo(pdirsel);
		$('<option value="north">' + i18next.t('direction.north') + '</option>').appendTo(pdirsel);
		$('<option value="south">' + i18next.t('direction.south') + '</option>').appendTo(pdirsel);
		$('<option value="east">' + i18next.t('direction.east') + '</option>').appendTo(pdirsel);
		$('<option value="west">' + i18next.t('direction.west') + '</option>').appendTo(pdirsel);
	$('<div><span>' + i18next.t('fuel') + ': </span><input name="pfuel" type="number" min="0" max="9" value="0"></div>').appendTo(pdata);
	// ----------------- ASTRO ----------------- //
	var itag = 0;
	for (var index in MESH.astroTags) {
		itag = MESH.astroTags[index];
		MESH.MakeInput($('<input type="number" name="' + itag + '" min="0" max="9" value="0">'),
			'/img/icons/astro/tag_' + itag + '.png', 34, i18next.t(itag+'.title'), i18next.t(itag+'.desc')).appendTo(astrotags);
	}
};	// END FUNCTION - MESH.astroinfo

MESH.herobag = function(divhero, pos) {
	var herobag = $('<ul>').addClass('MESH-bag MESHfloat').appendTo(divhero);
	for (var i = 0; i < 3; i++) {
		var lisel = $('<li>').addClass('MESH-bag').appendTo(herobag);
		var select = $('<select name="item' + i + 'hero' + pos + '">').appendTo(lisel);
		$('<option value="" selected>-----</option>').appendTo(select);
		var group = 0, optgroup = 0;
		var eqpt = $('<optgroup>').attr('label', i18next.t('equipment')).appendTo(select);
		var guns = $('<optgroup>').attr('label', i18next.t('weaponry')).appendTo(select);
		var item = 0;
		for (var index in MESH.items) {
			item = MESH.items[index];
			if (group < 9) { optgroup = eqpt; }
			else { optgroup = guns; }
			$('<option value="' + item + '">' + i18next.t(item + '.title') + '</option>').appendTo(optgroup);
			group++;
		}
	}
	// Add / remove "recommended" class to items
	$('.MESH-astrotags input, input[name^="diplomacy"').change(function() {
//		var zone = $(this).attr('name');
		var numz = [];
		var sprintndd = 0;
		var survivalndd = 0;
		for (var index in MESH.astroTags) {
			var tag = MESH.astroTags[index];
			numz[tag] = parseInt($('input[name="' + tag + '"]').val());
			sprintndd += parseInt($('input[name="' + tag + '"]').val());
			if ( tag != 'oxygen' && tag != 'hydrocarbon' && tag != 'volcanic_activity' && tag != 'forest' && tag != 'ocean' && tag != 'fruit_trees') {
				survivalndd += parseInt($('input[name="' + tag + '"]').val());
			}
		}

		// postit
		if ( numz.intelligent || numz.strong_wind ) {
			$('option[value="postit"]').addClass('recommended');
		}
		else { $('option[value="postit"]').removeClass('recommended'); }
		// space_suit
		if ( !numz.oxygen ) {
			$('option[value="space_suit"]').addClass('recommended');
		}
		else { $('option[value="space_suit"]').removeClass('recommended'); }
		// trad_module & white_flag
		if ( numz.intelligent ) {
			$('option[value="trad_module"]').addClass('recommended');
			$('option[value="white_flag"]').addClass('recommended');
		}
		else {
			$('option[value="trad_module"]').removeClass('recommended');
			$('option[value="white_flag"]').removeClass('recommended');
		}
		// driller
		if ( numz.hydrocarbon || numz.cave || numz.mountain || numz.wreck ) {
			$('option[value="driller"]').addClass('recommended');
		}
		else { $('option[value="driller"]').removeClass('recommended'); }
		// echo_sounder
		if ( numz.hydrocarbon ) {
			$('option[value="echo_sounder"]').addClass('recommended');
		}
		else { $('option[value="echo_sounder"]').removeClass('recommended'); }
		// quad_compass
		if ( numz.desert || numz.forest || numz.cave || numz.cold || numz.cristal_field || numz.ocean ) {
			$('option[value="quad_compass"]').addClass('recommended');
		}
		else { $('option[value="quad_compass"]').removeClass('recommended'); }
		// rope
		if ( numz.sismic_activity || numz.cave || numz.mountain ) {
			$('option[value="rope"]').addClass('recommended');
		}
		else { $('option[value="rope"]').removeClass('recommended'); }
		// heat_seeker
		if (( numz.insect || numz.intelligent || numz.predator || numz.ruminant ) && numz.mankarog === 0 ) {
			$('option[value="heat_seeker"]').addClass('recommended');
		}
		else { $('option[value="heat_seeker"]').removeClass('recommended'); }
		// weapons
		if ( numz.insect || numz.intelligent || numz.mankarog || numz.predator || numz.ruminant || numz.cristal_field || numz.ruins  || numz.wreck  ) {
			$('optgroup[label="' + i18next.t('weaponry') + '"] > option').addClass('recommended');
			$('input[value="diplomacy"]').parent().addClass('recommended');
			$('input[value="gunman"]').parent().addClass('recommended');
			// If hero is diplomat wapons are not needed
			if ( $('input[name^="diplomacy"]').is(':checked') ) {
				$('optgroup[label="' + i18next.t('weaponry') + '"] > option').removeClass('recommended');
			}
		}
		else {
			// TODO: Multilingual [label]
			$('optgroup[label="Armamento"] > option').removeClass('recommended');
			$('input[value="diplomacy"]').parent().removeClass('recommended');
			$('input[value="gunman"]').parent().removeClass('recommended');
		}
		// botanic
		if ( numz.hot || numz.forest || numz.mountain || numz.fruit_trees || numz.swamp ) {
			$('input[value="botanic"]').parent().addClass('recommended');
		}
		else { $('input[value="botanic"]').parent().removeClass('recommended'); }
		// sprint
		if ( sprintndd > 9 ) {
			$('input[value="sprint"]').parent().addClass('recommended');
		}
		else { $('input[value="sprint"]').parent().removeClass('recommended'); }
		// survival
		if ( survivalndd ) {
			$('input[value="survival"]').parent().addClass('recommended');
		}
		else { $('input[value="survival"]').parent().removeClass('recommended'); }
	});

};	// END FUNCTION - MESH.herobag

MESH.heroskills = function(addTo, pos) {
	var divskills = $('<div>').addClass('MESH-skills MESHfloat').appendTo(addTo);
	var skill = 0;
	for (var index in MESH.skills) {
		skill = MESH.skills[index];
		MESH.MakeInput($('<input type="checkbox" name="' + skill + pos + '" value="' + skill + '">'),
			'/img/icons/skills/' + skill + '.png', 21, i18next.t(skill + '.title'), i18next.t(skill + '.desc')).appendTo(divskills);
	}
};	// END FUNCTION - MESH.heroskills

MESH.exploHeroes = function(addTo) {
	for (var i = 0; i < MESH.index; i++) {
		var liHeroes = $('<div>').addClass('MESH-heroes').appendTo(addTo);
		var divhero = $('<div>').addClass('MESH-heroname MESHfloat').appendTo(liHeroes);
		$('<span>' + i18next.t('heroe', { num: i+1 }) + ' </span>').addClass('MESHfloat').appendTo(divhero);
		var select = $('<select name="hero' + i + '">').addClass('MESHfloat').appendTo(divhero);
		$('<option value="" selected>-----</option>').appendTo(select);
		$('<option value="' + i18next.t('someone') + '">' + i18next.t('someone') + '</option>').appendTo(select);
		for (var hero in MESH.heroes) {
			$('<option value="' + MESH.heroes[hero] + '">' + MESH.heroes[hero].replace("_", " ").capitalize() + '</option>').appendTo(select);
		}
		$('<span> ' + i18next.t('bag') + ' </span>').addClass('MESHfloat').appendTo(liHeroes);
		MESH.herobag(liHeroes, i);
		MESH.heroskills(divhero, i);
	}

	// Hide / show heroes selected / deselected
	var prevHero = [];
	$('.MESH-exploheroes select[name^="hero"]').change(function() {
		var indsel = parseInt($(this).attr('name').replace('hero', ''));
		var hideHero = $(this).val();
		if (hideHero !== i18next.t('someone')) {
//		if (hideHero !== "") {
			$('.MESH-exploheroes option[value=' + hideHero + ']').hide();
		}
		$('.MESH-exploheroes option[value=' + prevHero[indsel] + ']').show();
		prevHero[indsel] = $(this).val();
	});
};	// END FUNCTION - MESH.exploHeroes

MESH.varsinit = function() {
	MESH.Totzones = 0;
	MESH.zones = [];
	MESH.group = [];
	MESH.bag0 = [];
	MESH.bag1 = [];
	MESH.bag2 = [];
	MESH.artefact = 0;
	MESH.death = 0;
	MESH.fatigue = 0;
	MESH.strength = 0;
	MESH.fight = [10,12,32,12,8,18,15,15];
	MESH.fightzones = 0;
	MESH.groupdeath = 0;
	MESH.illness = 0;
	MESH.itemlost = 0;
	MESH.mapfragment = 0;
	MESH.maxfruits = 0;
	MESH.maxfuel = 0;
	MESH.accident = [0, 0];
	MESH.maxsteaks = 0;
	MESH.mia = 0;
	MESH.mushtrap = 0;
	MESH.maxoxygen = 0;
	MESH.return = 0;
	MESH.wander = 0;

	MESH.botanic = 0;
	MESH.diplomacy = 0;
	MESH.gunman = 0;
	MESH.sprint = 0;
	MESH.survival = 0;
	MESH.skilful = 0;	// TODO: Need to include in html (polyvalent)
};	// END FUNCTION - MESH.varsinit

MESH.calcs = function() {
	var ifight = 0, isteaks = 0, isDriller = 1;
	MESH.varsinit();
	MESH.pname = $('[name="pname"]').val().capitalize();
	MESH.pfuel = $('[name="pfuel"]').val();
	MESH.pdirection = i18next.t('direction.' + $('[name="pdirection"]').val());
	$('.MESH-heroes').each(function(index) {
		var $herosel = $(this).find('select[name^="hero"]');
		if ($herosel.val() === "") { return true; }
		MESH.strength++;
		if ( $('input[name="botanic' + index + '"]').is(':checked') ) { MESH.botanic += 1; }
		if ( $('input[name="diplomacy' + index + '"]').is(':checked') ) { MESH.diplomacy = 1; }
		// Team strength for wearing weapons and gunman skill
		for (var i = 0; i < 4; i++) {
			var item = $('li select[name="item' + i + 'hero' + index + '"]').val();
			MESH.strength += (item == 'blaster') ? ( $('input[name="gunman' + index + '"]').is(':checked') ) ? 2 : 1 : 0;
			MESH.strength += (item == 'knife') ? 1 : 0;
			MESH.strength += (item == 'natamy_riffle') ? ( $('input[name="gunman' + index + '"]').is(':checked') ) ? 2 : 1 : 0;
			MESH.strength += (item == 'items_decoup_05') ? 1 : 0;
			MESH.strength += (item == 'machine_gun') ? 2 : 0;
			MESH.strength += (item == 'missile_launcher') ? 3 : 0;
			MESH.strength += (item == 'grenade') ? 3 : 0;
			isDriller = (item == 'driller') ? 2 : isDriller;	console.log(isDriller);
		}
		if ( $('input[name="sprint' + index + '"]').is(':checked') ) { MESH.sprint += 1; }
		if ( $('input[name="survival' + index + '"]').is(':checked') ) { MESH.survival += 1; }
		// TODO: Need to add "Polyvalent" checkbox
		if ( $('input[name="skilful' + index + '"]').is(':checked') ) { MESH.skilful += 1; }

		MESH.group.push($herosel.val().replace('_', ' ').capitalize());
		MESH.bag0.push($(this).find('select[name^="item0"]').val());
		MESH.bag1.push($(this).find('select[name^="item1"]').val());
		MESH.bag2.push($(this).find('select[name^="item2"]').val());

	});
	for (var index in MESH.astroTags) {
		var zone = MESH.astroTags[index];
		var zonval = parseInt($('.MESH-astrotags input[name="' + zone + '"]').val());
		MESH.Totzones += zonval;
		if (zonval !== 0) {
			MESH.zones.push(zonval + 'x ' + i18next.t(zone + '.title'));
		}
		// Pump
		if (zone == 'oxygen') {
			MESH.maxoxygen += 24*zonval;
		}
		// Fuel
		if (zone == 'hydrocarbon' || zone == 'cave' || zone == 'mountain' || zone == 'wreck') {
			if (zone == 'hydrocarbon') { MESH.maxfuel += 6 * zonval * isDriller; }
			else if (zone == 'cave') { MESH.maxfuel += 2 * zonval * isDriller; }
			else if (zone == 'mountain') { MESH.maxfuel += zonval * isDriller; }
			else if (zone == 'wreck') { MESH.maxfuel += 3 * zonval * isDriller; }
		}
		// Alien Artefact
		if (zone == 'intelligent' || zone == 'mankarog' || zone == 'cave' || zone == 'ruins' || zone == 'wreck') {
			MESH.artefact += zonval;
		}
		// Map fragment
		if (zone == 'cristal_field') {
			MESH.mapfragment += zonval;
		}
		// Provision
		if (zone == 'insect' || zone == 'intelligent' || zone == 'predator' || zone == 'ruminant' || zone == 'ocean') {
			if (zone == 'ocean') { MESH.maxsteaks += zonval * (3 + MESH.survival); }
			else { MESH.maxsteaks += (isteaks + 1 + MESH.survival) * zonval; }
			isteaks++;
		}
		// Harvest
		if (zone == 'hot' || zone == 'forest' || zone == 'mountain' || zone == 'fruit_trees' || zone == 'swamp') {
			if (zone == 'fruit_trees') { MESH.maxfruits += zonval * (3 + MESH.botanic); }
			else if (zone == 'mountain') { MESH.maxfruits += zonval * (1 + MESH.botanic); }
			else { MESH.maxfruits += zonval * (2 + MESH.botanic); }
		}
		// Group death
		if (zone == 'volcanic_activity') {
			MESH.groupdeath += zonval;
		}
		// Death
		if (zone == 'mankarog' || zone == 'sismic_activity') {
			MESH.death += zonval;
		}
		// Accident
		if (zone == 'insect' || zone == 'predator' || zone == 'ruminant' || zone == 'hot' ||
			zone == 'cold' || zone == 'sismic_activity' || zone == 'cave' || zone == 'mountain' || zone == 'ruins') {
			MESH.accident[0] += 3 * zonval;
			MESH.accident[1] += 5 * zonval;
		}
		// Fight
		if ((zone == 'insect' || zone == 'intelligent' || zone == 'mankarog' || zone == 'predator' || zone == 'ruminant' ||
			zone == 'cristal_field' || zone == 'ruins' || zone == 'wreck') && (!MESH.diplomacy)) {
			if (zonval === 0) { MESH.fight[ifight] = 0; }
			MESH.fightzones += zonval;
			ifight++;
		}
		// Fatigue
		if (zone == 'hot' || zone == 'cold' || zone == 'strong_wind' || zone == 'desert' || zone == 'mountain' || zone == 'swamp') {
			MESH.fatigue += 2 * zonval;
		}
		// Mush trap
		if (zone == 'cristal_field') {
			MESH.mushtrap += zonval;
		}
		// MIA
		if (zone == 'cold' || zone == 'cristal_field' || zone == 'forest' || zone == 'ocean') {
			MESH.mia += zonval;
		}
		// Illness
		if (zone == 'insect' || zone == 'forest' || zone == 'swamp') {
			MESH.illness += zonval;
		}
		// Item lost
		if (zone == 'intelligent' || zone == 'strong_wind') {
			MESH.itemlost += zonval;
		}
		// Return
		if (zone == 'mankarog' || zone == 'sismic_activity' || zone == 'volcanic_activity') {
			MESH.return += zonval;
		}
		// Wander
		if (zone == 'cave' || zone == 'desert' || zone == 'forest') {
			MESH.wander += zonval;
		}
	}
	MESH.fight.sort(function(a, b) { return b-a; });

};	// END FUNCTION - MESH.calcs

MESH.textarea = function() {
	MESH.calcs();
	var text = i18next.t('txt.title', {p_name: MESH.pname});
	text += i18next.t('txt.info', {p_fuel: MESH.pfuel, p_dir: MESH.pdirection, zones: MESH.Totzones});
	text += '\n' + MESH.zones.join(', ');
	text += i18next.t('txt.group');
	for (var hero in MESH.group) {
		if (MESH.group[hero] !== "") {
			text += '\n**' + MESH.group[hero] + '** - ';
			if (MESH.bag0[hero] !== "") {
				text += '//' + i18next.t(MESH.bag0[hero] + '.title') + '//';
			}
			if (MESH.bag1[hero] !== "") {
				text += ', //' + i18next.t(MESH.bag1[hero] + '.title') + '//';
			}
			if (MESH.bag2[hero] !== "") {
				text += ', //' + i18next.t(MESH.bag2[hero] + '.title') + '//';
			}
		}
	}
	text += i18next.t('txt.gains');
	text += MESH.maxoxygen ? i18next.t('txt.o2', { maxoxygen: MESH.maxoxygen }) : '';
	text += MESH.maxfuel ? i18next.t('txt.fuel', { maxfuel: MESH.maxfuel }) : '';
	text += MESH.artefact ? i18next.t('txt.artefact', { count: MESH.artefact }) : '';
	text += MESH.mapfragment ? i18next.t('txt.map', { count: MESH.mapfragment }) : '';
	text += MESH.maxsteaks ? i18next.t('txt.steak', { count: MESH.maxsteaks }) : '';
	text += MESH.maxfruits ? i18next.t('txt.fruit', { count: MESH.maxfruits }) : '';

	text += MESH.fightzones ? i18next.t('txt.team', { count: MESH.strength }) : '';

	text += i18next.t('txt.risks');
	text += MESH.groupdeath ? i18next.t('txt.groupdeath', { count: MESH.groupdeath }) : '';
	text += MESH.death ? i18next.t('txt.death', { count: MESH.death }) : '';
//	text += MESH.health ? i18next.t('txt.health', { health: MESH.health }) : '';
	text += MESH.accident[0] ? i18next.t('txt.accident', { accident1: MESH.accident[0], accident2: MESH.accident[1] }) : '';
	text += MESH.fatigue ? i18next.t('txt.fatigue', { fatigue: MESH.fatigue }) : '';
	text += MESH.fightzones ? i18next.t('txt.fight', { count: MESH.fightzones, damage: MESH.fight[0] }) : '';
	text += MESH.mushtrap ? i18next.t('txt.mushtrap', { count: MESH.mushtrap }) : '';
	text += MESH.mia ? i18next.t('txt.lost', { count: MESH.mia }) : '';
	text += MESH.illness ? i18next.t('txt.illness', { count: MESH.illness }) : '';
	text += MESH.itemlost ? i18next.t('txt.objlost', { count: MESH.itemlost }) : '';
	text += MESH.return ? i18next.t('txt.finnish', { count: MESH.return }) : '';
	text += MESH.wander ? i18next.t('txt.wander', { count: MESH.wander }) : '';

	$('#MESH-form textarea').val(text);
};	// END FUNCTION - MESH.textarea

MESH.generatext = function(addTo) {
	var divbutt = $('<div>').addClass('divbutt MESHfloat').appendTo(addTo);
	MESH.MakeButton('<img src="http://data.twinoid.com/img/icons/edit.png" style="vertical-align: -20%"> ' + i18next.t('button.gen_txt'), null, null,
			i18next.t('button.gen_title'), i18next.t('button.gen_desc'))
		.appendTo(divbutt).find("a").on("mousedown", function(){
			MESH.textarea();
		});
	divbutt = $('<div>').addClass('divbutt MESHfloat').appendTo(addTo);
	MESH.MakeButton('<img src="http://data.twinoid.com/img/icons/done.png" style="vertical-align: -20%"> ' + i18next.t('button.cpy_txt'), null, null,
			i18next.t('button.cpy_title'), i18next.t('button.cpy_desc'))
		.appendTo(divbutt).find("a").on("mousedown", function(){
			$('#MESH-form input, #MESH-form textarea').select();
			document.execCommand('copy');
		});
	divbutt = $('<div>').addClass('divbutt MESHfloat').appendTo(addTo);
	MESH.MakeButton('<img src="http://data.twinoid.com/img/icons/refresh.png" style="vertical-align: -20%"> ' + i18next.t('button.rst_txt'), null, null,
			i18next.t('button.rst_title'), i18next.t('button.rst_desc'))
		.appendTo(divbutt).find("a").on("mousedown", function(){
			document.getElementById("MESH-form").reset();
			$('.recommended').removeClass('recommended');
		//	$('option[value="' + MESH.items['space_suit'] + '"]').addClass('recommended');
		});
	var divtxtarea = $('<div>').addClass('MESH-msg MESHfloat').appendTo(addTo);
	$('<textarea>').attr('readonly', '').appendTo(divtxtarea);
};	// END FUNCTION - MESH.generatext

// FUNCTIONS COPIED FROM SCRIPT CTRL-W
MESH.MakeButton = function(content, href, onclick, tiptitle, tipdesc) {
	var but = $("<div>").addClass("action but");
	var butbr = $("<div>").addClass("butright").appendTo(but);
	var butbg = $("<div>").addClass("butbg").appendTo(butbr);

	var buta = $("<a>").attr("href", href ? href : "#").html(content).appendTo(butbg)
	.on("click", onclick ? onclick : href ? null : function() { return false; });

	/* Translators: domain name*/
	if(href !==null && href.indexOf(MESH.domain)){
		buta.attr('target','_blank');
	}

	if (tiptitle || tipdesc) {
		if (tiptitle) buta.attr("_title", tiptitle);
		if (tipdesc) buta.attr("_desc", tipdesc);
		buta.on("mouseover", MESH.CustomTip);
		buta.on("mouseout", MESH.hideTip);
	}

	return but;
};

MESH.CustomTip = function(e) {
	var tgt = (e || event).target;
	var title = tgt.getAttribute("_title");
	var desc = tgt.getAttribute("_desc");
	if (desc) desc = desc.replace(/(\\r|\\n)/g, "");
	var max = 3, current = 0, t = tgt;
	while (!title && !desc && current<max) {
		t = t.parentNode;
		title = t.getAttribute("_title");
		desc = t.getAttribute("_desc");
		if (desc) desc = desc.replace(/(\\r|\\n)/g, "");
		current++;
	}

	Main.showTip(tgt,
		"<div class='tiptop' ><div class='tipbottom'><div class='tipbg'><div class='tipcontent'>" +
		(title ? "<h1>" + title + "</h1>" : "") +
		(desc ? "<p>" + desc.replace("\n", "") + "</p>" : "") +
		"</div></div></div></div>"
	);
};

MESH.hideTip = function(){
	Main.hideTip();
};
// END FUNCTIONS COPIED FROM SCRIPT CTRL-W

MESH.css = function() {
	$("<style>").attr("type", "text/css").html("\
		.MESH-heroname { \
			width: 150px; \
			clear: left; \
		} \
		.MESHfloat { \
			float: left; \
		} \
		#MESH-form textarea { \
			display: block; \
			height: 284px; \
			width: 95%; \
			border: 1px solid rgb(10,40,80); \
			padding: 2px; \
			margin: 5px auto; \
			font-size: 12px; \
			color: rgb(10,40,80); \
			opacity: 0.6; \
			resize: none; \
		} \
		.MESH-msg { \
			width: 100%; \
		} \
		.divbutt { \
			width: 33%; \
		} \
		.MESH-output { \
			width: 350px; \
		} \
		li.MESH-bag { \
			margin-bottom: 2px; \
		} \
		.MESH-exploheroes { \
			width: 400px; \
		} \
		input[name=planet] { \
			width: 200px; \
		} \
		.MESH-planet { \
			margin-top: 10px; \
			margin-bottom: 5px; \
		} \
		.MESH-planet div { \
			padding-left: 60px; \
			display: inline; \
		} \
		.MESH-astrotags { \
			margin: 5px; \
		} \
		.MESH-heroes { \
			height: 68px; \
			width: 385px; \
			padding: 5px 0px 0px 5px; \
			border: 1px solid #3965FB; \
			margin-bottom: 5px; \
		} \
		.MESH-exploheroes { \
			margin-bottom: 5px; \
			margin-top: 5px; \
			margin-left: 5px; \
		} \
		.MESH-output { \
			margin-bottom: 5px; \
		} \
		.MESH-astrotags div > img { \
			height: 34px; \
		} \
		.MESH-astrotags, .MESH-skills { \
			display: flex; \
			margin-left: 5px; \
		} \
		#MESH div > input[type=number], #MESH div > input[type=number]::-webkit-inner-spin-button, \
		#MESH div > input[type=number]::-webkit-outer-spin-button { \
			-moz-appearance: textfield; \
			-webkit-appearance: none; \
			margin: 0; \
		} \
		#MESH input, #MESH select { \
			border: 1px inset; \
			border-color: #4e5162; \
			color: #000; \
			text-align: center; \
			border-radius : 3px; \
		} \
		#MESH div > input[type=number] { \
			width: 32px; \
		} \
		#MESH div > input[type=number] { \
			display: table; \
		} \
		#MESH div > input[name=pfuel] { \
			display: inline; \
		} \
		.MESH-skills div { \
			margin: 3px 0px 7px 3px; \
		} \
		#MESH div > input[type=checkbox] { \
			display: table; \
//			margin: 2px 0px 0px 3px; \
		} \
		.recommended { \
			color: white; \
			background-color: red; \
		} \
		.MESH-title { \
			text-transform: capitalize; \
			font-size: 17px; \
		} \
		.MESH-subtitle { \
			text-transform: lowercase; \
			font-size: 10px; \
		} \
		#MESH { \
			font-size: 10pt; \
		} \
		#tooltip { z-index: 1500 !important; } \
	").appendTo("head");
};	// END FUNCTION - MESH.css

MESH.init = function() {
	MESH.initLang();
    MESH.varsinit();
	MESH.initWindow();
	MESH.css();
	MESH.MakeButton('<img src="' + MESH.icon + '" style="vertical-align: -20%"> ' + MESH.name, null, null, i18next.t('button.title'),
			i18next.t('button.desc'))
		.insertBefore( ($('#updatebtn').length) ? '#updatebtn' : '#cdActionList')
			.find("a").on("mousedown", function(){
			$('#MESH').dialog("open");
		});
};	// END FUNCTION - MESH.init

MESH.init();
