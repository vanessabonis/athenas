export class Pessoa {
    
    constructor(
        public id: number,
        public nome: string,
        public dataNascimento: Date,
        public cpf: string,
        public sexo: string,
        public altura?: number, // Tornando altura opcional
        public peso?: number // Tornando peso opcional
    ) {}
}
  