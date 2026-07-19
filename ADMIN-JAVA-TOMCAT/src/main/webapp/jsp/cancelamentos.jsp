<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.*" %>
<% request.setAttribute("pg", "cancelamentos"); %>
<%@ include file="header.jsp" %>

<div class="d-flex justify-content-between align-items-center mb-3">
    <div>
        <h5 class="fw-bold mb-0" style="color:#111827">Cancelamentos</h5>
        <small class="text-muted">Histórico de cancelamentos de reservas</small>
    </div>
</div>

<% if (request.getAttribute("dbErro") != null) { %>
    <div class="alert alert-danger">
        <strong>Erro de banco:</strong> <%= request.getAttribute("dbErro") %>
    </div>
<% } %>

<%
    List<Map<String, Object>> lista =
        (List<Map<String, Object>>) request.getAttribute("cancelamentos");

    if (lista == null || lista.isEmpty()) {
%>
    <div class="card p-5 text-center">
        <i class="bi bi-inbox d-block mb-3 text-muted" style="font-size:3rem;opacity:.3"></i>
        <h6 class="fw-semibold text-muted mb-1">Nenhum cancelamento registrado</h6>
        <p class="text-muted mb-0" style="font-size:.875rem">
            Quando um cliente cancelar uma passagem, ela aparece aqui.
        </p>
    </div>
<% } else { %>
    <div class="card p-0">
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Código</th>
                        <th>Passageiro</th>
                        <th>E-mail</th>
                        <th>Empresa</th>
                        <th>Trajeto</th>
                        <th>Valor</th>
                        <th>Cancelada em</th>
                        <th>Motivo</th>
                    </tr>
                </thead>
                <tbody>
                    <% for (Map<String, Object> c : lista) { %>
                        <tr>
                            <td class="fw-semibold"><%= c.get("codigo") %></td>
                            <td><%= c.get("passageiro") %></td>
                            <td class="text-muted"><%= c.get("email") %></td>
                            <td><%= c.get("empresa") %></td>
                            <td><%= c.get("origem") %> &rarr; <%= c.get("destino") %></td>
                            <td>R$ <%= c.get("valor") %></td>
                            <td class="text-muted"><%= c.get("canceladaEm") %></td>
                            <td class="text-muted"><%= c.get("motivo") %></td>
                        </tr>
                    <% } %>
                </tbody>
            </table>
        </div>
    </div>
<% } %>

<%@ include file="footer.jsp" %>
