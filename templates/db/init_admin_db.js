// ADMIN_SUPER_PASSWD

db.createUser(
    {
        user: "adminOPERATOR",
        pwd: DB_ADMIN_OPERATOR_PASSWD,
        roles: [ "userAdminAnyDatabase", "dbAdminAnyDatabase", "clusterAdmin" ]
    }
);
