# tresor-app

## Übersicht

Die Secret Tresor Application besteht aus einem **Backend** (Java Spring Boot) und einem **Frontend** (React). Sie dient dazu, sensible Daten wie Zugangsdaten, Kreditkarteninformationen und Notizen verschlüsselt in einer Datenbank zu speichern und zu verwalten.

---

## Architektur

- **Backend:** Java Spring Boot, REST API, MariaDB/MySQL
- **Frontend:** React, REST-Client, Docker/Nginx

---

## Features

- Benutzerregistrierung und Login
- Speicherung und Verwaltung von Secrets (Credentials, Kreditkarten, Notizen)
- Verschlüsselte Speicherung der Datenbankinhalte
- REST-API für alle Funktionen
- Docker-Container für einfachen Betrieb

---

## Setup & Installation

### 1. Datenbank (MariaDB)

- Siehe [165_MariaDB/docker-compose.yml](165_MariaDB/docker-compose.yml) für ein Beispiel-Setup mit Docker Compose.
- Das SQL-Skript [165_MariaDB/tresordb.sql](165_MariaDB/tresordb.sql) legt die benötigten Tabellen und Beispieldaten an.

### 2. Backend

- Verzeichnis: [`183_12_1_tresorbackend_rupe-master`](183_12_1_tresorbackend_rupe-master/)
- Konfiguration: [`src/main/resources/application.properties`](183_12_1_tresorbackend_rupe-master/src/main/resources/application.properties)
- Build:
  ```sh
  cd 183_12_1_tresorbackend_rupe-master
  ./mvnw clean package
  ```
- Start (lokal):
  ```sh
  java -jar target/*.jar
  ```
- Docker Build:
  ```sh
  docker build -t tresorbackendimg .
  docker run -p 8080:8080 --name tresorbackend tresorbackendimg
  ```

### 3. Frontend

- Verzeichnis: [`183_12_2_tresorfrontend_rupe-master`](183_12_2_tresorfrontend_rupe-master/)
- Konfiguration: `.env` Datei für API-URL und Port
- Start (lokal):
  ```sh
  cd 183_12_2_tresorfrontend_rupe-master
  npm install
  npm start
  ```
- Docker Build:
  ```sh
  docker build -t tresorfrontendimg .
  docker run -p 80:80 --name tresorfrontend tresorfrontendimg
  ```

---

## Nutzung

1. **Registrieren:** Über das Frontend einen neuen Benutzer anlegen.
2. **Login:** Mit E-Mail und Passwort anmelden.
3. **Secrets verwalten:** Neue Secrets anlegen (Credential, Kreditkarte, Notiz) und bestehende einsehen.
4. **Admin-Funktionen:** Alle Benutzer und Secrets einsehen (nur zu Demo-Zwecken, keine echte Rechteverwaltung).

---

## API-Dokumentation

- Siehe [183_12_1_tresorbackend_rupe-master/httprequest/UserRequests.http](183_12_1_tresorbackend_rupe-master/httprequest/UserRequests.http)
- Siehe [183_12_1_tresorbackend_rupe-master/httprequest/SecretRequests.http](183_12_1_tresorbackend_rupe-master/httprequest/SecretRequests.http)

---

## Sicherheitshinweise

- Die aktuelle Version ist für Unterrichtszwecke gedacht und enthält keine vollständige Security (z.B. keine JWT-Authentifizierung).
- Passwörter werden gehasht und Secrets verschlüsselt gespeichert.
- Für produktive Nutzung sind weitere Sicherheitsmaßnahmen notwendig!

---

## Lizenz

Nur für Ausbildungszwecke.