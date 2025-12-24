# Reflexion zum SWE-Projekt DHBW Wordle
Im Rahmen dieses Projekts wurde ein webbasiertes Wortspiel entwickelt, das sich am bekannten Spielprinzip von Wordle orientiert. 
Ziel des Projekts war es, sowohl eine unterhaltsame und funktionale Spielmechanik als auch eine saubere technische Umsetzung mit modernen Webtechnologien zu realisieren.   
Das Spielprinzip basiert darauf, innerhalb einer begrenzten Anzahl von Versuchen ein vorgegebenes Wort zu erraten, wobei visuelles Feedback in Form von farblich markierten Buchstaben gegeben wird.
Zur Einordnung des Konzepts kann das Originalspiel unter folgender Adresse ausprobiert werden: https://www.nytimes.com/games/wordle/index.html

## Planung und Architektur
Die Projektidee stand schon früh fest und man entschied sich für den Technologie-Stack mit Angular im Frontend und Spring Boot im Backend.
Auch wurden relativ früh der Aufbau und die Bereiche zugeteilt, wer was macht:

Laura (Scrum master) -> Admin page und word suggestion im frontend

Qin Wen (Developer) -> Spiel an sich, home page und ggf. Tests

Xin Tian (Product Owner) -> Backend-Sachen und ggf. CI/CD

Diese Aufteilung erleichterte die parallele Arbeit und sorgte dafür, dass sich jedes Teammitglied auf einen klar abgegrenzten Bereich konzentrieren konnte.

## Technische Umsetzung
Anfangs lief die Entwicklung im Frontend und Backend separat voneinander, und wurden erst am Ende dann miteinander verbunden.
Danach wurden diverse fehlende Dokumente noch eingebunden und Tests geschrieben.

Aufgrund der starken Herausszögerung der Umsetzung wurde das meiste an wenigen Tagen entwickelt, d.h. auch entsprechend, dass Zeit fehlte, größere, umfangreichere Tests durchzuführen und nach Bugs zu suchen.
Trotzdem wurde versucht auf regelmäßiges Committen und sauberes Arbeiten auf verschiedenen Branches zu achten.

## Herausforderungen und Learnings
Wie bei der technischen Umsetzung angeführt, fehlte gegen Ende eben die Zeit, entsprechend ist das "Key Learning" sich früher an eine Aufgabe zu setzen bzw. in regelmäßigen Abständen daran zu arbeiten, da man den Aufwand immer etwas unterschätzt.
Entsprechend blieben u.a. noch ein paar Punkte offen:
- Anpassung der Unit und Integration Tests an den für die Backend-Integration angepassten Code.
- IT Tests für die Backendapplikation (es wurde zwar mit Requests durch einen API-Client Bruno getestet, aber in einem professionelleren Rahmen reicht dies nicht aus) -> sowohl für die Scheduler als auch die API Endpunkte
- hinsichtlich der Authentifizierung hätte man mit dem Dozenten/Provider der Auth API früher sprechen sollen, um Missverständnisse/Wissenslücken zu vermeiden
- Persistenz, dass der Spieler nur EINMAL ein Wort eines Studiengangs spielen kann.
- Sonarqube reparieren/richtig konfigurieren für die CI/CD pipeline (im Moment funktioniert die build.yml nicht; es liegt höchstwahrscheinlich an fehlenden Infos --> siehe Github Secrets)

Entitäten & Interaktionen im Spiel wurden zwar vorher geplant (siehe Diagramme), mussten späterhin aber noch drastisch geändert werden wegen einem Denkfehler, den man abgefangen hätte, falls man die Diagramme noch genauer durchdacht hätte.
