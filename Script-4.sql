CREATE TABLE maiid_app.GROUPE (
    id_groupe INT PRIMARY KEY,
    nom_groupe VARCHAR(255) UNIQUE NOT NULL,
);

CREATE TABLE maiid_app.UTILISATEUR (
    id_user INT PRIMARY KEY,
    login VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    date_inscription DATE NOT NULL,
    group_id INT NOT NULL UNIQUE,
    FOREIGN KEY (group_id) REFERENCES GROUPE(id_groupe) ON DELETE CASCADE    
);

CREATE TABLE maiid_app.ANALYSE (
    id_analyse INT PRIMARY KEY,
    date_analyse DATETIME NOT NULL,
    algo_config TEXT,  -- Peut évoluer, non normalisé
    user_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES UTILISATEUR(id_user) ON DELETE CASCADE  
);

CREATE TABLE maiid_app.BOUNDING_BOX (
    id_bounding_box INT PRIMARY KEY,
    x1 FLOAT NOT NULL,
    y1 FLOAT NOT NULL,
    x2 FLOAT NOT NULL,
    y2 FLOAT NOT NULL,
    class_result VARCHAR(255) NOT NULL,
    analyse_id INT NOT NULL UNIQUE,
    FOREIGN KEY (analyse_id) REFERENCES ANALYSE(id_analyse) ON DELETE CASCADE   
);


CREATE TABLE maiid_app.IMAGE (
    id_image INT PRIMARY KEY,
    md5_hash CHAR(32) UNIQUE NOT NULL,
    image_path TEXT NOT NULL,
    id_utilisateur INT NOT NULL UNIQUE,
    FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR(id_user) ON DELETE CASCADE
);


