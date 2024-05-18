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
    name VARCHAR(20)
);

CREATE TABLE carreer(
    id INTEGER AUTO_INCREMENT,
    carrer_name VARCHAR(100),
    PRIMARY KEY (id)
);

CREATE TABLE studies(
    id_career INTEGER,
    ci_student VARCHAR(8),
    FOREIGN KEY (id_career) REFERENCES carreer(id),
    FOREIGN KEY (ci_student) REFERENCES student(ci) ,
    PRIMARY KEY (id_career, ci_student)
);

CREATE TABLE championship(
    id INTEGER AUTO_INCREMENT,
    name VARCHAR(50),
    start_date datetime,
    end_date datatime, 
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
    matchDate DATE,
    idStage INTEGER,
    idChampionship, 
    resultTeamA INTEGER, 
    resultTeamB INTEGER, 
    PRIMARY KEY (idTeamA, idTeamB,  idChampionship, idStage, matchDate),
    FOREIGN KEY (idChampionship) REFERENCES championship(id),
    FOREIGN KEY (idStage) REFERENCES stage(id),
    FOREIGN KEY (idTeamA) REFERENCES team(id),
    FOREIGN KEY (idTeamB) REFERENCES team(id)
);

CREATE TABLE predictions (
    teamA INTEGER,
    teamB INTEGER,
    matchDate DATE,
    championship INTEGER,
    predictionResultTeamA INTEGER,
    predictionResultTeamB INTEGER,
    scoreObtained INTEGER,
    stage INTEGER,
    ci VARCHAR(8),
    PRIMARY KEY (ci, teamA, teamB,  championship, stage, matchDate),
    FOREIGN KEY (ci) REFERENCES student(ci),
    FOREIGN KEY (championship) REFERENCES championshipMatch(id),
    FOREIGN KEY (stage) REFERENCES championshipMatch(id),
    FOREIGN KEY (teamA) REFERENCES championshipMatch(idTeamB),
    FOREIGN KEY (teamB) REFERENCES championshipMatch(idTeamB)
    FOREIGN KEY (matchDate) REFERENCES championshipMatch(matchDate)
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

INSERT INTO user(ci, password) values ('12345678','password');
INSERT INTO admin(ci) values ('12345678');


INSERT INTO user(ci, password) values ('87654321','password');
INSERT INTO student(ci) values ('87654321');

