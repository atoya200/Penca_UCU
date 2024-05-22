drop database if exists obligatoriobd2;
CREATE database obligatoriobd2;
use obligatoriobd2;

CREATE TABLE user(
    ci VARCHAR(8),
    email VARCHAR(100),
    password VARCHAR(50),
    PRIMARY KEY (ci)
);

CREATE TABLE student(
    ci VARCHAR(8),
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    PRIMARY KEY (ci),
    FOREIGN KEY (ci) REFERENCES user(ci)
);

CREATE TABLE admin(
    ci VARCHAR(8),
    FOREIGN KEY (ci) REFERENCES user(ci),
    PRIMARY KEY (ci)
);

CREATE TABLE team(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20),
    teamImage blob
);

CREATE TABLE career(
    id INTEGER AUTO_INCREMENT,
    carrer_name VARCHAR(100),
    PRIMARY KEY (id)
);

CREATE TABLE studies(
    id_career INTEGER,
    ci_student VARCHAR(8),
    FOREIGN KEY (id_career) REFERENCES career(id),
    FOREIGN KEY (ci_student) REFERENCES student(ci) ,
    PRIMARY KEY (id_career, ci_student)
);

CREATE TABLE championship(
    id INTEGER AUTO_INCREMENT,
    name VARCHAR(50),
    start_date datetime,
    end_date datetime,
    PRIMARY KEY (id)
);

CREATE TABLE stage(
    id INTEGER AUTO_INCREMENT,
    name VARCHAR(50),
    PRIMARY KEY (id)
);

CREATE TABLE stage_for_championship(
    idStage INTEGER,
    idChampionship INTEGER,
    FOREIGN KEY (idStage) REFERENCES stage(id),
    FOREIGN KEY (idChampionship) REFERENCES championship(id)
);


CREATE TABLE team_participation(
    idTeam INTEGER,
    idChampionship INTEGER,
    PRIMARY KEY(idTeam, idChampionship),
    FOREIGN KEY (idTeam) REFERENCES team(id),
    FOREIGN KEY (idChampionship) REFERENCES championship(id)
);

-- Es la agregación de juega equipo con la agregación de etapa con campeonato
CREATE TABLE championshipMatch(
    idTeamA INTEGER,
    idTeamB INTEGER,
    matchDate DATETIME,
    idStage INTEGER,
    idChampionship INTEGER,
    resultTeamA INTEGER,
    resultTeamB INTEGER,
    INDEX idx_match (idChampionship, idStage, idTeamA, idTeamB, matchDate),
    PRIMARY KEY (idTeamA, idTeamB,  idChampionship, idStage, matchDate),
    FOREIGN KEY (idChampionship) REFERENCES championship(id),
    FOREIGN KEY (idStage) REFERENCES stage(id),
    FOREIGN KEY (idTeamA) REFERENCES team(id),
    FOREIGN KEY (idTeamB) REFERENCES team(id)
);

CREATE TABLE predictions (
    teamA INTEGER,
    teamB INTEGER,
    matchDate DATETIME,
    idchampionship INTEGER,
    predictionResultTeamA INTEGER,
    predictionResultTeamB INTEGER,
    scoreObtained INTEGER,
    idstage INTEGER,
    ci VARCHAR(8),
    PRIMARY KEY (ci, teamA, teamB,  idchampionship, idstage, matchDate),
    FOREIGN KEY (ci) REFERENCES student(ci),
    FOREIGN KEY (idchampionship, idstage, teamA, teamB, matchDate) REFERENCES championshipMatch(idChampionship, idStage, idTeamA, idTeamB, matchDate)
);

-- Predice el campeón
CREATE TABLE predict_first(
    idTeam INTEGER,
    ci VARCHAR(8),
    idChampionship INTEGER,
    PRIMARY KEY (idTeam, ci, idChampionship),
    -- Podría sacrse  idTeam de la PK, y solucionamos el problema de que un usuario ingrese dos veces
    -- una predicción de campeoón por campeonato.
    FOREIGN KEY (ci) REFERENCES student(ci),
    FOREIGN KEY (idTeam) REFERENCES team_participation(idTeam),
    FOREIGN KEY (idChampionship) REFERENCES team_participation(idChampionship)


);

-- Predice subcampéon
CREATE TABLE predict_second(
    idTeam INTEGER,
    ci VARCHAR(8),
    idChampionship INTEGER,
    PRIMARY KEY (idTeam, ci, idChampionship),
    -- Podría sacrse  idTeam de la PK, y solucionamos el problema de que un usuario ingrese dos veces
    -- una predicción de un subcampeón por campeonato.
    FOREIGN KEY (ci) REFERENCES student(ci),
    FOREIGN KEY (idTeam) REFERENCES team_participation(idTeam),
    FOREIGN KEY (idChampionship) REFERENCES team_participation(idChampionship)


);

CREATE TABLE points(ci VARCHAR(8),
                    idChampionship INTEGER,
                    points INTEGER default 0,
                    PRIMARY KEY (ci,idChampionship),
                    FOREIGN KEY (ci) references student(ci),
                    foreign key (idChampionship) references championship(id)
);

INSERT INTO user(ci, password) values ('12345678','password');
INSERT INTO admin(ci) values ('12345678');


-- INSERT INTO user(ci, password) values ('87654321','password');
-- INSERT INTO student(ci) values ('87654321');




-- Insertar datos para pruebas:

-- Insertar usuarios
INSERT INTO user (ci, email, password) VALUES ('87654321', 'student1@example.com', 'password123');
INSERT INTO user (ci, email, password) VALUES ('12345678', 'admin1@example.com', 'password123');

-- Insertar estudiante
INSERT INTO student (ci, firstname, lastname) VALUES ('87654321', 'John', 'Doe');

-- Insertar administrador
INSERT INTO admin (ci) VALUES ('12345678');

-- Insertar equipos
INSERT INTO team (name) VALUES ('Real');
INSERT INTO team (name) VALUES ('Barca');
INSERT INTO team (name) VALUES ('Nacional');
INSERT INTO team (name) VALUES ('Peñarol');

-- Insertar campeonatos
INSERT INTO championship (name, start_date, end_date) VALUES ('Copa Libertadores', '2022-01-01', '2022-12-31');
INSERT INTO championship (name, start_date, end_date) VALUES ('Copa Sudamericana', '2022-01-01', '2022-12-31');

-- Insertar etapas
INSERT INTO stage (name) VALUES ('Fase de Grupos');
INSERT INTO stage (name) VALUES ('Cuartos de Final');

-- Insertar detalles del campeonato y la etapa
INSERT INTO stage_for_championship (idStage, idChampionship) VALUES (1, 1);
INSERT INTO stage_for_championship (idStage, idChampionship) VALUES (2, 1);

-- Insertar participaciones de equipos
INSERT INTO team_participation (idTeam, idChampionship) VALUES (1, 1);
INSERT INTO team_participation (idTeam, idChampionship) VALUES (2, 1);
INSERT INTO team_participation (idTeam, idChampionship) VALUES (3, 1);
INSERT INTO team_participation (idTeam, idChampionship) VALUES (4, 1);

-- Insertar partidos en campeonatoMatch
INSERT INTO championshipMatch (idTeamA, idTeamB, matchDate, idStage, idChampionship, resultTeamA, resultTeamB)
VALUES (1, 2, '2022-05-10', 1, 1, 2, 1);
INSERT INTO championshipMatch (idTeamA, idTeamB, matchDate, idStage, idChampionship, resultTeamA, resultTeamB)
VALUES (3, 4, '2022-05-11', 1, 1, 1, 0);

-- Insertar predicciones
INSERT INTO predictions (teamA, teamB, matchDate, idchampionship, predictionResultTeamA, predictionResultTeamB, scoreObtained, idstage, ci)
VALUES (1, 2, '2022-05-10', 1, 2, 1, 3, 1, '87654321');
INSERT INTO predictions (teamA, teamB, matchDate, idchampionship, predictionResultTeamA, predictionResultTeamB, scoreObtained, idstage, ci)
VALUES (3, 4, '2022-05-11', 1, 1, 0, 3, 1, '87654321');


SELECT
    tA.name AS teamAName,
    tB.name AS teamBName,
    cm.matchDate,
    ch.name AS championshipName,
    st.name AS stageName,
    p.predictionResultTeamA,
    p.predictionResultTeamB,
    p.scoreObtained
FROM
    predictions p
JOIN
    student s ON p.ci = s.ci
JOIN
    championshipMatch cm ON p.idchampionship = cm.idChampionship
                         AND p.idstage = cm.idStage
                         AND p.teamA = cm.idTeamA
                         AND p.teamB = cm.idTeamB
                         AND p.matchDate = cm.matchDate
JOIN
    team tA ON p.teamA = tA.id
JOIN
    team tB ON p.teamB = tB.id
JOIN
    championship ch ON p.idchampionship = ch.id
JOIN
    stage st ON p.idstage = st.id
WHERE
    p.ci = '87654321'
    AND p.idchampionship = 1;