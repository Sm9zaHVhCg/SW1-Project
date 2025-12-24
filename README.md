# Wordle/Crossword puzzle

Ein Spiel, welches auf Wordle angelehnt ist und Wörter aus der Informatik (bzw. anderen Fachbereichen der DHBW Technik) verwendet.
## 1. Kontext

### a. Beschreibung
**DHBW Wordle** ist eine Webanwendung, welches auf dem populären Spiel Wordle basiert, aber stattdessen studiengangsspezifische Wörter nutzt.

### b. Stakeholder
| Stakeholder | Beschreibung | Ziel / Interesse |
|--------------|--------------|------------------|
| **Studierende** | Hauptspieler | Etw. Zeitvertreib zwischen (während) Vorlesungen |
| **Dozierende / Organisationen** | Erstellen von Wörtern für die Studis | Wordle mitspielen |

### c. Personas
Max M. 19:
- langweilt sich manchmal in der Pause
- möchte ein unterhaltsames Spiel spielen

Herr Dosenbach (Dozent, Fakultät Technik):
- möchte Stoff den Studenten beibringen
- langweilt sich auch manchmal in der Pause

## 2. Features
### a. Funktionale:
- Es soll ein ansprechendes User Interface geben, in dem die Spieler die Möglichkeit haben, auszuwählen aus welchem Fach die Begriffe gewählt werden sollen (Informatik, usw.).
- Es soll die Möglichkeit geben innerhalb einer begrenzten Anzahl (6) an Versuchen den Begriff zu erraten.
- Bereits verwendete Zeichen, die nicht im Begriff vorkommen sollen als solche gekennzeichnet werden.
- Bereits verwendete Zeichen, die im Begriff vorkommen aber an der falschen Stelle stehen sollen als solche gekennzeichnet werden.
- Bereits verwendete Zeichen, die im Begriff vorkommen und an der richtigen Stelle stehen sollen als solche gekennzeichnet werden.
- Falls der Spieler das Wort nicht innerhalb der gegebenen Anzahl an Versuchen erraten hat, verliert er. Dies soll dem Spieler auch mitgeteilt werden.
- Falls der Spieler das Wort innerhalb der gegebenen Anzahl an Versuchen erraten hat, gewinnt er. Dies soll dem Spieler auch mitgeteilt werden.
- Am Ende soll eine Begriffserklärung noch angezeigt werden.
- Die Spieler sollen die Möglichkeit haben ein Leaderboard anzuschauen
- Es soll möglich sein Wörter (und eine Beschreibung dieser) vorzuschlagen.

### b. Nicht funktionale:
- ansprechende/intuitive UI
- Adminpage zum Verwalten (Bestätigen, Bearbeiten u. Löschen) der vorgeschlagenen Wörter
- accessibility

## 3. MVP
Ein grundsätzlich funktionierendes Spiel, bei dem ein Spieler pro Tag ein Wordle spielen kann. Das Vorschlagen von Wörtern und das Leaderboard sind nicht Teil vom MVP

## 4. Architektur und Dokumente
- Detaillierte C4-Diagramm unter 'docs'
- Use Case Diagramm in 'docs/Use Case Diagramm'
- Wordle Aktivitaetsdiagramm in 'WordleWortvorschlag_Aktivitaetsdiagramm.drawio'
- Reflexion in 'docs/reflexion.md'
- License in 'license.md'

## 5. Tools und Technologien
- **Backend:** Sprint Boot, Bruno (Client für Endpoint-Testing)
- **Frontend:** Angular, TailwindCSS, DaisyUI
- **CI/CD**: GitHub Actions, Sonarqube
- **Projektmanagement**: Github Projects (Kanban Board)
