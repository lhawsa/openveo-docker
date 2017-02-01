// OPENVEO_OPERATOR_PASSWD
// OPENVEO_USER_PASSWD

db.createUser(
    {
        user: "openveoOPERATOR",
        pwd: DB_OPENVEO_OPERATOR_PASSWD,
        roles: [ "readWrite" ]
    }
);

db.createUser(
    {
        user: "openveoUSER",
        pwd: DB_OPENVEO_USER_PASSWD,
        roles: [ "dbOwner" ]
    }
);
