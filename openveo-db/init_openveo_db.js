// OPENVEO_OPERATOR_PASSWD
// OPENVEO_USER_PASSWD

db.createUser(
    {
        user: "openveoOPERATOR",
        pwd: OPENVEO_OPERATOR_PASSWD,
        roles: [ "readWrite" ]
    }
);

db.createUser(
    {
        user: "openveoUSER",
        pwd: OPENVEO_USER_PASSWD,
        roles: [ "dbOwner" ]
    }
);
