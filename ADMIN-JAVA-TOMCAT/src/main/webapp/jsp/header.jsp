<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String pg = (String) request.getAttribute("pg");
    if (pg == null) pg = "";
    String ctx = request.getContextPath();
%>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trip Bus &mdash; Admin</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
    <style>
        :root {
            --sb-bg:     #0d1b2a;
            --sb-hover:  #1b3a5c;
            --sb-active: #1e4976;
            --accent:    #00b4d8;
        }

        body { background: #f0f2f5; }

        /* ── SIDEBAR ─────────────────────────────────────────── */
        .sidebar {
            width: 240px;
            min-height: 100vh;
            background: var(--sb-bg);
            position: fixed;
            top: 0; left: 0;
            display: flex;
            flex-direction: column;
            z-index: 200;
        }
        .sidebar-brand {
            padding: 1.4rem 1.25rem 1rem;
            border-bottom: 1px solid rgba(255,255,255,.08);
        }
        .sidebar-brand .brand-name {
            color: var(--accent);
            font-weight: 700;
            font-size: 1.05rem;
            letter-spacing: .4px;
            margin: 0;
        }
        .sidebar-brand .brand-sub {
            color: rgba(255,255,255,.35);
            font-size: .72rem;
        }
        .sidebar-nav {
            padding: .75rem 0;
            flex: 1;
        }
        .sidebar-nav .nav-link {
            color: rgba(255,255,255,.6);
            padding: .65rem 1.25rem;
            display: flex;
            align-items: center;
            gap: .7rem;
            font-size: .875rem;
            border-left: 3px solid transparent;
            transition: all .18s;
            text-decoration: none;
        }
        .sidebar-nav .nav-link i { font-size: 1rem; }
        .sidebar-nav .nav-link:hover {
            color: #fff;
            background: var(--sb-hover);
        }
        .sidebar-nav .nav-link.active {
            color: #fff;
            background: var(--sb-active);
            border-left-color: var(--accent);
        }
        .sidebar-footer {
            padding: .9rem 1.25rem;
            border-top: 1px solid rgba(255,255,255,.07);
            color: rgba(255,255,255,.25);
            font-size: .68rem;
        }

        /* ── MAIN AREA ───────────────────────────────────────── */
        .main-wrap {
            margin-left: 240px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .topbar {
            background: #fff;
            border-bottom: 1px solid #e5e7eb;
            padding: .75rem 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .topbar-title {
            font-weight: 600;
            font-size: .9rem;
            color: #374151;
        }
        .main-content { padding: 2rem; flex: 1; }

        /* ── CARDS ───────────────────────────────────────────── */
        .card {
            border: none;
            border-radius: 12px;
            box-shadow: 0 1px 10px rgba(0,0,0,.06);
        }
        .stat-card { border-left: 4px solid; }
        .stat-card.c-blue   { border-left-color: #3b82f6; }
        .stat-card.c-green  { border-left-color: #22c55e; }
        .stat-card.c-amber  { border-left-color: #f59e0b; }
        .stat-card.c-red    { border-left-color: #ef4444; }
        .stat-icon {
            width: 48px; height: 48px;
            border-radius: 10px;
            display: flex; align-items: center; justify-content: center;
            font-size: 1.3rem;
        }

        /* ── TABLES ──────────────────────────────────────────── */
        .table thead th {
            font-size: .73rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: .6px;
            color: #9ca3af;
            border-bottom: 1px solid #f3f4f6;
            background: #fafafa;
            padding-top: .9rem;
            padding-bottom: .9rem;
        }
        .table tbody td { vertical-align: middle; font-size: .88rem; }
        .table-hover tbody tr:hover { background: #f8faff; }

        /* ── ALERT DB ────────────────────────────────────────── */
        .alert-db {
            background: #fef3c7;
            border: 1px solid #fde68a;
            border-radius: 8px;
            padding: .9rem 1.15rem;
            font-size: .85rem;
            color: #78350f;
        }
    </style>
</head>
<body>

<!-- ═══ SIDEBAR ══════════════════════════════════════════════ -->
<aside class="sidebar">
    <div class="sidebar-brand">
        <p class="brand-name"><i class="bi bi-bus-front me-2"></i>Trip Bus</p>
        <span class="brand-sub">Painel Administrativo</span>
    </div>

    <nav class="sidebar-nav">
        <a href="<%= ctx %>/dashboard"
           class="nav-link <%= "dashboard".equals(pg) ? "active" : "" %>">
            <i class="bi bi-speedometer2"></i>Dashboard
        </a>
        <a href="<%= ctx %>/usuarios"
           class="nav-link <%= "usuarios".equals(pg) ? "active" : "" %>">
            <i class="bi bi-people"></i>Usuários
        </a>
        <a href="<%= ctx %>/cancelamentos"
           class="nav-link <%= "cancelamentos".equals(pg) ? "active" : "" %>">
            <i class="bi bi-x-circle"></i>Cancelamentos
        </a>
    </nav>

    <div class="sidebar-footer">
        Trip Bus National &nbsp;·&nbsp; v1.0
    </div>
</aside>

<!-- ═══ MAIN WRAP ═════════════════════════════════════════════ -->
<div class="main-wrap">

    <!-- Topbar -->
    <header class="topbar">
        <span class="topbar-title">
            <% if ("dashboard".equals(pg))     { %><i class="bi bi-speedometer2 me-2 text-primary"></i>Dashboard
            <% } else if ("usuarios".equals(pg)) { %><i class="bi bi-people me-2 text-primary"></i>Usuários
            <% } else { %><i class="bi bi-x-circle me-2 text-primary"></i>Cancelamentos<% } %>
        </span>
        <span class="badge bg-success-subtle text-success border border-success-subtle">
            <i class="bi bi-circle-fill me-1" style="font-size:.45rem;vertical-align:middle"></i>
            Online
        </span>
    </header>

    <main class="main-content">
