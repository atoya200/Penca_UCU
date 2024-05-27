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

CREATE TABLE points(
    ci VARCHAR(8),
                    idChampionship INTEGER,
                    points INTEGER default 0,
                    PRIMARY KEY (ci,idChampionship),
                    FOREIGN KEY (ci) references student(ci),
                    foreign key (idChampionship) references championship(id)
);

INSERT INTO user(ci, password) values ('12345678','password');
INSERT INTO admin(ci) values ('12345678');


INSERT INTO user(ci, password) values ('87654321','password');
INSERT INTO student(ci) values ('87654321');