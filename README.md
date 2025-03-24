###
To create react project use : 

npx create-react-app <name_of_project>

npm i web-vitals --save-dev
###


To run Application web :

0) You have to connect the db : 
  -Create an admin acount
  -To enter in mariadb : `mysql -u admin -p`
  -To link at db use : `CREATE DATABASE maiid_app;`
  -Then exit mysql to load our db : `mysql -u admin -p maiid_app < save_maiid_app.sql`
  -Then if you want to do some request return in mysql : `USE maiid_app;` and do your sql request. 

  If you do some modification on the content of the db you can save this by this command : 
  - `mysqldump -u admin -p maiid_app > save_maiid_app.sql`


1) You have to run main.py:

`uvicorn main:app --reload`

2) Then you have to run web page (server) in the folder of frontend: 

npm start


