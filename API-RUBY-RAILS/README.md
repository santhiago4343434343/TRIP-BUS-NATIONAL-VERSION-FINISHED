# 🚌 TRIP-BUS-NATIONAL

[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.java.com/)
[![Ruby on Rails](https://img.shields.io/badge/rails-%23CC0000.svg?style=for-the-badge&logo=ruby-on-rails&logoColor=white)](https://rubyonrails.org/)

Sistema nacional de gestão de transporte rodoviário (Trip-Bus). O projeto utiliza uma arquitetura de micro-serviços dockerizados para garantir escalabilidade e isolamento de ambiente.

## 🏗️ Arquitetura do Sistema

O projeto é dividido em quatro camadas principais que operam de forma integrada:

1.  **Frontend (Angular 20):** Interface do usuário moderna e responsiva, utilizando Tailwind CSS para estilização.
2.  **Admin Backend (Java/Tomcat):** Módulo administrativo robusto utilizando JDBC para persistência de dados.
3.  **API Core (Ruby on Rails):** API de alto desempenho para regras de negócio e integrações.
4.  **Database (MariaDB):** Banco de dados relacional centralizado para todos os serviços.



## 🚀 Tecnologias Utilizadas

- **Frontend:** Angular, Tailwind CSS, TypeScript.
- **Backend Admin:** Java, Apache Tomcat, JDBC.
- **Backend API:** Ruby on Rails, PostgreSQL/MariaDB Adapter.
- **Infraestrutura:** Docker, Docker Compose, WSL2 (Ubuntu 24.04).
- **Banco de Dados:** MariaDB 10.11 & PHPMyAdmin.

## 🛠️ Como Executar o Projeto

### Pré-requisitos
* Docker Desktop instalado e configurado (preferencialmente com WSL2).
* Docker Compose.

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/santhiago43434343/TRIP-BUS-NATIONAL.git](https://github.com/santhiago43434343/TRIP-BUS-NATIONAL.git)
   cd TRIP-BUS-NATIONAL