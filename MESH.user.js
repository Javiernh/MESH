// ==UserScript==
// @name	Mesh
// @namespace	Mush Expedition System Help
// @description	Script Mush para asistir en las exploraciones
// @downloadURL	https://github.com/Javiernh/MESH/raw/release/MESH.user.js
// @include	http://mush.twinoid.*/
// @include	http://mush.vg/
// @require	http://code.jquery.com/jquery-latest.js
// @require	http://data.mush.twinoid.es/js/4/jquery-ui-1.9.1.custom.min.js
// @version	0.2b
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
MESH.image = 'http://i.imgur.com/n42XkjT.gif';

MESH.lang = function() {
	switch (MESH.domain) {
		case 'mush.twinoid.es':	// SPANISH
			MESH.astroTags = {
			// TODO: These titles must be copied from the game
				oxygen: "Oxígeno",
				hydrocarbon: "Hidrocarburos",
				insect: "Insectos",
				intelligent: "Vida inteligente",
				mankarog: "Mankarog",
				predator: "Predador",
				ruminant: "Ruminantes",
				hot: "Altas temperaturas",
				cold: "Bajas temperaturas",
				sismic_activity: "Actividad sísmica",
				strong_wind: "Viento fuerte",
				volcanic_activity: "Actividad volcánica",
				cave: "Gruta",
				cristal_field: "Cristalitas",
				desert: "Desierto",
				forest: "Bosque",
				mountain: "Montañas",
				ocean: "Oceano",
				fruit_trees: "Huerta",
				ruins: "Ruinas",
				wreck: "Restos de nave",
				swamp: "Pantano"
			};
			MESH.astroTagsdesc = {
			// TODO: These descriptions must be copied from the game
				oxygen: "",
				hydrocarbon: "",
				insect: "",
				intelligent: "",
				mankarog: "",
				predator: "",
				ruminant: "",
				hot: "",
				cold: "",
				sismic_activity: "",
				strong_wind: "",
				volcanic_activity: "",
				cave: "",
				cristal_field: "",
				desert: "",
				forest: "",
				mountain: "",
				ocean: "",
				fruit_trees: "",
				ruins: "",
				wreck: "",
				swamp: ""
			};
			MESH.items = {
			// TODO: These titles must be copied from the game
				postit: "Post-it",
				space_suit: "Traje espacial",
				trad_module: "Módulo Babel",
				driller: "Taladro",
				echo_sounder: "Eco-localizador",
				quad_compass: "Brújula cuadrimétrica",
				rope: "Cuerda",
				heat_seeker: "Termosensor",
				white_flag: "Bandera blanca",
				blaster: "Blaster",
				knife: "Cuchillo",
				natamy_riffle: "Fusil Natamy",
				items_decoup_05: "Lizaro Jungle",
				machine_gun: "Sulfatosa",
				missile_launcher: "Lanza cohetes",
				grenade: "Granada"
			};
			MESH.itemdesc = {
			// TODO: These descriptions must be copied from the game
				postit: "",
				space_suit: "Permite salir de aprietos en una expedición.<ul><li>Expedición: Anula los daños personales que puedas sufrir en zonas \'Sísmicas\', \'Gruta\' y \'Montaña\'. No protege de las muertes súbitas.</li></ul>",
				trad_module: "",
				driller: "",
				echo_sounder: "",
				quad_compass: "",
				rope: "Permite salir de aprietos en una expedición.<ul><li>Expedición: Anula los daños personales que puedas sufrir en zonas \'Sísmicas\', \'Gruta\' y \'Montaña\'. No protege de las muertes súbitas.</li></ul>",
				heat_seeker: "",
				white_flag: "",
				blaster: "",
				knife: "",
				natamy_riffle: "",
				items_decoup_05: "",
				machine_gun: "",
				missile_launcher: "",
				grenade: ""
			};
			MESH.skills = {
				botanic: "Botánico",
				diplomacy: "Diplomático",
				gunman: "Artillero",
				sprint: "Velocista",
				survival: "Superviviente"
			};
			MESH.skillsdesc = {
				botanic: "El botánico sabe distinguir las propiedades de los vegetales. Es el más eficiente en el mantenimiento del jardín.<ul><li>Puede leer las <strong>propiedades de los frutos</strong>.</li><li>Puede leer las <strong>propiedades de las plantas</strong>.</li><li>Puede realizar <strong>injertos</strong>.</li><li>+2 <img src=\'/img/icons/ui/pa_garden.png\' alt=\'gard\'/> por día (puntos de acción <strong>Jardinería</strong>).</li><li>En expedición: La <strong>Cosecha</strong> da un fruto o más.</li><li>Bonus para desarrollar ciertos <strong>Proyectos NERON</strong>.</li></ul>",
				diplomacy: "Un buen diplomático sabe como establecer buenas relaciones con los extraterrestres.<ul><li>Elimina las probabilidades de efectos negativos en los encuentros extraterrestres.</li><li>Puede declarar un cese al fuego en una partida.</li></ul>",
				gunman: "El artillero domina el uso de armas.<ul><li>+2 <img src=\'/img/icons/ui/pa_shoot.png\' alt=\'shoot\'/> <strong>Tiros gratis</strong> al día.</li><li>Tus tiros fallidos provocan 2 veces menos efectos calamitosos.</li><li>Tus tiros exitosos duplican sus impactos críticos.</li><li>Bonus para desarrollar ciertos <strong>Proyectos NERON</strong>.</li></ul>",
				sprint: "¡El velocista inicia siempre con el pie derecho! Goza de Puntos de Movimiento adicionales.<ul><li>Ganas 2 <img class=\'paslot\' src=\'/img/icons/ui/pa_slot2.png\' alt=\'pm\'/> adicionales en cada conversión <img class=\'paslot\' src=\'/img/icons/ui/pa_slot1.png\' alt=\'pa\' />-<img class=\'paslot\' src=\'/img/icons/ui/pa_slot2.png\' alt=\'pm\'/> (No acumulable con el <strong>Patinete</strong>).</li></ul>",
				survival: "El experto en sobrevivencia es perfecto para las misiones de exploración. Se defiende bien ante los ataques extraterrestres y tendrá más probabilidades de éxito.<ul><li>Expedición: Cada daño se <strong>reduce en un punto</strong>. </li><li>Expedición: El evento <strong>Provisión</strong> da un bistec adicional.</li><li>Expedición: Es el último en morir en caso de evento fatal.</li></ul>"
			};
			MESH.msglang = {
				msgtitle: "Información de Expedición a " + MESH.pname + ".**",
				msginfo: "\n//Está localizado a " + MESH.pfuel + " sectores al " + MESH.pdirection + " y tiene " + MESH.Totzones + " zonas.//",
				group: "\n \n**Grupo propuesto y equipo: **",
				gains: "\n \n**Posibles ganancias: **",
				o2: "\nHasta " + MESH.maxoxygen + " unidades de :o2:.",
				fuel: "\nHasta " + MESH.maxfuel + " unidades de :fuel:.",
				artefact: "\nHasta " + MESH.artefact + " artefacto(s) alien.",
				map: "\nHasta " + MESH.mapfragment + " fragmento(s) de mapa.",
				steak: "\nHasta " + MESH.maxsteaks + " bistec(s) alien.",
				fruit: "\nHasta " + MESH.maxfruits + " fruto(s) alien.",
				risks: "\n \n**Posibles riesgos: **",
				groupdeath: "\nHasta " + MESH.groupdeath + " zona(s) de muerte del grupo.",
				death: "\nHasta " + MESH.death + " tripulante(s) muerto(s) en el acto.",
				accident: "\nHasta " + MESH.accident[0] + " - " + MESH.accident[1] + " :pv: de daño por accidente.",
				fight: "\nHasta " + MESH.fightzones + " combate(s) con hasta " + MESH.fight[0] + " de fuerza. ",
				fatigue: "\nHasta " + MESH.fatigue + " :pv: de daño por fatiga.",
				mushtrap: "\nHasta " + MESH.mushtrap + " trampa(s) mush.",
				lost: "\nHasta " + MESH.mia + " tripulante(s) perdido(s)",
				illness: "\nHasta " + MESH.illness + " enfermedad(es) contraída(s).",
				objlost: "\nHasta " + MESH.itemlost + " objeto(s) perdido(s).",
				finnish: "\nHasta " + MESH.return + " zona(s) de regreso a nave.",
				wander: "\nHasta " + MESH.wander + " zona(s) errante(s)",
			};
			break;
		case 'mush.twinoid.com':	// ENGLISH
			MESH.astroTags = {
			// TODO: These titles must be copied from the game
				oxygen: "Oxygen",
				hydrocarbon: "Hydrocarbon",
				insect: "Insect",
				intelligent: "Intelligent",
				mankarog: "Mankarog",
				predator: "Predator",
				ruminant: "Ruminant",
				hot: "Hot",
				cold: "Cold",
				sismic_activity: "Sismic activity",
				strong_wind: "Strong wind",
				volcanic_activity: "Volcanic activity",
				cave: "Cave",
				cristal_field: "Cristal field",
				desert: "Desert",
				forest: "Forest",
				mountain: "Mountain",
				ocean: "Ocean",
				fruit_trees: "Fruit trees",
				ruins: "Ruins",
				wreck: "Wreck",
				swamp: "Swamp"
			};
			MESH.astroTagsdesc = {
			// TODO: These descriptions must be copied from the game
				oxygen: "",
				hydrocarbon: "",
				insect: "",
				intelligent: "",
				mankarog: "",
				predator: "",
				ruminant: "",
				hot: "",
				cold: "",
				sismic_activity: "",
				strong_wind: "",
				volcanic_activity: "",
				cave: "",
				cristal_field: "",
				desert: "",
				forest: "",
				mountain: "",
				ocean: "",
				fruit_trees: "",
				ruins: "",
				wreck: "",
				swamp: ""
			};
			MESH.items = {
			// TODO: These titles must be copied from the game
				postit: "Postit",
				space_suit: "Space suit",
				trad_module: "Trad module",
				driller: "Driller",
				echo_sounder: "Echo sounder",
				quad_compass: "Quad compass",
				rope: "Rope",
				heat_seeker: "Heat seeker",
				white_flag: "White flag",
				blaster: "Blaster",
				knife: "Knife",
				natamy_riffle: "Natamy riffle",
				items_decoup_05: "Lizaro Jungle",
				machine_gun: "Machine gun",
				missile_launcher: "Missile launcher",
				grenade: "Grenade"
			};
			MESH.itemdesc = {
			// TODO: These descriptions must be copied from the game
				postit: "",
				space_suit: "",
				trad_module: "",
				driller: "",
				echo_sounder: "",
				quad_compass: "",
				rope: "",
				heat_seeker: "",
				white_flag: "",
				blaster: "",
				knife: "",
				natamy_riffle: "",
				items_decoup_05: "",
				machine_gun: "",
				missile_launcher: "",
				grenade: ""
			};
			MESH.skills = {
				botanic: "Botanist",
				diplomacy: "Diplomat",
				gunman: "Shooter",
				sprint: "Sprinter",
				survival: "Survivalist"
			};
			MESH.skillsdesc = {
				botanic: "Capable of distinguishing the characteristics of the various plants and fruits. They are also equally effective when maintaining the garden.<ul><li>Can read the <strong>fruit nutrition information</strong>.</li><li>Can read <strong>plant properties</strong>.</li><li>Can carry out <strong>transplants</strong>.</li><li>+2 <img src=\'/img/icons/ui/pa_garden.png\' alt=\'gard\'/> per day (<strong>Gardening</strong> Action Points).</li><li>Expedition: The <strong>harvest</strong> action gives an additional fruit.</li><li>Bonus for developing certain <strong>NERON projects</strong>.</li></ul>",
				diplomacy: "A good diplomat knows how to communicate effectively with extra-terrestrials.<ul><li>Eliminates the chance of encountering hostility from extra-terrestrials.</li><li>Can declare a ceasefire once per game.</li></ul>",
				gunman: "At ease handling all kinds of weapons<ul><li>+2 <strong>Free Shots</strong> <img src=\'/img/icons/ui/pa_shoot.png\' alt=\'shoot\'/> per day.</li><li>Your off-target shots cause 2 times fewer accidents.</li><li>Your successful shots cause 2 times as many critical hits.</li><li>Bonus +1 to expedition combat strangth.</li><li>Bonus for developing certain <strong>NERON projects</strong>.</li></ul>",
				sprint: "The Sprinter always puts their best foot forward! They get additional Movement Points.<ul><li>You earn an additional 2 <img class=\'paslot\' src=\'/img/icons/ui/pa_slot2.png\' alt=\'pm\'/> every time you convert <img class=\'paslot\' src=\'/img/icons/ui/pa_slot1.png\' alt=\'pa\' />-<img class=\'paslot\' src=\'/img/icons/ui/pa_slot2.png\' alt=\'pm\'/> (does not stack with <strong>Scooter</strong>).</li><li>Expeditions involving a Sprinter will allow an additional planetary zone to be explored</li></ul>",
				survival: "The Survivalist is great to have on exploration missions. They can defend themselves more effectively against extra-terrestrial life forms and generally deal with these encounters better than anyone else.<ul><li>Expedition : All damage is <strong>reduced by one point</strong>. </li><li>Expedition : The action <strong>Provision</strong> gives one additional steak.</li><li>Expedition : Last to die if a team fatality occurs.</li></ul>"
			};
			MESH.msglang = {
			// TODO: Translate to english
				msgtitle: "Información de Expedición a " + MESH.pname + ".**",
				msginfo: "\n//Está localizado a " + MESH.pfuel + " sectores al " + MESH.pdirection + " y tiene " + MESH.Totzones + " zonas.//",
				group: "\n \n**Grupo propuesto y equipo: **",
				gains: "\n \n**Posibles ganancias: **",
				o2: "\nHasta " + MESH.maxoxygen + " unidades de :o2:.",
				fuel: "\nHasta " + MESH.maxfuel + " unidades de :fuel:.",
				artefact: "\nHasta " + MESH.artefact + " artefacto(s) alien.",
				map: "\nHasta " + MESH.mapfragment + " fragmento(s) de mapa.",
				steak: "\nHasta " + MESH.maxsteaks + " bistec(s) alien.",
				fruit: "\nHasta " + MESH.maxfruits + " fruto(s) alien.",
				risks: "\n \n**Posibles riesgos: **",
				groupdeath: "\nHasta " + MESH.groupdeath + " zona(s) de muerte del grupo.",
				death: "\nHasta " + MESH.death + " tripulante(s) muerto(s) en el acto.",
				accident: "\nHasta " + MESH.accident[0] + " - " + MESH.accident[1] + " :pv: de daño por accidente.",
				fight: "\nHasta " + MESH.fightzones + " combate(s) con hasta " + MESH.fight[0] + " de fuerza. ",
				fatigue: "\nHasta " + MESH.fatigue + " :pv: de daño por fatiga.",
				mushtrap: "\nHasta " + MESH.mushtrap + " trampa(s) mush.",
				lost: "\nHasta " + MESH.mia + " tripulante(s) perdido(s)",
				illness: "\nHasta " + MESH.illness + " enfermedad(es) contraída(s).",
				objlost: "\nHasta " + MESH.itemlost + " objeto(s) perdido(s).",
				finnish: "\nHasta " + MESH.return + " zona(s) de regreso a nave.",
				wander: "\nHasta " + MESH.wander + " zona(s) errante(s)",
			};
			break;
		default:	// FRENCH
			MESH.astroTags = {
			// TODO: These titles must be copied from the game
				oxygen: "",
				hydrocarbon: "",
				insect: "",
				intelligent: "",
				mankarog: "",
				predator: "",
				ruminant: "",
				hot: "",
				cold: "",
				sismic_activity: "",
				strong_wind: "",
				volcanic_activity: "",
				cave: "",
				cristal_field: "",
				desert: "",
				forest: "",
				mountain: "",
				ocean: "",
				fruit_trees: "",
				ruins: "",
				wreck: "",
				swamp: ""
			};
			MESH.astroTagsdesc = {
			// TODO: These descriptions must be copied from the game
				oxygen: "",
				hydrocarbon: "",
				insect: "",
				intelligent: "",
				mankarog: "",
				predator: "",
				ruminant: "",
				hot: "",
				cold: "",
				sismic_activity: "",
				strong_wind: "",
				volcanic_activity: "",
				cave: "",
				cristal_field: "",
				desert: "",
				forest: "",
				mountain: "",
				ocean: "",
				fruit_trees: "",
				ruins: "",
				wreck: "",
				swamp: ""
			};
			MESH.items = {
			// TODO: These titles must be copied from the game
				postit: "",
				space_suit: "",
				trad_module: "",
				driller: "",
				echo_sounder: "",
				quad_compass: "",
				rope: "",
				heat_seeker: "",
				white_flag: "",
				blaster: "",
				knife: "",
				natamy_riffle: "",
				items_decoup_05: "",
				machine_gun: "",
				missile_launcher: "",
				grenade: ""
			};
			MESH.itemdesc = {
			// TODO: These descriptions must be copied from the game
				postit: "",
				space_suit: "",
				trad_module: "",
				driller: "",
				echo_sounder: "",
				quad_compass: "",
				rope: "",
				heat_seeker: "",
				white_flag: "",
				blaster: "",
				knife: "",
				natamy_riffle: "",
				items_decoup_05: "",
				machine_gun: "",
				missile_launcher: "",
				grenade: ""
			};
			MESH.skills = {
				botanic: "Botaniste",
				diplomacy: "Diplomatie",
				gunman: "Tireur",
				sprint: "Sprinter",
				survival: "Survie"
			};
			MESH.skillsdesc = {
				botanic: "Le botaniste peut distinguer les caractéristiques des légumes et des plantes. Il est également redoutablement efficace dans la maintenance du Jardin.<ul><li>Peut lire les <strong>propriétés des fruits</strong>.</li><li>Peut lire les <strong>propriétés des plantes</strong>.</li><li>Peut effectuer des <strong>greffes</strong>.</li><li>+2 <img src=\'/img/icons/ui/pa_garden.png\' alt=\'gard\'/> par jour (points d\'action <strong>Jardinage</strong>).</li><li>Expédition : L\'év&egrave;nement <strong>Récolte</strong> donne un fruit de plus.</li><li>Bonus pour développer certains <strong>Projets NERON</strong>.</li></ul>",
				diplomacy: "Un bon diplomate sait comment entrer en contact avec les races extra-terrestres.<ul><li>Élimine les chances de résultats négatifs lors des rencontres extra-terrestres.</li><li>Peut déclarer un cesser-le-feu une fois par partie.</li></ul>",
				gunman: "Le tireur manipule les armes de tout type avec beaucoup d\'aisance.<ul><li>+2 <strong>Tirs gratuits</strong> <img src=\'/img/icons/ui/pa_shoot.png\' alt=\'shoot\'/> par jour.</li><li>Vos tirs ratés provoquent 2 fois moins de maladresses.</li><li>Vos tirs réussis provoquent 2 fois plus de coups critiques.</li><li>Bonus pour développer certains Projets NERON.</li></ul>",
				sprint: "Le Sprinter débute toujours sa journée du bon pied ! Il profite de Points de Mouvement supplémentaires.<ul><li>Vous gagnez 2 <img class=\'paslot\' src=\'/img/icons/ui/pa_slot2.png\' alt=\'pm\'/> de plus à chaque conversion <img class=\'paslot\' src=\'/img/icons/ui/pa_slot1.png\' alt=\'pa\' />-<img class=\'paslot\' src=\'/img/icons/ui/pa_slot2.png\' alt=\'pm\'/> ( non cumulatif avec la <strong>Trottinette</strong>).</li><li>+ 1 étape en exploration.</li></ul>",
				survival: "L\'expert en survie est un bon atout dans les missions d\'exploration. Il peut se défendre plus efficacement contre les formes de vies extraterrestres et s\'en sortira mieux que les autres.<ul><li>Expédition : Chaque dégât est <strong>réduit de un point</strong>. </li><li>Expédition : L\'év&egrave;nement <strong>Provision</strong> donne un steak de plus.</li><li>Expédition : Dernier à mourir en cas d\'év&egrave;nement fatal.</li></ul>"
			};
			MESH.msglang = {
			// TODO: Translate to french
				msgtitle: "Información de Expedición a " + MESH.pname + ".**",
				msginfo: "\n//Está localizado a " + MESH.pfuel + " sectores al " + MESH.pdirection + " y tiene " + MESH.Totzones + " zonas.//",
				group: "\n \n**Grupo propuesto y equipo: **",
				gains: "\n \n**Posibles ganancias: **",
				o2: "\nHasta " + MESH.maxoxygen + " unidades de :o2:.",
				fuel: "\nHasta " + MESH.maxfuel + " unidades de :fuel:.",
				artefact: "\nHasta " + MESH.artefact + " artefacto(s) alien.",
				map: "\nHasta " + MESH.mapfragment + " fragmento(s) de mapa.",
				steak: "\nHasta " + MESH.maxsteaks + " bistec(s) alien.",
				fruit: "\nHasta " + MESH.maxfruits + " fruto(s) alien.",
				risks: "\n \n**Posibles riesgos: **",
				groupdeath: "\nHasta " + MESH.groupdeath + " zona(s) de muerte del grupo.",
				death: "\nHasta " + MESH.death + " tripulante(s) muerto(s) en el acto.",
				accident: "\nHasta " + MESH.accident[0] + " - " + MESH.accident[1] + " :pv: de daño por accidente.",
				fight: "\nHasta " + MESH.fightzones + " combate(s) con hasta " + MESH.fight[0] + " de fuerza. ",
				fatigue: "\nHasta " + MESH.fatigue + " :pv: de daño por fatiga.",
				mushtrap: "\nHasta " + MESH.mushtrap + " trampa(s) mush.",
				lost: "\nHasta " + MESH.mia + " tripulante(s) perdido(s)",
				illness: "\nHasta " + MESH.illness + " enfermedad(es) contraída(s).",
				objlost: "\nHasta " + MESH.itemlost + " objeto(s) perdido(s).",
				finnish: "\nHasta " + MESH.return + " zona(s) de regreso a nave.",
				wander: "\nHasta " + MESH.wander + " zona(s) errante(s)",
			};
	}	// END SWITCH
};	// END FUNCTION - MESH.lang

MESH.heroes = ["jin_su", "frieda", "kuan_ti", "janice", "roland", "hua", "paola", "chao", "finola",
			"stephen", "ian", "chun", "raluca", "gioele", "eleesha", "terrence", "andie", "derek"];
MESH.TagURL = "/img/icons/astro/tag_";

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
	// ----------------- WINDOW ----------------- //
	var window = $('<div>')
		.attr('id', 'MESH')
		.attr('tabindex', '-1')
		.addClass('ui-dialog ui-widget ui-widget-content')
		.css({"z-index": "8", "height": "auto", "width": "755px", "top": "-10px", "left": "60px", "display": "block"})
		.appendTo('#cdUiHook');
	// ----------------- TITLE ----------------- //
	var wintitle = $('<div></div>::before')
		.addClass('ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix')
		.appendTo(window);
	$('<span>' + MESH.Title + '</span>')
		.addClass('ui-dialog-title MESH-title')
		.appendTo(wintitle);
	$('<span>(v' + MESH.version + ')</span>')
		.addClass('ui-dialog-title MESH-subtitle')
		.appendTo(wintitle);
	// ----------------- CLOSE (x) ----------------- //
	var wina = $('<a href="#" role="button"></a>::after')
		.addClass('ui-dialog-titlebar-close ui-corner-all')
		.attr('onclick', '$("#MESH").hide()')
		.appendTo(wintitle);
	$('<span>close</span>')
		.addClass('ui-icon ui-icon-closethick')
		.appendTo(wina);
	// ----------------- DRAGGABLE ----------------- //
	window.draggable({ handle: ".ui-dialog-titlebar" });
	// ----------------- CONTENT ----------------- //
	var divform = $('<div>').appendTo(window);
	var form = $('<form>').attr('id', 'MESH-form').appendTo(divform);
	var planet = $('<div>').addClass('MESH-planet MESHfloat').appendTo(form);
	var astrotags = $('<div>').addClass('MESH-astrotags MESHfloat').appendTo(form);
	var exploheroes = $('<div>').addClass('MESH-exploheroes MESHfloat').appendTo(form);
	var output = $('<div>').addClass('MESH-output MESHfloat').appendTo(form);
	MESH.astroinfo(planet, astrotags);
	MESH.exploHeroes(exploheroes);
	MESH.generatext(output);

	$('#MESH-form input, #MESH-form textarea').on('click', function() {
		$(this).focus();
		$(this).select();
	});
};	// END FUNCTION - MESH.initWindow

MESH.OpenWindow = function() {
	if ($('#cdBottomBlock li[data-p="_ICARUS_LARGER_BAY"]').length === 0) { MESH.index = 4; }	// Max. 4 heroes in exploration.
	else { MESH.index = 6; }	// Max. 6 heroes in exploration.

	var $MESHwindow = $('#MESH');
	if ($MESHwindow.length === 0) { MESH.initWindow(); }
	else { $MESHwindow.show(); }
};	// END FUNCTION - MESH.OpenWindow

MESH.astroinfo = function(pdata, astrotags) {
	// ----------------- PLANET DATA ----------------- //
	$('<div><span>Planeta: </span><input type="text" name="pname" maxlength="23" tid_default="Nombre del Planeta"></div>').appendTo(pdata);
	var pdir = $('<div><span>Dirección: </span></div>').appendTo(pdata);
	var pdirsel = $('<select name="pdirection"></select>').appendTo(pdir);
		// TODO: multilingual (for loop)
		$('<option value="" selected>').appendTo(pdirsel);
		$('<option value="norte">Norte</option>').appendTo(pdirsel);
		$('<option value="sur">Sur</option>').appendTo(pdirsel);
		$('<option value="este">Este</option>').appendTo(pdirsel);
		$('<option value="oeste">Oeste</option>').appendTo(pdirsel);
	$('<div><span>Combustible: </span><input name="pfuel" type="number" min="0" max="9" value="0"></div>').appendTo(pdata);
	// ----------------- ASTRO ----------------- //
	for (var itag in MESH.astroTags) {
		MESH.MakeInput($('<input type="number" name="' + itag + '" min="0" max="9" value="0">'),
			'/img/icons/astro/tag_' + itag + '.png', 34, MESH.astroTags[itag], MESH.astroTagsdesc[itag]).appendTo(astrotags);
	}
};	// END FUNCTION - MESH.astroinfo

MESH.herobag = function(divhero, pos) {
	var herobag = $('<ul>').addClass('MESH-bag MESHfloat').appendTo(divhero);
	for (var i = 0; i < 3; i++) {
		var lisel = $('<li>').addClass('MESH-bag').appendTo(herobag);
		var select = $('<select name="item' + i + 'hero' + pos + '">').appendTo(lisel);
		$('<option value="" selected>').appendTo(select);
		var group = 0, optgroup = 0;
		// TODO: multilingual
		var eqpt = $('<optgroup>').attr('label', 'Equipamiento').appendTo(select);
		var guns = $('<optgroup>').attr('label', 'Armamento').appendTo(select);
		for (var item in MESH.items) {
			if (group < 9) { optgroup = eqpt; }
			else { optgroup = guns; }
			$('<option value="' + MESH.items[item] + '">' + MESH.items[item] + '</option>').appendTo(optgroup);
			group++;
		}
	}
};	// END FUNCTION - MESH.herobag

MESH.heroskills = function(addTo, pos) {
	var divskills = $('<div>').addClass('MESH-skills MESHfloat').appendTo(addTo);
	for (var skill in MESH.skills) {
		MESH.MakeInput($('<input type="checkbox" name="' + skill + pos + '" value="' + skill + '">'),
			'/img/icons/skills/' + skill + '.png', 21, MESH.skills[skill], MESH.skillsdesc[skill]).appendTo(divskills);
	}
};	// END FUNCTION - MESH.heroskills

MESH.exploHeroes = function(addTo) {
//	var ulHeroes = $('<ul>').addClass('MESH-heroes').appendTo(addTo);
	for (var i = 0; i < MESH.index; i++) {
//		var liHeroes = $('<li>').addClass('MESH-heroes').appendTo(ulHeroes);
		var liHeroes = $('<div>').addClass('MESH-heroes').appendTo(addTo);
		var divhero = $('<div>').addClass('MESH-heroname MESHfloat').appendTo(liHeroes);
		$('<span>Héroe ' + (i+1) + ': </span>').addClass('MESHfloat').appendTo(divhero);
		var select = $('<select name="hero' + i + '">').addClass('MESHfloat').appendTo(divhero);
		$('<option value="" selected>').appendTo(select);
		for (var hero in MESH.heroes) {
			$('<option value="' + MESH.heroes[hero] + '">' + MESH.heroes[hero].replace("_", " ").capitalize() + '</option>').appendTo(select);
		}
		$('<span> Mochila: </span>').addClass('MESHfloat').appendTo(liHeroes);
		MESH.herobag(liHeroes, i);
		MESH.heroskills(divhero, i);
	}

	// Hide / show heroes selected / deselected
	var prevHero = [];
	$('.MESH-exploheroes select[name^="hero"]').change(function() {
		var indsel = parseInt($(this).attr('name').replace('hero', ''));
		var hideHero = $(this).val();
		if (hideHero !== "") {
			$('.MESH-exploheroes option[value=' + hideHero + ']').hide();
		}
		$('.MESH-exploheroes option[value=' + prevHero[indsel] + ']').show();
		prevHero[indsel] = $(this).val();
	});
	// Add / remove "recommended" class to items
	$('.MESH-astrotags input, input[name^="diplomacy"').change(function() {
//		var zone = $(this).attr('name');
		var numz = [];
		var sprintndd = 0;
		var survivalndd = 0;
		for (var tag in MESH.astroTags) {
			numz[tag] = parseInt($('input[name="' + tag + '"]').val());
			sprintndd += parseInt($('input[name="' + tag + '"]').val());
			if ( tag != 'oxygen' && tag != 'hydrocarbon' && tag != 'volcanic_activity' && tag != 'forest' && tag != 'ocean' && tag != 'fruit_trees') {
				survivalndd += parseInt($('input[name="' + tag + '"]').val());
			}
		}
		
		// postit
		if ( numz['intelligent'] || numz['strong_wind'] ) {
			$('option[value="' + MESH.items['postit'] + '"]').addClass('recommended');
		}
		else { $('option[value="' + MESH.items['postit'] + '"]').removeClass('recommended'); }
		// space_suit
		if ( !numz['oxygen'] ) {
			$('option[value="' + MESH.items['space_suit'] + '"]').addClass('recommended');
		}
		else { $('option[value="' + MESH.items['space_suit'] + '"]').removeClass('recommended'); }
		// trad_module & white_flag
		if ( numz['intelligent'] ) {
			$('option[value="' + MESH.items['trad_module'] + '"]').addClass('recommended');
			$('option[value="' + MESH.items['white_flag'] + '"]').addClass('recommended');
		}
		else {
			$('option[value="' + MESH.items['trad_module'] + '"]').removeClass('recommended');
			$('option[value="' + MESH.items['white_flag'] + '"]').removeClass('recommended');
		}
		// driller
		if ( numz['hydrocarbon'] || numz['cave'] || numz['mountain'] || numz['wreck'] ) {
			$('option[value="' + MESH.items['driller'] + '"]').addClass('recommended');
		}
		else { $('option[value="' + MESH.items['driller'] + '"]').removeClass('recommended'); }
		// echo_sounder
		if ( numz['hydrocarbon'] ) {
			$('option[value="' + MESH.items['echo_sounder'] + '"]').addClass('recommended');
		}
		else { $('option[value="' + MESH.items['echo_sounder'] + '"]').removeClass('recommended'); }
		// quad_compass
		if ( numz['desert'] || numz['forest'] || numz['cave'] || numz['cold'] || numz['cristal_field'] || numz['ocean'] ) {
			$('option[value="' + MESH.items['quad_compass'] + '"]').addClass('recommended');
		}
		else { $('option[value="' + MESH.items['quad_compass'] + '"]').removeClass('recommended'); }
		// rope
		if ( numz['sismic_activity'] || numz['cave'] || numz['mountain'] ) {
			$('option[value="' + MESH.items['rope'] + '"]').addClass('recommended');
		}
		else { $('option[value="' + MESH.items['rope'] + '"]').removeClass('recommended'); }
		// heat_seeker
		if (( numz['insect'] || numz['intelligent'] || numz['predator'] || numz['ruminant'] ) && numz['mankarog'] === 0 ) {
			$('option[value="' + MESH.items['heat_seeker'] + '"]').addClass('recommended');
		}
		else { $('option[value="' + MESH.items['heat_seeker'] + '"]').removeClass('recommended'); }
		// weapons
		if ( numz['insect'] || numz['intelligent'] || numz['mankarog'] || numz['predator'] || numz['ruminant']
				|| numz['cristal_field'] || numz['ruins']  || numz['wreck']  ) {
			// TODO: Multilingual [label]
			$('optgroup[label="Armamento"] > option').addClass('recommended');
			$('input[value="diplomacy"]').parent().addClass('recommended');
			$('input[value="gunman"]').parent().addClass('recommended');
			if ( $('input[name^="diplomacy"]').is(':checked') ) {
				$('optgroup[label="Armamento"] > option').removeClass('recommended');
			}
		}
		else {
			// TODO: Multilingual [label]
			$('optgroup[label="Armamento"] > option').removeClass('recommended');
			$('input[value="diplomacy"]').parent().removeClass('recommended');
			$('input[value="gunman"]').parent().removeClass('recommended');
		}
		// botanic
		if ( numz['hot'] || numz['forest'] || numz['mountain'] || numz['fruit_trees'] || numz['swamp'] ) {
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
	var ifight = 0;
	var isteaks = 0;
	MESH.varsinit();
	MESH.pname = $('[name="pname"]').val().capitalize();
	MESH.pfuel = $('[name="pfuel"]').val();
	MESH.pdirection = $('[name="pdirection"]').val();
	
	$('.MESH-heroes').each(function(index) {
		if ( $('input[name="botanic' + index + '"]').is(':checked') ) { MESH.botanic += 1; }
		if ( $('input[name="diplomacy' + index + '"]').is(':checked') ) { MESH.diplomacy = 1; }
		if ( $('input[name="gunman' + index + '"]').is(':checked') ) {
			for (var i = 0; i < 4; i++) {
				var ifblaster = $('li select[name$="' + i + 'hero' + index + '"]').val();
				var isBlaster = (ifblaster == 'Blaster') ? ifblaster : isBlaster;
			}
			if ( isBlaster == 'Blaster' ) { MESH.gunman += 1; }
		}
		if ( $('input[name="sprint' + index + '"]').is(':checked') ) { MESH.sprint += 1; }
		if ( $('input[name="survival' + index + '"]').is(':checked') ) { MESH.survival += 1; }
		// TODO: Need to add "Polyvalent" checkbox
		if ( $('input[name="skilful' + index + '"]').is(':checked') ) { MESH.skilful += 1; }
	});

	for (var zone in MESH.astroTags) {
		var zonval = parseInt($('.MESH-astrotags input[name="' + zone + '"]').val());
		MESH.Totzones += zonval;
		if (zonval !== 0) {
			MESH.zones.push(zonval + 'x ' + MESH.astroTags[zone]);
		}
		// Pump
		if (zone == 'oxygen') {
			MESH.maxoxygen += 24*zonval;
		}
		// Fuel
		if (zone == 'hydrocarbon' || zone == 'cave' || zone == 'mountain' || zone == 'wreck') {
			if (zone == 'hydrocarbon') { MESH.maxfuel += 6*zonval; }
			else if (zone == 'cave') { MESH.maxfuel += 2*zonval; }
			else if (zone == 'mountain') { MESH.maxfuel += zonval; }
			else if (zone == 'wreck') { MESH.maxfuel += 3*zonval; }
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
			if (zone == 'ocean') { MESH.maxsteaks += zonval*(3+MESH.survival); }
			else { MESH.maxsteaks += (isteaks+1+MESH.survival)*zonval; }
			isteaks++;
		}
		// Harvest
		if (zone == 'hot' || zone == 'forest' || zone == 'mountain' || zone == 'fruit_trees' || zone == 'swamp') {
			if (zone == 'fruit_trees') { MESH.maxfruits += zonval*(3+MESH.botanic); }
			else if (zone == 'mountain') { MESH.maxfruits += zonval*MESH.botanic; }
			else { MESH.maxfruits += zonval*(2+MESH.botanic); }
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
			MESH.accident[0] += 3*zonval;
			MESH.accident[1] += 5*zonval;
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
			MESH.fatigue += 2*zonval;
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

	$('.MESH-heroes').each(function() {
		var $herosel = $(this).find('select[name^="hero"]');
		MESH.group.push($herosel.val().replace('_', ' ').capitalize());
		MESH.bag0.push($(this).find('select[name^="item0"]').val());
		MESH.bag1.push($(this).find('select[name^="item1"]').val());
		MESH.bag2.push($(this).find('select[name^="item2"]').val());
	});
};	// END FUNCTION - MESH.calcs

MESH.textarea = function() {
	MESH.calcs();
	MESH.lang();
	var text = '';
	text += MESH.msglang.msgtitle;
	text += MESH.msglang.msginfo;
	text += '\n' + MESH.zones.join(', ');
	text += MESH.msglang.group;
	for (var ghero in MESH.group) {
		if (MESH.group[ghero] !== "") {
			text += '\n**' + MESH.group[ghero] + '** - ';
			if (MESH.bag0[ghero] !== "") {
				text += '//' + MESH.bag0[ghero] + '//';
			}
			if (MESH.bag1[ghero] !== "") {
				text += ', //' + MESH.bag1[ghero] + '//';
			}
			if (MESH.bag2[ghero] !== "") {
				text += ', //' + MESH.bag2[ghero] + '//';
			}
		}
	}
	text += MESH.msglang.gains;
	text += MESH.maxoxygen ? MESH.msglang.o2 : '';
	text += MESH.maxfuel ? MESH.msglang.fuel : '';
	text += MESH.artefact ? MESH.msglang.artefact : '';
	text += MESH.mapfragment ? MESH.msglang.map : '';
	text += MESH.maxsteaks ? MESH.msglang.steak : '';
	text += MESH.maxfruits ? MESH.msglang.fruit : '';

	text += MESH.msglang.risks;
	text += MESH.groupdeath ? MESH.msglang.groupdeath : '';
	text += MESH.death ? MESH.msglang.death : '';
	text += MESH.accident[0] ? MESH.msglang.accident : '';
	text += MESH.fightzones ? MESH.msglang.fight : '';
	text += MESH.fatigue ? MESH.msglang.fatigue : '';
	text += MESH.mushtrap ? MESH.msglang.mushtrap : '';
	text += MESH.mia ? MESH.msglang.lost : '';
	text += MESH.illness ? MESH.msglang.illness : '';
	text += MESH.itemlost ? MESH.msglang.objlost : '';
	text += MESH.return ? MESH.msglang.finnish : '';
	text += MESH.wander ? MESH.msglang.wander : '';

	$('#MESH-form textarea').val(text);
};	// END FUNCTION - MESH.textarea

MESH.generatext = function(addTo) {
	var divbutt = $('<div>').addClass('divbutt MESHfloat').appendTo(addTo);
	MESH.MakeButton('<img src="http://data.twinoid.com/img/icons/edit.png" style="vertical-align: -20%"> Generar', null, null, 'Generar mensaje',
			'Haz click después de configurar los datos del planeta, así como los tripulantes y objetos a llevar.')
		.appendTo(divbutt).find("a").on("mousedown", function(){
			MESH.textarea();
		});
	divbutt = $('<div>').addClass('divbutt MESHfloat').appendTo(addTo);
	MESH.MakeButton('<img src="http://data.twinoid.com/img/icons/done.png" style="vertical-align: -20%"> Copiar', null, null, 'Copiar texto',
			'Haz click para copiar el texto del mensaje en el portapapeles. Si no te funciona, selecciona el texto y presiona Ctrl+C.')
		.appendTo(divbutt).find("a").on("mousedown", function(){
			$('#MESH-form input, #MESH-form textarea').select();
			document.execCommand('copy');
		});
	divbutt = $('<div>').addClass('divbutt MESHfloat').appendTo(addTo);
	MESH.MakeButton('<img src="http://data.twinoid.com/img/icons/refresh.png" style="vertical-align: -20%"> Resetear', null, null, 'Resetear entradas',
			'Haz click para poner por defecto todos los valores de los campos de entrada.')
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
			font-size: 10px; \
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
	").appendTo("head");
};	// END FUNCTION - MESH.css

MESH.init = function() {
    MESH.varsinit();
	MESH.lang();
	MESH.css();
	MESH.MakeButton('<img src="' + MESH.image + '" style="vertical-align: -20%"> ' + MESH.name, null, null, 'Asistente de expediciones',
			'Genial para organizar una expedición exitosa. El equipo de desarrollo no garantiza el éxito de la expedición')
		.insertAfter('#updatebtn').find("a").on("mousedown", function(){
			MESH.OpenWindow();	// TODO: MESH.OpenWindow();
				});
};	// END FUNCTION - MESH.init

MESH.init();
