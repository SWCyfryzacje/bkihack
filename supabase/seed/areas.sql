-- Źródła:
--   Lista i numeracja 13 okręgów (jednostek pomocniczych), granice obowiązują od 17.06.2021:
--     https://torun.pl/pl/miasto/rady-okregow
--   Opis granic okręgów (zał. nr 2 do uchwały nr 372/12 RMT, projekt zmian z 2016 r.):
--     https://www.konsultacje.torun.pl/sites/default/files/pictures/2016/ks_zmiany_w_radach_okregow_2016_projekt_uchwaly.pdf
--   24 części urzędowe miasta (uchwała RMT z 2005 r.): https://pl.wikipedia.org/wiki/Podział_administracyjny_Torunia
--   Położenie poszczególnych części: artykuły pl.wikipedia.org o częściach Torunia (Piaski, Glinki, Rybaki, Bielany,
--     Barbarka, Koniuchy, Winnica, Katarzynka, Starotoruńskie Przedmieście).
--
-- Uwagi:
--   * Okręgi i części urzędowe (osiedla) to dwa NIEZALEŻNE podziały - granice okręgów biegną ulicami
--     i nie pokrywają się 1:1 z częściami miasta. Osiedle przypisano do okręgu, w którym leży jego
--     większość, na podstawie opisu granic okręgów zestawionego z położeniem części miasta.
--   * Nazwy okręgów: torun.pl, "Okręg nr N - Nazwa".
--   * Reforma rad okręgów (konsultacje do 31.01.2026) może zmienić granice, m.in. w rejonie Bielan;
--     nie sprawdzono, czy nowa uchwała już weszła w życie.
insert into public.areas (id, name, level, parent_id) values
  ('torun', 'Toruń', 'miasto', null),

  ('okreg-podgorz', 'Okręg nr 1 - Podgórz', 'okreg', 'torun'),
  ('okreg-stawki', 'Okręg nr 2 - Stawki', 'okreg', 'torun'),
  ('okreg-rudak', 'Okręg nr 3 - Rudak', 'okreg', 'torun'),
  ('okreg-czerniewice', 'Okręg nr 4 - Czerniewice', 'okreg', 'torun'),
  ('okreg-kaszczorek', 'Okręg nr 5 - Kaszczorek', 'okreg', 'torun'),
  ('okreg-bielawy-grebocin', 'Okręg nr 6 - Bielawy-Grębocin', 'okreg', 'torun'),
  ('okreg-skarpa', 'Okręg nr 7 - Skarpa', 'okreg', 'torun'),
  ('okreg-rubinkowo', 'Okręg nr 8 - Rubinkowo', 'okreg', 'torun'),
  ('okreg-jakubskie-mokre', 'Okręg nr 9 - Jakubskie-Mokre', 'okreg', 'torun'),
  ('okreg-wrzosy', 'Okręg nr 10 - Wrzosy', 'okreg', 'torun'),
  ('okreg-chelminskie', 'Okręg nr 11 - Chełmińskie', 'okreg', 'torun'),
  ('okreg-staromiejskie', 'Okręg nr 12 - Staromiejskie', 'okreg', 'torun'),
  ('okreg-bydgoskie', 'Okręg nr 13 - Bydgoskie', 'okreg', 'torun'),

  -- Lewobrzeże. Okręg 1: od zachodniej granicy miasta do linii mostu Piłsudskiego / ul. Pstrowskiego.
  ('podgorz', 'Podgórz', 'osiedle', 'okreg-podgorz'),
  -- Piaski: lewobrzeże przy Podgórzu (ul. Dybowska, Kujawska, Poznańska).
  ('piaski', 'Piaski', 'osiedle', 'okreg-podgorz'),
  -- Glinki: na południe od ul. Gniewkowskiej / na zachód od Poznańskiej, przy granicy miasta.
  -- Niepewne: możliwe, że wschodnia część leży w okręgu 2 Stawki.
  ('glinki', 'Glinki', 'osiedle', 'okreg-podgorz'),
  ('stawki', 'Stawki', 'osiedle', 'okreg-stawki'),
  ('rudak', 'Rudak', 'osiedle', 'okreg-rudak'),
  ('czerniewice', 'Czerniewice', 'osiedle', 'okreg-czerniewice'),

  -- Prawobrzeże, wschód.
  ('kaszczorek', 'Kaszczorek', 'osiedle', 'okreg-kaszczorek'),
  ('bielawy', 'Bielawy', 'osiedle', 'okreg-bielawy-grebocin'),
  ('grebocin-nad-struga', 'Grębocin nad Strugą', 'osiedle', 'okreg-bielawy-grebocin'),
  ('na-skarpie', 'Na Skarpie', 'osiedle', 'okreg-skarpa'),
  -- Okręg 8: Szosa Lubicka / Olsztyńska / Bukowa / Skłodowskiej-Curie / Wschodnia / Leszczynowa.
  -- Część urzędowa Rubinkowo może wystawać poza te ulice (np. w stronę Bielaw) - przyjęto 1:1.
  ('rubinkowo', 'Rubinkowo', 'osiedle', 'okreg-rubinkowo'),
  ('jakubskie-przedmiescie', 'Jakubskie Przedmieście', 'osiedle', 'okreg-jakubskie-mokre'),
  ('mokre', 'Mokre', 'osiedle', 'okreg-jakubskie-mokre'),
  -- Winnica: według Wikipedii w obrębie Jakubskiego Przedmieścia, nad Wisłą na zachód od mostu Zawackiej.
  ('winnica', 'Winnica', 'osiedle', 'okreg-jakubskie-mokre'),
  -- Katarzynka: na wschód od Grudziądzkiej, na północ od Polnej/Skłodowskiej-Curie (dawniej część Mokrego).
  -- Niepewne: skrawek na wschód od Równinnej może należeć do okręgu 6.
  ('katarzynka', 'Katarzynka', 'osiedle', 'okreg-jakubskie-mokre'),

  -- Prawobrzeże, północ i zachód.
  ('wrzosy', 'Wrzosy', 'osiedle', 'okreg-wrzosy'),
  -- Barbarka: tereny leśne na północny zachód (7 stałych mieszkańców w 2016 r.). Okręg 10 graniczy na zachodzie z "lasami
  -- Barbarki" i Drogą Czarnobłocką. Niepewne: część lasów może leżeć w okręgu 13 Bydgoskie.
  ('barbarka', 'Barbarka', 'osiedle', 'okreg-wrzosy'),
  ('chelminskie-przedmiescie', 'Chełmińskie Przedmieście', 'osiedle', 'okreg-chelminskie'),
  ('stare-miasto', 'Stare Miasto', 'osiedle', 'okreg-staromiejskie'),
  -- Koniuchy: między Szosą Chełmińską a Grudziądzką, na południe od linii kolejowej. Okręg 12 sięga na północ
  -- do Trasy Średnicowej. Niepewne: przy innym przebiegu trasy część Koniuchów może leżeć w okręgu 11.
  ('koniuchy', 'Koniuchy', 'osiedle', 'okreg-staromiejskie'),
  ('bydgoskie-przedmiescie', 'Bydgoskie Przedmieście', 'osiedle', 'okreg-bydgoskie'),
  -- Rybaki: na zachód od al. Jana Pawła II (Trasa Staromostowa = granica okręgów 12/13).
  ('rybaki', 'Rybaki', 'osiedle', 'okreg-bydgoskie'),
  -- Starotoruńskie Przedmieście: zachodni kraniec prawobrzeża (Port Drzewny).
  ('starotorunskie-przedmiescie', 'Starotoruńskie Przedmieście', 'osiedle', 'okreg-bydgoskie'),
  -- Bielany: kampus UMK. Granica okręgów 11/13 biegnie ulicami Bema, Balonową, św. Józefa, św. Klemensa, Śniadeckiego i
  -- Grunwaldzką, więc część Bielan leży w okręgu 11. Ta granica była sporna w konsultacjach reformy z 2026 r.
  ('bielany', 'Bielany', 'osiedle', 'okreg-bydgoskie')
on conflict (id) do nothing;
