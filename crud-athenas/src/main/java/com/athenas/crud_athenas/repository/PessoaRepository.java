package com.athenas.crud_athenas.repository;

import com.athenas.crud_athenas.dto.PessoaDTO;
import com.athenas.crud_athenas.dto.filtro.PessoaFiltroDTO;
import com.athenas.crud_athenas.model.Pessoa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PessoaRepository extends JpaRepository<Pessoa, Long> {

    Optional<Pessoa> findByCpf(String cpf);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN TRUE ELSE FALSE END FROM Pessoa p " +
            "WHERE (?1 = 0 OR p.id <> ?1) AND p.cpf = ?2")
    Boolean existsByCpf(Long id, String cpf);

    @Query("SELECT NEW com.athenas.crud_athenas.dto.PessoaDTO(p.id, p.nome, p.dataNascimento, p.cpf, p.sexo, p.altura, p.peso) " +
            "FROM Pessoa p " +
            "WHERE (:#{#filtro.cpf} IS NULL OR p.cpf LIKE %:#{#filtro.cpf}%) " +
            "AND (:#{#filtro.nome} IS NULL OR p.nome LIKE %:#{#filtro.nome}%) " +
            "AND (:#{#filtro.dataNascimento} IS NULL OR p.dataNascimento = :#{#filtro.dataNascimento}) " +
            "AND (:#{#filtro.sexo} IS NULL OR p.sexo = :#{#filtro.sexo}) " +
            "AND (:#{#filtro.altura} IS NULL OR p.altura = :#{#filtro.altura}) " +
            "AND (:#{#filtro.peso} IS NULL OR p.peso = :#{#filtro.peso})")
    Page<PessoaDTO> findAllFiltrado(@Param("filtro") PessoaFiltroDTO filtro, Pageable pageable);
}

