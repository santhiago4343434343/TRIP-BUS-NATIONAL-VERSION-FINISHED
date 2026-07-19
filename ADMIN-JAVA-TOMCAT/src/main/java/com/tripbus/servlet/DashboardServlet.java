package com.tripbus.servlet;

import com.tripbus.db.DBConnection;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@WebServlet("/dashboard")
public class DashboardServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        try (Connection conn = DBConnection.getConnection()) {

            req.setAttribute("totalUsuarios", count(conn, "SELECT COUNT(*) FROM users"));
            req.setAttribute("totalViagens",  count(conn, "SELECT COUNT(*) FROM trips"));
            req.setAttribute("viagensHoje",   count(conn,
                "SELECT COUNT(*) FROM trips WHERE DATE(departure_time) = CURDATE()"));

            req.setAttribute("totalCancelamentos",
                count(conn, "SELECT COUNT(*) FROM reservas WHERE status = 'cancelada'"));

        } catch (Exception e) {
            req.setAttribute("dbErro", e.getMessage());
        }

        req.getRequestDispatcher("/jsp/dashboard.jsp").forward(req, resp);
    }

    private long count(Connection conn, String sql) throws Exception {
        try (PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getLong(1) : 0L;
        }
    }
}
