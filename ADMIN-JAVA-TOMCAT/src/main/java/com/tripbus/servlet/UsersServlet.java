package com.tripbus.servlet;

import com.tripbus.db.DBConnection;
import com.tripbus.model.User;
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
import java.util.List;

@WebServlet("/usuarios")
public class UsersServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        List<User> lista = new ArrayList<>();

        String sql = "SELECT id, name, email, cpf, created_at " +
                     "FROM users ORDER BY id DESC LIMIT 500";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                lista.add(new User(
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getString("email"),
                    rs.getString("cpf"),
                    rs.getString("created_at")
                ));
            }

        } catch (Exception e) {
            req.setAttribute("dbErro", e.getMessage());
        }

        req.setAttribute("usuarios", lista);
        req.getRequestDispatcher("/jsp/users.jsp").forward(req, resp);
    }
}
