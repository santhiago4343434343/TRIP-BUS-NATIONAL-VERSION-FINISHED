<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.tripbus.model.User, java.util.List" %>
<% request.setAttribute("pg", "usuarios"); %>
<%@ include file="header.jsp" %>

<% if (request.getAttribute("dbErro") != null) { %>
<div class="alert-db d-flex align-items-start gap-2 mb-4">
    <i class="bi bi-exclamation-triangle-fill mt-1"></i>
    <div>
        <strong>Erro ao consultar:</strong> <%= request.getAttribute("dbErro") %><br>
        <small>Verifique os nomes de tabela/coluna em <code>UsersServlet.java</code>.</small>
    </div>
</div>
<% } %>

<div class="d-flex justify-content-between align-items-center mb-3">
    <div>
        <h5 class="fw-bold mb-0" style="color:#111827">Usuários</h5>
        <small class="text-muted">Cadastros do sistema</small>
    </div>
</div>

<div class="card">
    <div class="card-body p-0">
        <table class="table table-hover mb-0">
            <thead>
                <tr>
                    <th class="ps-4" style="width:60px">#</th>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>CPF</th>
                    <th class="pe-4">Criado em</th>
                </tr>
            </thead>
            <tbody>
            <%
                List<User> usuarios = (List<User>) request.getAttribute("usuarios");
                if (usuarios != null && !usuarios.isEmpty()) {
                    for (User u : usuarios) {
            %>
                <tr>
                    <td class="ps-4 text-muted" style="font-size:.8rem">#<%= u.getId() %></td>
                    <td class="fw-medium"><%= u.getName()     != null ? u.getName()     : "—" %></td>
                    <td class="text-muted"><%= u.getEmail()   != null ? u.getEmail()    : "—" %></td>
                    <td><%= u.getCpf()       != null ? u.getCpf()       : "—" %></td>
                    <td class="pe-4 text-muted" style="font-size:.82rem">
                        <%= u.getCreatedAt() != null ? u.getCreatedAt() : "—" %>
                    </td>
                </tr>
            <%
                    }
                } else if (request.getAttribute("dbErro") == null) {
            %>
                <tr>
                    <td colspan="5" class="text-center py-5 text-muted">
                        <i class="bi bi-people d-block mb-2" style="font-size:2.5rem;opacity:.2"></i>
                        Nenhum usuário encontrado
                    </td>
                </tr>
            <% } %>
            </tbody>
        </table>
    </div>
</div>

<%@ include file="footer.jsp" %>
