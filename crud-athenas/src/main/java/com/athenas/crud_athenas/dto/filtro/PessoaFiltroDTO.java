package com.athenas.crud_athenas.dto.filtro;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PessoaFiltroDTO {
    private String cpf;
    private String nome;
    private LocalDate dataNascimento;
    private String sexo;
    private String altura;
    private String peso;
}
