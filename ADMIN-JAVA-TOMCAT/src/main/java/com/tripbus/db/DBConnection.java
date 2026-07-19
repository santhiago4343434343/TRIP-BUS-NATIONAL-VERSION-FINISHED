package com.tripbus.db;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;
import java.sql.Connection;

public class DBConnection {

    public static Connection getConnection() throws Exception {
        Context initCtx = new InitialContext();
        Context envCtx  = (Context) initCtx.lookup("java:comp/env");
        DataSource ds   = (DataSource) envCtx.lookup("jdbc/TripBusDB");
        return ds.getConnection();
    }
}
