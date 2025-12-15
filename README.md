# 🧱 Classic Tetris Web App

Ein klassischer Tetris-Klon, entwickelt mit "Vanilla" JavaScript, HTML5 Canvas und CSS. Keine externen Frameworks, keine Abhängigkeiten – purer Code.

![Screenshot des Spiels](./screenshot.png)
*(Hinweis: Füge hier später einen Screenshot deines Spiels ein)*

## 🎮 Features

* **Klassisches Gameplay:** Alle 7 Tetrominos (I, J, L, O, S, T, Z) mit den originalen Farben.
* **Collision Detection:** Präzise Kollisionsabfrage mit dem Spielfeld und anderen Steinen.
* **Wall Kicks:** Intelligente Rotationslogik, die verhindert, dass Steine in Wänden stecken bleiben.
* **Highscore:** Punkteberechnung basierend auf gelöschten Reihen (inklusive Combo-Multiplikator).
* **Responsives Design:** Zentriertes Spielfeld mit Retro-Look.

## 🕹️ Steuerung

| Taste | Aktion |
| :--- | :--- |
| **⬅️ Pfeil Links** | Stein nach links bewegen |
| **➡️ Pfeil Rechts** | Stein nach rechts bewegen |
| **⬇️ Pfeil Runter** | Stein schneller fallen lassen (Soft Drop) |
| **⬆️ Pfeil Oben** / **W** | Rotieren (Uhrzeigersinn) |
| **Q** | Rotieren (Gegen den Uhrzeigersinn) |

## 🚀 Installation & Start

Da das Projekt keine Abhängigkeiten (wie Node.js Module) hat, ist die Installation sehr einfach.

1.  **Repository klonen:**
    ```bash
    git clone [https://github.com/DEIN-USERNAME/DEIN-REPO-NAME.git](https://github.com/DEIN-USERNAME/DEIN-REPO-NAME.git)
    ```
2.  **Lokal starten:**
    Öffne einfach die Datei `index.html` in einem modernen Webbrowser (Chrome, Firefox, Safari).

## ☁️ Deployment (Render.com)

Dieses Spiel ist für das Hosting als **Static Site** optimiert.

1.  Lade den Code auf GitHub hoch.
2.  Logge dich bei [Render.com](https://render.com) ein.
3.  Erstelle eine neue **Static Site**.
4.  Verbinde dein GitHub-Repository.
5.  Einstellungen:
    * **Build Command:** (Leer lassen)
    * **Publish Directory:** `./` (oder leer lassen)
6.  Klicke auf "Deploy".

## 🛠️ Technologien

* **HTML5 Canvas:** Rendering des Spielfelds.
* **JavaScript (ES6+):** Logik für Matrix-Manipulation, Game Loop und Events.
* **CSS3:** Styling und Flexbox-Layout.

## 📝 Lizenz

Dieses Projekt ist unter der MIT Lizenz veröffentlicht. Fühl dich frei, den Code zu lernen, zu ändern und zu erweitern.
