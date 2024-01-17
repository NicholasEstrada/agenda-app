import { Component, OnInit } from '@angular/core';
import { Contato } from './contato';
import { ContatoService } from '../contato.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ContatoDetalheComponent } from '../contato-detalhe/contato-detalhe.component';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css'],
})
export class ContatoComponent implements OnInit {

  formulario: FormGroup;
  contatos: Contato[] = [];
  colunas = ['foto','id','nome','email','favorito']

  constructor(
    private service: ContatoService,
    private fb: FormBuilder,
    private dialog: MatDialog
    ) {}

  ngOnInit(): void {
    this.montarFormulario();
    this.listarContatos();
  }

  montarFormulario(){
    this.formulario = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
    });
  }

  listarContatos(){
    this.service.list().subscribe(response => {
      this.contatos = response
    })
  }

  favoritar(contato: Contato){
    this.service.favourite(contato).subscribe(response => {
      contato.favorito = !contato.favorito;
    })

  }

  submit() {
    const formValues = this.formulario.value
    let contato : Contato = new Contato(formValues.nome, formValues.email)
    this.service.save(contato).subscribe((resposta) => {
      let lista: Contato[] = [ ... this.contatos, resposta]
      this.contatos = lista
    });
  }

  uploadFoto(event, contato){
    const files = event.target.files;
    if(files){
      const foto = files[0];
      const formData: FormData = new FormData();
      formData.append("foto", foto);
      this.service
        .upload(contato, formData)
        .subscribe(response => this.listarContatos() );
    }
  }

  visualizarContato(contato: Contato){
    this.dialog.open( ContatoDetalheComponent, {
      height: '450px',
      width: '400px',
      data: contato
    })
  }
}
