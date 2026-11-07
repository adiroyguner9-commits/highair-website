/* tripI18n.js: German and Spanish copy for the trips the de./es. sites offer
   (Kilimanjaro and Kilimanjaro Kosher; 5 Nov 2026). Merged into the trip
   records by mockData.js as <field>De / <field>Es, read through loc() in
   src/website/lang.js. Written by Claude from the English copy; have a native
   speaker review before larger campaigns. */
import EBC from './trip-i18n/everest-base-camp.js';
import ANNAPURNA from './trip-i18n/annapurna.js';
import BALKAN from './trip-i18n/peaks-of-balkan.js';
import ACONCAGUA from './trip-i18n/aconcagua.js';
import ISLAND from './trip-i18n/island-peak.js';
import OLYMPUS from './trip-i18n/olympus.js';
import ETHIOPIA from './trip-i18n/ethiopia.js';
import KAZBEK from './trip-i18n/kazbek.js';
import MANASLU_CIRCUIT from './trip-i18n/manaslu-circuit.js';
import ELBRUS from './trip-i18n/elbrus.js';
import CLIMBS from './trip-i18n/climbs.js';
import { lineIn } from './trip-i18n/lines.js';


const DUR = { de: 'Stunden', es: 'horas' };
/* Itinerary days keep distance / time / elevation numbers from the English
   record; only the words around them change. */
function dayUnits(lang, d) {
  const out = { ...d };
  if (d.duration) out.duration = d.duration.replace('hours', DUR[lang]);
  if (d.elevationGain) out.elevationGain = d.elevationGain.replace('m gain', lang === 'de' ? ' m Aufstieg' : ' m de ascenso');
  if (d.elevationLoss) out.elevationLoss = d.elevationLoss.replace('m loss', lang === 'de' ? ' m Abstieg' : ' m de descenso');
  return out;
}

/* ── Shared safari days (same text on both trips; day numbers differ) ── */
const SAFARI = {
  de: [
    { title: 'Safari im Tarangire-Nationalpark', desc: 'Tarangire ist bekannt für seine großen Elefantenherden und Baobab-Bäume. Eine Safari, die sich von anderen Parks des Landes abhebt: große Herden afrikanischer Elefanten, beeindruckende Vogelzüge und eine vielfältige Tierwelt mit Löwen, Leoparden, Geparden, Giraffen, Büffeln, Zebras, Affen und mehr.', accommodation: 'Kudu Lodge, Karatu, oder ähnlich' },
    { title: 'Safari im Ngorongoro-Krater', desc: 'Der Ngorongoro-Krater entstand durch den Einsturz eines Vulkans. Auf dem Kraterboden liegen weite Graslandschaften, Wälder und Quellen, die rund 25.000 Tieren Lebensraum bieten, darunter die meisten typischen Arten Ostafrikas: Löwen, Leoparden, Elefanten, Büffel und Nashörner.', accommodation: 'Kudu Lodge, Karatu, oder ähnlich' },
    { title: 'Besuch bei den Hadzabe und Datoga am Eyasi-See', desc: 'Die Hadza gehören zu den letzten Gemeinschaften der Welt, die als Jäger und Sammler leben, im Norden Tansanias rund um den Eyasi-See. Sie sprechen eine einzigartige Sprache mit Klicklauten und bewahren ihre alten Traditionen trotz moderner Einflüsse. Ihre Ernährung beruht vor allem auf Jagd, wilden Beeren, Honig und Pflanzen, ein seltenes und faszinierendes Beispiel einer uralten Lebensweise. Danach geht es weiter zu den Datoga, Hirten und geschickten Schmieden, die Schmuck und Pfeilspitzen aus Metall fertigen. Am Nachmittag Fahrt zum Kilimanjaro-Flughafen für den Heimflug.' },
  ],
  es: [
    { title: 'Safari en el Parque Nacional de Tarangire', desc: 'Tarangire es famoso por sus grandes manadas de elefantes y sus baobabs. Un safari distinto al de otras reservas del país: grandes manadas de elefantes africanos, espectaculares migraciones de aves y una fauna muy variada con leones, leopardos, guepardos, jirafas, búfalos, cebras, monos y mucho más.', accommodation: 'Kudu Lodge, Karatu, o similar' },
    { title: 'Safari en el cráter del Ngorongoro', desc: 'El cráter del Ngorongoro se formó por el colapso de un volcán. En el fondo de la caldera hay grandes praderas, bosques y manantiales que acogen a unos 25.000 animales, entre ellos la mayoría de las especies emblemáticas de África Oriental: leones, leopardos, elefantes, búfalos y rinocerontes.', accommodation: 'Kudu Lodge, Karatu, o similar' },
    { title: 'Visita a las tribus hadzabe y datoga en el lago Eyasi', desc: 'Los hadza son una de las últimas comunidades del mundo que viven como cazadores-recolectores, en el norte de Tanzania, alrededor del lago Eyasi. Hablan una lengua única con sonidos de chasquido y mantienen sus tradiciones ancestrales pese a la influencia moderna. Su alimentación se basa sobre todo en la caza, las bayas silvestres, la miel y las plantas, un ejemplo raro y fascinante de un modo de vida milenario. Después visitamos a los datoga, pastores y hábiles herreros que fabrican joyas y puntas de flecha de metal. Por la tarde, traslado al aeropuerto del Kilimanjaro para el vuelo de regreso a casa.' },
  ],
};

/* ── Included / not included, shared lines ── */
const L = {
  de: {
    climb: 'Kilimandscharo-Besteigung:', safari: 'Safari:', extras: 'Optionale Extras:',
    gift: 'Geschenkset: Kappe und Funktionsshirt!',
    app: 'Ein persönlicher Bereich für jeden Kunden in der HighAir-App',
    tents: 'Übernachtung in Doppelzelten mit Isomatten während der Besteigung',
    guides: 'Professionelle, englischsprachige einheimische Bergführer',
    porters: 'Träger für das persönliche Gepäck (bis 15 kg pro Person)',
    portersLog: 'Träger für die Logistik, Küchenteam und Service',
    toilets: 'Private mobile Toiletten nur für die Gruppe',
    wa: 'Live-Updates per WhatsApp für Angehörige während der Besteigung',
    permits: 'Eintritts- und Besteigungsgenehmigungen für den Kilimandscharo-Nationalpark',
    firstAid: 'Erste-Hilfe-Set inklusive Notfall-Sauerstoffflaschen',
    gearList: 'Ausführliche Ausrüstungsliste und Trainingsplan für die Besteigung',
    gear: 'Online-Ausrüstungsberatung',
    prep: 'Online-Vorbereitungsgespräch mit Ihrer Gruppe und dem Bergführer vor der Abreise',
    support: 'Unterstützung bei Fragen zu Flug und Reiseversicherung vor der Abreise',
    donation: 'Eine bedeutende Spende für den Kampf gegen Krebs!',
    jeep: '4x4-Safarifahrzeug mit offenem Dach (bis 6 Plätze)',
    fridge: 'Kühlschrank und Ladestationen im Jeep',
    safariGuide: 'Professioneller, englischsprachiger einheimischer Safari-Guide',
    lodge: '2 Nächte in einer luxuriösen Lodge',
    safariMeals: '3 Mahlzeiten pro Tag und Mineralwasser während der Safaritage',
    safariPermits: 'Eintrittsgenehmigungen für alle Safari-Parks',
    flights: 'Internationale Flüge (wir empfehlen die besten Verbindungen ab Ihrer Stadt)',
    insurance: 'Reise- und Krankenversicherung inklusive Höhenrettung (Pflicht)',
    ownGear: 'Persönliche Ausrüstung: Kleidung und Schuhe',
    tips: n => `Trinkgeld für das Bergteam (Bergführer, Küchenteam und Träger): ${n} $ pro Person`,
    visa: 'Visagebühr für Tansania: 50 $ pro Person',
    govIns: 'Lokale staatliche Versicherung: 44 $ pro Person',
    vacc: 'Impfungen und reisemedizinische Beratung',
    notListed: 'Alles, was nicht unter „Inklusive“ aufgeführt ist',
    safariTips: 'Trinkgeld für den Safari-Guide: 45 $ pro Person',
    safariPersonal: 'Persönliche Ausgaben während der Safari',
    personal: 'Persönliche Ausgaben, etwa Getränke, Alkohol, Wäsche, Geschenke, Internet und mehr',
    soloTent: 'Einzelzelt während der Besteigung: 100 $ für die gesamte Besteigung',
    standTent: 'Stehzelt während der Besteigung, höher und geräumiger für dieselben zwei Personen: 150 $ für die gesamte Besteigung',
    lodgeSingle: 'Einzelzimmer in der Safari-Lodge: 200 $ pro Nacht',
  },
  es: {
    climb: 'Ascenso al Kilimanjaro:', safari: 'Safari:', extras: 'Extras opcionales:',
    gift: '¡Kit de regalo: gorra y camiseta técnica!',
    app: 'Un área personal para cada cliente en la app de HighAir',
    tents: 'Alojamiento en tiendas dobles con colchonetas durante el ascenso',
    guides: 'Guías locales profesionales de habla inglesa',
    porters: 'Porteadores para el equipaje personal (hasta 15 kg por persona)',
    portersLog: 'Porteadores para la logística, equipo de cocina y camareros',
    toilets: 'Baños portátiles privados solo para el grupo',
    wa: 'Actualizaciones en directo por WhatsApp para las familias durante el ascenso',
    permits: 'Permisos de entrada y de ascenso al Parque Nacional del Kilimanjaro',
    firstAid: 'Botiquín de primeros auxilios con botellas de oxígeno de emergencia',
    gearList: 'Lista de equipo detallada y plan de entrenamiento para el ascenso',
    gear: 'Asesoramiento de equipo en línea',
    prep: 'Llamada de preparación en línea con tu grupo y el guía antes de salir',
    support: 'Ayuda con dudas sobre vuelos y seguro de viaje antes de salir',
    donation: '¡Una donación significativa a la lucha contra el cáncer!',
    jeep: 'Vehículo de safari 4x4 con techo abierto (hasta 6 plazas)',
    fridge: 'Nevera y puntos de carga en el jeep',
    safariGuide: 'Guía de safari local profesional de habla inglesa',
    lodge: '2 noches en un lodge de lujo',
    safariMeals: '3 comidas al día y agua mineral durante los días de safari',
    safariPermits: 'Permisos de entrada a todas las reservas del safari',
    flights: 'Vuelos internacionales (te recomendamos las mejores rutas desde tu ciudad)',
    insurance: 'Seguro de viaje y médico con cobertura de evacuación en altura (obligatorio)',
    ownGear: 'Equipo personal: ropa y calzado',
    tips: n => `Propinas para el equipo de montaña (guías, cocina y porteadores): ${n} $ por persona`,
    visa: 'Visado de Tanzania: 50 $ por persona',
    govIns: 'Seguro gubernamental local: 44 $ por persona',
    vacc: 'Vacunas y consejo médico en un centro de medicina del viajero',
    notListed: 'Todo lo que no aparece en el apartado de incluido',
    safariTips: 'Propina para el guía de safari: 45 $ por persona',
    safariPersonal: 'Gastos personales durante el safari',
    personal: 'Gastos personales, como bebidas, alcohol, lavandería, regalos, internet y más',
    soloTent: 'Tienda individual durante el ascenso: 100 $ por todo el ascenso',
    standTent: 'Tienda alta durante el ascenso, más amplia para las mismas dos personas: 150 $ por todo el ascenso',
    lodgeSingle: 'Habitación individual en el lodge del safari: 200 $ por noche',
  },
};

function lists(lang, { town, hotelNights, meals, tips, extraNight, singleRoom, lunchDinner }) {
  const t = L[lang];
  return {
    included: [
      t.climb, t.gift, t.app,
      lang === 'de' ? `Flughafentransfers zum Hotel in ${town} und zurück` : `Traslados del aeropuerto al hotel en ${town} y de vuelta`,
      lang === 'de' ? 'Interne Transfers zum Start der Route und zurück' : 'Traslados internos al inicio de la ruta y de vuelta',
      lang === 'de' ? `${hotelNights} Nächte in einem 4-Sterne-Hotel mit Frühstück in ${town}` : `${hotelNights} noches en un hotel de 4 estrellas con desayuno en ${town}`,
      t.tents, meals, t.guides, t.porters, t.portersLog, t.toilets, t.wa, t.permits, t.firstAid,
      t.gearList, t.gear, t.prep, t.support, t.donation,
      t.safari, t.jeep, t.fridge, t.safariGuide, t.lodge, t.safariMeals, t.safariPermits,
    ],
    notIncluded: [
      t.climb, t.flights, t.insurance, lunchDinner, t.ownGear, t.tips(tips), t.visa, t.govIns, extraNight, t.personal, t.vacc, t.notListed,
      t.safari, t.safariTips, t.safariPersonal,
      t.extras, singleRoom, t.soloTent, t.standTent, t.lodgeSingle,
    ],
  };
}

const KILI = {
  de: {
    name: 'Kilimandscharo',
    days: '9 Tage | + 3 Tage Safari',
    seoTitle: 'Kilimandscharo Besteigung über die Machame-Route | HighAir',
    seoDescription: 'Kilimandscharo Besteigung (5.895 m) über die Machame-Route: 9 Tage, davon 7 am Berg, kleine geführte Gruppen, 94 % Gipfelerfolg. Ab 2.900 US-Dollar, Safari zubuchbar.',
    desc: 'Um Mitternacht verlassen Sie das Barafu Camp auf 4.673 m. Rund acht Stunden später stehen Sie auf dem Uhuru Peak, 5.895 m, dem höchsten Punkt Afrikas.\n\nFür den Kilimandscharo brauchen Sie keine Klettererfahrung, keine Seile und keine Steigeisen. Entscheidend sind Ausdauer und eine gute Akklimatisierung. Wer sechs bis acht Stunden am Tag gehen kann und sich etwa drei Monate gezielt vorbereitet, hat gute Chancen. 94 % unserer Teilnehmenden erreichen den Gipfel.\n\nDiese Quote hat einen Grund: Wir gehen die Machame-Route in sieben Tagen, mit einem Akklimatisierungstag nach dem Prinzip „hoch steigen, tief schlafen“. Unsere lokalen Guides prüfen jeden Morgen die Verfassung aller Teilnehmenden, die Gruppe führt Notfallsauerstoff und Satellitenkommunikation mit. Ob es weitergeht, entscheidet immer der Guide, nach Ihrer Verfassung.\n\nMaximal 15 Teilnehmende aus aller Welt, Reisesprache Englisch. Ein Teil jeder Expedition unterstützt Krebspatienten, denn für uns sind die Berge auch eine Möglichkeit, etwas zurückzugeben.',
    highlights: ['Uhuru Peak 5895 m', 'Höchster Berg Afrikas', 'Die malerische Machame-Route', 'Fünf Klimazonen'],
    seasons: ['Januar–Februar', 'Juni–Oktober'],
    importantToNote: [
      'Eine internationale Gruppe: Die ganze Reise findet auf Englisch statt, geführt von unseren einheimischen Bergführern, mit Bergsteigern aus aller Welt.',
      'Das Visum für Tansania kostet 50 $ pro Person. Wir empfehlen, es vorab online zu beantragen (eVisa) und nicht auf die Ausstellung am Flughafen zu setzen. Gültig für 90 Tage.',
      'Die Machame-Route (7 Tage) hat die höchste Erfolgsquote am Kilimandscharo, mit eingeplanten Akklimatisierungstagen. Unsere Erfolgsquote liegt bei 94 %.',
      'Der Gipfeltag beginnt um Mitternacht (00:00) und dauert etwa 13 bis 15 Stunden. Volle Winterausrüstung ist nötig: am Gipfel bis −15 °C und starker Wind.',
      'Übernachtung in Zelten auf der gesamten Route; Ausrüstung (Zelte, Matten) wird gestellt. Ein Schlafsack bis −15 °C ist erforderlich.',
      'Ein ärztliches Attest ist erforderlich, inklusive Eignung für eine Höhe von 5895 m.',
      'Keine Klettererfahrung nötig: Wer 8–10 Stunden am Tag gehen kann, kann den Gipfel erreichen.',
      'Sicherheit vor Gipfel: Der Bergführer entscheidet je nach Verfassung jedes Teilnehmers, ob es weitergeht.',
      'Bei einem vorzeitigen Abstieg, aus welchem Grund auch immer, trägt der Reisende alle zusätzlichen Kosten, etwa weitere Hotelnächte, Mahlzeiten und nötige Flugänderungen.',
    ],
    itinerary: [
      { title: 'Willkommen in Tansania!', desc: 'Schon vor der Landung sehen Sie den Kilimandscharo aus dem Flugzeug. Am Flughafen erwartet Sie unser Team und bringt Sie mit dem Shuttle ins Hotel in Moshi, vorbei an ländlichen Landschaften und Bergen. Nach dem Check-in folgt ein Ausrüstungscheck und eine ausführliche Einweisung durch das Bergführerteam, das Sie während der gesamten Besteigung begleitet. Heute Nacht ruhen Sie sich gut aus, bevor es am nächsten Morgen losgeht.', travelTime: 'Etwa eine Stunde Fahrt vom Kilimanjaro-Flughafen zum Hotel in Moshi', accommodation: 'Salinero Hotel in Moshi, oder ähnlich' },
      { title: 'Machame Gate (1800 m) - Machame Camp (2835 m)', desc: 'Nach dem Frühstück im Hotel machen Sie sich bereit und lernen die einheimische Crew bei Gesang und Tanz vor dem Aufbruch kennen. Etwa eine Stunde Fahrt zum Machame Gate, dem Eingang des Kilimandscharo-Nationalparks auf 1800 m. Nach dem Mittagessen am Gate beginnt der Aufstieg durch den beeindruckenden Regenwald. Am Nachmittag erreichen Sie das Machame Camp, richten sich ein und essen gemeinsam im Gruppenzelt zu Abend.', accommodation: 'Zelte im Machame Camp' },
      { title: 'Machame Camp (2835 m) - Shira Camp (3750 m)', desc: 'Ihr erster Morgen am Berg beginnt mit einem routinemäßigen Gesundheitscheck durch die Bergführer. Weiter geht es bergauf, vom Regenwald in Heide- und Savannenlandschaften, wo die Luft dünner und die Vegetation spärlicher wird. Unterwegs sehen Sie einzigartige Pflanzen vor atemberaubender Kulisse. Am Ende des Tages erreichen Sie das Shira Camp auf 3750 m und werden mit einem herrlichen Sonnenuntergang belohnt.', accommodation: 'Zelte im Shira Camp' },
      { title: 'Shira Camp - Lava Tower (4600 m) - Barranco Camp (3900 m)', desc: 'Nach dem Frühstück wandern Sie zum Lava Tower auf 4600 m, einer 90 Meter hohen Vulkanfelsformation. Der Weg führt durch alpine Wüste vorbei an riesigen endemischen Pflanzen, die nur in dieser Höhe wachsen. Nach diesem Akklimatisierungstag steigen Sie zum Barranco Camp auf 3900 m ab. Hoch steigen und tiefer schlafen beschleunigt die Akklimatisierung.', accommodation: 'Zelte im Barranco Camp' },
      { title: 'Barranco Camp - Barranco Wall (4200 m) - Karanga Camp (3995 m)', desc: 'Der Gipfel scheint näher denn je. Nach Frühstück und Gesundheitscheck geht es zur berühmten Barranco Wall. Über Brücken und Bäche, dann den schmalen Pfad die Wand hinauf, an steileren Stellen mit Händen und Füßen. Danach Abstieg zum Karanga Camp auf 3995 m, einem offenen Lager und der vorletzten Station vor dem Gipfel.', accommodation: 'Zelte im Karanga Camp' },
      { title: 'Karanga Camp (3995 m) - Barafu Camp (4673 m)', desc: 'Der beste Energieschub vor dem Gipfel? Ein Tag, der mit Tanz beginnt! Heute ist der kürzeste Wandertag der Besteigung: vom Karanga Camp zum Barafu Camp auf 4673 m. „Barafu“ bedeutet auf Suaheli „Eis“, und das aus gutem Grund. Nach der Ankunft gibt es Mittagessen und Ruhe vor dem Gipfelaufbruch um Mitternacht. Die Spannung ist auf dem Höhepunkt!', accommodation: 'Zelte im Barafu Camp' },
      { title: 'Barafu Camp - Uhuru Peak (5895 m) - Mweka Camp (3100 m)', desc: 'Aufstehen um Mitternacht, Ausrüstung anlegen und mit Stirnlampen los. Etwa 8 Stunden Aufstieg zum Gipfel des Kilimandscharo auf 5895 m, mit kurzen Pausen zum Ausruhen und Trinken. Genießen Sie den atemberaubenden Blick und die unglaubliche Leistung, dann geht die Aufgabe weiter: Abstieg zum Barafu Camp zum Mittagessen und weiter zum Mweka Camp auf 3100 m für die letzte Nacht am Berg.', accommodation: 'Zelte im Mweka Camp' },
      { title: 'Mweka Camp (3100 m) - Mweka Gate (1640 m)', desc: 'Der letzte Morgen am Berg nach einem bewegenden Gipfeltag. Sie wandern zum Mweka Gate, dem Ausgang des Parks, während sich die Landschaft wieder in üppigen Regenwald verwandelt. Am Gate gibt es ein Gruppenfoto mit der gesamten Crew, einen Toast und ein großes Dankeschön für ihre unglaubliche Arbeit. Nach einem festlichen Mittagessen mit Tanz geht es zurück ins Hotel in Moshi zu einer wohlverdienten Dusche nach einer ganzen Woche am Berg!', accommodation: 'Salinero Hotel in Moshi, oder ähnlich' },
      { title: 'Heimflug', desc: 'Nach dem Frühstück packen Sie Ihre Sachen und checken aus. Das Shuttle bringt Sie zum Kilimanjaro-Flughafen für Ihren Heimflug, voller Fotos und Geschichten von einer unvergesslichen Reise :)' },
    ],
  },
  es: {
    name: 'Kilimanjaro',
    days: '9 días | + 3 de safari',
    seoTitle: 'Subir el Kilimanjaro por la ruta Machame | HighAir',
    seoDescription: 'Sube el Kilimanjaro (5.895 m) por la ruta Machame: 9 días, 7 en la montaña, grupos pequeños con guía, 94 % de cumbre. Desde 2.900 dólares, con safari opcional.',
    desc: 'Es medianoche en el campamento Barafu, a 4.673 m. Se encienden los frontales, el grupo se mira y empieza a subir. Unas ocho horas después, con el amanecer sobre las nubes, están en el Uhuru Peak, 5.895 m, el techo de África.\n\nNo necesitas experiencia en escalada, ni cuerdas, ni crampones. Necesitas ganas, constancia y unos tres meses de preparación. El 94 % de quienes suben con HighAir llega a la cumbre.\n\nHacemos la ruta Machame en siete días, con un día de aclimatación para «subir alto y dormir bajo». Te acompañan guías locales con años en la montaña, que revisan cada mañana cómo está cada persona, y un equipo de cocina y porteadores que se convierte en parte del grupo. Y al bajar, la celebración con baile en la puerta Mweka.\n\nGrupos de máximo 15 personas de todo el mundo, en inglés. Parte de cada expedición apoya a pacientes con cáncer, porque para nosotros la montaña también es una forma de devolver algo.',
    highlights: ['Uhuru Peak 5895 m', 'La montaña más alta de África', 'La ruta panorámica Machame', 'Cinco zonas climáticas'],
    seasons: ['enero–febrero', 'junio–octubre'],
    importantToNote: [
      'Un grupo internacional: todo el viaje es en inglés, con nuestros guías locales y montañeros de todo el mundo.',
      'El visado de Tanzania cuesta 50 $ por persona. Recomendamos solicitarlo en línea con antelación (eVisa) y no depender del aeropuerto. Válido 90 días.',
      'La ruta Machame (7 días) tiene la mayor tasa de éxito del Kilimanjaro, con días de aclimatación incluidos. Nuestra tasa de éxito es del 94 %.',
      'El día de cumbre empieza a medianoche (00:00) y dura unas 13 a 15 horas. Se necesita equipo de invierno completo: hasta −15 °C y viento fuerte en la cumbre.',
      'Alojamiento en tiendas durante toda la ruta; el equipo (tiendas, colchonetas) está incluido. Se necesita un saco de dormir de hasta −15 °C.',
      'Se requiere un certificado médico, incluida la aptitud para una altitud de 5895 m.',
      'No hace falta experiencia previa: quien pueda caminar 8–10 horas al día puede llegar a la cumbre.',
      'La seguridad antes que la cumbre: el guía decide si se continúa según el estado de cada participante.',
      'En caso de descenso anticipado, por cualquier motivo, todos los costes adicionales corren a cargo del viajero, como noches extra de hotel, comidas y cambios de vuelo.',
    ],
    itinerary: [
      { title: '¡Bienvenido a Tanzania!', desc: 'Antes de aterrizar verás el Kilimanjaro desde el avión. En el aeropuerto te espera nuestro equipo para llevarte en shuttle al hotel en Moshi, entre paisajes rurales y de montaña. Tras el check-in, haremos la revisión del equipo y recibirás una sesión informativa completa del equipo de guías que te acompañará durante todo el ascenso. Esta noche toca descansar bien antes de salir a la mañana siguiente.', travelTime: 'Aproximadamente una hora en coche del aeropuerto del Kilimanjaro al hotel en Moshi', accommodation: 'Salinero Hotel en Moshi, o similar' },
      { title: 'Machame Gate (1800 m) - Machame Camp (2835 m)', desc: 'Tras el desayuno en el hotel, preparamos el equipo y conocemos al equipo local con cantos y bailes antes de salir. Una hora en coche hasta Machame Gate, la entrada al Parque Nacional del Kilimanjaro a 1800 m. Después de comer en la puerta, empezamos a subir por una selva espectacular. A media tarde llegamos a Machame Camp, nos instalamos y cenamos juntos en la tienda comedor.', accommodation: 'Tiendas en Machame Camp' },
      { title: 'Machame Camp (2835 m) - Shira Camp (3750 m)', desc: 'La primera mañana en la montaña empieza con un control médico rutinario de los guías. Seguimos subiendo, de la selva al brezal y a zonas de sabana, donde el aire se hace más fino y la vegetación más escasa. Por el camino verás plantas únicas en un paisaje impresionante. Al final del día llegamos a Shira Camp, a 3750 m, con una puesta de sol espectacular.', accommodation: 'Tiendas en Shira Camp' },
      { title: 'Shira Camp - Lava Tower (4600 m) - Barranco Camp (3900 m)', desc: 'Tras el desayuno caminamos hacia Lava Tower, a 4600 m, una formación volcánica de 90 metros. Atravesamos un desierto alpino con plantas gigantes endémicas que solo crecen a esta altitud. Tras este día de aclimatación, bajamos a Barranco Camp, a 3900 m. Subir alto y dormir más bajo acelera la aclimatación.', accommodation: 'Tiendas en Barranco Camp' },
      { title: 'Barranco Camp - Barranco Wall (4200 m) - Karanga Camp (3995 m)', desc: 'La cumbre parece más cerca que nunca. Tras el desayuno y el control médico, vamos hacia el famoso Barranco Wall. Cruzamos puentes sobre arroyos y subimos por el estrecho sendero de la pared, usando manos y pies en los tramos más empinados. Después bajamos a Karanga Camp, a 3995 m, un campamento abierto y la penúltima parada antes de la cumbre.', accommodation: 'Tiendas en Karanga Camp' },
      { title: 'Karanga Camp (3995 m) - Barafu Camp (4673 m)', desc: '¿La mejor forma de coger energía antes de la cumbre? ¡Empezar el día bailando! Es la etapa más corta del ascenso: de Karanga Camp a Barafu Camp, a 4673 m. «Barafu» significa «hielo» en suajili, y no sin razón. Al llegar, comida y descanso antes de salir hacia la cumbre a medianoche. ¡La emoción está al máximo!', accommodation: 'Tiendas en Barafu Camp' },
      { title: 'Barafu Camp - Uhuru Peak (5895 m) - Mweka Camp (3100 m)', desc: 'Nos levantamos a medianoche, nos equipamos y salimos con frontales. Unas 8 horas de subida hasta la cumbre del Kilimanjaro, a 5895 m, con breves paradas para descansar y beber. Disfruta de la vista y del logro increíble, y luego la misión continúa: bajada a Barafu Camp para comer y después hasta Mweka Camp, a 3100 m, para la última noche en la montaña.', accommodation: 'Tiendas en Mweka Camp' },
      { title: 'Mweka Camp (3100 m) - Mweka Gate (1640 m)', desc: 'La última mañana en la montaña tras un día de cumbre emocionante. Caminamos hasta Mweka Gate, la salida del parque, mientras el paisaje vuelve a ser selva. En la puerta, foto de grupo con todo el equipo local, un brindis y un enorme gracias por su trabajo. Tras una comida de celebración con bailes, volvemos al hotel en Moshi para una merecida ducha después de una semana entera en la montaña.', accommodation: 'Salinero Hotel en Moshi, o similar' },
      { title: 'Vuelo de regreso a casa', desc: 'Tras el desayuno, haces la maleta y el check-out. El shuttle te lleva al aeropuerto del Kilimanjaro para tu vuelo de regreso, lleno de fotos e historias de un viaje inolvidable :)' },
    ],
  },
};

const KOSHER = {
  de: {
    name: 'Kilimandscharo Koscher',
    days: '10 Tage | + 3 Tage Safari',
    seoTitle: 'Koschere Kilimandscharo-Besteigung | HighAir Expeditions',
    seoDescription: 'Besteigen Sie den Kilimandscharo (5895 m) auf einer vollständig glatt-koscheren Expedition. 10 Tage, Schabbat in Arusha, koscheres Essen auf der ganzen Reise. 94 % Erfolgsquote. Optionale koschere Safari.',
    desc: 'Eine vollständig koschere Kilimandscharo-Expedition, und das schon seit Jahren.\n\nRoute, Bergführer und Erfolgsquote sind identisch mit unserer regulären Kilimandscharo-Expedition. Der Unterschied: Jede Mahlzeit wird frisch und koscher zubereitet, der Ablauf richtet sich nach Schabbat und jüdischen Feiertagen, und Sie reisen in einer jüdischen Gruppe, die Ihre Werte teilt.\n\nKilimandscharo ohne Kompromisse: das Abenteuer Ihres Lebens, auf Ihre Art.\n\nGlatt koschere Mahlzeiten · Ablauf nach dem Schabbat · Professionelle englischsprachige Bergführer · Spende für Krebspatienten inklusive',
    highlights: ['Uhuru Peak 5895 m', 'Vollständig glatt koschere Mahlzeiten', 'Ablauf nach dem Schabbat', 'Reisen in einer jüdischen Gruppe'],
    seasons: ['Januar–Februar', 'Juni–Oktober'],
    importantToNote: [
      'Eine internationale jüdische Gruppe: Die ganze Reise findet auf Englisch statt, geführt von unseren einheimischen Bergführern, mit Bergsteigern aus aller Welt.',
      'Das Visum für Tansania kostet 50 $ pro Person. Wir empfehlen, es vorab online zu beantragen (eVisa). Gültig für 90 Tage.',
      'Das gesamte Essen ist streng koscher unter voller Aufsicht: separate Küche, separates Geschirr und Schechita nach der Halacha. Auch für Schabbat-observante Teilnehmer geeignet.',
      'Der Gipfeltag beginnt um Mitternacht (00:00). Volle Winterausrüstung ist nötig: bis −15 °C und Wind am Gipfel.',
      'Machame-Route, 6 Tage am Berg (Sonntag bis Freitag, vor dem Schabbat). Unsere Erfolgsquote liegt dank eingeplanter Akklimatisierungstage bei 94 %.',
      'Ein ärztliches Attest ist erforderlich, inklusive Eignung für eine Höhe von 5895 m.',
      'Keine Klettererfahrung nötig: Wer 8–10 Stunden am Tag gehen kann, kann den Gipfel erreichen.',
      'Sicherheit vor Gipfel: Der Bergführer entscheidet je nach Verfassung jedes Teilnehmers, ob es weitergeht.',
      'Bei einem vorzeitigen Abstieg, aus welchem Grund auch immer, trägt der Reisende alle zusätzlichen Kosten, etwa weitere Hotelnächte, Mahlzeiten und nötige Flugänderungen.',
    ],
    itinerary: [
      { title: 'Willkommen in Tansania!', desc: 'Schon vor der Landung sehen Sie den Kilimandscharo aus dem Flugzeug. Nach der Landung bringt Sie das Shuttle ins Palace Hotel in Arusha, vorbei an ländlichen Landschaften und Bergen. Nach dem Check-in genießen Sie ein Schabbat-Abendessen im Chabad-Haus Arusha.', travelTime: 'Etwa 2 Stunden Fahrt vom Kilimanjaro-Flughafen nach Arusha', accommodation: 'Palace Hotel in Arusha, oder ähnlich' },
      { title: 'Schabbat-Ruhetag im Hotel in Arusha', desc: 'Ein ganzer Schabbat-Ruhetag im Hotel, ein ruhiger Tag, bevor die Expedition morgen beginnt.', accommodation: 'Palace Hotel in Arusha, oder ähnlich' },
      { title: 'Machame Gate - Machame Camp (2835 m)', desc: 'Nach dem Frühstück im Hotel machen Sie sich bereit und treffen die einheimische Crew zur Einweisung. Etwa eine Stunde Fahrt zum Machame Gate, dem Eingang des Parks auf 1800 m. Diese Route gilt als eine der schönsten zum Gipfel. Heute wandern wir auf einem gut markierten Weg durch üppigen Regenwald. Am Nachmittag erreichen wir das Machame Camp und essen gemeinsam im Gruppenzelt zu Abend.', accommodation: 'Zelte im Machame Camp' },
      { title: 'Machame Camp - Shira Cave Camp (3750 m)', desc: 'Ihr erster Morgen am Berg beginnt mit einem routinemäßigen Gesundheitscheck durch die Bergführer. Weiter geht es bergauf, vom Regenwald in savannenartige Zonen, wo die Luft dünner und die Vegetation spärlicher wird. Am Ende des Tages erreichen Sie das Shira Cave Camp auf 3750 m und werden mit einem herrlichen Sonnenuntergang belohnt.', accommodation: 'Zelte im Shira Cave Camp' },
      { title: 'Shira Cave Camp - Lava Tower (4600 m) - Barranco Camp (3900 m)', desc: 'Nach dem Frühstück wandern Sie zum Lava Tower auf 4600 m, einer 90 Meter hohen Vulkanfelsformation. Der Weg führt durch alpine Wüste vorbei an Riesensenezien, endemischen Pflanzen, die nur in dieser Höhe wachsen. Nach einem langen Tag Abstieg zum Barranco Camp auf 3900 m. Hoch steigen und tiefer schlafen beschleunigt die Akklimatisierung.', accommodation: 'Zelte im Barranco Camp' },
      { title: 'Barranco Camp - Barranco Wall - Barafu Camp (4673 m)', desc: 'Der Gipfel scheint näher denn je. Nach Frühstück und Gesundheitscheck geht es zur berühmten Barranco Wall: über Brücken und Bäche, dann den schmalen, steilen Pfad hinauf, an manchen Stellen mit Händen und Füßen. Danach weiter bergauf zum Barafu Camp auf 4673 m, der letzten Station vor dem Gipfel.', accommodation: 'Zelte im Barafu Camp' },
      { title: 'Barafu Camp - Uhuru Peak (5895 m) - Mweka Camp (3100 m)', desc: 'Aufstehen um Mitternacht, Ausrüstung anlegen und mit Stirnlampen los. Etwa 8 Stunden Aufstieg zum Gipfel des Kilimandscharo auf 5895 m, mit kurzen Pausen. Genießen Sie den atemberaubenden Blick, dann Abstieg zum Barafu Camp zum Mittagessen und weiter durch den Regenwald bis zum Mweka Camp auf 3100 m.', accommodation: 'Zelte im Mweka Camp' },
      { title: 'Mweka Camp - Mweka Gate (1640 m)', desc: 'Der letzte Morgen am Berg nach einem bewegenden Gipfeltag. Wanderung zum Mweka Gate, während sich die Landschaft wieder in Regenwald verwandelt. Am Gate gibt es ein Gruppenfoto mit der Crew, einen Toast und ein großes Dankeschön. Nach einem festlichen Mittagessen mit Tanz geht es zurück ins Hotel in Arusha zu einer wohlverdienten Dusche!', accommodation: 'Palace Hotel in Arusha, oder ähnlich' },
      { title: 'Schabbat-Ruhetag im Hotel in Arusha', desc: 'Zurück vom Gipfel mit einem unglaublichen Gefühl! Zeit zum Ausruhen und Feiern des Endes einer unvergesslichen Reise.', accommodation: 'Palace Hotel in Arusha, oder ähnlich' },
      { title: 'Heimflug!', desc: 'Nach dem Frühstück packen Sie Ihre Sachen und checken aus. Das Shuttle bringt Sie zum Kilimanjaro-Flughafen für den Heimflug, voller Fotos und Erinnerungen, die bleiben :)' },
    ],
  },
  es: {
    name: 'Kilimanjaro Kosher',
    days: '10 días | + 3 de safari',
    seoTitle: 'Subir al Kilimanjaro Kosher | HighAir Expeditions',
    seoDescription: 'Sube al Kilimanjaro (5895 m) en una expedición totalmente glatt kosher. 10 días, Shabat en Arusha y comida kosher en todo el viaje. 94 % de éxito. Safari kosher opcional.',
    desc: 'Una expedición al Kilimanjaro totalmente kosher, y llevamos años haciéndola.\n\nLa ruta, los guías y la tasa de éxito son los mismos que en nuestra expedición habitual al Kilimanjaro. La diferencia: cada comida se prepara fresca y kosher, el programa respeta el Shabat y las festividades judías, y viajas con un grupo judío que comparte tus valores.\n\nEl Kilimanjaro sin renunciar a nada: la aventura de tu vida, a tu manera.\n\nComidas glatt kosher · Programa adaptado al Shabat · Guías profesionales de habla inglesa · Donación a pacientes con cáncer incluida',
    highlights: ['Uhuru Peak 5895 m', 'Comidas totalmente glatt kosher', 'Programa adaptado al Shabat', 'Viajar en un grupo judío'],
    seasons: ['enero–febrero', 'junio–octubre'],
    importantToNote: [
      'Un grupo judío internacional: todo el viaje es en inglés, con nuestros guías locales y montañeros de todo el mundo.',
      'El visado de Tanzania cuesta 50 $ por persona. Recomendamos solicitarlo en línea con antelación (eVisa). Válido 90 días.',
      'Toda la comida es estrictamente kosher con supervisión completa: cocina separada, utensilios separados y shejitá según la halajá. Apto también para quienes guardan el Shabat.',
      'El día de cumbre empieza a medianoche (00:00). Se necesita equipo de invierno completo: hasta −15 °C y viento en la cumbre.',
      'Ruta Machame, 6 días en la montaña (de domingo a viernes, antes del Shabat). Nuestra tasa de éxito es del 94 % gracias a los días de aclimatación.',
      'Se requiere un certificado médico, incluida la aptitud para una altitud de 5895 m.',
      'No hace falta experiencia previa: quien pueda caminar 8–10 horas al día puede llegar a la cumbre.',
      'La seguridad antes que la cumbre: el guía decide si se continúa según el estado de cada participante.',
      'En caso de descenso anticipado, por cualquier motivo, todos los costes adicionales corren a cargo del viajero, como noches extra de hotel, comidas y cambios de vuelo.',
    ],
    itinerary: [
      { title: '¡Bienvenido a Tanzania!', desc: 'Antes de aterrizar verás el Kilimanjaro desde el avión. Tras aterrizar, el shuttle te lleva al Palace Hotel en Arusha, entre paisajes rurales y de montaña. Después del check-in, cena de Shabat en la Casa Jabad de Arusha.', travelTime: 'Unas 2 horas en coche del aeropuerto del Kilimanjaro a Arusha', accommodation: 'Palace Hotel en Arusha, o similar' },
      { title: 'Descanso de Shabat en el hotel en Arusha', desc: 'Un día completo de descanso de Shabat en el hotel, disfrutando de la calma antes de empezar la expedición mañana.', accommodation: 'Palace Hotel en Arusha, o similar' },
      { title: 'Machame Gate - Machame Camp (2835 m)', desc: 'Tras el desayuno, preparamos el equipo y conocemos al equipo local para la sesión informativa. Una hora en coche hasta Machame Gate, la entrada del parque a 1800 m. Esta ruta es una de las más bonitas hacia la cumbre. Hoy caminamos por una selva frondosa por un sendero bien marcado. A media tarde llegamos a Machame Camp y cenamos juntos en la tienda comedor.', accommodation: 'Tiendas en Machame Camp' },
      { title: 'Machame Camp - Shira Cave Camp (3750 m)', desc: 'La primera mañana en la montaña empieza con un control médico rutinario de los guías. Seguimos subiendo de la selva a zonas tipo sabana, donde el aire se hace más fino y la vegetación más escasa. Al final del día llegamos a Shira Cave Camp, a 3750 m, con una puesta de sol espectacular.', accommodation: 'Tiendas en Shira Cave Camp' },
      { title: 'Shira Cave Camp - Lava Tower (4600 m) - Barranco Camp (3900 m)', desc: 'Tras el desayuno caminamos hacia Lava Tower, a 4600 m, una formación volcánica de 90 metros. Atravesamos un desierto alpino con senecios gigantes, plantas endémicas que solo crecen a esta altitud. Tras un día largo, bajamos a Barranco Camp, a 3900 m. Subir alto y dormir más bajo acelera la aclimatación.', accommodation: 'Tiendas en Barranco Camp' },
      { title: 'Barranco Camp - Barranco Wall - Barafu Camp (4673 m)', desc: 'La cumbre parece más cerca que nunca. Tras el desayuno y el control médico, vamos hacia el famoso Barranco Wall: cruzamos puentes sobre arroyos y subimos por el sendero estrecho y empinado, en algunos tramos con manos y pies. Después seguimos hasta Barafu Camp, a 4673 m, la última parada antes de la cumbre.', accommodation: 'Tiendas en Barafu Camp' },
      { title: 'Barafu Camp - Uhuru Peak (5895 m) - Mweka Camp (3100 m)', desc: 'Nos levantamos a medianoche, nos equipamos y salimos con frontales. Unas 8 horas de subida hasta la cumbre del Kilimanjaro, a 5895 m, con breves paradas. Disfruta de la vista, y después bajamos a Barafu Camp para comer y seguimos por la selva hasta Mweka Camp, a 3100 m.', accommodation: 'Tiendas en Mweka Camp' },
      { title: 'Mweka Camp - Mweka Gate (1640 m)', desc: 'La última mañana en la montaña tras un día de cumbre emocionante. Caminamos hasta Mweka Gate mientras el paisaje vuelve a ser selva. En la puerta, foto de grupo con el equipo local, un brindis y un enorme gracias. Tras una comida de celebración con bailes, volvemos al hotel en Arusha para una merecida ducha.', accommodation: 'Palace Hotel en Arusha, o similar' },
      { title: 'Descanso de Shabat en el hotel en Arusha', desc: '¡De vuelta de la cumbre con una sensación increíble! Tiempo para descansar y celebrar el final de un viaje inolvidable.', accommodation: 'Palace Hotel en Arusha, o similar' },
      { title: '¡Vuelo de regreso a casa!', desc: 'Tras el desayuno, haces la maleta y el check-out. El shuttle te lleva al aeropuerto del Kilimanjaro para el vuelo de regreso, con fotos y recuerdos para siempre :)' },
    ],
  },
};

const LIST_ARGS = {
  kilimanjaro: {
    de: { town: 'Moshi', hotelNights: 2, meals: '3 volle Mahlzeiten pro Tag (Frühstück, Mittag- und Abendessen) während der Besteigung', tips: 350, lunchDinner: 'Mittag- und Abendessen im Hotel in Moshi', extraNight: 'Eine zusätzliche Hotelnacht (falls nötig)', singleRoom: 'Einzelzimmer im Hotel in Moshi: 90 $ pro Nacht' },
    es: { town: 'Moshi', hotelNights: 2, meals: '3 comidas completas al día (desayuno, comida y cena) durante el ascenso', tips: 350, lunchDinner: 'Comida y cena en el hotel de Moshi', extraNight: 'Una noche extra de hotel (si hace falta)', singleRoom: 'Habitación individual en el hotel de Moshi: 90 $ por noche' },
  },
  'kilimanjaro-kosher': {
    de: { town: 'Arusha', hotelNights: 4, meals: '3 volle Mahlzeiten pro Tag während der Besteigung (in Abstimmung mit Chabad Arusha)', tips: 300, lunchDinner: 'Mittag- und Abendessen im Hotel in Arusha', extraNight: 'Eine zusätzliche Hotelnacht (falls nötig)', singleRoom: 'Einzelzimmer im Hotel in Arusha: 90 $ pro Nacht' },
    es: { town: 'Arusha', hotelNights: 4, meals: '3 comidas completas al día durante el ascenso (en coordinación con Jabad Arusha)', tips: 300, lunchDinner: 'Comida y cena en el hotel de Arusha', extraNight: 'Una noche extra de hotel (si hace falta)', singleRoom: 'Habitación individual en el hotel de Arusha: 90 $ por noche' },
  },
};

/* Merge into a trip: <field>De / <field>Es, itinerary days keep the English
   record's numbers (day, distance, times) with translated words. */
/* More trips (owner, 5 Nov 2026): one file each in ./trip-i18n/, with the
   fields written out in full (name, days, seo, desc, lists, itinerary, faq). */
const MORE = {
  'everest-base-camp': EBC, annapurna: ANNAPURNA, 'peaks-of-balkan': BALKAN,
  aconcagua: ACONCAGUA, 'island-peak': ISLAND,
  olympus: OLYMPUS, ethiopia: ETHIOPIA, kazbek: KAZBEK, 'manaslu-circuit': MANASLU_CIRCUIT, elbrus: ELBRUS,
  ...CLIMBS,
};
const COUNTRY = {
  Tanzania: { de: 'Tansania', es: 'Tanzania' },
  Nepal: { de: 'Nepal', es: 'Nepal' },
  Albania: { de: 'Albanien', es: 'Albania' },
  Argentina: { de: 'Argentinien', es: 'Argentina' },
  Greece: { de: 'Griechenland', es: 'Grecia' },
  Ethiopia: { de: 'Äthiopien', es: 'Etiopía' },
  Georgia: { de: 'Georgien', es: 'Georgia' },
  Russia: { de: 'Russland', es: 'Rusia' },
  Kyrgyzstan: { de: 'Kirgisistan', es: 'Kirguistán' },
};
const FIELDS = ['name', 'days', 'seoTitle', 'seoDescription', 'desc', 'highlights', 'seasons', 'importantToNote', 'included', 'notIncluded', 'experience'];

import { bake } from './safariI18n.js';
import SDE from '../i18n/safari-de.js';
import SES from '../i18n/safari-es.js';

/* The German / Spanish FAQ goes onto the record itself (faqDe / faqEs), so it
   ships inside trips/de.json and es.json and the trip page no longer imports
   this whole file (80 KB gzipped on every trip page, every site; 6 Nov 2026). */
export function applyTripI18n(exp) {
  applyCopy(exp);
  for (const lang of ['de', 'es']) {
    exp['faq' + (lang === 'de' ? 'De' : 'Es')] = FAQ_I18N[exp.slug]?.[lang] || defaultFaqI18n(lang, exp.groupCapacity || 15);
  }
  return exp;
}

function applyCopy(exp) {
  /* Safari pages: every English field gets its German / Spanish twin (safariI18n.js). */
  if (String(exp.slug || '').startsWith('safari')) {
    bake(exp, { de: SDE, es: SES });   // written into trips/de.json, es.json at build time
    if (exp.country === 'Tanzania') { exp.countryDe = 'Tansania'; exp.countryEs = 'Tanzania'; }
    return exp;
  }
  const more = MORE[exp.slug];
  if (more) {
    for (const lang of ['de', 'es']) {
      const S = lang === 'de' ? 'De' : 'Es';
      const t = more[lang];
      if (COUNTRY[exp.country]) exp['country' + S] = COUNTRY[exp.country][lang];
      for (const k of FIELDS) if (t[k] !== undefined) exp[k + S] = t[k];
      /* Shared lines (./trip-i18n/lines.js): the lists follow the English one */
      if (t.listsFromLines) {
        exp['included' + S] = (exp.includedEn || []).map(l => lineIn(lang, l));
        exp['notIncluded' + S] = (exp.notIncludedEn || []).map(l => lineIn(lang, l));
      }
      exp['itinerary' + S] = (exp.itineraryEn || []).map((d, i) => ({ ...dayUnits(lang, d), ...(t.itinerary[i] || {}) }));
      if (t.extensionLabel) { exp['extensionLabel' + S] = t.extensionLabel; exp['extensionBaseLabel' + S] = t.extensionBaseLabel; }
      if (t.extensionItinerary) exp['extensionItinerary' + S] = (exp.extensionItineraryEn || []).map((d, i) => ({ ...dayUnits(lang, d), ...(t.extensionItinerary[i] || {}) }));
    }
    return exp;
  }
  const src = { kilimanjaro: KILI, 'kilimanjaro-kosher': KOSHER }[exp.slug];
  if (!src) return exp;
  for (const lang of ['de', 'es']) {
    const S = lang === 'de' ? 'De' : 'Es';
    const t = src[lang];
    exp['country' + S] = { de: 'Tansania', es: 'Tanzania' }[lang];
    for (const k of ['name', 'days', 'seoTitle', 'seoDescription', 'desc', 'highlights', 'seasons', 'importantToNote']) exp[k + S] = t[k];
    exp['itinerary' + S] = (exp.itineraryEn || []).map((d, i) => ({ ...dayUnits(lang, d), ...(t.itinerary[i] || {}) }));
    exp['safariItinerary' + S] = (exp.safariItineraryEn || []).map((d, i) => ({ ...d, ...(SAFARI[lang][i] || {}) }));
    const l = lists(lang, LIST_ARGS[exp.slug][lang]);
    exp['included' + S] = l.included;
    exp['notIncluded' + S] = l.notIncluded;
  }
  return exp;
}

/* ── FAQ ── */
export const FAQ_I18N = {
  ...Object.fromEntries(Object.entries(MORE).filter(([, v]) => v.de.faq).map(([slug, v]) => [slug, { de: v.de.faq, es: v.es.faq }])),
  kilimanjaro: {
    de: [
      { q: 'Wie schwer ist die Besteigung des Kilimandscharo?', a: 'Der Kilimandscharo (5895 m) ist der am leichtesten zugängliche hohe Berg der Welt: keine technische Klettererfahrung, keine Seile, keine Steigeisen. Wer einigermaßen fit ist und etwa acht Stunden am Tag gehen kann, kann den Gipfel erreichen. Die eigentliche Herausforderung sind die Höhe und die Kälte in der Gipfelnacht, und genau dafür ist unser Ablauf auf eine gute Akklimatisierung ausgelegt.' },
      { q: 'Wie hoch ist Ihre Erfolgsquote am Kilimandscharo?', a: 'Unsere Gipfelerfolgsquote liegt bei 94 %, eine der höchsten der Branche. Sie beruht auf der malerischen Machame-Route über 7 Tage, die dem Körper Zeit zur schrittweisen Akklimatisierung gibt, und auf erfahrenen einheimischen Bergführern, die jeden Abschnitt des Berges kennen.' },
      { q: 'Wie bereite ich mich auf den Kilimandscharo vor?', a: 'Am wichtigsten ist Ausdauertraining: lange Wanderungen, leichtes Laufen oder Radfahren in den rund drei Monaten vor der Abreise. Vor der Abreise trifft sich die Gruppe außerdem online zu einer Ausrüstungsbesprechung und einem Vorbereitungsgespräch, so kommen Sie gut vorbereitet an und kennen sich schon.' },
      { q: 'Wie alt muss man für den Kilimandscharo sein?', a: 'Das Mindestalter ist 10 Jahre. Eine Altersgrenze nach oben gibt es nicht: Auch Bergsteiger über 60 haben mit uns den Gipfel erreicht. Entscheidend sind Fitness und Gesundheit, nicht das Alter im Ausweis.' },
      { q: 'Lohnt sich eine Safari nach der Besteigung?', a: 'Auf jeden Fall. Drei Safaritage in Tarangire und im Ngorongoro-Krater, zwei der spektakulärsten Parks Afrikas, lassen sich zu einem fairen Aufpreis hinzubuchen. Nach einer anstrengenden Woche am Berg ist die Safari die perfekte Belohnung.' },
      { q: 'Wann ist die beste Reisezeit für den Kilimandscharo?', a: 'Es gibt zwei bevorzugte Zeiten: Januar–Februar und Juni–Oktober. Dann regnet es wenig und das Wetter ist stabiler. November und April, die Monate mit viel Regen, sollte man meiden, und genau deshalb planen wir unsere Gruppen in den guten Zeitfenstern.' },
    ],
    es: [
      { q: '¿Es difícil subir al Kilimanjaro?', a: 'El Kilimanjaro (5895 m) es la montaña alta más accesible del mundo: no hace falta experiencia técnica de escalada, ni cuerdas, ni crampones. Cualquier persona en buena forma que pueda caminar unas ocho horas al día puede llegar a la cumbre. El verdadero reto es la altitud y el frío de la noche de cumbre, y por eso nuestro programa está pensado para una buena aclimatación.' },
      { q: '¿Cuál es su tasa de éxito en el Kilimanjaro?', a: 'Nuestra tasa de éxito en cumbre es del 94 %, de las más altas del sector. Se debe a la ruta panorámica Machame en 7 días, que da tiempo al cuerpo para aclimatarse poco a poco, y a guías locales con experiencia que conocen cada tramo de la montaña.' },
      { q: '¿Cómo me preparo para el Kilimanjaro?', a: 'Lo más importante es el entrenamiento aeróbico: caminatas largas, carrera suave o bicicleta durante unos tres meses antes de salir. Antes del viaje, el grupo se reúne en línea para una sesión de equipo y una llamada de preparación, así llegas listo y ya conoces a tus compañeros.' },
      { q: '¿Cuál es la edad mínima para el Kilimanjaro?', a: 'La edad mínima es de 10 años. No hay edad máxima: montañeros de más de 60 años han hecho cumbre con nosotros. Lo que cuenta es la forma física y la salud, no la edad del pasaporte.' },
      { q: '¿Vale la pena añadir un safari al Kilimanjaro?', a: 'Sin duda. Se pueden añadir tres días de safari en Tarangire y el cráter del Ngorongoro, dos de las reservas más espectaculares de África, por un coste razonable. Después de una semana dura en la montaña, el safari es la recompensa perfecta.' },
      { q: '¿Cuál es la mejor época para subir al Kilimanjaro?', a: 'Hay dos temporadas preferidas: enero–febrero y junio–octubre. En esos meses llueve poco y el tiempo es más estable. Conviene evitar noviembre y abril, los meses de más lluvia, y por eso organizamos nuestros grupos justo en las mejores ventanas.' },
    ],
  },
};

export function defaultFaqI18n(lang, cap = 15) {
  if (lang === 'de') return [
    { q: 'Brauche ich Vorerfahrung?', a: 'Für die meisten unserer Routen ist keine Klettererfahrung nötig. Was zählt, sind gute Fitness, Offenheit und der Wille, den Gipfel zu erreichen; die gemeinsame Vorbereitung vor der Abreise erledigt den Rest.' },
    { q: 'Wie groß ist die Gruppe?', a: `Unsere Gruppen sind auf höchstens ${cap} Teilnehmer begrenzt, damit persönliche Betreuung und ein hochwertiges Erlebnis auf der ganzen Reise gewährleistet sind.` },
    { q: 'Gibt es ein Einzelzimmer?', a: 'Ja, ein Einzelzimmer kann gegen Aufpreis gebucht werden. Bitte geben Sie es bei der Anmeldung an, damit wir das Zimmer reservieren können.' },
    { q: 'Was passiert, wenn ich früher absteigen muss?', a: 'Die Sicherheit der Teilnehmer geht vor. Wenn Sie aus irgendeinem Grund früher absteigen müssen, begleitet Sie der Bergführer sicher zurück. Zusätzliche Kosten durch einen vorzeitigen Abstieg trägt der Reisende.' },
    { q: 'Was ist im Preis enthalten?', a: 'Der Preis umfasst alles, was auf der Seite unter „Inklusive“ aufgeführt ist. Internationale Flüge und Reiseversicherung sind nicht enthalten; eine vollständige Ausrüstungsliste erhält jeder nach der Anmeldung.' },
  ];
  if (lang === 'es') return [
    { q: '¿Necesito experiencia previa?', a: 'Para la mayoría de nuestras rutas no hace falta experiencia en escalada. Lo que se necesita es buena forma física, actitud abierta y ganas de llegar a la cumbre; la preparación que hacemos juntos antes del viaje hace el resto.' },
    { q: '¿De cuántas personas es el grupo?', a: `Nuestros grupos tienen un máximo de ${cap} participantes, para mantener una atención personal y una experiencia de calidad durante todo el viaje.` },
    { q: '¿Hay habitación individual?', a: 'Sí, se puede pedir habitación individual con un suplemento. Indícalo en el formulario de inscripción para que podamos reservarla.' },
    { q: '¿Qué pasa si tengo que bajar antes?', a: 'La seguridad de los participantes es lo primero. Si tienes que bajar antes por cualquier motivo, el guía te acompaña de vuelta con seguridad. Los costes extra de un descenso anticipado corren a cargo del viajero.' },
    { q: '¿Qué incluye el precio?', a: 'El precio incluye todo lo que aparece en el apartado «Incluido» de la página. Los vuelos internacionales y el seguro de viaje no están incluidos; cada inscrito recibe una lista completa de equipo tras la inscripción.' },
  ];
  return null;
}
