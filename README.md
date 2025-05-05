# Maiid project

## Introduction

Almost 20% of emerging infectious diseases are caused by pathogens of zoonotic origin involving a hematophagous arthropod vector. The main pathogen vectors in Europe are
ticks and mosquitoes. These insect vectors, particularly mosquitoes, are also associated
with nuisance problems (linked to bites), making them a priority issue in terms of public
policy. These public health issues (nuisance and transmission) involve all stakeholders in
society : from the general public to local authorities, the State and private partners ; in
order to implement tools aimed at better understanding, anticipating and predicting the
emergence of new diseases.
In this context, monitoring is playing an increasingly important role through expert
activities (carried out by experts in the eco-epidemiology of vectors, animals and the
environment) but also citizen activities, with the collection of data by amateur volunteers,
to help map and monitor vectors and pathogens they transmit. This huge amount of data,
in the form of mosquito specimens or images, raises a number of challenges, including
the high-speed processing of information. Given the growing complexity of the data to
be analysed, artificial intelligence is emerging as a promising tool for automating and
optimising the identification and analysis processes.
Epidemiology is a scientific discipline that studies health-problems in human popula-
tions. It observes various metrics such as frequency, distribution in time and space, and
the factors influencing population health and disease.
In this context, the study of disease vectors (such as ticks) is particularly impor-
tant. The DCLIC (Deep Convolutional Learning for Ixodidae Characterization) Project
responds to this challenge by developing automated tick identification tools. Based on
neural networks, the system achieves remarkable performance, with a sensitivity rate of
0.92 and a specificity rate of 0.90 for detecting ticks in images. These methodological de-
velopments are aimed at serving the scientific community and could be incorporated into
research applications or participatory science projects. In addition, the methodological
approach developed could be adapted and applied to other disease vectors, particularly
in the automated identification of mosquitoes, demonstrating the versatility and transfe-
rability potential of these technological advances to other entomological problems.
The identification of mosquitoes (genus/species) is crucial in warning us of the pre-
sence of new species (known as invasive species, such as the tiger mosquito) but also to
the potential of transmission, as each species can transmit a specific range of pathogens.
Mosquitoes of the Culex genus are more involved in the transmission of zoonotic arbo-
viruses such as the West Nile virus and the Usutu virus, while the tiger mosquito is the
main potential vector of the dengue, chikungunya and Zika viruses in mainland France.
The MaiiD project is part of the MASCARA network (Mosquitoes and Arboviruses :
Surveillance and Collective Action in Auvergne-Rhône-Alpes), which brings together ci-
tizens, local authorities, public agencies and academics to monitor and prevent the risks
associated with viruses transmitted by mosquitoes.

This network involves the collection of a massive volume of data on a specific topic,based on a recognised scientific protocol. The aim of the MaiiD project is to respond
to the need for rapid and efficient processing of data collected from mosquito images,
using artificial intelligence tools to help building a risk map that is relevant to public
decision-makers.
Currently, this identification of images is carried out manually by entomologists, which
is a long, tedious and costly process. To accelerate this identification step, the project
leaders came up with the idea of using machine learning. The authors used a well-known
machine learning model and trained it on their data (images of mosquitoes and other
insects for classification). This will enable large-scale monitoring of mosquito species /
genus populations that can be easily visualised by collectors.

## Principal function

A user can login to the application. After he can upload an image and analyze it and an picture with the indication (bouding box) of where the mosquitoe are will appear. Every results and user information are store in a database.

## Prerequisites / Installation

### Technical Prerequisites

- **Python ≥ 3.12**
- Required tools :
  - `git`
  - `pip` (or `conda` for virtual environments)

### Functional Prerequisites

- weights folder at the root or the project.

## Important Notes

- **System Compatibility**  : Please be mindful of your development machine: depending on your operating system (OS), the system packages required to connect to the MariaDB database via `DATABASE_URL` may differ. This project was developed primarily on **Linux** and **MacOS** machines. Once you have defined the package that will serve as your database connector, modify the `DATABASE_URL` in the [`/database/core.py`](.//database/core.py) file. Besides, keep in mind your personal / local database profil and specifies it in  `DATABASE_URL`.

  
- **OpenCV Version**
  Be careful with the `opencv-python` package version :
  Version **4.11.0.86** is not stable across all operating systems.
  It is recommended to use a more stable version, as specified in the [`requirements.txt`](./requirements.txt) file.

### Installation

1. Clone the Git repository :

   ```
   https://github.com/TimothyLab/maiid_app.git
   cd maiid_app
   ```
2. Create a virtual environment with Conda (optional but recommended):

   - Ensure that Conda is installed on your system :

     ```bash
     conda --version
     ```
   - Create a virtual environment named **maiid** with **python 3.12** :

     ```bash
     conda create -n maiid python=3.12.0
     ```
   - Activate  the environment :

     ```bash
     conda activate maiid
     ```
3. Install the dependencies using `requirements.txt` :

```bash
   pip install -r requirements.txt
```

4. Start the application with the following commands :

- You have to connect the database :

  - Create an admin acount and run mysql with it :

    ```
    mysql -u admin -p
    ```
  - To link at database use :

    ```sql
    CREATE DATABASE maiid_app;
    ```
  - Then exit mysql to load our database :

    ```bash
    mysql -u admin -p maiid_app < save_maiid_app.sql
    ```
  - Then you have to use the database :

    ```sql
    USE maiid_app;
    ```
  - If you do some modification on the content of the database you can save this by this command :

    ```bash
    mysqldump -u admin -p maiid_app > save_maiid_app.sql
    ```
- Then to run the application you have to run [`main.py`](main.py) to run the API :

  ```
  uvicorn main:app --reload
  ```
- Then you can :

  - run web page developpement (server) in the frontend folder:

  ```
  cd frontend
  npm start
  ```

  - Or run production build server web application :

  ```
  cd frontend
  npm run build
  ```

  If you choose this option, you just have run the [`main.py`](main.py) file (after putting the build repository created at the root of the project).

## Support

For technical questions / informations :

* Documentation Python et bibliothèques : [Python Package Index](https://pypi.org/).

## Authors

This project was carried out by :

* **Gabriel Michaux**
* **Timothy Labidi**

Promotion 2024-2025, Master 2 Bioinformatique, Université Claude Bernard Lyon 1.

## DeepLearning Image Analysis Model : YOLOv8 

We use a pre-trained YOLOv8 model for automatic mosquito identication on images. The weights of trained model were given by **Jocelyn De Goër**. For more information about training work, please contact him. 

## Project Owners

* **Vincent Raquin** : Assistant Professor EPHE-PSL, Infections Virales et Pathologie
Comparée - UMR 754 [IVPC]
* **Jocelyn De Goër** : Research engineer at the "Epidémiologie des maladies animales
et zoonotiques" unit (EPIA), INRAE Clermont-Auvergne-Rhône-Alpes

## Licence

Open licence to be defined. For the moment, this project is intended for academic use.
