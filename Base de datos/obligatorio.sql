drop database if exists obligatoriobd2;
create database obligatoriobd2;
use obligatoriobd2;

create table user(
    ci varchar(8),
    password varchar(50),
    primary key (ci)
);

create table student(
    ci varchar(8),
    firstname varchar(50),
    lastname varchar(50),
    email varchar(100),
    primary key (ci),
    foreign key (ci) references user(ci)
);

create table admin(
    ci varchar(8),
    foreign key (ci) references user(ci),
    primary key (ci)
);

create table carreer(
    id integer auto_increment,
    carrer_name varchar(100),
    primary key (id)
);

create table studies(
    id_career integer,
    ci_student varchar(8),
    foreign key (id_career) references carreer(id),
    foreign key (ci_student) references student(ci) ,
    primary key (id_career, ci_student)
);


create table championship(
    id integer auto_increment,
    name varchar(50),
    year year,
    start_date datetime,
    primary key (id)
);

insert into user(ci, password) values ('12345678','password');
insert into admin(ci) values ('12345678');


insert into user(ci, password) values ('87654321','password');
insert into student(ci) values ('87654321');

