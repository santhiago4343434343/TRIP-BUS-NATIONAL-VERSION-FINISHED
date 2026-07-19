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
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/cancelamentos")
public class CancelServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        List<Map<String, Object>> cancelamentos = new ArrayList<>();

        String sql =
            "SELECT r.codigo, r.passageiro, r.valor, r.cancelada_em, r.motivo_cancelamento, " +
            "       u.email, t.bus_company, t.origin, t.destination " +
            "FROM reservas r " +
            "JOIN users u ON u.id = r.user_id " +
            "JOIN trips t ON t.id = r.trip_id " +
            "WHERE r.status = 'cancelada' " +
            "ORDER BY r.cancelada_em DESC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("codigo",      rs.getString("codigo"));
                row.put("passageiro",  rs.getString("passageiro"));
                row.put("email",       rs.getString("email"));
                row.put("empresa",     rs.getString("bus_company"));
                row.put("origem",      rs.getString("origin"));
                row.put("destino",     rs.getString("destination"));
                row.put("valor",       rs.getBigDecimal("valor"));
                row.put("canceladaEm", rs.getString("cancelada_em"));
                row.put("motivo",      rs.getString("motivo_cancelamento"));
                cancelamentos.add(row);
            }

        } catch (Exception e) {
            req.setAttribute("dbErro", e.getMessage());
        }

        req.setAttribute("semTabela", false);
        req.setAttribute("cancelamentos", cancelamentos);
        req.getRequestDispatcher("/jsp/cancelamentos.jsp").forward(req, resp);
    }
}
