package com.athenas.crud_athenas.controller;

import com.athenas.crud_athenas.dto.PessoaDTO;
import com.athenas.crud_athenas.dto.filtro.PessoaFiltroDTO;
import com.athenas.crud_athenas.service.PessoaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/pessoas")
@Slf4j
@Validated
public class PessoaController {

    private final PessoaService service;
    private static final String ERRO_DE_VALIDACAO = "Erro de Validação";

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Page<PessoaDTO>> listarTodos(
            @RequestParam(required = false) String cpf,
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) LocalDate dataNascimento,
            @RequestParam(required = false) String sexo,
            @RequestParam(required = false) String altura,
            @RequestParam(required = false) String peso,
            Pageable pageable) {

        PessoaFiltroDTO filtro = new PessoaFiltroDTO();
        filtro.setCpf(cpf);
        filtro.setNome(nome);
        filtro.setAltura(altura);
        filtro.setPeso(peso);
        filtro.setSexo(sexo);
        filtro.setDataNascimento(dataNascimento);

        return ResponseEntity.ok(service.listarFiltrado(filtro, pageable));
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PessoaDTO> getPessoaById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PessoaDTO> savePessoa(@RequestBody @Valid PessoaDTO pessoaDTO) {
        return new ResponseEntity<>(service.save(pessoaDTO), HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PessoaDTO> updatePessoa(@PathVariable Long id, @RequestBody @Valid PessoaDTO pessoaDTO) {
        return ResponseEntity.ok(service.update(id, pessoaDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePessoa(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/peso-ideal", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Double> calcularPesoIdealPorCpf(@RequestParam String cpf) {
        return ResponseEntity.ok(service.calcularPesoIdeal(cpf));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("messageTitle", ERRO_DE_VALIDACAO);

        Map<String, String> errors = new LinkedHashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        response.putAll(errors);
        log.error(ERRO_DE_VALIDACAO + " " + errors.toString());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
