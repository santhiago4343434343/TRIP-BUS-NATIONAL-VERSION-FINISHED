<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<% request.setAttribute("pg", "dashboard"); %>
<%@ include file="header.jsp" %>

<!-- ── Alerta de erro de banco ──────────────────────────────── -->
<% if (request.getAttribute("dbErro") != null) { %>
<div class="alert-db d-flex align-items-start gap-2 mb-4">
    <i class="bi bi-exclamation-triangle-fill mt-1"></i>
    <div>
        <strong>Erro de banco de dados:</strong><br>
        <%= request.getAttribute("dbErro") %><br>
        <small>Verifique os nomes das tabelas em <code>DashboardServlet.java</code>.</small>
    </div>
</div>
<% } %>

<!-- ── Cabeçalho da página ─────────────────────────────────── -->
<div class="mb-4">
    <h5 class="fw-bold mb-0" style="color:#111827">Visão Geral</h5>
    <small class="text-muted">Resumo do sistema Trip Bus National</small>
</div>

<!-- ── Cards de métricas ──────────────────────────────────── -->
<div class="row g-3 mb-4">

    <div class="col-xl-3 col-md-6">
        <div class="card stat-card c-blue p-3 h-100">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <div class="text-muted mb-1" style="font-size:.78rem;text-transform:uppercase;letter-spacing:.5px">Usuários</div>
                    <div class="fw-bold" style="font-size:2rem;line-height:1">
                        <%= request.getAttribute("totalUsuarios") != null
                              ? request.getAttribute("totalUsuarios") : "—" %>
                    </div>
                    <small class="text-muted">cadastrados</small>
                </div>
                <div class="stat-icon bg-primary bg-opacity-10 text-primary">
                    <i class="bi bi-people-fill"></i>
                </div>
            </div>
        </div>
    </div>

    <div class="col-xl-3 col-md-6">
        <div class="card stat-card c-green p-3 h-100">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <div class="text-muted mb-1" style="font-size:.78rem;text-transform:uppercase;letter-spacing:.5px">Viagens</div>
                    <div class="fw-bold" style="font-size:2rem;line-height:1">
                        <%= request.getAttribute("totalViagens") != null
                              ? request.getAttribute("totalViagens") : "—" %>
                    </div>
                    <small class="text-muted">no total</small>
                </div>
                <div class="stat-icon bg-success bg-opacity-10 text-success">
                    <i class="bi bi-bus-front-fill"></i>
                </div>
            </div>
        </div>
    </div>

    <div class="col-xl-3 col-md-6">
        <div class="card stat-card c-amber p-3 h-100">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <div class="text-muted mb-1" style="font-size:.78rem;text-transform:uppercase;letter-spacing:.5px">Hoje</div>
                    <div class="fw-bold" style="font-size:2rem;line-height:1">
                        <%= request.getAttribute("viagensHoje") != null
                              ? request.getAttribute("viagensHoje") : "—" %>
                    </div>
                    <small class="text-muted">viagens agendadas</small>
                </div>
                <div class="stat-icon bg-warning bg-opacity-10 text-warning">
                    <i class="bi bi-calendar-day-fill"></i>
                </div>
            </div>
        </div>
    </div>

    <div class="col-xl-3 col-md-6">
        <div class="card stat-card c-red p-3 h-100">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <div class="text-muted mb-1" style="font-size:.78rem;text-transform:uppercase;letter-spacing:.5px">Cancelamentos</div>
                    <div class="fw-bold" style="font-size:2rem;line-height:1">
                        <%= request.getAttribute("totalCancelamentos") != null
                              ? request.getAttribute("totalCancelamentos") : "—" %>
                    </div>
                    <small class="text-muted">registrados</small>
                </div>
                <div class="stat-icon bg-danger bg-opacity-10 text-danger">
                    <i class="bi bi-x-circle-fill"></i>
                </div>
            </div>
        </div>
    </div>

</div>

<!-- ── Linha inferior ─────────────────────────────────────── -->
<div class="row g-3">

    <div class="col-md-5">
        <div class="card p-3 h-100">
            <h6 class="fw-semibold mb-3">Acesso Rápido</h6>
            <div class="d-flex flex-column gap-2">
                <a href="<%= request.getContextPath() %>/usuarios"
                   class="btn btn-outline-primary btn-sm text-start">
                    <i class="bi bi-people me-2"></i>Ver todos os usuários
                </a>
                <a href="<%= request.getContextPath() %>/cancelamentos"
                   class="btn btn-outline-danger btn-sm text-start">
                    <i class="bi bi-x-circle me-2"></i>Ver cancelamentos
                </a>
            </div>
        </div>
    </div>

    <div class="col-md-7">
        <div class="card p-3 h-100">
            <h6 class="fw-semibold mb-3">Informações do Servidor</h6>
            <table class="table table-sm table-borderless mb-0">
                <tr>
                    <td class="text-muted pe-4" style="font-size:.82rem;width:140px">Servidor</td>
                    <td style="font-size:.85rem" class="fw-medium">Apache Tomcat 10</td>
                </tr>
                <tr>
                    <td class="text-muted" style="font-size:.82rem">Banco de Dados</td>
                    <td style="font-size:.85rem" class="fw-medium">MariaDB &bull; trip_bus_db</td>
                </tr>
                <tr>
                    <td class="text-muted" style="font-size:.82rem">Usuário DB</td>
                    <td style="font-size:.85rem" class="fw-medium">tripuser</td>
                </tr>
                <tr>
                    <td class="text-muted" style="font-size:.82rem">Horário</td>
                    <td style="font-size:.85rem"><%= new java.util.Date() %></td>
                </tr>
            </table>
        </div>
    </div>

</div>

<%@ include file="footer.jsp" %>
