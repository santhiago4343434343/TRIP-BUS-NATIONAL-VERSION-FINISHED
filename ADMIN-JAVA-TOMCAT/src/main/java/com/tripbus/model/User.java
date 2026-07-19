package com.tripbus.model;

public class User {

    private final int    id;
    private final String name;
    private final String email;
    private final String cpf;
    private final String createdAt;

    public User(int id, String name, String email, String cpf, String createdAt) {
        this.id        = id;
        this.name      = name;
        this.email     = email;
        this.cpf       = cpf;
        this.createdAt = createdAt;
    }

    public int    getId()        { return id; }
    public String getName()      { return name; }
    public String getEmail()     { return email; }
    public String getCpf()       { return cpf; }
    public String getCreatedAt() { return createdAt; }
}
