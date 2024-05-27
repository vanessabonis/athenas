package com.athenas.crud_athenas.service.mapper;

import com.athenas.crud_athenas.dto.PessoaDTO;
import com.athenas.crud_athenas.model.Pessoa;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PessoaMapper extends EntityMapper<Pessoa, PessoaDTO> {
}
