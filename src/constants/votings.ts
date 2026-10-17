import type { Voting } from '@/types/type';

type VotingSeed = Omit<Voting, 'votesFor' | 'votesAgainst' | 'myVote'>;

const VOTING_SEEDS: VotingSeed[] = [
  // transport
  {
    id: 'v01',
    title: 'Zepsuta sygnalizacja na skrzyżowaniu Długiej i Polnej',
    description:
      'Światło dla pieszych miga od tygodnia i nie przełącza się na zielone. Piesi przechodzą na czuja, a kierowcy nie wiedzą, kto ma pierwszeństwo.',
    category: 'transport',
    scope: 'everyday',
    isAnonymous: false,
  },
  {
    id: 'v02',
    title: 'Nowa linia tramwajowa na osiedle Zielone Wzgórza',
    description:
      'Osiedle liczy ponad 12 tysięcy mieszkańców, a dojazd do centrum autobusem zajmuje prawie godzinę. Czy miasto powinno zaplanować dodatkową linię tramwajową?',
    category: 'transport',
    scope: 'citywide',
    isAnonymous: false,
  },
  {
    id: 'v03',
    title: 'Ścieżka rowerowa wzdłuż ulicy Kwiatowej',
    description:
      'Rowerzyści jeżdżą po chodniku lub jezdni, bo nie ma żadnej wydzielonej trasy. Proponuję wyznaczyć pas rowerowy kosztem jednego rzędu parkowania.',
    category: 'transport',
    scope: 'local',
    isAnonymous: false,
  },

  // greenery
  {
    id: 'v04',
    title: 'Nowe ławki w parku przy ulicy Lipowej',
    description:
      'W całym parku są tylko trzy ławki, wszystkie przy wejściu. Starsi mieszkańcy nie mają gdzie odpocząć podczas spaceru.',
    category: 'greenery',
    scope: 'everyday',
    isAnonymous: false,
  },
  {
    id: 'v05',
    title: 'Nowy plac zabaw zamiast nieużywanego parkingu',
    description:
      'Parking za blokiem 14 stoi pusty od lat. Zamiana go na plac zabaw z zielenią dałaby dzieciom bezpieczne miejsce blisko domu.',
    category: 'greenery',
    scope: 'local',
    isAnonymous: false,
  },
  {
    id: 'v06',
    title: 'Program sadzenia 5000 drzew w mieście',
    description:
      'Latem w centrum jest o kilka stopni cieplej niż na obrzeżach. Czy miasto powinno przeznaczyć środki na masowe nasadzenia drzew na ulicach i skwerach?',
    category: 'greenery',
    scope: 'citywide',
    isAnonymous: false,
  },

  // safety
  {
    id: 'v07',
    title: 'Przepalona latarnia przy przejściu pod torami',
    description:
      'Od dwóch tygodni nie świeci się ani jedna lampa w przejściu. Wieczorem jest tam bardzo ciemno, a część mieszkańców wybiera dłuższą drogę.',
    category: 'safety',
    scope: 'everyday',
    isAnonymous: true,
  },
  {
    id: 'v08',
    title: 'Progi zwalniające przy szkole podstawowej nr 7',
    description:
      'Kierowcy jeżdżą tu dużo za szybko, szczególnie rano, kiedy dzieci idą na lekcje. Proponuję dwa progi i znak ograniczenia do 30 km/h.',
    category: 'safety',
    scope: 'local',
    isAnonymous: false,
  },
  {
    id: 'v09',
    title: 'Miejski monitoring w okolicach dworca',
    description:
      'Mieszkańcy zgłaszają częste kradzieże i bójki w pobliżu dworca. Czy rozbudować monitoring, mimo kosztów i obaw o prywatność?',
    category: 'safety',
    scope: 'citywide',
    isAnonymous: true,
  },

  // cleanliness
  {
    id: 'v10',
    title: 'Przepełnione kosze na skwerze Kościuszki',
    description:
      'Kosze są opróżniane za rzadko, w weekendy śmieci leżą dookoła. Wystarczyłoby częstsze opróżnianie albo dodatkowe kosze.',
    category: 'cleanliness',
    scope: 'everyday',
    isAnonymous: false,
  },
  {
    id: 'v11',
    title: 'Dzikie wysypisko za garażami przy ulicy Fabrycznej',
    description:
      'Ktoś regularnie wyrzuca tu stare meble i gruz. Potrzebny jest monitoring albo cykliczny wywóz, zanim sytuacja się pogorszy.',
    category: 'cleanliness',
    scope: 'local',
    isAnonymous: true,
  },
  {
    id: 'v12',
    title: 'Punkty zbiórki odpadów wielkogabarytowych w każdej dzielnicy',
    description:
      'Dziś trzeba jechać na drugi koniec miasta, żeby oddać starą lodówkę. Dodatkowe punkty zmniejszyłyby liczbę porzuconych odpadów.',
    category: 'cleanliness',
    scope: 'citywide',
    isAnonymous: false,
  },

  // noise
  {
    id: 'v13',
    title: 'Głośna muzyka z lokalu po godzinie 23:00',
    description:
      'Bar przy ulicy Rynkowej puszcza muzykę na zewnątrz do późna w nocy. Mieszkańcy okolicznych bloków nie mogą spać, zwłaszcza w weekendy.',
    category: 'noise',
    scope: 'everyday',
    isAnonymous: true,
  },
  {
    id: 'v14',
    title: 'Ograniczenie godzin prac budowlanych na osiedlu',
    description:
      'Prace zaczynają się przed 7:00 i trwają nawet w soboty. Proponuję ustalić wspólne godziny: 8:00-18:00 w dni robocze.',
    category: 'noise',
    scope: 'local',
    isAnonymous: false,
  },
  {
    id: 'v15',
    title: 'Cicha strefa w centrum w nocy',
    description:
      'Czy wprowadzić w ścisłym centrum zasady ograniczające hałas od 22:00 do 6:00, np. dla głośników zewnętrznych i dostaw?',
    category: 'noise',
    scope: 'citywide',
    isAnonymous: false,
  },

  // housing
  {
    id: 'v16',
    title: 'Odnowienie zniszczonej elewacji kamienicy przy Rynku 5',
    description:
      'Tynk odpada płatami, a kawałki spadają na chodnik. To nie tylko brzydko wygląda, ale też stwarza zagrożenie dla przechodniów.',
    category: 'housing',
    scope: 'everyday',
    isAnonymous: false,
  },
  {
    id: 'v17',
    title: 'Przebudowa placu Wolności na przestrzeń dla pieszych',
    description:
      'Plac jest dziś w większości parkingiem. Proponuję ograniczyć ruch samochodów, dodać zieleń, ławki i miejsca na kawiarniane ogródki.',
    category: 'housing',
    scope: 'local',
    isAnonymous: false,
  },

  // services
  {
    id: 'v18',
    title: 'Wydłużone godziny otwarcia biblioteki miejskiej',
    description:
      'Biblioteka zamyka się o 16:00, kiedy większość osób kończy pracę. Otwarcie do 19:00 dwa razy w tygodniu bardzo by pomogło.',
    category: 'services',
    scope: 'local',
    isAnonymous: false,
  },
  {
    id: 'v19',
    title: 'Dodatkowa przychodnia na osiedlu Północnym',
    description:
      'Na wizytę u lekarza rodzinnego czeka się nawet kilka tygodni. Nowa przychodnia skróciłaby kolejki i odciążyła istniejące placówki.',
    category: 'services',
    scope: 'citywide',
    isAnonymous: false,
  },

  // culture
  {
    id: 'v20',
    title: 'Cotygodniowy targ lokalnych produktów na skwerze',
    description:
      'Sobotni targ z warzywami, pieczywem i rękodziełem od lokalnych producentów ożywiłby okolicę i wsparł małe firmy.',
    category: 'culture',
    scope: 'local',
    isAnonymous: false,
  },
  {
    id: 'v21',
    title: 'Letni festiwal muzyczny w parku miejskim',
    description:
      'Czy miasto powinno organizować darmowy festiwal na koniec wakacji? Wydarzenie wymagałoby dofinansowania i zamknięcia części parku na weekend.',
    category: 'culture',
    scope: 'citywide',
    isAnonymous: false,
  },

  // community
  {
    id: 'v22',
    title: 'Zakaz grillowania na balkonach i podwórku',
    description:
      'Dym wchodzi do mieszkań sąsiadów, szczególnie w weekendy. Warto ustalić wspólne zasady dla całego osiedla.',
    category: 'community',
    scope: 'local',
    isAnonymous: true,
  },
  {
    id: 'v23',
    title: 'Wspólny ogródek sąsiedzki za blokiem 22',
    description:
      'Zaniedbany trawnik mógłby stać się miejscem, gdzie mieszkańcy wspólnie uprawiają warzywa i zioła. Szukam osób chętnych do zaangażowania.',
    category: 'community',
    scope: 'local',
    isAnonymous: false,
  },
  {
    id: 'v24',
    title: 'Zasady korzystania z podwórka przez psy',
    description:
      'Część mieszkańców puszcza psy luzem i nie sprząta po nich. Proponuję spisać proste zasady i zamieścić je na tablicy ogłoszeń.',
    category: 'community',
    scope: 'everyday',
    isAnonymous: true,
  },

  // other
  {
    id: 'v25',
    title: 'Bezpłatne Wi-Fi w miejskich parkach',
    description:
      'Dostęp do internetu w parkach pomógłby uczniom, turystom i osobom pracującym zdalnie. Pytanie, czy koszt jest tego wart.',
    category: 'other',
    scope: 'citywide',
    isAnonymous: false,
  },
];

export const VOTINGS: Voting[] = VOTING_SEEDS.map((voting) => ({
  ...voting,
  votesFor: 0,
  votesAgainst: 0,
  myVote: null,
}));
