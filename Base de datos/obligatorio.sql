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
        description varchar(500),
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
    CREATE TABLE championshipMatch (
        id INTEGER AUTO_INCREMENT PRIMARY KEY,
        idTeamA INTEGER,
        idTeamB INTEGER,
        matchDate DATETIME,
        idStage INTEGER,
        idChampionship INTEGER,
        resultTeamA INTEGER,
        resultTeamB INTEGER,
        INDEX idx_match (idChampionship, idStage, idTeamA, idTeamB, matchDate),
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
        matchId INTEGER PRIMARY KEY,
        ci VARCHAR(8),
        FOREIGN KEY (ci) REFERENCES student(ci),
        FOREIGN KEY (idchampionship, idstage, teamA, teamB, matchDate) REFERENCES championshipMatch(idChampionship, idStage, idTeamA, idTeamB, matchDate),
        FOREIGN KEY (matchId) REFERENCES championshipMatch(id)
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

    insert into user(ci, password) values ('7654321','password');
    insert into student (ci, firstname, lastname) VALUES ('7654321', 'B', 'B');






    -- Insertar datos para pruebas:

    INSERT INTO team (name) VALUES ('Real');
    INSERT INTO team (name) VALUES ('Barca');
    INSERT INTO team (name) VALUES ('Nacional');
    INSERT INTO team (name) VALUES ('Peñarol');

    INSERT INTO championship (name, start_date, end_date, description) VALUES ('Copa Libertadores', '2022-01-01', '2022-12-31', 'Copa Libertadores 2021');
    INSERT INTO championship (name, start_date, end_date, description) VALUES ('Copa Sudamericana', '2022-01-01', '2022-12-31', 'Copa Sudamericana 2021');

    INSERT INTO stage (name) VALUES ('Fase de Grupos');
    INSERT INTO stage (name) VALUES ('Cuartos de Final');

    INSERT INTO stage_for_championship (idStage, idChampionship) VALUES (1, 1);
    INSERT INTO stage_for_championship (idStage, idChampionship) VALUES (2, 1);

    INSERT INTO team_participation (idTeam, idChampionship) VALUES (1, 1);
    INSERT INTO team_participation (idTeam, idChampionship) VALUES (2, 1);
    INSERT INTO team_participation (idTeam, idChampionship) VALUES (3, 1);
    INSERT INTO team_participation (idTeam, idChampionship) VALUES (4, 1);

    INSERT INTO championshipMatch (idTeamA, idTeamB, matchDate, idStage, idChampionship, resultTeamA, resultTeamB)
    VALUES (1, 2, '2022-05-10', 1, 1, 2, 1);
    INSERT INTO championshipMatch (idTeamA, idTeamB, matchDate, idStage, idChampionship, resultTeamA, resultTeamB)
    VALUES (3, 4, '2025-05-11', 1, 1, 1, 0);

    INSERT INTO predictions (matchId ,teamA, teamB, matchDate, idchampionship, predictionResultTeamA, predictionResultTeamB, scoreObtained, idstage, ci)
    VALUES (1, 1, 2, '2022-05-10', 1, 2, 1, 3, 1, '7654321');
    INSERT INTO predictions (matchId, teamA, teamB, matchDate, idchampionship, predictionResultTeamA, predictionResultTeamB, scoreObtained, idstage, ci)
    VALUES (2, 3, 4, '2025-05-11', 1, 1, 0, 3, 1, '7654321');

    INSERT INTO  predict_first (idTeam, ci, idChampionship) VALUES (1, '7654321', 1);

    INSERT INTO stage (name) VALUES ('Semifinal');
    INSERT INTO stage (name) VALUES ('Final');

    -- Linking stages to the second championship
    INSERT INTO stage_for_championship (idStage, idChampionship) VALUES (3, 2);
    INSERT INTO stage_for_championship (idStage, idChampionship) VALUES (4, 2);

    -- Team participation for the second championship
    INSERT INTO team_participation (idTeam, idChampionship) VALUES (1, 2);
    INSERT INTO team_participation (idTeam, idChampionship) VALUES (2, 2);
    INSERT INTO team_participation (idTeam, idChampionship) VALUES (3, 2);
    INSERT INTO team_participation (idTeam, idChampionship) VALUES (4, 2);

    -- Matches for the second championship
    INSERT INTO championshipMatch (idTeamA, idTeamB, matchDate, idStage, idChampionship, resultTeamA, resultTeamB)
    VALUES (1, 3, '2022-06-15', 3, 2, 3, 2);
    INSERT INTO championshipMatch (idTeamA, idTeamB, matchDate, idStage, idChampionship, resultTeamA, resultTeamB)
    VALUES (2, 4, '2022-06-16', 3, 2, 0, 1);

    -- Predictions for the second championship
    INSERT INTO predictions (matchId, teamA, teamB, matchDate, idchampionship, predictionResultTeamA, predictionResultTeamB, scoreObtained, idstage, ci)
    VALUES (3, 1, 3, '2022-06-15', 2, 3, 2, 3, 3, '7654321');
    INSERT INTO predictions (matchId, teamA, teamB, matchDate, idchampionship, predictionResultTeamA, predictionResultTeamB, scoreObtained, idstage, ci)
    VALUES (4, 2, 4, '2022-06-16', 2, 0, 1, 3, 3, '7654321');

    -- Predictions for the winner of the second championship
    INSERT INTO predict_first (idTeam, ci, idChampionship) VALUES (3, '7654321', 2);

    SELECT
        p.matchId AS matchId,
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
        p.ci = '7654321'
        AND p.idchampionship = 1;

    select c.id, c.name, c.description from predict_first p inner join championship c on c.id=p.idChampionship where p.ci='7654321';
    UPDATE predictions SET predictionResultTeamA = 3, predictionResultTeamB = 1 WHERE matchId = 2 AND ci = '7654321';

SELECT resultTeamA,resultTeamB FROM championshipMatch WHERE id = ?;