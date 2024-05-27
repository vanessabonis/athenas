package com.athenas.crud_athenas.service;

import com.athenas.crud_athenas.dto.PessoaDTO;
import com.athenas.crud_athenas.dto.filtro.PessoaFiltroDTO;
import com.athenas.crud_athenas.exceptions.HttpStatusException;
import com.athenas.crud_athenas.model.Pessoa;
import com.athenas.crud_athenas.repository.PessoaRepository;
import com.athenas.crud_athenas.service.mapper.PessoaMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PessoaService {

    private final PessoaRepository repository;
    private final PessoaMapper mapper;

    public static final String PESSOA_JA_EXISTE = "Já existe pessoa cadastrada com o CPF ";
    public static final String PESSOA_NAO_ENCONTRADA = "Pessoa não encontrada";


    public PessoaDTO getById(Long id) {
        Optional<Pessoa> pessoaOptional = repository.findById(id);

        Pessoa pessoa = pessoaOptional.orElseThrow(() ->
                new HttpStatusException(PESSOA_NAO_ENCONTRADA, HttpStatus.NOT_FOUND));
        return mapper.toDto(pessoa);
    }

    public Page<PessoaDTO> listarFiltrado(PessoaFiltroDTO filtro, Pageable pageable) {
        return repository.findAllFiltrado(filtro, pageable);
    }

    public PessoaDTO getByCPF(String cpf) {
        return repository.findByCpf(cpf)
                .map(mapper::toDto)
                .orElseThrow(() -> new HttpStatusException(PESSOA_NAO_ENCONTRADA, HttpStatus.NOT_FOUND));
    }

    public Pessoa persist(Pessoa pessoa) {
        return repository.save(pessoa);
    }

    public PessoaDTO save(@Valid PessoaDTO pessoaDTO) {
        validarPessoaExistente(pessoaDTO.getId(), pessoaDTO.getCpf());

        Pessoa pessoa = mapper.toEntity(pessoaDTO);
        return mapper.toDto(persist(pessoa));
    }

    public PessoaDTO update(Long id, @Valid PessoaDTO pessoaDTO) {
        validarPessoaExistente(id, pessoaDTO.getCpf());
        Pessoa pessoa = mapper.toEntity(pessoaDTO);
        pessoa.setId(id);
        persist(pessoa);
        return mapper.toDto(pessoa);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public void validarPessoaExistente(Long id, String cpf) {
        if (repository.existsByCpf(id, cpf))
            throw new HttpStatusException(PESSOA_JA_EXISTE, HttpStatus.BAD_REQUEST);
    }

    public Double calcularPesoIdeal(String cpf) {
        PessoaDTO pessoaDTO = getByCPF(cpf);
        validarDadosPessoa(pessoaDTO);
        Double altura = pessoaDTO.getAltura();
        String sexo = pessoaDTO.getSexo();

        return calcularPesoIdealBusiness(altura, sexo);
    }

    private void validarDadosPessoa(PessoaDTO pessoaDTO) {
        if (pessoaDTO == null || pessoaDTO.getAltura() == null || pessoaDTO.getSexo() == null) {
            throw new HttpStatusException("Pessoa inválida: altura e sexo são obrigatórios.", HttpStatus.BAD_REQUEST);
        }
        if (pessoaDTO.getAltura() <= 0) {
            throw new HttpStatusException("Altura inválida: deve ser um valor positivo.", HttpStatus.BAD_REQUEST);
        }
    }

    private double calcularPesoIdealBusiness(double altura, String sexo) {
        if (sexo.equals("M")) {
            return (72.7 * altura) - 58;
        } else if (sexo.equals("F")) {
            return (62.1 * altura) - 44.7;
        } else {
            throw new HttpStatusException("Sexo inválido: " + sexo, HttpStatus.BAD_REQUEST);
        }
    }
}
